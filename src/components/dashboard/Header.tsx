"use client";

import { usePathname } from "next/navigation";
import { Search, Bell, User, ChevronRight, Globe, ShieldCheck, Activity } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export default function Header({ userEmail }: { userEmail?: string }) {
    const pathname = usePathname();
    
    // Breadcrumb logic
    const pathParts = pathname.split('/').filter(p => p && p !== 'dashboard');
    const currentView = pathParts.length > 0 
        ? pathParts[pathParts.length - 1].replace('-', ' ') 
        : "Operational Overview";

    // Safe initials
    const initials = userEmail
        ? userEmail.substring(0, 2).toUpperCase()
        : "AD";

    return (
        <header className="h-16 md:h-20 border-b border-border/40 bg-background/95 backdrop-blur-xl sticky top-0 z-50 w-full transition-all duration-300">
            <div className="px-4 md:px-10 h-full flex items-center justify-between gap-6">
                {/* Left Section: Context & Breadcrumbs */}
                <div className="flex items-center gap-6 min-w-0">
                    <div className="hidden lg:flex items-center gap-4 py-2 px-3 bg-brand-secondary/30 rounded-2xl border border-border/40">
                         <Globe size={18} className="text-brand-primary" />
                         <div className="flex flex-col">
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground/40 leading-none">ABH Global Network</span>
                            <span className="text-[10px] font-black uppercase text-foreground mt-0.5">Secure Enclave</span>
                         </div>
                    </div>
                    
                    <div className="flex items-center gap-2 md:gap-3 truncate">
                        <span className="hidden sm:inline-flex text-[10px] font-black uppercase tracking-widest text-foreground/30">
                             Oftsy RMS
                        </span>
                        <ChevronRight size={12} className="hidden sm:block text-foreground/20" />
                        <span className="text-sm md:text-lg font-black uppercase tracking-tight text-foreground truncate">
                            {currentView}
                        </span>
                    </div>
                </div>

                {/* Center / Right Section: Global Tools */}
                <div className="flex items-center gap-3 md:gap-6">
                    {/* Integrated Search Bar - Desktop Only */}
                    <div className="relative hidden md:flex items-center group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-brand-primary text-foreground/30">
                            <Search size={16} />
                        </div>
                        <input
                            type="search"
                            placeholder="Universal Search..."
                            className="h-11 w-48 lg:w-72 pl-11 pr-4 bg-brand-secondary/20 border border-border/40 rounded-2xl text-[11px] font-black uppercase tracking-widest placeholder:text-foreground/30 focus:outline-none focus:bg-background focus:ring-2 focus:ring-brand-primary/10 hover:bg-brand-secondary/40 transition-all"
                        />
                        <div className="absolute right-3 hidden lg:flex items-center gap-1 py-1 px-1.5 bg-brand-secondary/50 border border-border/40 rounded-lg text-[8px] font-black text-foreground/30">
                            <span>⌘</span>
                            <span>K</span>
                        </div>
                    </div>

                    {/* Notification Hive */}
                    <button className="relative size-10 md:size-12 bg-brand-secondary/30 border border-border/40 flex items-center justify-center rounded-2xl hover:bg-brand-primary hover:text-background text-foreground/40 transition-all active:scale-95 group">
                        <Bell size={18} />
                        <div className="absolute -top-1 -right-1 size-3.5 bg-brand-primary border-2 border-background rounded-full flex items-center justify-center text-[7px] font-bold text-background font-mono group-hover:scale-110 transition-transform">
                            4
                        </div>
                    </button>

                    {/* Theme Swapper */}
                    <div className="p-1 bg-brand-secondary/30 border border-border/40 rounded-2xl scale-90 md:scale-100 h-10 md:h-12 flex items-center">
                        <ThemeToggle />
                    </div>

                    {/* User Profile Cluster */}
                    <div className="flex items-center gap-3 pl-4 md:pl-6 border-l border-border/40">
                        <div className="text-right hidden sm:flex flex-col items-end">
                            <div className="flex items-center gap-1.5 leading-none mb-1">
                                <ShieldCheck size={12} className="text-brand-primary" />
                                <span className="text-[10px] font-black uppercase tracking-tighter text-foreground">ABH Operations</span>
                            </div>
                            <p className="text-[10px] text-foreground/40 font-bold truncate max-w-[120px] leading-tight">{userEmail || "root_admin"}</p>
                        </div>
                        
                        <div className="relative group cursor-pointer active:scale-95 transition-transform">
                            <div className="size-10 md:size-12 rounded-2xl bg-brand-primary flex items-center justify-center text-xs font-black text-background border-2 border-background shadow-lg shadow-brand-primary/20 rotate-[0deg] group-hover:rotate-[-4deg] transition-all">
                                {initials}
                            </div>
                            {/* Live Pulse Indicator */}
                            <div className="absolute -bottom-1 -right-1 size-4 bg-green-500 border-2 border-background rounded-full flex items-center justify-center">
                                <Activity size={8} className="text-background animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}