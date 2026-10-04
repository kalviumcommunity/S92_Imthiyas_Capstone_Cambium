import React from "react";

export default function ReaderLoading() {
  return (
    <div className="min-h-screen bg-surface-base text-ink-primary font-sans flex flex-col select-none animate-pulse">
      {/* Top Demo Bar Placeholder */}
      <div className="h-9 bg-[#17201D] border-b border-[#2a3530] px-4 flex items-center justify-between">
        <div className="w-36 h-3.5 bg-[#2a3530] rounded" />
        <div className="w-24 h-5 bg-[#2a3530] rounded" />
      </div>

      {/* Top Navigation Bar Skeleton */}
      <header className="h-[52px] bg-surface-raised border-b border-edge-default px-5 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-24 h-7 bg-edge-default/60 rounded-md" />
          <span className="text-edge-default">/</span>
          <div className="w-64 h-4 bg-edge-default/50 rounded hidden md:block" />
        </div>

        <div className="flex items-center gap-2">
          <div className="w-16 h-7 bg-edge-default/40 rounded-md" />
          <div className="w-28 h-7 bg-edge-default/40 rounded-md hidden sm:block" />
          <div className="w-16 h-7 bg-edge-default/40 rounded-md" />
          <div className="w-16 h-7 bg-edge-default/40 rounded-md hidden sm:block" />
          <div className="w-[1px] h-5 bg-edge-default mx-1 hidden sm:block" />
          <div className="w-32 h-7 bg-moss-600/30 rounded-md hidden md:block" />
        </div>
      </header>

      {/* Sub-toolbar Skeleton */}
      <div className="h-11 bg-surface-raised border-b border-edge-default px-6 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-edge-default/40 rounded" />
          <div className="w-14 h-4 bg-edge-default/40 rounded" />
          <div className="w-6 h-6 bg-edge-default/40 rounded" />
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <div className="w-6 h-6 bg-edge-default/40 rounded" />
          <div className="w-10 h-4 bg-edge-default/40 rounded" />
          <div className="w-6 h-6 bg-edge-default/40 rounded" />
        </div>

        <div className="w-56 h-6 bg-edge-default/30 rounded-md hidden md:block" />

        <div className="hidden lg:flex items-center gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-14 h-4 bg-edge-default/30 rounded" />
          ))}
        </div>
      </div>

      {/* Main Document & Sidebar Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Reading Column Canvas Skeleton */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-12 py-10 border-r border-edge-default">
          <div className="max-w-[820px] mx-auto space-y-8">
            {/* Header */}
            <div className="pb-8 border-b border-edge-default space-y-4">
              <div className="w-36 h-3 bg-moss-600/30 rounded" />
              <div className="space-y-2">
                <div className="w-full h-8 bg-edge-default/70 rounded" />
                <div className="w-3/4 h-8 bg-edge-default/70 rounded" />
              </div>
              <div className="w-2/3 h-4 bg-edge-default/40 rounded" />
              <div className="flex gap-4 pt-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-20 h-4 bg-edge-default/40 rounded" />
                ))}
              </div>
            </div>

            {/* Section 1: Abstract Skeleton */}
            <div className="space-y-3">
              <div className="w-24 h-4 bg-moss-600/40 rounded" />
              <div className="space-y-2 max-w-[70ch]">
                <div className="w-full h-3.5 bg-edge-default/50 rounded" />
                <div className="w-[96%] h-3.5 bg-edge-default/50 rounded" />
                <div className="w-[98%] h-3.5 bg-edge-default/50 rounded" />
                <div className="w-[92%] h-3.5 bg-edge-default/50 rounded" />
                <div className="w-[78%] h-3.5 bg-edge-default/50 rounded" />
              </div>
            </div>

            {/* Section 2: Introduction Skeleton */}
            <div className="space-y-3 pt-2">
              <div className="w-32 h-4 bg-moss-600/40 rounded" />
              <div className="space-y-2 max-w-[70ch]">
                <div className="w-full h-3.5 bg-edge-default/50 rounded" />
                <div className="w-[94%] h-3.5 bg-edge-default/50 rounded" />
                <div className="w-[97%] h-3.5 bg-edge-default/50 rounded" />
                <div className="w-[88%] h-3.5 bg-edge-default/50 rounded" />
              </div>
              <div className="space-y-2 max-w-[70ch] pt-2">
                <div className="w-full h-3.5 bg-edge-default/50 rounded" />
                <div className="w-[95%] h-3.5 bg-edge-default/50 rounded" />
                <div className="w-[82%] h-3.5 bg-edge-default/50 rounded" />
              </div>
            </div>

            {/* Figure Skeleton */}
            <div className="border border-edge-default rounded-xl p-6 bg-surface-raised max-w-[70ch] space-y-3">
              <div className="h-44 bg-surface-sunken rounded-lg border border-dashed border-edge-default flex items-center justify-center">
                <div className="w-32 h-4 bg-edge-default/50 rounded" />
              </div>
              <div className="w-3/4 h-3 bg-edge-default/40 rounded mx-auto" />
            </div>
          </div>
        </div>

        {/* Right Research Panel Skeleton (380px) */}
        <div className="w-[380px] shrink-0 bg-surface-raised hidden xl:flex flex-col p-5 space-y-5">
          <div className="flex gap-4 border-b border-edge-default pb-3">
            <div className="w-24 h-5 bg-moss-600/30 rounded" />
            <div className="w-20 h-5 bg-edge-default/40 rounded" />
          </div>

          <div className="space-y-2">
            <div className="w-32 h-4 bg-edge-default/50 rounded" />
            <div className="w-full h-3 bg-edge-default/30 rounded" />
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="w-20 h-6 bg-edge-default/40 rounded-full" />
            ))}
          </div>

          <div className="h-24 bg-surface-sunken rounded-lg border border-edge-default p-3" />

          <div className="border-t border-edge-default pt-4 space-y-2">
            <div className="w-28 h-3.5 bg-edge-default/50 rounded" />
            <div className="w-full h-3 bg-edge-default/40 rounded" />
            <div className="w-full h-3 bg-edge-default/40 rounded" />
            <div className="w-4/5 h-3 bg-edge-default/40 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
