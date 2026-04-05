"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlusLg, PencilFill, TrashFill } from "react-bootstrap-icons";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { deleteConstraint } from "@/lib/actions";
import { ConstraintForm } from "./constraint-form";

const categoryLabels: Record<string, string> = {
  market: "市場",
  resource: "リソース",
  technical: "技術",
  regulation: "規制",
  other: "その他",
};

const severityVariants: Record<string, "destructive" | "warning" | "info" | "secondary"> = {
  critical: "destructive",
  high: "warning",
  medium: "info",
  low: "secondary",
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

interface ConstraintListProps {
  constraints: Constraint[];
}

export function ConstraintList({ constraints }: ConstraintListProps) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingConstraint, setEditingConstraint] = useState<Constraint | null>(null);

  const handleCreate = () => {
    setEditingConstraint(null);
    setDialogOpen(true);
  };

  const handleEdit = (constraint: Constraint) => {
    setEditingConstraint(constraint);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("この制約を削除してもよろしいですか？")) return;
    await deleteConstraint(id);
    router.refresh();
  };

  const handleSuccess = () => {
    setDialogOpen(false);
    setEditingConstraint(null);
    router.refresh();
  };

  if (constraints.length === 0) {
    return (
      <>
        <EmptyState
          title="制約がありません"
          description="新しい制約を作成して始めましょう。"
          action={
            <Button onClick={handleCreate}>
              <PlusLg size={16} aria-hidden="true" />
              新規作成
            </Button>
          }
        />
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogHeader>
            <DialogTitle>制約を作成</DialogTitle>
          </DialogHeader>
          <ConstraintForm onSuccess={handleSuccess} />
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
        {constraints.map((constraint) => (
          <Card key={constraint.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle>{constraint.title}</CardTitle>
                  <CardDescription>{constraint.description}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(constraint)}
                    aria-label="編集"
                  >
                    <PencilFill size={15} aria-hidden="true" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(constraint.id)}
                    aria-label="削除"
                  >
                    <TrashFill size={15} aria-hidden="true" style={{ color: "#dc2626" }} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {categoryLabels[constraint.category] ?? constraint.category}
                </Badge>
                <Badge variant={severityVariants[constraint.severity] ?? "secondary"}>
                  {constraint.severity}
                </Badge>
                <span className="text-sm text-zinc-500 ml-auto">
                  担当: {constraint.owner}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogHeader>
          <DialogTitle>
            {editingConstraint ? "制約を編集" : "制約を作成"}
          </DialogTitle>
        </DialogHeader>
        <ConstraintForm
          initialData={
            editingConstraint
              ? {
                  id: editingConstraint.id,
                  title: editingConstraint.title,
                  description: editingConstraint.description,
                  category: editingConstraint.category as "market" | "resource" | "technical" | "regulation" | "other",
                  severity: editingConstraint.severity as "low" | "medium" | "high" | "critical",
                  owner: editingConstraint.owner,
                }
              : undefined
          }
          onSuccess={handleSuccess}
        />
      </Dialog>
    </>
  );
}
