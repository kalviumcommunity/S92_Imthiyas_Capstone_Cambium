interface Props {
  id: string;
  num: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export default function SectionWrapper({ id, num, title, description, children }: Props) {
  return (
    <section id={id} className="scroll-mt-8">
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-semibold tracking-[0.2em] text-moss-600 uppercase">{num}</span>
          <span className="text-ink-tertiary text-xs opacity-60">—</span>
        </div>
        <h2 className="text-[28px] font-semibold tracking-[-0.02em] text-ink-primary leading-tight mb-2">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-ink-secondary leading-relaxed max-w-2xl">{description}</p>
        )}
        <div className="mt-8 h-px bg-edge-default" />
      </div>
      {children}
    </section>
  );
}
