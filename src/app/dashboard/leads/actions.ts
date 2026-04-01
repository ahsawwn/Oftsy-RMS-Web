"use server";

import { db } from "@/lib/db";
import { leads, authLogs } from "@/lib/db/schema";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";

const LeadSchema = z.object({
    name: z.string().min(3),
    phone: z.string().min(10),
    email: z.string().email().optional().nullable(),
    source: z.string().optional(),
    propertyId: z.string().uuid().optional().nullable(),
});

/**
 * Onboard a new lead into the CRM pipeline
 */
export async function createLeadAction(prevState: any, formData: FormData) {
    const headerList = await headers();
    const ip = headerList.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";

    const validatedFields = LeadSchema.safeParse({
        name: formData.get("name"),
        phone: formData.get("phone"),
        email: formData.get("email") || null,
        source: formData.get("source"),
        propertyId: formData.get("propertyId") || null,
    });

    if (!validatedFields.success) {
        return { errors: validatedFields.error.flatten().fieldErrors, message: "Validation Required" };
    }

    try {
        await db.transaction(async (tx) => {
            const [newLead] = await tx.insert(leads).values({
                name: validatedFields.data.name,
                phone: validatedFields.data.phone,
                email: validatedFields.data.email as string | null,
                source: validatedFields.data.source,
                propertyId: validatedFields.data.propertyId as string | null,
                status: "New",
            }).returning({ id: leads.id });

            await tx.insert(authLogs).values({
                event: "LEAD_CREATED",
                ipAddress: ip,
                metadata: {
                    id: newLead.id,
                    name: validatedFields.data.name,
                    source: validatedFields.data.source,
                    propertyId: validatedFields.data.propertyId,
                },
            });
        });

        revalidatePath("/dashboard/leads");
        return { success: true, message: "Lead onboarded into terminal." };
    } catch (e) {
        console.error("CREATE_LEAD_ERROR:", e);
        return { message: "Internal Recovery Failure: Could not sync lead profile." };
    }
}

/**
 * Update the status of a lead in the strategic pipeline
 */
export async function updateLeadStatusAction(id: string, status: string) {
    const headerList = await headers();
    const ip = headerList.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";

    try {
        await db.transaction(async (tx) => {
            await tx
                .update(leads)
                .set({ status })
                .where(eq(leads.id, id));

            await tx.insert(authLogs).values({
                event: "LEAD_STATUS_UPDATED",
                ipAddress: ip,
                metadata: { id, newStatus: status },
            });
        });

        revalidatePath("/dashboard/leads");
        return { success: true };
    } catch (error) {
        console.error("UPDATE_LEAD_STATUS_ERROR:", error);
        return { success: false, error: "System Sync Failure: Status not updated." };
    }
}

/**
 * Fetch all verified leads for selection dropdowns
 */
export async function getAllLeads() {
    try {
        return await db.select().from(leads).orderBy(leads.name);
    } catch (error) {
        console.error("GET_ALL_LEADS_ERROR:", error);
        return [];
    }
}