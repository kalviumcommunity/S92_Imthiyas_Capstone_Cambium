import React from "react";
import Link from "next/link";

export interface CambiumLogoProps {
  size?: number | "xs" | "sm" | "md" | "lg" | "xl";
  theme?: "light" | "dark" | "forest" | "auto";
  showMark?: boolean;
  showWordmark?: boolean;
  href?: string | null;
  className?: string;
  badge?: string;
}

const SIZE_MAP = {
  xs: { icon: 16, container: "w-5 h-5 p-0", textCambium: "text-[12px]", textResearch: "text-[12px]", gap: "gap-2" },
  sm: { icon: 20, container: "w-6 h-6 p-0.5", textCambium: "text-[13.5px]", textResearch: "text-[13.5px]", gap: "gap-2.5" },
  md: { icon: 26, container: "w-7 h-7 p-0.5", textCambium: "text-[16px]", textResearch: "text-[16px]", gap: "gap-2.5" },
  lg: { icon: 32, container: "w-9 h-9 p-0.5", textCambium: "text-[18px]", textResearch: "text-[18px]", gap: "gap-3" },
  xl: { icon: 40, container: "w-11 h-11 p-1", textCambium: "text-[22px]", textResearch: "text-[22px]", gap: "gap-3.5" },
};

/**
 * Official Cambium Logo mark: Dual Fibonacci golden spirals.
 * Muted offset spiral (past research) + Primary golden spiral (compounding growth).
 * Dynamically switches between light and dark theme SVGs from public_logo.
 */
export function CambiumMark({
  size = 28,
  theme = "auto",
  className = "",
}: {
  size?: number;
  theme?: "light" | "dark" | "forest" | "auto";
  className?: string;
}) {
  const isForcedDark = theme === "dark" || theme === "forest";
  const isForcedLight = theme === "light";

  return (
    <div
      style={{ width: size, height: size, minWidth: size, minHeight: size }}
      className={`rounded-full bg-[#FAF7F0] dark:bg-[#18231B] border border-[#E4DCCB] dark:border-[#233327] p-0.5 flex items-center justify-center shadow-xs shrink-0 overflow-hidden ${className}`}
    >
      {isForcedDark ? (
        <img
          src="/public_logo/cambium-logo-dark.svg"
          alt="CAMBIUM RESEARCH Mark"
          className="w-full h-full object-contain max-w-full max-h-full block scale-[1.3] transition-transform"
        />
      ) : isForcedLight ? (
        <img
          src="/public_logo/cambium-logo-light.svg"
          alt="CAMBIUM RESEARCH Mark"
          className="w-full h-full object-contain max-w-full max-h-full block scale-[1.3] transition-transform"
        />
      ) : (
        <>
          <img
            src="/public_logo/cambium-logo-light.svg"
            alt="CAMBIUM RESEARCH Mark"
            className="w-full h-full object-contain max-w-full max-h-full block dark:hidden scale-[1.3] transition-transform"
          />
          <img
            src="/public_logo/cambium-logo-dark.svg"
            alt="CAMBIUM RESEARCH Mark"
            className="w-full h-full object-contain max-w-full max-h-full hidden dark:block scale-[1.3] transition-transform"
          />
        </>
      )}
    </div>
  );
}

/**
 * Universal CAMBIUM RESEARCH Brandmark & Typography Component.
 * Formatted strictly in Manrope font:
 * - "CAMBIUM": Heavy weight (800) in deep forest ink (#1A201C / #202920) or luminescent bone in dark mode
 * - "RESEARCH": Medium weight (500) in botanical sage (#5D7A68) or radiant algae in dark mode
 * - Emblem: Dynamic light/dark SVG mark from public_logo with optical zoom
 */
export default function CambiumLogo({
  size = "md",
  theme = "auto",
  showMark = true,
  showWordmark = true,
  href = "/",
  className = "",
  badge,
}: CambiumLogoProps) {
  const sizeConfig =
    typeof size === "string"
      ? SIZE_MAP[size]
      : {
          icon: size,
          container: "w-7 h-7 p-0.5",
          textCambium: "text-[16px]",
          textResearch: "text-[16px]",
          gap: "gap-2.5",
        };

  const isForcedDark = theme === "dark" || theme === "forest";
  const isForcedLight = theme === "light";

  const cambiumColor = isForcedDark
    ? "text-white"
    : isForcedLight
    ? "text-[#1A201C]"
    : "text-[#1A201C] dark:text-[#EDEAE2]";

  const researchColor = isForcedDark
    ? "text-[#8BAF96]"
    : isForcedLight
    ? "text-[#5D7A68]"
    : "text-[#5D7A68] dark:text-[#86EFAC]";

  const content = (
    <div
      className={`inline-flex items-center ${sizeConfig.gap} ${className} group select-none cursor-pointer`}
      aria-label="CAMBIUM RESEARCH"
    >
      {/* Optional Circular Fibonacci Golden Spiral Mark */}
      {showMark && (
        <div
          className={`${sizeConfig.container} rounded-full bg-[#FAF7F0] dark:bg-[#18231B] border border-[#E4DCCB] dark:border-[#233327] flex items-center justify-center shadow-xs transition-transform duration-200 group-hover:scale-105 shrink-0 overflow-hidden`}
        >
          {isForcedDark ? (
            <img
              src="/public_logo/cambium-logo-dark.svg"
              alt="CAMBIUM RESEARCH Emblem"
              className="w-full h-full object-contain max-w-full max-h-full block scale-[1.3] transition-transform"
            />
          ) : isForcedLight ? (
            <img
              src="/public_logo/cambium-logo-light.svg"
              alt="CAMBIUM RESEARCH Emblem"
              className="w-full h-full object-contain max-w-full max-h-full block scale-[1.3] transition-transform"
            />
          ) : (
            <>
              <img
                src="/public_logo/cambium-logo-light.svg"
                alt="CAMBIUM RESEARCH Emblem"
                className="w-full h-full object-contain max-w-full max-h-full block dark:hidden scale-[1.3] transition-transform"
              />
              <img
                src="/public_logo/cambium-logo-dark.svg"
                alt="CAMBIUM RESEARCH Emblem"
                className="w-full h-full object-contain max-w-full max-h-full hidden dark:block scale-[1.3] transition-transform"
              />
            </>
          )}
        </div>
      )}

      {/* Uniform Wordmark: Manrope Typography from Brand Guide */}
      {showWordmark && (
        <div className="flex items-center leading-none">
          <span
            style={{ fontFamily: "var(--font-brand, 'Manrope', sans-serif)" }}
            className={`font-brand font-[800] tracking-[-0.025em] ${sizeConfig.textCambium} ${cambiumColor} uppercase`}
          >
            CAMBIUM
          </span>
          <span
            style={{ fontFamily: "var(--font-brand, 'Manrope', sans-serif)" }}
            className={`font-brand font-[500] tracking-[0.04em] ${sizeConfig.textResearch} ${researchColor} uppercase ml-1.5`}
          >
            RESEARCH
          </span>

          {badge && (
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#3E6248] dark:text-[#4ADE80] bg-[#DCE6D7] dark:bg-[#1A281E] border border-[#E4DCCB] dark:border-[#233327] px-1.5 py-0.5 rounded-full ml-2">
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
