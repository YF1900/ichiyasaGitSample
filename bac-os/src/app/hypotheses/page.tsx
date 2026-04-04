export const dynamic = "force-dynamic";

import { getHypotheses, getConstraints } from "@/lib/actions";
import { HypothesisList } from "@/features/hypothesis/hypothesis-list";

export default async function HypothesesPage() {
  const [hypotheses, constraints] = await Promise.all([
    getHypotheses(),
    getConstraints(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">仮説一覧</h1>
      </div>
      <HypothesisList hypotheses={hypotheses} constraints={constraints} />
    </div>
  );
}
