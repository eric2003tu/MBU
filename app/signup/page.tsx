"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Home, Mail, Lock, User, Phone, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient, ApiError } from "@/lib/auth";

const strengthMap = [
    { label: "Too short", color: "bg-destructive" },
    { label: "Weak", color: "bg-orange-400" },
    { label: "Fair", color: "bg-yellow-400" },
    { label: "Strong", color: "bg-green-500" },
    { label: "Very strong", color: "bg-emerald-500" },
];

function getStrength(password: string): number {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return password.length === 0 ? 0 : score;
}

const perks = [
    "Save and compare your favourite properties",
    "Instant alerts for new listings in your area",
    "Connect directly with verified agents",
    "Access exclusive off-market opportunities",
];

export default function SignupPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const strength = getStrength(form.password);

    const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm((prev) => ({ ...prev, [field]: e.target.value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            await authClient.register({
                full_name: form.name,
                email: form.email,
                phone: form.phone || undefined,
                password_hash: form.password,
            });
            // On success, navigate to OTP verification
            router.push(`/verify-otp?email=${encodeURIComponent(form.email)}`);
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
        <div className="min-h-screen bg-background flex">
            {/* Left panel – form */}
            <div className="flex-1 flex items-center justify-center px-6 py-12">
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
                            Create your account
                        </h1>
                        <p className="text-muted-foreground">
                            Already have an account?{" "}
                            <Link href="/login" className="text-accent font-medium hover:underline">
                                Sign in
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

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Full name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="John Doe"
                                    value={form.name}
                                    onChange={handleChange("name")}
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={form.email}
                                    onChange={handleChange("email")}
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="space-y-2">
                            <Label htmlFor="phone">
                                Phone number{" "}
                                <span className="text-muted-foreground font-normal text-xs">(optional)</span>
                            </Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="+1 (555) 000-0000"
                                    value={form.phone}
                                    onChange={handleChange("phone")}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Min. 8 characters"
                                    value={form.password}
                                    onChange={handleChange("password")}
                                    className="pl-10 pr-10"
                                    required
                                    minLength={8}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>

                            {/* Strength bar */}
                            {form.password.length > 0 && (
                                <div className="space-y-1.5">
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div
                                                key={i}
                                                className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength
                                                        ? strengthMap[Math.min(strength, 4)].color
                                                        : "bg-muted"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {strengthMap[Math.min(strength, 4)].label}
                                    </p>
                                </div>
                            )}
                        </div>

                        <p className="text-xs text-muted-foreground">
                            By creating an account you agree to our{" "}
                            <Link href="#" className="text-accent hover:underline">Terms of Service</Link>{" "}
                            and{" "}
                            <Link href="#" className="text-accent hover:underline">Privacy Policy</Link>.
                        </p>

                        <Button
                            type="submit"
                            className="w-full bg-accent text-accent-foreground hover:bg-accent/90 gap-2 h-11 text-base"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <span className="h-4 w-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                                    Creating account…
                                </span>
                            ) : (
                                <>
                                    Create Account <ArrowRight className="h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </form>
                </motion.div>
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
                            className="font-display text-4xl xl:text-5xl font-bold text-primary-foreground leading-tight mb-6"
                        >
                            Join{" "}
                            <span className="text-accent">thousands</span>{" "}
                            of happy buyers.
                        </motion.h2>
                        <ul className="space-y-3">
                            {perks.map((perk, i) => (
                                <motion.li
                                    key={perk}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 + i * 0.1 }}
                                    className="flex items-start gap-3 text-primary-foreground/80"
                                >
                                    <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                                    <span>{perk}</span>
                                </motion.li>
                            ))}
                        </ul>
                    </div>
                    <p className="text-primary-foreground/40 text-sm">
                        © {new Date().getFullYear()} EstateVue. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}
