export default function OpportunitiesLoading() {
  return (
    <div className="min-h-screen bg-[#FAF7F0] font-sans pb-24">
      {/* Top Header Skeleton */}
      <header className="sticky top-0 z-30 border-b border-[#E4DCCB] bg-[#FAF7F0]/90 backdrop-blur-md px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#66866A]/40 animate-pulse" />
          <div className="h-3 w-52 bg-[#E4DCCB] rounded animate-pulse" />
        </div>
        <div className="h-8 w-28 rounded-full bg-[#3E6248]/15 animate-pulse" />
      </header>

      {/* Main Container */}
      <main className="max-w-[1360px] mx-auto px-6 pt-8">
        {/* Title area */}
        <div className="mb-8">
          <div className="h-4 w-44 bg-[#F2EBDD] rounded-full mb-2 animate-pulse" />
          <div className="h-9 w-96 max-w-full bg-[#E4DCCB] rounded-xl mb-2 animate-pulse" />
          <div className="h-4 w-[500px] max-w-full bg-[#E4DCCB]/60 rounded animate-pulse" />
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap gap-3 mb-8">
          <div className="h-10 w-72 rounded-xl bg-white border border-[#E4DCCB] animate-pulse" />
          <div className="h-10 w-32 rounded-xl bg-white border border-[#E4DCCB] animate-pulse" />
          <div className="h-10 w-36 rounded-xl bg-white border border-[#E4DCCB] animate-pulse" />
          <div className="h-10 w-32 rounded-xl bg-white border border-[#E4DCCB] animate-pulse" />
        </div>

        {/* Opportunities Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="p-6 rounded-2xl bg-white border border-[#E4DCCB] h-64 flex flex-col justify-between animate-pulse">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className="h-4 w-24 bg-[#F2EBDD] rounded-full" />
                  <div className="h-4 w-16 bg-[#DCE6D7] rounded-full" />
                </div>
                <div className="h-5 w-5/6 bg-[#E4DCCB] rounded mb-2" />
                <div className="h-3.5 w-full bg-[#E4DCCB]/60 rounded mb-1.5" />
                <div className="h-3.5 w-4/5 bg-[#E4DCCB]/60 rounded" />
              </div>
              <div className="pt-3 border-t border-[#E4DCCB]/50 flex justify-between items-center">
                <div className="h-3 w-28 bg-[#E4DCCB]/70 rounded" />
                <div className="h-3 w-20 bg-[#3E6248]/30 rounded" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}