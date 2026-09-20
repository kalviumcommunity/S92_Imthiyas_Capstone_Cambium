import { useState, useRef, useEffect, useCallback } from 'react'

// ─── Types ───────────────────────────────────────────────────────────────────

type CardType = 'paper' | 'researcher' | 'topic' | 'lab'

interface PaperCard {
  id: string; type: 'paper'
  title: string; authors: string[]; venue: string; date: string
  topics: string[]; reason: string; abstract: string; cited: number
}
interface ResearcherCard {
  id: string; type: 'researcher'
  name: string; role: string; institution: string
  sharedInterests: string[]; focus: string; recentPapers: number; hIndex: number
}
interface TopicCard {
  id: string; type: 'topic'
  name: string; description: string; relatedPapers: number; researchers: number
  projects: number; recentActivity: string
}
interface LabCard {
  id: string; type: 'lab'
  name: string; institution: string; focus: string[]
  researcherCount: number; recentPublications: number
}
type AnyCard = PaperCard | ResearcherCard | TopicCard | LabCard

// ─── Data ────────────────────────────────────────────────────────────────────

const CONTENT_TYPES = ['All', 'Papers', 'Researchers', 'Projects', 'Topics', 'Labs', 'Datasets', 'Journals', 'Conferences']
const TIME_FILTERS = ['Any time', 'Past week', 'Past month', 'Past year']
const RESEARCH_AREAS = ['AI', 'Machine Learning', 'Computer Vision', 'Healthcare', 'Biology', 'Robotics', 'Climate', 'Physics']
const SORT_OPTIONS = ['Relevance', 'Newest', 'Trending', 'Most cited', 'Recently discussed']

const RECENT_SEARCHES = ['medical imaging foundation models', 'federated learning healthcare', 'low-resource segmentation']
const SUGGESTED_SEARCHES = [
  "What's emerging in multimodal medical AI?",
  "Researchers working on medical imaging + transformers",
  "Recent papers on low-resource computer vision",
  "Datasets for medical image segmentation",
]

const PAPER_CARDS: PaperCard[] = [
  {
    id: 'p1', type: 'paper',
    title: 'Foundation Models for Medical Image Understanding',
    authors: ['Elena Rodriguez', 'James Park', 'Maya Singh'],
    venue: 'Nature Machine Intelligence', date: 'August 2026',
    topics: ['Medical Imaging', 'Foundation Models', 'Computer Vision'],
    reason: 'Related to your current research on low-resource segmentation.',
    abstract: 'A comprehensive study of foundation models adapted for medical image understanding, demonstrating significant performance gains across diverse clinical imaging modalities through task-specific fine-tuning strategies.',
    cited: 142,
  },
  {
    id: 'p2', type: 'paper',
    title: 'Self-Supervised Contrastive Learning for Low-Resource Medical Segmentation',
    authors: ['Wei Zhang', 'Priya Sharma', 'Carlos Fernandez'],
    venue: 'MICCAI 2026', date: 'July 2026',
    topics: ['Segmentation', 'Self-Supervised Learning', 'Healthcare AI'],
    reason: 'Directly related to your low-resource segmentation work.',
    abstract: 'A contrastive learning framework achieving state-of-the-art segmentation with as few as 50 labeled examples per class, validated across three clinical imaging datasets.',
    cited: 89,
  },
  {
    id: 'p3', type: 'paper',
    title: 'Efficient Vision Transformers for Real-Time Clinical Image Analysis',
    authors: ['Aisha Nkemdirim', 'Henrik Larsson'],
    venue: 'IEEE Transactions on Medical Imaging', date: 'June 2026',
    topics: ['Vision Transformers', 'Clinical AI', 'Efficiency'],
    reason: 'Connected to 6 papers in your reading list.',
    abstract: 'We introduce a lightweight vision transformer architecture optimized for inference speed in clinical settings without sacrificing diagnostic accuracy.',
    cited: 67,
  },
]

const RESEARCHER_CARDS: ResearcherCard[] = [
  {
    id: 'r1', type: 'researcher',
    name: 'Dr. Elena Rodriguez',
    role: 'Computational Biology · Machine Learning',
    institution: 'University Research Institute',
    sharedInterests: ['Machine Learning', 'Medical Imaging'],
    focus: 'Learning robust multimodal representations for clinical datasets.',
    recentPapers: 8, hIndex: 22,
  },
]

const TOPIC_CARDS: TopicCard[] = [
  {
    id: 't1', type: 'topic',
    name: 'Multimodal Medical AI',
    description: 'Research combining language, vision and clinical data is gaining momentum across major institutions.',
    relatedPapers: 347, researchers: 89, projects: 24,
    recentActivity: '14 new papers this week',
  },
]

const LAB_CARDS: LabCard[] = [
  {
    id: 'l1', type: 'lab',
    name: 'AI for Healthcare Lab',
    institution: 'Research Institute',
    focus: ['Medical Imaging', 'Machine Learning', 'Clinical AI'],
    researcherCount: 42, recentPublications: 18,
  },
]

const MOMENTUM_TOPICS = [
  { id: 'm1', name: 'Multimodal Medical AI', reason: 'Growing quickly across papers and research projects.' },
  { id: 'm2', name: 'Foundation Models for Healthcare', reason: 'Significant activity in preprints and top conferences.' },
  { id: 'm3', name: 'Federated Medical Learning', reason: 'Emerging focus in privacy-preserving clinical AI research.' },
  { id: 'm4', name: 'Synthetic Clinical Data', reason: 'Rising interest in synthetic data for medical model training.' },
  { id: 'm5', name: 'AI-Assisted Drug Discovery', reason: 'Cross-disciplinary attention from ML and pharma researchers.' },
]

const CONNECTION_CHAIN = [
  { id: 'c1', name: 'Medical Imaging', papers: '2,400+', researchers: '380+', isActive: true },
  { id: 'c2', name: 'Computer Vision', papers: '8,900+', researchers: '1,200+', isActive: false },
  { id: 'c3', name: 'Foundation Models', papers: '3,200+', researchers: '540+', isActive: false },
  { id: 'c4', name: 'Multimodal Learning', papers: '1,800+', researchers: '290+', isActive: false },
  { id: 'c5', name: 'Clinical AI', papers: '970+', researchers: '160+', isActive: false },
]

const UNEXPECTED_CONNECTIONS = [
  {
    id: 'uc1',
    yourInterest: 'Medical Imaging', connectedField: 'Climate Science',
    reason: 'Satellite image segmentation methods are being adapted to medical imaging workflows.',
    relatedPaper: 'Cross-Domain Transfer of Segmentation Networks from Satellite to Histopathology',
    researcher: 'Dr. Amara Osei', topic: 'Remote Sensing Segmentation',
  },
  {
    id: 'uc2',
    yourInterest: 'Computer Vision', connectedField: 'Materials Science',
    reason: 'Microstructure analysis techniques from materials science are informing new segmentation approaches.',
    relatedPaper: 'Vision Transformers for Microstructural Analysis in Biomaterials',
    researcher: 'Dr. Lena Fischer', topic: 'Microscopy Vision',
  },
]

const MY_INTERESTS = ['Medical Imaging', 'Computer Vision', 'Machine Learning', 'Deep Learning']

