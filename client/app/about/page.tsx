"use client";

import React from "react";
import Link from "next/link";
import { PublicHeader } from "@/components/PublicHeader";
import Footer from "@/components/Footer";
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  GitBranch,
  Layers,
  Compass,
  CheckCircle2,
  Share2,
  BookmarkCheck,
  Brain,
  ShieldCheck,
  Eye,
  User,
  ExternalLink,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#202920] selection:bg-[#3E6248]/20 selection:text-[#173F35]">
      <PublicHeader />

      {/* ─── SECTION 01: HERO ─── */}
      <section className="relative overflow-hidden pt-16 sm:pt-24 pb-20 border-b border-[#E4DCCB]">
        {/* Subtle Botanical Cambium Growth Ring Watermark */}
        <div className="absolute top-1/2 right-[-10%] -translate-y-1/2 w-[700px] h-[700px] pointer-events-none opacity-[0.035] select-none">
          <svg viewBox="0 0 100 100" fill="none" stroke="#202920" strokeWidth="0.8">
            <circle cx="50" cy="50" r="10" strokeDasharray="1 1" />
            <circle cx="50" cy="50" r="20" />
            <circle cx="50" cy="50" r="30" strokeDasharray="2 1" />
            <circle cx="50" cy="50" r="40" />
            <circle cx="50" cy="50" r="48" strokeWidth="1.2" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-10 relative z-10">
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DCE6D7]/60 border border-[#66866A]/30 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3E6248] animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-widest text-[#3E6248] font-semibold">
                About Cambium
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[58px] font-normal leading-[1.12] tracking-tight text-[#202920] mb-6">
              Research moves forward when the{" "}
              <span className="italic text-[#3E6248]">right connections</span> take root.
            </h1>

            {/* Supporting Copy */}
            <p className="font-serif text-lg sm:text-xl leading-relaxed text-[#62685E] mb-6 max-w-2xl">
              Research is full of possibility. Cambium is being built to help researchers discover relevant opportunities, connect scholarly information, and turn scattered knowledge into meaningful next steps.
            </p>

            {/* Signature Line */}
            <p className="font-mono text-xs sm:text-sm uppercase tracking-wider text-[#3E6248] font-semibold mb-10 pb-6 border-b border-[#E4DCCB]">
              Discover what matters. Connect what belongs together. Grow what comes next.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/opportunities"
                className="bg-[#3E6248] hover:bg-[#293E30] text-[#FAF7F0] px-7 py-3.5 rounded-full font-sans text-xs font-semibold uppercase tracking-wider shadow-sm transition-all duration-200 inline-flex items-center gap-2 no-underline border border-[#66866A]/30"
              >
                <span>Explore Research</span>
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/contact"
                className="bg-white hover:bg-[#F2EBDD] text-[#202920] px-7 py-3.5 rounded-full font-sans text-xs font-semibold uppercase tracking-wider border border-[#E4DCCB] transition-colors inline-flex items-center gap-2 no-underline shadow-2xs"
              >
                <span>Get in Touch</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 02: THE PROBLEM ─── */}
      <section className="py-20 sm:py-28 border-b border-[#E4DCCB] bg-[#FAF7F0]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-6 space-y-6">
              <span className="font-mono text-xs uppercase tracking-widest text-[#85877B] font-semibold">
                The Fragmentation Dilemma
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-normal leading-tight text-[#202920]">
                Research information is everywhere.{" "}
                <span className="italic text-[#3E6248]">Relevance</span> is harder to find.
              </h2>
              <p className="font-serif text-[17px] leading-relaxed text-[#62685E]">
                Funding calls, conferences, journals, publications, and potential collaborators live across disconnected sources. The challenge is finding what matters, understanding why it matters, and knowing what to do next.
              </p>
              <p className="font-serif text-[17px] leading-relaxed text-[#202920] font-medium">
                Cambium is being built to make that process more connected, navigable, and useful.
              </p>
            </div>

            {/* Right Editorial Problem-to-Possibility Composition */}
            <div className="lg:col-span-6">
              <div className="rounded-2xl border border-[#E4DCCB] bg-white p-7 sm:p-8 shadow-sm relative overflow-hidden">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
                  {/* Fragmented Column */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 pb-2 border-b border-red-200">
                      <span className="w-2 h-2 rounded-full bg-red-400" />
                      <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-red-700">
                        Disconnected Reality
                      </span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-red-50/40 border border-red-100 text-xs font-sans text-red-950/80 space-y-1">
                      <div className="font-semibold">Fragmented Portals</div>
                      <div className="text-[11px] text-[#85877B]">Dozens of standalone agency databases with unique schemas</div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-red-50/40 border border-red-100 text-xs font-sans text-red-950/80 space-y-1">
                      <div className="font-semibold">Unseen Deadlines</div>
                      <div className="text-[11px] text-[#85877B]">Calls discovered 48 hours after submissions close</div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-red-50/40 border border-red-100 text-xs font-sans text-red-950/80 space-y-1">
                      <div className="font-semibold">Opaque Relevance</div>
                      <div className="text-[11px] text-[#85877B]">Keyword search misses interdisciplinary opportunities</div>
                    </div>
                  </div>

                  {/* Connected Possibility Column */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 pb-2 border-b border-[#3E6248]/30">
                      <span className="w-2 h-2 rounded-full bg-[#3E6248]" />
                      <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#3E6248]">
                        Cambium Synthesis
                      </span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#FAF7F0] border border-[#66866A]/30 text-xs font-sans text-[#202920] space-y-1">
                      <div className="font-semibold text-[#3E6248]">Unified Topology</div>
                      <div className="text-[11px] text-[#62685E]">Grants, CFPs, and preprint citations in one relational graph</div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#FAF7F0] border border-[#66866A]/30 text-xs font-sans text-[#202920] space-y-1">
                      <div className="font-semibold text-[#3E6248]">Continuous Cadence</div>
                      <div className="text-[11px] text-[#62685E]">Track deadlines, synced milestones, and peer alerts</div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#FAF7F0] border border-[#66866A]/30 text-xs font-sans text-[#202920] space-y-1">
                      <div className="font-semibold text-[#3E6248]">Evidence Matching</div>
                      <div className="text-[11px] text-[#62685E]">Traceable alignment anchored directly in verified source calls</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 03: WHAT WE'RE BUILDING ─── */}
      <section className="py-20 sm:py-28 border-b border-[#E4DCCB] bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="max-w-3xl mb-14">
            <span className="font-mono text-xs uppercase tracking-widest text-[#3E6248] font-semibold">
              Platform Capabilities
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal leading-tight text-[#202920] mt-3">
              From scattered information to connected discovery.
            </h2>
          </div>

          {/* Varied Visual Weight Layout (Avoid identical card grid) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* 01 — Discover opportunities (Wide focal card) */}
            <div className="md:col-span-7 bg-[#FAF7F0] rounded-2xl p-8 border border-[#E4DCCB] flex flex-col justify-between hover:border-[#3E6248]/50 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-xs font-bold text-[#3E6248] uppercase tracking-wider">
                    01 — Global Scope
                  </span>
                  <Compass size={22} className="text-[#3E6248]" />
                </div>
                <h3 className="font-serif text-2xl font-normal text-[#202920] mb-3">
                  Discover opportunities
                </h3>
                <p className="font-serif text-[16px] leading-relaxed text-[#62685E]">
                  Explore grants, funding calls, calls for papers, conferences, journals, and other research opportunities from relevant sources.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-[#E4DCCB]/60 flex items-center gap-2 text-xs font-mono text-[#85877B]">
                <span>Indexed Sources: NSF, NIH, Horizon Europe, IEEE, Springer</span>
              </div>
            </div>

            {/* 02 — Navigate scholarly knowledge */}
            <div className="md:col-span-5 bg-white rounded-2xl p-8 border border-[#E4DCCB] shadow-2xs flex flex-col justify-between hover:border-[#3E6248]/50 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-xs font-bold text-[#8A5A12] uppercase tracking-wider">
                    02 — Knowledge Graph
                  </span>
                  <GitBranch size={22} className="text-[#8A5A12]" />
                </div>
                <h3 className="font-serif text-2xl font-normal text-[#202920] mb-3">
                  Navigate scholarly knowledge
                </h3>
                <p className="font-serif text-[16px] leading-relaxed text-[#62685E]">
                  Find research publications, explore related topics, and follow connections across the research landscape.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-[#E4DCCB]/60 flex items-center gap-2 text-xs font-mono text-[#85877B]">
                <span>Relational Topology · Citation Graph</span>
              </div>
            </div>

            {/* 03 — Recognize relevance */}
            <div className="md:col-span-4 bg-white rounded-2xl p-8 border border-[#E4DCCB] shadow-2xs flex flex-col justify-between hover:border-[#3E6248]/50 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-xs font-bold text-[#3E6248] uppercase tracking-wider">
                    03 — Personalization
                  </span>
                  <Sparkles size={22} className="text-[#3E6248]" />
                </div>
                <h3 className="font-serif text-2xl font-normal text-[#202920] mb-3">
                  Recognize relevance
                </h3>
                <p className="font-serif text-sm leading-relaxed text-[#62685E]">
                  Use research interests, search, filtering, and personalized discovery to surface information aligned with your goals.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-[#E4DCCB]/60 text-xs font-mono text-[#85877B]">
                Tailored Vector Signals
              </div>
            </div>

            {/* 04 — Move from discovery to action */}
            <div className="md:col-span-4 bg-[#FAF7F0] rounded-2xl p-8 border border-[#E4DCCB] flex flex-col justify-between hover:border-[#3E6248]/50 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-xs font-bold text-[#202920] uppercase tracking-wider">
                    04 — Execution
                  </span>
                  <BookmarkCheck size={22} className="text-[#202920]" />
                </div>
                <h3 className="font-serif text-2xl font-normal text-[#202920] mb-3">
                  Move from discovery to action
                </h3>
                <p className="font-serif text-sm leading-relaxed text-[#62685E]">
                  Organize opportunities, save useful resources, track important deadlines, and keep meaningful research possibilities within reach.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-[#E4DCCB]/60 text-xs font-mono text-[#85877B]">
                Deadline Sync & Bookmarks
              </div>
            </div>

            {/* 05 — Connect ideas and people */}
            <div className="md:col-span-4 bg-white rounded-2xl p-8 border border-[#E4DCCB] shadow-2xs flex flex-col justify-between hover:border-[#3E6248]/50 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-xs font-bold text-[#3E6248] uppercase tracking-wider">
                    05 — Community
                  </span>
                  <Share2 size={22} className="text-[#3E6248]" />
                </div>
                <h3 className="font-serif text-2xl font-normal text-[#202920] mb-3">
                  Connect ideas and people
                </h3>
                <p className="font-serif text-sm leading-relaxed text-[#62685E]">
                  Work toward a more connected view of research trends, potential collaborators, and emerging opportunities.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-[#E4DCCB]/60 text-xs font-mono text-[#85877B]">
                Collaborative Research Workspaces
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 04: INTELLIGENCE WITH EVIDENCE ─── */}
      <section className="py-20 sm:py-28 border-b border-[#E4DCCB] bg-[#FAF7F0]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="max-w-3xl mb-12">
            <span className="font-mono text-xs uppercase tracking-widest text-[#3E6248] font-semibold">
              Technical Philosophy
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal leading-tight text-[#202920] mt-3">
              Intelligence should help you investigate—not ask you to trust blindly.
            </h2>
            <p className="font-serif text-[17px] leading-relaxed text-[#62685E] mt-4">
              Cambium's direction is to combine structured information, relevant sources, retrieval, recommendations, and AI-assisted analysis to support better-informed research decisions.
            </p>
            <p className="font-serif text-[17px] leading-relaxed text-[#62685E] mt-2">
              Useful intelligence should help researchers investigate claims, return to sources, understand relevance, and recognize what still needs verification. AI should help researchers think and explore—not replace their judgment.
            </p>
          </div>

          {/* Custom Pipeline Diagram: SOURCE → RETRIEVAL → INTERPRETATION → HUMAN REVIEW */}
          <div className="bg-white rounded-2xl p-8 sm:p-10 border border-[#E4DCCB] shadow-sm">
            <div className="flex items-center justify-between pb-6 mb-8 border-b border-[#E4DCCB]">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#3E6248]">
                Evidence-Anchored Intelligence Architecture
              </span>
              <span className="font-mono text-[11px] text-[#85877B]">
                Traceability First
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
              {/* Step 1 */}
              <div className="p-5 rounded-xl bg-[#FAF7F0] border border-[#E4DCCB] space-y-2">
                <span className="font-mono text-xs text-[#85877B] font-bold">01 / STEP</span>
                <div className="font-sans font-semibold text-sm text-[#202920]">PRIMARY SOURCE</div>
                <p className="font-serif text-xs text-[#62685E] leading-relaxed">
                  Raw authoritative metadata, institutional CFP notices, funder guidelines, and published papers.
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-5 rounded-xl bg-[#FAF7F0] border border-[#E4DCCB] space-y-2">
                <span className="font-mono text-xs text-[#85877B] font-bold">02 / STEP</span>
                <div className="font-sans font-semibold text-sm text-[#202920]">SEMANTIC RETRIEVAL</div>
                <p className="font-serif text-xs text-[#62685E] leading-relaxed">
                  Dense pgvector embedding scans paired with relational metadata filtering to pinpoint relevant context.
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-5 rounded-xl bg-[#FAF7F0] border border-[#E4DCCB] space-y-2">
                <span className="font-mono text-xs text-[#85877B] font-bold">03 / STEP</span>
                <div className="font-sans font-semibold text-sm text-[#202920]">INTERPRETATION</div>
                <p className="font-serif text-xs text-[#62685E] leading-relaxed">
                  Synthesized eligibility digests, trend highlights, and structured summaries with cited links.
                </p>
              </div>

              {/* Step 4 */}
              <div className="p-5 rounded-xl bg-[#FAF7F0] border-2 border-[#3E6248] space-y-2">
                <span className="font-mono text-xs text-[#3E6248] font-bold">04 / CORE ANCHOR</span>
                <div className="font-sans font-semibold text-sm text-[#3E6248]">HUMAN REVIEW</div>
                <p className="font-serif text-xs text-[#202920] font-medium leading-relaxed">
                  The researcher inspects the source, verifies deadlines, assesses alignment, and makes the final decision.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 05: WHY CAMBIUM? ─── */}
      <section className="py-20 sm:py-28 border-b border-[#E4DCCB] bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Abstract Botanical Cambium Visual */}
            <div className="lg:col-span-5 order-2 lg:order-1 flex justify-center">
              <div className="w-[320px] h-[320px] sm:w-[380px] sm:h-[380px] rounded-full border border-[#E4DCCB] bg-[#FAF7F0] p-6 flex items-center justify-center relative shadow-sm">
                {/* Concentric botanical layers */}
                <div className="w-full h-full rounded-full border border-[#66866A]/30 p-6 flex items-center justify-center">
                  <div className="w-full h-full rounded-full border-2 border-dashed border-[#3E6248]/40 p-6 flex items-center justify-center">
                    <div className="w-full h-full rounded-full bg-[#DCE6D7]/40 border border-[#66866A]/40 flex flex-col items-center justify-center p-4 text-center">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#3E6248] mb-2 animate-pulse" />
                      <span className="font-serif text-base font-semibold text-[#202920]">Vascular Cambium</span>
                      <span className="font-mono text-[10px] text-[#3E6248] uppercase tracking-wider mt-1">
                        Active Growth Layer
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Narrative */}
            <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
              <span className="font-mono text-xs uppercase tracking-widest text-[#3E6248] font-semibold">
                The Botanical Metaphor
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-normal leading-tight text-[#202920]">
                Growth happens in the <span className="italic text-[#3E6248]">connections</span>.
              </h2>
              <p className="font-serif text-[17px] leading-relaxed text-[#62685E]">
                In living systems, cambium is the growing tissue that enables a plant to develop. We chose the name as a metaphor for research: knowledge grows through connections, ideas develop through exchange, and meaningful progress emerges over time.
              </p>
              <p className="font-serif text-[17px] leading-relaxed text-[#202920]">
                Cambium is being built around that principle—not simply as a directory of opportunities, but as a developing intelligence layer designed to help research possibilities connect and grow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 06: OUR PRINCIPLES ─── */}
      <section id="principles" className="py-20 sm:py-28 border-b border-[#E4DCCB] bg-[#FAF7F0] scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="max-w-2xl mb-14">
            <span className="font-mono text-xs uppercase tracking-widest text-[#3E6248] font-semibold">
              Guiding Convictions
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal leading-tight text-[#202920] mt-3">
              What guides the work.
            </h2>
          </div>

          {/* Calm, readable, editorial list with restrained dividers */}
          <div className="divide-y divide-[#E4DCCB] border-y border-[#E4DCCB]">
            {[
              {
                num: "01",
                title: "Relevance over volume",
                desc: "Help people find what matters, not merely more results.",
              },
              {
                num: "02",
                title: "Evidence over unsupported certainty",
                desc: "Keep information traceable to sources wherever possible and treat AI interpretations critically.",
              },
              {
                num: "03",
                title: "Connections over silos",
                desc: "Make relationships between opportunities, publications, topics, and people easier to explore.",
              },
              {
                num: "04",
                title: "Useful action over endless browsing",
                desc: "Help researchers discover, evaluate, organize, and act.",
              },
              {
                num: "05",
                title: "Human judgment at the center",
                desc: "Support critical thinking without replacing it.",
              },
            ].map((p) => (
              <div key={p.num} className="py-7 grid grid-cols-1 md:grid-cols-12 gap-4 items-baseline">
                <span className="md:col-span-2 font-mono text-xs font-semibold text-[#85877B]">
                  PRINCIPLE {p.num}
                </span>
                <h3 className="md:col-span-4 font-serif text-xl sm:text-2xl font-normal text-[#202920]">
                  {p.title}
                </h3>
                <p className="md:col-span-6 font-serif text-[16px] text-[#62685E] leading-relaxed m-0">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 07: WHO WE'RE BUILDING FOR ─── */}
      <section className="py-20 sm:py-28 border-b border-[#E4DCCB] bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="font-mono text-xs uppercase tracking-widest text-[#3E6248] font-semibold">
                Scholarly Community
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-normal leading-tight text-[#202920]">
                For people moving research forward.
              </h2>
              <p className="font-serif text-[17px] leading-relaxed text-[#62685E]">
                Our long-term ambition is to make research discovery more accessible, connected, and actionable.
              </p>
            </div>

            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { role: "Students & Early-Career Researchers", note: "Discovering first grant calls and conference deadlines" },
                  { role: "Graduate & Doctoral Scholars", note: "Mapping literature trends and co-authorship networks" },
                  { role: "Faculty & Principal Investigators", note: "Coordinating multi-year institutional funding portfolios" },
                  { role: "Research Supervisors & Mentors", note: "Connecting student inquiry with verified fellowship tracks" },
                  { role: "Independent Scholars", note: "Navigating open-access repositories and cross-disciplinary calls" },
                  { role: "Laboratories & Research Institutions", note: "Organizing collective scholarly momentum and milestones" },
                ].map((item, i) => (
                  <div key={i} className="p-5 rounded-xl border border-[#E4DCCB] bg-[#FAF7F0] space-y-1">
                    <div className="font-sans font-semibold text-sm text-[#202920]">{item.role}</div>
                    <div className="font-serif text-xs text-[#85877B]">{item.note}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 08: WHERE WE'RE GOING ─── */}
      <section className="py-20 sm:py-24 border-b border-[#E4DCCB] bg-[#FAF7F0]">
        <div className="max-w-4xl mx-auto px-6 sm:px-10 text-center space-y-6">
          <span className="font-mono text-xs uppercase tracking-widest text-[#3E6248] font-semibold">
            Long-Term Vision
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[44px] font-normal leading-tight text-[#202920]">
            More time for discovery. Less time lost finding it.
          </h2>
          <p className="font-serif text-lg leading-relaxed text-[#62685E] max-w-2xl mx-auto">
            We envision a future where researchers spend less time navigating fragmented information and more time asking meaningful questions, finding relevant opportunities, and advancing their work.
          </p>
          <p className="font-mono text-xs text-[#85877B] uppercase tracking-wider">
            Cambium is being developed toward that future, one useful capability at a time.
          </p>
        </div>
      </section>

      {/* ─── SECTION 09: CLOSING CTA ─── */}
      <section className="py-20 sm:py-24 border-b border-[#E4DCCB] bg-white text-center">
        <div className="max-w-3xl mx-auto px-6 sm:px-10 space-y-6">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#202920] tracking-tight">
            Research deserves better connections.
          </h2>
          <p className="font-serif text-lg text-[#62685E] leading-relaxed">
            Discover where your next research opportunity might begin.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/opportunities"
              className="bg-[#3E6248] hover:bg-[#293E30] text-[#FAF7F0] px-8 py-3.5 rounded-full font-sans text-xs font-semibold uppercase tracking-wider shadow-sm transition-all duration-200 inline-flex items-center gap-2 no-underline border border-[#66866A]/30"
            >
              <span>Explore Research</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/contact"
              className="bg-white hover:bg-[#F2EBDD] text-[#202920] px-8 py-3.5 rounded-full font-sans text-xs font-semibold uppercase tracking-wider border border-[#E4DCCB] transition-colors inline-flex items-center gap-2 no-underline shadow-2xs"
            >
              <span>Get in Touch</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── SECTION 10: A NOTE FROM THE BUILDER ─── */}
      <section className="py-20 sm:py-28 bg-[#FAF7F0]">
        <div className="max-w-6xl mx-auto px-6 sm:px-10">
          <div className="rounded-3xl border border-[#E4DCCB] bg-white p-8 sm:p-14 shadow-md relative overflow-hidden">
            {/* Massive decorative background quotation mark */}
            <span
              className="font-serif text-[180px] sm:text-[240px] text-[#3E6248]/10 leading-none select-none absolute -top-12 right-6 pointer-events-none font-bold"
              aria-hidden="true"
            >
              “
            </span>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center relative z-10">
              {/* Left Column: Massive Round Portrait & Identity Card */}
              <div className="lg:col-span-4 flex flex-col items-center text-center">
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full p-2 bg-[#FAF7F0] border-2 border-[#E4DCCB] shadow-xl ring-4 ring-[#3E6248]/15 shrink-0 transition-transform duration-300 hover:scale-[1.02]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/Profile.png"
                    alt="Shaik Mohamed Imthiyas - Builder of Cambium"
                    className="w-full h-full rounded-full object-cover object-top shadow-inner"
                  />
                  {/* Verified Shield Badge */}
                  <div
                    className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 bg-[#3E6248] text-white p-2.5 rounded-full border-2 border-white shadow-lg"
                    title="Verified Platform Architect"
                  >
                    <ShieldCheck size={20} />
                  </div>
                </div>

                <div className="mt-5 space-y-1">
                  <h4 className="font-serif text-2xl font-normal text-[#202920]">
                    Shaik Mohamed Imthiyas
                  </h4>
                  <span className="font-mono text-xs text-[#3E6248] font-bold uppercase tracking-wider block">
                    Builder & Lead Architect
                  </span>
                  <span className="font-mono text-[11px] text-[#85877B] block">
                    Cambium · Kalvium Community Capstone 2026
                  </span>
                </div>

                <Link
                  href="/portfolio"
                  className="mt-5 text-xs font-mono uppercase tracking-wider text-[#3E6248] hover:text-white bg-[#FAF7F0] hover:bg-[#3E6248] inline-flex items-center gap-2 no-underline border border-[#E4DCCB] px-5 py-2.5 rounded-full transition-all duration-200 shadow-2xs group cursor-pointer"
                >
                  <span>Explore Portfolio & Identity</span>
                  <ExternalLink size={13} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>

              {/* Right Column: Narrative & Massive Quote Callout */}
              <div className="lg:col-span-8 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DCE6D7]/60 border border-[#66866A]/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3E6248]" />
                  <span className="font-mono text-xs uppercase tracking-widest text-[#3E6248] font-semibold">
                    A Note from the Builder
                  </span>
                </div>

                <h3 className="font-serif text-3xl sm:text-4xl font-normal text-[#202920] leading-tight m-0">
                  Built with curiosity. Designed around research.
                </h3>

                <div className="space-y-4 font-serif text-[17px] sm:text-[18px] leading-[1.8] text-[#202920]/90">
                  <p>
                    I&apos;m <strong className="font-semibold text-[#202920]">Shaik Mohamed Imthiyas</strong>, the builder behind Cambium.
                  </p>
                  <p>
                    I started working on Cambium around a simple observation: discovering valuable research opportunities often means navigating fragmented sources, scattered deadlines, and information that is difficult to connect.
                  </p>
                  <p>
                    I want to explore how thoughtful product design, reliable data systems, and carefully evaluated AI can make that process more focused and useful.
                  </p>
                  <p>
                    Cambium is my effort to turn that idea into a practical research-intelligence platform—one that helps researchers spend less time searching across disconnected sources and more time exploring opportunities worth pursuing.
                  </p>
                </div>

                {/* Massive Quotes Highlight Box */}
                <div className="relative my-7 p-7 rounded-2xl bg-[#FAF7F0] border-l-[6px] border-l-[#3E6248] border border-[#E4DCCB] shadow-2xs">
                  <span
                    className="font-serif text-6xl text-[#3E6248]/30 leading-none absolute -top-3 left-4 select-none pointer-events-none font-bold"
                    aria-hidden="true"
                  >
                    “
                  </span>
                  <blockquote className="font-serif text-xl sm:text-2xl italic font-normal text-[#202920] leading-snug pl-6 pr-6 m-0">
                    The goal isn&apos;t to replace a researcher&apos;s judgment. It&apos;s to give that judgment better information to work with.
                  </blockquote>
                  <span
                    className="font-serif text-6xl text-[#3E6248]/30 leading-none absolute -bottom-8 right-6 select-none pointer-events-none font-bold"
                    aria-hidden="true"
                  >
                    ”
                  </span>
                </div>

                <div className="pt-2 flex items-center justify-between flex-wrap gap-4 text-xs font-mono text-[#85877B]">
                  <span>Cambium Core Intelligence Architecture · Shaik Mohamed Imthiyas</span>
                  <span className="text-[#3E6248] font-semibold">Verified Capstone Project</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
