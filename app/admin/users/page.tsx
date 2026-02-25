"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Users, Shield, User, UserCheck, Briefcase, Mail, Calendar } from "lucide-react";
import AdminHeader from "../components/AdminHeader";

type Role = "ADMIN" | "LANDLORD" | "TENANT" | "AGENT";

const mockUsers = [
    { id: "u-001", fullName: "Admin System", email: "admin@mbu.com", phone: "+250 788 000 001", role: "ADMIN" as Role, createdAt: "2024-01-01" },
    { id: "u-002", fullName: "Jean Habimana", email: "jean@example.com", phone: "+250 788 123 456", role: "LANDLORD" as Role, createdAt: "2025-06-15" },
    { id: "u-003", fullName: "Alice Uwimana", email: "alice@example.com", phone: "+250 788 456 789", role: "LANDLORD" as Role, createdAt: "2025-07-20" },
    { id: "u-004", fullName: "Marie Claire", email: "marie@example.com", phone: "+250 788 567 890", role: "TENANT" as Role, createdAt: "2025-09-10" },
    { id: "u-005", fullName: "Eric Mugabo", email: "eric@example.com", phone: "+250 788 678 901", role: "TENANT" as Role, createdAt: "2025-10-05" },
    { id: "u-006", fullName: "David Iradukunda", email: "david@example.com", phone: "+250 788 789 012", role: "TENANT" as Role, createdAt: "2025-11-22" },
    { id: "u-007", fullName: "Sarah Ingabire", email: "sarah@example.com", phone: "+250 788 890 123", role: "TENANT" as Role, createdAt: "2026-01-08" },
    { id: "u-008", fullName: "Grace Mukamana", email: "grace@example.com", phone: "+250 788 234 567", role: "LANDLORD" as Role, createdAt: "2025-08-30" },
    { id: "u-009", fullName: "Patrick Uwase", email: "patrick@example.com", phone: "+250 788 901 234", role: "TENANT" as Role, createdAt: "2026-02-01" },
    { id: "u-010", fullName: "Peter Nkurunziza", email: "peter@example.com", phone: "+250 788 345 678", role: "AGENT" as Role, createdAt: "2025-05-10" },
];

const roleConfig: Record<Role, { label: string; className: string; icon: typeof Shield }> = {
    ADMIN: { label: "Admin", className: "text-red-700 bg-red-50 border-red-200", icon: Shield },
    LANDLORD: { label: "Landlord", className: "text-blue-700 bg-blue-50 border-blue-200", icon: UserCheck },
    TENANT: { label: "Tenant", className: "text-green-700 bg-green-50 border-green-200", icon: User },
    AGENT: { label: "Agent", className: "text-purple-700 bg-purple-50 border-purple-200", icon: Briefcase },
};

const fadeUp = {
    hidden: { opacity: 0, y: 12 },
    show: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.35, delay: i * 0.06, ease: "easeOut" as const } }),
};

export default function AdminUsersPage() {
    const [filter, setFilter] = useState<"ALL" | Role>("ALL");
    const filtered = filter === "ALL" ? mockUsers : mockUsers.filter((u) => u.role === filter);

    return (
        <div>
            <AdminHeader title="User Management" subtitle="View and manage all system users" />

            <div className="p-6 mx-auto space-y-6">
                {/* Summary cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {(["ADMIN", "LANDLORD", "TENANT", "AGENT"] as const).map((role, idx) => {
                        const r = roleConfig[role];
                        const RoleIcon = r.icon;
                        const count = mockUsers.filter((u) => u.role === role).length;
                        return (
                            <motion.div
                                key={role}
                                initial={{ opacity: 0, y: 14 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.07 }}
                                className="glass-card rounded-2xl p-5 flex items-center gap-4"
                            >
                                <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${r.className.split(" ").slice(1).join(" ")}`}>
                                    <RoleIcon className={`h-5 w-5 ${r.className.split(" ")[0]}`} />
                                </div>
                                <div>
                                    <p className="text-xl font-bold font-display text-foreground">{count}</p>
                                    <p className="text-xs text-muted-foreground">{r.label}s</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Filter tabs */}
                <div className="flex gap-2 flex-wrap">
                    {(["ALL", "ADMIN", "LANDLORD", "TENANT", "AGENT"] as const).map((s) => (
                        <button
                            key={s}
                            onClick={() => setFilter(s)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${filter === s
                                ? "bg-accent text-accent-foreground border-accent shadow-sm"
                                : "bg-secondary border-border/50 text-muted-foreground hover:border-accent/40 hover:text-foreground"
                                }`}
                        >
                            {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
                        </button>
                    ))}
                    <div className="ml-auto text-sm text-muted-foreground flex items-center gap-1">
                        <Users className="h-4 w-4" /> {mockUsers.length} total users
                    </div>
                </div>

                {/* Users table */}
                <motion.div className="glass-card rounded-2xl overflow-hidden">
                    <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-3 border-b border-border/50 bg-secondary/30 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        <span>User</span>
                        <span>Phone</span>
                        <span>Joined</span>
                        <span>Role</span>
                    </div>

                    <div className="divide-y divide-border/40">
                        {filtered.map((user, i) => {
                            const r = roleConfig[user.role];
                            const RoleIcon = r.icon;
                            const initials = user.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
                            return (
                                <Link key={user.id} href={`/admin/users/${user.id}`}>
                                    <motion.div
                                        custom={i}
                                        variants={fadeUp}
                                        initial="hidden"
                                        animate="show"
                                        className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto_auto] gap-2 sm:gap-4 px-5 py-4 hover:bg-secondary/30 transition-colors items-center cursor-pointer"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="h-9 w-9 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent text-xs font-bold shrink-0">
                                                {initials}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-foreground truncate hover:text-accent transition-colors">{user.fullName}</p>
                                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <Mail className="h-3 w-3" /> {user.email}
                                                </p>
                                            </div>
                                        </div>

                                        <span className="text-sm text-muted-foreground whitespace-nowrap">
                                            {user.phone}
                                        </span>

                                        <span className="text-sm text-muted-foreground whitespace-nowrap flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                        </span>

                                        <span className={`flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full border w-fit ${r.className}`}>
                                            <RoleIcon className="h-3 w-3" />
                                            {r.label}
                                        </span>
                                    </motion.div>
                                </Link>
                            );
                        })}
                    </div>

                    {filtered.length === 0 && (
                        <div className="text-center py-12">
                            <Users className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">No users found.</p>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
