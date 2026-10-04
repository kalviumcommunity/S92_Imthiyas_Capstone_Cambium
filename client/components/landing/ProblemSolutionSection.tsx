import { ArrowRight } from "lucide-react";

function TrustSection() {
  const categories = [
    { icon: "○", label: "Undergraduate Researchers" },
    { icon: "◎", label: "Graduate Researchers" },
    { icon: "●", label: "PhD Scholars" },
    { icon: "◈", label: "Faculty" },
    { icon: "◉", label: "Research Labs" },
    { icon: "◻", label: "Academic Institutions" },
    { icon: "◆", label: "R&D Teams" },
  ];

  return (
    <section className="bg-background border-y border-border py-16 px-6 md:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[13px] font-medium tracking-[0.08em] text-muted-foreground uppercase mb-4">
            Built for
          </p>
          <h2 className="font-serif text-2xl md:text-[40px] font-normal text-foreground tracking-tight">
            The people moving research forward.
          </h2>
        </div>
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map(({ icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2.5 py-3 px-5 border border-border rounded-full text-sm font-medium text-muted-foreground transition-colors cursor-default hover:border-primary hover:text-foreground"
            >
              <span className="text-primary text-[10px]">{icon}</span>
              {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProblemSection() {
  const sources = [
    "Papers",
    "Grants",
    "Conferences",
    "Journals",
    "Researchers",
    "Datasets",
    "Labs",
  ];

  return (
    <section className="bg-background py-20 lg:py-32 px-6 md:px-20" id="explore">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mb-20">
          <h2 className="font-serif text-4xl md:text-[56px] font-normal leading-[1.1] tracking-tight text-foreground mb-6">
            Research shouldn't begin with twenty browser tabs.
          </h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Research information is scattered across publications, funding portals,
            conference websites, academic profiles, spreadsheets, documents, and
            communities.
          </p>
        </div>

        {/* Fragmented → Connected visualization */}
        <div className="flex items-center gap-12 flex-wrap">
          {/* Scattered sources */}
          <div className="flex-1 min-w-[280px]">
            <p className="text-[11px] font-semibold tracking-[0.1em] text-muted-foreground uppercase mb-6">
              Fragmented
            </p>
            <div className="grid grid-cols-3 gap-2.5">
              {sources.map((s, i) => (
                <div
                  key={s}
                  className="py-3 px-3.5 bg-background border border-border rounded-md text-xs font-medium text-muted-foreground shadow-sm"
                  style={{
                    transform: `rotate(${(i % 3 - 1) * 1.5}deg) translateY(${(i % 2) * 4}px)`,
                  }}
                >
                  {s}
                </div>
              ))}
            </div>
          </div>

          {/* Arrow */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-20 h-px bg-gradient-to-r from-border to-primary" />
            <ArrowRight className="text-primary w-5 h-5" strokeWidth={1.5} />
          </div>

          {/* Connected: Cambium */}
          <div className="flex-1 min-w-[280px]">
            <p className="text-[11px] font-semibold tracking-[0.1em] text-primary uppercase mb-6">
              Connected
            </p>
            <div className="p-8 bg-background border border-primary/20 border-t-2 border-t-primary rounded-lg shadow-[0_4px_24px_rgba(92,122,94,0.08)]">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-6 h-6 rounded-full bg-[#FAF7F0] border border-[#E4DCCB] p-0.5 flex items-center justify-center shrink-0 overflow-hidden">
                  <img src="/logo.svg" alt="CAMBIUM Research Logo" className="w-full h-full object-contain" />
                </div>
                <span className="font-bold text-sm tracking-tight text-foreground uppercase">
                  CAMBIUM <span className="font-light text-primary">RESEARCH</span>
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {sources.map((s) => (
                  <span
                    key={s}
                    className="text-[11px] font-medium py-1 px-2.5 bg-primary-light text-primary-dark rounded"
                  >
                    {s}
                  </span>
                ))}
              </div>
              <p className="text-[13px] text-muted-foreground mt-4 leading-relaxed">
                Everything your research touches, in one living environment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ProblemSolutionSection() {
  return (
    <>
      <TrustSection />
      <ProblemSection />
    </>
  );
}