const SUGGESTED_RESEARCHERS = [
  { id: 'sr1', name: 'Dr. Elena Rodriguez', area: 'Multimodal Medical AI', initials: 'ER' },
  { id: 'sr2', name: 'Dr. Arjun Mehta', area: 'Federated Learning', initials: 'AM' },
  { id: 'sr3', name: 'Dr. Sofia Klein', area: 'Computer Vision', initials: 'SK' },
]

const RECENTLY_VIEWED = [
  { id: 'rv1', title: 'Foundation Models for Medical Image Understanding', type: 'paper' as const },
  { id: 'rv2', title: 'Federated Learning in Healthcare', type: 'paper' as const },
  { id: 'rv3', title: 'Low-Resource Computer Vision', type: 'topic' as const },
]

// ─── Nav ─────────────────────────────────────────────────────────────────────

const NAV = [
  { section: null, items: [
    { label: 'Home', icon: HomeIcon, href: '#' },
    { label: 'Discover', icon: CompassIcon, href: '#', active: true },
    { label: 'AI Assistant', icon: SparklesIcon, href: '#' },
  ]},
  { section: 'Research', items: [
    { label: 'Workspace', href: '#' }, { label: 'Papers', href: '#' },
    { label: 'Publications', href: '#' }, { label: 'Projects', href: '#' },
    { label: 'Notes', href: '#' },
  ]},
  { section: 'Community', items: [
    { label: 'Feed', href: '#' }, { label: 'Researchers', href: '#' },
    { label: 'Labs', href: '#' }, { label: 'Collaborations', href: '#' },
    { label: 'Messages', href: '#' },
  ]},
  { section: 'Opportunities', items: [
    { label: 'Grants', href: '#' }, { label: 'Conferences', href: '#' },
    { label: 'Journals', href: '#' }, { label: 'Scholarships', href: '#' },
    { label: 'Fellowships', href: '#' },
  ]},
  { section: 'Personal', items: [
    { label: 'Calendar', href: '#' }, { label: 'Notifications', href: '#' },
    { label: 'Collections', href: '#' },
  ]},
]

// ─── Icons ───────────────────────────────────────────────────────────────────

function HomeIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 6.5L8 2l6 4.5V14a.5.5 0 01-.5.5h-4V10H6.5v4.5h-4A.5.5 0 012 14V6.5z"/>
    </svg>
  )
}
function CompassIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="8" cy="8" r="6.25"/>
      <path d="M10.5 5.5l-2 4-2 .5 1-4 3-.5z"/>
    </svg>
  )
}
function SparklesIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8 2v2M8 12v2M2 8h2M12 8h2M4.1 4.1l1.4 1.4M10.5 10.5l1.4 1.4M4.1 11.9l1.4-1.4M10.5 5.5l1.4-1.4"/>
      <circle cx="8" cy="8" r="2.5"/>
    </svg>
  )
}
function SearchIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="7" cy="7" r="4.5"/>
      <path d="M10.5 10.5L13.5 13.5"/>
    </svg>
  )
}
function BookmarkIcon({ filled = false, size = 14 }: { filled?: boolean; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 1.5h8a.5.5 0 01.5.5v10.5L7 10 2.5 12.5V2a.5.5 0 01.5-.5z"/>
    </svg>
  )
}
function ShareIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="3" r="1.5"/><circle cx="3" cy="7" r="1.5"/><circle cx="11" cy="11" r="1.5"/>
      <path d="M4.5 6.25L9.5 3.75M4.5 7.75l5 2.5"/>
    </svg>
  )
}
function ArrowUpRightIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 9L9 3M4 3h5v5"/>
    </svg>
  )
}
function CloseIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <path d="M3 3l8 8M11 3l-8 8"/>
    </svg>
  )
}
function ChevronIcon({ size = 12, dir = 'down' }: { size?: number; dir?: 'down' | 'right' }) {
  const r = dir === 'right' ? -90 : 0
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ transform: `rotate(${r}deg)` }}>
      <path d="M2 4l4 4 4-4"/>
    </svg>
  )
}
function CheckIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 6l3 3 5-5"/>
    </svg>
  )
}
function TrendUpIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 10l3.5-3.5 2.5 2 4-4.5"/><path d="M9 4h3v3"/>
    </svg>
  )
}
function LinkIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 7a2.5 2.5 0 003.5.5l2-2a2.5 2.5 0 00-3.5-3.5L5.5 3.5"/><path d="M7 5a2.5 2.5 0 00-3.5-.5L1.5 6.5A2.5 2.5 0 005 10l1.5-1.5"/>
    </svg>
  )
}
function ClockIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="6" cy="6" r="4.5"/><path d="M6 3.5V6l1.5 1.5"/>
    </svg>
  )
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

function Sidebar() {
  return (
    <nav
      aria-label="Main navigation"
      style={{ width: 228, minWidth: 228, backgroundColor: 'var(--color-sidebar)', borderRight: '1px solid var(--color-border)' }}
      className="flex flex-col h-screen sticky top-0 overflow-y-auto py-5"
    >
      {/* Logo */}
      <div className="px-5 mb-6">
        <div className="flex items-center gap-2">
          <div style={{ width: 26, height: 26, backgroundColor: 'var(--color-green)', borderRadius: 6 }} className="flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M7 2C4.24 2 2 4.24 2 7s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 1.5c.6 0 1.17.14 1.68.38L3.88 8.68A3.5 3.5 0 017 3.5zm0 7a3.49 3.49 0 01-1.68-.38l4.8-4.8c.24.51.38 1.08.38 1.68A3.5 3.5 0 017 10.5z" fill="white"/>
            </svg>
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.08em', color: 'var(--color-text)' }}>CAMBIUM</span>
        </div>
      </div>

      {/* User */}
      <div className="px-4 mb-5">
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 8, padding: '8px 10px' }} className="flex items-center gap-2">
          <div style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: 'var(--color-green-surface)', border: '1px solid var(--color-green-border)' }} className="flex items-center justify-center flex-shrink-0">
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-green)' }}>MC</span>
          </div>
          <div className="min-w-0">
            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-text)' }} className="truncate">Maya Chen</div>
            <div style={{ fontSize: 11, color: 'var(--color-muted)' }} className="truncate">PhD · Medical Imaging</div>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <div className="flex-1 space-y-1">
        {NAV.map((group, gi) => (
          <div key={gi} className={gi > 0 ? 'pt-3' : ''}>
            {group.section && (
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', color: 'var(--color-subtle)', padding: '0 16px 4px' }}>
                {group.section.toUpperCase()}
              </div>
            )}
            {group.items.map((item: any, ii) => {
              const isActive = (item as any).active
              return (
                <a
                  key={ii}
                  href={item.href}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '6px 16px', fontSize: 13,
                    fontWeight: isActive ? 500 : 400,
                    color: isActive ? 'var(--color-green)' : 'var(--color-muted)',
                    backgroundColor: isActive ? 'var(--color-green-surface)' : 'transparent',
                    borderRadius: 6, margin: '0 6px',
                    textDecoration: 'none', transition: 'all 150ms ease',
                  }}
                  className="hover:bg-[var(--color-border)] hover:text-[var(--color-text)]"
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.icon && <item.icon size={15} />}
                  {item.label}
                </a>
              )
            })}
          </div>
        ))}
      </div>

      {/* Bottom */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid var(--color-border)', marginTop: 8 }}>
        <a href="#" style={{ display: 'block', fontSize: 12, color: 'var(--color-muted)', textDecoration: 'none', padding: '4px 0' }}>My Profile</a>
        <a href="#" style={{ display: 'block', fontSize: 12, color: 'var(--color-muted)', textDecoration: 'none', padding: '4px 0' }}>Settings</a>
      </div>
    </nav>
  )
}

