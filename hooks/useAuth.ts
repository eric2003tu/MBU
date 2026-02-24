/**
 * useAuth — client-side hook that tracks whether the current user
 * is authenticated by reading the `auth_token` cookie, and can
 * fetch the current user profile on demand.
 */
"use client";

import { useState, useEffect, useCallback } from "react";
import { authClient, getAuthToken, isAuthenticated, type AuthUser, ApiError } from "@/lib/auth";

interface AuthState {
    authenticated: boolean;
    user: AuthUser | null;
    loading: boolean;
}

export function useAuth() {
    const [state, setState] = useState<AuthState>({
        authenticated: false,
        user: null,
        loading: true,
    });

    // Read cookie on mount (client-only)
    useEffect(() => {
        const authed = isAuthenticated();
        if (!authed) {
            setState({ authenticated: false, user: null, loading: false });
            return;
        }
        // Try to fetch user profile; silently fall back if the endpoint fails
        authClient
            .me()
            .then((user) => setState({ authenticated: true, user, loading: false }))
            .catch(() => {
                // Token may be present but expired / endpoint unavailable
                setState({ authenticated: authed, user: null, loading: false });
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
            setState({ authenticated: authed, user: null, loading: false });
        }
    }, []);

    return {
        ...state,
        token: getAuthToken(),
        logout,
        refresh,
    };
}
