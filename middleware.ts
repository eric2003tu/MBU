/**
 * Next.js Edge Middleware — Role-Based Route Protection
 *
 * Uses two cookies set at login time:
 *   • `auth_token`  — presence proves the user is authenticated
 *   • `user_role`   — value determines which dashboard they may access
 *
 * Rules:
 *   1. Unauthenticated user visiting a protected route → /login?next=<path>
 *   2. Authenticated user visiting the WRONG dashboard  → their own dashboard
 *   3. Authenticated user visiting the RIGHT dashboard  → allowed through
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ─── Route → Role map (mirrors PROTECTED_ROUTES in lib/auth.ts) ───────────────
// Duplicated here because middleware runs on the Edge runtime and cannot
// import from lib/ (which may reference Node.js APIs).
const PROTECTED_ROUTES: Record<string, string> = {
    "/admin": "ADMIN",
    "/landlord": "LANDLORD",
    "/tenant": "TENANT",
    "/agent": "AGENT",
};

// ─── Role → Home dashboard map (mirrors ROLE_HOME in lib/auth.ts) ─────────────
const ROLE_HOME: Record<string, string> = {
    ADMIN: "/admin",
    LANDLORD: "/landlord",
    TENANT: "/tenant",
    AGENT: "/agent",
};

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Find the first protected prefix that matches the current path
    const matchedPrefix = Object.keys(PROTECTED_ROUTES).find((prefix) =>
        pathname === prefix || pathname.startsWith(`${prefix}/`)
    );

    // Not a protected route — let it through
    if (!matchedPrefix) return NextResponse.next();

    const requiredRole = PROTECTED_ROUTES[matchedPrefix];

    const token = request.cookies.get("auth_token")?.value;
    const role = request.cookies.get("user_role")?.value;

    // ── Rule 1: Not authenticated → redirect to login ──────────────────────────
    if (!token) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("next", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // ── Rule 2: Wrong role → redirect to the user's own dashboard ──────────────
    if (role !== requiredRole) {
        const home = (role && ROLE_HOME[role]) ?? "/login";
        return NextResponse.redirect(new URL(home, request.url));
    }

    // ── Rule 3: Correct role → allow ───────────────────────────────────────────
    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all paths EXCEPT:
         *  - _next/static  (static files)
         *  - _next/image   (image optimisation)
         *  - favicon.ico
         *  - public files (images, fonts …)
         *  - /api routes   (backend proxies)
         *  - /login, /signup, /verify-otp (auth pages themselves)
         */
        "/((?!_next/static|_next/image|favicon\\.ico|images/|fonts/|api/|login|signup|verify-otp).*)",
    ],
};
