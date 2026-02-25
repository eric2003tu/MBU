"use client";

import { motion, type Variants } from "framer-motion";
import { User, Building2, CreditCard, FileCheck, Shield, MapPin, Phone, Mail, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import LandlordHeader from "../components/LandlordHeader";
import { useAuth } from "@/hooks/useAuth";

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
};

// Mock landlord profile data
const landlordProfile = {
    status: "APPROVED" as const,
    government_id: "1199XXXXXXXXXXXXXXXX",
    physical_address: "KG 123 St, Kimihurura, Kigali",
    tax_id: "TIN-00123456",
    bank_account: "BK **** **** 7890",
    preferred_payment: "Bank Transfer",
    date_approved: "Jan 15, 2026",
    properties_count: 6,
    total_units: 18,
};

const statusColors: Record<string, string> = {
    APPROVED: "text-green-700 bg-green-50 border-green-200",
    PENDING: "text-amber-700 bg-amber-50 border-amber-200",
    REJECTED: "text-red-700 bg-red-50 border-red-200",
};

export default function LandlordProfilePage() {
    const { user } = useAuth();

    const initials = user?.full_name
        ? user.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
        : "L";

    return (
        <div>
            <LandlordHeader title="Profile" subtitle="Manage your landlord account details" />

            <div className="p-6 mx-auto space-y-6">
                {/* Profile card */}
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    animate="show"
                    className="glass-card rounded-2xl p-6"
                >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                        <div className="h-20 w-20 rounded-2xl bg-accent/15 border-2 border-accent/30 flex items-center justify-center text-accent text-2xl font-bold font-display shrink-0">
                            {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3">
                                <h2 className="font-display text-xl font-semibold text-foreground">
                                    {user?.full_name ?? "Landlord Name"}
                                </h2>
                                <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full border ${statusColors[landlordProfile.status]}`}>
                                    {landlordProfile.status}
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1.5">
                                    <Mail className="h-3.5 w-3.5 text-accent" />
                                    {user?.email ?? "email@example.com"}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Phone className="h-3.5 w-3.5 text-accent" />
                                    {user?.phone ?? "+250 788 000 000"}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <MapPin className="h-3.5 w-3.5 text-accent" />
                                    {landlordProfile.physical_address}
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground/70 mt-2">
                                Approved since {landlordProfile.date_approved} · {landlordProfile.properties_count} properties · {landlordProfile.total_units} units
                            </p>
                        </div>
                        <Button size="sm" variant="outline" className="gap-1.5 shrink-0">
                            <Edit3 className="h-3.5 w-3.5" />
                            Edit Profile
                        </Button>
                    </div>
                </motion.div>

                {/* Details grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Verification Info */}
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        animate="show"
                        className="glass-card rounded-2xl p-6"
                    >
                        <div className="flex items-center gap-2 mb-5">
                            <Shield className="h-5 w-5 text-accent" />
                            <h3 className="font-display text-base font-semibold text-foreground">Verification Details</h3>
                        </div>
                        <div className="space-y-4">
                            {[
                                { label: "Government ID", value: landlordProfile.government_id, icon: FileCheck },
                                { label: "Tax ID (TIN)", value: landlordProfile.tax_id, icon: FileCheck },
                                { label: "Physical Address", value: landlordProfile.physical_address, icon: MapPin },
                            ].map((item) => (
                                <div key={item.label} className="flex items-start gap-3">
                                    <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <item.icon className="h-4 w-4 text-accent" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">{item.label}</p>
                                        <p className="text-sm font-medium text-foreground">{item.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Payment Info */}
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        animate="show"
                        className="glass-card rounded-2xl p-6"
                    >
                        <div className="flex items-center gap-2 mb-5">
                            <CreditCard className="h-5 w-5 text-accent" />
                            <h3 className="font-display text-base font-semibold text-foreground">Payment Information</h3>
                        </div>
                        <div className="space-y-4">
                            {[
                                { label: "Bank Account", value: landlordProfile.bank_account, icon: Building2 },
                                { label: "Preferred Payment", value: landlordProfile.preferred_payment, icon: CreditCard },
                            ].map((item) => (
                                <div key={item.label} className="flex items-start gap-3">
                                    <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <item.icon className="h-4 w-4 text-accent" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">{item.label}</p>
                                        <p className="text-sm font-medium text-foreground">{item.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 p-4 rounded-xl bg-accent/5 border border-accent/10">
                            <p className="text-xs text-muted-foreground">
                                <strong className="text-foreground">Revenue Distribution:</strong> Rent payments are deposited to your bank account after MBU Properties commission (8–12%) is deducted. Payments are processed within 5 business days.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
