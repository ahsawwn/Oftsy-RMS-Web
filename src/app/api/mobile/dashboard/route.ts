import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { properties, leads, installmentSchedules, constructionProjects, projectLedger } from "@/lib/db/schema";
import { eq, sql, and } from "drizzle-orm";

export async function GET(req: Request) {
    try {
        // 1. Snapshot Recovery Status
        const [recovered] = await db.select({ total: sql<number>`sum(amount)` })
            .from(installmentSchedules)
            .where(eq(installmentSchedules.status, "Paid"));
            
        const [pending] = await db.select({ total: sql<number>`sum(amount)` })
            .from(installmentSchedules)
            .where(eq(installmentSchedules.status, "Pending"));

        // 2. Active Inventory Breakdown
        const [availableCount] = await db.select({ count: sql<number>`count(*)` })
            .from(properties)
            .where(eq(properties.status, "Available"));

        // 3. New Acquisition Pipeline
        const [leadsCount] = await db.select({ count: sql<number>`count(*)` })
            .from(leads)
            .where(eq(leads.status, "New"));

        // 4. Construction Burn Status
        const [totalBurn] = await db.select({ total: sql<number>`sum(amount)` })
            .from(projectLedger)
            .where(eq(projectLedger.type, "Debit"));

        return NextResponse.json({
            success: true,
            snapshot: {
                recoveryValue: recovered?.total || 0,
                outstandingReceivables: pending?.total || 0,
                availableAssets: availableCount?.count || 0,
                newLeads: leadsCount?.count || 0,
                burnedCapital: totalBurn?.total || 0,
            }
        });

    } catch (error) {
        console.error("MOBILE_DASHBOARD_API_ERROR:", error);
        return NextResponse.json({ error: "Dashboard Pulse Failure" }, { status: 500 });
    }
}
