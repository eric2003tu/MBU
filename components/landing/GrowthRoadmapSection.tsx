"use client";

import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";

const phases = [
    {
        phase: "Phase 1",
        title: "Kigali Rental Management",
        description: "Establish core property management operations in Kigali with tenant sourcing, lease management, and rent collection.",
        status: "active" as const,
    },
    {
        phase: "Phase 2",
        title: "Property Sales & Valuations",
        description: "Expand into property sales brokerage and professional valuation services for investors and financial institutions.",
        status: "upcoming" as const,
    },
    {
        phase: "Phase 3",
        title: "Mobile Platform",
        description: "Develop a full-featured mobile application for property owners, tenants, and investors to manage portfolios on the go.",
        status: "upcoming" as const,
    },
    {
        phase: "Phase 4",
        title: "National Expansion",
        description: "Scale operations to major Rwandan cities including Musanze, Rubavu, and Huye.",
        status: "upcoming" as const,
    },
    {
        phase: "Phase 5",
        title: "Investment Advisory",
        description: "Offer property investment advisory services and portfolio management for local and international investors.",
        status: "upcoming" as const,
    },
];

const GrowthRoadmapSection = () => {
    return (
        <section className="py-20 bg-secondary">
            <div className="container mx-auto px-4">
                <SectionHeading
                    title="Growth Roadmap"
                    subtitle="Our structured path to becoming Rwanda's leading property management platform."
                />

                <div className="relative max-w-3xl mx-auto">
                    {/* Vertical line */}
                    <div className="absolute left-5 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px" />

                    {phases.map((phase, i) => (
                        <motion.div
                            key={phase.phase}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" as const }}
                            className={`relative flex items-start gap-6 mb-8 last:mb-0 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                                }`}
                        >
                            {/* Dot */}
                            <div className="absolute left-5 md:left-1/2 md:-translate-x-1/2 z-10">
                                <div
                                    className={`h-3 w-3 rounded-full border-2 ${phase.status === "active"
                                        ? "bg-accent border-accent shadow-[0_0_10px_hsl(35_85%_55%/0.5)]"
                                        : "bg-background border-muted-foreground/30"
                                        }`}
                                />
                            </div>

                            {/* Spacer for left alignment on mobile */}
                            <div className="w-10 shrink-0 md:hidden" />

                            {/* Card */}
                            <div className={`flex-1 md:w-[calc(50%-2rem)] ${i % 2 === 0 ? "md:pr-10" : "md:pl-10"}`}>
                                <div className="glass-card rounded-xl p-5">
                                    <span className="text-xs font-semibold text-accent uppercase tracking-wider">{phase.phase}</span>
                                    <h3 className="font-display text-lg font-semibold text-foreground mt-1 mb-2">{phase.title}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{phase.description}</p>
                                </div>
                            </div>

                            {/* Hidden spacer for desktop alignment */}
                            <div className="hidden md:block flex-1" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default GrowthRoadmapSection;
