"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Share2,
  Sparkles,
  Search,
  Filter,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Layers,
  Compass,
  ArrowUpRight,
  Bookmark,
  FileText,
  Activity,
  Zap,
  Info,
  ChevronRight,
  Sliders,
  Network,
} from "lucide-react";
import RelationalKnowledgeNetwork from "@/components/intelligence/RelationalKnowledgeNetwork";

interface GraphNode {
  id: string;
  title: string;
  category: "Neuro-Symbolic" | "Structural Biology" | "Genomic Foundation" | "Quantum ML" | "Structural Hole";
  citations: number;
  year: number;
  authors: string;
  journal: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  isBridge?: boolean;
  abstract: string;
}

interface GraphLink {
  source: string;
  target: string;
  weight: number;
  type: "citation" | "semantic_bridge" | "grant_overlap";
}

const INITIAL_NODES: GraphNode[] = [
  {
    id: "n-1",
    title: "AlphaFold 3 Multimer Biomolecular Complex Prediction",
    category: "Structural Biology",
    citations: 2840,
    year: 2024,
    authors: "Abramson et al. · DeepMind & Isomorphic Labs",
    journal: "Nature 630, 493–500",
    x: 340,
    y: 260,
    vx: 0,
    vy: 0,
    radius: 22,
    abstract: "A diffusion-based architecture that jointly models chemical coordinates of proteins, nucleic acids, small molecules, and chemical modifications with atomic precision.",
  },
  {
    id: "n-2",
    title: "Neuro-Symbolic Deductive Inference Over Large Chemical Spaces",
    category: "Neuro-Symbolic",
    citations: 940,
    year: 2025,
    authors: "Imthiyas, Chen, & Vance · MIT & Cambium Labs",
    journal: "Cell Systems 18, 112–129",
    x: 480,
    y: 290,
    vx: 0,
    vy: 0,
    radius: 18,
    isBridge: true,
    abstract: "Constraining generative diffusion models via first-order logical constraints for synthesizable drug discovery without catastrophic hallucination.",
  },
  {
    id: "n-3",
    title: "Evo: DNA Foundation Model from Molecular to Genome Scale",
    category: "Genomic Foundation",
    citations: 1420,
    year: 2024,
    authors: "Nguyen et al. · Arc Institute & Stanford",
    journal: "Science 386, eado9336",
    x: 280,
    y: 420,
    vx: 0,
    vy: 0,
    radius: 19,
    abstract: "A genomic foundation model with 7-billion parameters trained at single-nucleotide resolution with 131k context length using StripedHyena architecture.",
  },
  {
    id: "n-4",
    title: "Quantum Kernel Methods for Macromolecular Binding Free Energy",
    category: "Quantum ML",
    citations: 512,
    year: 2025,
    authors: "Takashi, M. & Arisawa, K. · RIKEN Center for Quantum Computing",
    journal: "Physical Review X Quantum 6, 020311",
    x: 650,
    y: 210,
    vx: 0,
    vy: 0,
    radius: 15,
    abstract: "Applying NISQ-era quantum kernel formulations to overcome classical molecular dynamics electrostatic sampling bottlenecks.",
  },
  {
    id: "n-5",
    title: "Structural Hole // Unexplored Bridge: Epigenetic Diffusion & Logic Priors",
    category: "Structural Hole",
    citations: 86,
    year: 2026,
    authors: "Hypothetical Cross-Synthesis Opportunity",
    journal: "Cambium Frontier Discovery Engine",
    x: 420,
    y: 390,
    vx: 0,
    vy: 0,
    radius: 16,
    isBridge: true,
    abstract: "Identified high-centrality gap between genomic foundation tokenizers and neuro-symbolic rule verifiers. Prime grant hypothesis with zero peer competition.",
  },
  {
    id: "n-6",
    title: "ESM-3: Simulating 500 Million Years of Evolution with Generative Language",
    category: "Structural Biology",
    citations: 1890,
    year: 2024,
    authors: "Hayes et al. · EvolutionaryScale",
    journal: "bioRxiv 2024.07.02.601876",
    x: 220,
    y: 200,
    vx: 0,
    vy: 0,
    radius: 17,
    abstract: "A frontier multimodal biological model reasoning over sequence, structure, and function simultaneously to generate de novo fluorescent proteins.",
  },
  {
    id: "n-7",
    title: "Symbolic Knowledge Graphs in Clinical Pathology Reasoning",
    category: "Neuro-Symbolic",
    citations: 730,
    year: 2024,
    authors: "Rodriguez, E. · Stanford Medical AI",
    journal: "Lancet Digital Health 6, e412",
    x: 610,
    y: 380,
    vx: 0,
    vy: 0,
    radius: 16,
    abstract: "Hybrid graph-neural networks enforcing clinical guideline compliance during oncological treatment pathway recommendations.",
  },
];

