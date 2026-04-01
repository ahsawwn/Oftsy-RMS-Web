"use client";

import { useState, useEffect } from "react";
import { 
    Menu, X, LayoutDashboard, Building2, Users, 
    Settings, LogOut, ChevronRight, Hammer, 
    Landmark, Wallet, History, Plus 
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Inventory", href: "/dashboard/properties", icon: Building2 },
    { name: "Recovery", href: "/dashboard/payments", icon: Wallet },
    { name: "Construction", href: "/dashboard/construction", icon: Hammer },
    { name: "Finance", href: "/dashboard/finance", icon: Landmark },
    { name: "CRM Leads", href: "/dashboard/leads", icon: Users },
    { name: "Audit Logs", href: "/dashboard/audit-logs", icon: History },
];

export default function MobileNav() {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setMounted(true);
    }, []);

    // Scroll Lock
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isOpen]);

    if (!mounted) return null;

    return (
        <div className="md:hidden">
            {/* The Trigger */}
            <button 
                onClick={() => setIsOpen(true)} 
                className="size-11 flex items-center justify-center rounded-2xl bg-brand-primary text-background shadow-lg shadow-brand-primary/20 active:scale-90 transition-all"
                aria-label="Open Mobile Menu"
            >
                <Menu size={22} strokeWidth={2.5} />
            </button>

            {/* Modal Overlay / Backdrop */}
            {isOpen && (
                <div className="fixed inset-0 z-[10001] flex flex-col justify-end overflow-hidden">
                    {/* Dark Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 pointer-events-auto"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Bottom Sheet Container */}
                    <div 
                        className="relative w-full bg-background border-t border-border rounded-t-[2.5rem] flex flex-col shadow-[0_-20px_50px_rgba(0,0,0,0.15)] transform transition-transform duration-500 ease-out translate-y-0"
                        style={{ height: 'auto', maxHeight: '85vh' }}
                    >
                        {/* Drag Handle Aspect */}
                        <div className="w-12 h-1.5 bg-border rounded-full mx-auto my-4 shrink-0" />
                        
                        <div className="px-6 pb-4 flex items-center justify-between shrink-0 border-b border-border/20">
                             <div className="flex items-center gap-3">
                                <div className="size-9 bg-brand-primary rounded-xl flex items-center justify-center font-black text-background rotate-[-6deg]">
                                    A
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-black uppercase tracking-tighter text-foreground leading-none">ABH ERP Root</span>
                                    <span className="text-[8px] font-black uppercase tracking-widest text-foreground/40 mt-1">Main System Menu</span>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsOpen(false)} 
                                className="size-9 rounded-full bg-brand-secondary/80 flex items-center justify-center text-foreground hover:bg-brand-primary hover:text-background transition-all active:scale-90"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Navigation Grid Area */}
                        <div className="flex-1 overflow-y-auto px-6 py-6 pb-20 custom-scrollbar">
                           <div className="grid grid-cols-1 gap-2">
                                {navigation.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            onClick={() => setIsOpen(false)}
                                            className={`flex items-center justify-between group px-5 py-4 rounded-2xl transition-all duration-300 border ${
                                                isActive 
                                                    ? "bg-brand-primary text-background border-transparent shadow-lg shadow-brand-primary/20" 
                                                    : "bg-brand-secondary/30 text-foreground/60 border-border/20 hover:bg-brand-secondary/60 hover:text-foreground"
                                            }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`size-10 rounded-xl flex items-center justify-center transition-colors ${isActive ? "bg-background/20" : "bg-brand-primary/10"}`}>
                                                     <item.icon size={20} className={isActive ? "text-background" : "text-brand-primary"} />
                                                </div>
                                                <span className="text-[11px] font-black uppercase tracking-widest leading-none">{item.name}</span>
                                            </div>
                                            <ChevronRight size={16} className={isActive ? "opacity-100" : "opacity-20"} />
                                        </Link>
                                    );
                                })}
                           </div>
                            
                            {/* Combined Bottom Row */}
                            <div className="mt-6 pt-6 border-t border-border/20 space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <Link 
                                        href="/dashboard/settings" 
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center justify-center gap-2 h-14 bg-brand-secondary/50 border border-border/20 rounded-2xl transition-all hover:bg-brand-secondary/80 active:scale-95"
                                    >
                                        <Settings size={18} className="text-foreground/40" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-foreground">Settings</span>
                                    </Link>
                                    <div className="flex-1">
                                        <LogoutButton showText />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}