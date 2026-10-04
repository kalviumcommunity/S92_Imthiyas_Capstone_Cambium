/**
 * /portfolio loading skeleton.
 * Matches exact two-column layout: Profile header | Left column (700px) | Right rail (300px).
 */
export default function PortfolioLoading() {
  return (
    <div
      className="flex-1 min-h-screen overflow-y-auto bg-surface-base font-sans"
      aria-label="Loading research portfolio"
    >
      <div className="max-w-[1080px] mx-auto px-8 pt-8 pb-16">
        {/* Profile Header Skeleton */}
        <div className="bg-surface-raised border border-edge-default rounded-xl p-7 mb-6 shadow-xs animate-pulse">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="w-[88px] h-[88px] rounded-full bg-surface-sunken shrink-0" />
            <div className="flex-1 space-y-3 min-w-0">
              <div className="h-8 w-48 rounded bg-surface-sunken" />
              <div className="h-4 w-64 rounded bg-surface-sunken" />
              <div className="h-3 w-80 rounded bg-surface-sunken/60" />
              <div className="flex gap-2 pt-2">
                {[80, 100, 90, 110].map((w, i) => (
                  <div key={i} style={{ width: w }} className="h-6 rounded-full bg-surface-base border border-edge-default" />
                ))}
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <div className="w-20 h-8 rounded bg-surface-sunken" />
              <div className="w-20 h-8 rounded bg-surface-sunken" />
            </div>
          </div>
          <div className="mt-5 pt-5 border-t border-edge-default/60 space-y-2">
            <div className="h-4 w-full max-w-xl rounded bg-surface-sunken" />
            <div className="h-4 w-3/4 rounded bg-surface-sunken" />
          </div>
        </div>

        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">
          {/* Left Column Skeleton */}
          <div className="space-y-6">
            {/* Focus chips */}
            <div>
              <div className="h-3 w-28 rounded bg-surface-sunken mb-4 animate-pulse" />
              <div className="flex gap-2">
                {[90, 110, 100, 120, 95].map((w, i) => (
                  <div key={i} style={{ width: w }} className="h-8 rounded-full bg-surface-raised border border-edge-default animate-pulse" />
                ))}
              </div>
            </div>

            {/* Current Research card */}
            <div className="bg-surface-raised border border-edge-default rounded-xl p-6 shadow-xs animate-pulse space-y-4">
              <div className="flex justify-between">
                <div className="h-3 w-32 rounded bg-surface-sunken" />
                <div className="h-4 w-14 rounded-full bg-moss-50" />
              </div>
              <div className="h-6 w-3/4 rounded bg-surface-sunken" />
              <div className="h-4 w-full rounded bg-surface-sunken" />
              <div className="space-y-2 pt-2">
                <div className="h-3.5 w-5/6 rounded bg-surface-sunken" />
                <div className="h-3.5 w-4/6 rounded bg-surface-sunken" />
              </div>
            </div>

            {/* Publications skeleton */}
            <div className="space-y-3">
              <div className="h-3 w-36 rounded bg-surface-sunken mb-4 animate-pulse" />
              {[0, 1, 2].map((i) => (
                <div key={i} className="bg-surface-raised border border-edge-default rounded-lg p-5 animate-pulse space-y-2">
                  <div className="h-5 w-4/5 rounded bg-surface-sunken" />
                  <div className="h-3.5 w-1/2 rounded bg-surface-sunken/60" />
                  <div className="h-3 w-1/3 rounded bg-surface-sunken/40" />
                </div>
              ))}
            </div>

            {/* Projects skeleton */}
            <div className="space-y-3">
              <div className="h-3 w-32 rounded bg-surface-sunken mb-4 animate-pulse" />
              {[0, 1].map((i) => (
                <div key={i} className="bg-surface-raised border border-edge-default rounded-lg p-5 animate-pulse space-y-2.5">
                  <div className="h-4 w-1/2 rounded bg-surface-sunken" />
                  <div className="h-3 w-full rounded bg-surface-sunken/60" />
                  <div className="h-3 w-2/3 rounded bg-surface-sunken/40" />
                </div>
              ))}
            </div>
          </div>

          {/* Right Rail Skeleton */}
          <div className="space-y-5">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="bg-surface-raised border border-edge-default rounded-xl p-5 shadow-xs animate-pulse space-y-3">
                <div className="h-3 w-28 rounded bg-surface-sunken mb-2" />
                <div className="h-4 w-full rounded bg-surface-sunken/60" />
                <div className="h-4 w-3/4 rounded bg-surface-sunken/40" />
                <div className="h-4 w-5/6 rounded bg-surface-sunken/40" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
