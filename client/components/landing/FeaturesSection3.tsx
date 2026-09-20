"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function CollaborationSection() {
  const researchers = [
    { initials: "EP", color: "#6B5A7A", name: "Dr. Elena Park", role: "Computational Biology", org: "Stanford University", topics: ["Protein Design", "Generative AI", "Bioinformatics"], shared: 3, mutual: 5 },
    { initials: "AR", color: "#4A6B8A", name: "Dr. Arjun Rao", role: "Machine Learning", org: "IISc", topics: ["Scientific NLP", "Low-Resource ML", "Benchmarks"], shared: 2, mutual: 7 },
    { initials: "LK", color: "#7A6B4A", name: "Dr. Lena Kovacs", role: "Neuroscience AI", org: "ETH Zurich", topics: ["Neural Decoding", "Brain-Computer Interface"], shared: 4, mutual: 3 },
  ];

  return (
    <section className="bg-background border-t border-border py-20 lg:py-32 px-6 md:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[11px] font-semibold tracking-[0.1em] text-primary uppercase mb-4">
            Collaboration
          </p>
          <h2 className="font-serif text-3xl md:text-[48px] font-normal tracking-tight text-foreground mb-4">
            Meet the researchers your work is already pointing toward.
          </h2>
          <p className="text-[17px] text-muted-foreground max-w-lg mx-auto">
            Cambium surfaces researchers who share your intellectual territory — before
            you know to search for them.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {researchers.map((r) => (
            <Card
              key={r.name}
              className="p-6 cursor-pointer transition-transform hover:-translate-y-0.5 hover:shadow-elevation1 border-border hover:border-border"
            >
              <div className="flex gap-3.5 mb-4 items-center">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-[15px] shrink-0"
                  style={{ background: r.color }}
                >
                  {r.initials}
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground tracking-tight">
                    {r.name}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{r.role}</div>
                  <div className="text-[11px] text-muted-foreground/70">{r.org}</div>
                </div>
              </div>

              <div className="flex gap-1.5 mb-4 flex-wrap">
                {r.topics.map((t) => (
                  <span
                    key={t}
                    className="text-[11px] py-0.5 px-2 border border-border rounded text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex gap-5 py-3 border-y border-border mb-4">
                <div>
                  <div className="text-base font-bold text-foreground">{r.shared}</div>
                  <div className="text-[11px] text-muted-foreground/70">
                    Shared interests
                  </div>
                </div>
                <div>
                  <div className="text-base font-bold text-foreground">{r.mutual}</div>
                  <div className="text-[11px] text-muted-foreground/70">
                    Mutual topics
                  </div>
                </div>
              </div>

              <Button size="sm" variant="secondary" className="w-full text-primary bg-primary-light hover:bg-[#D5E4D6]">
                Explore profile
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PortfolioSection() {
  const projects = [
    { name: "Multimodal Scientific Discovery", status: "Active", statusColor: "hsl(var(--primary))", collaborators: ["MC", "AR", "EP"], pubs: 4, datasets: 2, experiments: 18 },
    { name: "Medical Imaging Foundation Models", status: "Published", statusColor: "#4A6B8A", collaborators: ["MC", "LK"], pubs: 7, citations: "1.2k", experiments: 31 },
    { name: "Cross-lingual Scientific NLP", status: "In Progress", statusColor: "#7A6B4A", collaborators: ["AR", "MC"], pubs: 2, datasets: 5, experiments: 11 },
  ];

  return (
    <section className="bg-background-alt border-t border-border py-20 lg:py-32 px-6 md:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12 flex-wrap gap-6">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.1em] text-primary uppercase mb-4">
              Research Portfolio
            </p>
            <h2 className="font-serif text-3xl md:text-[48px] font-normal tracking-tight text-foreground">
              Your research, from first question<br />to published work.
            </h2>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {projects.map((p) => (
            <Card
              key={p.name}
              className="px-6 py-5 flex flex-col md:flex-row md:items-center gap-6 md:gap-8 cursor-pointer transition-transform hover:-translate-y-[1px] hover:shadow-elevation1 border-l-[3px]"
              style={{ borderLeftColor: p.statusColor }}
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[15px] font-semibold text-foreground tracking-tight">
                    {p.name}
                  </span>
                  <span
                    className="text-[11px] font-semibold py-0.5 px-2 rounded"
                    style={{ background: `${p.statusColor}15`, color: p.statusColor }}
                  >
                    {p.status}
                  </span>
                </div>
                <div className="flex gap-6 text-xs text-muted-foreground flex-wrap">
                  <span>{p.pubs} Publications</span>
                  {p.datasets && <span>{p.datasets} Datasets</span>}
                  {p.citations && <span className="text-primary">↑ {p.citations} Citations</span>}
                  <span>{p.experiments} Experiments</span>
                </div>
              </div>

              {/* Collaborators */}
              <div className="flex gap-[-8px] shrink-0 items-center">
                {p.collaborators.map((c, i) => (
                  <div
                    key={c}
                    className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-white text-[11px] font-bold border-2 border-background"
                    style={{
                      background: ["hsl(var(--primary))", "#4A6B8A", "#7A6B4A"][i % 3],
                      marginLeft: i > 0 ? "-8px" : "0",
                    }}
                  >
                    {c}
                  </div>
                ))}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  className="text-muted-foreground/70 ml-4"
                  strokeWidth="1.5"
                >
                  <path d="M4 8h8M9 5l3 3-3 3" strokeLinecap="round" />
                </svg>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ActivitySection() {
  const weeks = 52;
  const days = 7;
  const activities = ["Published Paper", "Updated Dataset", "Experiment", "Conference", "Literature Review", "Collaboration", "Grant", "Code", "Research Note"];

  // Note: we can't do random during hydration. Use a deterministic pattern.
  const grid = Array.from({ length: weeks }, (_, w) =>
    Array.from({ length: days }, (_, d) => {
      const v = (w * 13 + d * 7) % 100;
      if (v > 85) return 4;
      if (v > 70) return 3;
      if (v > 55) return 2;
      if (v > 35) return 1;
      return 0;
    })
  );

  const intensities = ["#F0EEE8", "hsl(var(--primary-light))", "#C5D9C6", "#8CB48E", "hsl(var(--primary))"];

  return (
    <section className="bg-background-alt border-t border-border py-20 lg:py-32 px-6 md:px-20">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Graph */}
        <div className="order-2 lg:order-1 overflow-hidden">
          <div className="flex justify-between items-center mb-5">
            <div className="text-[13px] font-semibold text-foreground">
              2026 Research Activity
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-muted-foreground/70">Less</span>
              {intensities.map((c, i) => (
                <div
                  key={i}
                  className="w-2.5 h-2.5 rounded-[2px] border border-black/5"
                  style={{ background: c }}
                />
              ))}
              <span className="text-[11px] text-muted-foreground/70">More</span>
            </div>
          </div>

          <div className="flex gap-[3px] overflow-x-auto pb-2 scrollbar-hide">
            {grid.map((week, w) => (
              <div key={w} className="flex flex-col gap-[3px] shrink-0">
                {week.map((level, d) => (
                  <div
                    key={d}
                    title={level > 0 ? "Activity" : "No activity"}
                    className="w-[11px] h-[11px] rounded-[2px] border border-black/5 cursor-default transition-transform hover:scale-150"
                    style={{ background: intensities[level] }}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Activity types */}
          <div className="mt-6 flex flex-wrap gap-2">
            {activities.map((a) => (
              <span
                key={a}
                className="text-[11px] py-1 px-2.5 border border-border rounded text-muted-foreground bg-background"
              >
                {a}
              </span>
            ))}
          </div>
        </div>

        {/* Copy */}
        <div className="order-1 lg:order-2">
          <p className="text-[11px] font-semibold tracking-[0.1em] text-primary uppercase mb-5">
            Research Activity
          </p>
          <h2 className="font-serif text-3xl md:text-[44px] font-normal leading-[1.15] tracking-tight text-foreground mb-6">
            Every contribution becomes part of your research story.
          </h2>
          <p className="text-[17px] leading-relaxed text-muted-foreground">
            Track publications, experiments, collaborations, and milestones in a
            continuous timeline that documents your intellectual journey from start to
            impact.
          </p>
        </div>
      </div>
    </section>
  );
}
