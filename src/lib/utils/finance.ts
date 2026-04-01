import { addMonths, format } from "date-fns";

export function generateSchedule(
    totalPrice: number,
    downPayment: number,
    months: number,
    startDate: Date = new Date()
) {
    const remainingBalance = totalPrice - downPayment;
    const monthlyAmount = Math.floor(remainingBalance / months);

    const schedule = [];

    for (let i = 1; i <= months; i++) {
        schedule.push({
            installmentNumber: i,
            dueDate: addMonths(startDate, i),
            amount: monthlyAmount,
            status: "Pending",
        });
    }

    return schedule;
}