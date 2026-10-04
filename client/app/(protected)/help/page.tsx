"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CambiumLogo from "@/components/CambiumLogo";

const categories = [
  {
    id: "getting-started",
    title: "Getting Started",
    description: "Set up your account, explore core features, and take your first steps with Cambium.",
    count: 12,
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 2L2 7l9 5 9-5-9-5z"/>
        <path d="M2 17l9 5 9-5"/>
        <path d="M2 12l9 5 9-5"/>
      </svg>
    ),
  },
  {
    id: "academic-identity",
    title: "Academic Identity",
    description: "Manage your scholarly profile, publications, affiliations, and citation linking.",
    count: 8,
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"/>
        <path d="M12 6v6l4 2"/>
      </svg>
    ),
  },
  {
    id: "ai-intelligence",
    title: "AI Intelligence",
    description: "Understand how Cambium's AI surfaces insights, suggests connections, and learns from your work.",
    count: 15,
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/>
        <path d="M17.5 14v7M14 17.5h7"/>
      </svg>
    ),
  },
  {
    id: "billing",
    title: "Billing & Plans",
    description: "Review subscription tiers, update payment methods, download invoices, and manage your plan.",
    count: 9,
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2"/>
        <path d="M2 10h20"/>
        <path d="M7 15h2M13 15h4"/>
      </svg>
    ),
  },
  {
    id: "integrations",
    title: "Integrations",
    description: "Connect Zotero, Google Scholar, institutional repositories, and third-party research tools.",
    count: 11,
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6" cy="6" r="3"/>
        <circle cx="18" cy="6" r="3"/>
        <circle cx="12" cy="18" r="3"/>
        <path d="M9 6h6M7.8 8.7l-2.6 6.6M16.2 8.7l2.6 6.6"/>
      </svg>
    ),
  },
  {
    id: "privacy-security",
    title: "Privacy & Security",
    description: "Control data sharing, enable two-factor authentication, and review access logs.",
    count: 7,
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L3 6v6c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V6L12 2z"/>
        <path d="M9 12l2 2 4-4"/>
      </svg>
    ),
  },
];

const issueTypes = [
  "Select issue type…",
  "Bug report",
  "Feature request",
  "Account access",
  "Billing inquiry",
  "Data & privacy",
  "Performance issue",
  "Other",
];

const popularArticles = [
  "How to import your existing publication list",
  "Understanding your AI-generated research digest",
  "Linking your ORCID to your Cambium profile",
  "Changing your billing cycle from monthly to annual",
  "Exporting your citation network as a graph",
];

