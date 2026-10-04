"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getMyBookmarks, removeBookmark } from "@/lib/api";
import { useAuthStore } from "@/lib/store/useAuthStore";
import OpportunityCard from "@/components/OpportunityCard";
import { Bookmark, LogIn, ArrowRight } from "lucide-react";

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
      <div className="max-w-2xl mx-auto px-4 py-24 text-center font-sans">
        <div className="w-12 h-12 rounded-2xl bg-moss-050 border border-moss-100 flex items-center justify-center mx-auto mb-4 text-moss-600">
          <Bookmark className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-ink-primary mb-2">Sign in to view your bookmarks</h2>
        <p className="text-sm text-ink-secondary max-w-sm mx-auto mb-6">
          Save research grants, CFPs, and journals to track upcoming deadlines and collaborate with peers.
        </p>
        <Link
          href="/sign-in"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-surface-inverse hover:bg-moss-700 text-xs font-semibold text-surface-base rounded-xl shadow-elevation-1 transition-all"
        >
          <LogIn className="w-4 h-4" />
          <span>Sign In to Your Account</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      {/* Header */}
      <div className="border-b border-edge-default pb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold text-ink-primary tracking-tight flex items-center gap-2.5">
            <span>Saved Research Opportunities</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-moss-050 border border-moss-100 text-moss-700">
              {bookmarks ? bookmarks.length : 0} Saved
            </span>
          </h1>
        </div>
        <p className="text-sm text-ink-secondary mt-1">
          Keep track of important funding calls, conference dates, and journal submission deadlines.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="rounded-xl p-6 h-64 animate-pulse bg-surface-raised border border-edge-default shadow-elevation-1"
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
        <div className="rounded-2xl p-12 text-center border border-edge-default bg-surface-raised max-w-lg mx-auto shadow-elevation-1">
          <Bookmark className="w-10 h-10 text-ink-tertiary mx-auto mb-3" />
          <h3 className="text-base font-semibold text-ink-primary mb-1">
            You haven't bookmarked any opportunities yet
          </h3>
          <p className="text-xs text-ink-secondary mb-5 leading-relaxed">
            Browse the opportunity explorer to find grants, CFPs, and journals that match your research interests.
          </p>
          <Link
            href="/opportunities"
            className="inline-flex items-center gap-2 px-4 py-2 bg-surface-inverse hover:bg-moss-700 text-xs font-semibold text-surface-base rounded-lg transition-colors"
          >
            <span>Browse Opportunities</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
