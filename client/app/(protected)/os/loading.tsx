export default function OSLoading() {
  return (
    <div className="min-h-screen bg-[#FAF7F0] font-sans pb-24 overflow-x-hidden">
      {/* Header Skeleton */}
      <div className="border-b border-[#E4DCCB] bg-[#FAF7F0]/90 backdrop-blur-md sticky top-0 z-30 px-6 py-4">
        <div className="max-w-[1360px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-[#66866A]/40 animate-pulse" />
            <div className="h-4 w-48 bg-[#E4DCCB] rounded animate-pulse" />
          </div>
          <div className="flex gap-2">
            <div className="h-8 w-24 rounded-full bg-[#E4DCCB]/60 animate-pulse" />
            <div className="h-8 w-28 rounded-full bg-[#E4DCCB]/60 animate-pulse" />
          </div>
        </div>
      </div>

      <div className="max-w-[1360px] mx-auto px-6 pt-8">
        {/* Title area */}
        <div className="mb-8">
          <div className="h-4 w-36 bg-[#E4DCCB] rounded-full mb-2 animate-pulse" />
          <div className="h-8 w-80 bg-[#E4DCCB] rounded-lg mb-2 animate-pulse" />
          <div className="h-4 w-96 max-w-full bg-[#E4DCCB]/60 rounded animate-pulse" />
        </div>

        {/* Routines Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-5 rounded-2xl bg-white border border-[#E4DCCB] h-28 animate-pulse flex flex-col justify-between">
              <div className="h-4 w-28 bg-[#E4DCCB] rounded" />
              <div className="h-3 w-40 bg-[#E4DCCB]/60 rounded" />
            </div>
          ))}
        </div>

        {/* Calendar Section */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <div className="h-5 w-40 bg-[#E4DCCB] rounded animate-pulse" />
            <div className="h-8 w-56 bg-white border border-[#E4DCCB] rounded-lg animate-pulse" />
          </div>
          <div className="h-80 rounded-2xl bg-white border border-[#E4DCCB] p-6 animate-pulse flex flex-col justify-between">
            <div className="grid grid-cols-7 gap-2">
              {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                <div key={d} className="h-4 bg-[#E4DCCB]/50 rounded" />
              ))}
            </div>
            <div className="h-56 bg-[#FAF7F0] rounded-xl border border-[#E4DCCB]/60" />
          </div>
        </div>

        {/* Contribution Cadence Heading & Graph Skeleton */}
        <div className="mt-10 mb-4 pt-6 border-t border-[#E4DCCB]/70 flex justify-between items-center">
          <div>
            <div className="h-4 w-44 bg-[#E4DCCB] rounded-full mb-1 animate-pulse" />
            <div className="h-6 w-80 bg-[#E4DCCB] rounded mb-1 animate-pulse" />
            <div className="h-3 w-96 max-w-full bg-[#E4DCCB]/60 rounded animate-pulse" />
          </div>
          <div className="h-7 w-36 rounded-full bg-[#DCE6D7] animate-pulse" />
        </div>

        <div className="p-6 rounded-2xl border border-[#E4DCCB] bg-white h-44 animate-pulse flex flex-col justify-between">
          <div className="flex justify-between">
            <div className="h-4 w-52 bg-[#E4DCCB] rounded" />
            <div className="h-4 w-28 bg-[#E4DCCB]/60 rounded" />
          </div>
          <div className="h-20 bg-[#FAF7F0] rounded-xl border border-[#E4DCCB]/50" />
          <div className="flex justify-between pt-2 border-t border-[#E4DCCB]/40">
            <div className="h-3 w-40 bg-[#E4DCCB]/40 rounded" />
            <div className="h-3 w-28 bg-[#E4DCCB]/40 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
