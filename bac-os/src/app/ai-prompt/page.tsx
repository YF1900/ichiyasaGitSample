import { AiPromptCenter } from "@/features/ai-prompt/ai-prompt-center";

export default function AiPromptPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">AI プロンプトセンター</h1>
        <p className="text-sm text-zinc-500 mt-1">
          AIに相談するためのプロンプトテンプレート
        </p>
      </div>
      <AiPromptCenter />
    </div>
  );
}
