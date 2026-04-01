"use client";

import { useActionState, useEffect } from "react";
import { Landmark, Hash, Wallet, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { createBankAction } from "@/app/dashboard/finance/banks/actions";

export default function AddBankModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [state, formAction, isPending] = useActionState(createBankAction, null);

    useEffect(() => {
        if (state?.success) onClose();
    }, [state, onClose]);

    return (
        <Dialog 
            isOpen={isOpen} 
            onClose={onClose} 
            title="Register Bank" 
            description="ABH Corporate Liquidity Protocol"
        >
            <form action={formAction} className="space-y-6 md:space-y-8">
                <div className="space-y-6">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground/50 pl-1">Financial Institution</label>
                        <div className="relative">
                            <Landmark className="absolute left-4 top-4 text-foreground/30" size={16} />
                            <input
                                name="bankName"
                                required
                                placeholder="E.G. MEEZAN BANK LTD"
                                className="w-full pl-12 pr-5 py-4 bg-brand-secondary/30 border border-border/20 rounded-2xl text-[11px] font-black uppercase tracking-tight outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all placeholder:text-foreground/30 text-foreground"
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground/50 pl-1">Account Identifier</label>
                        <div className="relative">
                            <Hash className="absolute left-4 top-4 text-foreground/30" size={16} />
                            <input
                                name="accountNumber"
                                required
                                placeholder="PK00 MEZN 0000 1234 5678"
                                className="w-full pl-12 pr-5 py-4 bg-brand-secondary/30 border border-border/20 rounded-2xl text-[11px] font-black font-mono tracking-tight outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all placeholder:text-foreground/30 text-foreground"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground/50 pl-1">Initial Capital Balance (PKR)</label>
                        <div className="relative">
                            <Wallet className="absolute left-4 top-4 text-foreground/30" size={16} />
                            <input
                                name="initialBalance"
                                type="number"
                                required
                                placeholder="5000000"
                                className="w-full pl-12 pr-5 py-4 bg-brand-secondary/30 border border-border/20 rounded-2xl text-[11px] font-black font-mono tracking-tight outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all text-foreground"
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
                    <Button type="button" variant="outline" onClick={onClose} className="h-14 px-10 rounded-2xl text-[10px] font-black uppercase tracking-widest">Abort</Button>
                    <Button type="submit" disabled={isPending} className="h-14 px-10 bg-foreground text-background rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl active:scale-95 disabled:opacity-50 font-bold">
                        {isPending ? "Syncing..." : "Initialize Account"}
                    </Button>
                </div>
            </form>
        </Dialog>
    );
}
