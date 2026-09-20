import { useState } from "react";
import SectionWrapper, { ComponentGroup } from "@/components/SectionWrapper";

function PageTree() {
  const [expanded, setExpanded] = useState<string[]>(["project", "literature"]);
  const toggle = (id: string) =>
    setExpanded(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const ChevronRight = ({ open }: { open: boolean }) => (
    <svg className={`w-3 h-3 text-ink-3 transition-transform ${open ? "rotate-90" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 18l6-6-6-6"/>
    </svg>
  );
  const PageIcon = () => (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6"/>
    </svg>
  );

  return (
    <div className="bg-surface border border-line rounded-lg w-56 overflow-hidden">
      <div className="px-3 py-2.5 border-b border-line flex items-center justify-between">
        <p className="text-xs font-medium text-ink">Pages</p>
        <button className="text-ink-3 hover:text-ink transition-colors">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
        </button>
      </div>
      <div className="py-1.5 px-2 text-xs">
        {/* Project */}
        <div>
          <div onClick={() => toggle("project")} className="flex items-center gap-1.5 px-1.5 py-1.5 rounded hover:bg-surface-2 cursor-pointer group">
            <ChevronRight open={expanded.includes("project")} />
            <svg className="w-3.5 h-3.5 text-navy" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
            <span className="text-ink-2 font-medium">Federated Learning Study</span>
          </div>
          {expanded.includes("project") && (
            <div className="ml-5 border-l border-line pl-2 space-y-0.5 my-0.5">
              {["Research Overview", "Questions & Hypotheses"].map(p => (
                <div key={p} className="flex items-center gap-1.5 px-1.5 py-1 rounded hover:bg-surface-2 cursor-pointer text-ink-3 hover:text-ink transition-colors">
                  <PageIcon />
                  <span>{p}</span>
                </div>
              ))}
              <div>
                <div onClick={() => toggle("literature")} className="flex items-center gap-1.5 px-1.5 py-1 rounded hover:bg-surface-2 cursor-pointer text-ink-3 hover:text-ink transition-colors">
                  <ChevronRight open={expanded.includes("literature")} />
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                  <span>Literature Review</span>
                </div>
                {expanded.includes("literature") && (
                  <div className="ml-4 border-l border-line pl-2 space-y-0.5 my-0.5">
                    {["Reading List", "Notes"].map(p => (
                      <div key={p} className="flex items-center gap-1.5 px-1.5 py-1 rounded hover:bg-surface-2 cursor-pointer text-ink-3 hover:text-ink transition-colors">
                        <PageIcon />
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {["Experiments", "Paper Draft"].map(p => (
                <div key={p} className="flex items-center gap-1.5 px-1.5 py-1 rounded hover:bg-surface-2 cursor-pointer text-ink-3 hover:text-ink transition-colors">
                  <PageIcon />
                  <span>{p}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EditorBlocks() {
  return (
    <div className="bg-surface border border-line rounded-lg p-6 max-w-2xl space-y-5">
      {/* Document header */}
      <div className="pb-4 border-b border-line">
        <p className="text-[10px] text-ink-3 uppercase tracking-widest mb-1">Research Workspace · Project</p>
        <h1 className="font-serif text-2xl font-medium text-ink">Privacy-Preserving Federated Learning</h1>
        <div className="flex items-center gap-3 mt-2 text-[11px] text-ink-3">
          <span>Last edited 2 hours ago</span>
          <span>·</span>
          <div className="flex -space-x-1.5">
            {["ER", "JK"].map((i, idx) => (
              <div key={i} className={`w-5 h-5 rounded-full border border-white flex items-center justify-center text-[8px] font-bold ${idx === 0 ? "bg-navy-light text-navy" : "bg-sage-light text-sage"}`}>{i}</div>
            ))}
          </div>
          <span>2 editors</span>
        </div>
      </div>

      {/* Heading block */}
      <div className="group relative">
        <div className="absolute -left-6 top-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
          <button className="w-5 h-5 flex items-center justify-center text-ink-3 hover:text-ink rounded">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
          </button>
        </div>
        <h2 className="font-serif text-lg font-medium text-ink">Introduction</h2>
      </div>

      {/* Text block */}
      <div className="group relative">
        <p className="text-sm text-ink-2 leading-7">
          Federated learning enables collaborative model training across distributed data sources without centralizing sensitive patient data. This approach is particularly relevant for medical imaging applications where data governance and patient privacy are paramount.
        </p>
      </div>

      {/* Callout block */}
      <div className="flex gap-3 bg-navy-light border border-navy/15 rounded-lg px-4 py-3">
        <svg className="w-4 h-4 text-navy mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <p className="text-sm text-navy leading-relaxed">
          <strong className="font-medium">Key consideration:</strong> The privacy-utility tradeoff in federated learning depends heavily on the choice of privacy budget ε and the clipping threshold C.
        </p>
      </div>

      {/* Code block */}
      <div className="rounded-lg bg-ink overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
          <span className="text-[10px] text-white/50 font-mono uppercase tracking-widest">Python</span>
          <button className="text-[10px] text-white/50 hover:text-white transition-colors">Copy</button>
        </div>
        <pre className="px-4 py-3 text-xs leading-relaxed overflow-x-auto font-mono">
          <code className="text-white/80">
            {`def federated_average(models, weights):
    avg = {}
    for key in models[0].state_dict():
        avg[key] = sum(
            w * m.state_dict()[key]
            for m, w in zip(models, weights)
        )
    return avg`}
          </code>
        </pre>
      </div>

      {/* Paper embed */}
      <div className="flex items-start gap-3 bg-surface-2 border border-line rounded-lg p-3 hover:border-line-2 transition-colors cursor-pointer">
        <svg className="w-8 h-8 bg-surface border border-line rounded flex-shrink-0 p-1.5 text-ink-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6"/>
        </svg>
        <div>
          <p className="text-xs font-medium text-ink">Communication-Efficient Learning of Deep Networks from Decentralized Data</p>
          <p className="text-[11px] text-ink-3 mt-0.5">McMahan et al. · AISTATS 2017 · Cited 14,000+ times</p>
        </div>
        <svg className="w-3.5 h-3.5 text-ink-3 ml-auto flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
        </svg>
      </div>
    </div>
  );
}

function SlashCommandMenu() {
  const [query, setQuery] = useState("");
  const commands = [
    { icon: "H1", label: "Heading 1", desc: "Large section heading" },
    { icon: "¶", label: "Text", desc: "Plain paragraph text" },
    { icon: "❝", label: "Citation", desc: "Academic citation block" },
    { icon: "⚗", label: "Experiment", desc: "Research experiment block" },
    { icon: "?", label: "Question", desc: "Research question block" },
    { icon: "→", label: "Paper embed", desc: "Embed a linked paper" },
  ];
  return (
    <div className="bg-surface border border-line rounded-xl shadow-lg w-72 overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-line">
        <svg className="w-4 h-4 text-ink-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
        </svg>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Filter blocks…"
          className="flex-1 text-xs text-ink outline-none bg-transparent placeholder:text-ink-3"
        />
      </div>
      <div className="py-1">
        <p className="text-[10px] text-ink-3 uppercase tracking-widest px-3 py-1.5">Blocks</p>
        {commands.map(({ icon, label, desc }, i) => (
          <div
            key={label}
            className={`flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors ${i === 0 ? "bg-navy-light" : "hover:bg-surface-2"}`}
          >
            <div className={`w-7 h-7 rounded-md border flex items-center justify-center text-xs font-medium flex-shrink-0 ${i === 0 ? "bg-navy text-white border-navy" : "border-line text-ink-3 bg-surface"}`}>
              {icon}
            </div>
            <div>
              <p className={`text-xs font-medium ${i === 0 ? "text-navy" : "text-ink-2"}`}>{label}</p>
              <p className="text-[10px] text-ink-3">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BacklinkPanel() {
  return (
    <div className="bg-surface border border-line rounded-lg w-72 overflow-hidden">
      <div className="px-4 py-3 border-b border-line flex items-center justify-between">
        <p className="text-xs font-medium text-ink">Linked references</p>
        <span className="text-[10px] text-ink-3 bg-surface-2 px-1.5 py-0.5 rounded font-medium">4</span>
      </div>
      <div className="divide-y divide-line">
        {[
          { title: "Literature Review", context: "…relates to our federated approach…" },
          { title: "Questions & Hypotheses", context: "…supporting Hypothesis 2…" },
          { title: "Experiment: DP-FedAvg", context: "…baseline for comparison…" },
          { title: "Paper Draft — Section 3", context: "…cited in methodology…" },
        ].map(({ title, context }) => (
          <div key={title} className="px-4 py-2.5 hover:bg-surface-2 cursor-pointer transition-colors">
            <p className="text-xs font-medium text-ink mb-0.5">{title}</p>
            <p className="text-[11px] text-ink-3 italic">{context}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function WorkspaceSection() {
  return (
    <SectionWrapper
      id="workspace"
      number="11"
      title="Workspace Components"
      description="Document editing, navigation, and knowledge management components for Cambium's Research Workspace."
    >
      <ComponentGroup label="Page Tree" note="Hierarchical research document navigation">
        <PageTree />
      </ComponentGroup>
      <ComponentGroup label="Editor Blocks" note="Rich block-based document editor with research-native blocks">
        <EditorBlocks />
      </ComponentGroup>
      <ComponentGroup label="Slash Command Menu" note="Block insertion interface — triggered by /">
        <SlashCommandMenu />
      </ComponentGroup>
      <ComponentGroup label="Backlink Panel" note="Linked references to the current document">
        <BacklinkPanel />
      </ComponentGroup>
    </SectionWrapper>
  );
}
