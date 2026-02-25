"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Home, Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient, ApiError, ROLE_HOME } from "@/lib/auth";

// ─── LoginForm ─────────────────────────────────────────────────────────────────
// Isolated into its own component so `useSearchParams()` is inside a
// <Suspense> boundary — required by Next.js 15 to avoid a build warning.

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const result = await authClient.login({ email, password });

            // Honour the ?next= param set by middleware for deep-links, but
            // only if it belongs to the same dashboard to prevent privilege
            // escalation via crafted redirect URLs.
            const next = searchParams.get("next");
            const roleHome = result.user?.role ? ROLE_HOME[result.user.role] : "/";
            const destination =
                next && next.startsWith(roleHome) ? next : roleHome;

            router.push(destination);
            router.refresh();
        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.message);
            } else {
                setError("Something went wrong. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
        >
            {/* Mobile logo */}
            <Link href="/" className="flex items-center gap-2 mb-10 lg:hidden">
                <Home className="h-5 w-5 text-accent" />
                <span className="font-display text-xl font-semibold text-foreground">EstateVue</span>
            </Link>

            <div className="mb-8">
                <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                    Welcome back
                </h1>
                <p className="text-muted-foreground">
                    Don&apos;t have an account?{" "}
                    <Link href="/signup" className="text-accent font-medium hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>

            {/* Global error */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-5 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                >
                    {error}
                </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link href="#" className="text-xs text-accent hover:underline">
                            Forgot password?
                        </Link>
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10 pr-10"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                </div>

                <Button
                    type="submit"
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90 gap-2 h-11 text-base"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <span className="flex items-center gap-2">
                            <span className="h-4 w-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                            Signing in…
                        </span>
                    ) : (
                        <>
                            Sign In <ArrowRight className="h-4 w-4" />
                        </>
                    )}
                </Button>
            </form>

            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center">
                    <span className="bg-background px-4 text-xs text-muted-foreground">
                        or continue with
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="gap-2 h-11" type="button">
                    <svg className="h-4 w-4" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Google
                </Button>
                <Button variant="outline" className="gap-2 h-11" type="button">
                    <svg className="h-4 w-4 fill-foreground" viewBox="0 0 24 24">
                        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.09.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                    </svg>
                    GitHub
                </Button>
            </div>
        </motion.div>
    );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-background flex">
            {/* Left panel – form */}
            <div className="flex-1 flex items-center justify-center px-6 py-12">
                {/* Suspense required by Next.js 15 when useSearchParams is used */}
                <Suspense fallback={<div className="w-full max-w-md animate-pulse" />}>
                    <LoginForm />
                </Suspense>
            </div>

            {/* Right panel – decorative */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                <img
                    src="/images/hero-property.jpg"
                    alt="Luxury property"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-primary/75" />
                <div className="relative z-10 flex flex-col justify-between p-12 w-full">
                    <Link href="/" className="flex items-center gap-2">
                        <Home className="h-6 w-6 text-accent" />
                        <span className="font-display text-2xl font-semibold text-primary-foreground">
                            EstateVue
                        </span>
                    </Link>
                    <div>
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7 }}
                            className="font-display text-4xl xl:text-5xl font-bold text-primary-foreground leading-tight mb-4"
                        >
                            Your dream home{" "}
                            <span className="text-accent">awaits.</span>
                        </motion.h2>
                        <p className="text-primary-foreground/70 text-lg max-w-sm">
                            Sign in to access your saved properties, alerts, and personalised recommendations.
                        </p>
                    </div>
                    <div className="flex gap-8">
                        {[
                            { value: "2,500+", label: "Properties" },
                            { value: "1,200+", label: "Happy Clients" },
                            { value: "15+", label: "Years of Trust" },
                        ].map((s) => (
                            <div key={s.label}>
                                <div className="font-display text-2xl font-bold text-accent">{s.value}</div>
                                <div className="text-primary-foreground/60 text-sm">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
