import { useState } from "react";
import { Plus, Download, SlidersHorizontal, Sparkles } from "lucide-react";
import AttentionCard from "./AttentionCard";
import FeedItemCard from "./FeedItemCard";

const attentionCards = [
  {
    badge: "OPPORTUNITY",
    title: "NSF Graduate Research Fellowship — Climate AI Track",
    description:
      "Applications open for the 2027 cohort. Strong alignment with your work on predictive ecological modeling and ML-driven climate data pipelines.",
    match: 94,
    meta: "Deadline: Oct 18, 2026 · $37,000/yr",
    authors: undefined,
  },
  {
    badge: "PAPER",
    title: "Emergent Representations in Sparse Transformer Architectures",
    description:
      "A preprint from DeepMind explores how sparse attention heads develop structured internal representations without explicit supervision — directly relevant to your Chapter 3.",
    match: 88,
    meta: "arXiv · Sep 9, 2026",
    authors: "Park et al. · DeepMind",
  },
  {
    badge: "COLLABORATION",
    title: "Cross-disciplinary group: Language Models for Climate Risk",
    description:
      "A new working group at the intersection of NLP and climate science is forming ahead of NeurIPS 2026. 11 researchers already enrolled.",
    match: 91,
    meta: "Virtual · Kickoff Oct 2, 2026",
    authors: undefined,
  },
  {
    badge: "DATASET",
    title: "ERA5-ML: High-Resolution Reanalysis Embeddings (2000–2025)",
    description:
      "ECMWF releases a new embedding-first version of ERA5, pre-processed for direct ingestion into ML pipelines — covers the time range of your dissertation study.",
    match: 85,
    meta: "6.4 TB · CC BY 4.0 · ecmwf.int",
    authors: "ECMWF Copernicus Team",
  },
];

const feedItems = [
  {
    initials: "JL",
    badgeLabel: "RESEARCH UPDATE",
    author: "Dr. James Liu",
    role: "Stanford · Climate Informatics",
    date: "2h ago",
    title: "New findings on feedback loops in Arctic sea-ice extent under SSP5-8.5",
    body: "We've been running updated CESM2 simulations incorporating new albedo parameterizations. Early results suggest non-linear tipping behaviour appearing 8–12 years earlier than IPCC AR6 projections. Preprint incoming this week.",
    likes: 47,
    comments: 12,
    reposts: 9,
    tags: ["climateml", "arcticice", "CESM2"],
  },
  {
    initials: "NK",
    badgeLabel: "PAPER DISCUSSION",
    author: "Nadia Kowalski",
    role: "PhD Candidate · Oxford",
    date: "5h ago",
    title: "Thoughts on \"Scaling Laws for Biological Sequence Models\" (Nguyen et al., 2026)",
    body: "The analogy to LLM scaling laws is compelling, but I think the authors underestimate the distribution shift problem in cross-species transfer. Happy to share annotated notes — DM me or comment below.",
    likes: 31,
    comments: 24,
    reposts: 6,
    tags: ["bioinformatics", "scalinglaws", "sequencemodels"],
  },
  {
    initials: "RV",
    badgeLabel: "OPEN QUESTION",
    author: "Rajan Varma",
    role: "Postdoc · MPI-IS",
    date: "Yesterday",
    title: "What evaluation protocols do you trust for long-horizon climate forecasting?",
    body: "Benchmark fragmentation in the climate-ML space is getting worse. We're building an evaluation toolkit and would love input from practitioners before we finalize the metric set. What do you actually trust in your own work?",
    likes: 62,
    comments: 38,
    reposts: 17,
    tags: ["evaluation", "climateforecasting", "openscience"],
  },
];

const tabs = ["For You", "Following", "Trending"];

export default function MainContent() {
  const [activeTab, setActiveTab] = useState("For You");

  return (
    <main
      className="flex-1 overflow-y-auto"
      style={{ background: "#FFFFFF", minWidth: 0 }}
    >
      <div style={{ maxWidth: 800, padding: "32px 40px", margin: "0 auto" }}>
        {/* Overline */}
        <p
          className="mb-2"
          style={{
            fontSize: 10,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#66716C",
            fontFamily: "'Manrope', sans-serif",
            fontWeight: 600,
          }}
        >
          Friday, September 12
        </p>

        {/* Greeting */}
        <h1
          className="mb-6"
          style={{
            fontFamily: "'Source Serif 4', Georgia, serif",
            fontSize: 38,
            fontWeight: 600,
            color: "#17201D",
            lineHeight: 1.15,
            letterSpacing: "-0.5px",
          }}
        >
          Good morning, Maya.
        </h1>

        {/* Action row */}
        <div className="flex items-center gap-3 mb-10 flex-wrap">
          {[
            { icon: Plus, label: "New Post" },
            { icon: Download, label: "Import Paper" },
            { icon: SlidersHorizontal, label: "Refine Feed" },
            { icon: Sparkles, label: "Ask Cambium AI" },
          ].map(({ icon: Icon, label }) => (
            <button
              key={label}
              className="flex items-center gap-2 text-sm rounded-md px-3.5 py-2 transition-colors"
              style={{
                background: "#FFFFFF",
                border: "1px solid #DDE2DE",
                color: "#17201D",
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 500,
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.background = "#F7F6F1")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.background = "#FFFFFF")
              }
            >
              <Icon size={14} strokeWidth={1.5} />
              {label}
            </button>
          ))}
        </div>

        {/* Worth your attention */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <p
              style={{
                fontSize: 10,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#66716C",
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 600,
              }}
            >
              Worth your attention
            </p>
            <button
              className="text-xs transition-opacity hover:opacity-60"
              style={{ color: "#173F35", fontFamily: "'Manrope', sans-serif", fontWeight: 600 }}
            >
              View all →
            </button>
          </div>
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: "repeat(2, 1fr)" }}
          >
            {attentionCards.map((card) => (
              <AttentionCard key={card.title} {...card} />
            ))}
          </div>
        </section>

        {/* Research Feed */}
        <section>
          <p
            className="mb-4"
            style={{
              fontSize: 10,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#66716C",
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 600,
            }}
          >
            Research Feed
          </p>

          {/* Tabs */}
          <div
            className="flex items-center gap-6 mb-1"
            style={{ borderBottom: "1px solid #DDE2DE" }}
          >
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="text-sm pb-3 transition-colors relative"
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontWeight: activeTab === tab ? 600 : 400,
                  color: activeTab === tab ? "#17201D" : "#66716C",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  borderBottom: activeTab === tab ? "2px solid #173F35" : "2px solid transparent",
                  marginBottom: -1,
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Feed items */}
          <div>
            {feedItems.map((item) => (
              <FeedItemCard key={item.title} {...item} />
            ))}
          </div>

          {/* Load more */}
          <div className="py-6 flex justify-center">
            <button
              className="text-sm rounded-md px-5 py-2 transition-colors"
              style={{
                border: "1px solid #DDE2DE",
                background: "#FFFFFF",
                color: "#66716C",
                fontFamily: "'Manrope', sans-serif",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.background = "#F7F6F1")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.background = "#FFFFFF")
              }
            >
              Load more posts
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
