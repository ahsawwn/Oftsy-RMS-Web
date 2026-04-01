"use server";

import { db } from "@/lib/db";
import { materialProcurement, laborManagement, authLogs, constructionProjects, projectLedger } from "@/lib/db/schema";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";
import { eq } from "drizzle-orm";

const MaterialSchema = z.object({
    projectId: z.string().uuid(),
    item: z.string().min(3),
    quantity: z.coerce.number().int().positive(),
    unit: z.string().min(1),
    vendor: z.string().optional().nullable(),
    totalCost: z.coerce.number().int().positive(),
});

const LaborSchema = z.object({
    projectId: z.string().uuid(),
    contractorName: z.string().min(3),
    workType: z.string().min(3),
    totalContractValue: z.coerce.number().int().positive(),
    attendanceCount: z.coerce.number().int().nonnegative().optional(),
});

const ProjectSchema = z.object({
    id: z.string().uuid().optional(),
    title: z.string().min(3),
    location: z.string().min(2),
    budget: z.coerce.number().int().positive(),
});

export async function createProjectAction(prevState: any, formData: FormData) {
    const headerList = await headers();
    const ip = headerList.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";

    const validated = ProjectSchema.safeParse({
        title: formData.get("title"),
        location: formData.get("location"),
        budget: formData.get("budget"),
    });

    if (!validated.success) return { success: false, errors: validated.error.flatten().fieldErrors };

    try {
        await db.transaction(async (tx) => {
            const [newProject] = await tx.insert(constructionProjects).values({
                title: validated.data.title,
                location: validated.data.location,
                totalBudget: validated.data.budget,
                status: "Planned",
            }).returning({ id: constructionProjects.id });

            await tx.insert(authLogs).values({
                event: "PROJECT_INITIALIZED",
                ipAddress: ip,
                metadata: { id: newProject.id, title: validated.data.title },
            });
        });

        revalidatePath("/dashboard/construction");
        return { success: true, message: "Project launched into framework." };
    } catch (e) {
        console.error("PROJECT_ERROR:", e);
        return { success: false, message: "System Error: Could not verify project sync." };
    }
}


export async function procureMaterialAction(prevState: any, formData: FormData) {
    const headerList = await headers();
    const ip = headerList.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";

    const validated = MaterialSchema.safeParse({
        projectId: formData.get("projectId"),
        item: formData.get("item"),
        quantity: formData.get("quantity"),
        unit: formData.get("unit"),
        vendor: formData.get("vendor"),
        totalCost: formData.get("totalCost"),
    });

    if (!validated.success) return { success: false, errors: validated.error.flatten().fieldErrors };

    try {
        await db.transaction(async (tx) => {
            await tx.insert(materialProcurement).values({
                projectId: validated.data.projectId,
                item: validated.data.item,
                quantity: validated.data.quantity,
                unit: validated.data.unit,
                vendor: validated.data.vendor,
                totalCost: validated.data.totalCost,
                costPerUnit: Math.round(validated.data.totalCost / validated.data.quantity),
            });

            // 2. Log cost in the master Project Ledger for budget tracking
            await tx.insert(projectLedger).values({
                projectId: validated.data.projectId,
                amount: validated.data.totalCost,
                type: "Debit",
                category: "Material",
                description: `Material Procurement: ${validated.data.item} (${validated.data.quantity} ${validated.data.unit})`,
            });


            await tx.insert(authLogs).values({
                event: "MATERIAL_PROCURED",
                ipAddress: ip,
                metadata: { item: validated.data.item, cost: validated.data.totalCost, project: validated.data.projectId },
            });
        });

        revalidatePath("/dashboard/construction");
        revalidatePath("/dashboard/construction/materials");
        return { success: true };

    } catch (e) {
        console.error("PROCURE_ERROR:", e);
        return { success: false, message: "System Reject: Database Fail." };
    }
}

export async function onboardLaborAction(prevState: any, formData: FormData) {
    const headerList = await headers();
    const ip = headerList.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";

    const validated = LaborSchema.safeParse({
        projectId: formData.get("projectId"),
        contractorName: formData.get("contractorName"),
        workType: formData.get("workType"),
        totalContractValue: formData.get("totalContractValue"),
        attendanceCount: formData.get("attendanceCount") || 0,
    });

    if (!validated.success) return { success: false, errors: validated.error.flatten().fieldErrors };

    try {
        await db.transaction(async (tx) => {
            await tx.insert(laborManagement).values({
                projectId: validated.data.projectId,
                contractorName: validated.data.contractorName,
                workType: validated.data.workType,
                totalContractValue: validated.data.totalContractValue,
                attendanceCount: validated.data.attendanceCount,
                paidToDate: 0,
            });

            await tx.insert(authLogs).values({
                event: "LABOR_ONBOARDED",
                ipAddress: ip,
                metadata: { contractor: validated.data.contractorName, value: validated.data.totalContractValue },
            });
        });

        revalidatePath("/dashboard/construction/labor");
        return { success: true };
    } catch (e) {
        console.error("LABOR_ERROR:", e);
        return { success: false, message: "System Reject: Database Fail." };
    }
}
