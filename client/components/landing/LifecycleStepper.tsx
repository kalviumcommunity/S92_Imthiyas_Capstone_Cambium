"use client";

import React from "react";
import { motion } from "framer-motion";

export default function LifecycleStepper() {
  const steps = [
    { number: "01", title: "Discover", desc: "Funding calls & preprints" },
    { number: "02", title: "Explore", desc: "Cross-disciplinary links" },
    { number: "03", title: "Connect", desc: "Peer collaborators & PIs" },
    { number: "04", title: "Work", desc: "LaTeX notes & synthesis" },
    { number: "05", title: "Publish", desc: "CFP deadlines & tracking" },
    { number: "06", title: "Share", desc: "Institutional archiving" },
    { number: "07", title: "Grow", desc: "Citations & grant renewals" },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border/80">
      <motion.div
        className="text-center max-w-3xl mx-auto space-y-4 mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-xs font-semibold tracking-widest text-primary uppercase">
          LIFECYCLE CONTINUUM
        </p>
        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-foreground tracking-tight">
          One system for the entire research lifecycle.
        </h2>
        <p className="text-base text-ink-muted">
          From early hypothesis to global dissemination, Cambium supports every milestone.
        </p>
      </motion.div>

      {/* Horizontal Stepper */}
      <div className="relative">
        {/* Connecting track line */}
        <div className="hidden lg:block absolute top-7 left-12 right-12 h-0.5 bg-border -z-0" />

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-6 relative z-10">
          {steps.map((step, idx) => (
            <motion.div
              key={step.number}
              className="flex flex-col items-center text-center space-y-3 group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
            >
              <div className="w-14 h-14 rounded-full border border-border bg-card text-foreground group-hover:border-primary group-hover:bg-accent/50 group-hover:text-primary transition-all duration-200 flex items-center justify-center font-serif text-base font-bold shadow-elevation1">
                {step.number}
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                  {step.title}
                </h3>
                <p className="text-xs text-ink-muted leading-tight">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
