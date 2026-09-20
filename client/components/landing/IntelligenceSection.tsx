"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Brain, CheckCircle2, AlertCircle, FileSearch, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function IntelligenceSection() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto my-24">
      <motion.div
        className="rounded-3xl bg-primary text-white p-8 sm:p-12 lg:p-16 shadow-elevation3 relative overflow-hidden"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
      >
        {/* Subtle radial emerald highlight */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/30 blur-3xl rounded-full pointer-events-none -z-0" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left: Text & Features (Inverse Color Palette) */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-accent/20 text-accent text-xs font-semibold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span>CONTEXT-AWARE INTELLIGENCE</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
              An assistant that understands literature as deeply as you do.
            </h2>

            <p className="text-base text-parchment-200/90 leading-relaxed">
              Cambium parses methodology sections, extracts mathematical formulations, and surfaces cross-paper contradictions automatically while you read.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center text-accent shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Mathematical Formula Breakdown</h4>
                  <p className="text-xs text-parchment-300/80">Dissects complex Hamiltonian and tensor equations with step-by-step derivations.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center text-accent shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Methodology Contradiction Alert</h4>
                  <p className="text-xs text-parchment-300/80">Flags when experimental bounds dispute claims from preceding benchmark papers.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center text-accent shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Bi-directional Reference Mapping</h4>
                  <p className="text-xs text-parchment-300/80">Instantly links citations to open-access code repositories and datasets.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Currently Reading / Context Menu UI Card */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl border border-accent/20 bg-[#112F27] p-6 sm:p-8 shadow-2xl text-white space-y-5">
              {/* Paper Reader Header */}
              <div className="flex items-center justify-between pb-3 border-b border-accent/15 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <span className="font-mono text-accent">Reading: arXiv:2603.1194</span>
                </div>
                <span className="text-parchment-300/70 text-[11px]">Section 4.1</span>
              </div>

              {/* Excerpt with Highlighted Text */}
              <div className="p-4 rounded-lg bg-black/25 border border-accent/10 space-y-2">
                <p className="font-serif text-sm leading-relaxed text-parchment-100/90">
                  &ldquo;...Across our superconducting transmon arrays, the observed non-equilibrium transition{" "}
                  <mark className="bg-accent/30 text-accent px-1.5 py-0.5 rounded font-medium">
                    contradicts standard Landau-Ginzburg predictions
                  </mark>{" "}
                  under continuous dynamical microwave decoupling...&rdquo;
                </p>
              </div>

              {/* Context Intelligence Menu */}
              <div className="p-4 rounded-xl bg-secondary/40 border border-accent/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-accent">
                    <Brain className="w-4 h-4" />
                    <span>Cambium Synthesis Insight</span>
                  </div>
                  <Badge variant="outline" shape="tag" className="text-[10px] border-accent/30 text-accent">
                    High Confidence
                  </Badge>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2 rounded bg-black/20 flex items-center justify-between">
                    <span className="text-parchment-200">3 conflicting benchmark papers identified (2024–2026)</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-accent shrink-0" />
                  </div>
                  <div className="p-2 rounded bg-black/20 flex items-center justify-between">
                    <span className="text-parchment-200">Equation 4 derived from Hamiltonian H_0</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-accent shrink-0" />
                  </div>
                  <div className="p-2 rounded bg-black/20 flex items-center justify-between">
                    <span className="text-parchment-200">Principal Author: Max Planck Quantum Optics</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-accent shrink-0" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
