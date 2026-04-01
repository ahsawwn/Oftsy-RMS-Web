import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
    const sessionId = request.cookies.get("auth_session")?.value;
    const { pathname } = request.nextUrl;

    const isAuthRoute = pathname === "/login" || pathname === "/";
    const isProtectedRoute = pathname.startsWith("/dashboard");

    // If trying to access dashboard without session
    if (!sessionId && isProtectedRoute) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // If logged in and hitting login/home, skip to dashboard
    if (sessionId && isAuthRoute) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};