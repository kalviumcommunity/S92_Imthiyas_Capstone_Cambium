import { SectionWrapper, SectionHeader, SubLabel } from "./shared";

type NodeType = "researcher" | "paper" | "project" | "topic" | "opportunity" | "publication";

const nodeConfig: Record<NodeType, { color: string; bg: string; label: string; shape: "circle" | "rect" }> = {
  researcher: { color: "#1C1C1A", bg: "#F5F4F0", label: "Researcher", shape: "circle" },
  paper: { color: "#3A6FA8", bg: "#EEF3FA", label: "Paper", shape: "rect" },
  project: { color: "#4A7C59", bg: "#F2F7F4", label: "Project", shape: "rect" },
  topic: { color: "#9A9A96", bg: "#EFEDE8", label: "Topic", shape: "circle" },
  opportunity: { color: "#B8780A", bg: "#FDF5E6", label: "Opportunity", shape: "rect" },
  publication: { color: "#3A8C4F", bg: "#EFF7F1", label: "Publication", shape: "rect" },
};

function NodeBadge({ type, label }: { type: NodeType; label: string }) {
  const cfg = nodeConfig[type];
  if (cfg.shape === "circle") {
    return (
      <div className="flex flex-col items-center gap-1.5">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ background: cfg.bg, border: `1.5px solid ${cfg.color}33` }}
        >
          <span className="text-xs font-medium" style={{ color: cfg.color }}>
            {label.slice(0, 2).toUpperCase()}
          </span>
        </div>
        <span className="text-xs" style={{ color: cfg.color }}>{label}</span>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className="px-3 py-1.5 rounded-md flex items-center justify-center"
        style={{ background: cfg.bg, border: `1px solid ${cfg.color}33` }}
      >
        <span className="text-xs font-medium whitespace-nowrap" style={{ color: cfg.color }}>{label}</span>
      </div>
    </div>
  );
}

function ConnectionLine({ label, dash }: { label: string; dash?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1" style={{ minWidth: 80 }}>
      <div
        style={{
          width: "100%",
          height: 1,
          background: dash ? "transparent" : "var(--c-border-strong)",
          backgroundImage: dash
            ? "repeating-linear-gradient(to right, var(--c-border-strong) 0, var(--c-border-strong) 4px, transparent 4px, transparent 8px)"
            : "none",
        }}
      />
      <span className="text-xs" style={{ color: "var(--c-text-tertiary)" }}>{label}</span>
    </div>
  );
}

function NetworkExample({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="p-5 rounded-xl"
      style={{ border: "1px solid var(--c-border-default)", background: "var(--c-surface-raised)" }}
    >
      <p className="text-xs font-semibold mb-4" style={{ color: "var(--c-text-secondary)" }}>{title}</p>
      <div className="flex items-center gap-2 flex-wrap">{children}</div>
    </div>
  );
}

