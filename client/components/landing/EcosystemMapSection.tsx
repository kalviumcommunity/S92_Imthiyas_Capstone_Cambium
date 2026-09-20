"use client";

import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export function IntelligenceSection() {
  return (
    <section className="bg-[#1C1C1A] py-20 lg:py-32 px-6 md:px-20">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-20 items-center">
        {/* Copy */}
        <div>
          <p className="text-[11px] font-semibold tracking-[0.1em] text-primary uppercase mb-5">
            Research Intelligence
          </p>
          <h2 className="font-serif text-3xl md:text-[48px] font-normal leading-[1.1] tracking-tight text-[#F5F4F0] mb-6">
            Intelligence that works around your research.
          </h2>
          <p className="text-[17px] leading-relaxed text-[#F5F4F0]/55 mb-10">
            Cambium understands your work — not just your search queries. It surfaces
            connections, opportunities, and collaborators as you research, not when
            you ask.
          </p>
          <div className="flex flex-col gap-3.5">
            {[
              "Contextual paper recommendations",
              "Opportunity matching by research fit",
              "Emerging topic signals in your field",
              "Collaboration opportunities at intersections",
            ].map((item) => (
              <div key={item} className="flex gap-3 items-center text-sm text-[#F5F4F0]/55">
                <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Insight panel mockup */}
        <div>
          {/* Paper context */}
          <div className="bg-[#242422] border border-[#2E2E2C] rounded-lg p-5 mb-3">
            <div className="text-[11px] text-[#F5F4F0]/35 tracking-[0.06em] uppercase mb-2">
              Currently reading
            </div>
            <div className="text-sm font-medium text-[#F5F4F0] leading-[1.4]">
              Foundation Models for Scientific Discovery
            </div>
            <div className="text-xs text-[#F5F4F0]/40 mt-1">
              Chen, Rao, Park · NeurIPS 2026
            </div>
          </div>

          {/* Insight card */}
          <div className="bg-[#242422] border border-primary/20 border-t-2 border-t-primary rounded-lg p-5">
            <div className="flex gap-2.5 items-center mb-4">
              <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="5" stroke="hsl(var(--primary))" strokeWidth="1.5" />
                  <path d="M7 4.5v3M7 9v.5" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <div className="text-xs font-semibold text-primary">
                Cambium Research Insight
              </div>
            </div>

            <p className="text-sm text-[#F5F4F0]/70 leading-[1.6] mb-5">
              This paper connects strongly with your work on multimodal scientific
              discovery. Several co-authors are active in areas you're exploring.
            </p>

            <div className="flex flex-col gap-2">
              {[
                { label: "Related papers to explore", count: "12 papers", icon: "→" },
                { label: "Researchers active in this area", count: "4 researchers", icon: "→" },
                { label: "Relevant grants open now", count: "3 grants", icon: "→" },
                { label: "Publication venues to compare", count: "6 venues", icon: "→" },
              ].map(({ label, count, icon }) => (
                <div
                  key={label}
                  className="flex justify-between items-center py-2.5 px-3.5 bg-primary/10 rounded-md cursor-pointer border border-[#2E2E2C] transition-colors hover:bg-primary/20"
                >
                  <span className="text-[13px] text-[#F5F4F0]/65">{label}</span>
                  <span className="text-[13px] text-primary font-semibold flex gap-1">
                    {count} <span>{icon}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function EcosystemMapSection() {
  return (
    <section className="bg-[#1C1C1A] border-t border-[#2E2E2C] py-20 lg:py-32 px-6 md:px-20">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-[11px] font-semibold tracking-[0.1em] text-primary uppercase mb-5">
          Research Ecosystem
        </p>
        <h2 className="font-serif text-4xl md:text-[60px] font-normal leading-[1.08] tracking-tight text-[#F5F4F0] mb-4">
          Everything connects.
        </h2>
        <p className="text-[17px] text-[#F5F4F0]/45 max-w-lg mx-auto mb-16">
          Your research doesn't exist in isolation. Cambium maps the living network
          around your work.
        </p>

        {/* Large ecosystem SVG */}
        <div className="max-w-[700px] mx-auto h-[300px] md:h-[500px]">
          <svg
            viewBox="0 0 700 500"
            className="w-full h-full"
            aria-label="Research ecosystem map"
          >
            <defs>
              <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.15" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Glow behind center */}
            <ellipse cx="350" cy="250" rx="120" ry="120" fill="url(#centerGlow)" />

            {/* Connection lines */}
            {[
              [350, 250, 350, 80], // Papers
              [350, 250, 560, 140], // People
              [350, 250, 620, 280], // Projects
              [350, 250, 530, 420], // Labs
              [350, 250, 350, 430], // Topics
              [350, 250, 170, 420], // Journals
              [350, 250, 80, 280], // Conferences
              [350, 250, 140, 140], // Funding
              [350, 250, 220, 60], // Datasets
              [350, 250, 480, 60], // Notes
            ].map(([x1, y1, x2, y2], i) => (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="rgba(92,122,94,0.2)"
                strokeWidth="1"
                strokeDasharray="4 4"
                className="animate-fade-in opacity-0 animate-fill-forwards"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}

            {/* Center node: YOUR RESEARCH */}
            <g className="animate-fade-up opacity-0 animate-fill-forwards" style={{ animationDelay: "1s" }}>
              <circle
                cx="350"
                cy="250"
                r="52"
                fill="#242422"
                stroke="hsl(var(--primary))"
                strokeWidth="1.5"
              />
              <text
                x="350"
                y="247"
                textAnchor="middle"
                fontFamily="inherit"
                fontSize="11"
                fontWeight="700"
                fill="hsl(var(--primary))"
                letterSpacing="0.08em"
              >
                YOUR
              </text>
              <text
                x="350"
                y="262"
                textAnchor="middle"
                fontFamily="inherit"
                fontSize="11"
                fontWeight="700"
                fill="hsl(var(--primary))"
                letterSpacing="0.08em"
              >
                RESEARCH
              </text>
            </g>

            {/* Satellite nodes */}
            {[
              { label: "Papers", x: 350, y: 64, color: "#6B7A5A" },
              { label: "People", x: 568, y: 128, color: "#4A6B8A" },
              { label: "Projects", x: 624, y: 272, color: "#5A6B7A" },
              { label: "Labs", x: 536, y: 416, color: "#6B5A7A" },
              { label: "Topics", x: 350, y: 440, color: "#7A7A4A" },
              { label: "Journals", x: 164, y: 416, color: "#7A6B5A" },
              { label: "Conferences", x: 76, y: 272, color: "#6B7A5A" },
              { label: "Funding", x: 132, y: 128, color: "#5A7A6B" },
              { label: "Datasets", x: 216, y: 52, color: "#7A6B4A" },
              { label: "Notes", x: 484, y: 52, color: "#5A6B5A" },
            ].map(({ label, x, y, color }, i) => (
              <g
                key={label}
                className="animate-fade-in opacity-0 animate-fill-forwards"
                style={{ animationDelay: `${0.2 + i * 0.08}s` }}
              >
                <circle cx={x} cy={y} r="28" fill="#242422" stroke={`${color}66`} strokeWidth="1" />
                <text
                  x={x}
                  y={y + 4}
                  textAnchor="middle"
                  fontFamily="inherit"
                  fontSize="10"
                  fontWeight="500"
                  fill="rgba(250,249,246,0.6)"
                >
                  {label}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    </section>
  );
}
