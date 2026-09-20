import SectionWrapper from "../components/SectionWrapper";
import CambiumMark from "../components/CambiumMark";

const attributes = [
  "PREMIUM", "ACADEMIC", "CALM", "INTELLIGENT",
  "PRECISE", "EDITORIAL", "HUMAN", "CONNECTED", "MODERN",
];

function MoodBoard() {
  return (
    <div className="relative h-72 rounded-xl overflow-hidden border border-edge-default">
      {/* Forest green hero strip */}
      <div className="absolute top-0 left-0 right-0 h-24" style={{ background: "#173F35" }}>
        {/* Fibonacci spiral decorative — top right */}
        <div className="absolute top-4 right-6 opacity-20">
          <CambiumMark size={64} color="#DCEBE4" counterOpacity={0.4} />
        </div>
        {/* Label */}
        <div className="absolute top-4 left-6">
          <p className="text-[10px] font-semibold tracking-[0.2em] text-moss-100 opacity-60 uppercase mb-2">
            Cambium / Brand System
          </p>
          <p
            className="text-2xl"
            style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              color: "#DCEBE4",
              fontStyle: "italic",
              fontWeight: 400,
            }}
          >
            Knowledge growth.
          </p>
        </div>
      </div>

      {/* Content area */}
      <div className="absolute top-24 left-0 right-0 bottom-0" style={{ background: "#F7F6F1" }}>
        {/* Grid dots — research network */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 640 192" preserveAspectRatio="xMidYMid slice" fill="none">
          {[0,1,2,3,4,5,6].map(col =>
            [0,1,2].map(row => {
              const x = 48 + col * 56;
              const y = 24 + row * 60;
              const isActive = (col === 2 && row === 1) || (col === 4 && row === 0) || (col === 5 && row === 2);
              return (
                <g key={`${col}-${row}`}>
                  <circle cx={x} cy={y} r={isActive ? 4.5 : 3} fill="#173F35" opacity={isActive ? 0.7 : 0.15} />
                  {col < 6 && <line x1={x+3} y1={y} x2={x+53} y2={y} stroke="#173F35" strokeWidth="0.75" opacity="0.08" />}
                  {row < 2 && <line x1={x} y1={y+3} x2={x} y2={y+57} stroke="#173F35" strokeWidth="0.75" opacity="0.08" />}
                </g>
              );
            })
          )}
          {/* Editorial text lines */}
          {[100, 108, 116, 124].map((y, i) => (
            <rect key={y} x="440" y={y} width={i%2===0 ? 160 : 120} height="3.5" rx="1.5" fill="#173F35" opacity="0.12" />
          ))}
          {/* Accent rectangle */}
          <rect x="440" y="86" width="160" height="8" rx="2" fill="#DCEBE4" opacity="0.8" />
          <rect x="440" y="78" width="70" height="4" rx="1.5" fill="#173F35" opacity="0.15" />
        </svg>

        {/* Accent color bar bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: "#DCEBE4" }} />
      </div>
    </div>
  );
}

export default function Brand() {
  return (
    <SectionWrapper
      id="brand"
      num="01"
      title="Brand"
      description="The visual and verbal identity of Cambium. Rooted in the philosophy of knowledge growth — scholarly, restrained, and deeply human."
    >
      {/* Primary brand statement */}
      <div className="mb-14">
        <p
          className="text-[42px] leading-[1.12] tracking-[-0.01em] text-ink-primary mb-3"
          style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}
        >
          "Research, connected."
        </p>
        <p className="text-base text-ink-secondary max-w-lg" style={{ lineHeight: 1.65 }}>
          An operating system for the way research actually happens.
        </p>
      </div>

      {/* Attributes */}
      <div className="mb-10">
        <h3 className="text-[11px] font-semibold tracking-[0.15em] text-ink-tertiary uppercase mb-4">
          Brand Attributes
        </h3>
        <div className="flex flex-wrap gap-2">
          {attributes.map((attr) => (
            <span
              key={attr}
              className="px-3 py-1.5 rounded text-[11px] font-semibold tracking-[0.12em] border border-edge-strong text-ink-secondary bg-surface-raised"
            >
              {attr}
            </span>
          ))}
        </div>
      </div>

      {/* Mood board */}
      <div className="mb-10">
        <h3 className="text-[11px] font-semibold tracking-[0.15em] text-ink-tertiary uppercase mb-4">
          Visual Tone
        </h3>
        <MoodBoard />
        <p className="mt-3 text-xs text-ink-tertiary">
          Deep forest green on warm cream. Ordered grids, Fibonacci structure, editorial proportions. Restrained and precise.
        </p>
      </div>

      {/* Avoidances */}
      <div className="p-5 rounded-xl bg-surface-sunken border border-edge-default">
        <h3 className="text-[11px] font-semibold tracking-[0.15em] text-ink-tertiary uppercase mb-4">Avoid</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            "Generic AI SaaS purple-blue gradients",
            "High-saturation, multi-color palettes",
            "Robots, brains, glowing circuits",
            "Futuristic or sci-fi clichés",
            "Leaf or graduation-cap icons",
            "Bouncy, playful animations",
          ].map((item) => (
            <div key={item} className="flex items-start gap-2 text-sm text-ink-secondary">
              <span className="text-semantic-error mt-0.5 flex-shrink-0">×</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
