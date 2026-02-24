"use client";

import { Suspense } from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Mail, ArrowRight, RefreshCw, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient, ApiError } from "@/lib/auth";

const OTP_LENGTH = 6;
const RESEND_DELAY = 60;

function VerifyOtpContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email") ?? "your email";

    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [countdown, setCountdown] = useState(RESEND_DELAY);
    const [isResending, setIsResending] = useState(false);
    const [error, setError] = useState("");
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Countdown timer
    useEffect(() => {
        if (countdown <= 0) return;
        const id = setInterval(() => setCountdown((c) => c - 1), 1000);
        return () => clearInterval(id);
    }, [countdown]);

    const focusInput = (index: number) => {
        inputRefs.current[index]?.focus();
    };

    const handleChange = (index: number, value: string) => {
        const digit = value.replace(/\D/g, "").slice(-1);
        setError("");
        const newOtp = [...otp];
        newOtp[index] = digit;
        setOtp(newOtp);
        if (digit && index < OTP_LENGTH - 1) focusInput(index + 1);
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace") {
            if (otp[index]) {
                const newOtp = [...otp];
                newOtp[index] = "";
                setOtp(newOtp);
            } else if (index > 0) {
                focusInput(index - 1);
            }
        } else if (e.key === "ArrowLeft" && index > 0) {
            focusInput(index - 1);
        } else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
            focusInput(index + 1);
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
        if (!text) return;
        const newOtp = Array(OTP_LENGTH).fill("");
        text.split("").forEach((char, i) => { newOtp[i] = char; });
        setOtp(newOtp);
        focusInput(Math.min(text.length, OTP_LENGTH - 1));
    };

    const handleSubmit = useCallback(async () => {
        const code = otp.join("");
        if (code.length < OTP_LENGTH) {
            setError("Please enter all 6 digits.");
            return;
        }
        setIsLoading(true);
        setError("");

        try {
            await authClient.verifyOtp({ email, otp: code });
            setIsSuccess(true);
            // If verifyOtp returned a token it's already stored in cookie.
            // Redirect to home after brief success animation.
            setTimeout(() => router.push("/"), 2000);
        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.message);
            } else {
                setError("Verification failed. Please try again.");
            }
            // Clear the inputs so user can try again
            setOtp(Array(OTP_LENGTH).fill(""));
            focusInput(0);
        } finally {
            setIsLoading(false);
        }
    }, [otp, email, router]);

    // Auto-submit when all digits are filled
    useEffect(() => {
        if (otp.every((d) => d !== "") && !isLoading && !isSuccess) {
            handleSubmit();
        }
    }, [otp, handleSubmit, isLoading, isSuccess]);

    const handleResend = async () => {
        setIsResending(true);
        setError("");
        try {
            await authClient.resendOtp({ email });
        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.message);
            }
        } finally {
            setIsResending(false);
            setCountdown(RESEND_DELAY);
            setOtp(Array(OTP_LENGTH).fill(""));
            focusInput(0);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md"
            >
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 mb-12">
                    <Home className="h-5 w-5 text-accent" />
                    <span className="font-display text-xl font-semibold text-foreground">EstateVue</span>
                </Link>

                {isSuccess ? (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center py-8"
                    >
                        <div className="flex justify-center mb-6">
                            <div className="h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <CheckCircle2 className="h-10 w-10 text-green-500" />
                            </div>
                        </div>
                        <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                            Verified!
                        </h2>
                        <p className="text-muted-foreground">
                            Your account is confirmed. Redirecting you…
                        </p>
                    </motion.div>
                ) : (
                    <>
                        {/* Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="h-16 w-16 rounded-2xl bg-accent/10 flex items-center justify-center">
                                <Mail className="h-8 w-8 text-accent" />
                            </div>
                        </div>

                        <div className="text-center mb-8">
                            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                                Check your inbox
                            </h1>
                            <p className="text-muted-foreground">
                                We sent a 6-digit code to{" "}
                                <span className="font-medium text-foreground">{email}</span>
                            </p>
                        </div>

                        {/* OTP inputs */}
                        <div className="flex gap-3 justify-center mb-4" onPaste={handlePaste}>
                            {otp.map((digit, i) => (
                                <motion.input
                                    key={i}
                                    ref={(el) => { inputRefs.current[i] = el; }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(i, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(i, e)}
                                    onFocus={(e) => e.target.select()}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.06 }}
                                    className={`w-12 h-14 text-center text-xl font-bold rounded-lg border-2 bg-background outline-none transition-all duration-200 caret-transparent
                                        ${digit ? "border-accent text-foreground" : "border-border text-muted-foreground"}
                                        ${error ? "border-destructive" : ""}
                                        focus:border-accent focus:ring-2 focus:ring-accent/20`}
                                />
                            ))}
                        </div>

                        {/* Error */}
                        {error && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-destructive text-sm text-center mb-4"
                            >
                                {error}
                            </motion.p>
                        )}

                        <Button
                            onClick={handleSubmit}
                            className="w-full bg-accent text-accent-foreground hover:bg-accent/90 gap-2 h-11 text-base mb-6"
                            disabled={isLoading || otp.some((d) => !d)}
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <span className="h-4 w-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                                    Verifying…
                                </span>
                            ) : (
                                <>
                                    Verify Code <ArrowRight className="h-4 w-4" />
                                </>
                            )}
                        </Button>

                        {/* Resend */}
                        <div className="text-center">
                            <p className="text-sm text-muted-foreground mb-2">
                                Didn&apos;t receive the code?
                            </p>
                            {countdown > 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    Resend in{" "}
                                    <span className="font-semibold text-foreground tabular-nums">
                                        0:{countdown.toString().padStart(2, "0")}
                                    </span>
                                </p>
                            ) : (
                                <button
                                    onClick={handleResend}
                                    disabled={isResending}
                                    className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline disabled:opacity-50"
                                >
                                    <RefreshCw className={`h-3.5 w-3.5 ${isResending ? "animate-spin" : ""}`} />
                                    {isResending ? "Sending…" : "Resend code"}
                                </button>
                            )}
                        </div>

                        <div className="mt-8 pt-8 border-t border-border text-center">
                            <p className="text-sm text-muted-foreground">
                                Wrong email?{" "}
                                <Link href="/signup" className="text-accent font-medium hover:underline">
                                    Go back
                                </Link>
                            </p>
                        </div>
                    </>
                )}
            </motion.div>
        </div>
    );
}

export default function VerifyOtpPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="h-8 w-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
            </div>
        }>
            <VerifyOtpContent />
        </Suspense>
    );
}
