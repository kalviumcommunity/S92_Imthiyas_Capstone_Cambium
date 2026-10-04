export default function DashboardLoading() {
  return (
    <div className="flex flex-col flex-1 h-screen overflow-hidden bg-[#FAF7F0] font-sans">
      {/* Top Bar Skeleton */}
      <header className="h-16 px-8 bg-[#FAF7F0] border-b border-[#E4DCCB] sticky top-0 z-10 flex items-center justify-between gap-4">
        <div className="hidden md:flex items-center gap-2.5 min-w-[220px]">
          <div className="w-2 h-2 rounded-full bg-[#66866A]/40 animate-pulse" />
          <div className="h-3 w-28 bg-[#E4DCCB] rounded animate-pulse" />
        </div>
        <div className="flex-1 max-w-[540px] mx-auto h-10 rounded-xl bg-white border border-[#E4DCCB] px-3.5 flex items-center gap-2 animate-pulse">
          <div className="w-4 h-4 rounded bg-[#E4DCCB]" />
          <div className="h-3.5 w-64 bg-[#E4DCCB]/60 rounded" />
        </div>
        <div className="flex items-center justify-end gap-3 min-w-[220px]">
          <div className="w-8 h-8 rounded-xl bg-[#E4DCCB]/60 animate-pulse" />
          <div className="w-8 h-8 rounded-xl bg-[#E4DCCB]/60 animate-pulse" />
          <div className="h-5 w-px bg-[#E4DCCB]" />
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#DCE6D7] animate-pulse" />
            <div className="hidden sm:block">
              <div className="h-3 w-20 bg-[#E4DCCB] rounded mb-1 animate-pulse" />
              <div className="h-2 w-14 bg-[#E4DCCB]/60 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Body Skeleton */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Feed & Center Content */}
        <div className="flex-1 overflow-y-auto bg-[#FAF7F0] px-8 py-8">
          <div className="max-w-[880px] mx-auto">
            {/* Greeting Skeleton */}
            <div className="mb-8">
              <div className="h-10 sm:h-12 w-80 bg-[#E4DCCB] rounded-xl mb-3 animate-pulse" />
              <div className="h-4 w-96 max-w-full bg-[#E4DCCB]/70 rounded-md animate-pulse" />
            </div>

            {/* Quick Action Badges */}
            <div className="flex items-center gap-2.5 mb-8 flex-wrap">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-8 w-32 rounded-xl bg-white border border-[#E4DCCB] animate-pulse" />
              ))}
            </div>

            {/* Section: Attention Cards */}
            <div className="mb-10">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <div className="h-5 w-44 bg-[#E4DCCB] rounded mb-1 animate-pulse" />
                  <div className="h-3 w-60 bg-[#E4DCCB]/60 rounded animate-pulse" />
                </div>
                <div className="h-3 w-24 bg-[#E4DCCB]/70 rounded animate-pulse" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2].map((i) => (
                  <div key={i} className="p-5 rounded-2xl bg-white border border-[#E4DCCB] h-44 flex flex-col justify-between animate-pulse">
                    <div className="flex justify-between">
                      <div className="h-4 w-20 bg-[#F2EBDD] rounded-full" />
                      <div className="h-4 w-16 bg-[#DCE6D7] rounded-full" />
                    </div>
                    <div>
                      <div className="h-4 w-3/4 bg-[#E4DCCB] rounded mb-2" />
                      <div className="h-3 w-full bg-[#E4DCCB]/60 rounded mb-1" />
                      <div className="h-3 w-2/3 bg-[#E4DCCB]/60 rounded" />
                    </div>
                    <div className="h-3 w-32 bg-[#E4DCCB]/50 rounded pt-2 border-t border-[#E4DCCB]/40" />
                  </div>
                ))}
              </div>
            </div>

            {/* Feed Items Skeleton */}
            <div className="border-t border-[#E4DCCB] pt-6 flex flex-col gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="py-4 border-b border-[#E4DCCB]/60 animate-pulse">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-[#DCE6D7]" />
                    <div className="space-y-1.5 flex-1">
                      <div className="h-3 w-32 bg-[#E4DCCB] rounded" />
                      <div className="h-2.5 w-48 bg-[#E4DCCB]/60 rounded" />
                    </div>
                  </div>
                  <div className="pl-11 space-y-2">
                    <div className="h-4 w-3/4 bg-[#E4DCCB] rounded" />
                    <div className="h-3 w-full bg-[#E4DCCB]/60 rounded" />
                    <div className="h-3 w-5/6 bg-[#E4DCCB]/60 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel Skeleton */}
        <aside className="w-80 border-l border-[#E4DCCB] bg-[#FAF7F0] p-6 hidden xl:flex flex-col gap-6">
          <div>
            <div className="h-4 w-32 bg-[#E4DCCB] rounded mb-3 animate-pulse" />
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 rounded-xl bg-white border border-[#E4DCCB] animate-pulse" />
              ))}
            </div>
          </div>
          <div className="pt-4 border-t border-[#E4DCCB]">
            <div className="h-4 w-36 bg-[#E4DCCB] rounded mb-3 animate-pulse" />
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 rounded-xl bg-white border border-[#E4DCCB] animate-pulse" />
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
