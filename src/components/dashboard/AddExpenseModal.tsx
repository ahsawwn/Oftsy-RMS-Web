"use client";

import { useActionState, useEffect } from "react";
import { X, TrendingDown, Activity, Landmark, Wallet, ReceiptText, Tag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { createExpenseAction } from "@/app/dashboard/finance/expenses/actions";

interface AddExpenseModalProps {
    isOpen: boolean;
    onClose: () => void;
    bankAccounts: { id: string, name: string }[];
}

export default function AddExpenseModal({ isOpen, onClose, bankAccounts }: AddExpenseModalProps) {
    const [state, formAction, isPending] = useActionState(createExpenseAction, null);

    useEffect(() => {
        if (state?.success) onClose();
    }, [state, onClose]);

    return (
        <Dialog 
            isOpen={isOpen} 
            onClose={onClose} 
            title="Debit Transaction" 
            description="Operating Expenditure Audit"
        >
            <form action={formAction} className="space-y-6 md:space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground/50 pl-1">Expenditure Class</label>
                        <div className="relative">
                            <Tag className="absolute left-4 top-4 text-foreground/30" size={16} />
                            <select name="category" required className="w-full pl-12 pr-5 py-4 bg-brand-secondary/30 border border-border/20 rounded-2xl text-[11px] font-black uppercase tracking-tight outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all appearance-none cursor-pointer text-foreground">
                                <option value="Office Rent">OFFICE RENT</option>
                                <option value="Marketing & Branding">MARKETING & BRANDING</option>
                                <option value="Admin Salaries">ADMIN SALARIES</option>
                                <option value="Utilities">UTILITIES</option>
                                <option value="Miscellaneous">MISCELLANEOUS</option>
                            </select>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground/50 pl-1">Settlement Total (PKR)</label>
                        <div className="relative">
                            <Wallet className="absolute left-4 top-4 text-foreground/30" size={16} />
                            <input
                                name="amount"
                                type="number"
                                required
                                placeholder="45000"
                                className="w-full pl-12 pr-5 py-4 bg-brand-secondary/30 border border-border/20 rounded-2xl text-[11px] font-black uppercase font-mono tracking-tight outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all text-foreground"
                            />
                        </div>
                    </div>
                    <div className="space-y-3 md:col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground/50 pl-1">Channel Source</label>
                        <div className="relative">
                            <Landmark className="absolute left-4 top-4 text-foreground/30" size={16} />
                            <select name="bankAccountId" required className="w-full pl-12 pr-5 py-4 bg-brand-secondary/30 border border-border/20 rounded-2xl text-[11px] font-black uppercase tracking-tight outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all appearance-none cursor-pointer text-foreground font-mono">
                                <option value="">SELECT SOURCE ACCOUNT...</option>
                                {bankAccounts.map(b => (
                                    <option key={b.id} value={b.id}>{b.name.toUpperCase()}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="space-y-3 md:col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground/50 pl-1">Process Detail Trace</label>
                        <div className="relative">
                            <ReceiptText className="absolute left-4 top-4 text-foreground/30" size={16} />
                            <textarea
                                name="description"
                                placeholder="AUDIT NOTES, REASON FOR WITHDRAWAL, ETC."
                                className="w-full pl-12 pr-5 py-4 bg-brand-secondary/30 border border-border/20 rounded-2xl text-[11px] font-black uppercase tracking-tight outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all h-32 resize-none text-foreground"
                            />
                        </div>
                    </div>
                </div>

                {state?.message && (
                    <p className={`text-center text-[10px] font-black uppercase tracking-widest ${state.success ? 'text-green-500' : 'text-red-500'}`}>
                        {state.message}
                    </p>
                )}

                <div className="pt-6 border-t border-border/10 flex justify-end gap-4">
                    <Button variant="outline" onClick={onClose} type="button" className="h-14 px-10 rounded-2xl text-[10px] font-black uppercase tracking-widest">Abort</Button>
                    <Button type="submit" disabled={isPending} className="h-14 px-10 bg-red-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl active:scale-95 disabled:opacity-50 font-bold">
                        {isPending ? "Syncing..." : "Confirm Disbursement"}
                    </Button>
                </div>
            </form>
        </Dialog>
    );
}
