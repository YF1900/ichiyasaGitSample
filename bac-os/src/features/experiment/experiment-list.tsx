"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { deleteExperiment } from "@/lib/actions";
import { ExperimentForm } from "./experiment-form";

const statusLabels: Record<string, string> = {
  planned: "計画中",
  running: "実行中",
  completed: "完了",
  cancelled: "キャンセル",
};

const statusVariants: Record<string, "secondary" | "info" | "success" | "destructive"> = {
  planned: "secondary",
  running: "info",
  completed: "success",
  cancelled: "destructive",
};

type Hypothesis = {
  id: string;
  title: string;
  [key: string]: unknown;
};

type Experiment = {
  id: string;
  title: string;
  description: string;
  method: string;
  result: string | null;
  status: string;
  owner: string;
  createdAt: Date;
  hypothesisId: string | null;
  hypothesis: { id: string; title: string } | null;
  [key: string]: unknown;
};

interface ExperimentListProps {
  experiments: Experiment[];
  hypotheses: Hypothesis[];
}

export function ExperimentList({ experiments, hypotheses }: ExperimentListProps) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingExperiment, setEditingExperiment] = useState<Experiment | null>(null);

  const handleCreate = () => {
    setEditingExperiment(null);
    setDialogOpen(true);
  };

  const handleEdit = (experiment: Experiment) => {
    setEditingExperiment(experiment);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("この実験を削除してもよろしいですか？")) return;
    await deleteExperiment(id);
    router.refresh();
  };

  const handleSuccess = () => {
    setDialogOpen(false);
    setEditingExperiment(null);
    router.refresh();
  };

  const hypothesisOptions = hypotheses.map((h) => ({ id: h.id, title: h.title }));

  if (experiments.length === 0) {
    return (
      <>
        <EmptyState
          title="実験がありません"
          description="新しい実験を作成して始めましょう。"
          action={
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4" />
              新規作成
            </Button>
          }
        />
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogHeader>
            <DialogTitle>実験を作成</DialogTitle>
          </DialogHeader>
          <ExperimentForm hypotheses={hypothesisOptions} onSuccess={handleSuccess} />
        </Dialog>
      </>
    );
  }

  return (
    <>
      <div className="flex justify-end">
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4" />
          新規作成
        </Button>
      </div>

      <div className="grid gap-4">
        {experiments.map((experiment) => (
          <Card key={experiment.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    <FlaskConical className="h-4 w-4" />
                    {experiment.title}
                  </CardTitle>
                  <CardDescription>{experiment.description}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(experiment)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(experiment.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium text-zinc-700">手法: </span>
                  <span className="text-zinc-600">{experiment.method}</span>
                </div>
                {experiment.result && (
                  <div className="text-sm">
                    <span className="font-medium text-zinc-700">結果: </span>
                    <span className="text-zinc-600">{experiment.result}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 pt-2">
                  <Badge variant={statusVariants[experiment.status] ?? "secondary"}>
                    {statusLabels[experiment.status] ?? experiment.status}
                  </Badge>
                  {experiment.hypothesis && (
                    <Badge variant="outline">
                      仮説: {experiment.hypothesis.title}
                    </Badge>
                  )}
                  <span className="text-sm text-zinc-500 ml-auto">
                    担当: {experiment.owner}
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
            {editingExperiment ? "実験を編集" : "実験を作成"}
          </DialogTitle>
        </DialogHeader>
        <ExperimentForm
          hypotheses={hypothesisOptions}
          initialData={
            editingExperiment
              ? {
                  id: editingExperiment.id,
                  title: editingExperiment.title,
                  description: editingExperiment.description,
                  method: editingExperiment.method,
                  result: editingExperiment.result ?? undefined,
                  status: editingExperiment.status as "planned" | "running" | "completed" | "cancelled",
                  hypothesisId: editingExperiment.hypothesisId ?? undefined,
                  owner: editingExperiment.owner,
                }
              : undefined
          }
          onSuccess={handleSuccess}
        />
      </Dialog>
    </>
  );
}