// ─── Search ──────────────────────────────────────────────────────────────────

function SearchBar({ onFocus }: { onFocus: () => void }) {
  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={onFocus}
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          width: '100%', padding: '11px 16px',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 10, cursor: 'text',
          transition: 'border-color 150ms, box-shadow 150ms',
        }}
        className="hover:border-[var(--color-border-strong)] focus-visible:outline-none focus-visible:border-[var(--color-green-mid)] focus-visible:shadow-[0_0_0_3px_var(--color-green-surface)]"
        aria-label="Search papers, researchers, topics, labs, datasets"
      >
        <SearchIcon size={16} />
        <span style={{ fontSize: 14, color: 'var(--color-subtle)', flex: 1, textAlign: 'left' }}>
          Search papers, researchers, topics, labs, datasets...
        </span>
        <kbd style={{ fontSize: 11, color: 'var(--color-subtle)', background: 'var(--color-canvas)', border: '1px solid var(--color-border)', borderRadius: 4, padding: '2px 6px', fontFamily: 'inherit' }}>
          ⌘ K
        </kbd>
      </button>
    </div>
  )
}

function SearchOverlay({ onClose }: { onClose: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')

  useEffect(() => { inputRef.current?.focus() }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(26,25,22,0.35)' }}
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-label="Search"
    >
      <div
        style={{
          position: 'absolute', top: 80, left: '50%', transform: 'translateX(-50%)',
          width: 680, background: 'var(--color-surface)', borderRadius: 14,
          border: '1px solid var(--color-border)',
          boxShadow: '0 20px 60px rgba(26,25,22,0.15)',
          overflow: 'hidden',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px', borderBottom: '1px solid var(--color-border)' }}>
          <SearchIcon size={18} />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search papers, researchers, topics, labs, datasets..."
            style={{ flex: 1, border: 'none', outline: 'none', fontSize: 15, color: 'var(--color-text)', background: 'transparent' }}
            aria-label="Search"
          />
          <button onClick={onClose} style={{ color: 'var(--color-subtle)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
            <CloseIcon size={16} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '16px 18px 20px' }}>
          {!query && (
            <>
              <div className="mb-4">
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', color: 'var(--color-subtle)', marginBottom: 8 }}>RECENT SEARCHES</div>
                {RECENT_SEARCHES.map((s, i) => (
                  <button key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '7px 8px', borderRadius: 6, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'background 120ms' }} className="hover:bg-[var(--color-canvas)]" onClick={onClose}>
                    <ClockIcon size={13} />
                    <span style={{ fontSize: 13, color: 'var(--color-muted)' }}>{s}</span>
                  </button>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', color: 'var(--color-subtle)', marginBottom: 8 }}>SUGGESTED</div>
                {SUGGESTED_SEARCHES.map((s, i) => (
                  <button key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '7px 8px', borderRadius: 6, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'background 120ms' }} className="hover:bg-[var(--color-canvas)]" onClick={onClose}>
                    <SearchIcon size={13} />
                    <span style={{ fontSize: 13, color: 'var(--color-text)' }}>{s}</span>
                  </button>
                ))}
              </div>
            </>
          )}
          {query && (
            <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--color-muted)', fontSize: 13 }}>
              Press Enter to search for "<span style={{ color: 'var(--color-text)' }}>{query}</span>"
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Filters ─────────────────────────────────────────────────────────────────

function FilterBar({
  activeType, setActiveType,
  activeTime, setActiveTime,
  activeArea, setActiveArea,
  activeSort, setActiveSort,
}: {
  activeType: string; setActiveType: (v: string) => void
  activeTime: string; setActiveTime: (v: string) => void
  activeArea: string; setActiveArea: (v: string) => void
  activeSort: string; setActiveSort: (v: string) => void
}) {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
      {/* Content type */}
      <div style={{ display: 'flex', gap: 4, flexWrap: 'nowrap', overflowX: 'auto' }}>
        {CONTENT_TYPES.map(t => (
          <button
            key={t}
            onClick={() => setActiveType(t)}
            style={{
              padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500,
              border: '1px solid',
              borderColor: activeType === t ? 'var(--color-green)' : 'var(--color-border)',
              background: activeType === t ? 'var(--color-green-surface)' : 'var(--color-surface)',
              color: activeType === t ? 'var(--color-green)' : 'var(--color-muted)',
              cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 150ms',
            }}
          >{t}</button>
        ))}
      </div>

      {/* Divider */}
      <div style={{ width: 1, height: 20, background: 'var(--color-border)', flexShrink: 0 }} />

      {/* Time */}
      <FilterDropdown label={activeTime} options={TIME_FILTERS} value={activeTime} onChange={setActiveTime} />

      {/* Area */}
      <FilterDropdown label={activeArea || 'Research Area'} options={RESEARCH_AREAS} value={activeArea} onChange={setActiveArea} />

      {/* Sort */}
      <div className="ml-auto">
        <FilterDropdown label={`Sort: ${activeSort}`} options={SORT_OPTIONS} value={activeSort} onChange={setActiveSort} />
      </div>
    </div>
  )
}

function FilterDropdown({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex', alignItems: 'center', gap: 5,
          padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500,
          border: '1px solid var(--color-border)',
          background: 'var(--color-surface)',
          color: 'var(--color-muted)', cursor: 'pointer', transition: 'all 150ms',
          whiteSpace: 'nowrap',
        }}
        className="hover:border-[var(--color-border-strong)] hover:text-[var(--color-text)]"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {label}
        <ChevronIcon size={10} />
      </button>
      {open && (
        <div
          role="listbox"
          style={{
            position: 'absolute', top: 'calc(100% + 4px)', left: 0, zIndex: 20,
            background: 'var(--color-surface)', border: '1px solid var(--color-border)',
            borderRadius: 8, padding: '4px', minWidth: 160,
            boxShadow: '0 8px 24px rgba(26,25,22,0.1)',
          }}
        >
          {options.map(o => (
            <button
              key={o}
              role="option"
              aria-selected={value === o}
              onClick={() => { onChange(o); setOpen(false) }}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                width: '100%', padding: '6px 10px', borderRadius: 5,
                fontSize: 12, color: value === o ? 'var(--color-green)' : 'var(--color-text)',
                background: value === o ? 'var(--color-green-surface)' : 'none',
                border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'background 100ms',
              }}
              className="hover:bg-[var(--color-canvas)]"
            >
              {o}
              {value === o && <CheckIcon size={11} />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Cards ───────────────────────────────────────────────────────────────────

function Tag({ label, variant = 'default' }: { label: string; variant?: 'default' | 'green' | 'blue' }) {
  const styles = {
    default: { background: 'var(--color-canvas)', border: '1px solid var(--color-border)', color: 'var(--color-muted)' },
    green: { background: 'var(--color-green-surface)', border: '1px solid var(--color-green-border)', color: 'var(--color-green)' },
    blue: { background: 'var(--color-blue-surface)', border: '1px solid var(--color-blue-border)', color: 'var(--color-blue)' },
  }
  return (
    <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 500, ...styles[variant] }}>
      {label}
    </span>
  )
}

function ReasonChip({ text }: { text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 5, padding: '5px 8px', background: 'var(--color-amber-surface)', border: '1px solid var(--color-amber-border)', borderRadius: 5 }}>
      <span style={{ fontSize: 10, lineHeight: '16px' }}>✦</span>
      <span style={{ fontSize: 11, color: 'var(--color-amber-text)', lineHeight: '16px' }}>{text}</span>
    </div>
  )
}

function PaperCardComponent({ data, onOpen, onSave, saved }: { data: PaperCard; onOpen: (d: AnyCard) => void; onSave: (id: string) => void; saved: boolean }) {
  const [hovered, setHovered] = useState(false)

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 10,
        padding: '16px',
        cursor: 'pointer',
        transition: 'box-shadow 150ms, border-color 150ms, transform 150ms',
        boxShadow: hovered ? '0 4px 16px rgba(26,25,22,0.08)' : '0 1px 3px rgba(26,25,22,0.04)',
        borderColor: hovered ? 'var(--color-border-strong)' : 'var(--color-border)',
        transform: hovered ? 'translateY(-1px)' : 'translateY(0)',
      }}
      onClick={() => onOpen(data)}
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onOpen(data)}
      aria-label={`Paper: ${data.title}`}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
        <Tag label="Paper" variant="blue" />
        <div style={{ display: 'flex', gap: 4 }}>
          <button
            onClick={e => { e.stopPropagation(); onSave(data.id) }}
            style={{ display: 'flex', padding: 5, borderRadius: 5, border: '1px solid var(--color-border)', background: saved ? 'var(--color-green-surface)' : 'var(--color-surface)', color: saved ? 'var(--color-green)' : 'var(--color-muted)', cursor: 'pointer', transition: 'all 150ms' }}
            aria-label={saved ? 'Saved' : 'Save paper'}
            title={saved ? 'Saved' : 'Save'}
          >
            <BookmarkIcon filled={saved} size={13} />
          </button>
          <button
            onClick={e => e.stopPropagation()}
            style={{ display: 'flex', padding: 5, borderRadius: 5, border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-muted)', cursor: 'pointer', transition: 'all 150ms' }}
            aria-label="Share paper"
            title="Share"
          >
            <ShareIcon size={13} />
          </button>
        </div>
      </div>

      <h3 style={{ fontSize: 15, fontWeight: 500, color: 'var(--color-text)', lineHeight: 1.4, marginBottom: 6 }}>
        {data.title}
      </h3>

      <div style={{ fontSize: 12, color: 'var(--color-muted)', marginBottom: 4 }}>
        {data.authors.join(', ')}
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10, fontSize: 12, color: 'var(--color-subtle)' }}>
        <span style={{ fontWeight: 500, color: 'var(--color-muted)' }}>{data.venue}</span>
        <span>·</span>
        <span>{data.date}</span>
        <span>·</span>
        <span>{data.cited} citations</span>
      </div>

      {hovered && (
        <p style={{ fontSize: 12, color: 'var(--color-muted)', lineHeight: 1.6, marginBottom: 10, paddingTop: 4, borderTop: '1px solid var(--color-border)' }}>
          {data.abstract}
        </p>
      )}

      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 10 }}>
        {data.topics.map(t => <Tag key={t} label={t} />)}
      </div>

      <ReasonChip text={data.reason} />

      <button
        onClick={e => { e.stopPropagation(); onOpen(data) }}
        style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 12, fontSize: 12, fontWeight: 500, color: 'var(--color-green)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
      >
        Open paper <ArrowUpRightIcon size={11} />
      </button>
    </article>
  )
}

