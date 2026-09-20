import { useState } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

type MainSection = 'today' | 'calendar' | 'collections' | 'saved' | 'activity' | 'routines' | 'preferences'
type CalendarView = 'week' | 'month' | 'agenda'
type SavedTab = 'all' | 'papers' | 'researchers' | 'opportunities' | 'projects' | 'topics'
type PrefTab = 'appearance' | 'notifications' | 'interests' | 'privacy' | 'integrations' | 'export' | 'security' | 'language'

// ─── Nav Data ─────────────────────────────────────────────────────────────────

const NAV = [
  {
    label: 'CAMBIUM',
    items: [
      { id: 'home', label: 'Home' },
      { id: 'discover', label: 'Discover' },
      { id: 'ai', label: 'AI Assistant' },
    ],
  },
  {
    label: 'RESEARCH',
    items: [
      { id: 'workspace', label: 'Workspace' },
      { id: 'papers', label: 'Papers' },
      { id: 'publications', label: 'Publications' },
      { id: 'projects', label: 'Projects' },
      { id: 'notes', label: 'Notes' },
    ],
  },
  {
    label: 'COMMUNITY',
    items: [
      { id: 'feed', label: 'Feed' },
      { id: 'researchers', label: 'Researchers' },
      { id: 'labs', label: 'Labs' },
      { id: 'collaborations', label: 'Collaborations' },
      { id: 'messages', label: 'Messages', badge: 2 },
    ],
  },
  {
    label: 'OPPORTUNITIES',
    items: [
      { id: 'grants', label: 'Grants' },
      { id: 'conferences', label: 'Conferences' },
      { id: 'journals', label: 'Journals' },
      { id: 'fellowships', label: 'Fellowships' },
    ],
  },
  {
    label: 'PERSONAL',
    items: [
      { id: 'calendar-nav', label: 'Calendar' },
      { id: 'notifications', label: 'Notifications', badge: 4 },
      { id: 'collections-nav', label: 'Collections' },
    ],
  },
  {
    label: 'PROFILE',
    items: [
      { id: 'my-profile', label: 'My Profile' },
      { id: 'settings', label: 'Settings' },
    ],
  },
]

// ─── Calendar Events ──────────────────────────────────────────────────────────

const WEEK_EVENTS = [
  { id: 1, day: 1, start: 9, duration: 1, label: 'Literature Review', type: 'research' },
  { id: 2, day: 1, start: 11.5, duration: 1, label: 'Lab Meeting', type: 'meeting' },
  { id: 3, day: 2, start: 10, duration: 1.5, label: 'Experiment Run', type: 'experiment' },
  { id: 4, day: 3, start: 9, duration: 1, label: 'Writing Session', type: 'research' },
  { id: 5, day: 3, start: 14, duration: 1, label: 'Collaborator Meeting', type: 'meeting' },
  { id: 6, day: 4, start: 11, duration: 0.75, label: 'Paper Review', type: 'research' },
  { id: 7, day: 4, start: 15, duration: 1, label: 'Grant Review', type: 'deadline' },
  { id: 8, day: 5, start: 9, duration: 2, label: 'Friday Paper Review', type: 'research' },
]

const AGENDA_EVENTS = [
  { date: 'Today, Aug 13', items: [
    { time: '09:00', label: 'Literature Review', type: 'research', duration: '1h' },
    { time: '11:30', label: 'Lab Meeting', type: 'meeting', duration: '1h' },
    { time: '14:00', label: 'Experiment Run', type: 'experiment', duration: '1.5h' },
  ]},
  { date: 'Tomorrow, Aug 14', items: [
    { time: '10:00', label: 'Writing Session', type: 'research', duration: '2h' },
    { time: '15:00', label: 'Collaborator Meeting', type: 'meeting', duration: '1h' },
  ]},
  { date: 'Sep 18', items: [
    { time: 'All day', label: 'Early Career Research Fellowship deadline', type: 'deadline', duration: '' },
  ]},
  { date: 'Oct 04', items: [
    { time: 'All day', label: 'MICCAI 2026 Paper Submission', type: 'deadline', duration: '' },
  ]},
]

const EVENT_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  research:   { bg: '#EBF2EE', text: '#2B5840', dot: '#3D7558' },
  meeting:    { bg: '#EBF0FA', text: '#2D4A8A', dot: '#4060AA' },
  experiment: { bg: '#F2ECFA', text: '#5A3280', dot: '#7A52A0' },
  deadline:   { bg: '#FAF3E8', text: '#86621F', dot: '#A07830' },
  personal:   { bg: '#F5F5F5', text: '#4A4844', dot: '#78756F' },
}

// ─── Collections ─────────────────────────────────────────────────────────────

const COLLECTIONS = [
  { id: 1, name: 'Medical Imaging', desc: 'Core literature for imaging research', items: '42 papers · 8 researchers · 3 datasets', updated: '2h ago', color: '#EBF2EE' },
  { id: 2, name: 'Foundation Models', desc: 'Large-scale pretrained model literature', items: '28 papers · 5 researchers', updated: '1d ago', color: '#EBF0FA' },
  { id: 3, name: 'Papers to Read', desc: 'Reading queue', items: '14 papers', updated: '3h ago', color: '#F5F2EC' },
  { id: 4, name: 'Potential Collaborators', desc: 'Researchers to reach out to', items: '9 researchers · 3 labs', updated: '4d ago', color: '#F2ECFA' },
  { id: 5, name: 'Funding Opportunities', desc: 'Active grants and fellowships', items: '6 grants · 4 fellowships', updated: '2d ago', color: '#FAF3E8' },
  { id: 6, name: 'Conference Shortlist', desc: 'Target venues for 2026', items: '8 conferences', updated: '1w ago', color: '#FAF0EF' },
]

