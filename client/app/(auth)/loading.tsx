export default function AuthLoading() {
  return (
    <div className="flex flex-col gap-6 animate-pulse w-full">
      <div className="flex flex-col gap-3 mb-2">
        <div className="w-3/4 h-8 bg-border rounded-md" />
        <div className="w-1/2 h-4 bg-border rounded-md" />
      </div>

      <div className="flex flex-col gap-3">
        <div className="w-full h-10 bg-border/50 rounded-md" />
        <div className="w-full h-10 bg-border/50 rounded-md" />
        <div className="w-full h-10 bg-border/50 rounded-md" />
      </div>

      <div className="relative flex items-center gap-3 py-2">
        <div className="flex-1 h-px bg-border" />
        <div className="w-32 h-3 bg-border rounded-md" />
        <div className="flex-1 h-px bg-border" />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="w-24 h-4 bg-border rounded-md" />
          <div className="w-full h-10 bg-border/40 rounded-md border border-border" />
        </div>

        <div className="flex flex-col gap-2">
          <div className="w-24 h-4 bg-border rounded-md" />
          <div className="w-full h-10 bg-border/40 rounded-md border border-border" />
        </div>

        <div className="w-full h-10 bg-border rounded-md mt-2" />
      </div>
      
      <div className="w-48 h-3 bg-border rounded-md mx-auto mt-2" />
    </div>
  );
}
