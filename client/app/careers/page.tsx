"use client";

import React from "react";
import Link from "next/link";
import { PublicHeader } from "@/components/PublicHeader";
import Footer from "@/components/Footer";
import {
  ArrowRight,
  ArrowUpRight,
  Code2,
  Brain,
  Database,
  Palette,
  Users2,
  CheckCircle2,
  Mail,
  ShieldAlert,
  Sparkles,
  GitPullRequest,
  Compass,
} from "lucide-react";

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#202920] selection:bg-[#3E6248]/20 selection:text-[#173F35]">
      <PublicHeader />

      {/* ─── SECTION 01: HERO ─── */}
      <section className="relative overflow-hidden pt-16 sm:pt-24 pb-20 border-b border-[#E4DCCB]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DCE6D7]/60 border border-[#66866A]/30 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3E6248] animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-widest text-[#3E6248] font-semibold">
                Careers & Contributions
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[58px] font-normal leading-[1.12] tracking-tight text-[#202920] mb-4">
              Help research <span className="italic text-[#3E6248]">grow</span>.
            </h1>

            <h2 className="font-serif text-xl sm:text-2xl text-[#3E6248] font-normal mb-6">
              Build technology that helps people discover what comes next.
            </h2>

            <p className="font-serif text-lg leading-relaxed text-[#62685E] mb-6">
              Research creates possibilities, but discovering the right opportunity and connecting the right information can still be unnecessarily difficult.
            </p>

            <p className="font-serif text-base leading-relaxed text-[#62685E] mb-8">
              Cambium is being built to improve that experience through thoughtful product design, reliable research data, and AI-assisted intelligence grounded in evidence. We&apos;re interested in people who care about the problem, think critically about the solution, and want to build software that serves a meaningful purpose.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#current-opportunities"
                className="bg-[#3E6248] hover:bg-[#293E30] text-[#FAF7F0] px-7 py-3.5 rounded-full font-sans text-xs font-semibold uppercase tracking-wider shadow-sm transition-all duration-200 inline-flex items-center gap-2 no-underline border border-[#66866A]/30"
              >
                <span>View Opportunities</span>
                <ArrowRight size={14} />
              </a>
              <Link
                href="/contact?type=careers"
                className="bg-white hover:bg-[#F2EBDD] text-[#202920] px-7 py-3.5 rounded-full font-sans text-xs font-semibold uppercase tracking-wider border border-[#E4DCCB] transition-colors inline-flex items-center gap-2 no-underline shadow-2xs"
              >
                <span>Introduce Yourself</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 02: WHAT WE'RE BUILDING (5 DISCIPLINES) ─── */}
      <section className="py-20 sm:py-28 border-b border-[#E4DCCB] bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="max-w-3xl mb-14">
            <span className="font-mono text-xs uppercase tracking-widest text-[#3E6248] font-semibold">
              Disciplinary Inquiries
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#202920] mt-3">
              One problem. Many disciplines.
            </h2>
            <p className="font-serif text-[17px] text-[#62685E] leading-relaxed mt-3">
              Cambium is an AI-powered Research Intelligence Platform focused on connecting research opportunities, scholarly information, and actionable discovery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Product engineering */}
            <div className="p-7 rounded-2xl bg-[#FAF7F0] border border-[#E4DCCB] space-y-3 hover:border-[#3E6248]/50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#E4DCCB] flex items-center justify-center text-[#3E6248]">
                <Code2 size={20} />
              </div>
              <h3 className="font-serif text-xl font-normal text-[#202920]">
                Product engineering
              </h3>
              <p className="font-serif text-sm leading-relaxed text-[#62685E]">
                Build dependable search, discovery, personalization, saved opportunities, and research workflows.
              </p>
            </div>

            {/* AI and research intelligence */}
            <div className="p-7 rounded-2xl bg-[#FAF7F0] border border-[#E4DCCB] space-y-3 hover:border-[#3E6248]/50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#E4DCCB] flex items-center justify-center text-[#3E6248]">
                <Brain size={20} />
              </div>
              <h3 className="font-serif text-xl font-normal text-[#202920]">
                AI and research intelligence
              </h3>
              <p className="font-serif text-sm leading-relaxed text-[#62685E]">
                Explore retrieval-augmented generation, semantic search, evaluation, recommendations, and trustworthy AI-assisted research.
              </p>
            </div>

            {/* Data engineering */}
            <div className="p-7 rounded-2xl bg-[#FAF7F0] border border-[#E4DCCB] space-y-3 hover:border-[#3E6248]/50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#E4DCCB] flex items-center justify-center text-[#3E6248]">
                <Database size={20} />
              </div>
              <h3 className="font-serif text-xl font-normal text-[#202920]">
                Data engineering
              </h3>
              <p className="font-serif text-sm leading-relaxed text-[#62685E]">
                Help transform fragmented research sources into structured, searchable, traceable information.
              </p>
            </div>

            {/* Product design */}
            <div className="p-7 rounded-2xl bg-[#FAF7F0] border border-[#E4DCCB] space-y-3 hover:border-[#3E6248]/50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#E4DCCB] flex items-center justify-center text-[#3E6248]">
                <Palette size={20} />
              </div>
              <h3 className="font-serif text-xl font-normal text-[#202920]">
                Product design
              </h3>
              <p className="font-serif text-sm leading-relaxed text-[#62685E]">
                Create a research experience that feels clear, considered, accessible, and genuinely useful—without unnecessary complexity.
              </p>
            </div>

            {/* Research and partnerships */}
            <div className="p-7 rounded-2xl bg-[#FAF7F0] border border-[#E4DCCB] space-y-3 hover:border-[#3E6248]/50 transition-colors md:col-span-2 lg:col-span-2">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#E4DCCB] flex items-center justify-center text-[#3E6248]">
                <Users2 size={20} />
              </div>
              <h3 className="font-serif text-xl font-normal text-[#202920]">
                Research and partnerships
              </h3>
              <p className="font-serif text-sm leading-relaxed text-[#62685E]">
                Understand researcher needs, evaluate data sources, and explore ways to make research discovery more connected.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 03: WHO MIGHT FIT ─── */}
      <section className="py-20 sm:py-28 border-b border-[#E4DCCB] bg-[#FAF7F0]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="max-w-3xl mb-12">
            <span className="font-mono text-xs uppercase tracking-widest text-[#3E6248] font-semibold">
              Values & Craft
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#202920] mt-3">
              Curiosity matters. Craft matters. Judgment matters.
            </h2>
            <p className="font-serif text-[17px] text-[#62685E] leading-relaxed mt-3">
              We value people who demonstrate:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl">
            {[
              "Curiosity about research, technology, and real-world problems.",
              "A willingness to investigate before proposing a solution.",
              "Strong judgment about quality, reliability, and trade-offs.",
              "Care for the people who will use what they build.",
              "Clear communication and a willingness to learn.",
              "Evidence of work through projects, research, writing, design, or engineering.",
            ].map((v, i) => (
              <div
                key={i}
                className="p-5 rounded-xl bg-white border border-[#E4DCCB] flex items-start gap-3.5 shadow-2xs"
              >
                <span className="font-mono text-xs font-bold text-[#3E6248] mt-0.5 shrink-0">
                  0{i + 1}
                </span>
                <p className="font-serif text-sm text-[#202920] leading-relaxed m-0">{v}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 p-6 rounded-2xl bg-white border border-[#E4DCCB] max-w-4xl">
            <p className="font-serif text-[16px] text-[#62685E] leading-relaxed m-0">
              You do not need to fit a conventional career path to contribute meaningfully. Students, early-career builders, researchers, designers, and experienced practitioners may all bring valuable perspectives.
            </p>
          </div>
        </div>
      </section>

      {/* ─── SECTION 04: HOW YOU COULD CONTRIBUTE ─── */}
      <section className="py-20 sm:py-28 border-b border-[#E4DCCB] bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="max-w-3xl mb-12">
            <span className="font-mono text-xs uppercase tracking-widest text-[#3E6248] font-semibold">
              Contribution Areas
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#202920] mt-3">
              Bring your perspective. Build something useful.
            </h2>
            <p className="font-serif text-[17px] text-[#62685E] leading-relaxed mt-3">
              Depending on project needs and available opportunities, contributions may include:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl">
            {[
              "Frontend and full-stack engineering",
              "Backend systems and API development",
              "Research data ingestion and quality",
              "AI retrieval, recommendation, and evaluation",
              "UX research and interface design",
              "Documentation, testing, and developer experience",
              "Research partnerships and product exploration",
            ].map((c, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-[#FAF7F0] border border-[#E4DCCB] flex items-center gap-3"
              >
                <GitPullRequest size={16} className="text-[#3E6248] shrink-0" />
                <span className="font-sans text-xs font-medium text-[#202920]">{c}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 rounded-xl bg-[#FAF7F0] border border-[#E4DCCB] max-w-3xl">
            <span className="font-mono text-xs text-[#85877B]">
              <strong className="text-[#202920] font-sans">Important clarification:</strong> These areas describe the kinds of work relevant to Cambium. They are not a statement that positions are currently open.
            </span>
          </div>
        </div>
      </section>

      {/* ─── SECTION 05: OUR APPROACH TO BUILDING ─── */}
      <section className="py-20 sm:py-28 border-b border-[#E4DCCB] bg-[#FAF7F0]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="max-w-2xl mb-14">
            <span className="font-mono text-xs uppercase tracking-widest text-[#3E6248] font-semibold">
              Engineering Ethos
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#202920] mt-3">
              How we want to work.
            </h2>
          </div>

          <div className="divide-y divide-[#E4DCCB] border-y border-[#E4DCCB]">
            {[
              {
                title: "Purpose before feature count",
                desc: "Solve meaningful research problems rather than accumulating features without direction.",
              },
              {
                title: "Evidence before assumptions",
                desc: "Value investigation, testing, and clear reasoning over unsupported claims.",
              },
              {
                title: "Craft over shortcuts",
                desc: "Build maintainable systems, thoughtful interfaces, reliable data, and work that holds up under scrutiny.",
              },
              {
                title: "Learning through building",
                desc: "Learn, experiment responsibly, and improve through feedback.",
              },
              {
                title: "Responsible AI",
                desc: "Build AI capabilities that are useful, evaluable, and transparent about uncertainty.",
              },
            ].map((principle, idx) => (
              <div key={idx} className="py-7 grid grid-cols-1 md:grid-cols-12 gap-4 items-baseline">
                <span className="md:col-span-2 font-mono text-xs font-semibold text-[#85877B]">
                  0{idx + 1} / ETHOS
                </span>
                <h3 className="md:col-span-4 font-serif text-xl sm:text-2xl font-normal text-[#202920]">
                  {principle.title}
                </h3>
                <p className="md:col-span-6 font-serif text-[16px] text-[#62685E] leading-relaxed m-0">
                  {principle.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 06 & 07: CURRENT OPPORTUNITIES & INTRODUCE YOURSELF (CONNECTED SPLIT VIEW) ─── */}
      <section
        id="opportunities-and-collaboration"
        className="py-20 sm:py-28 border-b border-[#E4DCCB] bg-[#FAF7F0] scroll-mt-24"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="max-w-3xl mb-12">
            <span className="font-mono text-xs uppercase tracking-widest text-[#3E6248] font-semibold">
              Opportunities & Collaborative Inquiries
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#202920] mt-3">
              Where we are building — and how to join us.
            </h2>
            <p className="font-serif text-[17px] text-[#62685E] leading-relaxed mt-3">
              We connect our active research and engineering focus areas directly with an open invitation for prospective contributors. Explore our current domains of investigation and introduce what you want to build.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* LEFT BOX: CURRENT OPPORTUNITIES (6-7 TARGET TRACKS) */}
            <div className="lg:col-span-6 rounded-2xl border border-[#E4DCCB] bg-white p-8 sm:p-10 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-3 mb-6 pb-5 border-b border-[#E4DCCB]">
                  <div>
                    <span className="font-mono text-[11px] uppercase tracking-widest text-[#3E6248] font-semibold block">
                      Track 01 / Opportunity Spectrum
                    </span>
                    <h3 className="font-serif text-2xl font-normal text-[#202920] mt-1">
                      Current opportunities & focus areas.
                    </h3>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                    <span className="font-mono text-[10px] font-semibold text-emerald-800 uppercase tracking-wider">
                      Rolling Review
                    </span>
                  </div>
                </div>

                <p className="font-serif text-[15px] leading-relaxed text-[#62685E] mb-6">
                  Cambium is actively engaging researchers, engineers, and designers across 6 core opportunity domains:
                </p>

                <div className="space-y-3.5">
                  {[
                    {
                      role: "Knowledge Graph & Academic Ingestion Engineer",
                      desc: "Architecting high-throughput, fault-tolerant parsers and schema mappers for arXiv, PubMed, OpenAlex, and global funding bodies.",
                    },
                    {
                      role: "AI Retrieval & Grounding Evaluation Specialist",
                      desc: "Designing hybrid BM25 + dense vector pipelines, strict citation provenance verification, and hallucination evaluation frameworks.",
                    },
                    {
                      role: "Living Research Interface Designer",
                      desc: "Crafting distraction-free, typography-first scholar workspaces, interactive constellation visualizers, and scholarly reading systems.",
                    },
                    {
                      role: "Research Taxonomy & Intelligence Analyst",
                      desc: "Curating emerging interdisciplinary taxonomy trees, university laboratory clusters, and multi-year funding cycle monitoring models.",
                    },
                    {
                      role: "Full-Stack Scholar OS Engineer",
                      desc: "Building low-latency Next.js and FastAPI services, offline-first scholar notebook sync, and real-time collaboration engines.",
                    },
                    {
                      role: "Scholarly Data Ethics & Verification Fellow",
                      desc: "Auditing data provenance, AI disclaimers, open-access FAIR data compliance, and researcher citation rights.",
                    },
                  ].map((opp, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-[#FAF7F0] border border-[#E4DCCB] hover:border-[#3E6248]/40 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <span className="font-mono text-xs font-bold text-[#3E6248] mt-0.5 shrink-0">
                          0{idx + 1}
                        </span>
                        <div>
                          <h4 className="font-serif text-sm font-semibold text-[#202920]">
                            {opp.role}
                          </h4>
                          <p className="font-serif text-xs text-[#62685E] leading-relaxed mt-1 m-0">
                            {opp.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-[#E4DCCB] flex items-center justify-between text-xs font-mono text-[#85877B]">
                <span>Status: Inquiries evaluated continuously</span>
                <span className="text-[#3E6248] font-semibold">Remote / Hybrid Engagement</span>
              </div>
            </div>

            {/* RIGHT BOX: SHOW US WHAT YOU CARE ABOUT BUILDING */}
            <div className="lg:col-span-6 rounded-2xl border border-[#E4DCCB] bg-white p-8 sm:p-10 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-3 mb-6 pb-5 border-b border-[#E4DCCB]">
                  <div>
                    <span className="font-mono text-[11px] uppercase tracking-widest text-[#3E6248] font-semibold block">
                      Track 02 / Direct Introduction
                    </span>
                    <h3 className="font-serif text-2xl font-normal text-[#202920] mt-1">
                      Show us what you care about building.
                    </h3>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F0] border border-[#E4DCCB]">
                    <Sparkles size={12} className="text-[#3E6248]" />
                    <span className="font-mono text-[10px] font-semibold text-[#62685E] uppercase tracking-wider">
                      Open Door
                    </span>
                  </div>
                </div>

                <p className="font-serif text-[15px] leading-relaxed text-[#62685E] mb-5">
                  We value demonstrated work, genuine curiosity, and thoughtful reasoning over inflated titles. When introducing yourself, please share:
                </p>

                <ul className="space-y-3 font-serif text-[14px] text-[#202920]/90 leading-relaxed pl-1 list-none">
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3E6248] mt-2 shrink-0" />
                    <span><strong>Contact Information:</strong> Your name, timezone, and preferred email address.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3E6248] mt-2 shrink-0" />
                    <span><strong>Opportunity Alignment:</strong> Which domain or specific problem at Cambium excites you.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3E6248] mt-2 shrink-0" />
                    <span><strong>Evidence of Craft:</strong> Links to GitHub repos, research papers, interactive demos, or essays.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3E6248] mt-2 shrink-0" />
                    <span><strong>Why Cambium:</strong> A concise paragraph on why connected research intelligence matters to you.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3E6248] mt-2 shrink-0" />
                    <span><strong>Engagement Model:</strong> Independent research fellowship, full-time engineering, or advisory.</span>
                  </li>
                </ul>

                <div className="mt-6 p-4 rounded-xl bg-[#FAF7F0] border border-[#E4DCCB] flex items-center justify-between flex-wrap gap-3 font-mono text-xs">
                  <div className="flex items-center gap-2 text-[#3E6248]">
                    <Mail size={16} />
                    <span>careers@cambium.research</span>
                  </div>
                  <a
                    href="mailto:careers@cambium.research?subject=Cambium%20Contribution%20Introduction"
                    className="text-xs uppercase tracking-wider text-[#3E6248] hover:underline font-semibold"
                  >
                    Send Email Directly →
                  </a>
                </div>

                <div className="mt-4 p-3.5 rounded-xl bg-amber-50/50 border border-amber-200 text-xs font-serif text-[#8A5A12] leading-relaxed">
                  <strong>Privacy reminder:</strong> Please do not send confidential corporate material or sensitive personal data in your first contact.
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-[#E4DCCB] flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link
                  href="/contact?type=careers"
                  className="bg-[#3E6248] hover:bg-[#293E30] text-[#FAF7F0] px-6 py-3 rounded-full font-sans text-xs font-semibold uppercase tracking-wider transition-all inline-flex items-center justify-center gap-2 no-underline border border-[#66866A]/30 shadow-xs"
                >
                  <span>Introduce Yourself via Form</span>
                  <ArrowRight size={13} />
                </Link>
                <a
                  href="mailto:careers@cambium.research?subject=Cambium%20Contribution%20Introduction"
                  className="bg-white hover:bg-[#FAF7F0] text-[#202920] px-5 py-3 rounded-full font-sans text-xs font-semibold uppercase tracking-wider transition-all inline-flex items-center justify-center gap-1.5 no-underline border border-[#E4DCCB]"
                >
                  <Mail size={13} />
                  <span>Email Team</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 08: CLOSING CTA ─── */}
      <section className="py-20 sm:py-24 border-b border-[#E4DCCB] bg-white text-center">
        <div className="max-w-2xl mx-auto px-6 sm:px-10 space-y-5">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#202920] tracking-tight">
            Build the next connection.
          </h2>
          <p className="font-serif text-lg text-[#62685E] leading-relaxed">
            Research advances when people, ideas, and opportunities find one another. If that is a problem you care about solving, we&apos;d be glad to hear from you.
          </p>
          <div className="pt-4">
            <Link
              href="/contact"
              className="bg-[#3E6248] hover:bg-[#293E30] text-[#FAF7F0] px-8 py-3.5 rounded-full font-sans text-xs font-semibold uppercase tracking-wider shadow-sm transition-all duration-200 inline-flex items-center gap-2 no-underline border border-[#66866A]/30"
            >
              <span>Get in Touch</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── SECTION 09: FOOTER ─── */}
      <Footer />
    </div>
  );
}
