"use client";

import { useState } from "react";
import { Hammer, HardHat, Plus, MapPin, ChevronRight, Activity, Target } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import AddProjectModal from "@/components/dashboard/AddProjectModal";

interface ProjectAggregated {
    id: string;
    title: string;
    location: string;
    totalBudget: number;
    status: string | null;
    actualCost: number;
}

export default function ConstructionClient({ initialProjects }: { initialProjects: ProjectAggregated[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="space-y-12 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Structural Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between border-b border-border/40 pb-10 gap-8">
                <div className="space-y-3 text-center lg:text-left">
                    <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase text-zinc-950 dark:text-zinc-50 leading-none">
                        Infrastructure
                    </h1>
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] flex items-center justify-center lg:justify-start gap-2">
                        <HardHat size={14} className="text-brand-primary" />
                        Development Pipeline • ABH Holdings Framework
                    </p>
                </div>
                
                <div className="flex items-center justify-between lg:justify-end gap-3 bg-brand-secondary/30 border border-border/10 p-2 rounded-[2rem] shadow-premium">
                    <div className="px-8 py-2 border-r border-border/20 text-right">
                        <p className="text-[9px] font-black uppercase text-foreground/30 tracking-widest leading-none">Force Strength</p>
                        <p className="text-2xl font-black font-mono mt-1 text-foreground">ACTIVE</p>
                    </div>
                    <div className="px-4">
                        <Button 
                            onClick={() => setIsModalOpen(true)}
                            className="bg-foreground text-background text-[10px] font-black uppercase tracking-widest px-8 h-12 rounded-xl shadow-2xl active:scale-95 transition-all" 
                            icon={Plus}
                        >
                            Initialize Site
                        </Button>
                    </div>
                </div>
            </div>

            {/* Active Project Control Matrix */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                {initialProjects.length === 0 ? (
                    <div className="col-span-full py-40 border-2 border-dashed border-border/10 rounded-[3rem] flex flex-col items-center gap-6 opacity-30">
                        <Hammer size={64} className="text-foreground/10" />
                        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-foreground/40">Global Pipeline Static</p>
                    </div>
                ) : (
                    initialProjects.map((project) => (
                        <div key={project.id} className="premium-card group hover:scale-[1.01] transition-all cursor-pointer overflow-hidden border-none shadow-premium bg-white dark:bg-black/20 backdrop-blur-xl">
                            <div className="p-10 border-b border-border/5 flex justify-between items-start bg-brand-secondary/5 group-hover:bg-brand-secondary/10 transition-colors">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-background/50 border-border/20">{project.status}</Badge>
                                        <span className="text-[9px] font-black uppercase text-foreground/30 tracking-[0.2em]">Deployment ID: {project.id.slice(0, 8)}</span>
                                    </div>
                                    <h3 className="text-3xl font-black uppercase tracking-tighter text-foreground leading-none">{project.title}</h3>
                                    <div className="flex items-center gap-2 text-foreground/50 text-[11px] font-black uppercase tracking-widest pt-1">
                                        <MapPin size={14} className="text-brand-primary/60" />
                                        {project.location}
                                    </div>
                                </div>
                                <div className="size-12 rounded-2xl bg-foreground text-background flex items-center justify-center shadow-2xl group-hover:translate-x-2 transition-transform">
                                    <ChevronRight size={24} />
                                </div>
                            </div>

                            <div className="p-10 space-y-10">
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <p className="text-[9px] font-black uppercase text-foreground/30 tracking-widest leading-none mb-1">Approved Budget</p>
                                        <p className="text-2xl font-black font-mono tracking-tighter text-foreground">PKR {project.totalBudget.toLocaleString()}</p>
                                    </div>
                                    <div className="space-y-2 text-right">
                                        <p className="text-[9px] font-black uppercase text-foreground/30 tracking-widest leading-none mb-1">Burned Capital</p>
                                        <p className="text-2xl font-black font-mono tracking-tighter text-brand-primary">PKR {project.actualCost.toLocaleString()}</p>
                                    </div>
                                </div>

                                <div className="space-y-5">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 px-1">
                                        <span className="flex items-center gap-2"><Activity size={14} className="text-emerald-500 animate-pulse" /> Financial Velocity</span>
                                        <span>{Math.round((project.actualCost / project.totalBudget) * 100)}% Consumed</span>
                                    </div>
                                    <div className="h-3 w-full bg-brand-secondary/30 rounded-full overflow-hidden border border-border/5 p-0.5">
                                        <div 
                                            className={`h-full rounded-full transition-all duration-1000 ${project.actualCost > project.totalBudget ? 'bg-red-500' : 'bg-foreground'}`} 
                                            style={{ width: `${Math.min((project.actualCost / project.totalBudget) * 100, 100)}%` }} 
                                        />
                                    </div>
                                    <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-foreground/20 px-1">
                                        <span>Foundation</span>
                                        <span className="flex items-center gap-1.5"><Target size={12} /> Buffer: PKR {(project.totalBudget - project.actualCost).toLocaleString()}</span>
                                        <span>Structure</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <AddProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}

