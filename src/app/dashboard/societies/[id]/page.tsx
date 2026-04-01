import { getSocietyDetails } from "../actions";
import { 
    Building2, MapPin, Search, Plus, 
    Filter, MoreVertical, LayoutGrid, 
    Activity, Globe, PieChart, Landmark,
    ArrowUpRight, Layers, Box, ChevronLeft,
    TrendingUp, Wallet, CheckCircle2, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function SocietyDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const data = await getSocietyDetails(id);
    if (!data) return notFound();

    const availableCount = data.properties.filter(p => p.status === "Available").length;
    const soldCount = data.properties.filter(p => p.status === "Sold Out").length;
    const totalValuation = data.properties.reduce((acc, p) => acc + (p.price || 0), 0);

    return (
        <div className="space-y-12 pb-24 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {/* Navigational Sub-Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/societies" className="p-3 bg-brand-secondary/50 hover:bg-brand-secondary transition-all rounded-xl text-foreground/40 hover:text-foreground">
                        <ChevronLeft size={20} />
                    </Link>
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">{data.name}</h1>
                            <Badge variant="outline" className="text-[9px] font-black tracking-widest px-3 border-brand-primary/20 text-brand-primary uppercase">Active Cluster</Badge>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase text-foreground/40 tracking-widest">
                            <MapPin size={12} className="text-brand-primary/50" /> {data.location}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-12 px-8 rounded-2xl text-[10px] font-black uppercase tracking-widest" icon={Box}>Generate Atlas</Button>
                    <Button className="h-12 px-8 bg-foreground text-background rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-premium" icon={Plus}>Add Spec Plot</Button>
                </div>
            </div>

            {/* Strategy Layer (Analytics) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
                <div className="premium-card p-6 md:p-8 bg-blue-500/5 hover:bg-blue-500/10 transition-all cursor-default">
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-500/50 mb-6">Total Cap Capacity</p>
                    <div className="flex items-baseline gap-2">
                        <h2 className="text-4xl font-black text-blue-500">{data.totalPlots.toLocaleString()}</h2>
                        <span className="text-[10px] font-black text-blue-500/30 uppercase tracking-widest">Scheme</span>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mt-2">Overall Society Size</p>
                </div>

                <div className="premium-card p-6 md:p-8 bg-emerald-500/5 hover:bg-emerald-500/10 transition-all cursor-default">
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-500/50 mb-6">ABH Position</p>
                    <div className="flex items-baseline gap-2">
                        <h2 className="text-4xl font-black text-emerald-500">{data.properties.length.toString().padStart(2, '0')}</h2>
                        <span className="text-[10px] font-black text-emerald-500/30 uppercase tracking-widest">Units</span>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mt-2">Total Owned Assets</p>
                </div>

                <div className="premium-card p-6 md:p-8 bg-brand-primary/5 hover:bg-brand-primary/10 transition-all cursor-default">
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-brand-primary/30 mb-6">Market Open</p>
                    <div className="flex items-baseline gap-2">
                        <h2 className="text-4xl font-black text-brand-primary">{availableCount.toString().padStart(2, '0')}</h2>
                        <span className="text-[10px] font-black text-brand-primary/30 uppercase tracking-widest">Live</span>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mt-2">Inventory Available</p>
                </div>

                <div className="premium-card p-6 md:p-8 bg-purple-500/5 hover:bg-purple-500/10 transition-all cursor-default">
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-purple-500/50 mb-6">Cluster FMV</p>
                    <div className="flex items-baseline gap-2">
                        <h2 className="text-3xl font-black text-purple-500">{totalValuation.toLocaleString()}</h2>
                        <span className="text-[10px] font-black text-purple-500/30 uppercase tracking-widest">PKR</span>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mt-2">Fair Market Valuation</p>
                </div>
            </div>

            {/* Linked Asset Inventory Listing */}
            <div className="premium-card p-6 md:p-10 space-y-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <h3 className="text-3xl font-black tracking-tighter uppercase leading-none">Internal Plot Atlas</h3>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-4 top-3 text-foreground/30" size={16} />
                            <input
                                placeholder="FILTER PLOT NO..."
                                className="pl-12 pr-6 py-2.5 bg-brand-secondary/30 rounded-2xl border border-border/10 text-[10px] font-black uppercase tracking-widest outline-none shadow-sm placeholder:text-foreground/20"
                            />
                        </div>
                        <Button variant="outline" className="h-11 px-6 rounded-2xl text-[9px] font-black uppercase tracking-widest border-border/10">Filter Status</Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6 md:gap-8">
                    {data.properties.length === 0 ? (
                        <div className="col-span-full py-20 flex flex-col items-center opacity-30 border-2 border-dashed border-border/10 rounded-[2rem]">
                            <Layers size={48} className="text-foreground/20 mb-4" />
                            <p className="text-[11px] font-black uppercase tracking-widest text-foreground/40 leading-none">Zero Inventory Seeded</p>
                        </div>
                    ) : (
                        data.properties.map((prop) => (
                            <div key={prop.id} className="premium-card p-6 border-zinc-200/50 dark:border-zinc-800/50 hover:border-brand-primary/40 group overflow-hidden bg-white/40 shadow-sm">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 rounded-xl bg-foreground/5 flex items-center justify-center text-foreground group-hover:bg-foreground group-hover:text-background transition-all">
                                            <Building2 size={18} />
                                        </div>
                                        <div className="space-y-0.5">
                                            <h4 className="text-base font-black uppercase tracking-tighter leading-none">{prop.plotNumber || "UNASSIGNED"}</h4>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-foreground/30">{prop.type}</p>
                                        </div>
                                    </div>
                                    <Badge 
                                        variant={prop.status === "Available" ? "success" : "warning"}
                                        className="text-[8px] font-black tracking-widest uppercase px-2 py-0.5"
                                    >
                                        {prop.status}
                                    </Badge>
                                </div>

                                <div className="space-y-5">
                                    <div className="p-4 bg-brand-secondary/30 rounded-2xl border border-border/5">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-foreground/30 mb-2">Acquisition Price</p>
                                        <div className="flex items-baseline gap-1.5 font-mono text-xl font-black text-foreground tracking-tighter">
                                            <span className="text-[10px] opacity-40 font-serif">PKR</span>
                                            {prop.price.toLocaleString()}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between gap-4">
                                        <Link 
                                            href={`/dashboard/properties/${prop.id}`}
                                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-foreground text-background rounded-xl text-[9px] font-black uppercase tracking-widest hover:shadow-xl transition-all active:scale-95"
                                        >
                                            Inspect Asset <ArrowUpRight size={14} />
                                        </Link>
                                        <button className="p-3 bg-brand-secondary/50 rounded-xl text-foreground/40 hover:text-foreground hover:bg-brand-secondary transition-all">
                                            <MoreVertical size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Performance Ledger Section */}
            <div className="flex flex-col md:flex-row gap-8 items-stretch">
                <div className="flex-1 premium-card p-10 bg-emerald-500/5 group">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="size-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                            <TrendingUp size={28} />
                        </div>
                        <h3 className="text-4xl font-black tracking-tighter uppercase leading-none text-emerald-600">Profit Forecast</h3>
                    </div>
                    <div className="space-y-6">
                        <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-emerald-600/60 pb-4 border-b border-emerald-500/10">
                            <span>Expected Yield</span>
                            <span className="text-xl font-mono text-emerald-600">+15.4%</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-emerald-600/60 pb-4 border-b border-emerald-500/10">
                            <span>Liquidation Cycle</span>
                            <span className="text-xl font-mono text-emerald-600">~180 Days</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-emerald-600/60 lg:pb-4">
                            <span>Portfolio Health</span>
                            <span className="text-xl font-mono text-emerald-600">Stable</span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 premium-card p-10 bg-brand-primary/5 group">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="size-14 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                            <Landmark size={28} />
                        </div>
                        <h3 className="text-4xl font-black tracking-tighter uppercase leading-none text-brand-primary">Regulatory Atlas</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 p-4 bg-brand-primary/5 rounded-2xl border border-brand-primary/10">
                            <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                            <p className="text-[10px] font-black uppercase tracking-tight text-foreground/70">Verified ownership via cluster deed protocol</p>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-brand-primary/5 rounded-2xl border border-brand-primary/10">
                            <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                            <p className="text-[10px] font-black uppercase tracking-tight text-foreground/70">Automatic transfer-tax sync enabled</p>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-brand-primary/5 rounded-2xl border border-brand-primary/10 opacity-50">
                            <AlertCircle size={16} className="text-amber-500 flex-shrink-0" />
                            <p className="text-[10px] font-black uppercase tracking-tight text-foreground/70">Audit stream pending quarterly review</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
