"use server";

import { db } from "@/lib/db";
import { properties, installmentPlans, payments, transferHistory, leads, societies, authLogs } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

const PropertySchema = z.object({
    name: z.string().min(3),
    location: z.string().min(3),
    type: z.enum(["Residential", "Commercial", "Villa"]),
    price: z.coerce.number().int().positive(),
    status: z.enum(["Available", "Under Construction", "Sold Out"]),
    societyId: z.string().uuid().optional().nullable(),
    plotNumber: z.string().optional().nullable(),
});

/**
 * Fetch detailed property data for the Executive Detail View
 */
export async function getPropertyDetails(id: string) {
    try {
        const [property] = await db
            .select()
            .from(properties)
            .where(eq(properties.id, id))
            .limit(1);

        if (!property) return null;

        // Fetch Society if linked
        const society = property.societyId 
            ? await db.select().from(societies).where(eq(societies.id, property.societyId)).limit(1).then(r => r[0])
            : null;

        // Fetch Installment Plan & Payments
        const [plan] = await db
            .select()
            .from(installmentPlans)
            .where(eq(installmentPlans.propertyId, id))
            .limit(1);

        const planPayments = plan 
            ? await db.select().from(payments).where(eq(payments.planId, plan.id)).orderBy(desc(payments.paymentDate))
            : [];

        // Fetch Transfer History
        const transfers = await db
            .select()
            .from(transferHistory)
            .where(eq(transferHistory.propertyId, id))
            .orderBy(desc(transferHistory.transferDate));

        // Fetch Lead (Current Owner if Sold)
        const currentOwner = plan ? await db.select().from(leads).where(eq(leads.id, plan.leadId)).limit(1).then(r => r[0]) : null;

        return {
            ...property,
            society,
            plan,
            payments: planPayments,
            transfers,
            owner: currentOwner,
        };
    } catch (error: any) {
        console.error("GET_PROPERTY_DETAIL_FULL_ERROR:", error);
        throw new Error(`DB_CRASH: ${error.message} | Cause: ${error.cause ? error.cause.message : 'Unknown'}`);
    }
}

/**
 * Create a new property asset in the inventory
 */
export async function createPropertyAction(prevState: any, formData: FormData) {
    const headerList = await headers();
    const ip = headerList.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";

    const validatedFields = PropertySchema.safeParse({
        name: formData.get("name"),
        location: formData.get("location"),
        type: formData.get("type"),
        price: formData.get("price"),
        status: formData.get("status"),
        societyId: formData.get("societyId") || null,
        plotNumber: formData.get("plotNumber") || null,
    });

    if (!validatedFields.success) {
        return { errors: validatedFields.error.flatten().fieldErrors, message: "Invalid Input Data" };
    }

    try {
        await db.transaction(async (tx) => {
            const [newProp] = await tx.insert(properties).values({
                name: validatedFields.data.name,
                location: validatedFields.data.location,
                type: validatedFields.data.type,
                price: validatedFields.data.price,
                status: validatedFields.data.status,
                societyId: validatedFields.data.societyId as string | null,
                plotNumber: validatedFields.data.plotNumber as string | null,
            }).returning({ id: properties.id });

            await tx.insert(authLogs).values({
                event: "PROPERTY_CREATED",
                ipAddress: ip,
                metadata: {
                    id: newProp.id,
                    name: validatedFields.data.name,
                    price: validatedFields.data.price,
                },
            });
        });

        revalidatePath("/dashboard/properties");
        return { success: true, message: "Asset registered successfully." };
    } catch (e) {
        console.error("CREATE_PROPERTY_ERROR:", e);
        return { message: "System Error: Could not verify asset registration." };
    }
}