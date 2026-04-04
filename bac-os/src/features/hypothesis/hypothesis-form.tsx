"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { hypothesisSchema, type HypothesisInput } from "@/types/entities";
import { createHypothesis, updateHypothesis } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";

const statusOptions = [
  { value: "draft", label: "下書き" },
  { value: "testing", label: "検証中" },
  { value: "validated", label: "検証済み" },
  { value: "invalidated", label: "無効" },
];

type ConstraintOption = {
  id: string;
  title: string;
};

interface HypothesisFormProps {
  constraints: ConstraintOption[];
  initialData?: HypothesisInput & { id: string };
  onSuccess?: () => void;
}

export function HypothesisForm({ constraints, initialData, onSuccess }: HypothesisFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<HypothesisInput>({
    resolver: zodResolver(hypothesisSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          description: initialData.description,
          assumption: initialData.assumption,
          expectedOutcome: initialData.expectedOutcome,
          status: initialData.status,
          constraintId: initialData.constraintId,
          owner: initialData.owner,
        }
      : {
          status: "draft",
        },
  });

  const constraintOptions = [
    { value: "", label: "なし" },
    ...constraints.map((c) => ({ value: c.id, label: c.title })),
  ];

  const onSubmit = async (data: HypothesisInput) => {
    const submitData = {
      ...data,
      constraintId: data.constraintId || undefined,
    };
    if (initialData?.id) {
      await updateHypothesis(initialData.id, submitData);
    } else {
      await createHypothesis(submitData);
    }
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">タイトル</label>
        <Input {...register("title")} placeholder="仮説のタイトル" />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">説明</label>
        <Textarea {...register("description")} placeholder="仮説の説明" />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">前提</label>
        <Textarea {...register("assumption")} placeholder="仮説の前提条件" />
        {errors.assumption && (
          <p className="text-sm text-red-500">{errors.assumption.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">期待結果</label>
        <Textarea {...register("expectedOutcome")} placeholder="期待される結果" />
        {errors.expectedOutcome && (
          <p className="text-sm text-red-500">{errors.expectedOutcome.message}</p>
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
        <label className="text-sm font-medium">関連する制約</label>
        <Select {...register("constraintId")} options={constraintOptions} />
        {errors.constraintId && (
          <p className="text-sm text-red-500">{errors.constraintId.message}</p>
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