// ─── Saved Research ───────────────────────────────────────────────────────────

const SAVED_ITEMS = [
  { id: 1, title: 'Foundation Models for Medical Image Understanding', type: 'paper', saved: '2 hours ago', context: 'Relates to your Medical Imaging project', tab: 'papers' },
  { id: 2, title: 'Early Career Research Fellowship 2026', type: 'opportunity', saved: 'Yesterday', context: 'Matches your career stage and research area', tab: 'opportunities' },
  { id: 3, title: 'Dr. Elena Rodriguez', type: 'researcher', saved: 'Monday', context: 'Expertise overlaps with your Federated Learning work', tab: 'researchers' },
  { id: 4, title: 'Segment Anything for Medical Imaging: A Systematic Review', type: 'paper', saved: '3 days ago', context: 'Saved because it relates to your Medical Imaging project', tab: 'papers' },
  { id: 5, title: 'Low-Resource Medical Image Segmentation', type: 'project', saved: '1 week ago', context: 'Active collaboration project', tab: 'projects' },
  { id: 6, title: 'Federated Learning for Clinical Data', type: 'paper', saved: '1 week ago', context: 'Core to your Federated Learning collection', tab: 'papers' },
  { id: 7, title: 'Prof. James Chen', type: 'researcher', saved: '2 weeks ago', context: 'Potential collaborator in Computer Vision', tab: 'researchers' },
  { id: 8, title: 'NIH R01 Grant — Biomedical Imaging', type: 'opportunity', saved: '3 weeks ago', context: 'Matches your funding profile', tab: 'opportunities' },
]

// ─── Notifications ────────────────────────────────────────────────────────────

const NOTIFS = [
  { id: 1, text: 'Dr. Elena Rodriguez commented on your research update in Low-Resource Medical Image Segmentation.', time: '5 min ago', category: 'Collaboration', read: false },
  { id: 2, text: 'A new fellowship matches your Medical Imaging research profile.', time: '1h ago', category: 'Opportunities', read: false },
  { id: 3, text: 'Your collaborator added 3 references to Low-Resource Medical Image Segmentation.', time: '3h ago', category: 'Research', read: false },
  { id: 4, text: 'MICCAI 2026 submission deadline is 52 days away.', time: 'Yesterday', category: 'Deadlines', read: false },
  { id: 5, text: 'Prof. James Chen accepted your connection request.', time: '2 days ago', category: 'Collaboration', read: true },
  { id: 6, text: 'Your paper citation count increased by 12 this week.', time: '3 days ago', category: 'Research', read: true },
]

// ─── Routines ─────────────────────────────────────────────────────────────────

const ROUTINES_INITIAL = [
  { id: 1, name: 'Morning literature review', duration: '30 min', schedule: 'Every weekday', active: true },
  { id: 2, name: 'Weekly research planning', duration: '45 min', schedule: 'Monday', active: true },
  { id: 3, name: 'Friday paper review', duration: '60 min', schedule: 'Friday', active: false },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function TypeBadge({ type }: { type: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    paper: { label: 'Paper', cls: 'bg-accent-subtle text-accent' },
    opportunity: { label: 'Opportunity', cls: 'bg-warn-subtle text-warn' },
    researcher: { label: 'Researcher', cls: 'bg-info-subtle text-info' },
    project: { label: 'Project', cls: 'bg-[#F2ECFA] text-[#5A3280]' },
    topic: { label: 'Topic', cls: 'bg-panel text-ink-3' },
  }
  const t = map[type] || { label: type, cls: 'bg-panel text-ink-3' }
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium tracking-wide uppercase ${t.cls}`}>
      {t.label}
    </span>
  )
}

function SectionHeading({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between mb-6">
      <div>
        <h2 className="font-serif text-[26px] text-ink leading-tight">{title}</h2>
        {subtitle && <p className="text-ink-3 text-[13px] mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={onToggle}
      className={`relative inline-flex h-5 w-9 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${on ? 'bg-accent' : 'bg-rule'}`}
    >
      <span className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${on ? 'translate-x-4' : 'translate-x-0'}`} />
    </button>
  )
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

