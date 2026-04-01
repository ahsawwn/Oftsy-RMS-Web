import { db } from "@/lib/db";
import { laborManagement, constructionProjects } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import LaborClient from "./LaborClient";

export default async function LaborPage() {
    const labor = await db
        .select({
            id: laborManagement.id,
            contractor: laborManagement.contractorName,
            workType: laborManagement.workType,
            totalValue: laborManagement.totalContractValue,
            paid: laborManagement.paidToDate,
            count: laborManagement.attendanceCount,
            lastActivity: laborManagement.lastActivity,
            projectTitle: constructionProjects.title,
        })
        .from(laborManagement)
        .leftJoin(constructionProjects, eq(laborManagement.projectId, constructionProjects.id))
        .orderBy(desc(laborManagement.lastActivity));

    const projects = await db.select({ id: constructionProjects.id, title: constructionProjects.title }).from(constructionProjects);

    return <LaborClient initialLabor={labor} projects={projects} />;
}
