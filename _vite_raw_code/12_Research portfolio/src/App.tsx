import { useState } from "react"

// ─── Data ────────────────────────────────────────────────────────────────────

const NAV_SECTIONS = [
  { section: "HOME", items: ["Discover", "AI Assistant"] },
  {
    section: "RESEARCH",
    items: ["Workspace", "Papers", "Publications", "Projects", "Notes"],
  },
  {
    section: "COMMUNITY",
    items: ["Feed", "Researchers", "Labs", "Collaborations", "Messages"],
  },
  {
    section: "OPPORTUNITIES",
    items: ["Grants", "Conferences", "Journals", "Scholarships", "Fellowships"],
  },
  { section: "PERSONAL", items: ["Calendar", "Notifications", "Collections"] },
  { section: "PROFILE", items: ["My Profile", "Settings"] },
]

const TOPICS = [
  { label: "Medical Imaging", primary: true },
  { label: "Computer Vision", primary: false },
  { label: "Machine Learning", primary: false },
  { label: "Federated Learning", primary: false },
  { label: "Deep Learning", primary: false },
  { label: "Healthcare AI", primary: false },
]

const PUBLICATIONS = [
  {
    title: "Foundation Models for Medical Image Understanding",
    authors: ["Maya Chen", "Daniel Lee", "Priya Raman"],
    venue: "Journal of Medical AI",
    year: 2026,
    tags: ["Medical Imaging", "Foundation Models"],
  },
  {
    title: "Federated Learning for Privacy-Preserving Clinical Segmentation",
    authors: ["Maya Chen", "Elena Rodriguez", "Arjun Patel"],
    venue: "MICCAI 2025",
    year: 2025,
    tags: ["Federated Learning", "Segmentation"],
  },
  {
    title:
      "Low-Resource Adaptation of Vision Transformers for Histopathology",
    authors: ["Maya Chen", "James Wu"],
    venue: "Medical Image Analysis",
    year: 2024,
    tags: ["Computer Vision", "Histopathology"],
  },
]

const PROJECTS = [
  {
    name: "Low-Resource Medical Image Segmentation",
    status: "Active",
    description:
      "Developing lightweight segmentation models for medical imaging in environments with limited labeled data.",
    areas: ["Medical Imaging", "Computer Vision"],
    collaborators: ["Maya Chen", "Elena Rodriguez", "Arjun Patel"],
    updated: "2 hours ago",
  },
  {
    name: "Clinical Vision Benchmark",
    status: "Completed",
    description:
      "A standardized evaluation suite for clinical computer vision models across diverse imaging modalities.",
    areas: ["Medical AI", "Evaluation"],
    collaborators: ["Maya Chen", "James Wu"],
    updated: "3 months ago",
  },
  {
    name: "Multimodal Medical Report Generation",
    status: "Planning",
    description:
      "Exploring large multimodal models for automated radiology report generation from imaging data.",
    areas: ["Foundation Models", "NLP"],
    collaborators: ["Maya Chen"],
    updated: "1 week ago",
  },
]

const TIMELINE = [
  {
    year: "2026",
    event: "Started PhD research in Medical Imaging at AMET University",
    type: "milestone",
  },
  {
    year: "2025",
    event:
      "Published “Foundation Models for Medical Image Understanding” — Journal of Medical AI",
    type: "publication",
  },
  {
    year: "2025",
    event: "Joined AI & Medical Imaging Lab",
    type: "affiliation",
  },
  {
    year: "2024",
    event: "Research project: Low-Resource Clinical Vision",
    type: "project",
  },
  {
    year: "2023",
    event: "M.Tech in Computer Science — Specialization in Artificial Intelligence",
    type: "milestone",
  },
]

const QUESTIONS = [
  {
    text: "How can medical vision models remain reliable when labeled clinical data is scarce?",
    links: ["3 papers", "2 projects", "1 experiment"],
  },
  {
    text: "Can federated learning improve privacy without sacrificing model performance in heterogeneous clinical settings?",
    links: ["2 papers", "1 collaboration"],
  },
  {
    text: "What evaluation metrics best capture the clinical utility of AI segmentation models?",
    links: ["4 papers", "1 dataset"],
  },
]

