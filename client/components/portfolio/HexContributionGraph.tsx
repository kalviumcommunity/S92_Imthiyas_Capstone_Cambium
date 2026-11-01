"use client";

import React, { useState, useMemo } from "react";

export interface HexContributionDay {
  date: string; // YYYY-MM-DD
  count: number;
  level?: 0 | 1 | 2 | 3 | 4;
  label?: string;
  categories?: string[];
  metadata?: Record<string, any>;
}

export interface HexContributionGraphProps {
  data?: HexContributionDay[];
  year?: number | string;
  title?: string;
  onSelectDate?: (date: string, item?: HexContributionDay) => void;
  selectedDate?: string | null;
  className?: string;
  showLegend?: boolean;
  showCategories?: boolean;
  showDayLabels?: boolean;
  fillSampleData?: boolean;
  categoryFilter?: string | null;
  onFilterCategory?: (category: string | null) => void;
  subtext?: string;
}

// 8 Attributable Research Categories matching the Authoritative Design Reference
export const RESEARCH_CATEGORIES = [
  { id: "manuscripts", label: "Manuscript Submissions", defaultTypes: ["MANUSCRIPT_PUBLISHED"] },
  { id: "preprints", label: "ArXiv Preprints", defaultTypes: ["PREPRINT_RELEASE"] },
  { id: "peer_reviews", label: "Peer Reviews", defaultTypes: ["PEER_REVIEW_CONFIRMED"] },
  { id: "experiments", label: "Benchmark Experiments", defaultTypes: ["EXPERIMENT_MILESTONE", "METHOD_STEP"] },
  { id: "datasets", label: "Dataset Releases", defaultTypes: ["DATASET_RELEASE", "SOFTWARE_RELEASE"] },
  { id: "grants", label: "Grant Milestones", defaultTypes: ["GRANT_AWARD", "GRANT_SUBMISSION", "PROTOCOL_APPROVAL"] },
  { id: "collaborations", label: "Lab Collaborations", defaultTypes: ["LAB_COLLABORATION"] },
  { id: "notes", label: "Research Notes", defaultTypes: ["RESEARCH_NOTE"] },
];

// 5-Tier Living Materials Color Palette matching the visual reference image
// Light: Warm stone parchment -> Pale Sage -> Foliage -> Moss -> Deep Canopy Pine
// Dark: Deep forest base -> Sage Glow -> Foliage Dark -> Vibrant Moss -> Bioluminescent Emerald
const LEVEL_STYLES = [
  {
    level: 0,
    className: "fill-[#EDE7DF] dark:fill-[#17231B] stroke-[#E1D8CC] dark:stroke-[#253629]",
    badgeBg: "bg-[#EDE7DF] dark:bg-[#17231B]",
  },
  {
    level: 1,
    className: "fill-[#C5DAC9] dark:fill-[#1E3A26] stroke-[#B3CBB7] dark:stroke-[#2D5438]",
    badgeBg: "bg-[#C5DAC9] dark:bg-[#1E3A26]",
  },
  {
    level: 2,
    className: "fill-[#8FA89B] dark:fill-[#2D583B] stroke-[#7E9789] dark:stroke-[#3E7750]",
    badgeBg: "bg-[#8FA89B] dark:bg-[#2D583B]",
  },
  {
    level: 3,
    className: "fill-[#527C63] dark:fill-[#3E754E] stroke-[#426852] dark:stroke-[#549D6A]",
    badgeBg: "bg-[#527C63] dark:bg-[#3E754E]",
  },
  {
    level: 4,
    className: "fill-[#274833] dark:fill-[#4ADE80] stroke-[#1E3827] dark:stroke-[#22C55E]",
    badgeBg: "bg-[#274833] dark:bg-[#4ADE80]",
  },
];

