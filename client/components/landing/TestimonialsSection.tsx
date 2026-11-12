"use client";

import { Card } from "@/components/ui/card";

export function TestimonialsSection() {
  const workflows = [
    {
      badge: "EARLY-CAREER SCHOLARSHIP",
      title: "PhD Researchers & Postdocs",
      description: "Keep track of expiring dissertation grants, monitor relevant arXiv and bioRxiv preprints, and organize workspace references without manual spreadsheet upkeep.",
      deliverable: "Preprint Tracking · BibTeX Exports",
    },
    {
      badge: "RESEARCH LEADERSHIP",
      title: "Principal Investigators",
      description: "Coordinate multi-institution grant proposals, allocate compute credits, and maintain an audit log of student contributions and dataset versions.",
      deliverable: "Lab Workspaces · Post-Award Management",
    },
    {
      badge: "CROSS-DISCIPLINARY DISCOVERY",
      title: "Interdisciplinary Teams",
      description: "Bridge methodologies across computer vision, genomics, and climate modeling with interactive relational graphs and mutual scholar messaging.",
      deliverable: "Citation Mapping · Joint Working Groups",
    },
  ];

  return (
    <section className="bg-background border-t border-border py-20 lg:py-32 px-6 md:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 font-mono text-xs font-bold tracking-wider uppercase text-primary mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            SCHOLAR WORKFLOWS
          </div>
          <h2 className="font-serif text-3xl md:text-[44px] font-normal tracking-tight text-foreground">
            Built for every stage of modern research.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {workflows.map(({ badge, title, description, deliverable }) => (
            <Card key={title} className="p-8 border-border flex flex-col justify-between">
              <div>
                <span className="font-mono text-[11px] font-semibold tracking-wider uppercase text-primary mb-3 block">
                  {badge}
                </span>
                <h3 className="text-lg font-bold text-foreground mb-3 font-serif">
                  {title}
                </h3>
                <p className="text-[15px] leading-[1.6] text-muted-foreground mb-6 font-sans">
                  {description}
                </p>
              </div>
              <div className="pt-4 border-t border-border text-xs font-mono text-muted-foreground/80">
                {deliverable}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="bg-background border-t border-border py-12 px-6 md:px-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="9" stroke="currentColor" className="text-primary" strokeWidth="1.5" />
            <circle cx="10" cy="10" r="4" fill="currentColor" className="text-primary" />
          </svg>
          <span className="font-bold text-sm tracking-tight text-foreground">CAMBIUM</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Autonomous Research Opportunity Discovery & Scholarly Intelligence.
        </p>
      </div>
    </footer>
  );
}
