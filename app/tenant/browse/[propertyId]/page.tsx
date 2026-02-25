"use client";

import { use, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
    ArrowLeft, MapPin, Users, Star, Calendar, Building2,
    Home, ChevronLeft, ChevronRight, X, Eye, Heart, Share2,
    Phone, Mail, Tag, Clock, CheckCircle2, DollarSign,
    BedDouble, ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import TenantHeader from "../../components/TenantHeader";

/* ───── Extended mock data ───── */
const propertiesData: Record<string, {
    id: string; title: string; type: string; city: string; address: string;
    price: number; rentalType: string; maxGuests: number; rating: number; reviews: number;
    available: boolean; description: string;
    images: string[];
    landlord: { name: string; phone: string; email: string };
    units: {
        id: string; name: string; maxGuests: number; isActive: boolean;
        pricingPlans: { rentalType: string; price: number; minimumStay: number }[];
    }[];
}> = {
    "p-1": {
        id: "p-1", title: "Luxury Penthouse Suite", type: "APARTMENT",
        city: "New York", address: "500 Park Ave", price: 3500, rentalType: "MONTHLY",
        maxGuests: 4, rating: 4.9, reviews: 42, available: true,
        description: "Experience luxury living at its finest in this breathtaking penthouse suite perched atop Park Avenue. Floor-to-ceiling windows frame panoramic skyline views, while premium finishes and a chef-grade kitchen create an atmosphere of sophisticated elegance. Enjoy a private terrace, concierge services, and world-class amenities steps from Central Park.",
        images: [
            "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80",
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
            "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
            "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
        ],
        landlord: { name: "Sarah Mitchell", phone: "+1 (555) 234-5678", email: "sarah@parkaveluxury.com" },
        units: [
            {
                id: "u-1a", name: "Penthouse A – Full Suite", maxGuests: 4, isActive: true,
                pricingPlans: [
                    { rentalType: "DAILY", price: 220, minimumStay: 2 },
                    { rentalType: "MONTHLY", price: 3500, minimumStay: 1 },
                    { rentalType: "YEARLY", price: 38000, minimumStay: 1 },
                ],
            },
            {
                id: "u-1b", name: "Penthouse B – Studio Wing", maxGuests: 2, isActive: true,
                pricingPlans: [
                    { rentalType: "DAILY", price: 150, minimumStay: 1 },
                    { rentalType: "MONTHLY", price: 2400, minimumStay: 1 },
                ],
            },
        ],
    },
    "p-2": {
        id: "p-2", title: "Cozy Downtown Studio", type: "STUDIO",
        city: "Chicago", address: "222 Wacker Dr", price: 95, rentalType: "DAILY",
        maxGuests: 2, rating: 4.7, reviews: 28, available: true,
        description: "A stylish, compact studio nestled in the heart of downtown Chicago. Modern furnishings, a fully equipped kitchenette, and high-speed Wi-Fi make it ideal for business travelers and urban explorers alike. Walk to Magnificent Mile, Millennium Park, and top restaurants.",
        images: [
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
            "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
            "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
        ],
        landlord: { name: "James Taylor", phone: "+1 (555) 876-5432", email: "james@chicagostudios.com" },
        units: [
            {
                id: "u-2a", name: "Studio Unit", maxGuests: 2, isActive: true,
                pricingPlans: [
                    { rentalType: "DAILY", price: 95, minimumStay: 1 },
                    { rentalType: "MONTHLY", price: 1800, minimumStay: 1 },
                ],
            },
        ],
    },
    "p-3": {
        id: "p-3", title: "Modern Family Villa", type: "VILLA",
        city: "Miami", address: "88 Ocean Dr", price: 5200, rentalType: "MONTHLY",
        maxGuests: 8, rating: 4.8, reviews: 19, available: true,
        description: "A stunning waterfront villa on Ocean Drive with direct beach access, a private infinity pool, and lush tropical gardens. Five spacious bedrooms, a gourmet kitchen, and a rooftop terrace make this the ultimate family retreat. Enjoy Miami's vibrant nightlife and dining scene just minutes away.",
        images: [
            "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
            "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80",
            "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80",
            "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
        ],
        landlord: { name: "Maria Gonzalez", phone: "+1 (555) 321-9876", email: "maria@miamiproperties.com" },
        units: [
            {
                id: "u-3a", name: "Full Villa", maxGuests: 8, isActive: true,
                pricingPlans: [
                    { rentalType: "DAILY", price: 350, minimumStay: 3 },
                    { rentalType: "MONTHLY", price: 5200, minimumStay: 1 },
                    { rentalType: "YEARLY", price: 55000, minimumStay: 1 },
                ],
            },
            {
                id: "u-3b", name: "Guest Suite", maxGuests: 2, isActive: true,
                pricingPlans: [
                    { rentalType: "DAILY", price: 120, minimumStay: 1 },
                    { rentalType: "MONTHLY", price: 1900, minimumStay: 1 },
                ],
            },
            {
                id: "u-3c", name: "Pool House", maxGuests: 3, isActive: false,
                pricingPlans: [
                    { rentalType: "DAILY", price: 180, minimumStay: 2 },
                ],
            },
        ],
    },
    "p-4": {
        id: "p-4", title: "Suburban Family Home", type: "HOUSE",
        city: "Austin", address: "301 Cedar Ln", price: 2100, rentalType: "MONTHLY",
        maxGuests: 6, rating: 4.5, reviews: 33, available: false,
        description: "A charming family home in a peaceful Austin suburb. Spacious living areas, a beautiful backyard with mature trees, and excellent school districts make this the perfect place to call home. Three bedrooms, two bathrooms, a two-car garage, and a modern open-plan kitchen await you.",
        images: [
            "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80",
            "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
        ],
        landlord: { name: "Tom Bradley", phone: "+1 (555) 654-3210", email: "tom@austinhomes.com" },
        units: [
            {
                id: "u-4a", name: "Full House", maxGuests: 6, isActive: false,
                pricingPlans: [
                    { rentalType: "MONTHLY", price: 2100, minimumStay: 6 },
                    { rentalType: "YEARLY", price: 22000, minimumStay: 1 },
                ],
            },
        ],
    },
    "p-5": {
        id: "p-5", title: "Executive Suite Room", type: "ROOM",
        city: "Los Angeles", address: "1 Sunset Blvd", price: 65, rentalType: "DAILY",
        maxGuests: 1, rating: 4.6, reviews: 15, available: true,
        description: "A beautifully appointed executive room on iconic Sunset Boulevard. King-size bed, marble en-suite, and a private work station with panoramic city views. Access to building amenities including a rooftop pool, fitness center, and on-site dining.",
        images: [
            "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
        ],
        landlord: { name: "Lisa Chen", phone: "+1 (555) 111-2233", email: "lisa@sunsetsuite.com" },
        units: [
            {
                id: "u-5a", name: "Executive Room", maxGuests: 1, isActive: true,
                pricingPlans: [
                    { rentalType: "DAILY", price: 65, minimumStay: 1 },
                    { rentalType: "MONTHLY", price: 1500, minimumStay: 1 },
                ],
            },
        ],
    },
    "p-6": {
        id: "p-6", title: "Commercial Office Space", type: "COMMERCIAL",
        city: "San Francisco", address: "50 Market St", price: 8000, rentalType: "MONTHLY",
        maxGuests: 20, rating: 4.4, reviews: 8, available: true,
        description: "Premium Class-A office space in the heart of San Francisco's Financial District. Open-plan layout with private meeting rooms, high-speed fiber internet, 24/7 building security, and panoramic Bay Bridge views. Ideal for tech startups, creative agencies, and established firms looking for a prestigious address.",
        images: [
            "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
            "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80",
        ],
        landlord: { name: "Alan Roberts", phone: "+1 (555) 999-8877", email: "alan@sfcommercial.com" },
        units: [
            {
                id: "u-6a", name: "Floor 12 – Full Floor", maxGuests: 20, isActive: true,
                pricingPlans: [
                    { rentalType: "MONTHLY", price: 8000, minimumStay: 12 },
                    { rentalType: "YEARLY", price: 88000, minimumStay: 1 },
                ],
            },
            {
                id: "u-6b", name: "Floor 12 – Suite A", maxGuests: 8, isActive: true,
                pricingPlans: [
                    { rentalType: "MONTHLY", price: 3500, minimumStay: 6 },
                ],
            },
        ],
    },
};

const rentalTypeLabel: Record<string, string> = {
    DAILY: "/ night",
    MONTHLY: "/ month",
    YEARLY: "/ year",
};

const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
};

