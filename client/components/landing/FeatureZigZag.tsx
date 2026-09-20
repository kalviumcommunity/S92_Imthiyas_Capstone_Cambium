"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Check,
  Calendar,
  ExternalLink,
  Sparkles,
  BookOpen,
  Award,
  MessageSquare,
  Users,
  Compass,
  FileCode,
  Share2,
  Bookmark,
  TrendingUp,
} from "lucide-react";

export default function FeatureZigZag() {
  const [activeTab, setActiveTab] = useState("grants");

  return (
    <div className="py-16 space-y-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* -------------------------------------------------------------------
       * 1. ACADEMIC IDENTITY (Text Left, UI Card Right)
       * ------------------------------------------------------------------- */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <motion.div
          className="lg:col-span-6 space-y-6 text-left"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="default" shape="tag">VERIFIED SCHOLAR PROFILE</Badge>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-tight">
            Your definitive academic identity.
          </h2>
          <p className="text-base text-ink-muted leading-relaxed">
            Automated bibliometrics, verified institutional credentials, and live
            project rosters. Replace static curriculum vitaes with a dynamic, living
            portfolio directly linked to global research indexes.
          </p>

          <ul className="space-y-3 pt-2 text-sm text-foreground">
            <li className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-accent/80 flex items-center justify-center text-primary">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span>Automated ORCID, Crossref &amp; PubMed synchronization</span>
            </li>
            <li className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-accent/80 flex items-center justify-center text-primary">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span>Real-time citation tracking &amp; percentile benchmarking</span>
            </li>
            <li className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-accent/80 flex items-center justify-center text-primary">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span>Verifiable cryptographic credentials from accredited universities</span>
            </li>
          </ul>
        </motion.div>

        {/* UI Card (Dr. Maya Chen Profile) */}
        <motion.div
          className="lg:col-span-6"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <Card className="p-6 sm:p-8 bg-card border-border shadow-elevation2 space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16 border-2 border-primary/20">
                  <AvatarFallback className="bg-primary/10 text-primary text-xl font-serif font-bold">
                    MC
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-xl font-bold text-foreground">Dr. Maya Chen</h3>
                    <Badge variant="success" shape="status">Verified PI</Badge>
                  </div>
                  <p className="text-xs text-ink-muted">
                    Associate Professor of Computational Biology
                  </p>
                  <p className="text-xs text-primary font-medium">
                    Stanford University • School of Medicine
                  </p>
                </div>
              </div>

              <Button variant="outline" size="sm" className="hidden sm:flex text-xs">
                Follow Lab
              </Button>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-4 gap-2 pt-2 pb-3 border-y border-border/80 text-center">
              <div>
                <span className="block text-xl font-serif font-bold text-primary">34</span>
                <span className="text-[11px] text-ink-muted uppercase tracking-wider">h-index</span>
              </div>
              <div>
                <span className="block text-xl font-serif font-bold text-foreground">4,820</span>
                <span className="text-[11px] text-ink-muted uppercase tracking-wider">Citations</span>
              </div>
              <div>
                <span className="block text-xl font-serif font-bold text-foreground">18</span>
                <span className="text-[11px] text-ink-muted uppercase tracking-wider">Papers</span>
              </div>
              <div>
                <span className="block text-xl font-serif font-bold text-success">$2.4M</span>
                <span className="text-[11px] text-ink-muted uppercase tracking-wider">Funding</span>
              </div>
            </div>

            {/* Latest Publication Snippet */}
            <div className="p-4 rounded-lg bg-parchment-50/70 border border-border space-y-2">
              <div className="flex items-center justify-between text-[11px] text-ink-muted">
                <span className="font-semibold text-primary">Featured Preprint • Nature Biotech 2026</span>
                <span>DOI: 10.1038/s41587-026</span>
              </div>
              <h4 className="text-sm font-semibold text-foreground leading-snug">
                Topological Data Analysis for Single-Cell RNA Sequencing Trajectories
              </h4>
              <p className="text-xs text-ink-muted line-clamp-2">
                We introduce a Riemannian manifold learning framework mapping developmental lineage branches without heuristic downsampling...
              </p>
            </div>
          </Card>
        </motion.div>
      </section>

      {/* -------------------------------------------------------------------
       * 2. RESEARCH WORKSPACE (Center Text, UI Card Below)
       * ------------------------------------------------------------------- */}
      <section className="space-y-10 text-center">
        <motion.div
          className="max-w-3xl mx-auto space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="secondary" shape="tag">EDITORIAL WORKSPACE</Badge>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
            A distraction-free canvas for rigorous inquiry.
          </h2>
          <p className="text-base text-ink-muted leading-relaxed">
            Write manuscripts with native LaTeX formulations, live citation lookups, and bi-directional reference linking directly to global databases.
          </p>
        </motion.div>

        {/* UI Card (Document Editor) */}
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-card border-border shadow-elevation2 overflow-hidden text-left">
            {/* Editor Toolbar */}
            <div className="px-6 py-3 border-b border-border bg-parchment-50 flex items-center justify-between text-xs text-ink-muted">
              <div className="flex items-center gap-3">
                <span className="font-mono text-primary font-medium">manuscript_v3.tex</span>
                <span className="text-border">•</span>
                <span className="text-success font-medium">4,812 words</span>
                <span className="text-border">•</span>
                <span>Section 3.2: Formalism</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" shape="tag" className="text-[10px]">Autosaved to Cloud</Badge>
                <Button size="sm" variant="outline" className="h-7 text-xs">Export PDF</Button>
              </div>
            </div>

            {/* Document Content */}
            <div className="p-8 sm:p-12 space-y-6">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                Geometric Deep Learning on Macromolecular Surfaces
              </h3>
              <p className="text-sm text-ink-muted leading-relaxed font-serif">
                Let <span className="font-mono text-primary font-semibold">M</span> denote an oriented Riemannian 2-manifold representing the molecular solvent-accessible surface. The non-Euclidean convolution operator <span className="font-mono text-primary font-semibold">D_g</span> is evaluated over intrinsic geodesic patches:
              </p>

              {/* LaTeX Math Block */}
              <div className="p-4 rounded-lg bg-accent/30 border border-border/80 font-mono text-sm text-primary text-center">
                {"$$\\nabla \\cdot \\mathbf{F} = \\frac{\\rho}{\\epsilon_0} \\quad \\text{and} \\quad \\oint_{\\partial \\Omega} \\mathbf{A} \\cdot d\\boldsymbol{\\ell} = \\iint_{\\Omega} \\mathbf{B} \\cdot d\\mathbf{S}$$"}
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="text-xs text-ink-muted font-medium">Linked Citations:</span>
                <Badge variant="default" shape="tag" className="font-mono text-[11px]">[Chen et al., 2025]</Badge>
                <Badge variant="default" shape="tag" className="font-mono text-[11px]">[Bronstein et al., 2021]</Badge>
                <Badge variant="default" shape="tag" className="font-mono text-[11px]">[AlphaFold3, 2024]</Badge>
              </div>
            </div>
          </Card>
        </motion.div>
      </section>

      {/* -------------------------------------------------------------------
       * 3. COMMUNITY (Text Left, UI Card Right)
       * ------------------------------------------------------------------- */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <motion.div
          className="lg:col-span-6 space-y-6 text-left"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="secondary" shape="tag">SCHOLARLY DISCOURSE</Badge>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-tight">
            Connect with peers over high-signal inquiries.
          </h2>
          <p className="text-base text-ink-muted leading-relaxed">
            Skip social media noise. Participate in focused academic discussions, peer reviews, and multidisciplinary problem rooms curated by verified subject matter experts.
          </p>
          <div className="pt-2">
            <Button asChild variant="outline" className="gap-2">
              <a href="/opportunities">Browse Active Problem Rooms →</a>
            </Button>
          </div>
        </motion.div>

        {/* UI Card (Dr. Arjun Rao Post) */}
        <motion.div
          className="lg:col-span-6"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <Card className="p-6 sm:p-8 bg-card border-border shadow-elevation2 space-y-4">
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12 border border-primary/20">
                <AvatarFallback className="bg-secondary/15 text-secondary font-bold">
                  AR
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-foreground">Dr. Arjun Rao</h4>
                  <Badge variant="info" shape="status">Faculty</Badge>
                </div>
                <p className="text-xs text-ink-muted">Chair of Quantum Information, MIT</p>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <h5 className="font-serif text-base font-bold text-foreground">
                Seeking co-investigators for cross-validation on 127-qubit decoherence benchmarks
              </h5>
              <p className="text-xs text-ink-muted leading-relaxed">
                Our team at MIT is deploying dynamical decoupling sequences on noisy intermediate-scale quantum devices. We have open beamtime on superconducting circuits and seek computational co-PIs with tensor network experience.
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-2">
              <Badge variant="muted" shape="tag">#QuantumComputing</Badge>
              <Badge variant="muted" shape="tag">#Decoherence</Badge>
              <Badge variant="muted" shape="tag">#TensorNetworks</Badge>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border text-xs text-ink-muted">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 hover:text-primary cursor-pointer">
                  <MessageSquare className="w-3.5 h-3.5" /> 14 Academic Replies
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" /> 3 Lab Co-signers
                </span>
              </div>
              <Button size="sm" className="h-7 text-xs">Join Discussion</Button>
            </div>
          </Card>
        </motion.div>
      </section>

      {/* -------------------------------------------------------------------
       * 4. RESEARCH ACTIVITY (Text Right, UI Card Left)
       * ------------------------------------------------------------------- */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* UI Card (GitHub-style 2026 Contribution Graph) */}
        <motion.div
          className="lg:col-span-6 order-2 lg:order-1"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <Card className="p-6 sm:p-8 bg-card border-border shadow-elevation2 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h4 className="font-serif text-lg font-bold text-foreground">Research Velocity 2026</h4>
                <p className="text-xs text-ink-muted">1,420 intellectual actions logged across 52 weeks</p>
              </div>
              <Badge variant="success" shape="status">Active Streak: 42 Days</Badge>
            </div>

            {/* Contribution Grid */}
            <div className="space-y-2">
              <div className="grid grid-flow-col grid-rows-7 gap-1.5 overflow-x-auto py-2">
                {Array.from({ length: 180 }).map((_, i) => {
                  const levels = [
                    "bg-parchment-200",
                    "bg-accent",
                    "bg-secondary/60",
                    "bg-primary",
                  ];
                  const level = (i * 7 + 3) % 11 < 3 ? 0 : (i * 7) % 4;
                  return (
                    <div
                      key={i}
                      className={`w-3.5 h-3.5 rounded-[2px] ${levels[level]} transition-colors hover:ring-1 hover:ring-primary`}
                      title={`Activity Level ${level}`}
                    />
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-[11px] text-ink-muted pt-2">
                <span>Jan 2026</span>
                <div className="flex items-center gap-1.5">
                  <span>Less</span>
                  <span className="w-2.5 h-2.5 rounded-[2px] bg-parchment-200" />
                  <span className="w-2.5 h-2.5 rounded-[2px] bg-accent" />
                  <span className="w-2.5 h-2.5 rounded-[2px] bg-secondary/60" />
                  <span className="w-2.5 h-2.5 rounded-[2px] bg-primary" />
                  <span>More</span>
                </div>
                <span>Dec 2026</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs">
              <div className="p-2.5 rounded-md bg-parchment-50 border border-border">
                <span className="block font-bold text-primary">38</span>
                <span className="text-ink-muted text-[11px]">Preprints</span>
              </div>
              <div className="p-2.5 rounded-md bg-parchment-50 border border-border">
                <span className="block font-bold text-primary">124</span>
                <span className="text-ink-muted text-[11px]">Peer Reviews</span>
              </div>
              <div className="p-2.5 rounded-md bg-parchment-50 border border-border">
                <span className="block font-bold text-primary">892</span>
                <span className="text-ink-muted text-[11px]">Code / Data Commits</span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Text Right */}
        <motion.div
          className="lg:col-span-6 order-1 lg:order-2 space-y-6 text-left"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="default" shape="tag">RESEARCH VELOCITY</Badge>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-tight">
            Track intellectual momentum across years.
          </h2>
          <p className="text-base text-ink-muted leading-relaxed">
            Visualize laboratory outputs, manuscript iterations, computational datasets, and peer review contributions on an immutable scholarly record.
          </p>
          <p className="text-sm text-ink-muted leading-relaxed">
            Cambium automatically aggregates activity across GitHub, Zenodo, institutional repositories, and preprint servers into one clear narrative of scholarly progress.
          </p>
        </motion.div>
      </section>

      {/* -------------------------------------------------------------------
       * 5. OPPORTUNITY DISCOVERY (Center Text, Tabs, UI Cards Below)
       * ------------------------------------------------------------------- */}
      <section className="space-y-10 text-center">
        <motion.div
          className="max-w-3xl mx-auto space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="secondary" shape="tag">DISCOVERY ENGINE</Badge>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
            Never miss a deadline that could fund your next breakthrough.
          </h2>
          <p className="text-base text-ink-muted leading-relaxed">
            AI-indexed research calls, NSF/NIH grants, IEEE/ACM conference deadlines, and philanthropic fellowships refreshed hourly.
          </p>
        </motion.div>

        {/* Tabs for Opportunity Switching */}
        <div className="max-w-4xl mx-auto">
          <Tabs
            defaultValue="grants"
            className="w-full space-y-8"
            onValueChange={setActiveTab}
          >
            <div className="flex justify-center">
              <TabsList variant="segmented">
                <TabsTrigger value="grants">Grants &amp; Fellowships</TabsTrigger>
                <TabsTrigger value="conferences">Conferences &amp; CFPs</TabsTrigger>
              </TabsList>
            </div>

            {/* Grants Tab Content */}
            <TabsContent value="grants" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <Card className="p-6 bg-card border-border shadow-elevation1 hover:shadow-elevation2 transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <Badge variant="success" shape="status">Grant / Open</Badge>
                    <span className="text-xs font-mono font-semibold text-primary">$650,000</span>
                  </div>
                  <h4 className="font-serif text-lg font-bold text-foreground mt-3 mb-1">
                    NSF Directorate for STEM - Future Computing Horizons
                  </h4>
                  <p className="text-xs text-ink-muted mb-4 line-clamp-2">
                    Supports high-risk, high-reward interdisciplinary foundations in quantum information, biomolecular architecture, and neuromorphic edge hardware.
                  </p>
                  <div className="flex items-center justify-between text-xs text-ink-muted pt-3 border-t border-border">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> Deadline: Nov 15, 2026
                    </span>
                    <span className="text-primary font-semibold hover:underline cursor-pointer">
                      View Details →
                    </span>
                  </div>
                </Card>

                <Card className="p-6 bg-card border-border shadow-elevation1 hover:shadow-elevation2 transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <Badge variant="warning" shape="status">Fellowship / Closing Soon</Badge>
                    <span className="text-xs font-mono font-semibold text-primary">$120,000 / yr</span>
                  </div>
                  <h4 className="font-serif text-lg font-bold text-foreground mt-3 mb-1">
                    Simons Foundation Junior Fellowship in Theoretical Science
                  </h4>
                  <p className="text-xs text-ink-muted mb-4 line-clamp-2">
                    Three-year postdoctoral stipend for exceptional investigators in mathematics, theoretical physics, and computational neuroscience.
                  </p>
                  <div className="flex items-center justify-between text-xs text-ink-muted pt-3 border-t border-border">
                    <span className="flex items-center gap-1 text-error font-medium">
                      <Calendar className="w-3.5 h-3.5" /> Deadline: Oct 28, 2026
                    </span>
                    <span className="text-primary font-semibold hover:underline cursor-pointer">
                      View Details →
                    </span>
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Conferences Tab Content */}
            <TabsContent value="conferences" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <Card className="p-6 bg-card border-border shadow-elevation1 hover:shadow-elevation2 transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <Badge variant="info" shape="status">Tier 1 Conference</Badge>
                    <span className="text-xs text-ink-muted">San Diego, CA</span>
                  </div>
                  <h4 className="font-serif text-lg font-bold text-foreground mt-3 mb-1">
                    NeurIPS 2026: Neural Information Processing Systems
                  </h4>
                  <p className="text-xs text-ink-muted mb-4 line-clamp-2">
                    Premier venue for machine learning and computational neuroscience. Call for original research tracks, workshops, and reproducibility challenges.
                  </p>
                  <div className="flex items-center justify-between text-xs text-ink-muted pt-3 border-t border-border">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> Submission: May 22, 2026
                    </span>
                    <span className="text-primary font-semibold hover:underline cursor-pointer">
                      Read Call →
                    </span>
                  </div>
                </Card>

                <Card className="p-6 bg-card border-border shadow-elevation1 hover:shadow-elevation2 transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <Badge variant="info" shape="status">IEEE Symposium</Badge>
                    <span className="text-xs text-ink-muted">Zurich, Switzerland</span>
                  </div>
                  <h4 className="font-serif text-lg font-bold text-foreground mt-3 mb-1">
                    IEEE S&amp;P 2026: Security &amp; Privacy (Oakland)
                  </h4>
                  <p className="text-xs text-ink-muted mb-4 line-clamp-2">
                    Leading research forum on hardware enclaves, zero-knowledge proofs, differential privacy, and verifiable decentralized protocols.
                  </p>
                  <div className="flex items-center justify-between text-xs text-ink-muted pt-3 border-t border-border">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> Rolling Cycles: Dec 2026
                    </span>
                    <span className="text-primary font-semibold hover:underline cursor-pointer">
                      Read Call →
                    </span>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* -------------------------------------------------------------------
       * 6. PAPER DISCOVERY (Text Right, UI Card Left)
       * ------------------------------------------------------------------- */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* UI Card (Foundation Models Literature) */}
        <motion.div
          className="lg:col-span-6 order-2 lg:order-1"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <Card className="p-6 sm:p-8 bg-card border-border shadow-elevation2 space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="success" shape="tag">98.4% Semantic Match</Badge>
              <span className="text-xs font-mono text-ink-muted">arXiv:2603.04891</span>
            </div>

            <div className="space-y-2">
              <h4 className="font-serif text-xl font-bold text-foreground leading-snug">
                Foundation Models for Molecular Dynamics: Systematic Benchmark on 10M Conformations
              </h4>
              <p className="text-xs text-primary font-medium">
                K. Patel, M. Chen, L. Gomez, A. Rao et al.
              </p>
              <p className="text-xs text-ink-muted leading-relaxed">
                We conduct an exhaustive evaluation of equivariant graph neural networks across 10 million ab-initio quantum chemical configurations, demonstrating sub-chemical accuracy on transition-state kinetics.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-parchment-50 border border-border text-xs flex items-center justify-between">
              <div className="flex items-center gap-2 text-ink-muted">
                <BookOpen className="w-4 h-4 text-primary" />
                <span>Journal of Chemical Theory &amp; Computation</span>
              </div>
              <span className="text-success font-semibold">Open Access PDF</span>
            </div>

            <div className="flex items-center justify-between pt-2 text-xs">
              <Button size="sm" variant="outline" className="gap-1.5">
                <Bookmark className="w-3.5 h-3.5" /> Save to Library
              </Button>
              <Button size="sm" className="gap-1.5">
                Inspect Citation Graph →
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Text Right */}
        <motion.div
          className="lg:col-span-6 order-1 lg:order-2 space-y-6 text-left"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="default" shape="tag">LITERATURE SYNTHESIS</Badge>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-tight">
            Connected paper discovery, powered by vector embeddings.
          </h2>
          <p className="text-base text-ink-muted leading-relaxed">
            Semantic search surfaces foundational literature and emerging preprints across arXiv, PubMed, and institutional archives before they hit mainstream citation feeds.
          </p>
          <p className="text-sm text-ink-muted leading-relaxed">
            By indexing full-text mathematical proofs, methodology descriptions, and code artifacts, Cambium matches papers to your exact laboratory hypotheses.
          </p>
        </motion.div>
      </section>

      {/* -------------------------------------------------------------------
       * 7. COLLABORATION (Center Text, 3 Researcher Cards Below)
       * ------------------------------------------------------------------- */}
      <section className="space-y-10 text-center">
        <motion.div
          className="max-w-3xl mx-auto space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="secondary" shape="tag">GLOBAL DIRECTORY</Badge>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
            Find your next co-author or postdoc.
          </h2>
          <p className="text-base text-ink-muted leading-relaxed">
            Search over 250,000 verified academic profiles filtered by methodology, domain taxonomy, and publication history.
          </p>
        </motion.div>

        {/* 3 Researcher Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {/* Researcher 1 */}
          <Card className="p-6 bg-card border-border shadow-elevation1 hover:shadow-elevation2 transition-all space-y-4">
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12 border border-primary/20">
                <AvatarFallback className="bg-primary/10 text-primary font-bold">MC</AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-serif text-base font-bold text-foreground">Dr. Maya Chen</h4>
                <p className="text-xs text-ink-muted">Stanford University</p>
              </div>
            </div>
            <p className="text-xs text-ink-muted leading-relaxed">
              Focus: Single-cell transcriptomics, manifold learning, and topological biomarker extraction.
            </p>
            <div className="flex flex-wrap gap-1">
              <Badge variant="muted" shape="tag">Bioinformatics</Badge>
              <Badge variant="muted" shape="tag">Topology</Badge>
            </div>
            <Button size="sm" variant="outline" className="w-full text-xs">
              View Research Profile
            </Button>
          </Card>

          {/* Researcher 2 */}
          <Card className="p-6 bg-card border-border shadow-elevation1 hover:shadow-elevation2 transition-all space-y-4">
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12 border border-primary/20">
                <AvatarFallback className="bg-secondary/10 text-secondary font-bold">AR</AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-serif text-base font-bold text-foreground">Dr. Arjun Rao</h4>
                <p className="text-xs text-ink-muted">MIT Physics</p>
              </div>
            </div>
            <p className="text-xs text-ink-muted leading-relaxed">
              Focus: Superconducting qubit architectures, quantum error mitigation, and noise spectroscopy.
            </p>
            <div className="flex flex-wrap gap-1">
              <Badge variant="muted" shape="tag">Quantum Info</Badge>
              <Badge variant="muted" shape="tag">Decoherence</Badge>
            </div>
            <Button size="sm" variant="outline" className="w-full text-xs">
              View Research Profile
            </Button>
          </Card>

          {/* Researcher 3 */}
          <Card className="p-6 bg-card border-border shadow-elevation1 hover:shadow-elevation2 transition-all space-y-4">
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12 border border-primary/20">
                <AvatarFallback className="bg-accent text-primary font-bold">EP</AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-serif text-base font-bold text-foreground">Dr. Elena Park</h4>
                <p className="text-xs text-ink-muted">Oxford University</p>
              </div>
            </div>
            <p className="text-xs text-ink-muted leading-relaxed">
              Focus: Climate modeling, probabilistic physics-informed neural operators, and extreme weather forecasting.
            </p>
            <div className="flex flex-wrap gap-1">
              <Badge variant="muted" shape="tag">Climate AI</Badge>
              <Badge variant="muted" shape="tag">PINNs</Badge>
            </div>
            <Button size="sm" variant="outline" className="w-full text-xs">
              View Research Profile
            </Button>
          </Card>
        </div>
      </section>
    </div>
  );
}
