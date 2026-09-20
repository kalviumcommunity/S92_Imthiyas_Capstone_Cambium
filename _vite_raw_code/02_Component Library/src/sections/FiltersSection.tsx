import { useState } from "react";
import SectionWrapper, { ComponentGroup } from "@/components/SectionWrapper";

const researchTags = ["Machine Learning", "Medical Imaging", "Federated Learning", "Privacy", "Neural Networks", "Computer Vision", "NLP", "Bioinformatics"];
const statusColors: Record<string, string> = {
  Active: "bg-sage-light text-sage",
  Completed: "bg-navy-light text-navy",
  "In Review": "bg-amber-light text-amber",
  Draft: "bg-surface-3 text-ink-3",
  Archived: "bg-surface-3 text-ink-3",
};

function Toggle({ label, defaultChecked = false }: { label: string; defaultChecked?: boolean }) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <button
        role="switch"
        aria-checked={on}
        onClick={() => setOn(!on)}
        className={`relative w-9 h-5 rounded-full transition-colors ${on ? "bg-navy" : "bg-surface-3 border border-line"}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${on ? "translate-x-4" : ""}`}
        />
      </button>
      <span className="text-sm text-ink-2">{label}</span>
    </label>
  );
}

function Checkbox({ label, checked = false, indeterminate = false }: { label: string; checked?: boolean; indeterminate?: boolean }) {
  const [val, setVal] = useState(checked);
  return (
    <label className="flex items-center gap-2.5 cursor-pointer select-none">
      <button
        role="checkbox"
        aria-checked={val}
        onClick={() => setVal(!val)}
        className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-colors border ${
          val
            ? "bg-navy border-navy"
            : indeterminate
            ? "bg-navy border-navy"
            : "border-line-2 hover:border-navy"
        }`}
      >
        {val && !indeterminate && (
          <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M5 13l4 4L19 7"/>
          </svg>
        )}
        {indeterminate && (
          <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M5 12h14"/>
          </svg>
        )}
      </button>
      <span className="text-sm text-ink-2">{label}</span>
    </label>
  );
}

function RadioGroup({ options, name }: { options: string[]; name: string }) {
  const [selected, setSelected] = useState(options[0]);
  return (
    <div className="space-y-2.5">
      {options.map(opt => (
        <label key={opt} className="flex items-center gap-2.5 cursor-pointer select-none">
          <button
            role="radio"
            aria-checked={selected === opt}
            onClick={() => setSelected(opt)}
            className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 border transition-colors ${
              selected === opt ? "border-navy" : "border-line-2 hover:border-navy"
            }`}
          >
            {selected === opt && <span className="w-2 h-2 bg-navy rounded-full" />}
          </button>
          <span className="text-sm text-ink-2">{opt}</span>
        </label>
      ))}
    </div>
  );
}