function ResearcherCardComponent({ data, onOpen, followed, onFollow }: { data: ResearcherCard; onOpen: (d: AnyCard) => void; followed: boolean; onFollow: (id: string) => void }) {
  const [hovered, setHovered] = useState(false)

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 10, padding: 16, cursor: 'pointer',
        transition: 'box-shadow 150ms, border-color 150ms, transform 150ms',
        boxShadow: hovered ? '0 4px 16px rgba(26,25,22,0.08)' : '0 1px 3px rgba(26,25,22,0.04)',
        borderColor: hovered ? 'var(--color-border-strong)' : 'var(--color-border)',
        transform: hovered ? 'translateY(-1px)' : 'translateY(0)',
      }}
      onClick={() => onOpen(data)}
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onOpen(data)}
      aria-label={`Researcher: ${data.name}`}
    >
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 10 }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--color-green-surface)', border: '1px solid var(--color-green-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-green)' }}>
            {data.name.split(' ').filter((_, i) => i > 0).map(n => n[0]).join('').slice(0, 2)}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text)', marginBottom: 2 }}>{data.name}</div>
          <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>{data.role}</div>
          <div style={{ fontSize: 12, color: 'var(--color-subtle)' }}>{data.institution}</div>
        </div>
        <Tag label="Researcher" variant="green" />
      </div>

      <p style={{ fontSize: 12, color: 'var(--color-muted)', lineHeight: 1.6, marginBottom: 10, fontStyle: 'italic' }}>
        "{data.focus}"
      </p>

      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 10 }}>
        {data.sharedInterests.map(i => <Tag key={i} label={i} variant="blue" />)}
      </div>

      <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--color-muted)', marginBottom: 12 }}>
        <span><strong style={{ color: 'var(--color-text)' }}>{data.recentPapers}</strong> recent papers</span>
        <span>h-index <strong style={{ color: 'var(--color-text)' }}>{data.hIndex}</strong></span>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={e => { e.stopPropagation(); onFollow(data.id) }}
          style={{
            padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: 'pointer', transition: 'all 150ms',
            border: '1px solid',
            borderColor: followed ? 'var(--color-green)' : 'var(--color-border)',
            background: followed ? 'var(--color-green-surface)' : 'var(--color-surface)',
            color: followed ? 'var(--color-green)' : 'var(--color-muted)',
          }}
          aria-label={followed ? `Unfollow ${data.name}` : `Follow ${data.name}`}
        >
          {followed ? '✓ Following' : 'Follow'}
        </button>
        <button
          onClick={e => { e.stopPropagation(); onOpen(data) }}
          style={{ padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: 'pointer', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-muted)', transition: 'all 150ms' }}
          className="hover:border-[var(--color-border-strong)] hover:text-[var(--color-text)]"
        >
          View profile
        </button>
      </div>
    </article>
  )
}

function TopicCardComponent({ data, onOpen, followed, onFollow }: { data: TopicCard; onOpen: (d: AnyCard) => void; followed: boolean; onFollow: (id: string) => void }) {
  const [hovered, setHovered] = useState(false)

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--color-surface)', border: '1px solid var(--color-border)',
        borderRadius: 10, padding: 16, cursor: 'pointer',
        transition: 'box-shadow 150ms, border-color 150ms, transform 150ms',
        boxShadow: hovered ? '0 4px 16px rgba(26,25,22,0.08)' : '0 1px 3px rgba(26,25,22,0.04)',
        borderColor: hovered ? 'var(--color-border-strong)' : 'var(--color-border)',
        transform: hovered ? 'translateY(-1px)' : 'translateY(0)',
      }}
      onClick={() => onOpen(data)}
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onOpen(data)}
      aria-label={`Topic: ${data.name}`}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <Tag label="Topic" variant="green" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--color-green-mid)', fontSize: 11 }}>
          <TrendUpIcon size={12} />
          <span style={{ fontWeight: 500 }}>Emerging</span>
        </div>
      </div>
      <h3 style={{ fontSize: 15, fontWeight: 500, color: 'var(--color-text)', marginBottom: 6 }}>{data.name}</h3>
      <p style={{ fontSize: 12, color: 'var(--color-muted)', lineHeight: 1.6, marginBottom: 12 }}>{data.description}</p>

      <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--color-muted)', marginBottom: 12 }}>
        <span><strong style={{ color: 'var(--color-text)' }}>{data.relatedPapers}</strong> papers</span>
        <span><strong style={{ color: 'var(--color-text)' }}>{data.researchers}</strong> researchers</span>
        <span><strong style={{ color: 'var(--color-text)' }}>{data.projects}</strong> projects</span>
      </div>

      <div style={{ fontSize: 11, color: 'var(--color-green)', marginBottom: 12 }}>{data.recentActivity}</div>

      <button
        onClick={e => { e.stopPropagation(); onFollow(data.id) }}
        style={{
          padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: 'pointer', transition: 'all 150ms',
          border: '1px solid',
          borderColor: followed ? 'var(--color-green)' : 'var(--color-border)',
          background: followed ? 'var(--color-green-surface)' : 'var(--color-surface)',
          color: followed ? 'var(--color-green)' : 'var(--color-muted)',
        }}
      >
        {followed ? '✓ Following' : 'Follow topic'}
      </button>
    </article>
  )
}

