import { useState } from "react";
import SectionWrapper, { ComponentGroup } from "@/components/SectionWrapper";

const categories = ["Papers", "Researchers", "Projects", "Opportunities", "Topics", "Datasets"];

const results = [
  {
    type: "Paper",
    title: "Federated Learning in Medical Imaging: A Systematic Review",
    meta: "Smith, Johnson, et al. · Nature Machine Intelligence · 2024",
    topics: ["Machine Learning", "Medical AI"],
    relevance: "Strong match · 142 citations",
    icon: "paper",
  },
  {
    type: "Researcher",
    title: "Dr. Elena Rodriguez",
    meta: "Research Scientist · MIT CSAIL · Cambridge, MA",
    topics: ["Federated Learning", "Privacy-Preserving AI"],
    relevance: "3 shared interests",
    icon: "person",
  },
  {
    type: "Project",
    title: "Privacy-Preserving ML in Healthcare",
    meta: "Open project · 8 collaborators · Updated 2 days ago",
    topics: ["Machine Learning", "Healthcare"],
    relevance: "Active · Medical Imaging",
    icon: "folder",
  },
  {
    type: "Opportunity",
    title: "Early Career Research Fellowship — Medical Imaging",
    meta: "Wellcome Trust · Deadline Sep 18, 2024",
    topics: ["Fellowship", "Medical AI"],
    relevance: "Strong match · Fully funded",
    icon: "star",
  },
];

const recentSearches = [
  "federated learning privacy",
  "differential privacy neural networks",
  "medical imaging AI 2024",
];

const suggestions = [
  "federated learning medical imaging",
  "federated learning healthcare privacy",
  "federated learning fairness bias",
];

function SearchIcon() {
  return (
    <svg className="w-4 h-4 text-ink-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
    </svg>
  );
}

function TypeIcon({ type }: { type: string }) {
  const icons: Record<string, string> = {
    paper: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6",
    person: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
    folder: "M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z",
    star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z",
  };
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d={icons[type]} />
    </svg>
  );
}

function SearchTrigger({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2.5 w-full max-w-sm px-3 py-2 bg-surface border border-line rounded-md text-ink-3 text-sm hover:border-line-2 hover:text-ink-2 transition-colors shadow-sm"
    >
      <SearchIcon />
      <span className="flex-1 text-left">Search papers, researchers, topics…</span>
      <kbd className="hidden sm:flex items-center gap-1 text-[10px] text-ink-3 bg-surface-2 border border-line px-1.5 py-0.5 rounded font-mono">
        ⌘K
      </kbd>
    </button>
  );
}

