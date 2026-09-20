export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex flex-col pt-16">
      {/* Fake Header */}
      <div className="h-16 border-b border-border flex items-center px-6 md:px-20 w-full animate-pulse">
        <div className="w-8 h-8 rounded-full bg-border mr-4" />
        <div className="w-24 h-6 bg-border rounded-md" />
        <div className="flex-1" />
        <div className="hidden md:flex gap-8">
          <div className="w-16 h-4 bg-border rounded" />
          <div className="w-16 h-4 bg-border rounded" />
          <div className="w-24 h-4 bg-border rounded" />
        </div>
      </div>

      {/* Hero Skeleton */}
      <div className="flex-1 max-w-7xl mx-auto px-6 md:px-20 grid md:grid-cols-2 gap-12 md:gap-20 items-center w-full py-20 animate-pulse">
        <div>
          <div className="w-48 h-4 bg-border rounded mb-7" />
          <div className="w-full h-16 bg-border rounded mb-4" />
          <div className="w-3/4 h-16 bg-border rounded mb-7" />
          <div className="w-full h-24 bg-border rounded mb-11" />
          
          <div className="flex gap-4">
            <div className="w-48 h-12 bg-border rounded-md" />
            <div className="w-40 h-12 bg-border rounded-md" />
          </div>

          <div className="mt-14 flex gap-10">
            <div className="w-16 h-10 bg-border rounded" />
            <div className="w-16 h-10 bg-border rounded" />
            <div className="w-16 h-10 bg-border rounded" />
          </div>
        </div>

        {/* Right side graph skeleton */}
        <div className="relative h-[400px] md:h-[480px] w-full flex items-center justify-center">
          <div className="w-[148px] h-[52px] rounded-md bg-border/50 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
          <div className="w-[130px] h-[44px] rounded-md bg-border/40 absolute top-10 left-10" />
          <div className="w-[130px] h-[44px] rounded-md bg-border/40 absolute bottom-10 right-10" />
          <div className="w-[130px] h-[44px] rounded-md bg-border/40 absolute top-20 right-20" />
          <div className="w-[130px] h-[44px] rounded-md bg-border/40 absolute bottom-20 left-20" />
        </div>
      </div>
    </div>
  );
}
