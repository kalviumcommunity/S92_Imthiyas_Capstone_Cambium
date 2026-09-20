import { useState } from "react";
import SectionWrapper, { ComponentGroup } from "@/components/SectionWrapper";

function Modal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-ink/20 backdrop-blur-[2px]" />
      <div
        className="relative bg-surface rounded-xl border border-line shadow-xl w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-line">
          <h2 className="font-serif text-ink font-medium">Create new project</h2>
          <button onClick={onClose} className="text-ink-3 hover:text-ink transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div className="px-5 py-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-ink-2 mb-1.5">Project title</label>
            <input
              className="w-full px-3 py-2 text-sm rounded-md border border-line focus:border-navy focus:ring-2 focus:ring-navy-light outline-none transition-all"
              placeholder="Enter a descriptive title…"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-2 mb-1.5">Research area</label>
            <div className="relative">
              <select className="w-full px-3 py-2 text-sm rounded-md border border-line focus:border-navy outline-none appearance-none pr-8">
                <option>Machine Learning</option>
                <option>Medical Imaging</option>
                <option>Privacy & Security</option>
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-3 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-2 mb-1.5">Description <span className="text-ink-3 font-normal">(optional)</span></label>
            <textarea
              className="w-full px-3 py-2 text-sm rounded-md border border-line focus:border-navy focus:ring-2 focus:ring-navy-light outline-none transition-all resize-none"
              rows={3}
              placeholder="What is this project about?"
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-line">
          <button onClick={onClose} className="px-4 py-2 text-sm text-ink-2 border border-line hover:border-line-2 rounded-md transition-colors font-medium">
            Cancel
          </button>
          <button className="px-4 py-2 text-sm bg-navy text-white hover:bg-navy-mid rounded-md transition-colors font-medium">
            Create project
          </button>
        </div>
      </div>
    </div>
  );
}

function ConfirmationDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-ink/20 backdrop-blur-[2px]" />
      <div
        className="relative bg-surface rounded-xl border border-line shadow-xl w-full max-w-sm p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-10 h-10 bg-crimson-light rounded-xl flex items-center justify-center mb-4">
          <svg className="w-5 h-5 text-crimson" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01"/>
          </svg>
        </div>
        <h2 className="font-serif text-ink font-medium mb-2">Delete project?</h2>
        <p className="text-sm text-ink-3 leading-relaxed mb-5">
          This will permanently delete <strong className="text-ink font-medium">Privacy-Preserving ML</strong> and all its research blocks, notes, and linked papers. This action cannot be undone.
        </p>
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2 text-sm border border-line text-ink-2 hover:border-line-2 rounded-md transition-colors font-medium">
            Keep project
          </button>
          <button className="flex-1 py-2 text-sm bg-crimson text-white hover:opacity-90 rounded-md transition-colors font-medium">
            Delete project
          </button>
        </div>
      </div>
    </div>
  );
}