export default function BrowsePropertyDetailPage({ params }: { params: Promise<{ propertyId: string }> }) {
    const { propertyId } = use(params);
    const property = propertiesData[propertyId];

    const [activeImage, setActiveImage] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [saved, setSaved] = useState(false);
    const [shared, setShared] = useState(false);

    /* ── Not found ── */
    if (!property) {
        return (
            <div>
                <TenantHeader title="Property Not Found" />
                <div className="p-6 max-w-7xl mx-auto text-center py-20">
                    <div className="inline-flex h-20 w-20 rounded-full bg-muted items-center justify-center mb-6">
                        <Home className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h2 className="font-display text-2xl font-bold text-foreground mb-3">Property Not Found</h2>
                    <p className="text-muted-foreground mb-6">The property you&apos;re looking for doesn&apos;t exist or has been removed.</p>
                    <Link href="/tenant/browse">
                        <Button variant="outline">
                            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Browse
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    const handleShare = async () => {
        await navigator.clipboard?.writeText(window.location.href);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
    };

    const allImages = property.images;

    return (
        <div>
            <TenantHeader title="Property Details" subtitle={property.title} />

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
                            <button
                                onClick={() => setLightboxOpen(false)}
                                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                            >
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

            <div className="p-6 max-w-7xl mx-auto space-y-6">
                {/* Back link */}
                <Link href="/tenant/browse" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors w-fit group">
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
                    Back to Browse
                </Link>

                {/* ── Hero Image ── */}
                <motion.div variants={fadeUp} initial="hidden" animate="show" className="glass-card rounded-2xl overflow-hidden">
                    <div
                        className="relative h-64 sm:h-80 overflow-hidden cursor-pointer group"
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
                                {property.type}
                            </span>
                            {!property.available && (
                                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-red-500 text-white shadow-lg">
                                    Unavailable
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

                        {/* Rating + Info overlay */}
                        <div className="absolute bottom-4 left-4 flex items-center gap-3">
                            <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                                <span className="text-xs font-semibold text-white">{property.rating}</span>
                                <span className="text-xs text-white/70">({property.reviews} reviews)</span>
                            </div>
                        </div>
                    </div>

                    {/* Thumbnail strip */}
                    <div className="flex gap-1 p-2 overflow-x-auto">
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
                                    ? "bg-red-50 border-red-200 text-red-500"
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
                            { icon: Building2, label: "Type", value: property.type.charAt(0) + property.type.slice(1).toLowerCase() },
                            { icon: MapPin, label: "City", value: property.city },
                            { icon: Users, label: "Max Guests", value: String(property.maxGuests) },
                            { icon: Tag, label: "Starting at", value: `$${property.price.toLocaleString()} ${rentalTypeLabel[property.rentalType]}` },
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

                {/* ── Two-column layout ── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* LEFT: Description + Units */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Description */}
                        <motion.div variants={fadeUp} initial="hidden" animate="show" className="glass-card rounded-2xl p-6">
                            <h2 className="font-display text-lg font-semibold text-foreground mb-3">About this Property</h2>
                            <p className="text-muted-foreground leading-relaxed text-[15px]">{property.description}</p>
                        </motion.div>

                        {/* Rental Units */}
                        <motion.div variants={fadeUp} initial="hidden" animate="show" className="space-y-4">
                            <h2 className="font-display text-lg font-semibold text-foreground">
                                Rental Units
                                <span className="text-sm font-normal text-muted-foreground ml-2">({property.units.length} available)</span>
                            </h2>

                            {property.units.map((unit) => (
                                <div key={unit.id} className="glass-card rounded-2xl overflow-hidden">
                                    {/* Unit header */}
                                    <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
                                                <BedDouble className="h-5 w-5 text-accent" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-semibold text-foreground">{unit.name}</h3>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <Users className="h-3 w-3" /> Up to {unit.maxGuests} guests
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${unit.isActive
                                            ? "bg-green-50 text-green-700 border border-green-200"
                                            : "bg-red-50 text-red-600 border border-red-200"
                                            }`}>
                                            {unit.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </div>

                                    {/* Pricing plans */}
                                    <div className="p-5 space-y-3">
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Pricing Plans</p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {unit.pricingPlans.map((plan, idx) => (
                                                <div
                                                    key={idx}
                                                    className="bg-secondary rounded-xl p-4 border border-border/50 hover:border-accent/30 transition-colors"
                                                >
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <DollarSign className="h-3.5 w-3.5 text-accent" />
                                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                                            {plan.rentalType}
                                                        </span>
                                                    </div>
                                                    <p className="text-xl font-bold text-foreground font-display">
                                                        ${plan.price.toLocaleString()}
                                                        <span className="text-xs font-normal text-muted-foreground ml-1">
                                                            {rentalTypeLabel[plan.rentalType]}
                                                        </span>
                                                    </p>
                                                    <div className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground">
                                                        <Clock className="h-3 w-3" />
                                                        Min. stay: {plan.minimumStay} {plan.rentalType === "DAILY" ? (plan.minimumStay === 1 ? "night" : "nights") : plan.rentalType === "MONTHLY" ? (plan.minimumStay === 1 ? "month" : "months") : (plan.minimumStay === 1 ? "year" : "years")}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Action buttons for this unit */}
                                        {unit.isActive && property.available && (
                                            <div className="flex gap-2 pt-2">
                                                <Link href={`/tenant/browse/${property.id}/book?unit=${unit.id}`} className="flex-1">
                                                    <Button size="sm" className="w-full text-xs bg-accent text-accent-foreground hover:bg-accent/90">
                                                        <Calendar className="h-3.5 w-3.5 mr-1.5" />
                                                        Book Short-Term
                                                    </Button>
                                                </Link>
                                                {unit.pricingPlans.some((p) => p.rentalType === "MONTHLY" || p.rentalType === "YEARLY") && (
                                                    <Link href={`/tenant/leases?unit=${unit.id}`} className="flex-1">
                                                        <Button variant="outline" size="sm" className="w-full text-xs">
                                                            <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                                                            Sign Lease
                                                        </Button>
                                                    </Link>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* RIGHT: Sidebar */}
                    <div className="lg:col-span-1 space-y-4">
                        {/* Landlord Contact Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 24 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="glass-card rounded-2xl p-5 space-y-4 sticky top-20"
                        >
                            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Listed by</p>
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-accent/40 to-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                                    <span className="font-display font-bold text-accent text-base">
                                        {property.landlord.name.split(" ").map((n) => n[0]).join("")}
                                    </span>
                                </div>
                                <div>
                                    <p className="font-semibold text-foreground text-sm">{property.landlord.name}</p>
                                    <div className="flex items-center gap-0.5 mt-0.5">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star key={s} className="h-3 w-3 text-accent fill-accent" />
                                        ))}
                                        <span className="text-xs text-muted-foreground ml-1">Verified Owner</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <a href={`tel:${property.landlord.phone}`} className="flex items-center gap-3 bg-muted hover:bg-accent/10 rounded-xl px-4 py-3 transition-colors group">
                                    <div className="h-8 w-8 rounded-lg bg-accent/10 group-hover:bg-accent/20 flex items-center justify-center shrink-0 transition-colors">
                                        <Phone className="h-4 w-4 text-accent" />
                                    </div>
                                    <div>
                                        <div className="text-[11px] text-muted-foreground">Phone</div>
                                        <div className="text-sm font-medium text-foreground">{property.landlord.phone}</div>
                                    </div>
                                </a>
                                <a href={`mailto:${property.landlord.email}`} className="flex items-center gap-3 bg-muted hover:bg-accent/10 rounded-xl px-4 py-3 transition-colors group">
                                    <div className="h-8 w-8 rounded-lg bg-accent/10 group-hover:bg-accent/20 flex items-center justify-center shrink-0 transition-colors">
                                        <Mail className="h-4 w-4 text-accent" />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-[11px] text-muted-foreground">Email</div>
                                        <div className="text-sm font-medium text-foreground truncate">{property.landlord.email}</div>
                                    </div>
                                </a>
                            </div>

                            <Button variant="outline" className="w-full text-sm">
                                <Mail className="h-4 w-4 mr-2" />
                                Message Landlord
                            </Button>
                        </motion.div>

                        {/* Location Card */}
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

                        {/* Trust badge */}
                        <div className="rounded-xl border border-border bg-secondary/40 px-4 py-3 flex items-center gap-3">
                            <ShieldCheck className="h-5 w-5 text-accent shrink-0" />
                            <p className="text-xs text-muted-foreground">This listing has been verified by EstateVue. Your inquiry is safe and secure.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
