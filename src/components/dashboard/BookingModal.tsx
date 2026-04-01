"use client";

import { useActionState, useEffect, useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { 
    User, DollarSign, Calendar, 
    ShieldCheck, Activity, Wallet,
    TrendingUp, ArrowRight, Info
} from "lucide-react";
import { bookPropertyAction } from "@/app/dashboard/properties/booking-action";

interface Lead {
    id: string;
    name: string;
    phone: string;
}

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    propertyId: string;
    propertyName: string;
    propertyPrice: number;
    leads: Lead[];
}

export default function BookingModal({ 
    isOpen, 
    onClose, 
    propertyId, 
    propertyName, 
    propertyPrice,
    leads 
}: BookingModalProps) {
    const [downPayment, setDownPayment] = useState(Math.floor(propertyPrice * 0.2));
    const [months, setMonths] = useState(12);
    const [selectedLead, setSelectedLead] = useState("");

    // Calculate monthly installment preview
    const remainingBalance = propertyPrice - downPayment;
    const monthlyInstallment = Math.floor(remainingBalance / months);

    const handleAction = async () => {
        if (!selectedLead) return alert("Please select a lead to continue.");
        
        const result = await bookPropertyAction(
            propertyId,
            selectedLead,
            propertyPrice,
            downPayment,
            months
        );

        if (result.success) {
            onClose();
        } else {
            alert(result.message);
        }
    };

    return (
        <Dialog 
            isOpen={isOpen} 
            onClose={onClose} 
            title="Book Strategic Asset" 
            description="Asset Liquidation & Recovery Protocol"
        >
            <div className="space-y-8 py-4">
                {/* Visual Context Header */}
                <div className="p-6 bg-brand-secondary/30 rounded-3xl border border-border/10 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black uppercase text-foreground/40 tracking-widest leading-none mb-2">Subject Asset</p>
                        <h4 className="text-xl font-black uppercase tracking-tighter text-foreground">{propertyName}</h4>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black uppercase text-foreground/40 tracking-widest leading-none mb-2">Inventory Price</p>
                        <span className="text-lg font-black font-mono text-brand-primary">PKR {propertyPrice.toLocaleString()}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Lead Acquisition Link */}
                    <div className="space-y-3 md:col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground/50 pl-1 flex items-center gap-2">
                            <User size={12} className="text-brand-primary" /> Assign Acquisition Lead
                        </label>
                        <select 
                            value={selectedLead}
                            onChange={(e) => setSelectedLead(e.target.value)}
                            required
                            className="w-full px-6 py-4 bg-brand-secondary/30 border border-border/10 rounded-2xl text-[12px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-brand-primary/10 transition-all appearance-none cursor-pointer text-foreground"
                        >
                            <option value="">SELECT VERIFIED LEAD...</option>
                            {leads.map(lead => (
                                <option key={lead.id} value={lead.id}>{lead.name.toUpperCase()} ({lead.phone})</option>
                            ))}
                        </select>
                    </div>

                    {/* Capital Structures */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground/50 pl-1 flex items-center gap-2">
                            <Wallet size={12} /> Down Payment (PKR)
                        </label>
                        <div className="relative">
                            <span className="absolute left-6 top-4 text-[10px] font-black text-foreground/30">PKR</span>
                            <input
                                type="number"
                                value={downPayment}
                                onChange={(e) => setDownPayment(Number(e.target.value))}
                                className="w-full pl-16 pr-6 py-4 bg-white/50 dark:bg-black/20 border border-border/10 rounded-2xl text-[12px] font-black font-mono outline-none focus:ring-4 focus:ring-brand-primary/10 transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground/50 pl-1 flex items-center gap-2">
                            <Calendar size={12} /> Recovery Tenancy (Months)
                        </label>
                        <select 
                            value={months}
                            onChange={(e) => setMonths(Number(e.target.value))}
                            className="w-full px-6 py-4 bg-white/50 dark:bg-black/20 border border-border/10 rounded-2xl text-[12px] font-black font-mono outline-none focus:ring-4 focus:ring-brand-primary/10 transition-all appearance-none cursor-pointer text-foreground"
                        >
                            <option value={6}>06 MONTHS</option>
                            <option value={12}>12 MONTHS (DEFAULT)</option>
                            <option value={24}>24 MONTHS</option>
                            <option value={36}>36 MONTHS</option>
                        </select>
                    </div>
                </div>

                {/* Algorithmic Payout Preview */}
                <div className="p-8 bg-zinc-950 dark:bg-zinc-50 rounded-3xl text-white dark:text-zinc-950 space-y-6 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <TrendingUp size={80} />
                    </div>
                    
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] opacity-50">
                        <Activity size={14} /> Schedule Forecast
                    </div>

                    <div className="grid grid-cols-2 gap-8 divide-x divide-white/10 dark:divide-zinc-200">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase opacity-40">Monthly Recovery</p>
                            <p className="text-3xl font-black font-mono tracking-tighter">PKR {monthlyInstallment.toLocaleString()}</p>
                        </div>
                        <div className="pl-8 space-y-1">
                            <p className="text-[10px] font-black uppercase opacity-40">Remaining Debt</p>
                            <p className="text-3xl font-black font-mono tracking-tighter opacity-60">PKR {remainingBalance.toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-white/10 dark:border-zinc-200 flex items-center gap-2">
                        <ShieldCheck size={14} className="text-emerald-500" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Ledger entries will be automatically generated upon sync.</span>
                    </div>
                </div>

                {/* Regulatory Controls */}
                <div className="flex gap-4 pt-4">
                    <Button variant="outline" className="flex-1 h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest" onClick={onClose}>Abort Process</Button>
                    <Button 
                        onClick={handleAction}
                        className="flex-1 h-14 bg-foreground text-background rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-premium active:scale-[0.98]"
                    >
                        Execute Booking <ArrowRight size={16} className="ml-2" />
                    </Button>
                </div>
            </div>
        </Dialog>
    );
}
