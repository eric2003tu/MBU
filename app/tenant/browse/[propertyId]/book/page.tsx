"use client";

import { use, useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
    ArrowLeft, Calendar, Users, MapPin, Clock, CreditCard,
    CheckCircle2, BedDouble, DollarSign, ChevronDown, ShieldCheck,
    AlertCircle, Home, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import TenantHeader from "../../../components/TenantHeader";
import { propertyClient, type PropertyFull, type UnitWithDetails } from "@/lib/propertyClient";
import { bookingClient } from "@/lib/bookingClient";
import { getAuthToken } from "@/lib/auth";

/** Decode the JWT payload without a library */
function decodeTokenPayload(): { sub?: string; user_id?: string; exp?: number } | null {
    const token = getAuthToken();
    if (!token) return null;
    try {
        return JSON.parse(atob(token.split(".")[1]));
    } catch {
        return null;
    }
}

function getUserIdFromToken(): string | null {
    const payload = decodeTokenPayload();
    if (!payload) return null;
    // Check expiry — exp is in seconds
    if (payload.exp && payload.exp * 1000 < Date.now()) return null;
    return payload.sub ?? payload.user_id ?? null;
}

function isTokenExpired(): boolean {
    const payload = decodeTokenPayload();
    if (!payload?.exp) return true;
    return payload.exp * 1000 < Date.now();
}

const SERVICE_FEE_RATE = 0.08;

const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
};

