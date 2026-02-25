"use client";

import { Bell } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

interface AdminHeaderProps {
    title: string;
    subtitle?: string;
}

export default function AdminHeader({ title, subtitle }: AdminHeaderProps) {
    const [notifOpen, setNotifOpen] = useState(false);
    const { user } = useAuth();

    const initials = user?.full_name
        ? user.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
        : "A";

    const unreadCount = 5;

    return (
        <header className="h-16 flex items-center justify-between px-6 bg-background/80 backdrop-blur-sm border-b border-border/50 shrink-0 sticky top-0 z-30 shadow-sm">
            {/* Page title */}
            <div>
                <h1 className="text-lg font-semibold text-foreground leading-none">{title}</h1>
                {subtitle && (
                    <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
                )}
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-3">
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
                            <div className="absolute right-0 top-full mt-2 w-72 z-20 glass-card rounded-xl shadow-xl overflow-hidden">
                                <div className="px-4 py-3 border-b border-border/50">
                                    <p className="text-sm font-semibold text-foreground">Notifications</p>
                                </div>
                                {[
                                    { title: "New Landlord Application", body: "Jean Habimana applied to become a landlord", time: "30m ago", dot: "bg-amber-500" },
                                    { title: "Booking Needs Confirmation", body: "Unit 2B – Sunset Apartments", time: "1h ago", dot: "bg-blue-500" },
                                    { title: "Payment Received", body: "$1,200 from Alice Uwimana", time: "2h ago", dot: "bg-green-500" },
                                    { title: "Lease Expiring Soon", body: "Unit 4A – 7 days remaining", time: "1d ago", dot: "bg-red-500" },
                                    { title: "New User Registered", body: "Marie Claire joined as Tenant", time: "2d ago", dot: "bg-purple-500" },
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

                {/* User avatar */}
                <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent text-xs font-bold">
                        {initials}
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-sm font-medium text-foreground leading-none truncate max-w-[120px]">
                            {user?.full_name?.split(" ")[0] ?? "Admin"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">Administrator</p>
                    </div>
                </div>
            </div>
        </header>
    );
}
