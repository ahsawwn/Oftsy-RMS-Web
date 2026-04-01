import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm"; // raw sql

export async function GET() {
    try {
        console.log("Next.js REST API triggered: Dropping transfer_history...");
        // Bypassing Drizzle strict mapping to force table schema directly
        await db.execute(sql`DROP TABLE IF EXISTS transfer_history CASCADE;`);
        
        console.log("Creating new relation...");
        await db.execute(sql`
            CREATE TABLE transfer_history (
                id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                property_id uuid REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
                old_lead_id uuid REFERENCES leads(id) ON DELETE CASCADE NOT NULL,
                new_lead_id uuid REFERENCES leads(id) ON DELETE CASCADE NOT NULL,
                transfer_date timestamp DEFAULT now() NOT NULL,
                transfer_fee double precision NOT NULL
            );
        `);
        console.log("Schema injected perfectly inside Next.js context.");
        return NextResponse.json({ success: true, message: "TRANSFER_HISTORY INJECTED" });
    } catch (error: any) {
        console.error("API DB ERROR:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
