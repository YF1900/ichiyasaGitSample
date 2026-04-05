import type { ConstraintInput } from "@/types/entities";

// ===== 業界定義 =====
export const industries = [
  { value: "saas", label: "SaaS / IT" },
  { value: "ec", label: "EC / 小売" },
  { value: "manufacturing", label: "製造業" },
  { value: "finance", label: "金融 / フィンテック" },
  { value: "healthcare", label: "医療 / ヘルスケア" },
  { value: "education", label: "教育 / EdTech" },
  { value: "media", label: "メディア / コンテンツ" },
  { value: "consulting", label: "コンサルティング" },
  { value: "realestate", label: "不動産" },
  { value: "food", label: "飲食 / フードテック" },
] as const;

// ===== 規模定義 =====
export const companySizes = [
  { value: "startup", label: "スタートアップ（〜10名）" },
  { value: "small", label: "小規模（11〜50名）" },
  { value: "medium", label: "中規模（51〜300名）" },
  { value: "large", label: "大企業（300名〜）" },
] as const;

export type Industry = (typeof industries)[number]["value"];
export type CompanySize = (typeof companySizes)[number]["value"];

type PresetConstraint = Omit<ConstraintInput, "owner">;

// ===== 共通制約（どの業界・規模にも当てはまる） =====
const commonConstraints: PresetConstraint[] = [
  {
    title: "限られた予算",
    description: "使える資金に上限があり、投資対効果を常に検討する必要がある",
    category: "resource",
    severity: "high",
  },
  {
    title: "人材不足",
    description: "必要なスキルを持つ人材の採用・確保が困難",
    category: "resource",
    severity: "high",
  },
  {
    title: "時間的制約",
    description: "市場投入やプロジェクト完了までの時間が限られている",
    category: "resource",
    severity: "medium",
  },
];

// ===== 規模別の追加制約 =====
const sizeConstraints: Record<CompanySize, PresetConstraint[]> = {
  startup: [
    {
      title: "ブランド認知度の低さ",
      description: "市場での認知度がなく、顧客獲得コストが高い",
      category: "market",
      severity: "high",
    },
    {
      title: "組織体制の未整備",
      description: "業務プロセスやルールが未確立で、属人化しやすい",
      category: "resource",
      severity: "medium",
    },
    {
      title: "資金調達の不確実性",
      description: "次のラウンドまでのランウェイが限られている",
      category: "resource",
      severity: "critical",
    },
  ],
  small: [
    {
      title: "スケーラビリティの課題",
      description: "成長に伴い既存の仕組みが対応しきれなくなるリスク",
      category: "technical",
      severity: "medium",
    },
    {
      title: "マネジメント層の不足",
      description: "中間管理職が不在で、経営者が実務にも追われる",
      category: "resource",
      severity: "high",
    },
  ],
  medium: [
    {
      title: "部門間連携の非効率",
      description: "組織のサイロ化により情報共有やコラボレーションが困難",
      category: "resource",
      severity: "medium",
    },
    {
      title: "レガシーシステムの存在",
      description: "初期に導入したシステムが技術的負債となっている",
      category: "technical",
      severity: "high",
    },
    {
      title: "意思決定の遅延",
      description: "承認プロセスが複雑化し、素早い意思決定が困難",
      category: "resource",
      severity: "medium",
    },
  ],
  large: [
    {
      title: "イノベーションのジレンマ",
      description: "既存事業の最適化が優先され、新規事業への投資が抑制される",
      category: "market",
      severity: "high",
    },
    {
      title: "コンプライアンス要件",
      description: "法規制やガバナンス要件への対応コストが大きい",
      category: "regulation",
      severity: "high",
    },
    {
      title: "組織の硬直性",
      description: "大規模組織特有の官僚主義やプロセスの重さ",
      category: "resource",
      severity: "medium",
    },
    {
      title: "グローバル展開の複雑性",
      description: "各国の法規制・文化・市場特性への対応が必要",
      category: "regulation",
      severity: "medium",
    },
  ],
};

