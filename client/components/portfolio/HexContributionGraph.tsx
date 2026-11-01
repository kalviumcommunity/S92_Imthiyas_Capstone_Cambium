"use client";

import React, { useState, useMemo } from "react";

export interface HexContributionDay {
  date: string; // YYYY-MM-DD
  count: number;
  level?: 0 | 1 | 2 | 3 | 4;
  label?: string;
  metadata?: Record<string, any>;
}

export interface HexContributionGraphProps {
  data?: HexContributionDay[];
  year?: number | string;
  onSelectDate?: (date: string, item?: HexContributionDay) => void;
  selectedDate?: string | null;
  className?: string;
  showLegend?: boolean;
  showDayLabels?: boolean;
  fillSampleData?: boolean;
  subtext?: string;
}

// 5-Tier Living Materials Color Palette with Light & Dark Class Tokens
const LEVEL_CLASSES = [
  "fill-[#FAF7F0] dark:fill-[#18231B] stroke-[#E4DCCB] dark:stroke-[#28382C]", // Level 0: Blank / Parchment
  "fill-[#DCE6D7] dark:fill-[#1E3023] stroke-[#C5D5BE] dark:stroke-[#2C4433]", // Level 1: Sage Mist
  "fill-[#A3C4A8] dark:fill-[#284C32] stroke-[#8DB594] dark:stroke-[#3B6644]", // Level 2: Foliage
  "fill-[#66866A] dark:fill-[#376945] stroke-[#527356] dark:stroke-[#4E8D60]", // Level 3: Deep Moss
  "fill-[#3E6248] dark:fill-[#4ADE80] stroke-[#2B4734] dark:stroke-[#22C55E]", // Level 4: Canopy Green
];

const RADIUS = 5.8; // Circumcircle radius for pointy-topped regular hexagon
const X_PITCH = 9.8; // Lateral step between columns in the same month
const Y_PITCH = 13.0; // Vertical step between rows in the same column
const Y_OFFSET = 6.5; // Odd-q column stagger (half of Y_PITCH)
const MONTH_GAP = 16.0; // 16px lateral visual separation between month clusters
const TOP_MARGIN = 24.0; // Space for month headers
const LEFT_MARGIN = 32.0; // Space for Mon/Wed/Fri day-of-week labels

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

function getHexPoints(cx: number, cy: number, r: number): string {
  const points: string[] = [];
  for (let i = 0; i < 6; i++) {
    // Pointy-topped hexagon: vertices at -90, -30, 30, 90, 150, 210 degrees
    const angleRad = (Math.PI / 180) * (60 * i - 90);
    const px = cx + r * Math.cos(angleRad);
    const py = cy + r * Math.sin(angleRad);
    points.push(`${px.toFixed(2)},${py.toFixed(2)}`);
  }
  return points.join(" ");
}

