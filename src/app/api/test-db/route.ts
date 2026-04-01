import { NextResponse } from "next/server";
import { getPropertyDetails } from "@/app/dashboard/properties/actions";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "No ID provided" });
    
    try {
        const details = await getPropertyDetails(id);
        return NextResponse.json({ success: true, details });
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message, stack: e.stack });
    }
}
