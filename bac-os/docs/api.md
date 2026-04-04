# BaC OS API リファレンス

## 概要

BaC OS は Next.js Server Actions を使用してデータの取得・更新を行います。
すべてのアクションは `src/lib/actions.ts` に定義されています。

## Server Actions

### Constraint（制約）

| アクション | 引数 | 戻り値 | 説明 |
|-----------|------|--------|------|
| `getConstraints()` | なし | `Constraint[]` | 全制約を取得（降順） |
| `getConstraint(id)` | `string` | `Constraint \| null` | 制約を1件取得（仮説含む） |
| `createConstraint(data)` | `ConstraintInput` | `Constraint` | 制約を作成 |
| `updateConstraint(id, data)` | `string, ConstraintInput` | `Constraint` | 制約を更新 |
| `deleteConstraint(id)` | `string` | `void` | 制約を削除 |

### Hypothesis（仮説）

| アクション | 引数 | 戻り値 | 説明 |
|-----------|------|--------|------|
| `getHypotheses()` | なし | `Hypothesis[]` | 全仮説を取得 |
| `createHypothesis(data)` | `HypothesisInput` | `Hypothesis` | 仮説を作成 |
| `updateHypothesis(id, data)` | `string, HypothesisInput` | `Hypothesis` | 仮説を更新 |
| `deleteHypothesis(id)` | `string` | `void` | 仮説を削除 |

### Experiment（実験）

| アクション | 引数 | 戻り値 | 説明 |
|-----------|------|--------|------|
| `getExperiments()` | なし | `Experiment[]` | 全実験を取得 |
| `createExperiment(data)` | `ExperimentInput` | `Experiment` | 実験を作成 |
| `updateExperiment(id, data)` | `string, ExperimentInput` | `Experiment` | 実験を更新 |
| `deleteExperiment(id)` | `string` | `void` | 実験を削除 |

### Feedback（学習）

| アクション | 引数 | 戻り値 | 説明 |
|-----------|------|--------|------|
| `getFeedbacks()` | なし | `Feedback[]` | 全学習を取得 |
| `createFeedback(data)` | `FeedbackInput` | `Feedback` | 学習を作成 |
| `updateFeedback(id, data)` | `string, FeedbackInput` | `Feedback` | 学習を更新 |
| `deleteFeedback(id)` | `string` | `void` | 学習を削除 |

### ReleaseNote（リリースノート）

| アクション | 引数 | 戻り値 | 説明 |
|-----------|------|--------|------|
| `getReleaseNotes()` | なし | `ReleaseNote[]` | 全リリースノートを取得 |
| `createReleaseNote(data)` | `ReleaseNoteInput` | `ReleaseNote` | リリースノートを作成 |
| `updateReleaseNote(id, data)` | `string, ReleaseNoteInput` | `ReleaseNote` | リリースノートを更新 |
| `deleteReleaseNote(id)` | `string` | `void` | リリースノートを削除 |

### Dashboard

| アクション | 引数 | 戻り値 | 説明 |
|-----------|------|--------|------|
| `getDashboardStats()` | なし | `DashboardStats` | ダッシュボード統計情報 |

## バリデーション

すべての入力は Zod スキーマ（`src/types/entities.ts`）でバリデーションされます。
不正な入力はサーバーサイドで拒否されます。

## エラーハンドリング

- すべてのアクションは try/catch でエラーをキャッチ
- ログは `src/lib/logger.ts` で構造化出力
- ユーザーには日本語のエラーメッセージを返却
