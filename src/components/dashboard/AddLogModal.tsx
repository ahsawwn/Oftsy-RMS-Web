"use client";

import { useActionState, useEffect } from "react";
import { createManualLogAction } from "@/app/dashboard/audit-logs/actions";
import { ShieldAlert, Terminal, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AddLogModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [state, formAction, isPending] = useActionState(createManualLogAction, null);

    useEffect(() => {
        if (state?.success) onClose();
    }, [state, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-zinc-950/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
            <div className="relative w-full max-w-xl bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-10 border-b border-zinc-100 dark:border-zinc-900 flex items-center justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="size-8 rounded-xl bg-red-600 flex items-center justify-center text-white">
                                <Terminal size={18} />
                            </div>
                            <h2 className="text-2xl font-black uppercase tracking-tighter">Inject Audit Log</h2>
                        </div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 pl-11">Manual Trace Simulation</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form action={formAction} className="p-10 space-y-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 pl-1">Event Directive</label>
                        <div className="relative">
                            <ShieldAlert className="absolute left-4 top-4 text-zinc-400" size={16} />
                            <input
                                name="event"
                                required
                                placeholder="MANUAL_OVERRIDE_TRIGGERED"
                                className="w-full pl-12 pr-5 py-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl text-[11px] font-black uppercase tracking-tight outline-none focus:ring-2 focus:ring-zinc-950/10 transition-all placeholder:text-zinc-400"
                            />
                        </div>
                        {state?.errors?.event && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest pl-1">{state.errors.event[0]}</p>}
                    </div>
                    
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 pl-1">Metadata / JSON Payload</label>
                        <textarea
                            name="metadata"
                            placeholder='{"status": "bypassed", "reason": "executive_order"}'
                            className="w-full px-5 py-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl text-[11px] font-black font-mono tracking-tight outline-none focus:ring-2 focus:ring-zinc-950/10 transition-all min-h-32 resize-none placeholder:text-zinc-400"
                        />
                    </div>

                    <div className="pt-6 border-t border-zinc-100 dark:border-zinc-900 flex justify-end gap-4">
                        <Button type="button" variant="outline" onClick={onClose} className="h-14 px-10 rounded-2xl text-[10px] font-black uppercase tracking-widest">Abort</Button>
                        <Button type="submit" disabled={isPending} className="h-14 px-10 bg-red-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl">
                            {isPending ? "Executing..." : "Inject Record"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
