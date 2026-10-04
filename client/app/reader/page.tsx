"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Bookmark,
  PlusSquare,
  Quote,
  Share2,
  PanelRightClose,
  PanelRightOpen,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Search,
  Sparkles,
  FileText,
  Copy,
  Highlighter,
  MessageSquarePlus,
  RotateCcw,
  Check,
  X,
  AlertCircle,
  Smartphone,
  Monitor,
  Send,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Frame = "default" | "intelligence" | "notes" | "selection" | "saved" | "error";

type Paper = {
  title: string;
  authors: string;
  venue: string;
  year: string;
  doi: string;
  pages: number;
};

type Note = {
  id: number;
  type: "key-takeaway" | "research-question" | "action-item" | "private";
  text: string;
  page: string;
  highlight?: string;
  time: string;
};

// ─── Static Data ──────────────────────────────────────────────────────────────

const PAPER_DATA: Paper = {
  title: "Attention Is All You Need: Revisiting Transformer Architectures for Long-Context Reasoning",
  authors: "Vaswani, A., Shazeer, N., Parmar, N., Uszkoreit, J., Jones, L., Gomez, A. N., Kaiser, Ł., & Polosukhin, I.",
  venue: "Neural Information Processing Systems (NeurIPS)",
  year: "2024",
  doi: "10.48550/arXiv.2024.17823",
  pages: 42,
};

const DOCUMENT_SECTIONS = [
  {
    id: "abstract",
    title: "Abstract",
    content:
      "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely. Experiments on two machine translation tasks show these models to be superior in quality while being more parallelizable and requiring significantly less time to train.",
  },
  {
    id: "introduction",
    title: "1. Introduction",
    content:
      "Recurrent neural networks, long short-term memory and gated recurrent neural networks in particular, have been firmly established as state of the art approaches in sequence modeling and transduction problems such as language modeling and machine translation. Numerous efforts have since continued to push the boundaries of recurrent language models and encoder-decoder architectures.\n\nAttention mechanisms have become an integral part of compelling sequence modeling and transduction models in various tasks, allowing modeling of dependencies without regard to their distance in the input or output sequences. In all but a few cases, however, such attention mechanisms are used in conjunction with a recurrent network.\n\nIn this work we propose the Transformer, a model architecture eschewing recurrence and instead relying entirely on an attention mechanism to draw global dependencies between input and output. The Transformer allows for significantly more parallelization and can reach a new state of the art in translation quality after being trained for as little as twelve hours on eight P100 GPUs.",
  },
  {
    id: "background",
    title: "2. Background",
    content:
      "The goal of reducing sequential computation also forms the foundation of the Extended Neural GPU, ByteNet and ConvS2S, all of which use convolutional neural networks as basic building block, computing hidden representations in parallel for all input and output positions. In these models, the number of operations required to relate signals from two arbitrary input or output positions grows in the distance between positions, linearly for ConvS2S and logarithmically for ByteNet.\n\nSelf-attention, sometimes called intra-attention is an attention mechanism relating different positions of a single sequence in order to compute a representation of the sequence. Self-attention has been used successfully in a variety of tasks including reading comprehension, abstractive summarization, textual entailment and learning task-independent sentence representations.",
  },
  {
    id: "architecture",
    title: "3. Model Architecture",
    content:
      "Most competitive neural sequence transduction models have an encoder-decoder structure. Here, the encoder maps an input sequence of symbol representations to a sequence of continuous representations. Given this representation, the decoder then generates an output sequence of symbols one element at a time. At each step the model is auto-regressive, consuming the previously generated symbols as additional input when generating the next.\n\nThe Transformer follows this overall architecture using stacked self-attention and point-wise, fully connected layers for both the encoder and decoder, shown in the left and right halves of Figure 1, respectively.",
  },
];

const INITIAL_NOTES: Note[] = [
  {
    id: 1,
    type: "key-takeaway",
    text: "Self-attention allows O(1) path length between any two positions — critical for long-range dependencies.",
    page: "p. 4",
    highlight: "attention mechanism to draw global dependencies",
    time: "2h ago",
  },
  {
    id: 2,
    type: "research-question",
    text: "How does positional encoding scale beyond the training sequence length? Worth exploring sinusoidal vs learned.",
    page: "p. 5",
    time: "1h ago",
  },
];

const AI_RESPONSE = {
  summary:
    "This paper introduces the Transformer architecture, replacing recurrent and convolutional layers entirely with self-attention mechanisms. The key innovation is multi-head attention, which allows the model to jointly attend to information from different representation subspaces. Results show BLEU score improvements of 2+ points over existing ensemble models on English-to-German translation.",
  pages: ["Abstract", "p. 3–4", "p. 7"],
};

const NOTE_TYPE_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; border: string }
> = {
  "key-takeaway": {
    label: "Key Takeaway",
    bg: "bg-moss-100 text-moss-700 border-moss-500",
    text: "text-moss-700",
    border: "#285C4D",
  },
  "research-question": {
    label: "Research Question",
    bg: "bg-amber-50 text-amber-800 border-amber-400",
    text: "text-amber-800",
    border: "#B07D3A",
  },
  "action-item": {
    label: "Action Item",
    bg: "bg-blue-50 text-blue-800 border-blue-300",
    text: "text-blue-800",
    border: "#3A5FA0",
  },
  private: {
    label: "Private Note",
    bg: "bg-surface-sunken text-ink-secondary border-edge-default",
    text: "text-ink-secondary",
    border: "#DDE2DE",
  },
};

const FRAMES: { id: Frame; label: string }[] = [
  { id: "default", label: "1 · Default" },
  { id: "intelligence", label: "2 · AI Intelligence Open" },
  { id: "notes", label: "3 · Notes Open" },
  { id: "selection", label: "4 · Text Selection" },
  { id: "saved", label: "5 · Saved State" },
  { id: "error", label: "6 · Error / Unavailable" },
];

// ─── Main Page Component ──────────────────────────────────────────────────────

