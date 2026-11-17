"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getMyBookmarks, removeBookmark } from "@/lib/api";
import { useAuthStore } from "@/lib/store/useAuthStore";
import OpportunityCard from "@/components/OpportunityCard";
import {
  Bookmark,
  LogIn,
  ArrowRight,
  ChevronRight,
  Compass,
  LayoutDashboard,
  FileText,
  Calendar,
  Download,
  Trash2,
  ExternalLink,
  BookOpen,
  Filter,
  Check,
  Search,
} from "lucide-react";
import { PublicHeader } from "@/components/PublicHeader";
import Footer from "@/components/Footer";

export interface UnifiedBookmark {
  id: string;
  type?: "opportunity" | "paper" | "book" | "dataset" | "software";
  title: string;
  funder?: string;
  amount?: string;
  deadline?: string;
  authors?: string[];
  year?: number;
  venue?: string;
  doi?: string;
  url?: string;
  savedAt?: string;
}

export default function BookmarksPage() {
  const { isAuthenticated } = useAuthStore();
  const [localBookmarks, setLocalBookmarks] = useState<UnifiedBookmark[]>([]);
  const [activeFilter, setActiveFilter] = useState<"all" | "opportunity" | "paper" | "other">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("cambium_bookmarks");
        if (stored) {
          setLocalBookmarks(JSON.parse(stored));
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

  const {
    data: apiBookmarks,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["my-bookmarks"],
    queryFn: getMyBookmarks,
    enabled: isAuthenticated,
  });

  // Merge API and local bookmarks
  const mergedBookmarks = useMemo(() => {
    const list: UnifiedBookmark[] = [...localBookmarks];
    if (apiBookmarks && Array.isArray(apiBookmarks)) {
      for (const b of apiBookmarks) {
        const opp = b.opportunity as any;
        if (opp && !list.some((item) => item.id === opp.id)) {
          list.push({
            id: opp.id,
            type: "opportunity",
            title: opp.title,
            funder: opp.organization || opp.funder || opp.org || "Funding Agency",
            amount: opp.amount || opp.funding || "$500,000",
            deadline: opp.deadline,
            url: opp.link || opp.sourceUrl || opp.officialSource || "/opportunities",
            savedAt: b.createdAt || new Date().toISOString(),
          });
        }
      }
    }
    return list;
  }, [localBookmarks, apiBookmarks]);

  const filteredBookmarks = useMemo(() => {
    return mergedBookmarks.filter((b) => {
      const matchesFilter =
        activeFilter === "all"
          ? true
          : activeFilter === "opportunity"
          ? b.type === "opportunity" || !b.type
          : activeFilter === "paper"
          ? b.type === "paper" || b.type === "book"
          : b.type === "dataset" || b.type === "software";

      const matchesSearch =
        !searchQuery.trim() ||
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.funder && b.funder.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (b.venue && b.venue.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesFilter && matchesSearch;
    });
  }, [mergedBookmarks, activeFilter, searchQuery]);

  const handleRemoveLocal = (id: string) => {
    const next = localBookmarks.filter((b) => b.id !== id);
    setLocalBookmarks(next);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("cambium_bookmarks", JSON.stringify(next));
        // Also update opportunities / discover sets
        const oppsSaved = localStorage.getItem("cambium_opportunities_saved");
        if (oppsSaved) {
          const arr: string[] = JSON.parse(oppsSaved);
          localStorage.setItem(
            "cambium_opportunities_saved",
            JSON.stringify(arr.filter((item) => item !== id))
          );
        }
        const discSaved = localStorage.getItem("cambium_discover_saved");
        if (discSaved) {
          const arr: string[] = JSON.parse(discSaved);
          localStorage.setItem(
            "cambium_discover_saved",
            JSON.stringify(arr.filter((item) => item !== id))
          );
        }
      } catch (e) {
        console.error(e);
      }
    }
    showToast("Bookmark removed from ledger");
  };

  const handleClearAll = () => {
    if (confirm("Are you sure you want to clear your local bookmark ledger?")) {
      setLocalBookmarks([]);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("cambium_bookmarks", "[]");
          localStorage.setItem("cambium_opportunities_saved", "[]");
          localStorage.setItem("cambium_discover_saved", "[]");
        } catch (e) {
          console.error(e);
        }
      }
      showToast("Ledger cleared");
    }
  };

  // Export BibTeX
  const handleExportBibTeX = () => {
    if (filteredBookmarks.length === 0) return;
    let bib = "% CAMBIUM RESEARCH — Scholar Export\n\n";
    filteredBookmarks.forEach((b, idx) => {
      const citeKey = `item_${b.id.replace(/[^a-zA-Z0-9]/g, "_")}_${b.year || 2026}`;
      bib += `@misc{${citeKey},\n`;
      bib += `  title = {${b.title}},\n`;
      if (b.authors && b.authors.length > 0) {
        bib += `  author = {${b.authors.join(" and ")}},\n`;
      } else if (b.funder) {
        bib += `  institution = {${b.funder}},\n`;
      }
      if (b.year) bib += `  year = {${b.year}},\n`;
      if (b.venue) bib += `  howpublished = {${b.venue}},\n`;
      if (b.doi) bib += `  doi = {${b.doi}},\n`;
      if (b.url) bib += `  url = {${b.url}},\n`;
      bib += `}\n\n`;
    });

    const blob = new Blob([bib], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `cambium-scholar-ledger-${Date.now()}.bib`;
    link.click();
    URL.revokeObjectURL(url);
    showToast("BibTeX bibliography exported (.bib)");
  };

  // Export CSV
  const handleExportCSV = () => {
    if (filteredBookmarks.length === 0) return;
    let csv = "ID,Type,Title,Funder_Or_Venue,Amount,Deadline,DOI,SavedAt\n";
    filteredBookmarks.forEach((b) => {
      const cleanTitle = `"${(b.title || "").replace(/"/g, '""')}"`;
      const cleanFunder = `"${(b.funder || b.venue || "").replace(/"/g, '""')}"`;
      csv += `${b.id},${b.type || "opportunity"},${cleanTitle},${cleanFunder},${b.amount || ""},${b.deadline || ""},${b.doi || ""},${b.savedAt || ""}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `cambium-scholar-ledger-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast("Research ledger exported (.csv)");
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] dark:bg-[#0E140F] text-[#202920] dark:text-[#EDEAE2] font-sans flex flex-col justify-between selection:bg-[#3E6248]/20 selection:text-[#173F35]">
      <div>
        <PublicHeader />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
          {/* Breadcrumb Navigation & Provenance */}
          <nav className="flex items-center gap-2 font-mono text-[11px] text-[#62685E] dark:text-[#A4B3A2] tracking-wider uppercase mb-2">
            <Link href="/dashboard" className="hover:text-[#202920] dark:hover:text-[#EDEAE2] transition-colors flex items-center gap-1.5 no-underline text-[#62685E] dark:text-[#A4B3A2]">
              <LayoutDashboard size={13} className="text-[#3E6248] dark:text-[#4ADE80]" />
              <span>Dashboard</span>
            </Link>
            <ChevronRight size={12} className="text-[#85877B]" />
            <Link href="/opportunities" className="hover:text-[#202920] dark:hover:text-[#EDEAE2] transition-colors flex items-center gap-1.5 no-underline text-[#62685E] dark:text-[#A4B3A2]">
              <Compass size={13} className="text-[#3E6248] dark:text-[#4ADE80]" />
              <span>Opportunities</span>
            </Link>
            <ChevronRight size={12} className="text-[#85877B]" />
            <span className="text-[#202920] dark:text-[#EDEAE2] font-semibold">Saved Bookmarks</span>
          </nav>

          {/* Page Header */}
          <div className="border-b border-[#E4DCCB] dark:border-[#233327] pb-6 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DCE6D7]/60 dark:bg-[#1A281E] border border-[#66866A]/30 dark:border-[#4ADE80]/30 mb-3">
                <Bookmark size={13} className="text-[#3E6248] dark:text-[#4ADE80] fill-[#3E6248] dark:fill-[#4ADE80]" />
                <span className="font-mono text-xs uppercase tracking-widest text-[#3E6248] dark:text-[#4ADE80] font-semibold">
                  Personal Research Ledger
                </span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#202920] dark:text-[#EDEAE2] tracking-tight m-0">
                Saved Research & Opportunities
              </h1>
              <p className="font-serif text-base text-[#62685E] dark:text-[#A4B3A2] mt-2 max-w-2xl leading-relaxed">
                Monitored funding calls, grant deadlines, literature preprints, and research datasets pinned to your active scholar portfolio.
              </p>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-mono text-xs font-semibold px-3 py-1.5 rounded-full bg-[#F2EBDD] dark:bg-[#18231B] border border-[#E4DCCB] dark:border-[#233327] text-[#202920] dark:text-[#EDEAE2] shadow-xs">
                {filteredBookmarks.length} Saved
              </span>

              {filteredBookmarks.length > 0 && (
                <>
                  <button
                    type="button"
                    onClick={handleExportBibTeX}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E4DCCB] dark:border-[#233327] bg-[#FAF7F0] dark:bg-[#131C15] text-[#202920] dark:text-[#EDEAE2] text-xs font-mono font-medium hover:bg-[#EAE4D5] dark:hover:bg-[#1E2B20] transition-colors cursor-pointer"
                    title="Export bibliography in standard BibTeX (.bib) format"
                  >
                    <Download size={13} className="text-[#3E6248] dark:text-[#4ADE80]" />
                    <span>BibTeX (.bib)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleExportCSV}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E4DCCB] dark:border-[#233327] bg-[#FAF7F0] dark:bg-[#131C15] text-[#202920] dark:text-[#EDEAE2] text-xs font-mono font-medium hover:bg-[#EAE4D5] dark:hover:bg-[#1E2B20] transition-colors cursor-pointer"
                    title="Export structured CSV spreadsheet"
                  >
                    <Download size={13} className="text-[#3E6248] dark:text-[#4ADE80]" />
                    <span>CSV (.csv)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-900/40 bg-red-50/50 dark:bg-red-950/20 text-red-700 dark:text-red-400 text-xs font-mono font-medium hover:bg-red-100/50 transition-colors cursor-pointer"
                    title="Clear all local bookmarks"
                  >
                    <Trash2 size={13} />
                    <span>Clear</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Filter Tabs & Search Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#F2EBDD] dark:bg-[#18231B] border border-[#E4DCCB] dark:border-[#233327] overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setActiveFilter("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium font-sans transition-all cursor-pointer border-0 ${
                  activeFilter === "all"
                    ? "bg-[#3E6248] text-white shadow-xs font-semibold"
                    : "text-[#62685E] dark:text-[#A4B3A2] hover:text-[#202920] dark:hover:text-[#EDEAE2] bg-transparent"
                }`}
              >
                All Items ({mergedBookmarks.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter("opportunity")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium font-sans transition-all cursor-pointer border-0 ${
                  activeFilter === "opportunity"
                    ? "bg-[#3E6248] text-white shadow-xs font-semibold"
                    : "text-[#62685E] dark:text-[#A4B3A2] hover:text-[#202920] dark:hover:text-[#EDEAE2] bg-transparent"
                }`}
              >
                Grants & CFPs ({mergedBookmarks.filter((b) => b.type === "opportunity" || !b.type).length})
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter("paper")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium font-sans transition-all cursor-pointer border-0 ${
                  activeFilter === "paper"
                    ? "bg-[#3E6248] text-white shadow-xs font-semibold"
                    : "text-[#62685E] dark:text-[#A4B3A2] hover:text-[#202920] dark:hover:text-[#EDEAE2] bg-transparent"
                }`}
              >
                Literature & Books ({mergedBookmarks.filter((b) => b.type === "paper" || b.type === "book").length})
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter("other")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium font-sans transition-all cursor-pointer border-0 ${
                  activeFilter === "other"
                    ? "bg-[#3E6248] text-white shadow-xs font-semibold"
                    : "text-[#62685E] dark:text-[#A4B3A2] hover:text-[#202920] dark:hover:text-[#EDEAE2] bg-transparent"
                }`}
              >
                Datasets & Artifacts ({mergedBookmarks.filter((b) => b.type === "dataset" || b.type === "software").length})
              </button>
            </div>

            {/* Quick Search */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#85877B]" />
              <input
                type="text"
                placeholder="Filter saved items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-[#E4DCCB] dark:border-[#233327] bg-[#FAF7F0] dark:bg-[#131C15] text-xs font-sans text-[#202920] dark:text-[#EDEAE2] outline-hidden focus:border-[#3E6248] dark:focus:border-[#4ADE80]"
              />
            </div>
          </div>

          {/* Bookmarks Grid */}
          {filteredBookmarks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBookmarks.map((b) => (
                <div
                  key={b.id}
                  className="rounded-2xl p-6 bg-white dark:bg-[#131C15] border border-[#E4DCCB] dark:border-[#233327] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#DCE6D7] dark:bg-[#1A281E] text-[#3E6248] dark:text-[#4ADE80] border border-[#66866A]/30 dark:border-[#4ADE80]/30">
                        {b.type ? b.type.toUpperCase() : "OPPORTUNITY"}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveLocal(b.id)}
                        className="p-1 rounded-md text-[#85877B] hover:text-red-600 transition-colors cursor-pointer bg-transparent border-0"
                        title="Remove from saved bookmarks"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <h3 className="font-serif text-lg font-semibold text-[#202920] dark:text-[#EDEAE2] leading-snug line-clamp-2 m-0">
                      {b.title}
                    </h3>

                    {(b.funder || b.venue) && (
                      <p className="text-xs text-[#62685E] dark:text-[#A4B3A2] font-sans m-0">
                        {b.funder || b.venue}
                      </p>
                    )}

                    {b.deadline && (
                      <div className="flex items-center gap-1.5 text-xs font-mono text-[#85877B] dark:text-[#7E8B7B]">
                        <Calendar size={12} className="text-[#3E6248] dark:text-[#4ADE80]" />
                        <span>Deadline: {b.deadline}</span>
                      </div>
                    )}

                    {b.amount && (
                      <div className="font-mono text-xs font-bold text-[#3E6248] dark:text-[#4ADE80]">
                        {b.amount}
                      </div>
                    )}
                  </div>

                  {/* Card Action CTAs */}
                  <div className="pt-4 mt-4 border-t border-[#E4DCCB] dark:border-[#233327] flex items-center justify-between gap-2">
                    {b.type === "paper" || b.type === "book" ? (
                      <Link
                        href={`/agent-reader?title=${encodeURIComponent(b.title)}&doi=${encodeURIComponent(b.doi || "")}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#3E6248] dark:text-[#4ADE80] hover:underline no-underline"
                      >
                        <BookOpen size={13} />
                        <span>Open in Reader</span>
                      </Link>
                    ) : (
                      <Link
                        href={`/workspace?createDraft=1&title=${encodeURIComponent(b.title)}&funder=${encodeURIComponent(b.funder || "NSF")}&budget=${encodeURIComponent(b.amount || "$500,000")}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#3E6248] dark:text-[#4ADE80] hover:underline no-underline"
                      >
                        <FileText size={13} />
                        <span>Draft Proposal</span>
                      </Link>
                    )}

                    {b.url && (
                      <a
                        href={b.url.startsWith("http") ? b.url : `https://${b.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-mono text-[#85877B] hover:text-[#202920] dark:hover:text-[#EDEAE2] no-underline"
                      >
                        <span>Source</span>
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl p-12 text-center border border-[#E4DCCB] dark:border-[#233327] bg-white dark:bg-[#131C15] max-w-lg mx-auto shadow-xs my-8">
              <div className="w-12 h-12 rounded-full bg-[#F2EBDD] dark:bg-[#18231B] border border-[#E4DCCB] dark:border-[#233327] flex items-center justify-center mx-auto mb-4 text-[#85877B]">
                <Bookmark className="w-6 h-6 text-[#62685E] dark:text-[#A4B3A2]" />
              </div>
              <h3 className="font-serif text-xl font-normal text-[#202920] dark:text-[#EDEAE2] mb-2">
                Your research ledger is clear
              </h3>
              <p className="font-serif text-sm text-[#62685E] dark:text-[#A4B3A2] mb-6 leading-relaxed">
                Browse the opportunity explorer to discover grants, fellowships, and papers that align with your computational and clinical focus.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/opportunities"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#3E6248] hover:bg-[#293E30] text-[#FAF7F0] font-sans text-xs font-semibold uppercase tracking-wider rounded-full shadow-sm transition-all duration-200 no-underline border border-[#66866A]/30"
                >
                  <span>Browse Opportunities</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/discover"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#F2EBDD] dark:bg-[#18231B] hover:bg-[#E4DCCB] text-[#202920] dark:text-[#EDEAE2] font-sans text-xs font-semibold uppercase tracking-wider rounded-full transition-all duration-200 no-underline border border-[#E4DCCB] dark:border-[#233327]"
                >
                  <span>Discover Papers</span>
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>

      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-[#202920] text-[#FAF7F0] text-xs font-mono shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-150">
          {toastMessage}
        </div>
      )}

      <Footer />
    </div>
  );
}
