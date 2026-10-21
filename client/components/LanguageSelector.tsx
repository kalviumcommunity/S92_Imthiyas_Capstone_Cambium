"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Globe, Check, ChevronDown, Languages } from "lucide-react";

export interface LanguageSelectorProps {
  compact?: boolean;
  className?: string;
  dropdownAlign?: "auto" | "left" | "right" | "flyout-right";
}

export default function LanguageSelector({
  compact = false,
  className = "",
  dropdownAlign = "auto",
}: LanguageSelectorProps) {
  const { locale, setLocale, metadata, supportedLocales, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation & escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Determine popup placement to guarantee 100% on-screen visibility without any clipping
  // In compact mode: fly out cleanly to the right of the sidebar strip (left-full ml-2.5)
  // In expanded mode: open upwards matching the exact button width (left-0 right-0 w-full)
  const isFlyout = dropdownAlign === "flyout-right" || (dropdownAlign === "auto" && compact);
  const placementClass = isFlyout
    ? "left-full ml-2.5 bottom-0 w-64 max-w-[calc(100vw-80px)] z-50"
    : "left-0 right-0 w-full bottom-full mb-2 z-50";

  return (
    <div
      className={`relative ${compact ? "w-11 h-11 mx-auto flex items-center justify-center" : "w-full"} ${className}`}
      ref={dropdownRef}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t("common.language", "Scholarly Language")}
        aria-expanded={isOpen}
        title={`${t("common.language", "Scholarly Language")}: ${metadata.nativeName}`}
        className={`group flex items-center transition-all duration-200 cursor-pointer ${
          compact
            ? "w-11 h-11 rounded-xl justify-center border border-[#E4DCCB] dark:border-[#233327] bg-[#FAF7F0] dark:bg-[#131C15] text-[#62685E] dark:text-[#A3B899] hover:text-[#202920] dark:hover:text-[#EDEAE2] hover:bg-[#F2EBDD] dark:hover:bg-[#18231B] hover:border-[#3E6248]/50 dark:hover:border-[#4ADE80]/50 shadow-2xs relative"
            : "w-full justify-between px-3 py-2 rounded-xl text-xs font-sans border border-[#E4DCCB] dark:border-[#233327] bg-[#FAF7F0] dark:bg-[#131C15] text-[#202920] dark:text-[#EDEAE2] hover:bg-[#F2EBDD] dark:hover:bg-[#18231B] hover:border-[#3E6248]/50 dark:hover:border-[#4ADE80]/50 shadow-2xs"
        }`}
      >
        {compact ? (
          <div className="flex items-center justify-center relative w-full h-full">
            <Globe
              size={18}
              className="text-[#3E6248] dark:text-[#4ADE80] transition-transform duration-200 group-hover:scale-110 shrink-0"
            />
            <span className="absolute bottom-1 right-1 text-[8.5px] font-mono font-bold bg-[#3E6248] dark:bg-[#4ADE80] text-[#FAF7F0] dark:text-[#0E140F] px-1 py-[0.5px] rounded leading-none shadow-2xs pointer-events-none">
              {metadata.code.toUpperCase()}
            </span>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-5 h-5 rounded-md bg-[#E4DCCB]/50 dark:bg-[#202D23] flex items-center justify-center shrink-0 text-xs">
                {metadata.flag}
              </span>
              <div className="flex flex-col text-left min-w-0">
                <span className="text-[12px] font-semibold text-[#202920] dark:text-[#EDEAE2] truncate">
                  {metadata.nativeName}
                </span>
                <span className="text-[10px] font-mono text-[#85877B] dark:text-[#7E8B7B] uppercase">
                  {metadata.code} · Language
                </span>
              </div>
            </div>
            <ChevronDown
              size={13}
              className={`text-[#85877B] dark:text-[#7E8B7B] group-hover:text-[#202920] dark:group-hover:text-[#EDEAE2] transition-transform duration-200 shrink-0 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </>
        )}
      </button>

      {/* Flyout or Dropup Menu — Anchored safely inside the viewport without left clipping */}
      {isOpen && (
        <div
          className={`absolute ${placementClass} rounded-2xl border border-[#E4DCCB] dark:border-[#233327] bg-[#FAF7F0] dark:bg-[#131C15] shadow-2xl p-2 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-xl`}
          style={{ minWidth: isFlyout ? "240px" : undefined }}
        >
          {/* Header */}
          <div className="px-2.5 py-1.5 border-b border-[#E4DCCB]/80 dark:border-[#233327]/80 mb-1.5 flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#3E6248] dark:text-[#4ADE80] font-bold flex items-center gap-1.5">
              <Languages size={12} />
              {t("common.language", "Scholarly Language")}
            </span>
            <span className="text-[9px] font-mono text-[#85877B] dark:text-[#7E8B7B]">
              W3C i18n
            </span>
          </div>

          {/* Options */}
          <div className="space-y-1">
            {supportedLocales.map((item) => {
              const isSelected = item.code === locale;
              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => {
                    setLocale(item.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition-all duration-150 cursor-pointer text-left ${
                    isSelected
                      ? "bg-[#DCE6D7] dark:bg-[#202D23] text-[#173F35] dark:text-[#4ADE80] font-semibold border border-[#3E6248]/30 dark:border-[#4ADE80]/30 shadow-2xs"
                      : "text-[#202920] dark:text-[#EDEAE2] hover:bg-[#F2EBDD] dark:hover:bg-[#18231B] border border-transparent"
                  }`}
                >
                  <span className="flex items-center gap-2.5 min-w-0">
                    <span className="text-sm shrink-0">{item.flag}</span>
                    <span className="truncate">{item.nativeName}</span>
                  </span>
                  {isSelected && (
                    <Check size={14} className="text-[#3E6248] dark:text-[#4ADE80] shrink-0 ml-1.5" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
