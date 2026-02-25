"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, Lock, Bell, Shield, CheckCircle2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import AdminHeader from "../components/AdminHeader";

const tabs = ["Personal Info", "Security", "Notifications"];

export default function AdminProfilePage() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("Personal Info");
    const [saved, setSaved] = useState(false);

    const [form, setForm] = useState({
        full_name: user?.full_name ?? "System Admin",
        email: user?.email ?? "admin@mbu.com",
        phone: user?.phone ?? "+250 788 000 001",
    });

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    const initials = form.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <div>
            <AdminHeader title="Admin Profile" subtitle="Manage your account information and settings" />

            <div className="p-6 mx-auto space-y-6">
                {/* Avatar section */}
                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card rounded-2xl p-6 flex items-center gap-5"
                >
                    <div className="relative">
                        <div className="h-20 w-20 rounded-2xl bg-accent/15 border-2 border-accent/30 flex items-center justify-center text-accent text-2xl font-bold font-display">
                            {initials}
                        </div>
                        <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-green-500 border-2 border-background flex items-center justify-center">
                            <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                        </div>
                    </div>
                    <div>
                        <h2 className="font-display text-xl font-semibold text-foreground">{form.full_name}</h2>
                        <p className="text-sm text-muted-foreground">{form.email}</p>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200">
                                ADMIN
                            </span>
                            <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">
                                Verified
                            </span>
                        </div>
                    </div>
                    <div className="ml-auto">
                        <Button variant="outline" size="sm" className="text-xs">
                            Change Photo
                        </Button>
                    </div>
                </motion.div>

                {/* Tabs */}
                <div className="flex gap-1 bg-secondary rounded-xl p-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === tab
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Tab content */}
                {activeTab === "Personal Info" && (
                    <motion.div
                        key="personal"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card rounded-2xl p-6 space-y-5"
                    >
                        <h3 className="font-display font-semibold text-foreground">Personal Information</h3>

                        {[
                            { label: "Full Name", key: "full_name", type: "text", icon: User, placeholder: "Your full name" },
                            { label: "Email Address", key: "email", type: "email", icon: Mail, placeholder: "your@email.com" },
                            { label: "Phone Number", key: "phone", type: "tel", icon: Phone, placeholder: "+250 788 000 000" },
                        ].map((field) => (
                            <div key={field.key} className="space-y-1.5">
                                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                    <field.icon className="h-4 w-4 text-muted-foreground" />
                                    {field.label}
                                </label>
                                <input
                                    type={field.type}
                                    value={form[field.key as keyof typeof form]}
                                    onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
                                    placeholder={field.placeholder}
                                    className="w-full h-10 px-4 rounded-xl bg-secondary border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 transition"
                                />
                            </div>
                        ))}

                        <Button
                            onClick={handleSave}
                            className={`w-full gap-2 transition-all ${saved
                                ? "bg-green-500 hover:bg-green-500 text-white"
                                : "bg-accent text-accent-foreground hover:bg-accent/90"
                                }`}
                        >
                            {saved ? (
                                <>
                                    <CheckCircle2 className="h-4 w-4" />
                                    Saved!
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </motion.div>
                )}

                {activeTab === "Security" && (
                    <motion.div
                        key="security"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card rounded-2xl p-6 space-y-5"
                    >
                        <h3 className="font-display font-semibold text-foreground">Change Password</h3>

                        {[
                            { label: "Current Password", placeholder: "Enter current password" },
                            { label: "New Password", placeholder: "Enter new password" },
                            { label: "Confirm Password", placeholder: "Confirm new password" },
                        ].map((field) => (
                            <div key={field.label} className="space-y-1.5">
                                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                    <Lock className="h-4 w-4 text-muted-foreground" />
                                    {field.label}
                                </label>
                                <input
                                    type="password"
                                    placeholder={field.placeholder}
                                    className="w-full h-10 px-4 rounded-xl bg-secondary border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 transition"
                                />
                            </div>
                        ))}

                        <Button className="w-full gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
                            <Shield className="h-4 w-4" />
                            Update Password
                        </Button>

                        <div className="pt-2 border-t border-border/50">
                            <h4 className="text-sm font-semibold text-foreground mb-3">Account Security</h4>
                            {[
                                { label: "Two-Factor Authentication", desc: "Add an extra layer of security", enabled: true },
                                { label: "Login Alerts", desc: "Get notified of new sign-ins", enabled: true },
                                { label: "Session Management", desc: "Auto-logout after inactivity", enabled: false },
                            ].map((item) => (
                                <div key={item.label} className="flex items-center justify-between py-3 border-b border-border/30 last:border-0">
                                    <div>
                                        <p className="text-sm font-medium text-foreground">{item.label}</p>
                                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                                    </div>
                                    <div className={`h-6 w-11 rounded-full cursor-pointer transition-colors ${item.enabled ? "bg-accent" : "bg-border"}`}>
                                        <div className={`h-5 w-5 rounded-full bg-white shadow m-0.5 transition-transform ${item.enabled ? "translate-x-5" : ""}`} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {activeTab === "Notifications" && (
                    <motion.div
                        key="notifications"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card rounded-2xl p-6 space-y-1"
                    >
                        <h3 className="font-display font-semibold text-foreground mb-4">Notification Preferences</h3>
                        {[
                            { label: "Landlord Applications", desc: "When new landlord applications arrive", enabled: true },
                            { label: "Booking Requests", desc: "When bookings need confirmation", enabled: true },
                            { label: "Payment Alerts", desc: "When payments are received or overdue", enabled: true },
                            { label: "Lease Updates", desc: "When leases are created or expire", enabled: true },
                            { label: "New User Registrations", desc: "When new users sign up", enabled: false },
                            { label: "System Reports", desc: "Weekly system performance reports", enabled: false },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between py-3.5 border-b border-border/30 last:border-0">
                                <div className="flex items-start gap-3">
                                    <Bell className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium text-foreground">{item.label}</p>
                                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                                    </div>
                                </div>
                                <div className={`h-6 w-11 rounded-full cursor-pointer transition-colors shrink-0 ${item.enabled ? "bg-accent" : "bg-border"}`}>
                                    <div className={`h-5 w-5 rounded-full bg-white shadow m-0.5 transition-transform ${item.enabled ? "translate-x-5" : ""}`} />
                                </div>
                            </div>
                        ))}
                        <div className="pt-4">
                            <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 gap-2">
                                <Save className="h-4 w-4" />
                                Save Preferences
                            </Button>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
