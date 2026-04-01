import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_PAGES = ["/login", "/register"];
const PUBLIC_API_ROUTES = ["/api/mobile/auth/login", "/api/mobile/inventory", "/api/mobile/leads", "/api/mobile/dashboard", "/api/mobile/expenses"];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const session = request.cookies.get("auth_session")?.value;

    // 1. Allow Public Assets / API
    if (pathname.startsWith("/_next") || pathname.includes(".") || PUBLIC_API_ROUTES.some(route => pathname.startsWith(route))) {
        return NextResponse.next();
    }

    // 2. Redirect root to dashboard (if logged in) or login
    if (pathname === "/") {
        if (session) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // 3. User is logged in - Prevent access to Auth Pages (Login/Register)
    if (session && AUTH_PAGES.includes(pathname)) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // 4. User is NOT logged in - Protect Dashboard
    if (!session && !AUTH_PAGES.includes(pathname)) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
