"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard, Building2, Users, ReceiptText,
    History, Settings, ChevronLeft, ChevronRight, Plus,
    Hammer, Landmark, HardHat, Wallet, PieChart, ChevronDown
} from "lucide-react";
import LogoutButton from "@/components/LogoutButton";
import AddPropertyModal from "./AddPropertyModal";

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { 
        name: "Inventory", 
        href: "/dashboard/properties", 
        icon: Building2,
        subItems: [
            { name: "Societies", href: "/dashboard/societies" },
            { name: "Plots & Units", href: "/dashboard/properties" },
        ]
    },
    { 
        name: "Recovery", 
        href: "/dashboard/payments", 
        icon: Wallet,
        subItems: [
            { name: "Installment Plans", href: "/dashboard/plans" },
            { name: "Payment Ledger", href: "/dashboard/payments" },
        ]
    },
    { 
        name: "Construction", 
        href: "/dashboard/construction", 
        icon: Hammer,
        subItems: [
            { name: "Active Projects", href: "/dashboard/construction" },
            { name: "Material Procure", href: "/dashboard/construction/materials" },
            { name: "Labor Payroll", href: "/dashboard/construction/labor" },
        ]
    },
    { 
        name: "Finance", 
        href: "/dashboard/finance", 
        icon: Landmark,
        subItems: [
            { name: "Bank Accounts", href: "/dashboard/finance/banks" },
            { name: "Office Expenses", href: "/dashboard/finance/expenses" },
            { name: "Loss & Profit", href: "/dashboard/finance/ledger" },
        ]
    },
    { name: "CRM Leads", href: "/dashboard/leads", icon: Users },
    { name: "Audit Logs", href: "/dashboard/audit-logs", icon: History },
    { name: "System Settings", href: "/dashboard/settings", icon: Settings },
];


export default function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [openGroup, setOpenGroup] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const saved = localStorage.getItem("sidebar-collapsed");
        if (saved !== null) {
            const parsed = JSON.parse(saved);
            setIsCollapsed(parsed);
            window.dispatchEvent(new CustomEvent("sidebar-toggle", { detail: parsed }));
        }
        setMounted(true);
    }, []);

    const toggleSidebar = () => {
        const newState = !isCollapsed;
        setIsCollapsed(newState);
        localStorage.setItem("sidebar-collapsed", JSON.stringify(newState));
        window.dispatchEvent(new CustomEvent("sidebar-toggle", { detail: newState }));
    };

    const handleGroupClick = (name: string) => {
        if (isCollapsed) {
            // Expand first if collapsed when clicking a dropdown
            setIsCollapsed(false);
            localStorage.setItem("sidebar-collapsed", JSON.stringify(false));
            window.dispatchEvent(new CustomEvent("sidebar-toggle", { detail: false }));
            setOpenGroup(name);
        } else {
            setOpenGroup(openGroup === name ? null : name);
        }
    };

    if (!mounted) return <aside className="hidden md:flex w-64 border-r border-zinc-200 dark:border-zinc-800" />;

    return (
        <>
            <aside className={`hidden md:flex flex-col fixed inset-y-0 z-50 border-r border-border/40 bg-background transition-all duration-300 ease-in-out ${isCollapsed ? "w-20" : "w-64"}`}>
                <div className="h-16 flex items-center px-6 border-b border-border/40 overflow-hidden shrink-0">
                    <div className={`flex items-center gap-3 ${isCollapsed ? "mx-auto" : ""}`}>
                        <div className="size-8 bg-brand-primary rounded-xl flex items-center justify-center shrink-0">
                            <span className="text-background font-black text-xs">A</span>
                        </div>
                        {!isCollapsed && (
                            <div className="flex flex-col animate-in fade-in slide-in-from-left-2 duration-300">
                                <span className="font-black text-xs tracking-tighter uppercase leading-none text-foreground">ABH Holdings</span>
                                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-foreground/50 mt-1">Enterprise ERP</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex-1 px-4 mt-8 space-y-6 overflow-y-auto scrollbar-hide">
                    {!isCollapsed && (
                        <button onClick={() => setIsModalOpen(true)} className="w-full h-11 bg-brand-primary text-background rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all hover:scale-[0.98] animate-in fade-in zoom-in-95 duration-300">
                            <Plus size={16} /> Add Asset
                        </button>
                    )}

                    <nav className="space-y-1">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href || item.subItems?.some(s => pathname === s.href);
                            const isGroupOpen = openGroup === item.name;

                            return (
                                <div key={item.name} className="space-y-1">
                                    <div 
                                        onClick={() => item.subItems ? handleGroupClick(item.name) : null}
                                        className={`flex items-center rounded-xl transition-all cursor-pointer ${isCollapsed ? "justify-center size-10 mx-auto" : "px-3 py-2.5 gap-3"} ${isActive ? "bg-brand-secondary text-brand-primary" : "text-foreground/60 hover:text-brand-primary"}`}
                                    >
                                        <item.icon size={18} />
                                        {!isCollapsed && (
                                            <>
                                                {item.subItems ? (
                                                     <span className="flex-1 text-[11px] font-black uppercase tracking-tight">{item.name}</span>
                                                ) : (
                                                    <Link href={item.href} className="flex-1 text-[11px] font-black uppercase tracking-tight">{item.name}</Link>
                                                )}
                                                {item.subItems && <ChevronDown size={14} className={`transition-transform duration-300 ${isGroupOpen ? "rotate-180" : ""}`} />}
                                            </>
                                        )}
                                    </div>
                                    
                                    {!isCollapsed && isGroupOpen && item.subItems && (
                                        <div className="pl-10 space-y-1 animate-in slide-in-from-top-2 duration-300">
                                            {item.subItems.map(sub => (
                                                <Link 
                                                    key={sub.name} 
                                                    href={sub.href}
                                                    className={`block py-1.5 text-[10px] font-black uppercase tracking-tight transition-colors ${pathname === sub.href ? "text-brand-primary" : "text-foreground/40 hover:text-foreground/80"}`}
                                                >
                                                    {sub.name}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </nav>
                </div>

                <div className="p-6 border-t border-border/40 space-y-4 shrink-0">
                    <LogoutButton showText={!isCollapsed} />
                </div>

                <button onClick={toggleSidebar} className="absolute -right-3 top-24 size-6 rounded-full border border-border/60 bg-background flex items-center justify-center text-foreground/40 hover:text-foreground shadow-sm z-[60] hover:scale-110 transition-all">
                    {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
                </button>
            </aside>
            <AddPropertyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
}