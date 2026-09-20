import { useState } from 'react'
import type { Paper } from '../data'
import { PAPERS } from '../data'

interface Props {
  paper: Paper
  onClose: () => void
  isSaved: boolean
  onToggleSave: () => void
}

const CITATION_FORMATS = ['APA', 'IEEE', 'MLA', 'BibTeX'] as const
type CitationFormat = (typeof CITATION_FORMATS)[number]

const SECTIONS = ['abstract', 'related', 'cite', 'citations', 'authors'] as const
type Section = (typeof SECTIONS)[number]

function buildCitation(paper: Paper, fmt: CitationFormat): string {
  const firstAuthorLast = paper.authors[0].split(' ').pop() ?? ''
  switch (fmt) {
    case 'APA':
      return (
        paper.authors
          .map(a => {
            const parts = a.split(' ')
            const last = parts[parts.length - 1]
            const initials = parts
              .slice(0, -1)
              .map(n => n[0] + '.')
              .join(' ')
            return `${last}, ${initials}`
          })
          .join(', ') +
        `. (${paper.year}). ${paper.title}. ${paper.venue}.`
      )
    case 'IEEE':
      return (
        paper.authors
          .map(a => {
            const p = a.split(' ')
            return p
              .slice(0, -1)
              .map(n => n[0] + '.')
              .join('') +
              ' ' +
              p[p.length - 1]
          })
          .join(', ') +
        `, "${paper.title}," ${paper.venue}, ${paper.year}.`
      )
    case 'MLA':
      return `${paper.authors.join(', ')}. "${paper.title}." ${paper.venue} (${paper.year}).`
    case 'BibTeX':
      return `@article{${firstAuthorLast.toLowerCase()}${paper.year},\n  title   = {${paper.title}},\n  author  = {${paper.authors.join(' and ')}},\n  journal = {${paper.venue}},\n  year    = {${paper.year}}\n}`
  }
}

