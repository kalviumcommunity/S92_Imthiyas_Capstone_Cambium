"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Sparkles,
  Filter,
  Layers,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Pause,
  Play,
  RotateCcw,
  X,
  BookOpen,
  Award,
  FlaskConical,
  GraduationCap
} from "lucide-react";

export interface NetworkNode {
  id: string;
  x: number;
  y: number;
  type: "scholar" | "paper" | "grant" | "topic" | "lab" | "conf" | "dataset";
  label: string;
  sub: string;
  color: string;
  drift: string;
  isPrimary?: boolean;
  href?: string;
  abstract?: string;
  metrics?: string;
}

export const KNOWLEDGE_NODES: NetworkNode[] = [
  // Primary Center
  {
    id: "imthiyas",
    x: 480,
    y: 260,
    type: "scholar",
    label: "Imthiyas",
    sub: "Cambium Architect · AI & Res...",
    color: "#3E6248",
    drift: "animate-drift-1",
    isPrimary: true,
    href: "/portfolio",
    abstract: "Principal architect of Cambium Research Operating System. Advancing neuro-symbolic representation learning and epistemic citation synthesis.",
    metrics: "MIT CSAIL Postdoc · 24 Papers · h-index 18"
  },
  // Scholars
  {
    id: "aris",
    x: 645,
    y: 235,
    type: "scholar",
    label: "Prof. Aris Thorne",
    sub: "Stanford Bio-X · Bio-AI",
    color: "#66866A",
    drift: "animate-drift-2",
    href: "/portfolio",
    abstract: "Investigating foundation models for protein conformation manifolds and macro-molecular dynamics.",
    metrics: "Stanford University · 88 Papers · h-index 42"
  },
  {
    id: "elena",
    x: 295,
    y: 220,
    type: "scholar",
    label: "Elena Rostova",
    sub: "Cambridge · Graph ML",
    color: "#293E30",
    drift: "animate-drift-3",
    href: "/portfolio",
    abstract: "Specializing in geometric deep learning, cellular graph transformers, and topological representations.",
    metrics: "Cambridge · 19 Papers · h-index 15"
  },
  {
    id: "marcus",
    x: 650,
    y: 360,
    type: "scholar",
    label: "Marcus Vance",
    sub: "ETH Zürich · Foundation ML",
    color: "#3E6248",
    drift: "animate-drift-4",
    href: "/portfolio",
    abstract: "Researching scalable transformer memory architectures and sparse geometric neural structures.",
    metrics: "ETH Zürich · 31 Papers · h-index 22"
  },

  // Key Papers
  {
    id: "paper1",
    x: 315,
    y: 100,
    type: "paper",
    label: "Multimodal Foundations",
    sub: "Nature MI · 2026",
    color: "#293E30",
    drift: "animate-drift-2",
    href: "/agent-reader",
    abstract: "Unified transformer architecture bridging single-cell transcriptomics with multimodal clinical imaging.",
    metrics: "Citations: 1,420 · Nature MI · 2026"
  },
  {
    id: "paper2",
    x: 645,
    y: 100,
    type: "paper",
    label: "Cellular Topology GNN",
    sub: "Bioinformatics · 2025",
    color: "#293E30",
    drift: "animate-drift-1",
    href: "/agent-reader",
    abstract: "Higher-order message-passing schemes preserving non-Euclidean persistent homology in proteomics.",
    metrics: "Citations: 890 · Oxford Bioinformatics · 2025"
  },
  {
    id: "paper3",
    x: 820,
    y: 260,
    type: "paper",
    label: "Neural Graph Synthesis",
    sub: "NeurIPS Oral · 2026",
    color: "#293E30",
    drift: "animate-drift-3",
    href: "/agent-reader",
    abstract: "Generative graph diffusion for synthesizable small molecule discovery with zero chemical invalidity.",
    metrics: "NeurIPS 2026 Oral · Spotlight · Top 1.5%"
  },
  {
    id: "paper4",
    x: 135,
    y: 250,
    type: "paper",
    label: "Zero-Shot Proteomics",
    sub: "ICLR Spotlight · 2026",
    color: "#293E30",
    drift: "animate-drift-4",
    href: "/agent-reader",
    abstract: "Zero-shot inference over novel disordered protein structures without multimer pre-alignment.",
    metrics: "ICLR 2026 Spotlight · Citations: 430"
  },

  // Topics
  {
    id: "topic1",
    x: 480,
    y: 168,
    type: "topic",
    label: "Multimodal AI",
    sub: "Core Discipline",
    color: "#66866A",
    drift: "animate-drift-4",
    href: "/discover",
    abstract: "Interdisciplinary domain unifying generative vision, natural language, and biochemical structural graphs.",
    metrics: "Growth: +142% YoY · Active grants: $42M"
  },
  {
    id: "topic2",
    x: 740,
    y: 330,
    type: "topic",
    label: "Structural Proteomics",
    sub: "Cross-Domain Area",
    color: "#66866A",
    drift: "animate-drift-2",
    href: "/discover",
    abstract: "Deciphering 3D macromolecular complexes and functional binding sites via deep structural predictors.",
    metrics: "Growth: +98% YoY · Active labs: 124"
  },
  {
    id: "topic3",
    x: 220,
    y: 365,
    type: "topic",
    label: "Graph Transformers",
    sub: "Methodological Core",
    color: "#66866A",
    drift: "animate-drift-1",
    href: "/discover",
    abstract: "Attention mechanisms adapted to arbitrary relational topologies with structural and Laplacian positional encodings.",
    metrics: "Foundational ML Area · 2,400+ papers"
  },

  // Grants
  {
    id: "grant1",
    x: 135,
    y: 115,
    type: "grant",
    label: "NSF CAREER Award",
    sub: "$550,000 · 14d left",
    color: "#805B43",
    drift: "animate-drift-3",
    href: "/grants",
    abstract: "National Science Foundation Faculty Early Career Development Program in AI-assisted biological modeling.",
    metrics: "$550,000 Total · Closes Oct 18, 2026"
  },
  {
    id: "grant2",
    x: 820,
    y: 165,
    type: "grant",
    label: "NIH Innovator Grant",
    sub: "$1.25M · Open Stage",
    color: "#805B43",
    drift: "animate-drift-1",
    href: "/grants",
    abstract: "NIH Director's New Innovator Award (DP2) supporting exceptionally creative early-career investigators.",
    metrics: "$1,250,000 Direct · High Impact"
  },
  {
    id: "grant3",
    x: 460,
    y: 435,
    type: "grant",
    label: "Wellcome Discovery",
    sub: "£780k · Stage 2",
    color: "#805B43",
    drift: "animate-drift-4",
    href: "/grants",
    abstract: "Wellcome Trust funding bold and creative research to generate significant shifts in health sciences.",
    metrics: "£780,000 · European Collaborative"
  },

  // Labs
  {
    id: "lab1",
    x: 290,
    y: 320,
    type: "lab",
    label: "MIT CSAIL Lab",
    sub: "Institutional Node",
    color: "#365F8D",
    drift: "animate-drift-2",
    href: "/lab",
    abstract: "Computer Science and Artificial Intelligence Laboratory at MIT. Home to pioneers in generative models.",
    metrics: "Cambridge, MA · 45 Research Groups"
  },
  {
    id: "lab2",
    x: 520,
    y: 350,
    type: "lab",
    label: "Stanford Bio-X",
    sub: "Collaborative Center",
    color: "#365F8D",
    drift: "animate-drift-3",
    href: "/lab",
    abstract: "Pioneering interdisciplinary research hub connecting biosciences, engineering, and medicine at Stanford.",
    metrics: "Stanford, CA · 320 Affiliated PIs"
  },

  // Datasets
  {
    id: "dataset1",
    x: 810,
    y: 390,
    type: "dataset",
    label: "OpenCell Graph v2.4",
    sub: "1.4M Relations",
    color: "#B89A78",
    drift: "animate-drift-1",
    href: "/data-management",
    abstract: "Proteome-wide atlas of human protein localization and physical molecular interactions.",
    metrics: "Open Access · CC BY 4.0 · 1.4M Edges"
  },
  {
    id: "dataset2",
    x: 125,
    y: 375,
    type: "dataset",
    label: "BioSynthetica-40k",
    sub: "Open Benchmark",
    color: "#B89A78",
    drift: "animate-drift-3",
    href: "/data-management",
    abstract: "Curated dataset of 40,000 verified de novo macromolecular synthesis pathways.",
    metrics: "Open Benchmark · 40,000 Entries"
  },

  // Conferences
  {
    id: "conf1",
    x: 810,
    y: 75,
    type: "conf",
    label: "NeurIPS 2026",
    sub: "Vancouver · Dec 2026",
    color: "#202920",
    drift: "animate-drift-4",
    href: "/opportunities",
    abstract: "Conference on Neural Information Processing Systems. Flagship international venue for learning algorithms.",
    metrics: "Vancouver, Canada · Dec 2026"
  },
  {
    id: "conf2",
    x: 480,
    y: 65,
    type: "conf",
    label: "ICLR 2026",
    sub: "Vienna · May 2026",
    color: "#202920",
    drift: "animate-drift-2",
    href: "/opportunities",
    abstract: "International Conference on Learning Representations. Premier conference on deep representation learning.",
    metrics: "Vienna, Austria · May 2026"
  },
];

