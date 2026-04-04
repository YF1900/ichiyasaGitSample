"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { constraintSchema, type ConstraintInput } from "@/types/entities";
import { createConstraint, updateConstraint } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";

const categoryOptions = [
  { value: "market", label: "市場" },
  { value: "resource", label: "リソース" },
  { value: "technical", label: "技術" },
  { value: "regulation", label: "規制" },
  { value: "other", label: "その他" },
];

const severityOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
];

interface ConstraintFormProps {
  initialData?: ConstraintInput & { id: string };
  onSuccess?: () => void;
}

export function ConstraintForm({ initialData, onSuccess }: ConstraintFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ConstraintInput>({
    resolver: zodResolver(constraintSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          description: initialData.description,
          category: initialData.category,
          severity: initialData.severity,
          owner: initialData.owner,
        }
      : {
          category: "other",
          severity: "medium",
        },
  });

  const onSubmit = async (data: ConstraintInput) => {
    if (initialData?.id) {
      await updateConstraint(initialData.id, data);
    } else {
      await createConstraint(data);
    }
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">タイトル</label>
        <Input {...register("title")} placeholder="制約のタイトル" />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">説明</label>
        <Textarea {...register("description")} placeholder="制約の説明" />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">カテゴリ</label>
        <Select {...register("category")} options={categoryOptions} />
        {errors.category && (
          <p className="text-sm text-red-500">{errors.category.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">重要度</label>
        <Select {...register("severity")} options={severityOptions} />
        {errors.severity && (
          <p className="text-sm text-red-500">{errors.severity.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">オーナー</label>
        <Input {...register("owner")} placeholder="担当者名" />
        {errors.owner && (
          <p className="text-sm text-red-500">{errors.owner.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onSuccess}>
          キャンセル
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "保存中..." : initialData ? "更新" : "作成"}
        </Button>
      </div>
    </form>
  );
}
