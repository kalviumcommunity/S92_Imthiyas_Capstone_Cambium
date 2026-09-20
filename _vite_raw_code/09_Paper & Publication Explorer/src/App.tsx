import { useState } from 'react'
import Sidebar from './components/Sidebar'
import PaperExplorer from './components/PaperExplorer'
import PaperDetail from './components/PaperDetail'
import RightRail from './components/RightRail'
import type { Paper } from './data'

export default function App() {
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null)
  const [savedPapers, setSavedPapers] = useState<Set<string>>(new Set())

  const toggleSave = (id: string) => {
    setSavedPapers(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ backgroundColor: 'var(--color-parchment)' }}
    >
      <Sidebar />

      <PaperExplorer
        onPaperSelect={setSelectedPaper}
        selectedPaperId={selectedPaper?.id}
        savedPapers={savedPapers}
        onToggleSave={toggleSave}
      />

      <div
        className="flex-shrink-0 overflow-y-auto transition-all duration-300"
        style={{
          width: selectedPaper ? '420px' : '300px',
          borderLeft: '1px solid var(--color-hairline)',
          backgroundColor: 'var(--color-surface)',
        }}
      >
        {selectedPaper ? (
          <PaperDetail
            paper={selectedPaper}
            onClose={() => setSelectedPaper(null)}
            isSaved={savedPapers.has(selectedPaper.id)}
            onToggleSave={() => toggleSave(selectedPaper.id)}
          />
        ) : (
          <RightRail />
        )}
      </div>
    </div>
  )
}
