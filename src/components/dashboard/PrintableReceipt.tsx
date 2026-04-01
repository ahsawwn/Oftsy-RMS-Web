"use client";

import React from "react";
import { format } from "date-fns";
import { QrCode, ShieldCheck, Printer, Download } from "lucide-react";

interface ReceiptProps {
    data: {
        receiptNo: string;
        date: Date;
        receivedFrom: string;
        amount: number;
        paymentMethod: string;
        projectName: string;
        plotNo: string;
        size: string;
        totalPrice?: number;
        balanceRemaining?: number;
        category?: string; // e.g., Installment, Membership, Transfer Fee
    };
}

export default function PrintableReceipt({ data }: ReceiptProps) {
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm">
            <div className="flex justify-between items-center mb-6 no-print">
                <h3 className="text-sm font-black uppercase tracking-widest text-zinc-500">Live Receipt Preview</h3>
                <div className="flex gap-2">
                    <button 
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 text-white text-xs font-bold rounded-lg hover:bg-black transition-all"
                    >
                        <Printer size={14} /> Print A4
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-zinc-100 text-zinc-600 text-xs font-bold rounded-lg hover:bg-zinc-200 transition-all">
                        <Download size={14} /> PDF
                    </button>
                </div>
            </div>

            {/* A4 Content Area */}
            <div className="print-area bg-white text-black font-sans leading-relaxed selection:bg-zinc-100 relative">
                <style jsx global>{`
                    @media print {
                        body * {
                            visibility: hidden !important;
                        }
                        .print-area, .print-area * {
                            visibility: visible !important;
                        }
                        .print-area {
                            position: fixed !important;
                            left: 0 !important;
                            top: 0 !important;
                            width: 210mm !important;
                            height: 297mm !important;
                            padding: 20mm !important;
                            margin: 0 !important;
                            background: white !important;
                            -webkit-print-color-adjust: exact;
                        }
                        .no-print {
                            display: none !important;
                        }
                    }
                `}</style>

                {/* Header */}
                <div className="flex justify-between items-start border-b-2 border-zinc-900 pb-8 mb-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="size-12 bg-black rounded-xl flex items-center justify-center">
                                <span className="text-white font-black text-xl">A</span>
                            </div>
                            <div>
                                <h1 className="text-3xl font-black tracking-tighter uppercase leading-none">ABH Holdings</h1>
                                <p className="text-[10px] font-black tracking-[0.3em] text-zinc-500 uppercase mt-1">Real Estate Management System</p>
                            </div>
                        </div>
                        <div className="text-[10px] space-y-0.5">
                            <p className="font-bold">ABH Holdings (SMC-PRIVATE) Limited</p>
                            <p className="text-zinc-500">Head Office: Blue Area, Islamabad, Pakistan</p>
                            <p className="text-zinc-500 font-medium">Web: www.abh-holdings.com</p>
                        </div>
                    </div>

                    <div className="text-right space-y-2">
                        <div className="inline-block border border-zinc-900 px-4 py-2 rounded-lg bg-zinc-50">
                            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 leading-none">Receipt Number</p>
                            <p className="text-xl font-black tracking-tighter">{data.receiptNo}</p>
                        </div>
                        <p className="text-[10px] font-bold text-zinc-500 uppercase">Issue Date: {format(data.date, "dd MMM yyyy")}</p>
                    </div>
                </div>

                {/* Body */}
                <div className="space-y-12">
                    <div className="grid grid-cols-2 gap-12">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase text-zinc-400">Received From</p>
                            <p className="text-lg font-bold border-b border-zinc-200 pb-2">{data.receivedFrom}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase text-zinc-400">Payment Category</p>
                            <p className="text-lg font-bold border-b border-zinc-200 pb-2">{data.category || "General Installment"}</p>
                        </div>
                    </div>

                    <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-8 grid grid-cols-3 gap-8">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Project Name</p>
                            <p className="font-bold text-zinc-900">{data.projectName}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Unit / Plot No.</p>
                            <p className="font-bold text-zinc-900">{data.plotNo}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Unit Size</p>
                            <p className="font-bold text-zinc-900">{data.size}</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex justify-between items-end border-b-2 border-zinc-100 pb-2">
                            <h2 className="text-sm font-black uppercase tracking-widest text-zinc-500">Transaction Breakdown</h2>
                            <p className="text-sm font-bold text-zinc-500 italic">Amounts in PKR (Pakistani Rupee)</p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-zinc-600">Initial Down Payment / Booking</span>
                                <span className="font-bold">PKR {data.totalPrice ? (data.totalPrice * 0.1).toLocaleString() : "---"}</span>
                            </div>
                            <div className="flex justify-between items-center text-xl">
                                <span className="font-black uppercase tracking-tight">Amount Received Now</span>
                                <span className="font-black text-2xl tracking-tighter">PKR {data.amount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t border-zinc-200">
                                <span className="font-bold text-zinc-500 uppercase text-[10px] tracking-widest">Remaining Balance</span>
                                <span className="font-black text-zinc-400 tracking-tighter">PKR {data.balanceRemaining?.toLocaleString() || "---"}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Legal & Footer Section */}
                <div className="absolute bottom-10 left-0 right-0 pt-8 border-t border-zinc-200 bg-zinc-50/50 -mx-[20mm] px-[20mm] pb-[10mm]">
                    <div className="grid grid-cols-2 gap-12">
                        {/* Left: Terms */}
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-900 underline underline-offset-4">Important Terms & Conditions</h4>
                            <div className="space-y-2 text-[8px] leading-[1.3] text-zinc-600 text-justify">
                                <p>1. <strong>Provisional Receipt:</strong> This is a provisional receipt subject to the realization of cheques/drafts. The final allotment is contingent upon the clearance of all dues.</p>
                                <p>2. <strong>Surcharge Policy:</strong> Installments must be paid by the 5th of every month. A daily surcharge of 0.1% applies to late payments.</p>
                                <p>3. <strong>Transfer Rules:</strong> Property files are only transferable after the issuance of an NDC (No Demand Certificate) and payment of the Transfer Fee.</p>
                                <p>4. <strong>Society Dues:</strong> Any increase in development charges or taxes imposed by the Housing Society or Government authorities shall be borne by the Allottee.</p>
                                <p>5. <strong>Refund Policy:</strong> In case of cancellation, 20% of the total paid amount will be deducted as service charges.</p>
                            </div>
                        </div>

                        {/* Right: QR & Signatures */}
                        <div className="flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                    <p className="text-[8px] font-black uppercase text-zinc-400 tracking-widest">Digital Verification</p>
                                    <div className="p-2 bg-white border border-zinc-200 rounded-lg inline-block shadow-sm">
                                        {/* Dynamic QR Placeholder with fallback to Lucide */}
                                        <QrCode size={56} className="text-zinc-900" />
                                    </div>
                                    <p className="text-[6px] text-zinc-400 uppercase font-black tracking-tighter mt-1">Encrypted Payload verified by Oftsy RMS</p>
                                </div>
                                
                                <div className="text-center relative pt-8 pr-4">
                                    {/* Verification Stamp SVG Placeholder */}
                                    <div className="absolute top-0 right-4 opacity-10 pointer-events-none scale-125">
                                        <svg width="80" height="80" viewBox="0 0 100 100" className="text-zinc-900">
                                            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2" />
                                            <text x="50" y="45" textAnchor="middle" fontSize="8" fontWeight="bold" fill="currentColor">ABH HOLDINGS</text>
                                            <text x="50" y="55" textAnchor="middle" fontSize="6" fill="currentColor">VERIFIED SEATED</text>
                                            <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="1" />
                                        </svg>
                                    </div>
                                    <div className="w-44 h-px bg-zinc-900 mb-2" />
                                    <p className="text-[9px] font-black uppercase tracking-widest">Authorized Signatory</p>
                                    <p className="text-[7px] text-zinc-500 italic mt-1 font-bold">Finance & Audit Division • ABH Holdings</p>
                                </div>
                            </div>

                            <div className="mt-auto text-right pr-4">
                                <p className="text-[10px] font-black text-zinc-900 uppercase tracking-tighter">ABH Holdings (SMC-PRIVATE) Limited</p>
                                <p className="text-[7px] text-zinc-500 font-bold uppercase tracking-[0.3em] mt-1">"Building Excellence, Delivering Trust."</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
