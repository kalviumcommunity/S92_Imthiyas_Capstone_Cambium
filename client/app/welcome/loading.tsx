import React from "react";

export default function WelcomeLoading() {
  return (
    <div className="min-h-screen bg-surface-base flex flex-col font-sans select-none animate-pulse">
      {/* Top bar skeleton */}
      <header className="h-16 border-b border-edge-default px-6 sm:px-10 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-moss-600/30" />
          <div className="w-20 h-4 bg-edge-default/50 rounded" />
        </div>
        <div className="flex items-center gap-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-edge-default/40" />
              <div className="w-12 h-3 bg-edge-default/30 rounded hidden sm:block" />
            </div>
          ))}
        </div>
      </header>

      {/* Main centered container skeleton */}
      <main className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="max-w-lg w-full space-y-6">
          {/* Eyebrow */}
          <div className="w-28 h-5 bg-moss-100/50 rounded-full" />

          {/* Title */}
          <div className="space-y-2">
            <div className="w-72 h-8 bg-edge-default/60 rounded" />
            <div className="w-48 h-8 bg-edge-default/60 rounded" />
          </div>

          {/* Subtitle */}
          <div className="space-y-1.5">
            <div className="w-full h-3.5 bg-edge-default/40 rounded" />
            <div className="w-4/5 h-3.5 bg-edge-default/40 rounded" />
          </div>

          {/* Step cards */}
          <div className="space-y-3 pt-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 rounded-xl border border-edge-default/60 bg-surface-raised p-4 flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-edge-default/30 shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <div className="w-36 h-3.5 bg-edge-default/50 rounded" />
                  <div className="w-48 h-2.5 bg-edge-default/30 rounded" />
                </div>
                <div className="w-5 h-5 rounded-full border border-edge-default/40" />
              </div>
            ))}
          </div>

          {/* Action button */}
          <div className="pt-2 flex items-center gap-3">
            <div className="w-36 h-11 bg-moss-600/40 rounded-lg" />
            <div className="w-24 h-6 bg-edge-default/30 rounded" />
          </div>
        </div>
      </main>
    </div>
  );
}
