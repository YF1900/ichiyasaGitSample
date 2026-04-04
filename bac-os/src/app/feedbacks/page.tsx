export const dynamic = "force-dynamic";

import { getFeedbacks, getExperiments } from "@/lib/actions";
import { FeedbackList } from "@/features/feedback/feedback-list";

export default async function FeedbacksPage() {
  const [feedbacks, experiments] = await Promise.all([
    getFeedbacks(),
    getExperiments(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">フィードバック一覧</h1>
      </div>
      <FeedbackList
        feedbacks={feedbacks}
        experiments={experiments}
      />
    </div>
  );
}
