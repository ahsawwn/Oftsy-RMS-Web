import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { properties, societies } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const societyId = url.searchParams.get("societyId");

        const query = db
            .select({
                id: properties.id,
                name: properties.name,
                plotNumber: properties.plotNumber,
                location: properties.location,
                type: properties.type,
                status: properties.status,
                price: properties.price,
                societyName: societies.name,
            })
            .from(properties)
            .leftJoin(societies, eq(properties.societyId, societies.id));

        const results = societyId 
            ? await query.where(eq(properties.societyId, societyId)).orderBy(desc(properties.createdAt))
            : await query.orderBy(desc(properties.createdAt)).limit(50);

        return NextResponse.json({
            success: true,
            total: results.length,
            inventory: results
        });

    } catch (error) {
        console.error("MOBILE_INVENTORY_API_ERROR:", error);
        return NextResponse.json({ error: "Inventory Sync Failure" }, { status: 500 });
    }
}
