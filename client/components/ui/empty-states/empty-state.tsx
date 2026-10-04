import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  primaryAction?: {
    label: string;
    href: string;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
}

export function EmptyState({
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center text-center gap-6 bg-surface-raised rounded-lg border border-edge-default p-12 w-full max-w-[500px]">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        .animate-icon-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
      <div className="animate-icon-float">
        <div className="flex items-center justify-center rounded-full w-20 h-20 bg-moss-100">
          {icon}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-semibold leading-snug font-serif text-ink-primary">
          {title}
        </h3>
        <p className="text-sm leading-relaxed font-sans text-ink-secondary max-w-[340px]">
          {description}
        </p>
      </div>

      {(primaryAction || secondaryAction) && (
        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center mt-2">
          {primaryAction && (
            <Button asChild>
              <Link href={primaryAction.href}>{primaryAction.label}</Link>
            </Button>
          )}
          {secondaryAction && (
            <Button asChild variant="outline">
              <Link href={secondaryAction.href}>{secondaryAction.label}</Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Specialized Pre-configured Empty States ───────────────────────────────

export function CollabHubEmptyState({
  title = "No connections yet.",
  description = "Your academic network starts here. Find peers sharing your research interests or invite your existing lab members.",
  primaryAction = { label: "Find Collaborators", href: "/discover" },
}: Partial<EmptyStateProps>) {
  return (
    <EmptyState
      title={title}
      description={description}
      primaryAction={primaryAction}
      icon={
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Network nodes */}
          <circle cx="20" cy="13" r="5" fill="#173F35" />
          <circle cx="9" cy="28" r="4" fill="#173F35" opacity="0.7" />
          <circle cx="31" cy="28" r="4" fill="#173F35" opacity="0.7" />
          <line x1="20" y1="18" x2="9" y2="24" stroke="#173F35" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
          <line x1="20" y1="18" x2="31" y2="24" stroke="#173F35" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
          <line x1="9" y1="28" x2="31" y2="28" stroke="#173F35" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3" opacity="0.3" />
        </svg>
      }
    />
  );
}

export function WorkspaceEmptyState({
  title = "Your workspace is empty.",
  description = "Upload your first PDF, connect a dataset, or start a new literature review.",
  primaryAction = { label: "Upload Research", href: "/workspace" },
  secondaryAction = { label: "Browse Templates", href: "/discover" },
}: Partial<EmptyStateProps>) {
  return (
    <EmptyState
      title={title}
      description={description}
      primaryAction={primaryAction}
      secondaryAction={secondaryAction}
      icon={
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Open folder */}
          <path
            d="M5 14C5 12.9 5.9 12 7 12H16L19 15H33C34.1 15 35 15.9 35 17V30C35 31.1 34.1 32 33 32H7C5.9 32 5 31.1 5 30V14Z"
            fill="#173F35"
            opacity="0.15"
          />
          <path
            d="M5 18C5 16.9 5.9 16 7 16H33C34.1 16 35 16.9 35 18V30C35 31.1 34.1 32 33 32H7C5.9 32 5 31.1 5 30V18Z"
            fill="#173F35"
            opacity="0.25"
          />
          {/* Document inside */}
          <rect x="15" y="12" width="14" height="18" rx="1.5" fill="white" stroke="#173F35" strokeWidth="1.2" />
          <line x1="18" y1="17" x2="26" y2="17" stroke="#173F35" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
          <line x1="18" y1="20" x2="26" y2="20" stroke="#173F35" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
          <line x1="18" y1="23" x2="23" y2="23" stroke="#173F35" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
        </svg>
      }
    />
  );
}
