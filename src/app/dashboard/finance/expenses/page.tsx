import { db } from "@/lib/db";
import { officeExpenses, bankAccounts } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import ExpensesClient from "./ExpensesClient";

export default async function ExpensesPage() {
    const expenses = await db
        .select({
            id: officeExpenses.id,
            category: officeExpenses.category,
            description: officeExpenses.description,
            amount: officeExpenses.amount,
            date: officeExpenses.date,
            bankName: bankAccounts.bankName,
        })
        .from(officeExpenses)
        .leftJoin(bankAccounts, eq(officeExpenses.bankAccountId, bankAccounts.id))
        .orderBy(desc(officeExpenses.date));

    const accounts = await db.select({ id: bankAccounts.id, name: bankAccounts.bankName }).from(bankAccounts);

    return <ExpensesClient initialExpenses={expenses} bankAccounts={accounts} />;
}