function formatDate(d: string) {
    return new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function getTomorrow() {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
}

function getDefaultCheckout() {
    const d = new Date();
    d.setDate(d.getDate() + 4);
    return d.toISOString().split("T")[0];
}

export default function BookPage({ params }: { params: Promise<{ propertyId: string }> }) {
    const { propertyId } = use(params);
    const searchParams = useSearchParams();
    const preselectedUnit = searchParams.get("unit");

    /* ── Data fetching state ── */
    const [property, setProperty] = useState<PropertyFull | null>(null);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);

    /* ── Form state ── */
    const [selectedUnitId, setSelectedUnitId] = useState(preselectedUnit || "");
    const [checkIn, setCheckIn] = useState(getTomorrow());
    const [checkOut, setCheckOut] = useState(getDefaultCheckout());
    const [guests, setGuests] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState("credit_card");
    const [booked, setBooked] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);

    /* ── Fetch property + user on mount ── */
    useEffect(() => {
        setLoading(true);
        setFetchError(null);

        // Decode user_id from JWT synchronously — no extra API call needed
        const uid = getUserIdFromToken();
        if (uid) setUserId(uid);

        propertyClient.getById(propertyId)
            .then((prop) => setProperty(prop))
            .catch((err: Error) => setFetchError(err.message ?? "Failed to load property"))
            .finally(() => setLoading(false));
    }, [propertyId]);

    /* ── All hooks MUST be called before any conditional returns ── */
    const nights = useMemo(() => {
        if (!checkIn || !checkOut) return 0;
        const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
        return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24)));
    }, [checkIn, checkOut]);

    /* ── Derived data (safe — no hooks below this point) ── */
    const activeUnits = (property?.units ?? []).filter((u) => u.is_active);
    const selectedUnit: UnitWithDetails | undefined =
        activeUnits.find((u) => u.unit_id === selectedUnitId) || activeUnits[0];

    const dailyPlan = selectedUnit?.pricingPlans.find((p) => p.rental_type === "DAILY");
    const pricePerNight = dailyPlan ? Number(dailyPlan.price) : (selectedUnit?.pricingPlans[0] ? Number(selectedUnit.pricingPlans[0].price) : 0);
    const minStay = dailyPlan?.minimum_stay ?? 1;

    const subtotal = pricePerNight * nights;
    const serviceFee = Math.round(subtotal * SERVICE_FEE_RATE);
    const total = subtotal + serviceFee;

    const heroImage = property && (property.images ?? []).length > 0
        ? property.images![0].url
        : "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80";

    /* ── Loading state ── */
    if (loading) {
        return (
            <div>
                <TenantHeader title="Book a Stay" />
                <div className="p-6 mx-auto flex flex-col items-center justify-center min-h-[60vh] gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-accent" />
                    <p className="text-muted-foreground text-sm">Loading booking details…</p>
                </div>
            </div>
        );
    }

    /* ── Error / Not found ── */
    if (fetchError || !property) {
        return (
            <div>
                <TenantHeader title="Property Not Found" />
                <div className="p-6 mx-auto text-center py-20">
                    <div className="inline-flex h-20 w-20 rounded-full bg-muted items-center justify-center mb-6">
                        <Home className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h2 className="font-display text-2xl font-bold text-foreground mb-3">Property Not Found</h2>
                    <p className="text-muted-foreground mb-6">
                        {fetchError ?? "The property you\u0027re looking for doesn\u0027t exist or has been removed."}
                    </p>
                    <Link href="/tenant/browse">
                        <Button variant="outline">
                            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Browse
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }



    const validate = () => {
        const errs: string[] = [];
        if (!selectedUnit) errs.push("Please select a rental unit.");
        if (!checkIn || !checkOut) errs.push("Please select check-in and check-out dates.");
        if (nights <= 0) errs.push("Check-out must be after check-in.");
        if (nights < minStay) errs.push(`Minimum stay is ${minStay} night${minStay > 1 ? "s" : ""}.`);
        if (selectedUnit && guests > selectedUnit.max_guests) errs.push(`Maximum ${selectedUnit.max_guests} guests allowed.`);
        if (guests < 1) errs.push("At least 1 guest required.");
        if (!userId) {
            errs.push(
                isTokenExpired()
                    ? "Your session has expired. Please log in again to create a booking."
                    : "You must be logged in to create a booking."
            );
        }
        setErrors(errs);
        return errs.length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate() || !selectedUnit || !userId) return;

        setSubmitting(true);
        setErrors([]);

        try {
            await bookingClient.create({
                check_in: new Date(`${checkIn}T14:00:00`).toISOString(),
                check_out: new Date(`${checkOut}T10:00:00`).toISOString(),
                total_price: total,
                status: "PENDING",
                unit_id: selectedUnit.unit_id,
                user_id: userId,
            });
            setBooked(true);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Booking failed. Please try again.";
            setErrors([message]);
        } finally {
            setSubmitting(false);
        }
    };

    /* ── Success state ── */
    if (booked) {
        return (
            <div>
                <TenantHeader title="Booking Confirmed" subtitle="Your reservation has been submitted" />
                <div className="p-6 mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="glass-card rounded-2xl p-8 text-center space-y-5"
                    >
                        <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                            <CheckCircle2 className="h-10 w-10 text-green-500" />
                        </div>
                        <div>
                            <h2 className="font-display text-2xl font-bold text-foreground">Booking Submitted!</h2>
                            <p className="text-muted-foreground mt-1">Your booking request is now pending confirmation.</p>
                        </div>

                        <div className="bg-secondary rounded-xl p-5 text-left space-y-3">
                            <div className="flex items-center gap-3">
                                <img src={heroImage} alt={property.title} className="h-14 w-20 rounded-lg object-cover" />
                                <div>
                                    <p className="font-semibold text-foreground text-sm">{property.title}</p>
                                    <p className="text-xs text-muted-foreground">{selectedUnit?.unit_name}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <span className="text-xs text-muted-foreground">Check-in</span>
                                    <p className="font-medium text-foreground">{formatDate(checkIn)}</p>
                                </div>
                                <div>
                                    <span className="text-xs text-muted-foreground">Check-out</span>
                                    <p className="font-medium text-foreground">{formatDate(checkOut)}</p>
                                </div>
                                <div>
                                    <span className="text-xs text-muted-foreground">Duration</span>
                                    <p className="font-medium text-foreground">{nights} night{nights !== 1 ? "s" : ""}</p>
                                </div>
                                <div>
                                    <span className="text-xs text-muted-foreground">Guests</span>
                                    <p className="font-medium text-foreground">{guests}</p>
                                </div>
                            </div>
                            <div className="border-t border-border/50 pt-3 flex justify-between font-bold text-foreground">
                                <span>Total</span>
                                <span className="font-display">${total.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-left">
                            <Clock className="h-5 w-5 text-amber-600 shrink-0" />
                            <p className="text-xs text-amber-700">Your booking is <strong>PENDING</strong>. The landlord will confirm your reservation shortly.</p>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <Link href="/tenant/bookings" className="flex-1">
                                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                                    View My Bookings
                                </Button>
                            </Link>
                            <Link href={`/tenant/browse/${property.property_id}`} className="flex-1">
                                <Button variant="outline" className="w-full">
                                    Back to Property
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <TenantHeader title="Book a Stay" subtitle={property.title} />

            <div className="p-6 mx-auto space-y-6">
                {/* Back link */}
                <Link href={`/tenant/browse/${property.property_id}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors w-fit group">
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
                    Back to Property
                </Link>

                {/* Property summary header */}
                <motion.div variants={fadeUp} initial="hidden" animate="show" className="glass-card rounded-2xl overflow-hidden">
                    <div className="flex gap-0">
                        <div className="w-32 sm:w-48 shrink-0 relative overflow-hidden">
                            <img src={heroImage} alt={property.title} className="h-full w-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10" />
                        </div>
                        <div className="p-5 flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent text-accent-foreground uppercase tracking-wide">
                                        {property.property_type}
                                    </span>
                                    <h2 className="font-display text-lg font-bold text-foreground mt-1.5 truncate">{property.title}</h2>
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
                                        <MapPin className="h-3.5 w-3.5 text-accent" />
                                        {property.address}, {property.city}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Two-column form */}
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* LEFT: Booking form */}
                        <div className="lg:col-span-2 space-y-5">
                            {/* Errors */}
                            {errors.length > 0 && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-1">
                                    {errors.map((err, i) => (
                                        <div key={i} className="flex items-center gap-2 text-sm text-red-700">
                                            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                                            {err}
                                        </div>
                                    ))}
                                </motion.div>
                            )}

                            {/* Unit Selection */}
                            <motion.div variants={fadeUp} initial="hidden" animate="show" className="glass-card rounded-2xl p-5 space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
                                        <BedDouble className="h-5 w-5 text-accent" />
                                    </div>
                                    <div>
                                        <h3 className="font-display font-semibold text-foreground">Select Unit</h3>
                                        <p className="text-xs text-muted-foreground">Choose a rental unit for your stay</p>
                                    </div>
                                </div>

                                {activeUnits.length === 0 ? (
                                    <p className="text-sm text-muted-foreground bg-secondary rounded-xl p-4">No active units available for booking.</p>
                                ) : (
                                    <div className="space-y-2">
                                        {activeUnits.map((unit) => {
                                            const unitDailyPlan = unit.pricingPlans.find((p) => p.rental_type === "DAILY");
                                            return (
                                                <label
                                                    key={unit.unit_id}
                                                    className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${(selectedUnitId || activeUnits[0].unit_id) === unit.unit_id
                                                        ? "border-accent bg-accent/5 shadow-sm"
                                                        : "border-border/50 bg-secondary hover:border-accent/30"
                                                        }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="unit"
                                                        value={unit.unit_id}
                                                        checked={(selectedUnitId || activeUnits[0].unit_id) === unit.unit_id}
                                                        onChange={() => setSelectedUnitId(unit.unit_id)}
                                                        className="accent-[hsl(35,85%,55%)] h-4 w-4"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-semibold text-foreground">{unit.unit_name}</p>
                                                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                                            <span className="flex items-center gap-1"><Users className="h-3 w-3" /> Up to {unit.max_guests} guests</span>
                                                            {unitDailyPlan && (
                                                                <span className="flex items-center gap-1">
                                                                    <DollarSign className="h-3 w-3" />
                                                                    ${Number(unitDailyPlan.price).toLocaleString()}/night
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </label>
                                            );
                                        })}
                                    </div>
                                )}
                            </motion.div>

                            {/* Dates & Guests */}
                            <motion.div variants={fadeUp} initial="hidden" animate="show" className="glass-card rounded-2xl p-5 space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                        <Calendar className="h-5 w-5 text-blue-500" />
                                    </div>
                                    <div>
                                        <h3 className="font-display font-semibold text-foreground">Dates & Guests</h3>
                                        <p className="text-xs text-muted-foreground">When would you like to stay?</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Check-in</label>
                                        <input
                                            type="date"
                                            value={checkIn}
                                            onChange={(e) => setCheckIn(e.target.value)}
                                            min={new Date().toISOString().split("T")[0]}
                                            className="w-full h-11 px-4 rounded-xl bg-secondary border border-border/50 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 transition"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Check-out</label>
                                        <input
                                            type="date"
                                            value={checkOut}
                                            onChange={(e) => setCheckOut(e.target.value)}
                                            min={checkIn}
                                            className="w-full h-11 px-4 rounded-xl bg-secondary border border-border/50 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 transition"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Guests</label>
                                        <div className="relative">
                                            <select
                                                value={guests}
                                                onChange={(e) => setGuests(Number(e.target.value))}
                                                className="w-full h-11 px-4 rounded-xl bg-secondary border border-border/50 text-sm text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-accent/40 transition"
                                            >
                                                {Array.from({ length: selectedUnit?.max_guests ?? 1 }, (_, i) => (
                                                    <option key={i + 1} value={i + 1}>{i + 1} Guest{i > 0 ? "s" : ""}</option>
                                                ))}
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                                        </div>
                                    </div>
                                </div>

                                {nights > 0 && (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary rounded-xl px-4 py-3">
                                        <Clock className="h-4 w-4 text-accent" />
                                        <span>
                                            {nights} night{nights !== 1 ? "s" : ""} · {formatDate(checkIn)} → {formatDate(checkOut)}
                                        </span>
                                        {nights < minStay && (
                                            <span className="ml-auto text-xs text-red-600 font-medium">Min. {minStay} nights</span>
                                        )}
                                    </div>
                                )}
                            </motion.div>

                            {/* Payment Method */}
                            <motion.div variants={fadeUp} initial="hidden" animate="show" className="glass-card rounded-2xl p-5 space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                                        <CreditCard className="h-5 w-5 text-green-500" />
                                    </div>
                                    <div>
                                        <h3 className="font-display font-semibold text-foreground">Payment Method</h3>
                                        <p className="text-xs text-muted-foreground">How would you like to pay?</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {[
                                        { value: "credit_card", label: "Credit Card", icon: "💳" },
                                        { value: "bank_transfer", label: "Bank Transfer", icon: "🏦" },
                                        { value: "mobile_money", label: "Mobile Money", icon: "📱" },
                                    ].map((method) => (
                                        <label
                                            key={method.value}
                                            className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === method.value
                                                ? "border-accent bg-accent/5 shadow-sm"
                                                : "border-border/50 bg-secondary hover:border-accent/30"
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="payment"
                                                value={method.value}
                                                checked={paymentMethod === method.value}
                                                onChange={() => setPaymentMethod(method.value)}
                                                className="accent-[hsl(35,85%,55%)] h-4 w-4"
                                            />
                                            <span className="text-lg">{method.icon}</span>
                                            <span className="text-sm font-medium text-foreground">{method.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        {/* RIGHT: Pricing sidebar */}
                        <div className="lg:col-span-1">
                            <motion.div
                                initial={{ opacity: 0, x: 24 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="sticky top-20 space-y-4"
                            >
                                {/* Price summary card */}
                                <div className="glass-card rounded-2xl p-5 space-y-4">
                                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Pricing Summary</p>

                                    {selectedUnit && (
                                        <div className="bg-secondary rounded-xl p-3 flex items-center gap-3">
                                            <BedDouble className="h-4 w-4 text-accent shrink-0" />
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-foreground truncate">{selectedUnit.unit_name}</p>
                                                <p className="text-xs text-muted-foreground">{property.title}</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-2.5 text-sm">
                                        <div className="flex justify-between text-muted-foreground">
                                            <span>${pricePerNight.toLocaleString()} × {nights} night{nights !== 1 ? "s" : ""}</span>
                                            <span>${subtotal.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-muted-foreground">
                                            <span>Service fee (8%)</span>
                                            <span>${serviceFee.toLocaleString()}</span>
                                        </div>
                                        <div className="border-t border-border/50 pt-2.5 flex justify-between font-bold text-foreground text-base">
                                            <span>Total</span>
                                            <span className="font-display">${total.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={activeUnits.length === 0 || submitting}
                                        className="w-full bg-accent text-accent-foreground hover:bg-accent/90 h-12 font-semibold text-sm rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {submitting ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Submitting…
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                                Confirm Booking
                                            </>
                                        )}
                                    </Button>
                                </div>

                                {/* Trust badge */}
                                <div className="rounded-xl border border-border bg-secondary/40 px-4 py-3 flex items-center gap-3">
                                    <ShieldCheck className="h-5 w-5 text-accent shrink-0" />
                                    <p className="text-xs text-muted-foreground">Your booking is protected. Free cancellation up to 48 hours before check-in.</p>
                                </div>

                                {/* Policies */}
                                <div className="glass-card rounded-2xl p-5 space-y-3">
                                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Booking Policies</p>
                                    {[
                                        { icon: Clock, text: "Check-in from 2:00 PM, check-out by 11:00 AM" },
                                        { icon: AlertCircle, text: "Free cancellation up to 48 hours before check-in" },
                                        { icon: ShieldCheck, text: "Security deposit may be required at check-in" },
                                        { icon: Users, text: `Maximum ${selectedUnit?.max_guests ?? "–"} guests per unit` },
                                    ].map((policy, i) => (
                                        <div key={i} className="flex items-start gap-2.5 text-xs text-muted-foreground">
                                            <policy.icon className="h-3.5 w-3.5 text-accent shrink-0 mt-0.5" />
                                            <span>{policy.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
