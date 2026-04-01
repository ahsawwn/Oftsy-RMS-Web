interface BadgeProps {
    children: React.ReactNode;
    variant?: "default" | "success" | "warning" | "outline";
    className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
    const variants = {
        default: "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100",
        success: "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20",
        warning: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20",
        outline: "border border-zinc-200 dark:border-zinc-800 text-zinc-500",
    };

    return (
        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${variants[variant]} ${className || ""}`}>
      {children}
    </span>
    );
}