// Precise Mathematical Dimensions for Flat-Topped Honeycomb Tessellation
const RADIUS = 6.2; // Circumcircle radius (px)
const HEX_HEIGHT = RADIUS * Math.sqrt(3); // ~10.74px (distance from flat top to flat bottom)
const GAP_Y = 1.2; // Vertical separation between stacked hexagons
const GAP_X = 1.0; // Horizontal gap between interlocking columns
const Y_PITCH = HEX_HEIGHT + GAP_Y; // ~11.94px
const Y_STAGGER = Y_PITCH / 2; // ~5.97px (vertical shift for odd columns)
const X_PITCH = 1.5 * RADIUS + GAP_X; // ~10.30px
const TOP_MARGIN = 22.0; // Space for month headers

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/**
 * Calculates SVG polygon points for a regular FLAT-TOPPED hexagon.
 * Top and bottom edges are completely horizontal flats of length r.
 * Left and right vertices are pointy tips.
 * Vertices at 0°, 60°, 120°, 180°, 240°, 300°.
 */
export function getFlatHexPoints(cx: number, cy: number, r: number): string {
  const points: string[] = [];
  for (let i = 0; i < 6; i++) {
    const angleRad = (Math.PI / 180) * (60 * i);
    const px = cx + r * Math.cos(angleRad);
    const py = cy + r * Math.sin(angleRad);
    points.push(`${px.toFixed(2)},${py.toFixed(2)}`);
  }
  return points.join(" ");
}