export default function PaperDetail({ paper, onClose, isSaved, onToggleSave }: Props) {
  const [format, setFormat] = useState<CitationFormat>('APA')
  const [copied, setCopied] = useState(false)
  const [addedToWS, setAddedToWS] = useState(false)
  const [section, setSection] = useState<Section>('abstract')
  const [note, setNote] = useState('')

  const relatedPapers = PAPERS.filter(
    p => p.id !== paper.id && p.areas.some(a => paper.areas.includes(a))
  ).slice(0, 3)

  const citationText = buildCitation(paper, format)

  const handleCopy = () => {
    navigator.clipboard.writeText(citationText).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 pt-5 pb-4" style={{ borderBottom: '1px solid var(--color-hairline)' }}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {paper.openAccess && (
              <span
                style={{
                  fontSize: '10px',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 500,
                  color: 'var(--color-forest)',
                  backgroundColor: 'var(--color-forest-bg)',
                  padding: '2px 6px',
                  borderRadius: '2px',
                }}
              >
                Open Access
              </span>
            )}
            <span
              style={{
                fontSize: '10px',
                color: 'var(--color-ink-3)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {paper.citations} citations
            </span>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center rounded transition-colors"
            style={{
              width: '24px',
              height: '24px',
              color: 'var(--color-ink-3)',
              fontSize: '14px',
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--color-surface-2)' }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
          >
            ×
          </button>
        </div>

        <h2
          className="mb-2"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '17px',
            fontWeight: 400,
            color: 'var(--color-ink)',
            lineHeight: 1.35,
          }}
        >
          {paper.title}
        </h2>

        <div style={{ fontSize: '12px', color: 'var(--color-ink-2)', marginBottom: '4px' }}>
          {paper.authors.join(' · ')}
        </div>

        <div className="flex items-center gap-2 flex-wrap mb-4">
          <span style={{ fontSize: '12px', color: 'var(--color-link)' }}>{paper.venue}</span>
          <span style={{ color: 'var(--color-hairline)' }}>·</span>
          <span style={{ fontSize: '11.5px', color: 'var(--color-ink-3)', fontFamily: 'var(--font-mono)' }}>
            {paper.year}
          </span>
          {paper.doi && (
            <>
              <span style={{ color: 'var(--color-hairline)' }}>·</span>
              <span style={{ fontSize: '10.5px', color: 'var(--color-ink-3)', fontFamily: 'var(--font-mono)' }}>
                {paper.doi}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <PrimaryBtn label="Read Paper" />
          <SecondaryBtn label={isSaved ? '✓ Saved' : 'Save'} active={isSaved} onClick={onToggleSave} />
          <SecondaryBtn
            label={addedToWS ? '✓ Added' : '+ Workspace'}
            active={addedToWS}
            onClick={() => { setAddedToWS(true); setTimeout(() => setAddedToWS(false), 2000) }}
          />
          <SecondaryBtn label="Share" onClick={() => {}} />
        </div>
      </div>

      {/* Section tabs */}
      <div
        className="flex items-center gap-0.5 px-4 py-2 overflow-x-auto"
        style={{ borderBottom: '1px solid var(--color-hairline)', backgroundColor: 'var(--color-surface)' }}
      >
        {SECTIONS.map(s => (
          <button
            key={s}
            onClick={() => setSection(s)}
            className="capitalize rounded-sm px-2.5 py-1 transition-colors duration-100 whitespace-nowrap"
            style={{
              fontSize: '12px',
              color: section === s ? 'var(--color-forest)' : 'var(--color-ink-3)',
              backgroundColor: section === s ? 'var(--color-forest-bg)' : 'transparent',
              fontWeight: section === s ? '500' : '400',
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-4">

        {section === 'abstract' && (
          <div>
            {paper.connections && (
              <div
                className="mb-4 p-3 rounded"
                style={{
                  backgroundColor: 'var(--color-forest-bg)',
                  borderTop: '1px solid var(--color-hairline)',
                  borderRight: '1px solid var(--color-hairline)',
                  borderBottom: '1px solid var(--color-hairline)',
                  borderLeft: '3px solid var(--color-forest)',
                }}
              >
                <div
                  className="uppercase font-semibold tracking-wider mb-1.5"
                  style={{ fontSize: '9.5px', color: 'var(--color-forest)', letterSpacing: '0.1em' }}
                >
                  Why This Paper Matters
                </div>
                <p style={{ fontSize: '12.5px', color: 'var(--color-ink)', lineHeight: 1.6, marginBottom: '8px' }}>
                  This paper is closely related to your current project on low-resource medical image segmentation.
                </p>
                <div className="flex items-center gap-4">
                  {[
                    { n: paper.connections.workspacePages, l: 'workspace pages' },
                    { n: paper.connections.savedPapers, l: 'saved papers' },
                    { n: paper.connections.projects, l: 'active project' },
                  ].map(({ n, l }) => (
                    <div key={l} className="flex items-center gap-1">
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 500, color: 'var(--color-forest)' }}>
                        {n}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--color-forest-dim)' }}>{l}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <SectionLabel>Abstract</SectionLabel>
            <p style={{ fontSize: '13.5px', color: 'var(--color-ink)', lineHeight: 1.75, marginBottom: '20px' }}>
              {paper.abstract}
            </p>

            <SectionLabel>Research Areas</SectionLabel>
            <div className="flex flex-wrap gap-1.5 mb-5">
              {paper.areas.map(area => (
                <span
                  key={area}
                  style={{
                    fontSize: '12px',
                    color: 'var(--color-ink-2)',
                    backgroundColor: 'var(--color-parchment)',
                    border: '1px solid var(--color-hairline)',
                    padding: '3px 10px',
                    borderRadius: '2px',
                  }}
                >
                  {area}
                </span>
              ))}
            </div>

            <SectionLabel>My Notes</SectionLabel>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Add a note about this paper..."
              rows={3}
              className="w-full rounded outline-none resize-none"
              style={{
                fontSize: '12.5px',
                fontFamily: 'var(--font-body)',
                color: 'var(--color-ink)',
                backgroundColor: 'var(--color-parchment)',
                border: '1px solid var(--color-hairline)',
                padding: '10px 12px',
                lineHeight: 1.65,
                transition: 'border-color 150ms',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = 'var(--color-forest)' }}
              onBlur={e => { e.currentTarget.style.borderColor = 'var(--color-hairline)' }}
            />
          </div>
        )}

        {section === 'related' && (
          <div>
            <SectionLabel>Related Research</SectionLabel>
            <div className="space-y-2.5">
              {relatedPapers.map(rp => (
                <div
                  key={rp.id}
                  className="p-3 rounded cursor-pointer transition-colors duration-100"
                  style={{
                    border: '1px solid var(--color-hairline)',
                    backgroundColor: 'var(--color-surface)',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.backgroundColor = 'var(--color-surface-2)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.backgroundColor = 'var(--color-surface)' }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '14px',
                      color: 'var(--color-ink)',
                      lineHeight: 1.35,
                      marginBottom: '4px',
                    }}
                  >
                    {rp.title}
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--color-ink-3)', marginBottom: '4px' }}>
                    {rp.authors[0]} et al · {rp.venue} · {rp.year}
                  </div>
                  {rp.connectionNote && (
                    <div style={{ fontSize: '11px', color: 'var(--color-ink-3)', fontStyle: 'italic' }}>
                      {rp.connectionNote}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {section === 'cite' && (
          <div>
            <SectionLabel>Citation</SectionLabel>
            <div className="flex gap-1.5 mb-3">
              {CITATION_FORMATS.map(fmt => (
                <button
                  key={fmt}
                  onClick={() => setFormat(fmt)}
                  style={{
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                    padding: '3px 10px',
                    borderRadius: '3px',
                    border: '1px solid var(--color-hairline)',
                    backgroundColor: format === fmt ? 'var(--color-ink)' : 'transparent',
                    color: format === fmt ? '#fff' : 'var(--color-ink-2)',
                    cursor: 'pointer',
                    transition: 'background-color 120ms',
                  }}
                >
                  {fmt}
                </button>
              ))}
            </div>
            <div
              className="rounded mb-3"
              style={{
                backgroundColor: 'var(--color-parchment)',
                border: '1px solid var(--color-hairline)',
                padding: '12px 14px',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                color: 'var(--color-ink)',
                lineHeight: 1.7,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
              }}
            >
              {citationText}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="flex-1 rounded-sm font-medium transition-colors"
                style={{
                  fontSize: '12px',
                  padding: '7px 12px',
                  backgroundColor: copied ? 'var(--color-forest)' : 'var(--color-ink)',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 150ms',
                }}
              >
                {copied ? '✓ Citation Copied' : 'Copy Citation'}
              </button>
              <button
                style={{
                  fontSize: '12px',
                  padding: '7px 12px',
                  borderRadius: '3px',
                  border: '1px solid var(--color-hairline)',
                  color: 'var(--color-ink-2)',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                }}
              >
                Export BibTeX
              </button>
            </div>
            <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--color-hairline)' }}>
              <button
                style={{
                  fontSize: '12px',
                  color: 'var(--color-forest)',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Add to Reference Library →
              </button>
            </div>
          </div>
        )}

        {section === 'citations' && (
          <div>
            <SectionLabel>Citation Count</SectionLabel>
            <div
              className="rounded flex flex-col items-center justify-center py-6 mb-4"
              style={{ border: '1px solid var(--color-hairline)', backgroundColor: 'var(--color-surface)' }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '40px',
                  fontWeight: 500,
                  color: 'var(--color-ink)',
                  lineHeight: 1,
                }}
              >
                {paper.citations}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--color-ink-3)', marginTop: '4px' }}>
                citations
              </div>
            </div>
            <SectionLabel>Reference Stats</SectionLabel>
            <div className="space-y-2">
              {[
                { label: 'Used in Literature Review', count: 1 },
                { label: 'Used in Thesis Chapter 2', count: 1 },
                { label: 'Used in Research Proposal', count: 1 },
              ].map(ref => (
                <div
                  key={ref.label}
                  className="flex items-center justify-between py-2"
                  style={{ borderBottom: '1px solid var(--color-hairline)' }}
                >
                  <span style={{ fontSize: '12.5px', color: 'var(--color-ink-2)' }}>{ref.label}</span>
                  <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-ink-3)' }}>
                    {ref.count}×
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {section === 'authors' && (
          <div>
            <SectionLabel>Authors</SectionLabel>
            <div className="space-y-2.5">
              {paper.authors.map(author => (
                <div
                  key={author}
                  className="flex items-center gap-3 p-3 rounded"
                  style={{ border: '1px solid var(--color-hairline)', backgroundColor: 'var(--color-surface)' }}
                >
                  <div
                    className="rounded-full flex items-center justify-center font-semibold flex-shrink-0"
                    style={{
                      width: '32px',
                      height: '32px',
                      backgroundColor: 'var(--color-forest-bg)',
                      color: 'var(--color-forest)',
                      fontSize: '11px',
                    }}
                  >
                    {author.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-ink)' }}>{author}</div>
                    <div style={{ fontSize: '11.5px', color: 'var(--color-ink-3)' }}>Research Institution</div>
                  </div>
                  <button
                    style={{
                      fontSize: '11.5px',
                      padding: '3px 10px',
                      borderRadius: '3px',
                      border: '1px solid var(--color-hairline)',
                      color: 'var(--color-ink-2)',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--color-surface-2)' }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
                  >
                    Follow
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="uppercase font-semibold tracking-wider mb-2"
      style={{ fontSize: '9.5px', color: 'var(--color-ink-3)', letterSpacing: '0.12em' }}
    >
      {children}
    </div>
  )
}

function PrimaryBtn({ label }: { label: string }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        fontSize: '12px',
        fontFamily: 'var(--font-body)',
        fontWeight: 500,
        padding: '5px 14px',
        borderRadius: '3px',
        border: 'none',
        backgroundColor: hov ? 'var(--color-forest)' : 'var(--color-ink)',
        color: '#fff',
        cursor: 'pointer',
        transition: 'background-color 150ms',
      }}
    >
      {label}
    </button>
  )
}

function SecondaryBtn({ label, active, onClick }: { label: string; active?: boolean; onClick: () => void }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        fontSize: '12px',
        fontFamily: 'var(--font-body)',
        padding: '5px 12px',
        borderRadius: '3px',
        border: '1px solid var(--color-hairline)',
        backgroundColor: active ? 'var(--color-forest-bg)' : hov ? 'var(--color-surface-2)' : 'transparent',
        color: active ? 'var(--color-forest)' : 'var(--color-ink-2)',
        cursor: 'pointer',
        transition: 'background-color 120ms, color 120ms',
      }}
    >
      {label}
    </button>
  )
}
