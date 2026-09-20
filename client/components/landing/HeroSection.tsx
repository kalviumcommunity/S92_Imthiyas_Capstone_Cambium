"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

function EcosystemGraph({ dark = false }: { dark?: boolean }) {
  const nodes = [
    { id: "researcher", x: 180, y: 170, type: "researcher", label: "Dr. Maya Chen", sub: "Computer Vision", color: "hsl(var(--primary))" },
    { id: "paper", x: 380, y: 110, type: "paper", label: "Vision-Language Models", sub: "for Scientific Discovery", color: dark ? "#4A6B4C" : "#5C7A5E" },
    { id: "topic", x: 390, y: 260, type: "topic", label: "Computer Vision", sub: "Research Area", color: "#7A6B4A" },
    { id: "grant", x: 90, y: 290, type: "grant", label: "NSF Research Grant", sub: "Deadline · 18 days", color: "#6B4A4A" },
    { id: "conf", x: 300, y: 380, type: "conf", label: "NeurIPS 2026", sub: "Conference", color: "#4A5B7A" },
    { id: "lab", x: 60, y: 140, type: "lab", label: "Research Lab", sub: "MIT CSAIL", color: "#6B5A7A" },
    { id: "project", x: 440, y: 360, type: "project", label: "Multimodal Discovery", sub: "Active Project", color: "#5A7A6B" },
    { id: "dataset", x: 220, y: 420, type: "dataset", label: "Dataset", sub: "Open Access", color: "#7A7A4A" },
  ];

  const edges = [
    ["researcher", "paper"],
    ["researcher", "topic"],
    ["researcher", "grant"],
    ["researcher", "lab"],
    ["paper", "conf"],
    ["paper", "topic"],
    ["paper", "project"],
    ["conf", "dataset"],
    ["project", "dataset"],
  ];

  const getNode = (id: string) => nodes.find((n) => n.id === id)!;

  const textColor = dark ? "rgba(250,249,246,0.9)" : "hsl(var(--foreground))";
  const subColor = dark ? "rgba(250,249,246,0.45)" : "hsl(var(--muted-foreground))";
  const cardBg = dark ? "hsl(var(--background-dark-surface))" : "hsl(var(--background))";
  const cardBorder = dark ? "hsl(var(--border-dark))" : "hsl(var(--border))";

  return (
    <svg
      viewBox="0 0 560 480"
      className="w-full h-full"
      aria-label="Research ecosystem visualization showing connected research nodes"
    >
      <defs>
        <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
          <path
            d="M 24 0 L 0 0 0 24"
            fill="none"
            stroke={dark ? "rgba(255,255,255,0.03)" : "rgba(30,30,28,0.04)"}
            strokeWidth="0.5"
          />
        </pattern>
      </defs>
      <rect width="560" height="480" fill="url(#grid)" />

      {/* Connection lines */}
      {edges.map(([aId, bId], i) => {
        const a = getNode(aId);
        const b = getNode(bId);
        return (
          <line
            key={i}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke={dark ? "rgba(92,122,94,0.25)" : "rgba(92,122,94,0.2)"}
            strokeWidth="1"
            className="animate-fade-in opacity-0 animate-fill-forwards"
            style={{ animationDelay: `${0.6 + i * 0.07}s` }}
          />
        );
      })}

      {/* Nodes */}
      {nodes.map((node, i) => {
        const isCenter = node.id === "researcher";
        const w = isCenter ? 148 : 130;
        const h = isCenter ? 52 : 44;
        return (
          <g
            key={node.id}
            className="animate-fade-up opacity-0 animate-fill-forwards"
            style={{ animationDelay: `${0.7 + i * 0.06}s` }}
          >
            {/* Node dot on line intersection */}
            <circle cx={node.x} cy={node.y} r={isCenter ? 4 : 3} fill={node.color} opacity="0.8" />

            {/* Card */}
            <foreignObject
              x={node.x - w / 2}
              y={node.y - h - 8}
              width={w}
              height={h}
              style={{ overflow: "visible" }}
            >
              <div
                className={`flex flex-col justify-center px-2.5 py-1.5 rounded-md cursor-default transition-transform hover:-translate-y-0.5 hover:shadow-elevation1`}
                style={{
                  background: cardBg,
                  border: `1px solid ${isCenter ? "var(--primary-light)" : cardBorder}`,
                  borderTop: `2px solid ${node.color}`,
                  boxShadow: isCenter
                    ? `0 0 0 1px ${node.color}22, 0 4px 16px rgba(0,0,0,0.06)`
                    : "0 2px 8px rgba(0,0,0,0.05)",
                }}
              >
                <div
                  className="font-sans font-semibold tracking-tight whitespace-nowrap overflow-hidden text-ellipsis"
                  style={{ fontSize: isCenter ? 11 : 10, color: textColor, lineHeight: 1.3 }}
                >
                  {node.label}
                </div>
                <div
                  className="font-sans tracking-tight whitespace-nowrap overflow-hidden text-ellipsis mt-0.5"
                  style={{ fontSize: 9, color: subColor }}
                >
                  {node.sub}
                </div>
              </div>
            </foreignObject>
          </g>
        );
      })}
    </svg>
  );
}

