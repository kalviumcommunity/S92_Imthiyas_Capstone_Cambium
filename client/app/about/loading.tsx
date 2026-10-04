export default function AboutLoading() {
  return (
    <div className="min-h-screen bg-[#FAF7F0] font-sans pb-24">
      {/* Header Skeleton */}
      <header className="border-b border-[#E4DCCB] bg-[#FAF7F0]/90 backdrop-blur-md px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#E4DCCB] animate-pulse" />
          <div className="h-4 w-28 bg-[#E4DCCB] rounded animate-pulse" />
        </div>
        <div className="flex items-center gap-4">
          <div className="h-4 w-16 bg-[#E4DCCB] rounded animate-pulse" />
          <div className="h-4 w-16 bg-[#E4DCCB] rounded animate-pulse" />
          <div className="h-9 w-24 bg-[#3E6248]/20 rounded-full animate-pulse" />
        </div>
      </header>

      {/* Hero Skeleton */}
      <main className="max-w-5xl mx-auto px-6 pt-16 space-y-8">
        <div className="h-6 w-36 bg-[#DCE6D7] rounded-full animate-pulse" />
        <div className="h-12 w-3/4 bg-[#E4DCCB] rounded-2xl animate-pulse" />
        <div className="h-5 w-2/3 bg-[#E4DCCB]/70 rounded animate-pulse" />

        {/* Content Section Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
          <div className="p-8 rounded-3xl bg-white border border-[#E4DCCB] h-72 animate-pulse space-y-4">
            <div className="h-6 w-1/3 bg-[#E4DCCB] rounded" />
            <div className="h-4 w-full bg-[#E4DCCB]/60 rounded" />
            <div className="h-4 w-5/6 bg-[#E4DCCB]/60 rounded" />
            <div className="h-4 w-4/6 bg-[#E4DCCB]/60 rounded" />
          </div>
          <div className="p-8 rounded-3xl bg-white border border-[#E4DCCB] h-72 animate-pulse space-y-4">
            <div className="h-6 w-1/3 bg-[#E4DCCB] rounded" />
            <div className="h-4 w-full bg-[#E4DCCB]/60 rounded" />
            <div className="h-4 w-5/6 bg-[#E4DCCB]/60 rounded" />
            <div className="h-4 w-4/6 bg-[#E4DCCB]/60 rounded" />
          </div>
        </div>
      </main>
    </div>
  );
}
