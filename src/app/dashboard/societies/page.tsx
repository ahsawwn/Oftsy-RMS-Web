import { db } from "@/lib/db";
import { societies, properties } from "@/lib/db/schema";
import { desc, eq, count } from "drizzle-orm";
import SocietiesClient from "./SocietiesClient";

export default async function SocietiesPage() {
    // Single query to fetch societies and their linked property count
    const allSocieties = await db
        .select({
            id: societies.id,
            name: societies.name,
            location: societies.location,
            totalPlots: societies.totalPlots,
            createdAt: societies.createdAt,
            linkedPropertiesCount: count(properties.id)
        })
        .from(societies)
        .leftJoin(properties, eq(societies.id, properties.societyId))
        .groupBy(societies.id)
        .orderBy(desc(societies.createdAt));

    return <SocietiesClient initialSocieties={allSocieties} />;
}
