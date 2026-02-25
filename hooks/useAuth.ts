/**
 * useAuth — client-side hook that tracks the authenticated user.
 *
 * Name/email are read from cookies immediately (set at login time via
 * persistAuthSession) so headers render the real name with zero loading
 * delay. The full profile is then fetched from /auth/me in the background
 * and merged in to pick up any server-side updates.
 */
"use client";

import { useState, useEffect, useCallback } from "react";
import {
    authClient,
    getAuthToken,
    getUserName,
    getUserEmail,
    getUserRole,
    isAuthenticated,
    type AuthUser,
    ApiError,
} from "@/lib/auth";

interface AuthState {
    authenticated: boolean;
    user: AuthUser | null;
    loading: boolean;
}

/** Build a partial AuthUser from the cookies stored at login time. */
function userFromCookies(): AuthUser | null {
    const name = getUserName();
    const email = getUserEmail();
    const role = getUserRole();
    if (!name && !email) return null;
    return {
        user_id: "",
        full_name: name ?? "",
        email: email ?? "",
        role,
    };
}

export function useAuth() {
    const [state, setState] = useState<AuthState>(() => {
        // Seed synchronously from cookies so the name appears on first render
        const authed = isAuthenticated();
        return {
            authenticated: authed,
            user: authed ? userFromCookies() : null,
            loading: authed, // still loading because /auth/me hasn't been called
        };
    });

    useEffect(() => {
        const authed = isAuthenticated();
        if (!authed) {
            setState({ authenticated: false, user: null, loading: false });
            return;
        }

        // Fetch the full profile in the background and merge it in
        authClient
            .me()
            .then((user) => setState({ authenticated: true, user, loading: false }))
            .catch(() => {
                // Token may be expired or /auth/me unavailable — keep cookie data
                setState((prev) => ({ ...prev, loading: false }));
            });
    }, []);

    const logout = useCallback(async () => {
        await authClient.logout();
        setState({ authenticated: false, user: null, loading: false });
    }, []);

    const refresh = useCallback(async () => {
        const authed = isAuthenticated();
        if (!authed) {
            setState({ authenticated: false, user: null, loading: false });
            return;
        }
        try {
            const user = await authClient.me();
            setState({ authenticated: true, user, loading: false });
        } catch {
            setState((prev) => ({ ...prev, loading: false }));
        }
    }, []);

    return {
        ...state,
        token: getAuthToken(),
        logout,
        refresh,
    };
}
