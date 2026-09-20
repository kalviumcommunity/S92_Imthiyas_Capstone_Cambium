import { useEffect, useRef, type ReactNode } from "react";

const releases = [
  {
    id: 1,
    date: "September 12, 2026",
    version: "Cambium 1.4",
    title: "Enhanced Global Search",
    latest: true,
    image: {
      src: "https://images.unsplash.com/photo-1555421689-491a97ff2040?w=800&h=420&fit=crop&auto=format",
      alt: "Global search interface showing universal command palette in Cambium",
    },
    tags: [
      { label: "New", style: "new" as const },
      { label: "Universal Command Palette", style: "new" as const },
    ],
    body: "Cambium 1.4 introduces a redesigned global search experience built around a universal command palette. Reach any paper, project, annotation, or collaborator from a single keystroke — ⌘K from anywhere in the interface. Results are ranked by semantic relevance, recency, and your personal activity graph, so the answer you need surfaces before you've finished typing.",
    highlights: [
      "Semantic full-text search across all linked repositories",
      "Filter by content type: papers, notes, datasets, people",
      "Command history and pinned shortcuts per workspace",
    ],
  },
  {
    id: 2,
    date: "August 28, 2026",
    version: "Cambium 1.3",
    title: "Institutional SSO",
    latest: false,
    image: null,
    tags: [
      { label: "Improved", style: "improved" as const },
      { label: "Performance rendering for large datasets", style: "improved" as const },
    ],
    body: "Organizations on Cambium can now provision access through their existing identity providers — Okta, Azure AD, and Google Workspace are supported at launch. Administrators gain fine-grained role controls, and researchers sign in without managing a separate credential. Dataset rendering for collections exceeding 50,000 entries has been rewritten for up to 4× faster initial paint.",
    highlights: [
      "SAML 2.0 and OIDC support for all major enterprise IdPs",
      "Automatic seat provisioning via SCIM directory sync",
      "Virtual scrolling for citation lists and annotation feeds",
    ],
  },
  {
    id: 3,
    date: "August 5, 2026",
    version: "Cambium 1.2",
    title: "Collaborative Annotation Layer",
    latest: false,
    image: {
      src: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&h=420&fit=crop&auto=format",
      alt: "Collaborative annotation view showing highlighted text with team comments",
    },
    tags: [
      { label: "New", style: "new" as const },
      { label: "Fixed", style: "fixed" as const },
      { label: "Annotation sync latency", style: "fixed" as const },
    ],
    body: "Real-time annotation is now available across all paper formats — PDFs, HTML preprints, and linked datasets. Highlight passages, attach structured notes, and reply to teammates inline. Annotations are versioned alongside the document, so you can track how team understanding of a paper evolved over time.",
    highlights: [
      "Threaded comments anchored to specific text ranges",
      "Annotation export to Notion, Obsidian, and plain Markdown",
      "Resolved a sync race condition causing duplicate highlights on reconnect",
    ],
  },
  {
    id: 4,
    date: "July 14, 2026",
    version: "Cambium 1.1",
    title: "Citation Graph & Reference Explorer",
    latest: false,
    image: null,
    tags: [
      { label: "New", style: "new" as const },
      { label: "Improved", style: "improved" as const },
      { label: "Bulk import reliability", style: "improved" as const },
    ],
    body: "The Citation Graph maps the intellectual lineage of any paper — upstream references and downstream citations — rendered as an interactive force-directed canvas. Explore how ideas propagate across research communities, identify foundational works, and surface emerging literature in adjacent fields.",
    highlights: [
      "Bidirectional citation traversal up to 3 degrees of separation",
      "Author co-citation clustering for community detection",
      "BibTeX / RIS bulk import now handles malformed entries gracefully",
    ],
  },
];

type TagStyle = "new" | "improved" | "fixed";

function Tag({ label, style }: { label: string; style: TagStyle }) {
  const base = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide";
  const variants: Record<TagStyle, string> = {
    new: `${base} bg-[#DCEBE4] text-[#173F35]`,
    improved: `${base} bg-[#F7F6F1] border border-[#DDE2DE] text-[#17201D]`,
    fixed: `${base} bg-white border border-[#DDE2DE] text-[#66716C]`,
  };
  return <span className={variants[style]}>{label}</span>;
}

