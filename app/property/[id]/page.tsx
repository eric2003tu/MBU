"use client";

import { use, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ArrowLeft, MapPin, Users, Star, Calendar, Building2,
    Home, ChevronLeft, ChevronRight, X, Eye, Heart, Share2,
    Mail, Tag, Clock, CheckCircle2, DollarSign,
    BedDouble, ShieldCheck, Loader2, AlertCircle, LogIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { propertyClient, type PropertyFull } from "@/lib/propertyClient";

interface Props {
    params: Promise<{ id: string }>;
}

const rentalTypeLabel: Record<string, string> = {
    DAILY: "/ night",
    MONTHLY: "/ month",
    YEARLY: "/ year",
};

const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
};

function isLoggedIn(): boolean {
    if (typeof document === "undefined") return false;
    return /(?:^|;\s*)auth_token=/.test(document.cookie);
}

export default function PropertyDetailPage({ params }: Props) {
    const { id } = use(params);
    const router = useRouter();

    const [property, setProperty] = useState<PropertyFull | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [loggedIn, setLoggedIn] = useState(false);

    const [activeImage, setActiveImage] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [saved, setSaved] = useState(false);
    const [shared, setShared] = useState(false);

    const handleBook = useCallback((unitId: string) => {
        if (!isLoggedIn()) { router.push(`/login?next=/property/${id}`); return; }
        router.push(`/tenant/browse/${id}/book?unit=${unitId}`);
    }, [id, router]);

    const handleLease = useCallback((unitId: string) => {
        if (!isLoggedIn()) { router.push(`/login?next=/property/${id}`); return; }
        router.push(`/tenant/leases?unit=${unitId}`);
    }, [id, router]);

    const handleShare = async () => {
        await navigator.clipboard?.writeText(window.location.href);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
    };

    useEffect(() => {
        setLoggedIn(isLoggedIn());
        setLoading(true);
        setError(null);
        propertyClient.getById(id)
            .then((data) => setProperty(data))
            .catch((err: Error) => setError(err.message ?? "Failed to load property"))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="pt-32 flex flex-col items-center justify-center min-h-[60vh] gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-accent" />
                    <p className="text-muted-foreground text-sm">Loading property details…</p>
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !property) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="pt-32 container mx-auto px-4 text-center">
                    <div className="inline-flex h-20 w-20 rounded-full bg-red-50 dark:bg-red-950/20 items-center justify-center mb-6">
                        <AlertCircle className="h-8 w-8 text-red-500" />
                    </div>
                    <h1 className="font-display text-3xl font-bold text-foreground mb-3">Property Not Found</h1>
                    <p className="text-muted-foreground mb-8">{error ?? "The listing you're looking for has been removed or doesn't exist."}</p>
                    <Link href="/properties">
                        <Button className="bg-accent text-accent-foreground hover:bg-accent/90">Browse All Properties</Button>
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    const allImages = (property.images ?? []).length > 0
        ? (property.images ?? []).map((img) => img.url)
        : ["https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80"];

    const allPlans = (property.units ?? []).flatMap((u) => u.pricingPlans);
    const cheapestPlan = allPlans.length > 0
        ? allPlans.reduce((min, p) => Number(p.price) < Number(min.price) ? p : min, allPlans[0])
        : null;

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            {/* ── Full-screen Lightbox ── */}
            <AnimatePresence>
                {lightboxOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 flex flex-col"
                    >
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                            <span className="text-white/60 text-sm">{activeImage + 1} / {allImages.length}</span>
                            <p className="text-white font-medium text-sm truncate max-w-sm">{property.title}</p>
                            <button onClick={() => setLightboxOpen(false)} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                                <X className="h-5 w-5 text-white" />
                            </button>
                        </div>
                        <div className="flex-1 flex items-center justify-center relative px-16">
                            <button
                                onClick={() => setActiveImage((p) => (p - 1 + allImages.length) % allImages.length)}
                                className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                            >
                                <ChevronLeft className="h-6 w-6 text-white" />
                            </button>
                            <motion.img
                                key={activeImage}
                                initial={{ opacity: 0, scale: 0.97 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.2 }}
                                src={allImages[activeImage]}
                                alt={property.title}
                                className="max-h-[75vh] max-w-full object-contain rounded-lg"
                            />
                            <button
                                onClick={() => setActiveImage((p) => (p + 1) % allImages.length)}
                                className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                            >
                                <ChevronRight className="h-6 w-6 text-white" />
                            </button>
                        </div>
                        <div className="flex gap-2 justify-center px-6 py-4 border-t border-white/10 overflow-x-auto">
                            {allImages.map((img, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveImage(i)}
                                    className={`h-14 w-20 shrink-0 rounded-md overflow-hidden transition-all ${i === activeImage ? "ring-2 ring-accent" : "opacity-50 hover:opacity-80"}`}
                                >
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Page body ── */}
            <div className="pt-16 pb-16">

                {/* ── Hero Image — full viewport width ── */}
                <motion.div variants={fadeUp} initial="hidden" animate="show">
                    <div
                        className="relative h-[52vh] overflow-hidden cursor-pointer group"
                        onClick={() => setLightboxOpen(true)}
                    >
                        <img
                            src={allImages[activeImage]}
                            alt={property.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                        {/* Badges */}
                        <div className="absolute top-4 left-4 flex gap-2">
                            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-accent text-accent-foreground uppercase tracking-wide shadow-lg">
                                {property.property_type}
                            </span>
                            {property.landlord?.status === "APPROVED" && (
                                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-green-500 text-white shadow-lg flex items-center gap-1">
                                    <ShieldCheck className="h-3 w-3" /> Verified
                                </span>
                            )}
                        </div>

                        {/* View photos button */}
                        <button
                            className="absolute bottom-4 right-4 text-xs font-semibold text-white bg-black/40 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full hover:bg-black/60 transition-all flex items-center gap-2"
                            onClick={(e) => { e.stopPropagation(); setLightboxOpen(true); }}
                        >
                            <Eye className="h-3.5 w-3.5" />
                            View all {allImages.length} photos
                        </button>
                    </div>

                    {/* Thumbnail strip — full width */}
                    <div className="flex gap-1 p-2 overflow-x-auto border-b border-border bg-background">
                        {allImages.map((img, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveImage(i)}
                                className={`h-16 w-24 shrink-0 rounded-lg overflow-hidden transition-all ${i === activeImage ? "ring-2 ring-accent" : "opacity-60 hover:opacity-100"}`}
                            >
                                <img src={img} alt="" className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* ── Constrained content ── */}
                <div className="p-6 max-w-7xl mx-auto space-y-6 mt-4">

                    {/* Back link */}
                    <Link href="/properties" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors w-fit group">
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
                        Back to Properties
                    </Link>

                    {/* ── Title + Quick Stats ── */}
                    <motion.div variants={fadeUp} initial="hidden" animate="show" className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                            <div>
                                <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground leading-tight">
                                    {property.title}
                                </h1>
                                <div className="flex items-center gap-1.5 mt-1.5 text-muted-foreground">
                                    <MapPin className="h-4 w-4 text-accent" />
                                    <span className="text-sm">{property.address}, {property.city}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <button
                                    onClick={() => setSaved((s) => !s)}
                                    className={`flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl border transition-all ${saved
                                        ? "bg-red-50 border-red-200 text-red-500 dark:bg-red-950/30"
                                        : "border-border text-muted-foreground hover:border-accent hover:text-accent"
                                        }`}
                                >
                                    <Heart className={`h-3.5 w-3.5 ${saved ? "fill-red-500 text-red-500" : ""}`} />
                                    {saved ? "Saved" : "Save"}
                                </button>
                                <button
                                    onClick={handleShare}
                                    className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl border border-border text-muted-foreground hover:border-accent hover:text-accent transition-all"
                                >
                                    <Share2 className="h-3.5 w-3.5" />
                                    {shared ? "Copied!" : "Share"}
                                </button>
                            </div>
                        </div>

                        {/* Quick stat chips */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {[
                                { icon: Building2, label: "Type", value: property.property_type.charAt(0) + property.property_type.slice(1).toLowerCase() },
                                { icon: MapPin, label: "City", value: property.city },
                                { icon: Users, label: "Total Units", value: String(property.units?.length ?? 0) },
                                cheapestPlan
                                    ? { icon: Tag, label: "Starting at", value: `$${Number(cheapestPlan.price).toLocaleString()} ${rentalTypeLabel[cheapestPlan.rental_type] ?? ""}` }
                                    : { icon: Tag, label: "Pricing", value: "Contact owner" },
                            ].map(({ icon: Icon, label, value }) => (
                                <div key={label} className="glass-card rounded-xl p-4 flex items-center gap-3 hover:border-accent/30 transition-colors">
                                    <div className="h-9 w-9 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                                        <Icon className="h-4 w-4 text-accent" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[11px] text-muted-foreground">{label}</p>
                                        <p className="text-sm font-semibold text-foreground truncate">{value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* ── Login notice banner ── */}
                    {!loggedIn && (
                        <motion.div
                            variants={fadeUp} initial="hidden" animate="show"
                            className="rounded-2xl border border-accent/30 bg-accent/5 px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4"
                        >
                            <div className="h-10 w-10 rounded-xl bg-accent/15 flex items-center justify-center shrink-0">
                                <LogIn className="h-5 w-5 text-accent" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-foreground">Sign in to book a unit</p>
                                <p className="text-xs text-muted-foreground mt-0.5">You need a free account to make bookings or sign a lease. Clicking any booking button will take you to the login page.</p>
                            </div>
                            <Link href={`/login?next=/property/${property.property_id}`}>
                                <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 shrink-0">
                                    <LogIn className="h-4 w-4 mr-1.5" /> Log in
                                </Button>
                            </Link>
                        </motion.div>
                    )}

                    {/* ── Two-column layout ── */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* LEFT */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Description */}
                            <motion.div variants={fadeUp} initial="hidden" animate="show" className="glass-card rounded-2xl p-6">
                                <h2 className="font-display text-lg font-semibold text-foreground mb-3">About this Property</h2>
                                <p className="text-muted-foreground leading-relaxed text-[15px]">
                                    {property.description ?? "No description available for this property."}
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
                                    {[
                                        { label: "Property Type", value: property.property_type },
                                        { label: "City", value: property.city },
                                        { label: "Address", value: property.address },
                                        { label: "Listed on", value: new Date(property.created_at ?? Date.now()).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) },
                                    ].map(({ label, value }) => (
                                        <div key={label} className="bg-secondary rounded-xl p-4 border border-border/50">
                                            <div className="text-xs font-medium text-muted-foreground mb-1">{label}</div>
                                            <div className="text-sm font-bold text-foreground">{value}</div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Rental Units */}
                            <motion.div variants={fadeUp} initial="hidden" animate="show" className="space-y-4">
                                <h2 className="font-display text-lg font-semibold text-foreground">
                                    Rental Units
                                    <span className="text-sm font-normal text-muted-foreground ml-2">({property.units?.length ?? 0} total)</span>
                                </h2>

                                {(property.units ?? []).map((unit) => (
                                    <div key={unit.unit_id} className="glass-card rounded-2xl overflow-hidden">
                                        <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
                                                    <BedDouble className="h-5 w-5 text-accent" />
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-semibold text-foreground">{unit.unit_name}</h3>
                                                    <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                                        <Users className="h-3 w-3" /> Up to {unit.max_guests} guests
                                                    </span>
                                                </div>
                                            </div>
                                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${unit.is_active
                                                ? "bg-green-50 text-green-700 border border-green-200"
                                                : "bg-red-50 text-red-600 border border-red-200"
                                                }`}>
                                                {unit.is_active ? "Active" : "Inactive"}
                                            </span>
                                        </div>

                                        <div className="p-5 space-y-3">
                                            {unit.pricingPlans.length > 0 ? (
                                                <>
                                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Pricing Plans</p>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                                        {unit.pricingPlans.map((plan) => (
                                                            <div key={plan.pricing_id} className="bg-secondary rounded-xl p-4 border border-border/50 hover:border-accent/30 transition-colors">
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <DollarSign className="h-3.5 w-3.5 text-accent" />
                                                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{plan.rental_type}</span>
                                                                </div>
                                                                <p className="text-xl font-bold text-foreground font-display">
                                                                    ${Number(plan.price).toLocaleString()}
                                                                    <span className="text-xs font-normal text-muted-foreground ml-1">{rentalTypeLabel[plan.rental_type] ?? ""}</span>
                                                                </p>
                                                                <div className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground">
                                                                    <Clock className="h-3 w-3" />
                                                                    Min. stay: {plan.minimum_stay}{" "}
                                                                    {plan.rental_type === "DAILY" ? (plan.minimum_stay === 1 ? "night" : "nights")
                                                                        : plan.rental_type === "MONTHLY" ? (plan.minimum_stay === 1 ? "month" : "months")
                                                                            : (plan.minimum_stay === 1 ? "year" : "years")}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </>
                                            ) : (
                                                <p className="text-sm text-muted-foreground italic">No pricing plans set for this unit.</p>
                                            )}

                                            {unit.is_active && (
                                                <div className="flex gap-2 pt-2">
                                                    <Button
                                                        size="sm"
                                                        className="flex-1 text-xs bg-accent text-accent-foreground hover:bg-accent/90"
                                                        onClick={() => handleBook(unit.unit_id)}
                                                    >
                                                        {loggedIn
                                                            ? <><Calendar className="h-3.5 w-3.5 mr-1.5" /> Book Short-Term</>
                                                            : <><LogIn className="h-3.5 w-3.5 mr-1.5" /> Log in to Book</>
                                                        }
                                                    </Button>
                                                    {unit.pricingPlans.some((p) => p.rental_type === "MONTHLY" || p.rental_type === "YEARLY") && (
                                                        <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => handleLease(unit.unit_id)}>
                                                            {loggedIn
                                                                ? <><CheckCircle2 className="h-3.5 w-3.5 mr-1.5" /> Sign Lease</>
                                                                : <><LogIn className="h-3.5 w-3.5 mr-1.5" /> Log in to Lease</>
                                                            }
                                                        </Button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {(!property.units || property.units.length === 0) && (
                                    <div className="glass-card rounded-2xl p-8 text-center">
                                        <Home className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                                        <p className="text-muted-foreground text-sm">No rental units available for this property.</p>
                                    </div>
                                )}
                            </motion.div>
                        </div>

                        {/* RIGHT: Sidebar */}
                        <div className="lg:col-span-1 space-y-4">
                            <motion.div
                                initial={{ opacity: 0, x: 24 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="glass-card rounded-2xl p-5 space-y-4 sticky top-20"
                            >
                                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Listed by</p>
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-accent/40 to-accent/10 border border-accent/20 flex items-center justify-center shrink-0 overflow-hidden">
                                        {property.landlord?.profile_photo_url && property.landlord.profile_photo_url !== "https://example.com/photo.jpg" ? (
                                            <img src={property.landlord.profile_photo_url} alt="Landlord" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="font-display font-bold text-accent text-base">LL</span>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-foreground text-sm">Property Owner</p>
                                        <div className="flex items-center gap-0.5 mt-0.5">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <Star key={s} className="h-3 w-3 text-accent fill-accent" />
                                            ))}
                                            <span className="text-xs text-muted-foreground ml-1">
                                                {property.landlord?.status === "APPROVED" ? "Verified Owner" : "Owner"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {property.landlord?.physical_address && (
                                    <div className="flex items-center gap-3 bg-muted hover:bg-accent/10 rounded-xl px-4 py-3 transition-colors">
                                        <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                                            <MapPin className="h-4 w-4 text-accent" />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-[11px] text-muted-foreground">Address</div>
                                            <div className="text-sm font-medium text-foreground truncate">{property.landlord.physical_address}</div>
                                        </div>
                                    </div>
                                )}

                                <Button
                                    variant="outline"
                                    className="w-full text-sm"
                                    onClick={() => { if (!isLoggedIn()) router.push(`/login?next=/property/${property.property_id}`); }}
                                >
                                    <Mail className="h-4 w-4 mr-2" />
                                    Message Landlord
                                </Button>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 24 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="glass-card rounded-2xl overflow-hidden"
                            >
                                <div className="relative h-40 flex items-center justify-center">
                                    <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-primary/5" />
                                    <div className="text-center relative z-10">
                                        <div className="h-12 w-12 rounded-full bg-accent/15 flex items-center justify-center mx-auto mb-2">
                                            <MapPin className="h-6 w-6 text-accent" />
                                        </div>
                                        <p className="font-semibold text-foreground text-sm">{property.address}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">{property.city}</p>
                                    </div>
                                </div>
                            </motion.div>

                            <div className="rounded-xl border border-border bg-secondary/40 px-4 py-3 flex items-center gap-3">
                                <ShieldCheck className="h-5 w-5 text-accent shrink-0" />
                                <p className="text-xs text-muted-foreground">This listing has been verified by PropertyHub. Your inquiry is safe and secure.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
