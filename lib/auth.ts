/**
 * authClient — typed wrappers around every auth endpoint.
 *
 * Token strategy:
 *   • On login success the token is written to an `auth_token` cookie
 *     (7-day expiry, SameSite=Lax) so it travels with every request
 *     automatically and is NOT accessible via localStorage.
 *   • The user role is written to a `user_role` cookie so the Edge
 *     Middleware can enforce role-based access without decoding the JWT.
 *   • `logout()` clears both cookies client-side.
 */

import { appClient, ApiError } from "./api";

// ─── Role ─────────────────────────────────────────────────────────────────────

export type UserRole = "ADMIN" | "LANDLORD" | "TENANT" | "AGENT";

/**
 * Map each role to its home dashboard path.
 * Used on login redirect AND in middleware for wrong-role redirects.
 */
export const ROLE_HOME: Record<UserRole, string> = {
    ADMIN: "/admin",
    LANDLORD: "/landlord",
    TENANT: "/tenant",
    AGENT: "/agent",
};

/**
 * Map each protected route prefix to the role that is allowed to access it.
 * Single source of truth — shared by middleware and any client-side guard.
 */
export const PROTECTED_ROUTES: Record<string, UserRole> = {
    "/admin": "ADMIN",
    "/landlord": "LANDLORD",
    "/tenant": "TENANT",
    "/agent": "AGENT",
};

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RegisterPayload {
    full_name: string;
    email: string;
    phone?: string;
    password_hash: string; // API field name as given
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface OtpVerifyPayload {
    email: string;
    otp: string;
}

export interface ResendOtpPayload {
    email: string;
}

export interface AuthUser {
    user_id: string;
    full_name: string;
    email: string;
    phone?: string;
    role?: UserRole;
    is_verified?: boolean;
    created_at?: string;
}

export interface LoginResponse {
    status: boolean;
    message: string;
    user: AuthUser;
    access_token: string;
}

export interface AuthTokenResponse {
    access_token: string;
    token_type?: string;
    user?: AuthUser;
}

export interface RegisterResponse {
    message: string;
    user?: AuthUser;
}

export interface OtpResponse {
    message: string;
    access_token?: string;
    user?: AuthUser;
}

// ─── Cookie helpers (client-side only) ────────────────────────────────────────

export const TOKEN_COOKIE = "auth_token";
export const ROLE_COOKIE = "user_role";
export const USER_NAME_COOKIE = "user_name";
export const USER_EMAIL_COOKIE = "user_email";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

function buildCookieString(name: string, value: string, maxAge = COOKIE_MAX_AGE) {
    return [
        `${name}=${encodeURIComponent(value)}`,
        `max-age=${maxAge}`,
        "path=/",
        "SameSite=Lax",
    ].join("; ");
}

function setCookie(name: string, value: string) {
    if (typeof document === "undefined") return;
    document.cookie = buildCookieString(name, value);
}

function clearCookie(name: string) {
    if (typeof document === "undefined") return;
    document.cookie = `${name}=; max-age=0; path=/; SameSite=Lax`;
}

function readCookie(name: string): string | undefined {
    if (typeof document === "undefined") return undefined;
    const match = document.cookie.match(
        new RegExp(`(?:^|;\\s*)${name}=([^;]*)`)
    );
    return match ? decodeURIComponent(match[1]) : undefined;
}

// ─── Public cookie accessors ──────────────────────────────────────────────────

export function getAuthToken(): string | undefined {
    return readCookie(TOKEN_COOKIE);
}

export function getUserRole(): UserRole | undefined {
    return readCookie(ROLE_COOKIE) as UserRole | undefined;
}

export function getUserName(): string | undefined {
    return readCookie(USER_NAME_COOKIE);
}

export function getUserEmail(): string | undefined {
    return readCookie(USER_EMAIL_COOKIE);
}

export function isAuthenticated(): boolean {
    return !!getAuthToken();
}

/**
 * Stores the JWT, role, name, and email cookies.
 * Called after login and after OTP verification.
 */
export function persistAuthSession(
    token: string,
    user?: Pick<AuthUser, "role" | "full_name" | "email">
) {
    setCookie(TOKEN_COOKIE, token);
    if (user?.role) setCookie(ROLE_COOKIE, user.role);
    if (user?.full_name) setCookie(USER_NAME_COOKIE, user.full_name);
    if (user?.email) setCookie(USER_EMAIL_COOKIE, user.email);
}

/**
 * Wipes all auth cookies. Call this on logout.
 */
export function clearAuthSession() {
    clearCookie(TOKEN_COOKIE);
    clearCookie(ROLE_COOKIE);
    clearCookie(USER_NAME_COOKIE);
    clearCookie(USER_EMAIL_COOKIE);
}

// ─── authClient ───────────────────────────────────────────────────────────────

export const authClient = {
    /**
     * POST /auth/register
     * Registers a new user and triggers OTP email.
     */
    register: async (payload: RegisterPayload): Promise<RegisterResponse> => {
        return appClient.post<RegisterResponse>("/auth/register", payload);
    },

    /**
     * POST /auth/login
     * Authenticates the user and stores the returned JWT + role in cookies.
     * Returns the full login response so the caller can act on the role.
     */
    login: async (payload: LoginPayload): Promise<LoginResponse> => {
        const response = await appClient.post<LoginResponse>("/auth/login", payload);
        if (response.access_token) {
            persistAuthSession(response.access_token, response.user);
        }
        return response;
    },

    /**
     * POST /auth/verify-otp
     * Verifies the OTP code sent to the user's email.
     * Stores the access token and role if the server returns them.
     */
    verifyOtp: async (payload: OtpVerifyPayload): Promise<OtpResponse> => {
        const response = await appClient.post<OtpResponse>("/auth/verify-otp", payload);
        if (response.access_token) {
            persistAuthSession(response.access_token, response.user);
        }
        return response;
    },

    /**
     * POST /auth/resend-otp
     * Resends a new OTP to the given email address.
     */
    resendOtp: async (payload: ResendOtpPayload): Promise<{ message: string }> => {
        return appClient.post<{ message: string }>("/auth/resend-otp", payload);
    },

    /**
     * POST /auth/logout
     * Invalidates the server-side session and clears local cookies.
     */
    logout: async (): Promise<void> => {
        try {
            await appClient.post("/auth/logout");
        } finally {
            clearAuthSession();
        }
    },

    /**
     * GET /auth/me
     * Returns the currently authenticated user's profile.
     */
    me: async (): Promise<AuthUser> => {
        return appClient.get<AuthUser>("/auth/me");
    },
};

// Re-export ApiError so consumers don't need a separate import
export { ApiError };
