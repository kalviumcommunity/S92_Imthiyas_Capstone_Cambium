"use client";

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import CambiumLogo from '@/components/CambiumLogo'
import { ArrowUpRight, User, AlertCircle, Sparkles, Check, Flame, Bookmark, FileText, Compass, Search, ExternalLink, ShieldCheck, Bell, Calendar as CalendarIcon, Plus, LayoutGrid, Shield, Database, Building2, Key, BookOpen, MessageSquare, HelpCircle, Settings, Share2, Heart } from 'lucide-react'
import { CambiumIntroPreloader } from '@/components/landing/CambiumIntroPreloader'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { useTheme } from '@/lib/theme-provider'
import { getNaturalScholarContributionLevel, getScholarContributionDetails, SCHOLAR_ACTIVITY_BADGES } from '@/lib/scholarHeatmap'

// ─── Design System Tokens (Cambium Master Living Materials System) ────────────
// ─── Design System Tokens (Cambium Master Living Materials System — 10/10 Production) ───
const C = {
  // Master Four Living Materials
  mineralSand: 'var(--color-mineral-sand, #F2EBDD)',
  livingAlgae: 'var(--color-living-algae, #66866A)',
  rootwood: 'var(--color-rootwood, #805B43)',
  forestInk: 'var(--color-forest-ink, #202920)',

  // Extended Color System
  parchment: 'var(--color-parchment, #FAF7F0)',
  limestone: 'var(--color-limestone, #E4DCCB)',
  sageMist: 'var(--color-sage-mist, #DCE6D7)',
  canopy: 'var(--color-canopy, #3E6248)',
  deepMoss: 'var(--color-deep-moss, #293E30)',
  loam: 'var(--color-loam, #B89A78)',
  barkGrey: 'var(--color-bark-grey, #62685E)',
  quietStone: 'var(--color-quiet-stone, #85877B)',

  // Accessibility-Hardened Living Algae & Accent Tokens
  livingAlgaeAccessible: 'var(--color-living-algae-accessible, #365F42)',
  textAccent: 'var(--color-text-accent, #3E6248)',
  textAccentHover: 'var(--color-text-accent-hover, #293E30)',

  // Semantic Status Tokens (All WCAG 2.2 AA Verified)
  statusSuccess: 'var(--color-status-success, #326B49)',
  statusWarning: 'var(--color-status-warning, #8A5A12)',
  statusError: 'var(--color-status-error, #B33D35)',
  statusInfo: 'var(--color-status-info, #365F8D)',
  statusNeutral: 'var(--color-status-neutral, #62685E)',

  // System Role Aliases
  bg: 'var(--color-parchment, #FAF7F0)',
  surfaceRaised: 'var(--card, #FFFFFF)',
  surfaceSunken: 'var(--color-mineral-sand, #F2EBDD)',
  surface2: 'var(--color-limestone, #E4DCCB)',
  charcoal: 'var(--color-forest-ink, #202920)',
  secondary: 'var(--color-bark-grey, #62685E)',
  secondarySubtle: 'var(--color-bark-grey, #62685E)',
  tertiary: 'var(--color-quiet-stone, #85877B)',
  rule: 'var(--color-limestone, #E4DCCB)',
  borderStrong: 'var(--color-living-algae, #66866A)',
  moss: 'var(--color-canopy, #3E6248)',
  moss500: 'var(--color-living-algae, #66866A)',
  mossLight: 'var(--color-sage-mist, #DCE6D7)',
  moss050: 'var(--color-mineral-sand, #F2EBDD)',
  mossMid: 'var(--color-canopy, #3E6248)',
  mossHover: 'var(--color-text-accent-hover, #293E30)',
  darkBg: 'var(--color-deep-moss, #18231B)',
  darkSurface: 'var(--card, #18231B)',
  darkBorder: 'var(--color-limestone, #233327)',
  crimson: 'var(--color-status-error, #B33D35)',
}

// ─── Navigation (Mathematically Aligned Optical Grid & WCAG 2.2 Touch Targets) ───
function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header className="w-full border-b border-[#E4DCCB] dark:border-[#233327] bg-[#FAF7F0]/90 dark:bg-[#0E140F]/90 backdrop-blur-md sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand Architecture */}
        <CambiumLogo size="md" href="/" />

        {/* Core Navigation - Balanced Optical Centering with WCAG 2.2 Touch Targets */}
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
              className="font-sans text-[14px] font-[450] text-[#4A5246] dark:text-[#A3B899] hover:text-[#202920] dark:hover:text-[#EDEAE2] tracking-[-0.01em] transition-colors duration-200 relative py-2 px-1 inline-flex items-center min-h-[36px] min-w-[24px] after:absolute after:bottom-[-20px] after:left-0 after:w-full after:h-[2px] after:bg-[#3E6248] dark:after:bg-[#4ADE80] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 no-underline"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Action Threshold with Cambium Aligned Theme Toggle */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          <Link 
            href="/sign-in" 
            className="font-sans text-[14px] font-medium text-[#4A5246] dark:text-[#A3B899] hover:text-[#202920] dark:hover:text-[#EDEAE2] transition-colors no-underline py-2 px-2 inline-flex items-center min-h-[36px] min-w-[24px]"
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="bg-[#3E6248] hover:bg-[#293E30] dark:bg-[#4ADE80] dark:hover:bg-[#22C55E] text-[#FAF7F0] dark:text-[#0E140F] px-5 py-2.5 rounded-full font-sans text-xs font-semibold tracking-wide uppercase shadow-sm shadow-[#3E6248]/20 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 inline-flex items-center justify-center min-h-[36px] text-center no-underline border border-[#66866A]/30 dark:border-[#4ADE80]/30"
          >
            Create Identity
          </Link>
        </div>

        {/* Mobile menu button with 44x44px touch target */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle variant="minimal" />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 text-[#202920] dark:text-[#EDEAE2] bg-transparent border-0 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="3" y1="7" x2="21" y2="7" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="17" x2="21" y2="17" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="md:hidden border-t border-[#E4DCCB] dark:border-[#233327] bg-[#FAF7F0] dark:bg-[#0E140F] px-6 py-6 space-y-4">
          {['Discover', 'Community', 'Opportunity', 'Research'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              onClick={() => setMenuOpen(false)}
              className="block text-[15px] font-medium text-[#62685E] dark:text-[#A3B899] hover:text-[#202920] dark:hover:text-[#EDEAE2] no-underline"
            >
              {item}
            </a>
          ))}
          <div className="pt-4 border-t border-[#E4DCCB] dark:border-[#233327] flex flex-col gap-3">
            <div className="flex items-center justify-between py-1">
              <span className="text-xs font-mono uppercase tracking-wider text-[#62685E] dark:text-[#A3B899]">Appearance Mode</span>
              <ThemeToggle />
            </div>
            <Link href="/sign-in" className="text-sm font-medium text-[#202920] dark:text-[#EDEAE2] no-underline">Sign in</Link>
            <Link href="/sign-up" className="bg-[#3E6248] dark:bg-[#4ADE80] text-[#FAF7F0] dark:text-[#0E140F] px-4 py-2.5 rounded-full text-xs font-semibold text-center uppercase no-underline">Create Identity</Link>
          </div>
        </div>
      )}
    </header>
  )
}

