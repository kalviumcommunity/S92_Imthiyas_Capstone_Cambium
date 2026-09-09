"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getOpportunities, deleteOpportunity } from "@/lib/api";
import { useAuthStore } from "@/lib/store/useAuthStore";
import OpportunityCard from "@/components/OpportunityCard";
import CreateOpportunityModal from "@/components/CreateOpportunityModal";
import {
  Search,
  Filter,
  PlusCircle,
  Sparkles,
  SlidersHorizontal,
  RefreshCw,
} from "lucide-react";

function OpportunitiesContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [search, setSearch] = useState(initialSearch);
  const [selectedType, setSelectedType] = useState<string>("All");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isAuthenticated } = useAuthStore();

  // Synchronize initial query param
  useEffect(() => {
    if (initialSearch) {
      setSearch(initialSearch);
    }
  }, [initialSearch]);

  // Fetch opportunities matching active filters
  const {
    data: opportunities,
    isLoading,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ["opportunities", selectedType, selectedTag, search],
    queryFn: () =>
      getOpportunities({
        type: selectedType,
        tag: selectedTag || undefined,
        search: search || undefined,
      }),
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this research opportunity?")) return;
    try {
      await deleteOpportunity(id);
      refetch();
    } catch (err: any) {
      alert(err.message || "Failed to delete opportunity");
    }
  };

  const types = ["All", "Grant", "CFP", "Journal", "Paper"];
  const tags = ["AI", "Machine Learning", "Quantum", "Data Science", "IEEE", "Grant", "Cloud"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <span>Opportunity Explorer</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-950 border border-blue-800 text-blue-400">
              {opportunities ? opportunities.length : 0} Available
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse, filter, and discover research grants, conferences, and call for papers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            disabled={isRefetching}
            className="p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-white transition-colors"
            title="Refresh opportunities"
          >
            <RefreshCw className={`w-4 h-4 ${isRefetching ? "animate-spin text-blue-400" : ""}`} />
          </button>

          {isAuthenticated ? (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white rounded-lg shadow-md shadow-blue-600/20 transition-all hover:scale-[1.02]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post Opportunity</span>
            </button>
          ) : (
            <a
              href="/auth"
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 rounded-lg transition-colors"
            >
              <span>Sign In to Post</span>
            </a>
          )}
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="glass-panel rounded-xl p-4 border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* Search Input */}
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by title, keywords, organization..."
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Type Filter Tabs */}
          <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {types.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                  selectedType === type
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30 font-semibold"
                    : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Tag Cloud Filter */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/60 text-xs">
          <span className="text-slate-500 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filter by Tag:
          </span>
          {selectedTag && (
            <button
              onClick={() => setSelectedTag("")}
              className="px-2 py-0.5 rounded-md bg-blue-950/80 border border-blue-800 text-blue-300 text-[11px] font-medium"
            >
              Clear Tag (#{selectedTag}) ×
            </button>
          )}
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? "" : tag)}
              className={`px-2 py-0.5 rounded-md text-[11px] border transition-colors ${
                selectedTag === tag
                  ? "bg-blue-600 border-blue-500 text-white font-medium"
                  : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Opportunities Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="glass-panel rounded-xl p-6 h-64 animate-pulse bg-slate-900/40"
            />
          ))}
        </div>
      ) : opportunities && opportunities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {opportunities.map((opp) => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              onBookmarkChanged={refetch}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="glass-panel rounded-2xl p-12 text-center border border-slate-800">
          <SlidersHorizontal className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white mb-1">
            No matching opportunities found
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-5">
            Try adjusting your search query, clearing filters, or post a new opportunity to the platform.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setSelectedType("All");
              setSelectedTag("");
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 rounded-lg transition-colors mr-2"
          >
            Reset Filters
          </button>
          {isAuthenticated && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white rounded-lg shadow-md transition-colors"
            >
              Post Opportunity
            </button>
          )}
        </div>
      )}

      {/* Modal Dialog */}
      <CreateOpportunityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={refetch}
      />
    </div>
  );
}

export default function OpportunitiesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400 text-xs">Loading explorer...</div>}>
      <OpportunitiesContent />
    </Suspense>
  );
}
