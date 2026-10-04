import React from "react";

export default function IntelligenceLoading() {
  return (
    <div className="flex-1 min-w-0 h-full flex flex-col overflow-hidden bg-surface-base text-ink-primary font-sans select-none animate-pulse">
      {/* ── Screen Header Skeleton ── */}
      <header className="px-6 py-4 border-b border-edge-default bg-surface-base shrink-0 space-y-3">
        <div>
          {/* Eyebrow */}
          <div className="w-28 h-2.5 bg-moss-200/50 rounded mb-2" />
          {/* Title */}
          <div className="w-64 h-7 bg-edge-default/60 rounded mb-1.5" />
          {/* Subtitle */}
          <div className="w-96 max-w-full h-3.5 bg-edge-default/40 rounded" />
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-5 pt-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div className="w-5 h-3.5 bg-edge-default/60 rounded" />
              <div className="w-12 h-3 bg-edge-default/40 rounded" />
            </div>
          ))}
        </div>
      </header>

      {/* ── Main Canvas & Rail Skeleton ── */}
      <div className="flex-1 min-w-0 flex overflow-hidden">
        {/* Left Canvas Skeleton */}
        <div className="flex-1 min-w-0 flex flex-col overflow-hidden p-5 sm:p-7 space-y-5">
          {/* Context & Mode selector skeleton */}
          <div className="flex items-center justify-between flex-wrap gap-3 pb-1">
            <div className="w-72 h-8 bg-surface-sunken rounded-md border border-edge-default/60" />
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="w-16 h-7 bg-surface-raised rounded-full border border-edge-default/60"
                />
              ))}
            </div>
          </div>

          {/* Query Box Skeleton */}
          <div className="border border-edge-default rounded-lg bg-surface-raised p-4 space-y-3 shadow-xs">
            <div className="w-3/4 h-4 bg-edge-default/30 rounded" />
            <div className="w-1/2 h-4 bg-edge-default/20 rounded" />
            <div className="pt-4 flex items-center justify-between border-t border-edge-default/60">
              <div className="w-24 h-3 bg-edge-default/30 rounded" />
              <div className="w-20 h-7 bg-moss-600/40 rounded-md" />
            </div>
          </div>

          {/* Quick Actions Skeleton */}
          <div className="space-y-2">
            <div className="w-24 h-2.5 bg-edge-default/40 rounded" />
            <div className="flex flex-wrap gap-2">
              {[
                "w-28",
                "w-32",
                "w-24",
                "w-36",
                "w-28",
                "w-30",
                "w-40",
              ].map((w, i) => (
                <div
                  key={i}
                  className={`h-7 ${w} bg-surface-raised rounded border border-edge-default/60`}
                />
              ))}
            </div>
          </div>

          {/* Suggested Prompts Skeleton */}
          <div className="space-y-2 pt-2">
            <div className="w-20 h-2.5 bg-edge-default/40 rounded" />
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-11 rounded-lg border border-edge-default/60 bg-surface-raised px-3 flex items-center gap-3"
                >
                  <div className="w-4 h-4 rounded-full bg-edge-default/50 shrink-0" />
                  <div
                    className={`h-3.5 bg-edge-default/40 rounded ${
                      i === 1
                        ? "w-3/4"
                        : i === 2
                        ? "w-2/3"
                        : i === 3
                        ? "w-4/5"
                        : "w-1/2"
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Rail Skeleton */}
        <aside className="w-[280px] sm:w-[300px] min-w-[280px] sm:min-w-[300px] border-l border-edge-default flex flex-col bg-surface-base overflow-hidden shrink-0">
          {/* Tab Header Skeleton */}
          <div className="flex border-b border-edge-default h-10 bg-surface-sunken/30">
            <div className="flex-1 border-r border-edge-default/40" />
            <div className="flex-1 border-r border-edge-default/40" />
            <div className="flex-1" />
          </div>

          <div className="p-4 space-y-4 flex-1 overflow-hidden">
            {/* Recent Sessions Search Skeleton */}
            <div className="space-y-2">
              <div className="w-24 h-3 bg-edge-default/40 rounded" />
              <div className="w-full h-7 bg-surface-raised rounded border border-edge-default/60" />
              <div className="space-y-1 pt-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-full h-6 rounded bg-surface-sunken/40"
                  />
                ))}
              </div>
            </div>

            <div className="h-px bg-edge-default/60" />

            {/* Content preview skeleton */}
            <div className="space-y-2.5">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg border border-edge-default/60 bg-surface-raised space-y-2"
                >
                  <div className="w-16 h-3 bg-edge-default/50 rounded" />
                  <div className="w-full h-3.5 bg-edge-default/40 rounded" />
                  <div className="w-2/3 h-2.5 bg-edge-default/30 rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Context Footer Skeleton */}
          <div className="border-t border-edge-default p-3.5 bg-surface-sunken/40 space-y-2 shrink-0">
            <div className="w-16 h-2.5 bg-edge-default/40 rounded" />
            <div className="space-y-1.5">
              <div className="w-44 h-3 bg-edge-default/30 rounded" />
              <div className="w-48 h-3 bg-edge-default/30 rounded" />
              <div className="w-40 h-3 bg-edge-default/30 rounded" />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