function SegmentedControl({ options }: { options: string[] }) {
  const [active, setActive] = useState(options[0]);
  return (
    <div className="flex items-center gap-px bg-surface-3 border border-line p-0.5 rounded-lg w-fit">
      {options.map(opt => (
        <button
          key={opt}
          onClick={() => setActive(opt)}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            active === opt ? "bg-surface text-ink shadow-sm" : "text-ink-3 hover:text-ink"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function Slider() {
  const [val, setVal] = useState(60);
  return (
    <div className="flex items-center gap-3 max-w-xs">
      <input
        type="range"
        min="0"
        max="100"
        value={val}
        onChange={e => setVal(Number(e.target.value))}
        className="flex-1 h-1.5 bg-surface-3 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-navy [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-sm"
        style={{ background: `linear-gradient(to right, var(--color-navy) ${val}%, var(--color-surface-3) ${val}%)` }}
      />
      <span className="text-xs text-ink-3 w-8 text-right">{val}%</span>
    </div>
  );
}

export default function FiltersSection() {
  const [selectedTags, setSelectedTags] = useState<string[]>(["Machine Learning", "Privacy"]);
  const [sortBy, setSortBy] = useState("Relevance");
  const [filterChips, setFilterChips] = useState(["Medical AI", "Open Access"]);

  const toggleTag = (tag: string) =>
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);

  return (
    <SectionWrapper
      id="filters"
      number="05"
      title="Filters & Controls"
      description="Compact, academic filtering tools for navigating research corpora. Tags should be precise, not decorative."
    >
      <ComponentGroup label="Research Tags" note="Topic and keyword tagging">
        <div className="flex flex-wrap gap-2">
          {researchTags.map(tag => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded font-medium transition-colors ${
                selectedTags.includes(tag)
                  ? "bg-navy-light text-navy border border-navy/20"
                  : "bg-surface border border-line text-ink-2 hover:border-line-2 hover:text-ink"
              }`}
            >
              {selectedTags.includes(tag) && (
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 13l4 4L19 7"/>
                </svg>
              )}
              {tag}
            </button>
          ))}
        </div>
      </ComponentGroup>

      <ComponentGroup label="Filter Chips" note="Active filter indicators — click to remove" row wrap>
        {filterChips.map(chip => (
          <span key={chip} className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs bg-navy-light text-navy rounded-full border border-navy/20 font-medium">
            {chip}
            <button
              onClick={() => setFilterChips(f => f.filter(c => c !== chip))}
              className="w-3.5 h-3.5 rounded-full hover:bg-navy/10 flex items-center justify-center"
            >
              <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </span>
        ))}
        <button className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-ink-3 border border-dashed border-line rounded-full hover:text-ink hover:border-line-2 transition-colors">
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Add filter
        </button>
      </ComponentGroup>

      <ComponentGroup label="Status Badges" note="Research and opportunity status indicators" row wrap>
        {Object.entries(statusColors).map(([status, cls]) => (
          <span key={status} className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full font-medium ${cls}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status === "Active" ? "bg-sage" : status === "Completed" ? "bg-navy" : status === "In Review" ? "bg-amber" : "bg-ink-3"}`} />
            {status}
          </span>
        ))}
      </ComponentGroup>

      <ComponentGroup label="Sort Control" note="Result ordering">
        <div className="flex items-center gap-2">
          <span className="text-xs text-ink-3">Sort by</span>
          <div className="flex items-center gap-0.5">
            {["Relevance", "Date", "Citations", "Recency"].map(opt => (
              <button
                key={opt}
                onClick={() => setSortBy(opt)}
                className={`px-3 py-1.5 text-xs rounded-md transition-colors font-medium ${
                  sortBy === opt ? "bg-surface-3 text-ink" : "text-ink-3 hover:text-ink"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </ComponentGroup>

      <ComponentGroup label="Segmented Controls" note="Mutually exclusive option selection">
        <div className="space-y-4">
          <SegmentedControl options={["All papers", "Open access", "Preprints"]} />
          <SegmentedControl options={["List", "Grid", "Table"]} />
          <SegmentedControl options={["Today", "This week", "This month", "All time"]} />
        </div>
      </ComponentGroup>

      <ComponentGroup label="Toggles" note="Binary on/off states">
        <div className="space-y-3">
          <Toggle label="Show open access only" defaultChecked />
          <Toggle label="Include preprints" />
          <Toggle label="Email notifications for deadlines" defaultChecked />
          <Toggle label="Show archived opportunities" />
        </div>
      </ComponentGroup>

      <ComponentGroup label="Checkboxes & Radio" note="Multi-select and single-select patterns" row>
        <div>
          <p className="text-[10px] text-ink-3 uppercase tracking-widest mb-3">Research type</p>
          <div className="space-y-2.5">
            <Checkbox label="Journal articles" checked />
            <Checkbox label="Conference papers" checked />
            <Checkbox label="Preprints" />
            <Checkbox label="Datasets" indeterminate />
            <Checkbox label="Patents" />
          </div>
        </div>
        <div>
          <p className="text-[10px] text-ink-3 uppercase tracking-widest mb-3">Publication date</p>
          <RadioGroup options={["Any time", "Past year", "Past 3 years", "Past 5 years"]} name="date" />
        </div>
      </ComponentGroup>

      <ComponentGroup label="Range Slider" note="Citation count and year range">
        <div className="space-y-4 max-w-xs">
          <div>
            <p className="text-xs text-ink-2 mb-2">Minimum citations</p>
            <Slider />
          </div>
        </div>
      </ComponentGroup>
    </SectionWrapper>
  );
}
