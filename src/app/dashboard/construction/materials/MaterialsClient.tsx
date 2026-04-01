"use client";

import { useState } from "react";
import { Hammer, Truck, Package, Activity, Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatPKT } from "@/lib/utils/date-utils";
import ProcureMaterialModal from "@/components/dashboard/ProcureMaterialModal";

interface Material {
    id: string;
    item: string;
    quantity: number;
    unit: string;
    vendor: string | null;
    totalCost: number;
    date: Date;
    projectTitle: string | null;
}

export default function MaterialsClient({ initialMaterials, projects }: { 
    initialMaterials: Material[], 
    projects: { id: string, title: string }[] 
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="space-y-12 pb-20 animate-in fade-in duration-1000">
            {/* Materials Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between border-b border-zinc-200 dark:border-zinc-800 pb-10 gap-8">
                <div className="space-y-2">
                    <h1 className="text-5xl font-black tracking-tighter uppercase text-zinc-950 dark:text-zinc-50 leading-none">
                        Material Depot
                    </h1>
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-2">
                        <Truck size={14} className="text-zinc-400" />
                        Supply Chain Governance • ABH Builder Ledger
                    </p>
                </div>
                
                <div className="flex items-center gap-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2 rounded-2xl shadow-sm">
                    <div className="px-6 py-2 border-r border-zinc-200 dark:border-zinc-800 text-right">
                        <p className="text-[9px] font-black uppercase text-zinc-400 tracking-widest leading-none">Inventory Value</p>
                        <p className="text-xl font-black font-mono mt-1 whitespace-nowrap">PKR {initialMaterials.reduce((sum, m) => sum + (m.totalCost || 0), 0).toLocaleString()}</p>
                    </div>
                    <div className="px-4">
                        <Button onClick={() => setIsModalOpen(true)} className="bg-zinc-950 text-white text-[10px] font-black uppercase tracking-widest px-8" icon={Plus}>Procure</Button>
                    </div>
                </div>
            </div>

            {/* High Density Inventory Table */}
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-950 shadow-2xl shadow-zinc-200/50 dark:shadow-none">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                        <tr>
                            <th className="px-8 py-6">Consumable Item</th>
                            <th className="px-8 py-6">Quantum / Unit</th>
                            <th className="px-8 py-6">Supply Source</th>
                            <th className="px-8 py-6">Linked Asset</th>
                            <th className="px-8 py-6 text-right">Debit Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                        {initialMaterials.map((m) => (
                            <tr key={m.id} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-900/40 transition-all cursor-pointer">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-3">
                                        <div className="size-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
                                            <Package size={14} />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-black uppercase text-zinc-950 dark:text-zinc-50 tracking-tight leading-none">{m.item}</p>
                                            <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest mt-1">{formatPKT(m.date!, "dd MMM yyyy")}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <p className="text-sm font-black font-mono tracking-tighter text-zinc-950 dark:text-zinc-50">{m.quantity} {m.unit}</p>
                                    <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Verified Stock</p>
                                </td>
                                <td className="px-8 py-6">
                                    <p className="text-[10px] font-black uppercase tracking-tight text-zinc-700 dark:text-zinc-300 leading-none">{m.vendor}</p>
                                    <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest mt-1">Authorized Vendor</p>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-2 text-zinc-500">
                                        <div className="size-2 rounded-full bg-green-500" />
                                        <span className="text-[10px] font-black uppercase tracking-tight">{m.projectTitle}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-right font-black">
                                    <p className="text-sm font-black font-mono tracking-tighter">PKR {m.totalCost.toLocaleString()}</p>
                                    <div className="flex items-center justify-end gap-1.5 text-[8px] font-black text-zinc-400 uppercase">
                                        <Activity size={10} /> Consumed
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <ProcureMaterialModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} projects={projects} />
        </div>
    );
}
