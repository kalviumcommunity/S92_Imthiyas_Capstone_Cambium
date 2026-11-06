"use client";

import React, { useState } from "react";
import { Sparkles, Brain, Search, FileText, CheckCircle2, CornerDownLeft, RefreshCw, Cpu } from "lucide-react";
import { AiAutocompleteInput } from "./AiAutocompleteInput";
import { useAiAutocomplete } from "@/lib/ai/useAiAutocomplete";

export function AiAutocompleteCopilotStudio() {
  const [activeTab, setActiveTab] = useState<"search" | "copilot">("search");
  const [selectedResult, setSelectedResult] = useState<string>("");

  // Copilot text area state
  const {
    value: copilotText,
    setValue: setCopilotText,
    ghostText: copilotGhost,
    suggestions: copilotSuggestions,
    isLoading: isCopilotLoading,
    source: copilotSource,
    latencyMs: copilotLatency,
    acceptGhostText: acceptCopilotGhost,
    handleKeyDown: handleCopilotKeyDown,
  } = useAiAutocomplete({
    mode: "copilot",
    context: "Post-quantum cryptographic key exchange and genomic data protection grant proposal.",
  });

  const SAMPLE_SEARCH_PROMPTS = [
    "quantum error correction",
    "CRISPR-Cas9 genomic editing",
    "deep generative models for molecular",
    "post-quantum cryptographic primitives",
    "cancer immunotherapy tumor microenvironment",
  ];

  const SAMPLE_COPILOT_STARTERS = [
    "The primary objective of this investigation is to",
    "In this paper we demonstrate",
    "Our experimental results reveal that",
    "We hypothesize that lattice-based",
    "To address this critical challenge, we propose",
  ];

  return (
    <div className="w-full bg-[#FAF7F0] dark:bg-[#141E16] border border-[#E4DCCB] dark:border-[#28382C] rounded-3xl p-6 sm:p-8 shadow-sm">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E4DCCB] dark:border-[#28382C]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-[#DCE6D7] dark:bg-[#233527] text-[#3E6248] dark:text-[#4ADE80]">
              <Sparkles size={12} />
              AI-ASSISTED AUTOCOMPLETE ACTIVE
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-white dark:bg-[#1E2B21] border border-[#E4DCCB] dark:border-[#28382C] text-[#62685E] dark:text-[#9DA39A]">
              Google Gemini 1.5 Flash
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#202920] dark:text-[#EDEAE2]">
            Scholarly Intelligence Autocomplete Studio
          </h2>
          <p className="text-xs sm:text-sm text-[#62685E] dark:text-[#9DA39A] font-sans">
            Real-time context-aware ghost completions for academic search queries and research proposal drafting.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center p-1 bg-white dark:bg-[#1A261D] border border-[#E4DCCB] dark:border-[#28382C] rounded-xl self-start">
          <button
            type="button"
            onClick={() => setActiveTab("search")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "search"
                ? "bg-[#3E6248] text-white shadow-xs"
                : "text-[#62685E] dark:text-[#9DA39A] hover:text-[#202920] dark:hover:text-white"
            }`}
          >
            <Search size={14} />
            <span>Search Query Autocomplete</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("copilot")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "copilot"
                ? "bg-[#3E6248] text-white shadow-xs"
                : "text-[#62685E] dark:text-[#9DA39A] hover:text-[#202920] dark:hover:text-white"
            }`}
          >
            <FileText size={14} />
            <span>Proposal Copilot Drafting</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="pt-6">
        {activeTab === "search" ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-[#85877B] uppercase tracking-wider block">
                Type Search Prefix (Experience Inline Ghost Text & Tab Completion)
              </label>
              <AiAutocompleteInput
                placeholder="Try typing 'quantum error', 'crispr', or 'deep generative'..."
                mode="search"
                onSelect={(val) => setSelectedResult(val)}
              />
            </div>

            {/* Quick Interactive Click-to-Test Prompts */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono text-[#85877B] block">
                Click sample scholarly prompts to test autocomplete suggestions:
              </span>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_SEARCH_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedResult(prompt)}
                    className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#1A261D] border border-[#E4DCCB] dark:border-[#28382C] hover:border-[#3E6248] text-xs text-[#202920] dark:text-[#EDEAE2] transition-colors cursor-pointer shadow-2xs"
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>
            </div>

            {selectedResult && (
              <div className="p-4 rounded-2xl bg-[#DCE6D7]/40 dark:bg-[#1E2B21]/50 border border-[#DCE6D7] dark:border-[#28382C] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-[#3E6248] dark:text-[#4ADE80]" />
                  <span className="text-xs text-[#202920] dark:text-[#EDEAE2]">
                    Selected Query: <strong>{selectedResult}</strong>
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#3E6248] dark:text-[#4ADE80] font-bold">
                  VERIFIED BY LLM AUTOCOMPLETE
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-bold text-[#85877B] uppercase tracking-wider">
                  Academic Proposal Editor (Type & Press Tab to Accept AI Ghost Completion)
                </label>
                {copilotGhost && (
                  <button
                    type="button"
                    onClick={acceptCopilotGhost}
                    className="px-2.5 py-1 bg-[#3E6248] text-white rounded-lg text-[11px] font-mono flex items-center gap-1.5 cursor-pointer hover:bg-[#293E30] transition-colors"
                  >
                    <span>Accept Ghost Text</span>
                    <CornerDownLeft size={10} />
                  </button>
                )}
              </div>

              {/* Copilot Textarea with Layered Ghost Text */}
              <div className="relative w-full rounded-2xl border-2 border-[#E4DCCB] dark:border-[#28382C] focus-within:border-[#3E6248] dark:focus-within:border-[#4ADE80] bg-white dark:bg-[#1A261D] p-4 transition-all shadow-sm">
                {/* Ghost Text Overlay */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 p-4 pointer-events-none whitespace-pre-wrap font-serif text-base leading-relaxed text-[#85877B] dark:text-[#6E7B70] overflow-hidden"
                >
                  <span className="opacity-0">{copilotText}</span>
                  <span className="text-[#3E6248] dark:text-[#4ADE80] opacity-75 font-normal select-none underline decoration-dotted decoration-[#4ADE80]/50 underline-offset-4">
                    {copilotGhost}
                  </span>
                </div>

                {/* Interactive Editor Input */}
                <textarea
                  rows={4}
                  value={copilotText}
                  onChange={(e) => setCopilotText(e.target.value)}
                  onKeyDown={handleCopilotKeyDown}
                  placeholder="Draft your proposal aims... E.g. 'The primary objective of this investigation is to'"
                  className="w-full bg-transparent font-serif text-base leading-relaxed text-[#202920] dark:text-[#EDEAE2] placeholder-[#85877B] focus:outline-none resize-none z-10 relative"
                  spellCheck="false"
                />

                {/* Footer Toolbar */}
                <div className="flex items-center justify-between pt-3 border-t border-[#E4DCCB]/60 dark:border-[#28382C]/60 text-xs text-[#85877B]">
                  <div className="flex items-center gap-2">
                    <Brain size={14} className="text-[#3E6248] dark:text-[#4ADE80]" />
                    <span className="font-mono text-[11px]">
                      {isCopilotLoading ? "Generating completions..." : `Copilot Engine: ${copilotSource} (${copilotLatency}ms)`}
                    </span>
                  </div>
                  <span className="font-mono text-[11px]">Press [Tab] to accept inline suggestion</span>
                </div>
              </div>
            </div>

            {/* Quick Starters */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono text-[#85877B] block">
                Click a hypothesis starter to see real-time AI completion:
              </span>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_COPILOT_STARTERS.map((starter, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCopilotText(starter)}
                    className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#1A261D] border border-[#E4DCCB] dark:border-[#28382C] hover:border-[#3E6248] text-xs text-[#202920] dark:text-[#EDEAE2] transition-colors cursor-pointer shadow-2xs"
                  >
                    "{starter}"
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Architecture Provenance Footer */}
      <div className="mt-8 pt-4 border-t border-[#E4DCCB] dark:border-[#28382C] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#62685E] dark:text-[#9DA39A]">
        <div className="flex items-center gap-2">
          <Cpu size={14} className="text-[#3E6248] dark:text-[#4ADE80]" />
          <span>Endpoint: <code className="px-1.5 py-0.5 rounded bg-white dark:bg-[#1A261D] border border-[#E4DCCB] font-mono text-[11px]">POST /api/v1/ai/autocomplete</code></span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse" />
            Academic RAG Fallback Ready
          </span>
          <span>·</span>
          <span>Inline Ghost Text Active</span>
        </div>
      </div>
    </div>
  );
}
