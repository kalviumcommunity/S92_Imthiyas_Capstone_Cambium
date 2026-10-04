"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  opacity: number;
  dOpacity: number;
  r: number;
}

function NetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const nodesRef = useRef<Node[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const count = 48;
    nodesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      opacity: 0.15 + Math.random() * 0.35,
      dOpacity: (Math.random() - 0.5) * 0.002,
      r: 2 + Math.random() * 2.5,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const nodes = nodesRef.current;

      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        n.opacity += n.dOpacity;
        if (n.opacity < 0.08 || n.opacity > 0.55) n.dOpacity *= -1;
        if (n.x < -40) n.x = canvas.width + 40;
        if (n.x > canvas.width + 40) n.x = -40;
        if (n.y < -40) n.y = canvas.height + 40;
        if (n.y > canvas.height + 40) n.y = -40;
      });

      // edges
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i],
            b = nodes[j];
          const dx = a.x - b.x,
            dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 160) {
            const alpha = (1 - dist / 160) * 0.12;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(23,63,53,${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // nodes
      nodes.forEach((n) => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(23,63,53,${n.opacity})`;
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="relative h-screen max-h-screen w-full overflow-hidden flex flex-col justify-between items-center py-4 px-4 bg-[#FAF7F0] text-[#202920] selection:bg-[#3E6248]/20 selection:text-[#173F35]">
      <NetworkBackground />

      {/* Top buffer space */}
      <div className="w-full h-2" />

      {/* Main Center Content Block */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center my-auto max-w-3xl w-full px-4">
        {/* Massive 500 with badge centered horizontally and vertically in it */}
        <div className="relative flex items-center justify-center mb-4 sm:mb-5">
          <span className="font-sans font-black text-[130px] sm:text-[170px] md:text-[210px] leading-none tracking-tighter text-[#202920] select-none">
            500
          </span>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#E4DCCB] shadow-sm z-10 whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-[#A33B32] animate-pulse" />
            <span className="font-mono text-[11px] sm:text-xs uppercase tracking-widest text-[#202920] font-semibold">
              Cambium Telemetry // Computational Interruption
            </span>
          </div>
        </div>

        {/* Editorial Headline completely cleared of the number above */}
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-normal leading-[1.12] tracking-tight text-[#202920] mb-3 max-w-2xl">
          System disruption <br className="hidden sm:block" />
          <span className="italic text-[#A33B32]">in progress</span>.
        </h1>

        {/* Minimized Font Size Subtitle as requested */}
        <p className="font-serif text-sm sm:text-base text-[#62685E] leading-relaxed max-w-lg mx-auto mb-6">
          Our distributed research cluster encountered an unexpected runtime interruption. Your active hypotheses, notebooks, and graphs remain securely preserved.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full justify-center max-w-lg">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center bg-[#3E6248] hover:bg-[#293E30] text-[#FAF7F0] font-sans text-xs font-semibold uppercase tracking-wider px-7 py-3 rounded-full border border-[#66866A]/30 shadow-sm transition-all cursor-pointer"
          >
            Reload System Node
          </button>

          <Link
            href="/workspace"
            className="w-full sm:w-auto inline-flex items-center justify-center bg-white hover:bg-[#F3EFE6] text-[#202920] font-sans text-xs font-semibold uppercase tracking-wider px-7 py-3 rounded-full border border-[#E4DCCB] shadow-2xs transition-all no-underline"
          >
            Return to Workspace
          </Link>

          <Link
            href="/status"
            className="w-full sm:w-auto inline-flex items-center justify-center bg-transparent hover:bg-black/5 text-[#62685E] font-sans text-xs font-semibold uppercase tracking-wider px-5 py-3 rounded-full transition-all no-underline"
          >
            Platform Status
          </Link>
        </div>
      </div>

      {/* Bottom telemetry badge - always visible without scrolling */}
      <div className="relative z-10 pb-2">
        <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-xs border border-[#E4DCCB] shadow-2xs">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="3" fill="#A33B32" />
            <circle cx="2" cy="4" r="1.5" fill="#A33B32" />
            <circle cx="14" cy="4" r="1.5" fill="#A33B32" />
            <circle cx="2" cy="12" r="1.5" fill="#A33B32" />
            <circle cx="14" cy="12" r="1.5" fill="#A33B32" />
            <line x1="8" y1="8" x2="2" y2="4" stroke="#A33B32" strokeWidth="0.8" />
            <line x1="8" y1="8" x2="14" y2="4" stroke="#A33B32" strokeWidth="0.8" />
            <line x1="8" y1="8" x2="2" y2="12" stroke="#A33B32" strokeWidth="0.8" />
            <line x1="8" y1="8" x2="14" y2="12" stroke="#A33B32" strokeWidth="0.8" />
          </svg>
          <span className="font-mono text-[11px] font-semibold text-[#85877B] tracking-wider uppercase">
            CAMBIUM TELEMETRY // SYSTEM_FAULT_500 // STATE: PRESERVED
          </span>
        </div>
      </div>
    </div>
  );
}
