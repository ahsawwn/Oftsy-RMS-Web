"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Plus, Filter } from "lucide-react";
import AddPropertyModal from "./AddPropertyModal";

export default function InventoryHeader({ societies = [] }: { societies?: any[] }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-100 dark:border-zinc-800 pb-8 gap-6">
            <div className="space-y-1">
                <h1 className="text-4xl font-black tracking-tighter uppercase text-zinc-950 dark:text-zinc-50">Global Inventory</h1>
                <p className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-400">ABH Holdings • Real Estate Asset Ledger</p>
            </div>
            <div className="flex gap-3">
                <Button variant="outline" className="text-[10px] uppercase font-black tracking-widest px-6" icon={Filter}>Refine</Button>
                <Button 
                    onClick={() => setIsOpen(true)}
                    className="bg-zinc-950 text-white text-[10px] uppercase font-black tracking-widest px-6" 
                    icon={Plus}
                >
                    Add Asset
                </Button>
            </div>
            <AddPropertyModal 
                isOpen={isOpen} 
                onClose={() => setIsOpen(false)} 
                societies={societies}
            />
        </div>
    );
}

