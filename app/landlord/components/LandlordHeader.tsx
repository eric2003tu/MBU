"use client";

import { Bell, Menu, LogOut, Settings, User, ChevronDown } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useLandlordLayout } from "../layout";

interface LandlordHeaderProps {
    title: string;
    subtitle?: string;
}

export default function LandlordHeader({ title, subtitle }: LandlordHeaderProps) {
    const [notifOpen, setNotifOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const { user, logout } = useAuth();
    const { openMenu } = useLandlordLayout();
    const router = useRouter();

    const initials = user?.full_name
        ? user.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
        : "L";

    const unreadCount = 4;

    const handleLogout = async () => {
        await logout();
        setProfileOpen(false);
        router.push("/");
        router.refresh();
    };

    return (
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 bg-background/80 backdrop-blur-sm border-b border-border/50 shrink-0 sticky top-0 z-30 shadow-sm">
            {/* Left: hamburger + title */}
            <div className="flex items-center gap-3">
                <button
                    onClick={openMenu}
                    className="lg:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-border hover:bg-secondary transition-colors shrink-0"
                    aria-label="Open menu"
                >
                    <Menu className="h-5 w-5 text-muted-foreground" />
                </button>

                <div className="min-w-0">
                    <h1 className="text-base sm:text-lg font-semibold text-foreground leading-none truncate">{title}</h1>
                    {subtitle && (
                        <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block truncate max-w-[240px] md:max-w-none">{subtitle}</p>
                    )}
                </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                {/* Notification bell */}
                <div className="relative">
                    <button
                        onClick={() => setNotifOpen((o) => !o)}
                        className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-border hover:border-accent/40 hover:bg-secondary transition-colors"
                    >
                        <Bell className="h-4 w-4 text-muted-foreground" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    {notifOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setNotifOpen(false)}
                            />
                            <div className="absolute right-0 top-full mt-2 w-[calc(100vw-2rem)] max-w-[288px] z-20 glass-card rounded-xl shadow-xl overflow-hidden">
                                <div className="px-4 py-3 border-b border-border/50">
                                    <p className="text-sm font-semibold text-foreground">Notifications</p>
                                </div>
                                {[
                                    { title: "New Booking Request", body: "Unit 2B – Sunset Apartments", time: "1h ago", dot: "bg-amber-500" },
                                    { title: "Rent Payment Received", body: "$1,200 from John Doe", time: "3h ago", dot: "bg-green-500" },
                                    { title: "Lease Expiring Soon", body: "Unit 4A – 15 days remaining", time: "1d ago", dot: "bg-red-500" },
                                    { title: "Application Approved", body: "Your landlord status is active", time: "3d ago", dot: "bg-blue-500" },
                                ].map((n, i) => (
                                    <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors cursor-pointer">
                                        <div className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${n.dot}`} />
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-foreground">{n.title}</p>
                                            <p className="text-xs text-muted-foreground truncate">{n.body}</p>
                                            <p className="text-xs text-muted-foreground/60 mt-0.5">{n.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* User avatar with dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setProfileOpen((o) => !o)}
                        className="flex items-center gap-2.5 rounded-xl px-1.5 py-1 hover:bg-secondary/50 transition-colors cursor-pointer"
                    >
                        <div className="h-9 w-9 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent text-xs font-bold shrink-0">
                            {initials}
                        </div>
                        <div className="hidden sm:block">
                            {user?.full_name ? (
                                <>
                                    <p className="text-sm font-semibold text-foreground leading-none truncate max-w-[140px] text-left">
                                        {user.full_name}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-0.5 text-left">Landlord</p>
                                </>
                            ) : (
                                <div className="space-y-1">
                                    <div className="h-3 w-24 rounded bg-muted animate-pulse" />
                                    <div className="h-2.5 w-16 rounded bg-muted animate-pulse" />
                                </div>
                            )}
                        </div>
                        <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform hidden sm:block ${profileOpen ? "rotate-180" : ""}`} />
                    </button>

                    {profileOpen && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                            <div className="absolute right-0 top-full mt-2 w-52 z-20 glass-card rounded-xl shadow-lg py-1 overflow-hidden">
                                <div className="px-4 py-3 border-b border-border/50">
                                    <p className="text-sm font-semibold text-foreground truncate">{user?.full_name ?? "Account"}</p>
                                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                                </div>
                                <Link
                                    href="/landlord/profile"
                                    onClick={() => setProfileOpen(false)}
                                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                                >
                                    <User className="h-4 w-4" />
                                    Profile
                                </Link>
                                <Link
                                    href="/landlord/settings"
                                    onClick={() => setProfileOpen(false)}
                                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                                >
                                    <Settings className="h-4 w-4" />
                                    Settings
                                </Link>
                                <div className="border-t border-border/50">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Sign out
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
