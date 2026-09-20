import { useState, useRef } from "react";

const categories = [
  {
    id: "getting-started",
    title: "Getting Started",
    description: "Set up your account, explore core features, and take your first steps with Cambium.",
    count: 12,
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 2L2 7l9 5 9-5-9-5z"/>
        <path d="M2 17l9 5 9-5"/>
        <path d="M2 12l9 5 9-5"/>
      </svg>
    ),
  },
  {
    id: "academic-identity",
    title: "Academic Identity",
    description: "Manage your scholarly profile, publications, affiliations, and citation linking.",
    count: 8,
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"/>
        <path d="M12 6v6l4 2"/>
      </svg>
    ),
  },
  {
    id: "ai-intelligence",
    title: "AI Intelligence",
    description: "Understand how Cambium's AI surfaces insights, suggests connections, and learns from your work.",
    count: 15,
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/>
        <path d="M17.5 14v7M14 17.5h7"/>
      </svg>
    ),
  },
  {
    id: "billing",
    title: "Billing & Plans",
    description: "Review subscription tiers, update payment methods, download invoices, and manage your plan.",
    count: 9,
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2"/>
        <path d="M2 10h20"/>
        <path d="M7 15h2M13 15h4"/>
      </svg>
    ),
  },
  {
    id: "integrations",
    title: "Integrations",
    description: "Connect Zotero, Google Scholar, institutional repositories, and third-party research tools.",
    count: 11,
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6" cy="6" r="3"/>
        <circle cx="18" cy="6" r="3"/>
        <circle cx="12" cy="18" r="3"/>
        <path d="M9 6h6M7.8 8.7l-2.6 6.6M16.2 8.7l2.6 6.6"/>
      </svg>
    ),
  },
  {
    id: "privacy-security",
    title: "Privacy & Security",
    description: "Control data sharing, enable two-factor authentication, and review access logs.",
    count: 7,
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L3 6v6c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V6L12 2z"/>
        <path d="M9 12l2 2 4-4"/>
      </svg>
    ),
  },
];

const issueTypes = [
  "Select issue type…",
  "Bug report",
  "Feature request",
  "Account access",
  "Billing inquiry",
  "Data & privacy",
  "Performance issue",
  "Other",
];

const popularArticles = [
  "How to import your existing publication list",
  "Understanding your AI-generated research digest",
  "Linking your ORCID to your Cambium profile",
  "Changing your billing cycle from monthly to annual",
  "Exporting your citation network as a graph",
];

