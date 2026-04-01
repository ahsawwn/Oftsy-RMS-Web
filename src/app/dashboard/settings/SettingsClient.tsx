"use client";

import { useActionState, useEffect } from "react";
import { updateSettingsAction } from "./actions";
import { 
    Building2, MapPin, Phone, Mail, 
    Hash, Globe, Save, RefreshCcw, 
    ShieldCheck, Activity, Box
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function SettingsClient({ initialSettings }: { initialSettings: any }) {
    const [state, formAction, isPending] = useActionState(updateSettingsAction, null);

    return (
        <div className="space-y-12 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Settings Executive Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between border-b border-border/40 pb-10 gap-8">
                <div className="space-y-2 text-center lg:text-left">
                    <h1 className="text-5xl font-black tracking-tighter uppercase text-zinc-950 dark:text-zinc-50 leading-none">
                        Terminal Settings
                    </h1>
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] flex items-center justify-center lg:justify-start gap-2">
                        <ShieldCheck size={14} className="text-brand-primary" />
                        System Core • Corporate Identity Atlas
                    </p>
                </div>
                
                <div className="flex items-center gap-4 bg-brand-secondary/30 border border-border/10 p-2 rounded-[2rem] shadow-premium">
                    <div className="px-8 py-2 border-r border-border/20 text-right">
                        <p className="text-[9px] font-black uppercase text-foreground/30 tracking-widest leading-none">System Integrity</p>
                        <p className="text-xl font-black font-mono mt-1 text-emerald-500">OPTIMAL</p>
                    </div>
                    <div className="px-4 text-[10px] font-black uppercase text-foreground/40 tracking-[0.2em]">
                        ABH RMS v4.0.21
                    </div>
                </div>
            </div>

            <form action={formAction} className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Visual Identity Section */}
                <div className="xl:col-span-4 space-y-8">
                    <div className="premium-card p-8 text-center space-y-6">
                        <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 border-b border-border/5 pb-4">Digital Signature / Logo</p>
                        <div className="size-32 mx-auto bg-brand-secondary/50 rounded-full border-2 border-dashed border-border/20 flex items-center justify-center group overflow-hidden relative">
                             {initialSettings?.logoUrl ? (
                                <img src={initialSettings.logoUrl} className="size-full object-contain p-4" />
                             ) : (
                                <Building2 size={40} className="text-foreground/10 group-hover:scale-110 transition-transform" />
                             )}
                        </div>
                        <input
                            name="logoUrl"
                            defaultValue={initialSettings?.logoUrl || ""}
                            placeholder="URL TO LOGO SOURCE..."
                            className="w-full px-4 py-3 bg-brand-secondary/30 border border-border/10 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-brand-primary/5"
                        />
                        <p className="text-[9px] font-black uppercase text-foreground/20 leading-relaxed italic">Transparent PNG recommended • Resolution 512x512</p>
                    </div>

                    <div className="premium-card p-8 space-y-6">
                        <div className="flex items-center gap-3 text-brand-primary">
                            <Activity size={18} />
                            <h3 className="text-lg font-black uppercase tracking-tighter">Diagnostic Stream</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="p-4 bg-brand-secondary/20 rounded-2xl border border-border/5 flex justify-between items-center text-[11px] font-black uppercase tracking-widest">
                                <span className="text-foreground/40">Last Updated</span>
                                <span className="text-foreground/70">{initialSettings?.updatedAt ? new Date(initialSettings.updatedAt).toLocaleDateString() : 'INITIAL'}</span>
                            </div>
                            <div className="p-4 bg-brand-secondary/20 rounded-2xl border border-border/5 flex justify-between items-center text-[11px] font-black uppercase tracking-widest">
                                <span className="text-foreground/40">Data Encryption</span>
                                <span className="text-emerald-500">AES-256</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Primary Data Matrix */}
                <div className="xl:col-span-8 flex flex-col gap-8">
                    <div className="premium-card p-10 space-y-10 group">
                        <div className="flex items-center gap-4 border-b border-border/5 pb-8">
                            <div className="size-12 rounded-2xl bg-brand-primary/5 border border-brand-primary/10 flex items-center justify-center text-brand-primary group-hover:scale-110 transition-transform">
                                <Box size={24} />
                            </div>
                            <div className="space-y-1">
                                <h2 className="text-3xl font-black tracking-tighter uppercase leading-none">Corporate Dossier</h2>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30">Official entity credentials & contact protocol</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             <div className="space-y-3 md:col-span-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/50 pl-1 flex items-center gap-2">
                                    <Building2 size={12} /> Registered Entity Name
                                </label>
                                <input
                                    name="name"
                                    required
                                    defaultValue={initialSettings?.name || "ABH HOLDINGS"}
                                    className="w-full px-6 py-4 bg-brand-secondary/30 border border-border/10 rounded-2xl text-[12px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-brand-primary/10 transition-all"
                                />
                             </div>

                             <div className="space-y-3 md:col-span-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/50 pl-1 flex items-center gap-2">
                                    <Globe size={12} /> Strategic Slogan / Tagline
                                </label>
                                <input
                                    name="tagline"
                                    defaultValue={initialSettings?.tagline || ""}
                                    placeholder="E.G. EXCELLENCE IN INFRASTRUCTURE"
                                    className="w-full px-6 py-4 bg-brand-secondary/30 border border-border/10 rounded-2xl text-[11px] font-black uppercase tracking-tight outline-none focus:ring-4 focus:ring-brand-primary/10 transition-all font-serif italic"
                                />
                             </div>

                             <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/50 pl-1 flex items-center gap-2">
                                    <Phone size={12} /> Hot-Line Protocol
                                </label>
                                <input
                                    name="phone"
                                    defaultValue={initialSettings?.phone || ""}
                                    placeholder="+92 XXX XXXXXXX"
                                    className="w-full px-6 py-4 bg-brand-secondary/30 border border-border/10 rounded-2xl text-[11px] font-black font-mono tracking-widest outline-none focus:ring-4 focus:ring-brand-primary/10 transition-all"
                                />
                             </div>

                             <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/50 pl-1 flex items-center gap-2">
                                    <Mail size={12} /> Digital Correspondence
                                </label>
                                <input
                                    name="email"
                                    type="email"
                                    defaultValue={initialSettings?.email || ""}
                                    placeholder="INFO@ABH.COM"
                                    className="w-full px-6 py-4 bg-brand-secondary/30 border border-border/10 rounded-2xl text-[11px] font-black uppercase outline-none focus:ring-4 focus:ring-brand-primary/10 transition-all"
                                />
                             </div>

                             <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/50 pl-1 flex items-center gap-2">
                                    <Hash size={12} /> Tax Identification (NTN)
                                </label>
                                <input
                                    name="ntn"
                                    defaultValue={initialSettings?.ntn || ""}
                                    placeholder="NTN-XXXXX-X"
                                    className="w-full px-6 py-4 bg-brand-secondary/30 border border-border/10 rounded-2xl text-[11px] font-black font-mono tracking-widest outline-none focus:ring-4 focus:ring-brand-primary/10 transition-all"
                                />
                             </div>

                             <div className="space-y-3 md:col-span-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/50 pl-1 flex items-center gap-2">
                                    <MapPin size={12} /> Physical Nexus / Address
                                </label>
                                <textarea
                                    name="address"
                                    rows={3}
                                    defaultValue={initialSettings?.address || ""}
                                    placeholder="REGISTERED OFFICE ADDRESS..."
                                    className="w-full px-6 py-5 bg-brand-secondary/30 border border-border/10 rounded-[2rem] text-[11px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-brand-primary/10 transition-all resize-none"
                                />
                             </div>
                        </div>

                        {state?.message && (
                            <div className={`p-4 rounded-xl text-center text-[10px] font-black uppercase tracking-widest border border-border/10 animate-in fade-in slide-in-from-top-2 duration-500 ${state.success ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                {state.message}
                            </div>
                        )}

                        <div className="pt-8 border-t border-border/5 flex justify-end gap-5">
                            <Button type="button" variant="outline" className="h-14 px-12 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest">Revert</Button>
                            <Button type="submit" disabled={isPending} className="h-14 px-12 bg-foreground text-background rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-premium active:scale-[0.98] disabled:opacity-50" icon={isPending ? RefreshCcw : Save}>
                                {isPending ? "Syncing Dossier..." : "Synchronize System Data"}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
