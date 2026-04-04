"use client";

import { useState } from "react";
import { promptTemplates, fillTemplate, type PromptTemplate } from "@/prompts/templates";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Bot, Copy } from "lucide-react";

const categories = [
  { value: "all", label: "すべて" },
  { value: "constraint", label: "制約分析" },
  { value: "hypothesis", label: "仮説生成" },
  { value: "experiment", label: "実験設計" },
  { value: "feedback", label: "振り返り" },
  { value: "action", label: "次アクション" },
] as const;

function extractVariables(template: string): string[] {
  const matches = template.match(/\{(\w+)\}/g);
  if (!matches) return [];
  return [...new Set(matches.map((m) => m.slice(1, -1)))];
}

export function AiPromptCenter() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(null);
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [generatedPrompt, setGeneratedPrompt] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const filteredTemplates =
    selectedCategory === "all"
      ? promptTemplates
      : promptTemplates.filter((t) => t.category === selectedCategory);

  function handleOpenTemplate(template: PromptTemplate) {
    const vars = extractVariables(template.template);
    const initial: Record<string, string> = {};
    for (const v of vars) {
      initial[v] = "";
    }
    setVariables(initial);
    setGeneratedPrompt("");
    setCopied(false);
    setSelectedTemplate(template);
  }

  function handleGenerate() {
    if (!selectedTemplate) return;
    const result = fillTemplate(selectedTemplate.template, variables);
    setGeneratedPrompt(result);
    setCopied(false);
  }

  async function handleCopy() {
    if (!generatedPrompt) return;
    await navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const templateVars = selectedTemplate
    ? extractVariables(selectedTemplate.template)
    : [];

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Button
            key={cat.value}
            variant={selectedCategory === cat.value ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(cat.value)}
          >
            {cat.label}
          </Button>
        ))}
      </div>

      {/* Template Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <CardTitle>{template.name}</CardTitle>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => handleOpenTemplate(template)}>
                <Bot className="h-4 w-4" />
                プロンプト生成
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Template Dialog */}
      <Dialog
        open={selectedTemplate !== null}
        onClose={() => setSelectedTemplate(null)}
      >
        {selectedTemplate && (
          <>
            <DialogHeader>
              <DialogTitle>{selectedTemplate.name}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {/* Variable Inputs */}
              {templateVars.map((varName) => (
                <div key={varName} className="space-y-1">
                  <label className="text-sm font-medium">{varName}</label>
                  {varName === "description" ||
                  varName === "context" ||
                  varName === "constraints" ||
                  varName === "learnings" ||
                  varName === "currentConstraints" ||
                  varName === "result" ? (
                    <Textarea
                      value={variables[varName] ?? ""}
                      onChange={(e) =>
                        setVariables((prev) => ({
                          ...prev,
                          [varName]: e.target.value,
                        }))
                      }
                      placeholder={varName}
                      rows={3}
                    />
                  ) : (
                    <Input
                      value={variables[varName] ?? ""}
                      onChange={(e) =>
                        setVariables((prev) => ({
                          ...prev,
                          [varName]: e.target.value,
                        }))
                      }
                      placeholder={varName}
                    />
                  )}
                </div>
              ))}

              <Button onClick={handleGenerate} className="w-full">
                生成
              </Button>

              {/* Generated Prompt */}
              {generatedPrompt && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">生成されたプロンプト</span>
                    <Button variant="outline" size="sm" onClick={handleCopy}>
                      <Copy className="h-4 w-4" />
                      {copied ? "コピーしました！" : "コピー"}
                    </Button>
                  </div>
                  <pre className="whitespace-pre-wrap rounded-md bg-zinc-50 p-4 text-sm font-mono border">
                    <code>{generatedPrompt}</code>
                  </pre>
                </div>
              )}
            </div>
          </>
        )}
      </Dialog>
    </div>
  );
}
