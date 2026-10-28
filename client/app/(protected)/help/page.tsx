"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CambiumLogo from "@/components/CambiumLogo";
import { uploadArtifactsBatch } from "@/lib/api";

const categories = [
  {
    id: "getting-started",
    title: "Getting Started",
    description: "Set up your account, explore core features, and take your first steps with Cambium.",
    count: 12,
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 2 10 5.5-10 5.5L2 7.5z"/>
        <path d="m2 12.5 10 5.5 10-5.5"/>
        <path d="m2 17.5 10 5.5 10-5.5"/>
      </svg>
    ),
  },
  {
    id: "academic-identity",
    title: "Academic Identity",
    description: "Manage your scholarly profile, publications, affiliations, and citation linking.",
    count: 8,
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9"/>
        <polyline points="12 7 12 12 15 14"/>
      </svg>
    ),
  },
  {
    id: "ai-intelligence",
    title: "AI Intelligence",
    description: "Understand how Cambium's AI surfaces insights, suggests connections, and learns from your work.",
    count: 15,
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5"/>
        <rect x="14" y="3" width="7" height="7" rx="1.5"/>
        <rect x="3" y="14" width="7" height="7" rx="1.5"/>
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
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2.5"/>
        <line x1="2" y1="10" x2="22" y2="10"/>
        <line x1="6" y1="15" x2="9" y2="15"/>
        <line x1="13" y1="15" x2="17" y2="15"/>
      </svg>
    ),
  },
  {
    id: "integrations",
    title: "Integrations",
    description: "Connect Zotero, Google Scholar, institutional repositories, and third-party research tools.",
    count: 11,
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
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
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <path d="m9 12 2 2 4-4"/>
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
  "How to link your ORCID iD and auto-import publications",
  "Configuring custom citation style outputs (APA, Chicago, IEEE)",
  "Setting up multi-institutional team permissions and lab workspaces",
  "Understanding Cambium AI literature synthesis and citation lineage",
  "Troubleshooting Zotero and Mendeley live sync latency",
  "Exporting research dossiers and grant-ready biosketches",
];

