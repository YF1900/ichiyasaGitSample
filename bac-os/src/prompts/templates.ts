export interface PromptTemplate {
  id: string;
  name: string;
  category: "constraint" | "hypothesis" | "experiment" | "feedback" | "action";
  description: string;
  template: string;
}

export const promptTemplates: PromptTemplate[] = [
  {
    id: "constraint-analysis",
    name: "制約分析",
    category: "constraint",
    description: "ビジネス制約を分析し、隠れた機会を発見する",
    template: `あなたはビジネスストラテジストです。以下の制約を分析してください。

【制約タイトル】: {title}
【説明】: {description}
【カテゴリ】: {category}
【重要度】: {severity}

以下の観点で分析してください：
1. この制約の本質的な原因は何か？
2. この制約から生まれる機会はあるか？
3. 制約を緩和するために取れるアクションは？
4. 類似業界での対処事例は？
5. 短期・中期・長期の対策を提案してください。`,
  },
  {
    id: "hypothesis-generation",
    name: "仮説生成",
    category: "hypothesis",
    description: "制約やデータから仮説を生成する",
    template: `あなたはデータドリブンな仮説思考の専門家です。以下の情報から仮説を生成してください。

【コンテキスト】: {context}
【既知の制約】: {constraints}
【目標】: {goal}

以下の形式で3つの仮説を提案してください：
各仮説について：
- 仮説の記述（If...then...because...形式）
- 前提条件
- 検証方法
- 期待される結果
- リスクと不確実性`,
  },
  {
    id: "experiment-design",
    name: "実験設計",
    category: "experiment",
    description: "仮説を検証する実験を設計する",
    template: `あなたは実験設計の専門家です。以下の仮説を検証する実験を設計してください。

【仮説】: {hypothesis}
【前提】: {assumption}
【期待結果】: {expectedOutcome}

以下を含む実験計画を作成してください：
1. 実験の目的と範囲
2. 具体的な手順（ステップバイステップ）
3. 成功基準（定量的KPI）
4. 必要なリソースと期間
5. リスクと対策
6. AI vs 人が担当すべきタスクの分解`,
  },
  {
    id: "feedback-reflection",
    name: "振り返り分析",
    category: "feedback",
    description: "実験結果から学びを抽出する",
    template: `あなたは組織学習の専門家です。以下の実験結果を振り返り、学びを抽出してください。

【実験タイトル】: {experimentTitle}
【手法】: {method}
【結果】: {result}

以下の観点で振り返ってください：
1. 何がうまくいったか？（成功要因）
2. 何がうまくいかなかったか？（失敗要因）
3. 予想外の発見は？
4. 次に活かせる学びは？
5. 組織として記録すべきナレッジは？
6. 次のアクションアイテム（優先度付き）`,
  },
  {
    id: "next-action",
    name: "次アクション提案",
    category: "action",
    description: "学習結果から次のアクションを提案する",
    template: `あなたはアクションプランニングの専門家です。以下の学習結果から次のアクションを提案してください。

【これまでの学び】:
{learnings}

【現在の制約】:
{currentConstraints}

【目標】:
{goal}

以下を提案してください：
1. 即座に実行すべきアクション（24時間以内）
2. 短期アクション（1週間以内）
3. 中期アクション（1ヶ月以内）
4. 各アクションのAI活用可能性
5. 期待される学習速度（β）への影響`,
  },
];

export function fillTemplate(template: string, variables: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, "g"), value || "(未入力)");
  }
  return result;
}
