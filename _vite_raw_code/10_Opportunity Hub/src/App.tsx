import { useState, useEffect, useCallback, useRef } from 'react'

// ─── Utility ──────────────────────────────────────────────────────────────────

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconSearch() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="7" cy="7" r="4.5" />
      <path d="M10.5 10.5 14 14" />
    </svg>
  )
}

function IconBookmark({ filled }: { filled: boolean }) {
  return (
    <svg width="13" height="13" viewBox="0 0 14 16" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 2a1 1 0 011-1h8a1 1 0 011 1v12l-5-3-5 3V2z" />
    </svg>
  )
}

function IconChevron({ dir = 'down', size = 11 }: { dir?: 'up' | 'down'; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {dir === 'down' ? <path d="M2 4l4 4 4-4" /> : <path d="M2 8l4-4 4 4" />}
    </svg>
  )
}

function IconBell() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8 2a5 5 0 00-5 5v2.5L2 11h12l-1-1.5V7a5 5 0 00-5-5z" />
      <path d="M6.5 13a1.5 1.5 0 003 0" />
    </svg>
  )
}

function IconFilter() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <path d="M1 3h12M3.5 7h7M6 11h2" />
    </svg>
  )
}

function IconX({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
      <path d="M1 1l12 12M13 1L1 13" />
    </svg>
  )
}

function IconExternal() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 2H2a1 1 0 00-1 1v7a1 1 0 001 1h7a1 1 0 001-1V7" />
      <path d="M8 1h3v3M11 1L5.5 6.5" />
    </svg>
  )
}

function IconShare() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="2.5" r="1.5" />
      <circle cx="11" cy="11.5" r="1.5" />
      <circle cx="3" cy="7" r="1.5" />
      <path d="M9.5 3.3l-5 2.8M9.5 10.7l-5-2.8" />
    </svg>
  )
}

function IconCheck() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1.5 6l3.5 3.5 5.5-5.5" />
    </svg>
  )
}

function IconDot({ className = '' }: { className?: string }) {
  return <span className={cn('inline-block w-1.5 h-1.5 rounded-full shrink-0', className)} />
}

// ─── Types ────────────────────────────────────────────────────────────────────

type TabId = 'for-you' | 'all' | 'grants' | 'fellowships' | 'scholarships' | 'conferences' | 'cfp' | 'competitions' | 'programs'
type OpportunityKind = 'Fellowship' | 'Grant' | 'Conference' | 'Scholarship' | 'Call for Papers' | 'Competition' | 'Research Program'
type TrackStatus = 'Saved' | 'Considering' | 'Preparing' | 'Draft' | 'Submitted' | 'Accepted' | 'Rejected' | 'Withdrawn'
type AppStatus = 'In progress' | 'Saved' | 'Draft'

interface TimelineItem { date: string; label: string }
interface Opportunity {
  id: string
  title: string
  org: string
  kind: OpportunityKind
  deadline: string
  daysLeft: number
  funding?: string
  eligibility?: string
  location?: string
  areas: string[]
  matchScore?: number
  matchReason?: string
  matchPoints?: string[]
  overview?: string
  requirements?: string[]
  timeline?: TimelineItem[]
  applicationProcess?: string[]
  officialSource?: string
  relatedIds?: string[]
}

interface DeadlineItem { date: string; title: string; daysLeft: number }
interface AppItem { id: string; title: string; status: AppStatus }
interface SavedSearch { label: string; updated: string; newCount: number }

// ─── Data ─────────────────────────────────────────────────────────────────────

