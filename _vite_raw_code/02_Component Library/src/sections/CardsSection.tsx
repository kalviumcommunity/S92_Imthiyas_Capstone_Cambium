import SectionWrapper, { ComponentGroup } from "@/components/SectionWrapper";

function Tag({ label }: { label: string }) {
  return (
    <span className="inline-block text-[10px] px-2 py-0.5 bg-surface-2 text-ink-3 rounded font-medium border border-line">
      {label}
    </span>
  );
}

function PaperCard() {
  return (
    <div className="bg-surface border border-line rounded-lg p-4 hover:border-line-2 hover:shadow-sm transition-all group w-80">
      <div className="flex items-start justify-between mb-2">
        <span className="text-[10px] uppercase tracking-widest text-ink-3 font-medium">Paper · 2024</span>
        <button className="text-ink-3 hover:text-navy transition-colors opacity-0 group-hover:opacity-100">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
        </button>
      </div>
      <h3 className="font-serif text-ink text-sm font-medium leading-snug mb-1.5">
        Federated Learning in Medical Imaging: A Systematic Review
      </h3>
      <p className="text-[11px] text-ink-2 mb-0.5">Smith, J., Johnson, A., Chen, R. et al.</p>
      <p className="text-[11px] text-ink-3 mb-3">Nature Machine Intelligence</p>
      <div className="flex flex-wrap gap-1 mb-4">
        <Tag label="Machine Learning" />
        <Tag label="Medical AI" />
        <Tag label="Privacy" />
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-line">
        <span className="text-[11px] text-ink-3 flex items-center gap-1">
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          142 citations
        </span>
        <button className="text-[11px] text-navy font-medium hover:underline">Open →</button>
      </div>
    </div>
  );
}

function ProjectCard() {
  return (
    <div className="bg-surface border border-line rounded-lg p-4 hover:border-line-2 hover:shadow-sm transition-all group w-80">
      <div className="flex items-start justify-between mb-3">
        <span className="inline-flex items-center gap-1.5 text-[10px] bg-sage-light text-sage px-2 py-0.5 rounded-full font-medium">
          <span className="w-1.5 h-1.5 bg-sage rounded-full" />
          Active
        </span>
        <span className="text-[10px] text-ink-3">Updated 2d ago</span>
      </div>
      <h3 className="font-serif text-ink text-sm font-medium leading-snug mb-1.5">
        Privacy-Preserving ML in Healthcare Systems
      </h3>
      <p className="text-xs text-ink-3 mb-3 leading-relaxed line-clamp-2">
        Investigating differential privacy techniques applied to multi-institutional federated learning for diagnostic imaging.
      </p>
      <div className="flex flex-wrap gap-1 mb-4">
        <Tag label="Federated Learning" />
        <Tag label="Healthcare" />
      </div>
      {/* Progress */}
      <div className="mb-3">
        <div className="flex justify-between mb-1">
          <span className="text-[10px] text-ink-3">Progress</span>
          <span className="text-[10px] text-ink-2 font-medium">68%</span>
        </div>
        <div className="h-1 bg-surface-3 rounded-full overflow-hidden">
          <div className="h-full bg-navy rounded-full" style={{ width: "68%" }} />
        </div>
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-line">
        <div className="flex -space-x-1.5">
          {["E", "J", "R"].map((init, i) => (
            <div key={i} className="w-6 h-6 rounded-full bg-navy-light text-navy border-2 border-surface flex items-center justify-center text-[9px] font-bold">
              {init}
            </div>
          ))}
          <span className="ml-3 text-[10px] text-ink-3 self-center">3 collaborators</span>
        </div>
      </div>
    </div>
  );
}

function OpportunityCard() {
  return (
    <div className="bg-surface border border-line rounded-lg p-4 hover:border-line-2 hover:shadow-sm transition-all group w-80">
      <div className="flex items-start justify-between mb-3">
        <span className="text-[10px] bg-amber-light text-amber px-2 py-0.5 rounded font-medium">Fellowship</span>
        <span className="inline-flex items-center gap-1 text-[10px] text-amber font-medium">
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          Sep 18
        </span>
      </div>
      <h3 className="font-serif text-ink text-sm font-medium leading-snug mb-1">
        Early Career Research Fellowship
      </h3>
      <p className="text-[11px] text-ink-2 mb-3">Wellcome Trust · London</p>
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex items-center gap-1 text-[10px] bg-sage-light text-sage px-2 py-0.5 rounded font-medium">
          <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 13l4 4L19 7"/>
          </svg>
          Strong match
        </span>
        <span className="text-[10px] text-ink-3">· Medical Imaging</span>
      </div>
      <div className="space-y-1.5 mb-4">
        <div className="flex items-center gap-2 text-[11px] text-ink-2">
          <svg className="w-3 h-3 text-ink-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          PhD students & postdocs
        </div>
        <div className="flex items-center gap-2 text-[11px] text-ink-2">
          <svg className="w-3 h-3 text-ink-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
          £45,000 / year
        </div>
      </div>
      <div className="flex gap-2 pt-3 border-t border-line">
        <button className="flex-1 text-xs py-1.5 rounded-md border border-line text-ink-2 hover:border-line-2 hover:text-ink transition-colors font-medium">
          Save
        </button>
        <button className="flex-1 text-xs py-1.5 rounded-md bg-navy text-white hover:bg-navy-mid transition-colors font-medium">
          View details
        </button>
      </div>
    </div>
  );
}

