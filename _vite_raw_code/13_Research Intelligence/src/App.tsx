import { useState, useRef, useEffect, KeyboardEvent } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

type Mode = 'Explore' | 'Understand' | 'Compare' | 'Synthesize' | 'Critique' | 'Discover' | 'Plan' | 'Write'
type ContextOption = 'Entire Research World' | 'Current Workspace' | 'Current Project' | 'Literature Review' | 'Selected Papers' | 'Notes' | 'Experiments' | 'Publications' | 'Opportunities' | 'Researchers'
type RightTab = 'Sources' | 'Insights' | 'Graph'

// ─── Data ─────────────────────────────────────────────────────────────────────

const MODES: { name: Mode; desc: string }[] = [
  { name: 'Explore', desc: 'Discover related concepts and research' },
  { name: 'Understand', desc: 'Explain a difficult paper or concept' },
  { name: 'Compare', desc: 'Compare methodologies, findings, or papers' },
  { name: 'Synthesize', desc: 'Combine evidence across literature' },
  { name: 'Critique', desc: 'Identify weaknesses, limitations, and assumptions' },
  { name: 'Discover', desc: 'Find papers, researchers, datasets, and opportunities' },
  { name: 'Plan', desc: 'Turn research findings into next steps' },
  { name: 'Write', desc: 'Structure research writing using existing context' },
]

const QUICK_ACTIONS = [
  'Summarize literature', 'Find research gaps', 'Compare papers', 'Build literature map',
  'Find related papers', 'Analyze methodology', 'Generate research questions',
  'Find conflicting findings', 'Find datasets', 'Find collaborators',
  'Find relevant opportunities', 'Suggest journals', 'Suggest conferences',
]

const CONTEXT_OPTIONS: ContextOption[] = [
  'Entire Research World', 'Current Workspace', 'Current Project',
  'Literature Review', 'Selected Papers', 'Notes', 'Experiments',
  'Publications', 'Opportunities', 'Researchers',
]

const SUGGESTED_PROMPTS = [
  'Which papers in my workspace disagree about federated learning?',
  'What are the major research gaps in low-resource medical imaging?',
  'Find papers related to my current segmentation project.',
  'Which conferences would be relevant to this research?',
]

const HISTORY = [
  'Research gaps in medical imaging',
  'Compare federated learning methods',
  'Find papers on multimodal clinical AI',
  'Potential MICCAI research directions',
  'Literature synthesis — segmentation',
]

const ANSWER_GAPS = [
  {
    num: '01',
    title: 'Limited cross-domain validation',
    body: 'Several studies evaluate models on a single dataset, making generalization difficult to establish.',
    sources: ['Chen et al., 2024', 'Park & Kim, 2025', 'Nguyen et al., 2023'],
    label: 'ANALYSIS',
  },
  {
    num: '02',
    title: 'Limited evaluation under label scarcity',
    body: 'Most approaches assume more labeled data than is available in low-resource clinical environments.',
    sources: ['Rodriguez et al., 2025', 'Liu et al., 2024'],
    label: 'POTENTIAL GAP',
  },
  {
    num: '03',
    title: 'Privacy and distributed learning remain underexplored',
    body: 'Federated approaches appear promising, but evaluation across heterogeneous clinical datasets remains limited.',
    sources: ['Patel & Singh, 2025', 'Zhao et al., 2024'],
    label: 'POTENTIAL GAP',
  },
]

const SOURCES_LIST = [
  {
    n: '[1]',
    title: 'Foundation Models for Medical Image Understanding',
    authors: 'Chen, M. et al.',
    year: '2026',
    reason: 'Discusses segmentation under limited annotation budgets.',
    type: 'Paper',
  },
  {
    n: '[2]',
    title: 'Federated Learning for Clinical Imaging',
    authors: 'Rodriguez, E. et al.',
    year: '2025',
    reason: 'Covers federated evaluation across heterogeneous datasets.',
    type: 'Paper',
  },
  {
    n: '[3]',
    title: 'Low-Resource Medical Image Segmentation',
    authors: 'Park, J. & Kim, S.',
    year: '2025',
    reason: 'Directly matches your current project focus.',
    type: 'Paper',
  },
  {
    n: '[4]',
    title: 'Segmentation notes — Week 12',
    authors: 'Maya Chen',
    year: '2026',
    reason: 'Contains relevant observations from your literature review.',
    type: 'Note',
  },
  {
    n: '[5]',
    title: 'Experiment 02 — nnU-Net baseline',
    authors: 'Maya Chen',
    year: '2026',
    reason: 'Baseline segmentation experiment in your current workspace.',
    type: 'Experiment',
  },
]

const INSIGHTS_LIST = [
  {
    tag: 'Emerging topic',
    title: 'Multimodal medical AI',
    body: 'Interest has increased across several papers connected to your research.',
    type: 'topic',
  },
  {
    tag: 'Potential gap',
    title: 'Federated evaluation under severe label scarcity',
    body: 'Few studies compare federated approaches under extreme annotation constraints.',
    type: 'gap',
  },
  {
    tag: 'Related researcher',
    title: 'Dr. Elena Rodriguez',
    body: 'Works on federated learning and clinical imaging datasets.',
    type: 'researcher',
  },
  {
    tag: 'Relevant opportunity',
    title: 'Early Career Research Fellowship',
    body: 'Deadline in 6 weeks. Research focus aligns with your current project.',
    type: 'opportunity',
  },
]

