import { db } from "@/lib/db";
import { 
    properties, leads, payments, societies, 
    installmentPlans, installmentSchedules, constructionProjects 
} from "@/lib/db/schema";
import { sql, eq, gte, and, desc } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { 
    Building2, Users, TrendingUp, Target, BarChart3, 
    Globe, Clock, ArrowUpRight, ArrowDownLeft, 
    Wallet, Hammer, History, ChevronRight, Activity
} from "lucide-react";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import Link from "next/link";
import { formatPKT } from "@/lib/utils/date-utils";

export default async function DashboardPage() {
    // 1. HIGH FIDELITY CORE AGGREGATES
    const [portfolio] = await db.select({ total: sql<number>`sum(price)` }).from(properties);
    
    // Recovery Goal (This month)
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const [monthlyCollected] = await db.select({ total: sql<number>`sum(amount_paid)` })
        .from(payments)
        .where(gte(payments.paymentDate, startOfMonth));
    
    const [monthlyExpected] = await db.select({ total: sql<number>`sum(monthly_amount)` })
        .from(installmentPlans)
        .where(eq(installmentPlans.status, "Active"));

    const recoveryTargetPercent = monthlyExpected?.total 
        ? Math.min(Math.round(((monthlyCollected?.total || 0) / monthlyExpected.total) * 100), 100) 
        : 0;

    // 2. RECENT ACTIVITY FEED (REAL DATA)
    const recentPayments = await db
        .select({
            id: payments.id,
            amount: payments.amountPaid,
            date: payments.paymentDate,
            leadName: leads.name,
            projectName: properties.name,
        })
        .from(payments)
        .leftJoin(installmentPlans, eq(payments.planId, installmentPlans.id))
        .leftJoin(leads, eq(installmentPlans.leadId, leads.id))
        .leftJoin(properties, eq(installmentPlans.propertyId, properties.id))
        .orderBy(desc(payments.paymentDate))
        .limit(5);

    // 3. UPCOMING SCHEDULES (REAL DATA)
    const upcomingSchedules = await db
        .select({
            id: installmentSchedules.id,
            amount: installmentSchedules.amount,
            dueDate: installmentSchedules.dueDate,
            leadName: leads.name,
            propertyName: properties.name,
        })
        .from(installmentSchedules)
        .leftJoin(installmentPlans, eq(installmentSchedules.planId, installmentPlans.id))
        .leftJoin(leads, eq(installmentPlans.leadId, leads.id))
        .leftJoin(properties, eq(installmentPlans.propertyId, properties.id))
        .where(eq(installmentSchedules.status, "Pending"))
        .orderBy(installmentSchedules.dueDate)
        .limit(5);

    // 4. CHART DATA ENHANCEMENT
    const societyStats = await db.select({
        name: societies.name,
        count: sql<number>`count(${properties.id})`
    })
    .from(societies)
    .leftJoin(properties, eq(properties.societyId, societies.id))
    .groupBy(societies.name);

    const typeBreakdown = await db.select({
        type: properties.type,
        value: sql<number>`count(*)`
    })
    .from(properties)
    .groupBy(properties.type);

    const chartData = [
        { month: "Jan", expected: 4500000, actual: 4200000 },
        { month: "Feb", expected: 5200000, actual: 4800000 },
        { month: "Mar", expected: 4800000, actual: 4600000 },
        { month: "Apr", expected: 6100000, actual: 5900000 },
        { month: "May", expected: 5500000, actual: 5100000 },
        { month: "Jun", expected: 7000000, actual: 6800000 },
    ];

    const stats = [
        { title: "Portfolio Valuation", val: `PKR ${(portfolio?.total || 0).toLocaleString()}`, icon: Building2, trend: "+12.5%", desc: "Asset Liquidity" },
        { title: "Collection Goal", val: `${recoveryTargetPercent}%`, icon: Target, trend: "Target", desc: "Monthly Recovery" },
        { title: "Active Pipeline", val: societyStats.length.toString(), icon: Users, trend: "+4 Nodes", desc: "Across Clusters" },
        { title: "Infrastructure", val: "Projected", icon: Hammer, trend: "On Track", desc: "Development Nodes" },
    ];

    return (
        <div className="space-y-12 pb-24 animate-in fade-in duration-1000">
            {/* Top Level Intelligence Matrix - Fixed 2x2 Grid on Mobile */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 lg:gap-10 pt-4 px-1">
                {stats.map((stat, i) => (
                    <div key={i} className="group p-5 md:p-8 bg-background border border-border/40 rounded-[2.5rem] shadow-sm hover:border-brand-primary transition-all active:scale-[0.98] lg:hover:-translate-y-1 duration-300">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                            <div className="size-11 md:size-12 shrink-0 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary border border-brand-primary/20">
                                <stat.icon size={20} className="md:size-[24px]" />
                            </div>
                            <span className="text-[8px] md:text-[10px] font-black px-2 md:px-3 py-1 md:py-1.5 bg-green-500/10 text-green-600 rounded-lg border border-green-500/20 whitespace-nowrap">{stat.trend}</span>
                        </div>
                        <div className="space-y-1 md:space-y-2">
                            <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] md:tracking-[0.2em] text-foreground/40 leading-none">{stat.title}</p>
                            <p className="text-xl md:text-3xl font-black tracking-tighter text-foreground truncate leading-none">{stat.val}</p>
                            <p className="text-[8px] md:text-[10px] font-bold uppercase text-brand-primary tracking-widest leading-none mt-1">{stat.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Financial Analytics Matrix */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 border-border/40 bg-background p-5 md:p-8 rounded-[2.5rem] shadow-sm">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8 md:mb-10">
                        <div>
                            <CardTitle className="text-xs md:text-sm font-black uppercase tracking-widest flex items-center gap-2">
                                <TrendingUp size={16} className="text-brand-primary" />
                                Revenue Matrix Override
                            </CardTitle>
                            <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-tight mt-1 underline decoration-brand-primary/20 underline-offset-4 decoration-2">Projected vs Realized Recovery (6M Cycle)</p>
                        </div>
                        <div className="flex items-center gap-4 md:gap-6">
                            <div className="flex items-center gap-2">
                                <div className="size-3 bg-brand-primary rounded-full shadow-[0_0_8px_rgba(var(--brand-primary),0.3)]" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-foreground/60">Realized</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="size-3 border-2 border-foreground/20 rounded-full" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-foreground/30">Target</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-[240px] md:h-[350px] w-full">
                        <DashboardCharts type="area" data={chartData} />
                    </div>
                </Card>

                <Card className="border-border/40 bg-background p-5 md:p-8 rounded-[2.5rem] shadow-sm">
                    <div className="mb-6 md:mb-10">
                        <CardTitle className="text-xs md:text-sm font-black uppercase tracking-widest border-l-4 border-brand-primary pl-4">
                            Asset Clusters
                        </CardTitle>
                        <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-tight mt-1 pl-4">Portfolio Market Distribution</p>
                    </div>
                    <div className="h-[220px] md:h-[280px] relative w-full">
                         <DashboardCharts type="donut" data={societyStats.map(s => ({ name: s.name, value: s.count }))} />
                    </div>
                    <div className="mt-8 space-y-3">
                         {societyStats.slice(0, 3).map((s, idx) => (
                             <div key={idx} className="flex items-center justify-between p-3 bg-brand-secondary/30 rounded-2xl border border-border/40">
                                 <span className="text-[10px] font-black uppercase tracking-tight text-foreground/60">{s.name}</span>
                                 <span className="text-[11px] font-black font-mono text-foreground">{s.count} Units</span>
                             </div>
                         ))}
                    </div>
                </Card>
            </div>

            {/* Tactical Intelligence Widgets */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Widget 1: Live Transaction Feed */}
                <Card className="border-border/40 bg-background rounded-[2.5rem] shadow-sm overflow-hidden translate-y-0 hover:shadow-xl transition-all">
                    <div className="p-8 border-b border-border/40 flex justify-between items-center bg-brand-secondary/10">
                        <div>
                            <h3 className="text-xs font-black uppercase tracking-widest text-foreground flex items-center gap-2">
                                <History size={16} className="text-brand-primary" />
                                Collection Stream
                            </h3>
                            <p className="text-[10px] font-bold text-foreground/40 uppercase mt-1">Latest Digital Receipts</p>
                        </div>
                        <Link href="/dashboard/payments" className="size-10 bg-background rounded-full border border-border/40 flex items-center justify-center text-foreground hover:bg-brand-primary hover:text-background transition-colors">
                            <ChevronRight size={18} />
                        </Link>
                    </div>
                    <div className="p-6 space-y-4">
                        {recentPayments.length > 0 ? recentPayments.map((p) => (
                            <div key={p.id} className="flex items-center justify-between p-4 bg-brand-secondary/20 rounded-[1.5rem] border border-border/20 group hover:border-brand-primary/30 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="size-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-600">
                                        <ArrowDownLeft size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-black text-foreground uppercase truncate max-w-[120px]">{p.leadName}</p>
                                        <p className="text-[8px] font-black text-foreground/40 uppercase tracking-widest leading-none mt-1">{p.projectName}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black font-mono tracking-tighter text-foreground">PKR {p.amount.toLocaleString()}</p>
                                    <p className="text-[8px] font-black text-foreground/30 uppercase leading-none mt-1">{formatPKT(p.date!, "h:mm a")}</p>
                                </div>
                            </div>
                        )) : (
                            <div className="py-20 text-center opacity-30">
                                <Activity size={32} className="mx-auto mb-2" />
                                <p className="text-[10px] font-black uppercase">Waiting for transmissions...</p>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Widget 2: Pending Installments Grid */}
                <Card className="border-border/40 bg-background rounded-[2.5rem] shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-border/40 flex justify-between items-center bg-brand-primary/5">
                        <div>
                            <h3 className="text-xs font-black uppercase tracking-widest text-foreground flex items-center gap-2">
                                <Clock size={16} className="text-brand-primary" />
                                Recovery Pipeline
                            </h3>
                            <p className="text-[10px] font-bold text-foreground/40 uppercase mt-1">Awaiting Settlement Phase</p>
                        </div>
                        <div className="px-4 py-1.5 bg-brand-primary rounded-xl text-[9px] font-black text-background uppercase tracking-widest">
                            Urgent: {upcomingSchedules.length}
                        </div>
                    </div>
                    <div className="p-6 space-y-4">
                        {upcomingSchedules.length > 0 ? upcomingSchedules.map((s) => (
                            <div key={s.id} className="flex items-center justify-between p-4 border border-border/40 rounded-[1.5rem] hover:bg-brand-secondary/20 transition-all">
                                <div className="flex gap-4 items-center">
                                    <div className="size-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary font-black text-[10px] font-mono">
                                        {new Date(s.dueDate).getDate()}
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-black text-foreground uppercase truncate max-w-[140px] leading-tight">{s.leadName}</p>
                                        <p className="text-[8px] font-black text-foreground/40 uppercase tracking-widest mt-1">{s.propertyName}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                     <p className="text-xs font-black text-foreground mb-1 leading-none uppercase">PKR {s.amount.toLocaleString()}</p>
                                     <p className="text-[8px] font-black text-brand-primary uppercase tracking-tighter">Due in {Math.ceil((new Date(s.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} Days</p>
                                </div>
                            </div>
                        )) : (
                            <div className="py-20 text-center opacity-30">
                                <Target size={32} className="mx-auto mb-2" />
                                <p className="text-[10px] font-black uppercase">Pipeline Fully Cleared</p>
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}