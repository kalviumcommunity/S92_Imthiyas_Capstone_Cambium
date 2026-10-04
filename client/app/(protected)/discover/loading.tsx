export default function DiscoverLoading() {
  return (
    <div className="flex flex-1 h-screen overflow-hidden bg-canvas font-sans" aria-label="Loading discover">
      <div className="flex flex-1 min-w-0 overflow-hidden">
        <main className="flex-1 min-w-0 max-w-[820px] px-10 py-8 overflow-y-auto h-screen">
          <div className="h-3 w-20 rounded bg-edge-default mb-2 animate-pulse" />
          <div className="h-8 w-96 rounded-md bg-edge-default mb-3 animate-pulse" />
          <div className="h-4 w-80 rounded bg-edge-default/60 mb-6 animate-pulse" />
          <div className="h-10 w-full rounded-md bg-surface-raised border border-edge-default mb-8 animate-pulse" />
          <div className="grid gap-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-28 rounded-md bg-surface-raised border border-edge-default animate-pulse p-4" />
            ))}
          </div>
        </main>
        <div className="w-[288px] p-8 border-l border-edge-default hidden lg:block bg-surface-base">
          <div className="h-4 w-32 rounded bg-edge-default mb-4 animate-pulse" />
          <div className="space-y-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-16 rounded bg-surface-raised border border-edge-default animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}