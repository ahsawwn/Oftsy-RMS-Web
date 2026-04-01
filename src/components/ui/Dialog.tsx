"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

interface DialogProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children: React.ReactNode;
}

export function Dialog({ isOpen, onClose, title, description, children }: DialogProps) {
    useEffect(() => {
        if (isOpen) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "unset";
        return () => { document.body.style.overflow = "unset"; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div
                className="absolute inset-0 bg-background/40 backdrop-blur-sm animate-in fade-in duration-300 transition-all"
                onClick={onClose}
            />

            <div className="relative w-full max-w-xl bg-background rounded-[2.5rem] border border-border/40 shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-2 duration-300">
                <div className="p-8 md:p-10 border-b border-border/10 flex items-center justify-between bg-brand-secondary/10">
                    <div className="space-y-1">
                        <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-foreground leading-none">{title}</h2>
                        {description && (
                            <p className="text-[9px] font-black uppercase tracking-widest text-foreground/40 pl-0.5">
                                {description}
                            </p>
                        )}
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-brand-secondary/50 rounded-2xl transition-colors text-foreground/40 hover:text-foreground">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8 md:p-10 max-h-[85vh] overflow-y-auto custom-scrollbar">
                    {children}
                </div>
            </div>
        </div>
    );
}