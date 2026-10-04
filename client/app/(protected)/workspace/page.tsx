"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { CitationModal, CitationItem } from "@/components/ui/citation-modal";
import { AiProgressModal } from "@/components/ui/ai-progress-modal";
import { ConflictModal } from "@/components/ui/conflict-modal";
import { SessionLockModal } from "@/components/ui/session-lock-modal";
import { SplitPaneReader } from "@/components/workspace/SplitPaneReader";
import { useToast } from "@/components/ui/toast";
import CambiumLogo from "@/components/CambiumLogo";

// ─── Design Tokens (SSOT from 01_Design Systems) ───────────────────────────

const W = {
  bg: "#FAF7F0",           // Parchment canvas
  surface: "#FFFFFF",      // Surface raised
  surface2: "#F2EBDD",     // Mineral sand foundation
  border: "#E4DCCB",       // Limestone hairline
  borderSubtle: "#E4DCCB",
  text1: "#202920",        // Forest ink primary
  text2: "#62685E",        // Bark grey secondary
  text3: "#85877B",        // Quiet stone metadata
  green: "#3E6248",        // Canopy green
  greenDim: "#66866A",     // Living algae
  greenBg: "#DCE6D7",      // Sage mist highlight
  greenBorder: "#E4DCCB",
  blue: "#365F8D",
  blueBg: "#DCE6D7",
  blueBorder: "#E4DCCB",
  amber: "#8A5A12",
  amberBg: "#F2EBDD",
  purple: "#3E6248",
  purpleBg: "#DCE6D7",
  redBg: "#FBF2F0",
  red: "#B33D35",
} as const;

// ─── Icons (Inline SVG) ─────────────────────────────────────────────────────

const Icon = ({
  d,
  size = 16,
  stroke = "currentColor",
  fill = "none",
  strokeWidth = 1.6,
}: {
  d: string;
  size?: number;
  stroke?: string;
  fill?: string;
  strokeWidth?: number;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke={stroke}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ flexShrink: 0 }}
  >
    <path d={d} />
  </svg>
);

const icons = {
  chevronRight: "M9 18l6-6-6-6",
  chevronDown: "M6 9l6 6 6-6",
  chevronLeft: "M15 18l-6-6 6-6",
  plus: "M12 5v14M5 12h14",
  search: "M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  share: "M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13",
  comment: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  history: "M3 3v5h5M3.05 13A9 9 0 1 0 6 5.3L3 8",
  sparkle: "M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z",
  export: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12",
  menu: "M3 12h18M3 6h18M3 18h18",
  file: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z",
  folder: "M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z",
  check: "M20 6L9 17l-5-5",
  x: "M18 6L6 18M6 6l12 12",
  link: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
  brain: "M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.44-4.14M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.44-4.14",
  network: "M12 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM3 18a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM21 18a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM12 5v4M4.22 17.22l3.56-3.56M19.78 17.22l-3.56-3.56",
  task: "M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11",
  activity: "M22 12h-4l-3 9L9 3l-3 9H2",
  archive: "M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z",
  trash: "M3 6h18M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2",
  template: "M4 3h16a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM4 11h6a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1zM14 11h6a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1z",
  collapse: "M11 19l-7-7 7-7M18 5l-7 7 7 7",
  expand: "M13 5l7 7-7 7M6 19l7-7-7-7",
  dot: "M12 12m-2 0a2 2 0 1 0 4 0 2 2 0 1 0-4 0",
  flask: "M9 3h6M9 3v7l-4 9a1 1 0 0 0 .9 1.4h12.2a1 1 0 0 0 .9-1.4L15 10V3",
  lightbulb: "M9 18h6M10 22h4M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z",
  quote: "M3 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1zM15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z",
  zap: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2",
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  upload: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12",
  target: "M22 12A10 10 0 1 1 2 12a10 10 0 0 1 20 0zM16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM12 12h.01",
  beaker: "M4.5 3h15M8.5 3v7l-5 9a1 1 0 0 0 .89 1.45h15.22A1 1 0 0 0 20.5 19l-5-9V3",
  gitcommit: "M12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12zM2 12h4M18 12h4",
  maximize: "M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3",
  compass: "M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm1 14.5l-4-1.5 1.5-4 4 1.5-1.5 4z",
  dashboard: "M3 3h8v8H3V3zm10 0h8v5h-8V3zm0 7h8v11h-8V10zM3 13h8v8H3v-8z",
  columns: "M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7m0-18H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7m0-18v18",
  lock: "M12 15v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2zm10-10V7a4 4 0 0 0-8 0v4h8z",
  help: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3m.08 4h.01M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z",
};

// ─── Utility Components ─────────────────────────────────────────────────────

function Tooltip({ text, children }: { text: string; children: React.ReactNode }) {
  const [show, setShow] = useState(false);
  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div
          style={{
            background: "#1A1917",
            color: "#F8F6F2",
            fontSize: 11,
            whiteSpace: "nowrap",
            borderRadius: 5,
            padding: "3px 7px",
            bottom: -28,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 100,
            pointerEvents: "none",
          }}
          className="absolute shadow-md"
        >
          {text}
        </div>
      )}
    </div>
  );
}

// ─── Left Sidebar ───────────────────────────────────────────────────────────

const navSections = [
  {
    label: "Workspace",
    items: [
      { id: "overview", label: "Overview", icon: icons.target },
      { id: "questions", label: "Research Questions", icon: icons.lightbulb },
      { id: "literature", label: "Literature Review", icon: icons.quote, active: true },
      { id: "reading", label: "Reading Notes", icon: icons.file },
      { id: "ideas", label: "Ideas", icon: icons.sparkle },
      { id: "experiments", label: "Experiments", icon: icons.flask },
      { id: "methodology", label: "Methodology", icon: icons.beaker },
      { id: "analysis", label: "Analysis", icon: icons.activity },
      { id: "results", label: "Results", icon: icons.check },
      { id: "drafts", label: "Draft Papers", icon: icons.file },
      { id: "references", label: "References", icon: icons.link },
      { id: "datasets", label: "Datasets", icon: icons.archive },
      { id: "meetings", label: "Meeting Notes", icon: icons.comment },
      { id: "tasks", label: "Tasks", icon: icons.task },
    ],
  },
];

const recentPages = [
  { label: "Literature Review", icon: icons.quote },
  { label: "Transformer Models", icon: icons.file },
  { label: "Medical Imaging Dataset", icon: icons.archive },
  { label: "Experiment Log — Segmentation", icon: icons.flask },
  { label: "Paper Outline", icon: icons.file },
];

