import { db } from "@/lib/db";
import { materialProcurement, constructionProjects } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import MaterialsClient from "./MaterialsClient";

export default async function MaterialsPage() {
    const materials = await db
        .select({
            id: materialProcurement.id,
            item: materialProcurement.item,
            quantity: materialProcurement.quantity,
            unit: materialProcurement.unit,
            vendor: materialProcurement.vendor,
            totalCost: materialProcurement.totalCost,
            date: materialProcurement.purchasedAt,
            projectTitle: constructionProjects.title,
        })
        .from(materialProcurement)
        .leftJoin(constructionProjects, eq(materialProcurement.projectId, constructionProjects.id))
        .orderBy(desc(materialProcurement.purchasedAt));

    const projects = await db.select({ id: constructionProjects.id, title: constructionProjects.title }).from(constructionProjects);

    return <MaterialsClient initialMaterials={materials} projects={projects} />;
}
