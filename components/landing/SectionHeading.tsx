"use client";

import { motion } from "framer-motion";

interface SectionHeadingProps {
    title: string;
    subtitle?: string;
    centered?: boolean;
    light?: boolean;
}

const SectionHeading = ({ title, subtitle, centered = true, light = false }: SectionHeadingProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={centered ? "text-center mb-14" : "mb-14"}
        >
            <h2 className={`font-display text-3xl md:text-4xl font-bold ${light ? "text-primary-foreground" : "text-foreground"}`}>
                {title}
            </h2>
            {subtitle && (
                <p className={`mt-3 max-w-2xl text-base md:text-lg ${centered ? "mx-auto" : ""} ${light ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    {subtitle}
                </p>
            )}
            <div className={`mt-4 h-1 w-16 rounded-full bg-accent ${centered ? "mx-auto" : ""}`} />
        </motion.div>
    );
};

export default SectionHeading;
