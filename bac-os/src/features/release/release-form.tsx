"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { releaseNoteSchema, type ReleaseNoteInput } from "@/types/entities";
import { createReleaseNote, updateReleaseNote } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ReleaseFormProps {
  defaultValues?: {
    id: string;
    version: string;
    summary: string;
    added: string | null;
    changed: string | null;
    fixed: string | null;
    migrationNotes: string | null;
    owner: string;
  };
  onSuccess: () => void;
}

export function ReleaseForm({ defaultValues, onSuccess }: ReleaseFormProps) {
  const isEditing = !!defaultValues;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ReleaseNoteInput>({
    resolver: zodResolver(releaseNoteSchema),
    defaultValues: defaultValues
      ? {
          version: defaultValues.version,
          summary: defaultValues.summary,
          added: defaultValues.added ?? "",
          changed: defaultValues.changed ?? "",
          fixed: defaultValues.fixed ?? "",
          migrationNotes: defaultValues.migrationNotes ?? "",
          owner: defaultValues.owner,
        }
      : {
          version: "",
          summary: "",
          added: "",
          changed: "",
          fixed: "",
          migrationNotes: "",
          owner: "",
        },
  });

  async function onSubmit(data: ReleaseNoteInput) {
    if (isEditing && defaultValues) {
      await updateReleaseNote(defaultValues.id, data);
    } else {
      await createReleaseNote(data);
    }
    onSuccess();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <label className="text-sm font-medium">バージョン</label>
        <Input {...register("version")} placeholder="v1.0.0" />
        {errors.version && (
          <p className="text-xs text-red-500">{errors.version.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">概要</label>
        <Textarea {...register("summary")} placeholder="リリース概要" rows={2} />
        {errors.summary && (
          <p className="text-xs text-red-500">{errors.summary.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">追加 (任意)</label>
        <Textarea {...register("added")} placeholder="追加された機能" rows={2} />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">変更 (任意)</label>
        <Textarea {...register("changed")} placeholder="変更点" rows={2} />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">修正 (任意)</label>
        <Textarea {...register("fixed")} placeholder="修正されたバグ" rows={2} />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">マイグレーション (任意)</label>
        <Textarea
          {...register("migrationNotes")}
          placeholder="マイグレーション手順"
          rows={2}
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">オーナー</label>
        <Input {...register("owner")} placeholder="担当者名" />
        {errors.owner && (
          <p className="text-xs text-red-500">{errors.owner.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "保存中..." : isEditing ? "更新" : "作成"}
      </Button>
    </form>
  );
}
