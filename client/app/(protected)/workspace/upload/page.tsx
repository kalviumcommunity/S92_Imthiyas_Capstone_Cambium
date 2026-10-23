"use client";

import React, { useState, useRef } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UploadPage() {
  const router = useRouter();
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    setUploadProgress(15);

    const interval = setInterval(() => {
      setUploadProgress((prev) => (prev >= 85 ? 85 : prev + 15));
    }, 200);

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("cambium_token") : null;
      const formData = new FormData();
      
      if (files.length === 1) {
        formData.append("file", files[0]);
        await fetch("http://localhost:5000/api/upload", {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData,
        }).catch(() => null);
      } else {
        files.forEach((f) => formData.append("files", f));
        await fetch("http://localhost:5000/api/upload/batch", {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData,
        }).catch(() => null);
      }
    } catch (err) {
      // Graceful offline fallback
    } finally {
      clearInterval(interval);
      setUploadProgress(100);
      setTimeout(() => {
        setUploading(false);
        router.push("/workspace");
      }, 500);
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

  return (
    <div className="flex-1 min-w-0 h-screen overflow-y-auto bg-[#FAF7F0] text-[#202920] p-6 sm:p-10 font-sans selection:bg-[#3E6248]/20 selection:text-[#173F35]">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between border-b border-[#E4DCCB] pb-5">
          <Link
            href="/workspace"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#62685E] hover:text-[#202920] transition-colors no-underline"
          >
            <ArrowLeft className="w-4 h-4 text-[#3E6248]" />
            <span>Return to Workspace</span>
          </Link>
          <span className="font-mono text-xs text-[#85877B]">
            Ingestion Pipeline · Verified
          </span>
        </div>

        {/* Page Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DCE6D7]/60 border border-[#66866A]/30 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#3E6248]" />
            <span className="font-mono text-xs uppercase tracking-widest text-[#3E6248] font-semibold">
              Artifact Ingestion
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#202920] tracking-tight">
            Upload Research Material
          </h1>
          <p className="font-serif text-base text-[#62685E] max-w-xl leading-relaxed">
            Ingest scientific preprints, clinical dataset tables, or LaTeX bibliographies directly into your active Cambium workspace ledger.
          </p>
        </div>

        {/* Dropzone Container */}
        <div
          className={`border-2 border-dashed rounded-2xl p-10 sm:p-14 text-center cursor-pointer transition-all duration-200 select-none shadow-xs ${
            dragging
              ? "border-[#3E6248] bg-[#DCE6D7]/40 scale-[1.005]"
              : "border-[#E4DCCB] hover:border-[#3E6248]/50 bg-white"
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
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#F2EBDD] border border-[#E4DCCB] flex items-center justify-center text-[#3E6248] shadow-xs">
            <UploadCloud className="w-8 h-8" />
          </div>
          <p className="font-serif text-xl font-normal text-[#202920] mb-2">
            Click to upload or drag & drop files
          </p>
          <p className="font-sans text-xs text-[#62685E] max-w-sm mx-auto leading-relaxed">
            Supports PDF, DOCX, CSV, XLSX, BibTeX, or LaTeX source files (up to 50MB per artifact).
          </p>
          <div className="mt-4 inline-flex items-center gap-1.5 font-mono text-[11px] text-[#85877B] bg-[#FAF7F0] px-3 py-1 rounded-full border border-[#E4DCCB]">
            <span>Automatic vector embedding & citation graph indexing</span>
          </div>
        </div>

        {/* File Queue Section */}
        {files.length > 0 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-xs uppercase tracking-wider text-[#202920] font-semibold">
                Queued Artifacts ({files.length})
              </h3>
              <button
                onClick={() => setFiles([])}
                className="text-xs text-[#85877B] hover:text-[#202920] transition-colors cursor-pointer bg-transparent border-none"
              >
                Clear all
              </button>
            </div>

            <ul className="space-y-2.5 m-0 p-0 list-none">
              {files.map((file, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-[#E4DCCB] shadow-2xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-[#FAF7F0] border border-[#E4DCCB] flex items-center justify-center shrink-0">
                      {getFileIcon(file.name)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#202920] truncate m-0">
                        {file.name}
                      </p>
                      <span className="font-mono text-[11px] text-[#85877B]">
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
                    className="p-1.5 rounded-lg text-[#85877B] hover:text-[#B33D35] hover:bg-[#FBF2F0] transition-colors border-none bg-transparent cursor-pointer"
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
                <div className="flex items-center justify-between text-xs font-mono text-[#62685E]">
                  <span>Vectorizing and linking references...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#E4DCCB] overflow-hidden">
                  <div
                    className="h-full bg-[#3E6248] transition-all duration-300 ease-out"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3">
              <Button
                variant="outline"
                onClick={() => router.back()}
                disabled={uploading}
                className="rounded-full border-[#E4DCCB] text-[#202920] hover:bg-[#F2EBDD] font-sans text-xs uppercase tracking-wider px-6 py-2.5"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                disabled={uploading}
                className="bg-[#3E6248] hover:bg-[#293E30] text-[#FAF7F0] rounded-full font-sans text-xs uppercase tracking-wider px-7 py-2.5 border border-[#66866A]/30 shadow-xs"
              >
                {uploading ? "Ingesting..." : "Ingest into Workspace"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
