"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { deleteHypothesis } from "@/lib/actions";
import { HypothesisForm } from "./hypothesis-form";

const statusLabels: Record<string, string> = {
  draft: "下書き",
  testing: "検証中",
  validated: "検証済み",
  invalidated: "無効",
};

const statusVariants: Record<string, "secondary" | "info" | "success" | "destructive"> = {
  draft: "secondary",
  testing: "info",
  validated: "success",
  invalidated: "destructive",
};

type Constraint = {
  id: string;
  title: string;
  description: string;
  category: string;
  severity: string;
  owner: string;
  createdAt: Date;
  updatedAt: Date;
  hypotheses: { id: string }[];
};

type Hypothesis = {
  id: string;
  title: string;
  description: string;
  assumption: string;
  expectedOutcome: string;
  status: string;
  constraintId: string | null;
  owner: string;
  createdAt: Date;
  updatedAt: Date;
  constraint: { id: string; title: string } | null;
  experiments: { id: string }[];
};

interface HypothesisListProps {
  hypotheses: Hypothesis[];
  constraints: Constraint[];
}

export function HypothesisList({ hypotheses, constraints }: HypothesisListProps) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingHypothesis, setEditingHypothesis] = useState<Hypothesis | null>(null);

  const handleCreate = () => {
    setEditingHypothesis(null);
    setDialogOpen(true);
  };

  const handleEdit = (hypothesis: Hypothesis) => {
    setEditingHypothesis(hypothesis);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("この仮説を削除してもよろしいですか？")) return;
    await deleteHypothesis(id);
    router.refresh();
  };

  const handleSuccess = () => {
    setDialogOpen(false);
    setEditingHypothesis(null);
    router.refresh();
  };

  if (hypotheses.length === 0) {
    return (
      <>
        <EmptyState
          title="仮説がありません"
          description="新しい仮説を作成して始めましょう。"
          action={
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4" />
              新規作成
            </Button>
          }
        />
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogHeader>
            <DialogTitle>仮説を作成</DialogTitle>
          </DialogHeader>
          <HypothesisForm constraints={constraints} onSuccess={handleSuccess} />
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
        {hypotheses.map((hypothesis) => (
          <Card key={hypothesis.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle>{hypothesis.title}</CardTitle>
                  <CardDescription>{hypothesis.description}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(hypothesis)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(hypothesis.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Badge variant={statusVariants[hypothesis.status] ?? "secondary"}>
                  {statusLabels[hypothesis.status] ?? hypothesis.status}
                </Badge>
                {hypothesis.constraint && (
                  <Badge variant="outline">{hypothesis.constraint.title}</Badge>
                )}
                <span className="text-sm text-zinc-500 ml-auto">
                  担当: {hypothesis.owner}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogHeader>
          <DialogTitle>
            {editingHypothesis ? "仮説を編集" : "仮説を作成"}
          </DialogTitle>
        </DialogHeader>
        <HypothesisForm
          constraints={constraints}
          initialData={
            editingHypothesis
              ? {
                  id: editingHypothesis.id,
                  title: editingHypothesis.title,
                  description: editingHypothesis.description,
                  assumption: editingHypothesis.assumption,
                  expectedOutcome: editingHypothesis.expectedOutcome,
                  status: editingHypothesis.status as "draft" | "testing" | "validated" | "invalidated",
                  constraintId: editingHypothesis.constraintId ?? undefined,
                  owner: editingHypothesis.owner,
                }
              : undefined
          }
          onSuccess={handleSuccess}
        />
      </Dialog>
    </>
  );
}
