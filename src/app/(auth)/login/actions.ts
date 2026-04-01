"use server";

import { z } from "zod";
import { AuthService } from "@/lib/auth/auth.service";
import { DBProxy } from "@/lib/db/proxy";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

const LoginSchema = z.object({
    email: z.string().email().toLowerCase().trim(),
    password: z.string().min(1),
});

export async function loginAction(prevState: any, formData: FormData) {
    const headerList = await headers();
    const ip = headerList.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    const ua = headerList.get("user-agent") || "unknown";

    const validated = LoginSchema.safeParse(Object.fromEntries(formData));
    if (!validated.success) return { errors: validated.error.flatten().fieldErrors };

    let success = false;
    try {
        const user = await DBProxy.getUserByEmail(validated.data.email);
        if (!user || !(await AuthService.verifyPassword(validated.data.password, user.passwordHash))) {
            await AuthService.logEvent(user?.id || null, "login_failed", ip, { email: validated.data.email });
            return { message: "Invalid credentials" };
        }

        const { sessionId, expiresAt } = await AuthService.createSession(user.id, ip, ua);
        const cookieStore = await cookies();
        cookieStore.set("auth_session", sessionId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // False on localhost
            sameSite: "lax",
            expires: expiresAt,
            path: "/",
        });
        success = true;
    } catch (e) {
        console.error("DB_ERROR_LOG:", e);
        return { message: "Database connection failed" };
    }

    if (success) redirect("/dashboard");
}