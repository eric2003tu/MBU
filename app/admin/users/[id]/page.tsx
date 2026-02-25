"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    ArrowLeft, Mail, Phone, Calendar, Shield, UserCheck, Briefcase,
    CreditCard, FileText, Building2, CheckCircle2, User as UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminHeader from "../../components/AdminHeader";

type Role = "ADMIN" | "LANDLORD" | "TENANT" | "AGENT";

const roleConfig: Record<Role, { label: string; className: string; icon: typeof Shield }> = {
    ADMIN: { label: "Admin", className: "text-red-700 bg-red-50 border-red-200", icon: Shield },
    LANDLORD: { label: "Landlord", className: "text-blue-700 bg-blue-50 border-blue-200", icon: UserCheck },
    TENANT: { label: "Tenant", className: "text-green-700 bg-green-50 border-green-200", icon: UserIcon },
    AGENT: { label: "Agent", className: "text-purple-700 bg-purple-50 border-purple-200", icon: Briefcase },
};

const mockUsers: Record<string, {
    id: string; fullName: string; email: string; phone: string;
    role: Role; createdAt: string;
    bookings: { id: string; unit: string; dates: string; status: string; price: number }[];
    leases: { id: string; unit: string; period: string; rent: number; status: string }[];
    payments: { id: string; description: string; date: string; amount: number; status: string }[];
}> = {
    "u-001": {
        id: "u-001", fullName: "Admin System", email: "admin@mbu.com", phone: "+250 788 000 001",
        role: "ADMIN", createdAt: "2024-01-01",
        bookings: [],
        leases: [],
        payments: [],
    },
    "u-002": {
        id: "u-002", fullName: "Jean Habimana", email: "jean@example.com", phone: "+250 788 123 456",
        role: "LANDLORD", createdAt: "2025-06-15",
        bookings: [],
        leases: [],
        payments: [
            { id: "p-501", description: "Payout – Sunset Villas bookings", date: "Jan 15, 2026", amount: 3200, status: "PAID" },
            { id: "p-502", description: "Payout – Green Apartments rent", date: "Feb 5, 2026", amount: 4800, status: "PAID" },
        ],
    },
    "u-003": {
        id: "u-003", fullName: "Alice Uwimana", email: "alice@example.com", phone: "+250 788 456 789",
        role: "LANDLORD", createdAt: "2025-07-20",
        bookings: [],
        leases: [],
        payments: [
            { id: "p-503", description: "Payout – Green Apartments rent", date: "Feb 1, 2026", amount: 5600, status: "PAID" },
        ],
    },
    "u-004": {
        id: "u-004", fullName: "Marie Claire", email: "marie@example.com", phone: "+250 788 567 890",
        role: "TENANT", createdAt: "2025-09-10",
        bookings: [
            { id: "bk-302", unit: "Studio Loft – Heights Tower", dates: "Apr 1 – Apr 3, 2026", status: "PENDING", price: 320 },
        ],
        leases: [
            { id: "ls-003", unit: "Studio A – Heights Tower", period: "Jun 2025 – Jun 2026", rent: 1000, status: "ACTIVE" },
        ],
        payments: [
            { id: "p-402", description: "Booking – Unit 3A", date: "Jan 20, 2026", amount: 840, status: "PAID" },
            { id: "p-408", description: "Monthly Rent – Lease #L-003", date: "Feb 1, 2026", amount: 1000, status: "FAILED" },
        ],
    },
    "u-005": {
        id: "u-005", fullName: "Eric Mugabo", email: "eric@example.com", phone: "+250 788 678 901",
        role: "TENANT", createdAt: "2025-10-05",
        bookings: [
            { id: "bk-303", unit: "Room 12 – Garden View", dates: "Mar 15 – Mar 18, 2026", status: "PENDING", price: 450 },
        ],
        leases: [
            { id: "ls-002", unit: "Room 3 – Garden View", period: "Oct 2025 – Oct 2026", rent: 950, status: "ACTIVE" },
        ],
        payments: [
            { id: "p-403", description: "Monthly Rent – Lease #L-002", date: "Feb 1, 2026", amount: 950, status: "PAID" },
        ],
    },
    "u-006": {
        id: "u-006", fullName: "David Iradukunda", email: "david@example.com", phone: "+250 788 789 012",
        role: "TENANT", createdAt: "2025-11-22",
        bookings: [
            { id: "bk-304", unit: "Villa Suite – Sunset Villas", dates: "Feb 10 – Feb 14, 2026", status: "CONFIRMED", price: 1200 },
        ],
        leases: [],
        payments: [
            { id: "p-404", description: "Security Deposit – Studio A", date: "Jan 5, 2026", amount: 3600, status: "PAID" },
        ],
    },
    "u-007": {
        id: "u-007", fullName: "Sarah Ingabire", email: "sarah@example.com", phone: "+250 788 890 123",
        role: "TENANT", createdAt: "2026-01-08",
        bookings: [
            { id: "bk-305", unit: "Unit 5B – Green Apartments", dates: "Jan 20 – Jan 25, 2026", status: "CANCELLED", price: 600 },
        ],
        leases: [],
        payments: [
            { id: "p-405", description: "Booking – Villa Suite", date: "Mar 10, 2026", amount: 1200, status: "PENDING" },
        ],
    },
    "u-008": {
        id: "u-008", fullName: "Grace Mukamana", email: "grace@example.com", phone: "+250 788 234 567",
        role: "LANDLORD", createdAt: "2025-08-30",
        bookings: [],
        leases: [],
        payments: [
            { id: "p-504", description: "Payout – Garden View rent", date: "Feb 1, 2026", amount: 3800, status: "PAID" },
        ],
    },
    "u-009": {
        id: "u-009", fullName: "Patrick Uwase", email: "patrick@example.com", phone: "+250 788 901 234",
        role: "TENANT", createdAt: "2026-02-01",
        bookings: [
            { id: "bk-306", unit: "Room 3 – Lake Kivu Duplex", dates: "Apr 10 – Apr 15, 2026", status: "PENDING", price: 750 },
        ],
        leases: [],
        payments: [],
    },
    "u-010": {
        id: "u-010", fullName: "Peter Nkurunziza", email: "peter@example.com", phone: "+250 788 345 678",
        role: "AGENT", createdAt: "2025-05-10",
        bookings: [],
        leases: [],
        payments: [],
    },
};

