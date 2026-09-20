import Link from "next/link";
import { ReactNode } from "react";

function CambiumLogo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect width="28" height="28" rx="6" className="fill-primary-dark" />
        <path d="M8 14C8 10.686 10.686 8 14 8C15.933 8 17.655 8.883 18.8 10.267L21 8.4C19.267 6.373 16.78 5 14 5C9.03 5 5 9.03 5 14C5 18.97 9.03 23 14 23C16.78 23 19.267 21.627 21 19.6L18.8 17.733C17.655 19.117 15.933 20 14 20C10.686 20 8 17.314 8 14Z" fill="#F7F6F1" />
      </svg>
      <span className="text-[13px] font-bold tracking-[0.2em] text-foreground">
        CAMBIUM
      </span>
    </Link>
  );
}

const NODES = [
  { label: "Scientific ML", x: "18%", y: "18%", cls: "animate-float-a" },
  { label: "Maya Chen", x: "62%", y: "10%", cls: "animate-float-b" },
  { label: "Protein Folding", x: "72%", y: "38%", cls: "animate-float-a" },
  { label: "Dr. Patel", x: "28%", y: "50%", cls: "animate-float-c" },
  { label: "Climate Systems", x: "8%", y: "68%", cls: "animate-float-b" },
  { label: "Quantum Bio", x: "55%", y: "62%", cls: "animate-float-a" },
  { label: "Nature, 2024", x: "78%", y: "76%", cls: "animate-float-c" },
  { label: "Graph Theory", x: "30%", y: "80%", cls: "animate-float-b" },
];

const EDGES = [
  [0, 1], [1, 2], [0, 3], [3, 4], [3, 5], [2, 5], [5, 6], [5, 7],
];

function NetworkGraph() {
  return (
    <div className="relative w-full flex-1 min-h-[220px]" aria-hidden="true">
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {EDGES.map(([a, b], i) => {
          const na = NODES[a], nb = NODES[b];
          return (
            <line
              key={i}
              x1={na.x} y1={na.y}
              x2={nb.x} y2={nb.y}
              stroke="hsl(var(--primary-dark))"
              strokeOpacity="0.18"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          );
        })}
      </svg>
      {NODES.map((node) => (
        <div
          key={node.label}
          className={`absolute ${node.cls} select-none`}
          style={{ left: node.x, top: node.y, transform: "translate(-50%,-50%)" }}
        >
          <div className="px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap bg-background border border-border text-foreground shadow-elevation1">
            {node.label}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen grid grid-cols-1 md:grid-cols-2 overflow-hidden bg-background">
      {/* Left Column */}
      <div className="hidden md:flex flex-col p-12 h-full bg-[#F7F6F1]">
        <CambiumLogo />

        <div className="flex flex-col flex-1 justify-center gap-8 mt-10">
          <div className="max-w-[480px]">
            <h1 className="text-display-lg text-foreground mb-4 font-serif">
              Your research world,{" "}
              <em className="not-italic italic text-primary-dark font-serif">
                finally
              </em>{" "}
              connected.
            </h1>
            <p className="text-body-lg text-muted-foreground">
              Build your academic identity, organize your research, discover
              opportunities, and connect with researchers.
            </p>
          </div>

          <NetworkGraph />
        </div>

        <div className="mt-6">
          <span className="text-[11px] tracking-[0.25em] font-semibold uppercase text-muted-foreground">
            Research Operating System
          </span>
        </div>
      </div>

      {/* Right Column (Auth Forms) */}
      <div className="flex flex-col items-center justify-center h-full px-6 py-10 overflow-y-auto">
        <div className="md:hidden mb-8 w-full max-w-[400px]">
          <CambiumLogo />
        </div>
        <div className="w-full max-w-[400px] animate-fade-up">
          {children}
        </div>
      </div>
    </div>
  );
}
