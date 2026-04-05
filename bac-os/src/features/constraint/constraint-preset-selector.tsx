"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckSquareFill,
  Square,
  BuildingFill,
  PeopleFill,
  BoxArrowInDown,
} from "react-bootstrap-icons";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { createConstraint } from "@/lib/actions";
import {
  industries,
  companySizes,
  getConstraintPresets,
  type Industry,
  type CompanySize,
} from "./constraint-presets";

const categoryLabels: Record<string, string> = {
  market: "市場",
  resource: "リソース",
  technical: "技術",
  regulation: "規制",
  other: "その他",
};

const severityLabels: Record<string, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

const severityVariants: Record<string, "secondary" | "info" | "warning" | "destructive"> = {
  low: "secondary",
  medium: "info",
  high: "warning",
  critical: "destructive",
};

interface PresetSelectorProps {
  onComplete: () => void;
}

export function ConstraintPresetSelector({ onComplete }: PresetSelectorProps) {
  const router = useRouter();
  const [step, setStep] = useState<"select" | "review">("select");
  const [industry, setIndustry] = useState<Industry | "">("");
  const [size, setSize] = useState<CompanySize | "">("");
  const [owner, setOwner] = useState("");
  const [selectedIndexes, setSelectedIndexes] = useState<Set<number>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const presets =
    industry && size ? getConstraintPresets(industry as Industry, size as CompanySize) : [];

  const handleGenerate = () => {
    if (!industry || !size) return;
    setSelectedIndexes(new Set(presets.map((_, i) => i)));
    setStep("review");
  };

  const toggleIndex = (i: number) => {
    setSelectedIndexes((prev) => {
      const next = new Set(prev);
      if (next.has(i)) {
        next.delete(i);
      } else {
        next.add(i);
      }
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIndexes.size === presets.length) {
      setSelectedIndexes(new Set());
    } else {
      setSelectedIndexes(new Set(presets.map((_, i) => i)));
    }
  };

  const handleImport = async () => {
    if (!owner.trim()) return;
    setIsSubmitting(true);
    try {
      const selected = presets.filter((_, i) => selectedIndexes.has(i));
      for (const preset of selected) {
        await createConstraint({ ...preset, owner: owner.trim() });
      }
      router.refresh();
      onComplete();
    } finally {
      setIsSubmitting(false);
    }
  };

  // ===== Step 1: 業界・規模選択 =====
  if (step === "select") {
    return (
      <div className="space-y-5">
        <p className="text-sm" style={{ color: "#495057" }}>
          業界と企業規模を選択すると、代表的な制約テンプレートが生成されます。
        </p>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-semibold" style={{ color: "#1a1a2e" }}>
              <BuildingFill size={14} aria-hidden="true" style={{ color: "#4361ee" }} />
              業界
            </label>
            <Select
              value={industry}
              onChange={(e) => setIndustry(e.target.value as Industry)}
              options={industries.map((i) => ({ value: i.value, label: i.label }))}
              placeholder="業界を選択"
            />
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-semibold" style={{ color: "#1a1a2e" }}>
              <PeopleFill size={14} aria-hidden="true" style={{ color: "#4361ee" }} />
              企業規模
            </label>
            <Select
              value={size}
              onChange={(e) => setSize(e.target.value as CompanySize)}
              options={companySizes.map((s) => ({ value: s.value, label: s.label }))}
              placeholder="規模を選択"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onComplete}>
            キャンセル
          </Button>
          <Button onClick={handleGenerate} disabled={!industry || !size}>
            テンプレート生成
          </Button>
        </div>
      </div>
    );
  }

  // ===== Step 2: プリセットのレビュー・選択 =====
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold" style={{ color: "#1a1a2e" }}>
          {presets.length}件の制約テンプレート
        </p>
        <Button variant="ghost" size="sm" onClick={toggleAll}>
          {selectedIndexes.size === presets.length ? "すべて解除" : "すべて選択"}
        </Button>
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
        {presets.map((preset, i) => {
          const isSelected = selectedIndexes.has(i);
          return (
            <Card
              key={i}
              style={{
                borderColor: isSelected ? "#4361ee" : "#dee2e6",
                cursor: "pointer",
              }}
              onClick={() => toggleIndex(i)}
              role="checkbox"
              aria-checked={isSelected}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === " " || e.key === "Enter") {
                  e.preventDefault();
                  toggleIndex(i);
                }
              }}
            >
              <CardContent className="py-3 px-4">
                <div className="flex items-start gap-3">
                  <div className="pt-0.5 flex-shrink-0">
                    {isSelected ? (
                      <CheckSquareFill size={18} style={{ color: "#4361ee" }} aria-hidden="true" />
                    ) : (
                      <Square size={18} style={{ color: "#adb5bd" }} aria-hidden="true" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold" style={{ color: "#1a1a2e" }}>
                      {preset.title}
                    </p>
                    <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "#6c757d" }}>
                      {preset.description}
                    </p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {categoryLabels[preset.category]}
                      </Badge>
                      <Badge variant={severityVariants[preset.severity]} className="text-xs">
                        {severityLabels[preset.severity]}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="space-y-1.5 pt-2 border-t" style={{ borderColor: "#dee2e6" }}>
        <label className="text-sm font-semibold" style={{ color: "#1a1a2e" }}>
          オーナー（担当者）
        </label>
        <Input
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
          placeholder="担当者名を入力"
        />
      </div>

      <div className="flex justify-between items-center pt-2">
        <Button variant="outline" onClick={() => setStep("select")}>
          戻る
        </Button>
        <Button
          onClick={handleImport}
          disabled={selectedIndexes.size === 0 || !owner.trim() || isSubmitting}
        >
          <BoxArrowInDown size={16} aria-hidden="true" />
          {isSubmitting
            ? "追加中..."
            : `${selectedIndexes.size}件を追加`}
        </Button>
      </div>
    </div>
  );
}
