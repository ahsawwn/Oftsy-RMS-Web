"use client";

import { useTransition } from "react";
import { FolderPlus, Wallet, ReceiptText, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AddPlanModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [isPending, startTransition] = useTransition();

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        startTransition(async () => {
            onClose();
        });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-zinc-950/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
            <div className="relative w-full max-w-xl bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-10 border-b border-zinc-100 dark:border-zinc-900 flex items-center justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="size-8 rounded-lg bg-zinc-950 dark:bg-zinc-50 flex items-center justify-center text-white dark:text-zinc-950">
                                <FolderPlus size={18} />
                            </div>
                            <h2 className="text-2xl font-black uppercase tracking-tighter">New Active Ledger</h2>
                        </div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 pl-11">ABH Holdings Strategic Debt Framework</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-colors text-zinc-400">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-10 space-y-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 pl-1">Client Profile</label>
                        <select className="w-full px-5 py-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-lg text-[11px] font-black uppercase tracking-tight outline-none focus:ring-2 focus:ring-zinc-950/10 transition-all appearance-none cursor-pointer">
                            <option>Select Onboarded Client</option>
                        </select>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 pl-1">Target Asset</label>
                        <select className="w-full px-5 py-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-lg text-[11px] font-black uppercase tracking-tight outline-none focus:ring-2 focus:ring-zinc-950/10 transition-all appearance-none cursor-pointer">
                            <option>Select Asset / Plot</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 pl-1">Total Valuation</label>
                            <input
                                type="number"
                                required
                                placeholder="15000000"
                                className="w-full px-5 py-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-lg text-[11px] font-black uppercase font-mono tracking-tight outline-none focus:ring-2 focus:ring-zinc-950/10 transition-all"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 pl-1">Down Payment</label>
                            <input
                                type="number"
                                required
                                placeholder="3500000"
                                className="w-full px-5 py-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-lg text-[11px] font-black uppercase font-mono tracking-tight outline-none focus:ring-2 focus:ring-zinc-950/10 transition-all"
                            />
                        </div>
                    </div>

                    <div className="pt-6 border-t border-zinc-100 dark:border-zinc-900 flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={onClose} className="h-12 px-8 rounded-lg text-[9px] font-black uppercase tracking-widest">Abort</Button>
                        <Button type="submit" disabled={isPending} className="h-12 px-8 bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-950 rounded-lg text-[9px] font-black uppercase tracking-widest">
                            {isPending ? "Syncing..." : "Activate Ledger"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
