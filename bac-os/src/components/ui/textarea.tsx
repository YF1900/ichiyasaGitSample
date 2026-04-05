import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[100px] w-full rounded-lg border-2 bg-white px-4 py-3 text-base text-[#1a1a2e] placeholder:text-[#adb5bd] transition-colors resize-y",
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
Textarea.displayName = "Textarea";

export { Textarea };
