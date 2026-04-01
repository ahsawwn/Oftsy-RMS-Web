"use server";

import { db } from "@/lib/db";
import { companySettings, authLogs } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";
import { eq } from "drizzle-orm";

const SettingsSchema = z.object({
    name: z.string().min(1),
    address: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional().or(z.literal("")),
    ntn: z.string().optional(),
    tagline: z.string().optional(),
    logoUrl: z.string().optional(),
});

export async function getCompanySettings() {
    try {
        const settings = await db.select().from(companySettings).limit(1);
        return settings[0] || null;
    } catch (error) {
        console.error("GET_SETTINGS_ERROR:", error);
        return null;
    }
}

export async function updateSettingsAction(prevState: any, formData: FormData) {
    const headerList = await headers();
    const ip = headerList.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";

    const validated = SettingsSchema.safeParse({
        name: formData.get("name"),
        address: formData.get("address"),
        phone: formData.get("phone"),
        email: formData.get("email"),
        ntn: formData.get("ntn"),
        tagline: formData.get("tagline"),
        logoUrl: formData.get("logoUrl"),
    });

    if (!validated.success) return { success: false, errors: validated.error.flatten().fieldErrors };

    try {
        const existing = await getCompanySettings();

        if (existing) {
            await db.update(companySettings)
                .set({
                    ...validated.data,
                    email: validated.data.email || null,
                    updatedAt: new Date(),
                })
                .where(eq(companySettings.id, existing.id));
        } else {
            await db.insert(companySettings).values({
                ...validated.data,
                email: validated.data.email || null,
            });
        }

        await db.insert(authLogs).values({
            event: "SETTINGS_UPDATED",
            ipAddress: ip,
            metadata: { name: validated.data.name },
        });

        revalidatePath("/dashboard/settings");
        return { success: true, message: "Corporate Identity Synced Successfully." };
    } catch (e) {
        console.error("SETTINGS_UPDATE_ERROR:", e);
        return { success: false, message: "System Reject: Database Fail." };
    }
}