function RevealBlock({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("revealed");
          observer.unobserve(el);
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="reveal-block"
    >
      {children}
    </div>
  );
}

export default function App() {
  return (
    <>
      <style>{`
        .reveal-block {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.55s cubic-bezier(.22,1,.36,1), transform 0.55s cubic-bezier(.22,1,.36,1);
        }
        .reveal-block.revealed {
          opacity: 1;
          transform: translateY(0);
        }
        .timeline-dot-solid {
          width: 12px;
          height: 12px;
          background: #173F35;
          border-radius: 50%;
          flex-shrink: 0;
          margin-top: 6px;
          box-shadow: 0 0 0 3px #F7F6F1, 0 0 0 4px #173F35;
        }
        .timeline-dot-hollow {
          width: 10px;
          height: 10px;
          background: #F7F6F1;
          border: 2px solid #DDE2DE;
          border-radius: 50%;
          flex-shrink: 0;
          margin-top: 7px;
        }
      `}</style>

      <div
        className="min-h-screen"
        style={{ backgroundColor: "#F7F6F1", fontFamily: "'Manrope', sans-serif" }}
      >
        <div className="max-w-3xl mx-auto px-6 py-16">

          {/* Page header */}
          <div className="mb-14">
            <h1
              style={{ fontFamily: "'Source Serif 4', serif", color: "#17201D" }}
              className="text-4xl font-semibold leading-tight mb-3"
            >
              Changelog
            </h1>
            <p className="text-base" style={{ color: "#66716C" }}>
              New updates and improvements to the Research Operating System.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical spine */}
            <div
              className="absolute left-[5px] top-0 bottom-0 w-px"
              style={{ backgroundColor: "#DDE2DE" }}
            />

            <div className="flex flex-col gap-14">
              {releases.map((release, idx) => (
                <RevealBlock key={release.id}>
                  <div className="flex gap-6" style={{ transitionDelay: `${idx * 60}ms` }}>
                    {/* Dot */}
                    <div className="flex flex-col items-center pt-1" style={{ minWidth: "12px" }}>
                      {release.latest
                        ? <div className="timeline-dot-solid" />
                        : <div className="timeline-dot-hollow" />
                      }
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Date */}
                      <p
                        className="text-xs font-mono mb-2 uppercase tracking-widest"
                        style={{ color: "#66716C" }}
                      >
                        {release.date}
                      </p>

                      {/* Version title */}
                      <h2
                        style={{ fontFamily: "'Source Serif 4', serif", color: "#17201D" }}
                        className="text-2xl font-semibold leading-snug mb-4"
                      >
                        <span style={{ color: "#173F35" }}>{release.version}:</span>{" "}
                        {release.title}
                      </h2>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-5">
                        {release.tags.map((tag, ti) => (
                          <Tag key={ti} label={tag.label} style={tag.style} />
                        ))}
                      </div>

                      {/* Image */}
                      {release.image && (
                        <div
                          className="mb-5 rounded-lg overflow-hidden"
                          style={{ border: "1px solid #DDE2DE", backgroundColor: "#DCEBE4" }}
                        >
                          <img
                            src={release.image.src}
                            alt={release.image.alt}
                            className="w-full object-cover"
                            style={{ height: "240px", display: "block" }}
                            loading="lazy"
                          />
                        </div>
                      )}

                      {/* Body */}
                      <p
                        className="text-sm leading-relaxed mb-5"
                        style={{ color: "#17201D" }}
                      >
                        {release.body}
                      </p>

                      {/* Highlights */}
                      <ul className="flex flex-col gap-2">
                        {release.highlights.map((h, hi) => (
                          <li key={hi} className="flex items-start gap-2.5 text-sm" style={{ color: "#66716C" }}>
                            <span
                              className="mt-[6px] flex-shrink-0 rounded-full"
                              style={{ width: "5px", height: "5px", backgroundColor: "#DDE2DE" }}
                            />
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </RevealBlock>
              ))}
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-20 pt-8" style={{ borderTop: "1px solid #DDE2DE" }}>
            <p className="text-sm" style={{ color: "#66716C" }}>
              For early access to upcoming features, reach out to your account team or visit the{" "}
              <a
                href="#"
                className="underline underline-offset-2 hover:text-[#173F35] transition-colors"
                style={{ color: "#66716C" }}
              >
                Cambium roadmap
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
