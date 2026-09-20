import SectionWrapper, { ComponentGroup } from "@/components/SectionWrapper";

function BlockWrapper({
  icon,
  color,
  type,
  children,
}: {
  icon: React.ReactNode;
  color: string;
  type: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`border rounded-lg p-4 bg-surface max-w-xl ${color}`}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">{icon}</div>
        <span className="text-[10px] uppercase tracking-widest font-medium text-ink-3">{type}</span>
      </div>
      {children}
    </div>
  );
}

function QuestionBlock() {
  return (
    <BlockWrapper
      icon={<svg className="w-4 h-4 text-navy" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01"/></svg>}
      color="border-navy/20"
      type="Research Question"
    >
      <p className="font-serif text-ink text-sm leading-relaxed">
        How can federated learning frameworks be designed to preserve patient privacy while maintaining diagnostic accuracy in cross-institutional medical imaging studies?
      </p>
      <div className="flex gap-2 mt-3">
        {["Primary", "Medical AI", "Methodology"].map(t => (
          <span key={t} className="text-[10px] bg-navy-light text-navy px-2 py-0.5 rounded font-medium">{t}</span>
        ))}
      </div>
    </BlockWrapper>
  );
}

function HypothesisBlock() {
  return (
    <BlockWrapper
      icon={<svg className="w-4 h-4 text-iris" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3M6.343 6.343l-.707-.707M6.343 17.657l-.707.707M12 21v-1M17.657 17.657l.707.707"/><circle cx="12" cy="12" r="4"/></svg>}
      color="border-iris/20"
      type="Hypothesis"
    >
      <p className="font-serif text-ink text-sm leading-relaxed">
        Differential privacy mechanisms applied at the gradient aggregation layer, combined with secure multi-party computation, will reduce privacy leakage by at least 40% with less than 3% reduction in model accuracy compared to centralized training.
      </p>
      <div className="flex items-center justify-between mt-3">
        <div className="flex gap-2">
          <span className="text-[10px] bg-iris-light text-iris px-2 py-0.5 rounded font-medium">Testable</span>
          <span className="text-[10px] bg-surface-2 text-ink-3 px-2 py-0.5 rounded font-medium">Unverified</span>
        </div>
        <button className="text-[10px] text-navy font-medium hover:underline">Link to experiment →</button>
      </div>
    </BlockWrapper>
  );
}

function ResearchGapBlock() {
  return (
    <BlockWrapper
      icon={<svg className="w-4 h-4 text-amber" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>}
      color="border-amber/20"
      type="Research Gap"
    >
      <p className="font-serif text-ink text-sm leading-relaxed">
        Existing federated learning literature focuses predominantly on image classification tasks. There is limited work on federated learning applied to longitudinal patient data and time-series EHR analysis across institutions.
      </p>
      <div className="mt-3 flex items-center gap-2">
        <span className="text-[10px] bg-amber-light text-amber px-2 py-0.5 rounded font-medium">Identified gap</span>
        <span className="text-[10px] text-ink-3">4 related papers</span>
      </div>
    </BlockWrapper>
  );
}

function CitationBlock() {
  return (
    <div className="border border-line rounded-lg p-4 bg-surface max-w-xl hover:border-line-2 transition-colors">
      <div className="flex items-start gap-3">
        <div className="w-0.5 h-full bg-navy-light self-stretch rounded-full flex-shrink-0 min-h-12" />
        <div>
          <p className="text-sm text-ink-2 leading-relaxed italic">
            "Federated learning enables training machine learning models across multiple decentralized edge devices or servers holding local data samples, without exchanging them."
          </p>
          <div className="mt-3 flex items-center gap-3">
            <span className="text-[11px] text-ink-3">McMahan et al., 2017 · Communication-Efficient Learning of Deep Networks</span>
            <button className="flex-shrink-0 text-[10px] text-navy font-medium hover:underline">Cite</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExperimentBlock() {
  return (
    <BlockWrapper
      icon={<svg className="w-4 h-4 text-sage" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5s-2.5-1.1-2.5-2.5V2"/><path d="M8.5 2h7"/><path d="M14.5 16h-5"/></svg>}
      color="border-sage/20"
      type="Experiment"
    >
      <h4 className="text-sm font-medium text-ink mb-2">DP-FedAvg Baseline — MIMIC-IV Subset</h4>
      <p className="text-xs text-ink-3 mb-3">
        Training federated model across 4 hospital nodes with differential privacy (ε=1.0, δ=10⁻⁵). Evaluating diagnostic accuracy on chest X-ray classification.
      </p>
      <div className="grid grid-cols-3 gap-3 mb-3">
        {[
          { label: "Accuracy", val: "87.2%" },
          { label: "Privacy ε", val: "1.0" },
          { label: "Rounds", val: "120" },
        ].map(({ label, val }) => (
          <div key={label} className="bg-surface-2 rounded-md p-2.5">
            <p className="text-[10px] text-ink-3">{label}</p>
            <p className="text-sm font-medium text-ink mt-0.5">{val}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[10px] bg-sage-light text-sage px-2 py-0.5 rounded font-medium">In Progress</span>
        <span className="text-[10px] text-ink-3">Started Aug 12, 2024</span>
      </div>
    </BlockWrapper>
  );
}

function ResearchTimeline() {
  const events = [
    { date: "Aug 2024", label: "Literature review", status: "done" },
    { date: "Sep 2024", label: "Dataset acquisition & preprocessing", status: "done" },
    { date: "Oct 2024", label: "Baseline model training", status: "active" },
    { date: "Nov 2024", label: "Privacy analysis", status: "upcoming" },
    { date: "Jan 2025", label: "Paper submission", status: "upcoming" },
  ];
  return (
    <div className="relative pl-6 space-y-6 max-w-lg">
      <div className="absolute left-[9px] top-2 bottom-2 w-px bg-line" />
      {events.map(({ date, label, status }) => (
        <div key={date} className="relative flex items-start gap-4">
          <div className={`absolute -left-6 mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
            status === "done"
              ? "bg-sage border-sage"
              : status === "active"
              ? "bg-navy border-navy"
              : "bg-surface border-line"
          }`}>
            {status === "done" && (
              <svg className="w-2 h-2 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M5 13l4 4L19 7"/>
              </svg>
            )}
            {status === "active" && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
          </div>
          <div>
            <p className="text-[10px] text-ink-3 mb-0.5">{date}</p>
            <p className={`text-sm font-medium ${status === "upcoming" ? "text-ink-3" : "text-ink"}`}>{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function LiteratureMatrix() {
  const papers = ["McMahan 2017", "Dwork 2014", "Bonawitz 2019"];
  const dims = ["Privacy", "Scalability", "Accuracy", "Communication"];
  const scores: Record<string, Record<string, number>> = {
    "McMahan 2017": { Privacy: 2, Scalability: 5, Accuracy: 4, Communication: 3 },
    "Dwork 2014": { Privacy: 5, Scalability: 3, Accuracy: 3, Communication: 2 },
    "Bonawitz 2019": { Privacy: 4, Scalability: 4, Accuracy: 4, Communication: 4 },
  };
  return (
    <div className="overflow-x-auto">
      <table className="text-xs border-collapse">
        <thead>
          <tr>
            <th className="text-left text-ink-3 font-medium pr-6 pb-3 text-[10px] uppercase tracking-widest">Paper</th>
            {dims.map(d => (
              <th key={d} className="text-center text-ink-3 font-medium pb-3 px-4 text-[10px] uppercase tracking-widest">{d}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {papers.map(paper => (
            <tr key={paper} className="border-t border-line">
              <td className="text-ink-2 pr-6 py-2.5 font-medium">{paper}</td>
              {dims.map(dim => {
                const score = scores[paper][dim];
                return (
                  <td key={dim} className="text-center py-2.5 px-4">
                    <div className="flex justify-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full ${i < score ? "bg-navy" : "bg-surface-3"}`}
                        />
                      ))}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ResearchSection() {
  return (
    <SectionWrapper
      id="research"
      number="07"
      title="Research Components"
      description="Unique components native to the academic research process. These are the building blocks of Cambium's Research Workspace."
    >
      <ComponentGroup label="Research Question Block">
        <QuestionBlock />
      </ComponentGroup>
      <ComponentGroup label="Hypothesis Block">
        <HypothesisBlock />
      </ComponentGroup>
      <ComponentGroup label="Research Gap Block">
        <ResearchGapBlock />
      </ComponentGroup>
      <ComponentGroup label="Citation Block">
        <CitationBlock />
      </ComponentGroup>
      <ComponentGroup label="Experiment Block">
        <ExperimentBlock />
      </ComponentGroup>
      <ComponentGroup label="Research Timeline" note="Project milestone tracking">
        <ResearchTimeline />
      </ComponentGroup>
      <ComponentGroup label="Literature Matrix" note="Comparative analysis across papers">
        <LiteratureMatrix />
      </ComponentGroup>
    </SectionWrapper>
  );
}
