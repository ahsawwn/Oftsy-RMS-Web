import { db } from "@/lib/db";
import { bankAccounts, officeExpenses, projectLedger, payments } from "@/lib/db/schema";
import { sql } from "drizzle-orm";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { 
    LayoutGrid, Landmark, Wallet, 
    TrendingUp, TrendingDown, Activity, 
    ShieldCheck, Download, Plus, Search
} from "lucide-react";

export default async function LedgerPage() {
    // Basic aggregation for demonstration
    const [totalRevenue] = await db.select({ total: sql<number>`sum(amount_paid)` }).from(payments);
    const [totalExpenses] = await db.select({ total: sql<number>`sum(amount)` }).from(officeExpenses);
    const [projectCosts] = await db.select({ total: sql<number>`sum(amount)` }).from(projectLedger).where(sql`type = 'Debit'`);

    const revenue = Number(totalRevenue?.total || 0);
    const expenses = Number(totalExpenses?.total || 0) + Number(projectCosts?.total || 0);

    return (
        <div className="space-y-12 pb-20 animate-in fade-in duration-1000">
            {/* Net Ledger Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between border-b border-zinc-200 dark:border-zinc-800 pb-10 gap-8">
                <div className="space-y-2">
                    <h1 className="text-5xl font-black tracking-tighter uppercase text-zinc-950 dark:text-zinc-50 leading-none">
                        Net Ledger
                    </h1>
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-2">
                        <ShieldCheck size={14} className="text-zinc-400" />
                        Audited Profit & Loss • ABH Group Financials
                    </p>
                </div>
                
                <div className="flex gap-4">
                    <Button variant="outline" className="h-12 border-zinc-200 dark:border-zinc-800 rounded-2xl text-[10px] font-black uppercase tracking-widest px-8" icon={Download}>Export Matrix</Button>
                    <Button className="h-12 bg-zinc-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest px-8" icon={Plus}>Audit Entry</Button>
                </div>
            </div>

            {/* High Level Financial Aggregation */}
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-8">
                 <Card className="border-none bg-zinc-950 text-white rounded-xl p-10 space-y-10 shadow-2xl">
                    <div className="flex justify-between items-start">
                        <div className="p-3 bg-zinc-900 rounded-2xl border border-zinc-800">
                            <TrendingUp size={24} className="text-green-500" />
                        </div>
                        <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Gross Revenue</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest leading-none">Total Inflow • PKR</p>
                        <p className="text-4xl font-black font-mono tracking-tighter text-white mt-2">{revenue.toLocaleString()}</p>
                    </div>
                    <div className="pt-4 border-t border-zinc-900 flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-zinc-500">
                        <Activity size={10} className="text-green-500" /> Performance Indexed
                    </div>
                </Card>

                <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-xl p-10 space-y-10 shadow-xl">
                    <div className="flex justify-between items-start">
                        <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                            <TrendingDown size={24} className="text-red-500" />
                        </div>
                        <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Global Expense</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest leading-none">Operational Burn • PKR</p>
                        <p className="text-4xl font-black font-mono tracking-tighter text-zinc-950 dark:text-zinc-50 mt-2">{expenses.toLocaleString()}</p>
                    </div>
                    <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-zinc-400">
                        <Activity size={10} className="text-red-500 rotate-180" /> Capital Consumption Verified
                    </div>
                </Card>

                <Card className="border-none bg-zinc-100 dark:bg-zinc-900 rounded-xl p-10 space-y-10 flex flex-col justify-center items-center">
                    <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Estimated Group Margin</p>
                    <p className={`text-5xl font-black font-mono tracking-tighter ${(revenue - expenses) >= 0 ? "text-green-600" : "text-red-600"}`}>
                        PKR {(revenue - expenses).toLocaleString()}
                    </p>
                    <p className="text-[9px] font-black uppercase text-zinc-500 tracking-widest mt-4">ABH Holdings Consolidated Ledger</p>
                </Card>
            </div>
        </div>
    );
}
