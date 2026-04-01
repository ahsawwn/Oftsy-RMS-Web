import { db } from "@/lib/db";
import { payments, installmentPlans, leads, properties } from "@/lib/db/schema";
import { eq, desc, and, gte, sql } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { 
    TrendingUp, ArrowDownLeft, Filter, 
    Search, Printer, Download, MoreVertical,
    Activity, ShieldCheck, CreditCard, Clock
} from "lucide-react";
import PaymentEntryWrapper from "@/components/dashboard/PaymentEntryWrapper";
import { formatPKT } from "@/lib/utils/date-utils";

export default async function PaymentsPage() {
    // 1. Fetch Transactions with High Fidelity
    const transactions = await db
        .select({
            id: payments.id,
            amount: payments.amountPaid,
            date: payments.paymentDate,
            method: payments.paymentMethod,
            receipt: payments.receiptNumber,
            clientName: leads.name,
            projectName: properties.name,
            propertyId: properties.id,
        })
        .from(payments)
        .leftJoin(installmentPlans, eq(payments.planId, installmentPlans.id))
        .leftJoin(leads, eq(installmentPlans.leadId, leads.id))
        .leftJoin(properties, eq(installmentPlans.propertyId, properties.id))
        .orderBy(desc(payments.paymentDate));

    // 2. Data Aggregate for Matrix
    const totalCollected = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
    
    // 3. Fetch Active Plans for Quick Settlement
    const activePlans = await db
        .select({
            id: installmentPlans.id,
            leadName: leads.name,
            propertyName: properties.name,
        })
        .from(installmentPlans)
        .leftJoin(leads, eq(installmentPlans.leadId, leads.id))
        .leftJoin(properties, eq(installmentPlans.propertyId, properties.id))
        .where(eq(installmentPlans.status, "Active"));

    const planOptions = activePlans.map(p => ({
        id: p.id,
        label: `${p.leadName} — ${p.propertyName}`
    }));

    return (
        <div className="space-y-8 md:space-y-12 pb-20 animate-in fade-in duration-1000">
            {/* Executive Ledger Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between border-b border-border/40 pb-6 md:pb-10 gap-6 md:gap-8">
                <div className="space-y-1 md:space-y-2 text-center lg:text-left">
                    <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase text-foreground leading-none">
                        Financial Ledger
                    </h1>
                    <p className="text-foreground/40 text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] justify-center lg:justify-start flex items-center gap-2">
                        <ShieldCheck size={12} className="text-brand-primary" />
                        Audited Capital Flow • ABH Holdings Ledger
                    </p>
                </div>
                
                <div className="flex items-center justify-between lg:justify-end gap-3 bg-brand-secondary/30 border border-border/40 p-2 rounded-[1.5rem] shadow-sm overflow-hidden">
                    <div className="px-4 md:px-6 py-1 md:py-2 border-r border-border/40 text-right">
                        <p className="text-[8px] md:text-[9px] font-black uppercase text-foreground/30 tracking-widest leading-none">Global Collection</p>
                        <p className="text-lg md:text-xl font-black font-mono mt-0.5 text-foreground whitespace-nowrap leading-none">PKR {totalCollected.toLocaleString()}</p>
                    </div>
                    <div className="px-2 md:px-4">
                        <PaymentEntryWrapper activePlans={planOptions} />
                    </div>
                </div>
            </div>

            {/* Matrix Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <div className="md:col-span-1 lg:col-span-2 relative">
                    <Search className="absolute left-4 top-3.5 md:top-4 text-foreground/30" size={16} />
                    <input
                        placeholder="SEARCH BY RECEIPT ID OR CLIENT REFERENCE..."
                        className="w-full pl-12 pr-4 py-3.5 md:py-4 bg-background border border-border/40 rounded-[1.5rem] text-[9px] md:text-[10px] font-black uppercase tracking-widest outline-none shadow-sm focus:ring-2 focus:ring-brand-primary/10 transition-all placeholder:text-foreground/30"
                    />
                </div>
                <div className="flex gap-3 md:gap-4 md:col-span-1 lg:col-span-2">
                     <button className="flex-1 bg-brand-secondary/30 border border-border/40 rounded-[1.5rem] px-4 md:px-6 flex items-center justify-center gap-2 text-[8px] md:text-[9px] font-black uppercase tracking-widest text-foreground/40 hover:text-foreground transition-colors h-12 md:h-auto">
                        <Clock size={14} className="text-brand-primary" /> Overdue Ledger
                     </button>
                     <button className="h-12 w-12 md:h-[56px] md:w-[56px] bg-background border border-border/40 rounded-[1.5rem] flex items-center justify-center text-foreground/30 hover:text-foreground transition-all shadow-sm active:scale-95">
                        <Filter size={18} />
                     </button>
                     <button className="h-12 w-12 md:h-[56px] md:w-[56px] bg-background border border-border/40 rounded-[1.5rem] flex items-center justify-center text-foreground/30 hover:text-foreground transition-all shadow-sm active:scale-95">
                        <Download size={18} />
                     </button>
                </div>
            </div>

            {/* Ledger Matrix - Dual View Implementation */}
            <div>
                {/* Desktop High-Density View */}
                <div className="hidden md:block rounded-[2rem] border border-border/40 overflow-hidden bg-background shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-brand-secondary/30 border-b border-border/40 text-[10px] font-black uppercase tracking-widest text-foreground/40">
                            <tr>
                                <th className="px-8 py-6">Receipt / Ref</th>
                                <th className="px-8 py-6">Allottee / Asset</th>
                                <th className="px-8 py-6">Settlement Date</th>
                                <th className="px-8 py-6">Routing</th>
                                <th className="px-8 py-6 text-right font-black">Credit Amount</th>
                                <th className="px-8 py-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/10">
                            {transactions.map((t) => (
                                <tr key={t.id} className="group hover:bg-brand-secondary/10 transition-all cursor-pointer">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 rounded-lg bg-brand-secondary/50 flex items-center justify-center text-foreground/40 group-hover:bg-brand-primary group-hover:text-background transition-colors">
                                                <ArrowDownLeft size={16} />
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-black font-mono tracking-tight text-foreground uppercase">{t.receipt}</p>
                                                <p className="text-[8px] font-black text-foreground/30 uppercase tracking-widest">Digital Ref</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-1">
                                            <p className="text-[11px] font-black text-foreground uppercase tracking-tight leading-none">{t.clientName}</p>
                                            <p className="text-[9px] font-black text-foreground/40 uppercase tracking-widest">{t.projectName}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-[10px] font-black uppercase text-foreground/70 tracking-tight">{formatPKT(t.date!, "dd MMM yyyy")}</p>
                                        <p className="text-[8px] font-black text-foreground/30 uppercase tracking-widest">PKT Sync</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <Badge variant="outline" className="text-[8px] font-black px-2 py-0 h-5 uppercase tracking-widest border-border/40 bg-brand-secondary/20 text-foreground/70">
                                            {t.method}
                                        </Badge>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <p className="text-sm font-black font-mono tracking-tighter text-foreground">PKR {t.amount?.toLocaleString()}</p>
                                        <div className="flex items-center justify-end gap-1 text-[8px] font-black text-green-600 uppercase">
                                            <Activity size={10} /> Validated
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="flex items-center justify-end gap-3">
                                            <button className="flex items-center gap-2 p-2 px-4 hover:bg-foreground hover:text-background rounded-xl transition-all text-foreground/40">
                                                <Printer size={14} />
                                                <span className="text-[9px] font-black uppercase tracking-widest">Receipt</span>
                                            </button>
                                            <button className="p-2 hover:bg-brand-secondary rounded-xl text-foreground/40">
                                                <MoreVertical size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Perfectly Organized Grid/Card View */}
                <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {transactions.map((t) => (
                        <div key={t.id} className="bg-background border border-border/40 rounded-[2rem] p-5 shadow-sm active:scale-[0.98] transition-all flex flex-col gap-4">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary">
                                        <CreditCard size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-black text-foreground uppercase tracking-tight">{t.clientName}</p>
                                        <p className="text-[8px] font-black text-foreground/40 uppercase tracking-widest">Ref: {t.receipt}</p>
                                    </div>
                                </div>
                                <button className="p-2 bg-brand-secondary/50 rounded-xl text-foreground/40">
                                    <Printer size={14} />
                                </button>
                            </div>

                            <div className="py-4 border-y border-border/20 space-y-3">
                                <div className="flex justify-between items-center">
                                    <p className="text-[8px] font-black uppercase text-foreground/40 tracking-widest">Project</p>
                                    <p className="text-[10px] font-black text-foreground uppercase">{t.projectName}</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-[8px] font-black uppercase text-foreground/40 tracking-widest">Settlement</p>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-foreground uppercase">{formatPKT(t.date!, "dd MMM yyyy")}</p>
                                        <p className="text-[7px] font-black text-foreground/30 uppercase">Method: {t.method}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-1 flex justify-between items-end">
                                <div>
                                    <p className="text-[8px] font-black uppercase text-foreground/40 mb-1">Total Credit</p>
                                    <p className="text-xl font-black font-mono tracking-tighter text-foreground leading-none">
                                        PKR {t.amount?.toLocaleString()}
                                    </p>
                                </div>
                                <div className="flex items-center gap-1 text-[8px] font-black text-green-600 uppercase bg-green-500/5 px-2 py-1 rounded-full border border-green-500/10">
                                    <ShieldCheck size={10} /> Validated
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-[0.4em] text-zinc-400 px-2 border-t border-zinc-100 dark:border-zinc-900 pt-8">
                <p>Total Distributed Volume: PKR {totalCollected.toLocaleString()}</p>
                <p>Secured by ABH Financial Protocols</p>
            </div>
        </div>
    );
}