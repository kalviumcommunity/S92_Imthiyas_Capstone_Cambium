import { useState } from "react";

type Frame = "default" | "intelligence" | "notes" | "selection" | "saved" | "error";

type Paper = {
  title: string;
  authors: string;
  venue: string;
  year: string;
  doi: string;
  pages: number;
};

const paper: Paper = {
  title: "Attention Is All You Need: Revisiting Transformer Architectures for Long-Context Reasoning",
  authors: "Vaswani, A., Shazeer, N., Parmar, N., Uszkoreit, J., Jones, L., Gomez, A. N., Kaiser, Ł., & Polosukhin, I.",
  venue: "Neural Information Processing Systems (NeurIPS)",
  year: "2024",
  doi: "10.48550/arXiv.2024.17823",
  pages: 42,
};

const documentBody = [
  {
    section: "Abstract",
    content:
      "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely. Experiments on two machine translation tasks show these models to be superior in quality while being more parallelizable and requiring significantly less time to train.",
  },
  {
    section: "1. Introduction",
    content:
      "Recurrent neural networks, long short-term memory and gated recurrent neural networks in particular, have been firmly established as state of the art approaches in sequence modeling and transduction problems such as language modeling and machine translation. Numerous efforts have since continued to push the boundaries of recurrent language models and encoder-decoder architectures.\n\nAttention mechanisms have become an integral part of compelling sequence modeling and transduction models in various tasks, allowing modeling of dependencies without regard to their distance in the input or output sequences. In all but a few cases, however, such attention mechanisms are used in conjunction with a recurrent network.\n\nIn this work we propose the Transformer, a model architecture eschewing recurrence and instead relying entirely on an attention mechanism to draw global dependencies between input and output. The Transformer allows for significantly more parallelization and can reach a new state of the art in translation quality after being trained for as little as twelve hours on eight P100 GPUs.",
  },
  {
    section: "2. Background",
    content:
      "The goal of reducing sequential computation also forms the foundation of the Extended Neural GPU, ByteNet and ConvS2S, all of which use convolutional neural networks as basic building block, computing hidden representations in parallel for all input and output positions. In these models, the number of operations required to relate signals from two arbitrary input or output positions grows in the distance between positions, linearly for ConvS2S and logarithmically for ByteNet.\n\nSelf-attention, sometimes called intra-attention is an attention mechanism relating different positions of a single sequence in order to compute a representation of the sequence. Self-attention has been used successfully in a variety of tasks including reading comprehension, abstractive summarization, textual entailment and learning task-independent sentence representations.",
  },
];

const aiResponse = {
  summary:
    "This paper introduces the Transformer architecture, replacing recurrent and convolutional layers entirely with self-attention mechanisms. The key innovation is multi-head attention, which allows the model to jointly attend to information from different representation subspaces. Results show BLEU score improvements of 2+ points over existing ensemble models on English-to-German translation.",
  pages: ["Abstract", "p. 3–4", "p. 7"],
};

