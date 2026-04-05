import { ArrowRepeat } from "react-bootstrap-icons";

export function Loading({ message = "読み込み中..." }: { message?: string }) {
  return (
    <div
      className="flex items-center justify-center gap-2 py-10"
      role="status"
      aria-live="polite"
      aria-label={message}
      style={{ color: "var(--text-muted)" }}
    >
      <ArrowRepeat
        size={20}
        className="animate-spin"
        aria-hidden="true"
      />
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}
