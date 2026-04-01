"use client";

import { useState } from "react";
import { 
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/Button";
import { Phone, Mail, MoreVertical, Zap, CalendarCheck, User, ChevronRight, ChevronLeft, MessageSquare } from "lucide-react";
import StatusSwitcher from "@/components/dashboard/StatusSwitcher";

export type LeadData = {
    id: string;
    name: string;
    email: string | null;
    phone: string;
    status: string;
    source: string | null;
    propertyId: string | null;
    propertyName: string | null;
    createdAt: Date;
};

export function LeadsTable({ data }: { data: LeadData[] }) {
    const columns: ColumnDef<LeadData>[] = [
        {
            accessorKey: "name",
            header: "Client Profile",
            cell: ({ row }) => {
                const item = row.original;
                return (
                    <div className="space-y-1">
                        <p className="text-sm font-black text-foreground uppercase tracking-tight group-hover:underline underline-offset-4 decoration-2">
                            {item.name}
                        </p>
                        <div className="flex items-center gap-1.5 text-[9px] font-black text-foreground/40 uppercase tracking-widest">
                            <Zap size={10} className="text-brand-primary" />
                            Managed via {item.source || "ABH Hub"}
                        </div>
                    </div>
                );
            },
        },
        {
            id: "communication",
            header: "Communication",
            cell: ({ row }) => {
                const item = row.original;
                return (
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-foreground/70">
                            <Phone size={12} className="text-foreground/40" />
                            <span className="text-[11px] font-black font-mono tracking-widest">{item.phone}</span>
                        </div>
                        {item.email && (
                            <div className="flex items-center gap-2 text-foreground/40">
                                <Mail size={12} />
                                <span className="text-[10px] font-bold lowercase tracking-normal">{item.email}</span>
                            </div>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: "status",
            header: "Pipeline Status",
            cell: ({ row }) => {
                const item = row.original;
                return <StatusSwitcher leadId={item.id} currentStatus={item.status} />;
            },
        },
        {
            id: "actions",
            header: "",
            cell: () => (
                <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-brand-secondary rounded-xl text-foreground/40">
                        <MoreVertical size={16} />
                    </button>
                </div>
            ),
        },
    ];

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
    });

    return (
        <div className="space-y-6">
            {/* Desktop View */}
            <div className="hidden md:block rounded-xl border border-border/40 bg-background overflow-hidden">
                <table className="w-full text-left border-collapse text-sm">
                    <thead className="bg-brand-secondary/30 border-b border-border/40 text-[10px] font-black uppercase tracking-widest text-foreground/40">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th key={header.id} className="px-6 py-4 font-black">
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="divide-y divide-border/10">
                        {table.getRowModel().rows.map((row) => (
                            <tr key={row.id} className="group hover:bg-brand-secondary/10 transition-colors">
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id} className="px-6 py-4">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile View */}
            <div className="md:hidden space-y-4">
                {table.getRowModel().rows.map((row) => {
                    const lead = row.original;
                    return (
                        <div key={lead.id} className="bg-background border border-border/50 rounded-[2rem] p-5 shadow-sm active:scale-[0.98] transition-transform">
                            <div className="flex justify-between items-start mb-5">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black uppercase tracking-tight text-foreground">{lead.name}</h3>
                                        <p className="text-[8px] font-black uppercase tracking-[0.2em] text-foreground/40">Managed via {lead.source || "ABH Hub"}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="size-9 bg-brand-secondary rounded-full flex items-center justify-center text-foreground/60"><Phone size={14}/></button>
                                    <button className="size-9 bg-brand-secondary rounded-full flex items-center justify-center text-foreground/60"><Mail size={14}/></button>
                                </div>
                            </div>

                            <div className="space-y-4 py-4 border-y border-border/20">
                                <div>
                                    <p className="text-[8px] font-black uppercase text-foreground/40 mb-1">Interest Area</p>
                                    <div className="flex items-center gap-2">
                                        <div className="size-2 rounded-full bg-brand-primary animate-pulse" />
                                        <p className="text-[10px] font-black text-foreground uppercase truncate">{lead.propertyName || "General Discovery"}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[8px] font-black uppercase text-foreground/40 mb-2">Stage Progression</p>
                                    <StatusSwitcher leadId={lead.id} currentStatus={lead.status} />
                                </div>
                            </div>

                            <div className="pt-4 flex items-center justify-between">
                                 <div className="flex items-center gap-2">
                                    <MessageSquare size={12} className="text-brand-primary" />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-foreground/50">
                                        {new Date(lead.createdAt).toLocaleDateString()}
                                    </span>
                                 </div>
                                 <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-primary">
                                    Action <ChevronRight size={14} />
                                 </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between border-t border-border/10 pt-6">
                 <div className="hidden sm:block">
                     <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">
                        Pipeline Depth: <span className="text-foreground">{data.length} Leads</span>
                     </p>
                 </div>
                 <div className="flex items-center gap-1.5 ml-auto translate-y-[-2px]">
                    <div className="flex items-center mr-4 text-[9px] font-black uppercase tracking-[0.3em] text-foreground/30 gap-3">
                        <span className="h-px w-8 bg-border/20 hidden lg:block" /> Page {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
                    </div>
                    <Button 
                        variant="outline" 
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="h-9 w-9 p-0 rounded-lg border-border/10 hover:bg-brand-secondary disabled:opacity-20 transition-all font-black text-xs"
                    >
                        <ChevronLeft size={16} />
                    </Button>
                    <Button 
                        variant="outline"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="h-9 w-9 p-0 rounded-lg border-border/10 hover:bg-brand-secondary disabled:opacity-20 transition-all font-black text-xs"
                    >
                        <ChevronRight size={16} />
                    </Button>

                 </div>
            </div>
        </div>
    );
}
