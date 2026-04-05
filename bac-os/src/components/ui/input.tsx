import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-lg border-2 bg-white px-4 py-2 text-base text-[#1a1a2e] placeholder:text-[#adb5bd] transition-colors",
        "focus-visible:outline-none focus-visible:border-[#4361ee] focus-visible:ring-3 focus-visible:ring-[#4361ee]/20",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[#f8f9fa]",
        className
      )}
      style={{ borderColor: "var(--border)" }}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
