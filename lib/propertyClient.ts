/**
 * propertyClient — typed wrappers for property-related API endpoints.
 *
 * Image upload strategy (per API spec):
 *   - POST /property  → multipart/form-data with File objects appended as "images"
 *   - POST /property/{id}/images → multipart/form-data with File objects to add images later
 *
 * All requests attach the Bearer token from the `auth_token` cookie.
 */

import { ApiError } from "./api";

const BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ?? "https://real-est-beate-latest.onrender.com";

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

export type PropertyType =
    | "HOUSE"
    | "APARTMENT"
    | "ROOM"
    | "VILLA"
    | "STUDIO"
    | "COMMERCIAL"
    | "LAND"
    | "DUPLEX";

export type RentalType = "DAILY" | "MONTHLY" | "YEARLY";

export interface PropertyImage {
    url: string;
    description?: string;
}

export interface CreatePropertyPayload {
    title: string;
    property_type: PropertyType;
    address: string;
    city: string;
    description?: string;
    /** File objects sent directly as multipart fields — no pre-upload needed */
    images?: File[];
}

export interface Property {
    property_id: string;
    title: string;
    property_type: PropertyType;
    address: string;
    city: string;
    description?: string;
    landlord_id: string;
    images?: PropertyImage[];
    created_at?: string;
    updated_at?: string;
}

export interface CreateRentalUnitPayload {
    unit_name: string;
    max_guests: number;
    is_active: boolean;
    property_id: string;
}

export interface RentalUnit {
    unit_id: string;
    unit_name: string;
    max_guests: number;
    is_active: boolean;
    property_id: string;
    created_at?: string;
    updated_at?: string;
    [key: string]: unknown;
}

/** Shape returned by the API for all successful responses */
interface ApiResponse<T> {
    status: boolean;
    data: T;
    message?: string;
}

// ─── propertyClient ───────────────────────────────────────────────────────────

export const propertyClient = {
    /**
     * POST /property
     *
     * Creates a new property listing.
     * Sends as multipart/form-data per the API spec.
     * Images are appended as File objects directly (no pre-upload step).
     */
    createProperty: async (payload: CreatePropertyPayload): Promise<Property> => {
        const formData = new FormData();
        formData.append("title", payload.title);
        formData.append("property_type", payload.property_type);
        formData.append("address", payload.address);
        formData.append("city", payload.city);
        if (payload.description) formData.append("description", payload.description);

        // Append each image File directly — browser sets the multipart boundary
        if (payload.images && payload.images.length > 0) {
            payload.images.forEach((file) => {
                formData.append("images", file, file.name);
            });
        }

        const response = await fetch(`${BASE_URL}/property`, {
            method: "POST",
            headers: authHeaders(), // intentionally no Content-Type — browser sets multipart boundary
            body: formData,
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
                `Property creation failed with status ${response.status}`;
            throw new ApiError(response.status, message, errData);
        }

        const json = await response.json() as ApiResponse<Property>;
        return json.data;
    },

    /**
     * POST /property/{id}/images
     *
     * Adds images to an existing property.
     * Sends as multipart/form-data with File objects.
     */
    addImages: async (propertyId: string, files: File[]): Promise<unknown> => {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append("images", file, file.name);
        });

        const response = await fetch(`${BASE_URL}/property/${propertyId}/images`, {
            method: "POST",
            headers: authHeaders(),
            body: formData,
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
                `Adding images failed with status ${response.status}`;
            throw new ApiError(response.status, message, errData);
        }

        return response.json();
    },

    /**
     * POST /rentalunit
     *
     * Creates a single rental unit linked to an existing property.
     * Must be called after `createProperty` using the returned `property_id`.
     */
    createRentalUnit: async (payload: CreateRentalUnitPayload): Promise<RentalUnit> => {
        const response = await fetch(`${BASE_URL}/rentalunit`, {
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
                `Rental unit creation failed with status ${response.status}`;
            throw new ApiError(response.status, message, errData);
        }

        const json = await response.json() as ApiResponse<RentalUnit>;
        return json.data;
    },
};
