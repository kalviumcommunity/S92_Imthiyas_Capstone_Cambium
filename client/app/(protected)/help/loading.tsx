export default function HelpLoading() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[#FAF7F0] text-[#202920] font-sans w-full overflow-y-auto">
      {/* Header Skeleton */}
      <header className="sticky top-0 z-10 border-b border-[#E4DCCB] bg-[#FAF7F0]/90 px-6 h-14">
        <div className="max-w-5xl mx-auto h-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#66866A]/40 animate-pulse" />
            <div className="h-3 w-52 bg-[#E4DCCB] rounded animate-pulse" />
          </div>
          <div className="h-8 w-32 rounded-full bg-[#3E6248]/15 animate-pulse" />
        </div>
      </header>

      {/* Hero & Content Skeleton */}
      <main className="max-w-5xl mx-auto px-6 pt-12 pb-20">
        <div className="text-center mb-10 flex flex-col items-center">
          <div className="h-6 w-64 bg-[#F2EBDD] rounded-full mb-4 animate-pulse" />
          <div className="h-10 sm:h-12 w-96 max-w-full bg-[#E4DCCB] rounded-xl mb-3 animate-pulse" />
          <div className="h-4 w-[480px] max-w-full bg-[#E4DCCB]/60 rounded-md animate-pulse" />
        </div>

        {/* Search Bar Skeleton */}
        <div className="flex justify-center mb-12">
          <div className="w-full max-w-2xl h-16 rounded-2xl bg-white border border-[#E4DCCB] px-5 flex items-center gap-4 animate-pulse">
            <div className="w-5 h-5 rounded-full bg-[#E4DCCB]" />
            <div className="h-4 w-72 bg-[#E4DCCB]/50 rounded" />
          </div>
        </div>

        {/* 6 Category Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-14">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="p-6 rounded-xl border border-[#E4DCCB] bg-white h-48 flex flex-col justify-between animate-pulse">
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#FAF7F0] border border-[#E4DCCB] mb-4" />
                <div className="h-4 w-32 bg-[#E4DCCB] rounded mb-2" />
                <div className="h-3 w-full bg-[#E4DCCB]/60 rounded mb-1" />
                <div className="h-3 w-4/5 bg-[#E4DCCB]/60 rounded" />
              </div>
              <div className="h-3 w-20 bg-[#DCE6D7] rounded" />
            </div>
          ))}
        </div>

        {/* Popular Articles Skeleton */}
        <div className="rounded-xl border border-[#E4DCCB] p-6 bg-white animate-pulse">
          <div className="flex justify-between items-center mb-5">
            <div className="h-4 w-56 bg-[#E4DCCB] rounded" />
            <div className="h-3 w-24 bg-[#E4DCCB]/50 rounded" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-[#E4DCCB]/40 last:border-b-0">
                <div className="h-3.5 w-72 bg-[#E4DCCB]/70 rounded" />
                <div className="w-4 h-4 bg-[#E4DCCB]/40 rounded" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
