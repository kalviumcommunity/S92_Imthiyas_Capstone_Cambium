"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getMyBookmarks, removeBookmark } from "@/lib/api";
import { useAuthStore } from "@/lib/store/useAuthStore";
import OpportunityCard from "@/components/OpportunityCard";
import { Bookmark, Sparkles, ArrowRight, LogIn } from "lucide-react";

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

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="w-12 h-12 rounded-2xl bg-blue-950/60 border border-blue-800 flex items-center justify-center mx-auto mb-4 text-blue-400">
          <Bookmark className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Sign in to view your bookmarks</h2>
        <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
          Save research grants, CFPs, and journals to track upcoming deadlines and collaborate with peers.
        </p>
        <Link
          href="/auth"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white rounded-xl shadow-lg shadow-blue-600/25 transition-all"
        >
          <LogIn className="w-4 h-4" />
          <span>Sign In to Your Account</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800/80 pb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2.5">
          <span>Saved Research Opportunities</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-950 border border-blue-800 text-blue-400">
            {bookmarks ? bookmarks.length : 0} Saved
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Keep track of important funding calls, conference dates, and journal submission deadlines.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="glass-panel rounded-xl p-6 h-64 animate-pulse bg-slate-900/40"
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
        <div className="glass-panel rounded-2xl p-12 text-center border border-slate-800 max-w-lg mx-auto">
          <Bookmark className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white mb-1">
            You haven't bookmarked any opportunities yet
          </h3>
          <p className="text-xs text-slate-400 mb-5 leading-relaxed">
            Browse the opportunity explorer to find grants, CFPs, and journals that match your research interests.
          </p>
          <Link
            href="/opportunities"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white rounded-lg transition-all"
          >
            <span>Explore Opportunities</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
