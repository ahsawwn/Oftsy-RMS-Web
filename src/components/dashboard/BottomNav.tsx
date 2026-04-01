"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
    LayoutDashboard, Building2, Users, 
    Hammer, Landmark, Wallet, Menu, X, 
    Settings, LogOut, History, Plus
} from "lucide-react";
import LogoutButton from "@/components/LogoutButton";

const primaryNav = [
    { name: "Home", href: "/dashboard", icon: LayoutDashboard },
    { name: "Properties", href: "/dashboard/properties", icon: Building2 },
    { name: "Recovery", href: "/dashboard/payments", icon: Wallet },
    { name: "Leads", href: "/dashboard/leads", icon: Users },
];

const moreNav = [
    { name: "Construction", href: "/dashboard/construction", icon: Hammer },
    { name: "Finance", href: "/dashboard/finance", icon: Landmark },
    { name: "Audit Logs", href: "/dashboard/audit-logs", icon: History },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function BottomNav() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setMounted(true);
    }, []);

    // Scroll Lock
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isMenuOpen]);

    if (!mounted) return null;

    return (
        <div className="md:hidden">
            {/* Persistent Bottom Bar - Increased Z-index and solid background for visibility */}
            <div className="fixed bottom-0 left-0 right-0 z-[9999] h-16 bg-background border-t border-border flex items-center justify-around px-2 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
                {primaryNav.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`relative flex flex-col items-center justify-center gap-1 min-w-[64px] h-full transition-all active:scale-95 ${
                                isActive ? "text-brand-primary" : "text-foreground/40 hover:text-foreground/70"
                            }`}
                        >
                            <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[9px] font-black uppercase tracking-tighter">{item.name}</span>
                            {isActive && <div className="absolute -bottom-1 w-6 h-1 bg-brand-primary rounded-full animate-in fade-in zoom-in duration-300" />}
                        </Link>
                    );
                })}
                
                {/* Menu Button */}
                <button 
                    onClick={() => setIsMenuOpen(true)}
                    className={`flex flex-col items-center justify-center gap-1 min-w-[64px] h-full transition-all active:scale-95 ${
                        isMenuOpen ? "text-brand-primary" : "text-foreground/40"
                    }`}
                >
                    <Menu size={22} />
                    <span className="text-[9px] font-black uppercase tracking-tighter">More</span>
                </button>
            </div>

            {/* "More" Tray Overlay */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-[1001] flex flex-col justify-end">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
                        onClick={() => setIsMenuOpen(false)}
                    />
                    
                    <div className="relative w-full bg-background border-t border-border rounded-t-[2.5rem] p-6 pb-24 shadow-2xl animate-in slide-in-from-bottom duration-500 overflow-hidden">
                        {/* Drag Handle */}
                        <div className="w-12 h-1 bg-border rounded-full mx-auto mb-6" />
                        
                        <div className="flex items-center justify-between mb-6 px-2">
                             <div className="flex flex-col">
                                <span className="text-xs font-black uppercase tracking-tighter text-foreground leading-none">Extended Navigation</span>
                                <span className="text-[8px] font-black uppercase tracking-widest text-foreground/40 mt-1">ABH Holdings ERP</span>
                            </div>
                            <button 
                                onClick={() => setIsMenuOpen(false)} 
                                className="size-9 rounded-full bg-brand-secondary flex items-center justify-center text-foreground active:scale-90 transition-transform"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {moreNav.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => setIsMenuOpen(false)}
                                        className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                                            isActive 
                                                ? "bg-brand-primary text-background border-transparent" 
                                                : "bg-brand-secondary/30 text-foreground/60 border-border/20"
                                        }`}
                                    >
                                        <item.icon size={18} className={isActive ? "text-background" : "text-brand-primary"} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{item.name}</span>
                                    </Link>
                                );
                            })}
                        </div>
                        
                        <div className="mt-6 pt-6 border-t border-border/20 px-2">
                             <div className="flex items-center gap-3 mb-6 p-4 bg-brand-secondary/20 rounded-2xl border border-border/20">
                                <div className="size-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                                    <Users size={18} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-foreground/40 mb-1 leading-none uppercase">Logged as Root</p>
                                    <p className="text-xs font-black text-foreground uppercase tracking-tight truncate">ABH Enterprise Admin</p>
                                </div>
                            </div>
                            <LogoutButton showText />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
