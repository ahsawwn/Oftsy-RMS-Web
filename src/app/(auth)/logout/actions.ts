"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { AuthService } from "@/lib/auth/auth.service";

export async function logoutAction() {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("auth_session")?.value;

    const headerList = await headers();
    const ip = headerList.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";

    if (sessionId) {
        // This will now work because we added 'logout' to AuthService
        await AuthService.logout(sessionId, ip);
        cookieStore.delete("auth_session");
    }

    redirect("/login");
}