function Sidebar({ active, onSelect }: { active: string; onSelect: (id: string) => void }) {
  return (
    <aside className="w-[230px] shrink-0 bg-panel border-r border-rule flex flex-col h-full overflow-y-auto">
      {/* Logo */}
      <div className="px-6 pt-7 pb-5 border-b border-rule">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-[5px] bg-accent flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 2C4.24 2 2 4.24 2 7s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 1.5a3.5 3.5 0 0 1 0 7A3.5 3.5 0 0 1 7 3.5zm0 1.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" fill="white"/>
            </svg>
          </div>
          <span className="font-semibold text-[15px] text-ink tracking-tight">Cambium</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-5">
        {NAV.map((group) => (
          <div key={group.label}>
            <p className="px-3 mb-1.5 text-[10px] font-semibold tracking-[0.1em] text-ink-4 uppercase">
              {group.label}
            </p>
            {group.items.map((item) => {
              const isActive = active === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => onSelect(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-[6px] rounded-[5px] text-[13px] transition-colors duration-150 text-left group
                    ${isActive
                      ? 'bg-accent-subtle text-accent font-medium'
                      : 'text-ink-2 hover:bg-[rgba(0,0,0,0.04)] hover:text-ink'
                    }`}
                >
                  <span>{item.label}</span>
                  {'badge' in item && item.badge ? (
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${isActive ? 'bg-accent text-white' : 'bg-rule text-ink-3'}`}>
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              )
            })}
          </div>
        ))}

        {/* Personal Research OS */}
        <div>
          <p className="px-3 mb-1.5 text-[10px] font-semibold tracking-[0.1em] text-ink-4 uppercase">
            PERSONAL
          </p>
          <button
            onClick={() => onSelect('personal-os')}
            className={`w-full flex items-center gap-2 px-3 py-[6px] rounded-[5px] text-[13px] font-medium transition-colors duration-150 text-left
              ${active === 'personal-os'
                ? 'bg-accent text-white'
                : 'text-accent hover:bg-accent-subtle'
              }`}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <rect x="1" y="1" width="5" height="5" rx="1.5" fill="currentColor" opacity="0.7"/>
              <rect x="7" y="1" width="5" height="5" rx="1.5" fill="currentColor"/>
              <rect x="1" y="7" width="5" height="5" rx="1.5" fill="currentColor"/>
              <rect x="7" y="7" width="5" height="5" rx="1.5" fill="currentColor" opacity="0.7"/>
            </svg>
            Research OS
          </button>
        </div>
      </nav>

      {/* User */}
      <div className="px-4 py-4 border-t border-rule">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-accent-subtle flex items-center justify-center shrink-0">
            <span className="text-accent text-[11px] font-semibold">AR</span>
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-medium text-ink truncate">Aisha Ramachandran</p>
            <p className="text-[11px] text-ink-3 truncate">Chennai Institute of Technology</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

// ─── Calendar (Week View) ─────────────────────────────────────────────────────

const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17]
const DAYS = ['Mon 10', 'Tue 11', 'Wed 12', 'Thu 13', 'Fri 14']

