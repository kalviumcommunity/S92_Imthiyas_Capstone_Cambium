"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Network,
  MessageSquare,
  Quote,
  Sparkles,
  ExternalLink,
  X,
  Copy,
  Check,
  Bookmark,
  Share2,
  Highlighter,
  Sliders,
} from "lucide-react";
import { useToast } from "@/components/ui/toast";

export interface SplitPaneReaderProps {
  onClose: () => void;
  onOpenCitation: () => void;
  onOpenAi: () => void;
}

export function SplitPaneReader({ onClose, onOpenCitation, onOpenAi }: SplitPaneReaderProps) {
  const [activeTab, setActiveTab] = useState<"doc" | "graph" | "annotations">("doc");
  const [copiedDoi, setCopiedDoi] = useState(false);
  const { toast } = useToast();

  const handleCopyDoi = () => {
    navigator.clipboard.writeText("10.48550/arXiv.1706.03762");
    setCopiedDoi(true);
    toast({
      title: "DOI Copied",
      description: "https://doi.org/10.48550/arXiv.1706.03762 copied to clipboard.",
    });
    setTimeout(() => setCopiedDoi(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#FFFFFF] font-sans border-l border-[#E4DCCB] text-[#202920] select-text">
      {/* Split Pane Header */}
      <div className="px-4 py-3 border-b border-[#E4DCCB] bg-[#FAF7F0] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <span className="px-1.5 py-0.5 rounded bg-[#DCE6D7] text-[#3E6248] font-mono text-[10px] font-bold uppercase tracking-wider shrink-0">
            SPLIT READER
          </span>
          <div className="min-w-0">
            <h3 className="font-serif text-[13.5px] font-semibold text-[#202920] truncate m-0">
              Vaswani et al. · Attention Is All You Need
            </h3>
            <span className="text-[11px] text-[#85877B] font-mono">NeurIPS 2024 · 42 Pages</span>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onOpenCitation}
            title="Citation Engine (APA/BibTeX)"
            className="p-1.5 rounded-md hover:bg-[#F2EBDD] text-[#62685E] hover:text-[#202920] transition-colors cursor-pointer border-0 bg-transparent"
          >
            <Quote className="w-3.5 h-3.5 text-[#3E6248]" />
          </button>
          <button
            onClick={onOpenAi}
            title="AI Literature Extraction"
            className="p-1.5 rounded-md hover:bg-[#F2EBDD] text-[#62685E] hover:text-[#202920] transition-colors cursor-pointer border-0 bg-transparent"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#3E6248]" />
          </button>
          <Link
            href="/reader"
            title="Open Dedicated Full-Screen Reader"
            className="p-1.5 rounded-md hover:bg-[#F2EBDD] text-[#62685E] hover:text-[#202920] transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={onClose}
            title="Close Split View (⌘\)"
            className="p-1.5 rounded-md hover:bg-[#FBF1F0] hover:text-[#B33D35] text-[#85877B] transition-colors cursor-pointer border-0 bg-transparent ml-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 border-b border-[#E4DCCB] bg-white flex items-center gap-4 text-[12px] shrink-0">
        {[
          { id: "doc", label: "Document", icon: FileText },
          { id: "graph", label: "Topology", icon: Network },
          { id: "annotations", label: "Margin Notes (3)", icon: MessageSquare },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 py-2.5 border-b-2 font-medium transition-colors cursor-pointer bg-transparent border-t-0 border-x-0 ${
                isActive
                  ? "border-[#3E6248] text-[#202920]"
                  : "border-transparent text-[#85877B] hover:text-[#62685E]"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#3E6248]" : ""}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Pane Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {activeTab === "doc" && (
          <div className="space-y-5 animate-in fade-in duration-150">
            {/* Metadata Card */}
            <div className="p-3.5 bg-[#FAF7F0] border border-[#E4DCCB] rounded-xl space-y-2">
              <h2 className="font-serif text-[17px] font-semibold text-[#202920] leading-snug m-0">
                Attention Is All You Need: Revisiting Transformer Architectures for Long-Context Reasoning
              </h2>
              <div className="text-[12px] text-[#62685E] leading-relaxed">
                Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Łukasz Kaiser, Illia Polosukhin
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-[#E4DCCB]/60 text-[11px] font-mono">
                <span className="text-[#85877B]">arXiv:1706.03762v7 [cs.CL]</span>
                <button
                  type="button"
                  onClick={handleCopyDoi}
                  className="inline-flex items-center gap-1 text-[#3E6248] hover:underline bg-transparent border-0 cursor-pointer p-0 font-medium"
                >
                  {copiedDoi ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedDoi ? "DOI Copied" : "Copy DOI"}</span>
                </button>
              </div>
            </div>

            {/* Abstract with active annotations */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10.5px] uppercase font-bold tracking-wider text-[#85877B]">
                  Abstract & Key Formulation
                </span>
                <span className="text-[10px] text-[#3E6248] font-mono">3 Verified Highlights</span>
              </div>
              <div className="p-4 rounded-xl bg-white border border-[#E4DCCB] text-[13px] leading-relaxed text-[#202920] space-y-3 font-serif">
                <p className="m-0">
                  The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism.
                </p>
                <p className="m-0 bg-[#DCE6D7]/60 px-2 py-1 rounded border-l-2 border-[#3E6248]">
                  <strong className="font-sans font-semibold text-[#3E6248] block text-[11px] uppercase tracking-wide">
                    Key Takeaway · O(1) Path Length
                  </strong>
                  We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely.
                </p>
                <p className="m-0 bg-[#FBF5E8] px-2 py-1 rounded border-l-2 border-[#7E5812]">
                  <strong className="font-sans font-semibold text-[#7E5812] block text-[11px] uppercase tracking-wide">
                    Research Gap · Computational Scalability
                  </strong>
                  In models like ConvS2S and ByteNet, the number of operations required to relate signals from two arbitrary positions grows with distance, making long-range context prohibitive.
                </p>
                <p className="m-0 bg-[#DCE6D7]/30 px-2 py-1 rounded border-l-2 border-[#365F8D]">
                  <strong className="font-sans font-semibold text-[#365F8D] block text-[11px] uppercase tracking-wide">
                    Empirical Baseline
                  </strong>
                  Experiments show these models to be superior in quality while being significantly more parallelizable and requiring less training time (12h on 8 P100 GPUs).
                </p>
              </div>
            </div>

            {/* Section 3 Math Block */}
            <div className="p-3.5 bg-[#FAF7F0] border border-[#E4DCCB] rounded-xl space-y-2">
              <span className="font-mono text-[11px] font-semibold text-[#62685E]">
                Equation (1) · Scaled Dot-Product Attention
              </span>
              <div className="p-3 bg-white border border-[#E4DCCB] rounded-lg font-mono text-center text-[13px] text-[#202920]">
                Attention(Q, K, V) = softmax( (Q · Kᵀ) / √dₖ ) · V
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#85877B]">
                <span>Matrix dimensions: Q, K ∈ ℝⁿˣᵈ, V ∈ ℝⁿˣᵈ</span>
                <button
                  onClick={onOpenCitation}
                  className="text-[#3E6248] hover:underline bg-transparent border-0 cursor-pointer p-0"
                >
                  Insert Citation [1] in Notebook
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "graph" && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="text-[12.5px] text-[#62685E]">
              Spatial connection graph linking this paper to your active notebook sections:
            </div>
            <div className="h-64 rounded-xl border border-[#E4DCCB] bg-[#FAF7F0] p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#85877B]">
                <span>Vaswani et al. (2024)</span>
                <span className="text-[#3E6248]">4 Direct In-Degree Citations</span>
              </div>
              <div className="flex items-center justify-around">
                <div className="p-2.5 bg-white border border-[#3E6248] rounded-xl text-center shadow-2xs">
                  <div className="font-serif font-bold text-xs text-[#202920]">Vaswani (2024)</div>
                  <div className="text-[10px] text-[#3E6248] font-mono">Foundational ViT</div>
                </div>
                <div className="text-[#3E6248] font-mono text-sm">──▶</div>
                <div className="p-2.5 bg-[#DCE6D7] border border-[#3E6248] rounded-xl text-center shadow-2xs">
                  <div className="font-serif font-bold text-xs text-[#202920]">Your Notebook</div>
                  <div className="text-[10px] text-[#202920] font-mono">Medical Segmentation</div>
                </div>
              </div>
              <div className="text-[11px] text-center text-[#85877B] font-mono">
                Similarity Score: 94.2% across 3 active hypotheses
              </div>
            </div>
          </div>
        )}

        {activeTab === "annotations" && (
          <div className="space-y-3 animate-in fade-in duration-150">
            {[
              {
                author: "Dr. Elena Vance",
                time: "2h ago",
                role: "Lead Author",
                content:
                  "Self-attention allows O(1) path length between any two positions — critical for long-range cardiac MRI telemetry.",
                tag: "Methodology Note",
                tagColor: "bg-[#DCE6D7] text-[#3E6248]",
              },
              {
                author: "Dr. Marcus Chen",
                time: "4h ago",
                role: "Collaborator",
                content:
                  "Check if sinusoidal positional encoding holds when scaling to 10k token EHR sequences or if RoPE performs better.",
                tag: "Hypothesis Gap",
                tagColor: "bg-[#FBF5E8] text-[#7E5812]",
              },
              {
                author: "Cambium AI Agent",
                time: "Yesterday",
                role: "System Synthesizer",
                content:
                  "Grounding verified with 142 downstream papers in MICCAI 2026 proceedings. No citation conflicts identified.",
                tag: "Verified Anchor",
                tagColor: "bg-[#FAF7F0] text-[#365F8D] border border-[#E4DCCB]",
              },
            ].map((n, idx) => (
              <div key={idx} className="p-3.5 bg-white border border-[#E4DCCB] rounded-xl space-y-1.5">
                <div className="flex items-center justify-between text-[11.5px]">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-[#202920]">{n.author}</span>
                    <span className="text-[10px] text-[#85877B]">({n.role})</span>
                  </div>
                  <span className="text-[10.5px] font-mono text-[#85877B]">{n.time}</span>
                </div>
                <p className="text-[12.5px] text-[#62685E] m-0 leading-relaxed font-sans">{n.content}</p>
                <div className="pt-1 flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium ${n.tagColor}`}>
                    {n.tag}
                  </span>
                  <button
                    onClick={onOpenCitation}
                    className="text-[10.5px] text-[#3E6248] hover:underline bg-transparent border-0 cursor-pointer p-0"
                  >
                    Cite in Editor
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
