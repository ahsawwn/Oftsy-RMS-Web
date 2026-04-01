"use server";

import { db } from "@/lib/db";
import { properties, installmentPlans, installmentSchedules, authLogs, leads, payments } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function bookPropertyAction(
    propertyId: string,
    leadId: string,
    totalPrice: number,
    downPayment: number,
    months: number
) {
    try {
        const headerList = await headers();
        const ip = headerList.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";

        await db.transaction(async (tx) => {
            // 1. Mark Property as Sold
            await tx.update(properties)
                .set({ status: "Sold Out" })
                .where(eq(properties.id, propertyId));

            // 2. Create the Installment Plan
            const monthlyAmount = Math.floor((totalPrice - downPayment) / months);
            const [plan] = await tx.insert(installmentPlans).values({
                propertyId,
                leadId,
                totalPrice,
                downPayment,
                totalInstallments: months,
                monthlyAmount,
                status: "Active",
            }).returning({ id: installmentPlans.id });

            // 3. Generate the Automated Ledger (Installment Schedules)
            const schedules = [];
            for (let i = 1; i <= months; i++) {
                const dueDate = new Date();
                dueDate.setMonth(dueDate.getMonth() + i);
                
                schedules.push({
                    planId: plan.id,
                    dueDate,
                    amount: monthlyAmount,
                    status: "Pending",
                });
            }
            
            await tx.insert(installmentSchedules).values(schedules);

            // 4. Record Initial Down Payment as a Payment
            const receiptNo = `DP-${Date.now().toString().slice(-6)}`;
            await tx.insert(payments).values({
                planId: plan.id,
                amountPaid: downPayment,
                paymentMethod: "Initial Deposit",
                receiptNumber: receiptNo,
            });

            // 5. Update Lead Status
            await tx.update(leads)
                .set({ status: "Closed" })
                .where(eq(leads.id, leadId));

            // 6. Audit the Sale
            await tx.insert(authLogs).values({
                event: "PROPERTY_BOOKED",
                ipAddress: ip,
                metadata: { 
                    propertyId, 
                    leadId, 
                    planId: plan.id, 
                    dealType: "Installment", 
                    totalPrice, 
                    months,
                    initialReceipt: receiptNo 
                },
            });
        });

        revalidatePath("/dashboard");
        revalidatePath("/dashboard/properties");
        revalidatePath("/dashboard/leads");
        revalidatePath("/dashboard/finance");
        
        return { success: true };
    } catch (error) {
        console.error("BOOKING_ERROR:", error);
        return { success: false, message: "Booking failed: Protocol Recovery Failure." };
    }
}