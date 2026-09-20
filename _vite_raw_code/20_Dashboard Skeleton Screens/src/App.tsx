function Skeleton({
  className = "",
  rounded = "md",
}: {
  className?: string;
  rounded?: "md" | "lg" | "full";
}) {
  const r =
    rounded === "full"
      ? "rounded-full"
      : rounded === "lg"
      ? "rounded-lg"
      : "rounded-md";
  return <div className={`skeleton-shimmer ${r} ${className}`} />;
}

function SidebarSkeleton() {
  return (
    <aside
      className="flex flex-col gap-2 p-5 border-r"
      style={{
        width: 260,
        flexShrink: 0,
        borderColor: "#DDE2DE",
        background: "#FFFFFF",
      }}
    >
      <div className="mb-4">
        <Skeleton className="h-8 w-32" />
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </aside>
  );
}

function CardSkeleton() {
  return (
    <div
      className="rounded-lg border p-5 flex flex-col gap-3"
      style={{
        height: 192,
        borderColor: "#DDE2DE",
        background: "#FFFFFF",
        flexShrink: 0,
      }}
    >
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 shrink-0" rounded="full" />
        <div className="flex flex-col gap-2 flex-1">
          <Skeleton className="h-3 w-2/3" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-auto">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-3 w-3/4" />
      </div>
    </div>
  );
}

function FeedSkeleton() {
  return (
    <main
      className="flex flex-col gap-4 p-6 overflow-hidden"
      style={{ width: 800, flexShrink: 0 }}
    >
      <Skeleton className="h-32 w-full" rounded="lg" />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </main>
  );
}

function RightPanelSkeleton() {
  return (
    <aside
      className="flex flex-col gap-4 p-5 border-l"
      style={{
        width: 320,
        flexShrink: 0,
        borderColor: "#DDE2DE",
        background: "#FFFFFF",
      }}
    >
      <Skeleton className="w-full rounded-lg" style={{ height: 256 } as React.CSSProperties} rounded="lg" />
      <Skeleton className="w-full rounded-lg" style={{ height: 256 } as React.CSSProperties} rounded="lg" />
    </aside>
  );
}

export default function App() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "#F7F6F1" }}
    >
      {/* Top bar skeleton */}
      <header
        className="flex items-center justify-between px-6 border-b shrink-0"
        style={{
          height: 56,
          borderColor: "#DDE2DE",
          background: "#FFFFFF",
        }}
      >
        <Skeleton className="h-5 w-28" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8" rounded="full" />
          <Skeleton className="h-5 w-20" />
        </div>
      </header>

      {/* Three-column shell */}
      <div className="flex flex-1 overflow-hidden" style={{ minHeight: 0 }}>
        <SidebarSkeleton />
        <FeedSkeleton />
        <RightPanelSkeleton />
      </div>
    </div>
  );
}
