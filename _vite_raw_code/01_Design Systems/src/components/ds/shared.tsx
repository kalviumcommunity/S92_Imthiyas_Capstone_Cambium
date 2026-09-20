import { ReactNode } from "react";

export function SectionWrapper({ id, children, last }: { id: string; children: ReactNode; last?: boolean }) {
  return (
    <section
      id={id}
      className={`py-24 ${last ? "" : "border-b"}`}
      style={{ borderColor: "var(--c-border-default)" }}
    >
      <div className="max-w-5xl mx-auto px-12">{children}</div>
    </section>
  );
}

export function SectionHeader({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-16">
      <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "var(--c-moss-500)" }}>
        {number}
      </p>
      <h2 className="text-4xl font-semibold tracking-tight mb-3" style={{ color: "var(--c-text-primary)" }}>
        {title}
      </h2>
      <p className="text-base" style={{ color: "var(--c-text-secondary)" }}>
        {description}
      </p>
    </div>
  );
}

export function SubLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-semibold tracking-widest uppercase mb-6" style={{ color: "var(--c-text-tertiary)" }}>
      {children}
    </p>
  );
}

export function TokenCard({
  swatch,
  token,
  hex,
  purpose,
  usage,
  wide,
}: {
  swatch: string;
  token: string;
  hex: string;
  purpose: string;
  usage?: string;
  wide?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border overflow-hidden ${wide ? "col-span-2" : ""}`}
      style={{ borderColor: "var(--c-border-default)", background: "var(--c-surface-raised)" }}
    >
      <div className="h-14 w-full" style={{ background: swatch }} />
      <div className="p-4">
        <p className="text-xs font-mono font-medium mb-1" style={{ color: "var(--c-text-primary)" }}>
          {token}
        </p>
        <p className="text-xs font-mono mb-2" style={{ color: "var(--c-text-tertiary)" }}>
          {hex}
        </p>
        <p className="text-xs" style={{ color: "var(--c-text-secondary)" }}>
          {purpose}
        </p>
        {usage && (
          <p className="text-xs mt-1 italic" style={{ color: "var(--c-text-tertiary)" }}>
            {usage}
          </p>
        )}
      </div>
    </div>
  );
}
