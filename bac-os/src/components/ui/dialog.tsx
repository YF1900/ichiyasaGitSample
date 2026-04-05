"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { XLg } from "react-bootstrap-icons";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  "aria-labelledby"?: string;
}

function Dialog({ open, onClose, children, "aria-labelledby": labelledBy }: DialogProps) {
  const dialogRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      dialogRef.current?.focus();
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Close on Escape
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Panel */}
      <div
        ref={dialogRef}
        tabIndex={-1}
        className={cn(
          "relative z-50 w-full max-w-lg max-h-[88vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl",
          "focus:outline-none"
        )}
        style={{ border: "1px solid var(--border)" }}
      >
        <button
          onClick={onClose}
          aria-label="ダイアログを閉じる"
          className="absolute right-4 top-4 rounded-lg p-1.5 transition-colors hover:bg-[#f1f3f5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4361ee]"
          style={{ color: "var(--text-muted)" }}
        >
          <XLg size={16} aria-hidden="true" />
        </button>
        {children}
      </div>
    </div>
  );
}

function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 mb-5 pr-8", className)}
      {...props}
    />
  );
}

function DialogTitle({ className, id, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      id={id}
      className={cn("text-lg font-bold", className)}
      style={{ color: "var(--text-primary)" }}
      {...props}
    />
  );
}

export { Dialog, DialogHeader, DialogTitle };
