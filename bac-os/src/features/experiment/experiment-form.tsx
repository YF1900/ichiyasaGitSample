"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { experimentSchema, type ExperimentInput } from "@/types/entities";
import { createExperiment, updateExperiment } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";

const statusOptions = [
  { value: "planned", label: "計画中" },
  { value: "running", label: "実行中" },
  { value: "completed", label: "完了" },
  { value: "cancelled", label: "キャンセル" },
];

type Hypothesis = {
  id: string;
  title: string;
};

interface ExperimentFormProps {
  hypotheses: Hypothesis[];
  initialData?: ExperimentInput & { id: string };
  onSuccess?: () => void;
}

export function ExperimentForm({ hypotheses, initialData, onSuccess }: ExperimentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ExperimentInput>({
    resolver: zodResolver(experimentSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          description: initialData.description,
          method: initialData.method,
          result: initialData.result ?? "",
          status: initialData.status,
          hypothesisId: initialData.hypothesisId ?? "",
          owner: initialData.owner,
        }
      : {
          status: "planned",
          result: "",
          hypothesisId: "",
        },
  });

  const onSubmit = async (data: ExperimentInput) => {
    const payload = {
      ...data,
      hypothesisId: data.hypothesisId || undefined,
      result: data.result || undefined,
    };
    if (initialData?.id) {
      await updateExperiment(initialData.id, payload);
    } else {
      await createExperiment(payload);
    }
    onSuccess?.();
  };

  const hypothesisOptions = [
    { value: "", label: "なし" },
    ...hypotheses.map((h) => ({ value: h.id, label: h.title })),
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">タイトル</label>
        <Input {...register("title")} placeholder="実験のタイトル" />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">説明</label>
        <Textarea {...register("description")} placeholder="実験の説明" />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">手法</label>
        <Textarea {...register("method")} placeholder="実験の手法" />
        {errors.method && (
          <p className="text-sm text-red-500">{errors.method.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">結果</label>
        <Textarea {...register("result")} placeholder="実験の結果（任意）" />
        {errors.result && (
          <p className="text-sm text-red-500">{errors.result.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">ステータス</label>
        <Select {...register("status")} options={statusOptions} />
        {errors.status && (
          <p className="text-sm text-red-500">{errors.status.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">仮説</label>
        <Select {...register("hypothesisId")} options={hypothesisOptions} />
        {errors.hypothesisId && (
          <p className="text-sm text-red-500">{errors.hypothesisId.message}</p>
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
