"use client";

import { use, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft, MapPin, Bed, Bath, Maximize, Phone, Mail,
    Heart, Share2, Check, ChevronLeft, ChevronRight, X,
    Calendar, Tag, Building2, Star, ShieldCheck, Eye,
    Wifi, Car, Dumbbell, Trees, Home, Coffee, CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import { properties } from "@/lib/data/properties";

interface Props {
    params: Promise<{ id: string }>;
}

const amenityIcons: Record<string, React.ElementType> = {
    "Wifi": Wifi, "Parking": Car, "Gym": Dumbbell, "Garden": Trees,
    "Pool": Coffee, "Terrace": Home, "Concierge": ShieldCheck,
    "Smart Home": Wifi, "Garage": Car, "Home Office": Building2,
    "Patio": Trees, "Fireplace": Home, "Beach Access": Trees,
    "Conference Rooms": Building2, "Security": ShieldCheck,
};

export default function PropertyDetailPage({ params }: Props) {
    const { id } = use(params);
    const property = properties.find((p) => p.id === id);

    const [activeImage, setActiveImage] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [saved, setSaved] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
    const [sent, setSent] = useState(false);
    const [shared, setShared] = useState(false);

    if (!property) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="pt-32 container mx-auto px-4 text-center">
                    <div className="inline-flex h-20 w-20 rounded-full bg-muted items-center justify-center mb-6">
                        <Home className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h1 className="font-display text-3xl font-bold text-foreground mb-3">Property Not Found</h1>
                    <p className="text-muted-foreground mb-8">The listing you&apos;re looking for has been removed or doesn&apos;t exist.</p>
                    <Link href="/properties">
                        <Button className="bg-accent text-accent-foreground hover:bg-accent/90">Browse All Properties</Button>
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    const allImages = property.images?.length > 1
        ? property.images
        : [property.image, property.image, property.image, property.image];

    const similar = properties
        .filter((p) => p.id !== property.id && (p.type === property.type || p.city === property.city))
        .slice(0, 3);

    const handleShare = async () => {
        await navigator.clipboard?.writeText(window.location.href);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSent(true);
    };

    const keyDetails = [
        ...(property.bedrooms > 0 ? [{ icon: Bed, label: "Bedrooms", value: String(property.bedrooms) }] : []),
        { icon: Bath, label: "Bathrooms", value: String(property.bathrooms) },
        { icon: Maximize, label: "Area", value: `${property.area.toLocaleString()} sqft` },
        { icon: Tag, label: "Type", value: property.type === "rent" ? "For Rent" : "For Sale" },
    ];

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

            <div className="pt-16">
                {/* ── Hero Gallery ── */}
                <div className="grid grid-cols-4 grid-rows-2 h-[60vh] gap-1 cursor-pointer" onClick={() => setLightboxOpen(true)}>
                    <div className="col-span-3 row-span-2 relative overflow-hidden group">
                        <img
                            src={allImages[0]}
                            alt={property.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
                        <div className="absolute top-5 left-5 flex gap-2">
                            <span className="bg-accent text-accent-foreground text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                                {property.type === "rent" ? "For Rent" : "For Sale"}
                            </span>
                            {property.category === "commercial" && (
                                <span className="bg-primary/90 text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
                                    Commercial
                                </span>
                            )}
                        </div>
                        <button
                            className="absolute bottom-5 right-5 text-xs font-semibold text-white bg-black/40 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full hover:bg-black/60 transition-all flex items-center gap-2"
                            onClick={(e) => { e.stopPropagation(); setLightboxOpen(true); }}
                        >
                            <Eye className="h-3.5 w-3.5" />
                            View all {allImages.length} photos
                        </button>
                    </div>
                    {[1, 2].map((i) => (
                        <div key={i} className="relative overflow-hidden group">
                            <img
                                src={allImages[i] ?? allImages[0]}
                                alt=""
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            {i === 1 && allImages.length > 3 && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">+{allImages.length - 3}</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* ── Sticky breadcrumb ── */}
                <div className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-16 z-30">
                    <div className="container mx-auto px-4 h-12 flex items-center justify-between">
                        <Link
                            href="/properties"
                            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent transition-colors group"
                        >
                            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
                            Properties
                            <span className="text-border mx-1">/</span>
                            <span className="text-foreground font-medium truncate max-w-[200px]">{property.title}</span>
                        </Link>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setSaved((s) => !s)}
                                className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${saved
                                    ? "bg-red-50 border-red-200 text-red-500 dark:bg-red-950/30"
                                    : "border-border text-muted-foreground hover:border-accent hover:text-accent"
                                    }`}
                            >
                                <Heart className={`h-3.5 w-3.5 ${saved ? "fill-red-500 text-red-500" : ""}`} />
                                {saved ? "Saved" : "Save"}
                            </button>
                            <button
                                onClick={handleShare}
                                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:border-accent hover:text-accent transition-all"
                            >
                                <Share2 className="h-3.5 w-3.5" />
                                {shared ? "Copied!" : "Share"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Main Layout ── */}
                <div className="container mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                        {/* ── LEFT: Content ── */}
                        <div className="lg:col-span-2 space-y-12">

                            {/* Title + price header */}
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
                                <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-2">
                                    <MapPin className="h-4 w-4 text-accent" />
                                    {property.location}, {property.city}
                                </div>
                                <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground leading-tight mb-4">
                                    {property.title}
                                </h1>
                                <div className="flex flex-wrap gap-2">
                                    <span className="flex items-center gap-1.5 text-xs font-medium bg-secondary text-secondary-foreground px-3 py-1.5 rounded-full">
                                        <Calendar className="h-3 w-3 text-accent" />
                                        Listed {new Date(property.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                                    </span>
                                    <span className="flex items-center gap-1.5 text-xs font-medium bg-secondary text-secondary-foreground px-3 py-1.5 rounded-full">
                                        <Tag className="h-3 w-3 text-accent" />
                                        {property.category.charAt(0).toUpperCase() + property.category.slice(1)}
                                    </span>
                                    <span className="flex items-center gap-1.5 text-xs font-medium bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400 border border-green-200 dark:border-green-800 px-3 py-1.5 rounded-full">
                                        <ShieldCheck className="h-3 w-3" />
                                        Verified Listing
                                    </span>
                                </div>
                            </motion.div>

                            {/* Key stats */}
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.45, delay: 0.08 }}
                                className="grid grid-cols-2 sm:grid-cols-4 gap-3"
                            >
                                {keyDetails.map(({ icon: Icon, label, value }) => (
                                    <div key={label} className="glass-card rounded-2xl p-5 flex flex-col items-center text-center gap-2 hover:border-accent/30 transition-colors">
                                        <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                                            <Icon className="h-5 w-5 text-accent" />
                                        </div>
                                        <div className="font-display text-2xl font-bold text-foreground">{value}</div>
                                        <div className="text-xs text-muted-foreground font-medium">{label}</div>
                                    </div>
                                ))}
                            </motion.div>

                            {/* Divider */}
                            <div className="border-t border-border" />

                            {/* About */}
                            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.12 }}>
                                <h2 className="font-display text-xl font-semibold text-foreground mb-4">About this property</h2>
                                <p className="text-muted-foreground leading-relaxed text-[15px]">{property.description}</p>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
                                    {[
                                        { label: "Property Type", value: property.category.charAt(0).toUpperCase() + property.category.slice(1) },
                                        { label: "Transaction", value: property.type === "rent" ? "For Rent" : "For Sale" },
                                        { label: "Price per sqft", value: `~$${Math.round(property.price / property.area).toLocaleString()}` },
                                    ].map(({ label, value }) => (
                                        <div key={label} className="bg-secondary rounded-xl p-4 border border-border/50">
                                            <div className="text-xs font-medium text-muted-foreground mb-1">{label}</div>
                                            <div className="text-sm font-bold text-foreground">{value}</div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Divider */}
                            <div className="border-t border-border" />

                            {/* Amenities */}
                            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.16 }}>
                                <h2 className="font-display text-xl font-semibold text-foreground mb-5">Amenities &amp; Features</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {property.amenities.map((amenity) => {
                                        const Icon = amenityIcons[amenity] ?? CheckCircle2;
                                        return (
                                            <div
                                                key={amenity}
                                                className="flex items-center gap-3 bg-secondary rounded-xl px-4 py-3.5 group hover:bg-accent/10 transition-colors border border-transparent hover:border-accent/20"
                                            >
                                                <div className="h-8 w-8 rounded-lg bg-accent/10 group-hover:bg-accent/20 flex items-center justify-center shrink-0 transition-colors">
                                                    <Icon className="h-4 w-4 text-accent" />
                                                </div>
                                                <span className="text-sm font-medium text-foreground">{amenity}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>

                            {/* Divider */}
                            <div className="border-t border-border" />

                            {/* Property details table */}
                            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.2 }}>
                                <h2 className="font-display text-xl font-semibold text-foreground mb-5">Property Details</h2>
                                <div className="rounded-2xl border border-border overflow-hidden">
                                    {[
                                        ["Square Footage", `${property.area.toLocaleString()} sqft`],
                                        ...(property.bedrooms > 0 ? [["Bedrooms", String(property.bedrooms)]] : []),
                                        ["Bathrooms", String(property.bathrooms)],
                                        ["Price per sqft", `~$${Math.round(property.price / property.area).toLocaleString()}`],
                                        ["Category", property.category.charAt(0).toUpperCase() + property.category.slice(1)],
                                        ["Listed on", new Date(property.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })],
                                    ].map(([label, value], idx, arr) => (
                                        <div
                                            key={label}
                                            className={`flex items-center justify-between px-5 py-4 bg-background hover:bg-muted/40 transition-colors ${idx < arr.length - 1 ? "border-b border-border" : ""}`}
                                        >
                                            <span className="text-sm text-muted-foreground">{label}</span>
                                            <span className="text-sm font-semibold text-foreground">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Divider */}
                            <div className="border-t border-border" />

                            {/* Location */}
                            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.23 }}>
                                <h2 className="font-display text-xl font-semibold text-foreground mb-5">Location</h2>
                                <div className="glass-card rounded-2xl overflow-hidden h-56 flex items-center justify-center relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-primary/5" />
                                    <div className="text-center relative z-10">
                                        <div className="h-14 w-14 rounded-full bg-accent/15 flex items-center justify-center mx-auto mb-3">
                                            <MapPin className="h-7 w-7 text-accent" />
                                        </div>
                                        <p className="font-semibold text-foreground text-base">{property.location}</p>
                                        <p className="text-sm text-muted-foreground mt-1">{property.city}</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* ── RIGHT: Sticky Sidebar ── */}
                        <div className="lg:col-span-1">
                            <motion.div
                                initial={{ opacity: 0, x: 24 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="sticky top-28 space-y-4"
                            >
                                {/* Price card */}
                                <div className="glass-card rounded-2xl p-6 border border-border/60">
                                    <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Listing Price</div>
                                    <div className="font-display text-4xl font-bold text-accent leading-none">{property.priceLabel}</div>
                                    {property.type === "rent" && <div className="text-xs text-muted-foreground mt-1">per month</div>}
                                    <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <Maximize className="h-3.5 w-3.5" />
                                        ~${Math.round(property.price / property.area).toLocaleString()} per sqft
                                    </div>
                                    <div className="mt-5 space-y-2.5">
                                        <a href={`tel:${property.agent.phone}`}>
                                            <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 h-12 font-semibold text-sm rounded-xl">
                                                <Phone className="h-4 w-4 mr-2" />
                                                Call Agent
                                            </Button>
                                        </a>
                                        <div className="grid grid-cols-2 gap-2">
                                            <button
                                                onClick={() => setSaved((s) => !s)}
                                                className={`flex items-center justify-center gap-1.5 h-10 rounded-xl border text-sm font-medium transition-all ${saved
                                                    ? "border-red-300 bg-red-50 text-red-500 dark:bg-red-950/20"
                                                    : "border-border text-muted-foreground hover:border-accent hover:text-accent"
                                                    }`}
                                            >
                                                <Heart className={`h-4 w-4 ${saved ? "fill-red-500 text-red-500" : ""}`} />
                                                {saved ? "Saved" : "Save"}
                                            </button>
                                            <button
                                                onClick={handleShare}
                                                className="flex items-center justify-center gap-1.5 h-10 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:border-accent hover:text-accent transition-all"
                                            >
                                                <Share2 className="h-4 w-4" />
                                                {shared ? "Copied!" : "Share"}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Agent card */}
                                <div className="glass-card rounded-2xl p-5 border border-border/60">
                                    <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Listed by</div>
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-accent/40 to-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                                            <span className="font-display font-bold text-accent text-base">
                                                {property.agent.name.split(" ").map((n) => n[0]).join("")}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-foreground">{property.agent.name}</p>
                                            <div className="flex items-center gap-0.5 mt-1">
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <Star key={s} className="h-3 w-3 text-accent fill-accent" />
                                                ))}
                                                <span className="text-xs text-muted-foreground ml-1">5.0 · Licensed Agent</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2.5">
                                        <a href={`tel:${property.agent.phone}`} className="flex items-center gap-3 bg-muted hover:bg-accent/10 rounded-xl px-4 py-3 transition-colors group">
                                            <div className="h-8 w-8 rounded-lg bg-accent/10 group-hover:bg-accent/20 flex items-center justify-center shrink-0 transition-colors">
                                                <Phone className="h-4 w-4 text-accent" />
                                            </div>
                                            <div>
                                                <div className="text-[11px] text-muted-foreground">Phone</div>
                                                <div className="text-sm font-medium text-foreground">{property.agent.phone}</div>
                                            </div>
                                        </a>
                                        <a href={`mailto:${property.agent.email}`} className="flex items-center gap-3 bg-muted hover:bg-accent/10 rounded-xl px-4 py-3 transition-colors group">
                                            <div className="h-8 w-8 rounded-lg bg-accent/10 group-hover:bg-accent/20 flex items-center justify-center shrink-0 transition-colors">
                                                <Mail className="h-4 w-4 text-accent" />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="text-[11px] text-muted-foreground">Email</div>
                                                <div className="text-sm font-medium text-foreground truncate">{property.agent.email}</div>
                                            </div>
                                        </a>
                                    </div>
                                </div>

                                {/* Contact form */}
                                <div className="glass-card rounded-2xl p-5 border border-border/60">
                                    <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Send a Message</div>
                                    {sent ? (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="text-center py-8"
                                        >
                                            <div className="h-14 w-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-3">
                                                <Check className="h-7 w-7 text-green-500" />
                                            </div>
                                            <p className="font-semibold text-foreground">Message Sent!</p>
                                            <p className="text-sm text-muted-foreground mt-1">The agent will be in touch shortly.</p>
                                        </motion.div>
                                    ) : (
                                        <form onSubmit={handleSubmit} className="space-y-3">
                                            <input
                                                required
                                                type="text"
                                                placeholder="Your Name"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full text-sm bg-muted border border-border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-accent/30 transition-shadow placeholder:text-muted-foreground/60"
                                            />
                                            <input
                                                required
                                                type="email"
                                                placeholder="Your Email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full text-sm bg-muted border border-border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-accent/30 transition-shadow placeholder:text-muted-foreground/60"
                                            />
                                            <input
                                                type="tel"
                                                placeholder="Your Phone (optional)"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full text-sm bg-muted border border-border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-accent/30 transition-shadow placeholder:text-muted-foreground/60"
                                            />
                                            <textarea
                                                rows={3}
                                                placeholder={`I'm interested in "${property.title}"…`}
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                className="w-full text-sm bg-muted border border-border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-accent/30 resize-none transition-shadow placeholder:text-muted-foreground/60"
                                            />
                                            <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 h-11 font-semibold rounded-xl">
                                                <Mail className="h-4 w-4 mr-2" />
                                                Send Message
                                            </Button>
                                        </form>
                                    )}
                                </div>

                                {/* Trust badge */}
                                <div className="rounded-xl border border-border bg-secondary/40 px-4 py-3 flex items-center gap-3">
                                    <ShieldCheck className="h-5 w-5 text-accent shrink-0" />
                                    <p className="text-xs text-muted-foreground">This listing has been verified by EstateVue. Your inquiry is safe and secure.</p>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* ── Similar Properties ── */}
                    {similar.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="mt-20 pt-10 border-t border-border"
                        >
                            <div className="flex items-end justify-between mb-8">
                                <div>
                                    <p className="text-sm font-semibold text-accent mb-1">You may also like</p>
                                    <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">Similar Properties</h2>
                                </div>
                                <Link href="/properties" className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors hidden sm:block">
                                    View all →
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {similar.map((p, i) => (
                                    <PropertyCard key={p.id} property={p} index={i} />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}
