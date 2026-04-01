"use client";

import { useState } from "react";
import { 
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
} from "@tanstack/react-table";
import Link from "next/link";
import { MapPin, ArrowUpRight, ExternalLink, MoreVertical, Building2, ChevronRight, ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export type PropertyData = {
    id: string;
    name: string;
    location: string;
    type: string;
    status: string;
    price: number;
    plotNumber: string | null;
    societyName: string | null;
};

export function PropertiesTable({ data }: { data: PropertyData[] }) {
    const columns: ColumnDef<PropertyData>[] = [
        {
            accessorKey: "name",
            header: "Asset Portfolio",
            cell: ({ row }) => {
                const prop = row.original;
                return (
                    <Link href={`/dashboard/properties/${prop.id}`} className="block space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-foreground uppercase tracking-tight group-hover:underline decoration-2 underline-offset-4">
                                {prop.name}
                            </span>
                            {prop.plotNumber && (
                                <span className="text-[9px] font-black font-mono text-foreground/40">
                                    # {prop.plotNumber}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-foreground/50 uppercase tracking-tight">
                            <MapPin size={10} className="text-foreground/40" />
                            {prop.location}
                        </div>
                    </Link>
                );
            },
        },
        {
            accessorFn: (row) => row.societyName || "GLOBAL",
            id: "societyName",
            header: "Society / Project",
            cell: ({ getValue }) => (
                <div className="text-[11px] font-black text-foreground/70 uppercase tracking-tight">
                    {getValue() as string}
                </div>
            ),
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => (
                <Badge
                    variant={row.original.status === "Available" ? "success" : "warning"}
                    className="text-[9px] font-black px-2 py-0"
                >
                    {row.original.status}
                </Badge>
            ),
        },
        {
            accessorKey: "price",
            header: () => <div className="text-right">Valuation (PKR)</div>,
            cell: ({ row }) => (
                <div className="text-right flex flex-col items-end">
                    <div className="text-sm font-black font-mono tracking-tighter">
                        {row.original.price.toLocaleString()}
                    </div>
                </div>
            ),
        },
        {
            id: "actions",
            header: "",
            cell: ({ row }) => (
                <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                        href={`/dashboard/properties/${row.original.id}`}
                        className="p-2 hover:bg-brand-secondary rounded-lg text-foreground/50"
                    >
                        <ExternalLink size={14} />
                    </Link>
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
            {/* Desktop Table View */}
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
                    <tbody className="divide-y divide-border/20">
                        {table.getRowModel().rows.map((row) => (
                            <tr key={row.id} className="group hover:bg-brand-secondary/20 transition-colors">
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

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {table.getRowModel().rows.map((row) => {
                    const prop = row.original;
                    return (
                        <div key={prop.id} className="bg-background border border-border/40 rounded-[2rem] p-5 shadow-sm active:scale-[0.98] transition-transform">
                            <div className="flex justify-between items-start mb-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <div className="size-8 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary">
                                            <Building2 size={16} />
                                        </div>
                                        <h3 className="text-sm font-black uppercase tracking-tight text-foreground">{prop.name}</h3>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-foreground/40 uppercase tracking-tight">
                                        <MapPin size={10} />
                                        {prop.location}
                                    </div>
                                </div>
                                <Badge
                                    variant={prop.status === "Available" ? "success" : "warning"}
                                    className="text-[8px] font-black uppercase px-2"
                                >
                                    {prop.status}
                                </Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-4 py-4 border-y border-border/20">
                                <div>
                                    <p className="text-[8px] font-black uppercase text-foreground/40 mb-1">Project Scope</p>
                                    <p className="text-[10px] font-black text-foreground uppercase truncate">{prop.societyName || "GLOBAL"}</p>
                                </div>
                                <div>
                                    <p className="text-[8px] font-black uppercase text-foreground/40 mb-1">Current Valuation</p>
                                    <p className="text-[11px] font-black font-mono text-foreground uppercase tracking-tighter">
                                        PKR {prop.price.toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            <div className="pt-4 flex items-center justify-between">
                                 <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 bg-brand-secondary/50 rounded-lg text-[8px] font-black uppercase tracking-widest text-foreground/60">
                                        {prop.type}
                                    </span>
                                    {prop.plotNumber && (
                                         <span className="text-[9px] font-black font-mono text-foreground/30">
                                            #{prop.plotNumber}
                                        </span>
                                    )}
                                 </div>
                                 <Link 
                                    href={`/dashboard/properties/${prop.id}`}
                                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-primary"
                                 >
                                    Details <ChevronRight size={14} />
                                 </Link>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Modern Pagination Navigation */}
            <div className="flex items-center justify-between border-t border-border/10 pt-6">
                 <div className="hidden sm:block">
                     <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30">
                        Showing <span className="text-foreground/60">{table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}</span> to <span className="text-foreground/60">{Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, data.length)}</span> of <span className="text-foreground/60">{data.length}</span> Assets
                     </p>
                 </div>
                 <div className="flex items-center gap-2 ml-auto">
                    <div className="flex items-center mr-4 text-[10px] font-black uppercase tracking-widest text-foreground/40 gap-2">
                        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </div>
                    <Button 
                        variant="outline" 
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="h-10 w-10 p-0 rounded-xl border-border/20 hover:bg-brand-secondary disabled:opacity-30"
                    >
                        <ChevronLeft size={16} />
                    </Button>
                    <Button 
                        variant="outline"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="h-10 w-10 p-0 rounded-xl border-border/20 hover:bg-brand-secondary disabled:opacity-30"
                    >
                        <ChevronRight size={16} />
                    </Button>

                 </div>
            </div>
        </div>
    );
}
