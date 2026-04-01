"use client";

import { useState } from "react";
import { Users, Clock, Plus } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import OnboardCrewModal from "@/components/dashboard/OnboardCrewModal";

interface Labor {
    id: string;
    contractor: string;
    workType: string | null;
    totalValue: number | null;
    paid: number | null;
    count: number | null;
    lastActivity: Date | null;
    projectTitle: string | null;
}

export default function LaborClient({ initialLabor, projects }: { 
    initialLabor: Labor[], 
    projects: { id: string, title: string }[] 
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="space-y-12 pb-20 animate-in fade-in duration-1000">
            {/* Labor Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between border-b border-zinc-200 dark:border-zinc-800 pb-10 gap-8">
                <div className="space-y-2">
                    <h1 className="text-5xl font-black tracking-tighter uppercase text-zinc-950 dark:text-zinc-50 leading-none">
                        Force Management
                    </h1>
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-2">
                        <Users size={14} className="text-zinc-400" />
                        Human Capital Payroll • ABH Workforce Ledger
                    </p>
                </div>
                
                <div className="flex items-center gap-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2 rounded-2xl shadow-sm">
                    <div className="px-6 py-2 border-r border-zinc-200 dark:border-zinc-800 text-right">
                        <p className="text-[9px] font-black uppercase text-zinc-400 tracking-widest leading-none">Workforce Strength</p>
                        <p className="text-xl font-black font-mono mt-1 whitespace-nowrap">{initialLabor.reduce((sum, l) => sum + (l.count || 0), 0).toString()}</p>
                    </div>
                    <div className="px-4">
                        <Button onClick={() => setIsModalOpen(true)} className="bg-zinc-950 text-white text-[10px] font-black uppercase tracking-widest px-8" icon={Plus}>Onboard Crew</Button>
                    </div>
                </div>
            </div>

            {/* Contractor Matrix Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {initialLabor.map((l) => {
                    const progress = l.totalValue ? Math.floor(((l.paid || 0) / Number(l.totalValue)) * 100) : 0;
                    return (
                        <Card key={l.id} className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-xl p-8 space-y-6 shadow-sm hover:shadow-xl transition-all">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <h3 className="text-xl font-black uppercase tracking-tighter text-zinc-950 dark:text-zinc-50">{l.contractor}</h3>
                                    <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-black uppercase tracking-widest leading-none">
                                        <Clock size={12} /> {l.workType} • {l.projectTitle}
                                    </div>
                                </div>
                                <Badge variant="outline" className="text-[9px] font-black uppercase px-3 py-1 bg-zinc-50 dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800">Verified Skills</Badge>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-6 pt-4 border-t border-zinc-50 dark:border-zinc-900">
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black uppercase text-zinc-400 tracking-widest leading-none">Contract</p>
                                    <p className="text-sm font-black font-mono tracking-tighter">PKR {l.totalValue?.toLocaleString()}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black uppercase text-zinc-400 tracking-widest leading-none">Paid Out</p>
                                    <p className="text-sm font-black font-mono tracking-tighter text-zinc-950 dark:text-zinc-50">PKR {l.paid?.toLocaleString()}</p>
                                </div>
                                <div className="space-y-1 text-right">
                                    <p className="text-[9px] font-black uppercase text-zinc-400 tracking-widest leading-none">Headcount</p>
                                    <p className="text-sm font-black font-mono tracking-tighter text-green-600">{l.count}</p>
                                </div>
                            </div>

                            <div className="space-y-3 pt-6">
                                <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-zinc-400">
                                    <span>Financial Disbursement Progress</span>
                                    <span>{progress}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden">
                                    <div className="h-full bg-zinc-950 dark:bg-zinc-50 rounded-full transition-all" style={{ width: `${progress}%` }} />
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>

            <OnboardCrewModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} projects={projects} />
        </div>
    );
}
