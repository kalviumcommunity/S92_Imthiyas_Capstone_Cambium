import Link from "next/link";
import { ReactNode } from "react";
import CambiumLogo from "@/components/CambiumLogo";

const NODES = [
  { label: "Scientific ML", x: "15%", y: "16%", dot: "#66866A" },
  { label: "Imthiyas", x: "48%", y: "12%", dot: "#805B43" },
  { label: "Protein Folding", x: "65%", y: "35%", dot: "#3E6248" },
  { label: "Dr. Patel", x: "22%", y: "46%", dot: "#66866A" },
  { label: "Climate Systems", x: "10%", y: "70%", dot: "#3E6248" },
  { label: "Quantum Bio", x: "45%", y: "58%", dot: "#805B43" },
  { label: "Nature, 2026", x: "66%", y: "74%", dot: "#3E6248" },
  { label: "Graph Theory", x: "26%", y: "82%", dot: "#66866A" },
];

const EDGES = [
  [0, 1], [1, 2], [0, 3], [3, 4], [3, 5], [2, 5], [5, 6], [5, 7], [4, 7]
];

function NetworkGraph() {
  return (
    <div className="relative w-full flex-1 min-h-[280px]" aria-hidden="true">
      {/* Background Connected Edges */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        {EDGES.map(([a, b], i) => {
          const na = NODES[a], nb = NODES[b];
          return (
            <g key={i}>
              <line
                x1={na.x} y1={na.y}
                x2={nb.x} y2={nb.y}
                stroke="#66866A"
                strokeOpacity="0.45"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              >
                <animate 
                  attributeName="stroke-dashoffset" 
                  values="8;0" 
                  dur="1.4s" 
                  repeatCount="indefinite" 
                />
              </line>
            </g>
          );
        })}
      </svg>

      {/* Foreground Vertices (Pill Boxes Placed Directly Above Connected Edges) */}
      {NODES.map((node) => (
        <div
          key={node.label}
          className="absolute z-10 select-none cursor-default transition-transform duration-200 hover:scale-105"
          style={{ left: node.x, top: node.y, transform: "translate(-50%,-50%)" }}
        >
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-sans font-medium whitespace-nowrap bg-[#FAF7F0] border border-[#E4DCCB] text-[#202920] shadow-[0_2px_8px_rgba(32,41,32,0.08)] hover:border-[#66866A] hover:shadow-[0_4px_14px_rgba(32,41,32,0.12)] transition-all">
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: node.dot }} />
            {node.label}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 overflow-hidden bg-[#FAF7F0] font-sans text-[#202920]">
      {/* Left Column — Mineral Sand foundation */}
      <div className="hidden md:flex flex-col justify-between h-full bg-[#F2EBDD] border-r border-[#E4DCCB] px-8 lg:px-14 py-12 overflow-y-auto relative">
        {/* Subtle radial ambient accent */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_30%_20%,rgba(102,134,106,0.08)_0%,transparent_60%)]" />

        <div className="w-full max-w-[500px] ml-auto mr-4 lg:mr-8 xl:mr-12 relative z-10">
          <CambiumLogo size="md" href="/" />
        </div>

        <div className="flex flex-col justify-center gap-8 w-full max-w-[500px] ml-auto mr-4 lg:mr-8 xl:mr-12 my-auto py-6 relative z-10">
          <div>

            <h1 className="text-3xl lg:text-4xl xl:text-[44px] text-[#202920] mb-4 font-serif font-normal leading-[1.14] tracking-[-0.02em]">
              Your research world,{" "}
              <em className="italic text-[#3E6248] font-serif">
                finally
              </em>{" "}
              connected.
            </h1>
            <p className="text-[16px] text-[#62685E] font-sans leading-relaxed">
              Build your verified scholarly identity, organize your literature, discover grants and fellowships, and collaborate with researchers worldwide.
            </p>
          </div>

          <NetworkGraph />
        </div>


      </div>

      {/* Right Column (Auth Forms) — Parchment canvas */}
      <div className="flex flex-col justify-center min-h-screen px-6 sm:px-10 lg:px-14 py-12 overflow-y-auto bg-[#FAF7F0]">
        <div className="md:hidden mb-8 w-full max-w-[420px] mx-auto">
          <CambiumLogo size="md" href="/" />
        </div>
        <div className="w-full max-w-[420px] mx-auto md:mx-0 md:mr-auto md:ml-4 lg:md:ml-8 xl:md:ml-12 animate-fade-up">
          {children}
        </div>
      </div>
    </div>
  );
}
