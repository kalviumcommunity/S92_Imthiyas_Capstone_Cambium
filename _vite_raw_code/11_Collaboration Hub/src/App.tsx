import { useState } from 'react'

// ── Inline SVG Icons ─────────────────────────────────────────────────────────

const SearchIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <circle cx="6.5" cy="6.5" r="4" />
    <path d="M10 10L13.5 13.5" strokeLinecap="round" />
  </svg>
)

const BellIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M8 2a4 4 0 0 1 4 4v2.5l1 2H3l1-2V6a4 4 0 0 1 4-4Z" strokeLinejoin="round" />
    <path d="M6.5 12.5a1.5 1.5 0 0 0 3 0" strokeLinecap="round" />
  </svg>
)

const MessageIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M2 3.5A1.5 1.5 0 0 1 3.5 2h9A1.5 1.5 0 0 1 14 3.5v7A1.5 1.5 0 0 1 12.5 12H9l-3 2.5V12H3.5A1.5 1.5 0 0 1 2 10.5v-7Z" strokeLinejoin="round" />
  </svg>
)

const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <circle cx="8" cy="5.5" r="2.5" />
    <path d="M2.5 13.5c0-2.76 2.46-5 5.5-5s5.5 2.24 5.5 5" strokeLinecap="round" />
  </svg>
)

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M7 2v10M2 7h10" strokeLinecap="round" />
  </svg>
)

const ArrowRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M3 7h8M8 4l3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
    <path d="M2.5 7.5l3 3 6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M3 3l8 8M11 3l-8 8" strokeLinecap="round" />
  </svg>
)

const FilterIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M1.5 3.5h11M3.5 7h7M5.5 10.5h3" strokeLinecap="round" />
  </svg>
)

// ── Types ─────────────────────────────────────────────────────────────────────

interface Researcher {
  id: number
  name: string
  role: string
  institution: string
  avatar: string
  avatarColor: string
  areas: string[]
  currentWork: string
  matchScore: number
  reasons: string[]
  yourTopics: string[]
  sharedTopics: string[]
  theirTopics: string[]
  openTo: string
}

interface OpenCollab {
  id: number
  name: string
  role: string
  institution: string
  avatar: string
  avatarColor: string
  request: string
  needs: string[]
  availability: string
}

interface Lab {
  id: number
  name: string
  institution: string
  focus: string[]
  researchers: number
  publications: number
  openCollaborations: number
  match: string
}

interface ResearchQuestion {
  id: number
  question: string
  askedBy: string
  role: string
  avatar: string
  avatarColor: string
  tags: string[]
  lookingFor: string[]
  responses: number
}

// ── Static Data ───────────────────────────────────────────────────────────────

const INTENT_OPTIONS = [
  'Research collaborator', 'Co-author', 'Research mentor',
  'Methodology expert', 'Dataset collaborator', 'Industry partner',
  'Lab collaboration', 'Interdisciplinary partner', 'Research discussion',
  'Student researcher', 'Open-source contributor',
]

const RESEARCHERS: Researcher[] = [
  {
    id: 1, name: 'Dr. Elena Rodriguez', role: 'Computational Biology · Machine Learning',
    institution: 'University Research Institute', avatar: 'ER', avatarColor: '#4A7C59',
    areas: ['Machine Learning', 'Genomics', 'Medical AI'],
    currentWork: 'Multimodal learning for genomic and clinical datasets.',
    matchScore: 82,
    reasons: [
      'Shared expertise in Machine Learning',
      'Works on datasets related to your current project',
      'Connected to 4 papers in your reading list',
    ],
    yourTopics: ['Medical Imaging', 'Computer Vision'],
    sharedTopics: ['Machine Learning', 'Medical AI'],
    theirTopics: ['Genomics', 'Multimodal Learning'],
    openTo: 'Co-authorship',
  },
  {
    id: 2, name: 'Prof. James Kwon', role: 'Computer Vision · Medical Imaging',
    institution: 'Seoul National University', avatar: 'JK', avatarColor: '#3D6B8A',
    areas: ['Computer Vision', 'Medical Imaging', 'Deep Learning'],
    currentWork: 'Self-supervised pretraining for low-resource medical image analysis.',
    matchScore: 91,
    reasons: [
      'Strong match · Computer Vision',
      'Works on low-resource settings — directly related to your project',
      'Recommended because you follow Medical Imaging',
    ],
    yourTopics: ['Medical Imaging', 'Federated Learning'],
    sharedTopics: ['Computer Vision', 'Deep Learning'],
    theirTopics: ['Self-supervised Learning', 'Pretraining'],
    openTo: 'Research discussion',
  },
  {
    id: 3, name: 'Dr. Priya Sharma', role: 'Privacy-Preserving ML · Federated Systems',
    institution: 'MIT CSAIL', avatar: 'PS', avatarColor: '#7A4A6B',
    areas: ['Federated Learning', 'Privacy AI', 'Distributed Systems'],
    currentWork: 'Privacy-preserving model aggregation for clinical AI deployments.',
    matchScore: 78,
    reasons: [
      'Expert in Federated Learning — your stated interest',
      'Looking for collaborators in medical imaging',
      'Potential methodology match',
    ],
    yourTopics: ['Computer Vision', 'Medical Imaging'],
    sharedTopics: ['Federated Learning', 'Clinical AI'],
    theirTopics: ['Privacy AI', 'Distributed Systems'],
    openTo: 'Methodology collaboration',
  },
  {
    id: 4, name: 'Dr. Marcus Webb', role: 'NLP · Multimodal Learning',
    institution: 'DeepMind Health', avatar: 'MW', avatarColor: '#7A6A3D',
    areas: ['NLP', 'Multimodal AI', 'Clinical Language Models'],
    currentWork: 'Grounding clinical language models in imaging evidence.',
    matchScore: 71,
    reasons: [
      'Interdisciplinary connection through Medical AI',
      'Researchers in your field are discussing multimodal approaches',
      'Connected through 3 papers',
    ],
    yourTopics: ['Medical Imaging', 'Machine Learning'],
    sharedTopics: ['Medical AI', 'Multimodal Learning'],
    theirTopics: ['NLP', 'Clinical LLMs'],
    openTo: 'Research discussion',
  },
]

