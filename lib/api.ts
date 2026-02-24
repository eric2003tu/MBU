/**
 * appClient — base HTTP client for all API calls.
 *
 * - Reads the base URL from NEXT_PUBLIC_API_URL
 * - Attaches the Bearer token from the `auth_token` cookie when present
 * - Throws a typed ApiError on non-2xx responses
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://real-est-beate-latest.onrender.com";

export class ApiError extends Error {
    constructor(
        public status: number,
        public message: string,
        public data?: unknown
    ) {
        super(message);
        this.name = "ApiError";
    }
}

function getCookieValue(name: string): string | undefined {
    if (typeof document === "undefined") return undefined;
    const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : undefined;
}

export interface RequestOptions extends Omit<RequestInit, "body"> {
    body?: unknown;
    params?: Record<string, string | number | boolean | undefined>;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { body, params, headers: extraHeaders, ...rest } = options;

    // Build URL with query params
    const url = new URL(`${BASE_URL}${endpoint}`);
    if (params) {
        Object.entries(params).forEach(([k, v]) => {
            if (v !== undefined) url.searchParams.set(k, String(v));
        });
    }

    // Build headers
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(extraHeaders as Record<string, string>),
    };

    const token = getCookieValue("auth_token");
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url.toString(), {
        ...rest,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
        let errData: unknown;
        try {
            errData = await response.json();
        } catch {
            errData = await response.text();
        }
        const message =
            (errData as { detail?: string; message?: string })?.detail ??
            (errData as { message?: string })?.message ??
            `Request failed with status ${response.status}`;
        throw new ApiError(response.status, message, errData);
    }

    // 204 No Content
    if (response.status === 204) return undefined as T;

    return response.json() as Promise<T>;
}

/** appClient — low-level HTTP helpers */
export const appClient = {
    get: <T>(endpoint: string, options?: RequestOptions) =>
        request<T>(endpoint, { ...options, method: "GET" }),

    post: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
        request<T>(endpoint, { ...options, method: "POST", body }),

    put: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
        request<T>(endpoint, { ...options, method: "PUT", body }),

    patch: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
        request<T>(endpoint, { ...options, method: "PATCH", body }),

    delete: <T>(endpoint: string, options?: RequestOptions) =>
        request<T>(endpoint, { ...options, method: "DELETE" }),
};
