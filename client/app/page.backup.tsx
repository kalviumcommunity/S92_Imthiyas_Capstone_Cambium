"use client";

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import CambiumLogo from '@/components/CambiumLogo'

// ─── Design System Tokens (SSOT from 01_Design Systems) ─────────────────────
const C = {
  bg: '#F7F6F1', // surface/base
  surfaceRaised: '#FFFFFF', // surface/raised
  surfaceSunken: '#EEECE6', // surface/sunken
  charcoal: '#17201D', // ink/primary
  secondary: '#66716C', // ink/secondary
  tertiary: '#9CAAA5', // ink/tertiary
  rule: '#DDE2DE', // border/default
  borderStrong: '#B8C4C0', // border/strong
  moss: '#173F35', // accent/moss-600 (Primary Forest)
  moss500: '#285C4D', // accent/moss-500
  mossLight: '#DCEBE4', // accent/moss-100 (Brand Accent)
  moss050: '#EFF5F2', // accent/moss-050
  mossMid: '#285C4D',
  darkBg: '#173F35', // surface/inverse
  darkSurface: '#0D2B22', // accent/moss-700
  darkBorder: '#285C4D',
}

// ─── Navigation ──────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: 'background 0.3s ease, border-color 0.3s ease, backdrop-filter 0.3s ease',
        background: scrolled ? 'rgba(247,246,241,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? `1px solid ${C.rule}` : '1px solid transparent',
      }}
    >
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 40px', display: 'flex', alignItems: 'center', height: 64, gap: 40 }}>
        {/* Official Cambium Logo */}
        <CambiumLogo size="md" href="/" />

        {/* Nav links */}
        <nav style={{ display: 'flex', gap: 40, marginLeft: 16 }} className="hidden-mobile">
          {[
            { label: 'Discover', href: '#discover' },
            { label: 'Community', href: '#community' },
            { label: 'Opportunity', href: '#opportunities' },
            { label: 'Research', href: '#research' },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: C.secondary,
                textDecoration: 'none',
                letterSpacing: '-0.01em',
                transition: 'color 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = C.charcoal }}
              onMouseLeave={(e) => { e.currentTarget.style.color = C.secondary }}
            >
              {label}
            </a>
          ))}
        </nav>

        <div style={{ flex: 1 }} />

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }} className="hidden-mobile">
          <a
            href="/sign-in"
            style={{ fontSize: 14, fontWeight: 500, color: C.secondary, textDecoration: 'none', transition: 'color 0.15s' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = C.charcoal }}
            onMouseLeave={(e) => { e.currentTarget.style.color = C.secondary }}
          >
            Sign in
          </a>
          <Link
            href="/sign-up"
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: '#fff',
              background: C.moss,
              border: 'none',
              padding: '9px 18px',
              borderRadius: 6,
              cursor: 'pointer',
              letterSpacing: '-0.01em',
              transition: 'background 0.15s',
              whiteSpace: 'nowrap',
              textDecoration: 'none',
              display: 'inline-block',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = C.mossMid }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = C.moss }}
          >
            Create your research identity
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
          className="mobile-menu-btn"
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.charcoal} strokeWidth="1.5">
            <line x1="3" y1="7" x2="21" y2="7" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="17" x2="21" y2="17" />
          </svg>
        </button>
      </div>
    </header>
  )
}

