import React from "react";
import Link from "next/link";

import { getPropertyDetails } from "../actions";
import { getAllLeads } from "@/app/dashboard/leads/actions";
import { notFound } from "next/navigation";
import { 
    Building2, MapPin, 
    ArrowRightLeft, ShieldCheck, 
    User, SquareStack, Hash,
    Activity, Clock, DollarSign,
    ChevronRight, ArrowUpRight,
    HandCoins
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatPKT } from "@/lib/utils/date-utils";
import PropertyDetailClient from "./PropertyDetailClient";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function PropertyDetailPage({ params }: PageProps) {
    const { id } = await params;
    const property = await getPropertyDetails(id);
    const leads = await getAllLeads();

    if (!property) notFound();

    const totalPaid = property.payments.reduce((sum, p) => sum + p.amountPaid, 0);
    const balance = property.price - totalPaid;

    return (
        <div className="space-y-12 pb-24 animate-in fade-in duration-1000">
            {/* Executive Dossier Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-zinc-200 dark:border-zinc-800 pb-12">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Badge variant={property.status === 'Available' ? 'success' : 'warning'} className="uppercase px-3 py-1 text-[10px] font-black tracking-widest">
                            {property.status}
                        </Badge>
                        <p className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.3em]">Institutional Asset • {property.society?.name || "Global Ledger"}</p>
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase text-zinc-950 dark:text-zinc-50 leading-none">{property.name}</h1>
                        <div className="flex items-center gap-3 text-zinc-400 font-black uppercase text-[10px] tracking-widest pt-2">
                             <MapPin size={14} className="text-zinc-400" />
                             {property.location}
                             <span className="mx-2 opacity-20">|</span>
                             <Hash size={14} />
                             Plot: {property.plotNumber || "N/A"}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                    <div className="bg-zinc-950 dark:bg-zinc-50 p-8 rounded-3xl text-white dark:text-zinc-950 min-w-[320px] shadow-2xl group transition-all hover:bg-zinc-900 dark:hover:bg-zinc-100">
                        <div className="flex justify-between items-start mb-2">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">Contract Valuation</p>
                            {property.status === 'Available' && (
                                <PropertyDetailClient 
                                    propertyId={property.id} 
                                    propertyName={property.name} 
                                    propertyPrice={property.price} 
                                    leads={leads} 
                                />
                            )}
                        </div>
                        <p className="text-4xl font-mono font-black tracking-tighter">PKR {property.price.toLocaleString()}</p>
                        <div className="mt-6 flex items-center justify-between border-t border-zinc-800 dark:border-zinc-200 pt-4">
                            <span className="text-[10px] font-black uppercase text-zinc-500">Asset Holder</span>
                            <span className="text-[11px] font-black uppercase">{property.owner?.name || "ABH INVENTORY"}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left Section: Financial Timeline & Matrix */}
                <div className="lg:col-span-8 space-y-12">
                    {/* Financial health Matrix */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="premium-card p-8 group">
                            <p className="text-[9px] font-black uppercase text-zinc-400 tracking-widest mb-4">Recovery Yield</p>
                            <div className="flex items-baseline gap-2">
                                <p className="text-4xl font-black font-mono tracking-tight">{Math.round((totalPaid/property.price)*100)}%</p>
                                <span className="text-[10px] font-bold text-emerald-500">Succeed</span>
                            </div>
                        </div>
                        <div className="premium-card p-8 group">
                            <p className="text-[9px] font-black uppercase text-zinc-400 tracking-widest mb-4">Outstanding Capital</p>
                            <p className="text-3xl font-black font-mono tracking-tight text-zinc-950 dark:text-zinc-50">PKR {balance.toLocaleString()}</p>
                        </div>
                        <div className="premium-card p-8 group">
                            <p className="text-[9px] font-black uppercase text-zinc-400 tracking-widest mb-4">Ledger Entries</p>
                            <p className="text-4xl font-black font-mono tracking-tight text-zinc-950 dark:text-zinc-50">{property.payments.length.toString().padStart(2, '0')}</p>
                        </div>
                    </div>

                    {/* Financial Timeline */}
                    <div className="space-y-8">
                        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
                            <div className="flex items-center gap-2">
                                <HandCoins size={18} className="text-zinc-400" />
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Financial Execution Timeline</h3>
                            </div>
                            <Badge variant="outline" className="text-[8px] uppercase font-black tracking-widest">Audit Verified</Badge>
                        </div>
                        
                        <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-zinc-100 dark:before:bg-zinc-800">
                            {property.payments.length > 0 ? (
                                property.payments.map((p, idx) => (
                                    <div key={p.id} className="relative group">
                                        <div className={`absolute -left-[27px] top-1.5 size-3 rounded-full border-4 ${idx === 0 ? 'bg-zinc-950 dark:bg-white border-zinc-200 dark:border-zinc-800 scale-125' : 'bg-zinc-300 dark:bg-zinc-700 border-white dark:border-zinc-950'}`} />
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 premium-card">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[12px] font-black uppercase tracking-tight text-zinc-900 dark:text-zinc-50">{p.receiptNumber}</span>
                                                    <Badge className="bg-emerald-500/10 text-emerald-600 text-[8px] font-black px-2 h-4 uppercase">{p.paymentMethod}</Badge>
                                                </div>
                                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Verified on {formatPKT(p.paymentDate, "dd MMM yyyy")}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xl font-black font-mono tracking-tighter text-zinc-950 dark:text-zinc-50">PKR {p.amountPaid.toLocaleString()}</p>
                                                <div className="flex items-center justify-end gap-1 text-[9px] font-black text-green-600 uppercase">
                                                    <Activity size={10} />
                                                    Recovered
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-16 border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] text-center">
                                    <Clock size={40} className="mx-auto text-zinc-200 mb-4" />
                                    <p className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Waiting for first recovery entry</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Section: Ownership Dossier */}
                <div className="lg:col-span-4 space-y-12">
                    <div className="space-y-4">
                         <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 px-1">Principal Allottee</h4>
                         <div className="p-8 bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-950 rounded-[2.5rem] space-y-8 shadow-2xl relative overflow-hidden group">
                            <User className="absolute -right-4 -bottom-4 size-32 opacity-5 group-hover:opacity-10 transition-opacity" />
                            <div className="size-14 rounded-2xl bg-zinc-800 dark:bg-zinc-200 flex items-center justify-center">
                                <User size={28} />
                            </div>
                            {property.owner ? (
                                <div className="space-y-6">
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black uppercase opacity-50 tracking-widest">Verified Holder</p>
                                        <p className="text-2xl font-black tracking-tighter uppercase leading-none">{property.owner.name}</p>
                                    </div>
                                    <div className="pt-6 border-t border-zinc-800 dark:border-zinc-200 space-y-1">
                                        <p className="text-[9px] font-black uppercase opacity-50 tracking-widest">Protocol Contact</p>
                                        <p className="text-base font-black font-mono tracking-widest">{property.owner.phone}</p>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-400">
                                        <ShieldCheck size={16} />
                                        <span>Bio-Verified Asset Holder</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black uppercase opacity-30 tracking-[0.2em]">Inventory Available</p>
                                    <p className="text-xs font-black italic opacity-50 uppercase tracking-widest">Unassigned Asset Entry</p>
                                </div>
                            )}
                         </div>
                    </div>

                    {/* Society Context */}
                    {property.society && (
                        <div className="premium-card p-8 space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-xl bg-brand-primary/5 flex items-center justify-center text-brand-primary">
                                    <SquareStack size={18} />
                                </div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Society Cluster</h4>
                            </div>
                            <div className="space-y-1 pb-4 border-b border-border/10">
                                <p className="text-xl font-black uppercase tracking-tighter leading-none">{property.society.name}</p>
                                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-tight">{property.society.location}</p>
                            </div>
                            <Link href={`/dashboard/societies/${property.society.id}`} className="flex items-center justify-center gap-2 w-full py-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-all">
                                View Cluster Atlas <ArrowUpRight size={14} />
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
