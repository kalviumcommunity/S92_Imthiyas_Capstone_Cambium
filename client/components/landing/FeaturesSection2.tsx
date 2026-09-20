"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function CommunitySection() {
  return (
    <section className="bg-background py-20 lg:py-32 px-6 md:px-20 border-t border-border" id="community">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_1.3fr] gap-12 lg:gap-20 items-center">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.1em] text-primary uppercase mb-5">
            Research Community
          </p>
          <h2 className="font-serif text-3xl md:text-[48px] font-normal leading-[1.1] tracking-tight text-foreground mb-6">
            Research is better together.
          </h2>
          <p className="text-[17px] leading-relaxed text-muted-foreground mb-10">
            Share findings, seek collaborators, announce publications, and engage with
            the scholarly community in a space designed for academic discourse.
          </p>
          <div className="flex flex-col gap-3">
            {[
              "Scholarly discussion threads",
              "Collaboration requests",
              "Publication announcements",
              "Research questions & answers",
            ].map((item) => (
              <div key={item} className="flex gap-3 items-center text-sm text-muted-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Community feed mockup */}
        <div className="flex flex-col gap-3">
          {/* Post 1 */}
          <Card className="p-5">
            <div className="flex gap-3 mb-3 items-start">
              <div className="w-9 h-9 rounded-full bg-[#4A6B8A] flex items-center justify-center text-white text-[13px] font-bold shrink-0">
                AR
              </div>
              <div>
                <div className="text-[13px] font-semibold text-foreground">Dr. Arjun Rao</div>
                <div className="text-[11px] text-muted-foreground/70">
                  Machine Learning Researcher · IISc · 2h ago
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-[1.65] mb-3.5">
              "We just released our benchmark for low-resource scientific language
              models. The gap between domain-general and domain-specific models is
              larger than we expected at small scales."
            </p>
            <div className="flex gap-2 mb-3.5 flex-wrap">
              {["Scientific NLP", "Low-Resource", "Benchmarks"].map((t) => (
                <span
                  key={t}
                  className="text-[11px] py-0.5 px-2 border border-border rounded text-muted-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
            <div className="flex gap-5 border-t border-border pt-3">
              {[
                ["💬", "24 Comments"],
                ["↗", "Share"],
                ["🔖", "Save"],
                ["＋", "Follow"],
              ].map(([icon, label]) => (
                <button
                  key={label}
                  className="text-xs text-muted-foreground/70 bg-transparent border-none cursor-pointer flex gap-1.5 items-center transition-colors hover:text-foreground"
                >
                  <span>{icon}</span>
                  {label}
                </button>
              ))}
            </div>
          </Card>

          {/* Post 2: Collaboration request */}
          <Card className="p-5 border-primary/20 border-t-2 border-t-primary shadow-[0_2px_8px_rgba(92,122,94,0.06)]">
            <div className="flex gap-2 mb-3 items-center">
              <span className="text-[11px] font-semibold py-0.5 px-2 bg-primary-light text-primary-dark rounded">
                Looking for collaborators
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-[1.65] mb-3.5">
              Working on multimodal medical imaging and looking for researchers with
              expertise in clinical validation. Experience with radiology datasets
              preferred.
            </p>
            <div className="flex gap-2 mb-3.5 flex-wrap">
              {["Medical Imaging", "Computer Vision", "Collaboration", "Clinical AI"].map((t) => (
                <span
                  key={t}
                  className="text-[11px] py-0.5 px-2 border border-border rounded text-muted-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
            <Button size="sm" variant="secondary" className="text-primary bg-primary-light hover:bg-[#D5E4D6]">
              Express interest
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
}

export function OpportunitiesSection() {
  const [activeTab, setActiveTab] = useState("Grants");
  const tabs = ["Grants", "Conferences", "Journals", "Fellowships", "Scholarships", "CFPs"];

  const opportunities: Record<string, any[]> = {
    Grants: [
      { title: "AI for Climate Research", org: "National Science Foundation", type: "Grant", deadline: "18 days", funding: "$250,000", tags: ["AI", "Climate", "Research"], hot: true },
      { title: "Biomedical Data Science Initiative", org: "NIH National Library of Medicine", type: "Grant", deadline: "42 days", funding: "$180,000", tags: ["Biomedical", "Data Science"], hot: false },
    ],
    Conferences: [
      { title: "NeurIPS 2026", org: "Neural Information Processing Systems", type: "Conference", deadline: "Sep 18", tags: ["Machine Learning", "AI", "Representation Learning"], hot: true },
      { title: "CVPR 2026", org: "Computer Vision and Pattern Recognition", type: "Conference", deadline: "Nov 1", tags: ["Computer Vision", "Robotics"], hot: false },
    ],
    Fellowships: [{ title: "Research Fellowship Program", org: "Global Research Foundation", type: "Fellowship", deadline: "Oct 4", funding: "$60,000/yr", tags: ["Open", "International"], hot: false }],
    Journals: [{ title: "Nature Machine Intelligence", org: "Springer Nature", type: "Journal", deadline: "Rolling", tags: ["AI", "ML", "High Impact"], hot: true }],
    Scholarships: [{ title: "Doctoral Excellence Award", org: "IEEE Foundation", type: "Scholarship", deadline: "Dec 15", funding: "$25,000", tags: ["PhD", "Engineering"], hot: false }],
    CFPs: [{ title: "ICML Workshop on Scientific ML", org: "ICML 2026", type: "CFP", deadline: "Mar 20", tags: ["Scientific ML", "Workshop"], hot: false }],
  };

  const items = opportunities[activeTab] || [];

  return (
    <section className="bg-background border-t border-border py-20 lg:py-32 px-6 md:px-20" id="opportunities">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12 flex-wrap gap-6">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.1em] text-primary uppercase mb-4">
              Opportunity Discovery
            </p>
            <h2 className="font-serif text-3xl md:text-[48px] font-normal tracking-tight text-foreground">
              Find the opportunities that fit your research.
            </h2>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-border mb-8 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 text-[13px] font-medium border-b-2 whitespace-nowrap transition-colors -mb-px ${
                activeTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((opp) => (
            <Card
              key={opp.title}
              className={`p-5 cursor-pointer transition-transform hover:-translate-y-0.5 hover:shadow-elevation1 ${
                opp.hot ? "border-primary/20 border-t-2 border-t-primary" : ""
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-[11px] font-medium py-0.5 px-2 bg-background-alt text-muted-foreground rounded">
                  {opp.type}
                </span>
                <span
                  className={`text-[11px] font-semibold py-0.5 px-2 rounded ${
                    opp.hot ? "text-[#C05C3A] bg-[#FDF0EC]" : "text-muted-foreground/70 bg-background-alt"
                  }`}
                >
                  {opp.deadline} {opp.deadline.includes("days") ? "left" : ""}
                </span>
              </div>
              <div className="text-[15px] font-semibold text-foreground tracking-tight mb-1.5 leading-[1.35]">
                {opp.title}
              </div>
              <div className="text-xs text-muted-foreground mb-3">{opp.org}</div>
              {opp.funding && (
                <div className="text-[13px] font-semibold text-primary mb-3">
                  {opp.funding}
                </div>
              )}
              <div className="flex gap-1.5 flex-wrap">
                {opp.tags.map((t: string) => (
                  <span
                    key={t}
                    className="text-[11px] py-0.5 px-2 border border-border rounded text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PaperSection() {
  return (
    <section className="bg-background-alt border-t border-border py-20 lg:py-32 px-6 md:px-20">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-20 items-center">
        {/* Paper card mockup */}
        <div>
          <Card className="p-7 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border-border">
            <div className="mb-5">
              <div className="text-[11px] font-semibold text-muted-foreground/70 tracking-[0.06em] uppercase mb-2.5">
                Research Paper
              </div>
              <h3 className="font-serif text-xl font-normal text-foreground leading-[1.35] tracking-tight mb-3">
                Foundation Models for Scientific Discovery
              </h3>
              <div className="text-[13px] text-muted-foreground flex gap-2 flex-wrap">
                {["Maya Chen", "Arjun Rao", "Elena Park"].map((a, i) => (
                  <span key={a}>
                    {a}
                    {i < 2 ? "," : ""}
                  </span>
                ))}
                <span className="text-muted-foreground/70">· 2026</span>
              </div>
            </div>

            <div className="flex gap-6 py-4 border-y border-border mb-5">
              <div className="text-center">
                <div className="text-lg font-bold text-foreground tracking-tight">2,418</div>
                <div className="text-[11px] text-muted-foreground/70 mt-0.5">Citations</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-foreground tracking-tight">NeurIPS</div>
                <div className="text-[11px] text-muted-foreground/70 mt-0.5">Venue · 2026</div>
              </div>
            </div>

            <div className="flex gap-1.5 mb-5 flex-wrap">
              {["Scientific ML", "Foundation Models", "Knowledge Discovery"].map((t) => (
                <Badge key={t} variant="secondary" className="text-[11px]">
                  {t}
                </Badge>
              ))}
            </div>

            {/* Relationship visualization */}
            <div className="border-t border-border pt-4">
              <div className="text-xs font-semibold text-foreground mb-3">
                Research Connections
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "References", count: 84, color: "#6B7A5A" },
                  { label: "Related Papers", count: 32, color: "#5A6B7A" },
                  { label: "Citations", count: 2418, color: "hsl(var(--primary))" },
                  { label: "Research Topics", count: 12, color: "#7A6B5A" },
                ].map(({ label, count, color }) => (
                  <div
                    key={label}
                    className="py-2.5 px-3 bg-background-alt rounded-md flex justify-between items-center"
                  >
                    <span className="text-xs text-muted-foreground">{label}</span>
                    <span className="text-[13px] font-semibold" style={{ color }}>
                      {count.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Copy */}
        <div>
          <p className="text-[11px] font-semibold tracking-[0.1em] text-primary uppercase mb-5">
            Paper Discovery
          </p>
          <h2 className="font-serif text-3xl md:text-[48px] font-normal leading-[1.1] tracking-tight text-foreground mb-6">
            Follow ideas, not just citations.
          </h2>
          <p className="text-[17px] leading-relaxed text-muted-foreground mb-10">
            Navigate the research landscape through semantic relationships — not just
            who cited whom. Discover papers through shared concepts, emerging themes,
            and the ideas that connect across fields.
          </p>
          <div className="flex flex-col gap-3">
            {[
              "Semantic paper discovery",
              "Citation network navigation",
              "Related paper recommendations",
              "Research topic clustering",
            ].map((item) => (
              <div key={item} className="flex gap-3 items-center text-sm text-muted-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
