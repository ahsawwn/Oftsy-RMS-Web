import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { DBProxy } from "@/lib/db/proxy";

const AUTH_PAGES = ["/login", "/register"];
const PUBLIC_API_ROUTES = ["/api/mobile/auth/login", "/api/mobile/inventory", "/api/mobile/leads", "/api/mobile/dashboard", "/api/mobile/expenses"];

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const sessionToken = request.cookies.get("auth_session")?.value;

    // 1. Allow Public Assets / API
    if (pathname.startsWith("/_next") || pathname.includes(".") || PUBLIC_API_ROUTES.some(route => pathname.startsWith(route))) {
        return NextResponse.next();
    }

    // 2. Redirect root to dashboard (if logged in) or login
    if (pathname === "/") {
        if (sessionToken) {
            const validSession = await DBProxy.getValidSession(sessionToken);
            if (validSession) return NextResponse.redirect(new URL("/dashboard", request.url));
        }
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // 3. Prevent access to Auth Pages (Login/Register) if logged in
    if (sessionToken && AUTH_PAGES.includes(pathname)) {
        const validSession = await DBProxy.getValidSession(sessionToken);
        if (validSession) return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // 4. Protect Dashboard - User MUST have a valid, unexpired session
    if (!AUTH_PAGES.includes(pathname)) {
        if (!sessionToken) return NextResponse.redirect(new URL("/login", request.url));

        const validSession = await DBProxy.getValidSession(sessionToken);
        if (!validSession) {
            // Session expired or invalid - clear cookie and redirect
            const response = NextResponse.redirect(new URL("/login", request.url));
            response.cookies.delete("auth_session");
            return response;
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
