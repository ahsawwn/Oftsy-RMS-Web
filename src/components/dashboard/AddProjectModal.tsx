"use client";

import { useActionState, useEffect } from "react";
import { Hammer, Calendar, User, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { createProjectAction } from "@/app/dashboard/construction/actions";

export default function AddProjectModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [state, formAction, isPending] = useActionState(createProjectAction, null);

    useEffect(() => {
        if (state?.success) onClose();
    }, [state, onClose]);

    return (
        <Dialog 
            isOpen={isOpen} 
            onClose={onClose} 
            title="Initialize Site" 
            description="ABH Infrastructure Deployment Protocol"
        >
            <form action={formAction} className="space-y-6 md:space-y-8">
                <div className="space-y-6">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground/50 pl-1">Project Landmark</label>
                        <div className="relative">
                            <Hammer className="absolute left-4 top-4 text-foreground/30" size={16} />
                            <input
                                name="name"
                                required
                                placeholder="E.G. ABH RESIDENTIAL COMPLEX PHASE IV"
                                className="w-full pl-12 pr-5 py-4 bg-brand-secondary/30 border border-border/20 rounded-2xl text-[11px] font-black uppercase tracking-tight outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all placeholder:text-foreground/30 text-foreground"
                            />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-foreground/50 pl-1">Deployment Phase</label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-4 text-foreground/30" size={16} />
                                <input
                                    name="startDate"
                                    type="date"
                                    required
                                    className="w-full pl-12 pr-5 py-4 bg-brand-secondary/30 border border-border/20 rounded-2xl text-[11px] font-black uppercase tracking-tight outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all text-foreground"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-foreground/50 pl-1">Site Supervisor</label>
                            <div className="relative">
                                <User className="absolute left-4 top-4 text-foreground/30" size={16} />
                                <input
                                    name="contractor"
                                    required
                                    placeholder="ENG. SAEED AHMED"
                                    className="w-full pl-12 pr-5 py-4 bg-brand-secondary/30 border border-border/20 rounded-2xl text-[11px] font-black uppercase tracking-tight outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all placeholder:text-foreground/30 text-foreground"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {state?.message && (
                    <p className={`text-center text-[10px] font-black uppercase tracking-widest ${state.success ? 'text-green-500' : 'text-red-500'}`}>
                        {state.message}
                    </p>
                )}

                <div className="pt-6 border-t border-border/10 flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={onClose} className="h-14 px-10 rounded-2xl text-[10px] font-black uppercase tracking-widest">Abort</Button>
                    <Button type="submit" disabled={isPending} className="h-14 px-10 bg-foreground text-background rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl active:scale-95 disabled:opacity-50 font-bold">
                        {isPending ? "Syncing..." : "Initialize Site"}
                    </Button>
                </div>
            </form>
        </Dialog>
    );
}
