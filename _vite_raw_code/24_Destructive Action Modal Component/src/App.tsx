import { useState } from "react";

function WarningIcon() {
  return (
    <div className="flex items-center justify-center w-11 h-11 rounded-full bg-[#FCE8E6]">
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
          stroke="#A63228"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          x1="12"
          y1="9"
          x2="12"
          y2="13"
          stroke="#A63228"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
        <circle cx="12" cy="17" r="0.5" fill="#A63228" stroke="#A63228" strokeWidth="1.25" />
      </svg>
    </div>
  );
}

export default function App() {
  const [confirmText, setConfirmText] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  const isConfirmed = confirmText === "DELETE";

  if (!isOpen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7F5]">
        <button
          onClick={() => { setIsOpen(true); setConfirmText(""); }}
          className="px-5 py-2.5 rounded-lg bg-[#17201D] text-white text-sm font-medium font-[Manrope] hover:bg-[#17201D]/90 transition-colors"
        >
          Open Modal
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#17201D]/40 backdrop-blur-[2px]">
      {/* Overlay */}
      <div
        className="fixed inset-0"
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative w-full max-w-[450px] mx-4 bg-white rounded-xl p-6 border border-[#DDE2DE]"
        style={{ boxShadow: "0 16px 40px rgba(23,63,53,0.14)" }}
      >
        {/* Icon */}
        <WarningIcon />

        {/* Heading */}
        <h3
          id="modal-title"
          className="mt-4 text-xl text-[#17201D] leading-snug"
          style={{ fontFamily: "'Source Serif 4', serif", fontWeight: 600 }}
        >
          Delete Research Workspace?
        </h3>

        {/* Subtext */}
        <p
          className="mt-2 text-sm text-[#66716C] leading-relaxed"
          style={{ fontFamily: "Manrope, sans-serif" }}
        >
          This action cannot be undone. All contained papers, datasets, and
          literature reviews will be permanently removed from our servers.
        </p>

        {/* Confirmation input */}
        <div className="mt-6">
          <label
            htmlFor="confirm-input"
            className="block text-sm font-medium text-[#17201D] mb-1.5"
            style={{ fontFamily: "Manrope, sans-serif" }}
          >
            To confirm, type the word{" "}
            <span className="font-semibold text-[#A63228]">DELETE</span> below:
          </label>
          <input
            id="confirm-input"
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="DELETE"
            autoComplete="off"
            spellCheck={false}
            className="w-full h-10 px-3 text-sm text-[#17201D] bg-white border border-[#DDE2DE] rounded-md outline-none transition-all placeholder:text-[#66716C]/50 focus:ring-2 focus:ring-[#A63228]/20 focus:border-[#A63228]"
            style={{ fontFamily: "Manrope, sans-serif" }}
          />
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            onClick={() => setIsOpen(false)}
            className="h-10 px-4 text-sm font-medium text-[#17201D] bg-white border border-[#DDE2DE] rounded-md hover:bg-[#F5F7F5] transition-colors"
            style={{ fontFamily: "Manrope, sans-serif" }}
          >
            Cancel
          </button>
          <button
            disabled={!isConfirmed}
            onClick={() => setIsOpen(false)}
            className="h-10 px-4 text-sm font-medium text-white bg-[#A63228] rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:bg-[#A63228]/90"
            style={{ fontFamily: "Manrope, sans-serif" }}
          >
            Delete Workspace
          </button>
        </div>
      </div>
    </div>
  );
}
