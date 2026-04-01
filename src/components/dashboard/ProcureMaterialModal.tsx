"use client";

import { useActionState, useEffect } from "react";
import { Truck, Package, Hammer, MapPin, Search, Activity } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { procureMaterialAction } from "@/app/dashboard/construction/actions";

interface ProcureMaterialModalProps {
    isOpen: boolean;
    onClose: () => void;
    projects: { id: string, title: string }[];
}

export default function ProcureMaterialModal({ isOpen, onClose, projects }: ProcureMaterialModalProps) {
    const [state, formAction, isPending] = useActionState(procureMaterialAction, null);

    useEffect(() => {
        if (state?.success) onClose();
    }, [state, onClose]);

    return (
        <Dialog 
            isOpen={isOpen} 
            onClose={onClose} 
            title="Procure Inventory" 
            description="Supply Chain Audit Transaction"
        >
            <form action={formAction} className="space-y-6 md:space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <div className="space-y-3 md:col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground/50 pl-1">Consumable Asset</label>
                        <div className="relative">
                            <Package className="absolute left-4 top-4 text-foreground/30" size={16} />
                            <input
                                name="item"
                                required
                                placeholder="E.G. STEEL REINFORCEMENT, CEMENT, BRICKS"
                                className="w-full pl-12 pr-5 py-4 bg-brand-secondary/30 border border-border/20 rounded-2xl text-[11px] font-black uppercase tracking-tight outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all placeholder:text-foreground/30 text-foreground"
                            />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground/50 pl-1">Quantum Quantity</label>
                        <div className="relative">
                            <Activity className="absolute left-4 top-4 text-foreground/30" size={16} />
                            <input
                                name="quantity"
                                type="number"
                                required
                                placeholder="10"
                                className="w-full pl-12 pr-5 py-4 bg-brand-secondary/30 border border-border/20 rounded-2xl text-[11px] font-black uppercase tracking-tight outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all text-foreground"
                            />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground/50 pl-1">Unit Type</label>
                        <select name="unit" required className="w-full px-5 py-4 bg-brand-secondary/30 border border-border/20 rounded-2xl text-[11px] font-black uppercase tracking-tight outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all appearance-none cursor-pointer text-foreground">
                            <option value="Tons">TONS (TON)</option>
                            <option value="Bags">BAGS (BAG)</option>
                            <option value="Nos">UNITS (NOS)</option>
                            <option value="Square Ft">AREA (SQ. FT)</option>
                        </select>
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground/50 pl-1">Total Debit (PKR)</label>
                        <div className="relative">
                            <span className="absolute left-4 top-4 text-[10px] font-black text-foreground/20">PKR</span>
                            <input
                                name="totalCost"
                                type="number"
                                required
                                placeholder="1250000"
                                className="w-full pl-12 pr-5 py-4 bg-brand-secondary/30 border border-border/20 rounded-2xl text-[11px] font-black font-mono tracking-tight outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all text-foreground"
                            />
                        </div>
                    </div>
                     <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground/50 pl-1">Allocation Target</label>
                        <div className="relative">
                            <Hammer className="absolute left-4 top-4 text-foreground/30" size={16} />
                            <select name="projectId" required className="w-full pl-12 pr-5 py-4 bg-brand-secondary/30 border border-border/20 rounded-2xl text-[11px] font-black uppercase tracking-tight outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all appearance-none cursor-pointer text-foreground">
                                <option value="">SELECT PROJECT...</option>
                                {projects.map(p => (
                                    <option key={p.id} value={p.id}>{p.title.toUpperCase()}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {state?.message && (
                    <p className={`text-center text-[10px] font-black uppercase tracking-widest ${state.success ? 'text-green-500' : 'text-red-500'}`}>
                        {state.message}
                    </p>
                )}

                <div className="pt-6 border-t border-border/10 flex justify-end gap-4">
                    <Button variant="outline" onClick={onClose} type="button" className="h-14 px-10 rounded-2xl text-[10px] font-black uppercase tracking-widest">Abort</Button>
                    <Button type="submit" disabled={isPending} className="h-14 px-10 bg-foreground text-background rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl active:scale-95 disabled:opacity-50 font-bold">
                        {isPending ? "Syncing..." : "Process Order"}
                    </Button>
                </div>
            </form>
        </Dialog>
    );
}