function Sidebar({
  collapsed,
  onToggle,
  activeNav,
  setActiveNav,
}: {
  collapsed: boolean;
  onToggle: () => void;
  activeNav: string;
  setActiveNav: (id: string) => void;
}) {
  const [questionsOpen, setQuestionsOpen] = useState(true);

  return (
    <aside
      style={{
        width: collapsed ? 52 : 240,
        minWidth: collapsed ? 52 : 240,
        background: W.surface,
        borderRight: `1px solid ${W.border}`,
        display: "flex",
        flexDirection: "column",
        transition: "width 200ms ease, min-width 200ms ease",
        overflow: "hidden",
        zIndex: 10,
        height: "100vh",
      }}
    >
      {/* Brand & Toggle */}
      <div
        style={{
          padding: collapsed ? "14px 12px" : "14px 16px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          borderBottom: `1px solid ${W.borderSubtle}`,
          flexShrink: 0,
        }}
      >
        {collapsed ? (
          <Link
            href="/dashboard"
            title="CAMBIUM Research Dashboard"
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "#FAF7F0",
              border: `1px solid ${W.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              padding: 2,
              flexShrink: 0,
            }}
          >
            <img src="/logo.svg" alt="CAMBIUM Research" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </Link>
        ) : (
          <CambiumLogo size="sm" href="/dashboard" />
        )}
        <button
          onClick={onToggle}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          style={{
            marginLeft: "auto",
            padding: 4,
            borderRadius: 5,
            color: W.text3,
            cursor: "pointer",
            background: "transparent",
            border: "none",
            flexShrink: 0,
            display: "flex",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = W.surface2)}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "transparent")}
        >
          <Icon d={collapsed ? icons.expand : icons.collapse} size={14} strokeWidth={1.8} />
        </button>
      </div>

      {/* Global Navigation links (Dashboard & Discover) */}
      {!collapsed && (
        <div style={{ padding: "8px 10px 4px", display: "flex", gap: 4, borderBottom: `1px solid ${W.borderSubtle}` }}>
          <Link
            href="/dashboard"
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 8px",
              borderRadius: 6,
              textDecoration: "none",
              color: W.text2,
              fontSize: 11.5,
              fontWeight: 500,
              background: W.surface2,
            }}
          >
            <Icon d={icons.dashboard} size={12} strokeWidth={1.6} />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/discover"
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 8px",
              borderRadius: 6,
              textDecoration: "none",
              color: W.text2,
              fontSize: 11.5,
              fontWeight: 500,
              background: W.surface2,
            }}
          >
            <Icon d={icons.compass} size={12} strokeWidth={1.6} />
            <span>Discover</span>
          </Link>
        </div>
      )}

      {/* Workspace Switcher */}
      {!collapsed && (
        <div style={{ padding: "10px 12px 6px" }}>
          <button
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "7px 10px",
              borderRadius: 7,
              border: `1px solid ${W.border}`,
              background: W.surface,
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: 4,
                background: W.greenBg,
                border: `1px solid ${W.greenBorder}`,
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: 12.5, fontWeight: 500, color: W.text1, flex: 1 }}>AI in Healthcare</span>
            <Icon d={icons.chevronDown} size={12} stroke={W.text3} strokeWidth={1.8} />
          </button>
        </div>
      )}

      {/* Quick Actions */}
      {!collapsed ? (
        <div style={{ padding: "8px 12px 10px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
          {[
            { label: "New Page", icon: icons.plus },
            { label: "Search", icon: icons.search },
            { label: "Import PDF", icon: icons.upload },
          ].map((action) => (
            <Tooltip key={action.label} text={action.label}>
              <button
                style={{
                  width: "100%",
                  height: 38,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 8,
                  border: `1px solid ${W.border}`,
                  background: "#FFFFFF",
                  cursor: "pointer",
                  color: W.text2,
                  boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                  transition: "all 150ms ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = W.surface2;
                  (e.currentTarget as HTMLButtonElement).style.borderColor = W.green;
                  (e.currentTarget as HTMLButtonElement).style.color = W.green;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "#FFFFFF";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = W.border;
                  (e.currentTarget as HTMLButtonElement).style.color = W.text2;
                }}
              >
                <Icon d={action.icon} size={15} strokeWidth={1.8} />
              </button>
            </Tooltip>
          ))}
        </div>
      ) : (
        <div style={{ padding: "10px 8px", display: "flex", flexDirection: "column", gap: 6, alignItems: "center" }}>
          {[icons.dashboard, icons.compass, icons.plus, icons.search].map((ic, i) => (
            <button
              key={i}
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: `1px solid ${W.borderSubtle}`,
                background: "#FFFFFF",
                cursor: "pointer",
                color: W.text3,
                transition: "all 150ms ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = W.surface2;
                (e.currentTarget as HTMLButtonElement).style.borderColor = W.green;
                (e.currentTarget as HTMLButtonElement).style.color = W.green;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "#FFFFFF";
                (e.currentTarget as HTMLButtonElement).style.borderColor = W.borderSubtle;
                (e.currentTarget as HTMLButtonElement).style.color = W.text3;
              }}
            >
              <Icon d={ic} size={15} strokeWidth={1.8} />
            </button>
          ))}
        </div>
      )}

      {/* Navigation List */}
      <nav style={{ flex: 1, overflowY: "auto", padding: "4px 8px" }}>
        {!collapsed && (
          <div
            style={{
              fontSize: 10.5,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: W.text3,
              padding: "8px 8px 4px",
            }}
          >
            Workspace
          </div>
        )}
        {navSections[0].items.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveNav(item.id)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 9,
              padding: collapsed ? "7px 8px" : "6px 10px",
              borderRadius: 6,
              border: "none",
              background: activeNav === item.id ? W.greenBg : "transparent",
              color: activeNav === item.id ? W.green : W.text2,
              cursor: "pointer",
              textAlign: "left",
              fontSize: 13,
              fontWeight: activeNav === item.id ? 500 : 400,
              marginBottom: 1,
              transition: "background 120ms, color 120ms",
            }}
            onMouseEnter={(e) => {
              if (activeNav !== item.id) {
                (e.currentTarget as HTMLButtonElement).style.background = W.surface2;
                (e.currentTarget as HTMLButtonElement).style.color = W.text1;
              }
            }}
            onMouseLeave={(e) => {
              if (activeNav !== item.id) {
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                (e.currentTarget as HTMLButtonElement).style.color = W.text2;
              }
            }}
          >
            <Icon d={item.icon} size={14} strokeWidth={1.7} stroke={activeNav === item.id ? W.green : "currentColor"} />
            {!collapsed && <span style={{ lineHeight: 1.2 }}>{item.label}</span>}
          </button>
        ))}

        {/* Divider */}
        <div style={{ height: 1, background: W.borderSubtle, margin: "8px 4px" }} />

        {/* Bottom items */}
        {[
          { id: "templates", label: "Templates", icon: icons.template },
          { id: "archive", label: "Archive", icon: icons.archive },
          { id: "trash", label: "Trash", icon: icons.trash },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveNav(item.id)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 9,
              padding: collapsed ? "7px 8px" : "6px 10px",
              borderRadius: 6,
              border: "none",
              background: "transparent",
              color: W.text3,
              cursor: "pointer",
              textAlign: "left",
              fontSize: 13,
              marginBottom: 1,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = W.surface2;
              (e.currentTarget as HTMLButtonElement).style.color = W.text2;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              (e.currentTarget as HTMLButtonElement).style.color = W.text3;
            }}
          >
            <Icon d={item.icon} size={14} strokeWidth={1.7} />
            {!collapsed && item.label}
          </button>
        ))}
      </nav>

      {/* Favorites */}
      {!collapsed && (
        <div style={{ borderTop: `1px solid ${W.borderSubtle}`, padding: "8px 8px 12px" }}>
          <button
            onClick={() => setQuestionsOpen((p) => !p)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 10px",
              width: "100%",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: W.text3,
              marginBottom: 2,
            }}
          >
            <Icon d={questionsOpen ? icons.chevronDown : icons.chevronRight} size={11} strokeWidth={2} />
            <span style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Favorites
            </span>
          </button>
          {questionsOpen && (
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {recentPages.map((p) => (
                <button
                  key={p.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "5px 10px",
                    borderRadius: 5,
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    color: W.text2,
                    fontSize: 12.5,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = W.surface2;
                    (e.currentTarget as HTMLButtonElement).style.color = W.text1;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                    (e.currentTarget as HTMLButtonElement).style.color = W.text2;
                  }}
                >
                  <Icon d={p.icon} size={13} stroke={W.text3} strokeWidth={1.7} />
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </aside>
  );
}

// ─── Top Toolbar ────────────────────────────────────────────────────────────

function Toolbar({
  saveStatus,
  syncStatus,
  onSyncClick,
  onFocusMode,
  isSplitView,
  onToggleSplitView,
  onOpenCitation,
  onOpenAi,
  onOpenShortcuts,
  onLockSession,
}: {
  saveStatus: string;
  syncStatus: "synced" | "saving" | "offline" | "conflict";
  onSyncClick: () => void;
  onFocusMode: () => void;
  isSplitView: boolean;
  onToggleSplitView: () => void;
  onOpenCitation: () => void;
  onOpenAi: () => void;
  onOpenShortcuts: () => void;
  onLockSession: () => void;
}) {
  return (
    <div
      style={{
        height: 44,
        display: "flex",
        alignItems: "center",
        borderBottom: `1px solid ${W.border}`,
        padding: "0 20px",
        gap: 6,
        background: W.surface,
        flexShrink: 0,
      }}
    >
      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 4, flex: 1 }}>
        {["Workspace", "Literature Review", "Transformer Models"].map((crumb, i, arr) => (
          <span key={crumb} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <button
              style={{
                fontSize: 12.5,
                color: i === arr.length - 1 ? W.text1 : W.text3,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontWeight: i === arr.length - 1 ? 500 : 400,
                padding: "2px 4px",
                borderRadius: 4,
              }}
              onMouseEnter={(e) => {
                if (i !== arr.length - 1) (e.currentTarget as HTMLButtonElement).style.color = W.text2;
              }}
              onMouseLeave={(e) => {
                if (i !== arr.length - 1) (e.currentTarget as HTMLButtonElement).style.color = W.text3;
              }}
            >
              {crumb}
            </button>
            {i < arr.length - 1 && <Icon d={icons.chevronRight} size={12} stroke={W.text3} strokeWidth={1.8} />}
          </span>
        ))}
      </div>

      {/* Enterprise Cloud Sync indicator */}
      <button
        onClick={onSyncClick}
        title={
          syncStatus === "conflict"
            ? "Version conflict detected! Click to resolve"
            : syncStatus === "offline"
            ? "Offline Mode — local changes cached"
            : "Cloud synced with Postgres cluster"
        }
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "3px 9px",
          borderRadius: 6,
          background:
            syncStatus === "conflict"
              ? W.redBg
              : syncStatus === "offline"
              ? W.surface2
              : W.greenBg,
          border: `1px solid ${
            syncStatus === "conflict"
              ? W.red
              : syncStatus === "offline"
              ? W.border
              : W.greenBorder
          }`,
          cursor: "pointer",
          transition: "all 150ms ease",
        }}
      >
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background:
              syncStatus === "conflict"
                ? W.red
                : syncStatus === "saving"
                ? W.amber
                : syncStatus === "offline"
                ? W.text3
                : W.green,
          }}
        />
        <span
          style={{
            fontSize: 11,
            fontFamily: "monospace",
            fontWeight: 500,
            color:
              syncStatus === "conflict"
                ? W.red
                : syncStatus === "offline"
                ? W.text2
                : W.green,
          }}
        >
          {syncStatus === "conflict"
            ? "⚠ Conflict (Resolve)"
            : syncStatus === "saving"
            ? "Syncing to Cloud…"
            : syncStatus === "offline"
            ? "Offline Mode"
            : "● Synced to Cloud"}
        </span>
      </button>

      <div style={{ width: 1, height: 20, background: W.border, margin: "0 4px" }} />

      {/* Collaborators */}
      <div style={{ display: "flex", alignItems: "center" }}>
        {[
          { initials: "MC", color: "#4A7C9E" },
          { initials: "ER", color: "#6B5A9A" },
          { initials: "JS", color: "#3A6B50" },
        ].map((c, i) => (
          <div
            key={i}
            style={{
              width: 26,
              height: 26,
              borderRadius: "50%",
              background: c.color,
              border: `2px solid ${W.surface}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: i > 0 ? -8 : 0,
              fontSize: 9.5,
              fontWeight: 700,
              color: "white",
              letterSpacing: "0.02em",
            }}
          >
            {c.initials}
          </div>
        ))}
        <span style={{ fontSize: 11.5, color: W.text3, marginLeft: 8 }}>3 collaborators</span>
      </div>

      <div style={{ width: 1, height: 20, background: W.border, margin: "0 4px" }} />

      {/* Actions */}
      {[
        {
          icon: icons.columns,
          label: isSplitView ? "Close Split View (⌘\\)" : "Split-Screen Reader (⌘\\)",
          onClick: onToggleSplitView,
          highlight: isSplitView,
        },
        { icon: icons.quote, label: "Citation Engine (APA/BibTeX)", onClick: onOpenCitation },
        { icon: icons.sparkle, label: "AI Copilot", onClick: onFocusMode },
        { icon: icons.search, label: "Search (⌘K)", onClick: () => window.dispatchEvent(new CustomEvent("open-command-palette")) },
        { icon: icons.help, label: "Shortcuts Map (?)", onClick: onOpenShortcuts },
        { icon: icons.lock, label: "Lock Session (⌘L)", onClick: onLockSession },
        { icon: icons.share, label: "Share", onClick: () => {} },
        { icon: icons.export, label: "Export", onClick: onOpenCitation },
      ].map((action, i) => (
        <Tooltip key={i} text={action.label}>
          <button
            onClick={action.onClick}
            style={{
              width: 30,
              height: 30,
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: action.highlight ? `1px solid ${W.green}` : "none",
              background: action.highlight ? W.greenBg : "transparent",
              cursor: "pointer",
              color: action.highlight ? W.green : W.text2,
              transition: "all 150ms ease",
            }}
            onMouseEnter={(e) => {
              if (!action.highlight) {
                (e.currentTarget as HTMLButtonElement).style.background = W.surface2;
                (e.currentTarget as HTMLButtonElement).style.color = W.text1;
              }
            }}
            onMouseLeave={(e) => {
              if (!action.highlight) {
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                (e.currentTarget as HTMLButtonElement).style.color = W.text2;
              }
            }}
          >
            <Icon d={action.icon} size={15} strokeWidth={1.7} />
          </button>
        </Tooltip>
      ))}
    </div>
  );
}