const NAV_SECTIONS = [
  {
    label: 'HOME',
    items: [
      { icon: GridIcon, label: 'Discover' },
      { icon: BrainIcon, label: 'AI Assistant', active: true },
    ],
  },
  {
    label: 'RESEARCH',
    items: [
      { icon: BoxIcon, label: 'Workspace' },
      { icon: BookIcon, label: 'Papers' },
      { icon: FileTextIcon, label: 'Publications' },
      { icon: FolderIcon, label: 'Projects' },
      { icon: NoteIcon, label: 'Notes' },
    ],
  },
  {
    label: 'COMMUNITY',
    items: [
      { icon: ActivityIcon, label: 'Feed' },
      { icon: UsersIcon, label: 'Researchers' },
      { icon: LabIcon, label: 'Labs' },
      { icon: LinkIcon, label: 'Collaborations' },
      { icon: MessageIcon, label: 'Messages' },
    ],
  },
  {
    label: 'OPPORTUNITIES',
    items: [
      { icon: AwardIcon, label: 'Grants' },
      { icon: CalendarIcon, label: 'Conferences' },
      { icon: JournalIcon, label: 'Journals' },
    ],
  },
]

// ─── Icon primitives ──────────────────────────────────────────────────────────

function Icon({ d, size = 14 }: { d: string | string[]; size?: number }) {
  const paths = Array.isArray(d) ? d : [d]
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      {paths.map((p, i) => (
        <path key={i} d={p} stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
      ))}
    </svg>
  )
}

