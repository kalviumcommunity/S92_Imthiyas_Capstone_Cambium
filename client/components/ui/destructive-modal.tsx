"use client";

import React, { useState, useEffect } from "react";
import { AlertTriangle, X, ShieldAlert } from "lucide-react";

export interface DestructiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmTextTarget?: string; // e.g. "DELETE" or "EXPUNGE"
  confirmButtonText?: string;
  cancelButtonText?: string;
}

export function DestructiveModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmTextTarget,
  confirmButtonText = "Delete Permanently",
  cancelButtonText = "Cancel",
}: DestructiveModalProps) {
  const [confirmText, setConfirmText] = useState("");

  // Reset confirm text when modal opens
  useEffect(() => {
    if (isOpen) {
      setConfirmText("");
    }
  }, [isOpen]);

  const isConfirmed = confirmTextTarget
    ? confirmText.trim() === confirmTextTarget.trim()
    : true;

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="destructive-modal-title"
      className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-[#17201D]/60 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-[#FAF7F0] border border-[#E4DCCB] rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
      >
        {/* Top close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#85877B] hover:text-[#202920] hover:bg-black/5 transition-colors border-0 bg-transparent cursor-pointer"
          aria-label="Close dialog"
        >
          <X size={16} />
        </button>

        {/* Warning Icon Badge & Eyebrow */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-red-100/70 border border-red-200/80 flex items-center justify-center text-[#A33B32] shadow-2xs shrink-0">
            <ShieldAlert size={22} />
          </div>
          <div>
            <span className="font-mono text-[10px] font-bold text-[#A33B32] uppercase tracking-widest block">
              Irreversible Action // Caution Required
            </span>
            <span className="font-mono text-xs text-[#85877B]">
              Node Deletion Protocol
            </span>
          </div>
        </div>

        {/* Heading */}
        <h3
          id="destructive-modal-title"
          className="font-serif text-2xl font-normal text-[#202920] leading-snug mb-2"
        >
          {title}
        </h3>

        {/* Description */}
        <p className="font-serif text-[15px] text-[#62685E] leading-relaxed mb-6">
          {description}
        </p>

        {/* Confirmation Input if required */}
        {confirmTextTarget && (
          <div className="p-4 rounded-xl bg-white border border-[#E4DCCB] mb-6">
            <label
              htmlFor="confirm-phrase-input"
              className="block font-sans text-xs text-[#202920] font-medium mb-2"
            >
              To confirm this action, please type{" "}
              <span className="font-mono font-bold text-[#A33B32] bg-red-50 border border-red-200 px-1.5 py-0.5 rounded text-xs select-all">
                {confirmTextTarget}
              </span>{" "}
              in the input below:
            </label>
            <input
              id="confirm-phrase-input"
              type="text"
              autoFocus
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={`Type "${confirmTextTarget}" to proceed`}
              autoComplete="off"
              spellCheck={false}
              className="w-full h-10 px-3.5 text-sm font-mono text-[#202920] bg-[#FAF7F0] border border-[#E4DCCB] rounded-lg outline-none transition-all placeholder:text-[#85877B] focus:border-[#A33B32] focus:ring-2 focus:ring-[#A33B32]/10"
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-2 border-t border-[#E4DCCB]">
          <span className="font-mono text-[10px] text-[#85877B] uppercase tracking-wider hidden sm:inline">
            CAMBIUM SAFETY LOCK
          </span>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-full font-sans text-xs font-semibold uppercase tracking-wider text-[#202920] bg-white hover:bg-[#F3EFE6] border border-[#E4DCCB] transition-all cursor-pointer shadow-2xs"
            >
              {cancelButtonText}
            </button>
            <button
              type="button"
              disabled={!isConfirmed}
              onClick={() => {
                if (isConfirmed) {
                  onConfirm();
                  onClose();
                }
              }}
              className="w-full sm:w-auto px-6 py-2.5 rounded-full font-sans text-xs font-semibold uppercase tracking-wider text-[#FAF7F0] bg-[#A33B32] hover:bg-[#852C24] disabled:opacity-35 disabled:cursor-not-allowed border border-[#852C24]/40 transition-all cursor-pointer shadow-xs"
            >
              {confirmButtonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
