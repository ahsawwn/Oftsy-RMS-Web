import { db } from "@/lib/db";
import { properties, societies } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { 
    Plus, Search, Filter, MoreVertical, 
    Building2, MapPin, TrendingUp, ArrowUpRight, 
    ChevronRight, ExternalLink, Activity, Layers,
    Box, Wallet
} from "lucide-react";
import Link from "next/link";

import InventoryHeader from "@/components/dashboard/InventoryHeader";
import { PropertiesTable } from "./PropertiesTable";

export default async function PropertiesPage() {
    // Join with Societies for the "Society" column
    const allProperties = await db
        .select({
            id: properties.id,
            name: properties.name,
            location: properties.location,
            type: properties.type,
            status: properties.status,
            price: properties.price,
            plotNumber: properties.plotNumber,
            societyName: societies.name,
        })
        .from(properties)
        .leftJoin(societies, eq(properties.societyId, societies.id))
        .orderBy(desc(properties.createdAt));

    // Fetch Societies for the Add Modal
    const allSocieties = await db.select().from(societies).orderBy(desc(societies.createdAt));

    // Intelligence Metrics
    const totalValuation = allProperties.reduce((acc, p) => acc + (p.price || 0), 0);
    const availableCount = allProperties.filter(p => p.status === "Available").length;

    return (
        <div className="space-y-12 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Executive Management Header */}
            <InventoryHeader societies={allSocieties} />

            {/* Strategic KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                <div className="premium-card p-8 group">
                    <div className="flex justify-between items-start mb-6">
                        <div className="size-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                            <Layers size={24} />
                        </div>
                        <span className="text-[10px] font-black uppercase text-blue-500 bg-blue-500/5 px-3 py-1 rounded-full border border-blue-500/10 tracking-widest">Global Asset Count</span>
                    </div>
                    <h3 className="text-4xl font-black mb-1">{allProperties.length.toString().padStart(2, '0')}</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Registered Inventory Units</p>
                </div>

                <div className="premium-card p-8 group">
                    <div className="flex justify-between items-start mb-6">
                        <div className="size-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                            <Activity size={24} />
                        </div>
                        <span className="text-[10px] font-black uppercase text-emerald-500 bg-emerald-500/5 px-3 py-1 rounded-full border border-emerald-500/10 tracking-widest">Market Ready</span>
                    </div>
                    <h3 className="text-4xl font-black mb-1">{availableCount.toString().padStart(2, '0')}</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Available For Client Acquisition</p>
                </div>

                <div className="premium-card p-8 group">
                    <div className="flex justify-between items-start mb-6">
                        <div className="size-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                            <Wallet size={24} />
                        </div>
                        <span className="text-[10px] font-black uppercase text-amber-500 bg-amber-500/5 px-3 py-1 rounded-full border border-amber-500/10 tracking-widest">Portfolio Valuation</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-[10px] font-black uppercase text-foreground/30">PKR</span>
                        <h3 className="text-4xl font-black mb-1">{totalValuation.toLocaleString()}</h3>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Estimated Liquidity Forecast</p>
                </div>
            </div>

            {/* High Density Portfolio Listing */}
            <div className="premium-card overflow-hidden">
                <div className="p-6 md:p-8 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/10 dark:bg-zinc-900/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="relative max-w-sm w-full">
                        <Search className="absolute left-4 top-3.5 text-foreground/30" size={16} />
                        <input
                            placeholder="SEARCH BY ASSET ID OR LOCATION..."
                            className="w-full pl-12 pr-6 py-3.5 bg-transparent text-[11px] font-black uppercase tracking-widest focus:outline-none placeholder:text-foreground/20 border-none ring-0 focus:ring-0"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="h-12 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest border-border/10 bg-white/50 dark:bg-black/20" icon={Filter}>Filter Atlas</Button>
                        <Button variant="outline" className="h-12 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest border-border/10 bg-white/50 dark:bg-black/20" icon={TrendingUp}>Trending</Button>
                    </div>
                </div>

                <div className="p-2 md:p-4">
                    <PropertiesTable data={allProperties} />
                </div>
            </div>

            {/* Future Footer Integrity */}
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.5em] text-foreground/20 px-4 pt-4 border-t border-border/5">
                <p>Oftsy Inventory Core v4.0.21</p>
                <div className="flex items-center gap-4">
                    <p>Verified Assets: 100%</p>
                    <p className="text-brand-primary">Protocol Active</p>
                </div>
            </div>
        </div>
    );
}