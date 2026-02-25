"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Users, Globe, Landmark, UserCheck, Smartphone, FileCheck } from "lucide-react";
import SectionHeading from "./SectionHeading";

const differentiators = [
    { icon: FileCheck, text: "Verified property listings" },
    { icon: Landmark, text: "Transparent commission structure" },
    { icon: CheckCircle2, text: "Legal and compliance-focused transactions" },
    { icon: UserCheck, text: "Professional tenant screening" },
    { icon: Smartphone, text: "Digital tracking and reporting" },
    { icon: Globe, text: "Technology-driven property management" },
];

const targetMarket = [
    "Individual landlords",
    "Diaspora property owners",
    "Real estate investors",
    "Property developers",
    "Corporate tenants",
    "Foreign investors entering Rwanda",
    "Land buyers and sellers",
];

const WhyChooseUsSection = () => {
    return (
        <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
                <SectionHeading
                    title="Why Choose MBU Properties"
                    subtitle="We combine physical property oversight with a structured digital platform for maximum accountability."
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Differentiators */}
                    <div>
                        <h3 className="font-display text-xl font-semibold text-foreground mb-6">Our Value Proposition</h3>
                        <div className="space-y-4">
                            {differentiators.map((item, i) => (
                                <motion.div
                                    key={item.text}
                                    initial={{ opacity: 0, x: -16 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: i * 0.08, ease: "easeOut" as const }}
                                    className="flex items-center gap-4 glass-card rounded-xl px-5 py-4"
                                >
                                    <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                                        <item.icon className="h-5 w-5 text-accent" />
                                    </div>
                                    <span className="text-sm font-medium text-foreground">{item.text}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Target Market */}
                    <div>
                        <h3 className="font-display text-xl font-semibold text-foreground mb-6">Who We Serve</h3>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="glass-card rounded-2xl p-8"
                        >
                            <div className="space-y-3">
                                {targetMarket.map((item) => (
                                    <div key={item} className="flex items-center gap-3">
                                        <Users className="h-4 w-4 text-accent shrink-0" />
                                        <span className="text-sm text-muted-foreground">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="glass-card rounded-2xl p-6 mt-6 border-accent/20"
                        >
                            <h4 className="font-display text-base font-semibold text-foreground mb-2">Competitive Advantage</h4>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    "Tech-driven operations",
                                    "Financial transparency",
                                    "Legal integration",
                                    "Diaspora focus",
                                    "Structured commissions",
                                ].map((tag) => (
                                    <span
                                        key={tag}
                                        className="text-xs font-medium px-3 py-1.5 rounded-full bg-accent/10 text-accent border border-accent/20"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUsSection;
