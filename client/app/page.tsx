"use client";

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import CambiumLogo from '@/components/CambiumLogo'
import { ArrowUpRight, User, AlertCircle, Sparkles } from 'lucide-react'
import { CambiumIntroPreloader } from '@/components/landing/CambiumIntroPreloader'

// ─── Design System Tokens (Cambium Master Living Materials System) ────────────
const C = {
  // Master Four Living Materials
  mineralSand: '#F2EBDD',  // The warm paper foundation
  livingAlgae: '#66866A',  // Life, discovery, verified activity
  rootwood: '#805B43',     // Research heritage, provenance, depth
  forestInk: '#202920',    // Authoritative ink for headings & navigation

  // Extended Color System
  parchment: '#FAF7F0',    // Primary canvas
  limestone: '#E4DCCB',    // Subtle surface & dividers
  sageMist: '#DCE6D7',     // Selected states & quiet highlights
  canopy: '#3E6248',       // Primary action & strong accent
  deepMoss: '#293E30',     // Dark botanical surface
  loam: '#B89A78',         // Charts & supporting detail
  barkGrey: '#62685E',     // Secondary text
  quietStone: '#85877B',   // Tertiary metadata

  // Semantic Status Tokens
  statusSuccess: '#326B49',
  statusWarning: '#8A5A12',
  statusError: '#B33D35',
  statusInfo: '#365F8D',
  statusNeutral: '#62685E',

  // System Role Aliases
  bg: '#FAF7F0',           // Parchment primary canvas
  surfaceRaised: '#FFFFFF',
  surfaceSunken: '#F2EBDD', // Mineral Sand warm section background
  surface2: '#E4DCCB',     // Limestone subtle surface
  charcoal: '#202920',     // Forest Ink primary text
  secondary: '#62685E',    // Bark Grey secondary text
  tertiary: '#85877B',     // Quiet Stone metadata
  rule: '#E4DCCB',         // Limestone dividers & hairline
  borderStrong: '#66866A', // Living Algae brand accent
  moss: '#3E6248',         // Canopy primary action
  moss500: '#66866A',      // Living Algae
  mossLight: '#DCE6D7',    // Sage Mist highlight
  moss050: '#F2EBDD',      // Mineral Sand tint
  mossMid: '#3E6248',      // Canopy
  mossHover: '#293E30',    // Deep Moss
  darkBg: '#293E30',       // Deep Moss dark botanical surface
  darkSurface: '#202920',  // Forest Ink dark surface
  darkBorder: '#3E6248',   // Canopy dark border
  crimson: '#B33D35',      // Status Error
}

// ─── Navigation (Mathematically Aligned Optical Grid) ─────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header className="w-full border-b border-[#E4DCCB] bg-[#FAF7F0]/90 backdrop-blur-md sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand Architecture */}
        <CambiumLogo size="md" href="/" />

        {/* Core Navigation - Balanced Optical Centering */}
        <nav className="hidden md:flex items-center gap-8">
          {[
            { label: 'Discover', href: '#discover' },
            { label: 'Community', href: '#community' },
            { label: 'Opportunity', href: '#opportunities' },
            { label: 'Research', href: '#research' },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="font-sans text-[14px] font-[450] text-[#62685E] hover:text-[#202920] tracking-[-0.01em] transition-colors duration-200 relative after:absolute after:bottom-[-29px] after:left-0 after:w-full after:h-[2px] after:bg-[#3E6248] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 no-underline"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Action Threshold */}
        <div className="hidden md:flex items-center gap-5">
          <Link 
            href="/sign-in" 
            className="font-sans text-[14px] font-medium text-[#62685E] hover:text-[#202920] transition-colors no-underline"
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="bg-[#3E6248] hover:bg-[#293E30] text-[#FAF7F0] px-5 py-2.5 rounded-full font-sans text-xs font-semibold tracking-wide uppercase shadow-sm shadow-[#3E6248]/20 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 inline-block text-center no-underline border border-[#66866A]/30"
          >
            Create Identity
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-[#202920] bg-transparent border-0 cursor-pointer"
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="3" y1="7" x2="21" y2="7" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="17" x2="21" y2="17" />
          </svg>
        </button>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="md:hidden border-t border-[#E4DCCB] bg-[#FAF7F0] px-6 py-6 space-y-4">
          {['Discover', 'Community', 'Opportunity', 'Research'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              onClick={() => setMenuOpen(false)}
              className="block text-[15px] font-medium text-[#62685E] hover:text-[#202920] no-underline"
            >
              {item}
            </a>
          ))}
          <div className="pt-4 border-t border-[#E4DCCB] flex flex-col gap-3">
            <Link href="/sign-in" className="text-sm font-medium text-[#202920] no-underline">Sign in</Link>
            <Link href="/sign-up" className="bg-[#3E6248] text-[#FAF7F0] px-4 py-2.5 rounded-full text-xs font-semibold text-center uppercase no-underline">Create Identity</Link>
          </div>
        </div>
      )}
    </header>
  )
}

