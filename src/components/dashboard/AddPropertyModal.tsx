"use client";

import { useActionState, useEffect, useState } from "react";
import { createPropertyAction } from "@/app/dashboard/properties/actions";
import { Building2, MapPin, Wallet, Tag, Hash } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { db } from "@/lib/db"; // Note: This will fail on client, need to pass societies as props or fetch via action

interface Society {
    id: string;
    name: string;
}

export default function AddPropertyModal({ 
    isOpen, 
    onClose,
    societies = []
}: { 
    isOpen: boolean; 
    onClose: () => void;
    societies?: Society[];
}) {
    const [state, formAction, isPending] = useActionState(createPropertyAction, null);

    useEffect(() => {
        if (state?.success) onClose();
    }, [state, onClose]);

    return (
        <Dialog 
            isOpen={isOpen} 
            onClose={onClose} 
            title="Register Asset" 
            description="ABH Inventory Expansion Protocol"
        >
            <form action={formAction} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Property Name */}
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground/50 pl-1">Project / Plot Name</label>
                        <div className="relative">
                            <Building2 className="absolute left-4 top-4 text-foreground/30" size={16} />
                            <input
                                name="name"
                                required
                                placeholder="E.G. ABH HEIGHTS PHASE II"
                                className="w-full pl-12 pr-5 py-4 bg-brand-secondary/30 border border-border/20 rounded-2xl text-[11px] font-black uppercase tracking-tight outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all placeholder:text-foreground/30 text-foreground"
                            />
                        </div>
                        {state?.errors?.name && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest pl-1">{state.errors.name[0]}</p>}
                    </div>

                    {/* Plot Number */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground/50 pl-1">Plot Number (Optional)</label>
                        <div className="relative">
                            <Hash className="absolute left-4 top-4 text-foreground/30" size={16} />
                            <input
                                name="plotNumber"
                                placeholder="E.G. 122-G"
                                className="w-full pl-12 pr-5 py-4 bg-brand-secondary/30 border border-border/20 rounded-2xl text-[11px] font-black uppercase tracking-tight outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all placeholder:text-foreground/30 text-foreground"
                            />
                        </div>
                    </div>

                    {/* Society Link */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground/50 pl-1">Parent Society</label>
                        <select name="societyId" className="w-full px-5 py-4 bg-brand-secondary/30 border border-border/20 rounded-2xl text-[11px] font-black uppercase tracking-tight outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all appearance-none cursor-pointer text-foreground">
                            <option value="">GLOBAL (NO SOCIETY)</option>
                            {societies.map(s => (
                                <option key={s.id} value={s.id}>{s.name.toUpperCase()}</option>
                            ))}
                        </select>
                    </div>

                    {/* Geographic Location */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground/50 pl-1">Geographic Location</label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-4 text-foreground/30" size={16} />
                            <input
                                name="location"
                                required
                                placeholder="SECTOR G-11, ISLAMABAD"
                                className="w-full pl-12 pr-5 py-4 bg-brand-secondary/30 border border-border/20 rounded-2xl text-[11px] font-black uppercase tracking-tight outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all placeholder:text-foreground/30 text-foreground"
                            />
                        </div>
                    </div>

                    {/* Asset Classification */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground/50 pl-1">Asset Classification</label>
                        <select name="type" className="w-full px-5 py-4 bg-brand-secondary/30 border border-border/20 rounded-2xl text-[11px] font-black uppercase tracking-tight outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all appearance-none cursor-pointer text-foreground">
                            <option value="Residential">Residential</option>
                            <option value="Commercial">Commercial</option>
                            <option value="Villa">Villa</option>
                        </select>
                    </div>

                    {/* Market Valuation */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground/50 pl-1">Market Valuation (PKR)</label>
                        <div className="relative">
                            <Wallet className="absolute left-4 top-4 text-foreground/30" size={16} />
                            <input
                                name="price"
                                type="number"
                                required
                                placeholder="45000000"
                                className="w-full pl-12 pr-5 py-4 bg-brand-secondary/30 border border-border/20 rounded-2xl text-[11px] font-black font-mono tracking-tight outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all text-foreground"
                            />
                        </div>
                    </div>

                    {/* Initial Status */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground/50 pl-1">Initial Status</label>
                        <select name="status" className="w-full px-5 py-4 bg-brand-secondary/30 border border-border/20 rounded-2xl text-[11px] font-black uppercase tracking-tight outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all appearance-none cursor-pointer text-foreground">
                            <option value="Available">Available</option>
                            <option value="Under Construction">Under Construction</option>
                            <option value="Sold Out">Sold Out</option>
                        </select>
                    </div>
                </div>

                {state?.message && (
                    <p className={`text-center text-[10px] font-black uppercase tracking-widest ${state.success ? 'text-green-500' : 'text-red-500'}`}>
                        {state.message}
                    </p>
                )}

                <div className="pt-6 border-t border-border/10 flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={onClose} className="h-12 px-8 rounded-xl text-[10px] font-black uppercase tracking-widest">Abort</Button>
                    <Button type="submit" disabled={isPending} className="h-12 px-8 bg-foreground text-background rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl active:scale-95 disabled:opacity-50 font-bold">
                        {isPending ? "Syncing..." : "Initialize Asset"}
                    </Button>
                </div>
            </form>
        </Dialog>
    );
}