const OPEN_COLLABS: OpenCollab[] = [
  {
    id: 1, name: 'Dr. Arjun Patel', role: 'AI Researcher · Healthcare AI',
    institution: 'Max Planck Institute', avatar: 'AP', avatarColor: '#5A4A7C',
    request: 'Collaborators for a study on federated learning across distributed medical datasets.',
    needs: ['Computer Vision', 'Federated Learning', 'Clinical Data'],
    availability: 'Open · Starting Q1 2025',
  },
  {
    id: 2, name: 'Sarah Williams', role: 'PhD Researcher · NLP',
    institution: 'University of Cambridge', avatar: 'SW', avatarColor: '#4A6B5A',
    request: 'Researchers interested in multimodal foundation models for clinical applications.',
    needs: ['Medical Imaging', 'Clinical AI', 'Evaluation Methods'],
    availability: 'Open · Flexible timeline',
  },
]

const LABS: Lab[] = [
  {
    id: 1, name: 'Computational Intelligence Lab', institution: 'AMET University',
    focus: ['Computer Vision', 'Machine Learning', 'Healthcare AI'],
    researchers: 24, publications: 18, openCollaborations: 3,
    match: 'Strong overlap with your research areas',
  },
  {
    id: 2, name: 'Medical AI Research Center', institution: 'Stanford Medicine',
    focus: ['Medical Imaging', 'Clinical AI', 'Federated Learning'],
    researchers: 31, publications: 42, openCollaborations: 5,
    match: 'Direct alignment with your current project',
  },
]

const RESEARCH_QUESTIONS: ResearchQuestion[] = [
  {
    id: 1,
    question: 'How should multimodal medical models be evaluated when labeled clinical data is limited?',
    askedBy: 'Maya Chen', role: 'PhD Researcher · Medical Imaging',
    avatar: 'MC', avatarColor: '#2A5C3D',
    tags: ['Medical Imaging', 'Evaluation', 'Multimodal AI'],
    lookingFor: ['Methodology advice', 'Researchers with evaluation expertise'],
    responses: 7,
  },
  {
    id: 2,
    question: 'What are the practical limits of differential privacy in federated learning for small hospital networks?',
    askedBy: 'Dr. Arjun Patel', role: 'AI Researcher · Healthcare AI',
    avatar: 'AP', avatarColor: '#5A4A7C',
    tags: ['Federated Learning', 'Privacy', 'Healthcare Systems'],
    lookingFor: ['Practitioners with federated deployment experience', 'Theoretical guidance'],
    responses: 12,
  },
  {
    id: 3,
    question: 'Can weakly supervised methods fully replace manual annotation for rare disease imaging datasets?',
    askedBy: 'Prof. Yuki Tanaka', role: 'Medical Imaging · Rare Diseases',
    avatar: 'YT', avatarColor: '#7A4A3D',
    tags: ['Weak Supervision', 'Annotation', 'Rare Diseases'],
    lookingFor: ['Annotation methodology experts', 'Clinical imaging practitioners'],
    responses: 4,
  },
]

const INTERDISCIPLINARY = [
  { name: 'Bioinformatics', reason: 'Image-based genomic interpretation' },
  { name: 'Signal Processing', reason: 'Low-level imaging analysis' },
  { name: 'Human-Computer Interaction', reason: 'Clinical tool interfaces' },
  { name: 'Statistics', reason: 'Small-data inference methods' },
  { name: 'Robotics', reason: 'Surgical imaging systems' },
  { name: 'Healthcare Systems', reason: 'Clinical deployment context' },
]

const ACTIVITY = [
  { text: 'Dr. Elena Rodriguez published a new paper.', time: '2h ago' },
  { text: 'Computational Intelligence Lab opened a collaboration request.', time: '5h ago' },
  { text: 'Arjun Patel started following your research.', time: '1d ago' },
  { text: 'Your paper was cited in a research discussion.', time: '2d ago' },
]

// ── Sidebar ───────────────────────────────────────────────────────────────────

const NAV = [
  {
    label: 'HOME',
    items: [
      { name: 'Home', icon: '⌂' },
      { name: 'Discover', icon: '◉' },
      { name: 'AI Assistant', icon: '◈' },
    ],
  },
  {
    label: 'RESEARCH',
    items: [
      { name: 'Workspace', icon: '▤' },
      { name: 'Papers', icon: '▣' },
      { name: 'Publications', icon: '◫' },
      { name: 'Projects', icon: '◩' },
      { name: 'Notes', icon: '◧' },
    ],
  },
  {
    label: 'COMMUNITY',
    items: [
      { name: 'Feed', icon: '≡' },
      { name: 'Researchers', icon: '◎' },
      { name: 'Labs', icon: '⬡' },
      { name: 'Collaborations', icon: '⟡' },
      { name: 'Messages', icon: '◷' },
    ],
  },
  {
    label: 'OPPORTUNITIES',
    items: [
      { name: 'Grants', icon: '◆' },
      { name: 'Conferences', icon: '◇' },
      { name: 'Journals', icon: '◈' },
      { name: 'Scholarships', icon: '◉' },
      { name: 'Fellowships', icon: '◎' },
    ],
  },
  {
    label: 'PERSONAL',
    items: [
      { name: 'Calendar', icon: '▦' },
      { name: 'Notifications', icon: '◒' },
      { name: 'Collections', icon: '▨' },
    ],
  },
]

