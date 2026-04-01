import { differenceInMonths } from "date-fns";
import { InstallmentPlan, Payment } from "../db/schema";

interface RecoveryStatus {
    planId: string;
    expectedInstallments: number;
    paidInstallments: number;
    overdueCount: number;
    isDefaulted: boolean;
}

export function calculateRecoveryStatus(
    plan: InstallmentPlan,
    payments: Payment[]
): RecoveryStatus {
    const monthsSinceStart = differenceInMonths(new Date(), new Date(plan.startDate));

    // Cap the expected installments at the total contract duration
    const expected = Math.min(monthsSinceStart, plan.totalInstallments);

    // Count how many monthly installments have been covered
    // (Total Paid / Monthly Amount)
    const totalPaid = payments.reduce((sum, p) => sum + p.amountPaid, 0) - plan.downPayment;
    const paidCount = Math.floor(totalPaid / plan.monthlyAmount);

    const overdue = expected - paidCount;

    return {
        planId: plan.id,
        expectedInstallments: expected,
        paidInstallments: paidCount,
        overdueCount: overdue > 0 ? overdue : 0,
        isDefaulted: overdue >= 3, // ABH Holdings Policy: 3 months late = Default
    };
}