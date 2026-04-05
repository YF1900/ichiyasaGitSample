import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default:    "bg-[#1a1a2e] text-white",
        secondary:  "bg-[#e9ecef] text-[#495057]",
        outline:    "border-2 border-[#dee2e6] text-[#495057] bg-white",
        success:    "bg-[#d8f3dc] text-[#1b4332]",
        warning:    "bg-[#fff3cd] text-[#7b4f00]",
        destructive:"bg-[#fde8e8] text-[#9b1c1c]",
        info:       "bg-[#dbeafe] text-[#1e3a5f]",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