export function HexContributionGraph({
  data = [],
  year = 2026,
  onSelectDate,
  selectedDate,
  className = "",
  showLegend = true,
  showDayLabels = true,
  fillSampleData = false,
  subtext,
}: HexContributionGraphProps) {
  const [hoveredCell, setHoveredCell] = useState<{
    date: string;
    count: number;
    level: number;
    x: number;
    y: number;
  } | null>(null);

  const numericYear = typeof year === "number" ? year : parseInt(String(year), 10) || 2026;

  // Index input data by YYYY-MM-DD, or generate organic pattern if fillSampleData is true
  const dataMap = useMemo(() => {
    const map = new Map<string, HexContributionDay>();

    if (fillSampleData) {
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
          const val =
            (Math.sin(w * 0.38) + Math.cos(d * 0.72) + Math.sin(w * 0.14 + d * 0.9)) / 3;

          let level: 0 | 1 | 2 | 3 | 4 = 0;
          let count = 0;
          if (val > 0.42) {
            level = 4;
            count = 5;
          } else if (val > 0.18) {
            level = 3;
            count = 3;
          } else if (val > -0.06) {
            level = 2;
            count = 2;
          } else if (val > -0.32) {
            level = 1;
            count = 1;
          }
          map.set(dateStr, { date: dateStr, count, level });
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

  // Build the 12-Month Honeycomb Layout with odd-q column stagger and 16px month separation
  const { monthClusters, totalWidth, totalHeight } = useMemo(() => {
    let currentX = LEFT_MARGIN;
    const clusters: Array<{
      name: string;
      labelX: number;
      cells: Array<{
        date: string;
        dayOfWeek: number;
        count: number;
        level: 0 | 1 | 2 | 3 | 4;
        cx: number;
        cy: number;
        item?: HexContributionDay;
      }>;
    }> = [];

    for (let m = 0; m < 12; m++) {
      const daysInMonth = new Date(Date.UTC(numericYear, m + 1, 0)).getUTCDate();
      const monthCells: Array<{
        date: string;
        dayOfWeek: number;
        count: number;
        level: 0 | 1 | 2 | 3 | 4;
        cx: number;
        cy: number;
        item?: HexContributionDay;
      }> = [];

      let colInMonth = 0;
      const monthStartX = currentX;

      for (let day = 1; day <= daysInMonth; day++) {
        const dateObj = new Date(Date.UTC(numericYear, m, day));
        const dayOfWeek = (dateObj.getUTCDay() + 6) % 7; // 0 = Mon, 1 = Tue, ..., 6 = Sun

        // Start new column on Monday (unless it's the very first day)
        if (dayOfWeek === 0 && day > 1) {
          colInMonth++;
        }

        const dateStr = dateObj.toISOString().slice(0, 10);
        const dayData = dataMap.get(dateStr);
        const count = dayData?.count || 0;

        let level: 0 | 1 | 2 | 3 | 4 = 0;
        if (dayData?.level !== undefined) {
          level = dayData.level;
        } else if (count >= 4) {
          level = 4;
        } else if (count === 3) {
          level = 3;
        } else if (count === 2) {
          level = 2;
        } else if (count === 1) {
          level = 1;
        }

        // Center calculation with odd-q offset (odd columns staggered by Y_OFFSET)
        const cx = monthStartX + colInMonth * X_PITCH;
        const cy =
          TOP_MARGIN +
          dayOfWeek * Y_PITCH +
          (colInMonth % 2 === 1 ? Y_OFFSET : 0);

        monthCells.push({
          date: dateStr,
          dayOfWeek,
          count,
          level,
          cx,
          cy,
          item: dayData,
        });
      }

      const monthWidth = colInMonth * X_PITCH;
      const labelX = monthStartX + monthWidth / 2;

      clusters.push({
        name: MONTH_NAMES[m],
        labelX,
        cells: monthCells,
      });

      // Shift X for next month, inserting the 16px lateral gap between clusters
      currentX += monthWidth + MONTH_GAP + X_PITCH;
    }

    const calculatedHeight = TOP_MARGIN + 7 * Y_PITCH + Y_OFFSET + 12;
    return {
      monthClusters: clusters,
      totalWidth: currentX + 10,
      totalHeight: calculatedHeight,
    };
  }, [numericYear, dataMap]);

  return (
    <div className={`relative ${className}`}>
      {/* ── Scrollable SVG Honeycomb Canvas ── */}
      <div className="overflow-x-auto pb-2 scrollbar-thin">
        <svg
          width={totalWidth}
          height={totalHeight}
          viewBox={`0 0 ${totalWidth} ${totalHeight}`}
          className="select-none overflow-visible"
        >
          {/* Day of Week Labels (Mon, Wed, Fri) */}
          {showDayLabels && (
            <g className="fill-[#85877B] dark:fill-[#7E8B7B] text-[9px] font-mono">
              <text x={8} y={TOP_MARGIN + 0 * Y_PITCH + 4}>
                Mon
              </text>
              <text x={8} y={TOP_MARGIN + 2 * Y_PITCH + 4}>
                Wed
              </text>
              <text x={8} y={TOP_MARGIN + 4 * Y_PITCH + 4}>
                Fri
              </text>
            </g>
          )}

          {/* Month Clusters with 16px Visual Separation */}
          {monthClusters.map((cluster) => (
            <g key={cluster.name}>
              {/* Month Header Label */}
              <text
                x={cluster.labelX}
                y={13}
                textAnchor="middle"
                className="fill-[#85877B] dark:fill-[#7E8B7B] text-[10px] font-mono font-medium"
              >
                {cluster.name}
              </text>

              {/* Pointy-Topped Hexagon Cells */}
              {cluster.cells.map((cell) => {
                const colorClass = LEVEL_CLASSES[cell.level];
                const isSelected = selectedDate === cell.date;

                return (
                  <polygon
                    key={cell.date}
                    points={getHexPoints(cell.cx, cell.cy, RADIUS)}
                    strokeWidth={isSelected ? 2 : 1}
                    className={`transition-all duration-100 cursor-pointer ${colorClass} hover:opacity-85 ${
                      isSelected ? "stroke-[#202920] dark:stroke-white stroke-[2px]" : ""
                    }`}
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setHoveredCell({
                        date: cell.date,
                        count: cell.count,
                        level: cell.level,
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
            </g>
          ))}
        </svg>
      </div>

      {/* ── Floating Tooltip ── */}
      {hoveredCell && (
        <div
          className="fixed z-50 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-2 bg-[#202920] dark:bg-[#131C15] text-white text-[11px] font-mono px-3 py-1.5 rounded-lg shadow-lg border border-[#3E6248]/40 dark:border-[#4ADE80]/30 whitespace-nowrap"
          style={{
            left: `${hoveredCell.x}px`,
            top: `${hoveredCell.y - 6}px`,
          }}
        >
          <div className="font-semibold text-[#DCE6D7] dark:text-[#4ADE80]">
            {hoveredCell.date}
          </div>
          <div className="text-[10px] text-[#FAF7F0]/80 dark:text-[#EDEAE2]/80">
            {hoveredCell.count === 0
              ? "No recorded milestones"
              : `${hoveredCell.count} verified research milestone${
                  hoveredCell.count === 1 ? "" : "s"
                }`}
          </div>
        </div>
      )}

      {/* ── Footer Legend ── */}
      {showLegend && (
        <div className="flex items-center justify-between text-xs text-[#85877B] dark:text-[#7E8B7B] mt-4 pt-3 border-t border-[#E4DCCB] dark:border-[#233327]">
          <span className="font-mono text-[11px]">
            {subtext || "Cellular honeycomb tessellation (pointy-topped odd-q monthly layout)"}
          </span>
          <div className="flex items-center gap-1.5 text-[11px] font-mono">
            <span>Less</span>
            {LEVEL_CLASSES.map((cls, idx) => (
              <svg key={idx} width={13} height={14} className="inline-block">
                <polygon
                  points={getHexPoints(6.5, 7, 5.5)}
                  className={cls}
                  strokeWidth={1}
                />
              </svg>
            ))}
            <span>More</span>
          </div>
        </div>
      )}
    </div>
  );
}
