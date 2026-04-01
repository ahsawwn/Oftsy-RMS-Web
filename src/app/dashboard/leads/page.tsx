import { db } from "@/lib/db";
import { leads, properties } from "@/lib/db/schema";
import { eq, desc, count } from "drizzle-orm";
import { Button } from "@/components/ui/Button";
import {
    UserPlus, Phone, Mail, MoreVertical, 
    Users2, Filter, Search, MessageSquare,
    Zap, ExternalLink, ChevronRight, Activity,
    CalendarCheck, UserCheck, TrendingUp, BarChart3,
    Wind
} from "lucide-react";
import StatusSwitcher from "@/components/dashboard/StatusSwitcher";

import CRMHeader from "@/components/dashboard/CRMHeader";
import { LeadsTable } from "./LeadsTable";

export default async function LeadsPage() {
    const allLeads = await db
        .select({
            id: leads.id,
            name: leads.name,
            email: leads.email,
            phone: leads.phone,
            status: leads.status,
            source: leads.source,
            propertyId: properties.id,
            propertyName: properties.name,
            createdAt: leads.createdAt,
        })
        .from(leads)
        .leftJoin(properties, eq(leads.propertyId, properties.id))
        .orderBy(desc(leads.createdAt));

    // Fetch properties for the Lead Modal dropdown
    const availableProperties = await db.select().from(properties).orderBy(desc(properties.createdAt));

    // Intelligence Summary
    const closedCount = allLeads.filter(l => l.status === "Closed" || l.status === "Interested").length;
    const conversionRate = allLeads.length > 0 ? (closedCount / allLeads.length) * 100 : 0;

    return (
        <div className="space-y-12 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Strategic Pipeline Header */}
            <CRMHeader totalLeads={allLeads.length} properties={availableProperties} />

            {/* Strategic KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
                <div className="premium-card p-6 md:p-8 group bg-blue-500/5 border-blue-500/10">
                    <div className="flex justify-between items-start mb-6">
                        <div className="size-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                            <Users2 size={20} />
                        </div>
                        <span className="text-[9px] font-black uppercase text-blue-500 bg-blue-500/5 px-2 py-0.5 rounded-full tracking-widest">Growth Atlas</span>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                        <h3 className="text-4xl font-black">{allLeads.length.toString().padStart(2, '0')}</h3>
                        <span className="text-[10px] font-bold text-blue-500/50">+12%</span>
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-foreground/40 mt-1">Total Prospect Depth</p>
                </div>

                <div className="premium-card p-6 md:p-8 group bg-emerald-500/5 border-emerald-500/10">
                    <div className="flex justify-between items-start mb-6">
                        <div className="size-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                            <UserCheck size={20} />
                        </div>
                        <span className="text-[9px] font-black uppercase text-emerald-500 bg-emerald-500/5 px-2 py-0.5 rounded-full tracking-widest">Active Interest</span>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                        <h3 className="text-4xl font-black">{closedCount.toString().padStart(2, '0')}</h3>
                        <span className="text-[10px] font-bold text-emerald-500/50">Verified</span>
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-foreground/40 mt-1">Strategic Conversions</p>
                </div>

                <div className="premium-card p-6 md:p-8 group bg-brand-primary/5 border-brand-primary/10">
                    <div className="flex justify-between items-start mb-6">
                        <div className="size-12 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary group-hover:scale-110 transition-transform">
                            <TrendingUp size={20} />
                        </div>
                        <span className="text-[9px] font-black uppercase text-brand-primary/50 bg-brand-primary/5 px-2 py-0.5 rounded-full tracking-widest">Metric Flux</span>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                        <h3 className="text-4xl font-black">{conversionRate.toFixed(0)}%</h3>
                        <span className="text-[10px] font-bold text-brand-primary/50">Yield</span>
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-foreground/40 mt-1">Conversion Efficiency</p>
                </div>

                <div className="premium-card p-6 md:p-8 group bg-purple-500/5 border-purple-500/10 shadow-purple-500/5">
                    <div className="flex justify-between items-start mb-6">
                        <div className="size-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
                            <BarChart3 size={20} />
                        </div>
                        <span className="text-[9px] font-black uppercase text-purple-500 bg-purple-500/5 px-2 py-0.5 rounded-full tracking-widest">Pipeline Health</span>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                        <h3 className="text-4xl font-black">9.8</h3>
                        <span className="text-[10px] font-bold text-purple-500/50">Score</span>
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-foreground/40 mt-1">Terminal Integrity</p>
                </div>
            </div>

            {/* Utility Search & Listing */}
            <div className="premium-card p-4 md:p-8 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-3 text-foreground/30" size={16} />
                        <input
                            placeholder="SEARCH BY CLIENT PROFILE OR CONTACT..."
                            className="w-full pl-12 pr-6 py-3.5 bg-brand-secondary/30 border border-border/10 rounded-2xl text-[11px] font-black uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-brand-primary/5 placeholder:text-foreground/20"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="rounded-2xl h-12 px-8 text-[10px] font-black uppercase tracking-widest border-border/10 bg-white/50 dark:bg-black/20" icon={Filter}>Filters Atlas</Button>
                        <Button variant="outline" className="rounded-2xl h-12 px-8 text-[10px] font-black uppercase tracking-widest border-border/10 bg-white/50 dark:bg-black/20" icon={Wind}>Activity Stream</Button>
                    </div>
                </div>

                {/* Pipeline Matrix Table */}
                <div className="rounded-2xl border border-border/10 overflow-hidden bg-brand-secondary/10">
                    <LeadsTable data={allLeads} />
                </div>
            </div>

            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.5em] text-foreground/20 px-4 pt-12 border-t border-border/5">
                <p>Oftsy CRM Module v9.1.5</p>
                <div className="flex items-center gap-6">
                    <p className="animate-pulse flex items-center gap-2"><div className="size-1.5 bg-emerald-500 rounded-full" /> System Online</p>
                    <p className="text-brand-primary">Terminal Sync: Direct</p>
                </div>
            </div>
        </div>
    );
}