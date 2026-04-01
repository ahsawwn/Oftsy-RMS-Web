"use client";

import { useState } from "react";
import { 
    ShieldAlert, History, User as UserIcon, 
    Globe, FileText, Search, Plus 
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatPKT } from "@/lib/utils/date-utils";
import AddLogModal from "@/components/dashboard/AddLogModal";
import { DataTable } from "@/components/ui/DataTable";
import { ColumnDef } from "@tanstack/react-table";

interface AuditLog {
    id: string;
    event: string;
    ip: string | null;
    metadata: any;
    date: Date;
    userEmail: string | null;
}

const columns: ColumnDef<AuditLog>[] = [
    {
        accessorKey: "event",
        header: "Activity Directive",
        cell: ({ row }) => {
            const log = row.original;
            return (
                <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-xl border flex items-center justify-center ${
                        log.event.includes('FAILED') || log.event.includes('REJECT')
                            ? 'bg-red-500/10 text-red-600 border-red-500/20' 
                            : log.event.includes('MANUAL')
                            ? 'bg-orange-500/10 text-orange-600 border-orange-500/20'
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 border-zinc-200 dark:border-zinc-700'
                    }`}>
                        <FileText size={16} />
                    </div>
                    <div className="space-y-1">
                        <p className="text-[11px] font-black tracking-tight uppercase leading-none text-zinc-950 dark:text-zinc-50">{log.event.replace(/_/g, ' ')}</p>
                        <p className="text-[9px] font-black font-mono tracking-tighter text-zinc-400">ID: {log.id.slice(0, 13)}</p>
                    </div>
                </div>
            );
        }
    },
    {
        accessorKey: "userEmail",
        header: "Actor Origin",
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="text-[11px] font-black uppercase tracking-tight text-zinc-900 dark:text-zinc-300">
                    {row.original.userEmail || "System Root"}
                </span>
                <div className="flex items-center gap-1.5 text-zinc-400 text-[8px] font-black uppercase tracking-widest mt-1">
                    <UserIcon size={10} /> Validated
                </div>
            </div>
        )
    },
    {
        accessorKey: "ip",
        header: "Network Traces",
        cell: ({ row }) => (
            <div className="flex items-center gap-2 font-mono text-[11px] font-black tracking-tighter text-zinc-600 dark:text-zinc-400">
                <Globe size={14} className="text-zinc-300" />
                {row.original.ip || "0.0.0.0"}
            </div>
        )
    },
    {
        accessorKey: "date",
        header: () => <div className="text-right">Timestamp</div>,
        cell: ({ row }) => (
            <div className="flex flex-col items-end">
                <span className="text-[10px] font-black uppercase tracking-tight text-zinc-950 dark:text-zinc-50">
                    {formatPKT(row.original.date, "dd MMM yyyy")}
                </span>
                <span className="text-[8px] font-black tracking-widest uppercase text-zinc-400 mt-1">
                    {formatPKT(row.original.date, "hh:mm a")} (PKT)
                </span>
            </div>
        )
    }
];

export default function AuditLogsClient({ initialLogs }: { initialLogs: AuditLog[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="space-y-12 pb-20 animate-in fade-in duration-1000">
            {/* Executive Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-200 dark:border-zinc-800 pb-10 gap-8">
                <div className="space-y-2">
                    <h1 className="text-5xl font-black tracking-tighter uppercase text-zinc-950 dark:text-zinc-50 leading-none">
                        System Audit
                    </h1>
                    <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">
                        <History size={14} className="text-zinc-400" />
                        Infrastructure Security Trace • Immutable
                    </p>
                </div>

                <div className="flex items-center gap-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2 rounded-2xl shadow-sm">
                    <div className="px-6 py-2 border-r border-zinc-200 dark:border-zinc-800 text-right">
                        <p className="text-[9px] font-black uppercase tracking-widest text-red-600 animate-pulse flex items-center gap-1.5 leading-none">
                            <ShieldAlert size={10} /> Active Mode
                        </p>
                        <p className="text-xl font-black font-mono mt-1 whitespace-nowrap text-zinc-950 dark:text-zinc-50">STRICT</p>
                    </div>
                    <div className="px-4">
                        <Button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-red-600 text-white text-[10px] font-black uppercase tracking-widest px-8 hover:bg-red-700" 
                            icon={Plus}
                        >
                            Inject Log
                        </Button>
                    </div>
                </div>
            </div>

            {/* Matrix View built on TanStack Table */}
            <DataTable columns={columns} data={initialLogs} />

            <AddLogModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}
