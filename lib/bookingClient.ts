/**
 * bookingClient — typed wrappers for booking API endpoints.
 *
 * Uses the same direct-fetch + authHeaders pattern as propertyClient
 * so the Bearer token is reliably attached.
 */

import { ApiError } from "./api";

const BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ?? "https://real-est-beate-latest.onrender.com";

function getAuthToken(): string | undefined {
    if (typeof document === "undefined") return undefined;
    const match = document.cookie.match(/(?:^|;\s*)auth_token=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : undefined;
}

function authHeaders(): Record<string, string> {
    const token = getAuthToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CreateBookingPayload {
    check_in: string;      // ISO 8601 e.g. "2026-03-01T14:00:00Z"
    check_out: string;     // ISO 8601 e.g. "2026-03-10T10:00:00Z"
    total_price: number;
    status: "PENDING";
    unit_id: string;
    user_id: string;
}

export interface Booking {
    booking_id: string;
    check_in: string;
    check_out: string;
    total_price: number;
    status: string;
    unit_id: string;
    user_id: string;
    created_at?: string;
    updated_at?: string;
    unit?: {
        unit_id: string;
        unit_name: string;
        max_guests: number;
        property_id: string;
        [key: string]: unknown;
    };
    [key: string]: unknown;
}

export interface BookingListParams {
    user_id?: string;
    status?: string;
    unit_id?: string;
    check_in_from?: string;
    check_in_to?: string;
    check_out_from?: string;
    check_out_to?: string;
    min_price?: string;
    max_price?: string;
}

// ─── Client ───────────────────────────────────────────────────────────────────

export const bookingClient = {
    /**
     * POST /booking
     *
     * Creates a new booking. Returns the created booking object.
     */
    create: async (payload: CreateBookingPayload): Promise<Booking> => {
        const response = await fetch(`${BASE_URL}/booking`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...authHeaders(),
            },
            body: JSON.stringify(payload),
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
                `Booking failed with status ${response.status}`;
            throw new ApiError(response.status, message, errData);
        }

        return response.json() as Promise<Booking>;
    },

    /**
     * GET /booking
     *
     * Fetches all bookings with optional search filters.
     * Pass user_id to scope results to the logged-in tenant.
     */
    getAll: async (params?: BookingListParams): Promise<Booking[]> => {
        const query = new URLSearchParams();
        if (params) {
            Object.entries(params).forEach(([k, v]) => {
                if (v !== undefined && v !== "") query.set(k, v);
            });
        }

        const url = `${BASE_URL}/booking${query.toString() ? `?${query}` : ""}`;
        const response = await fetch(url, { headers: authHeaders() });

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
                `Failed to fetch bookings (${response.status})`;
            throw new ApiError(response.status, message, errData);
        }

        const json = await response.json();
        // API may return { data: [...] } or plain array
        return Array.isArray(json) ? json : (json.data ?? json.items ?? []);
    },

    /**
     * GET /booking/{id}
     *
     * Fetches a single booking by its ID.
     */
    getById: async (id: string): Promise<Booking> => {
        const response = await fetch(`${BASE_URL}/booking/${id}`, {
            headers: authHeaders(),
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
                `Failed to fetch booking (${response.status})`;
            throw new ApiError(response.status, message, errData);
        }

        const json = await response.json();
        return json.data ?? json;
    },
};
