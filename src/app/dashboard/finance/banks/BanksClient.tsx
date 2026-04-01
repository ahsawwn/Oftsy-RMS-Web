"use client";

import { useState } from "react";
import { Landmark, ArrowRightLeft, ArrowDownToLine, MoreVertical, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import AddBankModal from "@/components/dashboard/AddBankModal";

interface BankAccount {
    id: string;
    bankName: string;
    accountNumber: string;
    currentBalance: number;
}

export default function BanksClient({ initialBanks }: { initialBanks: BankAccount[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const totalLiquidity = initialBanks.reduce((sum, b) => sum + (b.currentBalance || 0), 0);

    return (
        <div className="space-y-12 pb-20 animate-in fade-in duration-1000">
            {/* Bank Governance Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between border-b border-zinc-200 dark:border-zinc-800 pb-10 gap-8">
                <div className="space-y-2">
                    <h1 className="text-5xl font-black tracking-tighter uppercase text-zinc-950 dark:text-zinc-50 leading-none">
                        Corporate Banks
                    </h1>
                    <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">
                        <Landmark size={14} className="text-zinc-400" />
                        Liquidity & Asset Channels • ABH Holdings
                    </p>
                </div>

                <div className="flex items-center gap-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2 rounded-xl shadow-sm">
                    <div className="px-6 py-2 border-r border-zinc-200 dark:border-zinc-800 text-right">
                        <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 leading-none">Total Liquid Assets</p>
                        <p className="text-xl font-black font-mono tracking-tighter mt-1 whitespace-nowrap">PKR {totalLiquidity.toLocaleString()}</p>
                    </div>
                    <div className="px-4">
                        <Button 
                            onClick={() => setIsModalOpen(true)}
                            className="bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950 text-[10px] font-black uppercase tracking-widest px-6" 
                            icon={Plus}
                        >
                            Open Channel
                        </Button>
                    </div>
                </div>
            </div>

            {/* Matrix View */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {initialBanks.length === 0 ? (
                    <div className="col-span-full py-32 border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-xl flex flex-col items-center gap-4 opacity-50">
                        <Landmark size={48} className="text-zinc-300" />
                        <p className="text-[10px] font-black uppercase tracking-widest">No Active Channels</p>
                    </div>
                ) : (
                    initialBanks.map((bank) => (
                        <Card key={bank.id} className="group border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-xl overflow-hidden hover:ring-2 hover:ring-zinc-950 dark:hover:ring-zinc-100 transition-all cursor-pointer shadow-sm">
                            <div className="p-10 border-b border-zinc-100 dark:border-zinc-900 flex justify-between items-start">
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-black uppercase tracking-tighter text-zinc-950 dark:text-zinc-50">{bank.bankName}</h3>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 font-mono">IBAN: {bank.accountNumber}</p>
                                </div>
                                <button className="p-2 text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg">
                                    <MoreVertical size={20} />
                                </button>
                            </div>
                            <div className="p-10 bg-zinc-50/50 dark:bg-zinc-900/10 flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black uppercase text-green-600 tracking-widest flex items-center gap-2">
                                        <ArrowDownToLine size={10} /> Active Capital
                                    </p>
                                    <p className="text-3xl font-black font-mono tracking-tighter text-zinc-950 dark:text-zinc-50">
                                        PKR {bank.currentBalance.toLocaleString()}
                                    </p>
                                </div>
                                <Button variant="outline" className="h-10 px-4 rounded-lg bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800" icon={ArrowRightLeft}>Transfer</Button>
                            </div>
                        </Card>
                    ))
                )}
            </div>

            <AddBankModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}
