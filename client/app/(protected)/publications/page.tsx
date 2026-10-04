"use client";

import React, { useState } from "react";
import Link from "next/link";

// ─── Design Tokens (SSOT from 01_Design Systems) ───────────────────────────

const P = {
  ink: "#202920",          // Forest ink
  ink2: "#62685E",         // Bark grey
  ink3: "#85877B",         // Quiet stone
  parchment: "#FAF7F0",    // Parchment canvas
  surface: "#FFFFFF",      // Surface raised
  surface2: "#F2EBDD",     // Mineral sand foundation
  hairline: "#E4DCCB",     // Limestone hairline
  forest: "#3E6248",       // Canopy green
  forestDim: "#66866A",    // Living algae
  forestBg: "#DCE6D7",     // Sage mist highlight
  link: "#3E6248",
  linkBg: "#DCE6D7",
  amber: "#8A5A12",
  amberBg: "#F2EBDD",
} as const;

// ─── Data Types ──────────────────────────────────────────────────────────────

interface Paper {
  id: string;
  title: string;
  authors: string[];
  venue: string;
  year: number;
  abstract: string;
  areas: string[];
  citations: number;
  openAccess: boolean;
  doi?: string;
  relevanceNote?: string;
  connectionNote?: string;
  connections?: { workspacePages: number; savedPapers: number; projects: number };
}

interface Journal {
  id: string;
  name: string;
  scope: string[];
  submissionType: string;
  openAccess: boolean;
  matchStrength: "strong" | "good" | "moderate";
  matchNote: string;
}

interface Conference {
  id: string;
  name: string;
  fullName: string;
  areas: string[];
  submissionDeadline: string;
  conferenceDate: string;
  location: string;
  matchNote: string;
}

// ─── Static Data ─────────────────────────────────────────────────────────────

const PAPERS: Paper[] = [
  {
    id: "p1",
    title: "Foundation Models for Medical Image Understanding",
    authors: ["Imthiyas", "Daniel Park", "Elena Rodriguez"],
    venue: "Journal of Medical AI Research",
    year: 2026,
    doi: "10.xxxx/jmai.2026.001",
    abstract:
      "Recent foundation models have demonstrated strong transfer performance across medical imaging tasks, but their effectiveness in low-resource clinical environments remains underexplored. We present a systematic evaluation of six foundation architectures on fourteen clinical imaging benchmarks, with particular attention to sample efficiency and domain shift resistance across imaging modalities.",
    areas: ["Medical Imaging", "Computer Vision", "Foundation Models"],
    citations: 42,
    openAccess: true,
    relevanceNote: "Strong match · Medical Imaging · Computer Vision",
    connectionNote: "Connected to 3 papers in your reading list.",
    connections: { workspacePages: 2, savedPapers: 4, projects: 1 },
  },
  {
    id: "p2",
    title: "Federated Learning for Privacy-Preserving Clinical AI",
    authors: ["Soo-Jin Kim", "Aryan Patel", "Imthiyas"],
    venue: "NeurIPS",
    year: 2025,
    doi: "10.xxxx/neurips.2025.4521",
    abstract:
      "We introduce a federated learning framework designed for multi-institutional clinical AI deployment, addressing both data heterogeneity and regulatory constraints. Our approach achieves within 2.3% of centralized training performance while preserving differential privacy guarantees across 14 hospital networks in a real-world evaluation.",
    areas: ["Federated Learning", "Privacy", "Clinical AI"],
    citations: 128,
    openAccess: false,
    relevanceNote: "Related to your current project",
    connectionNote: "Frequently cited alongside papers you are reading.",
    connections: { workspacePages: 1, savedPapers: 6, projects: 2 },
  },
  {
    id: "p3",
    title: "Efficient Vision Transformers for Clinical Imaging",
    authors: ["Wei Zhang", "Catherine Thompson"],
    venue: "MICCAI",
    year: 2025,
    abstract:
      "We propose EfficientViT-Med, a vision transformer variant optimized for resource-constrained clinical deployment. Through structured pruning and knowledge distillation from large foundation models, we achieve a 4.2× reduction in inference latency with less than 1.5% accuracy degradation across pathology and radiology benchmarks.",
    areas: ["Computer Vision", "Transformers", "Clinical Imaging"],
    citations: 67,
    openAccess: true,
    connectionNote: "Related through Medical Imaging + Computer Vision",
  },
  {
    id: "p4",
    title: "Self-Supervised Pre-training for Medical Image Segmentation",
    authors: ["Elena Rodriguez", "Liang Liu"],
    venue: "CVPR",
    year: 2026,
    abstract:
      "Self-supervised pre-training has transformed natural image understanding, yet direct transfer to medical segmentation remains challenging due to acquisition heterogeneity and annotation scarcity. We present MedSSL, a contrastive pre-training strategy for volumetric medical images with strong empirical results on five segmentation benchmarks.",
    areas: ["Medical Imaging", "Self-Supervised", "Segmentation"],
    citations: 31,
    openAccess: true,
    connectionNote: "Connected to your segmentation project.",
  },
  {
    id: "p5",
    title: "Multimodal Foundation Models in Healthcare",
    authors: ["Daniel Park", "Imthiyas", "Kwame Osei"],
    venue: "Nature Medicine",
    year: 2025,
    abstract:
      "We survey the emerging landscape of multimodal foundation models that jointly reason over clinical text, radiology images, pathology slides, and genomic data. Our analysis identifies key alignment challenges and proposes evaluation criteria for clinical deployment readiness across nine healthcare domains.",
    areas: ["Foundation Models", "Multimodal", "Healthcare"],
    citations: 205,
    openAccess: false,
    connectionNote: "Highly cited in your research area.",
  },
  {
    id: "p6",
    title: "Low-Resource Medical Image Analysis with Semi-Supervised Methods",
    authors: ["Imthiyas", "Hiroshi Wei"],
    venue: "ICCV",
    year: 2025,
    abstract:
      "Annotated medical images remain scarce due to the cost and expertise required for expert labeling. We investigate semi-supervised learning regimes where as few as 1% of training examples are labeled, demonstrating competitive performance through teacher-student consistency regularization adapted to volumetric inputs.",
    areas: ["Medical Imaging", "Low-Resource", "Semi-Supervised"],
    citations: 19,
    openAccess: true,
    relevanceNote: "Potentially relevant to your research question",
  },
];

