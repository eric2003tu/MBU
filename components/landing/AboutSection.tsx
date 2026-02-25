"use client";

import { motion } from "framer-motion";
import { Target, Eye, Briefcase } from "lucide-react";
import SectionHeading from "./SectionHeading";

const cards = [
    {
        icon: Briefcase,
        title: "Who We Are",
        text: "MB&U Company Ltd is a full-service real estate and property management company based in Rwanda, providing professional services in property letting, sales brokerage, valuation, and regulatory compliance.",
    },
    {
        icon: Eye,
        title: "Our Vision",
        text: "To become one of Rwanda's most trusted and technology-driven property management and real estate service providers.",
    },
    {
        icon: Target,
        title: "Our Mission",
        text: "To provide secure, transparent, and profitable property solutions for landlords, investors, and buyers through professional management, verified transactions, and regulatory compliance.",
    },
];

const AboutSection = () => {
    return (
        <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
                <SectionHeading
                    title="About MBU Properties"
                    subtitle="We operate through a digital platform combined with on-ground expertise to deliver transparent, efficient, and legally compliant property solutions."
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {cards.map((card, i) => (
                        <motion.div
                            key={card.title}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.12, ease: "easeOut" as const }}
                            className="glass-card rounded-2xl p-8 group hover:border-accent/30 transition-colors"
                        >
                            <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center mb-5 group-hover:bg-accent/20 transition-colors">
                                <card.icon className="h-6 w-6 text-accent" />
                            </div>
                            <h3 className="font-display text-xl font-semibold text-foreground mb-3">{card.title}</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">{card.text}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
