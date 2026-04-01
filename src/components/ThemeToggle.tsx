"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Monitor, Palette, Droplets, TreePine, Flower2, Check } from "lucide-react";

export default function ThemeToggle() {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);
    const [isOpen, setIsOpen] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="w-10 h-10 rounded-lg flex items-center justify-center opacity-50">
                <Sun size={18} />
            </div>
        );
    }

    const currentIcon = () => {
        if (theme === "system") return <Monitor size={18} />;
        if (theme === "dark") return <Moon size={18} />;
        if (theme === "theme-ocean") return <Droplets size={18} />;
        if (theme === "theme-forest") return <TreePine size={18} />;
        if (theme === "theme-rose") return <Flower2 size={18} />;
        return <Sun size={18} />;
    };

    const themes = [
        { name: "Light", value: "light", icon: <Sun size={16} /> },
        { name: "Dark", value: "dark", icon: <Moon size={16} /> },
        { name: "Ocean", value: "theme-ocean", icon: <Droplets size={16} /> },
        { name: "Forest", value: "theme-forest", icon: <TreePine size={16} /> },
        { name: "Rose", value: "theme-rose", icon: <Flower2 size={16} /> },
        { name: "System", value: "system", icon: <Monitor size={16} /> },
    ];

    return (
        <div className="relative inline-block text-left">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 hover:bg-brand-secondary/50 text-foreground/80 hover:text-foreground border border-transparent hover:border-brand-primary/20 backdrop-blur-sm"
                aria-label="Toggle theme"
            >
                {currentIcon()}
            </button>

            {isOpen && (
                <>
                    {/* Backdrop to close the dropdown when clicking outside */}
                    <div 
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-xl bg-background border border-brand-primary/10 shadow-lg ring-1 ring-black/5 focus:outline-none overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="p-1">
                            {themes.map((t) => (
                                <button
                                    key={t.value}
                                    onClick={() => {
                                        setTheme(t.value);
                                        setIsOpen(false);
                                    }}
                                    className={`
                                        group flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors
                                        ${theme === t.value ? "bg-brand-secondary text-brand-primary" : "text-foreground/70 hover:bg-brand-secondary/50 hover:text-foreground"}
                                    `}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className={theme === t.value ? "text-brand-primary" : "text-foreground/50 group-hover:text-foreground"}>
                                            {t.icon}
                                        </span>
                                        {t.name}
                                    </div>
                                    {theme === t.value && <Check size={16} className="text-brand-primary" />}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}