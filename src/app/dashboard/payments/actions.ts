"use server";

import { db } from "@/lib/db";
import { payments, authLogs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

const PaymentSchema = z.object({
    planId: z.string().uuid(),
    amountPaid: z.coerce.number().int().positive(),
    paymentMethod: z.enum(["Cash", "Bank Transfer", "Cheque", "Online"]),
    receiptNumber: z.string().min(3),
});

export async function createPaymentAction(prevState: any, formData: FormData) {
    const headerList = await headers();
    const ip = headerList.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";

    const validatedFields = PaymentSchema.safeParse({
        planId: formData.get("planId"),
        amountPaid: formData.get("amountPaid"),
        paymentMethod: formData.get("paymentMethod"), // Matches schema key
        receiptNumber: formData.get("receiptNumber"), // Matches schema key
    });

    if (!validatedFields.success) {
        return { errors: validatedFields.error.flatten().fieldErrors, message: "Invalid Input" };
    }

    try {
        await db.transaction(async (tx) => {
            await tx.insert(payments).values({
                planId: validatedFields.data.planId,
                amountPaid: validatedFields.data.amountPaid,
                paymentMethod: validatedFields.data.paymentMethod,
                receiptNumber: validatedFields.data.receiptNumber,
            });

            await tx.insert(authLogs).values({
                event: "PAYMENT_RECORDED",
                ipAddress: ip,
                metadata: {
                    planId: validatedFields.data.planId,
                    amount: validatedFields.data.amountPaid,
                    receipt: validatedFields.data.receiptNumber,
                },
            });
        });

        revalidatePath("/dashboard");
        revalidatePath("/dashboard/payments");
        return { success: true, message: "Payment successful." };
    } catch (error: any) {
        console.error("PAYMENT_ERROR:", error);

        // Check for Postgres unique constraint violation (23505)
        if (error?.code === "23505" || error?.message?.includes("unique constraint")) {
            return {
                message: "Receipt number already exists in system.",
            };
        }

        return {
            message: "Database Error: Could not save payment.",
        };
    }
}