// ─── Research Blocks ────────────────────────────────────────────────────────

function ResearchBlock({
  type,
  color,
  borderColor,
  bgColor,
  icon,
  title,
  children,
}: {
  type: string;
  color: string;
  borderColor: string;
  bgColor: string;
  icon: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        borderLeft: `3px solid ${color}`,
        background: bgColor,
        borderTop: `1px solid ${borderColor}`,
        borderRight: `1px solid ${borderColor}`,
        borderBottom: `1px solid ${borderColor}`,
        borderRadius: 8,
        padding: "14px 18px",
        marginBottom: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
        <Icon d={icon} size={13} stroke={color} strokeWidth={2} />
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: color,
          }}
        >
          {type}
        </span>
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: W.text1, marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 13.5, lineHeight: 1.65, color: W.text2 }}>{children}</div>
    </div>
  );
}

// ─── Literature Matrix ──────────────────────────────────────────────────────

const matrixRows = [
  {
    paper: "Foundation Models for Medical Imaging",
    year: "2025",
    method: "Vision Transformer",
    dataset: "MIMIC-CXR",
    result: "Strong zero-shot",
    limitation: "High compute",
    relevance: "High",
    doi: "10.xxxx/001",
  },
  {
    paper: "Self-Supervised Learning for Clinical Vision",
    year: "2024",
    method: "MAE + ViT-B",
    dataset: "CheXpert",
    result: "91.2% AUC",
    limitation: "Domain shift",
    relevance: "High",
    doi: "10.xxxx/002",
  },
  {
    paper: "Efficient Vision Transformers for Radiology",
    year: "2024",
    method: "EfficientViT",
    dataset: "PadChest",
    result: "88.7% acc.",
    limitation: "Limited classes",
    relevance: "Medium",
    doi: "10.xxxx/003",
  },
  {
    paper: "Low-data Segmentation with Transformers",
    year: "2023",
    method: "SAM + LoRA",
    dataset: "ACDC",
    result: "Dice 0.87",
    limitation: "Single organ",
    relevance: "High",
    doi: "10.xxxx/004",
  },
  {
    paper: "Lightweight ViT for Clinical Settings",
    year: "2023",
    method: "MobileViT",
    dataset: "Private",
    result: "85% acc.",
    limitation: "Not public",
    relevance: "Medium",
    doi: "10.xxxx/005",
  },
];

function RelevancePill({ level }: { level: string }) {
  const colors: Record<string, { bg: string; color: string }> = {
    High: { bg: W.greenBg, color: W.green },
    Medium: { bg: W.amberBg, color: W.amber },
    Low: { bg: W.surface2, color: W.text3 },
  };
  const c = colors[level] || colors.Low;
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 600,
        padding: "2px 8px",
        borderRadius: 4,
        background: c.bg,
        color: c.color,
      }}
    >
      {level}
    </span>
  );
}

