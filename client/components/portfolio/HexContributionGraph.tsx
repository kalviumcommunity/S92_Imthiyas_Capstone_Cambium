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
  monthsCount?: number;
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
    className: "fill-[#F1ECE2] dark:fill-[#16211A] stroke-[#E4DDD0] dark:stroke-[#223227]",
    badgeBg: "bg-[#F1ECE2] dark:bg-[#16211A]",
  },
  {
    level: 1,
    className: "fill-[#C6DBC8] dark:fill-[#1E3A26] stroke-[#B4CEB7] dark:stroke-[#2D5438]",
    badgeBg: "bg-[#C6DBC8] dark:bg-[#1E3A26]",
  },
  {
    level: 2,
    className: "fill-[#84AC8F] dark:fill-[#2D583B] stroke-[#729B7D] dark:stroke-[#3E7750]",
    badgeBg: "bg-[#84AC8F] dark:bg-[#2D583B]",
  },
  {
    level: 3,
    className: "fill-[#497A58] dark:fill-[#3E754E] stroke-[#3B6648] dark:stroke-[#549D6A]",
    badgeBg: "bg-[#497A58] dark:bg-[#3E754E]",
  },
  {
    level: 4,
    className: "fill-[#295237] dark:fill-[#48A465] stroke-[#1F402B] dark:stroke-[#378B52]",
    badgeBg: "bg-[#295237] dark:bg-[#48A465]",
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
const MONTH_GAP = 14.0; // Lateral gap between monthly clusters
const TOP_MARGIN = 24.0; // Space for month headers

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
  monthsCount = 12,
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

      // Deterministic, high-fidelity pseudo-random generator
      const seededHash = (seed: number) => {
        const x = Math.sin(seed * 12.9898 + numericYear * 78.233) * 43758.5453;
        return x - Math.floor(x);
      };

      // Realistic human-scale academic rhythm (~65-70% empty cells, irregular mid-level cadence):
      // Jan-Mar: 3-5 faint sage isolated cells per month
      // Apr-May: Spring conference/grant crunch (6-8 mixed cells with weekend/day-off gaps)
      // Jun-Aug: Quiet summer reading break (1-3 faint isolated cells per month)
      // Sep: Loose moderate Fall cluster (5-7 cells light-to-medium green)
      // Oct-Dec: Sporadic tapering milestones (2-4 sparse cells)
      const TARGET_ACTIVE_BY_MONTH = [4, 5, 4, 7, 8, 2, 1, 2, 6, 3, 4, 2];

      for (let m = 0; m < 12; m++) {
        const daysInMonth = new Date(Date.UTC(numericYear, m + 1, 0)).getUTCDate();
        const targetActive = TARGET_ACTIVE_BY_MONTH[m] ?? 3;

        // Deterministic scored candidate days prioritizing weekdays and natural spacing
        const candidates: Array<{ day: number; dayOfYear: number; score: number }> = [];
        for (let day = 1; day <= daysInMonth; day++) {
          const dateObj = new Date(Date.UTC(numericYear, m, day));
          const dayOfYear = Math.floor(
            (dateObj.getTime() - Date.UTC(numericYear, 0, 1)) / 86400000
          );
          const dayOfWeek = (dateObj.getUTCDay() + 6) % 7; // 0=Mon, 6=Sun
          const dayRand = seededHash(dayOfYear * 41 + day * 17 + m * 29);

          // Strong preference against unbroken multi-day blocks; weekdays slightly favored
          const clusterBias =
            m === 3 || m === 4
              ? (day >= 9 && day <= 24 ? 0.28 : 0.0)
              : m === 8
              ? (day >= 6 && day <= 19 ? 0.22 : 0.0)
              : 0.0;
          const weekendPenalty = dayOfWeek >= 5 ? -0.32 : 0.08;
          candidates.push({
            day,
            dayOfYear,
            score: dayRand + clusterBias + weekendPenalty,
          });
        }

        // Select top non-cluttered days respecting authentic spacing (~65-70%+ empty honeycomb)
        const ranked = [...candidates].sort((a, b) => b.score - a.score);
        const pickedDays = new Map<number, 1 | 2 | 3 | 4>();
        for (const cand of ranked) {
          if (pickedDays.size >= targetActive) break;
          // Reject 3+ consecutive day chains to avoid artificial unbroken streaks
          const prev1 = pickedDays.has(cand.day - 1);
          const prev2 = pickedDays.has(cand.day - 2);
          const next1 = pickedDays.has(cand.day + 1);
          const next2 = pickedDays.has(cand.day + 2);
          if ((prev1 && prev2) || (next1 && next2) || (prev1 && next1)) continue;

          const intensityRoll = seededHash(cand.dayOfYear * 97 + 11);
          let lvl: 1 | 2 | 3 | 4 = 1;
          if (m === 3 || m === 4) {
            // Apr & May crunch: mix of pale sage through deep forest green spots
            if (intensityRoll > 0.72) lvl = 4;
            else if (intensityRoll > 0.45) lvl = 3;
            else if (intensityRoll > 0.22) lvl = 2;
            else lvl = 1;
          } else if (m === 8) {
            // Sep: light to medium green loose cluster
            if (intensityRoll > 0.75) lvl = 3;
            else if (intensityRoll > 0.38) lvl = 2;
            else lvl = 1;
          } else if (m >= 5 && m <= 7) {
            // Jun-Aug summer break: faint isolated marks only
            lvl = 1;
          } else {
            // Jan-Mar, Oct-Dec: mostly faint sage with rare level 2
            lvl = intensityRoll > 0.80 ? 2 : 1;
          }
          pickedDays.set(cand.day, lvl);
        }

        for (let day = 1; day <= daysInMonth; day++) {
          const dateObj = new Date(Date.UTC(numericYear, m, day));
          const dateStr = dateObj.toISOString().slice(0, 10);
          const lvl = pickedDays.get(day) ?? 0;
          const assignedCats: string[] = [];

          if (lvl > 0) {
            const c1 = allCatKeys[(m * 3 + day) % allCatKeys.length];
            assignedCats.push(c1);
            if (lvl >= 3) {
              const c2 = allCatKeys[(m * 3 + day + 3) % allCatKeys.length];
              if (c2 !== c1) assignedCats.push(c2);
            }
          }

          map.set(dateStr, {
            date: dateStr,
            count: lvl === 0 ? 0 : lvl === 1 ? 1 : lvl === 2 ? 2 : lvl === 3 ? 3 : 4 + (day % 2),
            level: lvl,
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

  // Build Monthly-Separated Flat-Topped Honeycomb Tessellation Clusters (default 12 months, optional monthsCount crop)
  const visibleMonths = Math.max(1, Math.min(12, monthsCount));
  const { cells, monthLabels, totalWidth, totalHeight } = useMemo(() => {
    const leftMargin = showDayLabels ? 30.0 : 12.0;
    const allCells: Array<{
      date: string;
      month: number;
      colInMonth: number;
      dayOfWeek: number;
      count: number;
      level: 0 | 1 | 2 | 3 | 4;
      cx: number;
      cy: number;
      categories?: string[];
      item?: HexContributionDay;
    }> = [];

    const labels: Array<{ name: string; x: number }> = [];

    let currentX = leftMargin;

    for (let m = 0; m < visibleMonths; m++) {
      const daysInMonth = new Date(Date.UTC(numericYear, m + 1, 0)).getUTCDate();
      const firstDate = new Date(Date.UTC(numericYear, m, 1));
      const firstDow = (firstDate.getUTCDay() + 6) % 7; // 0 = Mon ... 6 = Sun

      const monthStartX = currentX;
      let maxColInMonth = 0;

      for (let day = 1; day <= daysInMonth; day++) {
        const dateObj = new Date(Date.UTC(numericYear, m, day));
        const dow = (dateObj.getUTCDay() + 6) % 7; // 0 = Mon ... 6 = Sun
        const colInMonth = Math.floor((day - 1 + firstDow) / 7);
        if (colInMonth > maxColInMonth) {
          maxColInMonth = colInMonth;
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

        // Flat-topped honeycomb center:
        // cx = monthStartX + colInMonth * X_PITCH
        // cy = TOP_MARGIN + dow * Y_PITCH + (colInMonth % 2 === 1 ? Y_STAGGER : 0)
        const cx = monthStartX + colInMonth * X_PITCH;
        const cy = TOP_MARGIN + dow * Y_PITCH + (colInMonth % 2 === 1 ? Y_STAGGER : 0);

        allCells.push({
          date: dateStr,
          month: m,
          colInMonth,
          dayOfWeek: dow,
          count,
          level,
          cx,
          cy,
          categories: item?.categories,
          item,
        });
      }

      // Centered month label directly above this month's cluster
      const clusterSpan = maxColInMonth * X_PITCH;
      const labelX = monthStartX + clusterSpan / 2;
      labels.push({
        name: MONTH_NAMES[m],
        x: labelX,
      });

      // Advance currentX to the start of next month with lateral separation gap
      currentX += (maxColInMonth + 1) * X_PITCH + MONTH_GAP;
    }

    const calculatedWidth = currentX - MONTH_GAP + leftMargin + RADIUS;
    const calculatedHeight = TOP_MARGIN + 7 * Y_PITCH + Y_STAGGER + 12;

    return {
      cells: allCells,
      monthLabels: labels,
      totalWidth: Math.ceil(calculatedWidth),
      totalHeight: Math.ceil(calculatedHeight),
    };
  }, [numericYear, dataMap, showDayLabels, visibleMonths]);

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
          className={
            visibleMonths <= 10
              ? "select-none overflow-visible block w-full h-auto"
              : "select-none overflow-visible block min-w-[720px] max-w-full"
          }
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
              y={14}
              textAnchor="middle"
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
                    ? "stroke-[#295237] dark:stroke-[#48A465] stroke-[1.5px]"
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
                    ? "bg-[#295237] dark:bg-[#48A465] text-white dark:text-[#0E1510] border-[#295237] dark:border-[#48A465] shadow-xs font-semibold"
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