function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("federated learning medical imaging");
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4" onClick={onClose}>
      <div
        className="w-full max-w-2xl bg-surface rounded-xl shadow-2xl border border-line overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-line">
          <SearchIcon />
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 text-sm text-ink placeholder:text-ink-3 outline-none bg-transparent"
            placeholder="Search papers, researchers, topics…"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-ink-3 hover:text-ink">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          )}
          <kbd className="text-[10px] text-ink-3 bg-surface-2 border border-line px-1.5 py-0.5 rounded font-mono">
            Esc
          </kbd>
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1 px-3 py-2 border-b border-line overflow-x-auto">
          {["All", ...categories].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-2.5 py-1 text-xs rounded-md transition-colors font-medium ${
                activeCategory === cat
                  ? "bg-navy-light text-navy"
                  : "text-ink-3 hover:text-ink hover:bg-surface-2"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto divide-y divide-line">
          {results.map((result, i) => (
            <div
              key={i}
              className="flex items-start gap-3 px-4 py-3 hover:bg-surface-2 cursor-pointer transition-colors group"
            >
              <div className="mt-0.5 w-7 h-7 rounded-md bg-surface-2 border border-line flex items-center justify-center flex-shrink-0 text-ink-3">
                <TypeIcon type={result.icon} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-ink leading-snug truncate">{result.title}</p>
                  <span className="flex-shrink-0 text-[10px] text-ink-3 bg-surface-3 px-1.5 py-0.5 rounded mt-0.5">
                    {result.type}
                  </span>
                </div>
                <p className="text-xs text-ink-3 mt-0.5 truncate">{result.meta}</p>
                <p className="text-[11px] text-navy mt-1">{result.relevance}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-line bg-surface-2">
          <div className="flex items-center gap-3 text-[10px] text-ink-3">
            <span className="flex items-center gap-1"><kbd className="bg-surface border border-line px-1 rounded font-mono">↑↓</kbd> Navigate</span>
            <span className="flex items-center gap-1"><kbd className="bg-surface border border-line px-1 rounded font-mono">↵</kbd> Open</span>
            <span className="flex items-center gap-1"><kbd className="bg-surface border border-line px-1 rounded font-mono">Esc</kbd> Close</span>
          </div>
          <span className="text-[10px] text-ink-3">4 results</span>
        </div>
      </div>
    </div>
  );
}

export default function SearchSection() {
  const [overlayOpen, setOverlayOpen] = useState(false);

  return (
    <SectionWrapper
      id="search"
      number="04"
      title="Search"
      description="Global research search — the fastest way to navigate Cambium's knowledge graph."
    >
      <ComponentGroup label="Search Trigger" note="Opens the global search overlay — try clicking it">
        <SearchTrigger onClick={() => setOverlayOpen(true)} />
      </ComponentGroup>

      {/* Static overlay preview */}
      <ComponentGroup label="Search Overlay" note="Full search experience with categories and results">
        <div className="w-full max-w-2xl bg-surface rounded-xl border border-line shadow-lg overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-line">
            <SearchIcon />
            <span className="flex-1 text-sm text-ink">federated learning medical imaging</span>
            <span className="text-[10px] text-ink-3 bg-surface-2 border border-line px-1.5 py-0.5 rounded font-mono">
              Esc
            </span>
          </div>
          <div className="flex items-center gap-1 px-3 py-2 border-b border-line">
            {["All", ...categories.slice(0, 5)].map(cat => (
              <button
                key={cat}
                className={`px-2.5 py-1 text-xs rounded-md font-medium ${
                  cat === "All"
                    ? "bg-navy-light text-navy"
                    : "text-ink-3 hover:text-ink hover:bg-surface-2"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="divide-y divide-line">
            {results.slice(0, 3).map((result, i) => (
              <div key={i} className={`flex items-start gap-3 px-4 py-3 ${i === 0 ? "bg-surface-2" : ""} cursor-pointer hover:bg-surface-2 transition-colors`}>
                <div className="mt-0.5 w-7 h-7 rounded-md bg-surface-2 border border-line flex items-center justify-center flex-shrink-0 text-ink-3">
                  <TypeIcon type={result.icon} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-ink leading-snug">{result.title}</p>
                    <span className="flex-shrink-0 text-[10px] text-ink-3 bg-surface-3 px-1.5 py-0.5 rounded">
                      {result.type}
                    </span>
                  </div>
                  <p className="text-xs text-ink-3 mt-0.5">{result.meta}</p>
                  <p className="text-[11px] text-navy mt-1">{result.relevance}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between px-4 py-2.5 border-t border-line bg-surface-2">
            <div className="flex items-center gap-3 text-[10px] text-ink-3">
              <span className="flex items-center gap-1"><kbd className="bg-surface border border-line px-1 rounded font-mono text-[9px]">↑↓</kbd> Navigate</span>
              <span className="flex items-center gap-1"><kbd className="bg-surface border border-line px-1 rounded font-mono text-[9px]">↵</kbd> Open</span>
            </div>
            <span className="text-[10px] text-ink-3">4 results for "federated learning"</span>
          </div>
        </div>
      </ComponentGroup>

      {/* Recent & Suggestions */}
      <ComponentGroup label="Recent Searches & Suggestions" row>
        <div className="bg-surface border border-line rounded-lg overflow-hidden w-64">
          <div className="px-3 py-2 border-b border-line">
            <p className="text-[10px] text-ink-3 uppercase tracking-widest">Recent</p>
          </div>
          {recentSearches.map((s, i) => (
            <button key={i} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-ink-2 hover:bg-surface-2 transition-colors text-left">
              <svg className="w-3.5 h-3.5 text-ink-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              {s}
            </button>
          ))}
        </div>
        <div className="bg-surface border border-line rounded-lg overflow-hidden w-72">
          <div className="px-3 py-2 border-b border-line">
            <p className="text-[10px] text-ink-3 uppercase tracking-widest">Suggestions</p>
          </div>
          {suggestions.map((s, i) => (
            <button key={i} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-ink-2 hover:bg-surface-2 transition-colors text-left">
              <svg className="w-3.5 h-3.5 text-ink-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              {s}
            </button>
          ))}
        </div>
      </ComponentGroup>

      {overlayOpen && <SearchOverlay onClose={() => setOverlayOpen(false)} />}
    </SectionWrapper>
  );
}
