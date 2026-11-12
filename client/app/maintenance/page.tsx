"use client";

import React from "react";
import Link from "next/link";
import { Wrench, RefreshCw, Activity, ArrowRight } from "lucide-react";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-[#FAF7F0] dark:bg-[#0E140F] flex flex-col justify-between font-sans px-6 py-12 text-[#202920] dark:text-[#EDEAE2]">
      {/* Top Header */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 text-[#202920] dark:text-[#EDEAE2] no-underline">
          <div className="w-8 h-8 rounded-full bg-[#3E6248] flex items-center justify-center text-[#FAF7F0] font-bold text-sm">
            C
          </div>
          <span className="font-serif text-lg font-bold tracking-tight">CAMBIUM RESEARCH</span>
        </Link>
        <Link
          href="/status"
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-[#18241B] border border-[#E4DCCB] dark:border-[#28382C] text-xs font-mono text-[#62685E] dark:text-[#9DA39A] hover:border-[#3E6248] transition-colors no-underline"
        >
          <span className="w-2 h-2 rounded-full bg-[#EAB308] animate-pulse" />
          <span>System Status: Upgrading</span>
        </Link>
      </header>

      {/* Main Announcement Card */}
      <main className="max-w-xl mx-auto w-full my-auto text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-[#DCE6D7] dark:bg-[#233527] text-[#3E6248] dark:text-[#4ADE80] flex items-center justify-center shadow-xs">
          <Wrench size={30} />
        </div>

        <div className="space-y-3">
          <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#202920] dark:text-[#EDEAE2] m-0">
            Scheduled System Maintenance
          </h1>
          <p className="text-[#62685E] dark:text-[#9DA39A] text-sm sm:text-base leading-relaxed max-w-md mx-auto m-0 font-sans">
            We are performing scheduled maintenance on the vector indexing clusters and crawler ingestion pipelines. Your data remains fully secure.
          </p>
        </div>

        {/* Operational Checklist */}
        <div className="p-4 rounded-xl bg-white dark:bg-[#151F17] border border-[#E4DCCB] dark:border-[#28382C] text-left text-xs space-y-2.5 text-[#62685E] dark:text-[#9DA39A] font-mono">
          <div className="flex items-center justify-between">
            <span>PostgreSQL 16 Engine</span>
            <span className="text-[#4ADE80] font-bold">● ONLINE</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Vector HNSW Re-indexing</span>
            <span className="text-[#EAB308] font-bold">● IN PROGRESS</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Scholarly Crawler Queues</span>
            <span className="text-[#85877B] font-bold">● PAUSED</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#3E6248] hover:bg-[#2E4B36] dark:bg-[#4ADE80] dark:hover:bg-[#38C86E] text-white dark:text-[#121B13] text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer border-0 shadow-xs"
          >
            <RefreshCw size={14} />
            <span>Check Again</span>
          </button>
          <Link
            href="/status"
            className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-white dark:bg-[#18241B] border border-[#E4DCCB] dark:border-[#28382C] text-xs font-semibold text-[#202920] dark:text-[#EDEAE2] hover:bg-[#F2EBDD] dark:hover:bg-[#202E24] flex items-center justify-center gap-2 transition-colors no-underline"
          >
            <Activity size={14} />
            <span>Real-time Status</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto w-full text-center text-xs text-[#85877B] font-sans">
        Cambium Research Platform · The Enterprise Research Operating System
      </footer>
    </div>
  );
}
