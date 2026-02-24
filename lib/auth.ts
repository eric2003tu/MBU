/**
 * authClient — typed wrappers around every auth endpoint.
 *
 * Token strategy:
 *   • On login success the token is written to a `auth_token` cookie
 *     (7-day expiry, SameSite=Lax) so it travels with every request
 *     automatically and is NOT accessible via localStorage.
 *   • `logout()` deletes that cookie client-side.
 */

import { appClient, ApiError } from "./api";

// ─── Types ───────────────────────────────────────────────────────────────────

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
    id: string;
    full_name: string;
    email: string;
    phone?: string;
    is_verified?: boolean;
    created_at?: string;
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

// ─── Cookie helpers (client-side only) ───────────────────────────────────────

const TOKEN_COOKIE = "auth_token";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

function setAuthCookie(token: string) {
    if (typeof document === "undefined") return;
    document.cookie = [
        `${TOKEN_COOKIE}=${encodeURIComponent(token)}`,
        `max-age=${COOKIE_MAX_AGE}`,
        "path=/",
        "SameSite=Lax",
        // Remove 'Secure' in dev; Next.js automatically upgrades in prod
    ].join("; ");
}

function clearAuthCookie() {
    if (typeof document === "undefined") return;
    document.cookie = `${TOKEN_COOKIE}=; max-age=0; path=/; SameSite=Lax`;
}

export function getAuthToken(): string | undefined {
    if (typeof document === "undefined") return undefined;
    const match = document.cookie.match(
        new RegExp(`(?:^|;\\s*)${TOKEN_COOKIE}=([^;]*)`)
    );
    return match ? decodeURIComponent(match[1]) : undefined;
}

export function isAuthenticated(): boolean {
    return !!getAuthToken();
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
     * Authenticates the user and stores the returned JWT in a cookie.
     */
    login: async (payload: LoginPayload): Promise<AuthTokenResponse> => {
        const response = await appClient.post<AuthTokenResponse>("/auth/login", payload);
        if (response.access_token) {
            setAuthCookie(response.access_token);
        }
        return response;
    },

    /**
     * POST /auth/verify-otp
     * Verifies the OTP code sent to the user's email.
     * Stores the access token if the server returns one after verification.
     */
    verifyOtp: async (payload: OtpVerifyPayload): Promise<OtpResponse> => {
        const response = await appClient.post<OtpResponse>("/auth/verify-otp", payload);
        if (response.access_token) {
            setAuthCookie(response.access_token);
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
     * Invalidates the server-side session and clears the local cookie.
     */
    logout: async (): Promise<void> => {
        try {
            await appClient.post("/auth/logout");
        } finally {
            clearAuthCookie();
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
