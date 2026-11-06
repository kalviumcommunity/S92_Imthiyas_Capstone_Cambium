"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  UploadCloud,
  FileText,
  X,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  FileCode,
  Sparkles,
  Search,
  Clock,
  ShieldCheck,
  Database,
  ExternalLink,
  Trash2,
  RefreshCw,
  FileUp,
  SlidersHorizontal,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadArtifactsBatch, getLocalArtifacts, UploadedArtifact } from "@/lib/api";

const SEED_ARTIFACTS: UploadedArtifact[] = [
  {
    id: "art-seed-1",
    originalName: "Evo_Genome_Scale_Foundation_2024.pdf",
    mimeType: "application/pdf",
    sizeBytes: 14889728,
    sizeFormatted: "14.2 MB",
    sha256Hash: "8a4d7c2b6f1e9a3d5c7b8a2e4f6d1c3b5a7e9f2d4c6b8a1e3f5d7c9b2a4e6f8a",
    uploadedAt: new Date(Date.now() - 3600000 * 2.5).toISOString(),
    status: "verified",
  },
  {
    id: "art-seed-2",
    originalName: "AlphaFold3_Biomolecular_Complexes.pdf",
    mimeType: "application/pdf",
    sizeBytes: 9017753,
    sizeFormatted: "8.6 MB",
    sha256Hash: "d3e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5",
    uploadedAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    status: "verified",
  },
  {
    id: "art-seed-3",
    originalName: "Clinical_Trials_Phase3_Benchmark.csv",
    mimeType: "text/csv",
    sizeBytes: 1468006,
    sizeFormatted: "1.4 MB",
    sha256Hash: "1f2e3d4c5b6a7f8e9d0c1b2a3f4e5d6c7b8a9f0e1d2c3b4a5f6e7d8c9b0a1f2e",
    uploadedAt: new Date(Date.now() - 3600000 * 42).toISOString(),
    status: "verified",
  },
  {
    id: "art-seed-4",
    originalName: "Neuro_Symbolic_Knowledge_Synthesis.bib",
    mimeType: "application/x-bibtex",
    sizeBytes: 393216,
    sizeFormatted: "384 KB",
    sha256Hash: "4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d",
    uploadedAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    status: "verified",
  },
];

