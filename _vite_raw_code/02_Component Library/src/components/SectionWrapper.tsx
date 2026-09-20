interface SectionWrapperProps {
  id: string;
  number: string;
  title: string;
  description: string;
  children: React.ReactNode;
}

export default function SectionWrapper({ id, number, title, description, children }: SectionWrapperProps) {
  return (
    <section id={id} className="py-16 border-b border-line last:border-0">
      <div className="mb-12">
        {/* Number pill — brand forest green */}
        <div className="inline-flex items-center gap-2 mb-4">
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded"
            style={{
              backgroundColor: "var(--color-navy)",
              color: "var(--color-navy-light)",
              letterSpacing: "0.12em",
            }}
          >
            {number}
          </span>
          <span
            className="text-[10px] text-ink-3 font-medium uppercase"
            style={{ letterSpacing: "0.16em" }}
          >
            {title}
          </span>
        </div>
        {/* Editorial headline — Source Serif 4 */}
        <h2 className="font-serif text-ink text-[1.6rem] font-medium leading-tight mb-2.5">
          {title}
        </h2>
        <p className="text-ink-2 text-sm leading-relaxed max-w-lg">{description}</p>
      </div>
      <div className="space-y-14">{children}</div>
    </section>
  );
}

interface ComponentGroupProps {
  label: string;
  note?: string;
  children: React.ReactNode;
  row?: boolean;
  wrap?: boolean;
}

export function ComponentGroup({ label, note, children, row, wrap }: ComponentGroupProps) {
  return (
    <div>
      <div className="flex items-baseline gap-3 mb-5">
        <h3 className="text-sm font-semibold text-ink" style={{ letterSpacing: "-0.01em" }}>{label}</h3>
        {note && <span className="text-xs text-ink-3">{note}</span>}
      </div>
      <div
        className={
          row
            ? `flex ${wrap ? "flex-wrap" : ""} items-start gap-4`
            : "space-y-4"
        }
      >
        {children}
      </div>
    </div>
  );
}

interface StateRowProps {
  label: string;
  children: React.ReactNode;
}

export function StateRow({ label, children }: StateRowProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[10px] text-ink-3 uppercase tracking-widest">{label}</span>
      {children}
    </div>
  );
}
