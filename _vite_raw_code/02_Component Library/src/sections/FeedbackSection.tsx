import { useState } from "react";
import SectionWrapper, { ComponentGroup } from "@/components/SectionWrapper";

type ToastType = "success" | "error" | "warning" | "info";

function Toast({ type, title, message }: { type: ToastType; title: string; message?: string }) {
  const configs: Record<ToastType, { icon: string; cls: string; iconCls: string }> = {
    success: {
      icon: "M5 13l4 4L19 7",
      cls: "border-sage/30 bg-sage-light",
      iconCls: "text-sage bg-sage/10",
    },
    error: {
      icon: "M18 6L6 18M6 6l12 12",
      cls: "border-crimson/30 bg-crimson-light",
      iconCls: "text-crimson bg-crimson/10",
    },
    warning: {
      icon: "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01",
      cls: "border-amber/30 bg-amber-light",
      iconCls: "text-amber bg-amber/10",
    },
    info: {
      icon: "M12 8v4M12 16h.01M12 2a10 10 0 100 20A10 10 0 0012 2z",
      cls: "border-navy/20 bg-navy-light",
      iconCls: "text-navy bg-navy/10",
    },
  };
  const { icon, cls, iconCls } = configs[type];
  return (
    <div className={`flex items-start gap-3 px-4 py-3 rounded-lg border shadow-sm bg-surface w-80 ${cls}`}>
      <div className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 ${iconCls}`}>
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d={icon}/>
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-ink">{title}</p>
        {message && <p className="text-xs text-ink-3 mt-0.5 leading-relaxed">{message}</p>}
      </div>
      <button className="text-ink-3 hover:text-ink transition-colors flex-shrink-0">
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>
    </div>
  );
}

function Alert({ type, title, message, action }: { type: ToastType; title: string; message: string; action?: string }) {
  const configs: Record<ToastType, { icon: string; cls: string; titleCls: string; borderCls: string }> = {
    success: { icon: "M5 13l4 4L19 7", cls: "bg-sage-light border-sage/30", titleCls: "text-sage", borderCls: "bg-sage" },
    error: { icon: "M18 6L6 18M6 6l12 12", cls: "bg-crimson-light border-crimson/30", titleCls: "text-crimson", borderCls: "bg-crimson" },
    warning: { icon: "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z M12 9v4 M12 17h.01", cls: "bg-amber-light border-amber/30", titleCls: "text-amber", borderCls: "bg-amber" },
    info: { icon: "M12 8v4M12 16h.01M12 2a10 10 0 100 20A10 10 0 0012 2z", cls: "bg-navy-light border-navy/20", titleCls: "text-navy", borderCls: "bg-navy" },
  };
  const { icon, cls, titleCls, borderCls } = configs[type];
  return (
    <div className={`flex gap-4 px-4 py-4 rounded-lg border max-w-lg ${cls}`}>
      <div className={`w-0.5 rounded-full self-stretch ${borderCls}`} />
      <div className="flex-1">
        <div className="flex items-start gap-2 mb-1">
          <svg className={`w-4 h-4 flex-shrink-0 mt-0.5 ${titleCls}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d={icon}/>
          </svg>
          <p className={`text-sm font-medium ${titleCls}`}>{title}</p>
        </div>
        <p className="text-sm text-ink-2 leading-relaxed">{message}</p>
        {action && (
          <button className={`text-xs font-medium mt-2 hover:underline ${titleCls}`}>{action} →</button>
        )}
      </div>
    </div>
  );
}

