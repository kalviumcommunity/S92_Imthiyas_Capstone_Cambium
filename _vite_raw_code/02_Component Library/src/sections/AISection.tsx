import SectionWrapper, { ComponentGroup } from "@/components/SectionWrapper";

function SparkleIcon({ size = "sm" }: { size?: "sm" | "md" }) {
  const cls = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";
  return (
    <svg className={`${cls} text-iris`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M12 3l1.88 5.47L19 10.5l-5.12 1.97L12 18l-1.88-5.53L5 10.5l5.12-1.03z"/>
    </svg>
  );
}

function AISuggestionInline() {
  return (
    <div className="space-y-3 max-w-xl">
      <p className="text-sm text-ink-3 mb-1">In-editor AI suggestion — appears inline, not as a chat bubble</p>
      <div className="bg-surface border border-line rounded-lg p-4">
        <p className="text-sm text-ink-2 leading-7 mb-2">
          The privacy-utility tradeoff in federated learning depends on the privacy budget ε and clipping threshold.
          <span className="relative inline-block ml-1">
            <span className="bg-iris-light text-iris rounded px-1 border-b border-dashed border-iris/40 cursor-pointer text-sm">
              Consider citing Dwork et al. (2006) for the formal definition of ε-differential privacy here.
            </span>
          </span>
        </p>
        <div className="flex items-center gap-2 pt-2 border-t border-line mt-2">
          <SparkleIcon />
          <span className="text-[11px] text-iris font-medium">Cambium suggests a citation</span>
          <div className="ml-auto flex gap-2">
            <button className="text-[11px] text-navy font-medium hover:underline">Insert citation</button>
            <button className="text-[11px] text-ink-3 hover:text-ink">Dismiss</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AIInsight() {
  return (
    <div className="bg-surface border border-iris/20 rounded-lg p-4 max-w-sm">
      <div className="flex items-center gap-2 mb-3">
        <SparkleIcon />
        <p className="text-xs font-medium text-iris">Research insight</p>
      </div>
      <p className="text-sm text-ink-2 leading-relaxed mb-3">
        This paper is connected to <strong className="text-ink font-medium">4 papers you are currently reading</strong> and directly supports Hypothesis 2 in your active project.
      </p>
      <div className="space-y-1.5 mb-3">
        {["McMahan et al. (2017) — FedAvg", "Dwork & Roth (2014) — Differential Privacy"].map(p => (
          <div key={p} className="flex items-center gap-2 text-[11px] text-ink-3">
            <div className="w-1 h-1 rounded-full bg-iris flex-shrink-0" />
            {p}
          </div>
        ))}
        <div className="text-[11px] text-iris pl-3">+2 more connections</div>
      </div>
      <button className="text-[11px] text-iris font-medium hover:underline">View knowledge graph →</button>
    </div>
  );
}

function AISummary() {
  return (
    <div className="bg-surface border border-line rounded-lg overflow-hidden max-w-lg">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-line">
        <SparkleIcon />
        <p className="text-xs font-medium text-ink">Paper summary</p>
        <span className="ml-auto text-[10px] text-ink-3">AI-generated · Not a substitute for reading</span>
      </div>
      <div className="px-4 py-4">
        <h4 className="text-sm font-medium text-ink mb-2">Federated Learning in Medical Imaging (2024)</h4>
        <p className="text-xs text-ink-2 leading-relaxed mb-4">
          This systematic review examines 47 federated learning studies applied to medical imaging tasks. The authors find that federated approaches achieve 94–97% of centralized model accuracy while providing meaningful privacy guarantees. Key challenges identified include statistical heterogeneity across institutions and the communication overhead of large medical image datasets.
        </p>
        <div className="space-y-2">
          <p className="text-[10px] text-ink-3 uppercase tracking-widest">Key contributions</p>
          {[
            "Taxonomy of FL privacy mechanisms in medical imaging",
            "Benchmark across 8 imaging modalities and 12 FL algorithms",
            "Analysis of communication-privacy-accuracy tradeoffs",
          ].map(c => (
            <div key={c} className="flex items-start gap-2 text-xs text-ink-2">
              <div className="w-1 h-1 rounded-full bg-ink-3 mt-1.5 flex-shrink-0" />
              {c}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AIResearchMatch() {
  return (
    <div className="bg-surface border border-line rounded-lg p-4 max-w-sm">
      <div className="flex items-center gap-2 mb-3">
        <SparkleIcon />
        <p className="text-xs font-medium text-ink">Related to your current project</p>
      </div>
      <div className="space-y-3">
        {[
          { title: "Adaptive Differential Privacy in Federated Systems", type: "Paper", match: 97 },
          { title: "Early Career Fellowship — Privacy-Preserving AI", type: "Opportunity", match: 91 },
          { title: "Dr. Reza Shokri", type: "Researcher", match: 88 },
        ].map(({ title, type, match }) => (
          <div key={title} className="flex items-center gap-3 group cursor-pointer">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-ink truncate">{title}</p>
              <p className="text-[10px] text-ink-3">{type}</p>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <div className="w-12 h-1 bg-surface-3 rounded-full overflow-hidden">
                <div className="h-full bg-iris rounded-full" style={{ width: `${match}%` }} />
              </div>
              <span className="text-[10px] text-iris font-medium w-8">{match}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AICopilotPanel() {
  return (
    <div className="bg-surface border border-line rounded-xl overflow-hidden w-80">
      <div className="px-4 py-3 border-b border-line flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SparkleIcon size="md" />
          <p className="text-sm font-medium text-ink">Research copilot</p>
        </div>
        <button className="text-ink-3 hover:text-ink transition-colors">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <div className="p-4 space-y-3 bg-surface-2">
        {/* Proactive insight */}
        <div className="bg-surface border border-iris/15 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <SparkleIcon />
            <div>
              <p className="text-xs text-ink-2 leading-relaxed">
                <strong className="text-ink font-medium">Potential research gap detected.</strong>{" "}
                Your literature review covers classification tasks well, but longitudinal EHR federated learning is underrepresented. 2 recent papers address this.
              </p>
              <button className="text-[11px] text-iris font-medium mt-1.5 hover:underline">Show papers →</button>
            </div>
          </div>
        </div>
        {/* Another insight */}
        <div className="bg-surface border border-line rounded-lg p-3">
          <div className="flex items-start gap-2">
            <SparkleIcon />
            <p className="text-xs text-ink-2 leading-relaxed">
              Based on your reading history, the NeurIPS workshop on privacy-preserving ML might be relevant. Submission deadline: Sep 30.
            </p>
          </div>
        </div>
      </div>

      {/* Prompt input */}
      <div className="px-4 py-3 border-t border-line">
        <div className="flex items-center gap-2 bg-surface-2 border border-line rounded-lg px-3 py-2">
          <input
            className="flex-1 text-xs text-ink placeholder:text-ink-3 outline-none bg-transparent"
            placeholder="Ask about your research…"
          />
          <button className="w-6 h-6 bg-iris rounded-md flex items-center justify-center hover:opacity-90 transition-opacity flex-shrink-0">
            <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
        <p className="text-[10px] text-ink-3 mt-2 text-center">AI assists your research — always verify sources</p>
      </div>
    </div>
  );
}

function AISearchResult() {
  return (
    <div className="max-w-xl space-y-3">
      <div className="bg-surface border border-line rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <SparkleIcon />
          <p className="text-xs font-medium text-iris">AI overview</p>
          <span className="ml-auto text-[10px] text-ink-3">For "federated learning medical imaging"</span>
        </div>
        <p className="text-sm text-ink-2 leading-relaxed">
          Federated learning in medical imaging allows hospitals to collaboratively train models without sharing patient data. Recent benchmarks show 94–97% of centralized accuracy with (ε, δ)-differential privacy guarantees at ε=1.0. Key challenges include non-IID data distributions and communication efficiency.
        </p>
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-line">
          <button className="text-[11px] text-navy font-medium hover:underline">Save to notes</button>
          <button className="text-[11px] text-ink-3 hover:text-ink">View sources (12)</button>
        </div>
      </div>
    </div>
  );
}

export default function AISection() {
  return (
    <SectionWrapper
      id="ai"
      number="12"
      title="AI Components"
      description="AI is a quiet collaborator in Cambium — surfacing relevant information without demanding attention. No glowing orbs. No chatbot-first patterns."
    >
      <ComponentGroup label="AI Citation Suggestion" note="Inline, contextual, non-disruptive">
        <AISuggestionInline />
      </ComponentGroup>
      <ComponentGroup label="AI Insight" note="Knowledge graph connections made visible">
        <AIInsight />
      </ComponentGroup>
      <ComponentGroup label="AI Paper Summary" note="Generated summary with clear provenance disclaimer">
        <AISummary />
      </ComponentGroup>
      <ComponentGroup label="AI Research Match" note="Relevance scoring for papers, opportunities, researchers">
        <AIResearchMatch />
      </ComponentGroup>
      <ComponentGroup label="AI Copilot Panel" note="Proactive research assistant — not a chatbot">
        <AICopilotPanel />
      </ComponentGroup>
      <ComponentGroup label="AI Search Overview" note="Synthesized answer with source attribution">
        <AISearchResult />
      </ComponentGroup>
    </SectionWrapper>
  );
}
