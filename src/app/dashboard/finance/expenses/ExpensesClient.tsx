"use client";

import { useState } from "react";
import { 
    Wallet, ReceiptText, ShieldCheck, 
    Activity, Plus, Search, Filter, 
    MoreVertical, TrendingDown 
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatPKT } from "@/lib/utils/date-utils";
import AddExpenseModal from "@/components/dashboard/AddExpenseModal";

interface Expense {
    id: string;
    category: string;
    description: string | null;
    amount: number;
    date: Date;
    bankName: string | null;
}

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/DataTable";

const columns: ColumnDef<Expense>[] = [
    {
        accessorKey: "date",
        header: "Audit Reference",
        cell: ({ row }) => {
            const ex = row.original;
            return (
                <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase text-zinc-950 dark:text-zinc-50 tracking-tight leading-none">
                        {ex.date ? formatPKT(ex.date, "dd MMM yyyy") : "N/A"}
                    </p>
                    <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest mt-1">
                        Settled: {ex.bankName}
                    </p>
                </div>
            );
        }
    },
    {
        accessorKey: "category",
        header: "Expenditure Class",
        cell: ({ row }) => (
            <Badge variant="outline" className="text-[8px] font-black px-2 h-5 uppercase tracking-widest border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                {row.original.category}
            </Badge>
        )
    },
    {
        accessorKey: "description",
        header: "Description Trace",
        cell: ({ row }) => (
            <div className="space-y-1">
                <p className="text-[11px] font-black uppercase tracking-tight text-zinc-700 dark:text-zinc-300 leading-none">
                    {row.original.description || "N/A"}
                </p>
                <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">
                    Authorized Audit Entry
                </p>
            </div>
        )
    },
    {
        accessorKey: "amount",
        header: () => <div className="text-right">Settlement Total</div>,
        cell: ({ row }) => (
            <div className="text-right flex flex-col items-end font-black">
                <p className="text-sm font-black font-mono tracking-tighter text-zinc-950 dark:text-zinc-50">
                    PKR {row.original.amount.toLocaleString()}
                </p>
                <div className="flex items-center justify-end gap-1.5 text-[8px] font-black text-red-600 uppercase mt-0.5">
                    <TrendingDown size={10} /> Deducting
                </div>
            </div>
        )
    }
];

export default function ExpensesClient({ initialExpenses, bankAccounts }: { 
    initialExpenses: Expense[], 
    bankAccounts: { id: string, name: string }[] 
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="space-y-12 pb-20 animate-in fade-in duration-1000">
            {/* Expenses Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between border-b border-zinc-200 dark:border-zinc-800 pb-10 gap-8">
                <div className="space-y-2">
                    <h1 className="text-5xl font-black tracking-tighter uppercase text-zinc-950 dark:text-zinc-50 leading-none">
                        Expense Audit
                    </h1>
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-2">
                        <Wallet size={14} className="text-zinc-400" />
                        Operating Expenditure • ABH Holdings Ledger
                    </p>
                </div>
                
                <div className="flex items-center gap-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2 rounded-2xl shadow-sm">
                    <div className="px-6 py-2 border-r border-zinc-200 dark:border-zinc-800 text-right">
                        <p className="text-[9px] font-black uppercase text-zinc-400 tracking-widest leading-none">Gross Disbursement</p>
                        <p className="text-xl font-black font-mono mt-1 whitespace-nowrap">PKR {initialExpenses.reduce((sum, e) => sum + (e.amount || 0), 0).toLocaleString()}</p>
                    </div>
                    <div className="px-4">
                        <Button onClick={() => setIsModalOpen(true)} className="bg-zinc-950 text-white text-[10px] font-black uppercase tracking-widest px-8" icon={Plus}>Log Entry</Button>
                    </div>
                </div>
            </div>

            {/* Audit View Matrix */}
            <DataTable columns={columns} data={initialExpenses} />

            <AddExpenseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} bankAccounts={bankAccounts} />
        </div>
    );
}
