import { SectionWrapper, SectionHeader } from "./shared";

const attributes = [
  "Premium", "Academic", "Calm", "Intelligent",
  "Precise", "Editorial", "Human", "Connected", "Modern",
];

function MoodElement({ color, shape }: { color: string; shape: "circle" | "rect" | "line" }) {
  if (shape === "circle") {
    return <div className="rounded-full" style={{ width: 72, height: 72, background: color, opacity: 0.18 }} />;
  }
  if (shape === "rect") {
    return <div className="rounded-sm" style={{ width: 52, height: 80, background: color, opacity: 0.12 }} />;
  }
  return (
    <div style={{ width: 2, height: 88, background: color, opacity: 0.22, borderRadius: 1 }} />
  );
}

export default function Brand() {
  return (
    <SectionWrapper id="01-brand">
      <SectionHeader
        number="01"
        title="Brand"
        description="The personality and principles that shape every design decision."
      />

      {/* Brand attributes */}
      <div className="mb-16">
        <p className="text-xs font-semibold tracking-widest uppercase mb-6" style={{ color: "var(--c-text-tertiary)" }}>
          Attributes
        </p>
        <div className="flex flex-wrap gap-3">
          {attributes.map((attr) => (
            <span
              key={attr}
              className="px-4 py-2 rounded-full text-sm font-medium tracking-wide"
              style={{
                border: "1px solid var(--c-border-default)",
                color: "var(--c-text-secondary)",
                background: "var(--c-surface-raised)",
              }}
            >
              {attr}
            </span>
          ))}
        </div>
      </div>

      {/* Mood board */}
      <div className="mb-16">
        <p className="text-xs font-semibold tracking-widest uppercase mb-6" style={{ color: "var(--c-text-tertiary)" }}>
          Visual Mood
        </p>
        <div
          className="rounded-xl p-10 flex items-center gap-8"
          style={{ background: "var(--c-surface-sunken)", border: "1px solid var(--c-border-default)" }}
        >
          {/* Abstract geometric moodboard */}
          <div className="flex items-end gap-4">
            <MoodElement color="#4A7C59" shape="rect" />
            <MoodElement color="#1C1C1A" shape="circle" />
            <MoodElement color="#4A7C59" shape="line" />
            <MoodElement color="#9A9A96" shape="rect" />
            <MoodElement color="#1C1C1A" shape="line" />
          </div>
          <div className="flex items-start gap-4">
            <MoodElement color="#9A9A96" shape="circle" />
            <MoodElement color="#4A7C59" shape="line" />
            <MoodElement color="#1C1C1A" shape="rect" />
          </div>
          <div className="ml-auto">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              {/* Abstract branching mark, large size */}
              <circle cx="32" cy="32" r="5" fill="#4A7C59" opacity="0.3" />
              <circle cx="32" cy="10" r="3" fill="#4A7C59" opacity="0.4" />
              <circle cx="12" cy="46" r="3" fill="#4A7C59" opacity="0.25" />
              <circle cx="52" cy="46" r="3" fill="#4A7C59" opacity="0.25" />
              <line x1="32" y1="27" x2="32" y2="13" stroke="#4A7C59" strokeWidth="1.5" opacity="0.35" />
              <line x1="29" y1="36" x2="14" y2="44" stroke="#4A7C59" strokeWidth="1.5" opacity="0.25" />
              <line x1="35" y1="36" x2="50" y2="44" stroke="#4A7C59" strokeWidth="1.5" opacity="0.25" />
              <circle cx="32" cy="32" r="18" stroke="#4A7C59" strokeWidth="1" fill="none" opacity="0.1" />
            </svg>
          </div>
        </div>
      </div>

      {/* Brand statement */}
      <div className="mb-10">
        <p className="text-xs font-semibold tracking-widest uppercase mb-6" style={{ color: "var(--c-text-tertiary)" }}>
          Brand Statement
        </p>
        <p
          className="font-serif text-5xl font-light leading-tight mb-6"
          style={{ color: "var(--c-text-primary)" }}
        >
          Research,<br />connected.
        </p>
        <p className="text-lg" style={{ color: "var(--c-text-secondary)", maxWidth: 560 }}>
          An operating system for the way research actually happens.
        </p>
      </div>

      {/* Tone notes */}
      <div className="grid grid-cols-3 gap-6">
        {[
          { label: "Voice", text: "Calm, precise, and direct. We don't oversell. We help researchers do better work." },
          { label: "Tone", text: "Academic credibility meets modern clarity. Serious without being dry. Human without being casual." },
          { label: "Avoid", text: "AI hype, startup superlatives, vague mission statements, excessive jargon, rocket emojis." },
        ].map(({ label, text }) => (
          <div
            key={label}
            className="p-5 rounded-lg"
            style={{ border: "1px solid var(--c-border-default)", background: "var(--c-surface-raised)" }}
          >
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "var(--c-moss-500)" }}>
              {label}
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--c-text-secondary)" }}>
              {text}
            </p>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