const JOURNALS: Journal[] = [
  {
    id: "j1",
    name: "Journal of Medical AI Research",
    scope: ["Medical Imaging", "Machine Learning", "Clinical AI"],
    submissionType: "Full paper · Short communication · Review",
    openAccess: true,
    matchStrength: "strong",
    matchNote: "Strong topic match",
  },
  {
    id: "j2",
    name: "International Journal of Computer Vision",
    scope: ["Computer Vision", "Image Understanding", "Scene Analysis"],
    submissionType: "Full paper",
    openAccess: false,
    matchStrength: "good",
    matchNote: "Good methodological match",
  },
  {
    id: "j3",
    name: "Medical Image Analysis",
    scope: ["Medical Imaging", "Image Processing", "Clinical Applications"],
    submissionType: "Full paper · Short communication",
    openAccess: false,
    matchStrength: "strong",
    matchNote: "Strong scope alignment",
  },
];

const CONFERENCES: Conference[] = [
  {
    id: "c1",
    name: "MICCAI 2026",
    fullName: "Medical Image Computing and Computer Assisted Intervention",
    areas: ["Medical Imaging", "Computer Vision", "Clinical AI"],
    submissionDeadline: "March 2026 — Upcoming",
    conferenceDate: "September 2026",
    location: "Berlin, Germany",
    matchNote: "Primary venue for your research area",
  },
  {
    id: "c2",
    name: "CVPR 2026",
    fullName: "IEEE Conference on Computer Vision and Pattern Recognition",
    areas: ["Computer Vision", "Machine Learning", "Foundation Models"],
    submissionDeadline: "November 2025 — Upcoming",
    conferenceDate: "June 2026",
    location: "Seattle, USA",
    matchNote: "Strong methodological match",
  },
  {
    id: "c3",
    name: "NeurIPS 2026",
    fullName: "Neural Information Processing Systems",
    areas: ["Machine Learning", "Federated Learning", "Foundation Models"],
    submissionDeadline: "May 2026 — Upcoming",
    conferenceDate: "December 2026",
    location: "Vancouver, Canada",
    matchNote: "Good match for federated learning work",
  },
];

// ─── Left Sidebar Component ──────────────────────────────────────────────────

interface NavItem {
  label: string;
  icon?: string;
  href?: string;
  active?: boolean;
  badge?: number;
}

// ─── Paper Card Component ────────────────────────────────────────────────────

interface PaperCardProps {
  paper: Paper;
  isSelected: boolean;
  isSaved: boolean;
  onSelect: () => void;
  onToggleSave: () => void;
  variant?: "default" | "featured";
}