const STRONG_MATCHES: Opportunity[] = [
  {
    id: 'sm1',
    title: 'Early Career Research Fellowship',
    org: 'Global Health Research Foundation',
    kind: 'Fellowship',
    deadline: 'Sep 18, 2026',
    daysLeft: 36,
    funding: 'Up to $45,000',
    eligibility: 'PhD Researchers',
    location: 'Remote eligible',
    areas: ['Medical Imaging', 'Clinical AI'],
    matchScore: 94,
    matchReason: 'Strong alignment with your work in medical imaging and low-resource clinical environments.',
    matchPoints: [
      'Your research interests include Medical Imaging.',
      'Your current project focuses on low-resource clinical AI.',
      "You're eligible as a PhD researcher.",
    ],
    overview: "The Global Health Research Foundation's Early Career Fellowship supports PhD researchers working at the intersection of global health and emerging technologies. Fellows receive funding to pursue independent research projects addressing critical health challenges in low-resource settings, with mentorship from a network of senior researchers.",
    requirements: [
      'Currently enrolled in a PhD program in a relevant field',
      'Research focus on global health, medical imaging, or clinical AI',
      'Less than 3 years into PhD program at time of application',
      'Strong academic record with at least one first-author publication or preprint',
      'Institutional letter of support from PhD supervisor',
    ],
    timeline: [
      { date: 'Aug 1, 2026', label: 'Applications open' },
      { date: 'Sep 18, 2026', label: 'Application deadline' },
      { date: 'Oct – Nov 2026', label: 'Review period' },
      { date: 'Dec 2026', label: 'Decisions announced' },
      { date: 'Jan 2027', label: 'Fellowship begins' },
    ],
    applicationProcess: [
      'Create an account on the GHRF portal at ghrf.org',
      'Complete the research proposal (2,000 words maximum)',
      'Upload your CV and full publication list',
      'Request two letters of recommendation via the portal',
      'Submit institutional sign-off form from your supervisor',
      'Complete and submit the full application form',
    ],
    officialSource: 'ghrf.org/early-career-fellowship',
    relatedIds: ['sm2', 'ex2'],
  },
  {
    id: 'sm2',
    title: 'AI for Healthcare Research Grant',
    org: 'International Research Council',
    kind: 'Grant',
    deadline: 'Oct 02, 2026',
    daysLeft: 50,
    funding: 'Up to $75,000',
    eligibility: 'PhD & Postdoc',
    location: 'International',
    areas: ['Computer Vision', 'Medical AI'],
    matchScore: 91,
    matchReason: 'Matches Computer Vision and Medical AI in your research profile.',
    matchPoints: [
      'Your expertise includes Computer Vision.',
      'Aligns with your Medical AI research direction.',
      'Funding level suits your current project scope.',
    ],
    overview: "The IRC's AI for Healthcare Research Grant funds frontier research applying artificial intelligence to improve health outcomes globally. Priority is given to projects demonstrating clinical utility, responsible AI principles, and potential for deployment in resource-constrained settings.",
    requirements: [
      'PhD student or postdoctoral researcher at an accredited institution',
      'Primary research focus on AI applications in healthcare',
      'Institutional affiliation with an IRC-registered research institution',
      'Project must show clear pathway to clinical or public health impact',
    ],
    timeline: [
      { date: 'Aug 15, 2026', label: 'Applications open' },
      { date: 'Oct 2, 2026', label: 'Application deadline' },
      { date: 'Nov 2026', label: 'Shortlist announced' },
      { date: 'Jan 2027', label: 'Grant awarded' },
    ],
    applicationProcess: [
      'Register at irc-grants.org and complete your researcher profile',
      'Submit a project summary (500 words) for initial screening',
      'If invited, submit full proposal including budget justification',
      'Participate in a 30-minute panel review interview',
    ],
    officialSource: 'irc-grants.org/ai-healthcare',
    relatedIds: ['sm1', 'ex1'],
  },
  {
    id: 'sm3',
    title: 'MICCAI 2026',
    org: 'International Conference on Medical Image Computing',
    kind: 'Conference',
    deadline: 'Oct 04, 2026',
    daysLeft: 52,
    location: 'Singapore',
    areas: ['Medical Imaging', 'Computer Vision', 'Deep Learning'],
    matchScore: 89,
    matchReason: 'Strong fit for your current medical imaging project.',
    matchPoints: [
      'Your current project aligns with MICCAI research themes.',
      'Paper submission deadline fits your writing timeline.',
      'Researchers in your lab have presented at MICCAI before.',
    ],
    overview: "MICCAI 2026 is the leading international conference on medical image computing and computer-assisted intervention. The conference brings together clinicians, biomedical scientists, and engineers to present and discuss their latest research on medical image computing, computer-assisted intervention, robotics, and medical imaging informatics.",
    requirements: [
      'Original, unpublished research (8 pages maximum, LNCS format)',
      'Research must be in scope: medical image computing, analysis, or intervention',
      'All authors must be registered for the conference if paper is accepted',
      'Supplementary material (up to 4 pages) is optional',
    ],
    timeline: [
      { date: 'Aug 1, 2026', label: 'Submission portal opens' },
      { date: 'Oct 4, 2026', label: 'Paper submission deadline' },
      { date: 'Nov 2026', label: 'Reviews returned' },
      { date: 'Dec 2026', label: 'Rebuttal period' },
      { date: 'Jan 2027', label: 'Acceptance decisions' },
      { date: 'Apr 2027', label: 'Conference, Singapore' },
    ],
    applicationProcess: [
      'Prepare your paper following the LNCS formatting guidelines',
      'Create a CMT account at cmt3.research.microsoft.com',
      'Submit paper, supplementary materials, and author list via CMT',
      'Complete ethics and responsible AI declarations during submission',
    ],
    officialSource: 'miccai2026.org/submissions',
    relatedIds: ['ex6', 'ex8'],
  },
  {
    id: 'sm4',
    title: 'NIH K99/R00 Pathway to Independence Award',
    org: 'National Institutes of Health',
    kind: 'Fellowship',
    deadline: 'Oct 12, 2026',
    daysLeft: 60,
    funding: '$90,000 / year (mentored phase)',
    eligibility: 'Postdoctoral Researchers',
    location: 'United States',
    areas: ['Biomedical Research', 'Medical Imaging', 'Machine Learning'],
    matchScore: 82,
    matchReason: 'Aligns with your biomedical AI trajectory and career stage.',
    matchPoints: [
      'Your medical imaging research aligns with NIH priority areas.',
      'This award supports transitioning from postdoc to independent researcher.',
      'Computer vision and AI methods are a priority for this funding mechanism.',
    ],
    overview: "The NIH K99/R00 Pathway to Independence Award provides up to 5 years of support in two phases: a mentored phase (K99) of 1-2 years at a current institution, followed by an independent phase (R00) of up to 3 years at a new institution. Designed to help outstanding postdoctoral researchers secure a tenure-track faculty position.",
    requirements: [
      'No more than 4 years of postdoctoral research experience at time of application',
      'US citizenship, permanent residency, or non-citizen national status',
      'Strong publication record in biomedical or health-related research',
      'Commitment from mentor and institution to support career transition',
    ],
    timeline: [
      { date: 'Oct 12, 2026', label: 'Application deadline' },
      { date: 'Nov – Feb', label: 'Study section review' },
      { date: 'Mar 2027', label: 'Council review' },
      { date: 'Jul 2027', label: 'Earliest funding start date' },
    ],
    applicationProcess: [
      'Discuss the K99/R00 with your mentor and institutional grants office',
      'Prepare your career development plan and research strategy',
      'Complete application via NIH eRA Commons',
      'Obtain institutional sign-off and biosketches from all key personnel',
    ],
    officialSource: 'grants.nih.gov/grants/guide/pa-files/PA-23-189.html',
    relatedIds: ['sm1', 'ex1'],
  },
]

const EXPLORE_OPPS: Opportunity[] = [
  { id: 'ex1', title: 'NIH Computational Imaging Grant', org: 'National Institutes of Health', kind: 'Grant', deadline: 'Nov 15, 2026', daysLeft: 94, funding: 'Up to $250,000', eligibility: 'Faculty & Senior Researchers', areas: ['Computational Imaging', 'Biomedical AI'], matchScore: 78 },
  { id: 'ex2', title: 'European AI Research Fellowship', org: 'European Research Council', kind: 'Fellowship', deadline: 'Oct 21, 2026', daysLeft: 69, funding: '€60,000 / year', eligibility: 'Postdoc', location: 'EU / Remote', areas: ['Artificial Intelligence', 'Machine Learning'], matchScore: 74 },
  { id: 'ex3', title: 'Women in AI Research Fellowship', org: 'AI Equity Foundation', kind: 'Fellowship', deadline: 'Oct 31, 2026', daysLeft: 79, funding: 'Up to $30,000', eligibility: 'Women in AI & ML', areas: ['Artificial Intelligence', 'Research Equity'], matchScore: 71 },
  { id: 'ex4', title: 'Open Science Innovation Challenge', org: 'UNESCO & Gates Foundation', kind: 'Competition', deadline: 'Oct 21, 2026', daysLeft: 69, funding: 'Up to $100,000', areas: ['Open Science', 'Global Health'], matchScore: 68 },
  { id: 'ex5', title: 'Global Health Data Research Grant', org: 'Wellcome Trust', kind: 'Grant', deadline: 'Dec 01, 2026', daysLeft: 110, funding: 'Up to $180,000', eligibility: 'PhD & Postdoc', location: 'Remote eligible', areas: ['Global Health', 'Data Science', 'Medical AI'], matchScore: 65 },
  { id: 'ex6', title: 'NeurIPS Workshop CFP', org: 'Neural Information Processing Systems', kind: 'Call for Papers', deadline: 'Sep 22, 2026', daysLeft: 40, location: 'Vancouver, Canada', areas: ['Deep Learning', 'Machine Learning'], matchScore: 63 },
  { id: 'ex7', title: 'Federated Learning Research Program', org: 'Linux Foundation AI', kind: 'Research Program', deadline: 'Nov 30, 2026', daysLeft: 109, funding: 'Stipend + resources', location: 'Remote', areas: ['Federated Learning', 'Privacy-Preserving AI'], matchScore: 60 },
  { id: 'ex8', title: 'CVPR 2027 Paper Submission', org: 'Computer Vision Foundation', kind: 'Call for Papers', deadline: 'Nov 08, 2026', daysLeft: 87, location: 'Nashville, US', areas: ['Computer Vision', 'Image Recognition'], matchScore: 58 },
]

