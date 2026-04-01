"use client";

import { useState } from "react";
import { 
    Building2, MapPin, Search, Plus, 
    Filter, MoreVertical, LayoutGrid, 
    Activity, Globe, PieChart, Landmark,
    ArrowUpRight, Layers, Box
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import AddSocietyModal from "@/components/dashboard/AddSocietyModal";
import Link from "next/link";

interface Society {
    id: string;
    name: string;
    location: string;
    totalPlots: number;
    createdAt: Date;
    linkedPlotCount?: number;
}

export default function SocietiesClient({ initialSocieties }: { initialSocieties: any[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredSocieties = initialSocieties.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        s.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-12 pb-24 animate-in fade-in duration-1000">
            {/* Societies Executive Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between border-b border-border/40 pb-10 gap-8">
                <div className="space-y-2 text-center lg:text-left">
                    <h1 className="text-5xl font-black tracking-tighter uppercase text-zinc-950 dark:text-zinc-50 leading-none">
                        Project Societies
                    </h1>
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] flex items-center justify-center lg:justify-start gap-2">
                        <Globe size={14} className="text-brand-primary" />
                        Infrastructure Hub • ABH holdings
                    </p>
                </div>
                
                <div className="flex items-center justify-between lg:justify-end gap-3 bg-brand-secondary/30 border border-border/10 p-2 rounded-[2rem] shadow-premium overflow-hidden">
                    <div className="px-8 py-2 border-r border-border/20 text-right">
                        <p className="text-[9px] font-black uppercase text-foreground/30 tracking-widest leading-none">Registered Clusters</p>
                        <p className="text-2xl font-black font-mono mt-1 text-foreground">{initialSocieties.length.toString().padStart(2, '0')}</p>
                    </div>
                    <div className="px-4">
                        <Button onClick={() => setIsModalOpen(true)} className="bg-foreground text-background text-[10px] font-black uppercase tracking-widest px-8 h-12 rounded-xl" icon={Plus}>Initialize Cluster</Button>
                    </div>
                </div>
            </div>

            {/* High Impact Search & Filter */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-6 top-4.5 text-foreground/30" size={18} />
                    <input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="SEARCH INFRASTRUCTURE CLUSTERS..."
                        className="w-full pl-16 pr-6 py-4.5 bg-white/50 dark:bg-black/20 backdrop-blur-xl border border-border/10 rounded-2xl text-[11px] font-black uppercase tracking-widest outline-none shadow-sm focus:ring-4 focus:ring-brand-primary/5 transition-all placeholder:text-foreground/20"
                    />
                </div>
                <Button variant="outline" className="h-14 px-10 rounded-2xl text-[10px] font-black uppercase tracking-widest border-border/10 bg-white/50 dark:bg-black/20" icon={Filter}>Filters</Button>
            </div>

            {/* Premium Matrix View */}
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-8">
                {filteredSocieties.length === 0 ? (
                    <div className="col-span-full py-40 border-2 border-dashed border-border/10 rounded-[3rem] flex flex-col items-center opacity-30">
                        <Building2 size={64} className="text-foreground/10 mb-4" />
                        <p className="text-[11px] font-black uppercase tracking-widest text-foreground/40">Global Map Empty</p>
                    </div>
                ) : (
                    filteredSocieties.map((soc) => (
                        <div key={soc.id} className="premium-card group hover:scale-[1.02]">
                           <div className="p-8 border-b border-border/10 flex justify-between items-start bg-brand-secondary/5 group-hover:bg-brand-secondary/10 transition-colors">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-[9px] font-black uppercase text-foreground/30 tracking-[0.2em] leading-none mb-1">
                                        <Activity size={12} className="text-brand-primary/50" /> Cluster ID: {soc.id.slice(0, 8)}
                                    </div>
                                    <h3 className="text-2xl font-black uppercase tracking-tighter text-foreground leading-tight">{soc.name}</h3>
                                </div>
                                <button className="p-2 hover:bg-white/50 dark:hover:bg-black/50 rounded-xl text-foreground/40 transition-all">
                                    <MoreVertical size={20} />
                                </button>
                           </div>
                           
                           <div className="p-8 space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="size-12 rounded-2xl bg-brand-primary/5 border border-brand-primary/10 flex items-center justify-center text-brand-primary">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black uppercase text-foreground/30 tracking-widest leading-none mb-1">Global HQ</p>
                                        <span className="text-[11px] font-black uppercase tracking-tight text-foreground/70">{soc.location}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-5 bg-brand-secondary/20 rounded-[1.5rem] border border-border/10">
                                        <p className="text-[9px] font-black uppercase text-foreground/30 tracking-widest leading-none mb-2">Scheme Plots</p>
                                        <p className="text-2xl font-black font-mono text-foreground leading-none">{soc.totalPlots.toLocaleString()}</p>
                                    </div>
                                    <div className="p-5 bg-emerald-500/5 rounded-[1.5rem] border border-emerald-500/10 shadow-sm">
                                        <p className="text-[9px] font-black uppercase text-emerald-500/40 tracking-widest leading-none mb-2">ABH Active</p>
                                        <p className="text-2xl font-black font-mono text-emerald-500 leading-none">{soc.linkedPropertiesCount || 0}</p>
                                    </div>
                                </div>

                                <Link 
                                    href={`/dashboard/societies/${soc.id}`}
                                    className="flex items-center justify-center gap-3 w-full py-4 bg-foreground text-background rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-premium group-hover:shadow-2xl transition-all active:scale-[0.98]"
                                >
                                    Inspect Cluster Inventory <ArrowUpRight size={16} />
                                </Link>
                           </div>
                        </div>
                    ))
                )}
            </div>
            <AddSocietyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}

