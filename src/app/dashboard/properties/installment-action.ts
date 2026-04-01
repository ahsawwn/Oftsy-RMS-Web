"use server";

import { db } from "@/lib/db";
import { payments, authLogs } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { headers } from "next/headers";

const InstallmentSchema = z.object({
    planId: z.string().uuid(),
    amountPaid: z.coerce.number().int().positive(),
    receiptNumber: z.string().min(3),
    paymentMethod: z.enum(["Cash", "Bank Transfer", "Cheque", "Online"]),
});

export async function addInstallmentAction(prevState: any, formData: FormData) {
    const headerList = await headers();
    const ip = headerList.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";

    const validated = InstallmentSchema.safeParse({
        planId: formData.get("planId"),
        amountPaid: formData.get("amountPaid"),
        receiptNumber: formData.get("receiptNumber"),
        paymentMethod: formData.get("paymentMethod"),
    });

    if (!validated.success) {
        return { success: false, errors: validated.error.flatten().fieldErrors };
    }

    try {
        await db.transaction(async (tx) => {
            // 1. Record Payment
            await tx.insert(payments).values({
                planId: validated.data.planId,
                amountPaid: validated.data.amountPaid,
                receiptNumber: validated.data.receiptNumber,
                paymentMethod: validated.data.paymentMethod,
            });

            // 2. Audit
            await tx.insert(authLogs).values({
                event: "INSTALLMENT_COLLECTED",
                ipAddress: ip,
                metadata: {
                    planId: validated.data.planId,
                    amount: validated.data.amountPaid,
                    receipt: validated.data.receiptNumber,
                },
            });
        });

        revalidatePath("/dashboard");
        revalidatePath("/dashboard/payments");
        return { success: true, message: "Installment recorded successfully." };
    } catch (error: any) {
        if (error?.code === "23505") {
            return { success: false, message: "Duplicate Receipt Number Error: System Reject." };
        }
        return { success: false, message: "Database Error: Recovery Sync Failed." };
    }
}
