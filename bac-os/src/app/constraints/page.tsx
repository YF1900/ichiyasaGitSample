export const dynamic = "force-dynamic";

import { getConstraints } from "@/lib/actions";
import { ConstraintList } from "@/features/constraint/constraint-list";

export default async function ConstraintsPage() {
  const constraints = await getConstraints();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">制約一覧</h1>
      </div>
      <ConstraintList constraints={constraints} />
    </div>
  );
}
