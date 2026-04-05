import { InboxFill } from "react-bootstrap-icons";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 text-center rounded-xl border-2 border-dashed"
      style={{ borderColor: "var(--border)", background: "white" }}
    >
      <InboxFill
        size={40}
        className="mb-4"
        style={{ color: "var(--border)" }}
        aria-hidden="true"
      />
      <h3
        className="text-base font-semibold mb-1"
        style={{ color: "var(--text-primary)" }}
      >
        {title}
      </h3>
      <p
        className="text-sm mb-5 max-w-sm"
        style={{ color: "var(--text-muted)" }}
      >
        {description}
      </p>
      {action}
    </div>
  );
}
