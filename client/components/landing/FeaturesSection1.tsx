"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function LifecycleSection() {
  const stages = ["Discover", "Explore", "Connect", "Work", "Publish", "Share", "Grow"];

  return (
    <section className="bg-background-alt border-y border-border py-20 lg:py-32 px-6 md:px-20">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="font-serif text-3xl md:text-5xl font-normal tracking-tight text-foreground mb-4">
          One system for the entire research lifecycle.
        </h2>
        <p className="text-base text-muted-foreground mb-16">
          From first question to published work and beyond.
        </p>

        <div className="flex items-center justify-center flex-wrap">
          {stages.map((stage, i) => (
            <div key={stage} className="flex items-center">
              <div className="flex flex-col items-center gap-3 px-2 cursor-default group">
                <div
                  className={`w-12 h-12 rounded-full border-[1.5px] flex items-center justify-center text-xs font-semibold transition-all duration-200 ${
                    i === 0
                      ? "border-primary bg-primary-light text-primary"
                      : "border-border bg-background text-muted-foreground group-hover:border-primary group-hover:bg-primary-light group-hover:text-primary"
                  }`}
                >
                  {i + 1}
                </div>
                <span className="text-[13px] font-medium text-foreground">
                  {stage}
                </span>
              </div>
              {i < stages.length - 1 && (
                <div className="w-8 h-px bg-border mb-5" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function IdentitySection() {
  const [activeTab, setActiveTab] = useState("Overview");
  const tabs = ["Overview", "Research", "Projects", "Publications", "Activity", "Notes"];
  const interests = ["Computer Vision", "Multimodal AI", "Scientific ML", "Medical Imaging"];
  const metrics = [
    { v: "27", l: "Publications" },
    { v: "1.8k", l: "Citations" },
    { v: "8", l: "Projects" },
    { v: "34", l: "Collaborators" },
  ];

  return (
    <section className="bg-background py-20 lg:py-32 px-6 md:px-20" id="research">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-20 items-start">
        {/* Left: copy */}
        <div className="pt-6">
          <p className="text-[11px] font-semibold tracking-[0.1em] text-primary uppercase mb-5">
            Academic Identity
          </p>
          <h2 className="font-serif text-3xl md:text-[48px] font-normal leading-[1.1] tracking-tight text-foreground mb-6">
            More than a profile.<br />Your research identity.
          </h2>
          <p className="text-[17px] leading-relaxed text-muted-foreground mb-10">
            Your academic presence, publication record, research activity,
            collaborations, and portfolio — unified in a living identity that grows
            with your work.
          </p>
          <div className="flex flex-col gap-4">
            {[
              "Academic profile & publication record",
              "Research portfolio & projects",
              "Collaboration network",
              "Research activity timeline",
              "Public research notes",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Profile mockup */}
        <Card className="overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.06)] border-border">
          {/* Profile header */}
          <div className="bg-[#F0EEE8] pt-7 px-7 border-b border-border">
            <div className="flex gap-5 items-start mb-5">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl shrink-0">
                MC
              </div>
              <div className="flex-1">
                <div className="font-bold text-[17px] text-foreground tracking-tight">
                  Dr. Maya Chen
                </div>
                <div className="text-[13px] text-muted-foreground mt-1">
                  PhD Researcher · Computer Vision
                </div>
                <div className="text-xs text-muted-foreground/70 mt-0.5">
                  MIT Computer Science
                </div>
                <div className="flex gap-1.5 mt-2.5 flex-wrap">
                  {interests.map((t) => (
                    <Badge key={t} variant="secondary" className="text-[11px]">
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>
              <Button size="sm" variant="primary" className="h-8">Follow</Button>
            </div>

            {/* Bio */}
            <p className="text-[13px] text-muted-foreground leading-[1.6] mb-4">
              Researching multimodal learning, scientific imaging, and AI for discovery.
            </p>

            {/* Metrics */}
            <div className="flex border-t border-border">
              {metrics.map(({ v, l }, i) => (
                <div
                  key={l}
                  className={`flex-1 py-3.5 text-center ${
                    i < metrics.length - 1 ? "border-r border-border" : ""
                  }`}
                >
                  <div className="text-lg font-bold text-foreground tracking-tight">{v}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{l}</div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="flex mt-0">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3.5 py-2.5 text-xs font-medium border-b-2 transition-colors ${
                    activeTab === tab
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          <div className="p-6 bg-background">
            {activeTab === "Overview" ? (
              <div className="flex flex-col gap-3">
                <p className="text-xs font-semibold tracking-[0.06em] text-muted-foreground uppercase mb-1">
                  Recent Publications
                </p>
                {[
                  { title: "Vision-Language Models for Scientific Discovery", venue: "NeurIPS 2025", citations: 312 },
                  { title: "Multimodal Representations for Medical Imaging", venue: "CVPR 2024", citations: 180 },
                ].map((p) => (
                  <div key={p.title} className="p-3.5 border border-border rounded-md">
                    <div className="text-[13px] font-medium text-foreground leading-[1.4] mb-1.5">
                      {p.title}
                    </div>
                    <div className="flex gap-3 text-[11px] text-muted-foreground">
                      <span>{p.venue}</span>
                      <span className="text-primary">↑ {p.citations} citations</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground text-[13px]">
                {activeTab} view — full content on your Cambium profile.
              </div>
            )}
          </div>
        </Card>
      </div>
    </section>
  );
}

export function WorkspaceSection() {
  const sidebarItems = [
    { icon: "📁", label: "Research Workspace", active: false, indent: 0 },
    { icon: "📄", label: "Literature Review", active: true, indent: 1 },
    { icon: "📝", label: "Research Notes", active: false, indent: 1 },
    { icon: "🧪", label: "Experiments", active: false, indent: 1 },
    { icon: "💡", label: "Ideas", active: false, indent: 1 },
    { icon: "📚", label: "Reading List", active: false, indent: 1 },
    { icon: "📋", label: "Thesis", active: false, indent: 1 },
    { icon: "✏️", label: "Draft Papers", active: false, indent: 1 },
    { icon: "🔗", label: "References", active: false, indent: 1 },
  ];

  return (
    <section className="bg-[#F0EEE8] border-t border-border py-20 lg:py-32 px-6 md:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[11px] font-semibold tracking-[0.1em] text-primary uppercase mb-4">
            Research Workspace
          </p>
          <h2 className="font-serif text-3xl md:text-[48px] font-normal tracking-tight text-foreground mb-4">
            Your research has a home.
          </h2>
          <p className="text-[17px] text-muted-foreground max-w-lg mx-auto">
            Organize your notes, literature, experiments, and drafts in a structured
            research environment built for scholarly work.
          </p>
        </div>

        {/* Workspace mockup */}
        <div className="grid md:grid-cols-[220px_1fr] border border-border rounded-lg overflow-hidden shadow-[0_12px_48px_rgba(0,0,0,0.07)] bg-background min-h-[480px]">
          {/* Sidebar */}
          <div className="bg-background-alt border-r border-border py-5">
            <div className="px-4 pb-4 border-b border-border mb-2">
              <div className="text-[11px] font-semibold tracking-[0.06em] text-muted-foreground uppercase">
                Workspace
              </div>
            </div>
            {sidebarItems.map(({ icon, label, active, indent }) => (
              <div
                key={label}
                className={`text-[12.5px] cursor-pointer flex items-center gap-2 transition-colors ${
                  active
                    ? "font-medium text-foreground bg-primary-light border-l-2 border-primary"
                    : "font-normal text-muted-foreground bg-transparent border-l-2 border-transparent hover:bg-background"
                }`}
                style={{ padding: `7px ${16 + indent * 12}px` }}
              >
                <span className="text-[11px]">{icon}</span>
                {label}
              </div>
            ))}
          </div>

          {/* Document */}
          <div className="p-8 overflow-auto">
            <div className="mb-6 flex items-center gap-2">
              <span className="text-[11px] text-muted-foreground/70">Literature Review</span>
              <span className="text-[11px] text-muted-foreground/70">/</span>
              <span className="text-[11px] font-medium text-foreground">Multimodal Learning</span>
            </div>

            <h3 className="font-serif text-2xl font-semibold text-foreground tracking-tight mb-2">
              Multimodal Learning — Literature Review
            </h3>

            <div className="flex gap-2 mb-5 flex-wrap">
              {["Computer Vision", "Multimodal AI", "Foundation Models"].map((t) => (
                <Badge key={t} variant="secondary" className="text-[11px]">
                  {t}
                </Badge>
              ))}
            </div>

            <div className="mb-6 p-4 bg-background-alt border-l-[3px] border-primary rounded-r-md">
              <div className="text-[11px] font-semibold text-primary tracking-[0.06em] uppercase mb-1.5">
                Research Question
              </div>
              <p className="text-sm text-foreground leading-[1.6]">
                How can multimodal models improve scientific literature discovery?
              </p>
            </div>

            <div className="mb-5">
              <div className="text-[13px] font-semibold text-foreground mb-3">Key Findings</div>
              {[
                "Cross-modal retrieval improves discovery quality significantly over single-modality approaches.",
                "Domain-specific embeddings outperform generic representations in scientific contexts.",
                "Citation context provides useful relevance signals for downstream ranking tasks.",
              ].map((finding, i) => (
                <div key={i} className="flex gap-3 mb-2.5 text-[13px] text-muted-foreground leading-[1.6]">
                  <span className="text-primary font-semibold shrink-0">{i + 1}.</span>
                  {finding}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
