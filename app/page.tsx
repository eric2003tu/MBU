"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Building2, Key, TrendingUp, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import SearchBar from "@/components/SearchBar";
import { properties } from "@/lib/data/properties";

const featuredProperties = properties.filter((p) => p.featured);

const stats = [
    { icon: Building2, label: "Properties", value: "2,500+" },
    { icon: Key, label: "Happy Clients", value: "1,200+" },
    { icon: TrendingUp, label: "Cities", value: "45+" },
    { icon: Shield, label: "Years of Trust", value: "15+" },
];

export default function HomePage() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            {/* Hero */}
            <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <img src="/images/hero-property.jpg" alt="Luxury property" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-primary/60" />
                </div>
                <div className="relative z-10 container mx-auto px-4 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight"
                    >
                        Find Your Dream
                        <span className="text-gradient block">Property</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="text-primary-foreground/80 text-lg md:text-xl max-w-2xl mx-auto mb-10"
                    >
                        Discover exceptional homes and commercial spaces. Whether you&apos;re buying, renting, or investing — we make it effortless.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.4 }}
                        className="flex justify-center"
                    >
                        <SearchBar />
                    </motion.div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-16 bg-secondary">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="text-center"
                            >
                                <stat.icon className="h-8 w-8 text-accent mx-auto mb-3" />
                                <div className="font-display text-3xl font-bold text-foreground">{stat.value}</div>
                                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Properties */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="flex items-end justify-between mb-12">
                        <div>
                            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                                Featured Properties
                            </h2>
                            <p className="text-muted-foreground mt-2">Handpicked selections for you</p>
                        </div>
                        <Link href="/properties">
                            <Button variant="outline" className="gap-2 hidden md:flex">
                                View All <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredProperties.map((property, i) => (
                            <PropertyCard key={property.id} property={property} index={i} />
                        ))}
                    </div>
                    <div className="mt-8 text-center md:hidden">
                        <Link href="/properties">
                            <Button variant="outline" className="gap-2">
                                View All Properties <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-primary">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                        Ready to List Your Property?
                    </h2>
                    <p className="text-primary-foreground/70 max-w-xl mx-auto mb-8">
                        Join thousands of property owners who trust EstateVue to connect them with the perfect buyers and renters.
                    </p>
                    <Button className="bg-accent text-accent-foreground hover:bg-accent/90 px-8 py-3 text-base">
                        Get Started Today
                    </Button>
                </div>
            </section>

            <Footer />
        </div>
    );
}
