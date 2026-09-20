import { useState } from "react";
import SectionWrapper, { ComponentGroup } from "@/components/SectionWrapper";

const labelCls = "block text-xs font-medium text-ink-2 mb-1.5";
const helperCls = "text-[11px] text-ink-3 mt-1.5";
const errorCls = "text-[11px] text-crimson mt-1.5";
const inputBase =
  "w-full px-3 py-2 text-sm rounded-md border bg-surface text-ink placeholder:text-ink-3 outline-none transition-all";
const inputDefault = `${inputBase} border-line hover:border-line-2 focus:border-navy focus:ring-2 focus:ring-navy-light`;
const inputError = `${inputBase} border-crimson ring-2 ring-crimson/10 focus:border-crimson focus:ring-crimson/20`;
const inputSuccess = `${inputBase} border-sage focus:border-sage focus:ring-2 focus:ring-sage-light`;
const inputDisabled = `${inputBase} border-line bg-surface-2 text-ink-3 cursor-not-allowed`;

export default function InputsSection() {
  const [showPw, setShowPw] = useState(false);
  const [date, setDate] = useState("");

  return (
    <SectionWrapper
      id="inputs"
      number="03"
      title="Inputs"
      description="Form inputs that are clear, accessible, and calm. Every state is accounted for so research flows without friction."
    >
      {/* Text Input States */}
      <ComponentGroup label="Text Input" note="All states">
        <div className="grid grid-cols-2 gap-6 max-w-2xl">
          <div>
            <label className={labelCls}>Research title</label>
            <input className={inputDefault} placeholder="Enter a title…" />
            <p className={helperCls}>Describe your research focus</p>
          </div>
          <div>
            <label className={labelCls}>Research title <span className="text-ink-3 font-normal">(optional)</span></label>
            <input className={inputDefault} defaultValue="Federated Learning in Medical Imaging" />
            <p className={helperCls}>Filled state</p>
          </div>
          <div>
            <label className={labelCls}>Research title</label>
            <input className={inputError} defaultValue="federated learning" />
            <p className={errorCls}>Title must be at least 20 characters</p>
          </div>
          <div>
            <label className={labelCls}>Research title</label>
            <input className={inputSuccess} defaultValue="Federated Learning in Medical Imaging Systems" />
            <p className={helperCls} style={{ color: "var(--color-sage)" }}>Looks good</p>
          </div>
          <div>
            <label className={labelCls} style={{ color: "var(--color-ink-3)" }}>Research title</label>
            <input className={inputDisabled} defaultValue="Federated Learning in Medical Imaging" readOnly />
            <p className={helperCls}>Read-only field</p>
          </div>
        </div>
      </ComponentGroup>

      {/* Textarea */}
      <ComponentGroup label="Textarea" note="Multi-line research input">
        <div className="max-w-md">
          <label className={labelCls}>Research abstract</label>
          <textarea
            className={`${inputDefault} resize-none`}
            rows={4}
            placeholder="Describe your research methodology, key findings, and contribution to the field…"
          />
          <p className={helperCls}>0 / 500 characters</p>
        </div>
      </ComponentGroup>

      {/* Password */}
      <ComponentGroup label="Password Input" note="Secure text entry">
        <div className="max-w-xs">
          <label className={labelCls}>Password</label>
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              className={`${inputDefault} pr-10`}
              placeholder="Enter your password"
            />
            <button
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-3 hover:text-ink-2 transition-colors"
            >
              {showPw ? (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22"/>
                </svg>
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </ComponentGroup>

      {/* Select */}
      <ComponentGroup label="Select" note="Dropdown selection">
        <div className="grid grid-cols-2 gap-6 max-w-2xl">
          <div>
            <label className={labelCls}>Research area</label>
            <div className="relative">
              <select className={`${inputDefault} appearance-none pr-8 cursor-pointer`}>
                <option value="">Select a research area…</option>
                <option>Machine Learning</option>
                <option>Medical Imaging</option>
                <option>Natural Language Processing</option>
                <option>Computer Vision</option>
                <option>Bioinformatics</option>
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-3 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </div>
          </div>
          <div>
            <label className={labelCls}>Publication year</label>
            <div className="relative">
              <select className={`${inputDefault} appearance-none pr-8 cursor-pointer`} defaultValue="2024">
                {[2024, 2023, 2022, 2021, 2020].map(y => (
                  <option key={y}>{y}</option>
                ))}
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-3 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </div>
          </div>
        </div>
      </ComponentGroup>

      {/* Date Input */}
      <ComponentGroup label="Date Input" note="Deadline and date range selection">
        <div className="grid grid-cols-2 gap-6 max-w-2xl">
          <div>
            <label className={labelCls}>Application deadline</label>
            <div className="relative">
              <input
                type="date"
                className={`${inputDefault} pr-10`}
                value={date}
                onChange={e => setDate(e.target.value)}
              />
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-3 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
          </div>
          <div>
            <label className={labelCls}>Publication date</label>
            <div className="relative">
              <input type="date" className={inputDisabled} defaultValue="2024-03-15" readOnly />
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-3 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <p className={helperCls}>Disabled state</p>
          </div>
        </div>
      </ComponentGroup>

      {/* URL Input */}
      <ComponentGroup label="URL Input" note="DOI and external link fields">
        <div className="max-w-md">
          <label className={labelCls}>DOI or URL</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-ink-3 font-mono border-r border-line pr-2.5">
              doi:
            </div>
            <input
              type="url"
              className={`${inputDefault} pl-12`}
              placeholder="10.1038/s41586-024-00000-0"
            />
          </div>
          <p className={helperCls}>Enter a DOI or full URL for the publication</p>
        </div>
      </ComponentGroup>
    </SectionWrapper>
  );
}
