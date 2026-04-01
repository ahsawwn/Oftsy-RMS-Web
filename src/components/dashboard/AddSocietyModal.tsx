"use client";

import { useActionState, useEffect } from "react";
import { Building2, MapPin, Globe } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { createSocietyAction } from "@/app/dashboard/societies/actions";

interface AddSocietyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddSocietyModal({ isOpen, onClose }: AddSocietyModalProps) {
    const [state, formAction, isPending] = useActionState(createSocietyAction, null);

    useEffect(() => {
        if (state?.success) onClose();
    }, [state, onClose]);

    return (
        <Dialog 
            isOpen={isOpen} 
            onClose={onClose} 
            title="Register Society" 
            description="Infrastructure Expansion Protocol"
        >
            <form action={formAction} className="space-y-6 md:space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <div className="space-y-3 md:col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground/50 pl-1">Scheme Name</label>
                        <div className="relative">
                            <Building2 className="absolute left-4 top-4 text-foreground/30" size={16} />
                            <input
                                name="name"
                                required
                                placeholder="E.G. DHA PHASE 9 PRISM"
                                className="w-full pl-12 pr-5 py-4 bg-brand-secondary/30 border border-border/20 rounded-2xl text-[11px] font-black uppercase tracking-tight outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all placeholder:text-foreground/30 text-foreground"
                            />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground/50 pl-1">Global Location</label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-4 text-foreground/30" size={16} />
                            <input
                                name="location"
                                required
                                placeholder="LAHORE, PAKISTAN"
                                className="w-full pl-12 pr-5 py-4 bg-brand-secondary/30 border border-border/20 rounded-2xl text-[11px] font-black uppercase tracking-tight outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all placeholder:text-foreground/30 text-foreground"
                            />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground/50 pl-1">Total Plot Quantum</label>
                        <input
                            name="totalPlots"
                            type="number"
                            required
                            placeholder="2500"
                            className="w-full px-5 py-4 bg-brand-secondary/30 border border-border/20 rounded-2xl text-[11px] font-black uppercase tracking-tight outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all placeholder:text-foreground/30 text-foreground"
                        />
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
                        {isPending ? "Syncing..." : "Initialize Society"}
                    </Button>
                </div>
            </form>
        </Dialog>
    );
}