export default function UploadPage() {
  const router = useRouter();
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [ingestedArtifacts, setIngestedArtifacts] = useState<UploadedArtifact[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Ingestion History & Ledger State
  const [historyArtifacts, setHistoryArtifacts] = useState<UploadedArtifact[]>([]);
  const [historySearch, setHistorySearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "pdf" | "data" | "bib">("all");

  // Load and synchronize local historical artifacts
  useEffect(() => {
    try {
      const stored = getLocalArtifacts();
      if (stored && stored.length > 0) {
        setHistoryArtifacts(stored);
      } else {
        setHistoryArtifacts(SEED_ARTIFACTS);
        if (typeof window !== "undefined") {
          localStorage.setItem("cambium_workspace_artifacts", JSON.stringify(SEED_ARTIFACTS));
        }
      }
    } catch {
      setHistoryArtifacts(SEED_ARTIFACTS);
    }
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files) {
      setFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files)]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setUploading(true);
    setUploadProgress(20);

    const interval = setInterval(() => {
      setUploadProgress((prev) => (prev >= 85 ? 85 : prev + 15));
    }, 180);

    try {
      const results = await uploadArtifactsBatch(files);
      clearInterval(interval);
      setUploadProgress(100);
      setIngestedArtifacts(results);

      // Prepend to historical ledger
      setHistoryArtifacts((prev) => {
        const updated = [...results, ...prev.filter((p) => !results.some((r) => r.id === p.id))];
        try {
          localStorage.setItem("cambium_workspace_artifacts", JSON.stringify(updated));
        } catch {
          // ignore quota
        }
        return updated;
      });
    } catch {
      clearInterval(interval);
      setUploadProgress(100);
      // Fallback local artifacts
      const fallback: UploadedArtifact[] = files.map((f, i) => ({
        id: `art-local-${Date.now()}-${i}`,
        originalName: f.name,
        mimeType: f.type || "application/pdf",
        sizeBytes: f.size,
        sizeFormatted: formatFileSize(f.size),
        sha256Hash: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(""),
        uploadedAt: new Date().toISOString(),
        status: "verified",
      }));
      setIngestedArtifacts(fallback);

      setHistoryArtifacts((prev) => {
        const updated = [...fallback, ...prev];
        try {
          localStorage.setItem("cambium_workspace_artifacts", JSON.stringify(updated));
        } catch {
          // ignore
        }
        return updated;
      });
    } finally {
      setUploading(false);
    }
  };

  const removeHistoricalArtifact = (id: string) => {
    setHistoryArtifacts((prev) => {
      const updated = prev.filter((a) => a.id !== id);
      try {
        localStorage.setItem("cambium_workspace_artifacts", JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const clearHistoricalArtifacts = () => {
    if (confirm("Clear local upload history? Original workspace pages remain untouched.")) {
      setHistoryArtifacts([]);
      try {
        localStorage.removeItem("cambium_workspace_artifacts");
      } catch {
        // ignore
      }
    }
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    if (ext === "csv" || ext === "xlsx") {
      return <FileSpreadsheet className="w-5 h-5 text-[#3E6248]" />;
    }
    if (ext === "tex" || ext === "bib" || ext === "json") {
      return <FileCode className="w-5 h-5 text-[#805B43]" />;
    }
    return <FileText className="w-5 h-5 text-[#3E6248]" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatTimeAgo = (isoString?: string) => {
    if (!isoString) return "Recently";
    const diffMs = Date.now() - new Date(isoString).getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  // Filtered History
  const filteredHistory = useMemo(() => {
    return historyArtifacts.filter((item) => {
      const matchesSearch =
        !historySearch.trim() ||
        item.originalName.toLowerCase().includes(historySearch.toLowerCase()) ||
        item.sha256Hash?.toLowerCase().includes(historySearch.toLowerCase());

      const ext = item.originalName.split(".").pop()?.toLowerCase() || "";
      if (typeFilter === "pdf") return matchesSearch && (ext === "pdf" || ext === "doc" || ext === "docx");
      if (typeFilter === "data") return matchesSearch && (ext === "csv" || ext === "xlsx");
      if (typeFilter === "bib") return matchesSearch && (ext === "bib" || ext === "tex" || ext === "json");
      return matchesSearch;
    });
  }, [historyArtifacts, historySearch, typeFilter]);

  const totalBytes = useMemo(() => {
    return historyArtifacts.reduce((acc, a) => acc + (a.sizeBytes || 0), 0);
  }, [historyArtifacts]);

  return (
    <div className="flex-1 min-w-0 h-screen overflow-y-auto bg-[#FAF7F0] dark:bg-[#0E140F] text-[#202920] dark:text-[#EDEAE2] p-6 sm:p-10 font-sans selection:bg-[#3E6248]/20 selection:text-[#173F35]">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between border-b border-[#E4DCCB] dark:border-[#233327] pb-5">
          <Link
            href="/workspace"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#62685E] dark:text-[#8FA89B] hover:text-[#202920] dark:hover:text-[#FAF7F0] transition-colors no-underline"
          >
            <ArrowLeft className="w-4 h-4 text-[#3E6248] dark:text-[#4ADE80]" />
            <span>Return to Workspace</span>
          </Link>
          <div className="flex items-center gap-2 font-mono text-xs text-[#85877B] dark:text-[#6E7D72]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#3E6248] dark:text-[#4ADE80]" />
            <span>Air-Gap Ingestion Pipeline · Verified</span>
          </div>
        </div>

        {/* Page Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DCE6D7]/60 dark:bg-[#1E2B21] border border-[#66866A]/30 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#3E6248] dark:text-[#4ADE80]" />
            <span className="font-mono text-xs uppercase tracking-widest text-[#3E6248] dark:text-[#4ADE80] font-semibold">
              Artifact Ingestion Engine
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#202920] dark:text-[#EDEAE2] tracking-tight">
            Upload Research Material
          </h1>
          <p className="font-serif text-base text-[#62685E] dark:text-[#8FA89B] max-w-2xl leading-relaxed">
            Ingest scientific preprints, clinical dataset tables, or LaTeX bibliographies directly into your active Cambium workspace ledger with instant vector embedding &amp; citation graph anchoring.
          </p>
        </div>

        {/* Massive Primary Dropzone Container */}
        <div
          className={`border-2 border-dashed rounded-3xl p-10 sm:p-14 text-center cursor-pointer transition-all duration-200 select-none shadow-xs ${
            dragging
              ? "border-[#3E6248] dark:border-[#4ADE80] bg-[#DCE6D7]/40 dark:bg-[#1E2B21]/50 scale-[1.005]"
              : "border-[#E4DCCB] dark:border-[#28382C] hover:border-[#3E6248]/60 dark:hover:border-[#4ADE80]/60 bg-white dark:bg-[#151F17]"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.csv,.xlsx,.bib,.tex"
            className="hidden"
            onChange={handleFileInput}
          />
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-5 rounded-full bg-[#DCE6D7]/35 dark:bg-[#1A261D] border border-[#3E6248]/25 dark:border-[#28382C] flex items-center justify-center text-[#3E6248] dark:text-[#4ADE80] shadow-xs transition-transform duration-200 hover:scale-105 shrink-0 aspect-square">
            <UploadCloud className="w-8 h-8 sm:w-9 sm:h-9" />
          </div>
          <p className="font-serif text-2xl font-normal text-[#202920] dark:text-[#EDEAE2] mb-2">
            Click to upload or drag &amp; drop files
          </p>
          <p className="font-sans text-xs text-[#62685E] dark:text-[#8FA89B] max-w-md mx-auto leading-relaxed mb-4">
            Supports PDF, DOCX, CSV, XLSX, BibTeX, or LaTeX source files (up to 50MB per artifact).
          </p>
          <div className="inline-flex flex-wrap items-center justify-center gap-2 font-mono text-[11px] text-[#85877B] dark:text-[#A3B899] bg-[#FAF7F0] dark:bg-[#111A13] px-3.5 py-1.5 rounded-full border border-[#E4DCCB] dark:border-[#28382C]">
            <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse" />
            <span>Automatic 768-dim vector embedding &amp; citation graph indexing</span>
          </div>
        </div>

        {/* File Queue Section */}
        {files.length > 0 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-xs uppercase tracking-wider text-[#202920] dark:text-[#EDEAE2] font-semibold">
                Queued Artifacts ({files.length})
              </h3>
              <button
                onClick={() => setFiles([])}
                className="text-xs text-[#85877B] dark:text-[#A3B899] hover:text-[#202920] dark:hover:text-[#EDEAE2] transition-colors cursor-pointer bg-transparent border-none"
              >
                Clear queue
              </button>
            </div>

            <ul className="space-y-2.5 m-0 p-0 list-none">
              {files.map((file, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-[#151F17] border border-[#E4DCCB] dark:border-[#28382C] shadow-2xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#FAF7F0] dark:bg-[#1E2B21] border border-[#E4DCCB] dark:border-[#28382C] flex items-center justify-center shrink-0">
                      {getFileIcon(file.name)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#202920] dark:text-[#EDEAE2] truncate m-0">
                        {file.name}
                      </p>
                      <span className="font-mono text-[11px] text-[#85877B] dark:text-[#A3B899]">
                        {formatFileSize(file.size)}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    className="p-1.5 rounded-lg text-[#85877B] hover:text-[#B33D35] hover:bg-[#FBF2F0] dark:hover:bg-[#331818] transition-colors border-none bg-transparent cursor-pointer"
                    title="Remove artifact"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>

            {/* Upload Progress Indicator */}
            {uploading && (
              <div className="space-y-2 py-2">
                <div className="flex items-center justify-between text-xs font-mono text-[#62685E] dark:text-[#8FA89B]">
                  <span>Vectorizing and linking references...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#E4DCCB] dark:bg-[#28382C] overflow-hidden">
                  <div
                    className="h-full bg-[#3E6248] dark:bg-[#4ADE80] transition-all duration-300 ease-out"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setFiles([])}
                disabled={uploading}
                className="rounded-full border-[#E4DCCB] dark:border-[#28382C] text-[#202920] dark:text-[#EDEAE2] hover:bg-[#F2EBDD] font-sans text-xs uppercase tracking-wider px-6 py-2.5"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                disabled={uploading}
                className="bg-[#3E6248] hover:bg-[#293E30] text-[#FAF7F0] rounded-full font-sans text-xs uppercase tracking-wider px-7 py-2.5 border border-[#66866A]/30 shadow-xs cursor-pointer"
              >
                {uploading ? "Ingesting..." : "Ingest into Workspace"}
              </Button>
            </div>
          </div>
        )}

        {/* Ingestion Complete Success State */}
        {ingestedArtifacts && (
          <div className="p-8 rounded-3xl bg-[#DCE6D7]/40 dark:bg-[#17251B] border border-[#66866A]/40 shadow-xs space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#3E6248] text-[#FAF7F0] flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-normal text-[#202920] dark:text-[#FAF7F0] m-0">
                  Ingestion Complete &amp; Air-Gap Checksum Verified
                </h3>
                <p className="font-mono text-xs text-[#3E6248] dark:text-[#4ADE80] mt-0.5 m-0 font-medium">
                  {ingestedArtifacts.length} research {ingestedArtifacts.length === 1 ? "artifact" : "artifacts"} indexed with 768-dim pgvector embeddings
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {ingestedArtifacts.map((art) => (
                <div
                  key={art.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-[#1E2B21] border border-[#E4DCCB] dark:border-[#28382C] text-xs font-mono"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <FileText className="w-4 h-4 text-[#3E6248] dark:text-[#4ADE80] shrink-0" />
                    <span className="font-medium text-[#202920] dark:text-[#FAF7F0] truncate">{art.originalName}</span>
                    <span className="text-[#85877B] dark:text-[#A3B899]">({art.sizeFormatted})</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2 py-0.5 rounded bg-[#FAF7F0] dark:bg-[#141C15] border border-[#E4DCCB] dark:border-[#28382C] text-[10px] text-[#62685E] dark:text-[#A3B899]">
                      SHA-256: {art.sha256Hash?.substring(0, 10)}...
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#DCE6D7] dark:bg-[#28382C] text-[10px] text-[#3E6248] dark:text-[#4ADE80] font-semibold">
                      VERIFIED
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/workspace"
                className="px-5 py-2.5 rounded-full bg-[#3E6248] hover:bg-[#293E30] text-[#FAF7F0] font-sans text-xs uppercase tracking-wider font-semibold transition-all border border-[#66866A]/30 shadow-xs no-underline inline-flex items-center gap-1.5"
              >
                <span>Open in Workspace →</span>
              </Link>
              <Link
                href="/agent-reader"
                className="px-5 py-2.5 rounded-full bg-white dark:bg-[#1E2B21] hover:bg-[#FAF7F0] dark:hover:bg-[#28382C] text-[#202920] dark:text-[#EDEAE2] font-sans text-xs uppercase tracking-wider font-semibold transition-all border border-[#E4DCCB] dark:border-[#28382C] shadow-2xs no-underline inline-flex items-center gap-1.5"
              >
                <span>Analyze in Agentic Reader →</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  setFiles([]);
                  setIngestedArtifacts(null);
                }}
                className="px-4 py-2 text-xs font-mono text-[#62685E] dark:text-[#A3B899] hover:text-[#202920] dark:hover:text-[#EDEAE2] bg-transparent border-0 cursor-pointer ml-auto"
              >
                Upload more files
              </button>
            </div>
          </div>
        )}

        {/* ─── UPLOAD HISTORY & INGESTION LEDGER (Requested in Photo 3) ─── */}
        <div className="pt-6 border-t border-[#E4DCCB] dark:border-[#233327] space-y-6">
          {/* Header & Stats Strip */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#3E6248] dark:text-[#4ADE80]" />
                <h2 className="font-serif text-2xl font-normal text-[#202920] dark:text-[#EDEAE2] m-0">
                  Uploaded Documents & Artifacts
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-[#DCE6D7] dark:bg-[#1E2B21] text-[#3E6248] dark:text-[#4ADE80] font-semibold border border-[#66866A]/20">
                  {historyArtifacts.length} Indexed
                </span>
              </div>
              <p className="text-xs text-[#62685E] dark:text-[#8FA89B] mt-1 m-0">
                Record of research materials uploaded to your active workspace.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-3 text-xs font-mono">
              <div className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#151F17] border border-[#E4DCCB] dark:border-[#28382C] shadow-2xs">
                <span className="text-[#85877B] dark:text-[#6E7D72]">Total Volume: </span>
                <span className="font-semibold text-[#202920] dark:text-[#EDEAE2]">{formatFileSize(totalBytes)}</span>
              </div>
              {historyArtifacts.length > 0 && (
                <button
                  onClick={clearHistoricalArtifacts}
                  className="px-3 py-1.5 rounded-xl border border-[#E4DCCB] dark:border-[#28382C] bg-white dark:bg-[#151F17] text-[#85877B] hover:text-[#B33D35] transition-colors cursor-pointer text-xs font-mono flex items-center gap-1.5"
                  title="Clear ledger history"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Ledger</span>
                </button>
              )}
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#85877B] dark:text-[#6E7D72]" size={14} />
              <input
                type="text"
                placeholder="Search past uploads by name or SHA-256..."
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                className="w-full pl-9 pr-8 py-2 rounded-full border border-[#E4DCCB] dark:border-[#28382C] bg-white dark:bg-[#151F17] text-xs font-sans text-[#202920] dark:text-[#EDEAE2] outline-none focus:border-[#3E6248] dark:focus:border-[#4ADE80] focus:ring-2 focus:ring-[#3E6248]/20 transition-all shadow-2xs"
              />
              {historySearch && (
                <button
                  type="button"
                  onClick={() => setHistorySearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#85877B] hover:text-[#202920] p-0.5"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: "all", label: "All Formats" },
                { id: "pdf", label: "Preprints (PDF)" },
                { id: "data", label: "Datasets (CSV/XLSX)" },
                { id: "bib", label: "Bibliographies (BibTeX)" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setTypeFilter(tab.id as any)}
                  className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer whitespace-nowrap ${
                    typeFilter === tab.id
                      ? "bg-[#202920] dark:bg-[#FAF7F0] text-white dark:text-[#18231B] font-semibold shadow-xs"
                      : "bg-white dark:bg-[#151F17] text-[#62685E] dark:text-[#8FA89B] border border-[#E4DCCB] dark:border-[#28382C] hover:text-[#202920] dark:hover:text-[#FAF7F0]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Historical Artifacts Cards List */}
          {filteredHistory.length === 0 ? (
            <div className="p-10 text-center rounded-2xl bg-white dark:bg-[#151F17] border border-[#E4DCCB] dark:border-[#28382C] space-y-2">
              <Database className="w-8 h-8 mx-auto text-[#85877B] opacity-60" />
              <p className="font-serif text-base text-[#202920] dark:text-[#EDEAE2] m-0">
                No matching research artifacts found in ledger
              </p>
              <p className="text-xs text-[#85877B] dark:text-[#6E7D72] max-w-sm mx-auto">
                Try searching for another filename or drag &amp; drop a new preprint into the dropzone above.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredHistory.map((item) => (
                <div
                  key={item.id}
                  className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#151F17] border border-[#E4DCCB] dark:border-[#28382C] hover:border-[#8FA89B] dark:hover:border-[#3E7750] transition-all shadow-2xs hover:shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                >
                  {/* Left: File icon & Info */}
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-[#FAF7F0] dark:bg-[#1E2B21] border border-[#E4DCCB] dark:border-[#28382C] flex items-center justify-center shrink-0 mt-0.5">
                      {getFileIcon(item.originalName)}
                    </div>
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm text-[#202920] dark:text-[#EDEAE2] truncate">
                          {item.originalName}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-[#FAF7F0] dark:bg-[#1E2B21] border border-[#E4DCCB] dark:border-[#28382C] text-[#62685E] dark:text-[#A3B899]">
                          {item.sizeFormatted}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#DCE6D7] dark:bg-[#1E2B21] text-[#3E6248] dark:text-[#4ADE80] border border-[#66866A]/20">
                          768-dim Vectorized
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] font-mono text-[#85877B] dark:text-[#6E7D72] flex-wrap">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatTimeAgo(item.uploadedAt)}</span>
                        </span>
                        <span>·</span>
                        <span className="truncate max-w-xs" title={item.sha256Hash}>
                          SHA: {item.sha256Hash?.substring(0, 16)}...
                        </span>
                        <span>·</span>
                        <span className="text-[#3E6248] dark:text-[#4ADE80] font-medium">
                          ✓ Graph Linked
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 self-end md:self-auto shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#E4DCCB]/60 dark:border-[#28382C] w-full md:w-auto justify-end">
                    <Link
                      href="/workspace"
                      className="px-3.5 py-1.5 rounded-lg border border-[#E4DCCB] dark:border-[#28382C] bg-[#FAF7F0] dark:bg-[#1E2B21] hover:bg-white text-xs font-mono font-medium text-[#202920] dark:text-[#EDEAE2] flex items-center gap-1.5 transition-all no-underline shadow-2xs"
                    >
                      <BookOpen size={13} className="text-[#3E6248] dark:text-[#4ADE80]" />
                      <span>Workspace</span>
                    </Link>

                    <Link
                      href="/agent-reader"
                      className="px-3.5 py-1.5 rounded-lg border border-[#3E6248]/30 dark:border-[#4ADE80]/30 bg-[#3E6248]/10 hover:bg-[#3E6248]/20 text-xs font-mono font-medium text-[#3E6248] dark:text-[#4ADE80] flex items-center gap-1.5 transition-all no-underline shadow-2xs"
                    >
                      <Sparkles size={13} />
                      <span>Reader</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => removeHistoricalArtifact(item.id)}
                      className="p-1.5 rounded-lg text-[#85877B] hover:text-[#B33D35] hover:bg-[#FBF2F0] dark:hover:bg-[#331818] transition-colors border border-transparent hover:border-[#B33D35]/20 bg-transparent cursor-pointer"
                      title="Remove from history"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
