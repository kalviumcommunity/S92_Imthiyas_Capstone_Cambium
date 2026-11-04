"use client";

import React, { useRef } from "react";
import { Sparkles, ArrowRight, CornerDownLeft, Zap } from "lucide-react";
import { useAiAutocomplete } from "@/lib/ai/useAiAutocomplete";

interface AiAutocompleteInputProps {
  placeholder?: string;
  mode?: "search" | "copilot" | "keywords";
  context?: string;
  onSelect?: (value: string) => void;
  className?: string;
  id?: string;
}

export function AiAutocompleteInput({
  placeholder = "Search research concepts, grant RFPs, DOIs...",
  mode = "search",
  context = "",
  onSelect,
  className = "",
  id = "ai-autocomplete-input",
}: AiAutocompleteInputProps) {
  const {
    value,
    setValue,
    ghostText,
    suggestions,
    isLoading,
    source,
    latencyMs,
    isOpen,
    setIsOpen,
    selectedIndex,
    acceptGhostText,
    selectSuggestion,
    handleKeyDown,
  } = useAiAutocomplete({ mode, context });

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleItemClick = (item: string) => {
    selectSuggestion(item);
    if (onSelect) onSelect(item);
  };

  const handleTabClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const completed = acceptGhostText();
    if (onSelect) onSelect(completed);
    inputRef.current?.focus();
  };

  return (
    <div className={`relative w-full ${className}`}>
      {/* Outer Glow Container */}
      <div className="relative flex items-center bg-[#FAF7F0] dark:bg-[#1A261D] border-2 border-[#E4DCCB] dark:border-[#28382C] focus-within:border-[#3E6248] dark:focus-within:border-[#4ADE80] rounded-2xl shadow-sm transition-all duration-200">
        {/* Left AI Sparkle Icon */}
        <div className="pl-4 pr-2 flex items-center justify-center text-[#3E6248] dark:text-[#4ADE80]">
          <Sparkles size={18} className={isLoading ? "animate-spin" : ""} />
        </div>

        {/* Text Input with Layered Ghost Text */}
        <div className="relative flex-1 py-3 pr-4 flex items-center">
          {/* Ghost Text Overlay (Rendered directly behind/beneath the input) */}
          <div
            aria-hidden="true"
            className="absolute inset-0 flex items-center py-3 pr-4 pointer-events-none overflow-hidden whitespace-pre text-sm font-sans font-normal"
          >
            <span className="opacity-0">{value}</span>
            <span className="text-[#85877B] dark:text-[#6E7B70] opacity-80 select-none">
              {ghostText}
            </span>
          </div>

          {/* Actual User Interactive Input */}
          <input
            ref={inputRef}
            id={id}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (suggestions.length > 0) setIsOpen(true);
            }}
            placeholder={placeholder}
            className="w-full bg-transparent text-sm font-sans font-normal text-[#202920] dark:text-[#EDEAE2] placeholder-[#85877B] focus:outline-none z-10"
            autoComplete="off"
            spellCheck="false"
          />
        </div>

        {/* Right Tab Acceptance Pill (Visible when ghostText is present) */}
        {ghostText && (
          <button
            type="button"
            onClick={handleTabClick}
            className="mr-3 px-2.5 py-1 bg-[#DCE6D7] dark:bg-[#233527] text-[#3E6248] dark:text-[#4ADE80] hover:bg-[#3E6248] hover:text-white dark:hover:bg-[#4ADE80] dark:hover:text-[#141E16] rounded-lg text-[11px] font-mono font-medium flex items-center gap-1.5 transition-colors cursor-pointer z-20 shadow-xs"
            title="Press Tab to accept LLM completion"
          >
            <span>Tab</span>
            <CornerDownLeft size={10} />
          </button>
        )}

        {/* Live Latency & AI Model Badge */}
        <div className="mr-3 hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#FAF7F0] dark:bg-[#141E16] border border-[#E4DCCB] dark:border-[#28382C] text-[10px] font-mono text-[#62685E] dark:text-[#9DA39A]">
          <Zap size={10} className="text-[#4ADE80]" />
          <span>{source === "gemini-1.5-flash" ? "Gemini 1.5" : "RAG"}</span>
          {latencyMs > 0 && <span>· {latencyMs}ms</span>}
        </div>
      </div>

      {/* Autocomplete Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1A261D] border border-[#E4DCCB] dark:border-[#28382C] rounded-xl shadow-xl overflow-hidden z-40 animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="px-3.5 py-2 bg-[#FAF7F0] dark:bg-[#141E16] border-b border-[#E4DCCB] dark:border-[#28382C] flex items-center justify-between text-[10px] font-mono font-bold text-[#85877B] uppercase tracking-wider">
              <span className="flex items-center gap-1">
                <Sparkles size={11} className="text-[#3E6248] dark:text-[#4ADE80]" />
                LLM Autocomplete Suggestions
              </span>
              <span>Use ↑ ↓ keys · Enter to select</span>
            </div>

            <ul className="py-1 divide-y divide-[#E4DCCB]/40 dark:divide-[#28382C]/40 max-h-64 overflow-y-auto">
              {suggestions.map((item, idx) => (
                <li key={idx}>
                  <button
                    type="button"
                    onClick={() => handleItemClick(item)}
                    className={`w-full text-left px-4 py-2.5 flex items-center justify-between gap-3 text-xs transition-colors cursor-pointer ${
                      idx === selectedIndex
                        ? "bg-[#DCE6D7] text-[#202920] dark:bg-[#233527] dark:text-[#4ADE80] font-medium"
                        : "text-[#202920] dark:text-[#EDEAE2] hover:bg-[#FAF7F0] dark:hover:bg-[#1F2E23]"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3E6248] dark:bg-[#4ADE80] shrink-0" />
                      <span className="truncate">{item}</span>
                    </div>
                    <ArrowRight
                      size={12}
                      className="opacity-40 group-hover:opacity-100 shrink-0 text-[#3E6248] dark:text-[#4ADE80]"
                    />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
