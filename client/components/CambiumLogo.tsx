import React from "react";
import Link from "next/link";

interface CambiumLogoProps {
  size?: number | "xs" | "sm" | "md" | "lg" | "xl";
  theme?: "light" | "dark" | "forest";
  showWordmark?: boolean;
  href?: string | null;
  className?: string;
  badge?: string;
}

const SIZE_MAP = {
  xs: { icon: 18, container: "w-6 h-6 p-0.5", text: "text-[11px]", tracking: "tracking-[-0.02em]", gap: "gap-2" },
  sm: { icon: 22, container: "w-7 h-7 p-1", text: "text-[12.5px]", tracking: "tracking-[-0.02em]", gap: "gap-2.5" },
  md: { icon: 28, container: "w-8 h-8 p-1", text: "text-[15px]", tracking: "tracking-[-0.03em]", gap: "gap-3" },
  lg: { icon: 36, container: "w-10 h-10 p-1.5", text: "text-[17px]", tracking: "tracking-[-0.03em]", gap: "gap-3.5" },
  xl: { icon: 48, container: "w-12 h-12 p-2", text: "text-[20px]", tracking: "tracking-[-0.03em]", gap: "gap-4" },
};

/**
 * Official Cambium Logo mark: Dual Fibonacci golden spirals.
 * Muted offset spiral (past research) + Primary golden spiral (compounding growth).
 */
export function CambiumMark({
  size = 28,
  theme = "light",
  className = "",
}: {
  size?: number;
  theme?: "light" | "dark" | "forest";
  className?: string;
}) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`rounded-full bg-[#FAF7F0] border border-[#E4DCCB] p-1 flex items-center justify-center shadow-xs shrink-0 overflow-hidden ${className}`}
    >
      <img
        src="/logo.svg"
        alt="CAMBIUM Research Mark"
        className="w-full h-full object-contain"
      />
    </div>
  );
}

export default function CambiumLogo({
  size = "md",
  theme = "light",
  showWordmark = true,
  href = "/",
  className = "",
  badge,
}: CambiumLogoProps) {
  const sizeConfig = typeof size === "string" ? SIZE_MAP[size] : { icon: size, container: "w-8 h-8 p-1", text: "text-[15px]", tracking: "tracking-[-0.03em]", gap: "gap-3" };
  const isDark = theme === "dark" || theme === "forest";
  const textColor = isDark ? "text-white" : "text-[#202920]";

  const content = (
    <div className={`inline-flex items-center ${sizeConfig.gap} ${className} group cursor-pointer`}>
      <div className={`${sizeConfig.container} rounded-full bg-[#FAF7F0] border border-[#E4DCCB] flex items-center justify-center shadow-xs transition-transform group-hover:scale-105 shrink-0 overflow-hidden`}>
        <img
          src="/logo.svg"
          alt="CAMBIUM Research Logo"
          className="w-full h-full object-contain"
        />
      </div>
      {showWordmark && (
        <div className="flex items-center gap-2">
          <span
            className={`font-sans font-bold ${sizeConfig.text} ${sizeConfig.tracking} ${textColor} leading-none select-none uppercase`}
          >
            CAMBIUM <span className="font-light text-[#3E6248]">RESEARCH</span>
          </span>
          {badge && (
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#3E6248] bg-[#DCE6D7] border border-[#E4DCCB] px-1.5 py-0.5 rounded-full">
              {badge}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center no-underline">
        {content}
      </Link>
    );
  }

  return content;
}