// ─── Hero Ecosystem Graph (Living Interactive Network) ─────────────────────────
function EcosystemGraph({ dark, selectedCategory = 'all' }: { dark?: boolean; selectedCategory?: string }) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const { resolvedTheme } = useTheme()
  const isDark = dark !== undefined ? dark : resolvedTheme === 'dark'

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

  const textColor = isDark ? '#EDEAE2' : '#202920'
  const subColor = isDark ? '#A3B899' : '#62685E'
  const cardBg = isDark ? '#18231B' : '#FFFFFF'
  const cardBorder = isDark ? '#233327' : '#E4DCCB'

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
                    borderLeft: `1px solid ${isHovered ? node.color : (isCenter ? node.color + '88' : cardBorder)}`,
                    borderRight: `1px solid ${isHovered ? node.color : (isCenter ? node.color + '88' : cardBorder)}`,
                    borderBottom: `1px solid ${isHovered ? node.color : (isCenter ? node.color + '88' : cardBorder)}`,
                    borderTop: `2.5px solid ${node.color}`,
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
    <section className="w-full bg-[#FAF7F0] dark:bg-[#0E140F] min-h-[calc(100vh-80px)] flex flex-col justify-between pt-8 md:pt-14 pb-8 md:pb-10 px-6 relative overflow-hidden border-b border-[#E4DCCB] dark:border-[#233327] transition-colors duration-200">
      {/* Subtle organic radial glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_75%_35%,rgba(62,98,72,0.06)_0%,transparent_65%)] dark:bg-[radial-gradient(circle_at_75%_35%,rgba(74,222,128,0.08)_0%,transparent_65%)]" />

      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col justify-center">
        {/* Asymmetric 7/5 Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start my-auto">
          {/* Left Column: Semantic Typographic Statement (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#E4DCCB] dark:border-[#233327] bg-[#F2EBDD] dark:bg-[#131C15] mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3E6248] dark:bg-[#4ADE80] animate-pulse" />
              <span className="font-sans text-[11px] font-semibold tracking-wider text-[#3E6248] dark:text-[#4ADE80] uppercase">
                The Research Operating System
              </span>
            </div>

            <h1 className="font-serif text-[clamp(2.75rem,5.6vw,4.75rem)] text-[#202920] dark:text-[#EDEAE2] font-normal leading-[1.08] tracking-tight mb-8">
              Your research <br />
              <span className="italic text-[#3E6248] dark:text-[#4ADE80]">world, connected.</span>
            </h1>

            {/* Three Pillar Metadata Anchors */}
            <div className="flex items-center gap-8 pt-4 border-t border-[#E4DCCB] dark:border-[#233327] w-full max-w-lg">
              {[
                ['Academic', 'Identity'],
                ['Research', 'Workspace'],
                ['Intelligent', 'Discovery'],
              ].map(([sub, label]) => (
                <div key={label}>
                  <div className="font-sans text-xs uppercase tracking-wider text-[#62685E] dark:text-[#A3B899] font-medium">{sub}</div>
                  <div className="font-serif text-base font-semibold text-[#202920] dark:text-[#EDEAE2] mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Narrative Context & Actions (5 Cols) */}
          <div className="lg:col-span-5 lg:pt-8 flex flex-col items-start gap-8">
            <p className="font-sans text-[17px] md:text-[19px] font-normal text-[#202920]/90 dark:text-[#EDEAE2]/90 leading-[1.62] tracking-normal">
              Discover ideas, build your academic identity, collaborate with researchers, explore opportunities, and organize the knowledge behind your work — all in one living research environment.
            </p>

            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <Link
                href="/sign-up"
                className="w-full sm:w-auto bg-[#3E6248] hover:bg-[#293E30] dark:bg-[#4ADE80] dark:hover:bg-[#22C55E] text-[#FAF7F0] dark:text-[#0E140F] px-8 py-4 rounded-xl font-sans text-sm font-semibold tracking-tight transition-all shadow-md shadow-[#3E6248]/25 hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2 group no-underline border border-[#66866A]/40 dark:border-[#4ADE80]/40"
              >
                <span>Get started — it's free</span>
                <ArrowUpRight className="w-4 h-4 text-[#FAF7F0]/80 dark:text-[#0E140F]/80 group-hover:text-[#FAF7F0] dark:group-hover:text-[#0E140F] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
              <a
                href="#knowledge-network"
                className="w-full sm:w-auto border border-[#E4DCCB] dark:border-[#233327] hover:border-[#3E6248] dark:hover:border-[#4ADE80] text-[#202920] dark:text-[#EDEAE2] hover:bg-[#F2EBDD] dark:hover:bg-[#131C15] px-8 py-4 rounded-xl font-sans text-sm font-medium transition-colors bg-[#FAF7F0] dark:bg-[#0E140F] flex items-center justify-center no-underline"
              >
                Explore Cambium
              </a>
            </div>
          </div>
        </div>

        {/* Scholarly Verification Ledger Strip (Stripe Press / Nature grade evidence metrics) */}
        <div className="mt-10 lg:mt-12 pt-6 border-t border-[#E4DCCB] dark:border-[#233327] grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
          <div>
            <div className="font-serif text-2xl md:text-3xl font-normal text-[#202920] dark:text-[#EDEAE2]">120M+</div>
            <div className="font-sans text-xs uppercase tracking-wider text-[#3E6248] dark:text-[#4ADE80] font-semibold mt-1">Indexed Publications</div>
            <div className="font-mono text-[11px] text-[#85877B] dark:text-[#7E8B7B] mt-0.5 flex items-center gap-1.5">
              <span>Crossref · PubMed · arXiv</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#326B49] dark:bg-[#4ADE80] inline-block" title="Verified Pipeline" />
            </div>
          </div>
          <div>
            <div className="font-serif text-2xl md:text-3xl font-normal text-[#202920] dark:text-[#EDEAE2]">85,000+</div>
            <div className="font-sans text-xs uppercase tracking-wider text-[#3E6248] dark:text-[#4ADE80] font-semibold mt-1">Active Opportunities</div>
            <div className="font-mono text-[11px] text-[#85877B] dark:text-[#7E8B7B] mt-0.5 flex items-center gap-1.5">
              <span>NSF · NIH · ERC Grants</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#326B49] dark:bg-[#4ADE80] inline-block" title="Daily Sync" />
            </div>
          </div>
          <div>
            <div className="font-serif text-2xl md:text-3xl font-normal text-[#202920] dark:text-[#EDEAE2]">4.8M</div>
            <div className="font-sans text-xs uppercase tracking-wider text-[#3E6248] dark:text-[#4ADE80] font-semibold mt-1">Verified Researchers</div>
            <div className="font-mono text-[11px] text-[#85877B] dark:text-[#7E8B7B] mt-0.5 flex items-center gap-1.5">
              <span>ORCID Anchor · Cryptographic</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#326B49] dark:bg-[#4ADE80] inline-block" title="Cryptographically Anchored" />
            </div>
          </div>
          <div>
            <div className="font-serif text-2xl md:text-3xl font-normal text-[#202920] dark:text-[#EDEAE2]">100%</div>
            <div className="font-sans text-xs uppercase tracking-wider text-[#3E6248] dark:text-[#4ADE80] font-semibold mt-1">Evidence-Linked</div>
            <div className="font-mono text-[11px] text-[#85877B] dark:text-[#7E8B7B] mt-0.5 flex items-center gap-1.5">
              <span>Inspectable Citations & DOIs</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#326B49] dark:bg-[#4ADE80] inline-block" title="Claim-Level Traceability" />
            </div>
          </div>
        </div>

        {/* Scroll invitation to living knowledge network with live pipeline status */}
        <div className="mt-6 pt-4 flex items-center justify-between border-t border-[#E4DCCB]/60 dark:border-[#233327]/60 flex-wrap gap-3">
          <a
            href="#knowledge-network"
            className="inline-flex items-center gap-2 font-mono text-xs text-[#4A5246] dark:text-[#A3B899] hover:text-[#3E6248] dark:hover:text-[#4ADE80] transition-colors no-underline group cursor-pointer py-1"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#66866A] dark:bg-[#4ADE80] group-hover:scale-125 transition-transform" />
            <span>Explore Relational Knowledge Network</span>
            <span className="group-hover:translate-y-0.5 transition-transform">↓</span>
          </a>
          <div className="flex items-center gap-2 font-mono text-[10.5px] text-[#85877B] dark:text-[#7E8B7B] uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#326B49] dark:bg-[#4ADE80] animate-pulse" />
            <span>SCHOLARLY LEDGER: LIVE PIPELINE SYNCHRONIZED</span>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Living Knowledge Network Section (Photo 2 Dedicated Showcase) ───────────
function KnowledgeGraphSection() {
  const [graphCategory, setGraphCategory] = useState('all')

  return (
    <section id="knowledge-network" style={{ background: C.darkBg, borderTop: '1px solid rgba(46,125,79,0.35)', borderBottom: '1px solid rgba(46,125,79,0.35)', padding: '96px 24px', position: 'relative' }}>
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
          <div className="flex flex-col md:items-end gap-3 max-w-xl">
            <p className="font-sans text-base text-[rgba(245,244,240,0.72)] leading-relaxed m-0">
              Research grows at the intersections. Explore how papers, collaborators, funding streams, and foundational models connect organically across scientific disciplines.
            </p>
            <div className="flex items-center gap-4 flex-wrap">
              <span className="font-mono text-xs text-[rgba(245,244,240,0.55)]">
                Integrated across platform at /graph & /intelligence
              </span>
              <Link
                href="/graph"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[#4ADE80] hover:text-white transition-colors underline underline-offset-4"
              >
                Launch Constellation Explorer ↗
              </Link>
            </div>
          </div>
        </div>

        {/* Integrated Relational Node Graph Exhibition Canvas (Sandal/Sand Box) */}
        <div className="w-full rounded-2xl border border-[#E4DCCB] bg-[#FAF7F0] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.45),0_4px_16px_rgba(0,0,0,0.2)] p-4 md:p-8 relative overflow-hidden transition-colors">
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
                  className={`text-[11px] font-sans px-3.5 py-1.5 min-h-[28px] rounded-full border transition-all cursor-pointer inline-flex items-center justify-center ${
                    graphCategory === id
                      ? 'bg-[#254A34] text-[#FAF7F0] border-[#254A34] font-semibold shadow-xs'
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
            <EcosystemGraph selectedCategory={graphCategory} />
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
    <section className="bg-[#F2EBDD] dark:bg-[#131C15] border-t border-b border-[#E4DCCB] dark:border-[#233327] py-16 px-6 md:px-16 transition-colors duration-200">
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div className="text-center mb-12">
          <p className="text-xs font-semibold tracking-wider text-[#85877B] dark:text-[#7E8B7B] uppercase mb-4">Built for</p>
          <h2 style={{ fontFamily: "'Source Serif 4', serif" }} className="text-3xl md:text-4xl font-normal text-[#202920] dark:text-[#EDEAE2] tracking-tight">
            The people moving research forward.
          </h2>
        </div>
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map(({ icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2.5 px-5 py-3 border border-[#E4DCCB] dark:border-[#233327] rounded-full text-sm font-medium text-[#62685E] dark:text-[#A3B899] bg-white dark:bg-[#18231B] transition-colors cursor-default hover:border-[#3E6248] dark:hover:border-[#4ADE80] hover:text-[#202920] dark:hover:text-[#EDEAE2]"
            >
              <span className="text-[#3E6248] dark:text-[#4ADE80] text-xs">{icon}</span>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Problem Section (Fragmented vs Connected — Photo 4 Aligned) ─────────
function ProblemSection() {
  const fragmentedSources = [
    'Papers', 'Grants', 'Conferences',
    'Journals', 'Researchers', 'Datasets',
    'Labs'
  ]

  return (
    <section className="bg-[#FAF7F0] dark:bg-[#0E140F] py-24 px-6 md:px-16 border-t border-[#E4DCCB] dark:border-[#233327] transition-colors duration-200">
      <div className="max-w-[1240px] mx-auto">
        <div className="max-w-2xl mb-16">
          <h2 style={{ fontFamily: "'Source Serif 4', serif" }} className="text-3xl md:text-5xl font-normal text-[#202920] dark:text-[#EDEAE2] tracking-tight leading-tight mb-5">
            Research shouldn&apos;t begin with twenty browser tabs.
          </h2>
          <p className="text-base md:text-lg text-[#62685E] dark:text-[#A3B899] leading-relaxed">
            Research information is scattered across publications, funding portals, conference websites, academic profiles, spreadsheets, documents, and communities.
          </p>
        </div>

        {/* Fragmented → Connected Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1.1fr] items-center gap-8 md:gap-12">
          {/* Left Column: Fragmented */}
          <div>
            <div className="font-mono text-[11px] font-bold uppercase tracking-widest text-[#62685E] dark:text-[#A3B899] mb-5">
              FRAGMENTED
            </div>
            <div className="grid grid-cols-3 gap-3">
              {fragmentedSources.map((s, idx) => (
                <div
                  key={s}
                  className={`bg-white dark:bg-[#18231B] border border-[#E4DCCB] dark:border-[#233327] rounded-xl px-4 py-3.5 text-center text-xs font-semibold text-[#62685E] dark:text-[#A3B899] shadow-xs hover:border-[#3E6248] dark:hover:border-[#4ADE80] hover:text-[#202920] dark:hover:text-[#EDEAE2] hover:bg-[#F2EBDD]/50 dark:hover:bg-[#131C15]/50 transition-all cursor-default select-none ${
                    idx === 6 ? 'col-span-1' : ''
                  }`}
                >
                  {s}
                </div>
              ))}
            </div>
          </div>

          {/* Center Transition Indicator: Arrow */}
          <div className="hidden lg:flex flex-col items-center justify-center px-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-[1.5px] bg-[#E4DCCB] dark:bg-[#233327]" />
              <div className="w-8 h-8 rounded-full border border-[#E4DCCB] dark:border-[#233327] bg-white dark:bg-[#18231B] flex items-center justify-center text-[#3E6248] dark:text-[#4ADE80] text-sm font-bold shadow-xs">
                →
              </div>
              <div className="w-16 h-[1.5px] bg-[#3E6248]/40 dark:bg-[#4ADE80]/40" />
            </div>
          </div>

          {/* Right Column: Connected */}
          <div>
            <div className="font-mono text-[11px] font-bold uppercase tracking-widest text-[#3E6248] dark:text-[#4ADE80] mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3E6248] dark:bg-[#4ADE80]" />
              CONNECTED
            </div>
            <div className="bg-white dark:bg-[#18231B] border border-[#E4DCCB] dark:border-[#233327] border-t-2 border-t-[#3E6248] dark:border-t-[#4ADE80] rounded-2xl p-7 md:p-9 shadow-sm hover:shadow-md transition-all">
              {/* Product Logo / Brand Lockup */}
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-7 h-7 rounded-full bg-[#DCE6D7] dark:bg-[#1A281E] border border-[#3E6248]/30 dark:border-[#4ADE80]/30 flex items-center justify-center text-[#3E6248] dark:text-[#4ADE80] text-sm font-bold">
                  ◎
                </div>
                <div className="font-sans font-bold text-base tracking-tight text-[#202920] dark:text-[#EDEAE2] uppercase flex items-center gap-1.5">
                  CAMBIUM <span className="font-light text-[#3E6248] dark:text-[#4ADE80]">RESEARCH</span>
                </div>
              </div>

              {/* Unified Connected Pills */}
              <div className="flex flex-wrap gap-2.5">
                {fragmentedSources.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-[#DCE6D7] dark:bg-[#1A281E] text-[#3E6248] dark:text-[#4ADE80] rounded-lg border border-[#3E6248]/20 dark:border-[#4ADE80]/30 transition-transform hover:scale-105 cursor-default"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#3E6248] dark:bg-[#4ADE80]" />
                    {s}
                  </span>
                ))}
              </div>

              <p className="text-sm text-[#3A4138] dark:text-[#A3B899] mt-6 leading-relaxed font-sans">
                Everything your research touches, in one living environment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


// ─── Lifecycle Section (Fully Interactive 7-Stage Stepper & Live Module Links) ───
function LifecycleSection() {
  const [activeStage, setActiveStage] = useState(0)

  const stages = [
    {
      name: 'Discover',
      tagline: 'Formulate questions & surface hidden connections',
      desc: 'Explore literature with semantic neural synthesis, identify emerging frontier topics, and track citation cascades across 120M+ indexed research papers.',
      metrics: ['120M+ Papers Indexed', 'Semantic Citation Synthesis', 'Daily Frontier Alerts'],
      action: 'Query cross-disciplinary literature across Bio & AI',
      targetRoute: '/discover',
      targetLabel: 'Discover Console',
      accent: '#1A4D38',
    },
    {
      name: 'Explore',
      tagline: 'Trace citation networks & comparative methodologies',
      desc: 'Deconstruct methodologies, compare experimental benchmarks across disciplines, and map citation cascades across decades of scholarship using the interactive knowledge graph and AI agent reader.',
      metrics: ['Method Lineage Trees', 'Agent Reader Deep Dives', 'Co-citation Proximity'],
      action: 'Compare transformer architectures for scientific data',
      targetRoute: '/graph',
      targetLabel: 'Constellation Graph & Reader',
      accent: '#256346',
    },
    {
      name: 'Connect',
      tagline: 'Find synergistic co-authors, labs & grants',
      desc: 'Match with researchers working on complementary problems, discover high-synergy laboratory groups, and track competitive funding calls across institutional boundaries.',
      metrics: ['Institutional Graph', 'Collaborator Matching', 'Peer Review Registry'],
      action: 'Find active labs working on multimodal biomedical vision',
      targetRoute: '/lab',
      targetLabel: 'Lab Workspace & Peer Review',
      accent: '#1E5638',
    },
    {
      name: 'Work',
      tagline: 'Organize notes, code, datasets & experimental logs',
      desc: 'A structured, bi-directional research workspace that brings literature notes, experimental hypotheses, and collaborative drafts into one living canvas with conflict-free multi-user editing.',
      metrics: ['Bi-directional Linking', 'Conflict-Free Sync', 'Zotero & BibTeX Sync'],
      action: 'Open structured literature matrix with live citations',
      targetRoute: '/workspace',
      targetLabel: 'Research Workspace',
      accent: '#1A4D38',
    },
    {
      name: 'Publish',
      tagline: 'Author camera-ready papers & preprints seamlessly',
      desc: 'Prepare manuscripts with automated citation verification, institutional formatting templates, double-blind peer review desks, and camera-ready exports for top venues.',
      metrics: ['Automated Reference Formatting', 'Double-Blind Peer Review', 'IRB & Compliance Checks'],
      action: 'Compile camera-ready submission for NeurIPS or Nature',
      targetRoute: '/publications',
      targetLabel: 'Publications & Peer Review',
      accent: '#285C42',
    },
    {
      name: 'Share',
      tagline: 'Distribute datasets, models & findings to the community',
      desc: 'Disseminate your preprints, interactive benchmarks, and supplementary data with verified digital object identifiers (DOIs) and FAIR-compliant data management plans.',
      metrics: ['Permanent DOI Minting', 'FAIR Data Repositories', 'Open Access Distribution'],
      action: 'Publish benchmark dataset with interactive visualization',
      targetRoute: '/data-management',
      targetLabel: 'FAIR Data Bridge',
      accent: '#1A4D38',
    },
    {
      name: 'Grow',
      tagline: 'Compound intellectual capital & academic reputation',
      desc: 'Track real-time citation velocity, downstream patents and clinical impacts, active funding renewals, and maintain an ORCID-verified academic portfolio with GitHub-style research cadence.',
      metrics: ['Citation Velocity Metrics', 'ORCID Verified Profile', '52-Week Cadence Heatmap'],
      action: 'Generate holistic academic impact report',
      targetRoute: '/portfolio',
      targetLabel: 'Scholar Portfolio & Grants',
      accent: '#123927',
    },
  ]

  const current = stages[activeStage]

  return (
    <section id="discover" style={{ background: C.darkBg, borderTop: '1px solid rgba(46,125,79,0.35)', borderBottom: '1px solid rgba(46,125,79,0.35)', padding: '112px 24px', position: 'relative' }}>
      {/* Subtle organic ambient glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_25%,rgba(46,204,113,0.06)_0%,transparent_70%)]" />

      <div style={{ maxWidth: 1280, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: '#4ADE80', textTransform: 'uppercase', marginBottom: 16 }}>
          Scholarly Workflow Engine
        </p>
        <h2 style={{ fontFamily: "'Source Serif 4', serif" }} className="text-3xl md:text-5xl font-normal text-[#F5F4F0] tracking-tight mb-4">
          One system for the entire research lifecycle.
        </h2>
        <p className="text-base text-[rgba(245,244,240,0.72)] mb-14 max-w-xl mx-auto leading-relaxed">
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
                  className="flex flex-col items-center gap-3 px-3 cursor-pointer bg-transparent border-0 outline-none transition-all"
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                      isSelected
                        ? "border-2 border-[#4ADE80] bg-[#3E6248] text-white scale-110 shadow-md ring-4 ring-[#4ADE80]/25"
                        : isPast
                        ? "border-2 border-[#66866A] bg-[#202920] text-[#86EFAC]"
                        : "border border-white/20 bg-white/5 text-[rgba(245,244,240,0.45)]"
                    }`}
                  >
                    {isPast ? '✓' : i + 1}
                  </div>
                  <span
                    className={`text-xs transition-colors ${
                      isSelected
                        ? "font-bold text-white"
                        : "font-medium text-[rgba(245,244,240,0.65)]"
                    }`}
                  >
                    {stage.name}
                  </span>
                </button>

                {i < stages.length - 1 && (
                  <div
                    className={`w-8 h-[2px] mb-6 transition-all ${
                      i < activeStage ? "bg-[#66866A]" : "bg-white/15"
                    }`}
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* Dynamic Stage Details Preview Panel (Luminous High-contrast Card) */}
        <div className="max-w-3xl mx-auto bg-white border border-[#2A5A3B] border-t-4 border-t-[#4ADE80] rounded-2xl p-8 sm:p-10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.45),0_4px_16px_rgba(0,0,0,0.2)] text-left transition-all">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <span className="text-[11px] font-mono font-bold tracking-wider text-[#264A35] uppercase bg-[#D9E5D6] px-3 py-1 rounded-md border border-[#264A35]/20">
              STAGE 0{activeStage + 1} OF 07 · {current.name.toUpperCase()}
            </span>
            <span className="text-xs text-[#71786E] italic">
              {current.tagline}
            </span>
          </div>

          <p className="text-base leading-relaxed text-[#202920] mb-6 font-sans">
            {current.desc}
          </p>

          <div className="flex items-center justify-between flex-wrap gap-4 pt-5 border-t border-[#EBE4D5]">
            <div className="flex gap-2 flex-wrap">
              {current.metrics.map((m) => (
                <span key={m} className="text-xs font-medium px-3.5 py-1.5 rounded-lg bg-[#F1EAD9] border border-[#E2D7C3] text-[#3A433D]">
                  {m}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-3.5 flex-wrap">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#264A35]">
                <span>Sample action:</span>
                <span className="text-[#202920] font-normal">"{current.action}"</span>
              </div>
              <Link
                href={current.targetRoute}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#3E6248] hover:bg-[#293E30] text-white text-xs font-semibold uppercase tracking-wider no-underline transition-all shadow-xs"
              >
                Inspect Live Module: {current.targetLabel} ↗
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Academic Identity Section (Photo 3 Verified Scholar Portfolio Preview) ───
function IdentitySection() {
  const [activeTab, setActiveTab] = useState<'Heatmap' | 'Pinned' | 'Publications'>('Heatmap')
  const interests = ['Medical AI', 'Computer Vision', 'Foundation Models', 'Federated Learning']
  const metrics = [
    { v: '27', l: 'Publications' },
    { v: '1,842', l: 'Citations' },
    { v: '14', l: 'h-index' },
    { v: '34', l: 'Collaborators' },
  ]

  // Organic, scattered scholarly contribution heatmap modeling real research momentum
  const weeks = 36
  const days = 7
  const levelColors = ['#FAF7F0', '#DCE6D7', '#A3C4A8', '#66866A', '#3E6248']

  return (
    <section id="identity" className="bg-[#FAF7F0] dark:bg-[#0E140F] py-28 px-6 md:px-16 transition-colors duration-200">
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.25fr', gap: 72, alignItems: 'start' }}>
          {/* Left: copy */}
          <div style={{ paddingTop: 24 }}>
            <div className="inline-flex items-center gap-2 font-mono text-xs font-bold tracking-wider uppercase text-[#3E6248] dark:text-[#4ADE80] mb-4">
              <span className="w-2 h-2 rounded-full bg-[#3E6248] dark:bg-[#4ADE80] animate-pulse" />
              02 / Academic Identity & Scholar Ledger
            </div>
            <h2 style={{ fontFamily: "'Source Serif 4', serif" }} className="text-3xl md:text-5xl font-normal text-[#202920] dark:text-[#EDEAE2] tracking-tight leading-tight mb-6">
              More than a profile.<br />Your research identity.
            </h2>
            <p className="text-base text-[#62685E] dark:text-[#A3B899] mb-8 leading-relaxed max-w-xl">
              Your academic presence, verified publication record, live 52-week research cadence, peer review impact, and pinned artifacts — unified in an immutable scholarly portfolio that commands respect.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 36 }}>
              {[
                'ORCID-verified provenance & digital identifier sync',
                'GitHub-style 52-week research cadence & contribution ledger',
                'Interactive pinned artifacts with code, preprints & licenses',
                'Real-time citation velocity & institutional co-author graph',
                'Tenure dossier export & cryptographic portfolio anchors',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm text-[#62685E] dark:text-[#A3B899]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#3E6248] dark:bg-[#4ADE80] shrink-0" />
                  {item}
                </div>
              ))}
            </div>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#3E6248] hover:bg-[#293E30] dark:bg-[#4ADE80] dark:hover:bg-[#22C55E] text-white dark:text-[#0E140F] font-sans text-xs font-semibold uppercase tracking-wider transition-all shadow-xs no-underline"
            >
              Explore Live Scholar Portfolio Page ↗
            </Link>
          </div>

          {/* Right: Authentic Scholar Portfolio Component (Matching /portfolio) */}
          <div className="bg-white dark:bg-[#18231B] border border-[#E4DCCB] dark:border-[#233327] rounded-2xl overflow-hidden shadow-lg transition-all">
            {/* Rich Geometric Cover Banner with Lattice Line Art */}
            <div style={{
              height: 120,
              background: 'linear-gradient(135deg, #202920 0%, #2F4534 60%, #1E3827 100%)',
              position: 'relative',
              padding: '16px 24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}>
              <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" viewBox="0 0 800 200" fill="none">
                <path d="M0,100 C200,30 400,170 800,80 L800,200 L0,200 Z" fill="#DCE6D7" />
                <path d="M0,50 C200,150 500,20 800,120" stroke="#FAF7F0" strokeWidth="1.5" strokeDasharray="4 4" />
              </svg>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 10px',
                borderRadius: 999,
                background: 'rgba(255,255,255,0.12)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.2)',
                fontSize: 11,
                fontFamily: 'monospace',
                color: '#FAF7F0',
                position: 'relative',
                zIndex: 2,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ADE80' }} />
                ORCID: 0000-0002-1825-0097
              </div>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontFamily: 'monospace', position: 'relative', zIndex: 2 }}>
                Verified Scholar Node
              </span>
            </div>

            {/* Overlapping Profile Header */}
            <div className="px-6 pb-4 relative bg-white dark:bg-[#18231B] border-b border-[#E4DCCB] dark:border-[#233327]">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: -36, marginBottom: 16 }}>
                <div className="w-[72px] h-[72px] rounded-full bg-[#DCE6D7] dark:bg-[#1A281E] border-[3.5px] border-white dark:border-[#18231B] overflow-hidden flex items-center justify-center shadow-md shrink-0">
                  <img
                    src="/Profile.png"
                    alt="Imthiyas"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerText = 'IM';
                    }}
                  />
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="text-xs font-semibold text-white dark:text-[#0E140F] bg-[#3E6248] dark:bg-[#4ADE80] border-0 px-3.5 py-1.5 rounded-lg cursor-pointer">
                    Connect
                  </button>
                  <Link
                    href="/portfolio"
                    className="text-xs font-semibold text-[#202920] dark:text-[#EDEAE2] bg-[#FAF7F0] dark:bg-[#131C15] border border-[#E4DCCB] dark:border-[#233327] px-3 py-1.5 rounded-lg no-underline inline-flex items-center gap-1"
                  >
                    Full Profile ↗
                  </Link>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <h3 className="text-lg font-bold text-[#202920] dark:text-[#EDEAE2] tracking-tight m-0">
                    Imthiyas
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-[#DCE6D7] dark:bg-[#131C15] text-[#3E6248] dark:text-[#4ADE80] rounded uppercase">
                    Verified Fellow
                  </span>
                </div>
                <div className="text-xs text-[#3E463C] dark:text-[#A3B899] mt-1 font-medium">
                  PhD Researcher · Computer Vision & Medical AI
                </div>
                <div className="text-xs text-[#62685E] dark:text-[#7E8B7B] mt-0.5">
                  MIT Computer Science & CSAIL Affiliate · Stanford Bio-X Collaborator
                </div>

                <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
                  {interests.map((t) => (
                    <span key={t} className="text-[11px] font-medium px-2 py-0.5 bg-[#F2EBDD] dark:bg-[#131C15] border border-[#E4DCCB] dark:border-[#233327] text-[#3E6248] dark:text-[#4ADE80] rounded">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* 4 Impact Metrics Grid */}
              <div className="grid grid-cols-4 border-t border-[#E4DCCB] dark:border-[#233327] mt-4 pt-3">
                {metrics.map(({ v, l }, i) => (
                  <div key={l} className={`text-center py-1 ${i < metrics.length - 1 ? 'border-r border-[#E4DCCB] dark:border-[#233327]' : ''}`}>
                    <div className="text-base font-bold text-[#202920] dark:text-[#EDEAE2] tracking-tight">{v}</div>
                    <div className="text-[11px] text-[#85877B] dark:text-[#7E8B7B] mt-0.5">{l}</div>
                  </div>
                ))}
              </div>

              {/* Tabs */}
              <div style={{ display: 'flex', gap: 4, marginTop: 14 }}>
                {[
                  { id: 'Heatmap', label: '52-Wk Cadence' },
                  { id: 'Pinned', label: 'Pinned Artifacts' },
                  { id: 'Publications', label: 'Recent Publications' },
                ].map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id as any)}
                    className={`px-3 py-1.5 text-xs rounded-md border-0 cursor-pointer transition-all ${
                      activeTab === id
                        ? "bg-[#3E6248] dark:bg-[#4ADE80] text-white dark:text-[#0E140F] font-semibold"
                        : "bg-transparent text-[#62685E] dark:text-[#A3B899] font-normal hover:bg-[#FAF7F0] dark:hover:bg-[#131C15]"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Dynamic Tab Body */}
            <div className="p-5 bg-[#FAF7F0] dark:bg-[#131C15]">
              {activeTab === 'Heatmap' && (
                <div style={{ background: '#FFFFFF', border: '1px solid #E4DCCB', borderRadius: 12, padding: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 6 }}>
                    <div>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: '#202920' }}>
                        Scholarly Contribution & Momentum Ledger
                      </div>
                      <div style={{ fontSize: 11, color: '#62685E' }}>
                        1,482 verified commits, checkpoints & peer reviews in 52 weeks
                      </div>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#202920', background: '#DCE6D7', padding: '3px 8px', borderRadius: 999 }}>
                      🔥 18-Day Streak
                    </span>
                  </div>

                  {/* 36 Weeks Heatmap Visualization */}
                  <div style={{ overflowX: 'auto', paddingBottom: 2 }}>
                    <div style={{ display: 'flex', gap: 3.5, minWidth: 460 }}>
                      {Array.from({ length: weeks }).map((_, w) => (
                        <div key={w} style={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
                          {Array.from({ length: days }).map((_, d) => {
                            const details = getScholarContributionDetails(w, d)
                            return (
                              <div
                                key={d}
                                title={`Week ${w + 1}, Day ${d + 1}: ${details.label}`}
                                style={{
                                  width: 9.5,
                                  height: 9.5,
                                  borderRadius: 2,
                                  backgroundColor: levelColors[details.level],
                                  border: `1px solid ${details.level === 0 ? '#E4DCCB' : levelColors[details.level]}`,
                                }}
                              />
                            )
                          })}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 10.5, color: '#85877B', marginTop: 10, paddingTop: 8, borderTop: '1px solid #E4DCCB' }}>
                    <span>Cryptographic proof of continuous scientific inquiry</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3.5 }}>
                      <span>Less</span>
                      {levelColors.map((c, i) => (
                        <div key={i} style={{ width: 8, height: 8, borderRadius: 1.5, background: c, border: '1px solid #E4DCCB' }} />
                      ))}
                      <span>More</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'Pinned' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    {
                      title: 'foundation-medical-vision',
                      badge: 'Public Preprint · PyTorch',
                      desc: 'Lightweight Vision Transformer foundation model for zero-shot clinical tomography and multi-center MRI segmentation.',
                      citations: 148,
                      replications: 32,
                      license: 'Apache-2.0',
                    },
                    {
                      title: 'clinical-segmentation-fl',
                      badge: 'Published in MICCAI · MONAI',
                      desc: 'Federated learning pipeline preserving patient confidentiality across heterogeneous hospital imaging clusters.',
                      citations: 86,
                      replications: 24,
                      license: 'MIT',
                    },
                  ].map((art) => (
                    <div key={art.title} style={{ padding: 14, background: '#FFFFFF', border: '1px solid #E4DCCB', borderRadius: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#202920', fontFamily: 'monospace' }}>{art.title}</span>
                        <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 6px', background: '#DCE6D7', color: '#202920', borderRadius: 4 }}>{art.badge}</span>
                      </div>
                      <p style={{ fontSize: 12, color: '#62685E', lineHeight: 1.5, margin: '4px 0 8px' }}>{art.desc}</p>
                      <div style={{ display: 'flex', gap: 12, fontSize: 11, color: '#85877B' }}>
                        <span style={{ color: '#3E6248', fontWeight: 600 }}>↑ {art.citations} citations</span>
                        <span>{art.replications} replications</span>
                        <span style={{ fontFamily: 'monospace' }}>{art.license}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'Publications' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { title: 'Foundation Models for Medical Image Understanding', venue: 'Journal of Medical AI · 2026', citations: 148, doi: '10.1038/s41586-026-0042' },
                    { title: 'Federated Learning for Privacy-Preserving Clinical Segmentation', venue: 'MICCAI 2025 · Oral', citations: 86, doi: '10.1007/978-3-031-7234' },
                  ].map((p) => (
                    <div key={p.title} style={{ padding: 14, background: '#FFFFFF', border: '1px solid #E4DCCB', borderRadius: 10 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#202920', lineHeight: 1.4, marginBottom: 4 }}>{p.title}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#85877B' }}>
                        <span>{p.venue}</span>
                        <span style={{ color: '#3E6248', fontWeight: 600 }}>↑ {p.citations} citations</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Research Discover & Literature Console (Photo 2 Live Research Desk) ─────
function WorkspaceSection() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeAction, setActiveAction] = useState<string | null>(null)
  const [savedCards, setSavedCards] = useState<Record<string, boolean>>({})
  const [connectedScholars, setConnectedScholars] = useState<Record<string, boolean>>({
    'Dr. Aisha Rahman': false,
    'Prof. Jonas Keller': false,
    'Sophia Chen': false,
  })
  const [showQuickNote, setShowQuickNote] = useState(false)

  const toggleSave = (id: string) => {
    setSavedCards(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const toggleConnect = (name: string) => {
    setConnectedScholars(prev => ({ ...prev, [name]: !prev[name] }))
  }

  const actionPills = [
    { id: 'hypothesis', label: '+ New Hypothesis', note: 'Synthesizing novel hypothesis from Chapter 3 literature...' },
    { id: 'import', label: '↓ Import Literature', note: 'Importing literature batches from arXiv, bioRxiv & CrossRef...' },
    { id: 'refine', label: 'Refine Topics', note: 'Topic vectors recalibrated to Multimodal AI & Proteomics.' },
    { id: 'ai', label: '✦ Ask Cambium AI', note: 'Cambium Neural Assistant initialized and ready for research query.' },
  ]

  const cards = [
    {
      id: 'nsf',
      type: 'OPPORTUNITY',
      typeBg: 'bg-[#F4EFEA]',
      typeText: 'text-[#62685E]',
      match: '94% match',
      title: 'NSF Graduate Research Fellowship — Climate AI Track',
      desc: 'Applications open for the 2027 cohort. Strong alignment with your work on predictive ecological modeling and ML-driven climate data pipelines.',
      footer: 'Deadline: Oct 18, 2026 · $37,000/yr',
      href: '/opportunities',
    },
    {
      id: 'paper',
      type: 'PAPER',
      typeBg: 'bg-[#F4EFEA]',
      typeText: 'text-[#62685E]',
      match: '88% match',
      title: 'Emergent Representations in Sparse Transformer Architectures',
      desc: 'A preprint from DeepMind explores how sparse attention heads develop structured internal representations without explicit supervision — directly relevant to your Chapter 3.',
      footerLine1: 'Park et al. · DeepMind',
      footerLine2: 'arXiv · Sep 9, 2026',
      href: '/agent-reader',
    },
    {
      id: 'collab',
      type: 'COLLABORATION',
      typeBg: 'bg-[#F4EFEA]',
      typeText: 'text-[#62685E]',
      match: '91% match',
      title: 'Cross-disciplinary group: Language Models for Climate Risk',
      desc: 'A new working group at the intersection of NLP and climate science is forming ahead of NeurIPS 2026. 11 researchers already enrolled.',
      footer: 'Virtual · Kickoff Oct 2, 2026',
      href: '/community',
    },
    {
      id: 'dataset',
      type: 'DATASET',
      typeBg: 'bg-[#F4EFEA]',
      typeText: 'text-[#62685E]',
      match: '85% match',
      title: 'ERA5-ML: High-Resolution Reanalysis Embeddings (2000–2025)',
      desc: 'ECMWF releases a new embedding-first version of ERA5, pre-processed for direct ingestion into ML pipelines — covers the time range of your dissertation study.',
      footerLine1: 'ECMWF Copernicus Team',
      footerLine2: '6.4 TB · CC BY 4.0 · ecmwf.int',
      href: '/discover',
    },
  ]

  return (
    <section id="workspace" style={{ background: C.darkBg, borderTop: '1px solid rgba(46,125,79,0.35)', borderBottom: '1px solid rgba(46,125,79,0.35)', padding: '112px 24px', position: 'relative' }}>
      {/* Subtle organic ambient glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_25%,rgba(46,204,113,0.06)_0%,transparent_70%)]" />

      <div style={{ maxWidth: 1320, margin: '0 auto', position: 'relative', zIndex: 10 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div className="inline-flex items-center gap-2 font-mono text-xs font-bold tracking-wider uppercase text-[#4ADE80] mb-3">
            <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse" />
            01 / Literature Synthesis & Live Research Horizon
          </div>
          <h2 style={{ fontFamily: "'Source Serif 4', serif", fontSize: 'clamp(32px, 3.5vw, 48px)', fontWeight: 400, letterSpacing: '-0.03em' }} className="text-[#F5F4F0] mb-4">
            Your research has a home. Discover, synthesize, and organize.
          </h2>
          <p className="text-[16.5px] text-[rgba(245,244,240,0.72)] max-w-[660px] mx-auto leading-relaxed">
            An authentic glimpse into your live scholar console: synthesis pipelines, active grant deadlines, emerging preprints, and collaborative vectors unified in one cohesive space.
          </p>
        </div>

        {/* Authentic Live Research Desk with Uniform Outline and Subtle Shadow */}
        <div className="w-full overflow-x-auto pb-4">
          <div className="min-w-[1060px] max-w-[1320px] mx-auto rounded-2xl border border-[rgba(255,255,255,0.14)] bg-[#FAF7F0] overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.16),0_0_24px_rgba(0,0,0,0.22),0_4px_16px_rgba(0,0,0,0.18)] relative">
            {/* Top Header Bar */}
            <div className="px-5 py-3.5 bg-[#FAF7F0] dark:bg-[#131C15] border-b border-[#E4DCCB] dark:border-[#233327] flex items-center justify-between gap-4">
              {/* Left Brand / Desk Identifier */}
              <div className="flex items-center gap-2.5 shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3E6248] animate-pulse" />
                <span className="font-mono text-xs font-bold tracking-wider text-[#202920] uppercase">
                  LIVE RESEARCH DESK
                </span>
              </div>

              {/* Center Search Input */}
              <div className="flex-1 max-w-xl mx-auto flex items-center bg-white border border-[#E4DCCB] rounded-full px-4 py-2 shadow-xs gap-2.5">
                <Search size={15} className="text-[#85877B] shrink-0" />
                <input
                  type="text"
                  placeholder="Search 240M+ papers, researchers, topics, grants..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-xs text-[#202920] placeholder-[#85877B] font-sans"
                />
                <kbd className="font-mono text-[10px] text-[#85877B] bg-[#FAF7F0] border border-[#E4DCCB] px-1.5 py-0.5 rounded shrink-0">
                  ⌘K
                </kbd>
              </div>

              {/* Right Icons & User Profile Badge */}
              <div className="flex items-center gap-4 shrink-0">
                <button
                  className="p-1.5 text-[#62685E] hover:text-[#202920] transition-colors relative cursor-pointer"
                  title="Notifications"
                  onClick={() => setActiveAction('Viewing notifications: 3 unread items')}
                >
                  <Bell size={16} />
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#3E6248]" />
                </button>
                <button
                  className="p-1.5 text-[#62685E] hover:text-[#202920] transition-colors cursor-pointer"
                  title="AI Copilot"
                  onClick={() => setActiveAction('Cambium Neural AI Copilot active')}
                >
                  <Sparkles size={16} />
                </button>
                <div className="flex items-center gap-2.5 pl-2 border-l border-[#E4DCCB]">
                  <div className="w-8 h-8 rounded-full bg-[#DCE6D7] border border-[#3E6248]/30 flex items-center justify-center font-bold text-xs text-[#202920]">
                    IM
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-[#202920] leading-tight">Imthiyas</div>
                    <div className="text-[10px] text-[#85877B] font-mono leading-tight">MIT CSAIL · Postdoc</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Feedback Banner (Interactive Micro-State) */}
            {activeAction && (
              <div className="bg-[#DCE6D7] px-6 py-2 border-b border-[#3E6248]/20 flex items-center justify-between text-xs text-[#202920]">
                <div className="flex items-center gap-2">
                  <Sparkles size={13} className="text-[#3E6248]" />
                  <span className="font-medium">{activeAction}</span>
                </div>
                <button
                  onClick={() => setActiveAction(null)}
                  className="text-[#62685E] hover:text-[#202920] font-bold text-xs ml-4 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Main 3-Column Desktop Grid (Photo 2 Match: Left Rail + Center Desk + Right Aside) */}
            <div className="grid grid-cols-[54px_1fr_285px] divide-x divide-[#E4DCCB] dark:divide-[#233327] min-h-[640px] bg-[#FAF7F0] dark:bg-[#131C15]">
              {/* Col 1: Slim Left Sidebar Rail */}
              <aside className="w-[54px] bg-[#FAF7F0] dark:bg-[#131C15] py-4 flex flex-col items-center justify-between">
                <div className="flex flex-col items-center gap-3.5">
                  {/* Spiral brand icon */}
                  <div className="w-8 h-8 rounded-full bg-[#DCE6D7] flex items-center justify-center text-[#3E6248] mb-1">
                    <span className="font-bold text-sm">◎</span>
                  </div>
                  <div className="w-8 h-8 rounded-lg text-[#62685E] hover:text-[#202920] hover:bg-[#EAE5D9] transition-colors flex items-center justify-center cursor-pointer" title="Search">
                    <Search size={15} />
                  </div>
                  {/* Active Home/Dashboard Icon */}
                  <div className="w-8 h-8 rounded-lg bg-[#DCE6D7] text-[#3E6248] flex items-center justify-center cursor-pointer shadow-2xs" title="Live Research Desk">
                    <LayoutGrid size={15} />
                  </div>
                  <div className="w-8 h-8 rounded-lg text-[#62685E] hover:text-[#202920] hover:bg-[#EAE5D9] transition-colors flex items-center justify-center cursor-pointer" title="Explore">
                    <Compass size={15} />
                  </div>
                  <div className="w-8 h-8 rounded-lg text-[#62685E] hover:text-[#202920] hover:bg-[#EAE5D9] transition-colors flex items-center justify-center cursor-pointer" title="Constellation Graph">
                    <span className="text-sm">☊</span>
                  </div>
                  <div className="w-8 h-8 rounded-lg text-[#62685E] hover:text-[#202920] hover:bg-[#EAE5D9] transition-colors flex items-center justify-center cursor-pointer" title="AI Agents">
                    <Sparkles size={15} />
                  </div>
                  <div className="w-8 h-8 rounded-lg text-[#62685E] hover:text-[#202920] hover:bg-[#EAE5D9] transition-colors flex items-center justify-center cursor-pointer" title="Layers">
                    <span className="text-xs">☰</span>
                  </div>
                  <div className="w-8 h-8 rounded-lg text-[#62685E] hover:text-[#202920] hover:bg-[#EAE5D9] transition-colors flex items-center justify-center cursor-pointer" title="Community">
                    <User size={15} />
                  </div>
                  <div className="w-8 h-8 rounded-lg text-[#62685E] hover:text-[#202920] hover:bg-[#EAE5D9] transition-colors flex items-center justify-center cursor-pointer" title="Topics">
                    <span className="text-xs">🧠</span>
                  </div>
                  <div className="w-8 h-8 rounded-lg text-[#62685E] hover:text-[#202920] hover:bg-[#EAE5D9] transition-colors flex items-center justify-center cursor-pointer" title="Grid Apps">
                    <span className="text-xs">⊞</span>
                  </div>
                  <div className="w-8 h-8 rounded-lg text-[#62685E] hover:text-[#202920] hover:bg-[#EAE5D9] transition-colors flex items-center justify-center cursor-pointer" title="Grants">
                    <span className="text-xs font-bold">$</span>
                  </div>
                  <div className="w-8 h-8 rounded-lg text-[#62685E] hover:text-[#202920] hover:bg-[#EAE5D9] transition-colors flex items-center justify-center cursor-pointer" title="Literature">
                    <FileText size={15} />
                  </div>
                </div>

                <div className="flex flex-col items-center gap-3 pt-3 border-t border-[#E4DCCB] w-full">
                  <div className="w-8 h-8 rounded-lg text-[#62685E] hover:text-[#202920] hover:bg-[#EAE5D9] transition-colors flex items-center justify-center cursor-pointer" title="Help">
                    <HelpCircle size={15} />
                  </div>
                  <div className="w-8 h-8 rounded-lg text-[#62685E] hover:text-[#202920] hover:bg-[#EAE5D9] transition-colors flex items-center justify-center cursor-pointer" title="Settings">
                    <Settings size={15} />
                  </div>
                  <div className="w-7 h-7 rounded-full bg-[#202920] text-[#FAF7F0] flex items-center justify-center text-[10px] font-bold mt-1">
                    IM
                  </div>
                </div>
              </aside>

              {/* Col 2: Center Content Workspace */}
              <main className="p-7 overflow-hidden bg-[#FAF7F0] dark:bg-[#131C15] flex flex-col justify-between">
                <div>
                  {/* Greeting (Wednesday, October 7 — Photo 2 Match) */}
                  <div className="mb-6">
                    <h3 style={{ fontFamily: "'Source Serif 4', serif" }} className="text-3xl md:text-[38px] font-normal text-[#202920] tracking-tight leading-tight m-0">
                      Good evening, <span className="italic font-serif text-[#3E6248]">Imthiyas.</span>
                    </h3>
                    <p className="font-sans text-xs md:text-sm text-[#62685E] mt-1.5 mb-0">
                      Here is your live research synthesis and active scholarly horizon for Wednesday, October 7.
                    </p>
                  </div>

                  {/* 4 Interactive Action Buttons (Photo 2 Match) */}
                  <div className="flex items-center gap-2 flex-wrap mb-7">
                    {actionPills.map((action) => (
                      <button
                        key={action.id}
                        onClick={() => setActiveAction(action.note)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#E4DCCB] bg-white text-xs font-semibold text-[#202920] hover:border-[#3E6248] hover:bg-[#F2EBDD] transition-all cursor-pointer shadow-2xs"
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>

                  {/* Needs Your Attention Section Header */}
                  <div className="flex items-center justify-between mb-3.5">
                    <div>
                      <h4 style={{ fontFamily: "'Source Serif 4', serif" }} className="text-xl font-normal text-[#202920] m-0">
                        Needs your attention
                      </h4>
                      <p className="text-xs text-[#85877B] m-0 mt-0.5">
                        High-confidence matches for your active research vectors
                      </p>
                    </div>
                    <Link
                      href="/opportunities"
                      className="text-xs font-semibold text-[#3E6248] hover:text-[#202920] flex items-center gap-1 no-underline transition-colors"
                    >
                      View all 8 matches →
                    </Link>
                  </div>

                  {/* 2x2 Grid of Attention Cards (Photo 2 Match) */}
                  <div className="grid grid-cols-2 gap-4">
                    {cards.map((card) => {
                      const isSaved = savedCards[card.id]
                      return (
                        <div
                          key={card.id}
                          className="bg-white border border-[#E4DCCB] rounded-xl p-5 hover:border-[#3E6248] transition-all flex flex-col justify-between shadow-xs group"
                        >
                          <div>
                            {/* Type & Match Pills */}
                            <div className="flex items-center justify-between gap-2 mb-3">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${card.typeBg} ${card.typeText} tracking-wider`}>
                                {card.type}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-[#DCE6D7] text-[#3E6248] flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#3E6248]" />
                                  {card.match}
                                </span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    toggleSave(card.id)
                                  }}
                                  className="text-[#85877B] hover:text-[#202920] p-1 cursor-pointer"
                                  title={isSaved ? 'Saved' : 'Save'}
                                >
                                  <Bookmark size={13} className={isSaved ? 'fill-[#3E6248] text-[#3E6248]' : ''} />
                                </button>
                              </div>
                            </div>

                            {/* Card Title */}
                            <h5 className="font-sans text-[14.5px] font-bold text-[#202920] tracking-tight leading-snug mb-2 group-hover:text-[#3E6248] transition-colors">
                              {card.title}
                            </h5>

                            {/* Card Description */}
                            <p className="text-xs text-[#62685E] leading-relaxed mb-4">
                              {card.desc}
                            </p>
                          </div>

                          {/* Card Footer */}
                          <div className="pt-3 border-t border-[#FAF7F0] flex items-center justify-between text-[11px] font-sans text-[#85877B]">
                            {card.footer ? (
                              <span>{card.footer}</span>
                            ) : (
                              <div>
                                <div className="text-[11px] text-[#85877B]">{card.footerLine1}</div>
                                <div className="text-[10px] text-[#85877B]">{card.footerLine2}</div>
                              </div>
                            )}
                            <Link
                              href={card.href}
                              className="text-[#3E6248] hover:text-[#202920] font-sans font-semibold underline underline-offset-2 no-underline shrink-0 ml-2"
                            >
                              Explore ↗
                            </Link>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Sub-bar synchronization ledger */}
                <div className="pt-4 mt-4 border-t border-[#E4DCCB]/60 flex items-center justify-between text-[11px] text-[#85877B]">
                  <span>Scholarly Ledger synchronized with MIT CSAIL, NSF, and arXiv registries</span>
                  <Link href="/dashboard" className="text-[#3E6248] hover:text-[#202920] font-semibold no-underline">
                    Open Full Live Research Desk (/dashboard) ↗
                  </Link>
                </div>
              </main>

              {/* Col 3: Right Aside Rail (Photo 2 Match) */}
              <aside className="w-[285px] bg-[#FAF7F0] dark:bg-[#131C15] p-5 flex flex-col justify-between gap-5 relative">
                <div className="space-y-6">
                  {/* Upcoming Deadlines */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-[#62685E]">
                        UPCOMING DEADLINES
                      </span>
                      <Link href="/calendar" className="text-[11px] text-[#85877B] hover:text-[#202920] no-underline font-medium">
                        Calendar
                      </Link>
                    </div>

                    <div className="flex flex-col gap-2.5">
                      {[
                        { month: 'SEP', day: '14', title: 'NeurIPS Paper Deadline', time: '11:59 PM AoE', badge: 'DEADLINE', badgeBg: 'bg-[#FDF1EE]', badgeColor: 'text-[#B33D35]' },
                        { month: 'SEP', day: '18', title: 'Lab Meeting — Climate Models', time: '2:00 PM · Zoom', badge: 'MEETING', badgeBg: 'bg-[#DCE6D7]', badgeColor: 'text-[#3E6248]' },
                        { month: 'SEP', day: '22', title: 'EMNLP Early Submission', time: '5:00 PM PST', badge: 'DEADLINE', badgeBg: 'bg-[#FDF1EE]', badgeColor: 'text-[#B33D35]' },
                      ].map((d) => (
                        <div key={d.title} className="bg-white border border-[#E4DCCB] rounded-lg p-2.5 flex items-center gap-3 shadow-2xs hover:border-[#3E6248] transition-colors">
                          <div className="w-9 h-11 bg-[#FAF7F0] border border-[#E4DCCB] rounded flex flex-col items-center justify-center shrink-0">
                            <span className="text-[9px] font-mono font-bold text-[#85877B] leading-none">{d.month}</span>
                            <span className="text-sm font-bold text-[#202920] leading-none mt-0.5">{d.day}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold text-[#202920] truncate">{d.title}</div>
                            <div className="text-[10.5px] text-[#85877B]">{d.time}</div>
                          </div>
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold shrink-0 ${d.badgeBg} ${d.badgeColor}`}>
                            {d.badge}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Scholars You May Know */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-[#62685E]">
                        SCHOLARS YOU MAY KNOW
                      </span>
                      <Link href="/network" className="text-[11px] text-[#85877B] hover:text-[#202920] no-underline font-medium">
                        Explore →
                      </Link>
                    </div>

                    <div className="flex flex-col gap-2.5">
                      {[
                        { initials: 'AR', name: 'Dr. Aisha Rahman', role: 'Computational Ling...', bg: 'bg-[#4A6B8A]' },
                        { initials: 'JK', name: 'Prof. Jonas Keller', role: 'Climate Informatics...', bg: 'bg-[#5A7A6B]' },
                        { initials: 'SC', name: 'Sophia Chen', role: 'AI for Science · Stanf...', bg: 'bg-[#6B5A7A]' },
                      ].map((s) => {
                        const isConnected = connectedScholars[s.name]
                        return (
                          <div key={s.name} className="flex items-center justify-between gap-2 bg-white border border-[#E4DCCB] rounded-lg p-2 shadow-2xs">
                            <div className="flex items-center gap-2 min-w-0">
                              <div className={`w-7 h-7 rounded-full ${s.bg} text-white font-bold text-[10px] flex items-center justify-center shrink-0`}>
                                {s.initials}
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-[#202920] truncate">{s.name}</div>
                                <div className="text-[10px] text-[#85877B] truncate">{s.role}</div>
                              </div>
                            </div>
                            <button
                              onClick={() => toggleConnect(s.name)}
                              className={`text-[11px] font-semibold px-2 py-1 rounded transition-colors cursor-pointer shrink-0 ${
                                isConnected
                                  ? 'bg-[#DCE6D7] text-[#3E6248]'
                                  : 'bg-[#FAF7F0] hover:bg-[#EAE5D9] text-[#202920] border border-[#E4DCCB]'
                              }`}
                            >
                              {isConnected ? 'Requested ✓' : '+ Connect'}
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Curated Vectors */}
                  <div>
                    <div className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-[#62685E] mb-2.5">
                      CURATED VECTORS
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {[
                        { label: 'Large Language Models in Biology', href: '/discover' },
                        { label: 'Carbon Capture via ML Optimization', href: '/discover' },
                        { label: 'Preprints: September 2026', href: '/discover' },
                      ].map((v) => (
                        <Link
                          key={v.label}
                          href={v.href}
                          className="text-xs text-[#202920] hover:text-[#3E6248] py-1 px-2 rounded hover:bg-white flex items-center justify-between transition-colors no-underline group"
                        >
                          <span className="truncate">{v.label}</span>
                          <ExternalLink size={12} className="text-[#85877B] group-hover:text-[#3E6248] shrink-0" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating Note Button 'N' in Bottom Right Corner (Photo 2 Match) */}
                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => {
                      setShowQuickNote(!showQuickNote)
                      setActiveAction('Opened Quick Scholar Scratchpad')
                    }}
                    className="w-8 h-8 rounded-full bg-[#202920] text-[#FAF7F0] hover:bg-[#3E6248] flex items-center justify-center font-bold text-xs shadow-md transition-all cursor-pointer"
                    title="Quick Scholar Notebook"
                  >
                    N
                  </button>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Community Section ─────────────────────────────────────────────────────────
function CommunitySection() {
  const [isSaved, setIsSaved] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const [commentsCount, setCommentsCount] = useState(24)
  const [hasCommented, setHasCommented] = useState(false)
  const [shareFeedback, setShareFeedback] = useState(false)
  const [interestExpressed, setInterestExpressed] = useState(false)

  const handleShare = () => {
    setShareFeedback(true)
    setTimeout(() => setShareFeedback(false), 2200)
  }

  const handleComment = () => {
    if (!hasCommented) {
      setCommentsCount(prev => prev + 1)
      setHasCommented(true)
    }
  }

  return (
    <section id="community" className="bg-[#FAF7F0] dark:bg-[#0E140F] border-t border-b border-[#E4DCCB] dark:border-[#233327] py-28 px-6 md:px-16 transition-colors duration-200">
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 80, alignItems: 'center' }}>
        <div>
          <p className="text-[11px] font-bold tracking-[0.1em] text-[#3E6248] dark:text-[#4ADE80] uppercase mb-5">Research Community</p>
          <h2 style={{ fontFamily: "'Source Serif 4', serif" }} className="text-3xl md:text-5xl font-normal leading-[1.1] tracking-[-0.03em] text-[#202920] dark:text-[#EDEAE2] mb-6">
            Research is better together.
          </h2>
          <p className="text-[17px] leading-[1.65] text-[#62685E] dark:text-[#A3B899] mb-8">
            Share findings, seek collaborators, announce publications, and engage with the scholarly community in a space designed for academic discourse.
          </p>
          <div className="flex flex-col gap-3 mb-9">
            {['Scholarly discussion threads', 'Collaboration requests', 'Publication announcements', 'Research questions & answers'].map((item) => (
              <div key={item} className="flex gap-3 items-center text-sm text-[#62685E] dark:text-[#A3B899]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#3E6248] dark:bg-[#4ADE80] shrink-0" />
                {item}
              </div>
            ))}
          </div>

          <Link
            href="/community"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#3E6248] dark:bg-[#4ADE80] hover:bg-[#293E30] dark:hover:bg-[#22C55E] text-[#FAF7F0] dark:text-[#0E140F] text-xs font-semibold uppercase tracking-wider no-underline transition-all shadow-sm"
          >
            Launch Scholarly Community Feed (/community) ↗
          </Link>
        </div>

        {/* Community feed mockup matching Photo 3 */}
        <div className="flex flex-col gap-4">
          {/* Post 1: Dr. Arjun Rao */}
          <div className="bg-white dark:bg-[#18231B] border border-[#E4DCCB] dark:border-[#233327] rounded-xl p-6 shadow-sm">
            <div className="flex gap-3 mb-3 items-start">
              <div className="w-9 h-9 rounded-full bg-[#4A6B8A] flex items-center justify-center text-white text-xs font-bold shrink-0">AR</div>
              <div>
                <div className="text-sm font-semibold text-[#202920] dark:text-[#EDEAE2]">Dr. Arjun Rao</div>
                <div className="text-xs text-[#85877B] dark:text-[#7E8B7B] mt-0.5">Machine Learning Researcher · IISc · 2h ago</div>
              </div>
            </div>
            <p className="text-[14.5px] text-[#62685E] dark:text-[#A3B899] leading-relaxed mb-3.5">
              &ldquo;We just released our benchmark for low-resource scientific language models. The gap between domain-general and domain-specific models is larger than we expected at small scales.&rdquo;
            </p>
            <div className="flex gap-2 mb-4 flex-wrap">
              {['Scientific NLP', 'Low-Resource', 'Benchmarks'].map((t) => (
                <span key={t} className="text-xs px-2.5 py-1 border border-[#E4DCCB] dark:border-[#233327] rounded-md text-[#62685E] dark:text-[#A3B899] bg-[#FAF7F0] dark:bg-[#131C15]">{t}</span>
              ))}
            </div>
            <div className="flex gap-5 border-t border-[#E4DCCB] dark:border-[#233327] pt-3.5 flex-wrap">
              <button
                onClick={handleComment}
                className={`text-xs bg-transparent border-0 cursor-pointer flex gap-1.5 items-center ${hasCommented ? 'text-[#3E6248] dark:text-[#4ADE80]' : 'text-[#62685E] dark:text-[#A3B899]'}`}
              >
                <span>💬</span>
                <span className="font-medium">{commentsCount} Comments</span>
              </button>
              <button
                onClick={handleShare}
                className={`text-xs bg-transparent border-0 cursor-pointer flex gap-1.5 items-center ${shareFeedback ? 'text-[#3E6248] dark:text-[#4ADE80]' : 'text-[#62685E] dark:text-[#A3B899]'}`}
              >
                <span>↗</span>
                <span className="font-medium">{shareFeedback ? 'Link Copied ✓' : 'Share'}</span>
              </button>
              <button
                onClick={() => setIsSaved(!isSaved)}
                className={`text-xs bg-transparent border-0 cursor-pointer flex gap-1.5 items-center ${isSaved ? 'text-[#3E6248] dark:text-[#4ADE80]' : 'text-[#62685E] dark:text-[#A3B899]'}`}
              >
                <span>🔖</span>
                <span className="font-medium">{isSaved ? 'Saved ✓' : 'Save'}</span>
              </button>
              <button
                onClick={() => setIsFollowing(!isFollowing)}
                className={`text-xs bg-transparent border-0 cursor-pointer flex gap-1.5 items-center ${isFollowing ? 'text-[#3E6248] dark:text-[#4ADE80]' : 'text-[#62685E] dark:text-[#A3B899]'}`}
              >
                <span>{isFollowing ? '✓' : '＋'}</span>
                <span className="font-medium">{isFollowing ? 'Following' : 'Follow'}</span>
              </button>
            </div>
          </div>

          {/* Post 2: Collaboration request */}
          <div className="bg-white dark:bg-[#18231B] border-l border-r border-b border-[#E4DCCB] dark:border-[#233327] border-t-[3px] border-t-[#3E6248] dark:border-t-[#4ADE80] rounded-xl p-6 shadow-sm">
            <div className="flex gap-2 mb-3 items-center">
              <span className="text-xs font-semibold px-2.5 py-1 bg-[#DCE6D7] dark:bg-[#1A281E] text-[#3E6248] dark:text-[#4ADE80] rounded-md">Looking for collaborators</span>
            </div>
            <p className="text-[14.5px] text-[#62685E] dark:text-[#A3B899] leading-relaxed mb-3.5">
              Working on multimodal medical imaging and looking for researchers with expertise in clinical validation. Experience with radiology datasets preferred.
            </p>
            <div className="flex gap-2 mb-4 flex-wrap">
              {['Medical Imaging', 'Computer Vision', 'Collaboration', 'Clinical AI'].map((t) => (
                <span key={t} className="text-xs px-2.5 py-1 border border-[#E4DCCB] dark:border-[#233327] rounded-md text-[#62685E] dark:text-[#A3B899] bg-[#FAF7F0] dark:bg-[#131C15]">{t}</span>
              ))}
            </div>
            <button
              onClick={() => setInterestExpressed(!interestExpressed)}
              className={`text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer transition-all border-0 ${
                interestExpressed
                  ? 'bg-[#3E6248] dark:bg-[#4ADE80] text-white dark:text-[#0E140F]'
                  : 'bg-[#DCE6D7] dark:bg-[#1A281E] text-[#3E6248] dark:text-[#4ADE80] hover:bg-[#3E6248] hover:text-white dark:hover:bg-[#4ADE80] dark:hover:text-[#0E140F]'
              }`}
            >
              {interestExpressed ? 'Interest Expressed ✓ · Notification Sent' : 'Express interest'}
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
  const activities = SCHOLAR_ACTIVITY_BADGES

  // Deterministic organic academic cadence grid with sprint clusters & quiet gaps
  const grid = Array.from({ length: weeks }, (_, w) =>
    Array.from({ length: days }, (_, d) => getScholarContributionDetails(w, d))
  );

  return (
    <section className="bg-[#F2EBDD] dark:bg-[#131C15] border-t border-b border-[#E4DCCB] dark:border-[#233327] py-28 px-6 md:px-16 transition-colors duration-200">
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          {/* Graph Card */}
          <div className="bg-white dark:bg-[#18231B] border border-[#E4DCCB] dark:border-[#233327] rounded-2xl p-7 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
            <div className="flex justify-between items-center mb-5">
              <div className="text-sm font-semibold text-[#202920] dark:text-[#EDEAE2]">2026 Research Activity Cadence</div>
              <div className="flex items-center gap-1.5 text-xs text-[#85877B] dark:text-[#7E8B7B]">
                <span>Less</span>
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`w-2.5 h-2.5 rounded-xs border border-[#E4DCCB] dark:border-[#233327] ${
                      i === 0 ? 'bg-[#EAE5D9] dark:bg-[#202D23]' :
                      i === 1 ? 'bg-[#DCE6D7] dark:bg-[#1A281E]' :
                      i === 2 ? 'bg-[#A3C4A8] dark:bg-[#233F2B]' :
                      i === 3 ? 'bg-[#66866A] dark:bg-[#365F42]' :
                      'bg-[#3E6248] dark:bg-[#4ADE80]'
                    }`}
                  />
                ))}
                <span>More</span>
              </div>
            </div>

            <div className="flex gap-1 overflow-x-auto pb-2">
              {grid.map((week, w) => (
                <div key={w} className="flex flex-col gap-1">
                  {week.map((item, d) => (
                    <div
                      key={d}
                      title={`Week ${w + 1}, Day ${d + 1}: ${item.label}`}
                      className="w-2.5 h-2.5 rounded-xs transition-transform duration-100 hover:scale-125 cursor-default bg-[#EAE5D9] dark:bg-[#202D23] data-[lvl='1']:bg-[#DCE6D7] dark:data-[lvl='1']:bg-[#1A281E] data-[lvl='2']:bg-[#A3C4A8] dark:data-[lvl='2']:bg-[#233F2B] data-[lvl='3']:bg-[#66866A] dark:data-[lvl='3']:bg-[#365F42] data-[lvl='4']:bg-[#3E6248] dark:data-[lvl='4']:bg-[#4ADE80]"
                      data-lvl={item.level}
                    />
                  ))}
                </div>
              ))}
            </div>

            {/* Activity types */}
            <div className="mt-6 flex flex-wrap gap-2">
              {activities.map((a) => (
                <span key={a} className="text-xs px-2.5 py-1 border border-[#E4DCCB] dark:border-[#233327] rounded-md text-[#62685E] dark:text-[#A3B899] bg-[#FAF7F0] dark:bg-[#131C15]">{a}</span>
              ))}
            </div>
          </div>

          {/* Copy */}
          <div>
            <p className="text-[11px] font-bold tracking-[0.1em] text-[#3E6248] dark:text-[#4ADE80] uppercase mb-5">Research Cadence & Ledger</p>
            <h2 style={{ fontFamily: "'Source Serif 4', serif" }} className="text-3xl md:text-5xl font-normal leading-[1.15] tracking-[-0.03em] text-[#202920] dark:text-[#EDEAE2] mb-6">
              Every contribution becomes part of your research story.
            </h2>
            <p className="text-[17px] leading-[1.65] text-[#62685E] dark:text-[#A3B899]">
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
  const [savedOpps, setSavedOpps] = useState<Record<string, boolean>>({})

  const toggleSave = (title: string) => {
    setSavedOpps(prev => ({ ...prev, [title]: !prev[title] }))
  }

  const tabs = ['Grants', 'Conferences', 'Journals', 'Fellowships', 'Scholarships', 'CFPs']

  const opportunities: Record<string, Array<{
    title: string
    org: string
    type: string
    deadline: string
    funding: string | null
    tags: string[]
    match: string
    hot: boolean
  }>> = {
    Grants: [
      { title: 'AI for Climate Research', org: 'National Science Foundation', type: 'Grant', deadline: '18 days', funding: '$250,000', tags: ['AI', 'Climate', 'Research'], match: '94% match', hot: true },
      { title: 'Biomedical Data Science Initiative', org: 'NIH National Library of Medicine', type: 'Grant', deadline: '42 days', funding: '$180,000', tags: ['Biomedical', 'Data Science'], match: '88% match', hot: false },
    ],
    Conferences: [
      { title: 'NeurIPS 2026', org: 'Neural Information Processing Systems', type: 'Conference', deadline: 'Sep 18', funding: null, tags: ['Machine Learning', 'AI', 'Representation Learning'], match: '96% match', hot: true },
      { title: 'CVPR 2026', org: 'Computer Vision and Pattern Recognition', type: 'Conference', deadline: 'Nov 1', funding: null, tags: ['Computer Vision', 'Robotics'], match: '86% match', hot: false },
    ],
    Fellowships: [
      { title: 'Research Fellowship Program', org: 'Global Research Foundation', type: 'Fellowship', deadline: 'Oct 4', funding: '$60,000/yr', tags: ['Open', 'International'], match: '91% match', hot: false },
    ],
    Journals: [
      { title: 'Nature Machine Intelligence', org: 'Springer Nature', type: 'Journal', deadline: 'Rolling', funding: null, tags: ['AI', 'ML', 'High Impact'], match: '95% match', hot: true },
    ],
    Scholarships: [
      { title: 'Doctoral Excellence Award', org: 'IEEE Foundation', type: 'Scholarship', deadline: 'Dec 15', funding: '$25,000', tags: ['PhD', 'Engineering'], match: '84% match', hot: false },
    ],
    CFPs: [
      { title: 'ICML Workshop on Scientific ML', org: 'ICML 2026', type: 'CFP', deadline: 'Mar 20', funding: null, tags: ['Scientific ML', 'Workshop'], match: '92% match', hot: false },
    ],
  }

  const items = opportunities[activeTab] || []

  return (
    <section id="opportunities" style={{ background: C.darkBg, borderTop: '1px solid rgba(46,125,79,0.35)', borderBottom: '1px solid rgba(46,125,79,0.35)', padding: '112px 24px', position: 'relative' }}>
      {/* Subtle organic ambient glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_25%,rgba(46,204,113,0.06)_0%,transparent_70%)]" />

      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 10 }}>
        <div className="flex justify-between items-end mb-12 flex-wrap gap-6">
          <div>
            <p className="text-[11px] font-bold tracking-[0.12em] text-[#4ADE80] uppercase mb-4">Opportunity Discovery</p>
            <h2 style={{ fontFamily: "'Source Serif 4', serif" }} className="text-3xl md:text-5xl font-normal tracking-tight text-[#F5F4F0]">
              Find the opportunities that fit your research.
            </h2>
          </div>
          <Link
            href="/opportunities"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[#4ADE80] hover:text-white transition-colors underline underline-offset-4"
          >
            Explore 420+ Live Grants & CFPs (/opportunities) ↗
          </Link>
        </div>

        {/* Tabs Bar on Dark Forest Background */}
        <div className="flex items-center justify-between border-b border-white/15 mb-9 overflow-x-auto gap-6">
          <div className="flex gap-7">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-1 text-[14.5px] bg-transparent border-0 border-b-2 cursor-pointer mb-[-1px] transition-all ${
                  activeTab === tab
                    ? 'border-[#4ADE80] font-semibold text-white'
                    : 'border-transparent font-normal text-[rgba(245,244,240,0.65)] hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          {/* Vertical accent bar */}
          <div className="w-[3px] h-6 bg-[#4ADE80]/30 hidden md:block rounded-full" />
        </div>

        {/* Cards Grid matching Photo 4 with Sand Cards on Forest Green */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
          {items.map((opp) => {
            const isSaved = savedOpps[opp.title]
            return (
              <div
                key={opp.title}
                className="bg-[#FAF7F0] border border-[#E2D9C8] rounded-2xl p-6 transition-all duration-200 hover:border-[#4ADE80] flex flex-col justify-between shadow-[0_16px_40px_-10px_rgba(0,0,0,0.35),0_4px_12px_rgba(0,0,0,0.12)] hover:shadow-[0_24px_52px_-10px_rgba(0,0,0,0.48),0_8px_18px_rgba(0,0,0,0.2)] group"
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="text-xs font-medium px-2.5 py-0.5 bg-[#EFEBE1] dark:bg-[#131C15] text-[#62685E] dark:text-[#A3B899] rounded-md">
                        {opp.type}
                      </span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 bg-[#DCE6D7] dark:bg-[#1F2E23] text-[#3E6248] dark:text-[#4ADE80] rounded-md">
                        {opp.match}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="text-xs font-medium text-[#B33D35] bg-[#FDF1EE] dark:bg-[#2A1715] px-2.5 py-0.5 rounded-md">
                        {opp.deadline} {opp.deadline.includes('days') ? 'left' : ''}
                      </span>
                      <button
                        onClick={() => toggleSave(opp.title)}
                        className="text-[#85877B] dark:text-[#7E8B7B] hover:text-[#202920] dark:hover:text-[#EDEAE2] p-1 cursor-pointer transition-colors"
                        title={isSaved ? 'Saved' : 'Save'}
                      >
                        <Bookmark size={15} className={isSaved ? 'fill-[#3E6248] text-[#3E6248] dark:fill-[#4ADE80] dark:text-[#4ADE80]' : ''} />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-[18.5px] font-bold text-[#202920] dark:text-[#EDEAE2] tracking-[-0.02em] mb-1.5 leading-snug group-hover:text-[#3E6248] dark:group-hover:text-[#4ADE80] transition-colors">
                    {opp.title}
                  </h3>
                  <div className="text-[13.5px] text-[#62685E] dark:text-[#A3B899] mb-4">
                    {opp.org}
                  </div>
                  {opp.funding && (
                    <div className="text-[17px] font-bold text-[#202920] dark:text-[#EDEAE2] mb-4">
                      {opp.funding}
                    </div>
                  )}
                </div>

                <div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: opp.funding ? 0 : 16, marginBottom: 16 }}>
                    {opp.tags.map((t) => (
                      <span key={t} className="text-[11.5px] px-2.5 py-1 bg-white dark:bg-[#131C15] border border-[#E4DCCB] dark:border-[#233327] rounded-md text-[#62685E] dark:text-[#A3B899]">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-[#E4DCCB] dark:border-[#233327] flex items-center justify-between text-xs">
                    <Link
                      href="/opportunities"
                      className="font-semibold text-[#3E6248] dark:text-[#4ADE80] hover:text-[#202920] dark:hover:text-white no-underline inline-flex items-center gap-1"
                    >
                      View opportunity details ↗
                    </Link>
                    <button
                      onClick={() => toggleSave(opp.title)}
                      className="text-[#85877B] dark:text-[#7E8B7B] hover:text-[#202920] dark:hover:text-[#EDEAE2] cursor-pointer font-medium"
                    >
                      {isSaved ? 'Saved ✓' : 'Save'}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── Paper Discovery Section (Photo 5 Matching Design System) ──────────────────
function PaperSection() {
  const [isSaved, setIsSaved] = useState(false)
  const [activeMetric, setActiveMetric] = useState<string | null>(null)

  const metrics = [
    { id: 'references', label: 'References', count: 84, color: '#3E6248', desc: '84 foundational citations indexed across CrossRef & PubMed' },
    { id: 'related', label: 'Related Papers', count: 32, color: '#365F8D', desc: '32 high-similarity papers synthesized via SPECTER2 embeddings' },
    { id: 'citations', label: 'Citations', count: 2418, color: '#3E6248', desc: '2,418 global citations · Top 1% percentile velocity in AI' },
    { id: 'topics', label: 'Research Topics', count: 12, color: '#805B43', desc: '12 active ontology tags spanning Foundation Models & Scientific ML' },
  ]

  return (
    <section id="research" className="bg-[#FAF7F0] dark:bg-[#0E140F] border-t border-b border-[#E4DCCB] dark:border-[#233327] py-28 px-6 md:px-16 transition-colors duration-200">
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 80, alignItems: 'center' }}>
          {/* Paper card mockup */}
          <div>
            <div className="bg-white dark:bg-[#18231B] border border-[#E4DCCB] dark:border-[#233327] rounded-2xl p-7 shadow-xl transition-colors duration-200">
              {/* Header and Title */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span className="text-[11px] font-bold text-[#62685E] dark:text-[#88998A] tracking-[0.1em] uppercase">
                    RESEARCH PAPER
                  </span>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => setIsSaved(!isSaved)}
                      className="text-xs font-semibold px-2.5 py-1 rounded bg-[#FAF7F0] dark:bg-[#131C15] border border-[#E4DCCB] dark:border-[#233327] text-[#202920] dark:text-[#EDEAE2] hover:border-[#3E6248] dark:hover:border-[#4ADE80] cursor-pointer inline-flex items-center gap-1.5 transition-colors"
                      title={isSaved ? 'Saved to Library' : 'Save to Library'}
                    >
                      <Bookmark size={13} className={isSaved ? 'fill-[#3E6248] dark:fill-[#4ADE80] text-[#3E6248] dark:text-[#4ADE80]' : 'text-[#85877B] dark:text-[#88998A]'} />
                      <span>{isSaved ? 'Saved ✓' : 'Save'}</span>
                    </button>
                    <Link
                      href="/agent-reader"
                      className="text-xs font-semibold px-3 py-1 rounded bg-[#202920] dark:bg-[#3E6248] text-[#FAF7F0] hover:bg-[#3E6248] dark:hover:bg-[#4E7A5A] no-underline transition-colors"
                    >
                      Read ↗
                    </Link>
                  </div>
                </div>

                <h3 style={{ fontFamily: "'Source Serif 4', serif" }} className="text-2xl font-medium text-[#202920] dark:text-[#EDEAE2] leading-snug tracking-tight mb-2">
                  Foundation Models for Scientific Discovery
                </h3>
                <div className="text-[13.5px] text-[#62685E] dark:text-[#9BA39B] flex gap-2 flex-wrap mt-2">
                  <span>Imthiyas, Arjun Rao, Elena Park · 2026</span>
                </div>
              </div>

              {/* Citations & Venue Stats Bar */}
              <div className="flex gap-9 py-4 border-t border-b border-[#E4DCCB] dark:border-[#233327] mb-5">
                <div>
                  <div className="text-[22px] font-bold text-[#202920] dark:text-[#EDEAE2] tracking-tight">2,418</div>
                  <div className="text-[11.5px] text-[#62685E] dark:text-[#88998A] mt-0.5">Citations</div>
                </div>
                <div>
                  <div className="text-[22px] font-bold text-[#202920] dark:text-[#EDEAE2] tracking-tight">NeurIPS</div>
                  <div className="text-[11.5px] text-[#62685E] dark:text-[#88998A] mt-0.5">Venue · 2026</div>
                </div>
              </div>

              {/* Tags */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 22, flexWrap: 'wrap' }}>
                {['Scientific ML', 'Foundation Models', 'Knowledge Discovery'].map((t) => (
                  <span key={t} className="text-xs font-medium px-3 py-1 rounded-md bg-[#DCE6D7] dark:bg-[#233327] text-[#3E6248] dark:text-[#4ADE80] transition-colors">
                    {t}
                  </span>
                ))}
              </div>

              {/* Research Connections Section */}
              <div className="border-t border-[#E4DCCB] dark:border-[#233327] pt-4.5">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div className="text-[13px] font-semibold text-[#202920] dark:text-[#EDEAE2]">Research Connections</div>
                  <span className="text-[11px] text-[#85877B] dark:text-[#88998A]">Click to inspect lineage</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {metrics.map(({ id, label, count, color }) => (
                    <div
                      key={id}
                      onClick={() => setActiveMetric(activeMetric === id ? null : id)}
                      className={`p-3 rounded-lg flex justify-between items-center cursor-pointer transition-all border ${
                        activeMetric === id
                          ? 'bg-[#EAE5D9] dark:bg-[#233327] border-[#3E6248] dark:border-[#4ADE80]'
                          : 'bg-[#FAF7F0] dark:bg-[#131C15] border-[#E4DCCB] dark:border-[#233327] hover:border-[#3E6248]/50'
                      }`}
                    >
                      <span className="text-[12.5px] text-[#62685E] dark:text-[#9BA39B] font-medium">{label}</span>
                      <span className="text-sm font-bold text-[#3E6248] dark:text-[#4ADE80]">{count.toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                {/* Interactive Metric Detail Drawer */}
                {activeMetric && (
                  <div className="mt-3 p-3 bg-[#FAF7F0] dark:bg-[#131C15] border border-[#3E6248]/30 dark:border-[#4ADE80]/30 rounded-lg text-xs text-[#202920] dark:text-[#EDEAE2] flex items-center justify-between animate-fadeIn">
                    <span>{metrics.find(m => m.id === activeMetric)?.desc}</span>
                    <Link href="/graph" className="text-[#3E6248] dark:text-[#4ADE80] font-bold hover:underline shrink-0 ml-2">
                      Open Graph ↗
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Copy */}
          <div>
            <p className="text-[11px] font-semibold tracking-[0.1em] text-[#3E6248] dark:text-[#4ADE80] uppercase mb-5">Paper Discovery</p>
            <h2 style={{ fontFamily: "'Source Serif 4', serif" }} className="text-3xl md:text-5xl font-normal leading-[1.1] tracking-[-0.03em] text-[#202920] dark:text-[#EDEAE2] mb-6">
              Follow ideas, not just citations.
            </h2>
            <p className="text-[17px] leading-[1.65] text-[#62685E] dark:text-[#9BA39B] mb-8">
              Navigate the research landscape through semantic relationships — not just who cited whom. Discover papers through shared concepts, emerging themes, and the ideas that connect across fields.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
              {['Semantic paper discovery', 'Citation network navigation', 'Related paper recommendations', 'Research topic clustering'].map((item) => (
                <div key={item} className="flex gap-3 items-center text-sm text-[#62685E] dark:text-[#9BA39B]">
                  <div className="w-[5px] h-[5px] rounded-full bg-[#3E6248] dark:bg-[#4ADE80] shrink-0" />
                  {item}
                </div>
              ))}
            </div>
            <Link
              href="/agent-reader"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#202920] dark:bg-[#3E6248] hover:bg-[#3E6248] dark:hover:bg-[#4E7A5A] text-[#FAF7F0] text-xs font-semibold no-underline transition-colors shadow-xs"
            >
              Explore AI Agent Reader (/agent-reader) ↗
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Collaboration Section ────────────────────────────────────────────────────
function CollaborationSection() {
  const [connections, setConnections] = useState<Record<string, boolean>>({
    'Dr. Elena Park': false,
    'Dr. Arjun Rao': false,
    'Dr. Lena Kovacs': false,
  })

  const toggleConnect = (name: string) => {
    setConnections(prev => ({ ...prev, [name]: !prev[name] }))
  }

  const researchers = [
    { initials: 'EP', color: '#6B5A7A', name: 'Dr. Elena Park', role: 'Computational Biology', org: 'Stanford University', match: '96% match', topics: ['Protein Design', 'Generative AI', 'Bioinformatics'], shared: 3, mutual: 5 },
    { initials: 'AR', color: '#4A6B8A', name: 'Dr. Arjun Rao', role: 'Machine Learning', org: 'IISc', match: '93% match', topics: ['Scientific NLP', 'Low-Resource ML', 'Benchmarks'], shared: 2, mutual: 7 },
    { initials: 'LK', color: '#7A6B4A', name: 'Dr. Lena Kovacs', role: 'Neuroscience AI', org: 'ETH Zurich', match: '89% match', topics: ['Neural Decoding', 'Brain-Computer Interface'], shared: 4, mutual: 3 },
  ]

  return (
    <section id="collaboration" style={{ background: C.darkBg, borderTop: '1px solid rgba(46,125,79,0.35)', borderBottom: '1px solid rgba(46,125,79,0.35)', padding: '112px 24px', position: 'relative' }}>
      {/* Subtle organic ambient glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_25%,rgba(46,204,113,0.06)_0%,transparent_70%)]" />

      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 10 }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <p className="text-[11px] font-bold tracking-[0.12em] text-[#4ADE80] uppercase mb-4">Collaboration</p>
          <h2 style={{ fontFamily: "'Source Serif 4', serif" }} className="text-3xl md:text-5xl font-normal tracking-[-0.03em] text-[#F5F4F0] mb-4">
            Meet the researchers your work is already pointing toward.
          </h2>
          <p className="text-[17px] text-[rgba(245,244,240,0.72)] max-w-[480px] mx-auto">
            Cambium surfaces researchers who share your intellectual territory — before you know to search for them.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
          {researchers.map((r) => {
            const isConnected = connections[r.name]
            return (
              <div
                key={r.name}
                className="bg-[#FAF7F0] border border-[#E2D9C8] rounded-xl p-6 transition-all duration-200 shadow-[0_16px_40px_-10px_rgba(0,0,0,0.35),0_4px_12px_rgba(0,0,0,0.12)] hover:border-[#4ADE80] hover:shadow-[0_24px_52px_-10px_rgba(0,0,0,0.48)] flex flex-col justify-between group"
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                      <div style={{ width: 48, height: 48, borderRadius: '50%', background: r.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 15, flexShrink: 0 }}>{r.initials}</div>
                      <div>
                        <div className="text-[15px] font-bold text-[#202920] tracking-tight">{r.name}</div>
                        <div className="text-xs text-[#62685E] mt-0.5">{r.role}</div>
                        <div className="text-[11px] text-[#85877B]">{r.org}</div>
                      </div>
                    </div>
                    <span className="text-[10.5px] font-bold px-2 py-0.5 bg-[#DCE6D7] text-[#3E6248] rounded">
                      {r.match}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: 6, marginBottom: 18, flexWrap: 'wrap' }}>
                    {r.topics.map((t) => (
                      <span key={t} className="text-[11px] px-2.5 py-1 border border-[#E4DCCB] rounded-md text-[#62685E] bg-white">{t}</span>
                    ))}
                  </div>

                  <div className="flex gap-5 py-3 border-t border-b border-[#E4DCCB] mb-4.5">
                    <div>
                      <div className="text-base font-bold text-[#202920]">{r.shared}</div>
                      <div className="text-[11px] text-[#85877B]">Shared interests</div>
                    </div>
                    <div>
                      <div className="text-base font-bold text-[#202920]">{r.mutual}</div>
                      <div className="text-[11px] text-[#85877B]">Mutual topics</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleConnect(r.name)}
                    className={`text-xs font-semibold px-4 py-2.5 rounded-md cursor-pointer flex-1 transition-all duration-150 ${
                      isConnected
                        ? 'bg-[#3E6248] text-[#FAF7F0]'
                        : 'bg-[#254A34] text-white hover:bg-[#1A3826]'
                    }`}
                  >
                    {isConnected ? 'Connection Sent ✓' : '+ Connect'}
                  </button>
                  <Link
                    href="/network"
                    className="text-xs font-medium px-3 py-2 rounded border border-[#E4DCCB] text-[#202920] bg-white hover:bg-[#EAE5D9] no-underline transition-colors"
                  >
                    Profile ↗
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── Intelligence Section (Dark) ──────────────────────────────────────────────
function IntelligenceSection() {
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null)

  const insightPreviews: Record<string, string> = {
    'Related papers to explore': 'Surfacing 12 related papers connected to Foundation Models via citation velocity lineage.',
    'Researchers active in this area': 'Identified 4 faculty members at Stanford Bio-X and Cambridge Graph ML matching your co-authorship horizon.',
    'Relevant grants open now': '3 NSF and Wellcome Trust initiatives have open deadlines matching multimodal modeling.',
    'Publication venues to compare': '6 target venues analyzed: NeurIPS, ICML, ICLR, Nature MI, Cell Systems, Bioinformatics.',
  }

  return (
    <section className="bg-[#FAF7F0] dark:bg-[#0E140F] border-t border-b border-[#E4DCCB] dark:border-[#233327] py-28 px-6 md:px-16 relative transition-colors duration-200">
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 80, alignItems: 'center' }}>
          {/* Copy */}
          <div>
            <p className="text-[11px] font-bold tracking-[0.1em] text-[#3E6248] dark:text-[#4ADE80] uppercase mb-5">Research Intelligence</p>
            <h2 style={{ fontFamily: "'Source Serif 4', serif" }} className="text-3xl md:text-5xl font-normal leading-[1.1] tracking-[-0.03em] text-[#202920] dark:text-[#EDEAE2] mb-6">
              Intelligence that works around your research.
            </h2>
            <p className="text-[17px] leading-[1.65] text-[#62685E] dark:text-[#A3B899] mb-9">
              Cambium understands your work — not just your search queries. It surfaces connections, opportunities, and collaborators as you research, not when you ask.
            </p>
            <div className="flex flex-col gap-3.5 mb-9">
              {['Contextual paper recommendations', 'Opportunity matching by research fit', 'Emerging topic signals in your field', 'Collaboration opportunities at intersections'].map((item) => (
                <div key={item} className="flex gap-3 items-center text-sm text-[#62685E] dark:text-[#A3B899]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#3E6248] dark:bg-[#4ADE80] shrink-0" />
                  {item}
                </div>
              ))}
            </div>
            <Link
              href="/intelligence"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#3E6248] dark:bg-[#4ADE80] hover:bg-[#293E30] dark:hover:bg-[#22C55E] text-[#FAF7F0] dark:text-[#0E140F] text-xs font-semibold uppercase tracking-wider no-underline transition-all shadow-sm"
            >
              Launch Living Intelligence Suite (/intelligence) ↗
            </Link>
          </div>

          {/* Insight panel mockup */}
          <div>
            {/* Paper context box */}
            <div className="bg-white dark:bg-[#18231B] border border-[#E4DCCB] dark:border-[#233327] rounded-2xl p-6 mb-4 shadow-sm">
              <div className="text-[11px] font-bold text-[#62685E] dark:text-[#A3B899] tracking-wider uppercase mb-1.5">
                Currently reading
              </div>
              <div className="text-[17px] font-bold text-[#202920] dark:text-[#EDEAE2] leading-snug tracking-[-0.01em]">
                Foundation Models for Scientific Discovery
              </div>
              <div className="text-[13px] text-[#62685E] dark:text-[#A3B899] mt-1">
                Imthiyas, Rao, Park · NeurIPS 2026
              </div>
            </div>

            {/* Insight card */}
            <div className="bg-white dark:bg-[#18231B] border-l border-r border-b border-[#E4DCCB] dark:border-[#233327] border-t-[3px] border-t-[#3E6248] dark:border-t-[#4ADE80] rounded-2xl p-6 shadow-md">
              <div className="flex gap-2.5 items-center mb-4">
                <div className="w-8 h-8 rounded-full bg-[#DCE6D7] dark:bg-[#1A281E] flex items-center justify-center">
                  <svg width="15" height="15" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="5" className="stroke-[#3E6248] dark:stroke-[#4ADE80]" strokeWidth="1.5" />
                    <path d="M7 4.5v3M7 9v.5" className="stroke-[#3E6248] dark:stroke-[#4ADE80]" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="text-sm font-bold text-[#3E6248] dark:text-[#4ADE80] tracking-tight">
                  Cambium Research Insight
                </div>
              </div>

              <p className="text-[14.5px] text-[#202920] dark:text-[#EDEAE2] leading-relaxed mb-5">
                This paper connects strongly with your work on multimodal scientific discovery. Several co-authors are active in areas you&apos;re exploring.
              </p>

              <div className="flex flex-col gap-2.5">
                {[
                  { label: 'Related papers to explore', count: '12 papers', icon: '→' },
                  { label: 'Researchers active in this area', count: '4 researchers', icon: '→' },
                  { label: 'Relevant grants open now', count: '3 grants', icon: '→' },
                  { label: 'Publication venues to compare', count: '6 venues', icon: '→' },
                ].map(({ label, count, icon }) => (
                  <div
                    key={label}
                    onClick={() => setSelectedInsight(selectedInsight === label ? null : label)}
                    className={`flex justify-between items-center px-4 py-3 rounded-lg cursor-pointer border transition-all ${
                      selectedInsight === label
                        ? 'bg-[#DCE6D7] dark:bg-[#1F2E23] border-[#3E6248] dark:border-[#4ADE80]'
                        : 'bg-[#FAF7F0] dark:bg-[#131C15] border-[#E4DCCB] dark:border-[#233327] hover:border-[#3E6248]/40 dark:hover:border-[#4ADE80]/40'
                    }`}
                  >
                    <span className="text-[13.5px] text-[#202920] dark:text-[#EDEAE2] font-medium">{label}</span>
                    <span className="text-[13px] text-[#3E6248] dark:text-[#4ADE80] font-semibold">{count} {icon}</span>
                  </div>
                ))}
              </div>

              {/* Dynamic Insight Feedback Banner */}
              {selectedInsight && (
                <div className="mt-3 p-3 bg-[#FAF7F0] dark:bg-[#131C15] border border-[#3E6248]/30 dark:border-[#4ADE80]/30 rounded-lg text-xs text-[#202920] dark:text-[#EDEAE2] flex items-center justify-between">
                  <span>{insightPreviews[selectedInsight]}</span>
                  <Link href="/intelligence" className="text-[#3E6248] dark:text-[#4ADE80] font-bold hover:underline shrink-0 ml-2">
                    Inspect ↗
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Portfolio Section ────────────────────────────────────────────────────────
function PortfolioSection() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null)

  const projects = [
    { name: 'Multimodal Scientific Discovery', status: 'Active', statusColor: C.moss, collaborators: ['MC', 'AR', 'EP'], pubs: 4, datasets: 2, experiments: 18, href: '/portfolio' },
    { name: 'Medical Imaging Foundation Models', status: 'Published', statusColor: '#4A6B8A', collaborators: ['MC', 'LK'], pubs: 7, citations: '1.2k', experiments: 31, href: '/portfolio' },
    { name: 'Cross-lingual Scientific NLP', status: 'In Progress', statusColor: '#7A6B4A', collaborators: ['AR', 'MC'], pubs: 2, datasets: 5, experiments: 11, href: '/portfolio' },
  ]

  return (
    <section className="bg-[#F2EBDD] dark:bg-[#131C15] border-t border-b border-[#E4DCCB] dark:border-[#233327] py-28 px-6 md:px-16 transition-colors duration-200">
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, flexWrap: 'wrap', gap: 24 }}>
          <div>
            <p className="text-[11px] font-semibold tracking-[0.1em] text-[#3E6248] dark:text-[#4ADE80] uppercase mb-4">Research Portfolio</p>
            <h2 style={{ fontFamily: "'Source Serif 4', serif" }} className="text-3xl md:text-5xl font-normal tracking-[-0.03em] text-[#202920] dark:text-[#EDEAE2]">
              Your research, from first question<br />to published work.
            </h2>
          </div>
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[#3E6248] dark:text-[#4ADE80] hover:text-[#202920] dark:hover:text-[#EDEAE2] transition-colors underline underline-offset-4"
          >
            Launch Research Portfolio (/portfolio) ↗
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {projects.map((p) => {
            const isSelected = selectedProject === p.name
            return (
              <div
                key={p.name}
                onClick={() => setSelectedProject(isSelected ? null : p.name)}
                className={`bg-white dark:bg-[#18231B] border rounded-xl p-6 flex items-center gap-8 cursor-pointer transition-all duration-150 shadow-xs hover:border-[#3E6248] dark:hover:border-[#4ADE80] group ${
                  isSelected ? 'border-[#3E6248] dark:border-[#4ADE80]' : 'border-[#E4DCCB] dark:border-[#233327]'
                }`}
                style={{
                  borderLeft: `4px solid ${p.statusColor}`,
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <span className="text-base font-semibold text-[#202920] dark:text-[#EDEAE2] tracking-tight group-hover:text-[#3E6248] dark:group-hover:text-[#4ADE80] transition-colors">
                      {p.name}
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', background: `${p.statusColor}18`, color: p.statusColor, borderRadius: 4 }}>
                      {p.status}
                    </span>
                  </div>
                  <div className="flex gap-6 text-[12.5px] text-[#62685E] dark:text-[#9BA39B] flex-wrap">
                    <span>{p.pubs} Publications</span>
                    {p.datasets && <span>{p.datasets} Datasets</span>}
                    {p.citations && <span className="text-[#3E6248] dark:text-[#4ADE80] font-semibold">↑ {p.citations} Citations</span>}
                    <span>{p.experiments} Experiments</span>
                  </div>
                </div>

                {/* Collaborators */}
                <div style={{ display: 'flex', gap: -8, flexShrink: 0 }}>
                  {p.collaborators.map((c, i) => (
                    <div key={c} style={{ width: 32, height: 32, borderRadius: '50%', background: [C.moss, '#4A6B8A', '#7A6B4A'][i % 3], display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 700, border: `2px solid #FFFFFF`, marginLeft: i > 0 ? -8 : 0 }}>
                      {c}
                    </div>
                  ))}
                </div>

                <Link
                  href={p.href}
                  className="text-xs font-semibold text-[#3E6248] dark:text-[#4ADE80] hover:text-[#202920] dark:hover:text-[#EDEAE2] px-3 py-1.5 rounded bg-[#FAF7F0] dark:bg-[#131C15] border border-[#E4DCCB] dark:border-[#233327] no-underline shrink-0 hidden sm:inline-flex items-center gap-1 transition-colors"
                >
                  Ledger ↗
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── Ecosystem Map Section (Botanical Wood Cross-Section & Living Cambium Meristem) ───
function EcosystemMapSection() {
  const [activeEntity, setActiveEntity] = useState<string | null>(null)

  // 10 Research Entities positioned organically across 4 concentric annual wood growth rings
  const entities = [
    // Ring 1 / Inner Heartwood (Foundational seed thinking & core domains)
    { id: 'notes', label: 'Notes', botanical: 'Germinal Seeds', ring: 'Heartwood Pith', radius: 112, x: 489, y: 231, delay: '0s' },
    { id: 'topics', label: 'Topics', botanical: 'Discipline Trunks', ring: 'Heartwood Pith', radius: 118, x: 326, y: 393, delay: '-0.5s' },

    // Ring 2 / Secondary Wood (Empirical data, labs, researchers)
    { id: 'datasets', label: 'Datasets', botanical: 'Empirical Substrate', ring: 'Secondary Xylem', radius: 170, x: 312, y: 171, delay: '-0.8s' },
    { id: 'people', label: 'People', botanical: 'Symbiotic Network', ring: 'Secondary Xylem', radius: 176, x: 580, y: 356, delay: '-1s' },
    { id: 'labs', label: 'Labs', botanical: 'Root Environments', ring: 'Secondary Xylem', radius: 172, x: 485, y: 464, delay: '-3s' },

    // Ring 3 / Living Vascular Cambium Zone (Active shoots & formal dissemination records)
    { id: 'projects', label: 'Projects', botanical: 'Vascular Shoots', ring: 'Living Cambium Zone', radius: 222, x: 624, y: 253, delay: '-2s' },
    { id: 'journals', label: 'Journals', botanical: 'Codified Rings', ring: 'Living Cambium Zone', radius: 220, x: 198, y: 367, delay: '-1.5s' },

    // Ring 4 / Outer Sapwood & Canopy Horizon (Outward scholarship, funding, global venues)
    { id: 'papers', label: 'Papers', botanical: 'Annual Foliage', ring: 'Canopy Horizon', radius: 258, x: 410, y: 52, delay: '0s' },
    { id: 'conferences', label: 'Conferences', botanical: 'Cross-Pollination', ring: 'Canopy Horizon', radius: 256, x: 163, y: 244, delay: '-2.5s' },
    { id: 'funding', label: 'Funding', botanical: 'Metabolic Sap', ring: 'Canopy Horizon', radius: 252, x: 204, y: 165, delay: '-3.5s' },
  ]

  // Intermediate passive medullary wood rays (realistic wood cross-section grain)
  const passiveRays = [
    [410, 310, 410, 35],
    [410, 310, 600, 120],
    [410, 310, 680, 310],
    [410, 310, 580, 500],
    [410, 310, 410, 585],
    [410, 310, 240, 500],
    [410, 310, 135, 310],
    [410, 310, 240, 120],
  ]

  return (
    <section id="ecosystem" style={{ background: C.darkBg, borderTop: '1px solid rgba(46,125,79,0.35)', borderBottom: '1px solid rgba(46,125,79,0.35)', padding: '112px 24px', position: 'relative' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', textAlign: 'center' }}>
        <div className="inline-flex items-center gap-2 font-mono text-xs font-bold tracking-wider uppercase text-[#4ADE80] mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-pulse" />
          RESEARCH ECOSYSTEM · LIVING VASCULAR MERISTEM
        </div>
        <h2 style={{ fontFamily: "'Source Serif 4', serif" }} className="text-4xl md:text-6xl font-normal leading-[1.08] tracking-[-0.03em] text-[#F5F4F0] mb-4">
          Everything connects.
        </h2>
        <p className="text-[17px] text-[rgba(250,249,246,0.72)] mb-14 max-w-[620px] mx-auto leading-relaxed">
          In botanical nature, the cambium layer is the living meristem of the tree — dividing cells to form annual growth rings and pumping nutrient-rich sap outward to nourish the entire canopy. Cambium Research works identically: nourishing your ideas, linking your artifacts, and expanding your scholarly horizon year after year.
        </p>

        {/* Botanical Cut-Tree Stem Wood Cross-Section Graphic */}
        <div style={{ maxWidth: 840, margin: '0 auto', minHeight: 620, position: 'relative' }}>
          <svg
            viewBox="0 0 820 620"
            style={{ width: '100%', height: '100%', overflow: 'visible' }}
            aria-label="Botanical cut tree stem wood cross-section showing annual growth rings and living cambium meristem layer"
          >
            <defs>
              {/* Radial gradient for the warm heartwood glow */}
              <radialGradient id="treePithGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FAF7F0" stopOpacity="0.22" />
                <stop offset="60%" stopColor="#2E7D4F" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#18231B" stopOpacity="0" />
              </radialGradient>

              {/* Radial wood cross-section timber shading */}
              <radialGradient id="woodTrunkShading" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#1B281E" stopOpacity="0.95" />
                <stop offset="35%" stopColor="#18241A" stopOpacity="0.95" />
                <stop offset="70%" stopColor="#141E16" stopOpacity="0.98" />
                <stop offset="100%" stopColor="#0F1710" stopOpacity="1" />
              </radialGradient>

              {/* Glow filter for sap particles */}
              <filter id="sapGlowFilter" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* 1. Outer Bark Rim & Trunk Silhouette (Top view of cut tree trunk) */}
            <circle cx="410" cy="310" r="280" fill="url(#woodTrunkShading)" />

            {/* Rugged Outer Bark Surface */}
            <circle
              cx="410" cy="310" r="282"
              fill="none"
              stroke="#2D4231"
              strokeWidth="4.5"
              strokeDasharray="14 3 8 4 22 2"
              opacity="0.85"
            />
            <circle
              cx="410" cy="310" r="278"
              fill="none"
              stroke="#1D2A1F"
              strokeWidth="2.5"
            />

            {/* 2. Secondary Phloem (Inner Bark nutrient corridor) */}
            <circle
              cx="410" cy="310" r="264"
              fill="none"
              stroke="rgba(74, 222, 128, 0.18)"
              strokeWidth="1.5"
              strokeDasharray="6 6"
            />

            {/* 3. Subtle Organic Wood Grain Micro-Rings */}
            {[65, 95, 142, 192, 238].map((grainRadius, idx) => (
              <circle
                key={`grain-${idx}`}
                cx="410" cy="310" r={grainRadius}
                fill="none"
                stroke="rgba(216, 205, 184, 0.08)"
                strokeWidth="0.85"
                strokeDasharray="3 5"
              />
            ))}

            {/* 4. Concentric Annual Growth Rings (Dendrochronology Layers) */}
            {/* Ring 1: Heartwood Pith Boundary */}
            <circle
              cx="410" cy="310" r="115"
              fill="none"
              stroke={activeEntity === 'notes' || activeEntity === 'topics' ? '#4ADE80' : 'rgba(184, 178, 167, 0.26)'}
              strokeWidth={activeEntity === 'notes' || activeEntity === 'topics' ? '2.5' : '1.5'}
              strokeDasharray="8 4"
              style={{ transition: 'stroke 0.3s, stroke-width 0.3s' }}
            />

            {/* Ring 2: Secondary Xylem / Deep Sapwood */}
            <circle
              cx="410" cy="310" r="172"
              fill="none"
              stroke={activeEntity === 'datasets' || activeEntity === 'people' || activeEntity === 'labs' ? '#4ADE80' : 'rgba(184, 178, 167, 0.28)'}
              strokeWidth={activeEntity === 'datasets' || activeEntity === 'people' || activeEntity === 'labs' ? '2.5' : '1.5'}
              strokeDasharray="10 5"
              style={{ transition: 'stroke 0.3s, stroke-width 0.3s' }}
            />

            {/* Ring 3: THE LIVING VASCULAR CAMBIUM LAYER (Active Cell Mitosis & Outward Growth) */}
            {/* Ambient aura behind cambium meristem */}
            <circle
              cx="410" cy="310" r="221"
              fill="none"
              stroke="#4ADE80"
              strokeWidth="5"
              opacity="0.18"
            >
              <animate attributeName="opacity" values="0.12;0.32;0.12" dur="4s" repeatCount="indefinite" />
            </circle>
            {/* Active Cambium ring line with animated mitosis dashes */}
            <circle
              cx="410" cy="310" r="221"
              fill="none"
              stroke="#4ADE80"
              strokeWidth="2.2"
              strokeDasharray="9 6"
              style={{ filter: 'drop-shadow(0 0 6px rgba(74,222,128,0.45))' }}
            >
              <animate attributeName="stroke-dashoffset" values="30;0" dur="12s" repeatCount="indefinite" />
            </circle>

            {/* Ring 4: Outer Sapwood Horizon */}
            <circle
              cx="410" cy="310" r="256"
              fill="none"
              stroke={activeEntity === 'papers' || activeEntity === 'conferences' || activeEntity === 'funding' ? '#4ADE80' : 'rgba(184, 178, 167, 0.3)'}
              strokeWidth={activeEntity === 'papers' || activeEntity === 'conferences' || activeEntity === 'funding' ? '2.5' : '1.5'}
              strokeDasharray="12 6"
              style={{ transition: 'stroke 0.3s, stroke-width 0.3s' }}
            />

            {/* 5. Natural Medullary Wood Rays (Passive radial timber grain) */}
            {passiveRays.map(([x1, y1, x2, y2], idx) => (
              <line
                key={`passive-ray-${idx}`}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="rgba(184, 178, 167, 0.08)"
                strokeWidth="1"
                strokeDasharray="2 4"
              />
            ))}

            {/* 6. Continuous Growth Waves (Simulating how Cambium expands the tree trunk year after year) */}
            {/* Growth Wave Ripple 1 */}
            <circle cx="410" cy="310" r="54" fill="none" stroke="#4ADE80" strokeWidth="1.75">
              <animate attributeName="r" values="54;275" dur="6.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.45;0.22;0" dur="6.5s" repeatCount="indefinite" />
            </circle>
            {/* Growth Wave Ripple 2 (Staggered offset) */}
            <circle cx="410" cy="310" r="54" fill="none" stroke="#66866A" strokeWidth="1.5">
              <animate attributeName="r" values="54;275" dur="6.5s" begin="3.25s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.4;0.18;0" dur="6.5s" begin="3.25s" repeatCount="indefinite" />
            </circle>

            {/* 7. Active Medullary Rays & Nutrient Sap Flow to each Research Entity */}
            {entities.map((node, i) => {
              const isActive = activeEntity === node.id
              return (
                <g key={`ray-group-${node.id}`}>
                  {/* Radial Medullary Conduit */}
                  <line
                    x1="410" y1="310" x2={node.x} y2={node.y}
                    stroke={isActive ? '#4ADE80' : 'rgba(74, 222, 128, 0.24)'}
                    strokeWidth={isActive ? '2' : '1.25'}
                    strokeDasharray="4 4"
                    style={{ transition: 'stroke 0.3s, stroke-width 0.3s' }}
                  >
                    <animate attributeName="stroke-dashoffset" values="16;0" dur={`${2 + (i * 0.15)}s`} repeatCount="indefinite" />
                  </line>

                  {/* Flowing Sap Nutrient Particles (Cambium feeding outward to help research grow) */}
                  <circle r={isActive ? '3.5' : '2.5'} fill="#4ADE80" filter="url(#sapGlowFilter)">
                    <animate attributeName="cx" values={`410;${node.x}`} dur={`${2.2 + (i * 0.18)}s`} repeatCount="indefinite" />
                    <animate attributeName="cy" values={`310;${node.y}`} dur={`${2.2 + (i * 0.18)}s`} repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0;0.95;0.95;0" keyTimes="0;0.15;0.85;1" dur={`${2.2 + (i * 0.18)}s`} repeatCount="indefinite" />
                  </circle>
                </g>
              )
            })}

            {/* 8. Center Core: Heartwood Pith & Living Cambium Meristem Hub */}
            <ellipse cx="410" cy="310" rx="110" ry="110" fill="url(#treePithGlow)">
              <animate attributeName="rx" values="95;125;95" dur="5s" repeatCount="indefinite" />
              <animate attributeName="ry" values="95;125;95" dur="5s" repeatCount="indefinite" />
            </ellipse>

            <g
              style={{ cursor: 'pointer', transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', transformOrigin: '410px 310px' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              {/* Outer pulsing ring */}
              <circle
                cx="410" cy="310" r="58"
                fill="none"
                stroke="#4ADE80"
                strokeWidth="1.75"
                strokeDasharray="6 4"
                opacity="0.8"
              >
                <animate attributeName="stroke-dashoffset" values="20;0" dur="8s" repeatCount="indefinite" />
              </circle>

              {/* Heartwood circle in Warm Sand */}
              <circle
                cx="410" cy="310" r="52"
                fill="#FAF7F0"
                stroke="#3E6248"
                strokeWidth="2.5"
                style={{ filter: 'drop-shadow(0 10px 28px rgba(0,0,0,0.5))' }}
              />

              {/* Official Cambium Golden Spiral Logo */}
              <image href="/public_logo/cambium-logo-light.svg" x="389" y="270" width="42" height="42" />

              {/* Core Typography */}
              <text
                x="410" y="327"
                textAnchor="middle"
                fontFamily="'Instrument Sans', sans-serif"
                fontSize="10"
                fontWeight="700"
                fill="#202920"
                letterSpacing="0.16em"
              >
                CAMBIUM
              </text>
              <text
                x="410" y="338"
                textAnchor="middle"
                fontFamily="'Instrument Sans', sans-serif"
                fontSize="7"
                fontWeight="700"
                fill="#3E6248"
                letterSpacing="0.12em"
              >
                LIVING MERISTEM
              </text>
            </g>

            {/* 9. The 10 Research Entities (Positioned at their respective wood growth rings) */}
            {entities.map(({ id, label, botanical, x, y, delay }) => {
              const isActive = activeEntity === id
              return (
                <g
                  key={id}
                  style={{
                    cursor: 'pointer',
                    transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    transformOrigin: `${x}px ${y}px`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.12)'
                    setActiveEntity(id)
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)'
                    setActiveEntity(null)
                  }}
                >
                  <g>
                    {/* Gentle floating organic drift */}
                    <animateTransform
                      attributeName="transform"
                      type="translate"
                      values="0,0; 0,-6; 0,0"
                      dur="6s"
                      begin={delay}
                      repeatCount="indefinite"
                    />

                    {/* Sand Background Pill Badge with Wood Bark Border */}
                    <rect
                      x={x - 48}
                      y={y - 18}
                      width="96"
                      height="36"
                      rx="18"
                      ry="18"
                      fill="#FAF7F0"
                      stroke={isActive ? '#3E6248' : '#B8B2A7'}
                      strokeWidth={isActive ? '2' : '1.5'}
                      style={{
                        transition: 'stroke 0.25s, fill 0.25s',
                        filter: isActive ? 'drop-shadow(0 8px 24px rgba(74,222,128,0.35))' : 'drop-shadow(0 6px 18px rgba(0,0,0,0.4))',
                      }}
                    />

                    {/* Chlorophyll green active indicator node */}
                    <circle
                      cx={x - 32}
                      cy={y}
                      r="3"
                      fill={isActive ? '#4ADE80' : '#3E6248'}
                      style={{ transition: 'fill 0.25s' }}
                    />

                    {/* Primary Entity Name */}
                    <text
                      x={x + 4}
                      y={y - 2}
                      textAnchor="middle"
                      fontFamily="'Instrument Sans', sans-serif"
                      fontSize="11"
                      fontWeight="700"
                      fill="#202920"
                      letterSpacing="0.02em"
                    >
                      {label}
                    </text>

                    {/* Botanical Growth Role (Reflects what Cambium in nature does to grow the tree) */}
                    <text
                      x={x + 4}
                      y={y + 9}
                      textAnchor="middle"
                      fontFamily="'Instrument Sans', sans-serif"
                      fontSize="7.5"
                      fontWeight="600"
                      fill={isActive ? '#3E6248' : '#62685E'}
                      letterSpacing="0.04em"
                    >
                      {botanical}
                    </text>
                  </g>
                </g>
              )
            })}
          </svg>
        </div>

        {/* Botanical Dendrochronology Legend (Connecting nature's tree growth to Cambium research) */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 max-w-[840px] mx-auto text-xs">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[rgba(24,35,27,0.85)] border border-[rgba(74,222,128,0.2)] text-[rgba(237,234,226,0.8)]">
            <span className="w-2 h-2 rounded-full bg-[#FAF7F0] border border-[#3E6248]" />
            <strong className="text-[#FAF7F0]">Heartwood Pith:</strong> Core Research Identity
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[rgba(24,35,27,0.85)] border border-[rgba(74,222,128,0.2)] text-[rgba(237,234,226,0.8)]">
            <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse" />
            <strong className="text-[#4ADE80]">Living Cambium:</strong> Mitosis & Synthesis Engine
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[rgba(24,35,27,0.85)] border border-[rgba(74,222,128,0.2)] text-[rgba(237,234,226,0.8)]">
            <span className="w-2.5 h-[1.5px] bg-[#4ADE80]" />
            <strong className="text-[rgba(237,234,226,0.9)]">Medullary Rays:</strong> Continuous Sap & Nutrient Flow
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[rgba(24,35,27,0.85)] border border-[rgba(74,222,128,0.2)] text-[rgba(237,234,226,0.8)]">
            <span className="w-2 h-2 rounded-full border border-dashed border-[#B8B2A7]" />
            <strong className="text-[rgba(237,234,226,0.9)]">Annual Growth Rings:</strong> Cumulative Scholarly Horizon
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Testimonials (Photo 5 Aligned with Living Materials Tokens) ────────
function TestimonialsSection() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [likedCard, setLikedCard] = useState<Record<number, boolean>>({})

  const testimonials = [
    {
      initials: 'I',
      quote: 'Cambium gives my research a place to live — not just a list of papers.',
      name: 'Imthiyas',
      role: 'Computer Vision Researcher · MIT',
    },
    {
      initials: 'AR',
      quote: "The difference is that everything is connected to the work I'm actually doing.",
      name: 'Arjun Rao',
      role: 'PhD Researcher · IISc',
    },
    {
      initials: 'DE',
      quote: 'Finally, a research environment that understands how scholars actually work.',
      name: 'Dr. Elena Park',
      role: 'Computational Biology · Stanford University',
    },
  ]

  const handleCopy = (quote: string, idx: number) => {
    navigator.clipboard?.writeText(quote)
    setCopiedIndex(idx)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const toggleLike = (idx: number) => {
    setLikedCard(prev => ({ ...prev, [idx]: !prev[idx] }))
  }

  return (
    <section className="bg-[#FAF7F0] dark:bg-[#0E140F] border-t border-[#E4DCCB] dark:border-[#233327] py-24 px-6 md:px-12 transition-colors duration-200">
      <div className="max-w-[1240px] mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 font-mono text-xs font-bold tracking-wider uppercase text-[#3E6248] dark:text-[#4ADE80] mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3E6248] dark:bg-[#4ADE80]" />
            VOICES OF THE SCHOLARLY NETWORK
          </div>
          <h2 style={{ fontFamily: "'Source Serif 4', serif" }} className="text-3xl md:text-5xl font-normal text-[#202920] dark:text-[#EDEAE2] tracking-tight leading-tight">
            Built around the way research actually happens.
          </h2>
        </div>

        {/* 3-Column Testimonial Cards Grid (Photo 5 Match) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map(({ initials, quote, name, role }, idx) => (
            <div
              key={name}
              className="bg-white dark:bg-[#18231B] border border-[#E4DCCB] dark:border-[#233327] rounded-2xl p-8 shadow-xs hover:border-[#3E6248] dark:hover:border-[#4ADE80] hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group relative"
            >
              {/* Card Header: Quotation Symbol & Micro-Actions */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    style={{ fontFamily: "'Source Serif 4', serif" }}
                    className="text-4xl text-[#3E6248] dark:text-[#4ADE80] leading-none select-none opacity-50 group-hover:opacity-100 transition-opacity"
                  >
                    “
                  </div>
                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleCopy(quote, idx)}
                      className="p-1 rounded-md text-[#85877B] dark:text-[#7E8B7B] hover:text-[#202920] dark:hover:text-[#EDEAE2] hover:bg-[#FAF7F0] dark:hover:bg-[#131C15] text-[11px] font-mono transition-colors cursor-pointer"
                      title="Copy Quote"
                    >
                      {copiedIndex === idx ? 'Copied ✓' : 'Copy'}
                    </button>
                    <button
                      onClick={() => toggleLike(idx)}
                      className="p-1 rounded-md text-[#85877B] dark:text-[#7E8B7B] hover:text-[#3E6248] dark:hover:text-[#4ADE80] hover:bg-[#FAF7F0] dark:hover:bg-[#131C15] text-[12px] transition-colors cursor-pointer"
                      title={likedCard[idx] ? 'Liked' : 'Like'}
                    >
                      {likedCard[idx] ? '♥' : '♡'}
                    </button>
                  </div>
                </div>

                {/* Quote Typography */}
                <p
                  style={{ fontFamily: "'Source Serif 4', serif" }}
                  className="text-[17px] font-normal italic text-[#202920] dark:text-[#EDEAE2] leading-relaxed tracking-tight mb-8"
                >
                  {quote}
                </p>
              </div>

              {/* Author Attribution */}
              <div className="flex items-center gap-3 pt-4 border-t border-[#FAF7F0] dark:border-[#233327]">
                <div className="w-9 h-9 rounded-full bg-[#DCE6D7] dark:bg-[#1A281E] border border-[#3E6248]/20 dark:border-[#4ADE80]/30 flex items-center justify-center font-bold text-xs text-[#3E6248] dark:text-[#4ADE80] shrink-0 group-hover:scale-105 transition-transform">
                  {initials}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-[#202920] dark:text-[#EDEAE2] group-hover:text-[#3E6248] dark:group-hover:text-[#4ADE80] transition-colors">
                    {name}
                  </div>
                  <div className="text-xs text-[#85877B] dark:text-[#7E8B7B] truncate">
                    {role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center font-sans text-xs text-[#85877B] mt-8">
          Personas shown are illustrative and not claims of real customers.
        </p>
      </div>
    </section>
  )
}

// ─── CTA Background Perimeter Constellation (Ultra-Faint Full-Bleed Network) ───
function CtaBackgroundConstellation() {
  const perimeterNodes = [
    { label: 'NSF CAREER Award', sub: '$550k · 14d left', x: 120, y: 75, drift: 'animate-drift-1' },
    { label: 'Multimodal AI', sub: 'Core Discipline', x: 325, y: 65, drift: 'animate-drift-3' },
    { label: 'Cellular Topology GNN', sub: 'Bioinformatics · 2025', x: 1115, y: 65, drift: 'animate-drift-2' },
    { label: 'ICLR 2026', sub: 'Vienna · Oral', x: 1320, y: 75, drift: 'animate-drift-4' },
    { label: 'Zero-Shot Proteomics', sub: 'ICLR Spotlight', x: 95, y: 300, drift: 'animate-drift-2' },
    { label: 'Prof. Aris Thorne', sub: 'Stanford Bio-X · Bio-AI', x: 1345, y: 300, drift: 'animate-drift-1' },
    { label: 'MIT CSAIL Lab', sub: 'Institutional Node', x: 130, y: 520, drift: 'animate-drift-4' },
    { label: 'Graph Transformers', sub: 'Methodological Core', x: 345, y: 535, drift: 'animate-drift-1' },
    { label: 'Wellcome Discovery', sub: '£780k · Stage 2', x: 1095, y: 535, drift: 'animate-drift-3' },
    { label: 'BioSynthetica-40k', sub: 'Open Benchmark', x: 1310, y: 520, drift: 'animate-drift-2' },
  ]

  const links = [
    [0, 1], [0, 4], [4, 6], [6, 7],
    [3, 2], [3, 5], [5, 9], [9, 8],
    [1, 2], [7, 8]
  ]

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden select-none z-0">
      <svg
        viewBox="0 0 1440 600"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full"
        style={{ opacity: 0.32 }}
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="ctaConstellationGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#4ADE80" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#18231B" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient background wash */}
        <rect x="0" y="0" width="1440" height="600" fill="url(#ctaConstellationGlow)" />

        {/* Delicate Connecting Lines */}
        {links.map(([i, j], idx) => {
          const a = perimeterNodes[i]
          const b = perimeterNodes[j]
          return (
            <line
              key={idx}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="rgba(74, 222, 128, 0.06)"
              strokeWidth="1"
              strokeDasharray="4 8"
            >
              <animate
                attributeName="stroke-dashoffset"
                values="24;0"
                dur={`${9 + (idx % 3) * 2}s`}
                repeatCount="indefinite"
              />
            </line>
          )
        })}

        {/* Perimeter Badges */}
        {perimeterNodes.map((node, i) => (
          <g key={i} className={node.drift} style={{ transformBox: 'fill-box', transformOrigin: `${node.x}px ${node.y}px` }}>
            {/* Center dot connector */}
            <circle cx={node.x} cy={node.y} r="2" fill="rgba(74, 222, 128, 0.3)" />
            <circle cx={node.x} cy={node.y} r="4" fill="none" stroke="rgba(74, 222, 128, 0.12)" strokeWidth="0.75" />

            {/* Pill Container */}
            <rect
              x={node.x - 72}
              y={node.y - 20}
              width="144"
              height="40"
              rx="8"
              ry="8"
              fill="rgba(16, 26, 18, 0.45)"
              stroke="rgba(74, 222, 128, 0.08)"
              strokeWidth="1"
            />

            {/* Label */}
            <text
              x={node.x}
              y={node.y - 4}
              textAnchor="middle"
              fontFamily="'Instrument Sans', sans-serif"
              fontSize="10"
              fontWeight="600"
              fill="rgba(237, 234, 226, 0.28)"
              letterSpacing="0.01em"
            >
              {node.label}
            </text>

            {/* Subtext */}
            <text
              x={node.x}
              y={node.y + 11}
              textAnchor="middle"
              fontFamily="'Instrument Sans', sans-serif"
              fontSize="8.5"
              fontWeight="400"
              fill="rgba(163, 184, 153, 0.18)"
              letterSpacing="0.02em"
            >
              {node.sub}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}

// ─── Final CTA ────────────────────────────────────────────────────────────────
function CTASection() {
  return (
    <section id="cta" style={{ background: C.darkBg, borderTop: '1px solid rgba(46,125,79,0.35)', borderBottom: '1px solid rgba(46,125,79,0.35)', padding: '112px 24px', position: 'relative', overflow: 'hidden' }}>
      {/* Subtle organic ambient glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_25%,rgba(46,204,113,0.06)_0%,transparent_70%)]" />

      {/* Full-bleed subtle perimeter network animation across the entire section */}
      <CtaBackgroundConstellation />

      <div style={{ maxWidth: 1280, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        <div className="inline-flex items-center gap-2 font-mono text-xs font-bold tracking-wider uppercase text-[#4ADE80] mb-7">
          <span className="w-5 h-[1px] bg-[#4ADE80] inline-block" />
          CAMBIUM RESEARCH
          <span className="w-5 h-[1px] bg-[#4ADE80] inline-block" />
        </div>

        <h2 style={{ fontFamily: "'Source Serif 4', serif" }} className="text-4xl md:text-6xl font-normal leading-[1.08] tracking-[-0.03em] text-[#F5F4F0] mb-6">
          Your research deserves a home.
        </h2>

        <p className="text-lg leading-relaxed text-[rgba(245,244,240,0.72)] max-w-[520px] mx-auto mb-12">
          Build your academic identity. Discover what's next. Connect your ideas, people, and opportunities.
        </p>

        <div className="flex gap-3.5 justify-center flex-wrap items-center">
          <Link
            href="/sign-up"
            className="text-[15px] font-semibold text-white bg-[#3E6248] hover:bg-[#293E30] px-8 py-4 rounded-xl shadow-md hover:shadow-lg transition-all no-underline inline-block border border-[#66866A]/40"
          >
            Create your research identity
          </Link>
          <Link
            href="/discover"
            className="text-[15px] font-medium text-white bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/40 px-8 py-4 rounded-xl transition-all inline-flex items-center gap-2 no-underline"
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
    <footer className="bg-[#FAF7F0] dark:bg-[#0E140F] border-t border-[#E4DCCB] dark:border-[#233327] px-6 md:px-16 pt-16 pb-10 transition-colors duration-200">
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr repeat(4, 1fr)', gap: 48, marginBottom: 56 }}>
          {/* Brand */}
          <div>
            <div className="font-brand font-bold text-base tracking-[-0.03em] text-[#202920] dark:text-[#EDEAE2] flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded-full bg-[#FAF7F0] dark:bg-[#18231B] border border-[#E4DCCB] dark:border-[#233327] p-0.5 flex items-center justify-center overflow-hidden">
                <img src="/public_logo/cambium-logo-light.svg" alt="CAMBIUM Research Logo" className="w-full h-full object-contain block dark:hidden scale-[1.3] transition-transform" />
                <img src="/public_logo/cambium-logo-dark.svg" alt="CAMBIUM Research Logo" className="w-full h-full object-contain hidden dark:block scale-[1.3] transition-transform" />
              </div>
              <span className="uppercase">
                CAMBIUM <span className="font-light text-[#3E6248] dark:text-[#4ADE80]">RESEARCH</span>
              </span>
            </div>
            <p className="text-xs text-[#62685E] dark:text-[#A3B899] leading-relaxed max-w-[200px]">The Research Operating System.</p>
          </div>

          {/* Link columns */}
          {cols.map(({ heading, links }) => (
            <div key={heading}>
              <div className="text-[11px] font-bold tracking-wider text-[#3E6248] dark:text-[#4ADE80] uppercase mb-4">{heading}</div>
              <div className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-xs text-[#62685E] dark:text-[#A3B899] hover:text-[#202920] dark:hover:text-[#EDEAE2] no-underline transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center pt-6 border-t border-[#E4DCCB] dark:border-[#233327] flex-wrap gap-4 text-xs text-[#85877B] dark:text-[#7E8B7B]">
          <span>© 2026 Cambium Research. All rights reserved.</span>
          <div className="flex gap-6">
            {[
              { label: 'Terms of Service', href: '/terms' },
              { label: 'Privacy Policy', href: '/privacy' },
              { label: 'AI Disclaimer', href: '/disclaimer' },
              { label: 'Security & Help', href: '/help' },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="text-xs text-[#62685E] dark:text-[#A3B899] hover:text-[#202920] dark:hover:text-[#EDEAE2] no-underline transition-colors"
              >
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
        suppressHydrationWarning
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
    <div className="fixed bottom-20 right-6 z-40 flex flex-col items-end gap-3 max-w-sm">
      <div className="bg-white/95 dark:bg-[#18231B]/95 text-[#202920] dark:text-[#EDEAE2] rounded-xl p-4 shadow-xl border border-[#E4DCCB] dark:border-[#233327] flex items-center justify-between gap-4 w-full backdrop-blur-md transform transition-all duration-300 hover:scale-[1.01]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#DCE6D7] dark:bg-[#1A281E] rounded-lg text-[#3E6248] dark:text-[#4ADE80] border border-[#66866A]/30 dark:border-[#4ADE80]/30 shadow-xs">
            <User className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-sans text-xs font-semibold tracking-wide uppercase text-[#202920] dark:text-[#EDEAE2]">
              Identity System Active
            </span>
            <span className="font-sans text-[11px] text-[#62685E] dark:text-[#A3B899] mt-0.5">
              Verified cryptographic ledger anchor
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 bg-[#DCE6D7] dark:bg-[#1A281E] border border-[#66866A]/20 dark:border-[#4ADE80]/30 px-2.5 py-0.5 rounded-full text-[#3E6248] dark:text-[#4ADE80] shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3E6248] dark:bg-[#4ADE80] animate-pulse" />
            <span className="font-sans text-[10px] font-bold tracking-tight text-[#3E6248] dark:text-[#4ADE80]">Active</span>
          </div>
          <button
            suppressHydrationWarning
            onClick={() => setOpen(false)}
            className="text-[#85877B] hover:text-[#202920] dark:text-[#7E8B7B] dark:hover:text-[#EDEAE2] text-xs p-1 bg-transparent border-0 cursor-pointer ml-1 transition-colors"
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
    document.title = "CAMBIUM RESEARCH — The Enterprise Research Operating System";
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("intro") === "1" || params.get("splash") === "1") {
        setReplayIntro(true);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF7F0] dark:bg-[#0E140F] text-[#202920] dark:text-[#EDEAE2] transition-colors duration-200" style={{ fontFamily: "var(--font-sans), 'Instrument Sans', system-ui, sans-serif" }}>
      <CambiumIntroPreloader key={replayIntro ? "intro-replay" : "intro-initial"} forceShow={replayIntro} onComplete={() => setReplayIntro(false)} />
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