const ALL_OPPS = [...STRONG_MATCHES, ...EXPLORE_OPPS]

const DEADLINES: DeadlineItem[] = [
  { date: 'SEP 18', title: 'Early Career Research Fellowship', daysLeft: 36 },
  { date: 'SEP 22', title: 'NeurIPS Workshop CFP', daysLeft: 40 },
  { date: 'OCT 02', title: 'AI for Healthcare Research Grant', daysLeft: 50 },
  { date: 'OCT 04', title: 'MICCAI 2026', daysLeft: 52 },
  { date: 'OCT 21', title: 'Open Science Innovation Challenge', daysLeft: 69 },
]

const APP_ITEMS: AppItem[] = [
  { id: 'a1', title: 'Early Career Research Fellowship', status: 'In progress' },
  { id: 'a2', title: 'AI for Healthcare Grant', status: 'Saved' },
  { id: 'a3', title: 'MICCAI 2026', status: 'Draft' },
]

const SIGNALS = [
  'Medical AI funding activity has increased this quarter.',
  '3 new fellowships matching your profile appeared this week.',
  'Two conferences relevant to your project have opened submissions.',
  'Your current project aligns with 7 open opportunities.',
]

const SAVED_SEARCHES: SavedSearch[] = [
  { label: 'Medical AI fellowships', updated: '2 days ago', newCount: 3 },
  { label: 'Computer Vision grants', updated: '5 days ago', newCount: 1 },
  { label: 'PhD research funding', updated: '1 week ago', newCount: 0 },
  { label: 'Healthcare conferences', updated: '3 days ago', newCount: 2 },
]

const TABS: { id: TabId; label: string }[] = [
  { id: 'for-you', label: 'For You' },
  { id: 'all', label: 'All Opportunities' },
  { id: 'grants', label: 'Grants' },
  { id: 'fellowships', label: 'Fellowships' },
  { id: 'scholarships', label: 'Scholarships' },
  { id: 'conferences', label: 'Conferences' },
  { id: 'cfp', label: 'Calls for Papers' },
  { id: 'competitions', label: 'Competitions' },
  { id: 'programs', label: 'Research Programs' },
]

const NAV_GROUPS = [
  { label: 'RESEARCH', items: ['Workspace', 'Papers', 'Publications', 'Projects', 'Notes'] },
  { label: 'COMMUNITY', items: ['Feed', 'Researchers', 'Labs', 'Collaborations', 'Messages'] },
  { label: 'OPPORTUNITIES', items: ['Opportunities', 'Grants', 'Conferences', 'Journals', 'Scholarships', 'Fellowships'], active: 'Opportunities' },
  { label: 'PERSONAL', items: ['Calendar', 'Notifications', 'Collections'] },
  { label: 'PROFILE', items: ['My Profile', 'Settings'] },
]

const SORT_OPTIONS = ['Best Match', 'Deadline Soon', 'Recently Added', 'Highest Funding', 'Alphabetical']

const TRACK_STATUSES: TrackStatus[] = ['Saved', 'Considering', 'Preparing', 'Draft', 'Submitted', 'Accepted', 'Rejected', 'Withdrawn']

const FILTER_SECTIONS = [
  {
    label: 'Opportunity Type',
    options: ['Fellowship', 'Grant', 'Conference', 'Scholarship', 'Call for Papers', 'Competition', 'Research Program'],
  },
  {
    label: 'Research Area',
    options: ['Medical Imaging', 'Computer Vision', 'Machine Learning', 'Deep Learning', 'Federated Learning', 'Global Health', 'Biomedical AI', 'Open Science'],
  },
  {
    label: 'Academic Level',
    options: ['Undergraduate', 'Masters', 'PhD', 'Postdoc', 'Early Career Faculty', 'Senior Researcher'],
  },
  {
    label: 'Funding Range',
    options: ['Under $10,000', '$10k – $50k', '$50k – $100k', '$100k – $250k', 'Over $250k', 'Non-monetary'],
  },
  {
    label: 'Location',
    options: ['Remote / Virtual', 'United States', 'European Union', 'Asia-Pacific', 'International'],
  },
  {
    label: 'Application Status',
    options: ['Not started', 'Saved', 'In progress', 'Submitted'],
  },
]

// ─── Urgency helpers ──────────────────────────────────────────────────────────

function urgencyLevel(d: number): 'urgent' | 'soon' | 'normal' {
  if (d < 14) return 'urgent'
  if (d < 35) return 'soon'
  return 'normal'
}

function deadlineTextClass(d: number) {
  const u = urgencyLevel(d)
  return u === 'urgent' ? 'text-urgent' : u === 'soon' ? 'text-amber' : 'text-ink2'
}

function deadlineDimClass(d: number) {
  const u = urgencyLevel(d)
  return u === 'urgent' ? 'text-urgent' : u === 'soon' ? 'text-amber' : 'text-faint'
}

function deadlineBgClass(d: number) {
  const u = urgencyLevel(d)
  return u === 'urgent' ? 'bg-urgent-bg text-urgent' : u === 'soon' ? 'bg-amber-bg text-amber' : 'bg-soft text-faint'
}

// ─── Left Sidebar ─────────────────────────────────────────────────────────────

