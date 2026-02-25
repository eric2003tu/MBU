"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    Search, MapPin, Users, Building2, Calendar,
    ChevronLeft, ChevronRight, X, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import TenantHeader from "../components/TenantHeader";
import { propertyClient, type PropertyFull, type PropertyListParams } from "@/lib/propertyClient";

const PROPERTY_TYPES = ["All", "HOUSE", "APARTMENT", "ROOM", "STUDIO", "VILLA", "COMMERCIAL", "LAND", "DUPLEX"];
const LIMIT = 12;

const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    show: (i: number) => ({
        opacity: 1, y: 0,
        transition: { duration: 0.4, delay: i * 0.06, ease: "easeOut" as const },
    }),
};

function CardSkeleton() {
    return (
        <div className="glass-card rounded-2xl overflow-hidden animate-pulse">
            <div className="h-48 bg-muted" />
            <div className="p-4 space-y-3">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
                <div className="h-8 bg-muted rounded-xl" />
            </div>
        </div>
    );
}

export default function BrowsePage() {
    const [properties, setProperties] = useState<PropertyFull[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [selectedType, setSelectedType] = useState("All");

    const totalPages = Math.ceil(total / LIMIT);

    const fetchProperties = useCallback(async (params: PropertyListParams) => {
        setLoading(true);
        setError(null);
        try {
            const data = await propertyClient.getAll(params);
            setProperties(data.items);
            setTotal(data.total);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load properties.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProperties({
            page,
            limit: LIMIT,
            search: search || undefined,
            property_type: selectedType !== "All" ? selectedType : undefined,
        });
    }, [fetchProperties, page, search, selectedType]);

    const cities = useMemo(() => [...new Set(properties.map((p) => p.city).filter(Boolean))], [properties]);

    const handleSearch = () => { setSearch(searchInput); setPage(1); };
    const clearSearch = () => { setSearch(""); setSearchInput(""); setPage(1); };

    return (
        <div>
            <TenantHeader title="Browse Properties" subtitle="Find and book your perfect rental" />

            <div className="p-6 max-w-7xl mx-auto space-y-6">

                {/* Search bar */}
                <div className="glass-card rounded-2xl p-4 flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search by title, city…"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            className="w-full h-10 pl-9 pr-4 rounded-xl bg-secondary border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 transition"
                        />
                    </div>
                    {search && (
                        <Button variant="outline" size="sm" onClick={clearSearch} className="h-10 gap-1.5">
                            <X className="h-3.5 w-3.5" /> Clear
                        </Button>
                    )}
                    <Button onClick={handleSearch} size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 h-10 px-5">
                        Search
                    </Button>
                </div>

                {/* Type filter pills */}
                <div className="flex gap-2 flex-wrap">
                    {PROPERTY_TYPES.map((t) => (
                        <button
                            key={t}
                            onClick={() => { setSelectedType(t); setPage(1); }}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${selectedType === t
                                ? "bg-accent text-accent-foreground border-accent shadow-sm"
                                : "bg-secondary border-border/50 text-muted-foreground hover:border-accent/40 hover:text-foreground"
                                }`}
                        >
                            {t === "All" ? "All Types" : t.charAt(0) + t.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>

                {/* Results info */}
                <p className="text-sm text-muted-foreground">
                    {loading ? (
                        <span className="flex items-center gap-1.5"><Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading…</span>
                    ) : (
                        <>Showing <span className="font-semibold text-foreground">{properties.length}</span> of <span className="font-semibold text-foreground">{total}</span> properties</>
                    )}
                </p>

                {/* Error */}
                {error && (
                    <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-600 flex items-center justify-between">
                        <span>{error}</span>
                        <Button variant="outline" size="sm" onClick={() => fetchProperties({ page, limit: LIMIT })}>Retry</Button>
                    </div>
                )}

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
                    </div>
                ) : properties.length === 0 ? (
                    <div className="text-center py-20 space-y-3">
                        <Search className="h-10 w-10 text-muted-foreground/30 mx-auto" />
                        <p className="text-muted-foreground">No properties found. Try adjusting your search.</p>
                        <Button variant="outline" size="sm" onClick={() => { clearSearch(); setSelectedType("All"); }}>
                            Reset Filters
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {properties.map((p, i) => {
                            const image = p.images?.[0]?.url;
                            const firstPlan = p.units?.flatMap((u) => u.pricingPlans)?.[0];
                            const activeUnits = p.units?.filter((u) => u.is_active) ?? [];
                            const hasAvailability = activeUnits.length > 0;

                            return (
                                <motion.div
                                    key={p.property_id}
                                    custom={i}
                                    variants={fadeUp}
                                    initial="hidden"
                                    animate="show"
                                    className="glass-card rounded-2xl overflow-hidden group hover:shadow-xl transition-shadow"
                                >
                                    {/* Image */}
                                    <div className="relative h-48 overflow-hidden bg-muted">
                                        {image ? (
                                            /* eslint-disable-next-line @next/next/no-img-element */
                                            <img
                                                src={image}
                                                alt={p.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Building2 className="h-10 w-10 text-muted-foreground/30" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                        <div className="absolute top-3 left-3">
                                            <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-accent text-accent-foreground uppercase tracking-wide">
                                                {p.property_type}
                                            </span>
                                        </div>
                                        {!hasAvailability && (
                                            <div className="absolute top-3 right-3">
                                                <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-red-500 text-white">
                                                    No Units
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Body */}
                                    <div className="p-4 space-y-3">
                                        <div>
                                            <h3 className="font-display text-sm font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-1">
                                                {p.title}
                                            </h3>
                                            <div className="flex items-center gap-1 mt-1">
                                                <MapPin className="h-3 w-3 text-muted-foreground" />
                                                <span className="text-xs text-muted-foreground truncate">{p.address}, {p.city}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                {firstPlan ? (
                                                    <>
                                                        <span className="text-lg font-bold text-foreground font-display">
                                                            ${Number(firstPlan.price).toLocaleString()}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground ml-1">
                                                            /{firstPlan.rental_type === "DAILY" ? "night" : firstPlan.rental_type === "MONTHLY" ? "month" : "year"}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground italic">Contact for pricing</span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <Users className="h-3 w-3" />
                                                {p.units?.length ?? 0} unit{(p.units?.length ?? 0) !== 1 ? "s" : ""}
                                            </div>
                                        </div>

                                        {/* Cities city not in the filter — show it */}
                                        {cities.length > 1 && (
                                            <p className="text-xs text-muted-foreground">{p.city}</p>
                                        )}

                                        <div className="flex gap-2">
                                            <Link href={`/tenant/browse/${p.property_id}`} className="flex-1">
                                                <Button variant="outline" size="sm" className="w-full text-xs">
                                                    View Details
                                                </Button>
                                            </Link>
                                            {hasAvailability && (
                                                <Link href={`/tenant/browse/${p.property_id}/book`} className="flex-1">
                                                    <Button size="sm" className="w-full text-xs bg-accent text-accent-foreground hover:bg-accent/90">
                                                        <Calendar className="h-3 w-3 mr-1" /> Book Now
                                                    </Button>
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && !loading && (
                    <div className="flex items-center justify-center gap-3 mt-4">
                        <Button
                            variant="outline" size="sm"
                            disabled={page <= 1}
                            onClick={() => setPage((p) => p - 1)}
                            className="gap-1"
                        >
                            <ChevronLeft className="h-4 w-4" /> Prev
                        </Button>
                        <span className="text-sm text-muted-foreground">
                            Page <span className="font-semibold text-foreground">{page}</span> of {totalPages}
                        </span>
                        <Button
                            variant="outline" size="sm"
                            disabled={page >= totalPages}
                            onClick={() => setPage((p) => p + 1)}
                            className="gap-1"
                        >
                            Next <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
