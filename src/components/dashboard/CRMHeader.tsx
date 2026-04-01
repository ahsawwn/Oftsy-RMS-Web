"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { UserPlus, Activity } from "lucide-react";
import AddLeadModal from "./AddLeadModal";

export default function CRMHeader({ totalLeads, properties = [] }: { totalLeads: number, properties?: any[] }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex flex-col lg:flex-row lg:items-end justify-between border-b border-zinc-200 dark:border-zinc-800 pb-10 gap-8">
            <div className="space-y-2">
                <h1 className="text-5xl font-black tracking-tighter uppercase text-zinc-950 dark:text-zinc-50 leading-none">
                    CRM Pipeline
                </h1>
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-2">
                    <Activity size={14} className="text-zinc-400" />
                    Buyer Conversion Workflow • ABH Holdings
                </p>
            </div>
            
            <div className="flex items-center gap-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2 rounded-2xl shadow-sm">
                <div className="px-6 py-2 border-r border-zinc-200 dark:border-zinc-800 text-right">
                    <p className="text-[9px] font-black uppercase text-zinc-400 tracking-widest leading-none">Total Inquiries</p>
                    <p className="text-xl font-black font-mono mt-1">{totalLeads.toString().padStart(2, '0')}</p>
                </div>
                <div className="px-4">
                    <Button 
                        onClick={() => setIsOpen(true)}
                        className="bg-zinc-950 text-white text-[10px] font-black uppercase tracking-widest px-6" 
                        icon={UserPlus}
                    >
                        Onboard Lead
                    </Button>
                </div>
            </div>
            <AddLeadModal 
                isOpen={isOpen} 
                onClose={() => setIsOpen(false)} 
                properties={properties}
            />
        </div>
    );
}

