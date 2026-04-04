export const dynamic = "force-dynamic";

import { getExperiments, getHypotheses } from "@/lib/actions";
import { ExperimentList } from "@/features/experiment/experiment-list";

export default async function ExperimentsPage() {
  const [experiments, hypotheses] = await Promise.all([
    getExperiments(),
    getHypotheses(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">実験一覧</h1>
      </div>
      <ExperimentList
        experiments={experiments}
        hypotheses={hypotheses}
      />
    </div>
  );
}
