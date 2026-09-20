import { useState } from 'react'

interface NavItem {
  label: string
  icon?: string
  active?: boolean
  badge?: number
}

interface NavGroup {
  heading?: string
  items: NavItem[]
}

const groups: NavGroup[] = [
  {
    items: [
      { label: 'Home', icon: '⌂' },
      { label: 'Discover', icon: '◎' },
      { label: 'AI Assistant', icon: '✦' },
    ],
  },
  {
    heading: 'Research',
    items: [
      { label: 'Workspace' },
      { label: 'Papers', active: true },
      { label: 'Publications' },
      { label: 'Projects' },
      { label: 'Notes' },
    ],
  },
  {
    heading: 'Community',
    items: [
      { label: 'Research Feed', badge: 4 },
      { label: 'Researchers' },
      { label: 'Labs' },
      { label: 'Collaborations' },
      { label: 'Messages', badge: 2 },
    ],
  },
  {
    heading: 'Opportunities',
    items: [
      { label: 'Grants' },
      { label: 'Conferences' },
      { label: 'Journals' },
      { label: 'Fellowships' },
    ],
  },
  {
    heading: 'Personal',
    items: [
      { label: 'Calendar' },
      { label: 'Notifications', badge: 1 },
      { label: 'Collections' },
    ],
  },
]

export default function Sidebar() {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <aside
      className="flex flex-col overflow-y-auto flex-shrink-0"
      style={{
        width: '220px',
        backgroundColor: 'var(--color-surface)',
        borderRight: '1px solid var(--color-hairline)',
      }}
    >
      {/* Logo */}
      <div
        className="px-5 py-4 flex items-center gap-2.5"
        style={{ borderBottom: '1px solid var(--color-hairline)' }}
      >
        <div
          className="flex items-center justify-center rounded-sm text-white font-semibold"
          style={{
            width: '24px',
            height: '24px',
            backgroundColor: 'var(--color-forest)',
            fontFamily: 'var(--font-display)',
            fontSize: '14px',
            fontWeight: 500,
          }}
        >
          C
        </div>
        <span
          className="tracking-widest uppercase font-medium"
          style={{
            fontSize: '11px',
            letterSpacing: '0.18em',
            color: 'var(--color-ink)',
            fontFamily: 'var(--font-body)',
          }}
        >
          Cambium
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-2.5">
        {groups.map((group, gi) => (
          <div key={gi} className="mb-4">
            {group.heading && (
              <div
                className="px-3 pt-2 pb-1 uppercase font-semibold"
                style={{ fontSize: '9.5px', letterSpacing: '0.11em', color: 'var(--color-ink-3)' }}
              >
                {group.heading}
              </div>
            )}
            {group.items.map((item) => {
              const key = `${gi}-${item.label}`
              const isHov = hovered === key
              return (
                <button
                  key={key}
                  className="w-full text-left px-3 py-1.5 rounded flex items-center gap-2.5 transition-colors duration-100"
                  style={{
                    fontSize: '13px',
                    fontFamily: 'var(--font-body)',
                    color: item.active
                      ? 'var(--color-forest)'
                      : isHov
                      ? 'var(--color-ink)'
                      : 'var(--color-ink-2)',
                    backgroundColor: item.active
                      ? 'var(--color-forest-bg)'
                      : isHov
                      ? 'var(--color-surface-2)'
                      : 'transparent',
                    fontWeight: item.active ? '500' : '400',
                  }}
                  onMouseEnter={() => setHovered(key)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {item.icon && (
                    <span style={{ fontSize: '14px', width: '16px', textAlign: 'center', opacity: 0.7 }}>
                      {item.icon}
                    </span>
                  )}
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span
                      className="rounded-full flex items-center justify-center"
                      style={{
                        width: '17px',
                        height: '17px',
                        fontSize: '10px',
                        backgroundColor: 'var(--color-surface-2)',
                        color: 'var(--color-ink-2)',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Profile */}
      <div
        className="p-3"
        style={{ borderTop: '1px solid var(--color-hairline)' }}
      >
        <button
          className="w-full flex items-center gap-2.5 px-2 py-2 rounded transition-colors duration-100"
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--color-surface-2)' }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
        >
          <div
            className="rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0"
            style={{
              width: '28px',
              height: '28px',
              backgroundColor: 'var(--color-forest)',
              fontSize: '11px',
            }}
          >
            MC
          </div>
          <div className="flex-1 min-w-0 text-left">
            <div style={{ fontSize: '12.5px', fontWeight: 500, color: 'var(--color-ink)' }}>Maya Chen</div>
            <div style={{ fontSize: '11px', color: 'var(--color-ink-3)' }}>PhD · Medical Imaging</div>
          </div>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--color-ink-3)', flexShrink: 0 }}>
            <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        </button>
      </div>
    </aside>
  )
}
