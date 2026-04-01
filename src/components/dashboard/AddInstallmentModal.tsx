"use client";

import { useActionState, useEffect } from "react";
import { addInstallmentAction } from "@/app/dashboard/properties/installment-action";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Wallet, Hash, CreditCard, ShieldCheck } from "lucide-react";

interface AddInstallmentProps {
    isOpen: boolean;
    onClose: () => void;
    planId: string;
    clientName: string;
    propertyName: string;
    outstandingAmount?: number;
}

export default function AddInstallmentModal({ 
    isOpen, 
    onClose, 
    planId, 
    clientName, 
    propertyName,
    outstandingAmount 
}: AddInstallmentProps) {
    const [state, formAction, isPending] = useActionState(addInstallmentAction, null);

    useEffect(() => {
        if (state?.success) onClose();
    }, [state, onClose]);

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            title="Recovery Check-in"
            description="Authorize a new installment payment for this asset."
        >
            <form action={formAction} className="space-y-6 pt-4">
                <input type="hidden" name="planId" value={planId} />

                {/* Info Card */}
                <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex items-center justify-between">
                    <div>
                        <p className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">Payer Profile</p>
                        <p className="font-bold text-sm">{clientName}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">Asset Target</p>
                        <p className="font-bold text-sm">{propertyName}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Amount (PKR)</label>
                        <div className="relative">
                            <Wallet className="absolute left-3 top-3 text-zinc-400" size={16} />
                            <input
                                name="amountPaid"
                                type="number"
                                required
                                placeholder="0"
                                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm outline-none font-mono"
                            />
                        </div>
                        {state?.errors?.amountPaid && <p className="text-[9px] text-red-500 font-bold">{state.errors.amountPaid[0]}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Receipt / Ref</label>
                        <div className="relative">
                            <Hash className="absolute left-3 top-3 text-zinc-400" size={16} />
                            <input
                                name="receiptNumber"
                                required
                                placeholder="ABH-00000"
                                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Settlement Routing</label>
                    <div className="relative">
                        <CreditCard className="absolute left-3 top-3 text-zinc-400" size={16} />
                        <select
                            name="paymentMethod"
                            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm outline-none"
                        >
                            <option value="Cash">Cash / Petty Cash</option>
                            <option value="Bank Transfer">Direct Bank Transfer</option>
                            <option value="Cheque">Corporate Cheque</option>
                            <option value="Online">Online / Wallet</option>
                        </select>
                    </div>
                </div>

                <div className="p-4 bg-zinc-100 dark:bg-zinc-800/50 rounded-xl flex gap-3 text-zinc-600 dark:text-zinc-400">
                    <ShieldCheck size={18} className="shrink-0" />
                    <p className="text-[10px] leading-relaxed font-bold uppercase tracking-tight">
                        Payments are subject to 24hr settlement auditing.
                        The Allottee will receive an instant PKT timestamped digital receipt.
                    </p>
                </div>

                <div className="flex gap-3">
                    <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
                    <Button type="submit" className="flex-1 bg-zinc-900 text-white" disabled={isPending}>
                        {isPending ? "Authorized..." : "Commit Recovery"}
                    </Button>
                </div>

                {state?.message && (
                    <p className={`text-center text-[10px] font-black uppercase ${state.success ? 'text-green-500' : 'text-red-500'}`}>
                        {state.message}
                    </p>
                )}
            </form>
        </Dialog>
    );
}
