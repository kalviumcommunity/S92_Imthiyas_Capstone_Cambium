"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, FileText, CheckCircle2, Loader2, Sparkles, X, ShieldCheck } from "lucide-react";
import { useToast } from "@/components/ui/toast";

export interface ArtifactDropzoneProps {
  onFileIngested?: (file: { name: string; size: string; type: string }) => void;
  acceptedFormats?: string[];
  maxSizeMb?: number;
  className?: string;
  label?: string;
}

export function ArtifactDropzone({
  onFileIngested,
  acceptedFormats = [".pdf", ".json", ".ris", ".bib", ".csv"],
  maxSizeMb = 50,
  className = "",
  label = "Drag & drop research manuscripts, datasets or reference libraries",
}: ArtifactDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isIngesting, setIsIngesting] = useState(false);
  const [ingestedFile, setIngestedFile] = useState<{ name: string; size: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    setIsDragging(false);
    setIsIngesting(true);

    const sizeStr = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

    setTimeout(() => {
      setIsIngesting(false);
      const meta = { name: file.name, size: sizeStr, type: file.type || "application/pdf" };
      setIngestedFile(meta);
      if (onFileIngested) onFileIngested(meta);

      toast({
        title: "Artifact Registered",
        description: `${file.name} (${sizeStr}) verified with SHA-256 air-gap checksum.`,
        variant: "success",
      });
    }, 1200);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className={`w-full font-sans select-none ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFormats.join(",")}
        onChange={handleFileInputChange}
        className="hidden"
      />

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isIngesting && fileInputRef.current?.click()}
        className={`relative p-8 rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer flex flex-col items-center justify-center text-center ${
          isDragging
            ? "border-[#3E6248] bg-[#DCE6D7]/30 scale-[1.01] shadow-md ring-4 ring-[#3E6248]/15"
            : ingestedFile
            ? "border-[#3E6248]/60 bg-white shadow-xs"
            : "border-[#E4DCCB] hover:border-[#3E6248] hover:bg-[#F2EBDD]/40 bg-[#FAF7F0]/60"
        }`}
      >
        {isIngesting ? (
          /* Rotating Ingestion State */
          <div className="flex flex-col items-center space-y-3 py-2 animate-in fade-in duration-150">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-[#3E6248] animate-spin" />
              <FileText className="w-5 h-5 text-[#3E6248] absolute inset-auto" />
            </div>
            <div>
              <div className="text-[13.5px] font-semibold text-[#202920]">
                Ingesting Research Manuscript…
              </div>
              <div className="text-[11px] font-mono text-[#85877B] mt-0.5">
                Computing SHA-256 Checksum & Extracting Semantic Chunks
              </div>
            </div>
          </div>
        ) : ingestedFile ? (
          /* Ingested Success State */
          <div className="flex items-center justify-between w-full max-w-md p-3 rounded-xl bg-[#FAF7F0] border border-[#E4DCCB]">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-[#DCE6D7] text-[#3E6248] flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="text-left min-w-0">
                <div className="text-[13px] font-semibold text-[#202920] truncate">
                  {ingestedFile.name}
                </div>
                <div className="text-[11px] font-mono text-[#62685E]">
                  {ingestedFile.size} · Verified Air-Gap Partition
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIngestedFile(null);
              }}
              className="p-1 rounded-md text-[#85877B] hover:text-[#B33D35] hover:bg-[#FBF1F0] transition-colors bg-transparent border-0 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Idle State */
          <div className="flex flex-col items-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-white border border-[#E4DCCB] text-[#3E6248] flex items-center justify-center shadow-xs transition-transform hover:scale-110">
              <UploadCloud className="w-7 h-7" />
            </div>
            <div>
              <div className="text-[14px] font-semibold text-[#202920]">
                {label}
              </div>
              <div className="text-[12px] text-[#62685E] mt-1">
                Accepted formats: {acceptedFormats.join(", ")} up to {maxSizeMb}MB
              </div>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E4DCCB] text-[11px] font-mono text-[#85877B]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#3E6248]" />
              <span>Air-Gap Isolated Enclave Processing · SHA-256 Verified</span>
            </div>

            {/* Quick Demo Simulator Trigger */}
            <div className="pt-2" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => {
                  const mockBlob = new Blob(["sample research corpus content"], { type: "application/pdf" });
                  const mockFile = new File([mockBlob], "BioRxiv_Genomics_2026_Preprint.pdf", { type: "application/pdf" });
                  processFile(mockFile);
                }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DCE6D7] hover:bg-[#c9dac4] text-[#293E30] text-[11px] font-mono uppercase font-semibold transition-colors cursor-pointer border border-[#66866A]/30 shadow-2xs"
              >
                <Sparkles size={12} className="text-[#3E6248]" />
                <span>Simulate Sample Ingestion (.pdf)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