function LabCardComponent({ data, onOpen }: { data: LabCard; onOpen: (d: AnyCard) => void }) {
  const [hovered, setHovered] = useState(false)

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--color-surface)', border: '1px solid var(--color-border)',
        borderRadius: 10, padding: 16, cursor: 'pointer',
        transition: 'box-shadow 150ms, border-color 150ms, transform 150ms',
        boxShadow: hovered ? '0 4px 16px rgba(26,25,22,0.08)' : '0 1px 3px rgba(26,25,22,0.04)',
        borderColor: hovered ? 'var(--color-border-strong)' : 'var(--color-border)',
        transform: hovered ? 'translateY(-1px)' : 'translateY(0)',
      }}
      onClick={() => onOpen(data)}
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onOpen(data)}
      aria-label={`Lab: ${data.name}`}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <Tag label="Lab" />
        <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--color-canvas)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-muted)' }}>LAB</span>
        </div>
      </div>
      <h3 style={{ fontSize: 15, fontWeight: 500, color: 'var(--color-text)', marginBottom: 2 }}>{data.name}</h3>
      <div style={{ fontSize: 12, color: 'var(--color-muted)', marginBottom: 10 }}>{data.institution}</div>

      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 12 }}>
        {data.focus.map(f => <Tag key={f} label={f} />)}
      </div>

      <div style={{ display: 'flex', gap: 20, fontSize: 12, color: 'var(--color-muted)', marginBottom: 12 }}>
        <span><strong style={{ color: 'var(--color-text)' }}>{data.researcherCount}</strong> researchers</span>
        <span><strong style={{ color: 'var(--color-text)' }}>{data.recentPublications}</strong> recent pubs</span>
      </div>

      <button
        onClick={e => { e.stopPropagation(); onOpen(data) }}
        style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 500, color: 'var(--color-green)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
      >
        Explore lab <ArrowUpRightIcon size={11} />
      </button>
    </article>
  )
}

// ─── Momentum Section ────────────────────────────────────────────────────────

