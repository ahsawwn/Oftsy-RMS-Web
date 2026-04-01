"use client";

import { useTransition } from "react";
import { updateLeadStatusAction } from "@/app/dashboard/leads/actions";
import { Loader2, ChevronDown } from "lucide-react";

const statuses = ["New", "Contacted", "Interested", "Closed"];

export default function StatusSwitcher({ leadId, currentStatus }: { leadId: string, currentStatus: string }) {
    const [isPending, startTransition] = useTransition();

    const handleUpdate = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const nextStatus = e.target.value;
        startTransition(async () => {
            await updateLeadStatusAction(leadId, nextStatus);
        });
    };

    return (
        <div className="relative inline-block w-32">
            <select
                disabled={isPending}
                value={currentStatus}
                onChange={handleUpdate}
                className={`w-full appearance-none px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all cursor-pointer outline-none ${
                    isPending ? "opacity-50" : "opacity-100"
                } ${
                    currentStatus === "Closed"
                        ? "bg-green-500/10 text-green-600 border-green-500/20"
                        : "bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                }`}
            >
                {statuses.map((s) => (
                    <option key={s} value={s}>{s}</option>
                ))}
            </select>

            <div className="absolute right-2 top-2 pointer-events-none text-zinc-400">
                {isPending ? <Loader2 size={12} className="animate-spin" /> : <ChevronDown size={12} />}
            </div>
        </div>
    );
}