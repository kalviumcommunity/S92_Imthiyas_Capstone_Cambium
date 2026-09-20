import { useState, useRef } from 'react'
import type { Paper, Journal, Conference } from '../data'
import { PAPERS, JOURNALS, CONFERENCES } from '../data'
import PaperCard from './PaperCard'

interface Props {
  onPaperSelect: (paper: Paper) => void
  selectedPaperId?: string
  savedPapers: Set<string>
  onToggleSave: (id: string) => void
}

const TABS = ['Papers', 'Publications', 'Journals', 'Conferences'] as const
type Tab = (typeof TABS)[number]

const FILTERS = ['Research Area', 'Year', 'Authors', 'Venue', 'Type', 'Open Access'] as const

const RECENT_SEARCHES = [
  'medical image segmentation',
  'federated learning healthcare',
  'multimodal clinical AI',
]
const SUGGESTED_TOPICS = ['Medical Imaging', 'Computer Vision', 'Foundation Models']
const SUGGESTED_RESEARCHERS = ['Dr. Elena Rodriguez', 'Dr. Daniel Park']

export default function PaperExplorer({ onPaperSelect, selectedPaperId, savedPapers, onToggleSave }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('Papers')
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set())
  const [sortBy, setSortBy] = useState('Relevance')
  const [searchSaved, setSearchSaved] = useState(false)

  const personalizedPapers = PAPERS.filter(p => p.relevanceNote)
  const mainPapers = PAPERS.filter(p => !p.relevanceNote)

  const toggleFilter = (f: string) => {
    const next = new Set(activeFilters)
    if (next.has(f)) next.delete(f)
    else next.add(f)
    setActiveFilters(next)
  }

  return (
    <main
      className="flex-1 flex flex-col overflow-hidden min-w-0"
      style={{ borderRight: '1px solid var(--color-hairline)' }}
    >
      {/* Header */}
      <div
        className="px-8 pt-6 pb-5"
        style={{ borderBottom: '1px solid var(--color-hairline)', backgroundColor: 'var(--color-surface)' }}
      >
        <div
          className="uppercase font-semibold tracking-wider mb-1.5"
          style={{ fontSize: '9.5px', color: 'var(--color-ink-3)', letterSpacing: '0.14em' }}
        >
          Research Library
        </div>
        <h1
          className="mb-1"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '26px',
            fontWeight: 400,
            color: 'var(--color-ink)',
            lineHeight: 1.2,
          }}
        >
          Discover Research
        </h1>
        <p className="mb-4" style={{ fontSize: '14px', color: 'var(--color-ink-2)' }}>
          Discover the research shaping your field.
        </p>

        {/* Search */}
        <div className="relative">
          <div
            className="relative flex items-center rounded"
            style={{
              border: focused ? '1.5px solid var(--color-forest)' : '1.5px solid var(--color-hairline)',
              backgroundColor: focused ? 'var(--color-surface)' : 'var(--color-parchment)',
              transition: 'border-color 150ms, background-color 150ms',
            }}
          >
            <svg
              className="absolute"
              style={{ left: '12px', color: 'var(--color-ink-3)' }}
              width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 180)}
              placeholder="Search papers, authors, topics, DOI..."
              className="w-full outline-none bg-transparent"
              style={{
                padding: '10px 40px 10px 38px',
                fontSize: '14px',
                fontFamily: 'var(--font-body)',
                color: 'var(--color-ink)',
              }}
            />
            {query && (
              <button
                onMouseDown={() => setQuery('')}
                style={{
                  position: 'absolute',
                  right: '10px',
                  fontSize: '13px',
                  color: 'var(--color-ink-3)',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '2px 6px',
                  borderRadius: '3px',
                }}
              >
                ×
              </button>
            )}
          </div>

          {/* Search dropdown */}
          {focused && !query && (
            <div
              className="absolute left-0 right-0 rounded"
              style={{
                top: 'calc(100% + 4px)',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-hairline)',
                boxShadow: '0 6px 24px rgba(0,0,0,0.08)',
                zIndex: 50,
              }}
            >
              <div className="p-3" style={{ borderBottom: '1px solid var(--color-hairline)' }}>
                <div style={{ fontSize: '9.5px', color: 'var(--color-ink-3)', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Recent Searches
                </div>
                {RECENT_SEARCHES.map(s => (
                  <button
                    key={s}
                    onMouseDown={() => setQuery(s)}
                    className="flex items-center gap-2 w-full px-2 py-1.5 rounded text-left transition-colors duration-100"
                    style={{ fontSize: '13px', color: 'var(--color-ink-2)' }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--color-surface-2)' }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, color: 'var(--color-ink-3)' }}>
                      <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.51"/>
                    </svg>
                    {s}
                  </button>
                ))}
              </div>

              <div className="p-3" style={{ borderBottom: '1px solid var(--color-hairline)' }}>
                <div style={{ fontSize: '9.5px', color: 'var(--color-ink-3)', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Suggested Topics
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_TOPICS.map(t => (
                    <button
                      key={t}
                      onMouseDown={() => setQuery(t)}
                      style={{
                        fontSize: '12px',
                        padding: '3px 10px',
                        borderRadius: '2px',
                        border: '1px solid var(--color-hairline)',
                        backgroundColor: 'var(--color-forest-bg)',
                        color: 'var(--color-forest)',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-body)',
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3">
                <div style={{ fontSize: '9.5px', color: 'var(--color-ink-3)', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Suggested Researchers
                </div>
                {SUGGESTED_RESEARCHERS.map(r => (
                  <button
                    key={r}
                    onMouseDown={() => setQuery(r)}
                    className="flex items-center gap-2 w-full px-2 py-1.5 rounded text-left transition-colors duration-100"
                    style={{ fontSize: '13px', color: 'var(--color-ink-2)' }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--color-surface-2)' }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
                  >
                    <div
                      className="rounded-full flex items-center justify-center font-semibold flex-shrink-0"
                      style={{ width: '20px', height: '20px', backgroundColor: 'var(--color-link-bg)', color: 'var(--color-link)', fontSize: '10px' }}
                    >
                      {r.split(' ').pop()?.[0]}
                    </div>
                    {r}
                  </button>
                ))}
                <div className="mt-2 pt-2" style={{ borderTop: '1px solid var(--color-hairline)' }}>
                  <button
                    className="flex items-center gap-1.5 text-sm"
                    onMouseDown={() => setQuery('Foundation Models for Medical Image Understanding')}
                    style={{ fontSize: '12.5px', color: 'var(--color-forest)', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                    </svg>
                    Foundation Models for Medical Image Understanding
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tab navigation */}
      <div
        className="flex items-center px-8"
        style={{ borderBottom: '1px solid var(--color-hairline)', backgroundColor: 'var(--color-surface)' }}
      >
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="py-3 mr-7 text-sm transition-colors duration-100"
            style={{
              fontSize: '13px',
              color: activeTab === tab ? 'var(--color-ink)' : 'var(--color-ink-3)',
              fontWeight: activeTab === tab ? '500' : '400',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              borderBottom: activeTab === tab ? '2px solid var(--color-forest)' : '2px solid transparent',
              marginBottom: '-1px',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Filter bar */}
      <div
        className="flex items-center gap-2 px-8 py-2.5 overflow-x-auto"
        style={{ borderBottom: '1px solid var(--color-hairline)', backgroundColor: 'var(--color-surface)' }}
      >
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => toggleFilter(f)}
            className="flex items-center gap-1 rounded whitespace-nowrap flex-shrink-0 transition-colors duration-100"
            style={{
              fontSize: '12px',
              padding: '4px 10px',
              border: '1px solid var(--color-hairline)',
              backgroundColor: activeFilters.has(f) ? 'var(--color-forest-bg)' : 'transparent',
              color: activeFilters.has(f) ? 'var(--color-forest)' : 'var(--color-ink-2)',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              borderRadius: '3px',
            }}
          >
            {f}
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
        ))}

        <div style={{ flex: 1 }} />

        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="rounded outline-none flex-shrink-0"
          style={{
            fontSize: '12px',
            padding: '4px 10px',
            border: '1px solid var(--color-hairline)',
            color: 'var(--color-ink-2)',
            backgroundColor: 'transparent',
            fontFamily: 'var(--font-body)',
            cursor: 'pointer',
            borderRadius: '3px',
          }}
        >
          {['Relevance', 'Newest', 'Most Cited', 'Recently Added'].map(o => (
            <option key={o}>{o}</option>
          ))}
        </select>

        <button
          onClick={() => setSearchSaved(s => !s)}
          className="rounded whitespace-nowrap flex-shrink-0 transition-colors duration-100"
          style={{
            fontSize: '12px',
            padding: '4px 10px',
            border: '1px solid var(--color-hairline)',
            backgroundColor: searchSaved ? 'var(--color-forest-bg)' : 'transparent',
            color: searchSaved ? 'var(--color-forest)' : 'var(--color-ink-2)',
            cursor: 'pointer',
            fontFamily: 'var(--font-body)',
            borderRadius: '3px',
          }}
        >
          {searchSaved ? '✓ Saved' : 'Save Search'}
        </button>

        {activeFilters.size > 0 && (
          <button
            onClick={() => setActiveFilters(new Set())}
            style={{
              fontSize: '12px',
              color: 'var(--color-ink-3)',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
            }}
          >
            Clear
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-8 py-5">
        {activeTab === 'Papers' && (
          <>
            {/* Personalized section */}
            <div className="mb-6">
              <div className="flex items-baseline gap-2 mb-3">
                <span
                  className="uppercase font-semibold tracking-wider"
                  style={{ fontSize: '9.5px', color: 'var(--color-ink-3)', letterSpacing: '0.12em' }}
                >
                  For Your Research
                </span>
                <span style={{ fontSize: '12px', color: 'var(--color-ink-3)' }}>
                  · Because you're researching Medical Imaging
                </span>
              </div>
              <div className="space-y-2">
                {personalizedPapers.map(paper => (
                  <PaperCard
                    key={paper.id}
                    paper={paper}
                    isSelected={selectedPaperId === paper.id}
                    isSaved={savedPapers.has(paper.id)}
                    onSelect={() => onPaperSelect(paper)}
                    onToggleSave={() => onToggleSave(paper.id)}
                    variant="featured"
                  />
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-4">
              <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-hairline)' }} />
              <span style={{ fontSize: '11px', color: 'var(--color-ink-3)' }}>
                {PAPERS.length} results
              </span>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-hairline)' }} />
            </div>

            {/* Main results */}
            <div className="space-y-2">
              {mainPapers.map(paper => (
                <PaperCard
                  key={paper.id}
                  paper={paper}
                  isSelected={selectedPaperId === paper.id}
                  isSaved={savedPapers.has(paper.id)}
                  onSelect={() => onPaperSelect(paper)}
                  onToggleSave={() => onToggleSave(paper.id)}
                />
              ))}
            </div>
          </>
        )}

        {activeTab === 'Journals' && <JournalsContent />}
        {activeTab === 'Conferences' && <ConferencesContent />}
        {activeTab === 'Publications' && <PublicationsContent />}
      </div>
    </main>
  )
}

function JournalsContent() {
  return (
    <div>
      <div className="flex items-baseline gap-2 mb-4">
        <span style={{ fontSize: '9.5px', color: 'var(--color-ink-3)', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          Potential Venues
        </span>
        <span style={{ fontSize: '12px', color: 'var(--color-ink-3)' }}>
          · Based on your current paper
        </span>
      </div>
      <div className="space-y-3">
        {JOURNALS.map(j => (
          <div
            key={j.id}
            className="rounded p-4 transition-colors duration-100"
            style={{ border: '1px solid var(--color-hairline)', backgroundColor: 'var(--color-surface)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.backgroundColor = 'var(--color-surface-2)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.backgroundColor = 'var(--color-surface)' }}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 400, color: 'var(--color-ink)', marginBottom: '4px' }}>
                  {j.name}
                </h3>
                <div className="flex items-center gap-2">
                  <span
                    style={{
                      fontSize: '11px',
                      padding: '2px 8px',
                      borderRadius: '2px',
                      backgroundColor: j.matchStrength === 'strong' ? 'var(--color-forest-bg)' : 'var(--color-surface-2)',
                      color: j.matchStrength === 'strong' ? 'var(--color-forest)' : 'var(--color-ink-2)',
                      border: '1px solid var(--color-hairline)',
                    }}
                  >
                    {j.matchNote}
                  </span>
                  {j.openAccess && (
                    <span style={{ fontSize: '10.5px', fontFamily: 'var(--font-mono)', color: 'var(--color-forest)', backgroundColor: 'var(--color-forest-bg)', padding: '2px 6px', borderRadius: '2px' }}>
                      OA
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {j.scope.map(s => (
                <span key={s} style={{ fontSize: '11px', color: 'var(--color-ink-2)', backgroundColor: 'var(--color-parchment)', border: '1px solid var(--color-hairline)', padding: '2px 8px', borderRadius: '2px' }}>
                  {s}
                </span>
              ))}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-ink-3)', marginBottom: '12px' }}>
              {j.submissionType}
            </div>
            <div className="flex items-center gap-2">
              <button style={{ fontSize: '12px', padding: '5px 12px', borderRadius: '3px', border: '1px solid var(--color-hairline)', color: 'var(--color-ink-2)', backgroundColor: 'transparent', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                View Journal
              </button>
              <button style={{ fontSize: '12px', padding: '5px 12px', borderRadius: '3px', border: 'none', backgroundColor: 'var(--color-forest)', color: '#fff', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                Add to Publication Plan
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ConferencesContent() {
  return (
    <div>
      <div className="flex items-baseline gap-2 mb-4">
        <span style={{ fontSize: '9.5px', color: 'var(--color-ink-3)', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          Upcoming Conferences
        </span>
        <span style={{ fontSize: '12px', color: 'var(--color-ink-3)' }}>
          · Matched to your research areas
        </span>
      </div>
      <div className="space-y-3">
        {CONFERENCES.map(c => (
          <div
            key={c.id}
            className="rounded p-4 transition-colors duration-100"
            style={{ border: '1px solid var(--color-hairline)', backgroundColor: 'var(--color-surface)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.backgroundColor = 'var(--color-surface-2)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.backgroundColor = 'var(--color-surface)' }}
          >
            <div className="mb-1">
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 400, color: 'var(--color-ink)', marginBottom: '2px' }}>
                {c.name}
              </h3>
              <div style={{ fontSize: '12px', color: 'var(--color-ink-3)', marginBottom: '8px' }}>{c.fullName}</div>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {c.areas.map(a => (
                <span key={a} style={{ fontSize: '11px', color: 'var(--color-ink-2)', backgroundColor: 'var(--color-parchment)', border: '1px solid var(--color-hairline)', padding: '2px 8px', borderRadius: '2px' }}>
                  {a}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-3 mb-3">
              {[
                { label: 'Deadline', value: c.submissionDeadline },
                { label: 'Date', value: c.conferenceDate },
                { label: 'Location', value: c.location },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div style={{ fontSize: '9.5px', color: 'var(--color-ink-3)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '2px' }}>{label}</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-ink-2)' }}>{value}</div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button style={{ fontSize: '12px', padding: '5px 12px', borderRadius: '3px', border: '1px solid var(--color-hairline)', color: 'var(--color-ink-2)', backgroundColor: 'transparent', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                View Conference
              </button>
              <button style={{ fontSize: '12px', padding: '5px 12px', borderRadius: '3px', border: 'none', backgroundColor: 'var(--color-forest)', color: '#fff', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                Add Deadline
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function PublicationsContent() {
  return (
    <div>
      <div className="flex items-baseline gap-2 mb-4">
        <span style={{ fontSize: '9.5px', color: 'var(--color-ink-3)', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          Publications
        </span>
        <span style={{ fontSize: '12px', color: 'var(--color-ink-3)' }}>
          · Highly cited in your research area
        </span>
      </div>
      <div className="space-y-2">
        {PAPERS.slice(0, 4).map(p => (
          <div
            key={p.id}
            className="p-4 rounded transition-colors duration-100"
            style={{ border: '1px solid var(--color-hairline)', backgroundColor: 'var(--color-surface)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.backgroundColor = 'var(--color-surface-2)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.backgroundColor = 'var(--color-surface)' }}
          >
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 400, color: 'var(--color-ink)', marginBottom: '4px', lineHeight: 1.35 }}>
              {p.title}
            </h3>
            <div style={{ fontSize: '12px', color: 'var(--color-ink-3)', marginBottom: '8px' }}>
              <span style={{ color: 'var(--color-link)' }}>{p.venue}</span>
              {' · '}
              <span style={{ fontFamily: 'var(--font-mono)' }}>{p.year}</span>
            </div>
            <div className="flex items-center gap-2">
              <button style={{ fontSize: '11.5px', padding: '4px 10px', borderRadius: '3px', border: '1px solid var(--color-hairline)', color: 'var(--color-ink-2)', backgroundColor: 'transparent', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                View
              </button>
              <button style={{ fontSize: '11.5px', padding: '4px 10px', borderRadius: '3px', border: '1px solid var(--color-hairline)', color: 'var(--color-ink-2)', backgroundColor: 'transparent', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                Save
              </button>
              <button style={{ fontSize: '11.5px', padding: '4px 10px', borderRadius: '3px', border: '1px solid var(--color-hairline)', color: 'var(--color-ink-2)', backgroundColor: 'transparent', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                Cite
              </button>
              <button style={{ fontSize: '11.5px', padding: '4px 10px', borderRadius: '3px', border: '1px solid var(--color-hairline)', color: 'var(--color-ink-2)', backgroundColor: 'transparent', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                Add to Portfolio
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