function MomentumSection({ followed, onFollow }: { followed: Set<string>; onFollow: (id: string) => void }) {
  return (
    <section aria-labelledby="momentum-heading">
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <TrendUpIcon size={16} />
          <h2 id="momentum-heading" style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-text)', margin: 0 }}>
            Research gaining momentum
          </h2>
        </div>
        <p style={{ fontSize: 13, color: 'var(--color-muted)', margin: 0 }}>
          Topics with significant recent activity connected to your research areas.
        </p>
      </div>

      <div style={{ display: 'grid', gap: 10 }}>
        {MOMENTUM_TOPICS.map((topic, idx) => (
          <div
            key={topic.id}
            style={{
              display: 'flex', alignItems: 'flex-start', gap: 16,
              padding: '14px 16px',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 10, transition: 'all 150ms',
            }}
            className="hover:border-[var(--color-border-strong)] hover:shadow-[0_2px_8px_rgba(26,25,22,0.06)]"
          >
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-subtle)', width: 20, flexShrink: 0, paddingTop: 1 }}>
              {String(idx + 1).padStart(2, '0')}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text)' }}>{topic.name}</span>
                <span style={{ fontSize: 10, fontWeight: 500, padding: '1px 6px', borderRadius: 3, background: 'var(--color-green-surface)', border: '1px solid var(--color-green-border)', color: 'var(--color-green)', letterSpacing: '0.05em' }}>
                  SAMPLE TREND
                </span>
              </div>
              <span style={{ fontSize: 12, color: 'var(--color-muted)' }}>{topic.reason}</span>
            </div>
            <button
              onClick={() => onFollow(topic.id)}
              style={{
                flexShrink: 0, padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 500, cursor: 'pointer', transition: 'all 150ms',
                border: '1px solid',
                borderColor: followed.has(topic.id) ? 'var(--color-green)' : 'var(--color-border)',
                background: followed.has(topic.id) ? 'var(--color-green-surface)' : 'transparent',
                color: followed.has(topic.id) ? 'var(--color-green)' : 'var(--color-muted)',
              }}
              aria-label={followed.has(topic.id) ? `Unfollow ${topic.name}` : `Follow ${topic.name}`}
            >
              {followed.has(topic.id) ? '✓ Following' : 'Follow'}
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── Connections Visualization ───────────────────────────────────────────────

function ConnectionsViz() {
  const [active, setActive] = useState('c1')

  return (
    <section aria-labelledby="connections-heading" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 12, padding: 24 }}>
      <div style={{ marginBottom: 20 }}>
        <h2 id="connections-heading" style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-text)', marginBottom: 4 }}>
          Research connections
        </h2>
        <p style={{ fontSize: 13, color: 'var(--color-muted)', margin: 0 }}>
          How your research areas connect to broader scientific fields.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
        {/* Chain */}
        <div style={{ flex: 1 }}>
          {CONNECTION_CHAIN.map((node, idx) => (
            <div key={node.id}>
              <button
                onClick={() => setActive(node.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, width: '100%',
                  padding: '10px 14px', borderRadius: 8, border: '1px solid',
                  borderColor: active === node.id ? 'var(--color-green)' : 'var(--color-border)',
                  background: active === node.id ? 'var(--color-green-surface)' : 'var(--color-canvas)',
                  cursor: 'pointer', transition: 'all 150ms', textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                    background: active === node.id ? 'var(--color-green)' : 'var(--color-border-strong)',
                    transition: 'background 150ms',
                  }} />
                  <span style={{ fontSize: 13, fontWeight: active === node.id ? 500 : 400, color: active === node.id ? 'var(--color-green-text)' : 'var(--color-text)' }}>
                    {node.name}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'var(--color-subtle)' }}>
                  <span>{node.papers} papers</span>
                  <span>{node.researchers} researchers</span>
                </div>
              </button>
              {idx < CONNECTION_CHAIN.length - 1 && (
                <div style={{ display: 'flex', alignItems: 'center', paddingLeft: 17, margin: '2px 0' }}>
                  <div style={{ width: 1, height: 16, background: 'var(--color-border)' }} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Detail panel */}
        <div style={{ width: 200, flexShrink: 0 }}>
          {CONNECTION_CHAIN.filter(n => n.id === active).map(node => (
            <div key={node.id} style={{ padding: '14px', background: 'var(--color-canvas)', borderRadius: 8, border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', color: 'var(--color-subtle)', marginBottom: 8 }}>FIELD OVERVIEW</div>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text)', marginBottom: 12 }}>{node.name}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {[
                  { label: 'Papers', value: node.papers },
                  { label: 'Researchers', value: node.researchers },
                  { label: 'Related topics', value: '12+' },
                  { label: 'Active labs', value: '24+' },
                ].map(stat => (
                  <div key={stat.label} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 6, padding: '8px 10px' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>{stat.value}</div>
                    <div style={{ fontSize: 10, color: 'var(--color-subtle)' }}>{stat.label}</div>
                  </div>
                ))}
              </div>
              <button style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 500, color: 'var(--color-green)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                Explore field <ArrowUpRightIcon size={11} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Unexpected Connections ───────────────────────────────────────────────────

function UnexpectedSection() {
  return (
    <section aria-labelledby="unexpected-heading">
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <LinkIcon size={16} />
          <h2 id="unexpected-heading" style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-text)', margin: 0 }}>
            Unexpected connections
          </h2>
        </div>
        <p style={{ fontSize: 13, color: 'var(--color-muted)', margin: 0 }}>
          Cambium found research outside your immediate field that may inform your work.
        </p>
      </div>

      <div style={{ display: 'grid', gap: 12 }}>
        {UNEXPECTED_CONNECTIONS.map(uc => (
          <div key={uc.id} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 10, padding: '18px', transition: 'all 150ms' }} className="hover:border-[var(--color-border-strong)] hover:shadow-[0_2px_10px_rgba(26,25,22,0.06)]">
            {/* Connection header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, fontWeight: 500, padding: '3px 10px', borderRadius: 4, background: 'var(--color-blue-surface)', color: 'var(--color-blue)', border: '1px solid var(--color-blue-border)' }}>
                {uc.yourInterest}
              </span>
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true">
                <path d="M1 5h10M8 2l3 3-3 3" stroke="var(--color-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{ fontSize: 12, fontWeight: 500, padding: '3px 10px', borderRadius: 4, background: 'var(--color-green-surface)', color: 'var(--color-green)', border: '1px solid var(--color-green-border)' }}>
                {uc.connectedField}
              </span>
            </div>

            <p style={{ fontSize: 13, color: 'var(--color-muted)', lineHeight: 1.6, marginBottom: 14 }}>
              {uc.reason}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
              {[
                { icon: '📄', label: 'Related paper', value: uc.relatedPaper },
                { icon: '👤', label: 'Researcher', value: uc.researcher },
                { icon: '🏷', label: 'Topic', value: uc.topic },
              ].map(item => (
                <div key={item.label} style={{ padding: '10px 12px', background: 'var(--color-canvas)', borderRadius: 6, border: '1px solid var(--color-border)' }}>
                  <div style={{ fontSize: 10, color: 'var(--color-subtle)', marginBottom: 3 }}>{item.label}</div>
                  <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-text)', lineHeight: 1.4 }}>{item.value}</div>
                </div>
              ))}
            </div>

            <button style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 500, color: 'var(--color-green)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              Explore connection <ArrowUpRightIcon size={11} />
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── Right Rail ──────────────────────────────────────────────────────────────

function RightRail({ followed, onFollow }: { followed: Set<string>; onFollow: (id: string) => void }) {
  return (
    <aside
      aria-label="Research context"
      style={{ width: 288, minWidth: 288, paddingTop: 24, paddingBottom: 48, position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}
    >
      {/* Interests */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)', margin: 0 }}>Your research interests</h3>
          <button style={{ fontSize: 11, color: 'var(--color-green)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Edit</button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {MY_INTERESTS.map(interest => (
            <button
              key={interest}
              style={{ padding: '4px 10px', borderRadius: 4, fontSize: 12, fontWeight: 500, background: 'var(--color-green-surface)', border: '1px solid var(--color-green-border)', color: 'var(--color-green-text)', cursor: 'pointer', transition: 'all 150ms' }}
              className="hover:bg-[var(--color-green-border)]"
            >
              {interest}
            </button>
          ))}
        </div>
      </div>

      <div style={{ height: 1, background: 'var(--color-border)', marginBottom: 24 }} />

      {/* Suggested researchers */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 12 }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)', margin: '0 0 2px' }}>Researchers to explore</h3>
          <p style={{ fontSize: 11, color: 'var(--color-subtle)', margin: 0 }}>Shared research interests</p>
        </div>
        <div style={{ display: 'grid', gap: 8 }}>
          {SUGGESTED_RESEARCHERS.map(r => (
            <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 8, transition: 'all 150ms' }} className="hover:border-[var(--color-border-strong)]">
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--color-green-surface)', border: '1px solid var(--color-green-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-green)' }}>{r.initials}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name}</div>
                <div style={{ fontSize: 11, color: 'var(--color-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.area}</div>
              </div>
              <button
                onClick={() => onFollow(r.id)}
                style={{ fontSize: 11, padding: '3px 8px', borderRadius: 4, border: '1px solid', borderColor: followed.has(r.id) ? 'var(--color-green)' : 'var(--color-border)', background: followed.has(r.id) ? 'var(--color-green-surface)' : 'transparent', color: followed.has(r.id) ? 'var(--color-green)' : 'var(--color-muted)', cursor: 'pointer', transition: 'all 150ms', flexShrink: 0 }}
              >
                {followed.has(r.id) ? '✓' : '+'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div style={{ height: 1, background: 'var(--color-border)', marginBottom: 24 }} />

      {/* Recently viewed */}
      <div>
        <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)', marginBottom: 12 }}>Recently viewed</h3>
        <div style={{ display: 'grid', gap: 4 }}>
          {RECENTLY_VIEWED.map(item => (
            <button key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 6, border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left', transition: 'background 120ms', width: '100%' }} className="hover:bg-[var(--color-surface)]">
              <span style={{ fontSize: 10, padding: '1px 5px', borderRadius: 3, background: item.type === 'paper' ? 'var(--color-blue-surface)' : 'var(--color-green-surface)', color: item.type === 'paper' ? 'var(--color-blue)' : 'var(--color-green)', border: `1px solid ${item.type === 'paper' ? 'var(--color-blue-border)' : 'var(--color-green-border)'}`, flexShrink: 0, fontWeight: 500 }}>
                {item.type === 'paper' ? 'P' : 'T'}
              </span>
              <span style={{ fontSize: 12, color: 'var(--color-muted)', lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any }}>
                {item.title}
              </span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────

function DetailPanel({ item, onClose, saved, onSave, followed, onFollow }: {
  item: AnyCard; onClose: () => void
  saved: boolean; onSave: (id: string) => void
  followed: boolean; onFollow: (id: string) => void
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <>
      <div
        style={{ position: 'fixed', inset: 0, zIndex: 40, background: 'rgba(26,25,22,0.2)' }}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={item.type === 'paper' ? (item as PaperCard).title : item.type === 'researcher' ? (item as ResearcherCard).name : item.type === 'topic' ? (item as TopicCard).name : (item as LabCard).name}
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 45,
          width: 440, background: 'var(--color-surface)',
          borderLeft: '1px solid var(--color-border)',
          boxShadow: '-8px 0 40px rgba(26,25,22,0.1)',
          overflowY: 'auto',
          animation: 'slideInPanel 250ms ease',
        }}
      >
        <style>{`
          @keyframes slideInPanel {
            from { transform: translateX(40px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
        `}</style>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--color-border)', position: 'sticky', top: 0, background: 'var(--color-surface)', zIndex: 1 }}>
          <Tag label={item.type.charAt(0).toUpperCase() + item.type.slice(1)} variant={item.type === 'researcher' || item.type === 'topic' ? 'green' : 'blue'} />
          <button onClick={onClose} style={{ display: 'flex', padding: 6, borderRadius: 6, border: '1px solid var(--color-border)', background: 'none', cursor: 'pointer', color: 'var(--color-muted)' }} aria-label="Close panel">
            <CloseIcon size={14} />
          </button>
        </div>

        <div style={{ padding: '20px' }}>
          {item.type === 'paper' && (() => {
            const p = item as PaperCard
            return (
              <>
                <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--color-text)', lineHeight: 1.4, marginBottom: 12 }}>{p.title}</h2>
                <div style={{ fontSize: 13, color: 'var(--color-muted)', marginBottom: 4 }}>{p.authors.join(', ')}</div>
                <div style={{ fontSize: 12, color: 'var(--color-subtle)', marginBottom: 16 }}>{p.venue} · {p.date} · {p.cited} citations</div>

                <div style={{ padding: '14px', background: 'var(--color-canvas)', borderRadius: 8, border: '1px solid var(--color-border)', marginBottom: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', color: 'var(--color-subtle)', marginBottom: 6 }}>ABSTRACT</div>
                  <p style={{ fontSize: 13, color: 'var(--color-muted)', lineHeight: 1.7, margin: 0 }}>{p.abstract}</p>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', color: 'var(--color-subtle)', marginBottom: 8 }}>RESEARCH AREAS</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>{p.topics.map(t => <Tag key={t} label={t} />)}</div>
                </div>

                <ReasonChip text={p.reason} />

                <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
                  <button
                    onClick={() => onSave(p.id)}
                    style={{ flex: 1, padding: '8px 0', borderRadius: 7, fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all 150ms', border: '1px solid', borderColor: saved ? 'var(--color-green)' : 'var(--color-border)', background: saved ? 'var(--color-green-surface)' : 'transparent', color: saved ? 'var(--color-green)' : 'var(--color-muted)' }}
                  >
                    {saved ? '✓ Saved' : 'Save'}
                  </button>
                  <button style={{ flex: 1, padding: '8px 0', borderRadius: 7, fontSize: 13, fontWeight: 500, cursor: 'pointer', border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-muted)', transition: 'all 150ms' }} className="hover:border-[var(--color-border-strong)]">
                    Ask about this
                  </button>
                  <button style={{ flex: 1, padding: '8px 0', borderRadius: 7, fontSize: 13, fontWeight: 500, cursor: 'pointer', border: 'none', background: 'var(--color-green)', color: 'white', transition: 'all 150ms' }}>
                    Open paper
                  </button>
                </div>

                <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--color-border)' }}>
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', color: 'var(--color-subtle)', marginBottom: 12 }}>RELATED PAPERS</div>
                  {['Transformer-Based Architectures for 3D Medical Image Segmentation', 'Semi-Supervised Medical Image Analysis with Graph Neural Networks'].map((title, i) => (
                    <div key={i} style={{ padding: '10px 0', borderBottom: '1px solid var(--color-border)', cursor: 'pointer' }} className="hover:text-[var(--color-green)]">
                      <div style={{ fontSize: 13, color: 'var(--color-text)', lineHeight: 1.4 }}>{title}</div>
                    </div>
                  ))}
                </div>
              </>
            )
          })()}

          {item.type === 'researcher' && (() => {
            const r = item as ResearcherCard
            return (
              <>
                <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 16 }}>
                  <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--color-green-surface)', border: '2px solid var(--color-green-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-green)' }}>
                      {r.name.split(' ').filter((_, i) => i > 0).map(n => n[0]).join('').slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <h2 style={{ fontSize: 17, fontWeight: 600, color: 'var(--color-text)', marginBottom: 3 }}>{r.name}</h2>
                    <div style={{ fontSize: 13, color: 'var(--color-muted)' }}>{r.role}</div>
                    <div style={{ fontSize: 12, color: 'var(--color-subtle)' }}>{r.institution}</div>
                  </div>
                </div>

                <p style={{ fontSize: 13, color: 'var(--color-muted)', lineHeight: 1.7, marginBottom: 16, fontStyle: 'italic' }}>"{r.focus}"</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
                  {[{ label: 'Recent papers', v: r.recentPapers }, { label: 'h-index', v: r.hIndex }].map(stat => (
                    <div key={stat.label} style={{ padding: '10px 12px', background: 'var(--color-canvas)', borderRadius: 7, border: '1px solid var(--color-border)' }}>
                      <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--color-text)' }}>{stat.v}</div>
                      <div style={{ fontSize: 11, color: 'var(--color-subtle)' }}>{stat.label}</div>
                    </div>
                  ))}
                </div>

                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', color: 'var(--color-subtle)', marginBottom: 8 }}>SHARED INTERESTS</div>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>{r.sharedInterests.map(i => <Tag key={i} label={i} variant="blue" />)}</div>
                </div>

                <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
                  <button
                    onClick={() => onFollow(r.id)}
                    style={{ flex: 1, padding: '8px 0', borderRadius: 7, fontSize: 13, fontWeight: 500, cursor: 'pointer', border: '1px solid', borderColor: followed ? 'var(--color-green)' : 'var(--color-border)', background: followed ? 'var(--color-green-surface)' : 'transparent', color: followed ? 'var(--color-green)' : 'var(--color-muted)', transition: 'all 150ms' }}
                  >
                    {followed ? '✓ Following' : 'Follow'}
                  </button>
                  <button style={{ flex: 1, padding: '8px 0', borderRadius: 7, fontSize: 13, fontWeight: 500, cursor: 'pointer', border: 'none', background: 'var(--color-green)', color: 'white', transition: 'all 150ms' }}>
                    View profile
                  </button>
                </div>
              </>
            )
          })()}

          {item.type === 'topic' && (() => {
            const t = item as TopicCard
            return (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--color-text)', margin: 0 }}>{t.name}</h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 3, color: 'var(--color-green-mid)', fontSize: 11 }}>
                    <TrendUpIcon size={12} /><span style={{ fontWeight: 500 }}>Emerging</span>
                  </div>
                </div>
                <p style={{ fontSize: 13, color: 'var(--color-muted)', lineHeight: 1.7, marginBottom: 16 }}>{t.description}</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 20 }}>
                  {[{ label: 'Papers', v: t.relatedPapers }, { label: 'Researchers', v: t.researchers }, { label: 'Projects', v: t.projects }].map(s => (
                    <div key={s.label} style={{ padding: '10px', background: 'var(--color-canvas)', borderRadius: 7, border: '1px solid var(--color-border)', textAlign: 'center' }}>
                      <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-text)' }}>{s.v}</div>
                      <div style={{ fontSize: 11, color: 'var(--color-subtle)' }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => onFollow(t.id)}
                    style={{ flex: 1, padding: '8px 0', borderRadius: 7, fontSize: 13, fontWeight: 500, cursor: 'pointer', border: '1px solid', borderColor: followed ? 'var(--color-green)' : 'var(--color-border)', background: followed ? 'var(--color-green-surface)' : 'transparent', color: followed ? 'var(--color-green)' : 'var(--color-muted)', transition: 'all 150ms' }}
                  >
                    {followed ? '✓ Following topic' : 'Follow topic'}
                  </button>
                  <button style={{ flex: 1, padding: '8px 0', borderRadius: 7, fontSize: 13, fontWeight: 500, cursor: 'pointer', border: 'none', background: 'var(--color-green)', color: 'white', transition: 'all 150ms' }}>
                    Explore topic
                  </button>
                </div>
              </>
            )
          })()}

          {item.type === 'lab' && (() => {
            const l = item as LabCard
            return (
              <>
                <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--color-text)', marginBottom: 4 }}>{l.name}</h2>
                <div style={{ fontSize: 13, color: 'var(--color-muted)', marginBottom: 16 }}>{l.institution}</div>

                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', color: 'var(--color-subtle)', marginBottom: 8 }}>FOCUS AREAS</div>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>{l.focus.map(f => <Tag key={f} label={f} />)}</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
                  {[{ label: 'Researchers', v: l.researcherCount }, { label: 'Recent pubs', v: l.recentPublications }].map(s => (
                    <div key={s.label} style={{ padding: '10px 12px', background: 'var(--color-canvas)', borderRadius: 7, border: '1px solid var(--color-border)' }}>
                      <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--color-text)' }}>{s.v}</div>
                      <div style={{ fontSize: 11, color: 'var(--color-subtle)' }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                <button style={{ width: '100%', padding: '8px 0', borderRadius: 7, fontSize: 13, fontWeight: 500, cursor: 'pointer', border: 'none', background: 'var(--color-green)', color: 'white', transition: 'all 150ms' }}>
                  Explore lab
                </button>
              </>
            )
          })()}
        </div>
      </div>
    </>
  )
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ message, visible }: { message: string; visible: boolean }) {
  return (
    <div
      aria-live="polite"
      style={{
        position: 'fixed', bottom: 24, left: '50%', transform: `translateX(-50%) translateY(${visible ? 0 : 12}px)`,
        opacity: visible ? 1 : 0, transition: 'all 200ms ease',
        background: 'var(--color-text)', color: 'white',
        padding: '10px 18px', borderRadius: 8, fontSize: 13, fontWeight: 500,
        boxShadow: '0 4px 20px rgba(26,25,22,0.2)',
        pointerEvents: 'none', zIndex: 100, whiteSpace: 'nowrap',
      }}
    >
      {message}
    </div>
  )
}

// ─── Main Discover Page ───────────────────────────────────────────────────────

export default function Discover() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [activeType, setActiveType] = useState('All')
  const [activeTime, setActiveTime] = useState('Any time')
  const [activeArea, setActiveArea] = useState('')
  const [activeSort, setActiveSort] = useState('Relevance')
  const [detailItem, setDetailItem] = useState<AnyCard | null>(null)
  const [savedItems, setSavedItems] = useState<Set<string>>(new Set())
  const [followedItems, setFollowedItems] = useState<Set<string>>(new Set())
  const [toast, setToast] = useState({ message: '', visible: false })

  const showToast = useCallback((message: string) => {
    setToast({ message, visible: true })
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 2400)
  }, [])

  const handleSave = useCallback((id: string) => {
    setSavedItems(prev => {
      const next = new Set(prev)
      if (next.has(id)) { next.delete(id); showToast('Removed from collection') }
      else { next.add(id); showToast('Saved to Reading List') }
      return next
    })
  }, [showToast])

  const handleFollow = useCallback((id: string) => {
    setFollowedItems(prev => {
      const next = new Set(prev)
      if (next.has(id)) { next.delete(id); showToast('Unfollowed') }
      else { next.add(id); showToast('Following') }
      return next
    })
  }, [showToast])

  // ⌘K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setSearchOpen(true) }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const allCards: AnyCard[] = [...PAPER_CARDS, ...RESEARCHER_CARDS, ...TOPIC_CARDS, ...LAB_CARDS]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-canvas)' }}>
      <Sidebar />

      {/* Main scroll area */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex' }}>
        {/* Center content */}
        <main
          id="main-content"
          style={{ flex: 1, minWidth: 0, maxWidth: 820, padding: '32px 40px 80px', overflowY: 'auto', height: '100vh' }}
          aria-label="Discovery feed"
        >
          {/* Header */}
          <header style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', color: 'var(--color-green)', marginBottom: 8 }}>
              DISCOVER
            </div>
            <h1 style={{ fontSize: 32, fontWeight: 600, color: 'var(--color-text)', lineHeight: 1.2, marginBottom: 8 }}>
              Explore what's happening in research.
            </h1>
            <p style={{ fontSize: 15, color: 'var(--color-muted)', lineHeight: 1.6, marginBottom: 24 }}>
              Find papers, researchers, ideas and emerging topics connected to your research.
            </p>
            <SearchBar onFocus={() => setSearchOpen(true)} />
          </header>

          {/* Filters */}
          <div style={{ marginBottom: 32 }}>
            <FilterBar
              activeType={activeType} setActiveType={setActiveType}
              activeTime={activeTime} setActiveTime={setActiveTime}
              activeArea={activeArea} setActiveArea={setActiveArea}
              activeSort={activeSort} setActiveSort={setActiveSort}
            />
          </div>

          {/* Recommended section */}
          <section aria-labelledby="recommended-heading" style={{ marginBottom: 48 }}>
            <div style={{ marginBottom: 20 }}>
              <h2 id="recommended-heading" style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-text)', marginBottom: 4 }}>
                Recommended for you
              </h2>
              <p style={{ fontSize: 13, color: 'var(--color-muted)', margin: 0 }}>
                Based on your research interests and recent activity.
              </p>
            </div>

            <div style={{ display: 'grid', gap: 12 }}>
              {PAPER_CARDS.map(p => (
                <PaperCardComponent key={p.id} data={p} onOpen={setDetailItem} onSave={handleSave} saved={savedItems.has(p.id)} />
              ))}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {RESEARCHER_CARDS.map(r => (
                  <ResearcherCardComponent key={r.id} data={r} onOpen={setDetailItem} followed={followedItems.has(r.id)} onFollow={handleFollow} />
                ))}
                {TOPIC_CARDS.map(t => (
                  <TopicCardComponent key={t.id} data={t} onOpen={setDetailItem} followed={followedItems.has(t.id)} onFollow={handleFollow} />
                ))}
              </div>
              {LAB_CARDS.map(l => (
                <LabCardComponent key={l.id} data={l} onOpen={setDetailItem} />
              ))}
            </div>
          </section>

          {/* Momentum */}
          <div style={{ marginBottom: 48 }}>
            <MomentumSection followed={followedItems} onFollow={handleFollow} />
          </div>

          {/* Connections */}
          <div style={{ marginBottom: 48 }}>
            <ConnectionsViz />
          </div>

          {/* Unexpected */}
          <UnexpectedSection />
        </main>

        {/* Right rail */}
        <div style={{ padding: '32px 32px 32px 0' }}>
          <RightRail followed={followedItems} onFollow={handleFollow} />
        </div>
      </div>

      {/* Overlays */}
      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}

      {detailItem && (
        <DetailPanel
          item={detailItem}
          onClose={() => setDetailItem(null)}
          saved={savedItems.has(detailItem.id)}
          onSave={handleSave}
          followed={followedItems.has(detailItem.id)}
          onFollow={handleFollow}
        />
      )}

      <Toast message={toast.message} visible={toast.visible} />
    </div>
  )
}
