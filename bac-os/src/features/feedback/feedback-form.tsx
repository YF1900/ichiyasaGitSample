"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { feedbackSchema, type FeedbackInput } from "@/types/entities";
import { createFeedback, updateFeedback } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";

const learningTypeOptions = [
  { value: "success", label: "成功" },
  { value: "failure", label: "失敗" },
  { value: "observation", label: "観察" },
  { value: "improvement", label: "改善" },
];

type Experiment = {
  id: string;
  title: string;
};

interface FeedbackFormProps {
  experiments: Experiment[];
  initialData?: FeedbackInput & { id: string };
  onSuccess?: () => void;
}

export function FeedbackForm({ experiments, initialData, onSuccess }: FeedbackFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FeedbackInput>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          insight: initialData.insight,
          learningType: initialData.learningType,
          actionItems: initialData.actionItems ?? "",
          experimentId: initialData.experimentId ?? "",
          owner: initialData.owner,
        }
      : {
          learningType: "observation",
          actionItems: "",
          experimentId: "",
        },
  });

  const onSubmit = async (data: FeedbackInput) => {
    const payload = {
      ...data,
      experimentId: data.experimentId || undefined,
      actionItems: data.actionItems || undefined,
    };
    if (initialData?.id) {
      await updateFeedback(initialData.id, payload);
    } else {
      await createFeedback(payload);
    }
    onSuccess?.();
  };

  const experimentOptions = [
    { value: "", label: "なし" },
    ...experiments.map((e) => ({ value: e.id, label: e.title })),
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">タイトル</label>
        <Input {...register("title")} placeholder="フィードバックのタイトル" />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">インサイト</label>
        <Textarea {...register("insight")} placeholder="得られたインサイト" />
        {errors.insight && (
          <p className="text-sm text-red-500">{errors.insight.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">学習タイプ</label>
        <Select {...register("learningType")} options={learningTypeOptions} />
        {errors.learningType && (
          <p className="text-sm text-red-500">{errors.learningType.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">アクションアイテム</label>
        <Textarea {...register("actionItems")} placeholder="次のアクション（任意）" />
        {errors.actionItems && (
          <p className="text-sm text-red-500">{errors.actionItems.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">実験</label>
        <Select {...register("experimentId")} options={experimentOptions} />
        {errors.experimentId && (
          <p className="text-sm text-red-500">{errors.experimentId.message}</p>
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
