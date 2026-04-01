import { db } from "./index";
import { sessions, users, systemConfig } from "./schema";
import { eq, and, gt } from "drizzle-orm";
import { AuthService } from "../auth/auth.service";

export const DBProxy = {
    async getValidSession(sessionId: string) {
        const startTime = Date.now();
        try {
            const result = await db
                .select({
                    user: { id: users.id, email: users.email },
                    session: { id: sessions.id, expiresAt: sessions.expiresAt, ipAddress: sessions.ipAddress },
                })
                .from(sessions)
                .innerJoin(users, eq(sessions.userId, users.id))
                .where(
                    and(
                        eq(sessions.id, sessionId),
                        gt(sessions.expiresAt, new Date())
                    )
                )
                .limit(1);

            const duration = Date.now() - startTime;
            if (duration > 500) console.warn(`⚠️ Slow Query: getValidSession took ${duration}ms`);

            return result[0] ?? null;
        } catch (error) {
            console.error("❌ DB_PROXY_ERROR:", error);
            throw error;
        }
    },

    async getUserByEmail(email: string) {
        return await db.query.users.findFirst({
            where: eq(users.email, email.toLowerCase().trim()),
        });
    },

    async registerUser(email: string, passwordHash: string) {
        const [user] = await db.insert(users).values({ email, passwordHash }).returning();
        return user;
    },

    async verifySuperUserPassword(password: string) {
        const config = await db.query.systemConfig.findFirst({
            where: (c, { eq }) => eq(c.key, "super_user_password_hash"),
        });
        if (!config) return false;
        return await AuthService.verifyPassword(password, config.value);
    }
};