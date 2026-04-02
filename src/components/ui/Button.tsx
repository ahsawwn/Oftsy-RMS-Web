import { LucideIcon } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
    icon?: LucideIcon;
}

export function Button({ children, variant = "primary", size = "md", icon: Icon, className, ...props }: ButtonProps) {
    const base = "inline-flex items-center gap-2 rounded-md text-sm font-medium transition-all active:scale-95 disabled:opacity-50";
    const sizes = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base",
    };
    const variants = {
        primary: "bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 hover:opacity-90",
        outline: "border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900",
        ghost: "hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-500 hover:text-foreground",
    };

    return (
        <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
            {Icon && <Icon size={16} />}
            {children}
        </button>
    );
}