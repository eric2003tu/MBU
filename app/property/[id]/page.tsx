"use client";

import { use, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft, MapPin, Bed, Bath, Maximize, Phone, Mail,
    Heart, Share2, Check, ChevronLeft, ChevronRight, X,
    Calendar, Tag, Building2, Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import { properties } from "@/lib/data/properties";

interface Props {
    params: Promise<{ id: string }>;
}

export default function PropertyDetailPage({ params }: Props) {
    const { id } = use(params);
    const property = properties.find((p) => p.id === id);

    const [activeImage, setActiveImage] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [saved, setSaved] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const [sent, setSent] = useState(false);

    if (!property) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="pt-24 container mx-auto px-4 text-center py-20">
                    <h1 className="font-display text-3xl font-bold text-foreground">Property Not Found</h1>
                    <p className="text-muted-foreground mt-3">The property you're looking for doesn't exist or has been removed.</p>
                    <Link href="/properties">
                        <Button className="mt-6">Back to Properties</Button>
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    // Build image array (use property.images if multiple, else repeat hero)
    const allImages = property.images && property.images.length > 1
        ? property.images
        : [property.image, property.image, property.image];

    const similar = properties
        .filter((p) => p.id !== property.id && (p.type === property.type || p.city === property.city))
        .slice(0, 3);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSent(true);
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            {/* Lightbox */}
            <AnimatePresence>
                {lightboxOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
                        onClick={() => setLightboxOpen(false)}
                    >
                        <button
                            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                            onClick={() => setLightboxOpen(false)}
                        >
                            <X className="h-6 w-6 text-white" />
                        </button>
                        <button
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                            onClick={(e) => { e.stopPropagation(); setActiveImage((prev) => (prev - 1 + allImages.length) % allImages.length); }}
                        >
                            <ChevronLeft className="h-6 w-6 text-white" />
                        </button>
                        <motion.img
                            key={activeImage}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.2 }}
                            src={allImages[activeImage]}
                            alt={property.title}
                            className="max-w-5xl max-h-[80vh] w-full object-contain px-16"
                            onClick={(e) => e.stopPropagation()}
                        />
                        <button
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                            onClick={(e) => { e.stopPropagation(); setActiveImage((prev) => (prev + 1) % allImages.length); }}
                        >
                            <ChevronRight className="h-6 w-6 text-white" />
                        </button>
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                            {allImages.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={(e) => { e.stopPropagation(); setActiveImage(i); }}
                                    className={`h-1.5 rounded-full transition-all ${i === activeImage ? "w-8 bg-accent" : "w-1.5 bg-white/40"}`}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="pt-20">
                {/* ── Hero Gallery ── */}
                <div className="relative grid grid-cols-4 grid-rows-2 h-[55vh] overflow-hidden cursor-pointer gap-1"
                    onClick={() => setLightboxOpen(true)}>
                    {/* Main image */}
                    <div className="col-span-3 row-span-2 relative overflow-hidden">
                        <img
                            src={allImages[0]}
                            alt={property.title}
                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/50 via-transparent to-transparent pointer-events-none" />
                    </div>
                    {/* Thumbnails */}
                    {[1, 2].map((i) => (
                        <div key={i} className="col-span-1 row-span-1 relative overflow-hidden">
                            <img
                                src={allImages[i] ?? allImages[0]}
                                alt=""
                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                            />
                            {i === 2 && allImages.length > 3 && (
                                <div className="absolute inset-0 bg-primary/60 flex items-center justify-center">
                                    <span className="text-white font-semibold text-lg">+{allImages.length - 3} more</span>
                                </div>
                            )}
                        </div>
                    ))}
                    {/* Badges overlay on main image */}
                    <div className="absolute bottom-6 left-6 flex gap-2 pointer-events-none">
                        <span className="bg-accent text-accent-foreground text-sm font-bold px-4 py-1.5 rounded-full uppercase tracking-wide shadow-lg">
                            {property.type === "rent" ? "For Rent" : "For Sale"}
                        </span>
                        {property.category === "commercial" && (
                            <span className="bg-primary text-primary-foreground text-sm font-semibold px-4 py-1.5 rounded-full shadow-lg">
                                Commercial
                            </span>
                        )}
                    </div>
                    <button
                        className="absolute bottom-6 right-6 text-xs text-white/90 bg-black/40 backdrop-blur-sm border border-white/20 px-3 py-1.5 rounded-full hover:bg-black/60 transition-colors"
                        onClick={(e) => { e.stopPropagation(); setLightboxOpen(true); }}
                    >
                        View all photos
                    </button>
                </div>

                {/* ── Main content ── */}
                <div className="container mx-auto px-4 py-12">
                    <Link href="/properties" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors mb-8 group">
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Properties
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Left — Details */}
                        <div className="lg:col-span-2 space-y-10">
                            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                                {/* Title block */}
                                <div className="flex items-start justify-between gap-4 flex-wrap">
                                    <div>
                                        <div className="flex items-center gap-1.5 text-muted-foreground mb-2">
                                            <MapPin className="h-4 w-4 text-accent" />
                                            <span className="text-sm">{property.location}, {property.city}</span>
                                        </div>
                                        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground leading-tight">
                                            {property.title}
                                        </h1>
                                    </div>
                                    <div className="font-display text-3xl md:text-4xl font-bold text-accent shrink-0">
                                        {property.priceLabel}
                                    </div>
                                </div>

                                {/* Meta chips */}
                                <div className="flex flex-wrap gap-3 mt-5">
                                    <div className="flex items-center gap-1.5 bg-secondary text-secondary-foreground text-xs font-medium px-3 py-1.5 rounded-full">
                                        <Calendar className="h-3.5 w-3.5 text-accent" />
                                        Listed {new Date(property.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-secondary text-secondary-foreground text-xs font-medium px-3 py-1.5 rounded-full">
                                        <Tag className="h-3.5 w-3.5 text-accent" />
                                        {property.category.charAt(0).toUpperCase() + property.category.slice(1)}
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-secondary text-secondary-foreground text-xs font-medium px-3 py-1.5 rounded-full">
                                        <Building2 className="h-3.5 w-3.5 text-accent" />
                                        {property.type === "rent" ? "Rental" : "For Purchase"}
                                    </div>
                                </div>
                            </motion.div>

                            {/* Stats bar */}
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="grid grid-cols-3 gap-4"
                            >
                                {property.bedrooms > 0 && (
                                    <div className="glass-card rounded-xl p-5 text-center">
                                        <Bed className="h-6 w-6 text-accent mx-auto mb-2" />
                                        <div className="font-display text-2xl font-bold text-foreground">{property.bedrooms}</div>
                                        <div className="text-xs text-muted-foreground mt-0.5">Bedrooms</div>
                                    </div>
                                )}
                                <div className="glass-card rounded-xl p-5 text-center">
                                    <Bath className="h-6 w-6 text-accent mx-auto mb-2" />
                                    <div className="font-display text-2xl font-bold text-foreground">{property.bathrooms}</div>
                                    <div className="text-xs text-muted-foreground mt-0.5">Bathrooms</div>
                                </div>
                                <div className="glass-card rounded-xl p-5 text-center">
                                    <Maximize className="h-6 w-6 text-accent mx-auto mb-2" />
                                    <div className="font-display text-2xl font-bold text-foreground">{property.area.toLocaleString()}</div>
                                    <div className="text-xs text-muted-foreground mt-0.5">Sq Ft</div>
                                </div>
                            </motion.div>

                            {/* Description */}
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">About this property</h2>
                                <p className="text-muted-foreground leading-relaxed text-base">{property.description}</p>
                            </motion.div>

                            {/* Amenities */}
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                            >
                                <h2 className="font-display text-2xl font-semibold text-foreground mb-5">Amenities & Features</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {property.amenities.map((amenity) => (
                                        <div
                                            key={amenity}
                                            className="flex items-center gap-2.5 bg-secondary rounded-lg px-4 py-3 text-sm font-medium text-foreground"
                                        >
                                            <div className="h-5 w-5 rounded-full bg-accent/15 flex items-center justify-center shrink-0">
                                                <Check className="h-3 w-3 text-accent" />
                                            </div>
                                            {amenity}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Location placeholder */}
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                            >
                                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">Location</h2>
                                <div className="glass-card rounded-xl overflow-hidden h-56 flex items-center justify-center">
                                    <div className="text-center">
                                        <MapPin className="h-8 w-8 text-accent mx-auto mb-2" />
                                        <p className="text-sm font-semibold text-foreground">{property.location}</p>
                                        <p className="text-xs text-muted-foreground">{property.city}</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Right — Sidebar */}
                        <div className="lg:col-span-1">
                            <motion.div
                                initial={{ opacity: 0, x: 24 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="sticky top-24 space-y-4"
                            >
                                {/* Agent card */}
                                <div className="glass-card rounded-xl p-6">
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-accent/30 to-accent/10 flex items-center justify-center shrink-0 border border-accent/20">
                                            <span className="font-display font-bold text-accent text-lg">
                                                {property.agent.name.split(" ").map((n) => n[0]).join("")}
                                            </span>
                                        </div>
                                        <div>
                                            <div className="font-semibold text-foreground">{property.agent.name}</div>
                                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Star className="h-3 w-3 text-accent fill-accent" />
                                                Licensed Real Estate Agent
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2.5 mb-5">
                                        <a
                                            href={`tel:${property.agent.phone}`}
                                            className="flex items-center gap-3 text-sm text-muted-foreground hover:text-accent transition-colors bg-muted rounded-lg px-3 py-2.5"
                                        >
                                            <Phone className="h-4 w-4 text-accent shrink-0" />
                                            {property.agent.phone}
                                        </a>
                                        <a
                                            href={`mailto:${property.agent.email}`}
                                            className="flex items-center gap-3 text-sm text-muted-foreground hover:text-accent transition-colors bg-muted rounded-lg px-3 py-2.5"
                                        >
                                            <Mail className="h-4 w-4 text-accent shrink-0" />
                                            {property.agent.email}
                                        </a>
                                    </div>

                                    {/* Inquiry form */}
                                    {sent ? (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="text-center py-6"
                                        >
                                            <div className="h-12 w-12 rounded-full bg-accent/15 flex items-center justify-center mx-auto mb-3">
                                                <Check className="h-6 w-6 text-accent" />
                                            </div>
                                            <p className="font-semibold text-foreground text-sm">Inquiry Sent!</p>
                                            <p className="text-xs text-muted-foreground mt-1">The agent will be in touch soon.</p>
                                        </motion.div>
                                    ) : (
                                        <form onSubmit={handleSubmit} className="space-y-3">
                                            <input
                                                type="text"
                                                required
                                                placeholder="Your Name"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full text-sm bg-muted border border-border rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-accent/30 transition-shadow"
                                            />
                                            <input
                                                type="email"
                                                required
                                                placeholder="Your Email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full text-sm bg-muted border border-border rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-accent/30 transition-shadow"
                                            />
                                            <textarea
                                                placeholder={`I'm interested in "${property.title}"...`}
                                                rows={3}
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                className="w-full text-sm bg-muted border border-border rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-accent/30 resize-none transition-shadow"
                                            />
                                            <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
                                                Send Inquiry
                                            </Button>
                                        </form>
                                    )}

                                    <div className="flex gap-2 mt-4">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className={`flex-1 gap-2 transition-colors ${saved ? "text-red-500 border-red-300" : ""}`}
                                            onClick={() => setSaved(!saved)}
                                        >
                                            <Heart className={`h-4 w-4 ${saved ? "fill-red-500 text-red-500" : ""}`} />
                                            {saved ? "Saved" : "Save"}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 gap-2"
                                            onClick={() => navigator.clipboard?.writeText(window.location.href)}
                                        >
                                            <Share2 className="h-4 w-4" />
                                            Share
                                        </Button>
                                    </div>
                                </div>

                                {/* Price summary card */}
                                <div className="glass-card rounded-xl p-5">
                                    <div className="text-xs text-muted-foreground mb-1 font-medium uppercase tracking-wide">Listing Price</div>
                                    <div className="font-display text-2xl font-bold text-accent">{property.priceLabel}</div>
                                    {property.type === "rent" && (
                                        <div className="text-xs text-muted-foreground mt-1">per month</div>
                                    )}
                                    <div className="mt-3 text-sm text-muted-foreground">
                                        ~${Math.round(property.price / property.area)} <span className="text-xs">per sqft</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* ── Similar Properties ── */}
                    {similar.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            className="mt-24"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">Similar Properties</h2>
                                <Link href="/properties" className="text-sm text-accent hover:underline font-medium">
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
