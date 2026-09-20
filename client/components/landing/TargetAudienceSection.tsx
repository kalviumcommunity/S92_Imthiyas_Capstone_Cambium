"use client";

import React from "react";
import { motion } from "framer-motion";
import { GraduationCap, Microscope, Building, Users, BookOpen, Compass, Award } from "lucide-react";

export default function TargetAudienceSection() {
  const audiences = [
    { label: "Undergraduate Researchers", icon: GraduationCap },
    { label: "Graduate Researchers", icon: BookOpen },
    { label: "PhD Scholars", icon: Award },
    { label: "Faculty & PIs", icon: Users },
    { label: "Research Labs", icon: Microscope },
    { label: "Academic Institutions", icon: Building },
    { label: "R&D Industry Teams", icon: Compass },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-y border-border/80">
      <motion.div
        className="text-center max-w-3xl mx-auto space-y-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-xs font-semibold tracking-widest text-ink-muted uppercase">
          BUILT FOR
        </p>

        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
          The people moving research forward.
        </h2>

        {/* Pill-shaped badge cluster */}
        <div className="flex flex-wrap justify-center items-center gap-3 pt-4">
          {audiences.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="group flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-border bg-card text-foreground text-sm font-medium shadow-elevation1 transition-all duration-200 hover:border-primary hover:bg-accent/40 hover:scale-[1.02] cursor-default"
              >
                <Icon className="w-4 h-4 text-primary transition-transform group-hover:rotate-6" />
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