export default function HelpPage() {
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [issueType, setIssueType] = useState("Select issue type…");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = query.trim()
    ? categories.filter(
        (c) =>
          c.title.toLowerCase().includes(query.toLowerCase()) ||
          c.description.toLowerCase().includes(query.toLowerCase())
      )
    : categories;

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files) {
      setFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files)]);
    }
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (issueType === "Select issue type…" || !description.trim()) return;
    setSubmitted(true);
    if (files.length > 0) {
      try {
        await uploadArtifactsBatch(files);
      } catch {
        // Fallback handled in uploadArtifact
      }
    }
    setTimeout(() => {
      setSubmitted(false);
      setModalOpen(false);
      setIssueType("Select issue type…");
      setDescription("");
      setFiles([]);
    }, 2500);
  }

  function closeModal() {
    setModalOpen(false);
    setSubmitted(false);
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[#FAF7F0] dark:bg-[#0E140F] text-[#202920] dark:text-[#EDEAE2] font-sans w-full overflow-y-auto transition-colors duration-200">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-[#E4DCCB] dark:border-[#233327] bg-[#FAF7F0]/90 dark:bg-[#0E140F]/90 backdrop-blur-md transition-colors duration-200">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#66866A] dark:bg-[#4ADE80] animate-pulse" />
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#3E6248] dark:text-[#4ADE80]">
              Scholarly Support & Documentation
            </span>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#3E6248] hover:bg-[#202920] dark:bg-[#4ADE80] dark:hover:bg-[#22c55e] text-white dark:text-[#0E140F] font-mono text-xs font-semibold tracking-wider uppercase transition-colors border border-[#3E6248] dark:border-[#4ADE80] shadow-2xs cursor-pointer"
          >
            <span>Contact Support</span>
            <span>→</span>
          </button>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-5xl mx-auto px-6 pt-12 pb-20">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F2EBDD] dark:bg-[#131C15] border border-[#E4DCCB] dark:border-[#233327] text-[#3E6248] dark:text-[#4ADE80] text-[11px] font-mono tracking-wider uppercase mb-4 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3E6248] dark:bg-[#4ADE80]" />
            Cambium Research Documentation Desk
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl mb-3 tracking-tight font-serif font-normal text-[#202920] dark:text-[#EDEAE2]">
            How can we assist your research?
          </h1>
          <p className="text-sm sm:text-base text-[#62685E] dark:text-[#A3B899] font-sans max-w-xl mx-auto leading-relaxed">
            Search our curated guides, verified methodology protocols, platform documentation, and direct inquiry support.
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex justify-center mb-12">
          <div className="relative w-full max-w-2xl">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#85877B] dark:text-[#7E8B7B] flex items-center justify-center z-10">
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
              className="w-full h-14 sm:h-16 pl-12 pr-12 rounded-2xl text-[15px] sm:text-base outline-none transition-all duration-200 bg-white dark:bg-[#18231B] border border-[#E4DCCB] dark:border-[#233327] text-[#202920] dark:text-[#EDEAE2] font-sans shadow-2xs hover:border-[#66866A]/60 dark:hover:border-[#4ADE80]/60 focus:border-[#3E6248] dark:focus:border-[#4ADE80] focus:ring-4 focus:ring-[#3E6248]/10 dark:focus:ring-[#4ADE80]/10 placeholder:text-[#85877B] dark:placeholder:text-[#7E8B7B]"
              aria-label="Search help resources"
            />

            {query.length === 0 && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none hidden sm:flex items-center gap-1 font-mono text-[11px] text-[#85877B] dark:text-[#7E8B7B] bg-[#FAF7F0] dark:bg-[#131C15] px-2 py-0.5 rounded border border-[#E4DCCB] dark:border-[#233327]">
                <span>⌘K</span>
              </div>
            )}

            {query.length > 0 && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#85877B] hover:text-[#202920] dark:hover:text-[#EDEAE2] p-1 bg-transparent border-0 cursor-pointer"
                aria-label="Clear search"
              >
                ✕
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
                className="text-left p-6 rounded-xl border border-[#E4DCCB] dark:border-[#233327] bg-white dark:bg-[#18231B] hover:border-[#3E6248] dark:hover:border-[#4ADE80] hover:shadow-md transition-all duration-200 group cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="mb-4 w-10 h-10 rounded-lg flex items-center justify-center bg-[#FAF7F0] dark:bg-[#131C15] border border-[#E4DCCB] dark:border-[#233327] text-[#3E6248] dark:text-[#4ADE80] group-hover:bg-[#3E6248] group-hover:text-white dark:group-hover:bg-[#3E6248] dark:group-hover:text-white transition-colors duration-200 shrink-0">
                    {cat.icon}
                  </div>
                  <h3 className="text-sm font-semibold mb-1.5 text-[#202920] dark:text-[#EDEAE2] font-sans group-hover:text-[#3E6248] dark:group-hover:text-[#4ADE80] transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs leading-relaxed mb-4 text-[#62685E] dark:text-[#A3B899] font-sans">
                    {cat.description}
                  </p>
                </div>
                <span className="text-[11px] font-mono tracking-wider text-[#3E6248] dark:text-[#4ADE80] uppercase font-medium">
                  {cat.count} articles →
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="mb-14">
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-[#62685E] dark:text-[#A3B899] font-sans bg-white dark:bg-[#18231B] border border-[#E4DCCB] dark:border-[#233327] rounded-xl p-8">
                <p className="text-base mb-2 font-medium text-[#202920] dark:text-[#EDEAE2]">No results for "{query}"</p>
                <p className="text-xs">
                  Try different keywords, or{" "}
                  <button
                    className="underline text-[#3E6248] dark:text-[#4ADE80] font-semibold bg-transparent border-none cursor-pointer p-0"
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
                    className="text-left p-6 rounded-xl border border-[#E4DCCB] dark:border-[#233327] bg-white dark:bg-[#18231B] hover:border-[#3E6248] dark:hover:border-[#4ADE80] hover:shadow-md transition-all duration-200 group cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="mb-4 w-10 h-10 rounded-lg flex items-center justify-center bg-[#FAF7F0] dark:bg-[#131C15] border border-[#E4DCCB] dark:border-[#233327] text-[#3E6248] dark:text-[#4ADE80] group-hover:bg-[#3E6248] group-hover:text-white dark:group-hover:bg-[#3E6248] dark:group-hover:text-white transition-colors duration-200 shrink-0">
                        {cat.icon}
                      </div>
                      <h3 className="text-sm font-semibold mb-1.5 text-[#202920] dark:text-[#EDEAE2] font-sans group-hover:text-[#3E6248] dark:group-hover:text-[#4ADE80] transition-colors">
                        {cat.title}
                      </h3>
                      <p className="text-xs leading-relaxed mb-4 text-[#62685E] dark:text-[#A3B899] font-sans">
                        {cat.description}
                      </p>
                    </div>
                    <span className="text-[11px] font-mono tracking-wider text-[#3E6248] dark:text-[#4ADE80] uppercase font-medium">
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
          <div className="rounded-xl border border-[#E4DCCB] dark:border-[#233327] p-6 bg-white dark:bg-[#18231B] shadow-sm transition-colors duration-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-serif font-normal text-[#202920] dark:text-[#EDEAE2]">
                Frequently Consulted Protocols & Guides
              </h2>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#85877B] dark:text-[#7E8B7B]">Curated Resources</span>
            </div>
            <ul className="divide-y divide-[#E4DCCB]/60 dark:divide-[#233327]/60">
              {popularArticles.map((article, i) => (
                <li key={i}>
                  <button
                    className="w-full text-left flex items-center justify-between py-3.5 text-xs sm:text-sm transition-colors text-[#202920] dark:text-[#EDEAE2] bg-transparent border-none cursor-pointer hover:text-[#3E6248] dark:hover:text-[#4ADE80] group font-sans"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">{article}</span>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-[#85877B] dark:text-[#7E8B7B] group-hover:text-[#3E6248] dark:group-hover:text-[#4ADE80] transition-colors shrink-0 ml-2">
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
          <p className="text-xs mb-3 text-[#62685E] dark:text-[#A3B899]">
            Didn't find what you were looking for?
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="text-xs font-mono uppercase tracking-wider font-semibold transition-colors text-[#3E6248] dark:text-[#4ADE80] bg-transparent border-none cursor-pointer hover:underline"
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
            className="w-full max-w-md rounded-2xl p-6 relative bg-[#FAF7F0] dark:bg-[#131C15] shadow-2xl border border-[#E4DCCB] dark:border-[#233327] animate-in fade-in zoom-in-95 duration-200"
          >
            {submitted ? (
              <div className="text-center py-8 font-sans">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 bg-[#3E6248]/10 dark:bg-[#4ADE80]/10 text-[#3E6248] dark:text-[#4ADE80]">
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 12l5 5L18 6"/>
                  </svg>
                </div>
                <h2 className="text-base font-serif font-normal mb-2 text-[#202920] dark:text-[#EDEAE2]">
                  Ticket Submitted Successfully
                </h2>
                <p className="text-xs text-[#62685E] dark:text-[#A3B899]">
                  Our editorial support desk will follow up within 1 business day.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="font-sans">
                {/* Header */}
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#3E6248] dark:text-[#4ADE80] font-semibold">
                      INQUIRY PROTOCOL
                    </span>
                    <h2 className="text-lg font-serif font-normal mb-0.5 text-[#202920] dark:text-[#EDEAE2]">
                      Scholarly Support Inquiry
                    </h2>
                    <p className="text-xs text-[#62685E] dark:text-[#A3B899]">
                      Our team responds within 1 business day.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="w-7 h-7 flex items-center justify-center rounded-md transition-colors duration-100 text-[#85877B] hover:bg-[#E4DCCB]/60 dark:hover:bg-[#18231B] hover:text-[#202920] dark:hover:text-[#EDEAE2] bg-transparent border-none cursor-pointer"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                      <path d="M2 2l10 10M12 2L2 12"/>
                    </svg>
                  </button>
                </div>

                {/* Issue type */}
                <div className="mb-4">
                  <label className="block text-xs font-semibold mb-1.5 text-[#202920] dark:text-[#EDEAE2]">
                    Inquiry Classification
                  </label>
                  <div className="relative">
                    <select
                      value={issueType}
                      onChange={(e) => setIssueType(e.target.value)}
                      required
                      className="w-full h-10 pl-3 pr-8 rounded-lg text-sm appearance-none outline-none transition-all duration-150 border border-[#E4DCCB] dark:border-[#233327] bg-white dark:bg-[#18231B] font-sans text-[#202920] dark:text-[#EDEAE2] focus:border-[#3E6248] dark:focus:border-[#4ADE80] focus:ring-2 focus:ring-[#3E6248]/15 dark:focus:ring-[#4ADE80]/15"
                    >
                      {issueTypes.map((t) => (
                        <option key={t} value={t} disabled={t === "Select issue type…"}>
                          {t}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#85877B] dark:text-[#7E8B7B]">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                        <path d="M2 4l4 4 4-4"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label className="block text-xs font-semibold mb-1.5 text-[#202920] dark:text-[#EDEAE2]">
                    Description & Context
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide details, reproducible URLs, or methodology context…"
                    required
                    rows={4}
                    className="w-full px-3 py-2.5 rounded-lg text-sm resize-none outline-none transition-all duration-150 border border-[#E4DCCB] dark:border-[#233327] bg-white dark:bg-[#18231B] text-[#202920] dark:text-[#EDEAE2] font-sans h-28 focus:border-[#3E6248] dark:focus:border-[#4ADE80] focus:ring-2 focus:ring-[#3E6248]/15 dark:focus:ring-[#4ADE80]/15"
                  />
                </div>

                {/* File upload */}
                <div className="mb-5">
                  <label className="block text-xs font-semibold mb-1.5 text-[#202920] dark:text-[#EDEAE2]">
                    Attachments{" "}
                    <span className="text-[#85877B] dark:text-[#7E8B7B] font-normal">(optional)</span>
                  </label>
                  <div
                    className="rounded-lg p-4 text-center cursor-pointer transition-colors duration-150 border border-dashed border-[#E4DCCB] dark:border-[#233327] bg-white/70 dark:bg-[#18231B]/70 hover:bg-white dark:hover:bg-[#18231B] hover:border-[#3E6248] dark:hover:border-[#4ADE80]"
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
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" className="text-[#85877B] dark:text-[#7E8B7B]" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 12v3a1 1 0 001 1h10a1 1 0 001-1v-3"/>
                        <path d="M9 2v9M6 5l3-3 3 3"/>
                      </svg>
                      {files.length > 0 ? (
                        <div className="space-y-1">
                          <p className="text-xs text-[#202920] dark:text-[#EDEAE2] font-medium">
                            {files.length} file{files.length > 1 ? "s" : ""} selected
                          </p>
                          <div className="flex flex-wrap gap-1 justify-center">
                            {files.map((f, i) => (
                              <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#DCE6D7] text-[#3E6248]">
                                {f.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-[#62685E] dark:text-[#A3B899]">
                          Drag and drop screenshots here or{" "}
                          <span className="text-[#3E6248] dark:text-[#4ADE80] font-semibold">click to browse</span>
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
                    className="text-xs font-mono uppercase tracking-wider px-4 py-2 border border-[#E4DCCB] dark:border-[#233327] rounded-full text-[#62685E] dark:text-[#A3B899] hover:bg-[#E4DCCB]/40 dark:hover:bg-[#18231B] transition-colors"
                  >
                    Cancel
                  </button>
                  <Button
                    type="submit"
                    className="bg-[#3E6248] hover:bg-[#293E30] dark:bg-[#4ADE80] dark:hover:bg-[#22c55e] text-white dark:text-[#0E140F] text-xs font-mono uppercase tracking-wider rounded-full px-5 h-9 border-none shadow-sm font-semibold"
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
