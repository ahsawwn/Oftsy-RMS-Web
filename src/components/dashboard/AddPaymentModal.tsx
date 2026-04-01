"use client";

import { useActionState, useEffect } from "react";
import { createPaymentAction } from "@/app/dashboard/payments/actions";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Wallet, Hash, CreditCard, Info } from "lucide-react";

interface PlanOption {
    id: string;
    label: string; // e.g., "Zubair Shah - ABH Heights 302"
}

export default function AddPaymentModal({
                                            isOpen,
                                            onClose,
                                            activePlans
                                        }: {
    isOpen: boolean;
    onClose: () => void;
    activePlans: PlanOption[];
}) {
    const [state, formAction, isPending] = useActionState(createPaymentAction, null);

    useEffect(() => {
        if (state?.success) onClose();
    }, [state, onClose]);

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            title="Record Payment"
            description="Register financial credit/debit into strategic ledger."
        >
            <form action={formAction} className="space-y-6 md:space-y-8">
                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-foreground/50 pl-1">Target Booking / Client Identity</label>
                    <select
                        name="planId"
                        required
                        className="w-full px-5 py-4 bg-brand-secondary/30 border border-border/20 rounded-2xl text-[11px] font-black uppercase tracking-tight outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all appearance-none cursor-pointer text-foreground"
                    >
                        <option value="">CHOOSE AN ACTIVE PLAN...</option>
                        {activePlans.map(plan => (
                            <option key={plan.id} value={plan.id}>{plan.label.toUpperCase()}</option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground/50 pl-1">Capital Amount (PKR)</label>
                        <div className="relative">
                            <Wallet className="absolute left-4 top-4 text-foreground/30" size={16} />
                            <input
                                name="amountPaid"
                                type="number"
                                required
                                placeholder="45000"
                                className="w-full pl-12 pr-5 py-4 bg-brand-secondary/30 border border-border/20 rounded-2xl text-[11px] font-black font-mono tracking-tight outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all text-foreground"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground/50 pl-1">Receipt Identifier</label>
                        <div className="relative">
                            <Hash className="absolute left-4 top-4 text-foreground/30" size={16} />
                            <input
                                name="receiptNumber"
                                required
                                placeholder="REC-00123"
                                className="w-full pl-12 pr-5 py-4 bg-brand-secondary/30 border border-border/20 rounded-2xl text-[11px] font-black uppercase tracking-tight outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all placeholder:text-foreground/30 text-foreground"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground/50 pl-1">Transaction Method</label>
                        <div className="relative">
                            <CreditCard className="absolute left-4 top-4 text-foreground/30" size={16} />
                            <select
                                name="paymentMethod"
                                className="w-full pl-12 pr-5 py-4 bg-brand-secondary/30 border border-border/20 rounded-2xl text-[11px] font-black uppercase tracking-tight outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all appearance-none cursor-pointer text-foreground"
                            >
                                <option value="Cash">CASH PAYMENT</option>
                                <option value="Bank Transfer">BANK TRANSFER</option>
                                <option value="Cheque">INSTRUMENT / CHEQUE</option>
                                <option value="Online">DIGITAL / MOBILE</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground/50 pl-1">Strategic References</label>
                        <div className="relative">
                            <Info className="absolute left-4 top-4 text-foreground/30" size={16} />
                            <input
                                name="notes"
                                placeholder="OPTIONAL TRANSACTION NOTES"
                                className="w-full pl-12 pr-5 py-4 bg-brand-secondary/30 border border-border/20 rounded-2xl text-[11px] font-black uppercase tracking-tight outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all placeholder:text-foreground/30 text-foreground"
                            />
                        </div>
                    </div>
                </div>

                {state?.message && (
                    <p className={`text-center text-[10px] font-black uppercase tracking-widest ${state.success ? 'text-green-500' : 'text-red-500'}`}>
                        {state.message}
                    </p>
                )}

                <div className="pt-6 border-t border-border/10 flex gap-4">
                    <Button type="button" variant="outline" className="flex-1 h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest" onClick={onClose}>Abort</Button>
                    <Button type="submit" className="flex-1 h-14 rounded-2xl bg-foreground text-background text-[10px] font-black uppercase tracking-widest shadow-2xl active:scale-95 disabled:opacity-50 font-bold" disabled={isPending}>
                        {isPending ? "Confirming..." : "Confirm Payment"}
                    </Button>
                </div>
            </form>
        </Dialog>
    );
}