import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 border px-2 py-0.5 text-[10px] uppercase tracking-wider font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20",
  {
    variants: {
      variant: {
        default:
          "border-primary/20 bg-primary/10 text-primary",
        secondary:
          "border-border bg-accent text-accent-foreground",
        outline:
          "border-border text-foreground bg-transparent",
        success:
          "border-success/20 bg-success/15 text-success",
        warning:
          "border-warning/20 bg-warning/15 text-warning",
        error:
          "border-error/20 bg-error/15 text-error",
        info:
          "border-info/20 bg-info/15 text-info",
        muted:
          "border-border bg-parchment-200 text-ink-muted",
      },
      shape: {
        tag: "rounded-sm",       // 4px for standard editorial tags
        status: "rounded-full",  // Pill for status indicators
      },
    },
    defaultVariants: {
      variant: "default",
      shape: "tag",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, shape, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, shape }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
