"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlusLg, PencilFill, TrashFill, BookFill } from "react-bootstrap-icons";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { deleteFeedback } from "@/lib/actions";
import { FeedbackForm } from "./feedback-form";

const learningTypeLabels: Record<string, string> = {
  success: "成功",
  failure: "失敗",
  observation: "観察",
  improvement: "改善",
};

const learningTypeVariants: Record<string, "success" | "destructive" | "info" | "warning"> = {
  success: "success",
  failure: "destructive",
  observation: "info",
  improvement: "warning",
};

type Experiment = {
  id: string;
  title: string;
  [key: string]: unknown;
};

type Feedback = {
  id: string;
  title: string;
  insight: string;
  learningType: string;
  actionItems: string | null;
  owner: string;
  createdAt: Date;
  experimentId: string | null;
  experiment: { id: string; title: string } | null;
  [key: string]: unknown;
};

interface FeedbackListProps {
  feedbacks: Feedback[];
  experiments: Experiment[];
}

export function FeedbackList({ feedbacks, experiments }: FeedbackListProps) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFeedback, setEditingFeedback] = useState<Feedback | null>(null);

  const handleCreate = () => {
    setEditingFeedback(null);
    setDialogOpen(true);
  };

  const handleEdit = (feedback: Feedback) => {
    setEditingFeedback(feedback);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("このフィードバックを削除してもよろしいですか？")) return;
    await deleteFeedback(id);
    router.refresh();
  };

  const handleSuccess = () => {
    setDialogOpen(false);
    setEditingFeedback(null);
    router.refresh();
  };

  const experimentOptions = experiments.map((e) => ({ id: e.id, title: e.title }));

  if (feedbacks.length === 0) {
    return (
      <>
        <EmptyState
          title="フィードバックがありません"
          description="新しいフィードバックを作成して始めましょう。"
          action={
            <Button onClick={handleCreate}>
              <PlusLg size={16} aria-hidden="true" />
              新規作成
            </Button>
          }
        />
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogHeader>
            <DialogTitle>フィードバックを作成</DialogTitle>
          </DialogHeader>
          <FeedbackForm experiments={experimentOptions} onSuccess={handleSuccess} />
        </Dialog>
      </>
    );
  }

  return (
    <>
      <div className="flex justify-end">
        <Button onClick={handleCreate}>
          <PlusLg size={16} aria-hidden="true" />
          新規作成
        </Button>
      </div>

      <div className="grid gap-4">
        {feedbacks.map((feedback) => (
          <Card key={feedback.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    <BookFill size={16} aria-hidden="true" />
                    {feedback.title}
                  </CardTitle>
                  <CardDescription>{feedback.insight}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="編集"
                    onClick={() => handleEdit(feedback)}
                  >
                    <PencilFill size={15} aria-hidden="true" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="削除"
                    onClick={() => handleDelete(feedback.id)}
                  >
                    <TrashFill size={15} aria-hidden="true" style={{ color: "#dc2626" }} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {feedback.actionItems && (
                  <div className="text-sm">
                    <span className="font-medium" style={{ color: "#343a40" }}>アクションアイテム: </span>
                    <span style={{ color: "#495057" }}>{feedback.actionItems}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 pt-2">
                  <Badge variant={learningTypeVariants[feedback.learningType] ?? "secondary"}>
                    {learningTypeLabels[feedback.learningType] ?? feedback.learningType}
                  </Badge>
                  {feedback.experiment && (
                    <Badge variant="outline">
                      実験: {feedback.experiment.title}
                    </Badge>
                  )}
                  <span className="text-sm ml-auto" style={{ color: "#6c757d" }}>
                    担当: {feedback.owner}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogHeader>
          <DialogTitle>
            {editingFeedback ? "フィードバックを編集" : "フィードバックを作成"}
          </DialogTitle>
        </DialogHeader>
        <FeedbackForm
          experiments={experimentOptions}
          initialData={
            editingFeedback
              ? {
                  id: editingFeedback.id,
                  title: editingFeedback.title,
                  insight: editingFeedback.insight,
                  learningType: editingFeedback.learningType as "success" | "failure" | "observation" | "improvement",
                  actionItems: editingFeedback.actionItems ?? undefined,
                  experimentId: editingFeedback.experimentId ?? undefined,
                  owner: editingFeedback.owner,
                }
              : undefined
          }
          onSuccess={handleSuccess}
        />
      </Dialog>
    </>
  );
}