export const KNOWLEDGE_EDGES = [
  ["imthiyas", "paper1"],
  ["imthiyas", "paper2"],
  ["imthiyas", "topic1"],
  ["imthiyas", "lab1"],
  ["imthiyas", "lab2"],
  ["imthiyas", "grant1"],
  ["aris", "paper2"],
  ["aris", "grant2"],
  ["aris", "topic2"],
  ["aris", "lab2"],
  ["elena", "paper1"],
  ["elena", "paper3"],
  ["elena", "topic3"],
  ["elena", "dataset2"],
  ["marcus", "paper3"],
  ["marcus", "dataset1"],
  ["marcus", "lab2"],
  ["paper1", "conf2"],
  ["paper1", "topic1"],
  ["paper2", "conf1"],
  ["paper2", "topic2"],
  ["paper3", "conf1"],
  ["paper4", "topic3"],
  ["paper4", "grant1"],
  ["lab1", "grant1"],
  ["lab2", "grant3"],
  ["dataset1", "topic2"],
  ["dataset2", "topic3"],
];

interface RelationalKnowledgeNetworkProps {
  dark?: boolean;
  selectedCategory?: string;
  onCategoryChange?: (cat: string) => void;
  showControls?: boolean;
  interactiveLinks?: boolean;
}

export default function RelationalKnowledgeNetwork({
  dark = false,
  selectedCategory = "all",
  onCategoryChange,
  showControls = true,
  interactiveLinks = true,
}: RelationalKnowledgeNetworkProps) {
  const [internalCat, setInternalCat] = useState("all");
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [isMotionActive, setIsMotionActive] = useState<boolean>(false);
  const [zoomScale, setZoomScale] = useState<number>(1);

  const activeCategory = onCategoryChange ? selectedCategory : internalCat;
  const setCategory = onCategoryChange || setInternalCat;

  const getNode = (id: string) => KNOWLEDGE_NODES.find((n) => n.id === id)!;

  const isConnected = (id: string) => {
    const focusId = hoveredNode || selectedNode?.id;
    if (!focusId) return true;
    if (focusId === id) return true;
    return KNOWLEDGE_EDGES.some(
      ([a, b]) => (a === focusId && b === id) || (b === focusId && a === id)
    );
  };

  const isEdgeActive = (aId: string, bId: string) => {
    const focusId = hoveredNode || selectedNode?.id;
    if (!focusId) return false;
    return aId === focusId || bId === focusId;
  };

  const matchesCategory = (type: string) => {
    if (!activeCategory || activeCategory === "all") return true;
    if (activeCategory === "scholar") return type === "scholar";
    if (activeCategory === "paper") return type === "paper";
    if (activeCategory === "grant") return type === "grant";
    if (activeCategory === "topic") return type === "topic";
    if (activeCategory === "lab") return type === "lab";
    if (activeCategory === "dataset") return type === "dataset";
    if (activeCategory === "conf") return type === "conf";
    return true;
  };

  const activeHoveredNodeData = hoveredNode ? getNode(hoveredNode) : selectedNode;

  return (
    <div className="relative w-full h-full select-none flex flex-col justify-between overflow-hidden">
      {/* Top Controller Bar */}
      {showControls && (
        <div className="flex flex-wrap items-center justify-between pb-3.5 mb-2 border-b border-[#E4DCCB] gap-2.5 px-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3E6248] animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-wider text-[#202920] font-bold">
              RELATIONAL KNOWLEDGE NETWORK · LIVE GRAPH
            </span>
          </div>

          {/* Category Filter Pills with Item Counts */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { id: "all", label: "All (20)" },
              { id: "scholar", label: "Scholars" },
              { id: "paper", label: "Papers" },
              { id: "grant", label: "Grants" },
              { id: "topic", label: "Topics" },
              { id: "lab", label: "Labs" },
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setCategory(id)}
                className={`text-[11px] font-mono px-3 py-1 rounded-full border transition-all cursor-pointer ${
                  activeCategory === id
                    ? "bg-[#202920] text-[#FAF7F0] border-[#202920] font-semibold shadow-xs"
                    : "bg-[#FAF7F0] text-[#62685E] border-[#E4DCCB] hover:border-[#3E6248] hover:text-[#202920]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Action Dock (Zoom / Motion / Reset) */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#FAF7F0] border border-[#E4DCCB] rounded-lg p-0.5 shadow-2xs">
              <button
                onClick={() => setZoomScale(z => Math.max(z - 0.15, 0.75))}
                className="p-1.5 text-[#62685E] hover:text-[#202920] rounded hover:bg-white transition-colors cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut size={13} />
              </button>
              <button
                onClick={() => setZoomScale(1)}
                className="px-2 py-1 text-[10px] font-mono font-medium text-[#62685E] hover:text-[#202920] rounded hover:bg-white transition-colors cursor-pointer"
                title="Reset Zoom"
              >
                {Math.round(zoomScale * 100)}%
              </button>
              <button
                onClick={() => setZoomScale(z => Math.min(z + 0.15, 1.45))}
                className="p-1.5 text-[#62685E] hover:text-[#202920] rounded hover:bg-white transition-colors cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn size={13} />
              </button>
            </div>

            <button
              onClick={() => setIsMotionActive(!isMotionActive)}
              className={`px-2.5 py-1 text-[11px] font-mono rounded-lg border flex items-center gap-1.5 transition-colors cursor-pointer ${
                isMotionActive
                  ? "bg-[#DCE6D7] text-[#3E6248] border-[#3E6248]/30 font-semibold"
                  : "bg-white text-[#62685E] border-[#E4DCCB] hover:text-[#202920]"
              }`}
              title="Toggle Live Neural Drift Animation"
            >
              {isMotionActive ? <Pause size={12} /> : <Play size={12} />}
              <span>{isMotionActive ? "Motion On" : "Fixed View"}</span>
            </button>
          </div>
        </div>
      )}

      {/* SVG Canvas Container — Locked in Viewport Height, No Overflow */}
      <div className="relative w-full flex-1 min-h-0 overflow-hidden flex items-center justify-center bg-[#FAF7F0]/40 rounded-xl">
        <svg
          viewBox="0 0 960 520"
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-full max-h-full overflow-hidden"
          aria-label="Interactive research knowledge network graph"
          style={{
            transform: `scale(${zoomScale})`,
            transformOrigin: "center center",
            transition: "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          onClick={(e) => {
            // Deselect on canvas backdrop click
            if ((e.target as HTMLElement).tagName === 'svg' || (e.target as HTMLElement).tagName === 'rect') {
              setSelectedNode(null);
            }
          }}
        >
          <defs>
            <pattern id="rknGrid2" width="28" height="28" patternUnits="userSpaceOnUse">
              <path
                d="M 28 0 L 0 0 0 28"
                fill="none"
                stroke={dark ? "rgba(46,125,79,0.12)" : "rgba(32,41,32,0.05)"}
                strokeWidth="0.6"
              />
            </pattern>
          </defs>
          <rect width="960" height="520" fill="url(#rknGrid2)" />

          {/* Knowledge Edges */}
          {KNOWLEDGE_EDGES.map(([aId, bId], i) => {
            const a = getNode(aId);
            const b = getNode(bId);
            if (!a || !b) return null;
            const active = isEdgeActive(aId, bId);

            return (
              <line
                key={i}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={active ? "#3E6248" : dark ? "rgba(102,134,106,0.3)" : "rgba(32,41,32,0.14)"}
                strokeWidth={active ? 2.5 : 1.2}
                strokeDasharray={active ? "none" : "3,3"}
                style={{ transition: "stroke 0.2s, stroke-width 0.2s" }}
              />
            );
          })}

          {/* Knowledge Nodes */}
          {KNOWLEDGE_NODES.map((node) => {
            const isCenter = node.isPrimary;
            const w = isCenter ? 144 : 128;
            const h = isCenter ? 46 : 38;
            const connected = isConnected(node.id);
            const isHovered = hoveredNode === node.id;
            const isSelected = selectedNode?.id === node.id;
            const catMatches = matchesCategory(node.type);

            const opacity = catMatches ? (connected ? 1 : 0.22) : 0.12;
            const scale = isHovered || isSelected ? 1.05 : isCenter ? 1.02 : 1;

            return (
              <g
                key={node.id}
                className={isMotionActive ? node.drift : ""}
                style={{
                  transition: "opacity 0.25s, transform 0.25s",
                  opacity,
                  cursor: "pointer",
                }}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedNode(selectedNode?.id === node.id ? null : node);
                }}
              >
                {/* Aura ring for focus */}
                {(isCenter || isHovered || isSelected) && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isHovered || isSelected ? 24 : 16}
                    fill={node.color}
                    opacity={isHovered || isSelected ? 0.2 : 0.1}
                  />
                )}

                {/* Pivot anchor point */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isHovered || isSelected ? 5 : isCenter ? 4.5 : 3}
                  fill={node.color}
                  opacity={0.95}
                  stroke="#FFFFFF"
                  strokeWidth={isHovered || isSelected ? 1.8 : 1}
                />

                {/* Node Card Container via foreignObject */}
                <foreignObject
                  x={node.x - w / 2}
                  y={node.y - h - 7}
                  width={w}
                  height={h}
                  style={{ overflow: "visible" }}
                >
                  <div
                    style={{
                      background: isHovered || isSelected ? "#FFFFFF" : dark ? "#1E2522" : "#FFFFFF",
                      borderLeft: `1px solid ${isHovered || isSelected ? node.color : "#E4DCCB"}`,
                      borderRight: `1px solid ${isHovered || isSelected ? node.color : "#E4DCCB"}`,
                      borderBottom: `1px solid ${isHovered || isSelected ? node.color : "#E4DCCB"}`,
                      borderTop: `2.5px solid ${node.color}`,
                      borderRadius: 8,
                      padding: "5px 8px",
                      boxShadow: isHovered || isSelected
                        ? `0 0 0 2px ${node.color}33, 0 6px 20px rgba(12,30,21,0.12)`
                        : isCenter
                        ? `0 0 0 1px ${node.color}22, 0 3px 12px rgba(12,30,21,0.06)`
                        : "0 1px 4px rgba(0,0,0,0.04)",
                      transform: `scale(${scale})`,
                      transformOrigin: "center bottom",
                      transition: "all 0.18s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: isCenter ? 11.5 : 10.5,
                        fontWeight: isHovered || isSelected ? 700 : 600,
                        color: "#202920",
                        letterSpacing: "-0.01em",
                        lineHeight: 1.2,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {node.label}
                    </div>
                    <div
                      style={{
                        fontSize: 8.5,
                        color: isHovered || isSelected ? node.color : "#85877B",
                        marginTop: 1.5,
                        fontWeight: 500,
                        letterSpacing: "0.01em",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {node.sub}
                    </div>
                  </div>
                </foreignObject>
              </g>
            );
          })}
        </svg>

        {/* Selected Node Detailed Slide-in Drawer */}
        {selectedNode && (
          <div className="absolute top-4 right-4 z-20 w-80 bg-white border border-[#E4DCCB] rounded-2xl p-5 shadow-xl text-xs space-y-3.5 backdrop-blur-md">
            <div className="flex items-center justify-between pb-2.5 border-b border-[#FAF7F0]">
              <span
                className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider"
                style={{
                  backgroundColor: `${selectedNode.color}18`,
                  color: selectedNode.color,
                }}
              >
                {selectedNode.type}
              </span>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-[#85877B] hover:text-[#202920] p-1 rounded-md hover:bg-[#FAF7F0] transition-colors cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            <div>
              <h3 className="text-base font-serif font-semibold text-[#202920] leading-snug">
                {selectedNode.label}
              </h3>
              <p className="text-xs text-[#3E6248] font-mono mt-0.5 font-medium">
                {selectedNode.sub}
              </p>
            </div>

            {selectedNode.abstract && (
              <p className="text-xs text-[#62685E] leading-relaxed">
                {selectedNode.abstract}
              </p>
            )}

            {selectedNode.metrics && (
              <div className="p-2.5 rounded-lg bg-[#FAF7F0] border border-[#E4DCCB] text-[11px] font-mono text-[#202920]">
                {selectedNode.metrics}
              </div>
            )}

            {selectedNode.href && (
              <Link
                href={selectedNode.href}
                className="inline-flex items-center justify-center gap-1.5 w-full py-2 bg-[#202920] hover:bg-[#3E6248] text-[#FAF7F0] rounded-xl font-sans font-semibold text-xs transition-colors no-underline"
              >
                <span>Explore Research Vectors</span>
                <ArrowUpRight size={13} />
              </Link>
            )}
          </div>
        )}

        {/* Hover Inspector HUD (when no node is selected) */}
        {!selectedNode && activeHoveredNodeData && (
          <div className="absolute bottom-3 left-3 bg-[#202920]/95 backdrop-blur-md text-[#FAF7F0] border border-[#3E6248] px-3.5 py-2.5 rounded-xl shadow-lg text-xs flex items-center gap-3 transition-all z-10">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: activeHoveredNodeData.color }} />
            <div>
              <div className="font-semibold text-white tracking-tight">{activeHoveredNodeData.label}</div>
              <div className="text-[10px] text-[#AEC2B4]">
                {activeHoveredNodeData.sub} · {activeHoveredNodeData.type.toUpperCase()}
              </div>
            </div>
            {interactiveLinks && activeHoveredNodeData.href && (
              <Link
                href={activeHoveredNodeData.href}
                className="text-[10px] text-[#DBEDE2] bg-[#3E6248] hover:bg-[#173F35] px-2.5 py-1 rounded font-mono flex items-center gap-1 transition-colors no-underline ml-2"
              >
                Inspect <ArrowUpRight size={11} />
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Bottom Category Legend & Network Status */}
      <div className="pt-2.5 px-3 border-t border-[#E4DCCB] flex flex-wrap items-center justify-between gap-3 text-[11px] font-sans text-[#62685E] shrink-0">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-[#3E6248]" /> Scholars
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-[#293E30]" /> Papers
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-[#805B43]" /> Grants
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-[#66866A]" /> Topics
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-[#365F8D]" /> Labs
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-[#B89A78]" /> Datasets
          </span>
        </div>
        <div className="font-mono text-[10.5px] text-[#85877B]">
          Louvain Modularity Q=0.742 · 20 Nodes · 28 Epistemic Links · Synchronized
        </div>
      </div>
    </div>
  );
}
