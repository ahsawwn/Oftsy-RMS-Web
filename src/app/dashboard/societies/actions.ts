"use server";

import { db } from "@/lib/db";
import { societies, authLogs, properties } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";
import { eq, desc } from "drizzle-orm";

const SocietySchema = z.object({
    name: z.string().min(3),
    location: z.string().min(3),
    totalPlots: z.coerce.number().int().positive(),
});

export async function createSocietyAction(prevState: any, formData: FormData) {
    const headerList = await headers();
    const ip = headerList.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";

    const validated = SocietySchema.safeParse({
        name: formData.get("name"),
        location: formData.get("location"),
        totalPlots: formData.get("totalPlots"),
    });

    if (!validated.success) return { success: false, errors: validated.error.flatten().fieldErrors };

    try {
        await db.transaction(async (tx) => {
            const [newSoc] = await tx.insert(societies).values({
                name: validated.data.name,
                location: validated.data.location,
                totalPlots: validated.data.totalPlots,
            }).returning({ id: societies.id });

            await tx.insert(authLogs).values({
                event: "SOCIETY_REGISTERED",
                ipAddress: ip,
                metadata: { id: newSoc.id, name: validated.data.name },
            });
        });

        revalidatePath("/dashboard/societies");
        return { success: true };
    } catch (e) {
        console.error("SOCIETY_ERROR:", e);
        return { success: false, message: "System Reject: Database Fail." };
    }
}

export async function getSocietyDetails(id: string) {
    if (!id || typeof id !== 'string') {
        console.error("GET_SOCIETY_DETAILS_ERROR: Invalid or missing ID", { id });
        return null;
    }

    try {
        const [society] = await db
            .select()
            .from(societies)
            .where(eq(societies.id, id))
            .limit(1);


        if (!society) return null;

        const societyProperties = await db
            .select()
            .from(properties)
            .where(eq(properties.societyId, id))
            .orderBy(desc(properties.createdAt));

        return {
            ...society,
            properties: societyProperties,
        };
    } catch (error) {
        console.error("GET_SOCIETY_DETAIL_ERROR:", error);
        throw new Error("System Fail: Could not fetch cluster data.");
    }
}
