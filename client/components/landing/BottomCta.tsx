"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Compass } from "lucide-react";

export default function BottomCta() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto my-20">
      <motion.div
        className="rounded-3xl border border-border bg-gradient-to-b from-card to-parchment-50 p-10 sm:p-16 lg:p-20 text-center shadow-elevation2 relative overflow-hidden"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
      >
        {/* Subtle decorative background spiral or blur */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/30 blur-3xl rounded-full pointer-events-none -z-0" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <p className="text-xs font-semibold tracking-widest text-primary uppercase">
            BEGIN YOUR WORK
          </p>

          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight">
            Your research deserves a home.
          </h2>

          <p className="text-base sm:text-lg text-ink-muted leading-relaxed max-w-2xl mx-auto">
            Join thousands of scholars, laboratories, and institutions unifying
            their academic identity, literature discovery, and workspace on Cambium.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 text-sm font-semibold rounded-md shadow-none gap-2"
            >
              <Link href="/auth">
                <span>Create your research identity</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 px-8 text-sm font-semibold rounded-md gap-2"
            >
              <Link href="/opportunities">
                <Compass className="w-4 h-4 text-primary" />
                <span>Explore public opportunities</span>
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
