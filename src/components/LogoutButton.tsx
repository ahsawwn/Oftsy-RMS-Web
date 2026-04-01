// src/components/LogoutButton.tsx
"use client";

import { useTransition } from "react";
import { logoutAction } from "@/app/(auth)/logout/actions";
import { LogOut } from "lucide-react";

export default function LogoutButton({ showText = true }: { showText?: boolean }) {
    const [isPending, startTransition] = useTransition();

    return (
        <button
            onClick={() => startTransition(() => logoutAction())}
            disabled={isPending}
            className={`flex items-center text-red-500 hover:bg-red-500/10 rounded-md transition-all disabled:opacity-50 ${
                showText ? "w-full px-3 py-2 gap-3 text-sm font-medium" : "justify-center size-10 mx-auto"
            }`}
        >
            <LogOut size={18} />
            {showText && (isPending ? "Ending..." : "Sign Out")}
        </button>
    );
}