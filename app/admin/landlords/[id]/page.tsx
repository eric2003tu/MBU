"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    ArrowLeft, Mail, Phone, MapPin, CheckCircle2, Clock, XCircle,
    Building2, Calendar, CreditCard, FileText, Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminHeader from "../../components/AdminHeader";

type LandlordStatus = "PENDING" | "APPROVED" | "REJECTED";

const mockLandlords: Record<string, {
    id: string; name: string; email: string; phone: string;
    governmentId: string; profilePhotoUrl: string; address: string;
    taxId: string; bankAccount: string; preferredPayment: string;
    appliedDate: string; status: LandlordStatus;
    properties: { id: string; title: string; type: string; city: string; units: number }[];
    stats: { totalProperties: number; totalUnits: number; activeLeases: number; totalRevenue: number };
}> = {
    "l-001": {
        id: "l-001", name: "Jean Habimana", email: "jean@example.com", phone: "+250 788 123 456",
        governmentId: "ID-98234", profilePhotoUrl: "", address: "KG 123 St, Kigali",
        taxId: "TAX-001234", bankAccount: "BK ****4567", preferredPayment: "Bank Transfer",
        appliedDate: "2026-02-24", status: "PENDING",
        properties: [],
        stats: { totalProperties: 0, totalUnits: 0, activeLeases: 0, totalRevenue: 0 },
    },
    "l-004": {
        id: "l-004", name: "Alice Uwimana", email: "alice@example.com", phone: "+250 788 456 789",
        governmentId: "ID-11223", profilePhotoUrl: "", address: "KG 90 Ave, Kigali",
        taxId: "TAX-003456", bankAccount: "BK ****6789", preferredPayment: "Bank Transfer",
        appliedDate: "2026-02-15", status: "APPROVED",
        properties: [
            { id: "p-001", title: "Green Apartments", type: "APARTMENT", city: "Kigali", units: 6 },
            { id: "p-006", title: "Lake Kivu Duplex", type: "DUPLEX", city: "Rubavu", units: 2 },
        ],
        stats: { totalProperties: 2, totalUnits: 8, activeLeases: 5, totalRevenue: 12400 },
    },
    "l-005": {
        id: "l-005", name: "Eric Mugabo", email: "eric@example.com", phone: "+250 788 567 890",
        governmentId: "ID-44556", profilePhotoUrl: "", address: "KN 12 St, Kigali",
        taxId: "TAX-007890", bankAccount: "BK ****0123", preferredPayment: "Mobile Money",
        appliedDate: "2026-02-10", status: "REJECTED",
        properties: [],
        stats: { totalProperties: 0, totalUnits: 0, activeLeases: 0, totalRevenue: 0 },
    },
};

const statusConfig: Record<LandlordStatus, { label: string; className: string; icon: typeof CheckCircle2 }> = {
    PENDING: { label: "Pending Review", className: "text-amber-700 bg-amber-50 border-amber-200", icon: Clock },
    APPROVED: { label: "Approved", className: "text-green-700 bg-green-50 border-green-200", icon: CheckCircle2 },
    REJECTED: { label: "Rejected", className: "text-red-700 bg-red-50 border-red-200", icon: XCircle },
};

const fadeUp = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export default function LandlordDetailPage() {
    const params = useParams();
    const landlordId = params.id as string;
    const landlord = mockLandlords[landlordId];

    if (!landlord) {
        return (
            <div>
                <AdminHeader title="Landlord Not Found" />
                <div className="p-6 text-center">
                    <p className="text-muted-foreground">No landlord found with ID: {landlordId}</p>
                    <Link href="/admin/landlords">
                        <Button variant="outline" className="mt-4 gap-2"><ArrowLeft className="h-4 w-4" /> Back to Landlords</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const s = statusConfig[landlord.status];
    const StatusIcon = s.icon;
    const initials = landlord.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

    return (
        <div>
            <AdminHeader title="Landlord Details" subtitle={landlord.name} />

            <div className="p-6 mx-auto space-y-6">
                {/* Back link */}
                <Link href="/admin/landlords" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Back to Landlords
                </Link>

                {/* Profile card */}
                <motion.div variants={fadeUp} initial="hidden" animate="show" className="glass-card rounded-2xl p-6">
                    <div className="flex items-start gap-5">
                        <div className="h-20 w-20 rounded-2xl bg-accent/15 border-2 border-accent/30 flex items-center justify-center text-accent text-2xl font-bold font-display shrink-0">
                            {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 flex-wrap">
                                <h2 className="font-display text-xl font-semibold text-foreground">{landlord.name}</h2>
                                <span className={`flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full border ${s.className}`}>
                                    <StatusIcon className="h-3 w-3" /> {s.label}
                                </span>
                            </div>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground flex-wrap">
                                <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> {landlord.email}</span>
                                <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> {landlord.phone}</span>
                                <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {landlord.address}</span>
                            </div>
                            <p className="text-xs text-muted-foreground/70 mt-1">Applied on {landlord.appliedDate}</p>
                        </div>
                        {landlord.status === "PENDING" && (
                            <div className="flex gap-2 shrink-0">
                                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white gap-1.5">
                                    <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                                </Button>
                                <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 gap-1.5">
                                    <XCircle className="h-3.5 w-3.5" /> Reject
                                </Button>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Verification details */}
                <motion.div variants={fadeUp} initial="hidden" animate="show" className="glass-card rounded-2xl p-6">
                    <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Shield className="h-4 w-4 text-accent" /> Verification Details
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 text-sm">
                        {[
                            { label: "Government ID", value: landlord.governmentId },
                            { label: "Tax ID", value: landlord.taxId },
                            { label: "Bank Account", value: landlord.bankAccount },
                            { label: "Payment Preference", value: landlord.preferredPayment },
                            { label: "Physical Address", value: landlord.address },
                        ].map((item) => (
                            <div key={item.label}>
                                <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                                <p className="font-medium text-foreground">{item.value}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Stats (only for approved) */}
                {landlord.status === "APPROVED" && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                            { label: "Properties", value: landlord.stats.totalProperties, icon: Building2, color: "text-blue-500", bg: "bg-blue-500/10" },
                            { label: "Total Units", value: landlord.stats.totalUnits, icon: Building2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                            { label: "Active Leases", value: landlord.stats.activeLeases, icon: FileText, color: "text-purple-500", bg: "bg-purple-500/10" },
                            { label: "Revenue", value: `$${landlord.stats.totalRevenue.toLocaleString()}`, icon: CreditCard, color: "text-green-500", bg: "bg-green-500/10" },
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
                )}

                {/* Properties list (only for approved) */}
                {landlord.status === "APPROVED" && landlord.properties.length > 0 && (
                    <motion.div variants={fadeUp} initial="hidden" animate="show" className="glass-card rounded-2xl overflow-hidden">
                        <div className="px-5 py-4 border-b border-border/50">
                            <h3 className="font-display font-semibold text-foreground">Listed Properties</h3>
                        </div>
                        <div className="divide-y divide-border/40">
                            {landlord.properties.map((prop) => (
                                <Link key={prop.id} href={`/admin/properties/${prop.id}`}>
                                    <div className="px-5 py-4 hover:bg-secondary/40 transition-colors cursor-pointer flex items-center justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-foreground truncate">{prop.title}</p>
                                            <p className="text-xs text-muted-foreground">{prop.city} · {prop.type}</p>
                                        </div>
                                        <span className="text-xs font-semibold text-foreground">{prop.units} units</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