function PaperCard({
  paper,
  isSelected,
  isSaved,
  onSelect,
  onToggleSave,
  variant = "default",
}: PaperCardProps) {
  const [hovered, setHovered] = useState(false);
  const [citeCopied, setCiteCopied] = useState(false);
  const [addedToWS, setAddedToWS] = useState(false);

  const handleCite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCiteCopied(true);
    setTimeout(() => setCiteCopied(false), 2000);
  };

  const handleAddToWS = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAddedToWS(true);
    setTimeout(() => setAddedToWS(false), 2000);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleSave();
  };

  const bgColor = isSelected ? P.forestBg : hovered ? P.surface2 : P.surface;
  const borderColor = isSelected ? P.forest : P.hairline;

  return (
    <article
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="rounded cursor-pointer transition-all duration-150"
      style={{
        padding: variant === "featured" ? "14px 16px" : "12px 16px",
        backgroundColor: bgColor,
        border: `1px solid ${borderColor}`,
        outline: isSelected ? `1px solid ${P.forest}` : "none",
        transform: hovered ? "translateY(-1px)" : "none",
      }}
    >
      {/* Title row */}
      <div className="flex items-start justify-between gap-3 mb-1.5">
        <h3
          style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: variant === "featured" ? "16.5px" : "15px",
            fontWeight: 400,
            color: P.ink,
            lineHeight: 1.35,
          }}
        >
          {paper.title}
        </h3>
        <div className="flex items-center gap-1.5 flex-shrink-0 pt-0.5">
          {paper.openAccess && (
            <span
              style={{
                fontSize: "10px",
                fontFamily: "monospace",
                fontWeight: 600,
                color: P.forest,
                backgroundColor: P.forestBg,
                padding: "2px 5px",
                borderRadius: "2px",
              }}
            >
              OA
            </span>
          )}
        </div>
      </div>

      {/* Authors */}
      <div style={{ fontSize: "12px", color: P.ink2, marginBottom: "6px" }}>
        {paper.authors.join(" · ")}
      </div>

      {/* Venue · Year · Citations */}
      <div className="flex items-center gap-2 flex-wrap mb-2.5">
        <span style={{ fontSize: "12px", color: P.link, fontWeight: 500 }}>{paper.venue}</span>
        <span style={{ color: P.hairline, fontSize: "12px" }}>·</span>
        <span style={{ fontSize: "11.5px", color: P.ink3, fontFamily: "monospace" }}>{paper.year}</span>
        <span style={{ color: P.hairline, fontSize: "12px" }}>·</span>
        <span style={{ fontSize: "11.5px", color: P.ink3, fontFamily: "monospace" }}>
          {paper.citations} citations
        </span>
      </div>

      {/* Abstract excerpt */}
      <p style={{ fontSize: "13px", color: P.ink2, lineHeight: 1.65, marginBottom: "10px" }}>
        {paper.abstract.slice(0, 190)}…
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-2.5">
        {paper.areas.map((area) => (
          <span
            key={area}
            style={{
              fontSize: "11px",
              color: P.ink2,
              backgroundColor: P.parchment,
              border: `1px solid ${P.hairline}`,
              padding: "2px 8px",
              borderRadius: "2px",
            }}
          >
            {area}
          </span>
        ))}
      </div>

      {/* Action Buttons */}
      <div
        className="flex items-center gap-1.5 flex-wrap"
        style={{ transition: "opacity 150ms", opacity: hovered || isSelected ? 1 : 0.8 }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          style={{
            fontSize: "11.5px",
            padding: "4px 10px",
            borderRadius: "3px",
            backgroundColor: P.forest,
            color: "#FFFFFF",
            border: "none",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          Read
        </button>

        <button
          onClick={handleSave}
          style={{
            fontSize: "11.5px",
            padding: "4px 10px",
            borderRadius: "3px",
            backgroundColor: isSaved ? P.forestBg : "transparent",
            color: isSaved ? P.forest : P.ink2,
            border: `1px solid ${P.hairline}`,
            cursor: "pointer",
            fontWeight: isSaved ? 600 : 400,
          }}
        >
          {isSaved ? "✓ Saved" : "Save"}
        </button>

        <button
          onClick={handleCite}
          style={{
            fontSize: "11.5px",
            padding: "4px 10px",
            borderRadius: "3px",
            backgroundColor: citeCopied ? P.forestBg : "transparent",
            color: citeCopied ? P.forest : P.ink2,
            border: `1px solid ${P.hairline}`,
            cursor: "pointer",
          }}
        >
          {citeCopied ? "✓ Cited" : "Cite"}
        </button>

        <button
          onClick={handleAddToWS}
          style={{
            fontSize: "11.5px",
            padding: "4px 10px",
            borderRadius: "3px",
            backgroundColor: addedToWS ? P.forestBg : "transparent",
            color: addedToWS ? P.forest : P.ink2,
            border: `1px solid ${P.hairline}`,
            cursor: "pointer",
          }}
        >
          {addedToWS ? "✓ Added" : "+ Workspace"}
        </button>

        {(paper.connectionNote || paper.relevanceNote) && (
          <div
            className="flex items-center gap-1 ml-auto"
            style={{ fontSize: "11px", color: P.ink3, maxWidth: "220px", textAlign: "right" }}
          >
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {paper.connectionNote || paper.relevanceNote}
            </span>
          </div>
        )}
      </div>
    </article>
  );
}

// ─── Paper Detail Panel ──────────────────────────────────────────────────────

const CITATION_FORMATS = ["APA", "IEEE", "MLA", "BibTeX"] as const;
type CitationFormat = (typeof CITATION_FORMATS)[number];

function buildCitation(paper: Paper, fmt: CitationFormat): string {
  const firstAuthorLast = paper.authors[0].split(" ").pop() ?? "";
  switch (fmt) {
    case "APA":
      return (
        paper.authors
          .map((a) => {
            const parts = a.split(" ");
            const last = parts[parts.length - 1];
            const initials = parts
              .slice(0, -1)
              .map((n) => n[0] + ".")
              .join(" ");
            return `${last}, ${initials}`;
          })
          .join(", ") +
        `. (${paper.year}). ${paper.title}. ${paper.venue}.`
      );
    case "IEEE":
      return (
        paper.authors
          .map((a) => {
            const p = a.split(" ");
            return p
              .slice(0, -1)
              .map((n) => n[0] + ".")
              .join("") + " " + p[p.length - 1];
          })
          .join(", ") +
        `, "${paper.title}," ${paper.venue}, ${paper.year}.`
      );
    case "MLA":
      return `${paper.authors.join(", ")}. "${paper.title}." ${paper.venue} (${paper.year}).`;
    case "BibTeX":
      return `@article{${firstAuthorLast.toLowerCase()}${paper.year},\n  title   = {${paper.title}},\n  author  = {${paper.authors.join(" and ")}},\n  journal = {${paper.venue}},\n  year    = {${paper.year}}\n}`;
  }
}

function PaperDetail({
  paper,
  onClose,
  isSaved,
  onToggleSave,
}: {
  paper: Paper;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: () => void;
}) {
  const [format, setFormat] = useState<CitationFormat>("APA");
  const [copied, setCopied] = useState(false);
  const [addedToWS, setAddedToWS] = useState(false);
  const [note, setNote] = useState("");

  const relatedPapers = PAPERS.filter(
    (p) => p.id !== paper.id && p.areas.some((a) => paper.areas.includes(a))
  ).slice(0, 3);

  const citationText = buildCitation(paper, format);

  const handleCopy = () => {
    navigator.clipboard?.writeText(citationText).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ backgroundColor: P.surface }}>
      {/* Header */}
      <div className="px-5 pt-5 pb-4" style={{ borderBottom: `1px solid ${P.hairline}` }}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {paper.openAccess && (
              <span
                style={{
                  fontSize: "10px",
                  fontFamily: "monospace",
                  fontWeight: 600,
                  color: P.forest,
                  backgroundColor: P.forestBg,
                  padding: "2px 6px",
                  borderRadius: "2px",
                }}
              >
                Open Access
              </span>
            )}
            <span
              style={{
                fontSize: "11px",
                color: P.ink3,
                fontFamily: "monospace",
              }}
            >
              {paper.year}
            </span>
          </div>
          <button
            onClick={onClose}
            title="Close panel"
            style={{
              fontSize: "16px",
              color: P.ink3,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "2px 6px",
            }}
          >
            ✕
          </button>
        </div>

        <h2
          style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: "19px",
            fontWeight: 400,
            color: P.ink,
            lineHeight: 1.3,
            marginBottom: "8px",
          }}
        >
          {paper.title}
        </h2>

        <div style={{ fontSize: "12.5px", color: P.ink2, marginBottom: "8px" }}>
          {paper.authors.join(", ")}
        </div>

        <div className="flex items-center gap-2 mb-4" style={{ fontSize: "12px" }}>
          <span style={{ color: P.link, fontWeight: 500 }}>{paper.venue}</span>
          {paper.doi && (
            <>
              <span style={{ color: P.hairline }}>·</span>
              <span style={{ color: P.ink3, fontFamily: "monospace" }}>DOI {paper.doi}</span>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            style={{
              fontSize: "12px",
              padding: "6px 14px",
              borderRadius: "3px",
              backgroundColor: P.forest,
              color: "#FFFFFF",
              border: "none",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            Read Full Paper
          </button>
          <button
            onClick={onToggleSave}
            style={{
              fontSize: "12px",
              padding: "6px 12px",
              borderRadius: "3px",
              backgroundColor: isSaved ? P.forestBg : "transparent",
              color: isSaved ? P.forest : P.ink2,
              border: `1px solid ${P.hairline}`,
              cursor: "pointer",
              fontWeight: isSaved ? 600 : 400,
            }}
          >
            {isSaved ? "✓ Saved" : "Save Paper"}
          </button>
          <button
            onClick={() => {
              setAddedToWS(true);
              setTimeout(() => setAddedToWS(false), 2000);
            }}
            style={{
              fontSize: "12px",
              padding: "6px 12px",
              borderRadius: "3px",
              backgroundColor: addedToWS ? P.forestBg : "transparent",
              color: addedToWS ? P.forest : P.ink2,
              border: `1px solid ${P.hairline}`,
              cursor: "pointer",
            }}
          >
            {addedToWS ? "✓ Added" : "+ Workspace"}
          </button>
        </div>
      </div>

      {/* Abstract Section */}
      <div className="p-5" style={{ borderBottom: `1px solid ${P.hairline}` }}>
        <div
          className="uppercase font-semibold tracking-wider mb-2"
          style={{ fontSize: "9.5px", color: P.ink3, letterSpacing: "0.12em" }}
        >
          Abstract
        </div>
        <p style={{ fontSize: "13px", color: P.ink2, lineHeight: 1.7 }}>{paper.abstract}</p>
      </div>

      {/* Research Areas */}
      <div className="p-5" style={{ borderBottom: `1px solid ${P.hairline}` }}>
        <div
          className="uppercase font-semibold tracking-wider mb-2"
          style={{ fontSize: "9.5px", color: P.ink3, letterSpacing: "0.12em" }}
        >
          Research Areas
        </div>
        <div className="flex flex-wrap gap-1.5">
          {paper.areas.map((a) => (
            <span
              key={a}
              style={{
                fontSize: "11px",
                color: P.ink2,
                backgroundColor: P.parchment,
                border: `1px solid ${P.hairline}`,
                padding: "3px 8px",
                borderRadius: "2px",
              }}
            >
              {a}
            </span>
          ))}
        </div>
      </div>

      {/* Citation Generator */}
      <div className="p-5" style={{ borderBottom: `1px solid ${P.hairline}` }}>
        <div className="flex items-center justify-between mb-3">
          <div
            className="uppercase font-semibold tracking-wider"
            style={{ fontSize: "9.5px", color: P.ink3, letterSpacing: "0.12em" }}
          >
            Cite This Paper
          </div>
          <div className="flex gap-1">
            {CITATION_FORMATS.map((fmt) => (
              <button
                key={fmt}
                onClick={() => setFormat(fmt)}
                style={{
                  fontSize: "11px",
                  padding: "2px 6px",
                  borderRadius: "2px",
                  border: `1px solid ${P.hairline}`,
                  backgroundColor: format === fmt ? P.forestBg : "transparent",
                  color: format === fmt ? P.forest : P.ink2,
                  cursor: "pointer",
                  fontWeight: format === fmt ? 600 : 400,
                }}
              >
                {fmt}
              </button>
            ))}
          </div>
        </div>

        <div
          style={{
            backgroundColor: P.parchment,
            border: `1px solid ${P.hairline}`,
            borderRadius: "4px",
            padding: "10px",
            fontSize: "12px",
            color: P.ink2,
            lineHeight: 1.5,
            fontFamily: format === "BibTeX" ? "monospace" : "inherit",
            whiteSpace: format === "BibTeX" ? "pre-wrap" : "normal",
            marginBottom: "8px",
          }}
        >
          {citationText}
        </div>

        <button
          onClick={handleCopy}
          style={{
            width: "100%",
            fontSize: "12px",
            padding: "6px 0",
            borderRadius: "3px",
            border: `1px solid ${P.hairline}`,
            backgroundColor: copied ? P.forestBg : P.surface,
            color: copied ? P.forest : P.ink,
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          {copied ? "✓ Copied Citation" : "Copy Citation"}
        </button>
      </div>

      {/* Related Papers */}
      {relatedPapers.length > 0 && (
        <div className="p-5">
          <div
            className="uppercase font-semibold tracking-wider mb-3"
            style={{ fontSize: "9.5px", color: P.ink3, letterSpacing: "0.12em" }}
          >
            Related in Workspace
          </div>
          <div className="space-y-2">
            {relatedPapers.map((rel) => (
              <div
                key={rel.id}
                className="p-2.5 rounded transition-colors"
                style={{
                  border: `1px solid ${P.hairline}`,
                  backgroundColor: P.parchment,
                  cursor: "pointer",
                }}
              >
                <div style={{ fontSize: "12.5px", fontWeight: 500, color: P.ink, marginBottom: "2px" }}>
                  {rel.title}
                </div>
                <div style={{ fontSize: "11px", color: P.ink3 }}>
                  {rel.authors[0]} et al. · {rel.venue} ({rel.year})
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Right Rail Component ────────────────────────────────────────────────────

function RightRail() {
  const [followedTopics, setFollowedTopics] = useState<Set<string>>(new Set());

  return (
    <div style={{ backgroundColor: P.surface }}>
      {/* Reading list */}
      <div className="px-5 py-4" style={{ borderBottom: `1px solid ${P.hairline}` }}>
        <div
          className="uppercase font-semibold tracking-wider mb-3"
          style={{ fontSize: "9.5px", color: P.ink3, letterSpacing: "0.12em" }}
        >
          Your Reading List
        </div>
        <div className="flex items-center gap-5 mb-3">
          <div>
            <div style={{ fontFamily: "monospace", fontSize: "22px", fontWeight: 600, color: P.ink, lineHeight: 1 }}>
              3
            </div>
            <div style={{ fontSize: "11px", color: P.ink3, marginTop: "2px" }}>unread</div>
          </div>
          <div style={{ width: "1px", height: "28px", backgroundColor: P.hairline }} />
          <div>
            <div style={{ fontFamily: "monospace", fontSize: "22px", fontWeight: 600, color: P.ink, lineHeight: 1 }}>
              12
            </div>
            <div style={{ fontSize: "11px", color: P.ink3, marginTop: "2px" }}>saved</div>
          </div>
        </div>

        <div className="space-y-2 mb-3">
          {[
            { title: "Foundation Models for Medical Image Understanding", status: "reading" },
            { title: "Federated Learning for Clinical AI", status: "saved" },
            { title: "Efficient Medical Segmentation", status: "saved" },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-2">
              <div
                className="rounded-full flex-shrink-0 mt-1.5"
                style={{
                  width: "5px",
                  height: "5px",
                  backgroundColor: item.status === "reading" ? P.forest : P.hairline,
                }}
              />
              <div style={{ fontSize: "12px", color: P.ink2, lineHeight: 1.5 }}>{item.title}</div>
            </div>
          ))}
        </div>
        <button
          style={{
            fontSize: "12px",
            color: P.forest,
            backgroundColor: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 0,
            fontWeight: 500,
          }}
        >
          View reading list →
        </button>
      </div>

      {/* Related to your research */}
      <div className="px-5 py-4" style={{ borderBottom: `1px solid ${P.hairline}` }}>
        <div
          className="uppercase font-semibold tracking-wider mb-3"
          style={{ fontSize: "9.5px", color: P.ink3, letterSpacing: "0.12em" }}
        >
          Related to Your Research
        </div>
        <div className="space-y-1.5">
          {["Foundation Models", "Medical Imaging", "Federated Learning", "Computer Vision"].map((topic) => {
            const followed = followedTopics.has(topic);
            return (
              <div
                key={topic}
                className="flex items-center justify-between rounded px-2.5 py-2 transition-colors"
                style={{ border: `1px solid ${P.hairline}` }}
              >
                <span style={{ fontSize: "12.5px", color: P.ink2 }}>{topic}</span>
                <button
                  onClick={() => {
                    const next = new Set(followedTopics);
                    if (next.has(topic)) next.delete(topic);
                    else next.add(topic);
                    setFollowedTopics(next);
                  }}
                  style={{
                    fontSize: "11px",
                    padding: "2px 8px",
                    borderRadius: "2px",
                    border: `1px solid ${P.hairline}`,
                    backgroundColor: followed ? P.forestBg : "transparent",
                    color: followed ? P.forest : P.ink2,
                    cursor: "pointer",
                    fontWeight: followed ? 600 : 400,
                  }}
                >
                  {followed ? "Following" : "Follow"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming deadlines */}
      <div className="px-5 py-4">
        <div
          className="uppercase font-semibold tracking-wider mb-3"
          style={{ fontSize: "9.5px", color: P.ink3, letterSpacing: "0.12em" }}
        >
          Upcoming Deadlines
        </div>
        <div className="space-y-2.5">
          {[
            { venue: "MICCAI 2026", deadline: "Mar 15, 2026", type: "Conference" },
            { venue: "CVPR 2026", deadline: "Nov 14, 2025", type: "Conference" },
          ].map((d) => (
            <div
              key={d.venue}
              className="p-2.5 rounded"
              style={{ border: `1px solid ${P.hairline}`, backgroundColor: P.parchment }}
            >
              <div className="flex items-center justify-between mb-1">
                <span style={{ fontSize: "12.5px", fontWeight: 600, color: P.ink }}>{d.venue}</span>
                <span style={{ fontSize: "10.5px", color: P.amber, fontWeight: 600 }}>{d.deadline}</span>
              </div>
              <span style={{ fontSize: "11px", color: P.ink3 }}>{d.type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Center Paper Explorer ───────────────────────────────────────────────────

const TABS = ["Papers", "Publications", "Journals", "Conferences"] as const;
type Tab = (typeof TABS)[number];

const FILTERS = ["Research Area", "Year", "Authors", "Venue", "Type", "Open Access"] as const;

const RECENT_SEARCHES = [
  "medical image segmentation",
  "federated learning healthcare",
  "multimodal clinical AI",
];
const SUGGESTED_TOPICS = ["Medical Imaging", "Computer Vision", "Foundation Models"];
const SUGGESTED_RESEARCHERS = ["Dr. Elena Rodriguez", "Dr. Daniel Park"];

function PaperExplorer({
  onPaperSelect,
  selectedPaperId,
  savedPapers,
  onToggleSave,
}: {
  onPaperSelect: (paper: Paper) => void;
  selectedPaperId?: string;
  savedPapers: Set<string>;
  onToggleSave: (id: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<Tab>("Papers");
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState("Relevance");
  const [searchSaved, setSearchSaved] = useState(false);

  const personalizedPapers = PAPERS.filter((p) => p.relevanceNote);
  const mainPapers = PAPERS.filter((p) => !p.relevanceNote);

  const toggleFilter = (f: string) => {
    const next = new Set(activeFilters);
    if (next.has(f)) next.delete(f);
    else next.add(f);
    setActiveFilters(next);
  };

  return (
    <main
      className="flex-1 flex flex-col overflow-hidden min-w-0"
      style={{ borderRight: `1px solid ${P.hairline}`, backgroundColor: P.parchment }}
    >
      {/* Header */}
      <div
        className="px-8 pt-6 pb-5"
        style={{ borderBottom: `1px solid ${P.hairline}`, backgroundColor: P.surface }}
      >
        <h1
          className="mb-1 font-serif text-[34px] sm:text-[38px] md:text-[40px] font-normal tracking-[-0.02em] text-[#202920] leading-tight"
        >
          Publications & <span className="italic text-[#3E6248]">Literature Matrix</span>
        </h1>
        <p className="mb-4 text-sm text-[#62685E] font-sans">
          Discover the foundational publications, preprints, and citation graphs shaping your research vector.
        </p>

        {/* Search Input */}
        <div className="relative">
          <div
            className="relative flex items-center rounded"
            style={{
              border: focused ? `1.5px solid ${P.forest}` : `1.5px solid ${P.hairline}`,
              backgroundColor: focused ? P.surface : P.parchment,
              transition: "border-color 150ms, background-color 150ms",
            }}
          >
            <svg
              className="absolute"
              style={{ left: "12px", color: P.ink3 }}
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 200)}
              placeholder="Search papers, authors, topics, DOI..."
              className="w-full outline-none bg-transparent"
              style={{
                padding: "10px 40px 10px 38px",
                fontSize: "14px",
                color: P.ink,
                fontFamily: "'Inter', sans-serif",
              }}
            />
            {query && (
              <button
                onMouseDown={() => setQuery("")}
                style={{
                  position: "absolute",
                  right: "10px",
                  fontSize: "13px",
                  color: P.ink3,
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: "2px 6px",
                }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Search suggestions dropdown */}
          {focused && !query && (
            <div
              className="absolute left-0 right-0 rounded"
              style={{
                top: "calc(100% + 4px)",
                backgroundColor: P.surface,
                border: `1px solid ${P.hairline}`,
                boxShadow: "0 6px 24px rgba(0,0,0,0.08)",
                zIndex: 50,
              }}
            >
              <div className="p-3" style={{ borderBottom: `1px solid ${P.hairline}` }}>
                <div
                  style={{
                    fontSize: "9.5px",
                    color: P.ink3,
                    fontWeight: 600,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    marginBottom: "6px",
                  }}
                >
                  Recent Searches
                </div>
                {RECENT_SEARCHES.map((s) => (
                  <button
                    key={s}
                    onMouseDown={() => setQuery(s)}
                    className="flex items-center gap-2 w-full px-2 py-1.5 rounded text-left transition-colors"
                    style={{ fontSize: "13px", color: P.ink2, background: "transparent", border: "none", cursor: "pointer" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = P.surface2)}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent")}
                  >
                    <span>↺</span>
                    <span>{s}</span>
                  </button>
                ))}
              </div>

              <div className="p-3">
                <div
                  style={{
                    fontSize: "9.5px",
                    color: P.ink3,
                    fontWeight: 600,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    marginBottom: "8px",
                  }}
                >
                  Suggested Topics
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_TOPICS.map((t) => (
                    <button
                      key={t}
                      onMouseDown={() => setQuery(t)}
                      style={{
                        fontSize: "12px",
                        padding: "3px 10px",
                        borderRadius: "2px",
                        border: `1px solid ${P.hairline}`,
                        backgroundColor: P.forestBg,
                        color: P.forest,
                        cursor: "pointer",
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div
        className="flex items-center px-8"
        style={{ borderBottom: `1px solid ${P.hairline}`, backgroundColor: P.surface }}
      >
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="py-3 mr-7 text-sm transition-colors"
            style={{
              fontSize: "13px",
              color: activeTab === tab ? P.ink : P.ink3,
              fontWeight: activeTab === tab ? 600 : 400,
              borderTop: "none",
              borderLeft: "none",
              borderRight: "none",
              borderBottom: activeTab === tab ? `2px solid ${P.forest}` : "2px solid transparent",
              marginBottom: "-1px",
              backgroundColor: "transparent",
              cursor: "pointer",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Filter Bar */}
      <div
        className="flex items-center gap-2 px-8 py-2.5 overflow-x-auto flex-shrink-0"
        style={{ borderBottom: `1px solid ${P.hairline}`, backgroundColor: P.surface }}
      >
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => toggleFilter(f)}
            className="flex items-center gap-1 rounded whitespace-nowrap flex-shrink-0 transition-colors"
            style={{
              fontSize: "12px",
              padding: "4px 10px",
              border: `1px solid ${P.hairline}`,
              backgroundColor: activeFilters.has(f) ? P.forestBg : "transparent",
              color: activeFilters.has(f) ? P.forest : P.ink2,
              cursor: "pointer",
              borderRadius: "3px",
            }}
          >
            {f}
            <span style={{ fontSize: "10px" }}>▼</span>
          </button>
        ))}

        <div style={{ flex: 1 }} />

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="rounded outline-none flex-shrink-0"
          style={{
            fontSize: "12px",
            padding: "4px 10px",
            border: `1px solid ${P.hairline}`,
            color: P.ink2,
            backgroundColor: "transparent",
            cursor: "pointer",
            borderRadius: "3px",
          }}
        >
          {["Relevance", "Newest", "Most Cited", "Recently Added"].map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>

        <button
          onClick={() => setSearchSaved((s) => !s)}
          className="rounded whitespace-nowrap flex-shrink-0 transition-colors"
          style={{
            fontSize: "12px",
            padding: "4px 10px",
            border: `1px solid ${P.hairline}`,
            backgroundColor: searchSaved ? P.forestBg : "transparent",
            color: searchSaved ? P.forest : P.ink2,
            cursor: "pointer",
            borderRadius: "3px",
          }}
        >
          {searchSaved ? "✓ Saved" : "Save Search"}
        </button>

        {activeFilters.size > 0 && (
          <button
            onClick={() => setActiveFilters(new Set())}
            style={{
              fontSize: "12px",
              color: P.ink3,
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            Clear
          </button>
        )}
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 overflow-y-auto px-8 py-5">
        {activeTab === "Papers" && (
          <>
            {/* Personalized Section */}
            <div className="mb-6">
              <div className="flex items-baseline gap-2 mb-3">
                <span
                  className="uppercase font-semibold tracking-wider"
                  style={{ fontSize: "9.5px", color: P.ink3, letterSpacing: "0.12em" }}
                >
                  For Your Research
                </span>
                <span style={{ fontSize: "12px", color: P.ink3 }}>
                  · Because you&apos;re researching Medical Imaging
                </span>
              </div>
              <div className="space-y-2">
                {personalizedPapers.map((paper) => (
                  <PaperCard
                    key={paper.id}
                    paper={paper}
                    isSelected={selectedPaperId === paper.id}
                    isSaved={savedPapers.has(paper.id)}
                    onSelect={() => onPaperSelect(paper)}
                    onToggleSave={() => onToggleSave(paper.id)}
                    variant="featured"
                  />
                ))}
              </div>
            </div>

            {/* Results Divider */}
            <div className="flex items-center gap-3 mb-4">
              <div style={{ flex: 1, height: "1px", backgroundColor: P.hairline }} />
              <span style={{ fontSize: "11px", color: P.ink3 }}>{PAPERS.length} results</span>
              <div style={{ flex: 1, height: "1px", backgroundColor: P.hairline }} />
            </div>

            {/* Main Results */}
            <div className="space-y-2">
              {mainPapers.map((paper) => (
                <PaperCard
                  key={paper.id}
                  paper={paper}
                  isSelected={selectedPaperId === paper.id}
                  isSaved={savedPapers.has(paper.id)}
                  onSelect={() => onPaperSelect(paper)}
                  onToggleSave={() => onToggleSave(paper.id)}
                />
              ))}
            </div>
          </>
        )}

        {activeTab === "Journals" && (
          <div>
            <div className="flex items-baseline gap-2 mb-4">
              <span
                style={{
                  fontSize: "9.5px",
                  color: P.ink3,
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                Potential Venues
              </span>
              <span style={{ fontSize: "12px", color: P.ink3 }}>· Based on your current paper</span>
            </div>
            <div className="space-y-3">
              {JOURNALS.map((j) => (
                <div
                  key={j.id}
                  className="rounded p-4 transition-colors"
                  style={{ border: `1px solid ${P.hairline}`, backgroundColor: P.surface }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.backgroundColor = P.surface2)}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.backgroundColor = P.surface)}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h3
                        style={{
                          fontFamily: "'Fraunces', Georgia, serif",
                          fontSize: "16px",
                          fontWeight: 400,
                          color: P.ink,
                          marginBottom: "4px",
                        }}
                      >
                        {j.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span
                          style={{
                            fontSize: "11px",
                            padding: "2px 8px",
                            borderRadius: "2px",
                            backgroundColor: j.matchStrength === "strong" ? P.forestBg : P.surface2,
                            color: j.matchStrength === "strong" ? P.forest : P.ink2,
                            border: `1px solid ${P.hairline}`,
                          }}
                        >
                          {j.matchNote}
                        </span>
                        {j.openAccess && (
                          <span
                            style={{
                              fontSize: "10.5px",
                              fontFamily: "monospace",
                              color: P.forest,
                              backgroundColor: P.forestBg,
                              padding: "2px 6px",
                              borderRadius: "2px",
                            }}
                          >
                            OA
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {j.scope.map((s) => (
                      <span
                        key={s}
                        style={{
                          fontSize: "11px",
                          color: P.ink2,
                          backgroundColor: P.parchment,
                          border: `1px solid ${P.hairline}`,
                          padding: "2px 8px",
                          borderRadius: "2px",
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  <div style={{ fontSize: "12px", color: P.ink3, marginBottom: "12px" }}>
                    {j.submissionType}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      style={{
                        fontSize: "12px",
                        padding: "5px 12px",
                        borderRadius: "3px",
                        border: `1px solid ${P.hairline}`,
                        color: P.ink2,
                        backgroundColor: "transparent",
                        cursor: "pointer",
                      }}
                    >
                      View Journal
                    </button>
                    <button
                      style={{
                        fontSize: "12px",
                        padding: "5px 12px",
                        borderRadius: "3px",
                        border: "none",
                        backgroundColor: P.forest,
                        color: "#FFFFFF",
                        cursor: "pointer",
                      }}
                    >
                      Add to Publication Plan
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "Conferences" && (
          <div>
            <div className="flex items-baseline gap-2 mb-4">
              <span
                style={{
                  fontSize: "9.5px",
                  color: P.ink3,
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                Upcoming Conferences
              </span>
              <span style={{ fontSize: "12px", color: P.ink3 }}>· Matched to your research areas</span>
            </div>
            <div className="space-y-3">
              {CONFERENCES.map((c) => (
                <div
                  key={c.id}
                  className="rounded p-4 transition-colors"
                  style={{ border: `1px solid ${P.hairline}`, backgroundColor: P.surface }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.backgroundColor = P.surface2)}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.backgroundColor = P.surface)}
                >
                  <div className="mb-1">
                    <h3
                      style={{
                        fontFamily: "'Fraunces', Georgia, serif",
                        fontSize: "16px",
                        fontWeight: 400,
                        color: P.ink,
                        marginBottom: "2px",
                      }}
                    >
                      {c.name}
                    </h3>
                    <div style={{ fontSize: "12px", color: P.ink3, marginBottom: "8px" }}>{c.fullName}</div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {c.areas.map((a) => (
                      <span
                        key={a}
                        style={{
                          fontSize: "11px",
                          color: P.ink2,
                          backgroundColor: P.parchment,
                          border: `1px solid ${P.hairline}`,
                          padding: "2px 8px",
                          borderRadius: "2px",
                        }}
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    {[
                      { label: "Deadline", value: c.submissionDeadline },
                      { label: "Date", value: c.conferenceDate },
                      { label: "Location", value: c.location },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <div
                          style={{
                            fontSize: "9.5px",
                            color: P.ink3,
                            fontWeight: 600,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            marginBottom: "2px",
                          }}
                        >
                          {label}
                        </div>
                        <div style={{ fontSize: "12px", color: P.ink2 }}>{value}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      style={{
                        fontSize: "12px",
                        padding: "5px 12px",
                        borderRadius: "3px",
                        border: `1px solid ${P.hairline}`,
                        color: P.ink2,
                        backgroundColor: "transparent",
                        cursor: "pointer",
                      }}
                    >
                      View Conference
                    </button>
                    <button
                      style={{
                        fontSize: "12px",
                        padding: "5px 12px",
                        borderRadius: "3px",
                        border: "none",
                        backgroundColor: P.forest,
                        color: "#FFFFFF",
                        cursor: "pointer",
                      }}
                    >
                      Add Deadline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "Publications" && (
          <div>
            <div className="flex items-baseline gap-2 mb-4">
              <span
                style={{
                  fontSize: "9.5px",
                  color: P.ink3,
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                Publications
              </span>
              <span style={{ fontSize: "12px", color: P.ink3 }}>· Highly cited in your research area</span>
            </div>
            <div className="space-y-2">
              {PAPERS.slice(0, 4).map((p) => (
                <div
                  key={p.id}
                  className="p-4 rounded transition-colors"
                  style={{ border: `1px solid ${P.hairline}`, backgroundColor: P.surface }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.backgroundColor = P.surface2)}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.backgroundColor = P.surface)}
                >
                  <h3
                    style={{
                      fontFamily: "'Fraunces', Georgia, serif",
                      fontSize: "15px",
                      fontWeight: 400,
                      color: P.ink,
                      marginBottom: "4px",
                      lineHeight: 1.35,
                    }}
                  >
                    {p.title}
                  </h3>
                  <div style={{ fontSize: "12px", color: P.ink3, marginBottom: "8px" }}>
                    <span style={{ color: P.link }}>{p.venue}</span>
                    {" · "}
                    <span style={{ fontFamily: "monospace" }}>{p.year}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onPaperSelect(p)}
                      style={{
                        fontSize: "11.5px",
                        padding: "4px 10px",
                        borderRadius: "3px",
                        border: `1px solid ${P.hairline}`,
                        color: P.ink2,
                        backgroundColor: "transparent",
                        cursor: "pointer",
                      }}
                    >
                      View
                    </button>
                    <button
                      onClick={() => onToggleSave(p.id)}
                      style={{
                        fontSize: "11.5px",
                        padding: "4px 10px",
                        borderRadius: "3px",
                        border: `1px solid ${P.hairline}`,
                        color: savedPapers.has(p.id) ? P.forest : P.ink2,
                        backgroundColor: savedPapers.has(p.id) ? P.forestBg : "transparent",
                        cursor: "pointer",
                      }}
                    >
                      {savedPapers.has(p.id) ? "✓ Saved" : "Save"}
                    </button>
                    <button
                      style={{
                        fontSize: "11.5px",
                        padding: "4px 10px",
                        borderRadius: "3px",
                        border: `1px solid ${P.hairline}`,
                        color: P.ink2,
                        backgroundColor: "transparent",
                        cursor: "pointer",
                      }}
                    >
                      Cite
                    </button>
                    <button
                      style={{
                        fontSize: "11.5px",
                        padding: "4px 10px",
                        borderRadius: "3px",
                        border: `1px solid ${P.hairline}`,
                        color: P.ink2,
                        backgroundColor: "transparent",
                        cursor: "pointer",
                      }}
                    >
                      Add to Portfolio
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

// ─── Main Publication Explorer Page ──────────────────────────────────────────

export default function PublicationsPage() {
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
  const [savedPapers, setSavedPapers] = useState<Set<string>>(new Set());

  const toggleSave = (id: string) => {
    setSavedPapers((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div
      className="flex flex-1 h-screen overflow-hidden bg-canvas font-sans"
      style={{
        backgroundColor: P.parchment,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      

      {/* ── Center Paper Explorer ── */}
      <PaperExplorer
        onPaperSelect={setSelectedPaper}
        selectedPaperId={selectedPaper?.id}
        savedPapers={savedPapers}
        onToggleSave={toggleSave}
      />

      {/* ── Right Rail / Paper Detail Panel (300px or 420px) ── */}
      <div
        className="flex-shrink-0 overflow-y-auto transition-all duration-300"
        style={{
          width: selectedPaper ? "420px" : "300px",
          borderLeft: `1px solid ${P.hairline}`,
          backgroundColor: P.surface,
          height: "100vh",
        }}
      >
        {selectedPaper ? (
          <PaperDetail
            paper={selectedPaper}
            onClose={() => setSelectedPaper(null)}
            isSaved={savedPapers.has(selectedPaper.id)}
            onToggleSave={() => toggleSave(selectedPaper.id)}
          />
        ) : (
          <RightRail />
        )}
      </div>
    </div>
  );
}
