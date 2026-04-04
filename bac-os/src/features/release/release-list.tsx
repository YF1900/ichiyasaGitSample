"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { ReleaseForm } from "@/features/release/release-form";
import { deleteReleaseNote } from "@/lib/actions";
import { formatDate } from "@/lib/utils";
import { Plus, RefreshCw, Wrench, Database, Pencil, Trash2 } from "lucide-react";

interface ReleaseNote {
  id: string;
  version: string;
  summary: string;
  added: string | null;
  changed: string | null;
  fixed: string | null;
  migrationNotes: string | null;
  owner: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ReleaseListProps {
  releases: ReleaseNote[];
}

const sections = [
  { key: "added" as const, label: "追加", icon: Plus, color: "text-green-600" },
  { key: "changed" as const, label: "変更", icon: RefreshCw, color: "text-blue-600" },
  { key: "fixed" as const, label: "修正", icon: Wrench, color: "text-yellow-600" },
  { key: "migrationNotes" as const, label: "マイグレーション", icon: Database, color: "text-gray-600" },
] as const;

export function ReleaseList({ releases }: ReleaseListProps) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRelease, setEditingRelease] = useState<ReleaseNote | null>(null);

  function handleCreate() {
    setEditingRelease(null);
    setDialogOpen(true);
  }

  function handleEdit(release: ReleaseNote) {
    setEditingRelease(release);
    setDialogOpen(true);
  }

  async function handleDelete(id: string) {
    if (!confirm("このリリースノートを削除しますか？")) return;
    await deleteReleaseNote(id);
    router.refresh();
  }

  function handleFormSuccess() {
    setDialogOpen(false);
    setEditingRelease(null);
    router.refresh();
  }

  if (releases.length === 0) {
    return (
      <EmptyState
        title="リリースノートがありません"
        description="最初のリリースノートを作成しましょう"
        action={
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4" />
            新規作成
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4" />
          新規作成
        </Button>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {releases.map((release) => (
          <Card key={release.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant="default">{release.version}</Badge>
                  <span className="text-sm text-zinc-500">
                    {formatDate(release.createdAt)}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(release)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(release.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-sm mt-1">{release.summary}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sections.map(({ key, label, icon: Icon, color }) => {
                  const content = release[key];
                  if (!content) return null;
                  return (
                    <div key={key} className="space-y-1">
                      <div className={`flex items-center gap-1.5 text-sm font-medium ${color}`}>
                        <Icon className="h-4 w-4" />
                        {label}
                      </div>
                      <p className="text-sm text-zinc-700 whitespace-pre-wrap pl-5">
                        {content}
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogHeader>
          <DialogTitle>
            {editingRelease ? "リリースノートを編集" : "リリースノートを作成"}
          </DialogTitle>
        </DialogHeader>
        <ReleaseForm
          defaultValues={editingRelease ?? undefined}
          onSuccess={handleFormSuccess}
        />
      </Dialog>
    </div>
  );
}