function ResearcherCard() {
  return (
    <div className="bg-surface border border-line rounded-lg p-4 hover:border-line-2 hover:shadow-sm transition-all group w-72">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-navy-light text-navy flex items-center justify-center text-sm font-bold flex-shrink-0">
          ER
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-medium text-ink leading-tight">Dr. Elena Rodriguez</h3>
          <p className="text-xs text-ink-3 mt-0.5">Research Scientist</p>
          <p className="text-xs text-ink-3">MIT CSAIL · Cambridge</p>
        </div>
        <button className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <svg className="w-4 h-4 text-ink-3 hover:text-navy" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/>
          </svg>
        </button>
      </div>
      <div className="flex flex-wrap gap-1 mb-3">
        {["Federated Learning", "Medical AI", "Privacy"].map(t => (
          <Tag key={t} label={t} />
        ))}
      </div>
      <div className="flex items-center gap-1.5 mb-4 text-[11px] text-navy">
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
        3 shared research interests
      </div>
      <div className="flex gap-2">
        <button className="flex-1 text-xs py-1.5 rounded-md border border-line text-ink-2 hover:border-navy hover:text-navy transition-colors font-medium">
          Follow
        </button>
        <button className="flex-1 text-xs py-1.5 rounded-md bg-navy text-white hover:bg-navy-mid transition-colors font-medium">
          View profile
        </button>
      </div>
    </div>
  );
}

function DatasetCard() {
  return (
    <div className="bg-surface border border-line rounded-lg p-4 hover:border-line-2 hover:shadow-sm transition-all w-72">
      <div className="flex items-start justify-between mb-3">
        <span className="text-[10px] bg-iris-light text-iris px-2 py-0.5 rounded font-medium">Dataset</span>
        <span className="text-[10px] text-ink-3">CC BY 4.0</span>
      </div>
      <h3 className="font-serif text-ink text-sm font-medium leading-snug mb-1">
        MIMIC-IV Clinical Database
      </h3>
      <p className="text-[11px] text-ink-2 mb-3">PhysioNet · MIT Laboratory</p>
      <div className="space-y-1.5 mb-4">
        {[
          { label: "Size", val: "48.5 GB" },
          { label: "Records", val: "180,733 patients" },
          { label: "Domain", val: "Clinical Medicine" },
          { label: "Updated", val: "Jan 2024" },
        ].map(({ label, val }) => (
          <div key={label} className="flex justify-between text-[11px]">
            <span className="text-ink-3">{label}</span>
            <span className="text-ink-2 font-medium">{val}</span>
          </div>
        ))}
      </div>
      <button className="w-full text-xs py-1.5 rounded-md border border-line text-ink-2 hover:border-navy hover:text-navy transition-colors font-medium">
        Access dataset →
      </button>
    </div>
  );
}

function PublicationCard() {
  return (
    <div className="bg-surface border border-line rounded-lg p-4 hover:border-line-2 hover:shadow-sm transition-all w-80">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] text-ink-3 bg-surface-2 px-2 py-0.5 rounded border border-line">Journal</span>
        <span className="text-[10px] text-ink-3">2024</span>
      </div>
      <h3 className="font-serif text-ink text-sm font-medium leading-snug mb-1.5">
        Differential Privacy in Federated Learning: Balancing Utility and Privacy Guarantees
      </h3>
      <p className="text-[11px] text-ink-2 mb-0.5">Rodriguez, E., Kim, S., Patel, A.</p>
      <p className="text-[11px] text-ink-3 mb-3">Journal of Machine Learning Research, Vol. 25</p>
      <div className="text-[10px] text-ink-3 font-mono mb-3">DOI: 10.5555/3600000.3600042</div>
      <div className="flex items-center gap-3 pt-3 border-t border-line">
        <button className="text-[11px] text-navy font-medium hover:underline">Cite</button>
        <button className="text-[11px] text-navy font-medium hover:underline">Export</button>
        <button className="text-[11px] text-navy font-medium hover:underline flex items-center gap-1">
          PDF
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
          </svg>
        </button>
        <span className="ml-auto text-[11px] text-ink-3">67 citations</span>
      </div>
    </div>
  );
}

function CardStates({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 items-start">
      <div className="flex flex-col gap-2 items-start">{children}</div>
      <div className="flex flex-col gap-2 items-start opacity-50">
        <div className="text-[10px] text-ink-3 uppercase tracking-widest mt-1.5">Loading</div>
        <div className="w-72 h-40 bg-surface border border-line rounded-lg overflow-hidden">
          <div className="p-4 space-y-2 animate-pulse">
            <div className="h-3 bg-surface-3 rounded w-20" />
            <div className="h-4 bg-surface-3 rounded w-full" />
            <div className="h-4 bg-surface-3 rounded w-3/4" />
            <div className="h-3 bg-surface-3 rounded w-1/2" />
            <div className="h-3 bg-surface-3 rounded w-2/3" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CardsSection() {
  return (
    <SectionWrapper
      id="cards"
      number="06"
      title="Cards"
      description="Reusable card components for research artifacts. Subtle borders, minimal elevation, maximum information density without clutter."
    >
      <ComponentGroup label="Paper Card" note="Academic paper with authors, venue, and citation count">
        <CardStates><PaperCard /></CardStates>
      </ComponentGroup>
      <ComponentGroup label="Project Card" note="Research project with progress and collaborators">
        <ProjectCard />
      </ComponentGroup>
      <ComponentGroup label="Opportunity Card" note="Research opportunity with match score and deadline">
        <OpportunityCard />
      </ComponentGroup>
      <ComponentGroup label="Researcher Card" note="Researcher profile with shared interests">
        <ResearcherCard />
      </ComponentGroup>
      <ComponentGroup label="Publication Card" note="Published work with DOI and citation export">
        <PublicationCard />
      </ComponentGroup>
      <ComponentGroup label="Dataset Card" note="Research dataset with metadata">
        <DatasetCard />
      </ComponentGroup>
    </SectionWrapper>
  );
}
