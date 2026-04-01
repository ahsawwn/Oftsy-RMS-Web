"use server";

import { db } from "@/lib/db";
import { installmentPlans, properties, transferHistory, authLogs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

const TransferSchema = z.object({
    propertyId: z.string().uuid(),
    oldLeadId: z.string().uuid(),
    newLeadId: z.string().uuid(),
    transferFee: z.coerce.number().int().nonnegative(),
});

export async function transferPropertyAction(
    propertyId: string,
    oldLeadId: string,
    newLeadId: string,
    transferFee: number
) {
    // Audit Metadata
    const headerList = await headers();
    const ip = headerList.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";

    // Validation
    const validation = TransferSchema.safeParse({
        propertyId,
        oldLeadId,
        newLeadId,
        transferFee,
    });

    if (!validation.success) {
        return { success: false, message: "Invalid transfer parameters." };
    }

    try {
        await db.transaction(async (tx) => {
            // 1. Update the Installment Plan to point to the new owner (Lead)
            await tx
                .update(installmentPlans)
                .set({ leadId: newLeadId })
                .where(eq(installmentPlans.propertyId, propertyId));

            // 2. Record the Legal Transfer in history
            await tx.insert(transferHistory).values({
                propertyId,
                oldLeadId,
                newLeadId,
                transferFee,
            });

            // 3. Log Audit Event
            await tx.insert(authLogs).values({
                event: "PROPERTY_P2P_TRANSFER",
                ipAddress: ip,
                metadata: {
                    propertyId,
                    from: oldLeadId,
                    to: newLeadId,
                    fee: transferFee,
                },
            });
        });

        revalidatePath("/dashboard/properties");
        revalidatePath(`/dashboard/properties/${propertyId}`);
        return { success: true, message: "Ownership transferred successfully." };
    } catch (error) {
        console.error("TRANSFER_ERROR:", error);
        return { success: false, message: "System error: Could not process legal transfer." };
    }
}
