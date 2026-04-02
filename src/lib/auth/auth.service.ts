import { db } from "@/lib/db";
import { users, sessions, authLogs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { encodeBase32LowerCaseNoPadding } from "@oslojs/encoding";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

export const AuthService = {
    async hashPassword(password: string) {
        return await bcrypt.hash(password, SALT_ROUNDS);
    },

    async verifyPassword(password: string, hash: string) {
        return await bcrypt.compare(password, hash);
    },

    async createSession(userId: string, ip: string, ua: string) {
        const sessionId = encodeBase32LowerCaseNoPadding(crypto.getRandomValues(new Uint8Array(20)));
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

        return await db.transaction(async (tx) => {
            await tx.insert(sessions).values({ id: sessionId, userId, expiresAt, ipAddress: ip, userAgent: ua });
            await tx.insert(authLogs).values({ userId, event: "login_success", ipAddress: ip, metadata: { ua } });
            return { sessionId, expiresAt };
        });
    },

    async logout(sessionId: string, ip: string) {
        return await db.transaction(async (tx) => {
            const [session] = await tx
                .select({ userId: sessions.userId })
                .from(sessions)
                .where(eq(sessions.id, sessionId))
                .limit(1);

            if (session) {
                await tx.insert(authLogs).values({
                    userId: session.userId,
                    event: "logout_success",
                    ipAddress: ip,
                    metadata: { sessionId },
                });
                await tx.delete(sessions).where(eq(sessions.id, sessionId));
            }
        });
    },

    async logEvent(userId: string | null, event: string, ip: string, metadata: any) {
        await db.insert(authLogs).values({ userId, event, ipAddress: ip, metadata });
    }
};