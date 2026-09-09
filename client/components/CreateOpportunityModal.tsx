"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { opportunitySchema, OpportunityFormValues } from "@/lib/schemas/opportunity";
import { createOpportunity } from "@/lib/api";
import { X, Sparkles, AlertCircle } from "lucide-react";

interface CreateOpportunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateOpportunityModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateOpportunityModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OpportunityFormValues>({
    resolver: zodResolver(opportunitySchema),
    defaultValues: {
      type: "Grant",
    },
  });

  if (!isOpen) return null;

  const onSubmit = async (data: OpportunityFormValues) => {
    try {
      setSubmitting(true);
      setApiError(null);

      const payload = {
        title: data.title,
        type: data.type,
        organization: data.organization,
        deadline: data.deadline ? new Date(data.deadline).toISOString() : undefined,
        description: data.description,
        link: data.link || undefined,
        tags: data.tags
          ? data.tags.split(",").map((t) => t.trim()).filter(Boolean)
          : [],
      };

      await createOpportunity(payload);
      reset();
      onSuccess();
      onClose();
    } catch (err: any) {
      setApiError(err.message || "Failed to create opportunity");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="glass-panel w-full max-w-xl rounded-2xl p-6 border border-slate-700 shadow-2xl relative">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Post Research Opportunity</h2>
              <p className="text-xs text-slate-400">
                Publish a grant, Call for Papers, journal, or fellowship to the PostgreSQL registry.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {apiError && (
          <div className="mb-4 p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{apiError}</span>
          </div>
        )}

        {/* Opportunity Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Opportunity Title *
            </label>
            <input
              {...register("title")}
              placeholder="e.g. NSF Graduate Research Fellowship in Quantum Computing"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            {errors.title && (
              <p className="text-xs text-rose-400 mt-1">{errors.title.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Opportunity Type *
              </label>
              <select
                {...register("type")}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Grant">Grant</option>
                <option value="CFP">Call for Papers (CFP)</option>
                <option value="Journal">Journal Special Issue</option>
                <option value="Paper">Research Paper / Fellowship</option>
              </select>
              {errors.type && (
                <p className="text-xs text-rose-400 mt-1">{errors.type.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Organization / Publisher *
              </label>
              <input
                {...register("organization")}
                placeholder="e.g. IEEE / National Science Foundation"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              {errors.organization && (
                <p className="text-xs text-rose-400 mt-1">{errors.organization.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Deadline Date
              </label>
              <input
                type="date"
                {...register("deadline")}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Application / Details Link
              </label>
              <input
                type="url"
                {...register("link")}
                placeholder="https://example.com/apply"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              {errors.link && (
                <p className="text-xs text-rose-400 mt-1">{errors.link.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Description *
            </label>
            <textarea
              rows={3}
              {...register("description")}
              placeholder="Provide grant scope, submission criteria, eligibility, and funding amounts..."
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
            />
            {errors.description && (
              <p className="text-xs text-rose-400 mt-1">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Taxonomy Tags (Comma Separated)
            </label>
            <input
              {...register("tags")}
              placeholder="e.g. AI, Quantum, Robotics, NSF"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              {submitting ? "Publishing..." : "Publish Opportunity"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
