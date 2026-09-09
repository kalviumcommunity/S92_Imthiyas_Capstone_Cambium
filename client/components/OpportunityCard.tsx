"use client";

import React, { useState } from "react";
import { ResearchOpportunity, toggleBookmark } from "@/lib/api";
import { useAuthStore } from "@/lib/store/useAuthStore";
import {
  Calendar,
  Building2,
  ExternalLink,
  Bookmark,
  Sparkles,
  Clock,
  Trash2,
} from "lucide-react";

interface OpportunityCardProps {
  opportunity: ResearchOpportunity;
  isBookmarked?: boolean;
  onBookmarkChanged?: () => void;
  onDelete?: (id: string) => void;
}

export default function OpportunityCard({
  opportunity,
  isBookmarked: initialBookmarked = false,
  onBookmarkChanged,
  onDelete,
}: OpportunityCardProps) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, user } = useAuthStore();

  const handleBookmarkToggle = async () => {
    if (!isAuthenticated) {
      alert("Please sign in to bookmark research opportunities.");
      return;
    }

    try {
      setLoading(true);
      await toggleBookmark(opportunity.id);
      setBookmarked(!bookmarked);
      onBookmarkChanged?.();
    } catch (err: any) {
      alert(err.message || "Failed to update bookmark");
    } finally {
      setLoading(false);
    }
  };

  // Format type colors
  const typeBadgeStyles: Record<string, string> = {
    Grant: "bg-emerald-950/70 border-emerald-800 text-emerald-300",
    CFP: "bg-blue-950/70 border-blue-800 text-blue-300",
    Journal: "bg-purple-950/70 border-purple-800 text-purple-300",
    Paper: "bg-amber-950/70 border-amber-800 text-amber-300",
  };

  // Calculate days remaining
  let deadlineText = "Rolling Deadline";
  let isUrgent = false;

  if (opportunity.deadline) {
    const deadlineDate = new Date(opportunity.deadline);
    const diffDays = Math.ceil((deadlineDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) {
      deadlineText = "Deadline Passed";
    } else if (diffDays === 0) {
      deadlineText = "Due Today!";
      isUrgent = true;
    } else if (diffDays <= 30) {
      deadlineText = `${diffDays} days left`;
      isUrgent = true;
    } else {
      deadlineText = deadlineDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  }

  const isCreator = user?.id && opportunity.createdBy?.id === user.id;

  return (
    <div className="glass-panel glass-panel-hover rounded-xl p-5 flex flex-col justify-between border border-slate-800 transition-all duration-200">
      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`text-xs font-semibold px-2.5 py-0.5 rounded-md border ${
              typeBadgeStyles[opportunity.type] || "bg-slate-800 text-slate-300"
            }`}
          >
            {opportunity.type}
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleBookmarkToggle}
              disabled={loading}
              title={bookmarked ? "Bookmarked" : "Save Bookmark"}
              className={`p-1.5 rounded-lg border transition-colors ${
                bookmarked
                  ? "bg-blue-600/20 border-blue-500 text-blue-400"
                  : "bg-slate-800/80 border-slate-700/80 text-slate-400 hover:text-white hover:border-slate-600"
              }`}
            >
              <Bookmark className={`w-4 h-4 ${bookmarked ? "fill-current" : ""}`} />
            </button>

            {isCreator && onDelete && (
              <button
                onClick={() => onDelete(opportunity.id)}
                title="Delete Opportunity"
                className="p-1.5 rounded-lg border bg-rose-950/40 border-rose-900/60 text-rose-400 hover:bg-rose-900/60 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-white line-clamp-2 leading-snug mb-2 group-hover:text-blue-400 transition-colors">
          {opportunity.title}
        </h3>

        {/* Organization */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
          <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span className="truncate">{opportunity.organization}</span>
        </div>

        {/* Description */}
        {opportunity.description && (
          <p className="text-xs text-slate-400 line-clamp-3 mb-4 leading-relaxed">
            {opportunity.description}
          </p>
        )}

        {/* Taxonomy Tags */}
        {opportunity.tags && opportunity.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {opportunity.tags.slice(0, 4).map((tag) => (
              <span
                key={tag.id}
                className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800/90 text-slate-300 border border-slate-700/60"
              >
                #{tag.name}
              </span>
            ))}
            {opportunity.tags.length > 4 && (
              <span className="text-[10px] px-1.5 py-0.5 text-slate-500">
                +{opportunity.tags.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer Section: Deadline and Action Link */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <div
          className={`flex items-center gap-1.5 ${
            isUrgent ? "text-amber-400 font-semibold" : "text-slate-400"
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>{deadlineText}</span>
        </div>

        {opportunity.link ? (
          <a
            href={opportunity.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-blue-400 hover:text-blue-300 font-medium transition-colors"
          >
            <span>Learn More</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        ) : (
          <span className="text-slate-500 text-[11px]">Internal Submission</span>
        )}
      </div>
    </div>
  );
}