function Sidebar() {
  return (
    <aside
      className="flex flex-col shrink-0 overflow-y-auto"
      style={{ width: 232, background: '#F2EFE9', borderRight: '1px solid #E5E1DA' }}
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className="px-5 pt-5 pb-4" style={{ borderBottom: '1px solid #E5E1DA' }}>
        <div
          className="text-xs font-semibold tracking-[0.18em]"
          style={{ color: '#2A5C3D', letterSpacing: '0.18em' }}
        >
          CAMBIUM
        </div>
        <div className="text-xs mt-0.5" style={{ color: '#9A948E' }}>
          Research Operating System
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-4" aria-label="Navigation">
        {NAV.map((group) => (
          <div key={group.label}>
            <div
              className="px-2 mb-1 text-[10px] font-semibold tracking-[0.12em]"
              style={{ color: '#9A948E' }}
            >
              {group.label}
            </div>
            {group.items.map((item) => {
              const isActive = item.name === 'Collaborations'
              return (
                <button
                  key={item.name}
                  className={`sidebar-item w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left text-sm${isActive ? ' active' : ''}`}
                  style={{ color: isActive ? '#2A5C3D' : '#5E5A54' }}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className="w-4 text-center text-xs opacity-60" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                  {isActive && (
                    <span
                      className="ml-auto w-1.5 h-1.5 rounded-full"
                      style={{ background: '#2A5C3D' }}
                      aria-hidden="true"
                    />
                  )}
                </button>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Profile */}
      <div className="px-3 py-3" style={{ borderTop: '1px solid #E5E1DA' }}>
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-md cursor-pointer hover:bg-[#EAE7E0] transition-colors">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0"
            style={{ background: '#2A5C3D' }}
            aria-hidden="true"
          >
            MC
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium truncate" style={{ color: '#1C1917' }}>
              Maya Chen
            </div>
            <div className="text-xs truncate" style={{ color: '#9A948E' }}>
              PhD · Medical Imaging
            </div>
          </div>
        </div>
        <button className="sidebar-item w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left text-sm mt-1" style={{ color: '#5E5A54' }}>
          <span className="w-4 text-center text-xs opacity-60" aria-hidden="true">⚙</span>
          <span>Settings</span>
        </button>
      </div>
    </aside>
  )
}

// ── Avatar ────────────────────────────────────────────────────────────────────

function Avatar({ initials, color, size = 36 }: { initials: string; color: string; size?: number }) {
  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-semibold shrink-0"
      style={{ width: size, height: size, background: color, fontSize: size * 0.33 }}
      aria-hidden="true"
    >
      {initials}
    </div>
  )
}

// ── Topic Chip ────────────────────────────────────────────────────────────────

function TopicChip({
  label,
  variant = 'default',
}: {
  label: string
  variant?: 'default' | 'shared' | 'you' | 'them' | 'need' | 'tag'
}) {
  const styles: Record<string, { bg: string; color: string; border: string }> = {
    default: { bg: '#F5F3EF', color: '#5E5A54', border: '#E5E1DA' },
    shared: { bg: '#EDF5F0', color: '#2A5C3D', border: '#B8D9C6' },
    you: { bg: '#F0F4FF', color: '#3D5FA0', border: '#C4D0EE' },
    them: { bg: '#FFF7ED', color: '#9A4E1A', border: '#EDD5B4' },
    need: { bg: '#F5F3EF', color: '#5E5A54', border: '#E5E1DA' },
    tag: { bg: '#F8F6F2', color: '#9A948E', border: '#E5E1DA' },
  }
  const s = styles[variant]
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
      style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}
    >
      {label}
    </span>
  )
}

// ── Overlap Visualization ─────────────────────────────────────────────────────

function OverlapViz({ r }: { r: Researcher }) {
  return (
    <div
      className="rounded-lg p-3 mt-3"
      style={{ background: '#FAF8F5', border: '1px solid #EEE9E0' }}
      aria-label="Research overlap visualization"
    >
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div>
          <div className="font-medium mb-1.5" style={{ color: '#3D5FA0', fontSize: 10, letterSpacing: '0.08em' }}>
            YOU
          </div>
          <div className="flex flex-col gap-1">
            {r.yourTopics.map((t) => (
              <TopicChip key={t} label={t} variant="you" />
            ))}
          </div>
        </div>
        <div>
          <div className="font-medium mb-1.5 text-center" style={{ color: '#2A5C3D', fontSize: 10, letterSpacing: '0.08em' }}>
            SHARED
          </div>
          <div className="flex flex-col gap-1 items-center">
            {r.sharedTopics.map((t) => (
              <TopicChip key={t} label={t} variant="shared" />
            ))}
          </div>
        </div>
        <div>
          <div className="font-medium mb-1.5 text-right" style={{ color: '#9A4E1A', fontSize: 10, letterSpacing: '0.08em' }}>
            THEM
          </div>
          <div className="flex flex-col gap-1 items-end">
            {r.theirTopics.map((t) => (
              <TopicChip key={t} label={t} variant="them" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Match Score ───────────────────────────────────────────────────────────────

function MatchScore({ score }: { score: number }) {
  const color = score >= 85 ? '#2A5C3D' : score >= 75 ? '#3D6B5A' : '#5E7A60'
  return (
    <div className="flex items-center gap-1.5">
      <div
        className="w-2 h-2 rounded-full"
        style={{ background: color }}
        aria-hidden="true"
      />
      <span className="text-xs font-semibold" style={{ color }}>
        {score}% research overlap
      </span>
    </div>
  )
}

// ── Researcher Card ───────────────────────────────────────────────────────────

function ResearcherCard({
  r,
  followed,
  onFollow,
  onCollaborate,
  onMessage,
}: {
  r: Researcher
  followed: boolean
  onFollow: () => void
  onCollaborate: () => void
  onMessage: () => void
}) {
  return (
    <article
      className="researcher-card bg-white rounded-xl p-5 flex flex-col gap-3"
      style={{ border: '1px solid #E5E1DA' }}
      tabIndex={0}
      aria-label={`Researcher profile: ${r.name}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <Avatar initials={r.avatar} color={r.avatarColor} size={40} />
          <div>
            <div className="font-semibold text-sm leading-tight" style={{ color: '#1C1917' }}>
              {r.name}
            </div>
            <div className="text-xs mt-0.5" style={{ color: '#5E5A54' }}>
              {r.role}
            </div>
            <div className="text-xs mt-0.5" style={{ color: '#9A948E' }}>
              {r.institution}
            </div>
          </div>
        </div>
        <MatchScore score={r.matchScore} />
      </div>

      {/* Research areas */}
      <div className="flex flex-wrap gap-1.5">
        {r.areas.map((a) => (
          <TopicChip key={a} label={a} />
        ))}
      </div>

      {/* Current work */}
      <p className="text-xs leading-relaxed" style={{ color: '#5E5A54' }}>
        <span className="font-medium" style={{ color: '#1C1917' }}>Current work: </span>
        "{r.currentWork}"
      </p>

      {/* Why you're seeing this */}
      <div className="space-y-1">
        {r.reasons.map((reason) => (
          <div key={reason} className="flex items-start gap-2">
            <div
              className="w-1 h-1 rounded-full mt-1.5 shrink-0"
              style={{ background: '#2A5C3D' }}
              aria-hidden="true"
            />
            <span className="text-xs" style={{ color: '#5E5A54' }}>
              {reason}
            </span>
          </div>
        ))}
      </div>

      {/* Overlap viz */}
      <OverlapViz r={r} />

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1">
        <button
          className={`action-btn flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium${followed ? ' follow-btn-active' : ''}`}
          style={
            followed
              ? {}
              : { background: '#F5F3EF', color: '#5E5A54', border: '1px solid #E5E1DA' }
          }
          onClick={onFollow}
          aria-pressed={followed}
          aria-label={followed ? `Unfollow ${r.name}` : `Follow ${r.name}`}
        >
          {followed ? <CheckIcon /> : <PlusIcon />}
          {followed ? 'Following' : 'Follow'}
        </button>
        <button
          className="action-btn flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
          style={{ background: '#F5F3EF', color: '#5E5A54', border: '1px solid #E5E1DA' }}
          onClick={onMessage}
          aria-label={`Message ${r.name}`}
        >
          <MessageIcon size={13} />
          Message
        </button>
        <button
          className="action-btn flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ml-auto"
          style={{ background: '#2A5C3D', color: '#FFFFFF' }}
          onClick={onCollaborate}
          aria-label={`Request collaboration with ${r.name}`}
        >
          Collaborate
          <ArrowRightIcon />
        </button>
      </div>
    </article>
  )
}

// ── Open Collaboration Card ───────────────────────────────────────────────────

function OpenCollabCard({ c }: { c: OpenCollab }) {
  return (
    <article
      className="researcher-card bg-white rounded-xl p-5 flex flex-col gap-3"
      style={{ border: '1px solid #E5E1DA' }}
      tabIndex={0}
    >
      <div className="flex items-start gap-3">
        <Avatar initials={c.avatar} color={c.avatarColor} size={36} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="font-semibold text-sm" style={{ color: '#1C1917' }}>
                {c.name}
              </div>
              <div className="text-xs" style={{ color: '#5E5A54' }}>
                {c.role} · {c.institution}
              </div>
            </div>
            <span
              className="shrink-0 text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: '#EDF5F0', color: '#2A5C3D', border: '1px solid #B8D9C6' }}
            >
              Open
            </span>
          </div>
        </div>
      </div>
      <blockquote className="text-sm leading-relaxed" style={{ color: '#1C1917' }}>
        "{c.request}"
      </blockquote>
      <div className="flex flex-wrap gap-1.5">
        {c.needs.map((n) => (
          <TopicChip key={n} label={n} variant="need" />
        ))}
      </div>
      <div className="flex items-center justify-between pt-1">
        <span className="text-xs" style={{ color: '#9A948E' }}>
          {c.availability}
        </span>
        <div className="flex gap-2">
          <button
            className="action-btn px-3 py-1.5 rounded-lg text-xs font-medium"
            style={{ background: '#F5F3EF', color: '#5E5A54', border: '1px solid #E5E1DA' }}
          >
            Message
          </button>
          <button
            className="action-btn px-3 py-1.5 rounded-lg text-xs font-medium"
            style={{ background: '#2A5C3D', color: '#FFFFFF' }}
          >
            View opportunity
          </button>
        </div>
      </div>
    </article>
  )
}

// ── Lab Card ──────────────────────────────────────────────────────────────────

function LabCard({ lab }: { lab: Lab }) {
  return (
    <article
      className="researcher-card bg-white rounded-xl p-5"
      style={{ border: '1px solid #E5E1DA' }}
      tabIndex={0}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="font-semibold text-sm" style={{ color: '#1C1917' }}>
            {lab.name}
          </div>
          <div className="text-xs mt-0.5" style={{ color: '#5E5A54' }}>
            {lab.institution}
          </div>
          <div className="text-xs mt-1 flex items-center gap-1.5" style={{ color: '#2A5C3D' }}>
            <div className="w-1 h-1 rounded-full bg-current" aria-hidden="true" />
            {lab.match}
          </div>
        </div>
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0"
          style={{ background: '#EDF5F0', border: '1px solid #B8D9C6' }}
          aria-hidden="true"
        >
          ⬡
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {lab.focus.map((f) => (
          <TopicChip key={f} label={f} />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: 'Researchers', value: lab.researchers },
          { label: 'Publications', value: lab.publications },
          { label: 'Open collabs', value: lab.openCollaborations },
        ].map(({ label, value }) => (
          <div key={label} className="text-center">
            <div className="font-semibold text-base" style={{ color: '#1C1917' }}>
              {value}
            </div>
            <div className="text-xs" style={{ color: '#9A948E' }}>
              {label}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <button
          className="action-btn flex-1 px-3 py-1.5 rounded-lg text-xs font-medium text-center"
          style={{ background: '#F5F3EF', color: '#5E5A54', border: '1px solid #E5E1DA' }}
        >
          Explore researchers
        </button>
        <button
          className="action-btn flex-1 px-3 py-1.5 rounded-lg text-xs font-medium text-center"
          style={{ background: '#2A5C3D', color: '#FFFFFF' }}
        >
          View lab
        </button>
      </div>
    </article>
  )
}

// ── Collaborate Modal ─────────────────────────────────────────────────────────

function CollaborateModal({ r, onClose }: { r: Researcher; onClose: () => void }) {
  const [message, setMessage] = useState(
    `Hi ${r.name.split(' ')[1]}, I'm currently working on low-resource medical image segmentation and noticed your work on ${r.sharedTopics[0]}. I'd love to explore whether our approaches could complement each other.`
  )
  const [sent, setSent] = useState(false)

  const handleSend = () => {
    setSent(true)
    setTimeout(onClose, 1800)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-overlay-in"
      style={{ background: 'rgba(28, 25, 23, 0.4)' }}
      role="dialog"
      aria-modal="true"
      aria-label={`Start a research conversation with ${r.name}`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl animate-slide-up overflow-hidden"
        style={{ border: '1px solid #E5E1DA' }}
      >
        {sent ? (
          <div className="p-8 text-center">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: '#EDF5F0', border: '1px solid #B8D9C6' }}
              aria-hidden="true"
            >
              <CheckIcon />
            </div>
            <div className="font-semibold text-base mb-1" style={{ color: '#1C1917' }}>
              Collaboration request sent.
            </div>
            <div className="text-sm" style={{ color: '#5E5A54' }}>
              {r.name} will be notified of your message.
            </div>
          </div>
        ) : (
          <>
            <div className="px-6 pt-6 pb-4" style={{ borderBottom: '1px solid #E5E1DA' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-base" style={{ color: '#1C1917' }}>
                  Start a research conversation
                </h2>
                <button
                  onClick={onClose}
                  className="action-btn p-1.5 rounded-lg"
                  style={{ color: '#9A948E' }}
                  aria-label="Close dialog"
                >
                  <XIcon />
                </button>
              </div>
              <div className="flex items-center gap-3">
                <Avatar initials={r.avatar} color={r.avatarColor} size={40} />
                <div>
                  <div className="font-medium text-sm" style={{ color: '#1C1917' }}>
                    {r.name}
                  </div>
                  <div className="text-xs" style={{ color: '#5E5A54' }}>
                    {r.role}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4">
              <div className="mb-4">
                <div className="text-xs font-medium mb-2" style={{ color: '#9A948E', letterSpacing: '0.06em' }}>
                  SHARED INTERESTS
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {r.sharedTopics.map((t) => (
                    <TopicChip key={t} label={t} variant="shared" />
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="collab-message"
                  className="text-xs font-medium block mb-2"
                  style={{ color: '#1C1917' }}
                >
                  Your message
                </label>
                <textarea
                  id="collab-message"
                  className="w-full rounded-xl text-sm leading-relaxed resize-none outline-none focus:ring-2 p-3"
                  style={{
                    background: '#F8F6F2',
                    border: '1px solid #E5E1DA',
                    color: '#1C1917',
                    minHeight: 120,
                    '--tw-ring-color': '#B8D9C6',
                  } as React.CSSProperties}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell them why you'd like to connect..."
                  aria-describedby="collab-message-hint"
                />
                <p id="collab-message-hint" className="sr-only">
                  Write a message to {r.name} explaining your interest in collaborating
                </p>
              </div>
            </div>

            <div
              className="px-6 py-4 flex items-center justify-end gap-3"
              style={{ borderTop: '1px solid #E5E1DA', background: '#FAFAF8' }}
            >
              <button
                className="action-btn px-4 py-2 rounded-lg text-sm font-medium"
                style={{ color: '#5E5A54', background: '#F5F3EF', border: '1px solid #E5E1DA' }}
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="action-btn px-4 py-2 rounded-lg text-sm font-medium"
                style={{ background: '#2A5C3D', color: '#FFFFFF' }}
                onClick={handleSend}
                disabled={!message.trim()}
              >
                Send request
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ── Right Rail ────────────────────────────────────────────────────────────────

function RightRail() {
  return (
    <aside
      className="shrink-0 overflow-y-auto flex flex-col gap-0"
      style={{ width: 296, borderLeft: '1px solid #E5E1DA', background: '#FAF8F5' }}
      aria-label="Contextual information"
    >
      {/* Collaboration Profile */}
      <section className="px-5 py-5" style={{ borderBottom: '1px solid #E5E1DA' }}>
        <div className="flex items-center gap-2 mb-3">
          <Avatar initials="MC" color="#2A5C3D" size={28} />
          <span className="font-semibold text-sm" style={{ color: '#1C1917' }}>
            Your collaboration profile
          </span>
        </div>

        <div className="space-y-3">
          <div>
            <div
              className="text-[10px] font-semibold tracking-[0.1em] mb-1.5"
              style={{ color: '#9A948E' }}
            >
              RESEARCH AREAS
            </div>
            <div className="flex flex-wrap gap-1">
              {['Medical Imaging', 'Computer Vision', 'Machine Learning', 'Federated Learning'].map(
                (t) => (
                  <TopicChip key={t} label={t} />
                )
              )}
            </div>
          </div>

          <div>
            <div
              className="text-[10px] font-semibold tracking-[0.1em] mb-1.5"
              style={{ color: '#9A948E' }}
            >
              CURRENT PROJECT
            </div>
            <p className="text-xs leading-relaxed" style={{ color: '#5E5A54' }}>
              Low-Resource Medical Image Segmentation
            </p>
          </div>

          <div>
            <div
              className="text-[10px] font-semibold tracking-[0.1em] mb-1.5"
              style={{ color: '#9A948E' }}
            >
              OPEN TO
            </div>
            <div className="flex flex-col gap-1">
              {['Co-authorship', 'Research discussion', 'Methodology collaboration'].map((t) => (
                <div key={t} className="flex items-center gap-1.5">
                  <div
                    className="w-1 h-1 rounded-full"
                    style={{ background: '#2A5C3D' }}
                    aria-hidden="true"
                  />
                  <span className="text-xs" style={{ color: '#5E5A54' }}>
                    {t}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          className="action-btn w-full mt-4 px-3 py-2 rounded-lg text-xs font-medium text-center"
          style={{ background: '#F5F3EF', color: '#2A5C3D', border: '1px solid #C8D9C0' }}
        >
          Update collaboration preferences
        </button>
      </section>

      {/* Research Network */}
      <section className="px-5 py-4" style={{ borderBottom: '1px solid #E5E1DA' }}>
        <div className="font-semibold text-sm mb-3" style={{ color: '#1C1917' }}>
          Your research network
        </div>
        <div className="space-y-2">
          {[
            { label: 'Following', value: '42 researchers' },
            { label: 'Collaborators', value: '6' },
            { label: 'Labs', value: '4' },
            { label: 'Topics', value: '18' },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-sm" style={{ color: '#5E5A54' }}>
                {label}
              </span>
              <span className="text-sm font-semibold" style={{ color: '#1C1917' }}>
                {value}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Activity */}
      <section className="px-5 py-4">
        <div className="font-semibold text-sm mb-3" style={{ color: '#1C1917' }}>
          Recent activity
        </div>
        <div className="space-y-3">
          {ACTIVITY.map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <div
                className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                style={{ background: '#C8C4BC' }}
                aria-hidden="true"
              />
              <div>
                <p className="text-xs leading-relaxed" style={{ color: '#5E5A54' }}>
                  {item.text}
                </p>
                <span className="text-xs" style={{ color: '#9A948E' }}>
                  {item.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </aside>
  )
}

// ── Main App ──────────────────────────────────────────────────────────────────

export default function App() {
  const [selectedIntents, setSelectedIntents] = useState<string[]>([
    'Research collaborator', 'Co-author',
  ])
  const [collaborateTarget, setCollaborateTarget] = useState<Researcher | null>(null)
  const [followedIds, setFollowedIds] = useState<Set<number>>(new Set())
  const [searchValue, setSearchValue] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 2800)
  }

  const toggleFollow = (id: number, name: string) => {
    setFollowedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
        showToast(`You're now following ${name}.`)
      }
      return next
    })
  }

  const toggleIntent = (intent: string) => {
    setSelectedIntents((prev) =>
      prev.includes(intent) ? prev.filter((i) => i !== intent) : [...prev, intent]
    )
  }

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: '#F8F6F2', fontFamily: "'Inter', sans-serif" }}
    >
      <Sidebar />

      {/* Main scroll area */}
      <main className="flex-1 overflow-y-auto" id="main-content" tabIndex={-1}>
        {/* Top Bar */}
        <header
          className="sticky top-0 z-30 flex items-center justify-between px-8 h-14"
          style={{ background: 'rgba(248,246,242,0.92)', backdropFilter: 'blur(8px)', borderBottom: '1px solid #E5E1DA' }}
        >
          <div className="text-sm font-medium" style={{ color: '#9A948E' }}>
            Community / Collaborations
          </div>
          <div className="flex items-center gap-1">
            <button
              className="action-btn flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm"
              style={{ color: '#5E5A54' }}
              aria-label="Search"
            >
              <SearchIcon />
            </button>
            <button
              className="action-btn p-2 rounded-lg relative"
              style={{ color: '#5E5A54' }}
              aria-label="Notifications"
            >
              <BellIcon />
              <span
                className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
                style={{ background: '#2A5C3D' }}
                aria-label="3 unread notifications"
              />
            </button>
            <button
              className="action-btn p-2 rounded-lg"
              style={{ color: '#5E5A54' }}
              aria-label="Messages"
            >
              <MessageIcon />
            </button>
            <button
              className="action-btn ml-1"
              aria-label="Your profile"
            >
              <Avatar initials="MC" color="#2A5C3D" size={30} />
            </button>
          </div>
        </header>

        <div className="px-8 py-8 max-w-4xl space-y-10">
          {/* Page Header */}
          <section aria-labelledby="page-heading">
            <p
              className="text-xs font-semibold tracking-[0.14em] mb-3"
              style={{ color: '#2A5C3D' }}
            >
              COLLABORATION
            </p>
            <h1
              id="page-heading"
              className="text-4xl font-semibold leading-tight mb-3"
              style={{
                color: '#1C1917',
                fontFamily: "'DM Serif Display', Georgia, serif",
                letterSpacing: '-0.02em',
              }}
            >
              Find the people behind the research.
            </h1>
            <p className="text-base mb-6 max-w-xl" style={{ color: '#5E5A54' }}>
              Discover researchers, labs, and expertise that can help move your work forward.
            </p>
            <div className="flex items-center gap-3">
              <button
                className="action-btn flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
                style={{ background: '#2A5C3D', color: '#FFFFFF' }}
              >
                Find collaborators
                <ArrowRightIcon />
              </button>
              <button
                className="action-btn px-4 py-2.5 rounded-xl text-sm font-medium"
                style={{ background: '#F5F3EF', color: '#1C1917', border: '1px solid #E5E1DA' }}
              >
                Share what I'm working on
              </button>
            </div>
          </section>

          {/* Search */}
          <section aria-label="Search for collaborators">
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white mb-3"
              style={{ border: '1px solid #E5E1DA' }}
            >
              <SearchIcon size={18} />
              <input
                type="search"
                className="flex-1 text-sm outline-none bg-transparent"
                style={{ color: '#1C1917' }}
                placeholder="Search researchers, expertise, labs, projects..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                aria-label="Search researchers, expertise, labs, and projects"
              />
              <button
                className="action-btn flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                style={{ background: '#F5F3EF', color: '#5E5A54', border: '1px solid #E5E1DA' }}
                onClick={() => setShowFilters((v) => !v)}
                aria-expanded={showFilters}
                aria-controls="search-filters"
              >
                <FilterIcon />
                Filters
              </button>
            </div>

            {showFilters && (
              <div
                id="search-filters"
                className="bg-white rounded-xl p-4 animate-fade-in"
                style={{ border: '1px solid #E5E1DA' }}
              >
                <div className="grid grid-cols-3 gap-x-8 gap-y-3 text-xs" style={{ color: '#5E5A54' }}>
                  {[
                    'Research area', 'Expertise', 'Institution',
                    'Location', 'Research level', 'Collaboration type',
                    'Availability', 'Language', 'Methods',
                    'Topics', 'Publication activity', 'Project activity',
                  ].map((f) => (
                    <label key={f} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded"
                        style={{ accentColor: '#2A5C3D' }}
                        aria-label={`Filter by ${f}`}
                      />
                      {f}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Collaboration Intent */}
          <section aria-labelledby="intent-heading">
            <h2
              id="intent-heading"
              className="text-sm font-semibold mb-1"
              style={{ color: '#1C1917' }}
            >
              What are you looking for?
            </h2>
            <p className="text-xs mb-3" style={{ color: '#9A948E' }}>
              Select your collaboration context — helps us surface the most relevant connections.
            </p>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Collaboration intent filters">
              {INTENT_OPTIONS.map((intent) => {
                const active = selectedIntents.includes(intent)
                return (
                  <button
                    key={intent}
                    className="intent-chip px-3 py-1.5 rounded-full text-xs font-medium"
                    style={
                      active
                        ? { background: '#EDF5F0', color: '#2A5C3D', border: '1px solid #B8D9C6' }
                        : { background: '#F5F3EF', color: '#5E5A54', border: '1px solid #E5E1DA' }
                    }
                    onClick={() => toggleIntent(intent)}
                    aria-pressed={active}
                  >
                    {active && <span className="mr-1" aria-hidden="true">✓ </span>}
                    {intent}
                  </button>
                )
              })}
            </div>
          </section>

          {/* Recommended Collaborators */}
          <section aria-labelledby="people-heading">
            <div className="flex items-baseline justify-between mb-4">
              <div>
                <h2 id="people-heading" className="text-xl font-semibold" style={{ color: '#1C1917' }}>
                  People worth knowing
                </h2>
                <p className="text-sm mt-0.5" style={{ color: '#9A948E' }}>
                  Based on your research areas and current project
                </p>
              </div>
              <button
                className="action-btn text-sm font-medium"
                style={{ color: '#2A5C3D' }}
              >
                View all
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {RESEARCHERS.map((r) => (
                <ResearcherCard
                  key={r.id}
                  r={r}
                  followed={followedIds.has(r.id)}
                  onFollow={() => toggleFollow(r.id, r.name)}
                  onCollaborate={() => setCollaborateTarget(r)}
                  onMessage={() => showToast(`Opening conversation with ${r.name}.`)}
                />
              ))}
            </div>
          </section>

          {/* Open to Collaboration */}
          <section aria-labelledby="open-collab-heading">
            <div className="flex items-baseline justify-between mb-4">
              <div>
                <h2
                  id="open-collab-heading"
                  className="text-xl font-semibold"
                  style={{ color: '#1C1917' }}
                >
                  Open to collaboration
                </h2>
                <p className="text-sm mt-0.5" style={{ color: '#9A948E' }}>
                  Researchers who have explicitly indicated collaboration intent
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {OPEN_COLLABS.map((c) => (
                <OpenCollabCard key={c.id} c={c} />
              ))}
            </div>
          </section>

          {/* Labs and Research Groups */}
          <section aria-labelledby="labs-heading">
            <div className="flex items-baseline justify-between mb-4">
              <div>
                <h2 id="labs-heading" className="text-xl font-semibold" style={{ color: '#1C1917' }}>
                  Labs and research groups
                </h2>
                <p className="text-sm mt-0.5" style={{ color: '#9A948E' }}>
                  Institutional research environments aligned with your work
                </p>
              </div>
              <button className="action-btn text-sm font-medium" style={{ color: '#2A5C3D' }}>
                Browse all labs
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {LABS.map((lab) => (
                <LabCard key={lab.id} lab={lab} />
              ))}
            </div>
          </section>

          {/* Interdisciplinary Discovery */}
          <section
            className="rounded-2xl p-6"
            style={{ background: '#FFFFFF', border: '1px solid #E5E1DA' }}
            aria-labelledby="interdisciplinary-heading"
          >
            <div className="mb-1">
              <p className="text-xs font-semibold tracking-[0.1em] mb-1" style={{ color: '#2A5C3D' }}>
                BEYOND YOUR FIELD
              </p>
              <h2 id="interdisciplinary-heading" className="text-xl font-semibold" style={{ color: '#1C1917' }}>
                Research beyond your field
              </h2>
            </div>
            <div
              className="flex items-center gap-2 my-3 text-sm"
              style={{ color: '#5E5A54' }}
            >
              <span>You work in</span>
              <TopicChip label="Medical Imaging" variant="shared" />
              <span>— researchers in these adjacent areas may complement your work:</span>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-4">
              {INTERDISCIPLINARY.map((item) => (
                <div
                  key={item.name}
                  className="researcher-card rounded-xl p-4 cursor-pointer"
                  style={{ background: '#F8F6F2', border: '1px solid #E5E1DA' }}
                  tabIndex={0}
                  role="button"
                  aria-label={`Explore ${item.name} — ${item.reason}`}
                >
                  <div className="font-medium text-sm mb-1" style={{ color: '#1C1917' }}>
                    {item.name}
                  </div>
                  <div className="text-xs" style={{ color: '#9A948E' }}>
                    {item.reason}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs mt-4" style={{ color: '#9A948E' }}>
              These fields overlap with your research through image analysis, statistical modeling, and clinical data interpretation.
            </p>
            <button
              className="action-btn flex items-center gap-1.5 mt-4 text-sm font-medium"
              style={{ color: '#2A5C3D' }}
            >
              Explore connections <ArrowRightIcon />
            </button>
          </section>

          {/* Research Questions */}
          <section aria-labelledby="questions-heading" className="pb-8">
            <div className="flex items-baseline justify-between mb-4">
              <div>
                <h2 id="questions-heading" className="text-xl font-semibold" style={{ color: '#1C1917' }}>
                  Questions researchers are looking for help with
                </h2>
                <p className="text-sm mt-0.5" style={{ color: '#9A948E' }}>
                  Open research questions that match your expertise
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {RESEARCH_QUESTIONS.map((q) => (
                <article
                  key={q.id}
                  className="researcher-card bg-white rounded-xl p-5"
                  style={{ border: '1px solid #E5E1DA' }}
                  tabIndex={0}
                >
                  <div className="flex items-start gap-4">
                    <Avatar initials={q.avatar} color={q.avatarColor} size={32} />
                    <div className="flex-1 min-w-0">
                      <blockquote
                        className="text-sm font-medium leading-relaxed mb-2"
                        style={{ color: '#1C1917' }}
                      >
                        "{q.question}"
                      </blockquote>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-medium" style={{ color: '#5E5A54' }}>
                          {q.askedBy}
                        </span>
                        <span className="text-xs" style={{ color: '#9A948E' }}>
                          · {q.role}
                        </span>
                        <span
                          className="ml-auto text-xs px-2 py-0.5 rounded-full"
                          style={{ background: '#F5F3EF', color: '#9A948E', border: '1px solid #E5E1DA' }}
                        >
                          {q.responses} responses
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {q.tags.map((t) => (
                          <TopicChip key={t} label={t} variant="tag" />
                        ))}
                      </div>
                      <div className="mb-3">
                        <span className="text-xs font-medium" style={{ color: '#9A948E' }}>
                          Looking for:{' '}
                        </span>
                        {q.lookingFor.map((l, i) => (
                          <span key={l} className="text-xs" style={{ color: '#5E5A54' }}>
                            {l}{i < q.lookingFor.length - 1 ? ', ' : ''}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="action-btn px-3 py-1.5 rounded-lg text-xs font-medium"
                          style={{ background: '#F5F3EF', color: '#5E5A54', border: '1px solid #E5E1DA' }}
                        >
                          Follow question
                        </button>
                        <button
                          className="action-btn px-3 py-1.5 rounded-lg text-xs font-medium"
                          style={{ background: '#F5F3EF', color: '#5E5A54', border: '1px solid #E5E1DA' }}
                        >
                          Join discussion
                        </button>
                        <button
                          className="action-btn px-3 py-1.5 rounded-lg text-xs font-medium"
                          style={{ background: '#2A5C3D', color: '#FFFFFF' }}
                        >
                          Offer expertise
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>

      <RightRail />

      {/* Collaborate Modal */}
      {collaborateTarget && (
        <CollaborateModal
          r={collaborateTarget}
          onClose={() => setCollaborateTarget(null)}
        />
      )}

      {/* Toast */}
      {toastMessage && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-3 rounded-xl text-sm font-medium shadow-lg animate-slide-up z-50"
          style={{ background: '#1C1917', color: '#FFFFFF', border: '1px solid #333' }}
          role="status"
          aria-live="polite"
        >
          {toastMessage}
        </div>
      )}
    </div>
  )
}
