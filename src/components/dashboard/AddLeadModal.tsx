"use client";

import { useActionState, useEffect } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { User, Phone, Mail, Zap, Globe, Building2 } from "lucide-react";
import { createLeadAction } from "@/app/dashboard/leads/actions";

interface Property {
    id: string;
    name: string;
}

export default function AddLeadModal({ 
    isOpen, 
    onClose,
    properties = []
}: { 
    isOpen: boolean; 
    onClose: () => void;
    properties?: Property[];
}) {
    const [state, formAction, isPending] = useActionState(createLeadAction, null);

    useEffect(() => {
        if (state?.success) onClose();
    }, [state, onClose]);

    return (
        <Dialog 
            isOpen={isOpen} 
            onClose={onClose} 
            title="Onboard Lead" 
            description="Strategic Lead Acquisition Protocol"
        >
            <form action={formAction} className="space-y-6 md:space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <div className="md:col-span-2 space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground/50 pl-1">Full Name / Prospect Identity</label>
                        <div className="relative">
                            <User className="absolute left-4 top-4 text-foreground/30" size={16} />
                            <input
                                name="name"
                                required
                                placeholder="E.G. MIAN SAADAT ALI"
                                className="w-full pl-12 pr-5 py-4 bg-brand-secondary/30 border border-border/20 rounded-2xl text-[11px] font-black uppercase tracking-tight outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all placeholder:text-foreground/30 text-foreground"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground/50 pl-1">Contact Protocol</label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-4 text-foreground/30" size={16} />
                            <input
                                name="phone"
                                required
                                placeholder="03XXXXXXXXX"
                                className="w-full pl-12 pr-5 py-4 bg-brand-secondary/30 border border-border/20 rounded-2xl text-[11px] font-black font-mono tracking-tight outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all placeholder:text-foreground/30 text-foreground"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground/50 pl-1">Digital Correspondence</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-4 text-foreground/30" size={16} />
                            <input
                                name="email"
                                type="email"
                                placeholder="CLIENT@ABH.COM"
                                className="w-full pl-12 pr-5 py-4 bg-brand-secondary/30 border border-border/20 rounded-2xl text-[11px] font-black uppercase tracking-tight outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all placeholder:text-foreground/30 text-foreground"
                            />
                        </div>
                    </div>

                    {/* Property Link */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground/50 pl-1">Involved Asset</label>
                        <div className="relative">
                            <Building2 className="absolute left-4 top-4 text-foreground/30" size={16} />
                            <select 
                                name="propertyId" 
                                className="w-full pl-12 pr-5 py-4 bg-brand-secondary/30 border border-border/20 rounded-2xl text-[11px] font-black uppercase tracking-tight outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all appearance-none cursor-pointer text-foreground"
                            >
                                <option value="">GENERAL INQUIRY (NO ASSET)</option>
                                {properties.map(p => (
                                    <option key={p.id} value={p.id}>{p.name.toUpperCase()}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground/50 pl-1">Acquisition Source</label>
                        <div className="relative">
                            <Globe className="absolute left-4 top-4 text-foreground/30" size={16} />
                            <select 
                                name="source" 
                                className="w-full pl-12 pr-5 py-4 bg-brand-secondary/30 border border-border/20 rounded-2xl text-[11px] font-black uppercase tracking-tight outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all appearance-none cursor-pointer text-foreground"
                            >
                                <option value="Direct Walk-in">Direct Walk-in</option>
                                <option value="Facebook Ads">Facebook Ads</option>
                                <option value="Zameen.com">Zameen.com</option>
                                <option value="Referral">Referral</option>
                            </select>
                        </div>
                    </div>
                </div>

                {state?.message && (
                    <p className={`text-center text-[10px] font-black uppercase tracking-widest ${state.success ? 'text-green-500' : 'text-red-500'}`}>
                        {state.message}
                    </p>
                )}

                <div className="pt-6 border-t border-border/10 flex gap-4">
                    <Button type="button" variant="outline" className="flex-1 h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest" onClick={onClose}>
                        Abort
                    </Button>
                    <Button type="submit" disabled={isPending} className="flex-1 h-14 rounded-2xl bg-foreground text-background text-[10px] font-black uppercase tracking-widest shadow-2xl active:scale-95 disabled:opacity-50 font-bold">
                        {isPending ? "Syncing..." : "Onboard Lead"}
                    </Button>
                </div>
            </form>
        </Dialog>
    );
}