function EmptyState({ icon, title, message, action }: { icon: string; title: string; message: string; action?: string }) {
  const icons: Record<string, string> = {
    papers: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6",
    search: "M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z",
    opportunities: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z",
    workspace: "M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z",
  };
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center bg-surface border border-line rounded-xl max-w-sm">
      <div className="w-12 h-12 bg-surface-2 rounded-xl flex items-center justify-center mb-4">
        <svg className="w-6 h-6 text-ink-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d={icons[icon]}/>
        </svg>
      </div>
      <h3 className="font-serif text-ink font-medium mb-1.5">{title}</h3>
      <p className="text-sm text-ink-3 leading-relaxed mb-5">{message}</p>
      {action && (
        <button className="px-4 py-2 text-sm bg-navy text-white rounded-md hover:bg-navy-mid transition-colors font-medium">
          {action}
        </button>
      )}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="bg-surface border border-line rounded-lg p-4 w-80 animate-pulse">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 bg-surface-3 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-surface-3 rounded w-32" />
          <div className="h-2.5 bg-surface-3 rounded w-24" />
        </div>
        <div className="w-12 h-4 bg-surface-3 rounded" />
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-surface-3 rounded w-full" />
        <div className="h-4 bg-surface-3 rounded w-5/6" />
        <div className="h-4 bg-surface-3 rounded w-4/6" />
      </div>
      <div className="flex gap-1.5 mb-4">
        <div className="h-5 bg-surface-3 rounded w-16" />
        <div className="h-5 bg-surface-3 rounded w-12" />
        <div className="h-5 bg-surface-3 rounded w-20" />
      </div>
      <div className="flex justify-between pt-3 border-t border-line">
        <div className="h-3 bg-surface-3 rounded w-20" />
        <div className="h-3 bg-surface-3 rounded w-12" />
      </div>
    </div>
  );
}

function InlineError() {
  return (
    <div className="space-y-3 max-w-md">
      <div className="flex items-center gap-2 text-xs text-crimson">
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        This field is required
      </div>
      <div className="flex items-center gap-2 text-xs text-crimson">
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        Email address is not valid
      </div>
    </div>
  );
}

export default function FeedbackSection() {
  return (
    <SectionWrapper
      id="feedback"
      number="14"
      title="Feedback & States"
      description="Clear, calm feedback that respects the user's focus. Skeleton loading, not spinners. Precise errors, not generic messages."
    >
      <ComponentGroup label="Toast Notifications" note="Non-blocking feedback messages" row wrap>
        <Toast type="success" title="Changes saved" message="Your research notes have been saved." />
        <Toast type="error" title="Something went wrong" message="Could not save. Try again." />
        <Toast type="warning" title="Deadline approaching" message="Fellowship deadline is in 3 days." />
        <Toast type="info" title="New connection request" message="Dr. Elena Rodriguez wants to connect." />
      </ComponentGroup>

      <ComponentGroup label="Alert Banners" note="Persistent, contextual alerts">
        <div className="space-y-3 max-w-lg">
          <Alert type="success" title="Paper submitted" message="Your paper has been submitted to NeurIPS 2024. You will receive confirmation within 24 hours." action="View submission" />
          <Alert type="error" title="Sync failed" message="Cambium could not sync your workspace. Your local changes are preserved." action="Retry sync" />
          <Alert type="warning" title="Account storage at 85%" message="Your research workspace is approaching its storage limit. Consider archiving older projects." action="Manage storage" />
          <Alert type="info" title="System maintenance" message="Cambium will be unavailable Sunday, Aug 25 from 2:00–4:00 AM UTC." />
        </div>
      </ComponentGroup>

      <ComponentGroup label="Inline Errors" note="Form field validation messages">
        <InlineError />
      </ComponentGroup>

      <ComponentGroup label="Empty States" note="When there is nothing to show" row wrap>
        <EmptyState
          icon="papers"
          title="No papers found"
          message="No papers match your current filters. Try adjusting your search or clearing filters."
          action="Clear filters"
        />
        <EmptyState
          icon="opportunities"
          title="No opportunities match"
          message="Update your research interests to discover relevant fellowships and grants."
          action="Update interests"
        />
        <EmptyState
          icon="workspace"
          title="Your workspace is empty"
          message="Start your first research project to organize your work in Cambium."
          action="Start a project"
        />
      </ComponentGroup>

      <ComponentGroup label="Loading Skeleton" note="Skeleton structures for content loading — never generic spinners">
        <div className="flex gap-4 flex-wrap">
          <LoadingSkeleton />
          <LoadingSkeleton />
        </div>
      </ComponentGroup>
    </SectionWrapper>
  );
}
