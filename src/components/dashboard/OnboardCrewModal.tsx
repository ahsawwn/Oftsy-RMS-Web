"use client";

import { useActionState, useEffect } from "react";
import { X, HardHat, Users, ShieldCheck, Activity, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { onboardLaborAction } from "@/app/dashboard/construction/actions";

interface OnboardCrewModalProps {
    isOpen: boolean;
    onClose: () => void;
    projects: { id: string, title: string }[];
}

export default function OnboardCrewModal({ isOpen, onClose, projects }: OnboardCrewModalProps) {
    const [state, formAction, isPending] = useActionState(onboardLaborAction, null);

    useEffect(() => {
        if (state?.success) onClose();
    }, [state, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-background/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
            <div className="relative w-full max-w-xl bg-background rounded-[2.5rem] border border-border/40 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-8 md:p-10 border-b border-border/10 flex items-center justify-between bg-brand-secondary/10">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-2xl bg-green-600 flex items-center justify-center text-background">
                                <Users size={18} />
                            </div>
                            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-foreground">Crew Onboarding</h2>
                        </div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-foreground/40 pl-14">Workforce Deployment Protocol</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-brand-secondary/50 rounded-xl transition-colors text-foreground/40">
                        <X size={20} />
                    </button>
                </div>

                <form action={formAction} className="p-8 md:p-10 space-y-6 md:space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        <div className="space-y-3 md:col-span-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-foreground/50 pl-1">Contractor / Lead Name</label>
                            <input
                                name="contractorName"
                                required
                                placeholder="e.g. Master Hanif Structure"
                                className="w-full px-5 py-4 bg-brand-secondary/30 border border-border/20 rounded-2xl text-[11px] font-black uppercase tracking-tight outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all placeholder:text-foreground/30 text-foreground"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-foreground/50 pl-1">Labor Skill Class</label>
                            <select name="workType" required className="w-full px-5 py-4 bg-brand-secondary/30 border border-border/20 rounded-2xl text-[11px] font-black uppercase tracking-tight outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all appearance-none cursor-pointer text-foreground">
                                <option value="Structure & Foundation">Structure & Foundation</option>
                                <option value="Plumbing & MEP">Plumbing & MEP</option>
                                <option value="Electrical Layout">Electrical Layout</option>
                                <option value="Paint & Finishing">Paint & Finishing</option>
                            </select>
                        </div>
                         <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-foreground/50 pl-1">Deployment Location</label>
                            <select name="projectId" required className="w-full px-5 py-4 bg-brand-secondary/30 border border-border/20 rounded-2xl text-[11px] font-black uppercase tracking-tight outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all appearance-none cursor-pointer text-foreground font-mono">
                                <option value="">Select location...</option>
                                {projects.map(p => (
                                    <option key={p.id} value={p.id}>{p.title}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-foreground/50 pl-1">Initial Headcount</label>
                            <input
                                name="attendanceCount"
                                type="number"
                                placeholder="12"
                                className="w-full px-5 py-4 bg-brand-secondary/30 border border-border/20 rounded-2xl text-[11px] font-black uppercase tracking-tight outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all placeholder:text-foreground/30 text-foreground"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-foreground/50 pl-1">Contract Valuation (PKR)</label>
                            <input
                                name="totalContractValue"
                                type="number"
                                required
                                placeholder="1500000"
                                className="w-full px-5 py-4 bg-brand-secondary/30 border border-border/20 rounded-2xl text-[11px] font-black font-mono tracking-tight outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all placeholder:text-foreground/30 text-foreground"
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
                        <Button type="submit" disabled={isPending} className="h-14 px-10 bg-green-600 text-background rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl active:scale-95 disabled:opacity-50">
                            {isPending ? "Syncing..." : "Deploy Workforce"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