// ─── Hero Ecosystem Graph ─────────────────────────────────────────────────────
function EcosystemGraph({ dark = false }: { dark?: boolean }) {
  const nodes = [
    { id: 'researcher', x: 180, y: 170, type: 'researcher', label: 'Imthiyas', sub: 'Computer Vision', color: C.moss },
    { id: 'paper',      x: 380, y: 110, type: 'paper',      label: 'Vision-Language Models', sub: 'for Scientific Discovery', color: dark ? '#4A6B4C' : '#5C7A5E' },
    { id: 'topic',      x: 390, y: 260, type: 'topic',      label: 'Computer Vision', sub: 'Research Area', color: '#7A6B4A' },
    { id: 'grant',      x: 90,  y: 290, type: 'grant',      label: 'NSF Research Grant', sub: 'Deadline · 18 days', color: '#6B4A4A' },
    { id: 'conf',       x: 300, y: 380, type: 'conf',       label: 'NeurIPS 2026', sub: 'Conference', color: '#4A5B7A' },
    { id: 'lab',        x: 60,  y: 140, type: 'lab',        label: 'Research Lab', sub: 'MIT CSAIL', color: '#6B5A7A' },
    { id: 'project',    x: 440, y: 360, type: 'project',    label: 'Multimodal Discovery', sub: 'Active Project', color: '#5A7A6B' },
    { id: 'dataset',    x: 220, y: 420, type: 'dataset',    label: 'Dataset', sub: 'Open Access', color: '#7A7A4A' },
  ]

  const edges = [
    ['researcher', 'paper'],
    ['researcher', 'topic'],
    ['researcher', 'grant'],
    ['researcher', 'lab'],
    ['paper', 'conf'],
    ['paper', 'topic'],
    ['paper', 'project'],
    ['conf', 'dataset'],
    ['project', 'dataset'],
  ]

  const getNode = (id: string) => nodes.find((n) => n.id === id)!

  const textColor = dark ? 'rgba(250,249,246,0.9)' : C.charcoal
  const subColor = dark ? 'rgba(250,249,246,0.45)' : C.secondary
  const cardBg = dark ? C.darkSurface : C.bg
  const cardBorder = dark ? C.darkBorder : C.rule

  return (
    <svg
      viewBox="0 0 560 480"
      style={{ width: '100%', height: '100%' }}
      aria-label="Research ecosystem visualization showing connected research nodes"
    >
      {/* Subtle grid */}
      <defs>
        <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M 24 0 L 0 0 0 24" fill="none" stroke={dark ? 'rgba(255,255,255,0.03)' : 'rgba(30,30,28,0.04)'} strokeWidth="0.5" />
        </pattern>
        <marker id="arrowMoss" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <circle cx="3" cy="3" r="1.5" fill={C.moss} opacity="0.5" />
        </marker>
      </defs>
      <rect width="560" height="480" fill="url(#grid)" />

      {/* Connection lines */}
      {edges.map(([aId, bId], i) => {
        const a = getNode(aId)
        const b = getNode(bId)
        return (
          <line
            key={i}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke={dark ? 'rgba(92,122,94,0.25)' : 'rgba(92,122,94,0.2)'}
            strokeWidth="1"
            className="connection-line"
            style={{ animationDelay: `${0.6 + i * 0.07}s` }}
          />
        )
      })}

      {/* Nodes */}
      {nodes.map((node, i) => {
        const isCenter = node.id === 'researcher'
        const w = isCenter ? 148 : 130
        const h = isCenter ? 52 : 44
        return (
          <g key={node.id} className="node-card" style={{ animationDelay: `${0.7 + i * 0.06}s` }}>
            {/* Node dot on line intersection */}
            <circle cx={node.x} cy={node.y} r={isCenter ? 4 : 3} fill={node.color} opacity="0.8" />

            {/* Card */}
            <foreignObject
              x={node.x - w / 2}
              y={node.y - h - 8}
              width={w}
              height={h}
              style={{ overflow: 'visible' }}
            >
              <div
                style={{
                  background: cardBg,
                  border: `1px solid ${isCenter ? node.color + '55' : cardBorder}`,
                  borderRadius: 6,
                  padding: '6px 10px',
                  boxShadow: isCenter
                    ? `0 0 0 1px ${node.color}22, 0 4px 16px rgba(0,0,0,0.06)`
                    : '0 2px 8px rgba(0,0,0,0.05)',
                  fontFamily: 'Inter, sans-serif',
                  cursor: 'default',
                  transition: 'transform 0.15s, box-shadow 0.15s',
                  borderTop: `2px solid ${node.color}`,
                }}
              >
                <div style={{ fontSize: isCenter ? 11 : 10, fontWeight: 600, color: textColor, letterSpacing: '-0.01em', lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {node.label}
                </div>
                <div style={{ fontSize: 9, color: subColor, marginTop: 2, letterSpacing: '0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {node.sub}
                </div>
              </div>
            </foreignObject>
          </g>
        )
      })}
    </svg>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section
      style={{
        minHeight: '100vh',
        background: C.bg,
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: 64,
      }}
    >
      {/* Subtle texture */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 70% 40%, rgba(92,122,94,0.04) 0%, transparent 60%)' }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 88px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center', width: '100%' }}>
        {/* Left: Copy */}
        <div>
          <div
            className="animate-fade-up"
            style={{
              animationDelay: '0.2s',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.12em',
              color: C.moss,
              marginBottom: 28,
              textTransform: 'uppercase',
            }}
          >
            <span style={{ width: 20, height: 1, background: C.moss, display: 'inline-block' }} />
            The Research Operating System
          </div>

          <h1
            className="animate-fade-up"
            style={{
              animationDelay: '0.2s',
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontSize: 'clamp(48px, 5vw, 72px)',
              fontWeight: 400,
              lineHeight: 1.08,
              letterSpacing: '-0.03em',
              color: C.charcoal,
              marginBottom: 28,
            }}
          >
            Your research world,{' '}
            <em style={{ fontStyle: 'italic', color: C.moss }}>connected.</em>
          </h1>

          <p
            className="animate-fade-up"
            style={{
              animationDelay: '0.35s',
              fontSize: 18,
              lineHeight: 1.65,
              color: C.secondary,
              maxWidth: 480,
              marginBottom: 44,
              fontWeight: 400,
            }}
          >
            Discover ideas, build your academic identity, collaborate with researchers, explore opportunities, and organize the knowledge behind your work — all in one living research environment.
          </p>

          <div className="animate-fade-up" style={{ animationDelay: '0.5s', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link
              href="/sign-up"
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: '#fff',
                background: C.moss,
                padding: '14px 24px',
                borderRadius: 6,
                cursor: 'pointer',
                letterSpacing: '-0.01em',
                transition: 'background 0.15s, transform 0.15s',
                textDecoration: 'none',
                display: 'inline-block',
              }}
              onMouseEnter={(e) => { const b = e.currentTarget; b.style.background = C.mossMid; b.style.transform = 'translateY(-1px)' }}
              onMouseLeave={(e) => { const b = e.currentTarget; b.style.background = C.moss; b.style.transform = '' }}
            >
              Get started — it&apos;s free
            </Link>
            <Link
              href="/sign-in"
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: C.charcoal,
                background: 'transparent',
                border: `1px solid ${C.rule}`,
                padding: '14px 24px',
                borderRadius: 6,
                cursor: 'pointer',
                letterSpacing: '-0.01em',
                transition: 'border-color 0.15s, transform 0.15s',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => { const b = e.currentTarget; b.style.borderColor = C.secondary; b.style.transform = 'translateY(-1px)' }}
              onMouseLeave={(e) => { const b = e.currentTarget; b.style.borderColor = C.rule; b.style.transform = '' }}
            >
              Explore Cambium
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 7h8M8 4l3 3-3 3" /></svg>
            </Link>
          </div>

          <div className="animate-fade-up" style={{ animationDelay: '0.6s', marginTop: 56, display: 'flex', gap: 40 }}>
            {[['Identity', 'Academic'], ['Workspace', 'Research'], ['Discovery', 'Intelligent']].map(([label, sub]) => (
              <div key={label}>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.charcoal }}>{label}</div>
                <div style={{ fontSize: 12, color: C.tertiary, marginTop: 2 }}>{sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Ecosystem graph */}
        <div
          className="animate-fade-in"
          style={{
            animationDelay: '0.6s',
            height: 480,
            position: 'relative',
          }}
        >
          <EcosystemGraph />
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <div style={{ fontSize: 11, letterSpacing: '0.1em', color: C.tertiary, textTransform: 'uppercase' }}>Scroll</div>
        <div style={{ width: 1, height: 32, background: `linear-gradient(${C.tertiary}, transparent)` }} />
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
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="9" r="8" stroke={C.moss} strokeWidth="1.5" />
                  <circle cx="9" cy="9" r="3.5" fill={C.moss} />
                </svg>
                <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: '-0.03em', color: C.charcoal }}>CAMBIUM</span>
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

// ─── Lifecycle Section ────────────────────────────────────────────────────────
function LifecycleSection() {
  const stages = ['Discover', 'Explore', 'Connect', 'Work', 'Publish', 'Share', 'Grow']

  return (
    <section id="discover" style={{ background: '#F5F4F0', borderTop: `1px solid ${C.rule}`, borderBottom: `1px solid ${C.rule}`, padding: '120px 88px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Source Serif 4', serif", fontSize: 'clamp(32px, 3.5vw, 48px)', fontWeight: 400, letterSpacing: '-0.03em', color: C.charcoal, marginBottom: 16 }}>
          One system for the entire research lifecycle.
        </h2>
        <p style={{ fontSize: 16, color: C.secondary, marginBottom: 64 }}>From first question to published work and beyond.</p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
          {stages.map((stage, i) => (
            <div key={stage} style={{ display: 'flex', alignItems: 'center' }}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 12,
                  padding: '0 8px',
                  cursor: 'default',
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    border: `1.5px solid ${i === 0 ? C.moss : C.rule}`,
                    background: i === 0 ? C.mossLight : C.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 600,
                    color: i === 0 ? C.moss : C.tertiary,
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLDivElement
                    el.style.border = `1.5px solid ${C.moss}`
                    el.style.background = C.mossLight
                    el.style.color = C.moss
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLDivElement
                    el.style.border = i === 0 ? `1.5px solid ${C.moss}` : `1.5px solid ${C.rule}`
                    el.style.background = i === 0 ? C.mossLight : C.bg
                    el.style.color = i === 0 ? C.moss : C.tertiary
                  }}
                >
                  {i + 1}
                </div>
                <span style={{ fontSize: 13, fontWeight: 500, color: C.charcoal }}>{stage}</span>
              </div>
              {i < stages.length - 1 && (
                <div style={{ width: 32, height: 1, background: C.rule, marginBottom: 20 }} />
              )}
            </div>
          ))}
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
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: C.moss, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 20, flexShrink: 0 }}>MC</div>
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

// ─── Research Workspace Section ───────────────────────────────────────────────
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
    <section style={{ background: '#F0EEE8', borderTop: `1px solid ${C.rule}`, padding: '120px 88px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', color: C.moss, textTransform: 'uppercase', marginBottom: 16 }}>Research Workspace</p>
          <h2 style={{ fontFamily: "'Source Serif 4', serif", fontSize: 'clamp(32px, 3.5vw, 48px)', fontWeight: 400, letterSpacing: '-0.03em', color: C.charcoal, marginBottom: 16 }}>
            Your research has a home.
          </h2>
          <p style={{ fontSize: 17, color: C.secondary, maxWidth: 480, margin: '0 auto' }}>
            Organize your notes, literature, experiments, and drafts in a structured research environment built for scholarly work.
          </p>
        </div>

        {/* Workspace mockup */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '220px 1fr',
          border: `1px solid ${C.rule}`,
          borderRadius: 10,
          overflow: 'hidden',
          boxShadow: '0 12px 48px rgba(0,0,0,0.07)',
          background: C.bg,
          minHeight: 480,
        }}>
          {/* Sidebar */}
          <div style={{ background: '#F5F4F0', borderRight: `1px solid ${C.rule}`, padding: '20px 0' }}>
            <div style={{ padding: '0 16px 16px', borderBottom: `1px solid ${C.rule}`, marginBottom: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', color: C.tertiary, textTransform: 'uppercase' }}>Workspace</div>
            </div>
            {sidebarItems.map(({ icon, label, active, indent }) => (
              <div
                key={label}
                style={{
                  padding: `7px ${16 + indent * 12}px`,
                  fontSize: 12.5,
                  fontWeight: active ? 500 : 400,
                  color: active ? C.charcoal : C.secondary,
                  background: active ? C.mossLight : 'transparent',
                  borderLeft: active ? `2px solid ${C.moss}` : '2px solid transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  transition: 'background 0.1s',
                }}
              >
                <span style={{ fontSize: 11 }}>{icon}</span>
                {label}
              </div>
            ))}
          </div>

          {/* Document */}
          <div style={{ padding: 32, overflow: 'auto' }}>
            <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 11, color: C.tertiary }}>Literature Review</span>
              <span style={{ fontSize: 11, color: C.tertiary }}>/</span>
              <span style={{ fontSize: 11, fontWeight: 500, color: C.charcoal }}>Multimodal Learning</span>
            </div>

            <h3 style={{ fontFamily: "'Source Serif 4', serif", fontSize: 24, fontWeight: 600, color: C.charcoal, letterSpacing: '-0.02em', marginBottom: 8 }}>
              Multimodal Learning — Literature Review
            </h3>

            <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
              {['Computer Vision', 'Multimodal AI', 'Foundation Models'].map((t) => (
                <span key={t} style={{ fontSize: 11, fontWeight: 500, padding: '3px 8px', background: C.mossLight, color: C.mossMid, borderRadius: 4 }}>{t}</span>
              ))}
            </div>

            <div style={{ marginBottom: 24, padding: '16px 20px', background: '#F5F4F0', borderLeft: `3px solid ${C.moss}`, borderRadius: '0 6px 6px 0' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: C.moss, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>Research Question</div>
              <p style={{ fontSize: 14, color: C.charcoal, lineHeight: 1.6 }}>How can multimodal models improve scientific literature discovery?</p>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.charcoal, marginBottom: 12 }}>Key Findings</div>
              {[
                'Cross-modal retrieval improves discovery quality significantly over single-modality approaches.',
                'Domain-specific embeddings outperform generic representations in scientific contexts.',
                'Citation context provides useful relevance signals for downstream ranking tasks.',
              ].map((finding, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 10, fontSize: 13, color: C.secondary, lineHeight: 1.6 }}>
                  <span style={{ color: C.moss, fontWeight: 600, flexShrink: 0 }}>{i + 1}.</span>
                  {finding}
                </div>
              ))}
            </div>

            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.charcoal, marginBottom: 10 }}>Referenced Papers</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { title: 'CLIP: Connecting Text and Images', venue: 'OpenAI · 2021', cited: true },
                  { title: 'Flamingo: a Visual Language Model', venue: 'DeepMind · 2022', cited: false },
                ].map((p) => (
                  <div key={p.title} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', border: `1px solid ${C.rule}`, borderRadius: 6 }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <rect x="1" y="1" width="12" height="12" rx="2" stroke={C.tertiary} strokeWidth="1" />
                      <line x1="3" y1="4.5" x2="11" y2="4.5" stroke={C.tertiary} strokeWidth="1" />
                      <line x1="3" y1="7" x2="9" y2="7" stroke={C.tertiary} strokeWidth="1" />
                    </svg>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 500, color: C.charcoal }}>{p.title}</div>
                      <div style={{ fontSize: 11, color: C.tertiary }}>{p.venue}</div>
                    </div>
                    {p.cited && <span style={{ fontSize: 10, fontWeight: 500, padding: '2px 6px', background: C.mossLight, color: C.mossMid, borderRadius: 3 }}>Cited</span>}
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
    <section id="opportunities" style={{ background: C.bg, borderTop: `1px solid ${C.rule}`, padding: '120px 88px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, flexWrap: 'wrap', gap: 24 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', color: C.moss, textTransform: 'uppercase', marginBottom: 16 }}>Opportunity Discovery</p>
            <h2 style={{ fontFamily: "'Source Serif 4', serif", fontSize: 'clamp(32px, 3.5vw, 48px)', fontWeight: 400, letterSpacing: '-0.03em', color: C.charcoal }}>
              Find the opportunities that fit your research.
            </h2>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0, borderBottom: `1px solid ${C.rule}`, marginBottom: 32 }}>
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '10px 20px',
                fontSize: 13,
                fontWeight: 500,
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab ? `2px solid ${C.moss}` : '2px solid transparent',
                color: activeTab === tab ? C.moss : C.secondary,
                cursor: 'pointer',
                marginBottom: -1,
                transition: 'color 0.15s',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {items.map((opp) => (
            <div
              key={opp.title}
              style={{
                background: C.bg,
                border: `1px solid ${opp.hot ? C.moss + '44' : C.rule}`,
                borderTop: `2px solid ${opp.hot ? C.moss : C.rule}`,
                borderRadius: 8,
                padding: 20,
                cursor: 'pointer',
                transition: 'transform 0.15s, box-shadow 0.15s',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              }}
              onMouseEnter={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.transform = 'translateY(-2px)'; el.style.boxShadow = '0 8px 24px rgba(0,0,0,0.07)' }}
              onMouseLeave={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.transform = ''; el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.03)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <span style={{ fontSize: 11, fontWeight: 500, padding: '3px 8px', background: '#F0EEE8', color: C.secondary, borderRadius: 4 }}>{opp.type}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: opp.hot ? '#C05C3A' : C.tertiary, background: opp.hot ? '#FDF0EC' : '#F5F4F0', padding: '3px 8px', borderRadius: 4 }}>
                  {opp.deadline} {opp.deadline.includes('days') ? 'left' : ''}
                </span>
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: C.charcoal, letterSpacing: '-0.02em', marginBottom: 6, lineHeight: 1.35 }}>{opp.title}</div>
              <div style={{ fontSize: 12, color: C.secondary, marginBottom: 12 }}>{opp.org}</div>
              {opp.funding && (
                <div style={{ fontSize: 13, fontWeight: 600, color: C.moss, marginBottom: 12 }}>{opp.funding}</div>
              )}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {opp.tags.map((t) => (
                  <span key={t} style={{ fontSize: 11, padding: '3px 8px', border: `1px solid ${C.rule}`, borderRadius: 4, color: C.secondary }}>{t}</span>
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
            <div style={{ background: C.bg, border: `1px solid ${C.rule}`, borderRadius: 10, padding: 28, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
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

          {/* Insight panel mockup */}
          <div>
            {/* Paper context */}
            <div style={{ background: C.darkSurface, border: `1px solid ${C.darkBorder}`, borderRadius: 8, padding: 20, marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: 'rgba(250,249,246,0.35)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>Currently reading</div>
              <div style={{ fontSize: 14, fontWeight: 500, color: '#F5F4F0', lineHeight: 1.4 }}>Foundation Models for Scientific Discovery</div>
              <div style={{ fontSize: 12, color: 'rgba(250,249,246,0.4)', marginTop: 4 }}>Imthiyas, Rao, Park · NeurIPS 2026</div>
            </div>

            {/* Insight card */}
            <div style={{ background: C.darkSurface, border: `1px solid ${C.moss}44`, borderTop: `2px solid ${C.moss}`, borderRadius: 8, padding: 20 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: `${C.moss}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="5" stroke={C.moss} strokeWidth="1.5" />
                    <path d="M7 4.5v3M7 9v.5" stroke={C.moss} strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.moss }}>Cambium Research Insight</div>
              </div>

              <p style={{ fontSize: 14, color: 'rgba(250,249,246,0.7)', lineHeight: 1.6, marginBottom: 20 }}>
                This paper connects strongly with your work on multimodal scientific discovery. Several co-authors are active in areas you're exploring.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
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
                      padding: '10px 14px',
                      background: `${C.moss}11`,
                      borderRadius: 6,
                      cursor: 'pointer',
                      border: `1px solid ${C.darkBorder}`,
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = `${C.moss}22` }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = `${C.moss}11` }}
                  >
                    <span style={{ fontSize: 13, color: 'rgba(250,249,246,0.65)' }}>{label}</span>
                    <span style={{ fontSize: 13, color: C.moss, fontWeight: 600 }}>{count} {icon}</span>
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
    <section style={{ background: C.darkBg, borderTop: `1px solid #2E2E2C`, padding: '120px 88px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', textAlign: 'center' }}>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', color: C.moss, textTransform: 'uppercase', marginBottom: 20 }}>Research Ecosystem</p>
        <h2 style={{ fontFamily: "'Source Serif 4', serif", fontSize: 'clamp(36px, 4vw, 60px)', fontWeight: 400, lineHeight: 1.08, letterSpacing: '-0.03em', color: '#F5F4F0', marginBottom: 16 }}>
          Everything connects.
        </h2>
        <p style={{ fontSize: 17, color: 'rgba(250,249,246,0.45)', marginBottom: 64, maxWidth: 480, margin: '0 auto 64px' }}>
          Your research doesn't exist in isolation. Cambium maps the living network around your work.
        </p>

        {/* Large ecosystem SVG */}
        <div style={{ maxWidth: 700, margin: '0 auto', height: 500 }}>
          <svg viewBox="0 0 700 500" style={{ width: '100%', height: '100%', overflow: 'visible' }} aria-label="Research ecosystem map">
            <defs>
              <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={C.moss} stopOpacity="0.3">
                  <animate attributeName="stop-opacity" values="0.15;0.4;0.15" dur="4s" repeatCount="indefinite" />
                </stop>
                <stop offset="100%" stopColor={C.moss} stopOpacity="0" />
              </radialGradient>
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
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={`rgba(92,122,94,0.35)`} strokeWidth="1.5" strokeDasharray="6 6">
                <animate attributeName="stroke-dashoffset" values="12;0" dur={`${1.5 + (i * 0.1)}s`} repeatCount="indefinite" />
              </line>
            ))}

            {/* Center node: YOUR RESEARCH */}
            <g style={{ cursor: 'pointer', transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', transformOrigin: '350px 250px' }} 
               onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'} 
               onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
              <circle cx="350" cy="250" r="54" fill={C.darkSurface} stroke={C.moss} strokeWidth="2">
                <animate attributeName="stroke-width" values="1.5;4;1.5" dur="3s" repeatCount="indefinite" />
              </circle>
              <text x="350" y="247" textAnchor="middle" fontFamily="Inter" fontSize="11" fontWeight="700" fill={C.moss} letterSpacing="0.08em">YOUR</text>
              <text x="350" y="262" textAnchor="middle" fontFamily="Inter" fontSize="11" fontWeight="700" fill={C.moss} letterSpacing="0.08em">RESEARCH</text>
            </g>

            {/* Satellite nodes */}
            {[
              { label: 'Papers', x: 350, y: 64, color: '#6B7A5A', delay: '0s' },
              { label: 'People', x: 568, y: 128, color: '#4A6B8A', delay: '-1s' },
              { label: 'Projects', x: 624, y: 272, color: '#5A6B7A', delay: '-2s' },
              { label: 'Labs', x: 536, y: 416, color: '#6B5A7A', delay: '-3s' },
              { label: 'Topics', x: 350, y: 440, color: '#7A7A4A', delay: '-0.5s' },
              { label: 'Journals', x: 164, y: 416, color: '#7A6B5A', delay: '-1.5s' },
              { label: 'Conferences', x: 76, y: 272, color: '#6B7A5A', delay: '-2.5s' },
              { label: 'Funding', x: 132, y: 128, color: '#5A7A6B', delay: '-3.5s' },
              { label: 'Datasets', x: 216, y: 52, color: '#7A6B4A', delay: '-0.8s' },
              { label: 'Notes', x: 484, y: 52, color: '#5A6B5A', delay: '-1.8s' },
            ].map(({ label, x, y, color, delay }) => (
              <g 
                key={label}
                style={{ 
                  cursor: 'pointer', 
                  transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)', 
                  transformOrigin: `${x}px ${y}px`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.2)';
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
                  <circle 
                    cx={x} cy={y} r="32" 
                    fill={C.darkSurface} 
                    stroke={`${color}`} 
                    strokeWidth="2" 
                    style={{ transition: 'stroke 0.3s, fill 0.3s' }} 
                    onMouseEnter={(e) => e.currentTarget.style.fill = '#2C2C2A'}
                    onMouseLeave={(e) => e.currentTarget.style.fill = C.darkSurface}
                  />
                  <text x={x} y={y + 4} textAnchor="middle" fontFamily="Inter" fontSize="11" fontWeight="600" fill="rgba(250,249,246,0.85)" style={{ pointerEvents: 'none' }}>{label}</text>
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
              color: '#fff',
              background: C.moss,
              border: 'none',
              padding: '16px 28px',
              borderRadius: 6,
              cursor: 'pointer',
              letterSpacing: '-0.01em',
              transition: 'background 0.15s, transform 0.15s',
              textDecoration: 'none',
              display: 'inline-block',
            }}
            onMouseEnter={(e) => { const b = e.currentTarget; b.style.background = C.mossMid; b.style.transform = 'translateY(-1px)' }}
            onMouseLeave={(e) => { const b = e.currentTarget; b.style.background = C.moss; b.style.transform = '' }}
          >
            Create your research identity
          </Link>
          <Link
            href="/discover"
            style={{
              fontSize: 15,
              fontWeight: 500,
              color: C.charcoal,
              background: 'transparent',
              border: `1px solid ${C.rule}`,
              padding: '16px 28px',
              borderRadius: 6,
              cursor: 'pointer',
              letterSpacing: '-0.01em',
              transition: 'border-color 0.15s',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = C.secondary }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = C.rule }}
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
      { label: 'About', href: '/help' },
      { label: 'Careers', href: '/help' },
      { label: 'Contact', href: '/help' },
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
            <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 17, letterSpacing: '-0.04em', color: C.charcoal, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="8" stroke={C.moss} strokeWidth="1.5" />
                <circle cx="9" cy="9" r="3.5" fill={C.moss} />
              </svg>
              CAMBIUM
            </div>
            <p style={{ fontSize: 13, color: C.tertiary, lineHeight: 1.6, maxWidth: 200 }}>The Research Operating System.</p>
          </div>

          {/* Link columns */}
          {cols.map(({ heading, links }) => (
            <div key={heading}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', color: C.tertiary, textTransform: 'uppercase', marginBottom: 16 }}>{heading}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    style={{ fontSize: 13, color: C.secondary, textDecoration: 'none', transition: 'color 0.1s' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = C.charcoal }}
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
          <span style={{ fontSize: 12, color: C.tertiary }}>© 2026 Cambium. All rights reserved.</span>
          <div style={{ display: 'flex', gap: 24 }}>
            {[
              { label: 'Privacy', href: '/privacy' },
              { label: 'Terms', href: '/privacy' },
              { label: 'Security', href: '/help' },
            ].map(({ label, href }) => (
              <a key={label} href={href} style={{ fontSize: 12, color: C.tertiary, textDecoration: 'none', transition: 'color 0.1s' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = C.secondary }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = C.tertiary }}>
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: C.bg }}>
      <Nav />
      <Hero />
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
    </div>
  )
}