// ===== 業界別の追加制約 =====
const industryConstraints: Record<Industry, PresetConstraint[]> = {
  saas: [
    {
      title: "チャーンレートの管理",
      description: "顧客の解約率を低く抑える必要があり、継続的な価値提供が求められる",
      category: "market",
      severity: "high",
    },
    {
      title: "競合プロダクトの多さ",
      description: "SaaS市場は参入障壁が低く、類似サービスとの差別化が困難",
      category: "market",
      severity: "medium",
    },
    {
      title: "セキュリティ・データ保護",
      description: "顧客データを預かるため、高いセキュリティ基準への準拠が必須",
      category: "technical",
      severity: "critical",
    },
  ],
  ec: [
    {
      title: "物流コストの上昇",
      description: "配送費の高騰が利益率を圧迫する",
      category: "resource",
      severity: "high",
    },
    {
      title: "プラットフォーム依存リスク",
      description: "大手ECモールの規約変更やアルゴリズム変動による売上影響",
      category: "market",
      severity: "high",
    },
    {
      title: "返品・在庫管理",
      description: "在庫の最適化と返品対応のコスト管理が重要",
      category: "resource",
      severity: "medium",
    },
  ],
  manufacturing: [
    {
      title: "原材料コストの変動",
      description: "原材料価格や為替の変動が製造コストに直接影響",
      category: "resource",
      severity: "high",
    },
    {
      title: "サプライチェーンリスク",
      description: "部品供給の途絶や遅延によるラインストップのリスク",
      category: "resource",
      severity: "critical",
    },
    {
      title: "環境規制への対応",
      description: "脱炭素化やリサイクル規制など環境法規制への適合が必要",
      category: "regulation",
      severity: "high",
    },
  ],
  finance: [
    {
      title: "金融規制の厳格さ",
      description: "金融庁等の規制に準拠する必要があり、開発・運用に制約",
      category: "regulation",
      severity: "critical",
    },
    {
      title: "セキュリティ要件の高さ",
      description: "金融システムへのサイバー攻撃リスクが高く、厳格なセキュリティが必要",
      category: "technical",
      severity: "critical",
    },
    {
      title: "レガシーシステムとの統合",
      description: "既存の銀行システムやAPIとの連携が技術的に複雑",
      category: "technical",
      severity: "high",
    },
  ],
  healthcare: [
    {
      title: "医療データの取扱規制",
      description: "個人情報保護法や医療情報ガイドラインへの厳格な準拠が必要",
      category: "regulation",
      severity: "critical",
    },
    {
      title: "医療従事者のIT リテラシー",
      description: "ユーザーのITスキルにばらつきがあり、UXへの配慮が必要",
      category: "market",
      severity: "medium",
    },
    {
      title: "薬事承認プロセス",
      description: "製品の市場投入までに長い承認プロセスが必要",
      category: "regulation",
      severity: "high",
    },
  ],
  education: [
    {
      title: "教育機関の予算制約",
      description: "学校・教育委員会の予算サイクルと限られた予算枠",
      category: "market",
      severity: "high",
    },
    {
      title: "導入までの意思決定の長さ",
      description: "教育委員会やPTAなど多くのステークホルダーの合意が必要",
      category: "market",
      severity: "medium",
    },
    {
      title: "デジタルデバイド",
      description: "端末やネットワーク環境の格差への対応が必要",
      category: "technical",
      severity: "medium",
    },
  ],
  media: [
    {
      title: "広告収益の不安定性",
      description: "広告市場の変動やアドブロックの普及による収益への影響",
      category: "market",
      severity: "high",
    },
    {
      title: "コンテンツ制作コスト",
      description: "質の高いコンテンツの継続的な制作にかかるコスト",
      category: "resource",
      severity: "medium",
    },
    {
      title: "著作権・権利処理",
      description: "コンテンツの著作権管理や利用許諾の複雑さ",
      category: "regulation",
      severity: "high",
    },
  ],
  consulting: [
    {
      title: "属人的なナレッジ",
      description: "個人の経験や知見に依存し、組織として蓄積しにくい",
      category: "resource",
      severity: "high",
    },
    {
      title: "稼働率の管理",
      description: "コンサルタントの稼働率を最適に維持する必要がある",
      category: "resource",
      severity: "medium",
    },
    {
      title: "価格競争",
      description: "コモディティ化した領域での価格下落プレッシャー",
      category: "market",
      severity: "medium",
    },
  ],
  realestate: [
    {
      title: "市場サイクルの影響",
      description: "不動産市場の景気循環による需要変動が大きい",
      category: "market",
      severity: "high",
    },
    {
      title: "法規制・建築基準",
      description: "建築基準法、都市計画法など多岐にわたる法規制への対応",
      category: "regulation",
      severity: "high",
    },
    {
      title: "初期投資の大きさ",
      description: "不動産取得や開発に大きな初期投資が必要",
      category: "resource",
      severity: "critical",
    },
  ],
  food: [
    {
      title: "食品衛生法への準拠",
      description: "HACCPやアレルゲン表示など食品安全に関する規制対応",
      category: "regulation",
      severity: "critical",
    },
    {
      title: "食材の価格変動",
      description: "天候や輸入環境による食材原価の変動リスク",
      category: "resource",
      severity: "high",
    },
    {
      title: "人手不足（現場スタッフ）",
      description: "飲食・食品製造現場の慢性的な人手不足",
      category: "resource",
      severity: "high",
    },
  ],
};

// ===== プリセット取得関数 =====
export function getConstraintPresets(
  industry: Industry,
  size: CompanySize
): PresetConstraint[] {
  return [
    ...commonConstraints,
    ...sizeConstraints[size],
    ...industryConstraints[industry],
  ];
}
