"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getMyBookmarks, removeBookmark } from "@/lib/api";
import { useAuthStore } from "@/lib/store/useAuthStore";
import OpportunityCard from "@/components/OpportunityCard";
import { Bookmark, LogIn, ArrowRight, ChevronRight, Compass, LayoutDashboard } from "lucide-react";
import { PublicHeader } from "@/components/PublicHeader";
import Footer from "@/components/Footer";

export default function BookmarksPage() {
  const { isAuthenticated } = useAuthStore();

  const {
    data: bookmarks,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["my-bookmarks"],
    queryFn: getMyBookmarks,
    enabled: isAuthenticated,
  });

  const handleRemove = async (bookmarkId: string) => {
    try {
      await removeBookmark(bookmarkId);
      refetch();
    } catch (err: any) {
      alert(err.message || "Failed to remove bookmark");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#202920] font-sans flex flex-col justify-between selection:bg-[#3E6248]/20 selection:text-[#173F35]">
      <div>
        <PublicHeader />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
          {/* Breadcrumb Navigation & Provenance */}
          <nav className="flex items-center gap-2 font-mono text-[11px] text-[#62685E] tracking-wider uppercase mb-2">
            <Link href="/dashboard" className="hover:text-[#202920] transition-colors flex items-center gap-1.5 no-underline text-[#62685E]">
              <LayoutDashboard size={13} className="text-[#3E6248]" />
              <span>Dashboard</span>
            </Link>
            <ChevronRight size={12} className="text-[#85877B]" />
            <Link href="/opportunities" className="hover:text-[#202920] transition-colors flex items-center gap-1.5 no-underline text-[#62685E]">
              <Compass size={13} className="text-[#3E6248]" />
              <span>Opportunities</span>
            </Link>
            <ChevronRight size={12} className="text-[#85877B]" />
            <span className="text-[#202920] font-semibold">Saved Bookmarks</span>
          </nav>

          {/* Page Header */}
          <div className="border-b border-[#E4DCCB] pb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DCE6D7]/60 border border-[#66866A]/30 mb-3">
                <Bookmark size={13} className="text-[#3E6248] fill-[#3E6248]" />
                <span className="font-mono text-xs uppercase tracking-widest text-[#3E6248] font-semibold">
                  Personal Research Ledger
                </span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#202920] tracking-tight m-0">
                Saved Research Opportunities
              </h1>
              <p className="font-serif text-base text-[#62685E] mt-2 max-w-2xl leading-relaxed">
                Monitored funding calls, upcoming fellowship deadlines, conference submissions, and peer-reviewed journals pinned to your active scholar portfolio.
              </p>
            </div>

            {isAuthenticated && (
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold px-3 py-1.5 rounded-full bg-[#F2EBDD] border border-[#E4DCCB] text-[#202920] shadow-xs">
                  {bookmarks ? bookmarks.length : 0} Opportunities Saved
                </span>
              </div>
            )}
          </div>

          {!isAuthenticated ? (
            <div className="max-w-xl mx-auto my-16 p-8 sm:p-10 rounded-2xl bg-white border border-[#E4DCCB] shadow-[0_4px_24px_rgba(32,41,32,0.06)] text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#DCE6D7] border border-[#66866A]/40 flex items-center justify-center mx-auto mb-5 text-[#3E6248] shadow-xs">
                <Bookmark className="w-7 h-7 fill-[#3E6248]" />
              </div>
              <h2 className="font-serif text-2xl font-normal text-[#202920] mb-3">
                Sign in to view your research bookmarks
              </h2>
              <p className="font-serif text-sm text-[#62685E] max-w-md mx-auto mb-6 leading-relaxed">
                Save grant cycles, CFPs, and institutional opportunities to synchronize notification deadlines and collaborate across laboratory workspaces.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/sign-in"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#3E6248] hover:bg-[#293E30] text-[#FAF7F0] font-sans text-xs font-semibold uppercase tracking-wider rounded-full shadow-sm transition-all duration-200 no-underline border border-[#66866A]/30"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In to CAMBIUM RESEARCH</span>
                </Link>
                <Link
                  href="/opportunities"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#F2EBDD] hover:bg-[#E4DCCB] text-[#202920] font-sans text-xs font-semibold uppercase tracking-wider rounded-full transition-all duration-200 no-underline border border-[#E4DCCB]"
                >
                  <span>Explore Public Feed</span>
                </Link>
              </div>
            </div>
          ) : isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="rounded-2xl p-6 h-64 animate-pulse bg-white border border-[#E4DCCB] shadow-xs"
                />
              ))}
            </div>
          ) : bookmarks && bookmarks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarks.map((b) =>
                b.opportunity ? (
                  <OpportunityCard
                    key={b.id}
                    opportunity={b.opportunity}
                    isBookmarked={true}
                    onBookmarkChanged={refetch}
                    onDelete={() => handleRemove(b.id)}
                  />
                ) : null,
              )}
            </div>
          ) : (
            <div className="rounded-2xl p-12 text-center border border-[#E4DCCB] bg-white max-w-lg mx-auto shadow-xs my-8">
              <div className="w-12 h-12 rounded-full bg-[#F2EBDD] border border-[#E4DCCB] flex items-center justify-center mx-auto mb-4 text-[#85877B]">
                <Bookmark className="w-6 h-6 text-[#62685E]" />
              </div>
              <h3 className="font-serif text-xl font-normal text-[#202920] mb-2">
                Your research ledger is clear
              </h3>
              <p className="font-serif text-sm text-[#62685E] mb-6 leading-relaxed">
                Browse the opportunity explorer to discover grants, fellowships, and conferences that align with your computational and clinical focus.
              </p>
              <Link
                href="/opportunities"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#3E6248] hover:bg-[#293E30] text-[#FAF7F0] font-sans text-xs font-semibold uppercase tracking-wider rounded-full shadow-sm transition-all duration-200 no-underline border border-[#66866A]/30"
              >
                <span>Browse Opportunities</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}
