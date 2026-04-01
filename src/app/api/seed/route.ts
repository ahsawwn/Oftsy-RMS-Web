import { seedDatabase } from "@/lib/db/seed";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await seedDatabase();
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}