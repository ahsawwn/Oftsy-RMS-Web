import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { officeExpenses, bankAccounts, authLogs } from "@/lib/db/schema";
import { z } from "zod";
import { desc, eq, sql } from "drizzle-orm";

const MobileExpenseSchema = z.object({
    category: z.enum(["Salaries", "Marketing", "Utilities", "Personal Withdrawal", "Other"]),
    amount: z.coerce.number().int().positive(),
    description: z.string().optional(),
    bankAccountId: z.string().uuid().optional().nullable(),
});

export async function GET(req: Request) {
    try {
        const expenses = await db.select().from(officeExpenses).orderBy(desc(officeExpenses.date)).limit(30);
        return NextResponse.json({ success: true, count: expenses.length, expenses });
    } catch (error) {
        return NextResponse.json({ error: "Expense Fetch Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validated = MobileExpenseSchema.safeParse(body);

        if (!validated.success) {
            return NextResponse.json({ error: "Validation Protocol Failure" }, { status: 400 });
        }

        const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";

        await db.transaction(async (tx) => {
            // 1. Record the Expense
            const [newExp] = await tx.insert(officeExpenses).values({
                ...validated.data,
                date: new Date(),
            }).returning({ id: officeExpenses.id });

            // 2. Adjust Bank Balance (if linked)
            if (validated.data.bankAccountId) {
                await tx.update(bankAccounts)
                    .set({ currentBalance: sql`${bankAccounts.currentBalance} - ${validated.data.amount}` })
                    .where(eq(bankAccounts.id, validated.data.bankAccountId));
            }

            // 3. Log Audit
            await tx.insert(authLogs).values({
                event: "MOBILE_EXPENSE_RECORDED",
                ipAddress: ip,
                metadata: { id: newExp.id, category: validated.data.category, amount: validated.data.amount },
            });
        });

        return NextResponse.json({
            success: true,
            message: "Operating expenditure synced to master ledger."
        });

    } catch (error) {
        console.error("MOBILE_EXPENSE_API_ERROR:", error);
        return NextResponse.json({ error: "Financial Ledger Sync Failure" }, { status: 500 });
    }
}