export default function ReaderPage() {
  // Frame state controls
  const [activeFrame, setActiveFrame] = useState<Frame>("default");
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  // Document state
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [isSaved, setIsSaved] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"intelligence" | "notes">("intelligence");
  const [panelOpen, setPanelOpen] = useState(true);
  const [showCiteMenu, setShowCiteMenu] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Highlighting & selection state
  const [selectionActive, setSelectionActive] = useState(false);
  const [selectionCoords, setSelectionCoords] = useState<{ x: number; y: number } | null>(null);
  const [selectedText, setSelectedText] = useState<string>(
    "attention mechanism to draw global dependencies between input and output"
  );
  const [isHighlighted, setIsHighlighted] = useState(false);

  // Intelligence panel state
  const [aiQuery, setAiQuery] = useState("");
  const [showAiResponse, setShowAiResponse] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Notes state
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);
  const [newNoteText, setNewNoteText] = useState("");
  const [newNoteType, setNewNoteType] = useState<Note["type"]>("key-takeaway");

  // Mobile sheet state
  const [mobileSheet, setMobileSheet] = useState<"none" | "intelligence" | "notes">("none");

  const docContainerRef = useRef<HTMLDivElement>(null);

  // Sync state when active frame changes from switcher
  useEffect(() => {
    if (activeFrame === "intelligence") {
      setPanelOpen(true);
      setActiveTab("intelligence");
      setShowAiResponse(true);
      setSelectionActive(false);
    } else if (activeFrame === "notes") {
      setPanelOpen(true);
      setActiveTab("notes");
      setSelectionActive(false);
    } else if (activeFrame === "selection") {
      setSelectionActive(true);
      setSelectedText("attention mechanism to draw global dependencies between input and output");
    } else if (activeFrame === "saved") {
      setIsSaved(true);
      setSelectionActive(false);
    } else if (activeFrame === "default") {
      setSelectionActive(false);
    }
  }, [activeFrame]);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  }, []);

  // Handle native user text selection
  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 3) {
      const text = selection.toString().trim();
      setSelectedText(text);
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setSelectionCoords({
        x: rect.left + rect.width / 2,
        y: rect.top - 10,
      });
      setSelectionActive(true);
    }
  };

  const handleAskIntelligence = (customText?: string) => {
    const queryTarget = customText || selectedText;
    setSelectionActive(false);
    setPanelOpen(true);
    setActiveTab("intelligence");
    setAiQuery(`What is the significance of: "${queryTarget.slice(0, 80)}..."?`);
    setIsAiLoading(true);
    setTimeout(() => {
      setIsAiLoading(false);
      setShowAiResponse(true);
    }, 600);
  };

  const handleAddNoteFromSelection = (customText?: string) => {
    const textTarget = customText || selectedText;
    setSelectionActive(false);
    setPanelOpen(true);
    setActiveTab("notes");
    setNewNoteText(`Note on quote: "${textTarget}"\n`);
  };

  const handleCopyQuote = (customText?: string) => {
    const textTarget = customText || selectedText;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textTarget);
    }
    setSelectionActive(false);
    showToast("Quote copied to clipboard");
  };

  const handleToggleHighlight = () => {
    setIsHighlighted((prev) => !prev);
    setSelectionActive(false);
    showToast(isHighlighted ? "Highlight removed" : "Text highlighted");
  };

  const handleAddNoteSubmit = () => {
    if (!newNoteText.trim()) return;
    const newNote: Note = {
      id: Date.now(),
      type: newNoteType,
      text: newNoteText.trim(),
      page: `p. ${currentPage}`,
      time: "just now",
    };
    setNotes([newNote, ...notes]);
    setNewNoteText("");
    showToast("Note added successfully");
  };

  const isError = activeFrame === "error";
  const effectiveSaved = activeFrame === "saved" ? true : isSaved;

  return (
    <div className="min-h-screen bg-surface-base text-ink-primary font-sans flex flex-col select-text relative">
      {/* ── Frame Switcher Demo Toolbar ── */}
      <div className="bg-[#17201D] text-white border-b border-[#2a3530] px-4 py-2 flex items-center justify-between gap-3 flex-wrap text-xs select-none z-40">
        <div className="flex items-center gap-2">
          <span className="font-semibold uppercase tracking-wider text-[#9CAAA5] text-[10px]">
            Cambium · Reader Experience (Screen 16)
          </span>
          <div className="hidden sm:flex items-center gap-1.5 ml-2">
            {FRAMES.map((f) => (
              <button
                key={f.id}
                onClick={() => {
                  setActiveFrame(f.id);
                  setShowMobilePreview(false);
                }}
                className={`px-2.5 py-1 rounded transition-colors text-[11px] font-medium border ${
                  activeFrame === f.id && !showMobilePreview
                    ? "bg-moss-600 border-moss-500 text-white"
                    : "bg-transparent border-transparent text-[#9CAAA5] hover:text-white hover:bg-white/5"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowMobilePreview(!showMobilePreview)}
            className={`px-2.5 py-1 rounded transition-colors text-[11px] font-medium border flex items-center gap-1.5 ${
              showMobilePreview
                ? "bg-moss-600 border-moss-500 text-white"
                : "bg-transparent border-[#2a3530] text-[#9CAAA5] hover:text-white"
            }`}
          >
            {showMobilePreview ? <Monitor size={12} /> : <Smartphone size={12} />}
            <span>{showMobilePreview ? "Desktop View" : "7 · Mobile 390px"}</span>
          </button>
        </div>
      </div>

      {/* ── Mobile Simulation Viewport ── */}
      {showMobilePreview ? (
        <div className="flex-1 flex justify-center items-center py-10 px-4 bg-[#17201D] overflow-y-auto">
          <MobileReaderView
            paper={PAPER_DATA}
            isSaved={effectiveSaved}
            onToggleSave={() => setIsSaved(!isSaved)}
            mobileSheet={mobileSheet}
            setMobileSheet={setMobileSheet}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            aiQuery={aiQuery}
            setAiQuery={setAiQuery}
            showAiResponse={showAiResponse}
            setShowAiResponse={setShowAiResponse}
            notes={notes}
            onAskIntelligence={handleAskIntelligence}
            showToast={showToast}
          />
        </div>
      ) : (
        /* ── Full Desktop Reader Layout ── */
        <div className="flex-1 flex flex-col h-[calc(100vh-41px)] overflow-hidden">
          {/* Top Navigation Bar */}
          <header className="h-[52px] bg-surface-raised border-b border-edge-default px-5 flex items-center justify-between gap-4 shrink-0 z-30">
            {/* Back to Explorer */}
            <div className="flex items-center gap-3 min-w-0">
              <Link
                href="/discover"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-edge-default text-ink-secondary hover:text-ink-primary hover:bg-surface-sunken transition-colors shrink-0"
              >
                <ArrowLeft size={14} />
                <span>Explorer</span>
              </Link>

              <span className="text-edge-default text-sm">/</span>

              {/* Truncated Title Breadcrumb */}
              <span className="text-xs font-semibold text-ink-primary truncate max-w-md hidden md:inline">
                {PAPER_DATA.title}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  setIsSaved(!isSaved);
                  showToast(!effectiveSaved ? "Saved to Reading List" : "Removed from Reading List");
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
                  effectiveSaved
                    ? "bg-moss-600 border-moss-600 text-white shadow-xs"
                    : "bg-surface-raised border-edge-default text-ink-secondary hover:text-ink-primary hover:bg-surface-sunken"
                }`}
              >
                <Bookmark size={13} className={effectiveSaved ? "fill-white" : ""} />
                <span>{effectiveSaved ? "Saved" : "Save"}</span>
              </button>

              <Link
                href="/workspace"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-edge-default text-ink-secondary hover:text-ink-primary hover:bg-surface-sunken transition-colors"
                onClick={() => showToast("Opened in Workspace")}
              >
                <PlusSquare size={13} />
                <span className="hidden sm:inline">Add to Workspace</span>
              </Link>

              {/* Cite Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowCiteMenu(!showCiteMenu)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
                    showCiteMenu
                      ? "bg-moss-50 border-moss-500 text-moss-700"
                      : "bg-surface-raised border-edge-default text-ink-secondary hover:text-ink-primary hover:bg-surface-sunken"
                  }`}
                >
                  <Quote size={13} />
                  <span>Cite</span>
                </button>

                {showCiteMenu && (
                  <CiteMenuDropdown
                    paper={PAPER_DATA}
                    onClose={() => setShowCiteMenu(false)}
                    onCopy={() => {
                      setShowCiteMenu(false);
                      showToast("Citation copied to clipboard");
                    }}
                  />
                )}
              </div>

              {/* Share Trigger */}
              <button
                onClick={() => setShowShareModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-edge-default text-ink-secondary hover:text-ink-primary hover:bg-surface-sunken transition-colors"
              >
                <Share2 size={13} />
                <span className="hidden sm:inline">Share</span>
              </button>

              <div className="w-[1px] h-5 bg-edge-default mx-1 hidden sm:block" />

              {/* Toggle Research Panel */}
              <button
                onClick={() => setPanelOpen(!panelOpen)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
                  panelOpen
                    ? "bg-moss-600 border-moss-600 text-white"
                    : "bg-surface-raised border-edge-default text-ink-secondary hover:text-ink-primary hover:bg-surface-sunken"
                }`}
                title={panelOpen ? "Collapse research panel" : "Expand research panel"}
              >
                {panelOpen ? <PanelRightClose size={14} /> : <PanelRightOpen size={14} />}
                <span className="hidden md:inline">Research Panel</span>
              </button>
            </div>
          </header>

          {/* Body: Reading Column + Research Panel */}
          <div className="flex-1 flex overflow-hidden relative">
            {/* Main Reading Container */}
            <div
              className={`flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-200 ${
                panelOpen ? "border-r border-edge-default" : ""
              }`}
            >
              {/* Document Sub-Controls Toolbar */}
              <div className="h-11 bg-surface-raised border-b border-edge-default px-6 flex items-center justify-between gap-4 shrink-0 select-none">
                {/* Page Controls */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-1 rounded border border-edge-default text-ink-secondary hover:bg-surface-sunken disabled:opacity-40 disabled:pointer-events-none transition-colors"
                    title="Previous page"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <span className="text-xs font-medium text-ink-secondary px-1.5 whitespace-nowrap">
                    {currentPage} / {PAPER_DATA.pages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(Math.min(PAPER_DATA.pages, currentPage + 1))}
                    disabled={currentPage === PAPER_DATA.pages}
                    className="p-1 rounded border border-edge-default text-ink-secondary hover:bg-surface-sunken disabled:opacity-40 disabled:pointer-events-none transition-colors"
                    title="Next page"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>

                <div className="w-[1px] h-4 bg-edge-default mx-1 hidden sm:block" />

                {/* Zoom Controls */}
                <div className="hidden sm:flex items-center gap-1.5">
                  <button
                    onClick={() => setZoom(Math.max(60, zoom - 10))}
                    className="p-1 rounded border border-edge-default text-ink-secondary hover:bg-surface-sunken transition-colors"
                    title="Zoom out"
                  >
                    <ZoomOut size={14} />
                  </button>
                  <span className="text-xs font-medium text-ink-secondary w-10 text-center">
                    {zoom}%
                  </span>
                  <button
                    onClick={() => setZoom(Math.min(180, zoom + 10))}
                    className="p-1 rounded border border-edge-default text-ink-secondary hover:bg-surface-sunken transition-colors"
                    title="Zoom in"
                  >
                    <ZoomIn size={14} />
                  </button>
                </div>

                <div className="w-[1px] h-4 bg-edge-default mx-1 hidden md:block" />

                {/* In-paper Search */}
                <div className="flex-1 max-w-xs relative hidden md:block">
                  <Search
                    size={13}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-tertiary pointer-events-none"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search within paper..."
                    className="w-full pl-8 pr-3 py-1 bg-surface-sunken/60 border border-edge-default rounded-md text-xs text-ink-primary focus:outline-none focus:border-moss-500 font-sans"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-ink-tertiary hover:text-ink-primary"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>

                {/* Quick Section Jump Pills */}
                <div className="hidden lg:flex items-center gap-1.5 text-xs text-ink-secondary">
                  <span className="text-[11px] uppercase tracking-wider text-ink-tertiary mr-1 font-semibold">
                    Jump:
                  </span>
                  {["Abstract", "Introduction", "Background", "Architecture"].map((sec) => (
                    <a
                      key={sec}
                      href={`#${sec.toLowerCase()}`}
                      className="px-2 py-0.5 rounded text-[11px] hover:bg-surface-sunken hover:text-ink-primary transition-colors text-ink-secondary"
                    >
                      {sec}
                    </a>
                  ))}
                </div>
              </div>

              {/* Scrollable Document Canvas */}
              <div
                ref={docContainerRef}
                onMouseUp={handleMouseUp}
                className="flex-1 overflow-y-auto bg-surface-base px-6 sm:px-12 py-10 relative scroll-smooth"
              >
                {isError ? (
                  <ErrorStateView
                    onRetry={() => {
                      setActiveFrame("default");
                      showToast("Paper reloaded");
                    }}
                  />
                ) : (
                  <div
                    style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}
                    className="transition-transform duration-150 max-w-[820px] mx-auto"
                  >
                    {/* Paper Editorial Header */}
                    <div className="mb-10 pb-8 border-b border-edge-default">
                      <div className="text-[11px] font-bold tracking-widest uppercase text-ink-secondary mb-3">
                        NeurIPS 2024 · Full Research Paper
                      </div>
                      <h1 className="font-serif italic font-normal text-2xl sm:text-3xl lg:text-[32px] leading-[1.3] text-ink-primary mb-4 tracking-tight">
                        {PAPER_DATA.title}
                      </h1>
                      <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed mb-4 font-sans">
                        {PAPER_DATA.authors}
                      </p>

                      {/* Metadata Chips */}
                      <div className="flex flex-wrap gap-4 text-xs">
                        <MetaTag label="Venue" value={PAPER_DATA.venue} />
                        <MetaTag label="Year" value={PAPER_DATA.year} />
                        <MetaTag label="DOI" value={PAPER_DATA.doi} isLink />
                        <MetaTag label="Pages" value={`${PAPER_DATA.pages} pages`} />
                      </div>
                    </div>

                    {/* Document Editorial Body */}
                    <div className="space-y-10">
                      {DOCUMENT_SECTIONS.map((sec) => (
                        <section key={sec.id} id={sec.id} className="scroll-mt-6">
                          <h2 className="text-xs font-bold uppercase tracking-wider text-moss-600 mb-3.5 font-sans">
                            {sec.title}
                          </h2>

                          {sec.id === "introduction" ? (
                            <div className="font-serif text-[17px] leading-[1.8] text-ink-primary max-w-[70ch] space-y-5">
                              <p>
                                Recurrent neural networks, long short-term memory and gated recurrent
                                neural networks in particular, have been firmly established as state of
                                the art approaches in sequence modeling and transduction problems such
                                as language modeling and machine translation. Numerous efforts have since
                                continued to push the boundaries of recurrent language models and
                                encoder-decoder architectures.
                              </p>

                              <p>
                                Attention mechanisms have become an integral part of compelling sequence
                                modeling and transduction models in various tasks, allowing modeling of
                                dependencies without regard to their distance in the input or output
                                sequences. In all but a few cases, however, such attention mechanisms are
                                used in conjunction with a recurrent network.
                              </p>

                              <p>
                                In this work we propose the Transformer, a model architecture eschewing
                                recurrence and instead relying entirely on an{" "}
                                <span
                                  onClick={() => {
                                    setSelectedText(
                                      "attention mechanism to draw global dependencies between input and output"
                                    );
                                    setSelectionActive(true);
                                  }}
                                  className={`px-1 py-0.5 rounded cursor-pointer transition-colors relative ${
                                    isHighlighted || activeFrame === "selection"
                                      ? "bg-moss-100 text-moss-700 font-medium"
                                      : "bg-moss-100/60 hover:bg-moss-100 text-ink-primary"
                                  }`}
                                  title="Click to interact with quote"
                                >
                                  attention mechanism to draw global dependencies between input and output
                                </span>
                                . The Transformer allows for significantly more parallelization and can
                                reach a new state of the art in translation quality after being trained
                                for as little as twelve hours on eight P100 GPUs.
                              </p>
                            </div>
                          ) : (
                            <p className="font-serif text-[17px] leading-[1.8] text-ink-primary max-w-[70ch] whitespace-pre-line">
                              {sec.content}
                            </p>
                          )}
                        </section>
                      ))}

                      {/* Figure Card Component */}
                      <div className="border border-edge-default rounded-xl p-6 bg-surface-raised shadow-xs max-w-[70ch]">
                        <div className="h-44 bg-surface-sunken/70 rounded-lg border border-dashed border-edge-default flex flex-col items-center justify-center gap-2 mb-3">
                          <div className="w-10 h-10 rounded-full bg-moss-50 border border-moss-200 flex items-center justify-center text-moss-600">
                            <Sparkles size={18} />
                          </div>
                          <span className="text-xs font-medium text-ink-secondary">
                            Figure 1 — The Transformer Architecture Model Stack
                          </span>
                          <span className="text-[11px] text-ink-tertiary">
                            Encoder (Multi-Head Self-Attention) · Decoder (Masked Multi-Head Attention)
                          </span>
                        </div>
                        <p className="text-xs text-ink-secondary text-center italic font-sans">
                          Figure 1: The Transformer model architecture. The encoder (left) and decoder
                          (right) are each composed of a stack of identical layers with residual
                          connections and layer normalization.
                        </p>
                      </div>

                      {/* End of Section Divider */}
                      <div className="text-center py-6 text-ink-tertiary tracking-widest text-base select-none">
                        · · ·
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── Interactive Floating Text Selection Popover ── */}
            <AnimatePresence>
              {selectionActive && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="fixed z-50 bg-[#17201D] text-white rounded-lg shadow-xl border border-edge-hover px-1 py-1 flex items-center gap-0.5 text-xs font-medium"
                  style={{
                    left: selectionCoords ? `${selectionCoords.x}px` : "46%",
                    top: selectionCoords ? `${selectionCoords.y - 42}px` : "40%",
                    transform: "translateX(-50%)",
                  }}
                >
                  <button
                    onClick={() => handleAskIntelligence()}
                    className="px-2.5 py-1.5 rounded hover:bg-moss-600 text-white flex items-center gap-1.5 transition-colors"
                  >
                    <Sparkles size={13} className="text-moss-300" />
                    <span>Ask Intelligence</span>
                  </button>

                  <button
                    onClick={() => handleAddNoteFromSelection()}
                    className="px-2.5 py-1.5 rounded hover:bg-white/10 text-white/90 flex items-center gap-1.5 transition-colors"
                  >
                    <MessageSquarePlus size={13} />
                    <span>Add Note</span>
                  </button>

                  <button
                    onClick={handleToggleHighlight}
                    className="px-2.5 py-1.5 rounded hover:bg-white/10 text-white/90 flex items-center gap-1.5 transition-colors"
                  >
                    <Highlighter size={13} />
                    <span>Highlight</span>
                  </button>

                  <button
                    onClick={() => handleCopyQuote()}
                    className="px-2.5 py-1.5 rounded hover:bg-white/10 text-white/90 flex items-center gap-1.5 transition-colors"
                  >
                    <Copy size={13} />
                    <span>Copy</span>
                  </button>

                  <button
                    onClick={() => setSelectionActive(false)}
                    className="p-1 rounded hover:bg-white/10 text-white/60 hover:text-white"
                  >
                    <X size={12} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Collapsible Right Research Panel (380px) ── */}
            <AnimatePresence>
              {panelOpen && !isError && (
                <motion.aside
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 380, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-[380px] shrink-0 bg-surface-raised flex flex-col overflow-hidden select-text border-l border-edge-default"
                >
                  {/* Panel Tab Navigation */}
                  <div className="flex items-center justify-between border-b border-edge-default px-5 shrink-0 bg-surface-raised">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setActiveTab("intelligence")}
                        className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
                          activeTab === "intelligence"
                            ? "border-moss-600 text-moss-700"
                            : "border-transparent text-ink-secondary hover:text-ink-primary"
                        }`}
                      >
                        <Sparkles size={13} />
                        <span>Intelligence</span>
                      </button>

                      <button
                        onClick={() => setActiveTab("notes")}
                        className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
                          activeTab === "notes"
                            ? "border-moss-600 text-moss-700"
                            : "border-transparent text-ink-secondary hover:text-ink-primary"
                        }`}
                      >
                        <FileText size={13} />
                        <span>Notes ({notes.length})</span>
                      </button>
                    </div>

                    <button
                      onClick={() => setPanelOpen(false)}
                      className="text-ink-tertiary hover:text-ink-primary p-1 rounded transition-colors"
                      title="Collapse panel"
                    >
                      <PanelRightClose size={15} />
                    </button>
                  </div>

                  {/* Tab 1: Research Intelligence */}
                  {activeTab === "intelligence" && (
                    <div className="flex-1 overflow-y-auto p-5 space-y-5">
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-moss-600 mb-1">
                          Research Intelligence
                        </div>
                        <p className="text-xs text-ink-secondary leading-relaxed">
                          Contextual synthesis & question answering tuned to this paper.
                        </p>
                      </div>

                      {/* Selected context banner */}
                      {selectedText && (
                        <div className="bg-moss-50 border-l-2 border-moss-500 rounded-r-md p-3 text-xs">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-moss-700 mb-1 flex items-center justify-between">
                            <span>Selected Text Context</span>
                            <button
                              onClick={() => setSelectedText("")}
                              className="text-moss-700/60 hover:text-moss-700"
                            >
                              <X size={10} />
                            </button>
                          </div>
                          <p className="italic text-ink-primary leading-snug">&ldquo;{selectedText}&rdquo;</p>
                        </div>
                      )}

                      {/* Quick contextual action pills */}
                      <div className="space-y-2">
                        <div className="text-[11px] font-semibold text-ink-secondary">Quick Actions</div>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            "Summarize",
                            "Key findings",
                            "Explain section",
                            "Research gaps",
                            "Methods",
                            "Limitations",
                            "Related research",
                          ].map((action) => (
                            <button
                              key={action}
                              onClick={() => {
                                setAiQuery(`Provide a concise breakdown of the ${action.toLowerCase()} in this paper.`);
                                setIsAiLoading(true);
                                setTimeout(() => {
                                  setIsAiLoading(false);
                                  setShowAiResponse(true);
                                }, 500);
                              }}
                              className="px-2.5 py-1 rounded-full text-xs font-medium bg-surface-sunken hover:bg-moss-100 hover:text-moss-700 text-ink-primary border border-edge-default transition-colors"
                            >
                              {action}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Query Input */}
                      <div className="space-y-2">
                        <div className="relative">
                          <textarea
                            value={aiQuery}
                            onChange={(e) => setAiQuery(e.target.value)}
                            placeholder="Ask a question about this paper..."
                            rows={3}
                            className="w-full p-3 pb-8 text-xs bg-surface-sunken/60 border border-edge-default rounded-lg text-ink-primary focus:outline-none focus:border-moss-500 font-sans resize-none"
                          />
                          <button
                            onClick={() => {
                              if (!aiQuery.trim()) return;
                              setIsAiLoading(true);
                              setTimeout(() => {
                                setIsAiLoading(false);
                                setShowAiResponse(true);
                              }, 600);
                            }}
                            disabled={!aiQuery.trim() || isAiLoading}
                            className="absolute right-2 bottom-2 px-3 py-1 bg-moss-600 hover:bg-moss-700 disabled:opacity-40 text-white text-xs font-medium rounded-md flex items-center gap-1 transition-colors"
                          >
                            <Send size={11} />
                            <span>Ask</span>
                          </button>
                        </div>
                      </div>

                      {/* AI Loading State */}
                      {isAiLoading && (
                        <div className="p-4 bg-surface-sunken/50 rounded-lg border border-edge-default space-y-2 animate-pulse">
                          <div className="h-3 bg-moss-200/50 rounded w-24" />
                          <div className="h-3 bg-edge-default rounded w-full" />
                          <div className="h-3 bg-edge-default rounded w-4/5" />
                        </div>
                      )}

                      {/* AI Response Card */}
                      {showAiResponse && !isAiLoading && (
                        <motion.div
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="border-t border-edge-default pt-4 space-y-3"
                        >
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold uppercase tracking-wider text-moss-600">
                              Synthesized Response
                            </span>
                            <span className="text-ink-tertiary">Verified from 3 sources</span>
                          </div>

                          <p className="text-xs leading-relaxed text-ink-primary font-sans">
                            {AI_RESPONSE.summary}
                          </p>

                          {/* Cited pages pills */}
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[11px] font-semibold text-ink-secondary mr-1">
                              Sources:
                            </span>
                            {AI_RESPONSE.pages.map((p) => (
                              <span
                                key={p}
                                className="px-2 py-0.5 rounded text-[10px] font-semibold bg-moss-100 text-moss-700"
                              >
                                {p}
                              </span>
                            ))}
                          </div>

                          {/* Follow-up Question Prompts */}
                          <div className="pt-2 border-t border-edge-default space-y-1.5">
                            <div className="text-[11px] font-semibold text-ink-secondary">
                              Suggested Follow-ups
                            </div>
                            {[
                              "How does positional encoding work in long contexts?",
                              "What are the computational limits of self-attention?",
                              "Compare to modern state space models (Mamba)",
                            ].map((q) => (
                              <button
                                key={q}
                                onClick={() => {
                                  setAiQuery(q);
                                  setIsAiLoading(true);
                                  setTimeout(() => {
                                    setIsAiLoading(false);
                                    setShowAiResponse(true);
                                  }, 500);
                                }}
                                className="w-full text-left p-2 rounded-md bg-surface-sunken hover:bg-moss-50 border border-edge-default text-[11px] text-ink-primary leading-snug transition-colors"
                              >
                                {q}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* Tab 2: Notes Panel */}
                  {activeTab === "notes" && (
                    <div className="flex-1 overflow-y-auto p-5 space-y-5">
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-moss-600 mb-1">
                          Research Annotations
                        </div>
                        <p className="text-xs text-ink-secondary leading-relaxed">
                          {notes.length} saved insights linked to this document.
                        </p>
                      </div>

                      {/* Add Note Form */}
                      <div className="p-3 bg-surface-sunken/60 border border-edge-default rounded-xl space-y-2.5">
                        {/* Note Type Selector */}
                        <div className="flex flex-wrap gap-1">
                          {(
                            ["key-takeaway", "research-question", "action-item", "private"] as const
                          ).map((t) => (
                            <button
                              key={t}
                              onClick={() => setNewNoteType(t)}
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold border transition-colors ${
                                newNoteType === t
                                  ? NOTE_TYPE_CONFIG[t].bg
                                  : "bg-surface-raised text-ink-secondary border-edge-default hover:text-ink-primary"
                              }`}
                            >
                              {NOTE_TYPE_CONFIG[t].label}
                            </button>
                          ))}
                        </div>

                        <textarea
                          value={newNoteText}
                          onChange={(e) => setNewNoteText(e.target.value)}
                          placeholder="Write your research note..."
                          rows={3}
                          className="w-full p-2.5 text-xs bg-surface-raised border border-edge-default rounded-lg text-ink-primary focus:outline-none focus:border-moss-500 font-sans resize-none"
                        />

                        <div className="flex justify-end">
                          <button
                            onClick={handleAddNoteSubmit}
                            disabled={!newNoteText.trim()}
                            className="px-3 py-1 bg-moss-600 hover:bg-moss-700 disabled:opacity-40 text-white text-xs font-semibold rounded-md transition-colors"
                          >
                            Add Note
                          </button>
                        </div>
                      </div>

                      {/* Notes List */}
                      <div className="space-y-3">
                        {notes.map((note) => {
                          const config = NOTE_TYPE_CONFIG[note.type] || NOTE_TYPE_CONFIG.private;
                          return (
                            <div
                              key={note.id}
                              style={{ borderLeftColor: config.border }}
                              className="bg-surface-raised border border-edge-default border-l-4 rounded-r-lg p-3 space-y-1.5 shadow-xs"
                            >
                              <div className="flex items-center justify-between text-[10px]">
                                <span className={`font-bold uppercase tracking-wider ${config.text}`}>
                                  {config.label}
                                </span>
                                <span className="text-ink-tertiary">
                                  {note.page} · {note.time}
                                </span>
                              </div>

                              {note.highlight && (
                                <p className="text-[11px] text-ink-secondary italic bg-moss-50 px-2 py-1 rounded border border-moss-200">
                                  &ldquo;{note.highlight}&rdquo;
                                </p>
                              )}

                              <p className="text-xs text-ink-primary leading-relaxed">{note.text}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </motion.aside>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* ── Share Modal Dialog ── */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-ink-primary/40 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface-raised border border-edge-default rounded-xl p-6 max-w-sm w-full shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-ink-primary">Share Research Paper</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-ink-tertiary hover:text-ink-primary p-1"
              >
                <X size={15} />
              </button>
            </div>

            <p className="text-xs text-ink-secondary leading-relaxed">
              Anyone with access to your Cambium team or workspace will be able to read and annotate
              this document.
            </p>

            <div className="p-2.5 bg-surface-sunken rounded-lg border border-edge-default flex items-center justify-between gap-2">
              <span className="text-xs text-ink-secondary truncate font-mono">
                https://cambium.ac/reader?doi={encodeURIComponent(PAPER_DATA.doi)}
              </span>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(
                    `https://cambium.ac/reader?doi=${encodeURIComponent(PAPER_DATA.doi)}`
                  );
                  setShowShareModal(false);
                  showToast("Link copied to clipboard");
                }}
                className="px-2.5 py-1 bg-moss-600 hover:bg-moss-700 text-white rounded text-xs font-semibold shrink-0 transition-colors"
              >
                Copy
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ── Toast Feedback Notification ── */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 12, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 12, x: "-50%" }}
            className="fixed bottom-6 left-1/2 z-50 px-4 py-2 bg-[#17201D] text-white rounded-lg shadow-xl text-xs font-medium flex items-center gap-2 border border-edge-hover"
          >
            <Check size={14} className="text-moss-300" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Sub-Components ───────────────────────────────────────────────────────────

function MetaTag({
  label,
  value,
  isLink,
}: {
  label: string;
  value: string;
  isLink?: boolean;
}) {
  return (
    <div className="flex items-center gap-1">
      <span className="font-bold text-[10px] uppercase tracking-wider text-ink-tertiary">
        {label}:
      </span>
      {isLink ? (
        <span className="text-moss-700 hover:underline cursor-pointer font-medium">{value}</span>
      ) : (
        <span className="text-ink-secondary font-medium">{value}</span>
      )}
    </div>
  );
}

function CiteMenuDropdown({
  paper,
  onClose,
  onCopy,
}: {
  paper: Paper;
  onClose: () => void;
  onCopy: () => void;
}) {
  const formats = [
    {
      name: "APA 7th",
      cite: `${paper.authors} (${paper.year}). ${paper.title}. ${paper.venue}. https://doi.org/${paper.doi}`,
    },
    {
      name: "MLA 9th",
      cite: `${paper.authors}. "${paper.title}." ${paper.venue}, ${paper.year}.`,
    },
    {
      name: "Chicago 17th",
      cite: `${paper.authors}. "${paper.title}." ${paper.venue} (${paper.year}).`,
    },
    {
      name: "BibTeX",
      cite: `@article{vaswani2024attention,\n  title={${paper.title}},\n  author={${paper.authors}},\n  journal={${paper.venue}},\n  year={${paper.year}}\n}`,
    },
    { name: "RIS", cite: `TY  - JOUR\nTI  - ${paper.title}\nAU  - ${paper.authors}\nER  -` },
    { name: "Vancouver", cite: `${paper.authors}. ${paper.title}. ${paper.venue}. ${paper.year}.` },
  ];

  return (
    <div className="absolute top-full right-0 mt-1.5 w-52 bg-surface-raised border border-edge-default rounded-lg shadow-xl p-1.5 z-50">
      <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ink-tertiary">
        Citation Format
      </div>
      {formats.map((f) => (
        <button
          key={f.name}
          onClick={() => {
            navigator.clipboard?.writeText(f.cite);
            onCopy();
          }}
          className="w-full text-left px-2.5 py-1.5 text-xs text-ink-primary hover:bg-surface-sunken rounded-md transition-colors flex items-center justify-between"
        >
          <span>{f.name}</span>
          <Copy size={11} className="text-ink-tertiary" />
        </button>
      ))}
    </div>
  );
}

function ErrorStateView({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="max-w-md mx-auto py-20 text-center space-y-4">
      <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 mx-auto flex items-center justify-center">
        <AlertCircle size={28} />
      </div>
      <h2 className="font-serif italic text-2xl text-ink-primary font-medium">
        Artifact Unavailable
      </h2>
      <p className="text-xs text-ink-secondary leading-relaxed">
        This research artifact could not be retrieved from the original archive. The source server may
        be experiencing rate limits, or access permissions may require authentication.
      </p>

      <div className="pt-2 flex items-center justify-center gap-3">
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-moss-600 hover:bg-moss-700 text-white rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5"
        >
          <RotateCcw size={13} />
          <span>Try Again</span>
        </button>

        <Link
          href="/discover"
          className="px-4 py-2 border border-edge-default text-ink-secondary hover:text-ink-primary hover:bg-surface-sunken rounded-md text-xs font-medium transition-colors"
        >
          ← Back to Explorer
        </Link>
      </div>

      <div className="mt-8 p-3.5 bg-surface-raised border border-edge-default rounded-lg text-left text-xs text-ink-secondary space-y-1">
        <div className="text-[10px] font-bold uppercase tracking-wider text-ink-tertiary mb-1">
          Diagnostics
        </div>
        <div>DOI: 10.48550/arXiv.2024.17823</div>
        <div>Status: 403 Access Restricted</div>
        <div>Origin: arXiv e-Print Archive</div>
      </div>
    </div>
  );
}

function MobileReaderView({
  paper,
  isSaved,
  onToggleSave,
  mobileSheet,
  setMobileSheet,
  currentPage,
  setCurrentPage,
  aiQuery,
  setAiQuery,
  showAiResponse,
  setShowAiResponse,
  notes,
  onAskIntelligence,
  showToast,
}: {
  paper: Paper;
  isSaved: boolean;
  onToggleSave: () => void;
  mobileSheet: "none" | "intelligence" | "notes";
  setMobileSheet: (s: "none" | "intelligence" | "notes") => void;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  aiQuery: string;
  setAiQuery: (q: string) => void;
  showAiResponse: boolean;
  setShowAiResponse: (b: boolean) => void;
  notes: Note[];
  onAskIntelligence: (q?: string) => void;
  showToast: (m: string) => void;
}) {
  return (
    <div className="w-[390px] h-[800px] bg-surface-base rounded-3xl border-4 border-[#2a3530] shadow-2xl flex flex-col overflow-hidden relative font-sans select-none">
      {/* Mobile Top Bar */}
      <div className="h-14 bg-surface-raised border-b border-edge-default px-4 flex items-center justify-between gap-3 shrink-0">
        <Link
          href="/discover"
          className="p-1.5 rounded-md border border-edge-default text-ink-secondary"
        >
          <ArrowLeft size={15} />
        </Link>
        <span className="text-xs font-semibold text-ink-primary truncate flex-1 text-center">
          {paper.title}
        </span>
        <button
          onClick={onToggleSave}
          className={`p-1.5 rounded-md border transition-colors ${
            isSaved ? "bg-moss-600 text-white border-moss-600" : "border-edge-default text-ink-secondary"
          }`}
        >
          <Bookmark size={15} className={isSaved ? "fill-white" : ""} />
        </button>
      </div>

      {/* Page Stepper */}
      <div className="h-9 bg-surface-sunken/40 border-b border-edge-default px-4 flex items-center justify-between text-xs text-ink-secondary shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-1 text-ink-secondary hover:text-ink-primary"
          >
            <ChevronLeft size={14} />
          </button>
          <span className="font-medium">
            {currentPage} / {paper.pages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(paper.pages, p + 1))}
            className="p-1 text-ink-secondary hover:text-ink-primary"
          >
            <ChevronRight size={14} />
          </button>
        </div>
        <span className="text-[11px] font-semibold text-moss-700">NeurIPS 2024</span>
      </div>

      {/* Mobile Reading Scroll */}
      <div className="flex-1 overflow-y-auto p-5 pb-24 space-y-6">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-ink-tertiary mb-2">
            NeurIPS 2024 · Full Paper
          </div>
          <h2 className="font-serif italic text-xl font-normal leading-snug text-ink-primary mb-2">
            {paper.title}
          </h2>
          <p className="text-xs text-ink-secondary">{paper.authors}</p>
        </div>

        <div className="space-y-4 font-serif text-[15px] leading-relaxed text-ink-primary">
          <h3 className="font-sans text-xs font-bold uppercase text-moss-600 tracking-wider">
            Abstract
          </h3>
          <p>
            The dominant sequence transduction models are based on complex recurrent or convolutional
            neural networks that include an encoder and a decoder.
          </p>

          <h3 className="font-sans text-xs font-bold uppercase text-moss-600 tracking-wider pt-2">
            1. Introduction
          </h3>
          <p>
            In this work we propose the Transformer, a model architecture eschewing recurrence and
            instead relying entirely on an attention mechanism to draw global dependencies between
            input and output.
          </p>
        </div>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="absolute bottom-0 inset-x-0 h-16 bg-surface-raised border-t border-edge-default flex items-center justify-around px-2 z-20">
        <button
          onClick={() => setMobileSheet(mobileSheet === "intelligence" ? "none" : "intelligence")}
          className={`flex flex-col items-center gap-1 p-1.5 transition-colors ${
            mobileSheet === "intelligence" ? "text-moss-700" : "text-ink-secondary"
          }`}
        >
          <Sparkles size={18} />
          <span className="text-[10px] font-semibold">Intelligence</span>
        </button>

        <button
          onClick={() => setMobileSheet(mobileSheet === "notes" ? "none" : "notes")}
          className={`flex flex-col items-center gap-1 p-1.5 transition-colors ${
            mobileSheet === "notes" ? "text-moss-700" : "text-ink-secondary"
          }`}
        >
          <FileText size={18} />
          <span className="text-[10px] font-semibold">Notes ({notes.length})</span>
        </button>

        <button
          onClick={() => showToast("Link copied")}
          className="flex flex-col items-center gap-1 p-1.5 text-ink-secondary"
        >
          <Share2 size={18} />
          <span className="text-[10px] font-semibold">Share</span>
        </button>
      </div>

      {/* Mobile Bottom Sheet Overlay */}
      {mobileSheet !== "none" && (
        <div className="absolute bottom-16 inset-x-0 h-[380px] bg-surface-raised border-t border-edge-default rounded-t-2xl shadow-2xl z-30 flex flex-col p-4 overflow-y-auto">
          <div className="w-8 h-1 bg-edge-default rounded-full mx-auto mb-3" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-moss-600">
              {mobileSheet === "intelligence" ? "Research Intelligence" : "Annotations"}
            </span>
            <button onClick={() => setMobileSheet("none")} className="p-1 text-ink-tertiary">
              <X size={14} />
            </button>
          </div>

          {mobileSheet === "intelligence" ? (
            <div className="space-y-3 text-xs">
              <p className="text-ink-secondary leading-relaxed">
                Ask any question about this paper or pick a quick analysis.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {["Summarize", "Key findings", "Methodology"].map((action) => (
                  <button
                    key={action}
                    onClick={() => {
                      setAiQuery(`Summarize ${action}`);
                      setShowAiResponse(true);
                    }}
                    className="px-2.5 py-1 rounded-full bg-surface-sunken text-[11px] font-medium text-ink-primary border border-edge-default"
                  >
                    {action}
                  </button>
                ))}
              </div>
              {showAiResponse && (
                <div className="p-3 bg-moss-50 border border-moss-200 rounded-lg text-ink-primary leading-relaxed">
                  {AI_RESPONSE.summary}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2 text-xs">
              {notes.map((n) => (
                <div key={n.id} className="p-2.5 bg-surface-sunken rounded-lg space-y-1">
                  <div className="flex justify-between text-[10px] text-ink-tertiary">
                    <span className="font-bold text-moss-700 uppercase">{n.type}</span>
                    <span>{n.time}</span>
                  </div>
                  <p className="text-ink-primary">{n.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
