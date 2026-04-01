import { db } from "@/lib/db";
import { properties, societies } from "@/lib/db/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { LayoutGrid, CheckCircle, Construction, Lock, Globe, Building2, Search } from "lucide-react";
import Link from "next/link";

export default async function PropertyStatusDashboard() {
    // Fetch with Society Data
    const allProps = await db.select().from(properties);
    const allSocieties = await db.select().from(societies);

    const stats = {
        total: allProps.length,
        available: allProps.filter((p) => p.status === "Available").length,
        sold: allProps.filter((p) => p.status === "Sold Out").length,
        ongoing: allProps.filter((p) => p.status === "Under Construction").length,
    };

    return (
        <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Minimalist Executive Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-200 dark:border-zinc-800 pb-10 gap-6">
                <div className="space-y-2">
                    <h1 className="text-5xl font-black tracking-tighter uppercase text-zinc-950 dark:text-zinc-50 leading-none">
                        Inventory Map
                    </h1>
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-2">
                        <Globe size={14} className="text-zinc-400" />
                        ABH Holdings Global Asset Ledger • v2.0
                    </p>
                </div>

                <div className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-full border border-zinc-200 dark:border-zinc-700">
                    <Search size={14} className="text-zinc-400" />
                    <input 
                        placeholder="SEARCH ASSETS..." 
                        className="bg-transparent text-[10px] font-black uppercase tracking-widest outline-none w-32 placeholder:text-zinc-400"
                    />
                </div>
            </div>

            {/* High-Level KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Total Asset base", val: stats.total, icon: LayoutGrid, color: "text-zinc-400" },
                    { label: "Available Liquidity", val: stats.available, icon: CheckCircle, color: "text-zinc-900 dark:text-zinc-100" },
                    { label: "Locked Inventory", val: stats.sold, icon: Lock, color: "text-zinc-400" },
                    { label: "Growth Pipeline", val: stats.ongoing, icon: Construction, color: "text-zinc-400" },
                ].map((s, i) => (
                    <div key={i} className="space-y-2 border-l-2 border-zinc-100 dark:border-zinc-800 pl-6">
                        <p className="text-[9px] font-black uppercase text-zinc-500 tracking-widest flex items-center gap-2">
                            <s.icon size={12} className={s.color} />
                            {s.label}
                        </p>
                        <p className="text-4xl font-black font-mono tracking-tighter">{s.val.toString().padStart(2, '0')}</p>
                    </div>
                ))}
            </div>

            {/* High-Density Card Matrix */}
            <div className="space-y-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 px-1 border-b border-zinc-100 dark:border-zinc-900 pb-4">
                    Visual Portfolio Matrix
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                    {allProps.map((prop) => (
                        <Link 
                            href={`/dashboard/properties/${prop.id}`} 
                            key={prop.id}
                            className={`group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 active:scale-95 border-b-2 ${
                                prop.status === 'Available' ? 'border-zinc-950 dark:border-zinc-50' : 'border-zinc-200 dark:border-zinc-800'
                            }`}
                        >
                            <div className="bg-white dark:bg-zinc-950 p-4 border border-zinc-200 dark:border-zinc-800 h-full">
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`size-2 rounded-full ${
                                        prop.status === 'Available' ? 'bg-zinc-950 dark:bg-zinc-50 animate-pulse' : 
                                        prop.status === 'Sold Out' ? 'bg-zinc-300 dark:bg-zinc-700' : 'bg-zinc-500'
                                    }`} />
                                    <p className="text-[8px] font-black font-mono italic opacity-50">
                                        {(prop.price / 1000000).toFixed(1)}M
                                    </p>
                                </div>
                                
                                <p className="text-[7px] font-black uppercase tracking-widest text-zinc-400 truncate mb-1">
                                    {prop.location}
                                </p>
                                <h4 className="text-[10px] font-black uppercase tracking-tight leading-tight group-hover:underline underline-offset-4 decoration-zinc-900 dar:decoration-white">
                                    {prop.name}
                                </h4>

                                <div className="mt-8 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="h-0.5 w-4 bg-zinc-950 dark:bg-zinc-50" />
                                    <span className="text-[7px] font-black uppercase tracking-widest">Detail</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}