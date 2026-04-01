import { db } from "@/lib/db";
import { bankAccounts, officeExpenses } from "@/lib/db/schema";
import { count, desc, eq, sql } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { 
    Landmark, Wallet, PieChart, ArrowUpRight, 
    TrendingUp, ExternalLink, MoreVertical,
    Activity, ShieldCheck, CreditCard, Clock,
    Plus, Download, Filter, Search
} from "lucide-react";
import { formatPKT } from "@/lib/utils/date-utils";

export default async function FinancePage() {
    const banks = await db.select().from(bankAccounts);
    const expenses = await db
        .select({
            id: officeExpenses.id,
            category: officeExpenses.category,
            description: officeExpenses.description,
            amount: officeExpenses.amount,
            date: officeExpenses.date,
            bankName: bankAccounts.bankName,
        })
        .from(officeExpenses)
        .leftJoin(bankAccounts, eq(officeExpenses.bankAccountId, bankAccounts.id))
        .orderBy(desc(officeExpenses.date))
        .limit(10);

    const totalLiquidity = banks.reduce((sum, b) => sum + (b.currentBalance || 0), 0);

    return (
        <div className="space-y-12 pb-20 animate-in fade-in duration-1000">
            {/* Corporate Finance Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between border-b border-zinc-200 dark:border-zinc-800 pb-10 gap-8">
                <div className="space-y-2">
                    <h1 className="text-5xl font-black tracking-tighter uppercase text-zinc-950 dark:text-zinc-50 leading-none">
                        Finance Suite
                    </h1>
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-2">
                        <ShieldCheck size={14} className="text-zinc-400" />
                        Audited Corporate Liquidity • ABH Holdings Ledger
                    </p>
                </div>
                
                <div className="flex items-center gap-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2 rounded-2xl shadow-sm">
                    <div className="px-6 py-2 border-r border-zinc-200 dark:border-zinc-800 text-right">
                        <p className="text-[9px] font-black uppercase text-zinc-400 tracking-widest leading-none">Net Liquidity</p>
                        <p className="text-xl font-black font-mono mt-1 whitespace-nowrap">PKR {totalLiquidity.toLocaleString()}</p>
                    </div>
                    <div className="px-4">
                        <Button className="bg-zinc-950 text-white text-[10px] font-black uppercase tracking-widest px-8" icon={Plus}>Add Expense</Button>
                    </div>
                </div>
            </div>

            {/* Bank Matrix Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {banks.map(bank => (
                    <Card key={bank.id} className="border-none bg-zinc-950 text-white rounded-xl p-8 space-y-8 shadow-2xl shadow-zinc-950/20">
                        <div className="flex justify-between items-start">
                            <div className="p-3 bg-zinc-900 rounded-2xl border border-zinc-800 shadow-sm">
                                <Landmark size={24} className="text-zinc-400" />
                            </div>
                            <div className="text-right">
                                <p className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">Digital Asset Ref</p>
                                <p className="text-[10px] font-black font-mono tracking-tighter">{bank.accountNumber}</p>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest leading-none">{bank.bankName}</p>
                            <p className="text-3xl font-black font-mono tracking-tighter">PKR {bank.currentBalance.toLocaleString()}</p>
                        </div>
                        <div className="pt-4 border-t border-zinc-900 flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-zinc-500">
                            <div className="flex items-center gap-2"> <Activity size={10} className="text-green-500" /> SYNCED PKT</div>
                            <button className="hover:text-white transition-colors">Transfer Internal</button>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Office Expense Matrix */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Recent Expenditure Audit</p>
                    <button className="text-[9px] font-black uppercase tracking-widest text-zinc-950 hover:underline">View Ledger Matrix</button>
                </div>

                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-950 shadow-2xl shadow-zinc-200/50 dark:shadow-none">
                    <table className="w-full text-left border-collapse font-sans">
                        <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                            <tr>
                                <th className="px-8 py-6">Transaction Ref</th>
                                <th className="px-8 py-6">Class / Category</th>
                                <th className="px-8 py-6">Audit Detail</th>
                                <th className="px-8 py-6">Routing Inst.</th>
                                <th className="px-8 py-6 text-right font-black">Debit Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                            {expenses.map((ex) => (
                                <tr key={ex.id} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-900/40 transition-all cursor-pointer">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
                                                <TrendingUp size={14} className="text-red-600 rotate-180" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-zinc-700 dark:text-zinc-300 tracking-tight">{formatPKT(ex.date!, "dd MMM yyyy")}</p>
                                                <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Final Settlement</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <Badge variant="outline" className="text-[8px] font-black px-2 py-0 h-5 uppercase tracking-widest border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                                            {ex.category}
                                        </Badge>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-[11px] font-black text-zinc-900 dark:text-zinc-50 uppercase tracking-tight leading-none truncate max-w-[250px]">{ex.description}</p>
                                        <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest mt-1">Authorized Entry</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                                            <Landmark size={12} className="text-zinc-400" />
                                            <span className="text-[10px] font-black uppercase tracking-tight">{ex.bankName || "Internal Cash"}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right font-black">
                                        <p className="text-sm font-black font-mono tracking-tighter">PKR {ex.amount?.toLocaleString()}</p>
                                        <div className="flex items-center justify-end gap-1 text-[8px] font-black text-red-600 uppercase">
                                            <Activity size={10} /> Deducting
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

import { Badge } from "@/components/ui/Badge";
