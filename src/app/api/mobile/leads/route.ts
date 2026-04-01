import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { leads, authLogs } from "@/lib/db/schema";
import { z } from "zod";

const MobileOnboardSchema = z.object({
    name: z.string().min(3),
    phone: z.string().min(10),
    email: z.string().email().optional().nullable(),
    source: z.literal("Mobile Field App"),
    propertyId: z.string().uuid().optional().nullable(),
    notes: z.string().optional(),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validated = MobileOnboardSchema.safeParse(body);

        if (!validated.success) {
            return NextResponse.json({ error: "Validation Protocol Failure", details: validated.error.flatten() }, { status: 400 });
        }

        const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";

        const [newLead] = await db.transaction(async (tx) => {
            const [lead] = await tx.insert(leads).values({
                ...validated.data,
                status: "New",
            }).returning({ id: leads.id });

            await tx.insert(authLogs).values({
                event: "MOBILE_FIELD_ONBOARDING",
                ipAddress: ip,
                metadata: { id: lead.id, name: validated.data.name, source: validated.data.source },
            });

            return [lead];
        });

        return NextResponse.json({
            success: true,
            id: newLead.id,
            message: "Field acquisition synced to master ledger."
        });

    } catch (error) {
        console.error("MOBILE_LEAD_API_ERROR:", error);
        return NextResponse.json({ error: "CRM Sink Failure" }, { status: 500 });
    }
}
