import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { generateSchedule } from "@/lib/utils/finance";
import { CalendarDays, Receipt } from "lucide-react";

interface PreviewProps {
    totalPrice: number;
    downPayment: number;
    duration: number;
}

export default function SchedulePreview({ totalPrice, downPayment, duration }: PreviewProps) {
    const schedule = generateSchedule(totalPrice, downPayment, duration);

    return (
        <Card className="border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden">
            <CardHeader className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="text-sm font-black uppercase tracking-widest">Payment Breakdown</CardTitle>
                        <p className="text-[10px] text-zinc-500 font-bold">Generated for ABH Holdings Client Contract</p>
                    </div>
                    <Receipt size={20} className="text-brand-primary" />
                </div>
            </CardHeader>

            <CardContent className="p-0">
                <div className="max-h-[400px] overflow-y-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="sticky top-0 bg-white dark:bg-zinc-950 text-zinc-400 font-bold uppercase text-[9px] tracking-tighter">
                        <tr>
                            <th className="px-6 py-3 border-b border-zinc-100 dark:border-zinc-800">No.</th>
                            <th className="px-6 py-3 border-b border-zinc-100 dark:border-zinc-800">Due Date</th>
                            <th className="px-6 py-3 border-b border-zinc-100 dark:border-zinc-800 text-right">Amount (PKR)</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50 dark:divide-zinc-900">
                        {schedule.map((item) => (
                            <tr key={item.installmentNumber} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30">
                                <td className="px-6 py-3 font-mono text-zinc-500">#{item.installmentNumber.toString().padStart(2, '0')}</td>
                                <td className="px-6 py-3 font-bold">
                                    <div className="flex items-center gap-2">
                                        <CalendarDays size={12} className="text-zinc-400" />
                                        {item.dueDate.toLocaleDateString('en-GB', { month: 'short', year: 'numeric', day: '2-digit' })}
                                    </div>
                                </td>
                                <td className="px-6 py-3 text-right font-black text-zinc-900 dark:text-zinc-100">
                                    {item.amount.toLocaleString()}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Summary Footer */}
                <div className="p-6 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-200 dark:border-zinc-800 grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <p className="text-[9px] font-black text-zinc-500 uppercase">Down Payment</p>
                        <p className="font-bold text-sm">PKR {downPayment.toLocaleString()}</p>
                    </div>
                    <div className="space-y-1 text-right">
                        <p className="text-[9px] font-black text-zinc-500 uppercase">Total Liability</p>
                        <p className="font-bold text-sm text-brand-primary">PKR {totalPrice.toLocaleString()}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}