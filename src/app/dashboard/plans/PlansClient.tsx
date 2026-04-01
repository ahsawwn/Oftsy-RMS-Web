"use client";

import { useState } from "react";
import { Wallet, ReceiptText, Plus, ExternalLink, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import AddPlanModal from "@/components/dashboard/AddPlanModal";

interface Plan {
    id: string;
    totalPrice: number;
    downPayment: number;
    monthlyAmount: number;
    status: string | null;
    clientName: string | null;
    propertyName: string | null;
}

export default function PlansClient({ initialPlans }: { initialPlans: Plan[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="space-y-12 pb-20 animate-in fade-in duration-1000">
            {/* Recovery Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between border-b border-zinc-200 dark:border-zinc-800 pb-10 gap-8">
                <div className="space-y-2">
                    <h1 className="text-5xl font-black tracking-tighter uppercase text-zinc-950 dark:text-zinc-50 leading-none">
                        Active Recovery
                    </h1>
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-2">
                        <Wallet size={14} className="text-zinc-400" />
                        Strategic Debt Acquisition • ABH Holdings Ledger
                    </p>
                </div>
                
                <div className="flex items-center gap-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2 rounded-xl shadow-sm">
                    <div className="px-6 py-2 border-r border-zinc-200 dark:border-zinc-800 text-right">
                        <p className="text-[9px] font-black uppercase text-zinc-400 tracking-widest leading-none">Active Ledgers</p>
                        <p className="text-xl font-black font-mono mt-1">{initialPlans.length.toString().padStart(2, '0')}</p>
                    </div>
                    <div className="px-4">
                        <Button 
                            onClick={() => setIsModalOpen(true)}
                            className="bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950 text-[10px] font-black uppercase tracking-widest px-8" 
                            icon={Plus}
                        >
                            New Plan
                        </Button>
                    </div>
                </div>
            </div>

            {/* Plans High Density Table */}
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-950 shadow-2xl shadow-zinc-200/50 dark:shadow-none">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                        <tr>
                            <th className="px-8 py-6">Allottee / Asset</th>
                            <th className="px-8 py-6">Deal Structure</th>
                            <th className="px-8 py-6">Monthly Rec.</th>
                            <th className="px-8 py-6">Pipeline Class</th>
                            <th className="px-8 py-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                        {initialPlans.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-8 py-32 text-center text-zinc-300">
                                    <ReceiptText size={48} className="mx-auto mb-4 opacity-20" />
                                    <p className="text-[10px] font-black uppercase tracking-widest">No Active Pursuits</p>
                                </td>
                            </tr>
                        ) : (
                            initialPlans.map((item) => (
                                <tr key={item.id} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-900/40 transition-all cursor-pointer">
                                    <td className="px-8 py-6">
                                        <div className="space-y-1">
                                            <p className="text-[11px] font-black text-zinc-950 dark:text-zinc-50 uppercase tracking-tight leading-none">{item.clientName}</p>
                                            <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">{item.propertyName}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800 inline-block">
                                            <p className="text-[9px] font-black uppercase text-zinc-400 tracking-widest leading-none">Net Value</p>
                                            <p className="text-[11px] font-black font-mono tracking-tight mt-1">PKR {item.totalPrice.toLocaleString()}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-sm font-black font-mono tracking-tighter">PKR {item.monthlyAmount.toLocaleString()}</p>
                                        <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Calculated Installment</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <Badge variant="outline" className="text-[8px] font-black px-2 py-0 h-5 uppercase tracking-widest border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                                            {item.status}
                                        </Badge>
                                    </td>
                                    <td className="px-8 py-6 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="flex items-center justify-end gap-3">
                                            <button className="p-2 hover:bg-zinc-950 dark:hover:bg-zinc-50 hover:text-white dark:hover:text-zinc-950 rounded-lg transition-all text-zinc-400 shadow-sm border border-zinc-100">
                                                <ExternalLink size={14} />
                                            </button>
                                            <button className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg text-zinc-400">
                                                <MoreVertical size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <AddPlanModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}
