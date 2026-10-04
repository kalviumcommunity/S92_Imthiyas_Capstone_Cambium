export default function AuthLoading() {
  return (
    <div className="flex flex-col gap-6 animate-pulse w-full">
      <div className="flex flex-col gap-3 mb-2">
        <div className="w-3/4 h-8 bg-[#E4DCCB] rounded-lg" />
        <div className="w-1/2 h-4 bg-[#E4DCCB]/60 rounded" />
      </div>

      <div className="flex flex-col gap-3">
        <div className="w-full h-11 bg-white border border-[#E4DCCB] rounded-xl" />
        <div className="w-full h-11 bg-white border border-[#E4DCCB] rounded-xl" />
      </div>

      <div className="relative flex items-center gap-3 py-2">
        <div className="flex-1 h-px bg-[#E4DCCB]" />
        <div className="w-32 h-3 bg-[#E4DCCB]/60 rounded" />
        <div className="flex-1 h-px bg-[#E4DCCB]" />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="w-24 h-3.5 bg-[#E4DCCB] rounded" />
          <div className="w-full h-11 bg-white border border-[#E4DCCB] rounded-xl" />
        </div>

        <div className="flex flex-col gap-2">
          <div className="w-24 h-3.5 bg-[#E4DCCB] rounded" />
          <div className="w-full h-11 bg-white border border-[#E4DCCB] rounded-xl" />
        </div>

        <div className="w-full h-11 bg-[#3E6248]/30 rounded-full mt-2" />
      </div>

      <div className="w-48 h-3.5 bg-[#E4DCCB]/60 rounded mx-auto mt-2" />
    </div>
  );
}
