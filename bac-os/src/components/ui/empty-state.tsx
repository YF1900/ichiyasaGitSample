import { InboxIcon } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <InboxIcon className="h-12 w-12 text-zinc-300 mb-4" />
      <h3 className="text-lg font-medium text-zinc-900">{title}</h3>
      <p className="text-sm text-zinc-500 mt-1 mb-4">{description}</p>
      {action}
    </div>
  );
}
