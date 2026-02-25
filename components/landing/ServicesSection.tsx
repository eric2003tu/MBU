"use client";

import { motion } from "framer-motion";
import { Home, Building, BarChart3, Scale } from "lucide-react";
import SectionHeading from "./SectionHeading";

const services = [
    {
        icon: Home,
        title: "Property Letting & Rental Management",
        features: [
            "Tenant sourcing and screening",
            "Lease agreement preparation",
            "Rent collection and reporting",
            "Routine inspections",
            "Maintenance coordination",
            "Rent arrears management",
        ],
        revenue: "8%–12% monthly rental commission",
    },
    {
        icon: Building,
        title: "Property Sales (Brokerage)",
        features: [
            "Property marketing (online + offline)",
            "Buyer sourcing",
            "Negotiation and transaction management",
            "Offer documentation",
            "Closing coordination",
        ],
        revenue: "3%–5% sales commission",
    },
    {
        icon: BarChart3,
        title: "Property Valuation Services",
        features: [
            "Market value assessment",
            "Investment advisory valuations",
            "Pre-sale valuation",
            "Bank and financing valuation support",
        ],
        revenue: "Fixed valuation fee or project-based pricing",
    },
    {
        icon: Scale,
        title: "Compliance & Documentation",
        features: [
            "Title verification support",
            "Land registration guidance",
            "Lease drafting assistance",
            "Property tax compliance guidance",
            "Regulatory advisory",
        ],
        revenue: "Service-based fixed fees",
    },
];

const ServicesSection = () => {
    return (
        <section className="py-20 bg-secondary">
            <div className="container mx-auto px-4">
                <SectionHeading
                    title="Our Core Services"
                    subtitle="End-to-end property solutions backed by technology and on-ground expertise."
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {services.map((service, i) => (
                        <motion.div
                            key={service.title}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" as const }}
                            className="glass-card rounded-2xl p-8 group hover:border-accent/30 transition-colors"
                        >
                            <div className="flex items-start gap-5">
                                <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
                                    <service.icon className="h-6 w-6 text-accent" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-display text-lg font-semibold text-foreground mb-3">{service.title}</h3>
                                    <ul className="space-y-1.5 mb-4">
                                        {service.features.map((f) => (
                                            <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                                                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="inline-flex items-center gap-2 text-xs font-medium text-accent bg-accent/10 px-3 py-1.5 rounded-full">
                                        {service.revenue}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ServicesSection;
