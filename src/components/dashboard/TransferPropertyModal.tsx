"use client";

import { useActionState, useEffect, useState } from "react";
import { transferPropertyAction } from "@/app/dashboard/properties/transfer-action";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { UserPlus, Wallet, ArrowRightLeft, ShieldAlert } from "lucide-react";

interface TransferProps {
    isOpen: boolean;
    onClose: () => void;
    propertyId: string;
    propertyName: string;
    currentLeadId: string;
    currentLeadName: string;
    allLeads: { id: string, name: string }[];
}

export default function TransferPropertyModal({ 
    isOpen, 
    onClose, 
    propertyId, 
    propertyName, 
    currentLeadId, 
    currentLeadName,
    allLeads 
}: TransferProps) {
    const [fee, setFee] = useState(0);
    const [newLeadId, setNewLeadId] = useState("");

    // The server action requires manual arguments, so we wrap it for useActionState if needed or use a custom handler.
    const handleTransfer = async () => {
        if (!newLeadId) return alert("Please select a new owner.");
        const res = await transferPropertyAction(propertyId, currentLeadId, newLeadId, fee);
        if (res.success) {
            onClose();
        } else {
            alert(res.message);
        }
    };

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            title="P2P Ownership Transfer"
            description="Transfer legal ownership of this file/unit between clients."
        >
            <div className="space-y-8 py-4">
                {/* Visual Flow */}
                <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                    <div className="text-center flex-1">
                        <p className="text-[9px] font-black uppercase text-zinc-500 mb-1">Current Owner</p>
                        <p className="font-bold text-sm truncate">{currentLeadName}</p>
                    </div>
                    <ArrowRightLeft className="text-zinc-300 mx-4" size={20} />
                    <div className="text-center flex-1">
                        <p className="text-[9px] font-black uppercase text-zinc-500 mb-1">New Owner</p>
                        <p className="font-bold text-sm text-brand-primary truncate">{allLeads.find(l => l.id === newLeadId)?.name || '???'}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Select New Buyer</label>
                        <select 
                            value={newLeadId}
                            onChange={(e) => setNewLeadId(e.target.value)}
                            className="w-full px-4 py-2.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm outline-none"
                        >
                            <option value="">Select a lead...</option>
                            {allLeads.filter(l => l.id !== currentLeadId).map(l => (
                                <option key={l.id} value={l.id}>{l.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Processing / Transfer Fee (PKR)</label>
                        <div className="relative">
                            <Wallet className="absolute left-3 top-3 text-zinc-400" size={16} />
                            <input
                                type="number"
                                value={fee}
                                onChange={(e) => setFee(Number(e.target.value))}
                                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm outline-none"
                                placeholder="0"
                            />
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl flex gap-3 text-blue-700">
                    <ShieldAlert size={18} className="shrink-0" />
                    <p className="text-[10px] leading-relaxed font-bold uppercase tracking-tight">
                        Warning: This action is final and will be logged in the ABH Holdings Audit Trail. 
                        Digital ownership certificates will be updated immediately.
                    </p>
                </div>

                <div className="flex gap-3">
                    <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
                    <Button className="flex-1 bg-zinc-900 text-white" onClick={handleTransfer} icon={ArrowRightLeft}>Confirm Transfer</Button>
                </div>
            </div>
        </Dialog>
    );
}