function GridIcon() { return <Icon d="M2 2h5v5H2V2zm7 0h5v5H9V2zm0 7h5v5H9V9zM2 9h5v5H2V9z" /> }
function BrainIcon() { return <Icon d={['M8 2C5.8 2 4 3.8 4 6c0 .8.2 1.5.6 2.1C3.7 8.6 3 9.7 3 11c0 1.7 1.3 3 3 3h4c1.7 0 3-1.3 3-3 0-1.3-.7-2.4-1.6-2.9.4-.6.6-1.3.6-2.1C12 3.8 10.2 2 8 2z', 'M8 6v4']} /> }
function BoxIcon() { return <Icon d={['M8 2l5 3v6l-5 3-5-3V5l5-3z', 'M8 5l5 3M8 5v9M3 8l5 3']} /> }
function BookIcon() { return <Icon d={['M4 2h8a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1z', 'M7 2v12']} /> }
function FileTextIcon() { return <Icon d={['M4 2h6l3 3v9a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1z', 'M9 2v4h3', 'M6 8h4M6 11h4']} /> }
function FolderIcon() { return <Icon d="M2 4h4l1.5 2H14a1 1 0 011 1v6a1 1 0 01-1 1H2a1 1 0 01-1-1V5a1 1 0 011-1z" /> }
function NoteIcon() { return <Icon d={['M3 3h10a1 1 0 011 1v8a1 1 0 01-1 1H3a1 1 0 01-1-1V4a1 1 0 011-1z', 'M5 7h6M5 10h4']} /> }
function ActivityIcon() { return <Icon d="M1 8h2l2-5 2 10 2-7 2 4 2-2h2" /> }
function UsersIcon() { return <Icon d={['M5 8a3 3 0 100-6 3 3 0 000 6z', 'M1 14c0-2.2 1.8-4 4-4s4 1.8 4 4', 'M11 6a2.5 2.5 0 110-5 2.5 2.5 0 010 5', 'M15 14c0-1.9-1.3-3.5-3-4']} /> }
function LabIcon() { return <Icon d={['M6 2v5L3 12a1 1 0 00.9 1.5h8.2A1 1 0 0013 12l-3-5V2', 'M5 2h6']} /> }
function LinkIcon() { return <Icon d={['M6 8a3 3 0 004.2.8l2-2a3 3 0 00-4.2-4.2L6.8 3.8', 'M10 8a3 3 0 00-4.2-.8l-2 2a3 3 0 004.2 4.2l1.2-1.2']} /> }
function MessageIcon() { return <Icon d="M2 3h12a1 1 0 011 1v7a1 1 0 01-1 1H5l-3 2V4a1 1 0 011-1z" /> }
function AwardIcon() { return <Icon d={['M8 10a4 4 0 100-8 4 4 0 000 8z', 'M5.8 9.2L5 14l3-2 3 2-.8-4.8']} /> }
function CalendarIcon() { return <Icon d={['M2 4h12a1 1 0 011 1v9a1 1 0 01-1 1H2a1 1 0 01-1-1V5a1 1 0 011-1z', 'M5 2v3M11 2v3M1 8h14']} /> }
function JournalIcon() { return <Icon d={['M3 2h10a1 1 0 011 1v10a1 1 0 01-1 1H3', 'M3 2a1 1 0 00-1 1v10a1 1 0 001 1', 'M6 6h5M6 9h3']} /> }
function SearchIcon({ size = 14 }: { size?: number }) { return <Icon size={size} d={['M7 12a5 5 0 100-10 5 5 0 000 10z', 'M11 11l3 3']} /> }
function ArrowUpIcon() { return <Icon d="M8 12V4M4 8l4-4 4 4" /> }
function ChevronDownIcon() { return <Icon d="M4 6l4 4 4-4" /> }
function ChevronRightIcon() { return <Icon d="M6 4l4 4-4 4" /> }
function PlusIcon() { return <Icon d="M8 3v10M3 8h10" /> }
function CheckIcon() { return <Icon d="M3 8l3.5 3.5 6.5-7" /> }
function SaveIcon() { return <Icon d={['M3 2h8l2 2v10a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z', 'M6 2v5h5']} /> }
function ExternalIcon() { return <Icon d={['M7 3H3a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1V9', 'M9 3h4v4', 'M13 3L7 9']} /> }
function HistoryIcon() { return <Icon d={['M1 8a7 7 0 1013.7-2', 'M1 4v4h4', 'M8 5v3.5l2.5 1.5']} /> }
function SparkleIcon() { return <Icon d={['M8 2v1M8 13v1M2 8h1M13 8h1', 'M4.2 4.2l.7.7M11.1 11.1l.7.7M4.2 11.8l.7-.7M11.1 4.9l.7-.7', 'M8 5.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5z']} /> }

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar() {
  return (
    <aside
      style={{ width: 200, minWidth: 200, backgroundColor: '#F0EDE6', borderRight: '1px solid #DDDAD2', display: 'flex', flexDirection: 'column', height: '100vh', position: 'sticky', top: 0 }}
      role="navigation"
      aria-label="Main navigation"
    >
      <div style={{ padding: '18px 16px 14px', borderBottom: '1px solid #DDDAD2' }}>
        <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 16, letterSpacing: '-0.02em', color: '#1A1A17' }}>Cambium</span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
        {NAV_SECTIONS.map(section => (
          <div key={section.label} style={{ marginBottom: 4 }}>
            <div style={{ padding: '10px 16px 4px', fontSize: 9, fontWeight: 600, letterSpacing: '0.1em', color: '#9A9A8E', textTransform: 'uppercase' }}>
              {section.label}
            </div>
            {section.items.map(item => (
              <button
                key={item.label}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                  padding: '6px 16px', border: 'none', cursor: 'pointer', textAlign: 'left',
                  fontSize: 13, fontWeight: item.active ? 500 : 400,
                  backgroundColor: item.active ? '#E4E0D6' : 'transparent',
                  color: item.active ? '#1A1A17' : '#5A5A52',
                  borderRadius: 4, margin: '1px 0',
                  transition: 'background-color 150ms, color 150ms',
                }}
                onMouseEnter={e => { if (!item.active) { (e.currentTarget as HTMLElement).style.backgroundColor = '#E8E5DC'; (e.currentTarget as HTMLElement).style.color = '#1A1A17' } }}
                onMouseLeave={e => { if (!item.active) { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#5A5A52' } }}
              >
                <span style={{ color: item.active ? '#3D6B4F' : 'currentColor' }}><item.icon /></span>
                {item.label}
                {item.active && <span style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', backgroundColor: '#3D6B4F', flexShrink: 0 }} />}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div style={{ padding: '12px 16px', borderTop: '1px solid #DDDAD2' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: '#3D6B4F', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: '#fff', flexShrink: 0 }}>
            MC
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 500, color: '#1A1A17' }}>Maya Chen</div>
            <div style={{ fontSize: 11, color: '#7A7A72' }}>PhD Researcher</div>
          </div>
        </div>
      </div>
    </aside>
  )
}

// ─── Context Selector ─────────────────────────────────────────────────────────

function ContextSelector({ value, onChange }: { value: ContextOption; onChange: (v: ContextOption) => void }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px',
          backgroundColor: '#EBE8E0', border: '1px solid #D8D4CA', borderRadius: 5,
          fontSize: 12, fontWeight: 500, color: '#3D6B4F', cursor: 'pointer',
          transition: 'background-color 150ms',
        }}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span style={{ color: '#3D6B4F', opacity: 0.7, fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Context:</span>
        <span>{value === 'Current Project' ? 'Current Project — Low-Resource Medical Image Segmentation' : value}</span>
        <ChevronDownIcon />
      </button>
      {open && (
        <div
          style={{
            position: 'absolute', top: 'calc(100% + 4px)', left: 0, zIndex: 50,
            backgroundColor: '#FAFAF7', border: '1px solid #DDDAD2', borderRadius: 6,
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)', minWidth: 240, overflow: 'hidden',
          }}
          role="listbox"
        >
          {CONTEXT_OPTIONS.map(opt => (
            <button
              key={opt}
              role="option"
              aria-selected={opt === value}
              onClick={() => { onChange(opt); setOpen(false) }}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                width: '100%', padding: '7px 12px', border: 'none', textAlign: 'left',
                fontSize: 12.5, cursor: 'pointer',
                backgroundColor: opt === value ? '#E8E5DC' : 'transparent',
                color: opt === value ? '#1A1A17' : '#4A4A44',
                transition: 'background-color 100ms',
              }}
              onMouseEnter={e => { if (opt !== value) (e.currentTarget as HTMLElement).style.backgroundColor = '#F0EDE6' }}
              onMouseLeave={e => { if (opt !== value) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}
            >
              {opt}
              {opt === value && <span style={{ color: '#3D6B4F' }}><CheckIcon /></span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Mode Selector ────────────────────────────────────────────────────────────

function ModePicker({ value, onChange }: { value: Mode; onChange: (v: Mode) => void }) {
  return (
    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
      {MODES.map(m => (
        <button
          key={m.name}
          title={m.desc}
          onClick={() => onChange(m.name)}
          style={{
            padding: '4px 10px', border: `1px solid ${m.name === value ? '#3D6B4F' : '#DDDAD2'}`,
            borderRadius: 20, fontSize: 12, fontWeight: m.name === value ? 500 : 400,
            backgroundColor: m.name === value ? '#3D6B4F' : 'transparent',
            color: m.name === value ? '#fff' : '#5A5A52',
            cursor: 'pointer', transition: 'all 150ms',
          }}
          onMouseEnter={e => { if (m.name !== value) (e.currentTarget as HTMLElement).style.borderColor = '#3D6B4F' }}
          onMouseLeave={e => { if (m.name !== value) (e.currentTarget as HTMLElement).style.borderColor = '#DDDAD2' }}
        >
          {m.name}
        </button>
      ))}
    </div>
  )
}

// ─── Research Answer ──────────────────────────────────────────────────────────

function ResearchAnswer({ onSave }: { onSave: () => void }) {
  const [saved, setSaved] = useState(false)
  const [expanded, setExpanded] = useState<number | null>(null)

  return (
    <div style={{ animation: 'fadeSlideIn 400ms ease both' }}>
      <style>{`@keyframes fadeSlideIn { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: none } }`}</style>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: '#3D6B4F', textTransform: 'uppercase', backgroundColor: '#EAF2EC', padding: '2px 7px', borderRadius: 3 }}>ANALYSIS</span>
            <span style={{ fontSize: 11, color: '#7A7A72' }}>Based on 18 papers in your current literature review</span>
          </div>
          <p style={{ fontSize: 15, fontWeight: 400, color: '#2A2A22', lineHeight: 1.6 }}>
            Three recurring gaps stand out in the literature on <strong>low-resource medical image segmentation</strong>.
          </p>
        </div>
        <button
          onClick={() => { setSaved(true); onSave() }}
          style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px',
            border: '1px solid #DDDAD2', borderRadius: 5, fontSize: 12, cursor: 'pointer',
            backgroundColor: saved ? '#EAF2EC' : 'transparent', color: saved ? '#3D6B4F' : '#5A5A52',
            transition: 'all 200ms', flexShrink: 0, marginLeft: 16,
          }}
        >
          <SaveIcon />{saved ? 'Saved' : 'Save insight'}
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {ANSWER_GAPS.map((gap, i) => (
          <div
            key={i}
            style={{
              border: '1px solid #DDDAD2', borderRadius: 6, overflow: 'hidden',
              backgroundColor: '#FAFAF7', transition: 'border-color 150ms',
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = '#C8C4BA'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = '#DDDAD2'}
          >
            <div
              style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 16px', cursor: 'pointer' }}
              onClick={() => setExpanded(expanded === i ? null : i)}
              role="button"
              aria-expanded={expanded === i}
              tabIndex={0}
              onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => e.key === 'Enter' && setExpanded(expanded === i ? null : i)}
            >
              <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: '#C8C4BA', flexShrink: 0, lineHeight: 1 }}>{gap.num}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 500, color: '#1A1A17' }}>{gap.title}</span>
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '1px 6px', borderRadius: 3, backgroundColor: gap.label === 'ANALYSIS' ? '#EAF2EC' : '#F5F0E8', color: gap.label === 'ANALYSIS' ? '#3D6B4F' : '#8B6914' }}>{gap.label}</span>
                </div>
              </div>
              <span style={{ color: '#9A9A8E', transform: expanded === i ? 'rotate(90deg)' : 'none', transition: 'transform 200ms' }}><ChevronRightIcon /></span>
            </div>
            {expanded === i && (
              <div style={{ padding: '0 16px 16px 48px', borderTop: '1px solid #EDEBE5' }}>
                <p style={{ fontSize: 13.5, color: '#3A3A32', lineHeight: 1.65, marginBottom: 12, marginTop: 12 }}>{gap.body}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 11, color: '#7A7A72', marginRight: 4 }}>Sources:</span>
                  {gap.sources.map((s, j) => (
                    <button key={j} style={{ fontSize: 11.5, padding: '2px 8px', border: '1px solid #DDDAD2', borderRadius: 4, backgroundColor: '#F0EDE6', color: '#3A3A32', cursor: 'pointer', transition: 'background-color 150ms' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = '#E8E5DC'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = '#F0EDE6'}
                    >{s}</button>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                  <ActionBtn icon={<PlusIcon />} label="Add to Workspace" />
                  <ActionBtn icon={<SparkleIcon />} label="Create research question" />
                  <ActionBtn icon={<SaveIcon />} label="Save" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 14, padding: '12px 16px', backgroundColor: '#F0EDE6', borderRadius: 6, border: '1px solid #DDDAD2' }}>
        <p style={{ fontSize: 12, color: '#5A5A52', marginBottom: 10 }}>
          <span style={{ fontWeight: 600, color: '#1A1A17' }}>Suggested next steps</span> based on these gaps:
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <ActionBtn icon={<SearchIcon />} label="Explore related papers" />
          <ActionBtn icon={<SparkleIcon />} label="Generate research questions" />
          <ActionBtn icon={<UsersIcon />} label="Find collaborators" />
          <ActionBtn icon={<AwardIcon />} label="Explore opportunities" />
        </div>
      </div>
    </div>
  )
}

function ActionBtn({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button
      style={{
        display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px',
        border: '1px solid #DDDAD2', borderRadius: 5, fontSize: 12, color: '#4A4A44',
        backgroundColor: '#FAFAF7', cursor: 'pointer', transition: 'all 150ms',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#F0EDE6'; (e.currentTarget as HTMLElement).style.borderColor = '#C8C4BA' }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#FAFAF7'; (e.currentTarget as HTMLElement).style.borderColor = '#DDDAD2' }}
    >
      {icon}{label}
    </button>
  )
}

// ─── Loading skeleton ──────────────────────────────────────────────────────────

function LoadingState() {
  const steps = [
    'Analyzing 18 papers...',
    'Connecting related research...',
    'Identifying research gaps...',
    'Finding supporting evidence...',
  ]
  const [step, setStep] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setStep(s => Math.min(s + 1, steps.length - 1)), 700)
    return () => clearInterval(id)
  })
  return (
    <div style={{ padding: '32px 0' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {steps.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, opacity: i <= step ? 1 : 0.25, transition: 'opacity 400ms' }}>
            <div style={{ width: 20, height: 20, borderRadius: '50%', border: `1.5px solid ${i < step ? '#3D6B4F' : '#DDDAD2'}`, backgroundColor: i < step ? '#3D6B4F' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 400ms', flexShrink: 0 }}>
              {i < step && <span style={{ color: '#fff' }}><CheckIcon /></span>}
              {i === step && <span style={{ display: 'block', width: 6, height: 6, borderRadius: '50%', backgroundColor: '#3D6B4F', animation: 'pulse 1s infinite' }} />}
            </div>
            <span style={{ fontSize: 13, color: i <= step ? '#2A2A22' : '#9A9A8E' }}>{s}</span>
          </div>
        ))}
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
      {[0,1,2].map(i => (
        <div key={i} style={{ height: 14, backgroundColor: '#E8E5DC', borderRadius: 4, marginTop: 20, width: i === 0 ? '90%' : i === 1 ? '75%' : '60%', animation: 'shimmer 1.5s infinite', backgroundImage: 'linear-gradient(90deg, #E8E5DC 0%, #F0EDE6 50%, #E8E5DC 100%)', backgroundSize: '200% 100%' }} />
      ))}
      <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
    </div>
  )
}

// ─── Right rail ───────────────────────────────────────────────────────────────

function SourcesPanel() {
  const [active, setActive] = useState<number | null>(null)
  return (
    <div>
      <p style={{ fontSize: 11, color: '#7A7A72', marginBottom: 12 }}>
        <span style={{ fontWeight: 600, color: '#3A3A32' }}>5 sources</span> used in this answer
      </p>
      {SOURCES_LIST.map((s, i) => (
        <div
          key={i}
          style={{
            padding: '10px 12px', borderRadius: 6, border: '1px solid transparent',
            marginBottom: 4, cursor: 'pointer', backgroundColor: active === i ? '#F0EDE6' : 'transparent',
            transition: 'all 150ms',
          }}
          onClick={() => setActive(active === i ? null : i)}
          onMouseEnter={e => { if (active !== i) (e.currentTarget as HTMLElement).style.backgroundColor = '#F5F2EB' }}
          onMouseLeave={e => { if (active !== i) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#3D6B4F', backgroundColor: '#EAF2EC', padding: '1px 5px', borderRadius: 3, flexShrink: 0, marginTop: 1 }}>{s.n}</span>
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 500, color: '#1A1A17', lineHeight: 1.4, marginBottom: 2 }}>{s.title}</div>
              <div style={{ fontSize: 11, color: '#7A7A72' }}>{s.authors} · {s.year} · <span style={{ color: '#3D6B4F' }}>{s.type}</span></div>
              {active === i && (
                <div style={{ marginTop: 8 }}>
                  <p style={{ fontSize: 11.5, color: '#5A5A52', lineHeight: 1.5, fontStyle: 'italic', borderLeft: '2px solid #3D6B4F', paddingLeft: 8 }}>{s.reason}</p>
                  <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                    <button style={{ fontSize: 11, padding: '3px 8px', border: '1px solid #DDDAD2', borderRadius: 4, cursor: 'pointer', backgroundColor: '#FAFAF7', color: '#4A4A44' }}>Open</button>
                    <button style={{ fontSize: 11, padding: '3px 8px', border: '1px solid #DDDAD2', borderRadius: 4, cursor: 'pointer', backgroundColor: '#FAFAF7', color: '#4A4A44' }}>Cite</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function InsightsPanel() {
  const tagColors: Record<string, { bg: string; color: string }> = {
    'Emerging topic': { bg: '#EAF2EC', color: '#3D6B4F' },
    'Potential gap': { bg: '#F5F0E8', color: '#8B6914' },
    'Related researcher': { bg: '#EBF0F8', color: '#2E5CA8' },
    'Relevant opportunity': { bg: '#F2EBF5', color: '#7B3DAE' },
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {INSIGHTS_LIST.map((ins, i) => {
        const tc = tagColors[ins.tag] || { bg: '#EDEBE5', color: '#5A5A52' }
        return (
          <div key={i} style={{ padding: '12px', borderRadius: 6, border: '1px solid #DDDAD2', backgroundColor: '#FAFAF7', transition: 'border-color 150ms' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = '#C8C4BA'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = '#DDDAD2'}
          >
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '1px 6px', borderRadius: 3, backgroundColor: tc.bg, color: tc.color }}>{ins.tag}</span>
            <div style={{ fontSize: 13, fontWeight: 500, color: '#1A1A17', marginTop: 6, marginBottom: 4 }}>{ins.title}</div>
            <p style={{ fontSize: 12, color: '#5A5A52', lineHeight: 1.5 }}>{ins.body}</p>
            <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
              <button style={{ fontSize: 11, padding: '3px 8px', border: '1px solid #DDDAD2', borderRadius: 4, cursor: 'pointer', backgroundColor: 'transparent', color: '#4A4A44' }}>Save</button>
              <button style={{ fontSize: 11, padding: '3px 8px', border: '1px solid #DDDAD2', borderRadius: 4, cursor: 'pointer', backgroundColor: 'transparent', color: '#4A4A44' }}>Explore</button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function ResearchGraph() {
  const nodes = [
    { label: 'Research Question', x: 120, y: 24, primary: true },
    { label: 'Low-resource segmentation', x: 120, y: 90 },
    { label: 'Federated Learning', x: 40, y: 158 },
    { label: 'Clinical AI', x: 200, y: 158 },
    { label: 'Foundation Models', x: 40, y: 224 },
    { label: 'Dr. E. Rodriguez', x: 200, y: 224 },
  ]
  const edges = [
    [0, 1], [1, 2], [1, 3], [2, 4], [3, 5],
  ]
  return (
    <div style={{ position: 'relative', height: 260 }}>
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }} aria-hidden="true">
        {edges.map(([a, b], i) => (
          <line key={i}
            x1={nodes[a].x} y1={nodes[a].y + 12}
            x2={nodes[b].x} y2={nodes[b].y + 12}
            stroke="#DDDAD2" strokeWidth="1.5"
          />
        ))}
      </svg>
      {nodes.map((n, i) => (
        <div key={i}
          style={{
            position: 'absolute', left: n.x - 55, top: n.y,
            backgroundColor: n.primary ? '#3D6B4F' : '#FAFAF7',
            border: `1px solid ${n.primary ? '#3D6B4F' : '#DDDAD2'}`,
            color: n.primary ? '#fff' : '#2A2A22',
            borderRadius: 6, padding: '4px 10px',
            fontSize: 11, fontWeight: n.primary ? 600 : 400,
            whiteSpace: 'nowrap', textAlign: 'center',
            cursor: 'default', transition: 'border-color 150ms',
            width: 110,
          }}
          onMouseEnter={e => { if (!n.primary) { (e.currentTarget as HTMLElement).style.borderColor = '#3D6B4F'; (e.currentTarget as HTMLElement).style.backgroundColor = '#EAF2EC' } }}
          onMouseLeave={e => { if (!n.primary) { (e.currentTarget as HTMLElement).style.borderColor = '#DDDAD2'; (e.currentTarget as HTMLElement).style.backgroundColor = '#FAFAF7' } }}
        >
          {n.label}
        </div>
      ))}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function App() {
  const [query, setQuery] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<Mode>('Explore')
  const [context, setContext] = useState<ContextOption>('Current Project')
  const [rightTab, setRightTab] = useState<RightTab>('Sources')
  const [savedToast, setSavedToast] = useState(false)
  const [historySearch, setHistorySearch] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = () => {
    if (!query.trim()) return
    setLoading(true)
    setSubmitted(false)
    setTimeout(() => { setLoading(false); setSubmitted(true) }, 3200)
  }

  const handleQuickAction = (action: string) => {
    const map: Record<string, string> = {
      'Find research gaps': 'What are the main research gaps in low-resource medical image segmentation?',
      'Summarize literature': 'Summarize the key themes across my current literature review.',
      'Compare papers': 'Compare the methodologies used in my top 3 segmentation papers.',
      'Generate research questions': 'Generate new research questions based on my current project.',
      'Find collaborators': 'Find researchers working on federated learning for clinical imaging.',
    }
    setQuery(map[action] || `${action} across my current research.`)
    textareaRef.current?.focus()
  }

  const filteredHistory = HISTORY.filter(h => h.toLowerCase().includes(historySearch.toLowerCase()))

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: '#F5F3EE', fontFamily: "'Inter', sans-serif" }}>
      <Sidebar />

      {/* ── Main canvas ── */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Header */}
        <header style={{ padding: '20px 28px 0', borderBottom: '1px solid #DDDAD2', backgroundColor: '#F5F3EE', flexShrink: 0 }}>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#3D6B4F', marginBottom: 6 }}>
              Research Intelligence
            </div>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, fontWeight: 400, letterSpacing: '-0.02em', color: '#1A1A17', lineHeight: 1.2, marginBottom: 4 }}>
              Think with your research.
            </h1>
            <p style={{ fontSize: 13, color: '#6A6A62', maxWidth: 520 }}>
              Explore your literature, connect ideas, investigate questions, and discover what matters next.
            </p>
          </div>

          {/* Workspace stats */}
          <div style={{ display: 'flex', gap: 20, paddingBottom: 14 }}>
            {[['24', 'papers'], ['18', 'notes'], ['3', 'experiments'], ['2', 'datasets'], ['1', 'active draft']].map(([n, l]) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#1A1A17' }}>{n}</span>
                <span style={{ fontSize: 12, color: '#7A7A72' }}>{l}</span>
              </div>
            ))}
          </div>
        </header>

        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

          {/* ── Left: history + main canvas ── */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 28px' }}>

              {/* Context + Mode row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
                <ContextSelector value={context} onChange={setContext} />
                <ModePicker value={mode} onChange={setMode} />
              </div>

              {/* Query area */}
              <div style={{ border: '1px solid #C8C4BA', borderRadius: 8, backgroundColor: '#FAFAF7', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', marginBottom: 14, transition: 'box-shadow 200ms, border-color 200ms' }}
                onFocusCapture={e => { (e.currentTarget as HTMLElement).style.borderColor = '#3D6B4F'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 2px rgba(61,107,79,0.10)' }}
                onBlurCapture={e => { (e.currentTarget as HTMLElement).style.borderColor = '#C8C4BA'; (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)' }}
              >
                <textarea
                  ref={textareaRef}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={(e: KeyboardEvent<HTMLTextAreaElement>) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit() }}
                  placeholder="Ask anything about your research..."
                  rows={3}
                  style={{
                    width: '100%', padding: '14px 16px', border: 'none', outline: 'none',
                    fontSize: 15, color: '#1A1A17', backgroundColor: 'transparent',
                    resize: 'none', lineHeight: 1.6, fontFamily: "'Inter', sans-serif",
                  }}
                  aria-label="Research query input"
                />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderTop: '1px solid #EDEBE5', backgroundColor: '#F5F2EB' }}>
                  <span style={{ fontSize: 11, color: '#9A9A8E' }}>⌘ + Enter to submit</span>
                  <button
                    onClick={handleSubmit}
                    disabled={!query.trim()}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px',
                      backgroundColor: query.trim() ? '#3D6B4F' : '#C8C4BA',
                      color: '#fff', border: 'none', borderRadius: 5, fontSize: 13,
                      fontWeight: 500, cursor: query.trim() ? 'pointer' : 'default',
                      transition: 'background-color 200ms',
                    }}
                    aria-label="Submit research query"
                  >
                    <ArrowUpIcon /> Research
                  </button>
                </div>
              </div>

              {/* Quick actions */}
              {!submitted && !loading && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9A9A8E', marginBottom: 8 }}>Quick actions</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {QUICK_ACTIONS.map(a => (
                      <button
                        key={a}
                        onClick={() => handleQuickAction(a)}
                        style={{
                          padding: '5px 11px', border: '1px solid #DDDAD2', borderRadius: 4,
                          fontSize: 12, color: '#4A4A44', backgroundColor: '#FAFAF7',
                          cursor: 'pointer', transition: 'all 150ms',
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#F0EDE6'; (e.currentTarget as HTMLElement).style.borderColor = '#3D6B4F'; (e.currentTarget as HTMLElement).style.color = '#3D6B4F' }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#FAFAF7'; (e.currentTarget as HTMLElement).style.borderColor = '#DDDAD2'; (e.currentTarget as HTMLElement).style.color = '#4A4A44' }}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty state */}
              {!submitted && !loading && (
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9A9A8E', marginBottom: 8 }}>Suggested</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {SUGGESTED_PROMPTS.map(p => (
                      <button
                        key={p}
                        onClick={() => { setQuery(p); textareaRef.current?.focus() }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left',
                          padding: '10px 12px', border: '1px solid #DDDAD2', borderRadius: 6,
                          backgroundColor: '#FAFAF7', cursor: 'pointer', fontSize: 13, color: '#3A3A32',
                          transition: 'all 150ms',
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#F0EDE6'; (e.currentTarget as HTMLElement).style.borderColor = '#C8C4BA' }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#FAFAF7'; (e.currentTarget as HTMLElement).style.borderColor = '#DDDAD2' }}
                      >
                        <span style={{ color: '#9A9A8E' }}><SearchIcon /></span>
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Loading state */}
              {loading && <LoadingState />}

              {/* Answer */}
              {submitted && (
                <div>
                  <div style={{ marginBottom: 16, padding: '10px 14px', backgroundColor: '#F0EDE6', borderRadius: 6, border: '1px solid #DDDAD2' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: '#7A7A72', textTransform: 'uppercase', marginBottom: 4 }}>Your question</div>
                    <p style={{ fontSize: 14, color: '#1A1A17' }}>{query}</p>
                  </div>
                  <ResearchAnswer onSave={() => { setSavedToast(true); setTimeout(() => setSavedToast(false), 2400) }} />
                </div>
              )}
            </div>
          </div>

          {/* ── Right rail ── */}
          <aside style={{ width: 280, minWidth: 280, borderLeft: '1px solid #DDDAD2', display: 'flex', flexDirection: 'column', backgroundColor: '#F5F3EE', overflow: 'hidden' }}>

            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid #DDDAD2', flexShrink: 0, backgroundColor: '#EFECE5' }}>
              {(['Sources', 'Insights', 'Graph'] as RightTab[]).map(tab => (
                <button
                  key={tab}
                  onClick={() => setRightTab(tab)}
                  style={{
                    flex: 1, padding: '10px 8px', border: 'none', cursor: 'pointer',
                    fontSize: 12, fontWeight: rightTab === tab ? 600 : 400,
                    color: rightTab === tab ? '#1A1A17' : '#7A7A72',
                    backgroundColor: 'transparent',
                    borderBottom: rightTab === tab ? '2px solid #3D6B4F' : '2px solid transparent',
                    transition: 'all 150ms',
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '14px 14px' }}>

              {/* History */}
              <div style={{ marginBottom: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <span style={{ color: '#7A7A72' }}><HistoryIcon /></span>
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#7A7A72' }}>Recent sessions</span>
                </div>
                <div style={{ position: 'relative', marginBottom: 8 }}>
                  <span style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: '#9A9A8E' }}><SearchIcon size={12} /></span>
                  <input
                    value={historySearch}
                    onChange={e => setHistorySearch(e.target.value)}
                    placeholder="Search sessions..."
                    style={{ width: '100%', padding: '5px 8px 5px 26px', border: '1px solid #DDDAD2', borderRadius: 5, fontSize: 12, backgroundColor: '#FAFAF7', color: '#1A1A17', outline: 'none' }}
                  />
                </div>
                {filteredHistory.map((h, i) => (
                  <button key={i}
                    style={{ display: 'block', width: '100%', textAlign: 'left', padding: '6px 8px', borderRadius: 4, border: 'none', cursor: 'pointer', fontSize: 12.5, color: '#3A3A32', backgroundColor: 'transparent', transition: 'background-color 150ms' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = '#EDEBE5'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}
                  >{h}</button>
                ))}
              </div>

              <div style={{ height: 1, backgroundColor: '#DDDAD2', marginBottom: 14 }} />

              {rightTab === 'Sources' && (submitted ? <SourcesPanel /> : (
                <p style={{ fontSize: 12, color: '#9A9A8E', fontStyle: 'italic' }}>Sources will appear after your first research query.</p>
              ))}
              {rightTab === 'Insights' && <InsightsPanel />}
              {rightTab === 'Graph' && (
                <div>
                  <div style={{ fontSize: 11, color: '#7A7A72', marginBottom: 12 }}>Knowledge connections for your query.</div>
                  {submitted ? <ResearchGraph /> : <p style={{ fontSize: 12, color: '#9A9A8E', fontStyle: 'italic' }}>Graph will appear after your first research query.</p>}
                </div>
              )}
            </div>

            {/* Contextual intelligence footer */}
            <div style={{ borderTop: '1px solid #DDDAD2', padding: '12px 14px', backgroundColor: '#EFECE5', flexShrink: 0 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#9A9A8E', marginBottom: 8 }}>Context</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {[
                  { icon: '●', text: 'Connected to your current project', color: '#3D6B4F' },
                  { icon: '●', text: 'Based on 18 papers in your workspace', color: '#3D6B4F' },
                  { icon: '○', text: 'Potential collaborator identified', color: '#8B6914' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                    <span style={{ fontSize: 8, color: item.color, marginTop: 4, flexShrink: 0 }}>{item.icon}</span>
                    <span style={{ fontSize: 11.5, color: '#4A4A44', lineHeight: 1.4 }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Toast notification */}
      {savedToast && (
        <div style={{
          position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          backgroundColor: '#1A1A17', color: '#F5F3EE', padding: '10px 18px', borderRadius: 6,
          fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8,
          boxShadow: '0 4px 16px rgba(0,0,0,0.18)', zIndex: 100, animation: 'fadeSlideIn 200ms ease both',
        }}>
          <span style={{ color: '#3D6B4F' }}><CheckIcon /></span>
          Insight saved to Workspace
        </div>
      )}
    </div>
  )
}
