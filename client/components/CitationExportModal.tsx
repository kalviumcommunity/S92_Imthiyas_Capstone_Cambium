"use client";

import React, { useState } from "react";
import { Copy, Check, Download, X, BookOpen, Quote } from "lucide-react";

export interface CitationItem {
  id: string;
  title: string;
  author?: string;
  organization?: string;
  year?: number | string;
  url?: string;
  doi?: string;
  type?: string;
}

interface CitationExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: CitationItem | null;
}

type CitationFormat = "bibtex" | "apa" | "ieee" | "ris";

export default function CitationExportModal({
  isOpen,
  onClose,
  item,
}: CitationExportModalProps) {
  const [activeFormat, setActiveFormat] = useState<CitationFormat>("bibtex");
  const [copied, setCopied] = useState(false);

  if (!isOpen || !item) return null;

  const currentYear = item.year || new Date().getFullYear();
  const authorOrOrg = item.author || item.organization || "Cambium Research Contributor";
  const citeKey = `${authorOrOrg.split(" ")[0].toLowerCase().replace(/[^a-z0-9]/g, "")}${currentYear}_${item.id.slice(0, 4)}`;

  const generateCitationText = (format: CitationFormat): string => {
    switch (format) {
      case "bibtex":
        return `@misc{${citeKey},
  title        = {${item.title}},
  author       = {${authorOrOrg}},
  year         = {${currentYear}},
  howpublished = {Cambium Research Operating System},
  url          = {${item.url || `https://cambium.research/opportunity/${item.id}`}},
  note         = {Accessed via Cambium Scholarly Network}
}`;

      case "apa":
        return `${authorOrOrg}. (${currentYear}). ${item.title}. Cambium Research Platform. ${item.url || `https://cambium.research/opportunity/${item.id}`}`;

      case "ieee":
        return `[1] ${authorOrOrg}, "${item.title}," Cambium Research Intelligence, ${currentYear}. [Online]. Available: ${item.url || `https://cambium.research/opportunity/${item.id}`}`;

      case "ris":
        return `TY  - GEN
TI  - ${item.title}
AU  - ${authorOrOrg}
PY  - ${currentYear}
DP  - Cambium Research
UR  - ${item.url || `https://cambium.research/opportunity/${item.id}`}
ER  - `;
    }
  };

  const citationText = generateCitationText(activeFormat);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(citationText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleDownload = () => {
    const ext = activeFormat === "bibtex" ? "bib" : activeFormat === "ris" ? "ris" : "txt";
    const blob = new Blob([citationText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${citeKey}.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-[#FAF7F0] border border-[#E4DCCB] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="citation-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#F2EBDD] border-b border-[#E4DCCB]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#3E6248]/10 text-[#3E6248] flex items-center justify-center">
              <Quote size={16} />
            </div>
            <div>
              <h2 id="citation-modal-title" className="text-base font-serif font-bold text-[#202920] m-0">
                Export Academic Citation
              </h2>
              <p className="text-xs text-[#556052] m-0">
                BibTeX, APA, IEEE, and RIS formats for reference managers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#556052] hover:text-[#202920] hover:bg-[#E4DCCB]/60 transition-colors"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Format Selector Tabs */}
        <div className="flex border-b border-[#E4DCCB] bg-[#FAF7F0] px-6 pt-3 gap-2">
          {(
            [
              { id: "bibtex", label: "BibTeX (.bib)" },
              { id: "apa", label: "APA 7th" },
              { id: "ieee", label: "IEEE" },
              { id: "ris", label: "RIS (Zotero / EndNote)" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFormat(tab.id)}
              className={`px-4 py-2 text-xs font-medium rounded-t-lg transition-all border-b-2 ${
                activeFormat === tab.id
                  ? "border-[#3E6248] text-[#3E6248] bg-white/70 font-semibold shadow-sm"
                  : "border-transparent text-[#6B7566] hover:text-[#202920]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Item Summary Card */}
        <div className="px-6 pt-4 pb-2">
          <div className="p-3 bg-white/80 rounded-xl border border-[#E4DCCB]/80 flex items-start gap-3">
            <BookOpen size={16} className="text-[#3E6248] shrink-0 mt-0.5" />
            <div className="min-w-0">
              <div className="text-xs font-semibold text-[#202920] line-clamp-1">
                {item.title}
              </div>
              <div className="text-[11px] text-[#6B7566]">
                {authorOrOrg} · {currentYear} {item.type ? `· ${item.type}` : ""}
              </div>
            </div>
          </div>
        </div>

        {/* Code Content */}
        <div className="p-6 pt-2 flex-1">
          <div className="relative">
            <pre className="p-4 bg-[#202920] text-[#DCE6D7] rounded-xl text-xs font-mono overflow-x-auto max-h-56 leading-relaxed border border-[#3E6248]/30 selection:bg-[#4ADE80] selection:text-black">
              <code>{citationText}</code>
            </pre>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#F2EBDD]/60 border-t border-[#E4DCCB]">
          <span className="text-xs text-[#6B7566]">
            Compatible with Zotero, Mendeley, Overleaf, and LaTeX
          </span>
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleDownload}
              className="px-4 py-2 text-xs font-medium rounded-xl border border-[#E4DCCB] text-[#202920] bg-white hover:bg-[#FAF7F0] transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Download size={14} />
              Download .{activeFormat === "bibtex" ? "bib" : activeFormat === "ris" ? "ris" : "txt"}
            </button>
            <button
              onClick={handleCopy}
              className={`px-4 py-2 text-xs font-semibold rounded-xl text-white transition-all flex items-center gap-1.5 shadow-sm ${
                copied
                  ? "bg-[#293E30] text-[#4ADE80]"
                  : "bg-[#3E6248] hover:bg-[#293E30]"
              }`}
            >
              {copied ? (
                <>
                  <Check size={14} /> Copied!
                </>
              ) : (
                <>
                  <Copy size={14} /> Copy Citation
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
