import { db } from "@/lib/db";
import { bankAccounts } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import BanksClient from "./BanksClient";

export default async function BanksPage() {
    const banks = await db.select().from(bankAccounts).orderBy(desc(bankAccounts.createdAt));
    return <BanksClient initialBanks={banks} />;
}
