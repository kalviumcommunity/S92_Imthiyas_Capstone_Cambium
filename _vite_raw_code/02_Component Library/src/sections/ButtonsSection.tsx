import SectionWrapper, { ComponentGroup } from "@/components/SectionWrapper";

function Spinner() {
  return (
    <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

function Check() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

const base = "inline-flex items-center justify-center gap-1.5 font-medium transition-all active:scale-[0.98] select-none";
const szSm = "text-xs px-3 py-1.5 rounded";
const szMd = "text-sm px-4 py-2 rounded-md";
const szLg = "text-sm px-5 py-2.5 rounded-md";

export default function ButtonsSection() {
  return (
    <SectionWrapper
      id="buttons"
      number="02"
      title="Buttons"
      description="A complete button system for all Cambium interactions. Restrained, precise, and purposeful."
    >
      {/* Variants */}
      <ComponentGroup label="Variants" note="All button types at medium size" row>
        <div className="flex flex-col items-start gap-4 w-full">
          <div className="flex flex-wrap items-center gap-3">
            <button className={`${base} ${szMd} bg-navy text-white hover:bg-navy-mid`}>
              <PlusIcon /> Create Project
            </button>
            <button className={`${base} ${szMd} bg-transparent text-navy border border-navy hover:bg-navy-light`}>
              Share
            </button>
            <button className={`${base} ${szMd} bg-surface-2 text-ink-2 hover:bg-surface-3 border border-line`}>
              New note
            </button>
            <button className={`${base} ${szMd} text-ink-2 hover:text-ink hover:bg-surface-2`}>
              Cancel
            </button>
            <button className={`${base} ${szMd} bg-crimson text-white hover:opacity-90`}>
              Delete
            </button>
          </div>
          <div className="flex gap-2 flex-wrap text-[10px] text-ink-3 tracking-widest uppercase">
            <span className="w-28 text-center">Primary</span>
            <span className="w-16 text-center">Secondary</span>
            <span className="w-16 text-center">Tertiary</span>
            <span className="w-14 text-center">Ghost</span>
            <span className="w-14 text-center">Danger</span>
          </div>
        </div>
      </ComponentGroup>

      {/* Sizes */}
      <ComponentGroup label="Sizes" note="Small · Medium · Large">
        <div className="flex flex-col gap-5">
          {(["Small", "Medium", "Large"] as const).map((size) => (
            <div key={size} className="flex items-end gap-4">
              <button
                className={`${base} bg-navy text-white hover:bg-navy-mid ${
                  size === "Small" ? szSm : size === "Medium" ? szMd : szLg
                }`}
              >
                Create Project
              </button>
              <button
                className={`${base} border border-navy text-navy hover:bg-navy-light ${
                  size === "Small" ? szSm : size === "Medium" ? szMd : szLg
                }`}
              >
                Share
              </button>
              <button
                className={`${base} text-ink-2 hover:bg-surface-2 ${
                  size === "Small" ? szSm : size === "Medium" ? szMd : szLg
                }`}
              >
                Cancel
              </button>
              <span className="text-[10px] text-ink-3 uppercase tracking-widest self-center">{size}</span>
            </div>
          ))}
        </div>
      </ComponentGroup>

      {/* States */}
      <ComponentGroup label="States" note="Visual documentation of button states" row wrap>
        <div className="flex flex-col gap-2">
          <button className={`${base} ${szMd} bg-navy text-white hover:bg-navy-mid`}>
            Save changes
          </button>
          <span className="text-[10px] text-ink-3 uppercase tracking-widest text-center">Default</span>
        </div>
        <div className="flex flex-col gap-2">
          <button className={`${base} ${szMd} bg-navy-mid text-white`} tabIndex={-1}>
            Save changes
          </button>
          <span className="text-[10px] text-ink-3 uppercase tracking-widest text-center">Hover</span>
        </div>
        <div className="flex flex-col gap-2">
          <button className={`${base} ${szMd} bg-navy text-white ring-2 ring-navy ring-offset-2`} tabIndex={-1}>
            Save changes
          </button>
          <span className="text-[10px] text-ink-3 uppercase tracking-widest text-center">Focused</span>
        </div>
        <div className="flex flex-col gap-2">
          <button className={`${base} ${szMd} bg-navy text-white opacity-80`} disabled>
            <Spinner /> Saving…
          </button>
          <span className="text-[10px] text-ink-3 uppercase tracking-widest text-center">Loading</span>
        </div>
        <div className="flex flex-col gap-2">
          <button className={`${base} ${szMd} bg-sage text-white`} tabIndex={-1}>
            <Check /> Saved
          </button>
          <span className="text-[10px] text-ink-3 uppercase tracking-widest text-center">Success</span>
        </div>
        <div className="flex flex-col gap-2">
          <button className={`${base} ${szMd} bg-surface-3 text-ink-3 cursor-not-allowed`} disabled>
            Save changes
          </button>
          <span className="text-[10px] text-ink-3 uppercase tracking-widest text-center">Disabled</span>
        </div>
      </ComponentGroup>

      {/* Icon buttons */}
      <ComponentGroup label="Icon Buttons" note="Square icon-only buttons" row>
        {[
          { icon: "plus", tip: "Add" },
          { icon: "search", tip: "Search" },
          { icon: "bookmark", tip: "Save" },
          { icon: "share", tip: "Share" },
          { icon: "more", tip: "More" },
        ].map(({ icon, tip }) => (
          <div key={icon} className="flex flex-col items-center gap-2">
            <button
              title={tip}
              className="w-8 h-8 flex items-center justify-center rounded-md border border-line text-ink-3 hover:text-ink hover:border-line-2 hover:bg-surface-2 transition-colors"
            >
              <IconSvg name={icon} />
            </button>
            <span className="text-[10px] text-ink-3">{tip}</span>
          </div>
        ))}
      </ComponentGroup>

      {/* Split button */}
      <ComponentGroup label="Split Button" note="Primary action with dropdown">
        <div className="flex items-center">
          <button className={`${base} ${szMd} bg-navy text-white hover:bg-navy-mid rounded-r-none border-r border-navy-mid`}>
            <PlusIcon /> New paper
          </button>
          <button className="flex items-center justify-center h-9 px-2 bg-navy text-white hover:bg-navy-mid rounded-l-none rounded-r-md border-l border-navy-mid transition-colors">
            <ChevronDown />
          </button>
        </div>
      </ComponentGroup>

      {/* With icon examples */}
      <ComponentGroup label="Examples with Content" note="Real-world button labels" row wrap>
        <button className={`${base} ${szMd} bg-navy text-white hover:bg-navy-mid`}>
          <PlusIcon /> Create Project
        </button>
        <button className={`${base} ${szMd} bg-navy text-white hover:bg-navy-mid`}>
          Explore Opportunities <ArrowIcon />
        </button>
        <button className={`${base} ${szMd} border border-navy text-navy hover:bg-navy-light`}>
          Follow
        </button>
        <button className={`${base} ${szMd} border border-navy text-navy hover:bg-navy-light`}>
          Connect
        </button>
        <button className={`${base} ${szMd} bg-surface-2 text-ink-2 border border-line hover:bg-surface-3`}>
          Continue Reading
        </button>
      </ComponentGroup>
    </SectionWrapper>
  );
}

function IconSvg({ name }: { name: string }) {
  const paths: Record<string, string> = {
    plus: "M12 5v14M5 12h14",
    search: "M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z",
    bookmark: "M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z",
    share: "M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13",
    more: "M5 12h.01M12 12h.01M19 12h.01",
  };
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d={paths[name]} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