export function HexContributionGraph({
  data = [],
  year = 2026,
  title,
  onSelectDate,
  selectedDate,
  className = "",
  showLegend = true,
  showCategories = true,
  showDayLabels = false,
  fillSampleData = false,
  categoryFilter = null,
  onFilterCategory,
  subtext,
}: HexContributionGraphProps) {
  const [internalCategory, setInternalCategory] = useState<string | null>(null);
  const activeCategory = categoryFilter !== undefined ? categoryFilter : internalCategory;

  const [hoveredCell, setHoveredCell] = useState<{
    date: string;
    count: number;
    level: number;
    categories?: string[];
    x: number;
    y: number;
  } | null>(null);

  const numericYear = typeof year === "number" ? year : parseInt(String(year), 10) || 2026;

  // Index input data or generate organic multi-wave sample data if fillSampleData is true
  const dataMap = useMemo(() => {
    const map = new Map<string, HexContributionDay>();

    if (fillSampleData) {
      const allCatKeys = [
        "manuscripts",
        "preprints",
        "peer_reviews",
        "experiments",
        "datasets",
        "grants",
        "collaborations",
        "notes",
      ];

      for (let m = 0; m < 12; m++) {
        const daysInMonth = new Date(Date.UTC(numericYear, m + 1, 0)).getUTCDate();
        for (let day = 1; day <= daysInMonth; day++) {
          const dateObj = new Date(Date.UTC(numericYear, m, day));
          const dateStr = dateObj.toISOString().slice(0, 10);
          const dayOfYear = Math.floor(
            (dateObj.getTime() - Date.UTC(numericYear, 0, 1)) / 86400000
          );
          const w = Math.floor(dayOfYear / 7);
          const d = (dateObj.getUTCDay() + 6) % 7;

          // Harmonic multi-frequency waves creating realistic scholarly rhythms
          const wave =
            (Math.sin(w * 0.32) * 1.2 +
              Math.cos(d * 0.85) * 0.7 +
              Math.sin(w * 0.12 + d * 0.95) * 0.9 +
              Math.cos(m * 0.6) * 0.5) /
            3.3;

          let level: 0 | 1 | 2 | 3 | 4 = 0;
          let count = 0;
          const assignedCats: string[] = [];

          if (wave > 0.38) {
            level = 4;
            count = 4 + (day % 3);
            assignedCats.push(allCatKeys[0], allCatKeys[1], allCatKeys[3]);
          } else if (wave > 0.16) {
            level = 3;
            count = 3;
            assignedCats.push(allCatKeys[2], allCatKeys[4]);
          } else if (wave > -0.05) {
            level = 2;
            count = 2;
            assignedCats.push(allCatKeys[5], allCatKeys[6]);
          } else if (wave > -0.28) {
            level = 1;
            count = 1;
            assignedCats.push(allCatKeys[day % allCatKeys.length]);
          }

          map.set(dateStr, {
            date: dateStr,
            count,
            level,
            categories: assignedCats,
          });
        }
      }
    } else {
      for (const item of data) {
        if (item?.date) {
          map.set(item.date, item);
        }
      }
    }

    return map;
  }, [data, fillSampleData, numericYear]);

  // Aggregate category counts across the calendar
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const cat of RESEARCH_CATEGORIES) {
      counts[cat.id] = 0;
    }
    for (const item of dataMap.values()) {
      if (item.categories && item.categories.length > 0) {
        for (const catId of item.categories) {
          if (counts[catId] !== undefined) {
            counts[catId]++;
          }
        }
      }
    }
    return counts;
  }, [dataMap]);

  // Build the Continuous 53-Week Honeycomb Ribbon with Monthly Alignments
  const { cells, monthLabels, totalWidth, totalHeight } = useMemo(() => {
    const leftMargin = showDayLabels ? 28.0 : 10.0;
    const allCells: Array<{
      date: string;
      weekIndex: number;
      dayOfWeek: number;
      count: number;
      level: 0 | 1 | 2 | 3 | 4;
      cx: number;
      cy: number;
      categories?: string[];
      item?: HexContributionDay;
    }> = [];

    const labels: Array<{ name: string; x: number }> = [];

    // Jan 1 of numeric year
    const jan1 = new Date(Date.UTC(numericYear, 0, 1));
    const jan1DayOfWeek = (jan1.getUTCDay() + 6) % 7; // 0 = Mon ... 6 = Sun

    // Track month start columns
    const monthStartWeeks = new Map<number, number>();

    // Determine total days in year
    const isLeap = (numericYear % 4 === 0 && numericYear % 100 !== 0) || numericYear % 400 === 0;
    const totalDays = isLeap ? 366 : 365;

    let maxWeek = 0;

    for (let dayOfYear = 0; dayOfYear < totalDays; dayOfYear++) {
      const dateObj = new Date(Date.UTC(numericYear, 0, dayOfYear + 1));
      const m = dateObj.getUTCMonth();
      const dayOfMonth = dateObj.getUTCDate();
      const d = (dateObj.getUTCDay() + 6) % 7; // 0 = Mon ... 6 = Sun

      // Calculate calendar week column
      const w = Math.floor((dayOfYear + jan1DayOfWeek) / 7);
      if (w > maxWeek) maxWeek = w;

      if (dayOfMonth === 1 && !monthStartWeeks.has(m)) {
        monthStartWeeks.set(m, w);
      }

      const dateStr = dateObj.toISOString().slice(0, 10);
      const item = dataMap.get(dateStr);
      const count = item?.count || 0;

      let level: 0 | 1 | 2 | 3 | 4 = 0;
      if (item?.level !== undefined) {
        level = item.level;
      } else if (count >= 4) {
        level = 4;
      } else if (count === 3) {
        level = 3;
      } else if (count === 2) {
        level = 2;
      } else if (count === 1) {
        level = 1;
      }

      // Flat-topped honeycomb center: odd columns shifted by Y_STAGGER
      const cx = leftMargin + w * X_PITCH;
      const cy = TOP_MARGIN + d * Y_PITCH + (w % 2 === 1 ? Y_STAGGER : 0);

      allCells.push({
        date: dateStr,
        weekIndex: w,
        dayOfWeek: d,
        count,
        level,
        cx,
        cy,
        categories: item?.categories,
        item,
      });
    }

    // Month labels aligned to starting week column
    for (let m = 0; m < 12; m++) {
      const startW = monthStartWeeks.get(m) ?? Math.round(m * 4.35);
      const labelX = leftMargin + startW * X_PITCH;
      labels.push({
        name: MONTH_NAMES[m],
        x: labelX,
      });
    }

    const calculatedWidth = leftMargin + (maxWeek + 1) * X_PITCH + RADIUS + 10;
    const calculatedHeight = TOP_MARGIN + 7 * Y_PITCH + Y_STAGGER + 10;

    return {
      cells: allCells,
      monthLabels: labels,
      totalWidth: calculatedWidth,
      totalHeight: calculatedHeight,
    };
  }, [numericYear, dataMap, showDayLabels]);

  const handleToggleCategory = (catId: string) => {
    const next = activeCategory === catId ? null : catId;
    if (onFilterCategory) {
      onFilterCategory(next);
    } else {
      setInternalCategory(next);
    }
  };

  return (
    <div
      className={`rounded-2xl border border-[#E5DDD3] dark:border-[#28382C] bg-[#FAF7F0]/80 dark:bg-[#121B14]/90 p-5 sm:p-6 shadow-2xs ${className}`}
    >
      {/* ── TOP HEADER: Title (Left) and Less/More 5-Hex Legend (Right) ── */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h3 className="font-sans font-bold text-sm sm:text-base text-[#1F2922] dark:text-[#FAF7F0] tracking-tight m-0">
          {title || `${numericYear} Research Activity Cadence`}
        </h3>

        {showLegend && (
          <div className="flex items-center gap-1.5 text-xs font-mono text-[#85877B] dark:text-[#8FA89B]">
            <span className="text-[10px] font-medium mr-0.5">Less</span>
            {LEVEL_STYLES.map((style) => (
              <svg
                key={style.level}
                width={12}
                height={13}
                viewBox="0 0 12 13"
                className="inline-block overflow-visible"
              >
                <polygon
                  points={getFlatHexPoints(6, 6.5, 4.8)}
                  className={`${style.className} transition-colors`}
                  strokeWidth={0.8}
                />
              </svg>
            ))}
            <span className="text-[10px] font-medium ml-0.5">More</span>
          </div>
        )}
      </div>

      {/* ── CONTINUOUS HONEYCOMB SVG CANVAS ── */}
      <div className="overflow-x-auto pb-2 scrollbar-thin">
        <svg
          width={totalWidth}
          height={totalHeight}
          viewBox={`0 0 ${totalWidth} ${totalHeight}`}
          className="select-none overflow-visible block min-w-[580px]"
        >
          {/* Day of Week Labels (Optional Mon, Wed, Fri) */}
          {showDayLabels && (
            <g className="fill-[#85877B] dark:fill-[#7E8B7B] text-[8.5px] font-mono">
              <text x={2} y={TOP_MARGIN + 0 * Y_PITCH + 4}>
                Mon
              </text>
              <text x={2} y={TOP_MARGIN + 2 * Y_PITCH + 4}>
                Wed
              </text>
              <text x={2} y={TOP_MARGIN + 4 * Y_PITCH + 4}>
                Fri
              </text>
            </g>
          )}

          {/* Month Header Labels Aligned to Month Starts */}
          {monthLabels.map((lbl) => (
            <text
              key={lbl.name}
              x={lbl.x}
              y={12}
              textAnchor="start"
              className="fill-[#85877B] dark:fill-[#8FA89B] text-[9.5px] font-mono font-medium tracking-wide"
            >
              {lbl.name}
            </text>
          ))}

          {/* Continuous Interlocking Flat-Topped Hexagon Cells */}
          {cells.map((cell) => {
            const style = LEVEL_STYLES[cell.level];
            const isSelected = selectedDate === cell.date;

            // Category filtering highlight logic
            const matchesCategory =
              !activeCategory ||
              (cell.categories && cell.categories.includes(activeCategory));
            const opacityClass = matchesCategory ? "opacity-100" : "opacity-25";

            return (
              <polygon
                key={cell.date}
                points={getFlatHexPoints(cell.cx, cell.cy, RADIUS)}
                strokeWidth={isSelected ? 2 : 0.75}
                className={`transition-all duration-150 cursor-pointer ${
                  style.className
                } ${opacityClass} hover:opacity-85 ${
                  isSelected
                    ? "stroke-[#202920] dark:stroke-white stroke-[2px] z-10"
                    : ""
                } ${
                  activeCategory && matchesCategory && cell.count > 0
                    ? "stroke-[#274833] dark:stroke-[#4ADE80] stroke-[1.5px]"
                    : ""
                }`}
                onMouseEnter={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setHoveredCell({
                    date: cell.date,
                    count: cell.count,
                    level: cell.level,
                    categories: cell.categories,
                    x: rect.left + rect.width / 2,
                    y: rect.top,
                  });
                }}
                onMouseLeave={() => setHoveredCell(null)}
                onClick={() => onSelectDate?.(cell.date, cell.item)}
              >
                <title>
                  {`${cell.date}: ${cell.count} research milestone(s)`}
                </title>
              </polygon>
            );
          })}
        </svg>
      </div>

      {/* ── FLOATING TOOLTIP ── */}
      {hoveredCell && (
        <div
          className="fixed z-50 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-2 bg-[#202920] dark:bg-[#131C15] text-white text-[11px] font-mono px-3 py-2 rounded-xl shadow-xl border border-[#3E6248]/40 dark:border-[#4ADE80]/30 whitespace-nowrap"
          style={{
            left: `${hoveredCell.x}px`,
            top: `${hoveredCell.y - 8}px`,
          }}
        >
          <div className="font-semibold text-[#DCE6D7] dark:text-[#4ADE80]">
            {hoveredCell.date}
          </div>
          <div className="text-[10px] text-[#FAF7F0]/90 dark:text-[#EDEAE2]/90 mt-0.5">
            {hoveredCell.count === 0
              ? "No recorded milestones"
              : `${hoveredCell.count} verified research milestone${
                  hoveredCell.count === 1 ? "" : "s"
                }`}
          </div>
          {hoveredCell.categories && hoveredCell.categories.length > 0 && (
            <div className="flex items-center gap-1 mt-1.5 flex-wrap">
              {hoveredCell.categories.map((cId) => {
                const found = RESEARCH_CATEGORIES.find((rc) => rc.id === cId);
                return (
                  <span
                    key={cId}
                    className="text-[9px] bg-white/15 text-[#FAF7F0] px-1.5 py-0.5 rounded-md"
                  >
                    {found?.label || cId}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── BOTTOM CATEGORY PILLS (Exact Match to Visual Reference) ── */}
      {showCategories && (
        <div className="mt-4 pt-3 border-t border-[#E5DDD3]/70 dark:border-[#253629]/70 flex flex-wrap gap-2 items-center">
          {RESEARCH_CATEGORIES.map((cat) => {
            const isFiltered = activeCategory === cat.id;
            const count = categoryCounts[cat.id] || 0;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleToggleCategory(cat.id)}
                className={`px-3 py-1 rounded-full text-xs font-sans transition-all cursor-pointer border flex items-center gap-1.5 ${
                  isFiltered
                    ? "bg-[#274833] dark:bg-[#4ADE80] text-white dark:text-[#111A13] border-[#274833] dark:border-[#4ADE80] shadow-xs font-semibold"
                    : "bg-white/80 dark:bg-[#1A251E]/80 text-[#4A5568] dark:text-[#C5D5BE] border-[#E5DDD3] dark:border-[#2D3E32] hover:border-[#8FA89B] hover:text-[#202920] dark:hover:text-white"
                }`}
              >
                <span>{cat.label}</span>
                {count > 0 && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                      isFiltered
                        ? "bg-white/25 text-white dark:bg-black/20 dark:text-[#111A13]"
                        : "bg-[#FAF7F0] dark:bg-[#121B14] text-[#85877B] dark:text-[#8FA89B]"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Optional subtext */}
      {subtext && (
        <div className="mt-2 text-[10px] font-mono text-[#85877B] dark:text-[#7E8B7B]">
          {subtext}
        </div>
      )}
    </div>
  );
}
