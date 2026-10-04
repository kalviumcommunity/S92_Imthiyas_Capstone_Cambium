"use client";

import React, { useState } from "react";
import { SlidersHorizontal, Plus, Trash2, Check, RotateCcw, ChevronDown, ChevronUp, Sparkles, Filter } from "lucide-react";
import { useToast } from "@/components/ui/toast";

export interface BooleanRule {
  id: string;
  connector: "AND" | "OR" | "NOT";
  field: "title" | "abstract" | "author" | "venue" | "topic" | "year";
  operator: "contains" | "exact" | "excludes" | "greater_than" | "less_than";
  value: string;
}

export interface BooleanQueryBuilderProps {
  onApply?: (query: string, rules: BooleanRule[]) => void;
  className?: string;
}

const DEFAULT_RULES: BooleanRule[] = [
  {
    id: "r1",
    connector: "AND",
    field: "topic",
    operator: "contains",
    value: "Medical AI",
  },
  {
    id: "r2",
    connector: "AND",
    field: "year",
    operator: "greater_than",
    value: "2023",
  },
  {
    id: "r3",
    connector: "NOT",
    field: "venue",
    operator: "contains",
    value: "Workshop",
  },
];

export function BooleanQueryBuilder({ onApply, className = "" }: BooleanQueryBuilderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [rules, setRules] = useState<BooleanRule[]>(DEFAULT_RULES);
  const { toast } = useToast();

  const handleAddRule = () => {
    const newRule: BooleanRule = {
      id: "rule-" + Date.now(),
      connector: "AND",
      field: "title",
      operator: "contains",
      value: "",
    };
    setRules([...rules, newRule]);
  };

  const handleRemoveRule = (id: string) => {
    setRules(rules.filter((r) => r.id !== id));
  };

  const handleUpdateRule = (id: string, updates: Partial<BooleanRule>) => {
    setRules(rules.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  };

  const handleReset = () => {
    setRules([]);
    if (onApply) onApply("", []);
    toast({
      title: "Query Cleared",
      description: "Reset to default universal publication index.",
    });
  };

  // Build human-readable boolean representation
  const queryExpression = rules
    .map((r, i) => {
      const opText =
        r.operator === "contains"
          ? "~"
          : r.operator === "exact"
          ? "=="
          : r.operator === "excludes"
          ? "!="
          : r.operator === "greater_than"
          ? ">="
          : "<=";
      const prefix = i === 0 ? "" : `${r.connector} `;
      return `${prefix}(${r.field} ${opText} "${r.value || "..."}")`;
    })
    .join(" ");

  const handleApply = () => {
    if (onApply) onApply(queryExpression, rules);
    toast({
      title: "Boolean Filter Applied",
      description: `Filtering across ${rules.length} composite rule${rules.length === 1 ? "" : "s"}.`,
      variant: "success",
    });
  };

  return (
    <div className={`w-full font-sans ${className}`}>
      {/* Toggle Bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setIsOpen((p) => !p)}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#E4DCCB] bg-white hover:border-[#3E6248] text-[#202920] text-[12.5px] font-medium transition-all shadow-2xs cursor-pointer group"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#3E6248] group-hover:rotate-45 transition-transform" />
          <span>Boolean Filter Builder</span>
          {rules.length > 0 && (
            <span className="px-1.5 py-0.2 bg-[#DCE6D7] text-[#3E6248] font-mono text-[10.5px] rounded-full font-bold">
              {rules.length}
            </span>
          )}
          {isOpen ? <ChevronUp className="w-3.5 h-3.5 text-[#85877B]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#85877B]" />}
        </button>

        {rules.length > 0 && (
          <span className="hidden sm:inline-block font-mono text-[11px] text-[#85877B] max-w-md truncate">
            {queryExpression}
          </span>
        )}
      </div>

      {/* Expanded Query Builder Drawer */}
      {isOpen && (
        <div className="mt-3 p-4 bg-[#FAF7F0] border border-[#E4DCCB] rounded-xl shadow-xs space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-[#E4DCCB]/60">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#3E6248]" />
              <span className="font-serif text-[14.5px] font-semibold text-[#202920]">
                Layered Publication Query Syntax
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1 text-[11px] font-mono text-[#85877B] hover:text-[#B33D35] transition-colors cursor-pointer bg-transparent border-0 p-0"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            </div>
          </div>

          {/* Rule Rows */}
          <div className="space-y-2">
            {rules.map((rule, idx) => (
              <div
                key={rule.id}
                className="flex flex-wrap items-center gap-2 p-2 rounded-lg bg-white border border-[#E4DCCB]"
              >
                {/* Connector */}
                {idx > 0 ? (
                  <select
                    value={rule.connector}
                    onChange={(e) => handleUpdateRule(rule.id, { connector: e.target.value as any })}
                    className="h-8 px-2 bg-[#F2EBDD] border border-[#E4DCCB] rounded-md text-[11.5px] font-mono font-bold text-[#3E6248] outline-none cursor-pointer"
                  >
                    <option value="AND">AND</option>
                    <option value="OR">OR</option>
                    <option value="NOT">NOT</option>
                  </select>
                ) : (
                  <span className="w-14 text-center text-[11px] font-mono font-bold text-[#85877B] bg-[#F2EBDD] py-1.5 px-2 rounded border border-[#E4DCCB]">
                    WHERE
                  </span>
                )}

                {/* Field Selector */}
                <select
                  value={rule.field}
                  onChange={(e) => handleUpdateRule(rule.id, { field: e.target.value as any })}
                  className="h-8 px-2.5 bg-white border border-[#E4DCCB] rounded-md text-[12px] text-[#202920] outline-none cursor-pointer"
                >
                  <option value="title">Paper Title</option>
                  <option value="abstract">Abstract</option>
                  <option value="author">Author / Investigator</option>
                  <option value="topic">Topic / Field</option>
                  <option value="venue">Journal / Conference</option>
                  <option value="year">Publication Year</option>
                </select>

                {/* Operator */}
                <select
                  value={rule.operator}
                  onChange={(e) => handleUpdateRule(rule.id, { operator: e.target.value as any })}
                  className="h-8 px-2 bg-white border border-[#E4DCCB] rounded-md text-[12px] text-[#62685E] outline-none cursor-pointer"
                >
                  <option value="contains">contains</option>
                  <option value="exact">is exactly</option>
                  <option value="excludes">does not contain</option>
                  <option value="greater_than">after or on (&gt;=)</option>
                  <option value="less_than">before or on (&lt;=)</option>
                </select>

                {/* Value Input */}
                <input
                  type="text"
                  placeholder="Keyword, name or year..."
                  value={rule.value}
                  onChange={(e) => handleUpdateRule(rule.id, { value: e.target.value })}
                  className="flex-1 min-w-[140px] h-8 px-2.5 bg-white border border-[#E4DCCB] rounded-md text-[12.5px] text-[#202920] placeholder-[#85877B] outline-none focus:border-[#3E6248]"
                />

                {/* Remove */}
                <button
                  type="button"
                  onClick={() => handleRemoveRule(rule.id)}
                  className="w-8 h-8 flex items-center justify-center text-[#85877B] hover:text-[#B33D35] bg-transparent border-0 cursor-pointer rounded transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleAddRule}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E4DCCB] bg-white hover:border-[#3E6248] text-[12px] text-[#202920] font-medium transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#3E6248]" />
              <span>Add Filter Rule</span>
            </button>

            <button
              type="button"
              onClick={handleApply}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#3E6248] hover:bg-[#293E30] text-white text-[12px] font-medium transition-colors shadow-2xs cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply Visual Query</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
