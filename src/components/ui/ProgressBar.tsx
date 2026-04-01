import React from "react";

export function ProgressBar({ value, max, label }: { value: number; max: number; label?: string }) {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
        <div className="space-y-2">
            {label && (
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    <span>{label}</span>
                    <span>{percentage.toFixed(1)}%</span>
                </div>
            )}
            <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-zinc-900 dark:bg-zinc-100 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}