const EXPERTISE: Record<string, string[]> = {
  "Research Methods": [
    "Experimental Design",
    "Literature Review",
    "Statistical Analysis",
    "Model Evaluation",
    "Ablation Studies",
  ],
  Technical: [
    "Python",
    "PyTorch",
    "OpenCV",
    "SQL",
    "MONAI",
    "Weights & Biases",
  ],
  Academic: [
    "Scientific Writing",
    "LaTeX",
    "Peer Review",
    "Research Communication",
    "Grant Writing",
  ],
}

const NETWORK = [
  {
    name: "Dr. Elena Rodriguez",
    role: "Associate Prof · Federated Learning",
    institution: "IIT Madras",
    relation: "Collaborator",
    initials: "ER",
    shared: "Federated Learning, Privacy",
  },
  {
    name: "Dr. Arjun Patel",
    role: "Research Scientist · Computer Vision",
    institution: "AIIMS",
    relation: "Collaborator",
    initials: "AP",
    shared: "Medical Imaging, Segmentation",
  },
  {
    name: "James Wu",
    role: "PhD Researcher · Foundation Models",
    institution: "NUS",
    relation: "Co-author",
    initials: "JW",
    shared: "Vision Transformers, Low-resource",
  },
  {
    name: "Dr. Priya Raman",
    role: "Asst. Prof · Medical AI",
    institution: "AMET University",
    relation: "Advisor",
    initials: "PR",
    shared: "Medical Imaging, Research Mentorship",
  },
]

const ACTIVITIES = [
  {
    type: "publication",
    action: "Published a paper",
    detail: "Foundation Models for Medical Image Understanding",
    time: "2 days ago",
  },
  {
    type: "note",
    action: "Updated Literature Review",
    detail: "Added 3 references on federated segmentation",
    time: "4 days ago",
  },
  {
    type: "experiment",
    action: "Started an experiment",
    detail: "Low-data adaptation: ViT-Tiny on ISIC 2024",
    time: "1 week ago",
  },
  {
    type: "discussion",
    action: "Joined a research discussion",
    detail: "Multimodal approaches in radiology AI",
    time: "1 week ago",
  },
  {
    type: "collaboration",
    action: "Connected with Dr. Elena Rodriguez",
    detail: "Federated Learning · Medical Vision",
    time: "2 weeks ago",
  },
  {
    type: "question",
    action: "Created a research question",
    detail: "Can federated models maintain clinical calibration?",
    time: "2 weeks ago",
  },
]