function LeftSidebar() {
  return (
    <aside className="w-[220px] shrink-0 bg-sidebar border-r border-border flex flex-col h-full overflow-y-auto scrollbar-hide">
      <div className="px-5 pt-5 pb-4 shrink-0">
        <span className="text-[15px] font-semibold tracking-tight text-ink">Cambium</span>
        <p className="text-[10px] text-faint tracking-widest uppercase mt-0.5">Research OS</p>
      </div>

      <nav className="px-2.5 mb-1" aria-label="Primary navigation">
        {['Home', 'Discover', 'AI Assistant'].map(item => (
          <button key={item} className="flex items-center gap-2 w-full text-left px-2.5 py-1.5 rounded text-sm text-muted hover:text-ink hover:bg-soft transition-colors">
            {item}
          </button>
        ))}
      </nav>

      <div className="mx-4 border-t border-border my-1 shrink-0" />

      <nav className="px-2.5 flex-1 overflow-y-auto scrollbar-hide pb-2" aria-label="Section navigation">
        {NAV_GROUPS.map(group => (
          <div key={group.label} className="mb-1">
            <p className="px-2.5 pt-3 pb-1 text-[10px] font-semibold text-faint uppercase tracking-widest">
              {group.label}
            </p>
            {group.items.map(item => {
              const isActive = group.active === item
              return (
                <button
                  key={item}
                  className={cn(
                    'flex items-center gap-2 w-full text-left px-2.5 py-1.5 rounded text-sm transition-colors',
                    isActive ? 'text-ink font-medium bg-sidebar-active' : 'text-muted hover:text-ink hover:bg-soft'
                  )}
                >
                  {isActive ? <IconDot className="bg-accent" /> : <span className="w-1.5 shrink-0" />}
                  {item}
                </button>
              )
            })}
          </div>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-border shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-accent-light flex items-center justify-center shrink-0">
            <span className="text-[11px] font-semibold text-accent">DR</span>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-ink truncate">Dr. Rania Hassan</p>
            <p className="text-[11px] text-faint truncate">Medical Imaging · PhD</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

// ─── Opportunity Card ─────────────────────────────────────────────────────────

function OpportunityCard({
  opp, saved, onSave, onToast, onView,
}: {
  opp: Opportunity; saved: boolean
  onSave: (id: string) => void; onToast: (msg: string) => void; onView: (id: string) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const u = urgencyLevel(opp.daysLeft)

  const handleSave = () => {
    onSave(opp.id)
    if (!saved) onToast('Saved to your opportunities.')
  }

  if (dismissed) return null

  return (
    <article className="bg-surface border border-border rounded-md p-5 transition-shadow duration-150 hover:shadow-[0_2px_16px_rgba(30,30,28,0.08)]">
      {/* Kind + match score */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className="text-[11px] font-medium text-muted uppercase tracking-widest pt-0.5">{opp.kind}</span>
        {opp.matchScore && (
          <div className="flex items-center gap-1.5 bg-accent-light px-2.5 py-1 rounded shrink-0">
            <span className="text-xs font-bold text-accent">{opp.matchScore}%</span>
            <span className="text-[10px] font-medium text-accent uppercase tracking-wide">match</span>
          </div>
        )}
      </div>

      {/* Title + org */}
      <h3 className="text-[17px] font-semibold text-ink leading-snug mb-0.5">{opp.title}</h3>
      <p className="text-sm text-muted mb-4">{opp.org}</p>

      {/* Metadata */}
      <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1.5 mb-3 text-sm">
        <div className="flex items-baseline gap-2">
          <span className={cn('font-medium', deadlineTextClass(opp.daysLeft))}>{opp.deadline}</span>
          <span className={cn(
            'text-[11px] font-semibold px-1.5 py-0.5 rounded',
            u === 'urgent' ? 'bg-urgent-bg text-urgent' : u === 'soon' ? 'bg-amber-bg text-amber' : 'bg-soft text-faint'
          )}>
            {opp.daysLeft} days left
          </span>
        </div>
        {opp.funding && <span className="text-ink2">{opp.funding}</span>}
        {opp.eligibility && <span className="text-muted">{opp.eligibility}</span>}
        {opp.location && <span className="text-faint text-xs">{opp.location}</span>}
      </div>

      {/* Match reason */}
      {opp.matchReason && (
        <p className="text-[13px] text-muted italic border-l-2 border-accent-light pl-3 mb-3 leading-relaxed">
          {opp.matchReason}
        </p>
      )}

      {/* Research areas */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 mb-4">
        {opp.areas.map(area => (
          <span key={area} className="text-xs text-faint">{area}</span>
        ))}
      </div>

      {/* Why this matches */}
      {opp.matchPoints && (
        <div className="mb-4">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 text-xs font-medium text-accent hover:text-accent2 transition-colors"
            aria-expanded={expanded}
          >
            <IconChevron dir={expanded ? 'up' : 'down'} />
            Why this matches
          </button>
          {expanded && (
            <ul className="mt-2.5 space-y-1.5 pl-3 border-l-2 border-accent-light">
              {opp.matchPoints.map((point, i) => (
                <li key={i} className="text-xs text-muted leading-relaxed">{point}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-3.5 border-t border-soft">
        <button
          onClick={() => onView(opp.id)}
          className="text-sm font-medium text-surface bg-ink2 hover:bg-ink px-4 py-2 rounded transition-colors"
        >
          {opp.kind === 'Conference' || opp.kind === 'Call for Papers' ? 'View details' : 'View opportunity'}
        </button>
        <button
          onClick={handleSave}
          className={cn(
            'flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded transition-colors',
            saved ? 'text-accent bg-accent-light' : 'text-muted hover:text-ink hover:bg-soft'
          )}
        >
          <IconBookmark filled={saved} />
          {saved ? 'Saved' : 'Save'}
        </button>
        <button className="text-xs text-faint hover:text-muted transition-colors ml-1">Find similar</button>
        <button
          onClick={() => setDismissed(true)}
          className="ml-auto text-xs text-faint hover:text-muted transition-colors"
        >
          Dismiss
        </button>
      </div>
    </article>
  )
}

// ─── Compact Row ──────────────────────────────────────────────────────────────

function CompactRow({
  opp, saved, onSave, onToast, onView,
}: {
  opp: Opportunity; saved: boolean
  onSave: (id: string) => void; onToast: (msg: string) => void; onView: (id: string) => void
}) {
  const handleSave = () => {
    onSave(opp.id)
    if (!saved) onToast('Saved to your opportunities.')
  }

  return (
    <div
      onClick={() => onView(opp.id)}
      className="flex items-center gap-4 py-3 border-b border-soft group hover:bg-surface rounded-sm -mx-2 px-2 transition-colors cursor-pointer"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2.5 mb-0.5">
          <h4 className="text-sm font-medium text-ink truncate group-hover:text-accent transition-colors">{opp.title}</h4>
          {opp.matchScore && (
            <span className="text-[11px] font-semibold text-accent shrink-0 opacity-70">{opp.matchScore}%</span>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-faint">
          <span className="truncate max-w-[200px]">{opp.org}</span>
          <span>·</span>
          <span className="uppercase tracking-wide text-[10px]">{opp.kind}</span>
          {opp.areas[0] && (
            <>
              <span className="hidden md:inline">·</span>
              <span className="hidden md:inline">{opp.areas[0]}</span>
            </>
          )}
        </div>
      </div>

      <div className="text-right shrink-0 hidden lg:block min-w-[90px]">
        <p className={cn('text-xs font-medium', deadlineTextClass(opp.daysLeft))}>{opp.deadline}</p>
        <p className={cn('text-[11px]', deadlineDimClass(opp.daysLeft))}>{opp.daysLeft}d left</p>
      </div>

      <button
        onClick={e => { e.stopPropagation(); handleSave() }}
        className={cn(
          'flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded transition-all shrink-0',
          saved
            ? 'text-accent bg-accent-light'
            : 'text-faint hover:text-muted hover:bg-soft opacity-0 group-hover:opacity-100'
        )}
        aria-label={saved ? 'Unsave opportunity' : 'Save opportunity'}
      >
        <IconBookmark filled={saved} />
        {saved ? 'Saved' : 'Save'}
      </button>
    </div>
  )
}

// ─── Opportunity Detail Panel ─────────────────────────────────────────────────

function DetailPanel({
  opp, saved, tracked, onSave, onTrack, onToast, onClose,
}: {
  opp: Opportunity; saved: boolean; tracked: TrackStatus | null
  onSave: (id: string) => void; onTrack: (id: string, status: TrackStatus) => void
  onToast: (msg: string) => void; onClose: () => void
}) {
  const [showTrackMenu, setShowTrackMenu] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const handleSave = () => {
    onSave(opp.id)
    if (!saved) onToast('Saved to your opportunities.')
  }

  const handleTrack = (status: TrackStatus) => {
    onTrack(opp.id, status)
    setShowTrackMenu(false)
    onToast('Added to your application tracker.')
  }

  const related = ALL_OPPS.filter(o => opp.relatedIds?.includes(o.id))
  const u = urgencyLevel(opp.daysLeft)

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/20 z-30 backdrop-blur-[1px]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className="fixed top-0 right-0 bottom-0 w-[560px] bg-surface border-l border-border z-40 flex flex-col shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-label={opp.title}
        style={{ animation: 'slideInRight 260ms cubic-bezier(0.22,1,0.36,1)' }}
      >
        {/* Panel header */}
        <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-4 border-b border-border shrink-0">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-medium text-muted uppercase tracking-widest">{opp.kind}</span>
              {opp.matchScore && (
                <span className="flex items-center gap-1 bg-accent-light px-2 py-0.5 rounded text-xs font-bold text-accent">
                  {opp.matchScore}% match
                </span>
              )}
            </div>
            <h2 className="text-[20px] font-semibold text-ink leading-snug">{opp.title}</h2>
            <p className="text-sm text-muted mt-0.5">{opp.org}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-faint hover:text-ink hover:bg-soft rounded transition-colors mt-0.5 shrink-0"
            aria-label="Close panel"
          >
            <IconX size={16} />
          </button>
        </div>

        {/* Panel body */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="px-6 py-5 space-y-7">

            {/* Key info grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-bg rounded-md p-3">
                <p className="text-[10px] font-semibold text-faint uppercase tracking-widest mb-1">Deadline</p>
                <p className={cn('text-sm font-semibold', deadlineTextClass(opp.daysLeft))}>{opp.deadline}</p>
                <span className={cn('text-[11px] font-medium px-1.5 py-0.5 rounded mt-1 inline-block', deadlineBgClass(opp.daysLeft))}>
                  {opp.daysLeft} days left
                </span>
              </div>
              {opp.funding && (
                <div className="bg-bg rounded-md p-3">
                  <p className="text-[10px] font-semibold text-faint uppercase tracking-widest mb-1">Funding</p>
                  <p className="text-sm font-semibold text-ink">{opp.funding}</p>
                </div>
              )}
              {opp.eligibility && (
                <div className="bg-bg rounded-md p-3">
                  <p className="text-[10px] font-semibold text-faint uppercase tracking-widest mb-1">Eligibility</p>
                  <p className="text-sm text-ink">{opp.eligibility}</p>
                </div>
              )}
              {opp.location && (
                <div className="bg-bg rounded-md p-3">
                  <p className="text-[10px] font-semibold text-faint uppercase tracking-widest mb-1">Location</p>
                  <p className="text-sm text-ink">{opp.location}</p>
                </div>
              )}
            </div>

            {/* Research areas */}
            <div>
              <p className="text-[11px] font-semibold text-faint uppercase tracking-widest mb-2.5">Research areas</p>
              <div className="flex flex-wrap gap-2">
                {opp.areas.map(area => (
                  <span key={area} className="text-xs font-medium text-accent bg-accent-light px-2.5 py-1 rounded">{area}</span>
                ))}
              </div>
            </div>

            {/* Why Cambium recommends this */}
            {opp.matchPoints && (
              <div className="bg-accent-light/50 rounded-md p-4 border border-accent-light">
                <p className="text-[11px] font-semibold text-accent uppercase tracking-widest mb-3">Why Cambium recommends this</p>
                {opp.matchReason && (
                  <p className="text-sm text-ink2 italic mb-3 leading-relaxed">{opp.matchReason}</p>
                )}
                <ul className="space-y-2">
                  {opp.matchPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="w-4 h-4 rounded-full bg-accent flex items-center justify-center shrink-0 mt-0.5">
                        <IconCheck />
                      </span>
                      <span className="text-xs text-ink2 leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Overview */}
            {opp.overview && (
              <div>
                <p className="text-[11px] font-semibold text-faint uppercase tracking-widest mb-2.5">Overview</p>
                <p className="text-sm text-muted leading-relaxed">{opp.overview}</p>
              </div>
            )}

            {/* Requirements */}
            {opp.requirements && (
              <div>
                <p className="text-[11px] font-semibold text-faint uppercase tracking-widest mb-2.5">Requirements</p>
                <ul className="space-y-2">
                  {opp.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="w-1 h-1 rounded-full bg-border mt-2 shrink-0" />
                      <span className="text-sm text-muted leading-relaxed">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Timeline */}
            {opp.timeline && (
              <div>
                <p className="text-[11px] font-semibold text-faint uppercase tracking-widest mb-3">Timeline</p>
                <div className="space-y-3">
                  {opp.timeline.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <span className="w-2 h-2 rounded-full bg-border mt-1 shrink-0" />
                        {i < opp.timeline!.length - 1 && <span className="w-px flex-1 bg-border min-h-[20px] mt-1" />}
                      </div>
                      <div className="pb-2">
                        <p className="text-xs font-semibold text-ink2">{item.date}</p>
                        <p className="text-xs text-muted">{item.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Application process */}
            {opp.applicationProcess && (
              <div>
                <p className="text-[11px] font-semibold text-faint uppercase tracking-widest mb-2.5">Application process</p>
                <ol className="space-y-2">
                  {opp.applicationProcess.map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-[11px] font-bold text-faint w-4 shrink-0 mt-0.5">{i + 1}</span>
                      <span className="text-sm text-muted leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Official source */}
            {opp.officialSource && (
              <div className="bg-bg rounded-md px-4 py-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold text-faint uppercase tracking-widest mb-0.5">Official source</p>
                  <p className="text-xs text-ink2 font-medium">{opp.officialSource}</p>
                </div>
                <button className="flex items-center gap-1.5 text-xs font-medium text-accent hover:text-accent2 transition-colors shrink-0">
                  Open <IconExternal />
                </button>
              </div>
            )}

            {/* Related opportunities */}
            {related.length > 0 && (
              <div>
                <p className="text-[11px] font-semibold text-faint uppercase tracking-widest mb-3">Related opportunities</p>
                <div className="space-y-2">
                  {related.map(rel => (
                    <div key={rel.id} className="flex items-center gap-3 p-3 bg-bg rounded-md hover:bg-soft transition-colors cursor-pointer group">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-ink group-hover:text-accent transition-colors truncate">{rel.title}</p>
                        <p className="text-[11px] text-faint">{rel.org} · {rel.kind}</p>
                      </div>
                      {rel.matchScore && <span className="text-[11px] font-semibold text-accent shrink-0">{rel.matchScore}%</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Panel footer actions */}
        <div className="px-6 py-4 border-t border-border bg-bg shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className={cn(
                'flex items-center gap-1.5 text-sm font-medium px-4 py-2.5 rounded transition-colors',
                saved ? 'text-accent bg-accent-light' : 'text-surface bg-ink2 hover:bg-ink'
              )}
            >
              <IconBookmark filled={saved} />
              {saved ? 'Saved' : 'Save'}
            </button>

            <div className="relative">
              <button
                onClick={() => setShowTrackMenu(!showTrackMenu)}
                className={cn(
                  'flex items-center gap-1.5 text-sm font-medium px-4 py-2.5 rounded transition-colors border',
                  tracked
                    ? 'text-accent border-accent bg-accent-light'
                    : 'text-ink border-border hover:border-ink2'
                )}
              >
                {tracked ? tracked : 'Track application'}
                <IconChevron dir={showTrackMenu ? 'up' : 'down'} />
              </button>
              {showTrackMenu && (
                <div className="absolute bottom-full left-0 mb-1 bg-surface border border-border rounded-md shadow-xl z-10 py-1 min-w-[180px]">
                  {TRACK_STATUSES.map(status => (
                    <button
                      key={status}
                      onClick={() => handleTrack(status)}
                      className={cn(
                        'w-full text-left px-3 py-2 text-xs transition-colors flex items-center gap-2',
                        tracked === status ? 'text-accent font-medium bg-accent-light' : 'text-ink hover:bg-soft'
                      )}
                    >
                      {tracked === status && <IconCheck />}
                      {status}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button className="flex items-center gap-1.5 text-sm text-muted hover:text-ink px-3 py-2.5 rounded hover:bg-soft transition-colors">
              <IconShare /> Share
            </button>

            {opp.officialSource && (
              <button className="flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent2 px-3 py-2.5 rounded hover:bg-accent-light transition-colors ml-auto">
                Open source <IconExternal />
              </button>
            )}
          </div>
        </div>
      </div>

      {showTrackMenu && (
        <div className="fixed inset-0 z-0" onClick={() => setShowTrackMenu(false)} aria-hidden="true" />
      )}
    </>
  )
}

// ─── Filter Drawer ────────────────────────────────────────────────────────────

function FilterDrawer({
  active, onApply, onClose,
}: {
  active: Record<string, Set<string>>; onApply: (filters: Record<string, Set<string>>) => void; onClose: () => void
}) {
  const [local, setLocal] = useState<Record<string, Set<string>>>(() => {
    const copy: Record<string, Set<string>> = {}
    for (const k in active) copy[k] = new Set(active[k])
    return copy
  })

  const toggle = (section: string, option: string) => {
    setLocal(prev => {
      const next = { ...prev, [section]: new Set(prev[section] || []) }
      if (next[section].has(option)) next[section].delete(option)
      else next[section].add(option)
      return next
    })
  }

  const totalActive = Object.values(local).reduce((sum, s) => sum + s.size, 0)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <>
      <div className="fixed inset-0 bg-ink/20 z-30 backdrop-blur-[1px]" onClick={onClose} aria-hidden="true" />
      <div
        className="fixed top-0 right-0 bottom-0 w-[420px] bg-surface border-l border-border z-40 flex flex-col shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label="Filter opportunities"
        style={{ animation: 'slideInRight 240ms cubic-bezier(0.22,1,0.36,1)' }}
      >
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-border shrink-0">
          <div>
            <h2 className="text-[16px] font-semibold text-ink">Filter opportunities</h2>
            {totalActive > 0 && (
              <p className="text-xs text-muted mt-0.5">{totalActive} filter{totalActive !== 1 ? 's' : ''} active</p>
            )}
          </div>
          <button onClick={onClose} className="p-2 text-faint hover:text-ink hover:bg-soft rounded transition-colors" aria-label="Close filters">
            <IconX size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide px-6 py-4 space-y-6">
          {FILTER_SECTIONS.map(section => (
            <div key={section.label}>
              <p className="text-[11px] font-semibold text-faint uppercase tracking-widest mb-3">{section.label}</p>
              <div className="flex flex-wrap gap-2">
                {section.options.map(opt => {
                  const checked = local[section.label]?.has(opt)
                  return (
                    <button
                      key={opt}
                      onClick={() => toggle(section.label, opt)}
                      className={cn(
                        'flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded border transition-colors',
                        checked
                          ? 'text-accent bg-accent-light border-accent'
                          : 'text-muted border-border hover:border-ink2 hover:text-ink'
                      )}
                    >
                      {checked && <IconCheck />}
                      {opt}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 py-4 border-t border-border bg-bg flex items-center gap-3 shrink-0">
          <button
            onClick={() => { onApply(local); onClose() }}
            className="flex-1 text-sm font-semibold text-surface bg-accent hover:bg-accent2 py-2.5 rounded transition-colors"
          >
            Apply filters {totalActive > 0 && `(${totalActive})`}
          </button>
          <button
            onClick={() => setLocal({})}
            className="text-sm text-muted hover:text-ink px-4 py-2.5 rounded hover:bg-soft transition-colors"
          >
            Clear all
          </button>
        </div>
      </div>
    </>
  )
}

// ─── Right Rail ───────────────────────────────────────────────────────────────

function RightRail({ trackedIds }: { trackedIds: Map<string, TrackStatus> }) {
  const appStatusStyle: Record<AppItem['status'], string> = {
    'In progress': 'text-accent bg-accent-light',
    'Saved': 'text-muted bg-soft',
    'Draft': 'text-amber bg-amber-bg',
  }

  return (
    <aside className="w-80 shrink-0 border-l border-border bg-bg h-full overflow-y-auto scrollbar-hide" aria-label="Intelligence rail">
      <div className="px-5 pt-6 space-y-6 pb-8">

        <section>
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-[13px] font-semibold text-ink">Deadline radar</h2>
            <button className="text-xs text-accent hover:text-accent2 transition-colors">View calendar</button>
          </div>
          <div className="space-y-3">
            {DEADLINES.map((d, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={cn('w-[52px] shrink-0 text-center py-1 rounded', deadlineBgClass(d.daysLeft))}>
                  <p className="text-[10px] font-bold uppercase tracking-wide leading-none py-0.5">{d.date}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-ink leading-snug">{d.title}</p>
                  <p className={cn('text-[11px] mt-0.5', deadlineDimClass(d.daysLeft))}>{d.daysLeft} days</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="border-t border-soft" />

        <section>
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-[13px] font-semibold text-ink">Your applications</h2>
            <button className="text-xs text-accent hover:text-accent2 transition-colors">View all</button>
          </div>
          <div className="space-y-2.5">
            {APP_ITEMS.map(app => {
              const live = trackedIds.get(app.id)
              return (
                <div key={app.id} className="flex items-center gap-2">
                  <p className="text-xs font-medium text-ink flex-1 truncate">{app.title}</p>
                  <span className={cn('text-[11px] font-medium px-2 py-0.5 rounded shrink-0', live ? 'text-accent bg-accent-light' : appStatusStyle[app.status])}>
                    {live ?? app.status}
                  </span>
                </div>
              )
            })}
          </div>
        </section>

        <div className="border-t border-soft" />

        <section>
          <h2 className="text-[13px] font-semibold text-ink mb-4">Research opportunity signals</h2>
          <ul className="space-y-3">
            {SIGNALS.map((signal, i) => (
              <li key={i} className="flex gap-2.5">
                <IconDot className="bg-accent mt-[5px]" />
                <p className="text-xs text-muted leading-relaxed">{signal}</p>
              </li>
            ))}
          </ul>
          <p className="text-[11px] text-faint mt-3.5 italic leading-relaxed">
            Sample data — signals update as Cambium learns your research profile.
          </p>
        </section>

        <div className="border-t border-soft" />

        <section>
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-[13px] font-semibold text-ink">Saved searches</h2>
            <button className="text-xs text-accent hover:text-accent2 transition-colors">Manage</button>
          </div>
          <div className="space-y-1">
            {SAVED_SEARCHES.map((s, i) => (
              <div key={i} className="flex items-center gap-2 py-2 group cursor-pointer rounded hover:bg-soft -mx-1.5 px-1.5 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-ink group-hover:text-accent transition-colors">{s.label}</p>
                  <p className="text-[11px] text-faint">Updated {s.updated}</p>
                </div>
                {s.newCount > 0 && (
                  <span className="text-[11px] font-semibold text-accent bg-accent-light px-1.5 py-0.5 rounded shrink-0">
                    +{s.newCount}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

      </div>
    </aside>
  )
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3200)
    return () => clearTimeout(t)
  }, [onDismiss])

  return (
    <div className="animate-fade-in fixed bottom-6 right-6 bg-ink text-surface text-sm font-medium px-4 py-3 rounded-md shadow-xl flex items-center gap-3 z-50">
      <IconDot className="bg-accent" />
      {message}
      <button onClick={onDismiss} className="text-faint hover:text-surface transition-colors ml-1" aria-label="Dismiss">
        <IconX size={12} />
      </button>
    </div>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('for-you')
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
  const [trackedIds, setTrackedIds] = useState<Map<string, TrackStatus>>(new Map())
  const [searchQuery, setSearchQuery] = useState('')
  const [activeSort, setActiveSort] = useState('Best Match')
  const [showSort, setShowSort] = useState(false)
  const [showFilterDrawer, setShowFilterDrawer] = useState(false)
  const [activeFilters, setActiveFilters] = useState<Record<string, Set<string>>>({})
  const [activeOppId, setActiveOppId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; key: number } | null>(null)
  const toastKey = useRef(0)

  const activeOpp = activeOppId ? ALL_OPPS.find(o => o.id === activeOppId) ?? null : null

  const totalFilters = Object.values(activeFilters).reduce((sum, s) => sum + s.size, 0)

  const handleSave = useCallback((id: string) => {
    setSavedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const handleTrack = useCallback((id: string, status: TrackStatus) => {
    setTrackedIds(prev => new Map(prev).set(id, status))
  }, [])

  const handleToast = useCallback((msg: string) => {
    toastKey.current += 1
    setToast({ msg, key: toastKey.current })
  }, [])

  return (
    <div className="flex h-screen overflow-hidden bg-bg font-sans text-ink">
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>

      <LeftSidebar />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto scrollbar-hide" role="main">
        <div className="max-w-[900px] mx-auto px-8">

          {/* Header */}
          <div className="pt-6 pb-4">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-[10px] text-faint uppercase tracking-widest mb-2.5 font-medium">Opportunities</p>
                <h1 className="text-[32px] font-semibold tracking-tight text-ink leading-none mb-2">Opportunity Hub</h1>
                <p className="text-sm text-muted">Find research opportunities worth pursuing.</p>
              </div>
              <div className="flex items-center gap-1.5 pt-1 shrink-0">
                <button className="text-sm text-muted hover:text-ink transition-colors px-3 py-2 rounded hover:bg-soft">Save Search</button>
                <button className="text-sm text-muted hover:text-ink transition-colors px-3 py-2 rounded hover:bg-soft">My Applications</button>
                <button className="p-2 text-muted hover:text-ink transition-colors rounded hover:bg-soft" aria-label="Notifications">
                  <IconBell />
                </button>
                <div className="w-8 h-8 rounded-full bg-accent-light flex items-center justify-center ml-1">
                  <span className="text-[11px] font-bold text-accent">DR</span>
                </div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-5">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-faint pointer-events-none">
              <IconSearch />
            </div>
            <input
              type="search"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search grants, fellowships, conferences, scholarships..."
              className="w-full pl-11 pr-4 py-3.5 bg-surface border border-border rounded-md text-sm text-ink placeholder:text-faint focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
              aria-label="Search opportunities"
            />
          </div>

          {/* Type tabs */}
          <div className="flex items-center border-b border-border overflow-x-auto scrollbar-hide mb-7 -mx-1 px-1" role="tablist" aria-label="Opportunity type">
            {TABS.map(tab => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'shrink-0 text-sm px-4 py-2.5 border-b-2 transition-all duration-150 whitespace-nowrap',
                  activeTab === tab.id
                    ? 'border-accent text-ink font-medium'
                    : 'border-transparent text-muted hover:text-ink hover:border-border'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Personalized hero */}
          <div className="bg-surface border border-border rounded-md p-5 mb-8">
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1">
                <p className="text-[10px] font-semibold text-accent uppercase tracking-widest mb-2">Matched to your research</p>
                <h2 className="text-[18px] font-semibold text-ink mb-1">Opportunities for your research</h2>
                <p className="text-sm text-muted mb-4">Based on your academic identity, research interests and current work.</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {['Medical Imaging', 'Computer Vision', 'Machine Learning', 'Deep Learning'].map(tag => (
                    <span key={tag} className="text-xs font-medium text-accent bg-accent-light px-2.5 py-1 rounded">{tag}</span>
                  ))}
                </div>
                <div className="flex items-center gap-4">
                  <button className="text-sm font-medium text-surface bg-accent hover:bg-accent2 px-4 py-2 rounded transition-colors">
                    Explore matches
                  </button>
                  <button className="text-sm text-muted hover:text-ink transition-colors">
                    Adjust research preferences
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-faint hidden md:block shrink-0 pt-1">Updated recently</p>
            </div>
          </div>

          {/* Strong Matches */}
          <section className="mb-9" aria-labelledby="strong-matches-heading">
            <div className="mb-4">
              <h2 id="strong-matches-heading" className="text-lg font-semibold text-ink mb-0.5">Strong matches</h2>
              <p className="text-sm text-muted">Opportunities that closely align with your research.</p>
            </div>
            <div className="space-y-3">
              {STRONG_MATCHES.map(opp => (
                <OpportunityCard
                  key={opp.id}
                  opp={opp}
                  saved={savedIds.has(opp.id)}
                  onSave={handleSave}
                  onToast={handleToast}
                  onView={setActiveOppId}
                />
              ))}
            </div>
          </section>

          {/* Explore */}
          <section className="mb-14" aria-labelledby="explore-heading">
            <div className="mb-4">
              <h2 id="explore-heading" className="text-lg font-semibold text-ink mb-0.5">Explore opportunities</h2>
              <p className="text-sm text-muted">Discover grants, fellowships, conferences and calls across your field.</p>
            </div>

            {/* Filter bar */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {(['Type', 'Deadline', 'Eligibility', 'Funding'] as const).map(label => (
                <button key={label} className="flex items-center gap-1.5 text-xs font-medium text-muted border border-border px-3 py-1.5 rounded hover:border-ink2 hover:text-ink transition-colors">
                  {label} <IconChevron size={10} />
                </button>
              ))}
              <button
                onClick={() => setShowFilterDrawer(true)}
                className={cn(
                  'flex items-center gap-1.5 text-xs font-medium border px-3 py-1.5 rounded transition-colors',
                  totalFilters > 0
                    ? 'text-accent border-accent bg-accent-light'
                    : 'text-muted border-border hover:border-ink2 hover:text-ink'
                )}
              >
                <IconFilter />
                More filters
                {totalFilters > 0 && <span className="ml-0.5 font-bold">({totalFilters})</span>}
              </button>
              {totalFilters > 0 && (
                <button
                  onClick={() => setActiveFilters({})}
                  className="text-xs text-faint hover:text-muted transition-colors"
                >
                  Clear all
                </button>
              )}

              <div className="ml-auto relative">
                <button
                  onClick={() => setShowSort(!showSort)}
                  className="flex items-center gap-1.5 text-xs font-medium text-ink2 border border-border px-3 py-1.5 rounded hover:border-ink2 transition-colors"
                  aria-haspopup="listbox"
                  aria-expanded={showSort}
                >
                  {activeSort} <IconChevron dir={showSort ? 'up' : 'down'} size={10} />
                </button>
                {showSort && (
                  <div className="absolute right-0 top-full mt-1 bg-surface border border-border rounded-md shadow-lg z-20 py-1 min-w-[164px]" role="listbox">
                    {SORT_OPTIONS.map(opt => (
                      <button
                        key={opt}
                        role="option"
                        aria-selected={activeSort === opt}
                        onClick={() => { setActiveSort(opt); setShowSort(false) }}
                        className={cn(
                          'w-full text-left px-3 py-2 text-xs transition-colors',
                          activeSort === opt ? 'text-accent font-medium bg-accent-light' : 'text-ink hover:bg-soft'
                        )}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <p className="text-xs text-faint mb-3">{EXPLORE_OPPS.length} opportunities</p>

            <div>
              {EXPLORE_OPPS.map(opp => (
                <CompactRow
                  key={opp.id}
                  opp={opp}
                  saved={savedIds.has(opp.id)}
                  onSave={handleSave}
                  onToast={handleToast}
                  onView={setActiveOppId}
                />
              ))}
            </div>
          </section>

        </div>
      </main>

      <RightRail trackedIds={trackedIds} />

      {/* Sort backdrop */}
      {showSort && (
        <div className="fixed inset-0 z-10" onClick={() => setShowSort(false)} aria-hidden="true" />
      )}

      {/* Filter drawer */}
      {showFilterDrawer && (
        <FilterDrawer
          active={activeFilters}
          onApply={setActiveFilters}
          onClose={() => setShowFilterDrawer(false)}
        />
      )}

      {/* Opportunity detail panel */}
      {activeOpp && (
        <DetailPanel
          opp={activeOpp}
          saved={savedIds.has(activeOpp.id)}
          tracked={trackedIds.get(activeOpp.id) ?? null}
          onSave={handleSave}
          onTrack={handleTrack}
          onToast={handleToast}
          onClose={() => setActiveOppId(null)}
        />
      )}

      {/* Toast */}
      {toast && (
        <Toast
          key={toast.key}
          message={toast.msg}
          onDismiss={() => setToast(null)}
        />
      )}
    </div>
  )
}
