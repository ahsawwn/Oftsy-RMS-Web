"use server";

import { db } from "@/lib/db";
import { authLogs } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

const LogSchema = z.object({
    event: z.string().min(3),
    metadata: z.string().optional().nullable(),
});

export async function createManualLogAction(state: any, formData: FormData) {
    const headerList = await headers();
    const ip = headerList.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";

    const validated = LogSchema.safeParse({
        event: formData.get("event"),
        metadata: formData.get("metadata"),
    });

    if (!validated.success) return { success: false, errors: validated.error.flatten().fieldErrors };

    let parsedMetadata = null;
    if (validated.data.metadata) {
        try {
            parsedMetadata = JSON.parse(validated.data.metadata);
        } catch (e) {
            parsedMetadata = { detail: validated.data.metadata };
        }
    }

    try {
        await db.insert(authLogs).values({
            event: validated.data.event.toUpperCase().replace(/\s+/g, "_"),
            ipAddress: ip,
            metadata: parsedMetadata ? parsedMetadata : { source: "MANUAL_ENTRY" },
        });

        revalidatePath("/dashboard/audit-logs");
        return { success: true };
    } catch (e) {
        console.error("ADD_LOG_ERROR:", e);
        return { success: false, message: "System Reject: Database Fail." };
    }
}