const ACTIVITY_COLORS: Record<string, string> = {
  publication: "#2D6A4F",
  note: "#4A6FA5",
  experiment: "#8B6A30",
  discussion: "#6B5B95",
  collaboration: "#2D6A4F",
  question: "#8B6A30",
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function statusChip(status: string) {
  if (status === "Active")
    return "text-[#2D6A4F] bg-[#E8F4EE] border border-[#B5D9C8]"
  if (status === "Completed")
    return "text-[#4A6FA5] bg-[#E8EEF7] border border-[#B5CAEF]"
  return "text-[#8B6A30] bg-[#F5EDD8] border border-[#DFC59A]"
}

function SectionHeading({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-[11px] font-semibold tracking-[0.1em] uppercase text-[#8B8680]">
        {children}
      </h2>
      {action}
    </div>
  )
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

function Sidebar({
  activeNav,
  onNav,
}: {
  activeNav: string
  onNav: (item: string) => void
}) {
  return (
    <aside
      className="fixed top-0 left-0 h-screen w-[212px] bg-white border-r border-[#E5E2DC] flex flex-col z-20 overflow-y-auto"
      aria-label="Primary navigation"
    >
      {/* Logo */}
      <div className="px-5 pt-6 pb-5">
        <span
          className="text-[15px] tracking-[0.06em] text-[#1A1A1A]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Cambium
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 pb-4">
        {NAV_SECTIONS.map((section) => (
          <div key={section.section} className="mb-4">
            <div className="px-2 mb-1 text-[9px] font-semibold tracking-[0.14em] text-[#B8B4AE] uppercase">
              {section.section}
            </div>
            {section.items.map((item) => (
              <button
                key={item}
                onClick={() => onNav(item)}
                className={`w-full text-left px-3 py-[5px] rounded-md text-[12.5px] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D6A4F]/40 ${
                  activeNav === item
                    ? "bg-[#E8F4EE] text-[#2D6A4F] font-medium"
                    : "text-[#6B6760] hover:bg-[#F5F4F1] hover:text-[#1A1A1A]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        ))}
      </nav>

      {/* User footer */}
      <div className="px-4 py-3 border-t border-[#E5E2DC] flex items-center gap-2.5">
        <img
          src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=64&h=64&fit=crop&auto=format"
          alt="Maya Chen"
          className="w-7 h-7 rounded-full object-cover flex-shrink-0"
        />
        <div className="min-w-0">
          <div className="text-[11.5px] font-medium text-[#1A1A1A] truncate leading-tight">
            Maya Chen
          </div>
          <div className="text-[10.5px] text-[#8B8680] leading-tight">
            PhD Researcher
          </div>
        </div>
      </div>
    </aside>
  )
}

// ─── Share Modal ──────────────────────────────────────────────────────────────

function ShareModal({ onClose }: { onClose: () => void }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl border border-[#E5E2DC] p-7 w-[400px] shadow-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="share-title"
          className="text-[18px] text-[#1A1A1A] mb-1"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Share your research profile
        </h2>
        <p className="text-[12px] text-[#8B8680] mb-5 leading-relaxed">
          Share your academic identity with colleagues, labs, and institutions.
        </p>

        {/* Preview */}
        <div className="bg-[#F7F6F3] border border-[#E5E2DC] rounded-lg p-4 mb-4">
          <div
            className="text-[15px] text-[#1A1A1A] leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Maya Chen
          </div>
          <div className="text-[12px] text-[#6B6760] mt-0.5">
            PhD Researcher · Medical Imaging
          </div>
          <div className="text-[11.5px] text-[#8B8680] mt-0.5">
            AMET University · Chennai, India
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <button
            onClick={handleCopy}
            className={`w-full text-left px-4 py-2.5 text-[13px] font-medium border rounded-lg transition-colors duration-150 ${
              copied
                ? "bg-[#E8F4EE] border-[#B5D9C8] text-[#2D6A4F]"
                : "border-[#E5E2DC] text-[#1A1A1A] hover:bg-[#F5F4F1]"
            }`}
          >
            {copied ? "Link copied" : "Copy profile link"}
          </button>
          <button className="w-full text-left px-4 py-2.5 text-[13px] font-medium border border-[#E5E2DC] rounded-lg text-[#1A1A1A] hover:bg-[#F5F4F1] transition-colors duration-150">
            Download profile PDF
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full text-[12px] text-[#8B8680] hover:text-[#4A4744] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D6A4F]/40 rounded"
        >
          Close
        </button>
      </div>
    </div>
  )
}

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [activeNav, setActiveNav] = useState("My Profile")
  const [following, setFollowing] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [expertiseTab, setExpertiseTab] = useState("Research Methods")
  const [savedPubs, setSavedPubs] = useState<Set<number>>(new Set())
  const [hoveredNetwork, setHoveredNetwork] = useState<number | null>(null)

  function toggleSaved(i: number) {
    setSavedPubs((prev) => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  return (
    <div
      className="flex min-h-screen bg-[#F7F6F3]"
      style={{ fontFamily: "var(--font-body)" }}
    >
      <Sidebar activeNav={activeNav} onNav={setActiveNav} />

      {/* Main scroll area */}
      <main className="ml-[212px] flex-1 min-h-screen">
        <div className="max-w-[1080px] mx-auto px-8 pt-8 pb-16">

          {/* ── Profile Header ─────────────────────────────────────── */}
          <header className="bg-white border border-[#E5E2DC] rounded-xl p-7 mb-6">
            <div className="flex items-start gap-6">

              {/* Photo */}
              <div className="relative flex-shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&auto=format"
                  alt="Maya Chen"
                  className="w-[88px] h-[88px] rounded-full object-cover ring-1 ring-[#E5E2DC]"
                />
                <div
                  className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-[#2D6A4F] border-2 border-white"
                  title="Active"
                  aria-label="Active"
                />
              </div>

              {/* Identity */}
              <div className="flex-1 min-w-0">
                <h1
                  className="text-[30px] text-[#1A1A1A] leading-tight"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Maya Chen
                </h1>
                <p className="text-[13.5px] text-[#6B6760] mt-0.5 font-light">
                  PhD Researcher · Medical Imaging
                </p>
                <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 mt-1.5">
                  <span className="text-[13px] text-[#4A4744]">AMET University</span>
                  <span className="text-[#C8C5C0] select-none">·</span>
                  <span className="text-[13px] text-[#4A4744]">Computer Science</span>
                  <span className="text-[#C8C5C0] select-none">·</span>
                  <span className="text-[13px] text-[#4A4744]">Chennai, India</span>
                </div>

                {/* Research interest tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {TOPICS.slice(0, 4).map((t) => (
                    <span
                      key={t.label}
                      className="text-[11px] px-2.5 py-[3px] rounded-full border border-[#E5E2DC] bg-[#F5F4F1] text-[#4A4744]"
                    >
                      {t.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex-shrink-0 flex flex-col items-end gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setFollowing((f) => !f)}
                    className={`px-4 py-1.5 rounded-md text-[12.5px] font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D6A4F]/40 ${
                      following
                        ? "bg-[#E8F4EE] text-[#2D6A4F] border border-[#B5D9C8]"
                        : "bg-[#2D6A4F] text-white hover:bg-[#266046]"
                    }`}
                  >
                    {following ? "Following" : "Follow"}
                  </button>
                  <button className="px-3.5 py-1.5 rounded-md text-[12.5px] font-medium border border-[#E5E2DC] text-[#4A4744] hover:bg-[#F5F4F1] transition-colors duration-150">
                    Message
                  </button>
                  <button className="px-3.5 py-1.5 rounded-md text-[12.5px] font-medium border border-[#E5E2DC] text-[#4A4744] hover:bg-[#F5F4F1] transition-colors duration-150">
                    Collaborate
                  </button>
                </div>
                <div className="flex items-center gap-2 text-[11.5px] text-[#8B8680]">
                  <button className="hover:text-[#4A4744] transition-colors duration-150">
                    Edit Profile
                  </button>
                  <span className="text-[#C8C5C0] select-none">·</span>
                  <button
                    onClick={() => setShareOpen(true)}
                    className="hover:text-[#4A4744] transition-colors duration-150"
                  >
                    Share
                  </button>
                  <span className="text-[#C8C5C0] select-none">·</span>
                  <button className="hover:text-[#4A4744] transition-colors duration-150">
                    More
                  </button>
                </div>
              </div>
            </div>

            {/* Bio + academic links */}
            <div className="mt-5 pt-5 border-t border-[#F0EDE8]">
              <p className="text-[13.5px] text-[#4A4744] leading-[1.65] max-w-[620px]">
                PhD researcher working at the intersection of medical imaging and
                machine learning. My current research focuses on reliable computer
                vision systems for low-resource clinical environments.
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
                {["ORCID", "Google Scholar", "GitHub", "LinkedIn", "Personal Website"].map(
                  (link) => (
                    <a
                      key={link}
                      href="#"
                      className="text-[12px] text-[#2D6A4F] hover:underline underline-offset-2 transition-colors duration-150"
                    >
                      {link}
                    </a>
                  )
                )}
              </div>
            </div>

            {/* AI context note */}
            <div className="mt-4 pt-4 border-t border-[#F0EDE8]">
              <p className="text-[11px] text-[#8B8680] leading-relaxed">
                <span className="text-[#2D6A4F] font-medium">Cambium</span> —
                Your profile is connected to 8 papers in Medical Imaging. Your current project
                overlaps with 4 researchers on the platform.
              </p>
            </div>
          </header>

          {/* ── Two-column body ────────────────────────────────────── */}
          <div className="grid grid-cols-[1fr_300px] gap-6 items-start">

            {/* ── LEFT ─────────────────────────────────────────────── */}
            <div className="space-y-6">

              {/* Research Focus */}
              <section aria-labelledby="focus-heading">
                <SectionHeading>
                  <span id="focus-heading">Research focus</span>
                </SectionHeading>
                <div className="flex flex-wrap gap-2">
                  {TOPICS.map((t) => (
                    <button
                      key={t.label}
                      className={`px-3.5 py-1.5 rounded-full text-[12px] border transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D6A4F]/30 hover:border-[#2D6A4F] hover:text-[#2D6A4F] hover:bg-[#E8F4EE] ${
                        t.primary
                          ? "bg-[#2D6A4F] text-white border-[#2D6A4F] font-medium"
                          : "bg-white text-[#4A4744] border-[#E5E2DC]"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </section>

              {/* Current Research */}
              <section
                className="bg-white border border-[#E5E2DC] rounded-xl p-6"
                aria-labelledby="current-heading"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2
                    id="current-heading"
                    className="text-[11px] font-semibold tracking-[0.1em] uppercase text-[#8B8680]"
                  >
                    Current research
                  </h2>
                  <span className="text-[10.5px] px-2 py-0.5 bg-[#E8F4EE] text-[#2D6A4F] border border-[#B5D9C8] rounded-full font-medium">
                    Active
                  </span>
                </div>
                <h3
                  className="text-[20px] text-[#1A1A1A] leading-snug mb-2"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Low-Resource Medical Image Segmentation
                </h3>
                <p className="text-[13px] text-[#6B6760] leading-relaxed mb-5">
                  Developing lightweight segmentation models for medical imaging
                  in environments with limited labeled data.
                </p>

                <div className="mb-4">
                  <div className="text-[10px] font-semibold tracking-[0.1em] uppercase text-[#B8B4AE] mb-2">
                    Research questions
                  </div>
                  <div className="space-y-2">
                    {[
                      "How can segmentation models perform reliably with limited labeled data?",
                      "Can federated learning improve privacy while maintaining clinical performance?",
                    ].map((q, i) => (
                      <div key={i} className="flex gap-2.5">
                        <span className="text-[#C8C5C0] flex-shrink-0 mt-0.5 text-[12px]">
                          —
                        </span>
                        <span
                          className="text-[13px] text-[#4A4744] italic leading-snug"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          {q}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-5">
                  {[
                    "Computer Vision",
                    "Deep Learning",
                    "Federated Learning",
                    "Medical Image Analysis",
                  ].map((m) => (
                    <span
                      key={m}
                      className="text-[10.5px] px-2 py-0.5 bg-[#F5F4F1] text-[#6B6760] rounded border border-[#E5E2DC]"
                    >
                      {m}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-[#F0EDE8]">
                  <button className="text-[12px] text-[#2D6A4F] font-medium hover:underline underline-offset-2">
                    View workspace
                  </button>
                  <span className="text-[#C8C5C0] select-none">·</span>
                  <button className="text-[12px] text-[#2D6A4F] font-medium hover:underline underline-offset-2">
                    View project
                  </button>
                  <span className="text-[#C8C5C0] select-none">·</span>
                  <button className="text-[12px] text-[#6B6760] hover:text-[#1A1A1A] hover:underline underline-offset-2">
                    Follow research
                  </button>
                </div>
              </section>

              {/* Publications */}
              <section aria-labelledby="pub-heading">
                <SectionHeading
                  action={
                    <button className="text-[12px] text-[#2D6A4F] hover:underline underline-offset-2">
                      View all →
                    </button>
                  }
                >
                  <span id="pub-heading">Selected publications</span>
                </SectionHeading>

                <div className="space-y-3">
                  {PUBLICATIONS.map((pub, i) => (
                    <article
                      key={i}
                      className="bg-white border border-[#E5E2DC] rounded-lg p-5 group hover:border-[#B5D9C8] transition-colors duration-200"
                    >
                      <div className="flex items-start justify-between gap-5">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-[14px] font-medium text-[#1A1A1A] leading-snug group-hover:text-[#2D6A4F] transition-colors duration-200">
                            {pub.title}
                          </h3>
                          <p className="text-[12px] text-[#8B8680] mt-1.5">
                            {pub.authors.join(" · ")}
                          </p>
                          <p className="text-[12px] text-[#8B8680] mt-0.5">
                            {pub.venue} · {pub.year}
                          </p>
                          <div className="flex flex-wrap gap-1.5 mt-2.5">
                            {pub.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-[10px] px-2 py-0.5 bg-[#F5F4F1] text-[#6B6760] rounded border border-[#E5E2DC]"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1.5 flex-shrink-0 pt-0.5">
                          <button className="text-[11.5px] text-[#2D6A4F] font-medium hover:underline underline-offset-2 whitespace-nowrap">
                            Read paper
                          </button>
                          <button className="text-[11.5px] text-[#8B8680] hover:text-[#4A4744] whitespace-nowrap transition-colors duration-150">
                            View citation
                          </button>
                          <button
                            onClick={() => toggleSaved(i)}
                            className={`text-[11.5px] whitespace-nowrap transition-colors duration-150 ${
                              savedPubs.has(i)
                                ? "text-[#2D6A4F] font-medium"
                                : "text-[#8B8680] hover:text-[#4A4744]"
                            }`}
                          >
                            {savedPubs.has(i) ? "Saved" : "Save"}
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              {/* Research Projects */}
              <section aria-labelledby="projects-heading">
                <SectionHeading>
                  <span id="projects-heading">Research projects</span>
                </SectionHeading>
                <div className="space-y-3">
                  {PROJECTS.map((project, i) => (
                    <article
                      key={i}
                      className="bg-white border border-[#E5E2DC] rounded-lg p-5 hover:border-[#C8C5C0] transition-colors duration-200"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <h3 className="text-[13.5px] font-medium text-[#1A1A1A]">
                              {project.name}
                            </h3>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${statusChip(project.status)}`}
                            >
                              {project.status}
                            </span>
                          </div>
                          <p className="text-[12.5px] text-[#6B6760] leading-relaxed mb-2.5">
                            {project.description}
                          </p>
                          <div className="flex flex-wrap gap-1.5 mb-2.5">
                            {project.areas.map((a) => (
                              <span
                                key={a}
                                className="text-[10.5px] px-1.5 py-0.5 text-[#6B6760] border border-[#E5E2DC] rounded"
                              >
                                {a}
                              </span>
                            ))}
                          </div>
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                            <span className="text-[11px] text-[#8B8680]">
                              {project.collaborators.join(", ")}
                            </span>
                            <span className="text-[#C8C5C0] select-none">·</span>
                            <span className="text-[11px] text-[#B8B4AE]">
                              Updated {project.updated}
                            </span>
                          </div>
                        </div>
                        <button className="flex-shrink-0 text-[11.5px] text-[#2D6A4F] font-medium hover:underline underline-offset-2 whitespace-nowrap pt-0.5">
                          View project
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              {/* Research Journey */}
              <section aria-labelledby="timeline-heading">
                <SectionHeading>
                  <span id="timeline-heading">Research journey</span>
                </SectionHeading>
                <div className="relative pl-5">
                  <div className="absolute left-1.5 top-2 bottom-2 w-px bg-[#E5E2DC]" />
                  <div className="space-y-5">
                    {TIMELINE.map((item, i) => (
                      <div key={i} className="relative">
                        <div className="absolute -left-[15px] top-[5px] w-2 h-2 rounded-full bg-white border-2 border-[#2D6A4F]" />
                        <div className="text-[10.5px] font-semibold text-[#2D6A4F] tracking-wider mb-0.5">
                          {item.year}
                        </div>
                        <div className="text-[13px] text-[#4A4744] leading-snug">
                          {item.event}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Research Questions */}
              <section aria-labelledby="questions-heading">
                <SectionHeading>
                  <span id="questions-heading">Questions I'm exploring</span>
                </SectionHeading>
                <div className="space-y-3">
                  {QUESTIONS.map((q, i) => (
                    <div
                      key={i}
                      className="bg-white border border-[#E5E2DC] rounded-lg p-5 hover:border-[#C8C5C0] transition-colors duration-200"
                    >
                      <p
                        className="text-[14.5px] text-[#1A1A1A] leading-[1.6] italic mb-3"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        "{q.text}"
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {q.links.map((link) => (
                          <button
                            key={link}
                            className="text-[11.5px] text-[#2D6A4F] hover:underline underline-offset-2 transition-colors duration-150"
                          >
                            {link}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* ── RIGHT ────────────────────────────────────────────── */}
            <div className="space-y-5">

              {/* Contributions */}
              <section
                className="bg-white border border-[#E5E2DC] rounded-xl p-5"
                aria-labelledby="contrib-heading"
              >
                <h2
                  id="contrib-heading"
                  className="text-[11px] font-semibold tracking-[0.1em] uppercase text-[#8B8680] mb-4"
                >
                  Contributions
                </h2>
                <div className="space-y-2.5">
                  {[
                    { label: "Publications", count: 12 },
                    { label: "Active projects", count: 4 },
                    { label: "Research datasets", count: 8 },
                    { label: "Research notes", count: 23 },
                    { label: "Experiments", count: 31 },
                    { label: "Research discussions", count: 17 },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between"
                    >
                      <span className="text-[12px] text-[#6B6760]">
                        {item.label}
                      </span>
                      <span className="text-[12px] font-medium text-[#1A1A1A]">
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Expertise */}
              <section
                className="bg-white border border-[#E5E2DC] rounded-xl p-5"
                aria-labelledby="expertise-heading"
              >
                <h2
                  id="expertise-heading"
                  className="text-[11px] font-semibold tracking-[0.1em] uppercase text-[#8B8680] mb-3"
                >
                  Expertise
                </h2>
                <div className="flex gap-1 mb-3">
                  {Object.keys(EXPERTISE).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setExpertiseTab(tab)}
                      className={`text-[10.5px] px-2.5 py-1 rounded-md transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D6A4F]/30 ${
                        expertiseTab === tab
                          ? "bg-[#E8F4EE] text-[#2D6A4F] font-medium"
                          : "text-[#8B8680] hover:bg-[#F5F4F1] hover:text-[#4A4744]"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {EXPERTISE[expertiseTab].map((skill) => (
                    <span
                      key={skill}
                      className="text-[11px] px-2.5 py-1 bg-[#F5F4F1] text-[#4A4744] rounded border border-[#E5E2DC]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>

              {/* Research Network */}
              <section
                className="bg-white border border-[#E5E2DC] rounded-xl p-5"
                aria-labelledby="network-heading"
              >
                <h2
                  id="network-heading"
                  className="text-[11px] font-semibold tracking-[0.1em] uppercase text-[#8B8680] mb-4"
                >
                  Research network
                </h2>
                <div className="space-y-3">
                  {NETWORK.map((person, i) => (
                    <div
                      key={i}
                      className="relative flex items-center gap-2.5 group cursor-default"
                      onMouseEnter={() => setHoveredNetwork(i)}
                      onMouseLeave={() => setHoveredNetwork(null)}
                    >
                      <div className="w-8 h-8 rounded-full bg-[#E8F4EE] text-[#2D6A4F] text-[10px] font-semibold flex items-center justify-center flex-shrink-0">
                        {person.initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[12px] font-medium text-[#1A1A1A] truncate group-hover:text-[#2D6A4F] transition-colors duration-150">
                          {person.name}
                        </div>
                        <div className="text-[10.5px] text-[#8B8680] truncate">
                          {person.role}
                        </div>
                      </div>
                      <span className="flex-shrink-0 text-[9.5px] px-1.5 py-0.5 bg-[#F5F4F1] text-[#6B6760] rounded border border-[#E5E2DC]">
                        {person.relation}
                      </span>

                      {/* Hover tooltip */}
                      {hoveredNetwork === i && (
                        <div className="absolute left-0 top-full mt-1.5 z-30 bg-white border border-[#E5E2DC] rounded-lg p-3.5 shadow-sm w-56 pointer-events-none">
                          <div className="text-[12px] font-medium text-[#1A1A1A]">
                            {person.name}
                          </div>
                          <div className="text-[11px] text-[#8B8680] mt-0.5">
                            {person.institution}
                          </div>
                          <div className="text-[11px] text-[#6B6760] mt-1.5 leading-snug">
                            Shared interests: {person.shared}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <button className="mt-3 text-[11.5px] text-[#2D6A4F] hover:underline underline-offset-2">
                  View full network →
                </button>
              </section>

              {/* Research Activity */}
              <section
                className="bg-white border border-[#E5E2DC] rounded-xl p-5"
                aria-labelledby="activity-heading"
              >
                <h2
                  id="activity-heading"
                  className="text-[11px] font-semibold tracking-[0.1em] uppercase text-[#8B8680] mb-4"
                >
                  Research activity
                </h2>
                <div className="space-y-3.5">
                  {ACTIVITIES.map((item, i) => (
                    <div key={i} className="flex gap-2.5">
                      <div
                        className="w-1.5 h-1.5 rounded-full mt-[5px] flex-shrink-0"
                        style={{
                          backgroundColor: ACTIVITY_COLORS[item.type],
                        }}
                      />
                      <div className="min-w-0">
                        <div className="text-[12px] font-medium text-[#1A1A1A] leading-tight">
                          {item.action}
                        </div>
                        <div className="text-[11px] text-[#8B8680] mt-0.5 leading-snug">
                          {item.detail}
                        </div>
                        <div className="text-[10px] text-[#B8B4AE] mt-0.5">
                          {item.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Research identity strength */}
              <section
                className="bg-white border border-[#E5E2DC] rounded-xl p-5"
                aria-labelledby="strength-heading"
              >
                <div className="flex items-center justify-between mb-3">
                  <h2
                    id="strength-heading"
                    className="text-[11px] font-semibold tracking-[0.1em] uppercase text-[#8B8680]"
                  >
                    Research identity
                  </h2>
                  <span className="text-[12px] font-medium text-[#2D6A4F]">
                    82%
                  </span>
                </div>
                <div className="w-full h-1 bg-[#F0EDE8] rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full bg-[#2D6A4F] rounded-full transition-all duration-500"
                    style={{ width: "82%" }}
                  />
                </div>
                <p className="text-[11px] text-[#6B6760] leading-relaxed mb-3">
                  Your profile is strong. Adding ORCID would make your academic
                  identity easier to verify.
                </p>
                <div className="space-y-1.5">
                  {["Add ORCID", "Connect GitHub", "Add another publication"].map(
                    (s) => (
                      <button
                        key={s}
                        className="block text-[11px] text-[#2D6A4F] hover:underline underline-offset-2 transition-colors duration-150"
                      >
                        {s} →
                      </button>
                    )
                  )}
                </div>
              </section>

              {/* Profile visibility */}
              <section
                className="bg-white border border-[#E5E2DC] rounded-xl p-5"
                aria-labelledby="visibility-heading"
              >
                <h2
                  id="visibility-heading"
                  className="text-[11px] font-semibold tracking-[0.1em] uppercase text-[#8B8680] mb-3"
                >
                  Profile visibility
                </h2>
                <div className="space-y-2">
                  {["Public", "Cambium members", "Private"].map((option) => (
                    <label
                      key={option}
                      className="flex items-center gap-2.5 cursor-pointer group"
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors duration-150 ${
                          option === "Public"
                            ? "border-[#2D6A4F] bg-[#2D6A4F]"
                            : "border-[#C8C5C0] group-hover:border-[#8B8680]"
                        }`}
                      >
                        {option === "Public" && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                      <span
                        className={`text-[12px] ${
                          option === "Public"
                            ? "text-[#1A1A1A] font-medium"
                            : "text-[#6B6760]"
                        }`}
                      >
                        {option}
                      </span>
                    </label>
                  ))}
                </div>
              </section>

              {/* Export */}
              <section
                className="bg-white border border-[#E5E2DC] rounded-xl p-5"
                aria-labelledby="export-heading"
              >
                <h2
                  id="export-heading"
                  className="text-[11px] font-semibold tracking-[0.1em] uppercase text-[#8B8680] mb-3"
                >
                  Export
                </h2>
                <div className="space-y-1.5">
                  {[
                    "Export Research CV",
                    "Export Publications",
                    "Export BibTeX",
                    "Export Profile PDF",
                  ].map((option) => (
                    <button
                      key={option}
                      className="block text-[12px] text-[#4A4744] hover:text-[#2D6A4F] transition-colors duration-150"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      {/* Share modal */}
      {shareOpen && <ShareModal onClose={() => setShareOpen(false)} />}
    </div>
  )
}