export default function HelpPage() {
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [issueType, setIssueType] = useState("Select issue type…");
  const [description, setDescription] = useState("");
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = categories.filter(
    (c) =>
      query === "" ||
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.description.toLowerCase().includes(query.toLowerCase())
  );

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const dropped = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...dropped]);
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setModalOpen(false);
      setSubmitted(false);
      setIssueType("Select issue type…");
      setDescription("");
      setFiles([]);
    }, 2000);
  }

  function closeModal() {
    setModalOpen(false);
    setSubmitted(false);
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[#FAF7F0] text-[#202920] font-sans w-full overflow-y-auto">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-[#E4DCCB] bg-[#FAF7F0]/90 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#66866A] animate-pulse" />
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#3E6248]">
              Scholarly Support & Documentation
            </span>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#3E6248] hover:bg-[#202920] text-white font-mono text-xs font-semibold tracking-wider uppercase transition-colors border border-[#3E6248] shadow-2xs cursor-pointer"
          >
            <span>Contact Support</span>
            <span>→</span>
          </button>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-5xl mx-auto px-6 pt-12 pb-20">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F2EBDD] border border-[#E4DCCB] text-[#3E6248] text-[11px] font-mono tracking-wider uppercase mb-4 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3E6248]" />
            Cambium Research Documentation Desk
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl mb-3 tracking-tight font-serif font-normal text-[#202920]">
            How can we assist your research?
          </h1>
          <p className="text-sm sm:text-base text-[#62685E] font-sans max-w-xl mx-auto leading-relaxed">
            Search our curated guides, verified methodology protocols, platform documentation, and direct inquiry support.
          </p>
        </div>

        {/* Search Bar - Clean, spacious, fully typeable with search icon on left */}
        <div className="flex justify-center mb-12">
          <div className="relative w-full max-w-2xl">
            {/* Search Icon cleanly on the left */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#85877B] flex items-center justify-center z-10">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="9" r="6.25"/>
                <path d="M14 14L18.5 18.5"/>
              </svg>
            </div>

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search guides, protocols, FAQs, or troubleshooting…"
              className="w-full h-14 sm:h-16 pl-12 pr-12 rounded-2xl text-[15px] sm:text-base outline-none transition-all duration-200 bg-white border border-[#E4DCCB] text-[#202920] font-sans shadow-2xs hover:border-[#66866A]/60 focus:border-[#3E6248] focus:ring-4 focus:ring-[#3E6248]/10 placeholder:text-[#85877B]"
              aria-label="Search help resources"
            />

            {/* Clear Button when user types */}
            {query.length > 0 && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#FAF7F0] hover:bg-[#E4DCCB] text-[#62685E] hover:text-[#202920] flex items-center justify-center border border-[#E4DCCB] transition-colors cursor-pointer z-10"
                title="Clear search"
                aria-label="Clear search query"
              >
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M2 2l10 10M12 2L2 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Category grid */}
        {query === "" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-14">
            {categories.map((cat) => (
               <button
                key={cat.id}
                className="text-left p-6 rounded-xl border border-[#E4DCCB] bg-white hover:border-[#3E6248] hover:shadow-md transition-all duration-200 group cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="mb-4 w-10 h-10 rounded-lg flex items-center justify-center bg-[#FAF7F0] border border-[#E4DCCB] text-[#3E6248] group-hover:bg-[#3E6248] group-hover:text-white transition-colors duration-200">
                    {cat.icon}
                  </div>
                  <h3 className="text-sm font-semibold mb-1.5 text-[#202920] font-sans group-hover:text-[#3E6248] transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs leading-relaxed mb-4 text-[#62685E] font-sans">
                    {cat.description}
                  </p>
                </div>
                <span className="text-[11px] font-mono tracking-wider text-[#3E6248] uppercase font-medium">
                  {cat.count} articles →
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="mb-14">
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-[#62685E] font-sans bg-white border border-[#E4DCCB] rounded-xl p-8">
                <p className="text-base mb-2 font-medium text-[#202920]">No results for "{query}"</p>
                <p className="text-xs">
                  Try different keywords, or{" "}
                  <button
                    className="underline text-[#3E6248] font-semibold bg-transparent border-none cursor-pointer p-0"
                    onClick={() => setModalOpen(true)}
                  >
                    contact scholarly support
                  </button>
                  .
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filtered.map((cat) => (
                  <button
                    key={cat.id}
                    className="text-left p-6 rounded-xl border border-[#E4DCCB] bg-white hover:border-[#3E6248] hover:shadow-md transition-all duration-200 group cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="mb-4 w-10 h-10 rounded-lg flex items-center justify-center bg-[#FAF7F0] border border-[#E4DCCB] text-[#3E6248] group-hover:bg-[#3E6248] group-hover:text-white transition-colors">
                        {cat.icon}
                      </div>
                      <h3 className="text-sm font-semibold mb-1.5 text-[#202920] font-sans group-hover:text-[#3E6248] transition-colors">
                        {cat.title}
                      </h3>
                      <p className="text-xs leading-relaxed mb-4 text-[#62685E] font-sans">
                        {cat.description}
                      </p>
                    </div>
                    <span className="text-[11px] font-mono tracking-wider text-[#3E6248] uppercase font-medium">
                      {cat.count} articles →
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Popular articles */}
        {query === "" && (
          <div className="rounded-xl border border-[#E4DCCB] p-6 bg-white shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-serif font-normal text-[#202920]">
                Frequently Consulted Protocols & Guides
              </h2>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#85877B]">Curated Resources</span>
            </div>
            <ul className="divide-y divide-[#E4DCCB]/60">
              {popularArticles.map((article, i) => (
                <li key={i}>
                  <button
                    className="w-full text-left flex items-center justify-between py-3.5 text-xs sm:text-sm transition-colors text-[#202920] bg-transparent border-none cursor-pointer hover:text-[#3E6248] group font-sans"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">{article}</span>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-[#85877B] group-hover:text-[#3E6248] transition-colors shrink-0 ml-2">
                      <path d="M3 7h8M8 4l3 3-3 3"/>
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer CTA */}
        <div className="mt-14 text-center font-sans">
          <p className="text-xs mb-3 text-[#62685E]">
            Didn't find what you were looking for?
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="text-xs font-mono uppercase tracking-wider font-semibold transition-colors text-[#3E6248] bg-transparent border-none cursor-pointer hover:underline"
          >
            Contact our scholarly support team →
          </button>
        </div>
      </main>

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#202920]/40 backdrop-blur-[3px]"
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div
            className="w-full max-w-md rounded-2xl p-6 relative bg-[#FAF7F0] shadow-2xl border border-[#E4DCCB] animate-in fade-in zoom-in-95 duration-200"
          >
            {submitted ? (
              <div className="text-center py-8 font-sans">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 bg-[#3E6248]/10 text-[#3E6248]">
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 12l5 5L18 6"/>
                  </svg>
                </div>
                <h2 className="text-base font-serif font-normal mb-2 text-[#202920]">
                  Ticket Submitted Successfully
                </h2>
                <p className="text-xs text-[#62685E]">
                  Our editorial support desk will follow up within 1 business day.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="font-sans">
                {/* Header */}
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#3E6248] font-semibold">
                      INQUIRY PROTOCOL
                    </span>
                    <h2 className="text-lg font-serif font-normal mb-0.5 text-[#202920]">
                      Scholarly Support Inquiry
                    </h2>
                    <p className="text-xs text-[#62685E]">
                      Our team responds within 1 business day.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="w-7 h-7 flex items-center justify-center rounded-md transition-colors duration-100 text-[#85877B] hover:bg-[#E4DCCB]/60 hover:text-[#202920] bg-transparent border-none cursor-pointer"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                      <path d="M2 2l10 10M12 2L2 12"/>
                    </svg>
                  </button>
                </div>

                {/* Issue type */}
                <div className="mb-4">
                  <label className="block text-xs font-semibold mb-1.5 text-[#202920]">
                    Inquiry Classification
                  </label>
                  <div className="relative">
                    <select
                      value={issueType}
                      onChange={(e) => setIssueType(e.target.value)}
                      required
                      className="w-full h-10 pl-3 pr-8 rounded-lg text-sm appearance-none outline-none transition-all duration-150 border border-[#E4DCCB] bg-white font-sans text-[#202920] focus:border-[#3E6248] focus:ring-2 focus:ring-[#3E6248]/15"
                    >
                      {issueTypes.map((t) => (
                        <option key={t} value={t} disabled={t === "Select issue type…"}>
                          {t}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#85877B]">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                        <path d="M2 4l4 4 4-4"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label className="block text-xs font-semibold mb-1.5 text-[#202920]">
                    Description & Context
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide details, reproducible URLs, or methodology context…"
                    required
                    rows={4}
                    className="w-full px-3 py-2.5 rounded-lg text-sm resize-none outline-none transition-all duration-150 border border-[#E4DCCB] bg-white text-[#202920] font-sans h-28 focus:border-[#3E6248] focus:ring-2 focus:ring-[#3E6248]/15"
                  />
                </div>

                {/* File upload */}
                <div className="mb-5">
                  <label className="block text-xs font-semibold mb-1.5 text-[#202920]">
                    Attachments{" "}
                    <span className="text-[#85877B] font-normal">(optional)</span>
                  </label>
                  <div
                    className="rounded-lg p-4 text-center cursor-pointer transition-colors duration-150 border border-dashed border-[#E4DCCB] bg-white/70 hover:bg-white hover:border-[#3E6248]"
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={handleFileInput}
                    />
                    <div className="flex flex-col items-center gap-1.5">
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" className="text-[#85877B]" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 12v3a1 1 0 001 1h10a1 1 0 001-1v-3"/>
                        <path d="M9 2v9M6 5l3-3 3 3"/>
                      </svg>
                      {files.length > 0 ? (
                        <p className="text-xs text-[#202920] font-medium">
                          {files.length} file{files.length > 1 ? "s" : ""} selected
                        </p>
                      ) : (
                        <p className="text-xs text-[#62685E]">
                          Drag and drop screenshots here or{" "}
                          <span className="text-[#3E6248] font-semibold">click to browse</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="text-xs font-mono uppercase tracking-wider px-4 py-2 border border-[#E4DCCB] rounded-full text-[#62685E] hover:bg-[#E4DCCB]/40 transition-colors"
                  >
                    Cancel
                  </button>
                  <Button
                    type="submit"
                    className="bg-[#3E6248] hover:bg-[#293E30] text-white text-xs font-mono uppercase tracking-wider rounded-full px-5 h-9 border-none shadow-sm"
                  >
                    Submit Ticket →
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
