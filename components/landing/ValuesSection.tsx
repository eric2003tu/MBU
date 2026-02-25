"use client";

import { motion } from "framer-motion";
import { Heart, Eye, Award, ShieldCheck, Users, Lightbulb } from "lucide-react";
import SectionHeading from "./SectionHeading";

const values = [
    { icon: ShieldCheck, label: "Integrity" },
    { icon: Eye, label: "Transparency" },
    { icon: Award, label: "Professionalism" },
    { icon: Users, label: "Accountability" },
    { icon: Heart, label: "Client-Centered Service" },
    { icon: Lightbulb, label: "Innovation" },
];

const ValuesSection = () => {
    return (
        <section className="py-20 bg-primary">
            <div className="container mx-auto px-4">
                <SectionHeading
                    title="Our Values"
                    subtitle="The principles that guide everything we do at MBU Properties."
                    light
                />

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
                    {values.map((value, i) => (
                        <motion.div
                            key={value.label}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: i * 0.07, ease: "easeOut" as const }}
                            className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-primary-foreground/5 border border-primary-foreground/10 hover:bg-primary-foreground/10 transition-colors"
                        >
                            <div className="h-12 w-12 rounded-xl bg-accent/15 flex items-center justify-center">
                                <value.icon className="h-6 w-6 text-accent" />
                            </div>
                            <span className="text-sm font-medium text-primary-foreground text-center">{value.label}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ValuesSection;