const savedNotes = [
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

export default function DesktopReader({ frame }: { frame: Frame }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [isSaved, setIsSaved] = useState(frame === "saved");
  const [activeTab, setActiveTab] = useState<"intelligence" | "notes">(
    frame === "notes" ? "notes" : "intelligence"
  );
  const [panelOpen, setPanelOpen] = useState(
    frame === "intelligence" || frame === "notes" || frame === "selection" || frame === "saved"
  );
  const [aiQuery, setAiQuery] = useState(
    frame === "selection" ? "What is the computational complexity of multi-head attention?" : ""
  );
  const [showAiResponse, setShowAiResponse] = useState(
    frame === "intelligence" || frame === "selection" || frame === "saved"
  );
  const [selectionMenu, setSelectionMenu] = useState(frame === "selection");
  const [newNote, setNewNote] = useState("");
  const [notes, setNotes] = useState(savedNotes);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCiteMenu, setShowCiteMenu] = useState(false);

  const isError = frame === "error";
  const saved = frame === "saved" ? true : isSaved;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#F7F6F1" }}>
      {/* Top Bar */}
      <TopBar
        paper={paper}
        saved={saved}
        onSave={() => setIsSaved(!isSaved)}
        onTogglePanel={() => setPanelOpen(!panelOpen)}
        panelOpen={panelOpen}
        showCiteMenu={showCiteMenu}
        onCite={() => setShowCiteMenu(!showCiteMenu)}
      />

      {/* Body */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Main Reading Area */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            borderRight: panelOpen ? "1px solid #DDE2DE" : "none",
          }}
        >
          {/* Document Controls */}
          <DocumentControls
            currentPage={currentPage}
            totalPages={paper.pages}
            zoom={zoom}
            onPageChange={setCurrentPage}
            onZoom={setZoom}
            searchQuery={searchQuery}
            onSearch={setSearchQuery}
          />

          {/* Document Area */}
          <div style={{ flex: 1, overflow: "auto", padding: "0" }}>
            {isError ? (
              <ErrorState />
            ) : (
              <DocumentBody
                selectionMenu={selectionMenu}
                onSelectionClick={() => {
                  setSelectionMenu(false);
                  setPanelOpen(true);
                  setActiveTab("intelligence");
                  setAiQuery("What is the computational complexity of multi-head attention?");
                  setShowAiResponse(true);
                }}
              />
            )}
          </div>
        </div>

        {/* Right Panel */}
        {panelOpen && !isError && (
          <div
            style={{
              width: "380px",
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              background: "#FFFFFF",
              overflow: "hidden",
            }}
          >
            {/* Panel Tabs */}
            <div
              style={{
                display: "flex",
                borderBottom: "1px solid #DDE2DE",
                padding: "0 20px",
                gap: "4px",
                flexShrink: 0,
              }}
            >
              {(["intelligence", "notes"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: "14px 16px 12px",
                    fontSize: "13px",
                    fontWeight: 600,
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    borderBottom: `2px solid ${activeTab === tab ? "#173F35" : "transparent"}`,
                    color: activeTab === tab ? "#173F35" : "#66716C",
                    transition: "all 0.15s",
                    textTransform: "capitalize",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {tab === "intelligence" ? "Intelligence" : "Notes"}
                </button>
              ))}
              <button
                onClick={() => setPanelOpen(false)}
                style={{
                  marginLeft: "auto",
                  padding: "14px 0 12px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "#66716C",
                  fontSize: "18px",
                  lineHeight: 1,
                }}
                title="Collapse panel"
              >
                ›
              </button>
            </div>

            {/* Panel Content */}
            <div style={{ flex: 1, overflow: "auto" }}>
              {activeTab === "intelligence" ? (
                <IntelligencePanel
                  query={aiQuery}
                  onQueryChange={setAiQuery}
                  showResponse={showAiResponse}
                  onSubmit={() => setShowAiResponse(true)}
                  selectedText={
                    frame === "selection"
                      ? "attention mechanism to draw global dependencies between input and output"
                      : undefined
                  }
                />
              ) : (
                <NotesPanel
                  notes={notes}
                  newNote={newNote}
                  onNewNote={setNewNote}
                  onAddNote={() => {
                    if (newNote.trim()) {
                      setNotes([
                        ...notes,
                        {
                          id: Date.now(),
                          type: "key-takeaway",
                          text: newNote,
                          page: `p. ${currentPage}`,
                          time: "just now",
                        },
                      ]);
                      setNewNote("");
                    }
                  }}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Top Bar ── */
function TopBar({
  paper,
  saved,
  onSave,
  onTogglePanel,
  panelOpen,
  showCiteMenu,
  onCite,
}: {
  paper: Paper;
  saved: boolean;
  onSave: () => void;
  onTogglePanel: () => void;
  panelOpen: boolean;
  showCiteMenu: boolean;
  onCite: () => void;
}) {
  return (
    <div
      style={{
        height: "52px",
        background: "#FFFFFF",
        borderBottom: "1px solid #DDE2DE",
        display: "flex",
        alignItems: "center",
        padding: "0 20px",
        gap: "0",
        flexShrink: 0,
      }}
    >
      {/* Back */}
      <button
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "7px 12px 7px 8px",
          background: "transparent",
          border: "1px solid #DDE2DE",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "13px",
          fontWeight: 500,
          color: "#66716C",
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: "16px", lineHeight: 1, marginTop: "-1px" }}>←</span>
        Explorer
      </button>

      {/* Breadcrumb */}
      <div
        style={{
          flex: 1,
          overflow: "hidden",
          padding: "0 16px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        <span style={{ color: "#DDE2DE", fontSize: "13px" }}>/</span>
        <span
          style={{
            fontSize: "13px",
            fontWeight: 500,
            color: "#17201D",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {paper.title}
        </span>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
        <ToolbarBtn
          label={saved ? "Saved" : "Save"}
          active={saved}
          onClick={onSave}
          icon={saved ? "★" : "☆"}
        />
        <ToolbarBtn label="Add to Workspace" onClick={() => {}} icon="⊞" />
        <div style={{ position: "relative" }}>
          <ToolbarBtn label="Cite" onClick={onCite} icon='"' active={showCiteMenu} />
          {showCiteMenu && <CiteMenu />}
        </div>
        <ToolbarBtn label="Share" onClick={() => {}} icon="↗" />
        <div style={{ width: "1px", height: "20px", background: "#DDE2DE", margin: "0 4px" }} />
        <button
          onClick={onTogglePanel}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "7px 12px",
            background: panelOpen ? "#173F35" : "transparent",
            border: "1px solid",
            borderColor: panelOpen ? "#173F35" : "#DDE2DE",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: 500,
            color: panelOpen ? "#DCEBE4" : "#66716C",
            transition: "all 0.15s",
          }}
        >
          <span style={{ fontSize: "14px" }}>⊡</span>
          Research Panel
        </button>
      </div>
    </div>
  );
}

function ToolbarBtn({
  label,
  onClick,
  icon,
  active,
}: {
  label: string;
  onClick: () => void;
  icon?: string;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "5px",
        padding: "7px 12px",
        background: active ? "#173F35" : "transparent",
        border: "1px solid",
        borderColor: active ? "#173F35" : "#DDE2DE",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "13px",
        fontWeight: 500,
        color: active ? "#DCEBE4" : "#66716C",
        transition: "all 0.15s",
        whiteSpace: "nowrap",
      }}
    >
      {icon && <span style={{ fontSize: "14px" }}>{icon}</span>}
      {label}
    </button>
  );
}

function CiteMenu() {
  const formats = ["APA 7th", "MLA 9th", "Chicago 17th", "BibTeX", "RIS", "Vancouver"];
  return (
    <div
      style={{
        position: "absolute",
        top: "calc(100% + 8px)",
        right: 0,
        background: "#FFFFFF",
        border: "1px solid #DDE2DE",
        borderRadius: "8px",
        padding: "6px",
        zIndex: 100,
        minWidth: "160px",
        boxShadow: "0 4px 16px rgba(23,32,29,0.08)",
      }}
    >
      <div style={{ padding: "6px 10px 8px", fontSize: "11px", fontWeight: 700, color: "#66716C", letterSpacing: "0.06em", textTransform: "uppercase" }}>
        Citation Format
      </div>
      {formats.map((f) => (
        <button
          key={f}
          style={{
            display: "block",
            width: "100%",
            textAlign: "left",
            padding: "8px 10px",
            fontSize: "13px",
            fontWeight: 500,
            color: "#17201D",
            background: "transparent",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {f}
        </button>
      ))}
    </div>
  );
}

/* ── Document Controls ── */
function DocumentControls({
  currentPage,
  totalPages,
  zoom,
  onPageChange,
  onZoom,
  searchQuery,
  onSearch,
}: {
  currentPage: number;
  totalPages: number;
  zoom: number;
  onPageChange: (p: number) => void;
  onZoom: (z: number) => void;
  searchQuery: string;
  onSearch: (q: string) => void;
}) {
  return (
    <div
      style={{
        height: "44px",
        background: "#FFFFFF",
        borderBottom: "1px solid #DDE2DE",
        display: "flex",
        alignItems: "center",
        padding: "0 20px",
        gap: "12px",
        flexShrink: 0,
      }}
    >
      {/* Page Nav */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          style={navBtnStyle}
          disabled={currentPage === 1}
        >
          ‹
        </button>
        <span style={{ fontSize: "12px", color: "#66716C", fontWeight: 500, whiteSpace: "nowrap" }}>
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          style={navBtnStyle}
          disabled={currentPage === totalPages}
        >
          ›
        </button>
      </div>

      <div style={{ width: "1px", height: "18px", background: "#DDE2DE" }} />

      {/* Zoom */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <button onClick={() => onZoom(Math.max(50, zoom - 10))} style={navBtnStyle}>−</button>
        <span style={{ fontSize: "12px", color: "#66716C", fontWeight: 500, minWidth: "36px", textAlign: "center" }}>
          {zoom}%
        </span>
        <button onClick={() => onZoom(Math.min(200, zoom + 10))} style={navBtnStyle}>+</button>
      </div>

      <div style={{ width: "1px", height: "18px", background: "#DDE2DE" }} />

      {/* Search */}
      <div style={{ flex: 1, maxWidth: "280px", position: "relative" }}>
        <span
          style={{
            position: "absolute",
            left: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: "13px",
            color: "#66716C",
            pointerEvents: "none",
          }}
        >
          ⌕
        </span>
        <input
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search within paper..."
          style={{
            width: "100%",
            padding: "5px 10px 5px 30px",
            fontSize: "12px",
            background: "#F7F6F1",
            border: "1px solid #DDE2DE",
            borderRadius: "5px",
            color: "#17201D",
            outline: "none",
            fontFamily: "var(--font-sans)",
          }}
        />
      </div>

      <div style={{ marginLeft: "auto", display: "flex", gap: "6px" }}>
        <button style={{ ...navBtnStyle, padding: "5px 10px", fontSize: "12px" }}>References</button>
        <button style={{ ...navBtnStyle, padding: "5px 10px", fontSize: "12px" }}>Figures</button>
      </div>
    </div>
  );
}

const navBtnStyle: React.CSSProperties = {
  padding: "4px 8px",
  background: "transparent",
  border: "1px solid #DDE2DE",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "14px",
  color: "#66716C",
  lineHeight: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: "28px",
  minHeight: "28px",
};

/* ── Document Body ── */
function DocumentBody({
  selectionMenu,
  onSelectionClick,
}: {
  selectionMenu: boolean;
  onSelectionClick: () => void;
}) {
  return (
    <div style={{ padding: "48px 80px 80px", maxWidth: "820px", margin: "0 auto" }}>
      {/* Paper header */}
      <div style={{ marginBottom: "40px", paddingBottom: "32px", borderBottom: "1px solid #DDE2DE" }}>
        <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#66716C", marginBottom: "16px" }}>
          NeurIPS 2024 · Full Paper
        </div>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: "28px",
            lineHeight: 1.3,
            color: "#17201D",
            marginBottom: "20px",
            letterSpacing: "-0.01em",
          }}
        >
          Attention Is All You Need: Revisiting Transformer Architectures for Long-Context Reasoning
        </h1>
        <p style={{ fontSize: "13px", color: "#66716C", lineHeight: 1.6, marginBottom: "12px" }}>
          Vaswani, A., Shazeer, N., Parmar, N., Uszkoreit, J., Jones, L., Gomez, A. N., Kaiser, Ł., &amp; Polosukhin, I.
        </p>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <MetaTag label="Venue" value="Neural Information Processing Systems (NeurIPS)" />
          <MetaTag label="Year" value="2024" />
          <MetaTag label="DOI" value="10.48550/arXiv.2024.17823" link />
          <MetaTag label="Pages" value="42" />
        </div>
      </div>

      {/* Sections */}
      {documentBody.map((section) => (
        <div key={section.section} style={{ marginBottom: "36px" }}>
          <h2
            style={{
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: "#285C4D",
              marginBottom: "14px",
            }}
          >
            {section.section}
          </h2>
          <div style={{ position: "relative" }}>
            {section.section === "1. Introduction" && selectionMenu ? (
              <p
                style={{
                  fontSize: "15px",
                  lineHeight: 1.75,
                  color: "#17201D",
                  fontWeight: 400,
                }}
              >
                Recurrent neural networks, long short-term memory and gated recurrent neural networks in particular, have been firmly established as state of the art approaches in sequence modeling and transduction problems such as language modeling and machine translation. Numerous efforts have since continued to push the boundaries of recurrent language models and encoder-decoder architectures.
                <br /><br />
                <span
                  style={{
                    background: "#DCEBE4",
                    borderRadius: "2px",
                    padding: "1px 0",
                    position: "relative",
                    cursor: "text",
                  }}
                  onClick={onSelectionClick}
                >
                  attention mechanism to draw global dependencies between input and output
                  <SelectionTooltip onAsk={onSelectionClick} />
                </span>
                . In all but a few cases, however, such attention mechanisms are used in conjunction with a recurrent network.
                <br /><br />
                In this work we propose the Transformer, a model architecture eschewing recurrence and instead relying entirely on an attention mechanism to draw global dependencies between input and output. The Transformer allows for significantly more parallelization and can reach a new state of the art in translation quality after being trained for as little as twelve hours on eight P100 GPUs.
              </p>
            ) : (
              <p
                style={{
                  fontSize: "15px",
                  lineHeight: 1.75,
                  color: "#17201D",
                  fontWeight: 400,
                  whiteSpace: "pre-line",
                }}
              >
                {section.content}
              </p>
            )}
          </div>
        </div>
      ))}

      {/* Figure placeholder */}
      <div
        style={{
          border: "1px solid #DDE2DE",
          borderRadius: "8px",
          padding: "24px",
          marginBottom: "36px",
          background: "#FFFFFF",
        }}
      >
        <div
          style={{
            height: "160px",
            background: "#F7F6F1",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "12px",
            border: "1px dashed #DDE2DE",
          }}
        >
          <span style={{ fontSize: "13px", color: "#66716C" }}>Figure 1 — Transformer Architecture</span>
        </div>
        <p style={{ fontSize: "12px", color: "#66716C", textAlign: "center", fontStyle: "italic" }}>
          Figure 1: The Transformer model architecture. The encoder (left) and decoder (right) are each composed of a stack of identical layers.
        </p>
      </div>

      {/* More content indicator */}
      <div style={{ textAlign: "center", padding: "16px 0", color: "#66716C", fontSize: "13px" }}>
        · · ·
      </div>
    </div>
  );
}

function MetaTag({ label, value, link }: { label: string; value: string; link?: boolean }) {
  return (
    <div style={{ display: "flex", gap: "4px", alignItems: "baseline" }}>
      <span style={{ fontSize: "11px", fontWeight: 600, color: "#66716C", letterSpacing: "0.05em", textTransform: "uppercase" }}>
        {label}
      </span>
      <span
        style={{
          fontSize: "12px",
          color: link ? "#285C4D" : "#17201D",
          textDecoration: link ? "underline" : "none",
          cursor: link ? "pointer" : "default",
          fontWeight: 500,
        }}
      >
        {value}
      </span>
    </div>
  );
}

function SelectionTooltip({ onAsk }: { onAsk: () => void }) {
  return (
    <span
      style={{
        position: "absolute",
        bottom: "calc(100% + 8px)",
        left: "50%",
        transform: "translateX(-50%)",
        background: "#17201D",
        borderRadius: "8px",
        display: "flex",
        gap: "1px",
        zIndex: 50,
        overflow: "hidden",
        boxShadow: "0 4px 16px rgba(23,32,29,0.16)",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {[
        { label: "Ask Intelligence", action: onAsk, primary: true },
        { label: "Add Note", action: () => {} },
        { label: "Highlight", action: () => {} },
        { label: "Copy", action: () => {} },
      ].map((item) => (
        <button
          key={item.label}
          onClick={item.action}
          style={{
            padding: "8px 14px",
            background: item.primary ? "#285C4D" : "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: 600,
            color: "#DCEBE4",
            whiteSpace: "nowrap",
            transition: "background 0.1s",
            fontFamily: "var(--font-sans)",
          }}
        >
          {item.label}
        </button>
      ))}
    </span>
  );
}

/* ── Intelligence Panel ── */
function IntelligencePanel({
  query,
  onQueryChange,
  showResponse,
  onSubmit,
  selectedText,
}: {
  query: string;
  onQueryChange: (q: string) => void;
  showResponse: boolean;
  onSubmit: () => void;
  selectedText?: string;
}) {
  const actions = [
    { icon: "≡", label: "Summarize" },
    { icon: "◎", label: "Key findings" },
    { icon: "⊕", label: "Explain section" },
    { icon: "△", label: "Research gaps" },
    { icon: "⊛", label: "Methods" },
    { icon: "⊗", label: "Limitations" },
    { icon: "∿", label: "Related research" },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "20px" }}>
        <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#66716C", marginBottom: "4px" }}>
          Research Intelligence
        </div>
        <p style={{ fontSize: "12px", color: "#66716C", lineHeight: 1.5 }}>
          Contextual analysis for this paper.
        </p>
      </div>

      {/* Selected text context */}
      {selectedText && (
        <div
          style={{
            background: "#DCEBE4",
            borderRadius: "6px",
            padding: "10px 12px",
            marginBottom: "16px",
            borderLeft: "2px solid #285C4D",
          }}
        >
          <div style={{ fontSize: "10px", fontWeight: 700, color: "#285C4D", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "4px" }}>
            Selected Text
          </div>
          <p style={{ fontSize: "12px", color: "#173F35", lineHeight: 1.5, fontStyle: "italic" }}>
            "{selectedText}"
          </p>
        </div>
      )}

      {/* Quick actions */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {actions.map((a) => (
            <button
              key={a.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "6px 10px",
                background: "#F7F6F1",
                border: "1px solid #DDE2DE",
                borderRadius: "20px",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: 500,
                color: "#17201D",
                transition: "all 0.15s",
              }}
            >
              <span style={{ color: "#66716C", fontSize: "11px" }}>{a.icon}</span>
              {a.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ask input */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ position: "relative" }}>
          <textarea
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Ask something about this paper..."
            rows={3}
            style={{
              width: "100%",
              padding: "10px 12px",
              paddingBottom: "36px",
              fontSize: "13px",
              background: "#F7F6F1",
              border: "1px solid #DDE2DE",
              borderRadius: "8px",
              color: "#17201D",
              outline: "none",
              resize: "none",
              fontFamily: "var(--font-sans)",
              lineHeight: 1.5,
            }}
          />
          <button
            onClick={onSubmit}
            style={{
              position: "absolute",
              bottom: "8px",
              right: "8px",
              padding: "5px 14px",
              background: "#173F35",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: 600,
              color: "#DCEBE4",
              fontFamily: "var(--font-sans)",
            }}
          >
            Ask
          </button>
        </div>
      </div>

      {/* AI Response */}
      {showResponse && (
        <div style={{ borderTop: "1px solid #DDE2DE", paddingTop: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
            <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#285C4D" }}>
              Response
            </div>
            <div style={{ fontSize: "11px", color: "#66716C" }}>Sources: Abstract, p. 3–4, p. 7</div>
          </div>
          <p style={{ fontSize: "13px", lineHeight: 1.7, color: "#17201D", marginBottom: "16px" }}>
            {aiResponse.summary}
          </p>

          {/* Source references */}
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
            {aiResponse.pages.map((p) => (
              <span
                key={p}
                style={{
                  padding: "3px 8px",
                  background: "#DCEBE4",
                  borderRadius: "4px",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#173F35",
                }}
              >
                {p}
              </span>
            ))}
          </div>

          {/* Follow-ups */}
          <div style={{ borderTop: "1px solid #DDE2DE", paddingTop: "12px" }}>
            <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#66716C", marginBottom: "8px" }}>
              Follow-up
            </div>
            {[
              "How does positional encoding work?",
              "What are the limitations of this approach?",
              "Compare to RNN architectures",
            ].map((q) => (
              <button
                key={q}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "8px 10px",
                  marginBottom: "4px",
                  background: "#F7F6F1",
                  border: "1px solid #DDE2DE",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "12px",
                  color: "#17201D",
                  fontFamily: "var(--font-sans)",
                  lineHeight: 1.4,
                }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Notes Panel ── */
function NotesPanel({
  notes,
  newNote,
  onNewNote,
  onAddNote,
}: {
  notes: typeof savedNotes;
  newNote: string;
  onNewNote: (v: string) => void;
  onAddNote: () => void;
}) {
  const [noteType, setNoteType] = useState<string>("key-takeaway");
  const noteTypes = [
    { id: "key-takeaway", label: "Key Takeaway" },
    { id: "research-question", label: "Research Question" },
    { id: "action-item", label: "Action Item" },
    { id: "private", label: "Private Note" },
  ];

  const typeColors: Record<string, { bg: string; text: string; border: string }> = {
    "key-takeaway": { bg: "#DCEBE4", text: "#173F35", border: "#285C4D" },
    "research-question": { bg: "#F0EDE5", text: "#3D3011", border: "#8B7A35" },
    "action-item": { bg: "#F7F6F1", text: "#17201D", border: "#66716C" },
    "private": { bg: "#F7F6F1", text: "#66716C", border: "#DDE2DE" },
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "20px" }}>
        <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#66716C", marginBottom: "4px" }}>
          Notes
        </div>
        <p style={{ fontSize: "12px", color: "#66716C" }}>{notes.length} notes for this paper.</p>
      </div>

      {/* Create Note */}
      <div
        style={{
          background: "#F7F6F1",
          border: "1px solid #DDE2DE",
          borderRadius: "8px",
          padding: "12px",
          marginBottom: "20px",
        }}
      >
        {/* Note type selector */}
        <div style={{ display: "flex", gap: "4px", marginBottom: "10px", flexWrap: "wrap" }}>
          {noteTypes.map((t) => (
            <button
              key={t.id}
              onClick={() => setNoteType(t.id)}
              style={{
                padding: "3px 8px",
                borderRadius: "4px",
                fontSize: "11px",
                fontWeight: 600,
                border: "1px solid",
                cursor: "pointer",
                background: noteType === t.id ? typeColors[t.id].bg : "transparent",
                borderColor: noteType === t.id ? typeColors[t.id].border : "#DDE2DE",
                color: noteType === t.id ? typeColors[t.id].text : "#66716C",
                fontFamily: "var(--font-sans)",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
        <textarea
          value={newNote}
          onChange={(e) => onNewNote(e.target.value)}
          placeholder="Write a note..."
          rows={3}
          style={{
            width: "100%",
            padding: "8px 0",
            fontSize: "13px",
            background: "transparent",
            border: "none",
            borderBottom: "1px solid #DDE2DE",
            color: "#17201D",
            outline: "none",
            resize: "none",
            fontFamily: "var(--font-sans)",
            lineHeight: 1.5,
            marginBottom: "10px",
          }}
        />
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={onAddNote}
            style={{
              padding: "6px 14px",
              background: "#173F35",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: 600,
              color: "#DCEBE4",
              fontFamily: "var(--font-sans)",
            }}
          >
            Add Note
          </button>
        </div>
      </div>

      {/* Notes List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {notes.map((note) => {
          const colors = typeColors[note.type] || typeColors["private"];
          return (
            <div
              key={note.id}
              style={{
                background: "#FFFFFF",
                border: "1px solid #DDE2DE",
                borderLeft: `3px solid ${colors.border}`,
                borderRadius: "0 6px 6px 0",
                padding: "12px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: colors.border,
                  }}
                >
                  {note.type.replace("-", " ")}
                </span>
                <span style={{ fontSize: "11px", color: "#66716C" }}>
                  {note.page && `${note.page} · `}{note.time}
                </span>
              </div>
              {note.highlight && (
                <p style={{ fontSize: "11px", color: "#66716C", fontStyle: "italic", marginBottom: "6px", padding: "4px 8px", background: "#DCEBE4", borderRadius: "3px" }}>
                  "{note.highlight}"
                </p>
              )}
              <p style={{ fontSize: "13px", color: "#17201D", lineHeight: 1.5 }}>{note.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Error State ── */
function ErrorState() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        padding: "80px 40px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "12px",
          background: "#F7F6F1",
          border: "1px solid #DDE2DE",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "24px",
          marginBottom: "20px",
          color: "#66716C",
        }}
      >
        ⊘
      </div>
      <h2
        style={{
          fontFamily: "var(--font-serif)",
          fontStyle: "italic",
          fontSize: "22px",
          fontWeight: 400,
          color: "#17201D",
          marginBottom: "10px",
        }}
      >
        Artifact Unavailable
      </h2>
      <p style={{ fontSize: "14px", color: "#66716C", lineHeight: 1.6, maxWidth: "340px", marginBottom: "28px" }}>
        This paper could not be retrieved. The source may be restricted, removed, or temporarily unavailable.
      </p>
      <div style={{ display: "flex", gap: "10px" }}>
        <button
          style={{
            padding: "9px 18px",
            background: "#173F35",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: 600,
            color: "#DCEBE4",
            fontFamily: "var(--font-sans)",
          }}
        >
          Try Again
        </button>
        <button
          style={{
            padding: "9px 18px",
            background: "transparent",
            border: "1px solid #DDE2DE",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: 500,
            color: "#66716C",
            fontFamily: "var(--font-sans)",
          }}
        >
          View Source
        </button>
        <button
          style={{
            padding: "9px 18px",
            background: "transparent",
            border: "1px solid #DDE2DE",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: 500,
            color: "#66716C",
            fontFamily: "var(--font-sans)",
          }}
        >
          ← Back to Explorer
        </button>
      </div>
      <div
        style={{
          marginTop: "40px",
          padding: "16px 20px",
          background: "#FFFFFF",
          border: "1px solid #DDE2DE",
          borderRadius: "8px",
          maxWidth: "400px",
          textAlign: "left",
        }}
      >
        <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#66716C", marginBottom: "8px" }}>
          Details
        </div>
        <div style={{ fontSize: "12px", color: "#66716C", lineHeight: 1.6 }}>
          <div>DOI: 10.48550/arXiv.2024.17823</div>
          <div>Status: 403 Restricted Access</div>
          <div>Last attempted: just now</div>
        </div>
      </div>
    </div>
  );
}
