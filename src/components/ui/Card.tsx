import React from "react";

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm ${className}`}>
            {children}
        </div>
    );
}

export function CardHeader({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return <div className={`p-6 pb-3 space-y-1.5 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>{children}</h3>;
}

export function CardDescription({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return <p className={`text-sm text-zinc-500 dark:text-zinc-400 ${className}`}>{children}</p>;
}

export function CardContent({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return <div className={`p-6 pt-0 ${className}`}>{children}</div>;
}