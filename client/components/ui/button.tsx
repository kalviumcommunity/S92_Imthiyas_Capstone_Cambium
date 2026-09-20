import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap text-sm font-medium transition-all active:scale-[0.98] select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow-none",
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow-none",
        secondary:
          "bg-transparent text-primary border border-primary hover:bg-primary/10",
        outline:
          "bg-transparent text-primary border border-primary hover:bg-primary/10",
        ghost:
          "bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted",
        tertiary:
          "bg-muted text-foreground hover:bg-muted/80 border border-border shadow-none",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-none",
        link:
          "text-primary underline-offset-4 hover:underline",
        subtle:
          "bg-accent text-accent-foreground hover:bg-accent/80",
      },
      size: {
        sm: "h-7 rounded-sm px-3 text-xs",
        default: "h-9 rounded-md px-4 py-2",
        lg: "h-10 rounded-md px-5 text-sm",
        icon: "h-9 w-9 rounded-md",
        "icon-sm": "h-7 w-7 rounded-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
