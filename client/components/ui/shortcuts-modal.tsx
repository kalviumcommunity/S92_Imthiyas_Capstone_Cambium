"use client";

import React, { useState, useEffect, useRef } from "react";
import { Keyboard, X, Search, Command } from "lucide-react";

interface ShortcutGroup {
  category: string;
  items: { key: string; description: string }[];
}

const SHORTCUT_GROUPS: ShortcutGroup[] = [
  {
    category: "Global Navigation & Search",
    items: [
      { key: "⌘ K / Ctrl K", description: "Open Global Universal Command Palette" },
      { key: "? or ⌘ /", description: "Open this Keyboard Shortcuts Map" },
      { key: "Esc", description: "Close active modal, palette, or drawer" },
      { key: "⌘ B", description: "Toggle Global Navigation Sidebar open/pinned" },
      { key: "G then D", description: "Go to Discover Research Engine" },
      { key: "G then W", description: "Go to Research Workspace" },
      { key: "G then O", description: "Go to Opportunities Directory" },
    ],
  },
  {
    category: "Research Workspace & Notebooks",
    items: [
      { key: "⌘ S", description: "Force sync changes to Cloud Registry" },
      { key: "⌘ \\", description: "Toggle Split-Screen multi-pane view" },
      { key: "⌘ N", description: "Create a fresh Research Note scratchpad" },
      { key: "⌘ E", description: "Open Citation & Bibliography Exporter" },
      { key: "⌘ Shift F", description: "Toggle distraction-free Fullscreen workspace" },
      { key: "⌘ Enter", description: "Run inline AI Literature Synthesis on selection" },
    ],
  },
  {
    category: "Literature Reader & Annotations",
    items: [
      { key: "H", description: "Highlight selected passage in current color" },
      { key: "N", description: "Attach margin note to highlighted range" },
      { key: "C", description: "Instant copy formatted citation (APA/BibTeX)" },
      { key: "J / K", description: "Jump to Next / Previous paper section" },
      { key: "F", description: "Find text within document viewer" },
    ],
  },
  {
    category: "Data Governance & Tables",
    items: [
      { key: "⌘ A", description: "Select all papers or opportunities in list" },
      { key: "Delete", description: "Open Destructive Action Confirmation modal" },
      { key: "⌘ Shift E", description: "Bulk export selected items as RIS / BibTeX" },
    ],
  },
];

export function ShortcutsModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if (
        !isInput &&
        (e.key === "?" ||
          ((e.metaKey || e.ctrlKey) && (e.key === "/" || e.key === "?")))
      ) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    const handleCustomOpen = () => setIsOpen(true);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-shortcuts-modal", handleCustomOpen);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-shortcuts-modal", handleCustomOpen);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 60);
    } else {
      setSearch("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const q = search.toLowerCase().trim();
  const filteredGroups = SHORTCUT_GROUPS.map((g) => ({
    ...g,
    items: g.items.filter(
      (item) =>
        item.description.toLowerCase().includes(q) ||
        item.key.toLowerCase().includes(q)
    ),
  })).filter((g) => g.items.length > 0);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-modal-title"
      className="fixed inset-0 z-[170] flex items-center justify-center p-4 bg-[#17201D]/60 backdrop-blur-md animate-in fade-in duration-150"
      onClick={() => setIsOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-[#FAF7F0] border border-[#E4DCCB] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E4DCCB] bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF7F0] border border-[#E4DCCB] flex items-center justify-center text-[#3E6248] shadow-2xs">
              <Keyboard size={20} />
            </div>
            <div>
              <span className="font-mono text-[10px] font-bold text-[#3E6248] uppercase tracking-widest block">
                Platform Affordances
              </span>
              <h2
                id="shortcuts-modal-title"
                className="font-serif text-2xl font-normal text-[#202920]"
              >
                Keyboard Shortcuts
              </h2>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg text-[#85877B] hover:text-[#202920] hover:bg-[#FAF7F0] transition-colors border-0 bg-transparent cursor-pointer"
            aria-label="Close shortcuts modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search inside shortcuts */}
        <div className="px-6 py-3 border-b border-[#E4DCCB] bg-[#FAF7F0]">
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#85877B]"
            />
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search hotkeys or descriptions..."
              className="w-full pl-9 pr-4 py-2 text-xs font-sans text-[#202920] placeholder:text-[#85877B] bg-white border border-[#E4DCCB] rounded-xl focus:outline-none focus:border-[#3E6248] transition-colors"
            />
          </div>
        </div>

        {/* Body / Shortcut list */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {filteredGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-2.5">
              <h3 className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#3E6248]">
                {group.category}
              </h3>
              <div className="rounded-xl border border-[#E4DCCB] bg-white divide-y divide-[#E4DCCB]/60 shadow-2xs overflow-hidden">
                {group.items.map((item, iIdx) => (
                  <div
                    key={iIdx}
                    className="flex items-center justify-between px-4 py-2.5 text-xs font-sans hover:bg-[#FAF7F0]/60 transition-colors"
                  >
                    <span className="text-[#202920] font-medium">
                      {item.description}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {item.key.split(" / ").map((subKey, kIdx) => (
                        <kbd
                          key={kIdx}
                          className="px-2 py-1 rounded-md bg-[#FAF7F0] border border-[#E4DCCB] font-mono text-[11px] font-bold text-[#202920] shadow-2xs whitespace-nowrap"
                        >
                          {subKey}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {filteredGroups.length === 0 && (
            <div className="text-center py-10">
              <Command size={24} className="mx-auto text-[#85877B] mb-2" />
              <p className="font-serif text-sm text-[#202920]">
                No matching shortcuts found
              </p>
              <p className="font-serif text-xs text-[#62685E] mt-1">
                Try searching for &quot;workspace&quot;, &quot;search&quot;, or &quot;citation&quot;.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#E4DCCB] bg-white flex items-center justify-between text-[11px] font-mono text-[#85877B]">
          <span>Press &ldquo;?&rdquo; anytime to toggle this map</span>
          <span className="text-[#3E6248] font-semibold">Cambium Desktop Engine</span>
        </div>
      </div>
    </div>
  );
}