export default function App() {
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [issueType, setIssueType] = useState("Select issue type…");
  const [description, setDescription] = useState("");
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = categories.filter(
    (c) =>
      query === "" ||
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.description.toLowerCase().includes(query.toLowerCase())
  );

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const dropped = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...dropped]);
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setModalOpen(false);
      setSubmitted(false);
      setIssueType("Select issue type…");
      setDescription("");
      setFiles([]);
    }, 2000);
  }

  function closeModal() {
    setModalOpen(false);
    setSubmitted(false);
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#F7F6F1", color: "#17201D", fontFamily: "'Manrope', sans-serif" }}
    >
      {/* Nav */}
      <header
        className="sticky top-0 z-10 border-b"
        style={{ backgroundColor: "#F7F6F1", borderColor: "#DDE2DE" }}
      >
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center"
              style={{ backgroundColor: "#173F35" }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7c0-2.76 2.24-5 5-5s5 2.24 5 5-2.24 5-5 5-5-2.24-5-5z" stroke="white" strokeWidth="1.4"/>
                <path d="M7 4.5v2.75l1.75 1" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-sm font-700" style={{ fontWeight: 700 }}>Cambium</span>
            <span className="text-sm" style={{ color: "#66716C" }}>/</span>
            <span className="text-sm" style={{ color: "#66716C" }}>Help Center</span>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="text-sm font-600 px-4 py-2 rounded-md transition-colors duration-150"
            style={{
              backgroundColor: "#173F35",
              color: "white",
              fontWeight: 600,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1f5447")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#173F35")}
          >
            Contact Support
          </button>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-5xl mx-auto px-6 pt-16 pb-20">
        <div className="text-center mb-10">
          <h1
            className="text-4xl mb-3 tracking-tight"
            style={{ fontFamily: "'Source Serif 4', serif", fontWeight: 600, color: "#17201D" }}
          >
            How can we help?
          </h1>
          <p className="text-base" style={{ color: "#66716C" }}>
            Search our guides, FAQs, and troubleshooting articles.
          </p>
        </div>

        {/* Search */}
        <div className="flex justify-center mb-12">
          <div className="relative w-full max-w-2xl">
            <div
              className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "#66716C" }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <circle cx="8" cy="8" r="5.5"/>
                <path d="M12.5 12.5L16 16"/>
              </svg>
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search guides, FAQs, or troubleshooting…"
              className="w-full h-14 pl-11 pr-4 rounded-lg text-base outline-none transition-all duration-150"
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #DDE2DE",
                color: "#17201D",
                fontFamily: "'Manrope', sans-serif",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#173F35")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#DDE2DE")}
            />
          </div>
        </div>

        {/* Category grid */}
        {query === "" ? (
          <div className="grid grid-cols-3 gap-4 mb-14" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
            {categories.map((cat) => (
              <button
                key={cat.id}
                className="text-left p-6 rounded-lg border bg-white transition-all duration-150 group"
                style={{ borderColor: "#DDE2DE", backgroundColor: "#FFFFFF" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#173F35";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#DDE2DE";
                }}
              >
                <div
                  className="mb-4 w-10 h-10 rounded-md flex items-center justify-center"
                  style={{ backgroundColor: "#F7F6F1", color: "#173F35" }}
                >
                  {cat.icon}
                </div>
                <h3 className="text-sm font-700 mb-1" style={{ fontWeight: 700, color: "#17201D" }}>
                  {cat.title}
                </h3>
                <p className="text-xs leading-relaxed mb-3" style={{ color: "#66716C" }}>
                  {cat.description}
                </p>
                <span className="text-xs" style={{ color: "#66716C" }}>
                  {cat.count} articles
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="mb-14">
            {filtered.length === 0 ? (
              <div className="text-center py-16" style={{ color: "#66716C" }}>
                <p className="text-base mb-2">No results for "{query}"</p>
                <p className="text-sm">
                  Try different keywords, or{" "}
                  <button
                    className="underline"
                    style={{ color: "#173F35" }}
                    onClick={() => setModalOpen(true)}
                  >
                    contact support
                  </button>
                  .
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
                {filtered.map((cat) => (
                  <button
                    key={cat.id}
                    className="text-left p-6 rounded-lg border bg-white transition-all duration-150"
                    style={{ borderColor: "#DDE2DE", backgroundColor: "#FFFFFF" }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#173F35")}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#DDE2DE")}
                  >
                    <div
                      className="mb-4 w-10 h-10 rounded-md flex items-center justify-center"
                      style={{ backgroundColor: "#F7F6F1", color: "#173F35" }}
                    >
                      {cat.icon}
                    </div>
                    <h3 className="text-sm font-700 mb-1" style={{ fontWeight: 700, color: "#17201D" }}>
                      {cat.title}
                    </h3>
                    <p className="text-xs leading-relaxed mb-3" style={{ color: "#66716C" }}>
                      {cat.description}
                    </p>
                    <span className="text-xs" style={{ color: "#66716C" }}>
                      {cat.count} articles
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Popular articles */}
        {query === "" && (
          <div
            className="rounded-lg border p-6"
            style={{ backgroundColor: "#FFFFFF", borderColor: "#DDE2DE" }}
          >
            <h2 className="text-sm font-700 mb-4" style={{ fontWeight: 700, color: "#17201D" }}>
              Popular articles
            </h2>
            <ul className="space-y-0">
              {popularArticles.map((article, i) => (
                <li key={i}>
                  <button
                    className="w-full text-left flex items-center justify-between py-3 text-sm transition-colors duration-100"
                    style={{ color: "#17201D", borderBottom: i < popularArticles.length - 1 ? "1px solid #DDE2DE" : "none" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#173F35")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#17201D")}
                  >
                    <span>{article}</span>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <path d="M3 7h8M8 4l3 3-3 3"/>
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer CTA */}
        <div className="mt-14 text-center">
          <p className="text-sm mb-3" style={{ color: "#66716C" }}>
            Didn't find what you were looking for?
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="text-sm font-600 transition-colors duration-150"
            style={{ color: "#173F35", fontWeight: 600 }}
            onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
            onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
          >
            Contact our support team →
          </button>
        </div>
      </main>

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(23, 32, 29, 0.4)", backdropFilter: "blur(4px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div
            className="w-full max-w-md rounded-lg p-6 relative"
            style={{
              backgroundColor: "#FFFFFF",
              boxShadow: "0 20px 60px rgba(23, 32, 29, 0.18), 0 4px 16px rgba(23, 32, 29, 0.08)",
              border: "1px solid #DDE2DE",
            }}
          >
            {submitted ? (
              <div className="text-center py-8">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: "#F7F6F1" }}
                >
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#173F35" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 12l5 5L18 6"/>
                  </svg>
                </div>
                <h2 className="text-base font-700 mb-2" style={{ fontWeight: 700 }}>
                  Ticket submitted
                </h2>
                <p className="text-sm" style={{ color: "#66716C" }}>
                  We'll get back to you within 1 business day.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Header */}
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h2
                      className="text-lg mb-0.5"
                      style={{ fontWeight: 700, fontFamily: "'Manrope', sans-serif", color: "#17201D" }}
                    >
                      Report an issue
                    </h2>
                    <p className="text-xs" style={{ color: "#66716C" }}>
                      Our team typically responds within 1 business day.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="w-7 h-7 flex items-center justify-center rounded-md transition-colors duration-100"
                    style={{ color: "#66716C" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#F7F6F1";
                      e.currentTarget.style.color = "#17201D";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "#66716C";
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                      <path d="M2 2l10 10M12 2L2 12"/>
                    </svg>
                  </button>
                </div>

                {/* Issue type */}
                <div className="mb-4">
                  <label className="block text-xs font-600 mb-1.5" style={{ fontWeight: 600, color: "#17201D" }}>
                    Issue type
                  </label>
                  <div className="relative">
                    <select
                      value={issueType}
                      onChange={(e) => setIssueType(e.target.value)}
                      required
                      className="w-full h-10 pl-3 pr-8 rounded-md text-sm appearance-none outline-none transition-all duration-150"
                      style={{
                        border: "1px solid #DDE2DE",
                        backgroundColor: "#FFFFFF",
                        color: issueType === "Select issue type…" ? "#66716C" : "#17201D",
                        fontFamily: "'Manrope', sans-serif",
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "#173F35")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "#DDE2DE")}
                    >
                      {issueTypes.map((t) => (
                        <option key={t} value={t} disabled={t === "Select issue type…"}>
                          {t}
                        </option>
                      ))}
                    </select>
                    <div
                      className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ color: "#66716C" }}
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                        <path d="M2 4l4 4 4-4"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label className="block text-xs font-600 mb-1.5" style={{ fontWeight: 600, color: "#17201D" }}>
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the issue in detail…"
                    required
                    rows={5}
                    className="w-full px-3 py-2.5 rounded-md text-sm resize-none outline-none transition-all duration-150"
                    style={{
                      border: "1px solid #DDE2DE",
                      backgroundColor: "#FFFFFF",
                      color: "#17201D",
                      fontFamily: "'Manrope', sans-serif",
                      height: "128px",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "#173F35";
                      e.currentTarget.style.boxShadow = "0 0 0 3px rgba(23, 63, 53, 0.08)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "#DDE2DE";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                </div>

                {/* File upload */}
                <div className="mb-5">
                  <label className="block text-xs font-600 mb-1.5" style={{ fontWeight: 600, color: "#17201D" }}>
                    Attachments{" "}
                    <span style={{ color: "#66716C", fontWeight: 400 }}>(optional)</span>
                  </label>
                  <div
                    className="rounded-md p-4 text-center cursor-pointer transition-colors duration-150"
                    style={{
                      border: `1.5px dashed ${dragging ? "#173F35" : "#DDE2DE"}`,
                      backgroundColor: dragging ? "rgba(23, 63, 53, 0.04)" : "#F7F6F1",
                    }}
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={handleFileInput}
                    />
                    <div className="flex flex-col items-center gap-1.5">
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#66716C" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 12v3a1 1 0 001 1h10a1 1 0 001-1v-3"/>
                        <path d="M9 2v9M6 5l3-3 3 3"/>
                      </svg>
                      {files.length > 0 ? (
                        <p className="text-xs" style={{ color: "#17201D" }}>
                          {files.length} file{files.length > 1 ? "s" : ""} selected
                        </p>
                      ) : (
                        <p className="text-xs" style={{ color: "#66716C" }}>
                          Drag and drop screenshots here or{" "}
                          <span style={{ color: "#173F35", fontWeight: 600 }}>click to browse</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-sm rounded-md transition-colors duration-100"
                    style={{
                      color: "#66716C",
                      border: "1px solid #DDE2DE",
                      backgroundColor: "transparent",
                      fontFamily: "'Manrope', sans-serif",
                      fontWeight: 500,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#173F35";
                      e.currentTarget.style.color = "#17201D";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#DDE2DE";
                      e.currentTarget.style.color = "#66716C";
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm rounded-md transition-colors duration-150"
                    style={{
                      backgroundColor: "#173F35",
                      color: "white",
                      fontFamily: "'Manrope', sans-serif",
                      fontWeight: 600,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1f5447")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#173F35")}
                  >
                    Submit ticket
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 500px) {
          .grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
