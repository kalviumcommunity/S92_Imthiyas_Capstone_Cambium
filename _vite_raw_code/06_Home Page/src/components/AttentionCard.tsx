interface AttentionCardProps {
  badge: string;
  title: string;
  description: string;
  match: number;
  meta: string;
  authors?: string;
}

export default function AttentionCard({
  badge,
  title,
  description,
  match,
  meta,
  authors,
}: AttentionCardProps) {
  return (
    <div
      className="flex flex-col gap-3 rounded-lg p-5 h-full transition-colors cursor-pointer"
      style={{
        background: "#FFFFFF",
        border: "1px solid #DDE2DE",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "#A8C0B4";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "#DDE2DE";
      }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <span
          className="text-xs rounded-sm px-2 py-1 font-semibold"
          style={{
            background: "#F7F6F1",
            color: "#173F35",
            letterSpacing: "0.06em",
            fontFamily: "'Manrope', sans-serif",
          }}
        >
          {badge}
        </span>
        <span
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium flex-shrink-0"
          style={{
            background: "rgba(220,235,228,0.5)",
            color: "#173F35",
            fontFamily: "'Manrope', sans-serif",
          }}
        >
          <span
            className="rounded-full flex-shrink-0"
            style={{ width: 6, height: 6, background: "#173F35" }}
          />
          {match}% match
        </span>
      </div>

      {/* Title */}
      <h3
        className="text-sm font-semibold leading-snug"
        style={{
          fontFamily: "'Source Serif 4', Georgia, serif",
          color: "#17201D",
          fontSize: 15,
        }}
      >
        {title}
      </h3>

      {/* Description */}
      <p className="text-xs leading-relaxed flex-1" style={{ color: "#66716C", fontFamily: "'Manrope', sans-serif" }}>
        {description}
      </p>

      {/* Footer */}
      <div className="flex flex-col gap-1 pt-1" style={{ borderTop: "1px solid #DDE2DE" }}>
        {authors && (
          <p className="text-xs" style={{ color: "#66716C" }}>
            {authors}
          </p>
        )}
        <p className="text-xs" style={{ color: "#66716C" }}>
          {meta}
        </p>
      </div>
    </div>
  );
}
