import { useState } from 'react'
import type { Paper } from '../data'

interface Props {
  paper: Paper
  isSelected: boolean
  isSaved: boolean
  onSelect: () => void
  onToggleSave: () => void
  variant?: 'default' | 'featured'
}

export default function PaperCard({ paper, isSelected, isSaved, onSelect, onToggleSave, variant = 'default' }: Props) {
  const [hovered, setHovered] = useState(false)
  const [citeCopied, setCiteCopied] = useState(false)
  const [addedToWS, setAddedToWS] = useState(false)

  const handleCite = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCiteCopied(true)
    setTimeout(() => setCiteCopied(false), 2000)
  }

  const handleAddToWS = (e: React.MouseEvent) => {
    e.stopPropagation()
    setAddedToWS(true)
    setTimeout(() => setAddedToWS(false), 2000)
  }

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation()
    onToggleSave()
  }

  const bgColor = isSelected
    ? 'var(--color-forest-bg)'
    : hovered
    ? 'var(--color-surface-2)'
    : 'var(--color-surface)'

  const borderColor = isSelected ? 'var(--color-forest)' : 'var(--color-hairline)'

  return (
    <article
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="rounded cursor-pointer transition-all duration-150"
      style={{
        padding: variant === 'featured' ? '14px 16px' : '12px 16px',
        backgroundColor: bgColor,
        border: `1px solid ${borderColor}`,
        outline: isSelected ? `1px solid var(--color-forest)` : 'none',
      }}
    >
      {/* Title row */}
      <div className="flex items-start justify-between gap-3 mb-1.5">
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: variant === 'featured' ? '16.5px' : '15px',
            fontWeight: 400,
            color: 'var(--color-ink)',
            lineHeight: 1.35,
          }}
        >
          {paper.title}
        </h3>
        <div className="flex items-center gap-1.5 flex-shrink-0 pt-0.5">
          {paper.openAccess && (
            <span
              style={{
                fontSize: '10px',
                fontFamily: 'var(--font-mono)',
                fontWeight: 500,
                color: 'var(--color-forest)',
                backgroundColor: 'var(--color-forest-bg)',
                padding: '2px 5px',
                borderRadius: '2px',
              }}
            >
              OA
            </span>
          )}
        </div>
      </div>

      {/* Authors */}
      <div style={{ fontSize: '12px', color: 'var(--color-ink-2)', marginBottom: '6px' }}>
        {paper.authors.join(' · ')}
      </div>

      {/* Venue · Year · Citations */}
      <div className="flex items-center gap-2 flex-wrap mb-2.5">
        <span style={{ fontSize: '12px', color: 'var(--color-link)' }}>{paper.venue}</span>
        <span style={{ color: 'var(--color-hairline)', fontSize: '12px' }}>·</span>
        <span style={{ fontSize: '11.5px', color: 'var(--color-ink-3)', fontFamily: 'var(--font-mono)' }}>
          {paper.year}
        </span>
        <span style={{ color: 'var(--color-hairline)', fontSize: '12px' }}>·</span>
        <span style={{ fontSize: '11.5px', color: 'var(--color-ink-3)', fontFamily: 'var(--font-mono)' }}>
          {paper.citations} citations
        </span>
      </div>

      {/* Abstract excerpt */}
      <p
        style={{
          fontSize: '13px',
          color: 'var(--color-ink-2)',
          lineHeight: 1.65,
          marginBottom: '10px',
        }}
      >
        {paper.abstract.slice(0, 190)}…
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-2.5">
        {paper.areas.map(area => (
          <span
            key={area}
            style={{
              fontSize: '11px',
              color: 'var(--color-ink-2)',
              backgroundColor: 'var(--color-parchment)',
              border: '1px solid var(--color-hairline)',
              padding: '2px 8px',
              borderRadius: '2px',
            }}
          >
            {area}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div
        className="flex items-center gap-1.5 flex-wrap"
        style={{ transition: 'opacity 150ms', opacity: hovered || isSelected ? 1 : 0.75 }}
      >
        <Btn onClick={e => e.stopPropagation()} label="Read" variant="primary" />
        <Btn onClick={handleSave} label={isSaved ? '✓ Saved' : 'Save'} active={isSaved} />
        <Btn onClick={handleCite} label={citeCopied ? '✓ Cited' : 'Cite'} active={citeCopied} />
        <Btn onClick={handleAddToWS} label={addedToWS ? '✓ Added' : '+ Workspace'} active={addedToWS} />
        {(paper.connectionNote || paper.relevanceNote) && (
          <div
            className="flex items-center gap-1 ml-auto"
            style={{ fontSize: '11px', color: 'var(--color-ink-3)', maxWidth: '200px' }}
          >
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
            </svg>
            <span style={{ lineHeight: 1.4 }}>{paper.connectionNote || paper.relevanceNote}</span>
          </div>
        )}
      </div>
    </article>
  )
}

function Btn({
  onClick,
  label,
  variant,
  active,
}: {
  onClick: (e: React.MouseEvent) => void
  label: string
  variant?: 'primary'
  active?: boolean
}) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        fontSize: '11.5px',
        fontFamily: 'var(--font-body)',
        padding: '3px 10px',
        borderRadius: '3px',
        border: variant === 'primary' ? 'none' : '1px solid var(--color-hairline)',
        backgroundColor: variant === 'primary'
          ? hov ? 'var(--color-forest)' : 'var(--color-ink)'
          : active
          ? 'var(--color-forest-bg)'
          : hov
          ? 'var(--color-surface-2)'
          : 'transparent',
        color: variant === 'primary'
          ? '#fff'
          : active
          ? 'var(--color-forest)'
          : 'var(--color-ink-2)',
        fontWeight: variant === 'primary' ? '500' : '400',
        transition: 'background-color 120ms, color 120ms',
        cursor: 'pointer',
      }}
    >
      {label}
    </button>
  )
}