const INITIAL_LINKS: GraphLink[] = [
  { source: "n-1", target: "n-2", weight: 3, type: "semantic_bridge" },
  { source: "n-1", target: "n-6", weight: 4, type: "citation" },
  { source: "n-2", target: "n-4", weight: 2, type: "citation" },
  { source: "n-2", target: "n-5", weight: 3, type: "semantic_bridge" },
  { source: "n-3", target: "n-5", weight: 4, type: "semantic_bridge" },
  { source: "n-2", target: "n-7", weight: 3, type: "citation" },
  { source: "n-3", target: "n-1", weight: 2, type: "grant_overlap" },
];

export default function SemanticGraphPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [viewMode, setViewMode] = useState<"relational" | "constellation">("relational");
  const [nodes, setNodes] = useState<GraphNode[]>(INITIAL_NODES);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(INITIAL_NODES[1]);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [highlightBridgesOnly, setHighlightBridgesOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isPhysicsRunning, setIsPhysicsRunning] = useState<boolean>(true);
  const [canvasAnnouncement, setCanvasAnnouncement] = useState<string>("");

  // Accessible Keyboard Navigation & Canvas Traversal Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in a search bar or text input
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (e.key === "+" || e.key === "=" || e.key.toLowerCase() === "z") {
        e.preventDefault();
        setZoomLevel((z) => {
          const next = Math.min(2.5, +(z + 0.2).toFixed(2));
          setCanvasAnnouncement(`Canvas zoom increased to ${Math.round(next * 100)} percent`);
          return next;
        });
      } else if (e.key === "-" || e.key === "_" || e.key.toLowerCase() === "x") {
        e.preventDefault();
        setZoomLevel((z) => {
          const next = Math.max(0.5, +(z - 0.2).toFixed(2));
          setCanvasAnnouncement(`Canvas zoom decreased to ${Math.round(next * 100)} percent`);
          return next;
        });
      } else if (e.key.toLowerCase() === "r") {
        e.preventDefault();
        setZoomLevel(1);
        setIsPhysicsRunning(true);
        setCanvasAnnouncement("Canvas zoom and force physics simulation reset to 100 percent.");
      } else if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        const currentIndex = nodes.findIndex((n) => n.id === selectedNode?.id);
        const nextIndex = (currentIndex + 1) % nodes.length;
        const nextNode = nodes[nextIndex];
        setSelectedNode(nextNode);
        setCanvasAnnouncement(
          `Selected node ${nextIndex + 1} of ${nodes.length}: ${nextNode.title}, Category ${nextNode.category}, ${nextNode.citations} citations.`
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nodes, selectedNode]);

  // Category palette
  const getCategoryColor = (cat: GraphNode["category"]) => {
    switch (cat) {
      case "Neuro-Symbolic":
        return "#3E6248"; // Forest Canopy
      case "Structural Biology":
        return "#173F35"; // Deep Pine
      case "Genomic Foundation":
        return "#66866A"; // Sage Root
      case "Quantum ML":
        return "#A36A4F"; // Terracotta mineral
      case "Structural Hole":
        return "#D97706"; // Amber opportunity
      default:
        return "#62685E";
    }
  };

  const draggedNodeRef = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const render = () => {
      // ─── Force-Directed Physics Simulation Step ───────────────────────────
      if (isPhysicsRunning) {
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;

        nodes.forEach((n) => {
          if (draggedNodeRef.current?.id === n.id) return;

          // 1. Weak center gravity pull
          n.vx += (cx - n.x) * 0.0012;
          n.vy += (cy - n.y) * 0.0012;

          // 2. Electrostatic repulsion between node pairs
          nodes.forEach((other) => {
            if (other.id === n.id) return;
            const dx = n.x - other.x;
            const dy = n.y - other.y;
            const dist = Math.hypot(dx, dy) || 1;
            const minDist = (n.radius + other.radius) * 2.8;
            if (dist < minDist) {
              const rep = ((minDist - dist) / minDist) * 0.75;
              n.vx += (dx / dist) * rep;
              n.vy += (dy / dist) * rep;
            }
          });

          // 3. Category cluster attraction centroids
          let targetX = cx;
          let targetY = cy;
          if (n.category === "Neuro-Symbolic") {
            targetX = cx - 180;
            targetY = cy - 90;
          } else if (n.category === "Structural Biology") {
            targetX = cx - 140;
            targetY = cy + 130;
          } else if (n.category === "Genomic Foundation") {
            targetX = cx - 40;
            targetY = cy + 170;
          } else if (n.category === "Quantum ML") {
            targetX = cx + 200;
            targetY = cy - 80;
          } else if (n.category === "Structural Hole") {
            targetX = cx;
            targetY = cy + 30;
          }

          n.vx += (targetX - n.x) * 0.0018;
          n.vy += (targetY - n.y) * 0.0018;
        });

        // 4. Hooke's Law Spring Links
        INITIAL_LINKS.forEach((link) => {
          const s = nodes.find((n) => n.id === link.source);
          const t = nodes.find((n) => n.id === link.target);
          if (!s || !t) return;
          const dx = t.x - s.x;
          const dy = t.y - s.y;
          const dist = Math.hypot(dx, dy) || 1;
          const idealDist = link.type === "semantic_bridge" ? 170 : 110;
          const spring = (dist - idealDist) * 0.007;

          if (draggedNodeRef.current?.id !== s.id) {
            s.vx += (dx / dist) * spring;
            s.vy += (dy / dist) * spring;
          }
          if (draggedNodeRef.current?.id !== t.id) {
            t.vx -= (dx / dist) * spring;
            t.vy -= (dy / dist) * spring;
          }
        });

        // 5. Integrate velocity, apply air damping & canvas boundary constraints
        nodes.forEach((n) => {
          if (draggedNodeRef.current?.id === n.id) return;
          n.vx *= 0.86;
          n.vy *= 0.86;
          n.x += n.vx;
          n.y += n.vy;

          n.x = Math.max(n.radius + 15, Math.min(canvas.width - n.radius - 15, n.x));
          n.y = Math.max(n.radius + 15, Math.min(canvas.height - n.radius - 15, n.y));
        });
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background subtle grid
      ctx.strokeStyle = "rgba(228, 220, 203, 0.4)";
      ctx.lineWidth = 1;
      const gridSize = 40 * zoomLevel;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw links
      INITIAL_LINKS.forEach((link) => {
        const s = nodes.find((n) => n.id === link.source);
        const t = nodes.find((n) => n.id === link.target);
        if (!s || !t) return;

        const isHighlighted =
          selectedNode && (selectedNode.id === s.id || selectedNode.id === t.id);

        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(t.x, t.y);

        if (link.type === "semantic_bridge") {
          ctx.strokeStyle = isHighlighted ? "#D97706" : "rgba(217, 119, 6, 0.5)";
          ctx.setLineDash([5, 4]);
          ctx.lineWidth = isHighlighted ? 3 : 2;
        } else if (link.type === "grant_overlap") {
          ctx.strokeStyle = isHighlighted ? "#3E6248" : "rgba(62, 98, 72, 0.28)";
          ctx.setLineDash([2, 2]);
          ctx.lineWidth = 1.5;
        } else {
          ctx.strokeStyle = isHighlighted ? "#202920" : "rgba(98, 104, 94, 0.22)";
          ctx.setLineDash([]);
          ctx.lineWidth = isHighlighted ? 2.5 : 1.2;
        }
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Draw nodes
      nodes.forEach((node) => {
        const isSelected = selectedNode?.id === node.id;
        const matchesCategory =
          activeCategory === "All" || node.category === activeCategory;
        const matchesSearch =
          !searchQuery ||
          node.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          node.authors.toLowerCase().includes(searchQuery.toLowerCase());
        const isDimmed = !matchesCategory || !matchesSearch;

        // Outer halo if selected or isBridge
        if (isSelected || (highlightBridgesOnly && node.isBridge)) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + 8, 0, Math.PI * 2);
          ctx.fillStyle = node.isBridge
            ? "rgba(217, 119, 6, 0.18)"
            : "rgba(62, 98, 72, 0.15)";
          ctx.fill();
          ctx.strokeStyle = node.isBridge ? "#D97706" : "#3E6248";
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Main node body
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = isDimmed ? "#E4DCCB" : getCategoryColor(node.category);
        ctx.fill();
        ctx.strokeStyle = isSelected ? "#202920" : "#FAF7F0";
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Node label
        ctx.font = isSelected
          ? "600 12px 'Newsreader', serif"
          : "500 11px system-ui, sans-serif";
        ctx.fillStyle = isDimmed ? "#9CA3AF" : "#202920";
        ctx.textAlign = "center";
        const shortTitle =
          node.title.length > 28 ? node.title.slice(0, 26) + "..." : node.title;
        ctx.fillText(shortTitle, node.x, node.y + node.radius + 14);
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [nodes, selectedNode, activeCategory, highlightBridgesOnly, searchQuery, zoomLevel, isPhysicsRunning]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const clicked = nodes.find((node) => {
      const dist = Math.hypot(node.x - clickX, node.y - clickY);
      return dist <= node.radius + 8;
    });

    if (clicked) {
      draggedNodeRef.current = {
        id: clicked.id,
        offsetX: clickX - clicked.x,
        offsetY: clickY - clicked.y,
      };
      setSelectedNode(clicked);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!draggedNodeRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const curX = e.clientX - rect.left;
    const curY = e.clientY - rect.top;

    const dragged = nodes.find((n) => n.id === draggedNodeRef.current?.id);
    if (dragged) {
      dragged.x = curX - draggedNodeRef.current.offsetX;
      dragged.y = curY - draggedNodeRef.current.offsetY;
      dragged.vx = 0;
      dragged.vy = 0;
    }
  };

  const handleMouseUp = () => {
    draggedNodeRef.current = null;
  };

  return (
    <div className="flex-1 min-w-0 h-screen overflow-hidden flex flex-col bg-[#FAF7F0] text-[#202920] font-sans selection:bg-[#3E6248]/20 selection:text-[#173F35]">
      {/* Top Navigation & Subheader */}
      <div className="px-6 py-4 border-b border-[#E4DCCB] bg-[#FAF7F0] flex flex-col md:flex-row md:items-center md:justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#DCE6D7] border border-[#66866A]/30 text-[#3E6248]">
            <Compass size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl font-normal text-[#202920] tracking-tight m-0">
                Semantic Constellation Explorer
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-[#DCE6D7]/80 text-[#3E6248] border border-[#66866A]/20">
                2D Topography v2.4
              </span>
            </div>
            <p className="text-xs text-[#62685E] font-sans mt-0.5">
              Unsupervised clustering across 4.2M biomedical preprints, citation trajectories, and high-impact structural holes.
            </p>
          </div>
        </div>

        {/* View Mode Switcher: Relational Network (Photo 1) vs 2D Force Constellation */}
        <div className="flex items-center bg-[#F2EBDD] p-1 rounded-xl border border-[#E4DCCB]">
          <button
            onClick={() => setViewMode("relational")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === "relational"
                ? "bg-[#202920] text-[#FAF7F0] shadow-xs"
                : "text-[#62685E] hover:text-[#202920]"
            }`}
          >
            <Network size={13} />
            Relational Knowledge Network (Ecosystem Drift)
          </button>
          <button
            onClick={() => setViewMode("constellation")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === "constellation"
                ? "bg-[#202920] text-[#FAF7F0] shadow-xs"
                : "text-[#62685E] hover:text-[#202920]"
            }`}
          >
            <Compass size={13} />
            Semantic Constellation (2D Force)
          </button>
        </div>

        {/* Global Action Tools */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#62685E]" size={14} />
            <input
              type="text"
              placeholder="Search concepts, authors, DOIs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-1.5 rounded-lg border border-[#E4DCCB] bg-white text-xs font-sans text-[#202920] focus:outline-none focus:border-[#3E6248] focus:ring-1 focus:ring-[#3E6248] w-64 shadow-xs"
            />
          </div>

          <button
            onClick={() => setHighlightBridgesOnly(!highlightBridgesOnly)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              highlightBridgesOnly
                ? "bg-[#D97706] text-white border-[#D97706]"
                : "bg-white text-[#202920] border-[#E4DCCB] hover:bg-[#FAF7F0]"
            }`}
          >
            <Zap size={13} />
            {highlightBridgesOnly ? "Showing Structural Holes" : "Filter Structural Holes"}
          </button>

          <Link
            href="/agent-reader"
            className="px-3.5 py-1.5 rounded-lg bg-[#3E6248] hover:bg-[#173F35] text-white text-xs font-mono font-medium flex items-center gap-1.5 transition-all shadow-xs"
          >
            <Sparkles size={13} />
            Synthesize Graph
          </Link>

          {/* Accessible Keyboard Traversal Badge */}
          <div className="hidden xl:flex items-center gap-1.5 text-[11px] font-mono text-[#62685E] bg-[#FAF7F0] px-2.5 py-1.5 rounded-lg border border-[#E4DCCB]">
            <span className="font-semibold text-[#202920]">Keys:</span>
            <span>[+][-] Zoom</span>
            <span>·</span>
            <span>[R] Reset</span>
            <span>·</span>
            <span>[Space] Cycle Node</span>
          </div>
        </div>

        {/* ARIA Live Region for Screen Readers */}
        <div aria-live="polite" role="status" className="sr-only">
          {canvasAnnouncement}
        </div>
      </div>

      {/* Main Workspace: Relational Network View vs Constellation Canvas */}
      {viewMode === "relational" ? (
        <div className="flex-1 min-h-0 p-3 md:p-4 bg-[#FAF7F0] overflow-hidden flex flex-col">
          <div className="w-full h-full max-w-[1520px] mx-auto bg-white rounded-2xl border border-[#E4DCCB] shadow-sm flex flex-col min-h-0 overflow-hidden p-2 md:p-3">
            <RelationalKnowledgeNetwork dark={false} />
          </div>
        </div>
      ) : (
        <div className="flex-1 flex min-h-0 relative">
          {/* Canvas Area */}
        <div className="flex-1 relative bg-[#FAF7F0] overflow-hidden flex flex-col">
          {/* Controls Overlay */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-[#E4DCCB] p-1.5 rounded-xl shadow-xs">
            {["All", "Neuro-Symbolic", "Structural Biology", "Genomic Foundation", "Quantum ML", "Structural Hole"].map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all cursor-pointer ${
                    activeCategory === cat
                      ? "bg-[#3E6248] text-white font-semibold shadow-xs"
                      : "text-[#62685E] hover:text-[#202920] hover:bg-[#FAF7F0]"
                  }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>

          {/* Floating Canvas Action Dock (Zoom/Physics) */}
          <div className="absolute bottom-4 left-4 z-10 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm border border-[#E4DCCB] p-1.5 rounded-xl shadow-xs">
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 2.0))}
              className="p-1.5 text-[#62685E] hover:text-[#202920] hover:bg-[#FAF7F0] rounded-lg transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn size={15} />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.6))}
              className="p-1.5 text-[#62685E] hover:text-[#202920] hover:bg-[#FAF7F0] rounded-lg transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut size={15} />
            </button>
            <div className="w-[1px] h-4 bg-[#E4DCCB]" />
            <button
              onClick={() => setIsPhysicsRunning(!isPhysicsRunning)}
              className="px-2 py-1 text-[11px] font-mono text-[#3E6248] hover:bg-[#DCE6D7]/40 rounded-lg transition-colors cursor-pointer"
            >
              {isPhysicsRunning ? "Pause Layout" : "Resume Layout"}
            </button>
          </div>

          {/* Interactive Graph Canvas */}
          <canvas
            ref={canvasRef}
            width={960}
            height={680}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="w-full h-full cursor-grab active:cursor-grabbing select-none"
          />

          {/* Bottom Legend */}
          <div className="px-6 py-2.5 border-t border-[#E4DCCB] bg-white/70 flex items-center justify-between text-xs text-[#62685E]">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3E6248]" /> Neuro-Symbolic AI
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#173F35]" /> Structural Biology
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#66866A]" /> Genomic Foundation
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" /> Structural Hole (High Centrality Gap)
              </span>
            </div>
            <div className="font-mono text-[11px]">
              Clustering Metric: Louvain Modularity Q=0.742 · 7 Clusters Identified
            </div>
          </div>
        </div>

        {/* Right Node Inspector Drawer */}
        <div className="w-96 border-l border-[#E4DCCB] bg-white flex flex-col shrink-0 overflow-y-auto">
          {selectedNode ? (
            <div className="p-6 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold"
                    style={{
                      backgroundColor: `${getCategoryColor(selectedNode.category)}18`,
                      color: getCategoryColor(selectedNode.category),
                    }}
                  >
                    {selectedNode.category}
                  </span>
                  <span className="text-xs font-mono text-[#62685E]">
                    Pub: {selectedNode.year}
                  </span>
                </div>
                <h2 className="font-serif text-xl font-normal text-[#202920] leading-snug">
                  {selectedNode.title}
                </h2>
                <p className="text-xs text-[#62685E] mt-2 font-mono">
                  {selectedNode.authors}
                </p>
                <div className="text-xs text-[#3E6248] font-mono font-medium mt-0.5">
                  {selectedNode.journal}
                </div>
              </div>

              {/* High Impact Alert if Structural Hole */}
              {selectedNode.isBridge && (
                <div className="p-3.5 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] space-y-1.5">
                  <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider">
                    <Zap size={14} className="text-[#D97706]" />
                    Thematic Interdisciplinary Bridge
                  </div>
                  <p className="text-xs leading-relaxed">
                    This node bridges structural biology and discrete logical deduction. Cross-citations indicate an accelerating emergence index (+142% year-over-year).
                  </p>
                </div>
              )}

              {/* Metric Ledger */}
              <div className="grid grid-cols-2 gap-3 py-2 border-y border-[#E4DCCB]">
                <div className="p-3 rounded-lg bg-[#FAF7F0] border border-[#E4DCCB]/60">
                  <div className="text-[11px] font-mono uppercase text-[#62685E]">
                    Citations
                  </div>
                  <div className="font-serif text-xl font-semibold text-[#202920] mt-0.5">
                    {selectedNode.citations.toLocaleString()}
                  </div>
                  <div className="text-[10px] font-mono text-[#3E6248]">
                    Top 1% Percentile
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#FAF7F0] border border-[#E4DCCB]/60">
                  <div className="text-[11px] font-mono uppercase text-[#62685E]">
                    Betweenness
                  </div>
                  <div className="font-serif text-xl font-semibold text-[#202920] mt-0.5">
                    0.884
                  </div>
                  <div className="text-[10px] font-mono text-[#3E6248]">
                    High Centrality
                  </div>
                </div>
              </div>

              {/* Abstract Summary */}
              <div>
                <h3 className="font-mono text-xs uppercase tracking-wider text-[#62685E] font-semibold mb-2">
                  Semantic Summary
                </h3>
                <p className="text-xs text-[#202920] font-sans leading-relaxed bg-[#FAF7F0] p-3.5 rounded-xl border border-[#E4DCCB]/80">
                  {selectedNode.abstract}
                </p>
              </div>

              {/* Connected Literature Nodes */}
              <div>
                <h3 className="font-mono text-xs uppercase tracking-wider text-[#62685E] font-semibold mb-2">
                  Immediate Graph Neighbors
                </h3>
                <div className="space-y-2">
                  {INITIAL_LINKS.filter(
                    (l) => l.source === selectedNode.id || l.target === selectedNode.id
                  ).map((link, idx) => {
                    const otherId =
                      link.source === selectedNode.id ? link.target : link.source;
                    const neighbor = nodes.find((n) => n.id === otherId);
                    if (!neighbor) return null;
                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedNode(neighbor)}
                        className="p-2.5 rounded-lg border border-[#E4DCCB] hover:border-[#3E6248] hover:bg-[#FAF7F0] transition-all cursor-pointer flex items-center justify-between group"
                      >
                        <div className="min-w-0 pr-2">
                          <div className="text-xs font-serif font-medium text-[#202920] truncate group-hover:text-[#3E6248]">
                            {neighbor.title}
                          </div>
                          <div className="text-[10px] font-mono text-[#62685E] flex items-center gap-2 mt-0.5">
                            <span>{link.type.replace("_", " ")}</span>
                            <span>·</span>
                            <span>{neighbor.citations} cites</span>
                          </div>
                        </div>
                        <ChevronRight size={14} className="text-[#62685E] shrink-0" />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <Link
                  href="/agent-reader"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#3E6248] hover:bg-[#173F35] text-white font-mono text-xs uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-2 shadow-xs"
                >
                  <Sparkles size={14} />
                  Open in Agentic Reader
                </Link>

                <button className="w-full py-2.5 px-4 rounded-xl bg-[#FAF7F0] hover:bg-[#E4DCCB] border border-[#E4DCCB] text-[#202920] font-mono text-xs uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer">
                  <Bookmark size={14} />
                  Pin to Active Grant Proposal
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center my-auto space-y-3">
              <Compass size={32} className="mx-auto text-[#62685E]/50" />
              <div className="font-serif text-lg text-[#202920]">
                Select a Literature Node
              </div>
              <p className="text-xs text-[#62685E] max-w-xs mx-auto">
                Click any node in the constellation canvas to inspect citation flows, structural betweenness centrality, and abstract extractions.
              </p>
            </div>
          )}
        </div>
      </div>
      )}
    </div>
  );
}