const statusMap: Record<string, { label: string; className: string }> = {
    CONFIRMED: { label: "Confirmed", className: "text-green-600 bg-green-50 border-green-200" },
    PENDING: { label: "Pending", className: "text-amber-600 bg-amber-50 border-amber-200" },
    CANCELLED: { label: "Cancelled", className: "text-red-600 bg-red-50 border-red-200" },
    ACTIVE: { label: "Active", className: "text-green-600 bg-green-50 border-green-200" },
    ENDED: { label: "Ended", className: "text-gray-600 bg-gray-50 border-gray-200" },
    PAID: { label: "Paid", className: "text-green-600 bg-green-50 border-green-200" },
    FAILED: { label: "Failed", className: "text-red-600 bg-red-50 border-red-200" },
};

const fadeUp = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export default function UserDetailPage() {
    const params = useParams();
    const userId = params.id as string;
    const user = mockUsers[userId];

    if (!user) {
        return (
            <div>
                <AdminHeader title="User Not Found" />
                <div className="p-6 text-center">
                    <p className="text-muted-foreground">No user found with ID: {userId}</p>
                    <Link href="/admin/users">
                        <Button variant="outline" className="mt-4 gap-2"><ArrowLeft className="h-4 w-4" /> Back to Users</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const r = roleConfig[user.role];
    const RoleIcon = r.icon;
    const initials = user.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

    return (
        <div>
            <AdminHeader title="User Details" subtitle={user.fullName} />

            <div className="p-6 mx-auto space-y-6">
                {/* Back link */}
                <Link href="/admin/users" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Back to Users
                </Link>

                {/* Profile card */}
                <motion.div variants={fadeUp} initial="hidden" animate="show" className="glass-card rounded-2xl p-6">
                    <div className="flex items-start gap-5">
                        <div className="h-20 w-20 rounded-2xl bg-accent/15 border-2 border-accent/30 flex items-center justify-center text-accent text-2xl font-bold font-display shrink-0">
                            {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 flex-wrap">
                                <h2 className="font-display text-xl font-semibold text-foreground">{user.fullName}</h2>
                                <span className={`flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full border ${r.className}`}>
                                    <RoleIcon className="h-3 w-3" /> {r.label}
                                </span>
                            </div>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground flex-wrap">
                                <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> {user.email}</span>
                                <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> {user.phone}</span>
                            </div>
                            <p className="text-xs text-muted-foreground/70 mt-1 flex items-center gap-1">
                                <Calendar className="h-3 w-3" /> Joined {new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                    {[
                        { label: "Bookings", value: user.bookings.length, icon: Calendar, color: "text-amber-500", bg: "bg-amber-500/10" },
                        { label: "Leases", value: user.leases.length, icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10" },
                        { label: "Payments", value: user.payments.length, icon: CreditCard, color: "text-green-500", bg: "bg-green-500/10" },
                    ].map((stat) => (
                        <motion.div key={stat.label} variants={fadeUp} initial="hidden" animate="show" className="glass-card rounded-2xl p-5 flex items-start gap-4">
                            <div className={`h-11 w-11 rounded-xl ${stat.bg} flex items-center justify-center shrink-0`}>
                                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                            </div>
                            <div>
                                <p className="text-xl font-bold font-display text-foreground">{stat.value}</p>
                                <p className="text-xs text-muted-foreground">{stat.label}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Bookings */}
                {user.bookings.length > 0 && (
                    <motion.div variants={fadeUp} initial="hidden" animate="show" className="glass-card rounded-2xl overflow-hidden">
                        <div className="px-5 py-4 border-b border-border/50">
                            <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-accent" /> Bookings
                            </h3>
                        </div>
                        <div className="divide-y divide-border/40">
                            {user.bookings.map((booking) => {
                                const bs = statusMap[booking.status];
                                return (
                                    <div key={booking.id} className="px-5 py-4 flex items-center justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-foreground truncate">{booking.unit}</p>
                                            <p className="text-xs text-muted-foreground">{booking.dates}</p>
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0">
                                            <span className="text-sm font-bold text-foreground font-display">${booking.price}</span>
                                            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${bs.className}`}>{bs.label}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}

                {/* Leases */}
                {user.leases.length > 0 && (
                    <motion.div variants={fadeUp} initial="hidden" animate="show" className="glass-card rounded-2xl overflow-hidden">
                        <div className="px-5 py-4 border-b border-border/50">
                            <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
                                <FileText className="h-4 w-4 text-accent" /> Leases
                            </h3>
                        </div>
                        <div className="divide-y divide-border/40">
                            {user.leases.map((lease) => {
                                const ls = statusMap[lease.status];
                                return (
                                    <div key={lease.id} className="px-5 py-4 flex items-center justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-foreground truncate">{lease.unit}</p>
                                            <p className="text-xs text-muted-foreground">{lease.period}</p>
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0">
                                            <span className="text-sm font-bold text-foreground font-display">${lease.rent}/mo</span>
                                            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${ls.className}`}>{ls.label}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}

                {/* Payments */}
                {user.payments.length > 0 && (
                    <motion.div variants={fadeUp} initial="hidden" animate="show" className="glass-card rounded-2xl overflow-hidden">
                        <div className="px-5 py-4 border-b border-border/50">
                            <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
                                <CreditCard className="h-4 w-4 text-accent" /> Payment History
                            </h3>
                        </div>
                        <div className="divide-y divide-border/40">
                            {user.payments.map((payment) => {
                                const ps = statusMap[payment.status];
                                return (
                                    <div key={payment.id} className="px-5 py-4 flex items-center justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-foreground truncate">{payment.description}</p>
                                            <p className="text-xs text-muted-foreground">{payment.date}</p>
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0">
                                            <span className="text-sm font-bold text-foreground font-display">${payment.amount}</span>
                                            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${ps.className}`}>{ps.label}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}

                {/* Empty state for roles without activity */}
                {user.bookings.length === 0 && user.leases.length === 0 && user.payments.length === 0 && (
                    <motion.div variants={fadeUp} initial="hidden" animate="show" className="glass-card rounded-2xl p-8 text-center">
                        <Building2 className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">No activity recorded for this user yet.</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