// ─── Hero Ecosystem Graph (Living Interactive Network) ─────────────────────────
function EcosystemGraph({ dark = false, selectedCategory = 'all' }: { dark?: boolean; selectedCategory?: string }) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)

  const nodes = [
    { id: 'imthiyas', x: 380, y: 250, type: 'scholar', label: 'Imthiyas', sub: 'Cambium Architect · AI & Research Systems', color: '#3E6248', drift: 'animate-drift-1', isPrimary: true },
    { id: 'aris',     x: 530, y: 195, type: 'scholar', label: 'Prof. Aris Thorne', sub: 'Stanford Bio-X · Bio-AI', color: '#66866A', drift: 'animate-drift-2' },
    { id: 'elena',    x: 195, y: 175, type: 'scholar', label: 'Elena Rostova', sub: 'Cambridge · Graph ML', color: '#293E30', drift: 'animate-drift-3' },
    { id: 'marcus',   x: 515, y: 385, type: 'scholar', label: 'Marcus Vance', sub: 'ETH Zürich · Foundation ML', color: '#3E6248', drift: 'animate-drift-4' },
    
    { id: 'paper1',   x: 235, y: 80,  type: 'paper',   label: 'Multimodal Foundations', sub: 'Nature MI · 2026', color: '#293E30', drift: 'animate-drift-2' },
    { id: 'paper2',   x: 535, y: 80,  type: 'paper',   label: 'Cellular Topology GNN', sub: 'Bioinformatics · 2025', color: '#293E30', drift: 'animate-drift-1' },
    { id: 'paper3',   x: 660, y: 280, type: 'paper',   label: 'Neural Graph Synthesis', sub: 'NeurIPS Oral · 2026', color: '#293E30', drift: 'animate-drift-3' },
    { id: 'paper4',   x: 100, y: 260, type: 'paper',   label: 'Zero-Shot Proteomics', sub: 'ICLR Spotlight · 2026', color: '#293E30', drift: 'animate-drift-4' },

    { id: 'topic1',   x: 380, y: 155, type: 'topic',   label: 'Multimodal AI', sub: 'Core Discipline', color: '#66866A', drift: 'animate-drift-4' },
    { id: 'topic2',   x: 585, y: 450, type: 'topic',   label: 'Structural Proteomics', sub: 'Cross-Domain Area', color: '#66866A', drift: 'animate-drift-2' },
    { id: 'topic3',   x: 190, y: 440, type: 'topic',   label: 'Graph Transformers', sub: 'Methodological Core', color: '#66866A', drift: 'animate-drift-1' },

    { id: 'grant1',   x: 95,  y: 95,  type: 'grant',   label: 'NSF CAREER Award', sub: '$550,000 · 14d left', color: '#805B43', drift: 'animate-drift-3' },
    { id: 'grant2',   x: 670, y: 175, type: 'grant',   label: 'NIH Innovator Grant', sub: '$1.25M · Open Stage', color: '#805B43', drift: 'animate-drift-1' },
    { id: 'grant3',   x: 350, y: 445, type: 'grant',   label: 'Wellcome Discovery', sub: '£780k · Stage 2', color: '#805B43', drift: 'animate-drift-4' },

    { id: 'lab1',     x: 220, y: 320, type: 'lab',     label: 'MIT CSAIL Lab', sub: 'Institutional Node', color: '#365F8D', drift: 'animate-drift-2' },
    { id: 'lab2',     x: 425, y: 330, type: 'lab',     label: 'Stanford Bio-X', sub: 'Collaborative Center', color: '#365F8D', drift: 'animate-drift-3' },

    { id: 'dataset1', x: 660, y: 380, type: 'dataset', label: 'OpenCell Graph v2.4', sub: '1.4M Relations', color: '#B89A78', drift: 'animate-drift-1' },
    { id: 'dataset2', x: 80,  y: 380, type: 'dataset', label: 'BioSynthetica-40k', sub: 'Open Benchmark', color: '#B89A78', drift: 'animate-drift-3' },

    { id: 'conf1',    x: 675, y: 70,  type: 'conf',    label: 'NeurIPS 2026', sub: 'Vancouver · Dec 2026', color: '#202920', drift: 'animate-drift-4' },
    { id: 'conf2',    x: 380, y: 70,  type: 'conf',    label: 'ICLR 2026', sub: 'Vienna · May 2026', color: '#202920', drift: 'animate-drift-2' },
  ]

  const edges = [
    ['imthiyas', 'paper1'],
    ['imthiyas', 'paper2'],
    ['imthiyas', 'topic1'],
    ['imthiyas', 'lab1'],
    ['imthiyas', 'lab2'],
    ['imthiyas', 'grant1'],
    ['aris', 'paper2'],
    ['aris', 'grant2'],
    ['aris', 'topic2'],
    ['aris', 'lab2'],
    ['elena', 'paper1'],
    ['elena', 'paper3'],
    ['elena', 'topic3'],
    ['elena', 'dataset2'],
    ['marcus', 'paper3'],
    ['marcus', 'dataset1'],
    ['marcus', 'lab2'],
    ['paper1', 'conf2'],
    ['paper1', 'topic1'],
    ['paper2', 'conf1'],
    ['paper2', 'topic2'],
    ['paper3', 'conf1'],
    ['paper4', 'topic3'],
    ['paper4', 'grant1'],
    ['lab1', 'grant1'],
    ['lab2', 'grant3'],
    ['dataset1', 'topic2'],
    ['dataset2', 'topic3'],
  ]

  const getNode = (id: string) => nodes.find((n) => n.id === id)!

  const isConnected = (id: string) => {
    if (!hoveredNode) return true
    if (hoveredNode === id) return true
    return edges.some(([a, b]) => (a === hoveredNode && b === id) || (b === hoveredNode && a === id))
  }

  const isEdgeActive = (aId: string, bId: string) => {
    if (!hoveredNode) return false
    return aId === hoveredNode || bId === hoveredNode
  }

  const matchesCategory = (type: string) => {
    if (!selectedCategory || selectedCategory === 'all') return true
    return type === selectedCategory
  }

  const activeHoveredNodeData = hoveredNode ? getNode(hoveredNode) : null

  const textColor = dark ? 'rgba(250,249,246,0.95)' : C.charcoal
  const subColor = dark ? 'rgba(250,249,246,0.55)' : C.secondary
  const cardBg = dark ? C.darkSurface : '#FFFFFF'
  const cardBorder = dark ? C.darkBorder : C.rule

  return (
    <div className="relative w-full h-full select-none">
      <svg
        viewBox="0 0 780 500"
        style={{ width: '100%', height: '100%', overflow: 'visible' }}
        aria-label="Interactive research knowledge network showing animated connected nodes"
      >
        {/* Subtle organic botanical grid */}
        <defs>
          <pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M 28 0 L 0 0 0 28" fill="none" stroke={dark ? 'rgba(46,125,79,0.08)' : 'rgba(26,77,56,0.04)'} strokeWidth="0.6" />
          </pattern>
          <filter id="glowGreen" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <rect width="780" height="500" fill="url(#grid)" />

        {/* Dynamic Connection lines */}
        {edges.map(([aId, bId], i) => {
          const a = getNode(aId)
          const b = getNode(bId)
          if (!a || !b) return null

          const active = isEdgeActive(aId, bId)
          const visible = matchesCategory(a.type) || matchesCategory(b.type)
          const strokeColor = active 
            ? '#10B981' 
            : dark 
              ? 'rgba(46,125,79,0.25)' 
              : 'rgba(26,77,56,0.14)'
          const strokeWidth = active ? 2.4 : 1.2

          return (
            <g key={i}>
              <line
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeDasharray={active ? 'none' : '4 4'}
                style={{
                  transition: 'stroke 0.25s, stroke-width 0.25s, opacity 0.25s',
                  opacity: visible ? (hoveredNode ? (active ? 1 : 0.15) : 0.85) : 0.08,
                }}
              />
              {/* Traveling biological pulse particle on active or key highways */}
              {(active || i % 4 === 0) && (
                <circle r={active ? 2.8 : 2} fill={active ? '#10B981' : '#2ECC71'} opacity={active ? 0.95 : 0.45}>
                  <animateMotion
                    path={`M ${a.x} ${a.y} L ${b.x} ${b.y}`}
                    dur={`${2.8 + (i % 3) * 1.1}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              )}
            </g>
          )
        })}

        {/* Nodes with Organic Drifting Animation */}
        {nodes.map((node) => {
          const isCenter = node.isPrimary
          const w = isCenter ? 156 : 138
          const h = isCenter ? 54 : 46
          const connected = isConnected(node.id)
          const isHovered = hoveredNode === node.id
          const catMatches = matchesCategory(node.type)

          const opacity = catMatches ? (connected ? 1 : 0.25) : 0.15
          const scale = isHovered ? 1.08 : (isCenter ? 1.03 : 1)

          return (
            <g
              key={node.id}
              className={node.drift}
              style={{
                transition: 'opacity 0.25s, transform 0.25s',
                opacity,
                cursor: 'pointer',
              }}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              {/* Pulsing glow aura on central/hovered nodes */}
              {(isCenter || isHovered) && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isHovered ? 26 : 18}
                  fill={node.color}
                  opacity={isHovered ? 0.2 : 0.1}
                  className="animate-pulse-glow"
                />
              )}

              {/* Node pivot dot */}
              <circle
                cx={node.x}
                cy={node.y}
                r={isHovered ? 5.5 : (isCenter ? 4.5 : 3.2)}
                fill={node.color}
                opacity={0.95}
                stroke="#FFFFFF"
                strokeWidth={isHovered ? 1.8 : 1}
              />

              {/* Interactive Card */}
              <foreignObject
                x={node.x - w / 2}
                y={node.y - h - 8}
                width={w}
                height={h}
                style={{ overflow: 'visible' }}
              >
                <div
                  style={{
                    background: isHovered ? '#FFFFFF' : cardBg,
                    border: `1px solid ${isHovered ? node.color : (isCenter ? node.color + '88' : cardBorder)}`,
                    borderRadius: 7,
                    padding: '6px 10px',
                    boxShadow: isHovered
                      ? `0 0 0 2px ${node.color}33, 0 8px 24px rgba(12,30,21,0.14)`
                      : isCenter
                        ? `0 0 0 1px ${node.color}22, 0 4px 16px rgba(12,30,21,0.08)`
                        : '0 2px 8px rgba(12,30,21,0.04)',
                    fontFamily: 'var(--font-sans), sans-serif',
                    transform: `scale(${scale})`,
                    transformOrigin: 'center bottom',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    borderTop: `2.5px solid ${node.color}`,
                  }}
                >
                  <div style={{
                    fontSize: isCenter ? 11.5 : 10.5,
                    fontWeight: isHovered ? 700 : 600,
                    color: isHovered ? '#0C1E15' : textColor,
                    letterSpacing: '-0.01em',
                    lineHeight: 1.25,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {node.label}
                  </div>
                  <div style={{
                    fontSize: 9,
                    color: isHovered ? node.color : subColor,
                    marginTop: 2,
                    fontWeight: isHovered ? 500 : 400,
                    letterSpacing: '0.01em',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {node.sub}
                  </div>
                </div>
              </foreignObject>
            </g>
          )
        })}
      </svg>

      {/* Floating HUD Inspector Badge when inspecting a node */}
      {activeHoveredNodeData && (
        <div className="absolute bottom-3 left-3 bg-[#0C1E15]/95 backdrop-blur-md text-[#F9F6F0] border border-[#1A4D38] px-3.5 py-2.5 rounded-lg shadow-xl text-xs flex items-center gap-3 pointer-events-none transition-all duration-200">
          <span className="w-2 h-2 rounded-full" style={{ background: activeHoveredNodeData.color }} />
          <div>
            <div className="font-semibold text-white tracking-tight">{activeHoveredNodeData.label}</div>
            <div className="text-[10px] text-[#AEC2B4]">{activeHoveredNodeData.sub} · {activeHoveredNodeData.type.toUpperCase()}</div>
          </div>
          <div className="text-[10px] text-[#DBEDE2] bg-[#1A4D38] px-2 py-0.5 rounded font-mono">
            Connected: {edges.filter(([a, b]) => a === activeHoveredNodeData.id || b === activeHoveredNodeData.id).length} edges
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Editorial Hero Section (Pure First Viewport Experience) ─────────────────
function Hero() {
  return (
    <section className="w-full bg-[#FAF7F0] min-h-[calc(100vh-80px)] flex flex-col justify-between pt-8 md:pt-14 pb-8 md:pb-10 px-6 relative overflow-hidden border-b border-[#E4DCCB]">
      {/* Subtle organic radial glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_75%_35%,rgba(62,98,72,0.06)_0%,transparent_65%)]" />

      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col justify-center">
        {/* Asymmetric 7/5 Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start my-auto">
          {/* Left Column: Semantic Typographic Statement (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#E4DCCB] bg-[#F2EBDD] mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3E6248] animate-pulse" />
              <span className="font-sans text-[11px] font-semibold tracking-wider text-[#3E6248] uppercase">
                The Research Operating System
              </span>
            </div>

            <h1 className="font-serif text-[clamp(2.75rem,5.6vw,4.75rem)] text-[#202920] font-normal leading-[1.08] tracking-tight mb-8">
              Your research <br />
              <span className="italic text-[#3E6248]">world, connected.</span>
            </h1>

            {/* Three Pillar Metadata Anchors */}
            <div className="flex items-center gap-8 pt-4 border-t border-[#E4DCCB] w-full max-w-lg">
              {[
                ['Academic', 'Identity'],
                ['Research', 'Workspace'],
                ['Intelligent', 'Discovery'],
              ].map(([sub, label]) => (
                <div key={label}>
                  <div className="font-sans text-xs uppercase tracking-wider text-[#62685E] font-medium">{sub}</div>
                  <div className="font-serif text-base font-semibold text-[#202920] mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Narrative Context & Actions (5 Cols) */}
          <div className="lg:col-span-5 lg:pt-8 flex flex-col items-start gap-8">
            <p className="font-sans text-[17px] md:text-[19px] font-normal text-[#62685E] leading-[1.62] tracking-normal">
              Discover ideas, build your academic identity, collaborate with researchers, explore opportunities, and organize the knowledge behind your work — all in one living research environment.
            </p>

            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <Link
                href="/sign-up"
                className="w-full sm:w-auto bg-[#3E6248] hover:bg-[#293E30] text-[#FAF7F0] px-8 py-4 rounded-xl font-sans text-sm font-semibold tracking-tight transition-all shadow-md shadow-[#3E6248]/25 hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2 group no-underline border border-[#66866A]/40"
              >
                <span>Get started — it's free</span>
                <ArrowUpRight className="w-4 h-4 text-[#FAF7F0]/80 group-hover:text-[#FAF7F0] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
              <a
                href="#knowledge-network"
                className="w-full sm:w-auto border border-[#E4DCCB] hover:border-[#3E6248] text-[#202920] hover:bg-[#F2EBDD] px-8 py-4 rounded-xl font-sans text-sm font-medium transition-colors bg-[#FAF7F0] flex items-center justify-center no-underline"
              >
                Explore Cambium
              </a>
            </div>
          </div>
        </div>

        {/* Scholarly Verification Ledger Strip (Stripe Press / Nature grade evidence metrics) */}
        <div className="mt-10 lg:mt-12 pt-6 border-t border-[#E4DCCB] grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
          <div>
            <div className="font-serif text-2xl md:text-3xl font-normal text-[#202920]">120M+</div>
            <div className="font-sans text-xs uppercase tracking-wider text-[#3E6248] font-semibold mt-1">Indexed Publications</div>
            <div className="font-mono text-[11px] text-[#85877B] mt-0.5">Crossref · PubMed · arXiv</div>
          </div>
          <div>
            <div className="font-serif text-2xl md:text-3xl font-normal text-[#202920]">85,000+</div>
            <div className="font-sans text-xs uppercase tracking-wider text-[#3E6248] font-semibold mt-1">Active Opportunities</div>
            <div className="font-mono text-[11px] text-[#85877B] mt-0.5">NSF · NIH · ERC Grants</div>
          </div>
          <div>
            <div className="font-serif text-2xl md:text-3xl font-normal text-[#202920]">4.8M</div>
            <div className="font-sans text-xs uppercase tracking-wider text-[#3E6248] font-semibold mt-1">Verified Researchers</div>
            <div className="font-mono text-[11px] text-[#85877B] mt-0.5">ORCID Anchor · Cryptographic</div>
          </div>
          <div>
            <div className="font-serif text-2xl md:text-3xl font-normal text-[#202920]">100%</div>
            <div className="font-sans text-xs uppercase tracking-wider text-[#3E6248] font-semibold mt-1">Evidence-Linked</div>
            <div className="font-mono text-[11px] text-[#85877B] mt-0.5">Inspectable Citations & DOIs</div>
          </div>
        </div>

        {/* Scroll invitation to living knowledge network */}
        <div className="mt-6 pt-4 flex items-center justify-between border-t border-[#E4DCCB]/60">
          <a
            href="#knowledge-network"
            className="inline-flex items-center gap-2 font-mono text-xs text-[#62685E] hover:text-[#3E6248] transition-colors no-underline group cursor-pointer"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#66866A] group-hover:scale-125 transition-transform" />
            <span>Explore Relational Knowledge Network</span>
            <span className="group-hover:translate-y-0.5 transition-transform">↓</span>
          </a>

        </div>
      </div>
    </section>
  )
}

// ─── Living Knowledge Network Section (Dedicated Full Showcase) ──────────────
function KnowledgeGraphSection() {
  const [graphCategory, setGraphCategory] = useState('all')

  return (
    <section id="knowledge-network" style={{ background: C.darkBg, borderTop: '1px solid rgba(46,125,79,0.35)', borderBottom: '1px solid rgba(46,125,79,0.35)', padding: '100px 24px', position: 'relative' }}>
      {/* Subtle organic ambient glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_25%,rgba(46,204,113,0.06)_0%,transparent_70%)]" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs text-[#4ADE80] font-bold tracking-wider uppercase mb-3">
              <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse" />
              03 / Living Intelligence · Relational Knowledge Network
            </div>
            <h2 style={{ fontFamily: "'Source Serif 4', serif" }} className="text-3xl md:text-5xl font-normal text-[#F5F4F0] tracking-tight">
              Make the connections visible.
            </h2>
          </div>
          <p className="font-sans text-base text-[rgba(245,244,240,0.72)] max-w-xl leading-relaxed">
            Research grows at the intersections. Explore how papers, collaborators, funding streams, and foundational models connect organically across scientific disciplines.
          </p>
        </div>

        {/* Integrated Relational Node Graph Exhibition Canvas (Sandal/Sand Box matching Photo 1) */}
        <div className="w-full rounded-2xl border border-[#E4DCCB] bg-[#FAF7F0] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.35),0_4px_16px_rgba(0,0,0,0.12)] p-4 md:p-8 relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between pb-4 mb-4 border-b border-[#E4DCCB] gap-3 px-2">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3E6248] animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-wider text-[#202920] font-bold">Relational Knowledge Network · Live Graph</span>
            </div>

            {/* Interactive Category Filter Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { id: 'all', label: 'All (20)' },
                { id: 'scholar', label: 'Scholars' },
                { id: 'paper', label: 'Papers' },
                { id: 'grant', label: 'Grants' },
                { id: 'topic', label: 'Topics' },
                { id: 'lab', label: 'Labs' },
              ].map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setGraphCategory(id)}
                  className={`text-[11px] font-sans px-3 py-1 rounded-full border transition-all cursor-pointer ${
                    graphCategory === id
                      ? 'bg-[#254A34] text-[#FAF7F0] border-[#254A34] font-semibold shadow-sm'
                      : 'bg-[#FAF7F0] text-[#62685E] border-[#E4DCCB] hover:border-[#3E6248] hover:text-[#202920]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <span className="font-mono text-xs text-[#62685E] hidden md:inline">
              Active Nodes: 20 · Cross-domain connections: 28 · Live Neural Drift
            </span>
          </div>

          <div className="h-[460px] md:h-[540px] w-full">
            <EcosystemGraph dark={false} selectedCategory={graphCategory} />
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Trust Section ────────────────────────────────────────────────────────────
function TrustSection() {
  const categories = [
    { icon: '○', label: 'Undergraduate Researchers' },
    { icon: '◎', label: 'Graduate Researchers' },
    { icon: '●', label: 'PhD Scholars' },
    { icon: '◈', label: 'Faculty' },
    { icon: '◉', label: 'Research Labs' },
    { icon: '◻', label: 'Academic Institutions' },
    { icon: '◆', label: 'R&D Teams' },
  ]

  return (
    <section style={{ background: C.bg, borderTop: `1px solid ${C.rule}`, borderBottom: `1px solid ${C.rule}`, padding: '64px 88px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p style={{ fontSize: 13, fontWeight: 500, letterSpacing: '0.08em', color: C.tertiary, textTransform: 'uppercase', marginBottom: 16 }}>Built for</p>
          <h2 style={{ fontFamily: "'Source Serif 4', serif", fontSize: 'clamp(28px, 3vw, 40px)', fontWeight: 400, color: C.charcoal, letterSpacing: '-0.02em' }}>
            The people moving research forward.
          </h2>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
          {categories.map(({ icon, label }) => (
            <div
              key={label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '12px 20px',
                border: `1px solid ${C.rule}`,
                borderRadius: 40,
                fontSize: 14,
                fontWeight: 500,
                color: C.secondary,
                transition: 'border-color 0.15s, color 0.15s',
                cursor: 'default',
              }}
              onMouseEnter={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = C.moss; el.style.color = C.charcoal }}
              onMouseLeave={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = C.rule; el.style.color = C.secondary }}
            >
              <span style={{ color: C.moss, fontSize: 10 }}>{icon}</span>
              {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Problem Section ──────────────────────────────────────────────────────────
function ProblemSection() {
  const sources = ['Papers', 'Grants', 'Conferences', 'Journals', 'Researchers', 'Datasets', 'Labs']

  return (
    <section style={{ background: C.bg, padding: '120px 88px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ maxWidth: 640, marginBottom: 80 }}>
          <h2 style={{ fontFamily: "'Source Serif 4', serif", fontSize: 'clamp(36px, 4vw, 56px)', fontWeight: 400, lineHeight: 1.1, letterSpacing: '-0.03em', color: C.charcoal, marginBottom: 24 }}>
            Research shouldn't begin with twenty browser tabs.
          </h2>
          <p style={{ fontSize: 18, lineHeight: 1.65, color: C.secondary }}>
            Research information is scattered across publications, funding portals, conference websites, academic profiles, spreadsheets, documents, and communities.
          </p>
        </div>

        {/* Fragmented → Connected visualization */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 48, flexWrap: 'wrap' }}>
          {/* Scattered sources */}
          <div style={{ flex: 1, minWidth: 280 }}>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', color: C.tertiary, textTransform: 'uppercase', marginBottom: 24 }}>Fragmented</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {sources.map((s, i) => (
                <div
                  key={s}
                  style={{
                    padding: '12px 14px',
                    background: C.bg,
                    border: `1px solid ${C.rule}`,
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 500,
                    color: C.tertiary,
                    transform: `rotate(${(i % 3 - 1) * 1.5}deg) translateY(${(i % 2) * 4}px)`,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                  }}
                >
                  {s}
                </div>
              ))}
            </div>
          </div>

          {/* Arrow */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 80, height: 1, background: `linear-gradient(to right, ${C.rule}, ${C.moss})` }} />
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 10h12M12 6l4 4-4 4" stroke={C.moss} strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>

          {/* Connected: Cambium */}
          <div style={{ flex: 1, minWidth: 280 }}>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', color: C.moss, textTransform: 'uppercase', marginBottom: 24 }}>Connected</p>
            <div
              style={{
                padding: '32px',
                background: C.bg,
                border: `1px solid ${C.moss}55`,
                borderTop: `2px solid ${C.moss}`,
                borderRadius: 8,
                boxShadow: '0 4px 24px rgba(92,122,94,0.08)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#FAF7F0', border: '1px solid #E4DCCB', padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  <img src="/logo.svg" alt="CAMBIUM Research Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: '-0.03em', color: C.charcoal, textTransform: 'uppercase' }}>
                  CAMBIUM <span style={{ fontWeight: 300, color: C.moss }}>RESEARCH</span>
                </span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {sources.map((s) => (
                  <span key={s} style={{ fontSize: 11, fontWeight: 500, padding: '4px 10px', background: C.mossLight, color: C.mossMid, borderRadius: 4 }}>{s}</span>
                ))}
              </div>
              <p style={{ fontSize: 13, color: C.secondary, marginTop: 16, lineHeight: 1.5 }}>Everything your research touches, in one living environment.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Lifecycle Section (Fully Interactive 7-Stage Stepper) ───────────────────
function LifecycleSection() {
  const [activeStage, setActiveStage] = useState(0)

  const stages = [
    {
      name: 'Discover',
      tagline: 'Formulate questions & surface hidden connections',
      desc: 'Explore literature with semantic neural synthesis, identify emerging frontier topics, and track citation cascades before they trend.',
      metrics: ['120M+ Papers Indexed', 'Semantic Citation Graphs', 'Daily Frontier Alerts'],
      action: 'Query cross-disciplinary literature across Bio & AI',
      accent: '#1A4D38',
    },
    {
      name: 'Explore',
      tagline: 'Trace citation networks & comparative methodologies',
      desc: 'Deconstruct methodologies, compare experimental benchmarks across disciplines, and map methodological lineages across centuries of scholarship.',
      metrics: ['Method Lineage Trees', 'Dataset Cross-Referencing', 'Co-citation Proximity'],
      action: 'Compare transformer architectures for scientific data',
      accent: '#256346',
    },
    {
      name: 'Connect',
      tagline: 'Find synergistic co-authors, labs & grants',
      desc: 'Match with researchers working on complementary problems, discover high-synergy laboratories, and track relevant funding opportunities.',
      metrics: ['Institutional Graph', 'Collaborator Matching', 'Grant Fit Scoring'],
      action: 'Find active labs working on multimodal biomedical vision',
      accent: '#1E5638',
    },
    {
      name: 'Work',
      tagline: 'Organize notes, code, datasets & experimental logs',
      desc: 'A structured, bi-directional research workspace that brings literature notes, experimental hypotheses, and collaborative drafts into one living canvas.',
      metrics: ['Bi-directional Linking', 'LaTeX & Markdown Native', 'Zotero & BibTeX Sync'],
      action: 'Open structured literature matrix with live citations',
      accent: '#1A4D38',
    },
    {
      name: 'Publish',
      tagline: 'Author camera-ready papers & preprints seamlessly',
      desc: 'Prepare manuscripts with automated citation verification, institutional formatting templates, and peer-review ready exports for top venues.',
      metrics: ['Automated Reference Formatting', 'Preprint Server Dispatch', 'Reproducibility Check'],
      action: 'Compile camera-ready submission for NeurIPS or Nature',
      accent: '#285C42',
    },
    {
      name: 'Share',
      tagline: 'Distribute datasets, models & findings to the community',
      desc: 'Disseminate your preprints, interactive benchmarks, and supplementary data with verified digital object identifiers (DOIs) and citation anchors.',
      metrics: ['Permanent DOI Minting', 'Open Access Repository', 'Community Peer Notes'],
      action: 'Publish benchmark dataset with interactive visualization',
      accent: '#1A4D38',
    },
    {
      name: 'Grow',
      tagline: 'Compound intellectual capital & academic reputation',
      desc: 'Track real-time citation velocity, downstream patents and clinical impacts, funding renewals, and long-term research portfolio expansion.',
      metrics: ['Citation Velocity Metrics', 'Downstream Impact Tracing', 'Tenure Dossier Export'],
      action: 'Generate holistic academic impact report',
      accent: '#123927',
    },
  ]

  const current = stages[activeStage]

  return (
    <section id="discover" style={{ background: C.darkBg, borderTop: '1px solid rgba(46,125,79,0.35)', borderBottom: '1px solid rgba(46,125,79,0.35)', padding: '120px 88px', position: 'relative' }}>
      {/* Subtle organic ambient glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_25%,rgba(46,204,113,0.06)_0%,transparent_70%)]" />

      <div style={{ maxWidth: 1280, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: '#4ADE80', textTransform: 'uppercase', marginBottom: 16 }}>
          Scholarly Workflow Engine
        </p>
        <h2 style={{ fontFamily: "'Source Serif 4', serif", fontSize: 'clamp(32px, 3.5vw, 48px)', fontWeight: 400, letterSpacing: '-0.03em', color: '#F5F4F0', marginBottom: 16 }}>
          One system for the entire research lifecycle.
        </h2>
        <p style={{ fontSize: 16, color: 'rgba(245,244,240,0.72)', marginBottom: 56 }}>
          From first question to published work and beyond. Click any stage to inspect the scholarly pipeline.
        </p>

        {/* 7-Stage Stepper with State Tracking */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 0, marginBottom: 48 }}>
          {stages.map((stage, i) => {
            const isSelected = i === activeStage
            const isPast = i < activeStage

            return (
              <div key={stage.name} style={{ display: 'flex', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => setActiveStage(i)}
                  aria-label={`Step ${i + 1}: ${stage.name}`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 12,
                    padding: '0 12px',
                    cursor: 'pointer',
                    background: 'none',
                    border: 'none',
                    outline: 'none',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: '50%',
                      border: isSelected
                        ? '2.5px solid #4ADE80'
                        : isPast
                          ? '2px solid #66866A'
                          : '1.5px solid rgba(255,255,255,0.18)',
                      background: isSelected
                        ? '#3E6248'
                        : isPast
                          ? '#202920'
                          : 'rgba(255,255,255,0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 13,
                      fontWeight: 700,
                      color: isSelected ? '#FFFFFF' : (isPast ? '#86EFAC' : 'rgba(245,244,240,0.45)'),
                      transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                      boxShadow: isSelected
                        ? '0 0 0 4px rgba(74,222,128,0.25), 0 6px 16px rgba(46,125,79,0.35)'
                        : '0 2px 6px rgba(0,0,0,0.2)',
                      transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  >
                    {isPast ? '✓' : i + 1}
                  </div>
                  <span style={{
                    fontSize: 13.5,
                    fontWeight: isSelected ? 700 : 500,
                    color: isSelected ? '#FFFFFF' : 'rgba(245,244,240,0.65)',
                    transition: 'color 0.2s',
                  }}>
                    {stage.name}
                  </span>
                </button>

                {i < stages.length - 1 && (
                  <div
                    style={{
                      width: 36,
                      height: i < activeStage ? 2.5 : 1.5,
                      background: i < activeStage ? '#66866A' : 'rgba(255,255,255,0.15)',
                      marginBottom: 24,
                      transition: 'background 0.3s, height 0.3s',
                    }}
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* Dynamic Stage Details Preview Panel (White Card with Green Border matching Photo 2) */}
        <div style={{
          maxWidth: 820,
          margin: '0 auto',
          background: '#FFFFFF',
          border: '1.5px solid #2A5A3B',
          borderRadius: 14,
          padding: '36px 44px',
          boxShadow: '0 16px 48px rgba(0,0,0,0.25)',
          textAlign: 'left',
          transition: 'all 0.3s ease',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 14 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: '#264A35', textTransform: 'uppercase', background: '#D9E5D6', padding: '4px 12px', borderRadius: 4 }}>
              STAGE 0{activeStage + 1} OF 07 · {current.name.toUpperCase()}
            </span>
            <span style={{ fontSize: 13.5, color: '#71786E', fontStyle: 'italic' }}>
              {current.tagline}
            </span>
          </div>

          <p style={{ fontSize: 16.5, lineHeight: 1.65, color: '#202920', marginBottom: 24 }}>
            {current.desc}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, borderTop: '1px solid #EBE4D5', paddingTop: 20 }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {current.metrics.map((m) => (
                <span key={m} style={{ fontSize: 12.5, fontWeight: 550, padding: '6px 14px', background: '#F1EAD9', border: '1px solid #E2D7C3', color: '#3A433D', borderRadius: 6 }}>
                  {m}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: '#264A35' }}>
              <span>Sample action:</span>
              <span style={{ color: '#202920', fontWeight: 500 }}>"{current.action}"</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Academic Identity Section ────────────────────────────────────────────────
function IdentitySection() {
  const [activeTab, setActiveTab] = useState('Overview')
  const tabs = ['Overview', 'Research', 'Projects', 'Publications', 'Activity', 'Notes']
  const interests = ['Computer Vision', 'Multimodal AI', 'Scientific ML', 'Medical Imaging']
  const metrics = [{ v: '27', l: 'Publications' }, { v: '1.8k', l: 'Citations' }, { v: '8', l: 'Projects' }, { v: '34', l: 'Collaborators' }]

  return (
    <section style={{ background: C.bg, padding: '120px 88px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 80, alignItems: 'start' }}>
          {/* Left: copy */}
          <div style={{ paddingTop: 24 }}>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', color: C.moss, textTransform: 'uppercase', marginBottom: 20 }}>Academic Identity</p>
            <h2 style={{ fontFamily: "'Source Serif 4', serif", fontSize: 'clamp(32px, 3.5vw, 48px)', fontWeight: 400, lineHeight: 1.1, letterSpacing: '-0.03em', color: C.charcoal, marginBottom: 24 }}>
              More than a profile.<br />Your research identity.
            </h2>
            <p style={{ fontSize: 17, lineHeight: 1.65, color: C.secondary, marginBottom: 40 }}>
              Your academic presence, publication record, research activity, collaborations, and portfolio — unified in a living identity that grows with your work.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {['Academic profile & publication record', 'Research portfolio & projects', 'Collaboration network', 'Research activity timeline', 'Public research notes'].map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, color: C.secondary }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: C.moss, flexShrink: 0 }} />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Profile mockup */}
          <div style={{
            background: C.bg,
            border: `1px solid ${C.rule}`,
            borderRadius: 10,
            overflow: 'hidden',
            boxShadow: '0 8px 40px rgba(0,0,0,0.06)',
          }}>
            {/* Profile header */}
            <div style={{ background: '#F0EEE8', padding: '28px 28px 0', borderBottom: `1px solid ${C.rule}` }}>
              <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', marginBottom: 20 }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: C.moss, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 20, flexShrink: 0 }}>IM</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 17, color: C.charcoal, letterSpacing: '-0.02em' }}>Imthiyas</div>
                  <div style={{ fontSize: 13, color: C.secondary, marginTop: 3 }}>PhD Researcher · Computer Vision</div>
                  <div style={{ fontSize: 12, color: C.tertiary, marginTop: 2 }}>MIT Computer Science</div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
                    {interests.map((t) => (
                      <span key={t} style={{ fontSize: 11, fontWeight: 500, padding: '3px 8px', background: C.mossLight, color: C.mossMid, borderRadius: 4 }}>{t}</span>
                    ))}
                  </div>
                </div>
                <button style={{ fontSize: 12, fontWeight: 600, color: '#fff', background: C.moss, border: 'none', padding: '7px 14px', borderRadius: 5, cursor: 'pointer', flexShrink: 0 }}>Follow</button>
              </div>

              {/* Bio */}
              <p style={{ fontSize: 13, color: C.secondary, lineHeight: 1.6, marginBottom: 16 }}>
                Researching multimodal learning, scientific imaging, and AI for discovery.
              </p>

              {/* Metrics */}
              <div style={{ display: 'flex', gap: 0, borderTop: `1px solid ${C.rule}` }}>
                {metrics.map(({ v, l }, i) => (
                  <div key={l} style={{ flex: 1, padding: '14px 0', textAlign: 'center', borderRight: i < metrics.length - 1 ? `1px solid ${C.rule}` : 'none' }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: C.charcoal, letterSpacing: '-0.03em' }}>{v}</div>
                    <div style={{ fontSize: 11, color: C.tertiary, marginTop: 2 }}>{l}</div>
                  </div>
                ))}
              </div>

              {/* Tabs */}
              <div style={{ display: 'flex', gap: 0, marginTop: 0 }}>
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      padding: '10px 14px',
                      fontSize: 12,
                      fontWeight: 500,
                      background: 'none',
                      border: 'none',
                      borderBottom: activeTab === tab ? `2px solid ${C.moss}` : '2px solid transparent',
                      color: activeTab === tab ? C.moss : C.secondary,
                      cursor: 'pointer',
                      transition: 'color 0.15s',
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab content */}
            <div style={{ padding: 24 }}>
              {activeTab === 'Overview' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', color: C.tertiary, textTransform: 'uppercase', marginBottom: 4 }}>Recent Publications</p>
                  {[
                    { title: 'Vision-Language Models for Scientific Discovery', venue: 'NeurIPS 2025', citations: 312 },
                    { title: 'Multimodal Representations for Medical Imaging', venue: 'CVPR 2024', citations: 180 },
                  ].map((p) => (
                    <div key={p.title} style={{ padding: 14, border: `1px solid ${C.rule}`, borderRadius: 6 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: C.charcoal, lineHeight: 1.4, marginBottom: 6 }}>{p.title}</div>
                      <div style={{ display: 'flex', gap: 12, fontSize: 11, color: C.tertiary }}>
                        <span>{p.venue}</span>
                        <span style={{ color: C.moss }}>↑ {p.citations} citations</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {activeTab !== 'Overview' && (
                <div style={{ padding: 24, textAlign: 'center', color: C.tertiary, fontSize: 13 }}>
                  {activeTab} view — full content on your Cambium profile.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Research Workspace Section (Dark Green Archive Environment) ────────────
function WorkspaceSection() {
  const sidebarItems = [
    { icon: '📁', label: 'Research Workspace', active: false, indent: 0 },
    { icon: '📄', label: 'Literature Review', active: true, indent: 1 },
    { icon: '📝', label: 'Research Notes', active: false, indent: 1 },
    { icon: '🧪', label: 'Experiments', active: false, indent: 1 },
    { icon: '💡', label: 'Ideas', active: false, indent: 1 },
    { icon: '📚', label: 'Reading List', active: false, indent: 1 },
    { icon: '📋', label: 'Thesis', active: false, indent: 1 },
    { icon: '✏️', label: 'Draft Papers', active: false, indent: 1 },
    { icon: '🔗', label: 'References', active: false, indent: 1 },
  ]

  return (
    <section style={{ background: C.darkBg, borderTop: '1px solid rgba(46,125,79,0.35)', borderBottom: '1px solid rgba(46,125,79,0.35)', padding: '120px 88px', position: 'relative' }}>
      {/* Subtle organic ambient glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_25%,rgba(46,204,113,0.06)_0%,transparent_70%)]" />

      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: '#4ADE80', textTransform: 'uppercase', marginBottom: 16 }}>
            Research Workspace
          </p>
          <h2 style={{ fontFamily: "'Source Serif 4', serif", fontSize: 'clamp(32px, 3.5vw, 48px)', fontWeight: 400, letterSpacing: '-0.03em', color: '#F5F4F0', marginBottom: 16 }}>
            Your research has a home.
          </h2>
          <p style={{ fontSize: 17, color: 'rgba(245,244,240,0.72)', maxWidth: 520, margin: '0 auto' }}>
            Organize your notes, literature, experiments, and drafts in a structured research environment built for scholarly work.
          </p>
        </div>

        {/* Luminous High-Contrast Workspace Mockup */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '230px 1fr',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 12,
          overflow: 'hidden',
          boxShadow: '0 24px 72px -12px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.08)',
          background: '#FFFFFF',
          minHeight: 500,
        }}>
          {/* Sidebar */}
          <div style={{ background: '#F6F5F1', borderRight: '1px solid #E2DDD3', padding: '20px 0' }}>
            <div style={{ padding: '0 16px 16px', borderBottom: '1px solid #E2DDD3', marginBottom: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: '#526E5D', textTransform: 'uppercase' }}>Workspace</div>
            </div>
            {sidebarItems.map(({ icon, label, active, indent }) => (
              <div
                key={label}
                style={{
                  padding: `8px ${16 + indent * 12}px`,
                  fontSize: 12.5,
                  fontWeight: active ? 600 : 400,
                  color: active ? '#0C1E15' : '#364D3F',
                  background: active ? '#DBEDE2' : 'transparent',
                  borderLeft: active ? '3px solid #1A4D38' : '3px solid transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  transition: 'background 0.15s',
                }}
              >
                <span style={{ fontSize: 11 }}>{icon}</span>
                {label}
              </div>
            ))}
          </div>

          {/* Document Content */}
          <div style={{ padding: 36, overflow: 'auto', background: '#FFFFFF' }}>
            <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 11, color: '#668070' }}>Literature Review</span>
              <span style={{ fontSize: 11, color: '#AEC2B4' }}>/</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#0C1E15' }}>Multimodal Learning</span>
            </div>

            <h3 style={{ fontFamily: "'Source Serif 4', serif", fontSize: 26, fontWeight: 600, color: '#0C1E15', letterSpacing: '-0.02em', marginBottom: 12 }}>
              Multimodal Learning — Literature Review
            </h3>

            <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
              {['Computer Vision', 'Multimodal AI', 'Foundation Models'].map((t) => (
                <span key={t} style={{ fontSize: 11, fontWeight: 600, padding: '3px 9px', background: '#DBEDE2', color: '#1A4D38', borderRadius: 4 }}>{t}</span>
              ))}
            </div>

            <div style={{ marginBottom: 24, padding: '18px 22px', background: '#EEF7F2', borderLeft: '3px solid #1A4D38', borderRadius: '0 8px 8px 0' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#1A4D38', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Research Question</div>
              <p style={{ fontSize: 14.5, color: '#0C1E15', lineHeight: 1.6, fontWeight: 450 }}>How can multimodal models improve scientific literature discovery?</p>
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0C1E15', marginBottom: 12 }}>Key Findings</div>
              {[
                'Cross-modal retrieval improves discovery quality significantly over single-modality approaches.',
                'Domain-specific embeddings outperform generic representations in scientific contexts.',
                'Citation context provides useful relevance signals for downstream ranking tasks.',
              ].map((finding, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 10, fontSize: 13.5, color: '#364D3F', lineHeight: 1.6 }}>
                  <span style={{ color: '#1A4D38', fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
                  {finding}
                </div>
              ))}
            </div>

            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0C1E15', marginBottom: 10 }}>Referenced Papers</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { title: 'CLIP: Connecting Text and Images', venue: 'OpenAI · 2021', cited: true },
                  { title: 'Flamingo: a Visual Language Model', venue: 'DeepMind · 2022', cited: false },
                ].map((p) => (
                  <div key={p.title} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', border: '1px solid #D1DDD4', borderRadius: 6, background: '#FAFAF8' }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <rect x="1" y="1" width="12" height="12" rx="2" stroke="#668070" strokeWidth="1" />
                      <line x1="3" y1="4.5" x2="11" y2="4.5" stroke="#668070" strokeWidth="1" />
                      <line x1="3" y1="7" x2="9" y2="7" stroke="#668070" strokeWidth="1" />
                    </svg>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 600, color: '#0C1E15' }}>{p.title}</div>
                      <div style={{ fontSize: 11, color: '#668070' }}>{p.venue}</div>
                    </div>
                    {p.cited && <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', background: '#DBEDE2', color: '#1A4D38', borderRadius: 4 }}>Cited</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Community Section ─────────────────────────────────────────────────────────
function CommunitySection() {
  return (
    <section id="community" style={{ background: C.bg, padding: '120px 88px', borderTop: `1px solid ${C.rule}` }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 80, alignItems: 'center' }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', color: C.moss, textTransform: 'uppercase', marginBottom: 20 }}>Research Community</p>
          <h2 style={{ fontFamily: "'Source Serif 4', serif", fontSize: 'clamp(32px, 3.5vw, 48px)', fontWeight: 400, lineHeight: 1.1, letterSpacing: '-0.03em', color: C.charcoal, marginBottom: 24 }}>
            Research is better together.
          </h2>
          <p style={{ fontSize: 17, lineHeight: 1.65, color: C.secondary, marginBottom: 40 }}>
            Share findings, seek collaborators, announce publications, and engage with the scholarly community in a space designed for academic discourse.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {['Scholarly discussion threads', 'Collaboration requests', 'Publication announcements', 'Research questions & answers'].map((item) => (
              <div key={item} style={{ display: 'flex', gap: 12, alignItems: 'center', fontSize: 14, color: C.secondary }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: C.moss, flexShrink: 0 }} />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Community feed mockup */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Post 1 */}
          <div style={{ background: C.bg, border: `1px solid ${C.rule}`, borderRadius: 8, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'flex-start' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#4A6B8A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>AR</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.charcoal }}>Dr. Arjun Rao</div>
                <div style={{ fontSize: 11, color: C.tertiary }}>Machine Learning Researcher · IISc · 2h ago</div>
              </div>
            </div>
            <p style={{ fontSize: 14, color: C.secondary, lineHeight: 1.65, marginBottom: 14 }}>
              "We just released our benchmark for low-resource scientific language models. The gap between domain-general and domain-specific models is larger than we expected at small scales."
            </p>
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
              {['Scientific NLP', 'Low-Resource', 'Benchmarks'].map((t) => (
                <span key={t} style={{ fontSize: 11, padding: '3px 8px', border: `1px solid ${C.rule}`, borderRadius: 4, color: C.secondary }}>{t}</span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 20, borderTop: `1px solid ${C.rule}`, paddingTop: 12 }}>
              {[['💬', '24 Comments'], ['↗', 'Share'], ['🔖', 'Save'], ['＋', 'Follow']].map(([icon, label]) => (
                <button key={label} style={{ fontSize: 12, color: C.tertiary, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', gap: 5, alignItems: 'center', transition: 'color 0.1s' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = C.charcoal }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = C.tertiary }}>
                  <span>{icon}</span>{label}
                </button>
              ))}
            </div>
          </div>

          {/* Post 2: Collaboration request */}
          <div style={{ background: C.bg, border: `1px solid ${C.moss}44`, borderTop: `2px solid ${C.moss}`, borderRadius: 8, padding: 20, boxShadow: '0 2px 8px rgba(92,122,94,0.06)' }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center' }}>
              <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', background: C.mossLight, color: C.mossMid, borderRadius: 4 }}>Looking for collaborators</span>
            </div>
            <p style={{ fontSize: 14, color: C.secondary, lineHeight: 1.65, marginBottom: 14 }}>
              Working on multimodal medical imaging and looking for researchers with expertise in clinical validation. Experience with radiology datasets preferred.
            </p>
            <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
              {['Medical Imaging', 'Computer Vision', 'Collaboration', 'Clinical AI'].map((t) => (
                <span key={t} style={{ fontSize: 11, padding: '3px 8px', border: `1px solid ${C.rule}`, borderRadius: 4, color: C.secondary }}>{t}</span>
              ))}
            </div>
            <button style={{ fontSize: 12, fontWeight: 600, color: C.moss, background: C.mossLight, border: 'none', padding: '8px 16px', borderRadius: 5, cursor: 'pointer' }}>
              Express interest
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Activity / Contribution Graph ───────────────────────────────────────────
function ActivitySection() {
  const weeks = 52
  const days = 7
  const activities = ['Published Paper', 'Updated Dataset', 'Experiment', 'Conference', 'Literature Review', 'Collaboration', 'Grant', 'Code', 'Research Note']

  const grid = Array.from({ length: weeks }, (_, w) =>
    Array.from({ length: days }, (_, d) => {
      const r = Math.random()
      if (r > 0.85) return 4
      if (r > 0.7) return 3
      if (r > 0.55) return 2
      if (r > 0.35) return 1
      return 0
    })
  )

  const intensities = ['#F0EEE8', C.mossLight, '#C5D9C6', '#8CB48E', C.moss]

  return (
    <section style={{ background: '#F5F4F0', borderTop: `1px solid ${C.rule}`, padding: '120px 88px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          {/* Graph */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.charcoal }}>2026 Research Activity</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 11, color: C.tertiary }}>Less</span>
                {intensities.map((c, i) => (
                  <div key={i} style={{ width: 10, height: 10, borderRadius: 2, background: c, border: `1px solid ${C.rule}` }} />
                ))}
                <span style={{ fontSize: 11, color: C.tertiary }}>More</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 3, overflowX: 'auto', paddingBottom: 8 }}>
              {grid.map((week, w) => (
                <div key={w} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {week.map((level, d) => (
                    <div
                      key={d}
                      title={level > 0 ? `${activities[Math.floor(Math.random() * activities.length)]}` : 'No activity'}
                      style={{
                        width: 11,
                        height: 11,
                        borderRadius: 2,
                        background: intensities[level],
                        border: `1px solid rgba(0,0,0,0.04)`,
                        cursor: 'default',
                        transition: 'transform 0.1s',
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.3)' }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = '' }}
                    />
                  ))}
                </div>
              ))}
            </div>

            {/* Activity types */}
            <div style={{ marginTop: 24, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {activities.map((a) => (
                <span key={a} style={{ fontSize: 11, padding: '4px 10px', border: `1px solid ${C.rule}`, borderRadius: 4, color: C.secondary, background: C.bg }}>{a}</span>
              ))}
            </div>
          </div>

          {/* Copy */}
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', color: C.moss, textTransform: 'uppercase', marginBottom: 20 }}>Research Activity</p>
            <h2 style={{ fontFamily: "'Source Serif 4', serif", fontSize: 'clamp(28px, 3vw, 44px)', fontWeight: 400, lineHeight: 1.15, letterSpacing: '-0.03em', color: C.charcoal, marginBottom: 24 }}>
              Every contribution becomes part of your research story.
            </h2>
            <p style={{ fontSize: 17, lineHeight: 1.65, color: C.secondary }}>
              Track publications, experiments, collaborations, and milestones in a continuous timeline that documents your intellectual journey from start to impact.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Opportunities Section ────────────────────────────────────────────────────
function OpportunitiesSection() {
  const [activeTab, setActiveTab] = useState('Grants')
  const tabs = ['Grants', 'Conferences', 'Journals', 'Fellowships', 'Scholarships', 'CFPs']

  const opportunities = {
    Grants: [
      { title: 'AI for Climate Research', org: 'National Science Foundation', type: 'Grant', deadline: '18 days', funding: '$250,000', tags: ['AI', 'Climate', 'Research'], hot: true },
      { title: 'Biomedical Data Science Initiative', org: 'NIH National Library of Medicine', type: 'Grant', deadline: '42 days', funding: '$180,000', tags: ['Biomedical', 'Data Science'], hot: false },
    ],
    Conferences: [
      { title: 'NeurIPS 2026', org: 'Neural Information Processing Systems', type: 'Conference', deadline: 'Sep 18', funding: null, tags: ['Machine Learning', 'AI', 'Representation Learning'], hot: true },
      { title: 'CVPR 2026', org: 'Computer Vision and Pattern Recognition', type: 'Conference', deadline: 'Nov 1', funding: null, tags: ['Computer Vision', 'Robotics'], hot: false },
    ],
    Fellowships: [
      { title: 'Research Fellowship Program', org: 'Global Research Foundation', type: 'Fellowship', deadline: 'Oct 4', funding: '$60,000/yr', tags: ['Open', 'International'], hot: false },
    ],
    Journals: [{ title: 'Nature Machine Intelligence', org: 'Springer Nature', type: 'Journal', deadline: 'Rolling', funding: null, tags: ['AI', 'ML', 'High Impact'], hot: true }],
    Scholarships: [{ title: 'Doctoral Excellence Award', org: 'IEEE Foundation', type: 'Scholarship', deadline: 'Dec 15', funding: '$25,000', tags: ['PhD', 'Engineering'], hot: false }],
    CFPs: [{ title: 'ICML Workshop on Scientific ML', org: 'ICML 2026', type: 'CFP', deadline: 'Mar 20', funding: null, tags: ['Scientific ML', 'Workshop'], hot: false }],
  }

  const items = opportunities[activeTab as keyof typeof opportunities] || []

  return (
    <section id="opportunities" style={{ background: C.darkBg, borderTop: '1px solid rgba(46,125,79,0.35)', borderBottom: '1px solid rgba(46,125,79,0.35)', padding: '120px 88px', position: 'relative' }}>
      {/* Subtle organic ambient glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_25%,rgba(46,204,113,0.06)_0%,transparent_70%)]" />

      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, flexWrap: 'wrap', gap: 24 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: '#4ADE80', textTransform: 'uppercase', marginBottom: 16 }}>Opportunity Discovery</p>
            <h2 style={{ fontFamily: "'Source Serif 4', serif", fontSize: 'clamp(32px, 3.5vw, 48px)', fontWeight: 400, letterSpacing: '-0.03em', color: '#F5F4F0' }}>
              Find the opportunities that fit your research.
            </h2>
          </div>
        </div>

        {/* Tabs Bar matching Photo 3 */}
        <div style={{ display: 'flex', gap: 28, borderBottom: '1px solid rgba(255,255,255,0.12)', marginBottom: 36, overflowX: 'auto' }}>
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '12px 4px',
                fontSize: 14,
                fontWeight: activeTab === tab ? 600 : 450,
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab ? '2.5px solid #4ADE80' : '2.5px solid transparent',
                color: activeTab === tab ? '#FFFFFF' : 'rgba(245,244,240,0.65)',
                cursor: 'pointer',
                marginBottom: -1,
                transition: 'all 0.18s ease',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Cards Grid matching Photo 3 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
          {items.map((opp) => (
            <div
              key={opp.title}
              style={{
                background: '#FAF7F0',
                border: '1px solid #E2D9C8',
                borderRadius: 14,
                padding: 24,
                cursor: 'pointer',
                transition: 'transform 0.18s ease, box-shadow 0.18s ease',
                boxShadow: '0 16px 40px -10px rgba(0,0,0,0.32), 0 4px 12px rgba(0,0,0,0.12)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
              onMouseEnter={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.transform = 'translateY(-3px)'; el.style.boxShadow = '0 24px 52px -10px rgba(0,0,0,0.44), 0 8px 18px rgba(0,0,0,0.18)' }}
              onMouseLeave={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.transform = ''; el.style.boxShadow = '0 16px 40px -10px rgba(0,0,0,0.32), 0 4px 12px rgba(0,0,0,0.12)' }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <span style={{ fontSize: 12, fontWeight: 500, padding: '3px 10px', background: '#EFEBE1', color: '#62685E', borderRadius: 6 }}>
                    {opp.type}
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 500, color: '#B33D35', background: '#FDF1EE', padding: '3px 10px', borderRadius: 6 }}>
                    {opp.deadline} {opp.deadline.includes('days') ? 'left' : ''}
                  </span>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 650, color: '#1C251F', letterSpacing: '-0.02em', margin: '0 0 6px', lineHeight: 1.35 }}>
                  {opp.title}
                </h3>
                <div style={{ fontSize: 13.5, color: '#62685E', marginBottom: 16 }}>
                  {opp.org}
                </div>
                {opp.funding && (
                  <div style={{ fontSize: 16, fontWeight: 600, color: '#1C251F', marginBottom: 18 }}>
                    {opp.funding}
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: opp.funding ? 0 : 16 }}>
                {opp.tags.map((t) => (
                  <span key={t} style={{ fontSize: 11.5, padding: '4px 10px', background: '#FAF7F0', border: '1px solid #DDD4C2', borderRadius: 6, color: '#62685E' }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Paper Discovery Section ──────────────────────────────────────────────────
function PaperSection() {
  return (
    <section id="research" style={{ background: '#F5F4F0', borderTop: `1px solid ${C.rule}`, padding: '120px 88px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 80, alignItems: 'center' }}>
          {/* Paper card mockup */}
          <div>
            <div style={{ background: C.bg, border: `1px solid ${C.rule}`, borderRadius: 10, padding: 28, boxShadow: '0 2px 8px rgba(32,41,32,0.03)' }}>
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: C.tertiary, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>Research Paper</div>
                <h3 style={{ fontFamily: "'Source Serif 4', serif", fontSize: 20, fontWeight: 400, color: C.charcoal, lineHeight: 1.35, letterSpacing: '-0.02em', marginBottom: 12 }}>
                  Foundation Models for Scientific Discovery
                </h3>
                <div style={{ fontSize: 13, color: C.secondary, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {['Imthiyas', 'Arjun Rao', 'Elena Park'].map((a, i) => (
                    <span key={a}>{a}{i < 2 ? ',' : ''}</span>
                  ))}
                  <span style={{ color: C.tertiary }}>· 2026</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 24, padding: '16px 0', borderTop: `1px solid ${C.rule}`, borderBottom: `1px solid ${C.rule}`, marginBottom: 20 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: C.charcoal, letterSpacing: '-0.02em' }}>2,418</div>
                  <div style={{ fontSize: 11, color: C.tertiary, marginTop: 2 }}>Citations</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: C.charcoal, letterSpacing: '-0.02em' }}>NeurIPS</div>
                  <div style={{ fontSize: 11, color: C.tertiary, marginTop: 2 }}>Venue · 2026</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
                {['Scientific ML', 'Foundation Models', 'Knowledge Discovery'].map((t) => (
                  <span key={t} style={{ fontSize: 11, fontWeight: 500, padding: '4px 10px', background: C.mossLight, color: C.mossMid, borderRadius: 4 }}>{t}</span>
                ))}
              </div>

              {/* Relationship visualization */}
              <div style={{ borderTop: `1px solid ${C.rule}`, paddingTop: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.charcoal, marginBottom: 12 }}>Research Connections</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {[
                    { label: 'References', count: 84, color: '#6B7A5A' },
                    { label: 'Related Papers', count: 32, color: '#5A6B7A' },
                    { label: 'Citations', count: 2418, color: C.moss },
                    { label: 'Research Topics', count: 12, color: '#7A6B5A' },
                  ].map(({ label, count, color }) => (
                    <div key={label} style={{ padding: '10px 12px', background: '#F5F4F0', borderRadius: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 12, color: C.secondary }}>{label}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color }}>{count.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Copy */}
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', color: C.moss, textTransform: 'uppercase', marginBottom: 20 }}>Paper Discovery</p>
            <h2 style={{ fontFamily: "'Source Serif 4', serif", fontSize: 'clamp(32px, 3.5vw, 48px)', fontWeight: 400, lineHeight: 1.1, letterSpacing: '-0.03em', color: C.charcoal, marginBottom: 24 }}>
              Follow ideas, not just citations.
            </h2>
            <p style={{ fontSize: 17, lineHeight: 1.65, color: C.secondary, marginBottom: 40 }}>
              Navigate the research landscape through semantic relationships — not just who cited whom. Discover papers through shared concepts, emerging themes, and the ideas that connect across fields.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {['Semantic paper discovery', 'Citation network navigation', 'Related paper recommendations', 'Research topic clustering'].map((item) => (
                <div key={item} style={{ display: 'flex', gap: 12, alignItems: 'center', fontSize: 14, color: C.secondary }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: C.moss, flexShrink: 0 }} />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Collaboration Section ────────────────────────────────────────────────────
function CollaborationSection() {
  const researchers = [
    { initials: 'EP', color: '#6B5A7A', name: 'Dr. Elena Park', role: 'Computational Biology', org: 'Stanford University', topics: ['Protein Design', 'Generative AI', 'Bioinformatics'], shared: 3, mutual: 5 },
    { initials: 'AR', color: '#4A6B8A', name: 'Dr. Arjun Rao', role: 'Machine Learning', org: 'IISc', topics: ['Scientific NLP', 'Low-Resource ML', 'Benchmarks'], shared: 2, mutual: 7 },
    { initials: 'LK', color: '#7A6B4A', name: 'Dr. Lena Kovacs', role: 'Neuroscience AI', org: 'ETH Zurich', topics: ['Neural Decoding', 'Brain-Computer Interface'], shared: 4, mutual: 3 },
  ]

  return (
    <section style={{ background: C.bg, borderTop: `1px solid ${C.rule}`, padding: '120px 88px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', color: C.moss, textTransform: 'uppercase', marginBottom: 16 }}>Collaboration</p>
          <h2 style={{ fontFamily: "'Source Serif 4', serif", fontSize: 'clamp(32px, 3.5vw, 48px)', fontWeight: 400, letterSpacing: '-0.03em', color: C.charcoal, marginBottom: 16 }}>
            Meet the researchers your work is already pointing toward.
          </h2>
          <p style={{ fontSize: 17, color: C.secondary, maxWidth: 480, margin: '0 auto' }}>
            Cambium surfaces researchers who share your intellectual territory — before you know to search for them.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {researchers.map((r) => (
            <div
              key={r.name}
              style={{
                background: C.bg,
                border: `1px solid ${C.rule}`,
                borderRadius: 8,
                padding: 24,
                cursor: 'pointer',
                transition: 'transform 0.15s, box-shadow 0.15s, border-color 0.15s',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              }}
              onMouseEnter={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.transform = 'translateY(-2px)'; el.style.boxShadow = '0 8px 24px rgba(0,0,0,0.07)'; el.style.borderColor = C.rule }}
              onMouseLeave={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.transform = ''; el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.03)'; el.style.borderColor = C.rule }}
            >
              <div style={{ display: 'flex', gap: 14, marginBottom: 16, alignItems: 'center' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: r.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 15, flexShrink: 0 }}>{r.initials}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.charcoal, letterSpacing: '-0.01em' }}>{r.name}</div>
                  <div style={{ fontSize: 12, color: C.secondary, marginTop: 2 }}>{r.role}</div>
                  <div style={{ fontSize: 11, color: C.tertiary }}>{r.org}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
                {r.topics.map((t) => (
                  <span key={t} style={{ fontSize: 11, padding: '3px 8px', border: `1px solid ${C.rule}`, borderRadius: 4, color: C.secondary }}>{t}</span>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 20, padding: '12px 0', borderTop: `1px solid ${C.rule}`, borderBottom: `1px solid ${C.rule}`, marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: C.charcoal }}>{r.shared}</div>
                  <div style={{ fontSize: 11, color: C.tertiary }}>Shared interests</div>
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: C.charcoal }}>{r.mutual}</div>
                  <div style={{ fontSize: 11, color: C.tertiary }}>Mutual topics</div>
                </div>
              </div>

              <button style={{ fontSize: 12, fontWeight: 500, color: C.moss, background: C.mossLight, border: 'none', padding: '8px 16px', borderRadius: 5, cursor: 'pointer', width: '100%', transition: 'background 0.1s' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#D5E4D6' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = C.mossLight }}>
                Explore profile
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Intelligence Section (Dark) ──────────────────────────────────────────────
function IntelligenceSection() {
  return (
    <section style={{ background: C.darkBg, padding: '120px 88px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 80, alignItems: 'center' }}>
          {/* Copy */}
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', color: C.moss, textTransform: 'uppercase', marginBottom: 20 }}>Research Intelligence</p>
            <h2 style={{ fontFamily: "'Source Serif 4', serif", fontSize: 'clamp(32px, 3.5vw, 48px)', fontWeight: 400, lineHeight: 1.1, letterSpacing: '-0.03em', color: '#F5F4F0', marginBottom: 24 }}>
              Intelligence that works around your research.
            </h2>
            <p style={{ fontSize: 17, lineHeight: 1.65, color: 'rgba(250,249,246,0.55)', marginBottom: 40 }}>
              Cambium understands your work — not just your search queries. It surfaces connections, opportunities, and collaborators as you research, not when you ask.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {['Contextual paper recommendations', 'Opportunity matching by research fit', 'Emerging topic signals in your field', 'Collaboration opportunities at intersections'].map((item) => (
                <div key={item} style={{ display: 'flex', gap: 12, alignItems: 'center', fontSize: 14, color: 'rgba(250,249,246,0.55)' }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: C.moss, flexShrink: 0 }} />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Insight panel mockup in Sandal/Sand matching Photo 1 & Opportunities cards */}
          <div>
            {/* Paper context box */}
            <div
              style={{
                background: '#FAF7F0',
                border: '1px solid #E2D9C8',
                borderRadius: 12,
                padding: '20px 24px',
                marginBottom: 14,
                boxShadow: '0 12px 32px -8px rgba(0,0,0,0.28), 0 4px 12px rgba(0,0,0,0.12)',
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 600, color: '#62685E', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>
                Currently reading
              </div>
              <div style={{ fontSize: 16, fontWeight: 650, color: '#1C251F', lineHeight: 1.35, letterSpacing: '-0.01em' }}>
                Foundation Models for Scientific Discovery
              </div>
              <div style={{ fontSize: 13, color: '#62685E', marginTop: 4 }}>
                Imthiyas, Rao, Park · NeurIPS 2026
              </div>
            </div>

            {/* Insight card */}
            <div
              style={{
                background: '#FAF7F0',
                border: '1px solid #E2D9C8',
                borderTop: '3px solid #3E6248',
                borderRadius: 14,
                padding: '24px 26px',
                boxShadow: '0 20px 48px -12px rgba(0,0,0,0.32), 0 6px 18px rgba(0,0,0,0.15)',
              }}
            >
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16 }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#E2EDE5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="15" height="15" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="5" stroke="#3E6248" strokeWidth="1.5" />
                    <path d="M7 4.5v3M7 9v.5" stroke="#3E6248" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#264A35', letterSpacing: '-0.01em' }}>
                  Cambium Research Insight
                </div>
              </div>

              <p style={{ fontSize: 14.5, color: '#202920', lineHeight: 1.65, marginBottom: 20 }}>
                This paper connects strongly with your work on multimodal scientific discovery. Several co-authors are active in areas you&apos;re exploring.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'Related papers to explore', count: '12 papers', icon: '→' },
                  { label: 'Researchers active in this area', count: '4 researchers', icon: '→' },
                  { label: 'Relevant grants open now', count: '3 grants', icon: '→' },
                  { label: 'Publication venues to compare', count: '6 venues', icon: '→' },
                ].map(({ label, count, icon }) => (
                  <div
                    key={label}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 16px',
                      background: '#F1EAD9',
                      borderRadius: 8,
                      cursor: 'pointer',
                      border: '1px solid #E4DCCB',
                      transition: 'background 0.15s, border-color 0.15s, transform 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLDivElement
                      el.style.background = '#EAE2D0'
                      el.style.borderColor = '#D8CEBB'
                      el.style.transform = 'translateX(2px)'
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLDivElement
                      el.style.background = '#F1EAD9'
                      el.style.borderColor = '#E4DCCB'
                      el.style.transform = 'none'
                    }}
                  >
                    <span style={{ fontSize: 13.5, color: '#202920', fontWeight: 500 }}>{label}</span>
                    <span style={{ fontSize: 13, color: '#3E6248', fontWeight: 650 }}>{count} {icon}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Portfolio Section ────────────────────────────────────────────────────────
function PortfolioSection() {
  const projects = [
    { name: 'Multimodal Scientific Discovery', status: 'Active', statusColor: C.moss, collaborators: ['MC', 'AR', 'EP'], pubs: 4, datasets: 2, experiments: 18 },
    { name: 'Medical Imaging Foundation Models', status: 'Published', statusColor: '#4A6B8A', collaborators: ['MC', 'LK'], pubs: 7, citations: '1.2k', experiments: 31 },
    { name: 'Cross-lingual Scientific NLP', status: 'In Progress', statusColor: '#7A6B4A', collaborators: ['AR', 'MC'], pubs: 2, datasets: 5, experiments: 11 },
  ]

  return (
    <section style={{ background: '#F5F4F0', borderTop: `1px solid ${C.rule}`, padding: '120px 88px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, flexWrap: 'wrap', gap: 24 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', color: C.moss, textTransform: 'uppercase', marginBottom: 16 }}>Research Portfolio</p>
            <h2 style={{ fontFamily: "'Source Serif 4', serif", fontSize: 'clamp(32px, 3.5vw, 48px)', fontWeight: 400, letterSpacing: '-0.03em', color: C.charcoal }}>
              Your research, from first question<br />to published work.
            </h2>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {projects.map((p) => (
            <div
              key={p.name}
              style={{
                background: C.bg,
                border: `1px solid ${C.rule}`,
                borderLeft: `3px solid ${p.statusColor}`,
                borderRadius: 8,
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: 32,
                cursor: 'pointer',
                transition: 'transform 0.15s, box-shadow 0.15s',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              }}
              onMouseEnter={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.transform = 'translateY(-1px)'; el.style.boxShadow = '0 6px 20px rgba(0,0,0,0.06)' }}
              onMouseLeave={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.transform = ''; el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.03)' }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: C.charcoal, letterSpacing: '-0.02em' }}>{p.name}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', background: `${p.statusColor}15`, color: p.statusColor, borderRadius: 4 }}>{p.status}</span>
                </div>
                <div style={{ display: 'flex', gap: 24, fontSize: 12, color: C.secondary }}>
                  <span>{p.pubs} Publications</span>
                  {p.datasets && <span>{p.datasets} Datasets</span>}
                  {p.citations && <span style={{ color: C.moss }}>↑ {p.citations} Citations</span>}
                  <span>{p.experiments} Experiments</span>
                </div>
              </div>

              {/* Collaborators */}
              <div style={{ display: 'flex', gap: -8, flexShrink: 0 }}>
                {p.collaborators.map((c, i) => (
                  <div key={c} style={{ width: 30, height: 30, borderRadius: '50%', background: [C.moss, '#4A6B8A', '#7A6B4A'][i % 3], display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 700, border: `2px solid ${C.bg}`, marginLeft: i > 0 ? -8 : 0 }}>{c}</div>
                ))}
              </div>

              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={C.tertiary} strokeWidth="1.5">
                <path d="M4 8h8M9 5l3 3-3 3" strokeLinecap="round" />
              </svg>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Ecosystem Map Section (Dark) ─────────────────────────────────────────────
function EcosystemMapSection() {
  return (
    <section style={{ background: C.darkBg, borderTop: '1px solid rgba(46,125,79,0.35)', padding: '120px 88px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', textAlign: 'center' }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: '#4ADE80', textTransform: 'uppercase', marginBottom: 20 }}>Research Ecosystem</p>
        <h2 style={{ fontFamily: "'Source Serif 4', serif", fontSize: 'clamp(36px, 4vw, 60px)', fontWeight: 400, lineHeight: 1.08, letterSpacing: '-0.03em', color: '#F5F4F0', marginBottom: 16 }}>
          Everything connects.
        </h2>
        <p style={{ fontSize: 17, color: 'rgba(250,249,246,0.72)', marginBottom: 64, maxWidth: 480, margin: '0 auto 64px' }}>
          Your research doesn't exist in isolation. Cambium maps the living network around your work.
        </p>

        {/* Large ecosystem SVG */}
        <div style={{ maxWidth: 700, margin: '0 auto', height: 500 }}>
          <svg viewBox="0 0 700 500" style={{ width: '100%', height: '100%', overflow: 'visible' }} aria-label="Research ecosystem map">
            <defs>
              <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FAF7F0" stopOpacity="0.25">
                  <animate attributeName="stop-opacity" values="0.15;0.35;0.15" dur="4s" repeatCount="indefinite" />
                </stop>
                <stop offset="100%" stopColor={C.moss} stopOpacity="0" />
              </radialGradient>
              <clipPath id="centerCircleClip">
                <circle cx="350" cy="250" r="66" />
              </clipPath>
            </defs>

            {/* Glow behind center */}
            <ellipse cx="350" cy="250" rx="140" ry="140" fill="url(#centerGlow)">
               <animate attributeName="rx" values="120;160;120" dur="5s" repeatCount="indefinite" />
               <animate attributeName="ry" values="120;160;120" dur="5s" repeatCount="indefinite" />
            </ellipse>

            {/* Connection lines */}
            {[
              [350, 250, 350, 80],   // Papers
              [350, 250, 560, 140],  // People
              [350, 250, 620, 280],  // Projects
              [350, 250, 530, 420],  // Labs
              [350, 250, 350, 430],  // Topics
              [350, 250, 170, 420],  // Journals
              [350, 250, 80, 280],   // Conferences
              [350, 250, 140, 140],  // Funding
              [350, 250, 220, 60],   // Datasets
              [350, 250, 480, 60],   // Notes
            ].map(([x1, y1, x2, y2], i) => (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(184, 178, 167, 0.4)" strokeWidth="1.5" strokeDasharray="6 6">
                <animate attributeName="stroke-dashoffset" values="12;0" dur={`${1.5 + (i * 0.1)}s`} repeatCount="indefinite" />
              </line>
            ))}

            {/* Center node: CAMBIUM with Logo */}
            <g 
              style={{ cursor: 'pointer', transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', transformOrigin: '350px 250px' }} 
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'} 
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <circle 
                cx="350" 
                cy="250" 
                r="58" 
                fill="#FAF7F0" 
                stroke="#3E6248" 
                strokeWidth="2.5" 
                style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.35))' }}
              >
                <animate attributeName="stroke-width" values="2;4;2" dur="3s" repeatCount="indefinite" />
              </circle>
              {/* Cambium Fibonacci Spiral Logo */}
              <image href="/logo.svg" x="328" y="206" width="44" height="44" />
              <text 
                x="350" 
                y="272" 
                textAnchor="middle" 
                fontFamily="'Instrument Sans', sans-serif" 
                fontSize="10" 
                fontWeight="700" 
                fill="#202920" 
                letterSpacing="0.16em"
              >
                CAMBIUM
              </text>
            </g>

            {/* Satellite nodes in Sand colour with Uniform Grey Border */}
            {[
              { label: 'Papers', x: 350, y: 64, delay: '0s' },
              { label: 'People', x: 568, y: 128, delay: '-1s' },
              { label: 'Projects', x: 624, y: 272, delay: '-2s' },
              { label: 'Labs', x: 536, y: 416, delay: '-3s' },
              { label: 'Topics', x: 350, y: 440, delay: '-0.5s' },
              { label: 'Journals', x: 164, y: 416, delay: '-1.5s' },
              { label: 'Conferences', x: 76, y: 272, delay: '-2.5s' },
              { label: 'Funding', x: 132, y: 128, delay: '-3.5s' },
              { label: 'Datasets', x: 216, y: 52, delay: '-0.8s' },
              { label: 'Notes', x: 484, y: 52, delay: '-1.8s' },
            ].map(({ label, x, y, delay }) => (
              <g 
                key={label}
                style={{ 
                  cursor: 'pointer', 
                  transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)', 
                  transformOrigin: `${x}px ${y}px`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <g>
                  <animateTransform 
                    attributeName="transform" 
                    type="translate" 
                    values="0,0; 0,-10; 0,0" 
                    dur="6s" 
                    begin={delay} 
                    repeatCount="indefinite" 
                  />
                  {/* Sand Background Circle with Uniform Grey Border */}
                  <circle 
                    cx={x} cy={y} r="34" 
                    fill="#FAF7F0" 
                    stroke="#B8B2A7" 
                    strokeWidth="1.75" 
                    style={{ transition: 'stroke 0.25s, fill 0.25s', filter: 'drop-shadow(0 6px 18px rgba(0,0,0,0.28))' }} 
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as SVGCircleElement
                      el.style.fill = '#F2EAD8'
                      el.style.stroke = '#8C8578'
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as SVGCircleElement
                      el.style.fill = '#FAF7F0'
                      el.style.stroke = '#B8B2A7'
                    }}
                  />
                  {/* Word inside with dark readable color */}
                  <text 
                    x={x} 
                    y={y + 4.5} 
                    textAnchor="middle" 
                    fontFamily="'Instrument Sans', sans-serif" 
                    fontSize="11.5" 
                    fontWeight="600" 
                    fill="#202920" 
                    letterSpacing="-0.01em" 
                    style={{ pointerEvents: 'none' }}
                  >
                    {label}
                  </text>
                </g>
              </g>
            ))}
          </svg>
        </div>
      </div>
    </section>
  )
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
function TestimonialsSection() {
  const testimonials = [
    { quote: "Cambium gives my research a place to live — not just a list of papers.", name: "Imthiyas", role: "Computer Vision Researcher", org: "MIT" },
    { quote: "The difference is that everything is connected to the work I'm actually doing.", name: "Arjun Rao", role: "PhD Researcher", org: "IISc" },
    { quote: "Finally, a research environment that understands how scholars actually work.", name: "Dr. Elena Park", role: "Computational Biology", org: "Stanford University" },
  ]

  return (
    <section style={{ background: C.bg, borderTop: `1px solid ${C.rule}`, padding: '120px 88px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <h2 style={{ fontFamily: "'Source Serif 4', serif", fontSize: 'clamp(28px, 3vw, 44px)', fontWeight: 400, letterSpacing: '-0.03em', color: C.charcoal }}>
            Built around the way research actually happens.
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {testimonials.map(({ quote, name, role, org }) => (
            <div key={name} style={{ padding: '32px 28px', border: `1px solid ${C.rule}`, borderRadius: 8, background: C.bg }}>
              <div style={{ fontSize: 36, fontFamily: "'Source Serif 4', serif", color: C.moss, lineHeight: 1, marginBottom: 12, opacity: 0.4 }}>"</div>
              <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: 17, lineHeight: 1.6, color: C.charcoal, marginBottom: 24, fontStyle: 'italic', letterSpacing: '-0.01em' }}>
                {quote}
              </p>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: C.mossLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: C.mossMid }}>
                  {name.split(' ').map(w => w[0]).filter((_, i) => i < 2).join('')}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.charcoal }}>{name}</div>
                  <div style={{ fontSize: 12, color: C.tertiary }}>{role} · {org}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p style={{ textAlign: 'center', fontSize: 12, color: C.tertiary, marginTop: 24 }}>Personas shown are illustrative and not claims of real customers.</p>
      </div>
    </section>
  )
}

// ─── Final CTA ────────────────────────────────────────────────────────────────
function CTASection() {
  return (
    <section style={{ background: '#F0EEE8', borderTop: `1px solid ${C.rule}`, padding: '120px 88px', position: 'relative', overflow: 'hidden' }}>
      {/* Background ecosystem hint */}
      <div style={{ position: 'absolute', right: -100, top: '50%', transform: 'translateY(-50%)', width: 500, height: 400, opacity: 0.12, pointerEvents: 'none' }}>
        <EcosystemGraph />
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', color: C.moss, marginBottom: 28, textTransform: 'uppercase' }}>
          <span style={{ width: 20, height: 1, background: C.moss, display: 'inline-block' }} />
          CAMBIUM
          <span style={{ width: 20, height: 1, background: C.moss, display: 'inline-block' }} />
        </div>

        <h2 style={{ fontFamily: "'Source Serif 4', serif", fontSize: 'clamp(40px, 5vw, 72px)', fontWeight: 400, lineHeight: 1.08, letterSpacing: '-0.03em', color: C.charcoal, marginBottom: 24 }}>
          Your research deserves a home.
        </h2>

        <p style={{ fontSize: 18, lineHeight: 1.65, color: C.secondary, maxWidth: 520, margin: '0 auto 48px' }}>
          Build your academic identity. Discover what's next. Connect your ideas, people, and opportunities.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/sign-up"
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: '#F9F6F0',
              background: C.moss,
              border: `1px solid ${C.moss500}`,
              padding: '16px 32px',
              borderRadius: 8,
              cursor: 'pointer',
              letterSpacing: '-0.01em',
              transition: 'background 0.15s, transform 0.15s, box-shadow 0.15s',
              textDecoration: 'none',
              display: 'inline-block',
              boxShadow: '0 4px 16px rgba(26,77,56,0.25)',
            }}
            onMouseEnter={(e) => { const b = e.currentTarget; b.style.background = C.mossHover; b.style.transform = 'translateY(-1px)' }}
            onMouseLeave={(e) => { const b = e.currentTarget; b.style.background = C.moss; b.style.transform = '' }}
          >
            Create your research identity
          </Link>
          <Link
            href="/discover"
            style={{
              fontSize: 15,
              fontWeight: 500,
              color: C.moss,
              background: C.moss050,
              border: `1.5px solid ${C.borderStrong}`,
              padding: '16px 32px',
              borderRadius: 8,
              cursor: 'pointer',
              letterSpacing: '-0.01em',
              transition: 'all 0.15s',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = C.moss; (e.currentTarget as HTMLAnchorElement).style.background = C.mossLight }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = C.borderStrong; (e.currentTarget as HTMLAnchorElement).style.background = C.moss050 }}
          >
            Explore Cambium
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 7h8M8 4l3 3-3 3" /></svg>
          </Link>
        </div>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  const cols = [
    { heading: 'Product', links: [
      { label: 'Discover', href: '/discover' },
      { label: 'Research', href: '/publications' },
      { label: 'Opportunities', href: '/opportunities' },
      { label: 'Workspace', href: '/workspace' },
      { label: 'Portfolio', href: '/portfolio' },
    ]},
    { heading: 'Research', links: [
      { label: 'Papers', href: '/publications' },
      { label: 'Journals', href: '/publications' },
      { label: 'Conferences', href: '/discover' },
      { label: 'Grants', href: '/opportunities' },
      { label: 'Collaborations', href: '/discover' },
    ]},
    { heading: 'Company', links: [
      { label: 'About', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' },
    ]},
    { heading: 'Resources', links: [
      { label: 'Documentation', href: '/help' },
      { label: 'Research Guide', href: '/help' },
      { label: 'Help Center', href: '/help' },
    ]},
  ]

  return (
    <footer style={{ background: C.bg, borderTop: `1px solid ${C.rule}`, padding: '64px 88px 40px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr repeat(4, 1fr)', gap: 48, marginBottom: 56 }}>
          {/* Brand */}
          <div>
            <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 16, letterSpacing: '-0.03em', color: C.charcoal, display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#FAF7F0', border: '1px solid #E4DCCB', padding: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <img src="/logo.svg" alt="CAMBIUM Research Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <span style={{ textTransform: 'uppercase' }}>
                CAMBIUM <span style={{ fontWeight: 300, color: C.moss }}>RESEARCH</span>
              </span>
            </div>
            <p style={{ fontSize: 13, color: C.secondary, lineHeight: 1.6, maxWidth: 200 }}>The Research Operating System.</p>
          </div>

          {/* Link columns */}
          {cols.map(({ heading, links }) => (
            <div key={heading}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: C.moss, textTransform: 'uppercase', marginBottom: 16 }}>{heading}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    style={{ fontSize: 13, color: C.secondary, textDecoration: 'none', transition: 'color 0.1s' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = C.moss }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = C.secondary }}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 24, borderTop: `1px solid ${C.rule}`, flexWrap: 'wrap', gap: 16 }}>
          <span style={{ fontSize: 12, color: C.tertiary }}>© 2026 Cambium Research. All rights reserved.</span>
          <div style={{ display: 'flex', gap: 24 }}>
            {[
              { label: 'Terms of Service', href: '/terms' },
              { label: 'Privacy Policy', href: '/privacy' },
              { label: 'AI Disclaimer', href: '/disclaimer' },
              { label: 'Security & Help', href: '/help' },
            ].map(({ label, href }) => (
              <a key={label} href={href} style={{ fontSize: 12, color: C.secondary, textDecoration: 'none', transition: 'color 0.1s' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = C.moss }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = C.secondary }}>
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

// ─── Human-Crafted Application Framework Component ───────────────────────────
function StructuralSystem() {
  const [open, setOpen] = useState(true)

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-[#293E30] text-[#FAF7F0] p-3 rounded-full shadow-xl border border-[#66866A]/60 hover:scale-105 transition-all cursor-pointer shadow-[0_8px_24px_rgba(0,0,0,0.3)]"
        title="View Identity System"
        aria-label="View Identity System"
      >
        <User className="w-4 h-4 text-[#FAF7F0]" />
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 max-w-sm">
      <div className="bg-[#293E30]/95 text-[#FAF7F0] rounded-xl p-4 shadow-2xl border border-[#66866A]/60 flex items-center justify-between gap-4 w-full backdrop-blur-md transform transition-all duration-300 hover:scale-[1.01] shadow-[0_16px_40px_-8px_rgba(0,0,0,0.38)]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#3E6248] rounded-lg text-[#FAF7F0] border border-[#66866A]/40 shadow-xs">
            <User className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-sans text-xs font-semibold tracking-wide uppercase text-[#FAF7F0]">
              Identity System Active
            </span>
            <span className="font-sans text-[11px] text-[#C7D4C9] mt-0.5">
              Verified cryptographic ledger anchor
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 bg-[#FAF7F0] border border-[#E4DCCB] px-2.5 py-0.5 rounded-full text-[#293E30] shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3E6248] animate-pulse" />
            <span className="font-sans text-[10px] font-bold tracking-tight text-[#293E30]">Active</span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-[#C7D4C9] hover:text-[#FAF7F0] text-xs p-1 bg-transparent border-0 cursor-pointer ml-1 transition-colors"
            title="Dismiss"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [replayIntro, setReplayIntro] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("intro") === "1" || params.get("splash") === "1") {
        setReplayIntro(true);
      }
    }
  }, []);

  return (
    <div style={{ fontFamily: "var(--font-sans), 'Instrument Sans', system-ui, sans-serif", background: C.bg }}>
      <CambiumIntroPreloader forceShow={replayIntro} onComplete={() => setReplayIntro(false)} />
      <Nav />
      <Hero />
      <KnowledgeGraphSection />
      <TrustSection />
      <ProblemSection />
      <LifecycleSection />
      <IdentitySection />
      <WorkspaceSection />
      <CommunitySection />
      <ActivitySection />
      <OpportunitiesSection />
      <PaperSection />
      <CollaborationSection />
      <IntelligenceSection />
      <PortfolioSection />
      <EcosystemMapSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
      <StructuralSystem />
    </div>
  )
}
