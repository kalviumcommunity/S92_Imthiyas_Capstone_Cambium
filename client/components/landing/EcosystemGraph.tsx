"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Network, Database, BookOpen, Award, Users, Compass, FileCode } from "lucide-react";

export default function EcosystemGraph() {
  const nodes = [
    { label: "Grants & Funding", icon: Award, desc: "$4.2B Indexed" },
    { label: "Preprints & Papers", icon: BookOpen, desc: "18M Documents" },
    { label: "Researcher Profiles", icon: Users, desc: "250K Verified" },
    { label: "Peer Review Discussions", icon: Sparkles, desc: "High-Signal Notes" },
    { label: "Institutional Datasets", icon: Database, desc: "Direct Zenodo Sync" },
    { label: "Conferences & CFPs", icon: Compass, desc: "Deadlines Tracked" },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center border-t border-border/80">
      <motion.div
        className="max-w-3xl mx-auto space-y-4 mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-xs font-semibold tracking-widest text-primary uppercase">
          KNOWLEDGE TOPOLOGY
        </p>
        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-foreground tracking-tight">
          Everything connects.
        </h2>
        <p className="text-base text-ink-muted">
          A continuous relational graph linking literature, authors, grants, institutions, and experimental datasets.
        </p>
      </motion.div>

      {/* Interactive Node Graph Presentation */}
      <motion.div
        className="relative max-w-4xl mx-auto rounded-3xl border border-border bg-card p-8 sm:p-12 shadow-elevation2 overflow-hidden"
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
      >
        {/* Central Core Hub */}
        <div className="flex flex-col items-center justify-center mb-12">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-primary flex flex-col items-center justify-center text-white shadow-elevation3 border-4 border-accent">
              <span className="font-serif font-bold text-sm tracking-wider">CAMBIUM</span>
              <span className="text-[9px] uppercase tracking-widest text-accent font-sans">Core Graph</span>
            </div>
            <div className="absolute -inset-2 rounded-full border border-primary/30 animate-ping pointer-events-none" />
          </div>
        </div>

        {/* Orbiting Satellite Nodes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {nodes.map((node) => {
            const Icon = node.icon;
            return (
              <div
                key={node.label}
                className="p-5 rounded-xl border border-border bg-parchment-50/60 hover:bg-card hover:border-primary transition-all duration-200 shadow-elevation1 group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                      {node.label}
                    </h4>
                    <span className="text-[11px] font-mono text-primary font-medium">
                      {node.desc}
                    </span>
                  </div>
                </div>
                <div className="h-1 w-full bg-border/60 rounded-full overflow-hidden">
                  <div className="h-full bg-primary/40 rounded-full w-3/4 group-hover:bg-primary transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
