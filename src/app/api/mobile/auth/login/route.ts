import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { AuthService } from "@/lib/auth/auth.service";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();
        
        if (!email || !password) {
            return NextResponse.json({ error: "Identity Required" }, { status: 400 });
        }

        const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
        
        if (!user) {
            return NextResponse.json({ error: "Access Denied" }, { status: 401 });
        }

        const isValid = await AuthService.verifyPassword(password, user.passwordHash);
        
        if (!isValid) {
            return NextResponse.json({ error: "Credential Mismatch" }, { status: 401 });
        }

        // Generate session for mobile (Sync with auth.service protocol)
        const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
        const ua = req.headers.get("user-agent") || "ABH Mobile Client";
        const { sessionId, expiresAt } = await AuthService.createSession(user.id, ip, ua);

        return NextResponse.json({
            success: true,
            token: sessionId,
            expires: expiresAt,
            user: {
                id: user.id,
                email: user.email,
            }
        });

    } catch (error) {
        console.error("MOBILE_LOGIN_API_ERROR:", error);
        return NextResponse.json({ error: "Auth Infrastructure Failure" }, { status: 500 });
    }
}