function WeekCalendar() {
  const totalHours = HOURS.length
  const rowH = 48

  return (
    <div className="overflow-x-auto">
      <div style={{ minWidth: 600 }}>
        {/* Day headers */}
        <div className="flex border-b border-rule">
          <div className="w-16 shrink-0" />
          {DAYS.map((d, i) => (
            <div key={i} className={`flex-1 text-center py-2.5 text-[11px] font-medium tracking-wide uppercase
              ${i === 3 ? 'text-accent' : 'text-ink-3'}`}>
              <span className={i === 3 ? 'inline-block px-2 py-0.5 rounded-full bg-accent-subtle text-accent' : ''}>{d}</span>
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="relative flex">
          {/* Time labels */}
          <div className="w-16 shrink-0">
            {HOURS.map((h) => (
              <div key={h} style={{ height: rowH }} className="relative">
                <span className="absolute -top-2 right-3 text-[10px] text-ink-4">
                  {h < 12 ? `${h}am` : h === 12 ? '12pm' : `${h - 12}pm`}
                </span>
              </div>
            ))}
          </div>

          {/* Day columns */}
          {DAYS.map((_, dayIdx) => (
            <div key={dayIdx} className="flex-1 relative border-l border-rule" style={{ height: totalHours * rowH }}>
              {/* Hour lines */}
              {HOURS.map((_, hi) => (
                <div key={hi} style={{ top: hi * rowH, height: rowH }} className="absolute inset-x-0 border-b border-rule border-dashed opacity-50" />
              ))}

              {/* Events */}
              {WEEK_EVENTS.filter((e) => e.day - 1 === dayIdx).map((ev) => {
                const top = (ev.start - HOURS[0]) * rowH
                const height = ev.duration * rowH - 2
                const col = EVENT_COLORS[ev.type] || EVENT_COLORS.personal
                return (
                  <div
                    key={ev.id}
                    style={{ top, height, backgroundColor: col.bg, color: col.text }}
                    className="absolute left-1 right-1 rounded px-2 overflow-hidden cursor-pointer group transition-shadow hover:shadow-sm"
                  >
                    <p className="text-[11px] font-medium truncate leading-tight mt-1">{ev.label}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: col.dot }} />
                      <span className="text-[10px] opacity-70 capitalize">{ev.type}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function AgendaCalendar() {
  return (
    <div className="space-y-6">
      {AGENDA_EVENTS.map((group) => (
        <div key={group.date}>
          <p className="text-[11px] font-semibold tracking-wider uppercase text-ink-3 mb-2">{group.date}</p>
          <div className="space-y-1.5">
            {group.items.map((item, i) => {
              const col = EVENT_COLORS[item.type] || EVENT_COLORS.personal
              return (
                <div key={i} className="flex items-center gap-4 py-2.5 px-3 rounded-[5px] border border-rule hover:border-accent/30 hover:bg-accent-subtle/30 transition-colors duration-150 cursor-pointer">
                  <span className="text-[11px] text-ink-3 w-14 shrink-0 font-mono">{item.time}</span>
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: col.dot }} />
                  <span className="text-[13px] text-ink flex-1">{item.label}</span>
                  {item.duration && <span className="text-[11px] text-ink-4">{item.duration}</span>}
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Preferences ─────────────────────────────────────────────────────────────

const PREF_TABS: { id: PrefTab; label: string }[] = [
  { id: 'appearance', label: 'Appearance' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'interests', label: 'Research interests' },
  { id: 'privacy', label: 'Privacy' },
  { id: 'integrations', label: 'Integrations' },
  { id: 'export', label: 'Export & Data' },
  { id: 'security', label: 'Security' },
  { id: 'language', label: 'Language' },
]

const NOTIF_PREFS = [
  { id: 'reccs', label: 'Research recommendations' },
  { id: 'opps', label: 'Opportunity alerts' },
  { id: 'deadlines', label: 'Deadline reminders' },
  { id: 'collab', label: 'Collaboration activity' },
  { id: 'papers', label: 'Paper updates' },
  { id: 'messages', label: 'Messages' },
  { id: 'mentions', label: 'Mentions' },
  { id: 'product', label: 'Product updates' },
]

const INTERESTS = ['Medical Imaging', 'Computer Vision', 'Machine Learning', 'Federated Learning', 'Deep Learning']

const INTEGRATIONS = [
  { name: 'ORCID', connected: true, detail: '0000-0002-1234-5678' },
  { name: 'Google Scholar', connected: true, detail: 'View profile' },
  { name: 'GitHub', connected: false, detail: '' },
  { name: 'LinkedIn', connected: false, detail: '' },
  { name: 'ResearchGate', connected: true, detail: 'View profile' },
  { name: 'Semantic Scholar', connected: false, detail: '' },
  { name: 'Calendar', connected: true, detail: 'Google Calendar' },
]

function PreferencesPanel() {
  const [tab, setTab] = useState<PrefTab>('appearance')
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light')
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable')
  const [notifToggles, setNotifToggles] = useState<Record<string, boolean>>(
    Object.fromEntries(NOTIF_PREFS.map((p) => [p.id, p.id !== 'product']))
  )
  const [profileVisibility, setProfileVisibility] = useState<'public' | 'members' | 'private'>('members')
  const [activityVisibility, setActivityVisibility] = useState<'show' | 'limit' | 'hide'>('show')
  const [collabAvailability, setCollabAvailability] = useState<'available' | 'selective' | 'unavailable'>('selective')
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle')

  const handleSave = () => {
    setSaveState('saving')
    setTimeout(() => setSaveState('saved'), 800)
    setTimeout(() => setSaveState('idle'), 2600)
  }

  function SegControl<T extends string>({ value, options, onChange }: { value: T; options: { id: T; label: string }[]; onChange: (v: T) => void }) {
    return (
      <div className="flex rounded-[6px] border border-rule p-0.5 bg-surface inline-flex">
        {options.map((o) => (
          <button
            key={o.id}
            onClick={() => onChange(o.id)}
            className={`px-3 py-1.5 rounded-[4px] text-[12px] font-medium transition-colors duration-150 ${value === o.id ? 'bg-ink text-surface shadow-sm' : 'text-ink-3 hover:text-ink'}`}
          >
            {o.label}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="flex gap-8">
      {/* Pref sidebar */}
      <div className="w-[180px] shrink-0">
        <nav className="space-y-0.5">
          {PREF_TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`w-full text-left px-3 py-2 rounded-[5px] text-[13px] transition-colors duration-150 ${tab === t.id ? 'bg-accent-subtle text-accent font-medium' : 'text-ink-2 hover:bg-[rgba(0,0,0,0.04)]'}`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Pref content */}
      <div className="flex-1 min-w-0">
        {tab === 'appearance' && (
          <div className="space-y-7">
            <div>
              <p className="text-[12px] font-semibold tracking-wider uppercase text-ink-3 mb-3">Theme</p>
              <SegControl
                value={theme}
                options={[{ id: 'light', label: 'Light' }, { id: 'dark', label: 'Dark' }, { id: 'system', label: 'System' }]}
                onChange={setTheme}
              />
            </div>
            <div>
              <p className="text-[12px] font-semibold tracking-wider uppercase text-ink-3 mb-3">Density</p>
              <SegControl
                value={density}
                options={[{ id: 'comfortable', label: 'Comfortable' }, { id: 'compact', label: 'Compact' }]}
                onChange={setDensity}
              />
            </div>
            <div>
              <p className="text-[12px] font-semibold tracking-wider uppercase text-ink-3 mb-3">Typography</p>
              <p className="text-[13px] text-ink-2 mb-2">Default</p>
            </div>
            <div>
              <p className="text-[12px] font-semibold tracking-wider uppercase text-ink-3 mb-3">Accessibility</p>
              <div className="space-y-3">
                {['Reduced motion', 'Larger text', 'High contrast'].map((opt) => (
                  <div key={opt} className="flex items-center justify-between">
                    <span className="text-[13px] text-ink-2">{opt}</span>
                    <Toggle on={false} onToggle={() => {}} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'notifications' && (
          <div className="space-y-2">
            {NOTIF_PREFS.map((p) => (
              <div key={p.id} className="flex items-center justify-between py-2.5 border-b border-rule last:border-0">
                <span className="text-[13px] text-ink-2">{p.label}</span>
                <Toggle
                  on={notifToggles[p.id]}
                  onToggle={() => setNotifToggles((t) => ({ ...t, [p.id]: !t[p.id] }))}
                />
              </div>
            ))}
          </div>
        )}

        {tab === 'interests' && (
          <div>
            <p className="text-[13px] text-ink-3 mb-4">
              Your interests help Cambium personalize research discovery, opportunities and recommendations.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {INTERESTS.map((interest) => (
                <div key={interest} className="flex items-center gap-2 bg-accent-subtle text-accent rounded-full px-3 py-1.5 text-[12px] font-medium">
                  {interest}
                  <button className="hover:text-accent/60 transition-colors">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 2l6 6M8 2l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  </button>
                </div>
              ))}
              <button className="flex items-center gap-1.5 border border-dashed border-rule text-ink-3 rounded-full px-3 py-1.5 text-[12px] hover:border-accent hover:text-accent transition-colors duration-150">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                Add interest
              </button>
            </div>
          </div>
        )}

        {tab === 'privacy' && (
          <div className="space-y-7">
            {[
              { label: 'Profile visibility', value: profileVisibility, options: [{ id: 'public', label: 'Public' }, { id: 'members', label: 'Members' }, { id: 'private', label: 'Private' }], onChange: setProfileVisibility as (v: string) => void },
              { label: 'Research activity', value: activityVisibility, options: [{ id: 'show', label: 'Show' }, { id: 'limit', label: 'Limit' }, { id: 'hide', label: 'Hide' }], onChange: setActivityVisibility as (v: string) => void },
              { label: 'Collaboration availability', value: collabAvailability, options: [{ id: 'available', label: 'Available' }, { id: 'selective', label: 'Selective' }, { id: 'unavailable', label: 'Unavailable' }], onChange: setCollabAvailability as (v: string) => void },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-[13px] font-medium text-ink mb-2.5">{item.label}</p>
                <SegControl value={item.value} options={item.options as { id: string; label: string }[]} onChange={item.onChange} />
              </div>
            ))}
          </div>
        )}

        {tab === 'integrations' && (
          <div className="space-y-2">
            {INTEGRATIONS.map((intg) => (
              <div key={intg.name} className="flex items-center justify-between py-3 border-b border-rule last:border-0">
                <div>
                  <p className="text-[13px] font-medium text-ink">{intg.name}</p>
                  {intg.detail && <p className="text-[11px] text-ink-3 mt-0.5">{intg.detail}</p>}
                </div>
                <div className="flex items-center gap-3">
                  {intg.connected ? (
                    <>
                      <span className="flex items-center gap-1.5 text-[11px] text-accent-mid">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-mid" />
                        Connected
                      </span>
                      <button className="text-[12px] text-ink-3 hover:text-danger transition-colors">Disconnect</button>
                    </>
                  ) : (
                    <button className="text-[12px] text-accent font-medium hover:underline">Connect</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'export' && (
          <div className="space-y-2">
            {['Export my research data', 'Download references', 'Export collections', 'Export workspace', 'Download account data'].map((action) => (
              <button key={action} className="w-full flex items-center justify-between py-3 border-b border-rule last:border-0 group hover:text-accent transition-colors duration-150">
                <span className="text-[13px] text-ink group-hover:text-accent">{action}</span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-ink-3 group-hover:text-accent transition-colors"><path d="M2.5 7.5v3a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1v-3M7 1.5v7M4.5 6l2.5 2.5L9.5 6" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            ))}
            <div className="mt-8 pt-6 border-t border-rule">
              <p className="text-[12px] text-ink-3 mb-3">Danger zone</p>
              <button className="px-4 py-2 rounded-[5px] border border-danger/30 text-danger text-[13px] hover:bg-danger-subtle transition-colors duration-150">
                Delete account
              </button>
            </div>
          </div>
        )}

        {tab === 'security' && (
          <div className="space-y-6">
            {[
              { label: 'Password', action: 'Change password' },
              { label: 'Two-factor authentication', action: 'Enable 2FA' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-3 border-b border-rule">
                <span className="text-[13px] text-ink">{item.label}</span>
                <button className="text-[12px] text-accent font-medium hover:underline">{item.action}</button>
              </div>
            ))}
            <div>
              <p className="text-[12px] font-semibold tracking-wider uppercase text-ink-3 mb-3">Active sessions</p>
              <div className="space-y-2">
                {[
                  { label: 'Chrome on Windows', meta: 'Active now · Chennai, India', current: true },
                  { label: 'Safari on iPhone', meta: '2 days ago · Chennai, India', current: false },
                ].map((s) => (
                  <div key={s.label} className="flex items-center justify-between py-2.5 px-3 rounded-[5px] bg-panel border border-rule">
                    <div>
                      <p className="text-[13px] text-ink">{s.label}</p>
                      <p className="text-[11px] text-ink-3 mt-0.5">{s.meta}</p>
                    </div>
                    {s.current
                      ? <span className="text-[11px] text-accent-mid font-medium">Current</span>
                      : <button className="text-[12px] text-ink-3 hover:text-danger transition-colors">Revoke</button>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {(tab === 'language') && (
          <div>
            <p className="text-[13px] text-ink-2 mb-4">Display language</p>
            <select className="text-[13px] text-ink bg-surface border border-rule rounded-[5px] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/40">
              <option>English (US)</option>
              <option>English (UK)</option>
              <option>Deutsch</option>
              <option>Français</option>
              <option>日本語</option>
            </select>
          </div>
        )}

        {/* Save button */}
        {tab !== 'export' && tab !== 'security' && (
          <div className="mt-8 flex items-center gap-4">
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-accent text-white rounded-[5px] text-[13px] font-medium hover:bg-accent-mid transition-colors duration-150"
            >
              Save preferences
            </button>
            {saveState === 'saving' && <span className="text-[12px] text-ink-3">Saving…</span>}
            {saveState === 'saved' && <span className="text-[12px] text-accent-mid flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6.5l2.5 2.5L10 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Saved
            </span>}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [activeNav, setActiveNav] = useState('personal-os')
  const [calView, setCalView] = useState<CalendarView>('week')
  const [savedTab, setSavedTab] = useState<SavedTab>('all')
  const [notifs, setNotifs] = useState(NOTIFS)
  const [routines, setRoutines] = useState(ROUTINES_INITIAL)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const unreadCount = notifs.filter((n) => !n.read).length

  const markAllRead = () => setNotifs((ns) => ns.map((n) => ({ ...n, read: true })))
  const markRead = (id: number) => setNotifs((ns) => ns.map((n) => n.id === id ? { ...n, read: true } : n))

  const filteredSaved = savedTab === 'all' ? SAVED_ITEMS : SAVED_ITEMS.filter((s) => s.tab === savedTab)

  const filteredSearch = searchQuery.trim()
    ? SAVED_ITEMS.filter((s) =>
        s.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : []

  return (
    <div className="flex h-screen bg-surface overflow-hidden font-sans">
      <Sidebar active={activeNav} onSelect={setActiveNav} />

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between px-10 h-14 border-b border-rule shrink-0 bg-surface/90 backdrop-blur-sm">
          <div className="text-[11px] font-semibold tracking-[0.12em] text-ink-3 uppercase">Personal Research OS</div>
          <div className="flex items-center gap-2">
            {/* Search */}
            {searchOpen ? (
              <div className="relative">
                <input
                  autoFocus
                  type="text"
                  placeholder="Search your research world…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Escape' && (setSearchOpen(false), setSearchQuery(''))}
                  className="w-72 h-8 pl-8 pr-3 rounded-[5px] border border-accent/40 bg-surface text-[13px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/30"
                />
                <svg className="absolute left-2.5 top-2 text-ink-3" width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.25"/><path d="M10 10l2 2" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/></svg>
                {searchQuery && filteredSearch.length > 0 && (
                  <div className="absolute top-10 left-0 w-80 bg-surface border border-rule rounded-[7px] shadow-lg py-1 z-50">
                    {filteredSearch.map((item) => (
                      <div key={item.id} className="px-4 py-2.5 hover:bg-panel cursor-pointer flex items-center gap-3">
                        <TypeBadge type={item.type} />
                        <span className="text-[12px] text-ink truncate">{item.title}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => setSearchOpen(true)} className="flex items-center gap-1.5 h-8 px-3 rounded-[5px] border border-rule text-ink-3 text-[12px] hover:border-ink-3 hover:text-ink transition-colors duration-150">
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="5.5" cy="5.5" r="3.5" stroke="currentColor" strokeWidth="1.2"/><path d="M9 9l2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                <span>Search</span>
                <span className="ml-1 text-[10px] bg-panel px-1.5 py-0.5 rounded font-mono text-ink-4">/</span>
              </button>
            )}

            {/* Notifications */}
            <button className="relative h-8 w-8 flex items-center justify-center rounded-[5px] border border-rule text-ink-3 hover:text-ink hover:border-ink-3 transition-colors duration-150">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1.5a4 4 0 0 1 4 4v2l1 1.5H2l1-1.5v-2a4 4 0 0 1 4-4zM5.5 11.5a1.5 1.5 0 0 0 3 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-accent rounded-full flex items-center justify-center text-[8px] text-white font-bold leading-none">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Avatar */}
            <button className="w-8 h-8 rounded-full bg-accent-subtle flex items-center justify-center">
              <span className="text-accent text-[11px] font-semibold">AR</span>
            </button>
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1040px] mx-auto px-10 py-10">

            {/* Page header */}
            <div className="mb-12">
              <h1 className="font-serif text-[38px] text-ink leading-none mb-3">Your research,<br />organized around you.</h1>
              <p className="text-[14px] text-ink-3 max-w-[520px] leading-relaxed">
                Plan your time, collect what matters, stay on top of important activity,
                and shape Cambium around the way you research.
              </p>
            </div>

            {/* ── AI Intelligence strip ────────────────────────────────────── */}
            <div className="mb-12 px-5 py-4 rounded-[7px] border border-accent/20 bg-accent-subtle flex items-start gap-4">
              <div className="w-5 h-5 rounded-full bg-accent-mid flex items-center justify-center shrink-0 mt-0.5">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 1l.9 2.7H8.5L6.3 5.4l.9 2.7L5 6.4l-2.2 1.7.9-2.7L1.5 3.7H4.1L5 1z" fill="white"/></svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-medium text-accent mb-2">Research intelligence</p>
                <div className="flex flex-wrap gap-x-6 gap-y-1">
                  {[
                    'You have 7 saved papers related to your current Medical Imaging project.',
                    'Two upcoming deadlines overlap with your planned paper schedule.',
                    "You haven't reviewed your 'Foundation Models' collection in 18 days.",
                  ].map((msg) => (
                    <p key={msg} className="text-[12px] text-accent/80">{msg}</p>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Section 01: Today ────────────────────────────────────────── */}
            <section className="mb-16" id="today">
              <SectionHeading
                title="Today"
                subtitle="Here's what deserves your attention."
              />
              <div className="flex items-stretch gap-4">
                {/* Date */}
                <div className="flex flex-col justify-center px-5 py-4 rounded-[7px] border border-rule bg-surface min-w-[140px]">
                  <p className="text-[10px] font-semibold tracking-widest uppercase text-ink-4 mb-1">Thursday</p>
                  <p className="font-serif text-[28px] text-ink leading-none">August 13</p>
                </div>

                {/* Stats row */}
                {[
                  { label: 'Research tasks', value: '3 remaining', icon: '○', color: 'text-ink' },
                  { label: 'Upcoming deadline', value: 'MICCAI 2026', sub: 'Paper submission · Oct 4', icon: '◇', color: 'text-warn' },
                  { label: 'Saved reading', value: '4 papers', icon: '□', color: 'text-info' },
                  { label: 'Unread messages', value: '2', icon: '◇', color: 'text-ink' },
                ].map((stat) => (
                  <div key={stat.label} className="flex-1 flex flex-col gap-1 px-5 py-4 rounded-[7px] border border-rule bg-surface hover:border-ink-4 transition-colors duration-150 cursor-pointer">
                    <p className="text-[11px] text-ink-3 font-medium">{stat.label}</p>
                    <p className={`text-[15px] font-semibold ${stat.color}`}>{stat.value}</p>
                    {stat.sub && <p className="text-[11px] text-ink-4">{stat.sub}</p>}
                  </div>
                ))}
              </div>
            </section>

            {/* ── Section 02: Calendar ─────────────────────────────────────── */}
            <section className="mb-16" id="calendar">
              <SectionHeading
                title="Research Calendar"
                action={
                  <div className="flex items-center gap-1 p-0.5 bg-panel rounded-[5px] border border-rule">
                    {(['week', 'month', 'agenda'] as CalendarView[]).map((v) => (
                      <button
                        key={v}
                        onClick={() => setCalView(v)}
                        className={`px-3 py-1.5 rounded-[4px] text-[12px] font-medium capitalize transition-colors duration-150 ${calView === v ? 'bg-surface text-ink shadow-sm border border-rule' : 'text-ink-3 hover:text-ink'}`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                }
              />

              {/* Legend */}
              <div className="flex items-center gap-4 mb-4">
                {Object.entries({ research: 'Research', meeting: 'Meeting', experiment: 'Experiment', deadline: 'Deadline' }).map(([type, label]) => (
                  <div key={type} className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: EVENT_COLORS[type].dot }} />
                    <span className="text-[11px] text-ink-3">{label}</span>
                  </div>
                ))}
              </div>

              <div className="rounded-[7px] border border-rule overflow-hidden bg-surface">
                <div className="p-5">
                  {calView === 'week' && <WeekCalendar />}
                  {calView === 'agenda' && <AgendaCalendar />}
                  {calView === 'month' && (
                    <div className="text-center py-12 text-ink-3 text-[13px]">Month view — switch to Week or Agenda for detail.</div>
                  )}
                </div>
              </div>
            </section>

            {/* ── Section 03: Collections ──────────────────────────────────── */}
            <section className="mb-16" id="collections">
              <SectionHeading
                title="Collections"
                subtitle="Your personal research libraries."
                action={
                  <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-[5px] border border-rule text-[12px] text-ink-2 hover:border-ink-3 hover:text-ink transition-colors duration-150">
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M5.5 1v9M1 5.5h9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
                    New collection
                  </button>
                }
              />
              <div className="grid grid-cols-3 gap-3">
                {COLLECTIONS.map((col) => (
                  <div
                    key={col.id}
                    className="flex flex-col gap-2 p-5 rounded-[7px] border border-rule bg-surface hover:border-ink-4 hover:shadow-sm transition-all duration-150 cursor-pointer group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="w-8 h-8 rounded-[6px] flex items-center justify-center shrink-0" style={{ backgroundColor: col.color }}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1.5" y="3" width="11" height="8" rx="1.5" stroke="#2B5840" strokeWidth="1.2"/><path d="M4 3V2.5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1V3" stroke="#2B5840" strokeWidth="1.2"/><path d="M4.5 7h5M4.5 9h3" stroke="#2B5840" strokeWidth="1" strokeLinecap="round"/></svg>
                      </div>
                      <svg className="text-ink-4 opacity-0 group-hover:opacity-100 transition-opacity" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-ink">{col.name}</p>
                      <p className="text-[12px] text-ink-3 mt-0.5">{col.desc}</p>
                    </div>
                    <p className="text-[11px] text-ink-4">{col.items}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-[10px] text-ink-4">Updated {col.updated}</p>
                      <button className="text-[11px] text-accent font-medium opacity-0 group-hover:opacity-100 transition-opacity">Open →</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── Section 04: Saved Research ───────────────────────────────── */}
            <section className="mb-16" id="saved">
              <SectionHeading title="Saved research" />
              {/* Tabs */}
              <div className="flex items-center gap-1 mb-5 border-b border-rule">
                {(['all', 'papers', 'researchers', 'opportunities', 'projects', 'topics'] as SavedTab[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setSavedTab(t)}
                    className={`px-4 py-2.5 text-[12px] font-medium capitalize border-b-[1.5px] -mb-px transition-colors duration-150
                      ${savedTab === t ? 'text-ink border-ink' : 'text-ink-3 border-transparent hover:text-ink-2'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="space-y-1">
                {filteredSaved.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between py-3.5 px-4 rounded-[6px] hover:bg-panel transition-colors duration-150 group cursor-pointer border border-transparent hover:border-rule"
                  >
                    <div className="flex items-start gap-3">
                      <TypeBadge type={item.type} />
                      <div>
                        <p className="text-[13px] text-ink font-medium">{item.title}</p>
                        <p className="text-[11px] text-ink-4 mt-0.5 italic">{item.context}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-4">
                      <span className="text-[11px] text-ink-4">{item.saved}</span>
                      <button className="text-ink-4 hover:text-danger opacity-0 group-hover:opacity-100 transition-all duration-150">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 3h8M5 1.5h2M4.5 3v6.5M7.5 3v6.5M2.5 3l.5 7h6l.5-7" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                    </div>
                  </div>
                ))}
                {filteredSaved.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-[14px] font-medium text-ink mb-1.5">Nothing saved yet.</p>
                    <p className="text-[13px] text-ink-3">Save papers, researchers and opportunities to build your personal research library.</p>
                    <button className="mt-4 px-4 py-2 rounded-[5px] border border-rule text-[12px] text-accent font-medium hover:bg-accent-subtle transition-colors duration-150">Discover research</button>
                  </div>
                )}
              </div>
            </section>

            {/* ── Section 05: Activity ─────────────────────────────────────── */}
            <section className="mb-16" id="activity">
              <SectionHeading
                title="Activity"
                action={
                  unreadCount > 0 ? (
                    <button onClick={markAllRead} className="text-[12px] text-ink-3 hover:text-ink transition-colors">Mark all as read</button>
                  ) : undefined
                }
              />
              <div className="space-y-1">
                {notifs.map((notif) => (
                  <div
                    key={notif.id}
                    className={`flex items-start gap-4 py-3.5 px-4 rounded-[6px] transition-colors duration-150 group border ${notif.read ? 'border-transparent' : 'border-accent/10 bg-accent-subtle/20'}`}
                  >
                    {!notif.read && <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />}
                    {notif.read && <span className="w-1.5 h-1.5 mt-1.5 shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] text-ink leading-snug">{notif.text}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-[10px] font-semibold text-ink-4 tracking-wide uppercase">{notif.category}</span>
                        <span className="text-[11px] text-ink-4">{notif.time}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 shrink-0">
                      {!notif.read && (
                        <button onClick={() => markRead(notif.id)} className="text-[11px] text-ink-3 hover:text-accent px-2 py-1 rounded hover:bg-accent-subtle transition-colors">Mark read</button>
                      )}
                      <button className="text-[11px] text-ink-3 hover:text-accent px-2 py-1 rounded hover:bg-accent-subtle transition-colors">Open</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── Section 06: Research Routines ────────────────────────────── */}
            <section className="mb-16" id="routines">
              <SectionHeading
                title="Research routines"
                action={
                  <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-[5px] border border-rule text-[12px] text-ink-2 hover:border-ink-3 hover:text-ink transition-colors duration-150">
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M5.5 1v9M1 5.5h9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
                    Create routine
                  </button>
                }
              />

              {/* AI suggestion */}
              <div className="mb-4 flex items-start gap-3 px-4 py-3 rounded-[6px] border border-info/20 bg-info-subtle">
                <svg className="text-info mt-0.5 shrink-0" width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.2"/><path d="M6.5 5.5v3.5M6.5 4h.01" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                <p className="text-[12px] text-info leading-snug">
                  You've been reviewing papers every morning. Would you like to create a recurring <strong>Literature Review</strong> routine?{' '}
                  <button className="underline hover:no-underline">Create routine</button>
                  {' '}·{' '}
                  <button className="underline hover:no-underline">Dismiss</button>
                </p>
              </div>

              <div className="space-y-2">
                {routines.map((r) => (
                  <div key={r.id} className="flex items-center justify-between py-3.5 px-5 rounded-[6px] border border-rule bg-surface hover:border-ink-4 transition-colors duration-150">
                    <div className="flex items-center gap-4">
                      <Toggle on={r.active} onToggle={() => setRoutines((rs) => rs.map((x) => x.id === r.id ? { ...x, active: !x.active } : x))} />
                      <div>
                        <p className={`text-[13px] font-medium ${r.active ? 'text-ink' : 'text-ink-4 line-through'}`}>{r.name}</p>
                        <p className="text-[11px] text-ink-4 mt-0.5">{r.duration} · {r.schedule}</p>
                      </div>
                    </div>
                    <button className="text-ink-4 hover:text-ink transition-colors p-1">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="3" r="1" fill="currentColor"/><circle cx="7" cy="7" r="1" fill="currentColor"/><circle cx="7" cy="11" r="1" fill="currentColor"/></svg>
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* ── Section 07: Preferences ──────────────────────────────────── */}
            <section className="mb-20" id="preferences">
              <SectionHeading
                title="Preferences"
                subtitle="Shape Cambium around the way you work."
              />
              <div className="rounded-[7px] border border-rule overflow-hidden bg-surface">
                <div className="p-6">
                  <PreferencesPanel />
                </div>
              </div>
            </section>

          </div>
        </main>
      </div>
    </div>
  )
}
