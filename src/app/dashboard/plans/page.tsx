import { db } from "@/lib/db";
import { installmentPlans, leads, properties } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import PlansClient from "./PlansClient";

export default async function InstallmentPlansPage() {
    const plans = await db
        .select({
            id: installmentPlans.id,
            totalPrice: installmentPlans.totalPrice,
            downPayment: installmentPlans.downPayment,
            monthlyAmount: installmentPlans.monthlyAmount,
            status: installmentPlans.status,
            clientName: leads.name,
            propertyName: properties.name,
        })
        .from(installmentPlans)
        .leftJoin(leads, eq(installmentPlans.leadId, leads.id))
        .leftJoin(properties, eq(installmentPlans.propertyId, properties.id))
        .orderBy(desc(installmentPlans.startDate));

    return <PlansClient initialPlans={plans} />;
}
