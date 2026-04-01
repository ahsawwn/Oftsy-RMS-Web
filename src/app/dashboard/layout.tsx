"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import BottomNav from "@/components/dashboard/BottomNav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        // 1. Initial Load from LocalStorage
        const saved = localStorage.getItem("sidebar-collapsed");
        if (saved !== null) setIsCollapsed(JSON.parse(saved));

        // 2. Listen for the Sidebar's toggle event
        const handleToggle = (e: any) => {
            setIsCollapsed(e.detail);
        };

        window.addEventListener("sidebar-toggle", handleToggle);
        return () => window.removeEventListener("sidebar-toggle", handleToggle);
    }, []);

    return (
        <div className="flex min-h-screen bg-background transition-colors duration-300">
            <Sidebar />

            {/* Dynamic Margin:
        - Mobile: 0 margin (sidebar is hidden)
        - Desktop: ml-20 (collapsed) or ml-64 (expanded)
      */}
            <div
                className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
                    isCollapsed ? "md:ml-20" : "md:ml-64"
                }`}
            >
                <Header />
                <main className="flex-1 overflow-x-hidden">
                    <div className="h-full p-4 md:p-8 lg:p-10 max-w-[1600px] mx-auto">
                        {children}
                    </div>
                </main>
            </div>
            <BottomNav />
        </div>
    );
}