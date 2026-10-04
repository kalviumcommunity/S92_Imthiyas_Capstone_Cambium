export default function SettingsLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAF7F0] font-sans overflow-hidden">
      {/* Header Skeleton */}
      <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between border-b border-[#E4DCCB] bg-[#FAF7F0]/90 px-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#66866A]/40 animate-pulse" />
          <div className="h-3 w-48 bg-[#E4DCCB] rounded animate-pulse" />
        </div>
        <div className="w-7 h-7 rounded-full bg-[#3E6248]/10 border border-[#3E6248]/20 animate-pulse" />
      </header>

      <div className="flex mx-auto w-full max-w-[1360px] flex-1 overflow-hidden relative">
        {/* Sidebar Skeleton */}
        <aside className="w-[275px] shrink-0 border-r border-[#E4DCCB] py-8 px-4 hidden md:flex flex-col gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-10 rounded-lg bg-white/70 border border-[#E4DCCB]/60 animate-pulse" />
          ))}
        </aside>

        {/* Content Skeleton (width matching the 1080px wider body) */}
        <main className="flex-1 min-w-0 overflow-y-auto w-full p-10 max-w-[1080px]">
          <div className="mb-8">
            <div className="h-7 w-60 bg-[#E4DCCB] rounded-lg mb-2 animate-pulse" />
            <div className="h-3 w-80 bg-[#E4DCCB]/60 rounded animate-pulse" />
          </div>

          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="h-3 w-28 bg-[#E4DCCB] rounded animate-pulse" />
                <div className="h-11 rounded-xl bg-white border border-[#E4DCCB] animate-pulse" />
              </div>
            ))}

            <div className="h-px bg-[#E4DCCB] my-6" />

            {[1, 2].map((i) => (
              <div key={i} className="flex items-center justify-between py-3">
                <div className="space-y-1">
                  <div className="h-3.5 w-44 bg-[#E4DCCB] rounded animate-pulse" />
                  <div className="h-2.5 w-64 bg-[#E4DCCB]/60 rounded animate-pulse" />
                </div>
                <div className="w-10 h-5 bg-[#E4DCCB] rounded-full animate-pulse" />
              </div>
            ))}

            <div className="flex justify-end pt-4">
              <div className="h-9 w-32 rounded-full bg-[#3E6248]/20 animate-pulse" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
