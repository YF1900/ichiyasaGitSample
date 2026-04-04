import { Loader2 } from "lucide-react";

export function Loading({ message = "読み込み中..." }: { message?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-8 text-zinc-500">
      <Loader2 className="h-5 w-5 animate-spin" />
      <span>{message}</span>
    </div>
  );
}
