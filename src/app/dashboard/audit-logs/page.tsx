import { db } from "@/lib/db";
import { authLogs, users } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import AuditLogsClient from "./AuditLogsClient";

export default async function AuditLogsPage() {
    const logs = await db
        .select({
            id: authLogs.id,
            event: authLogs.event,
            ip: authLogs.ipAddress,
            metadata: authLogs.metadata,
            date: authLogs.createdAt,
            userEmail: users.email,
        })
        .from(authLogs)
        .leftJoin(users, eq(authLogs.userId, users.id))
        .orderBy(desc(authLogs.createdAt))
        .limit(50); // Show last 50 activities

    return <AuditLogsClient initialLogs={logs} />;
}