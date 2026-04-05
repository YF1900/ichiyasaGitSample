import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-[#4361ee] text-white hover:bg-[#3451d1] focus-visible:ring-[#4361ee] shadow-sm",
        destructive:
          "bg-[#dc2626] text-white hover:bg-[#b91c1c] focus-visible:ring-[#dc2626] shadow-sm",
        outline:
          "border-2 border-[#dee2e6] bg-white text-[#1a1a2e] hover:bg-[#f1f3f5] hover:border-[#adb5bd] focus-visible:ring-[#4361ee]",
        secondary:
          "bg-[#f1f3f5] text-[#1a1a2e] hover:bg-[#dee2e6] focus-visible:ring-[#4361ee]",
        ghost:
          "text-[#495057] hover:bg-[#f1f3f5] hover:text-[#1a1a2e] focus-visible:ring-[#4361ee]",
        link:
          "text-[#4361ee] underline-offset-4 hover:underline focus-visible:ring-[#4361ee]",
      },
      size: {
        default: "h-10 px-4 py-2 min-w-[80px]",
        sm: "h-9 px-3 text-xs",
        lg: "h-11 px-6 text-base",
        icon: "h-9 w-9 p-0",
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
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