function LiteratureMatrix({
  selectedRows,
  setSelectedRows,
  onContextMenu,
}: {
  selectedRows: number[];
  setSelectedRows: React.Dispatch<React.SetStateAction<number[]>>;
  onContextMenu?: (e: React.MouseEvent, row: any) => void;
}) {
  const cols = ["Paper", "Year", "Method", "Dataset", "Result", "Limitation", "Relevance"];
  const allSelected = selectedRows.length === matrixRows.length && matrixRows.length > 0;

  return (
    <div style={{ border: `1px solid ${W.border}`, borderRadius: 10, overflow: "hidden", marginBottom: 20 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px 10px",
          borderBottom: `1px solid ${W.borderSubtle}`,
          background: W.surface,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: W.text1, letterSpacing: "0.01em" }}>
            Literature Matrix
          </span>
          {selectedRows.length > 0 && (
            <span style={{ fontSize: 11, fontFamily: "monospace", padding: "1px 6px", borderRadius: 4, background: W.greenBg, color: W.green, fontWeight: 600 }}>
              {selectedRows.length} selected
            </span>
          )}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {["Sort", "Filter", "Add Paper"].map((label) => (
            <button
              key={label}
              style={{
                fontSize: 11.5,
                padding: "4px 10px",
                borderRadius: 5,
                border: `1px solid ${W.border}`,
                background: W.surface,
                cursor: "pointer",
                color: W.text2,
                fontWeight: 500,
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = W.surface2)}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = W.surface)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
          <thead>
            <tr style={{ background: W.surface2 }}>
              <th style={{ width: 32, padding: "8px 12px" }}>
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={() => {
                    if (allSelected) {
                      setSelectedRows([]);
                    } else {
                      setSelectedRows(matrixRows.map((_, i) => i));
                    }
                  }}
                  style={{ width: 13, height: 13, accentColor: W.green, cursor: "pointer" }}
                />
              </th>
              {cols.map((col) => (
                <th
                  key={col}
                  style={{
                    padding: "8px 14px",
                    textAlign: "left",
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    color: W.text3,
                    borderBottom: `1px solid ${W.border}`,
                    whiteSpace: "nowrap",
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrixRows.map((row, i) => {
              const isSelected = selectedRows.includes(i);
              return (
                <tr
                  key={i}
                  onContextMenu={(e) => onContextMenu && onContextMenu(e, row)}
                  onClick={() => {
                    setSelectedRows((prev) =>
                      prev.includes(i) ? prev.filter((r) => r !== i) : [...prev, i]
                    );
                  }}
                  style={{
                    cursor: "pointer",
                    background: isSelected ? W.greenBg : i % 2 === 0 ? W.surface : "#FAFAF8",
                    borderBottom: `1px solid ${W.borderSubtle}`,
                    transition: "background 150ms",
                  }}
                >
                  <td style={{ padding: "10px 12px" }} onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {
                        setSelectedRows((prev) =>
                          prev.includes(i) ? prev.filter((r) => r !== i) : [...prev, i]
                        );
                      }}
                      style={{ width: 13, height: 13, accentColor: W.green, cursor: "pointer" }}
                    />
                  </td>
                  <td style={{ padding: "10px 14px", color: W.text1, fontWeight: 500, maxWidth: 200 }}>
                    <Link
                      href="/reader"
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        color: "inherit",
                        textDecoration: "none",
                        display: "block",
                      }}
                      title="Open in Reader"
                    >
                      {row.paper}
                    </Link>
                    <div style={{ fontSize: 11, color: W.text3, marginTop: 2, fontFamily: "monospace" }}>{row.doi}</div>
                  </td>
                  <td style={{ padding: "10px 14px", color: W.text2, fontFamily: "monospace" }}>{row.year}</td>
                  <td style={{ padding: "10px 14px", color: W.text2 }}>{row.method}</td>
                  <td style={{ padding: "10px 14px", color: W.text2 }}>{row.dataset}</td>
                  <td style={{ padding: "10px 14px", fontWeight: 500, color: W.greenDim }}>{row.result}</td>
                  <td style={{ padding: "10px 14px", color: W.text3, maxWidth: 160 }}>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>
                      {row.limitation}
                    </span>
                  </td>
                  <td style={{ padding: "10px 14px" }}>
                    <RelevancePill level={row.relevance} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Slash Command Menu ─────────────────────────────────────────────────────

const slashItems = [
  {
    group: "Content",
    items: ["Heading", "Paragraph", "Bullet List", "Numbered List", "Quote", "Callout", "Divider", "Code Block", "Equation"],
  },
  {
    group: "Research",
    items: ["Research Question", "Hypothesis", "Research Gap", "Methodology", "Experiment", "Observation", "Result", "Conclusion"],
  },
  {
    group: "Media",
    items: ["Image", "Table", "Chart", "Dataset", "PDF Embed", "Paper Embed"],
  },
  {
    group: "AI",
    items: ["AI Summary", "AI Research Gap", "AI Outline"],
  },
];

function SlashMenu({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const flat = slashItems.flatMap((g) => g.items.map((item) => ({ item, group: g.group })));
  const filtered = q ? flat.filter(({ item }) => item.toLowerCase().includes(q.toLowerCase())) : null;

  return (
    <div
      style={{
        position: "absolute",
        top: 40,
        left: 20,
        width: 280,
        background: W.surface,
        border: `1px solid ${W.border}`,
        borderRadius: 10,
        boxShadow: "0 8px 32px rgba(26,25,23,0.12)",
        zIndex: 50,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "10px 12px",
          borderBottom: `1px solid ${W.borderSubtle}`,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <Icon d={icons.search} size={13} stroke={W.text3} strokeWidth={1.8} />
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search blocks…"
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            fontSize: 13,
            color: W.text1,
            background: "transparent",
            fontFamily: "inherit",
          }}
        />
        <button
          onClick={onClose}
          style={{ color: W.text3, background: "transparent", border: "none", cursor: "pointer" }}
        >
          <Icon d={icons.x} size={13} />
        </button>
      </div>
      <div style={{ maxHeight: 320, overflowY: "auto", padding: "6px 0" }}>
        {(filtered ? [{ group: "Results", items: filtered.map((f) => f.item) }] : slashItems).map((section) => (
          <div key={section.group}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: W.text3,
                padding: "8px 14px 4px",
              }}
            >
              {section.group}
            </div>
            {section.items.map((item: string) => (
              <button
                key={item}
                onClick={onClose}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "7px 14px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  fontSize: 13,
                  color: W.text1,
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = W.surface2)}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "transparent")}
              >
                {item}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Center Editor ──────────────────────────────────────────────────────────

function Editor({
  saveStatus,
  setSaveStatus,
  selectedRows,
  setSelectedRows,
  onOpenCitation,
  onContextMenu,
}: {
  saveStatus: string;
  setSaveStatus: (s: string) => void;
  selectedRows: number[];
  setSelectedRows: React.Dispatch<React.SetStateAction<number[]>>;
  onOpenCitation: (cite?: any) => void;
  onContextMenu?: (e: React.MouseEvent, item: any) => void;
}) {
  const [slashOpen, setSlashOpen] = useState(false);

  const triggerSave = () => {
    setSaveStatus("Saving…");
    setTimeout(() => setSaveStatus("Saved"), 900);
  };

  return (
    <div style={{ flex: 1, overflowY: "auto", background: W.bg, height: "100%" }}>
      <div style={{ maxWidth: 840, margin: "0 auto", padding: "40px 40px 80px" }}>
        {/* Page Metadata */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <span
            style={{
              fontSize: 11,
              color: W.text3,
              background: W.surface2,
              padding: "2px 8px",
              borderRadius: 4,
              fontWeight: 500,
            }}
          >
            Literature Review
          </span>
          <span style={{ fontSize: 11, color: W.text3 }}>·</span>
          <span style={{ fontSize: 11, color: W.text3 }}>Last edited 8 minutes ago</span>
        </div>

        {/* Page Title */}
        <h1
          contentEditable
          suppressContentEditableWarning
          onInput={triggerSave}
          style={{
            fontSize: 34,
            fontWeight: 600,
            lineHeight: 1.2,
            color: W.text1,
            marginBottom: 20,
            outline: "none",
            cursor: "text",
            letterSpacing: "-0.01em",
            fontFamily: "'Source Serif 4', Georgia, serif",
          }}
        >
          Transformer Models for Medical Imaging
        </h1>

        {/* Research Blocks */}
        <div style={{ marginBottom: 28 }}>
          <ResearchBlock
            type="Research Question"
            color={W.blue}
            borderColor={W.blueBorder}
            bgColor={W.blueBg}
            icon={icons.lightbulb}
            title="How can transformer-based segmentation models maintain performance when labeled medical imaging datasets are limited?"
          >
            Addressing the challenge of data scarcity in clinical imaging environments, particularly in low-resource settings
            where annotation is both expensive and time-consuming.
          </ResearchBlock>

          <ResearchBlock
            type="Research Gap"
            color={W.red}
            borderColor="#F0CCC8"
            bgColor={W.redBg}
            icon={icons.zap}
            title="Dependency on large annotated datasets in clinical environments"
          >
            Existing medical imaging foundation models often depend on large annotated datasets that are difficult to obtain
            in low-resource clinical environments. Current self-supervised approaches have not been systematically evaluated
            under extreme label scarcity (&lt;10 labeled samples per class).
          </ResearchBlock>

          <ResearchBlock
            type="Hypothesis"
            color={W.purple}
            borderColor="#D8CCEA"
            bgColor={W.purpleBg}
            icon={icons.target}
            title="Lightweight transformers + self-supervised pretraining ≈ competitive segmentation with minimal labels"
          >
            Lightweight transformer architectures combined with self-supervised pretraining can achieve competitive
            segmentation performance with significantly less labeled training data — specifically, within 5% of fully
            supervised baselines using only 50 labeled examples.
          </ResearchBlock>

          <ResearchBlock
            type="Research Objective"
            color={W.green}
            borderColor={W.greenBorder}
            bgColor={W.greenBg}
            icon={icons.check}
            title="Evaluate lightweight transformer architectures under low-data conditions"
          >
            Systematically benchmark MobileViT, EfficientViT, and TinyViT variants against ViT-B and ResNet-50 baselines
            across three medical imaging segmentation tasks using progressively reduced labeled subsets (100%, 50%, 10%, 5%, 1%).
          </ResearchBlock>
        </div>

        {/* Section Heading: Literature Matrix */}
        <h2
          style={{
            fontSize: 20,
            fontWeight: 600,
            color: W.text1,
            marginBottom: 14,
            letterSpacing: "-0.01em",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          Literature Matrix
          <span style={{ fontSize: 12, fontWeight: 500, color: W.text3, letterSpacing: 0 }}>5 papers</span>
        </h2>

        <LiteratureMatrix
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          onContextMenu={onContextMenu}
        />

        {/* Section Heading: Key Citations */}
        <h2
          style={{
            fontSize: 20,
            fontWeight: 600,
            color: W.text1,
            marginBottom: 14,
            letterSpacing: "-0.01em",
          }}
        >
          Key Citations
        </h2>

        {/* Citations List */}
        <div style={{ marginBottom: 28 }}>
          {[
            {
              ref: "[12]",
              authors: "Zhang et al., 2025",
              title: "Foundation Models for Clinical Imaging",
              journal: "Nature Machine Intelligence",
              doi: "10.1038/s42256-025-0012-x",
              tags: ["Transformer", "Medical Imaging"],
            },
            {
              ref: "[7]",
              authors: "Imthiyas et al., 2024",
              title: "Self-Supervised ViT for Radiology: A Large-Scale Study",
              journal: "MICCAI 2024",
              doi: "10.1007/978-3-031-xxxx",
              tags: ["Self-Supervised", "ViT"],
            },
            {
              ref: "[3]",
              authors: "Kirillov et al., 2023",
              title: "Segment Anything",
              journal: "ICCV 2023",
              doi: "10.1109/ICCV.2023.xxxx",
              tags: ["SAM", "Foundation Model"],
            },
          ].map((cite, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 14,
                padding: "12px 0",
                borderBottom: `1px solid ${W.borderSubtle}`,
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  fontFamily: "monospace",
                  color: W.text3,
                  paddingTop: 1,
                  flexShrink: 0,
                  width: 30,
                }}
              >
                {cite.ref}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 500, color: W.text1, marginBottom: 2 }}>{cite.title}</div>
                <div style={{ fontSize: 12.5, color: W.text2, marginBottom: 5 }}>
                  {cite.authors} · <span style={{ fontStyle: "italic" }}>{cite.journal}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 11, color: W.text3, fontFamily: "monospace" }}>DOI {cite.doi}</span>
                  <span style={{ color: W.border }}>·</span>
                  {cite.tags.map((t) => (
                    <span
                      key={t}
                      style={{
                        fontSize: 11,
                        padding: "1px 7px",
                        borderRadius: 4,
                        background: W.surface2,
                        color: W.text2,
                        border: `1px solid ${W.border}`,
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end", flexShrink: 0 }}>
                <button
                  style={{
                    fontSize: 11.5,
                    padding: "3px 10px",
                    borderRadius: 5,
                    border: `1px solid ${W.border}`,
                    background: W.surface,
                    cursor: "pointer",
                    color: W.text2,
                    whiteSpace: "nowrap",
                    fontWeight: 500,
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = W.surface2)}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = W.surface)}
                >
                  Insert citation
                </button>
                <Link
                  href="/reader"
                  style={{
                    fontSize: 11.5,
                    padding: "3px 10px",
                    borderRadius: 5,
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    color: W.text3,
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = W.text2)}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = W.text3)}
                >
                  Open paper
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Methodology Section */}
        <h2
          style={{
            fontSize: 20,
            fontWeight: 600,
            color: W.text1,
            marginBottom: 12,
            letterSpacing: "-0.01em",
          }}
        >
          Methodology Notes
        </h2>

        <div
          contentEditable
          suppressContentEditableWarning
          onInput={triggerSave}
          style={{
            fontSize: 14.5,
            lineHeight: 1.75,
            color: W.text2,
            outline: "none",
            cursor: "text",
            marginBottom: 24,
          }}
        >
          <p style={{ marginBottom: 14 }}>
            Experimental design follows a controlled benchmark protocol across three segmentation datasets: ACDC (cardiac
            MRI), BraTS 2023 (brain tumors), and a private chest CT cohort. Data splits are stratified by center and scanner to
            prevent domain leakage.
          </p>
          <p style={{ marginBottom: 14 }}>
            Each architecture will be pretrained using masked autoencoders (MAE) on an unlabeled corpus of 120,000 radiology
            images sourced from PhysioNet. Fine-tuning experiments will iterate over labeled subsets of &#123;1%, 5%, 10%, 50%,
            100%&#125; using 5-fold cross-validation with fixed seeds.
          </p>
          <p>
            Primary metric: Dice Similarity Coefficient (DSC). Secondary metrics: Hausdorff Distance 95th percentile (HD95),
            inference latency on CPU, and model parameter count. Statistical significance tested via Wilcoxon signed-rank test
            at &alpha; = 0.05.
          </p>
        </div>

        {/* Add Block Button */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setSlashOpen((p) => !p)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 14px",
              borderRadius: 7,
              border: `1px dashed ${W.border}`,
              background: "transparent",
              cursor: "pointer",
              color: W.text3,
              fontSize: 13,
              width: "100%",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = W.surface2;
              (e.currentTarget as HTMLButtonElement).style.color = W.text2;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              (e.currentTarget as HTMLButtonElement).style.color = W.text3;
            }}
          >
            <Icon d={icons.plus} size={14} strokeWidth={1.8} />
            <span>
              Type{" "}
              <kbd
                style={{
                  fontFamily: "monospace",
                  fontSize: 11,
                  padding: "1px 5px",
                  borderRadius: 4,
                  background: W.surface,
                  border: `1px solid ${W.border}`,
                }}
              >
                /
              </kbd>{" "}
              to add a block
            </span>
          </button>
          {slashOpen && <SlashMenu onClose={() => setSlashOpen(false)} />}
        </div>
      </div>
    </div>
  );
}

// ─── Right Panel ────────────────────────────────────────────────────────────

const rightTabs = [
  { id: "ai", label: "AI", icon: icons.sparkle },
  { id: "graph", label: "Graph", icon: icons.network },
  { id: "related", label: "Related", icon: icons.link },
  { id: "tasks", label: "Tasks", icon: icons.task },
  { id: "activity", label: "Activity", icon: icons.activity },
];

function KnowledgeGraph() {
  const nodes = [
    { id: "transformers", label: "Transformer\nModels", x: 120, y: 60, color: W.blue, type: "topic" },
    { id: "medical", label: "Medical\nImaging", x: 200, y: 130, color: W.green, type: "topic" },
    { id: "lowdata", label: "Low-resource\nDatasets", x: 90, y: 180, color: W.amber, type: "gap" },
    { id: "seg", label: "Segmentation", x: 220, y: 210, color: W.purple, type: "method" },
    { id: "sam", label: "SAM", x: 60, y: 120, color: W.blue, type: "paper" },
    { id: "ssl", label: "Self-Supervised\nLearning", x: 185, y: 50, color: W.green, type: "method" },
  ];
  const edges = [
    ["transformers", "medical"],
    ["transformers", "sam"],
    ["medical", "lowdata"],
    ["medical", "seg"],
    ["lowdata", "seg"],
    ["ssl", "transformers"],
  ];
  const [hovered, setHovered] = useState<string | null>(null);

  const getPos = (id: string) => nodes.find((n) => n.id === id) || nodes[0];

  return (
    <div
      style={{
        position: "relative",
        height: 270,
        borderRadius: 8,
        background: W.surface,
        border: `1px solid ${W.border}`,
        overflow: "hidden",
      }}
    >
      <svg width="100%" height="100%" viewBox="0 0 280 270">
        <defs>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3A6B50" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#3A6B50" stopOpacity="0" />
          </radialGradient>
        </defs>
        {edges.map(([a, b], i) => {
          const pa = getPos(a);
          const pb = getPos(b);
          const active = hovered === a || hovered === b;
          return (
            <line
              key={i}
              x1={pa.x}
              y1={pa.y}
              x2={pb.x}
              y2={pb.y}
              stroke={active ? W.green : W.border}
              strokeWidth={active ? 1.5 : 1}
              strokeDasharray={active ? undefined : "3 3"}
              style={{ transition: "stroke 200ms, stroke-width 200ms" }}
            />
          );
        })}
        {nodes.map((node) => (
          <g
            key={node.id}
            onMouseEnter={() => setHovered(node.id)}
            onMouseLeave={() => setHovered(null)}
            style={{ cursor: "pointer" }}
          >
            <circle
              cx={node.x}
              cy={node.y}
              r={hovered === node.id ? 26 : 20}
              fill="url(#glow)"
              style={{ transition: "r 200ms" }}
            />
            <circle
              cx={node.x}
              cy={node.y}
              r={hovered === node.id ? 8 : 6}
              fill={hovered === node.id ? node.color : W.surface}
              stroke={node.color}
              strokeWidth={1.5}
              style={{ transition: "r 200ms, fill 200ms" }}
            />
            {node.label.split("\n").map((line, li) => (
              <text
                key={li}
                x={node.x}
                y={node.y + 16 + li * 11}
                textAnchor="middle"
                fontSize={9.5}
                fill={hovered === node.id ? W.text1 : W.text3}
                fontFamily="inherit"
                style={{ transition: "fill 200ms", pointerEvents: "none" }}
              >
                {line}
              </text>
            ))}
          </g>
        ))}
      </svg>
    </div>
  );
}

const initialTasks = [
  { id: 1, label: "Literature Review", done: true, priority: "high", deadline: "Done" },
  { id: 2, label: "Write Abstract", done: false, priority: "high", deadline: "Aug 15" },
  { id: 3, label: "Review Dataset", done: false, priority: "med", deadline: "Aug 18" },
  { id: 4, label: "Prepare Figures", done: false, priority: "med", deadline: "Aug 22" },
  { id: 5, label: "Add Missing Citations", done: false, priority: "low", deadline: "Aug 25" },
  { id: 6, label: "Submit Paper", done: false, priority: "high", deadline: "Sep 1" },
];

function RightPanel({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (id: string) => void;
}) {
  const [tasks, setTasks] = useState(initialTasks);
  const [aiDismissed, setAiDismissed] = useState(false);

  const toggleTask = (id: number) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const priorityColor: Record<string, string> = { high: W.red, med: W.amber, low: W.text3 };

  return (
    <aside
      style={{
        width: 345,
        minWidth: 345,
        background: W.surface,
        borderLeft: `1px solid ${W.border}`,
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        height: "100%",
      }}
    >
      {/* Tabs */}
      <div
        style={{
          display: "flex",
          borderBottom: `1px solid ${W.border}`,
          padding: "0 8px",
          overflowX: "auto",
          flexShrink: 0,
        }}
      >
        {rightTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "10px 8px",
              background: "transparent",
              border: "none",
              borderBottom: activeTab === tab.id ? `2px solid ${W.green}` : "2px solid transparent",
              cursor: "pointer",
              color: activeTab === tab.id ? W.text1 : W.text3,
              fontSize: 12,
              fontWeight: activeTab === tab.id ? 600 : 400,
              whiteSpace: "nowrap",
              transition: "color 150ms",
            }}
          >
            <Icon d={tab.icon} size={13} strokeWidth={activeTab === tab.id ? 2 : 1.7} />
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
        {/* AI Panel */}
        {activeTab === "ai" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: W.greenBg,
                  border: `1px solid ${W.greenBorder}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon d={icons.sparkle} size={14} stroke={W.green} strokeWidth={1.8} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: W.text1 }}>Research Copilot</div>
                <div style={{ fontSize: 11, color: W.text3 }}>This workspace</div>
              </div>
            </div>

            {!aiDismissed && (
              <div
                style={{
                  background: W.greenBg,
                  border: `1px solid ${W.greenBorder}`,
                  borderRadius: 8,
                  padding: "12px 14px",
                  marginBottom: 14,
                }}
              >
                <p style={{ fontSize: 13, lineHeight: 1.6, color: W.text1, marginBottom: 10 }}>
                  You&apos;ve identified a gap around low-resource clinical datasets. I found{" "}
                  <strong>4 related papers</strong> in your workspace that discuss dataset scarcity.
                </p>
                <p style={{ fontSize: 12.5, color: W.text2, marginBottom: 12 }}>
                  Would you like me to compare their methodologies?
                </p>
                <div style={{ display: "flex", gap: 6 }}>
                  {["Compare papers", "Show sources"].map((label) => (
                    <button
                      key={label}
                      style={{
                        flex: 1,
                        fontSize: 12,
                        padding: "6px 0",
                        borderRadius: 6,
                        border: `1px solid ${W.greenBorder}`,
                        background: W.surface,
                        cursor: "pointer",
                        color: W.green,
                        fontWeight: 500,
                      }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#FFFFFF")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = W.surface)}
                    >
                      {label}
                    </button>
                  ))}
                  <button
                    onClick={() => setAiDismissed(true)}
                    title="Dismiss"
                    style={{
                      width: 30,
                      borderRadius: 6,
                      border: `1px solid ${W.border}`,
                      background: W.surface,
                      cursor: "pointer",
                      color: W.text3,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon d={icons.x} size={12} />
                  </button>
                </div>
              </div>
            )}

            <div style={{ marginBottom: 8 }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  color: W.text3,
                  marginBottom: 8,
                }}
              >
                Actions
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {[
                  "Summarize this page",
                  "Find related papers",
                  "Suggest citations",
                  "Find research gaps",
                  "Generate outline",
                  "Improve writing",
                  "Check methodology",
                  "Suggest journals",
                ].map((action) => (
                  <button
                    key={action}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 9,
                      padding: "7px 10px",
                      borderRadius: 6,
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                      fontSize: 13,
                      color: W.text2,
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = W.surface2;
                      (e.currentTarget as HTMLButtonElement).style.color = W.text1;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                      (e.currentTarget as HTMLButtonElement).style.color = W.text2;
                    }}
                  >
                    <Icon d={icons.zap} size={12} stroke={W.text3} strokeWidth={1.8} />
                    {action}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 16 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 12px",
                  borderRadius: 7,
                  border: `1px solid ${W.border}`,
                  background: W.surface2,
                }}
              >
                <input
                  placeholder="Ask about this workspace…"
                  style={{
                    flex: 1,
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    fontSize: 13,
                    color: W.text1,
                    fontFamily: "inherit",
                  }}
                />
                <button
                  aria-label="Send"
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 5,
                    background: W.green,
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon d={icons.chevronRight} size={13} stroke="white" strokeWidth={2.2} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Knowledge Graph */}
        {activeTab === "graph" && (
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: W.text1, marginBottom: 4 }}>Knowledge Graph</div>
            <div style={{ fontSize: 12, color: W.text3, marginBottom: 12 }}>Connected concepts in this workspace</div>
            <KnowledgeGraph />
            <div style={{ marginTop: 12 }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  color: W.text3,
                  marginBottom: 8,
                }}
              >
                Node Types
              </div>
              {[
                { label: "Topic", color: W.blue },
                { label: "Research Gap", color: W.amber },
                { label: "Method", color: W.purple },
                { label: "Paper", color: W.blue },
              ].map(({ label, color }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
                  <span style={{ fontSize: 12.5, color: W.text2 }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Knowledge */}
        {activeTab === "related" && (
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: W.text1, marginBottom: 14 }}>Related Knowledge</div>
            {[
              {
                label: "Related papers",
                count: 4,
                color: W.blue,
                icon: icons.file,
                items: [
                  "Foundation Models for Medical Imaging",
                  "Self-Supervised Learning for Clinical Vision",
                  "Efficient Vision Transformers",
                  "Low-data Segmentation",
                ],
              },
              {
                label: "Related notes",
                count: 7,
                color: W.green,
                icon: icons.comment,
                items: [
                  "Meeting with Advisor — Dataset review",
                  "Segmentation notes draft",
                  "Reading: Kirillov SAM paper",
                ],
              },
              {
                label: "Related projects",
                count: 2,
                color: W.amber,
                icon: icons.folder,
                items: ["Clinical AI Benchmarks", "Low-resource Learning Initiative"],
              },
            ].map((section) => (
              <div key={section.label} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
                  <Icon d={section.icon} size={13} stroke={section.color} strokeWidth={1.8} />
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: W.text1 }}>{section.label}</span>
                  <span
                    style={{
                      marginLeft: "auto",
                      fontSize: 11,
                      color: W.text3,
                      background: W.surface2,
                      padding: "1px 7px",
                      borderRadius: 10,
                      fontFamily: "monospace",
                    }}
                  >
                    {section.count}
                  </span>
                </div>
                {section.items.map((item) => (
                  <button
                    key={item}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "6px 10px",
                      borderRadius: 5,
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                      fontSize: 12.5,
                      color: W.text2,
                      marginBottom: 1,
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = W.surface2;
                      (e.currentTarget as HTMLButtonElement).style.color = W.text1;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                      (e.currentTarget as HTMLButtonElement).style.color = W.text2;
                    }}
                  >
                    <div style={{ width: 4, height: 4, borderRadius: "50%", background: section.color, flexShrink: 0 }} />
                    {item}
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Tasks */}
        {activeTab === "tasks" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: W.text1 }}>Research Tasks</div>
              <button
                style={{
                  fontSize: 12,
                  color: W.green,
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <Icon d={icons.plus} size={13} stroke={W.green} strokeWidth={2} />
                Add
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px 10px",
                    borderRadius: 7,
                    border: "1px solid transparent",
                    cursor: "pointer",
                    background: "transparent",
                    transition: "all 120ms",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background = W.surface2;
                    (e.currentTarget as HTMLDivElement).style.borderColor = W.border;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background = "transparent";
                    (e.currentTarget as HTMLDivElement).style.borderColor = "transparent";
                  }}
                >
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() => {}}
                    style={{ width: 14, height: 14, accentColor: W.green, cursor: "pointer", flexShrink: 0 }}
                  />
                  <span
                    style={{
                      flex: 1,
                      fontSize: 13,
                      color: task.done ? W.text3 : W.text1,
                      textDecoration: task.done ? "line-through" : "none",
                    }}
                  >
                    {task.label}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: priorityColor[task.priority] }} />
                    <span style={{ fontSize: 11, color: W.text3, fontFamily: "monospace" }}>{task.deadline}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12, padding: "8px 0", borderTop: `1px solid ${W.borderSubtle}` }}>
              <span style={{ fontSize: 12, color: W.text3 }}>
                {tasks.filter((t) => t.done).length} of {tasks.length} completed
              </span>
            </div>
          </div>
        )}

        {/* Activity */}
        {activeTab === "activity" && (
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: W.text1, marginBottom: 14 }}>Activity</div>

            {/* Comment Card */}
            <div
              style={{
                background: W.surface2,
                borderRadius: 8,
                padding: "12px 14px",
                marginBottom: 16,
                border: `1px solid ${W.borderSubtle}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    background: "#6B5A9A",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    fontWeight: 700,
                    color: "white",
                  }}
                >
                  ER
                </div>
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: W.text1 }}>Elena Rodriguez</div>
                  <div style={{ fontSize: 11, color: W.text3 }}>2 hours ago</div>
                </div>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.55, color: W.text2, marginBottom: 10 }}>
                &ldquo;Could we compare this against the baseline model from Zhang et al.? Their MIMIC-CXR results seem
                directly comparable.&rdquo;
              </p>
              <div style={{ display: "flex", gap: 6 }}>
                {["Reply", "Resolve"].map((label) => (
                  <button
                    key={label}
                    style={{
                      fontSize: 11.5,
                      padding: "4px 10px",
                      borderRadius: 5,
                      border: `1px solid ${W.border}`,
                      background: W.surface,
                      cursor: "pointer",
                      color: W.text2,
                      fontWeight: 500,
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#FFFFFF")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = W.surface)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Version History Timeline */}
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                color: W.text3,
                marginBottom: 10,
              }}
            >
              Version History
            </div>
            {[
              { time: "Yesterday", label: "Added Experiment Notes", initials: "JS", color: "#3A6B50" },
              { time: "Today 09:14", label: "Updated Literature Review", initials: "MC", color: "#4A7C9E" },
              { time: "Today 10:32", label: "Added 3 Citations", initials: "ER", color: "#6B5A9A" },
              { time: "Today 11:04", label: "AI Generated Summary", initials: "✦", color: "#3A6B50" },
              { time: "Today 11:27", label: "Edited Research Gap", initials: "MC", color: "#4A7C9E" },
            ].map((v, i) => (
              <div key={i} style={{ display: "flex", gap: 10, paddingBottom: 12, position: "relative" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      background: v.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: v.initials === "✦" ? 11 : 9,
                      fontWeight: 700,
                      color: "white",
                      flexShrink: 0,
                    }}
                  >
                    {v.initials}
                  </div>
                  {i < 4 && <div style={{ width: 1, flex: 1, minHeight: 8, background: W.border, marginTop: 3 }} />}
                </div>
                <div style={{ paddingTop: 2 }}>
                  <div style={{ fontSize: 12.5, color: W.text1, fontWeight: 500 }}>{v.label}</div>
                  <div style={{ fontSize: 11, color: W.text3, fontFamily: "monospace", marginTop: 1 }}>{v.time}</div>
                </div>
                <button
                  style={{
                    marginLeft: "auto",
                    fontSize: 11,
                    color: W.text3,
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    paddingTop: 2,
                    alignSelf: "flex-start",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = W.text2)}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = W.text3)}
                >
                  View
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}

// ─── Main Workspace Screen ──────────────────────────────────────────────────

export default function WorkspacePage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeNav, setActiveNav] = useState("literature");
  const [activeTab, setActiveTab] = useState("ai");
  const [saveStatus, setSaveStatus] = useState("Saved");
  const [syncStatus, setSyncStatus] = useState<"synced" | "saving" | "offline" | "conflict">("synced");
  const [rightVisible, setRightVisible] = useState(true);
  const [isSplitView, setIsSplitView] = useState(false);

  // Modals state
  const [showCitationModal, setShowCitationModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [showLockModal, setShowLockModal] = useState(false);
  const [selectedCitationItem, setSelectedCitationItem] = useState<CitationItem | undefined>(undefined);

  // Multi-select & context menu state
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [contextMenu, setContextMenu] = useState<{ visible: boolean; x: number; y: number; item: any } | null>(null);

  const { toast } = useToast();

  // Periodic simulated auto-save & sync
  useEffect(() => {
    const interval = setInterval(() => {
      setSaveStatus("Saving…");
      setSyncStatus("saving");
      setTimeout(() => {
        setSaveStatus("Saved");
        setSyncStatus("synced");
      }, 800);
    }, 45000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard shortcuts listener: ⌘\ for split view, ⌘L for lock, ? for shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "\\") {
        e.preventDefault();
        setIsSplitView((p) => !p);
      }
      if ((e.metaKey || e.ctrlKey) && (e.key === "l" || e.key === "L")) {
        e.preventDefault();
        setShowLockModal(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close context menu on global click
  useEffect(() => {
    const handleDocClick = () => setContextMenu(null);
    window.addEventListener("click", handleDocClick);
    return () => window.removeEventListener("click", handleDocClick);
  }, []);

  const handleSyncClick = () => {
    if (syncStatus === "conflict") {
      setShowConflictModal(true);
    } else {
      setSyncStatus("saving");
      toast({
        title: "Syncing Workspace",
        description: "Checking parity with remote Postgres lab replica...",
      });
      setTimeout(() => {
        setSyncStatus("synced");
        toast({
          title: "Parity Established",
          description: "All notebooks, matrices and vector weights up to date.",
          variant: "success",
        });
      }, 700);
    }
  };

  const handleContextMenu = (e: React.MouseEvent, item: any) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: Math.min(e.clientX, window.innerWidth - 240),
      y: Math.min(e.clientY, window.innerHeight - 200),
      item,
    });
  };

  return (
    <div className="flex flex-1 h-screen max-h-screen overflow-hidden bg-canvas font-sans relative">
      {/* ── Left Sidebar (240px or 52px) ── */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((p) => !p)}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
      />

      {/* ── Center + Right Container ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        {/* ── Top Toolbar (44px) ── */}
        <Toolbar
          saveStatus={saveStatus}
          syncStatus={syncStatus}
          onSyncClick={handleSyncClick}
          onFocusMode={() => setRightVisible((p) => !p)}
          isSplitView={isSplitView}
          onToggleSplitView={() => setIsSplitView((p) => !p)}
          onOpenCitation={() => setShowCitationModal(true)}
          onOpenAi={() => setShowAiModal(true)}
          onOpenShortcuts={() => window.dispatchEvent(new CustomEvent("open-shortcuts-modal"))}
          onLockSession={() => setShowLockModal(true)}
        />

        {/* ── Main Area (Editor + Split-View Reader or Right Panel) ── */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>
          {/* Main Notebook / Editor */}
          <div style={{ flex: isSplitView ? "1 1 50%" : "1 1 100%", overflowY: "auto", height: "100%", transition: "flex 200ms ease" }}>
            <Editor
              saveStatus={saveStatus}
              setSaveStatus={setSaveStatus}
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
              onOpenCitation={(cite) => {
                setSelectedCitationItem(cite);
                setShowCitationModal(true);
              }}
              onContextMenu={handleContextMenu}
            />
          </div>

          {/* Split-Screen Dual Reader View */}
          {isSplitView && (
            <div
              style={{
                flex: "1 1 50%",
                height: "100%",
                borderLeft: `1px solid ${W.border}`,
                background: W.surface,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                boxShadow: "-4px 0 20px rgba(0,0,0,0.03)",
              }}
            >
              <SplitPaneReader
                onClose={() => setIsSplitView(false)}
                onOpenCitation={() => setShowCitationModal(true)}
                onOpenAi={() => setShowAiModal(true)}
              />
            </div>
          )}

          {/* Standard Right AI & Graph Rail (when split view is inactive) */}
          {rightVisible && !isSplitView && (
            <RightPanel activeTab={activeTab} setActiveTab={setActiveTab} />
          )}
        </div>
      </div>

      {/* ── Multi-Select Floating Action Bar ── */}
      {selectedRows.length > 0 && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "8px 18px",
            background: "#202920",
            color: "#FAF7F0",
            borderRadius: 14,
            boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
            border: "1px solid rgba(228, 220, 203, 0.2)",
            animation: "fade-in 150ms ease",
          }}
        >
          <span style={{ fontSize: 12, fontFamily: "monospace", fontWeight: 600, color: "#DCE6D7" }}>
            {selectedRows.length} paper{selectedRows.length === 1 ? "" : "s"} selected
          </span>
          <div style={{ width: 1, height: 16, background: "rgba(255,255,255,0.2)" }} />
          <button
            onClick={() => setShowCitationModal(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 10px",
              borderRadius: 6,
              background: "rgba(255,255,255,0.1)",
              border: "none",
              color: "#FAF7F0",
              fontSize: 12,
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            <Icon d={icons.quote} size={13} stroke="#DCE6D7" />
            Format Citations
          </button>
          <button
            onClick={() => setShowAiModal(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 10px",
              borderRadius: 6,
              background: "#3E6248",
              border: "none",
              color: "#FAF7F0",
              fontSize: 12,
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            <Icon d={icons.sparkle} size={13} stroke="#FAF7F0" />
            Batch AI Synthesis
          </button>
          <button
            onClick={() => {
              toast({
                title: "Exported Selected Records",
                description: `Compiled ${selectedRows.length} citations into .bib bundle.`,
                variant: "success",
              });
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 10px",
              borderRadius: 6,
              background: "rgba(255,255,255,0.1)",
              border: "none",
              color: "#FAF7F0",
              fontSize: 12,
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            <Icon d={icons.export} size={13} stroke="#FAF7F0" />
            Export BibTeX
          </button>
          <button
            onClick={() => setSelectedRows([])}
            style={{
              background: "transparent",
              border: "none",
              color: "#85877B",
              cursor: "pointer",
              padding: 2,
              display: "flex",
              alignItems: "center",
            }}
            title="Deselect All"
          >
            <Icon d={icons.x} size={14} />
          </button>
        </div>
      )}

      {/* ── Context Menu (Right-Click) ── */}
      {contextMenu && (
        <div
          style={{
            position: "fixed",
            top: contextMenu.y,
            left: contextMenu.x,
            zIndex: 1000,
            width: 220,
            background: W.surface,
            border: `1px solid ${W.border}`,
            borderRadius: 8,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            padding: 4,
            fontSize: 12.5,
            fontFamily: "inherit",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ padding: "6px 10px", borderBottom: `1px solid ${W.borderSubtle}`, color: W.text3, fontSize: 11, fontWeight: 600 }}>
            {contextMenu.item?.paper || "Research Artifact"}
          </div>
          <button
            onClick={() => {
              setIsSplitView(true);
              setContextMenu(null);
            }}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 10px",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: W.text1,
              borderRadius: 5,
              textAlign: "left",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = W.surface2)}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "transparent")}
          >
            <Icon d={icons.columns} size={14} stroke={W.green} />
            Open in Split View
          </button>
          <button
            onClick={() => {
              setShowCitationModal(true);
              setContextMenu(null);
            }}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 10px",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: W.text1,
              borderRadius: 5,
              textAlign: "left",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = W.surface2)}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "transparent")}
          >
            <Icon d={icons.quote} size={14} stroke={W.green} />
            Format Citation (APA/BibTeX)
          </button>
          <button
            onClick={() => {
              setShowAiModal(true);
              setContextMenu(null);
            }}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 10px",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: W.text1,
              borderRadius: 5,
              textAlign: "left",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = W.surface2)}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "transparent")}
          >
            <Icon d={icons.sparkle} size={14} stroke={W.green} />
            Run AI Synthesis
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText("https://doi.org/10.48550/arXiv.1706.03762");
              toast({ title: "DOI Copied", description: "Persistent identifier copied to clipboard." });
              setContextMenu(null);
            }}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 10px",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: W.text1,
              borderRadius: 5,
              textAlign: "left",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = W.surface2)}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "transparent")}
          >
            <Icon d={icons.link} size={14} stroke={W.text3} />
            Copy Persistent DOI Link
          </button>
        </div>
      )}

      {/* ── Modals & Overlays ── */}
      <CitationModal
        isOpen={showCitationModal}
        onClose={() => setShowCitationModal(false)}
        item={selectedCitationItem}
      />

      <AiProgressModal
        isOpen={showAiModal}
        onClose={() => setShowAiModal(false)}
        title="Literature Topology & AI Synthesis"
      />

      <ConflictModal
        isOpen={showConflictModal}
        onClose={() => setShowConflictModal(false)}
        onResolve={(strategy) => {
          setSyncStatus("synced");
        }}
      />

      <SessionLockModal
        isOpen={showLockModal}
        onUnlock={() => setShowLockModal(false)}
      />
    </div>
  );
}
