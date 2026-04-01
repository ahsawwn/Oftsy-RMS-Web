import { db } from "@/lib/db";
import { installmentPlans, leads, properties, payments } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { calculateRecoveryStatus } from "@/lib/utils/recovery";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { AlertTriangle, Phone, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export default async function RecoveryPage() {
    const activePlans = await db.select().from(installmentPlans).where(eq(installmentPlans.status, "Active"));

    // Typesafe data fetching for each plan
    const recoveryData = await Promise.all(
        activePlans.map(async (plan) => {
            const planPayments = await db.select().from(payments).where(eq(payments.planId, plan.id));
            const [lead] = await db.select().from(leads).where(eq(leads.id, plan.leadId)).limit(1);
            const [property] = await db.select().from(properties).where(eq(properties.id, plan.propertyId)).limit(1);

            const status = calculateRecoveryStatus(plan, planPayments);

            return { plan, lead, property, status };
        })
    );

    const overdueLeads = recoveryData.filter(d => d.status.overdueCount > 0);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black tracking-tight uppercase">Recovery Ledger</h1>
                    <p className="text-zinc-500">Clients with pending installments in ABH Holdings Projects.</p>
                </div>
                <Badge variant="warning">{overdueLeads.length} Action Required</Badge>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {overdueLeads.map(({ lead, property, status }) => (
                    <Card key={status.planId} className={status.isDefaulted ? "border-red-500/50 bg-red-500/5" : ""}>
                        <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className={`size-12 rounded-xl flex items-center justify-center ${status.isDefaulted ? "bg-red-500 text-white" : "bg-orange-500 text-white"}`}>
                                    <AlertTriangle size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{lead.name}</h3>
                                    <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">{property.name}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                                <div>
                                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Late By</p>
                                    <p className="text-xl font-black text-red-600">{status.overdueCount} Months</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Paid</p>
                                    <p className="text-xl font-black">{status.paidInstallments} / {status.expectedInstallments}</p>
                                </div>
                                <div className="hidden md:block">
                                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Contact</p>
                                    <p className="text-sm font-bold flex items-center gap-1 mt-1">
                                        <Phone size={14} className="text-zinc-400" /> {lead.phone}
                                    </p>
                                </div>
                            </div>

                            <button className="p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">
                                <ArrowRight size={20} className="text-zinc-400" />
                            </button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}