export function HeroSection() {
  return (
    <section className="min-h-screen bg-background flex items-center relative overflow-hidden pt-16">
      {/* Subtle texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at 70% 40%, rgba(92,122,94,0.04) 0%, transparent 60%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-20 grid md:grid-cols-2 gap-12 md:gap-20 items-center w-full relative z-10 py-20">
        {/* Left: Copy */}
        <div>
          <div
            className="animate-fade-up opacity-0 animate-fill-forwards inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] text-primary uppercase mb-7"
            style={{ animationDelay: "0.2s" }}
          >
            <span className="w-5 h-[1px] bg-primary inline-block" />
            The Research Operating System
          </div>

          <h1
            className="animate-fade-up opacity-0 animate-fill-forwards font-serif font-normal text-display-lg md:text-display-xl lg:text-[72px] leading-[1.08] tracking-tight text-foreground mb-7"
            style={{ animationDelay: "0.2s" }}
          >
            Your research world, <em className="italic text-primary">connected.</em>
          </h1>

          <p
            className="animate-fade-up opacity-0 animate-fill-forwards text-lg leading-relaxed text-muted-foreground max-w-lg mb-11 font-normal"
            style={{ animationDelay: "0.35s" }}
          >
            Discover ideas, build your academic identity, collaborate with researchers, explore opportunities, and organize the knowledge behind your work — all in one living research environment.
          </p>

          <div
            className="animate-fade-up opacity-0 animate-fill-forwards flex flex-wrap gap-4"
            style={{ animationDelay: "0.5s" }}
          >
            <Button asChild size="lg" variant="primary" className="text-sm font-semibold h-12 px-6">
              <Link href="/sign-up">Create your research identity</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-sm font-medium h-12 px-6 border-border text-foreground hover:border-muted-foreground hover:bg-transparent">
              <Link href="#explore">
                Explore Cambium
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>

          <div
            className="animate-fade-up opacity-0 animate-fill-forwards mt-14 flex flex-wrap gap-8 md:gap-10"
            style={{ animationDelay: "0.6s" }}
          >
            {[
              ["Identity", "Academic"],
              ["Workspace", "Research"],
              ["Discovery", "Intelligent"],
            ].map(([label, sub]) => (
              <div key={label}>
                <div className="text-[13px] font-semibold text-foreground">{label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Ecosystem graph */}
        <div
          className="animate-fade-in opacity-0 animate-fill-forwards relative h-[400px] md:h-[480px] w-full"
          style={{ animationDelay: "0.6s" }}
        >
          <EcosystemGraph />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div className="text-[11px] tracking-[0.1em] text-muted-foreground uppercase">Scroll</div>
        <div className="w-[1px] h-8 bg-gradient-to-b from-muted-foreground to-transparent" />
      </div>
    </section>
  );
}
