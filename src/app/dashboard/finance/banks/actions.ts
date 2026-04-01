"use server";

import { db } from "@/lib/db";
import { bankAccounts, authLogs } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

const BankSchema = z.object({
    bankName: z.string().min(3),
    accountNumber: z.string().min(5),
    currentBalance: z.coerce.number().int().nonnegative(),
});

export async function createBankAction(prevState: any, formData: FormData) {
    const headerList = await headers();
    const ip = headerList.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";

    const validated = BankSchema.safeParse({
        bankName: formData.get("bankName"),
        accountNumber: formData.get("accountNo"), // Mapping to 'accountNo' in form
        currentBalance: formData.get("balance"), // Mapping to 'balance' in form
    });

    if (!validated.success) return { success: false, errors: validated.error.flatten().fieldErrors };

    try {
        await db.transaction(async (tx) => {
            const [newBank] = await tx.insert(bankAccounts).values({
                bankName: validated.data.bankName,
                accountNumber: validated.data.accountNumber,
                currentBalance: validated.data.currentBalance,
            }).returning({ id: bankAccounts.id });

            await tx.insert(authLogs).values({
                event: "BANK_ACCOUNT_CREATED",
                ipAddress: ip,
                metadata: { id: newBank.id, bank: validated.data.bankName },
            });
        });

        revalidatePath("/dashboard/finance");
        return { success: true, message: "Bank channel opened successfully." };
    } catch (e) {
        console.error("BANK_ERROR:", e);
        return { success: false, message: "System Reject: Database Fail." };
    }
}
