import { db } from "@/lib/db";
import { constructionProjects, projectLedger } from "@/lib/db/schema";
import { eq, sql, and } from "drizzle-orm";
import ConstructionClient from "./ConstructionClient";

export default async function ConstructionPage() {
    const projects = await db.select().from(constructionProjects).orderBy(sql`${constructionProjects.createdAt} desc`);

    const projectAggregated = await Promise.all(projects.map(async (project) => {
        const [cost] = await db.select({ total: sql<number>`sum(amount)` })
            .from(projectLedger)
            .where(and(eq(projectLedger.projectId, project.id), eq(projectLedger.type, "Debit")));
        
        return { ...project, actualCost: cost?.total || 0 };
    }));

    return <ConstructionClient initialProjects={projectAggregated} />;
}
