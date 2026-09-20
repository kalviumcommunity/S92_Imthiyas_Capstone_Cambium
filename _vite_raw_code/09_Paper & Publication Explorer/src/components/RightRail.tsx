import { useState } from 'react'

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="uppercase font-semibold tracking-wider mb-3"
      style={{ fontSize: '9.5px', color: 'var(--color-ink-3)', letterSpacing: '0.12em' }}
    >
      {children}
    </div>
  )
}

function RailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--color-hairline)' }}>
      <SectionLabel>{title}</SectionLabel>
      {children}
    </div>
  )
}

export default function RightRail() {
  const [savedSearch, setSavedSearch] = useState(false)
  const [followedTopics, setFollowedTopics] = useState<Set<string>>(new Set())

  return (
    <div>
      {/* Reading list */}
      <RailSection title="Your Reading List">
        <div className="flex items-center gap-5 mb-3">
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '22px', fontWeight: 500, color: 'var(--color-ink)', lineHeight: 1 }}>
              3
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-ink-3)', marginTop: '2px' }}>unread</div>
          </div>
          <div style={{ width: '1px', height: '28px', backgroundColor: 'var(--color-hairline)' }} />
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '22px', fontWeight: 500, color: 'var(--color-ink)', lineHeight: 1 }}>
              12
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-ink-3)', marginTop: '2px' }}>saved</div>
          </div>
        </div>

        <div className="space-y-2 mb-3">
          {[
            { title: 'Foundation Models for Medical Image Understanding', status: 'reading' },
            { title: 'Federated Learning for Clinical AI', status: 'saved' },
            { title: 'Efficient Medical Segmentation', status: 'saved' },
          ].map(item => (
            <div key={item.title} className="flex items-start gap-2">
              <div
                className="rounded-full flex-shrink-0 mt-1.5"
                style={{
                  width: '5px',
                  height: '5px',
                  backgroundColor:
                    item.status === 'reading' ? 'var(--color-forest)' : 'var(--color-hairline)',
                }}
              />
              <div
                style={{ fontSize: '12px', color: 'var(--color-ink-2)', lineHeight: 1.5 }}
              >
                {item.title}
              </div>
            </div>
          ))}
        </div>
        <button
          style={{ fontSize: '12px', color: 'var(--color-forest)', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
          onMouseEnter={e => { e.currentTarget.style.textDecoration = 'underline' }}
          onMouseLeave={e => { e.currentTarget.style.textDecoration = 'none' }}
        >
          View reading list →
        </button>
      </RailSection>

      {/* Related to your research */}
      <RailSection title="Related to Your Research">
        <div className="space-y-1.5">
          {['Foundation Models', 'Medical Imaging', 'Federated Learning', 'Computer Vision'].map(topic => {
            const followed = followedTopics.has(topic)
            return (
              <div
                key={topic}
                className="flex items-center justify-between rounded px-2.5 py-2 transition-colors duration-100"
                style={{ border: '1px solid var(--color-hairline)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.backgroundColor = 'var(--color-surface-2)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent' }}
              >
                <span style={{ fontSize: '12.5px', color: 'var(--color-ink-2)' }}>{topic}</span>
                <button
                  onClick={() => {
                    const next = new Set(followedTopics)
                    if (next.has(topic)) next.delete(topic)
                    else next.add(topic)
                    setFollowedTopics(next)
                  }}
                  style={{
                    fontSize: '10.5px',
                    padding: '2px 8px',
                    borderRadius: '2px',
                    border: '1px solid var(--color-hairline)',
                    color: followed ? 'var(--color-forest)' : 'var(--color-ink-3)',
                    backgroundColor: followed ? 'var(--color-forest-bg)' : 'transparent',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  {followed ? '✓' : '+'}
                </button>
              </div>
            )
          })}
        </div>
      </RailSection>

      {/* Publication planning */}
      <RailSection title="Publication Planning">
        <div className="mb-3">
          <div style={{ fontSize: '11px', color: 'var(--color-ink-3)', marginBottom: '3px' }}>
            Current paper
          </div>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '13px',
              color: 'var(--color-ink)',
              lineHeight: 1.4,
            }}
          >
            Low-Resource Medical Image Segmentation
          </div>
        </div>

        <div style={{ fontSize: '11px', color: 'var(--color-ink-3)', marginBottom: '6px' }}>
          Potential venues
        </div>
        <div className="space-y-1.5 mb-4">
          {[
            { name: 'Journal of Medical AI Research', note: 'Strong match' },
            { name: 'MICCAI 2026', note: 'Primary venue' },
            { name: 'Int. Journal of Computer Vision', note: 'Good match' },
          ].map((v, i) => (
            <div key={v.name} className="flex items-center gap-2">
              <span
                className="flex items-center justify-center rounded-sm font-medium flex-shrink-0"
                style={{
                  width: '18px',
                  height: '18px',
                  fontSize: '10px',
                  fontFamily: 'var(--font-mono)',
                  backgroundColor: i === 0 ? 'var(--color-forest-bg)' : 'var(--color-surface-2)',
                  color: i === 0 ? 'var(--color-forest)' : 'var(--color-ink-3)',
                }}
              >
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <div style={{ fontSize: '12px', color: 'var(--color-ink-2)', lineHeight: 1.3 }}>{v.name}</div>
                <div style={{ fontSize: '10.5px', color: 'var(--color-ink-3)' }}>{v.note}</div>
              </div>
            </div>
          ))}
        </div>

        <button
          className="w-full rounded-sm font-medium"
          style={{
            fontSize: '12px',
            padding: '7px 12px',
            backgroundColor: 'var(--color-forest)',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'var(--font-body)',
          }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--color-forest-dim)' }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'var(--color-forest)' }}
        >
          Open Publication Plan
        </button>
      </RailSection>

      {/* Recently viewed */}
      <RailSection title="Recently Viewed">
        <div className="space-y-2">
          {[
            'Foundation Models for Medical Image Understanding',
            'Federated Learning for Clinical AI',
            'Efficient Medical Segmentation',
          ].map(title => (
            <button
              key={title}
              className="block w-full text-left transition-colors duration-100 py-0.5"
              style={{ fontSize: '12px', color: 'var(--color-ink-2)', lineHeight: 1.5, backgroundColor: 'transparent', border: 'none', cursor: 'pointer', padding: '2px 0' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-link)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-ink-2)' }}
            >
              {title}
            </button>
          ))}
        </div>
      </RailSection>

      {/* Saved searches */}
      <div className="px-5 py-4">
        <SectionLabel>Saved Searches</SectionLabel>
        <div className="space-y-1.5">
          {[
            { q: 'medical image segmentation', count: 6 },
            { q: 'federated learning healthcare', count: 14 },
          ].map(s => (
            <div key={s.q} className="flex items-center justify-between">
              <button
                style={{ fontSize: '12px', color: 'var(--color-ink-2)', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-ink)' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-ink-2)' }}
              >
                {s.q}
              </button>
              <span style={{ fontSize: '10.5px', fontFamily: 'var(--font-mono)', color: 'var(--color-ink-3)' }}>
                {s.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
