"use server";

import { db } from "@/lib/db";
import { officeExpenses, authLogs, bankAccounts } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";
import { eq, sql } from "drizzle-orm";

const ExpenseSchema = z.object({
    category: z.string().min(3),
    amount: z.coerce.number().int().positive(),
    bankAccountId: z.string().uuid(),
    description: z.string().optional(),
});

export async function createExpenseAction(prevState: any, formData: FormData) {
    const headerList = await headers();
    const ip = headerList.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";

    const validated = ExpenseSchema.safeParse({
        category: formData.get("category"),
        amount: formData.get("amount"),
        bankAccountId: formData.get("bankAccountId"),
        description: formData.get("description"),
    });

    if (!validated.success) return { success: false, errors: validated.error.flatten().fieldErrors };

    try {
        await db.transaction(async (tx) => {
            // 1. Check if bank has enough balance
            const [bank] = await tx.select().from(bankAccounts).where(eq(bankAccounts.id, validated.data.bankAccountId));
            if (!bank || bank.currentBalance < validated.data.amount) {
                throw new Error("INSUFFICIENT_FUNDS");
            }

            // 2. Insert expense
            await tx.insert(officeExpenses).values({
                category: validated.data.category,
                amount: validated.data.amount,
                bankAccountId: validated.data.bankAccountId,
                description: validated.data.description,
            });

            // 3. Deduct from bank
            await tx.update(bankAccounts)
                .set({ currentBalance: sql`${bankAccounts.currentBalance} - ${validated.data.amount}` })
                .where(eq(bankAccounts.id, validated.data.bankAccountId));

            // 4. Audit
            await tx.insert(authLogs).values({
                event: "EXPENSE_RECORDED",
                ipAddress: ip,
                metadata: { category: validated.data.category, amount: validated.data.amount },
            });
        });

        revalidatePath("/dashboard/finance");
        return { success: true, message: "Disbursement successful." };
    } catch (e: any) {
        if (e.message === "INSUFFICIENT_FUNDS") {
            return { success: false, message: "Transaction Rejected: Insufficient bank balance." };
        }
        console.error("EXPENSE_ERROR:", e);
        return { success: false, message: "System Error: Could not verify disbursement." };
    }
}
