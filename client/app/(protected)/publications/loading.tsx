export default function PublicationsLoading() {
  return (
    <div className="min-h-screen bg-[#FAF7F0] font-sans pb-20">
      {/* Top Header */}
      <header className="sticky top-0 z-20 border-b border-[#E4DCCB] bg-[#FAF7F0]/90 backdrop-blur-md px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-[#66866A]/40 animate-pulse" />
          <div className="h-4 w-48 bg-[#E4DCCB] rounded animate-pulse" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-8 w-28 rounded-full bg-[#E4DCCB]/60 animate-pulse" />
          <div className="h-8 w-32 rounded-full bg-[#3E6248]/20 animate-pulse" />
        </div>
      </header>

      {/* Main Content Skeleton */}
      <main className="max-w-[1360px] mx-auto px-8 py-8">
        {/* Title area */}
        <div className="mb-8">
          <div className="h-4 w-40 bg-[#F2EBDD] rounded-full mb-2 animate-pulse" />
          <div className="h-9 w-96 max-w-full bg-[#E4DCCB] rounded-xl mb-2 animate-pulse" />
          <div className="h-4 w-[540px] max-w-full bg-[#E4DCCB]/60 rounded animate-pulse" />
        </div>

        {/* Tab & Search controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-9 w-24 rounded-xl bg-white border border-[#E4DCCB] animate-pulse" />
            ))}
          </div>
          <div className="h-9 w-64 rounded-xl bg-white border border-[#E4DCCB] animate-pulse" />
        </div>

        {/* Publications List Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-6 rounded-2xl bg-white border border-[#E4DCCB] animate-pulse flex flex-col justify-between h-52">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-4 w-20 bg-[#F2EBDD] rounded-full" />
                    <div className="h-3 w-32 bg-[#E4DCCB]/60 rounded" />
                  </div>
                  <div className="h-5 w-4/5 bg-[#E4DCCB] rounded mb-2" />
                  <div className="h-3 w-full bg-[#E4DCCB]/60 rounded mb-1.5" />
                  <div className="h-3 w-3/4 bg-[#E4DCCB]/60 rounded" />
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-[#E4DCCB]/40">
                  <div className="h-3 w-32 bg-[#DCE6D7] rounded" />
                  <div className="h-3 w-20 bg-[#E4DCCB]/60 rounded" />
                </div>
              </div>
            ))}
          </div>

          {/* Right Rail / Recommendations Skeleton */}
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-white border border-[#E4DCCB] animate-pulse">
              <div className="h-4 w-36 bg-[#E4DCCB] rounded mb-4" />
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 rounded-xl bg-[#FAF7F0] border border-[#E4DCCB]/60" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}