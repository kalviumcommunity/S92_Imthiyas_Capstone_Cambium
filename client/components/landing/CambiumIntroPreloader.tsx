"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";

interface CambiumIntroPreloaderProps {
  onComplete?: () => void;
  forceShow?: boolean;
}

interface Point {
  x: number;
  y: number;
}

interface RootBranch {
  points: Point[];
  startDelay: number; // 0 to 1
  endProgress: number; // 0 to 1
  thickness: number;
  color: string;
}

interface NetworkNode {
  x: number;
  y: number;
  baseRadius: number;
  threshold: number; // growth value when it activates
  pulseOffset: number;
}

interface PulseSignal {
  rootIndex: number;
  progress: number; // 0 to 1 along path
  speed: number;
}

export function CambiumIntroPreloader({
  onComplete,
  forceShow = false,
}: CambiumIntroPreloaderProps) {
  const [visible, setVisible] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(0); // 0: Genesis spiral, 1: Connecting Nodes, 2: Typography Assembly, 3: Resolved
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Total duration: ~4.5 seconds on screen before silky fade-out
  const TOTAL_DURATION_MS = 4500;
  const FADE_OUT_DURATION_MS = 1000;

  // On mount check session storage
  useEffect(() => {
    try {
      const seen = sessionStorage.getItem("cambium_intro_seen");
      if (forceShow || seen !== "true") {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, [forceShow]);

  // Reset state when forceShow triggers
  useEffect(() => {
    if (forceShow) {
      setVisible(true);
      setFadingOut(false);
      setProgress(0);
      setStep(0);
    }
  }, [forceShow]);

  // Handle Skip (button or Escape key)
  const handleSkip = () => {
    try {
      sessionStorage.setItem("cambium_intro_seen", "true");
    } catch {
      // ignore
    }
    setFadingOut(true);
    setTimeout(() => {
      setVisible(false);
      if (onComplete) onComplete();
    }, 200);
  };

  // Keyboard shortcut listener for Esc key
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleSkip();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Timer & progress stepper
  useEffect(() => {
    if (!visible) return;
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / (TOTAL_DURATION_MS - 300)) * 100));
      setProgress(pct);

      if (elapsed < 1200) {
        setStep(0);
      } else if (elapsed < 2400) {
        setStep(1);
      } else if (elapsed < 3600) {
        setStep(2);
      } else {
        setStep(3);
      }

      if (elapsed >= TOTAL_DURATION_MS) {
        clearInterval(interval);
        try {
          sessionStorage.setItem("cambium_intro_seen", "true");
        } catch {
          // ignore
        }
        setFadingOut(true);
        setTimeout(() => {
          setVisible(false);
          if (onComplete) onComplete();
        }, FADE_OUT_DURATION_MS);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [onComplete, visible]);

  // Procedural Roots & Nodes Canvas Animation
  useEffect(() => {
    if (!visible) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initNetwork();
    };

    // Procedural Root and Node Network Generation
    let branches: RootBranch[] = [];
    let nodes: NetworkNode[] = [];
    let signals: PulseSignal[] = [];

    const initNetwork = () => {
      branches = [];
      nodes = [];
      signals = [];

      // Organic root paths spreading across the viewport
      // Coordinates normalized [0..1] mapped to current width & height
      const seedPaths = [
        // Main bottom root ascending upwards & branching left/center
        {
          points: [
            { x: 0.50, y: 1.05 },
            { x: 0.49, y: 0.88 },
            { x: 0.44, y: 0.74 },
            { x: 0.38, y: 0.60 },
            { x: 0.32, y: 0.48 },
            { x: 0.28, y: 0.36 },
            { x: 0.22, y: 0.22 },
          ],
          startDelay: 0.0,
          endProgress: 0.65,
          thickness: 1.3,
          color: "rgba(62, 98, 72, 0.16)",
        },
        // Secondary branch from main bottom root curling right
        {
          points: [
            { x: 0.44, y: 0.74 },
            { x: 0.52, y: 0.68 },
            { x: 0.62, y: 0.62 },
            { x: 0.71, y: 0.52 },
            { x: 0.78, y: 0.40 },
          ],
          startDelay: 0.18,
          endProgress: 0.75,
          thickness: 1.1,
          color: "rgba(62, 98, 72, 0.14)",
        },
        // Bottom-left root sweeping inwards
        {
          points: [
            { x: 0.12, y: 1.05 },
            { x: 0.14, y: 0.86 },
            { x: 0.18, y: 0.70 },
            { x: 0.23, y: 0.58 },
            { x: 0.19, y: 0.44 },
            { x: 0.14, y: 0.32 },
          ],
          startDelay: 0.05,
          endProgress: 0.70,
          thickness: 1.1,
          color: "rgba(62, 98, 72, 0.14)",
        },
        // Side branch from bottom-left reaching across
        {
          points: [
            { x: 0.18, y: 0.70 },
            { x: 0.26, y: 0.75 },
            { x: 0.34, y: 0.79 },
            { x: 0.41, y: 0.84 },
          ],
          startDelay: 0.22,
          endProgress: 0.80,
          thickness: 0.9,
          color: "rgba(62, 98, 72, 0.12)",
        },
        // Bottom-right root sweeping upward-left
        {
          points: [
            { x: 0.88, y: 1.05 },
            { x: 0.85, y: 0.86 },
            { x: 0.79, y: 0.72 },
            { x: 0.72, y: 0.60 },
            { x: 0.68, y: 0.46 },
            { x: 0.64, y: 0.34 },
          ],
          startDelay: 0.08,
          endProgress: 0.72,
          thickness: 1.2,
          color: "rgba(62, 98, 72, 0.15)",
        },
        // Branch from bottom-right root extending right-upper
        {
          points: [
            { x: 0.79, y: 0.72 },
            { x: 0.86, y: 0.64 },
            { x: 0.91, y: 0.52 },
            { x: 0.94, y: 0.38 },
          ],
          startDelay: 0.25,
          endProgress: 0.82,
          thickness: 0.95,
          color: "rgba(62, 98, 72, 0.12)",
        },
        // Left middle root branching across upper-left quadrant
        {
          points: [
            { x: -0.05, y: 0.42 },
            { x: 0.08, y: 0.40 },
            { x: 0.16, y: 0.34 },
            { x: 0.24, y: 0.26 },
            { x: 0.33, y: 0.20 },
            { x: 0.42, y: 0.18 },
          ],
          startDelay: 0.12,
          endProgress: 0.78,
          thickness: 1.05,
          color: "rgba(62, 98, 72, 0.13)",
        },
        // Right middle root branching across upper-right quadrant
        {
          points: [
            { x: 1.05, y: 0.36 },
            { x: 0.92, y: 0.33 },
            { x: 0.82, y: 0.28 },
            { x: 0.73, y: 0.22 },
            { x: 0.65, y: 0.19 },
            { x: 0.56, y: 0.16 },
          ],
          startDelay: 0.14,
          endProgress: 0.80,
          thickness: 1.05,
          color: "rgba(62, 98, 72, 0.13)",
        },
        // Top subtle canopy root extending gently downwards
        {
          points: [
            { x: 0.35, y: -0.05 },
            { x: 0.38, y: 0.08 },
            { x: 0.43, y: 0.16 },
            { x: 0.48, y: 0.24 },
          ],
          startDelay: 0.30,
          endProgress: 0.88,
          thickness: 0.85,
          color: "rgba(62, 98, 72, 0.11)",
        },
        {
          points: [
            { x: 0.68, y: -0.05 },
            { x: 0.64, y: 0.09 },
            { x: 0.58, y: 0.18 },
            { x: 0.52, y: 0.26 },
          ],
          startDelay: 0.32,
          endProgress: 0.90,
          thickness: 0.85,
          color: "rgba(62, 98, 72, 0.11)",
        },
      ];

      // Convert seed paths into branches with screen pixel coordinates
      branches = seedPaths.map((sp) => ({
        points: sp.points.map((p) => ({ x: p.x * width, y: p.y * height })),
        startDelay: sp.startDelay,
        endProgress: sp.endProgress,
        thickness: sp.thickness,
        color: sp.color,
      }));

      // Generate vascular nodes along branch joints and endpoints
      const nodeSet: NetworkNode[] = [];
      branches.forEach((branch, bIdx) => {
        branch.points.forEach((pt, pIdx) => {
          if (pIdx === 0 && (pt.x < 0 || pt.x > width || pt.y > height)) return;
          const ratio = pIdx / (branch.points.length - 1);
          const threshold = branch.startDelay + ratio * (branch.endProgress - branch.startDelay);
          nodeSet.push({
            x: pt.x + (Math.sin(pIdx * 1.7 + bIdx) * 6),
            y: pt.y + (Math.cos(pIdx * 2.1 + bIdx) * 6),
            baseRadius: pIdx === branch.points.length - 1 ? 3.6 : 2.6,
            threshold: Math.min(0.95, threshold),
            pulseOffset: Math.random() * Math.PI * 2,
          });
        });
      });

      // Add a few subtle ambient satellite nodes in open field
      const satellites = [
        { x: 0.22, y: 0.78, t: 0.35 },
        { x: 0.77, y: 0.82, t: 0.42 },
        { x: 0.18, y: 0.22, t: 0.50 },
        { x: 0.82, y: 0.20, t: 0.48 },
        { x: 0.36, y: 0.44, t: 0.55 },
        { x: 0.64, y: 0.42, t: 0.58 },
        { x: 0.50, y: 0.30, t: 0.62 },
        { x: 0.50, y: 0.76, t: 0.40 },
      ];
      satellites.forEach((s) => {
        nodeSet.push({
          x: s.x * width,
          y: s.y * height,
          baseRadius: 2.8,
          threshold: s.t,
          pulseOffset: Math.random() * Math.PI * 2,
        });
      });

      nodes = nodeSet;

      // Seed bio-signal pulses that travel through the root conduits
      signals = [
        { rootIndex: 0, progress: 0.05, speed: 0.0016 },
        { rootIndex: 1, progress: 0.20, speed: 0.0019 },
        { rootIndex: 2, progress: 0.10, speed: 0.0015 },
        { rootIndex: 4, progress: 0.15, speed: 0.0017 },
        { rootIndex: 6, progress: 0.30, speed: 0.0021 },
        { rootIndex: 7, progress: 0.25, speed: 0.0020 },
      ];
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const startTime = Date.now();

    // Render Loop
    const render = () => {
      const elapsed = Date.now() - startTime;
      const t = elapsed / 1000;
      // Growth progression over the intro duration (normalized 0 to 1)
      const globalGrowth = Math.min(1, elapsed / (TOTAL_DURATION_MS * 0.82));

      ctx.clearRect(0, 0, width, height);

      // ─── 1. Draw Organic Roots ─────────────────────────────────────────────
      branches.forEach((branch, bIdx) => {
        if (globalGrowth < branch.startDelay) return;
        const branchProgress = Math.min(
          1,
          (globalGrowth - branch.startDelay) / (branch.endProgress - branch.startDelay)
        );
        if (branchProgress <= 0) return;

        const pts = branch.points;
        const totalSegments = pts.length - 1;
        const currentSegmentProgress = branchProgress * totalSegments;
        const completedSegments = Math.floor(currentSegmentProgress);
        const segmentFraction = currentSegmentProgress - completedSegments;

        ctx.beginPath();
        ctx.strokeStyle = branch.color;
        ctx.lineWidth = branch.thickness;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        ctx.moveTo(pts[0].x, pts[0].y);

        for (let i = 0; i < completedSegments; i++) {
          const p0 = pts[i];
          const p1 = pts[i + 1];
          // Gentle organic undulation
          const wave = Math.sin(t * 0.8 + i + bIdx) * 0.75;
          const midX = (p0.x + p1.x) / 2 + wave;
          const midY = (p0.y + p1.y) / 2 + wave;
          ctx.quadraticCurveTo(p0.x, p0.y, midX, midY);
        }

        if (completedSegments < totalSegments) {
          const pStart = pts[completedSegments];
          const pEnd = pts[completedSegments + 1];
          const curX = pStart.x + (pEnd.x - pStart.x) * segmentFraction;
          const curY = pStart.y + (pEnd.y - pStart.y) * segmentFraction;
          ctx.lineTo(curX, curY);
        }

        ctx.stroke();
      });

      // ─── 2. Draw Inter-Node Connecting Synaptic Filaments ──────────────────
      // Faint lines slowly connecting nearby nodes (visible only when paid attention)
      const maxConnectDist = 145;
      for (let i = 0; i < nodes.length; i++) {
        const nodeA = nodes[i];
        if (globalGrowth < nodeA.threshold) continue;

        for (let j = i + 1; j < nodes.length; j++) {
          const nodeB = nodes[j];
          if (globalGrowth < nodeB.threshold) continue;

          const dx = nodeA.x - nodeB.x;
          const dy = nodeA.y - nodeB.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxConnectDist) {
            const alpha = (1 - dist / maxConnectDist) * 0.075; // Soft subtle filament
            ctx.beginPath();
            ctx.strokeStyle = `rgba(102, 134, 106, ${alpha})`;
            ctx.lineWidth = 0.75;
            ctx.setLineDash([3, 5]);
            ctx.moveTo(nodeA.x, nodeA.y);
            ctx.lineTo(nodeB.x, nodeB.y);
            ctx.stroke();
            ctx.setLineDash([]);
          }
        }
      }

      // ─── 3. Draw Nodes (Junctions & Halos - Bigger but Softer & Less Bright) ────────────────
      nodes.forEach((node) => {
        if (globalGrowth < node.threshold) {
          // Dormant / very faint precursor node
          ctx.beginPath();
          ctx.arc(node.x, node.y, 1.8, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(42, 64, 48, 0.08)";
          ctx.fill();
          return;
        }

        // Active node: gentle breathing aura and soft translucent core (decreased brightness, increased diameter)
        const pulse = Math.sin(t * 1.8 + node.pulseOffset);
        const auraRadius = node.baseRadius + 4.2 + pulse * 1.4;
        const auraAlpha = 0.04 + (pulse + 1) * 0.018;

        // Faint outer soft halo
        ctx.beginPath();
        ctx.arc(node.x, node.y, auraRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(62, 98, 72, ${auraAlpha})`;
        ctx.fill();

        // Soft translucent core node (subdued, gentle on eyes)
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.baseRadius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(72, 104, 78, 0.22)";
        ctx.fill();

        // Delicate perimeter stroke for organic form
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.baseRadius, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(92, 128, 98, 0.24)";
        ctx.lineWidth = 0.75;
        ctx.stroke();
      });

      // ─── 4. Luminous Bio-Signal Pulses Traveling Conduits ───────────────────
      signals.forEach((sig) => {
        const branch = branches[sig.rootIndex];
        if (!branch || globalGrowth < branch.startDelay + 0.1) return;

        sig.progress = (sig.progress + sig.speed) % 1;
        const pts = branch.points;
        const totalSegments = pts.length - 1;
        const currProgress = sig.progress * totalSegments;
        const segIdx = Math.floor(currProgress);
        const frac = currProgress - segIdx;

        if (segIdx < totalSegments) {
          const p0 = pts[segIdx];
          const p1 = pts[segIdx + 1];
          const px = p0.x + (p1.x - p0.x) * frac;
          const py = p0.y + (p1.y - p0.y) * frac;

          // Gentle traveling bio-pulse without harsh glow
          ctx.beginPath();
          ctx.arc(px, py, 1.8, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(95, 130, 100, 0.24)";
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[10000] bg-[#141A14] text-[#FAF7F0] flex flex-col justify-between p-6 sm:p-12 overflow-hidden select-none font-sans ${
        fadingOut
          ? "opacity-0 scale-[1.01] pointer-events-none transition-all duration-1000 ease-in-out"
          : "opacity-100 scale-100 transition-all duration-700 ease-out"
      }`}
    >
      {/* Precision Procedural Roots and Nodes Canvas Layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0"
        style={{ mixBlendMode: "normal" }}
      />

      {/* Precision Micro Topological Grid (Subtle, Technical, Enterprise) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-15 z-1"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(228,220,203,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(228,220,203,0.12) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Soft Vignette Overlay to enhance contrast and focus towards center */}
      <div
        className="absolute inset-0 pointer-events-none z-2"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(20,26,20,0.65) 100%)",
        }}
      />

      {/* Top Header Telemetry */}
      <div className="relative z-10 flex items-center justify-between w-full max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-[#1B231D] border border-[#3E6248]/50 flex items-center justify-center p-0.5 shadow-xs overflow-hidden">
            <img src="/public_logo/cambium-logo-dark.svg" alt="CAMBIUM Mark" className="w-full h-full object-contain scale-[1.3] transition-transform" />
          </div>
          <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-[#85877B]">
            Cambium Runtime · Kernel 2.4
          </span>
        </div>

        <button
          onClick={handleSkip}
          className="text-[11px] font-mono tracking-wider uppercase px-3 py-1.5 rounded-full border border-[#3E6248]/40 bg-[#1B231D]/80 hover:bg-[#253228] text-[#DCE6D7] transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
        >
          <span>Skip [Esc]</span>
          <ArrowRight size={11} className="text-[#66866A]" />
        </button>
      </div>

      {/* Centerpiece: Ultra-Clean Monumental Typography Assembly */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center my-auto px-4 max-w-5xl mx-auto w-full">
        {/* Minimalist Dual Fibonacci Spiral Mark */}
        <div className="relative mb-8 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-[#1B231D] border border-[#3E6248] p-1.5 flex items-center justify-center shadow-lg transition-transform overflow-hidden">
            <img
              src="/public_logo/cambium-logo-dark.svg"
              alt="CAMBIUM Logo"
              className="w-full h-full object-contain scale-[1.3] transition-transform"
            />
          </div>
        </div>

        {/* Monumental CAMBIUM RESEARCH Typography with Connected Structural Nodes */}
        <div className="relative overflow-visible py-3">
          {/* Crisp SVG Connecting Node Mesh */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible -top-2">
            <line
              x1="6%"
              y1="50%"
              x2="94%"
              y2="50%"
              stroke="#3E6248"
              strokeWidth="1"
              strokeDasharray="4 6"
              className="opacity-40"
            />
            {/* Minimal node ticks along the wordmark axis */}
            {[12, 28, 44, 60, 76, 88].map((pct, idx) => (
              <g key={idx}>
                <circle
                  cx={`${pct}%`}
                  cy="50%"
                  r={step >= 1 ? "2.5" : "1.5"}
                  fill={step >= 2 ? "#66866A" : "#3E6248"}
                  className="transition-all duration-500"
                />
              </g>
            ))}
          </svg>

          <h1 className="font-sans font-bold text-4xl sm:text-6xl md:text-7xl lg:text-[90px] tracking-[-0.04em] leading-none uppercase m-0 flex flex-wrap items-center justify-center gap-x-5 text-[#FAF7F0]">
            <span
              className="inline-block transition-all duration-700"
              style={{
                opacity: step >= 0 ? 1 : 0.2,
                transform: step >= 1 ? "translateY(0)" : "translateY(4px)",
              }}
            >
              CAMBIUM
            </span>
            <span
              className="font-light tracking-[0.04em] text-[#3F5844] transition-all duration-700"
              style={{
                opacity: step >= 1 ? 1 : 0.3,
                transform: step >= 1 ? "translateY(0)" : "translateY(4px)",
              }}
            >
              RESEARCH
            </span>
          </h1>
        </div>

        {/* Minimal Understated Tagline & State Telemetry */}
        <div className="mt-6 flex flex-col items-center gap-1.5">
          <p className="font-serif italic text-sm sm:text-base text-[#DCE6D7] m-0 font-normal">
            The Research Operating System.
          </p>
          <span className="font-mono text-[11px] text-[#88B790] tracking-[0.18em] uppercase font-semibold">
            {step === 0 && "SYNCHRONIZING SCHOLARLY TOPOLOGY"}
            {step === 1 && "CONNECTING ACADEMIC MESH"}
            {step === 2 && "INITIALIZING RESEARCH WORKSPACE"}
            {step === 3 && "TOPOLOGY CONVERGED · SYSTEM READY"}
          </span>
        </div>
      </div>

      {/* Bottom Minimal Hairline Progress Bar */}
      <div className="relative z-10 w-full max-w-6xl mx-auto flex items-center justify-between gap-4 border-t border-[#3E6248]/30 pt-5">
        <div className="flex items-center gap-2 text-[11px] font-mono text-[#85877B]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#66866A] inline-block animate-pulse" />
          <span>FIBONACCI MESH · VERIFIED SECURE</span>
        </div>

        {/* Clean Hairline Progress Meter */}
        <div className="flex items-center gap-3 w-48 sm:w-60">
          <div className="flex-1 h-[2px] bg-[#202920] overflow-hidden rounded-full">
            <div
              className="h-full bg-[#66866A] transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="font-mono text-[11px] text-[#85877B] shrink-0 w-8 text-right font-medium">
            {progress}%
          </span>
        </div>
      </div>
    </div>
  );
}
