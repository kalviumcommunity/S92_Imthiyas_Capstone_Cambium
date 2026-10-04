export default function WorkspaceLoading() {
  return (
    <div className="flex h-screen bg-[#FAF7F0] font-sans overflow-hidden">
      {/* Sidebar Skeleton */}
      <div className="w-64 border-r border-[#E4DCCB] bg-[#FAF7F0] p-4 flex flex-col gap-3 shrink-0 hidden md:flex">
        <div className="h-8 w-36 bg-[#E4DCCB] rounded-lg animate-pulse mb-3" />
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-8 rounded-lg bg-white/70 border border-[#E4DCCB]/60 animate-pulse" />
        ))}
      </div>

      {/* Main Canvas Skeleton */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="h-14 border-b border-[#E4DCCB] px-6 flex items-center justify-between bg-[#FAF7F0]/90">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#66866A]/40 animate-pulse" />
            <div className="h-4 w-44 bg-[#E4DCCB] rounded animate-pulse" />
          </div>
          <div className="flex gap-2">
            <div className="h-8 w-20 rounded-lg bg-[#E4DCCB]/60 animate-pulse" />
            <div className="h-8 w-24 rounded-lg bg-[#3E6248]/20 animate-pulse" />
          </div>
        </div>

        {/* Editor Skeleton */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="h-10 w-2/3 bg-[#E4DCCB] rounded-xl animate-pulse" />
            <div className="h-4 w-1/3 bg-[#E4DCCB]/60 rounded animate-pulse" />
            <div className="space-y-3 pt-6 border-t border-[#E4DCCB]/60">
              <div className="h-4 w-full bg-[#E4DCCB]/50 rounded animate-pulse" />
              <div className="h-4 w-5/6 bg-[#E4DCCB]/50 rounded animate-pulse" />
              <div className="h-4 w-4/5 bg-[#E4DCCB]/50 rounded animate-pulse" />
              <div className="h-28 rounded-xl bg-white border border-[#E4DCCB] animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