export default function ResearchViz() {
  return (
    <SectionWrapper id="10-research-viz">
      <SectionHeader
        number="10"
        title="Research Visualization"
        description="A restrained visual language for connected research. Subtle, intelligent, not sci-fi."
      />

      {/* Node type legend */}
      <div className="mb-12">
        <SubLabel>Node Types</SubLabel>
        <div className="grid grid-cols-6 gap-4">
          {(Object.keys(nodeConfig) as NodeType[]).map((type) => {
            const cfg = nodeConfig[type];
            return (
              <div
                key={type}
                className="p-4 rounded-lg flex flex-col items-center gap-3"
                style={{ border: "1px solid var(--c-border-default)", background: "var(--c-surface-raised)" }}
              >
                {cfg.shape === "circle" ? (
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: cfg.bg, border: `1.5px solid ${cfg.color}44` }}
                  >
                    <span className="text-xs font-semibold" style={{ color: cfg.color }}>
                      {cfg.label.slice(0, 1)}
                    </span>
                  </div>
                ) : (
                  <div
                    className="px-2.5 py-1 rounded"
                    style={{ background: cfg.bg, border: `1px solid ${cfg.color}33` }}
                  >
                    <span className="text-xs font-medium" style={{ color: cfg.color }}>
                      {cfg.label.slice(0, 2)}
                    </span>
                  </div>
                )}
                <p className="text-xs font-medium text-center" style={{ color: "var(--c-text-primary)" }}>{cfg.label}</p>
                <p className="text-xs text-center" style={{ color: "var(--c-text-tertiary)" }}>
                  {cfg.shape === "circle" ? "Circular node" : "Rectangular node"}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Connection types */}
      <div className="mb-12">
        <SubLabel>Connection Types</SubLabel>
        <div className="grid grid-cols-3 gap-4">
          {[
            { type: "Solid", desc: "Direct, strong relationship", dash: false },
            { type: "Dashed", desc: "Indirect, suggested relationship", dash: true },
            { type: "Backlink", desc: "Reverse citation or reference", dash: false },
          ].map(({ type, desc, dash }) => (
            <div
              key={type}
              className="p-4 rounded-lg"
              style={{ border: "1px solid var(--c-border-default)", background: "var(--c-surface-raised)" }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-4 h-4 rounded-full" style={{ background: "var(--c-border-strong)" }} />
                <div
                  style={{
                    flex: 1,
                    height: 1,
                    background: dash ? "transparent" : "var(--c-border-strong)",
                    backgroundImage: dash
                      ? "repeating-linear-gradient(to right, var(--c-border-strong) 0, var(--c-border-strong) 4px, transparent 4px, transparent 8px)"
                      : "none",
                  }}
                />
                <div className="w-4 h-4 rounded-full" style={{ background: "var(--c-border-strong)" }} />
              </div>
              <p className="text-xs font-semibold mb-1" style={{ color: "var(--c-text-primary)" }}>{type}</p>
              <p className="text-xs" style={{ color: "var(--c-text-secondary)" }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Relationship examples */}
      <SubLabel>Relationship Examples</SubLabel>
      <div className="grid grid-cols-2 gap-4">
        <NetworkExample title="Paper → Topic">
          <NodeBadge type="paper" label="Deep Learning Survey" />
          <div style={{ flex: 1, height: 1, background: "var(--c-border-default)", minWidth: 24 }} />
          <NodeBadge type="topic" label="ML" />
          <div style={{ flex: 1, height: 1, background: "var(--c-border-default)", minWidth: 24 }} />
          <NodeBadge type="topic" label="NLP" />
        </NetworkExample>

        <NetworkExample title="Researcher → Paper">
          <NodeBadge type="researcher" label="A. Chen" />
          <div style={{ flex: 1, height: 1, background: "var(--c-border-default)", minWidth: 24 }} />
          <NodeBadge type="paper" label="BERT Extensions" />
        </NetworkExample>

        <NetworkExample title="Researcher → Project">
          <NodeBadge type="researcher" label="K. Patel" />
          <div style={{ flex: 1, height: 1, background: "var(--c-border-default)", minWidth: 24 }} />
          <NodeBadge type="project" label="Climate ML" />
          <div style={{ flex: 1, height: 1, background: "var(--c-border-default)", minWidth: 24 }} />
          <NodeBadge type="researcher" label="L. Kim" />
        </NetworkExample>

        <NetworkExample title="Researcher ↔ Researcher">
          <NodeBadge type="researcher" label="M. Rao" />
          <div style={{ flex: 1, height: 1, backgroundImage: "repeating-linear-gradient(to right, var(--c-border-strong) 0, var(--c-border-strong) 4px, transparent 4px, transparent 8px)", minWidth: 24 }} />
          <NodeBadge type="researcher" label="S. Ali" />
        </NetworkExample>

        <NetworkExample title="Project → Dataset">
          <NodeBadge type="project" label="Gene Mapping" />
          <div style={{ flex: 1, height: 1, background: "var(--c-border-default)", minWidth: 24 }} />
          <NodeBadge type="publication" label="Dataset v2" />
        </NetworkExample>

        <NetworkExample title="Paper → Citation">
          <NodeBadge type="paper" label="Transformer XL" />
          <div style={{ flex: 1, height: 1, backgroundImage: "repeating-linear-gradient(to right, var(--c-border-default) 0, var(--c-border-default) 4px, transparent 4px, transparent 8px)", minWidth: 24 }} />
          <NodeBadge type="paper" label="Attention Is All" />
        </NetworkExample>
      </div>

      <div className="mt-8 p-5 rounded-lg" style={{ background: "var(--c-surface-sunken)", border: "1px solid var(--c-border-default)" }}>
        <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "var(--c-text-tertiary)" }}>Design principle</p>
        <p className="text-sm leading-relaxed" style={{ color: "var(--c-text-secondary)" }}>
          Research visualizations should prioritize readability over visual complexity. Use restraint: small nodes, thin lines, text labels, and careful whitespace. Let the structure of the research speak — don't impose a visual style on top of it.
        </p>
      </div>
    </SectionWrapper>
  );
}
