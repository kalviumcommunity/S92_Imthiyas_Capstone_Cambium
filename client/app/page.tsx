"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getOpportunityStats, getOpportunities } from "@/lib/api";
import OpportunityCard from "@/components/OpportunityCard";
import CreateOpportunityModal from "@/components/CreateOpportunityModal";
import {
  Sparkles,
  Search,
  ArrowRight,
  TrendingUp,
  Award,
  FileText,
  BookOpen,
  Layers,
  Database,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch live stats from PostgreSQL backend
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["opportunity-stats"],
    queryFn: getOpportunityStats,
  });

  // Fetch recent opportunities preview
  const { data: opportunities, isLoading: oppsLoading, refetch } = useQuery({
    queryKey: ["recent-opportunities"],
    queryFn: () => getOpportunities(),
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/opportunities?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/opportunities");
    }
  };

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative pt-16 md:pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Glow pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/60 border border-blue-800/60 text-blue-300 text-xs font-medium mb-6 backdrop-blur-sm animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>PostgreSQL + pgvector Relational Intelligence Platform</span>
        </div>

        {/* Primary Headline */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight mb-6">
          Discover Funding, CFPs & Journals in{" "}
          <span className="bg-gradient-to-r from-blue-400 via-emerald-400 to-teal-300 bg-clip-text text-transparent">
            One Intelligent Workspace
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Cambium eliminates fragmented workflows for researchers. Aggregate global grants, conference deadlines, and publication opportunities on an authoritative, type-safe system of record.
        </p>

        {/* Search Bar Input */}
        <form
          onSubmit={handleSearchSubmit}
          className="max-w-2xl mx-auto relative flex items-center mb-8"
        >
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic, keyword, grant body, or CFP (e.g., AI, Quantum, NSF, IEEE)..."
              className="w-full pl-12 pr-28 py-3.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-xl"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white rounded-lg shadow-md shadow-blue-600/20 transition-all flex items-center gap-1.5"
            >
              <span>Explore</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        {/* Quick Tag Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
          <span className="text-slate-500">Popular:</span>
          {["AI", "Machine Learning", "Quantum", "Data Science", "IEEE", "Grant"].map((tag) => (
            <button
              key={tag}
              onClick={() => router.push(`/opportunities?search=${tag}`)}
              className="px-2.5 py-1 rounded-md bg-slate-800/60 hover:bg-slate-700 border border-slate-700/60 text-slate-300 hover:text-white transition-colors"
            >
              #{tag}
            </button>
          ))}
        </div>
      </section>

      {/* Live System Stats Grid (Direct from PostgreSQL Relational Aggregation) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel rounded-xl p-5 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400">Research Grants</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-800/80 flex items-center justify-center text-emerald-400">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-white">
              {statsLoading ? "..." : stats?.grants ?? 0}
            </p>
            <span className="text-[11px] text-emerald-400/90 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> Live in PostgreSQL
            </span>
          </div>

          <div className="glass-panel rounded-xl p-5 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400">Calls for Papers</span>
              <div className="w-8 h-8 rounded-lg bg-blue-950/60 border border-blue-800/80 flex items-center justify-center text-blue-400">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-white">
              {statsLoading ? "..." : stats?.cfps ?? 0}
            </p>
            <span className="text-[11px] text-blue-400/90 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> Indexed Conferences
            </span>
          </div>

          <div className="glass-panel rounded-xl p-5 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400">Special Journals</span>
              <div className="w-8 h-8 rounded-lg bg-purple-950/60 border border-purple-800/80 flex items-center justify-center text-purple-400">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-white">
              {statsLoading ? "..." : stats?.journals ?? 0}
            </p>
            <span className="text-[11px] text-purple-400/90 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> Impact Venues
            </span>
          </div>

          <div className="glass-panel rounded-xl p-5 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400">Total Opportunities</span>
              <div className="w-8 h-8 rounded-lg bg-amber-950/60 border border-amber-800/80 flex items-center justify-center text-amber-400">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-white">
              {statsLoading ? "..." : stats?.total ?? 0}
            </p>
            <span className="text-[11px] text-amber-400/90 flex items-center gap-1 mt-1">
              <Database className="w-3 h-3" /> Aggregated Total
            </span>
          </div>
        </div>
      </section>

      {/* Featured Opportunities Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Recent Opportunities</h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Latest additions synchronized across grants, conferences, and journals.
            </p>
          </div>

          <Link
            href="/opportunities"
            className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {oppsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-panel rounded-xl p-6 h-64 animate-pulse bg-slate-900/40" />
            ))}
          </div>
        ) : opportunities && opportunities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.slice(0, 6).map((item) => (
              <OpportunityCard
                key={item.id}
                opportunity={item}
                onBookmarkChanged={refetch}
              />
            ))}
          </div>
        ) : (
          <div className="glass-panel rounded-xl p-12 text-center">
            <p className="text-slate-400 text-sm mb-4">No opportunities found in database.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-xs font-semibold text-white rounded-lg"
            >
              Post the First Opportunity
            </button>
          </div>
        )}
      </section>

      {/* Platform Architecture Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-2xl p-8 border border-slate-800">
          <h3 className="text-lg font-bold text-white mb-2">
            Why Cambium? Architectural Advantages
          </h3>
          <p className="text-xs text-slate-400 mb-6 max-w-2xl">
            Engineered with a TypeScript-first enterprise stack for zero impedance mismatch between Next.js and NestJS.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center mb-3">
                <Database className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-semibold text-white mb-1">PostgreSQL System of Record</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Third normal form (3NF) relational schema ensuring strict consistency for users, interests, taxonomy tags, and bookmarks.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-3">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-semibold text-white mb-1">Authoritative OpenAPI</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Full REST + Swagger API documentation with DTO schema validation, enabling transparent public discovery and secured mutations.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center mb-3">
                <Sparkles className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-semibold text-white mb-1">pgvector Semantic Retrieval</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Dense embedding storage directly alongside relational records, powering vector cosine distance queries and taxonomy joins.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Modal Dialog */}
      <CreateOpportunityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={refetch}
      />
    </div>
  );
}