function TooltipExample() {
  return (
    <div className="flex items-center gap-10 py-6">
      {[
        { label: "Citations", tip: "Number of times this paper has been cited" },
        { label: "h-index", tip: "A researcher's h-index based on their publications and citations" },
        { label: "Impact factor", tip: "Average number of citations per paper in the journal" },
      ].map(({ label, tip }) => (
        <div key={label} className="relative group flex flex-col items-center gap-1">
          <button className="flex items-center gap-1 text-sm text-ink-2 border-b border-dashed border-line-2 hover:border-navy hover:text-navy transition-colors">
            {label}
            <svg className="w-3 h-3 text-ink-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
              <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01"/>
            </svg>
          </button>
          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <div className="bg-ink text-white text-[11px] leading-relaxed px-3 py-2 rounded-lg whitespace-nowrap max-w-[180px] text-center shadow-lg">
              {tip}
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-ink" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function DropdownMenu() {
  const [open, setOpen] = useState(false);
  const items = [
    { label: "View paper", icon: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6" },
    { label: "Add to reading list", icon: "M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" },
    { label: "Copy citation", icon: "M8 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1M8 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M8 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m0 0h2a2 2 0 0 1 2 2v3m2 4H10m0 0l3-3m-3 3l3 3" },
    { label: "Share", icon: "M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13", divider: false },
    { label: "Remove from project", icon: "M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2", danger: true, divider: true },
  ];
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-ink-2 border border-line hover:border-line-2 rounded-md transition-colors font-medium"
      >
        Options
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>
      {open && (
        <div className="absolute top-full mt-1.5 left-0 bg-surface border border-line rounded-lg shadow-lg w-52 py-1 z-10">
          {items.map(({ label, icon, danger, divider }) => (
            <div key={label}>
              {divider && <div className="h-px bg-line my-1" />}
              <button className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors text-left ${danger ? "text-crimson hover:bg-crimson-light" : "text-ink-2 hover:bg-surface-2 hover:text-ink"}`}>
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <path d={icon}/>
                </svg>
                {label}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  const commands = [
    { label: "Create new project", shortcut: "⌘N", cat: "Quick actions" },
    { label: "Open search", shortcut: "⌘K", cat: "Quick actions" },
    { label: "Go to Research Workspace", shortcut: "", cat: "Navigation" },
    { label: "Go to Opportunities", shortcut: "", cat: "Navigation" },
    { label: "Add citation to current page", shortcut: "", cat: "Workspace" },
    { label: "Export current document as PDF", shortcut: "", cat: "Workspace" },
  ];
  const grouped = commands.reduce((acc, cmd) => {
    if (!acc[cmd.cat]) acc[cmd.cat] = [];
    acc[cmd.cat].push(cmd);
    return acc;
  }, {} as Record<string, typeof commands>);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-ink/15 backdrop-blur-[2px]" />
      <div
        className="relative bg-surface rounded-xl border border-line shadow-2xl w-full max-w-lg overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-line">
          <svg className="w-4 h-4 text-ink-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input autoFocus className="flex-1 text-sm text-ink placeholder:text-ink-3 outline-none" placeholder="Type a command or search…" />
          <kbd className="text-[10px] text-ink-3 bg-surface-2 border border-line px-1.5 py-0.5 rounded font-mono">Esc</kbd>
        </div>
        <div className="max-h-72 overflow-y-auto py-2">
          {Object.entries(grouped).map(([cat, cmds]) => (
            <div key={cat}>
              <p className="text-[10px] text-ink-3 uppercase tracking-widest px-4 py-1.5">{cat}</p>
              {cmds.map((cmd, i) => (
                <div key={cmd.label} className={`flex items-center gap-3 px-4 py-2 cursor-pointer transition-colors ${i === 0 && cat === "Quick actions" ? "bg-surface-2" : "hover:bg-surface-2"}`}>
                  <svg className="w-4 h-4 text-ink-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                  <span className="flex-1 text-sm text-ink-2">{cmd.label}</span>
                  {cmd.shortcut && (
                    <kbd className="text-[10px] text-ink-3 bg-surface-3 border border-line px-1.5 py-0.5 rounded font-mono">{cmd.shortcut}</kbd>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="px-4 py-2 border-t border-line flex items-center gap-4 text-[10px] text-ink-3 bg-surface-2">
          <span className="flex items-center gap-1"><kbd className="bg-surface border border-line px-1 rounded font-mono">↑↓</kbd> Navigate</span>
          <span className="flex items-center gap-1"><kbd className="bg-surface border border-line px-1 rounded font-mono">↵</kbd> Run</span>
          <span className="flex items-center gap-1"><kbd className="bg-surface border border-line px-1 rounded font-mono">Esc</kbd> Close</span>
        </div>
      </div>
    </div>
  );
}

function Popover() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-2 text-sm text-ink-2 border border-line hover:border-line-2 rounded-md transition-colors font-medium"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
        Add collaborators
      </button>
      {open && (
        <div className="absolute top-full mt-2 left-0 bg-surface border border-line rounded-xl shadow-lg w-64 p-3 z-10">
          <p className="text-xs text-ink-3 mb-2">Invite by name or email</p>
          <input className="w-full px-3 py-2 text-xs border border-line rounded-md outline-none focus:border-navy focus:ring-1 focus:ring-navy-light mb-2 placeholder:text-ink-3" placeholder="Search researchers…" />
          {[
            { name: "Dr. James Kim", role: "Researcher · Stanford" },
            { name: "Dr. Sarah Patel", role: "Postdoc · Oxford" },
          ].map(({ name, role }) => (
            <div key={name} className="flex items-center gap-2.5 px-2 py-2 rounded hover:bg-surface-2 cursor-pointer transition-colors">
              <div className="w-6 h-6 rounded-full bg-navy-light text-navy flex items-center justify-center text-[9px] font-bold">
                {name.split(" ").slice(-1)[0][0]}
              </div>
              <div>
                <p className="text-xs font-medium text-ink">{name}</p>
                <p className="text-[10px] text-ink-3">{role}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function OverlaysSection() {
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);

  return (
    <SectionWrapper
      id="overlays"
      number="15"
      title="Overlays"
      description="Modals, popovers, tooltips, and menus. Subtle shadow hierarchy and clear focus management."
    >
      <ComponentGroup label="Modal" note="Click to open the Create Project modal">
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 text-sm bg-navy text-white hover:bg-navy-mid rounded-md transition-colors font-medium"
        >
          Open modal →
        </button>
        <Modal open={modalOpen} onClose={() => setModalOpen(false)} />
      </ComponentGroup>

      <ComponentGroup label="Confirmation Dialog" note="Destructive action confirmation">
        <button
          onClick={() => setConfirmOpen(true)}
          className="px-4 py-2 text-sm bg-crimson text-white hover:opacity-90 rounded-md transition-colors font-medium"
        >
          Delete project
        </button>
        <ConfirmationDialog open={confirmOpen} onClose={() => setConfirmOpen(false)} />
      </ComponentGroup>

      <ComponentGroup label="Tooltips" note="Hover over the underlined terms">
        <TooltipExample />
      </ComponentGroup>

      <ComponentGroup label="Dropdown Menu" note="Contextual actions for research artifacts">
        <DropdownMenu />
      </ComponentGroup>

      <ComponentGroup label="Popover" note="Inline panel for contextual interactions">
        <Popover />
      </ComponentGroup>

      <ComponentGroup label="Command Palette" note="⌘K global command palette — click to open">
        <button
          onClick={() => setCmdOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm text-ink-2 border border-line hover:border-line-2 rounded-md transition-colors font-medium"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          Open command palette
          <kbd className="ml-1 text-[10px] text-ink-3 bg-surface-2 border border-line px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
        </button>
        <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />
      </ComponentGroup>
    </SectionWrapper>
  );
}
