# BaC OS データモデル

## ER図

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐     ┌─────────────┐
│ Constraint  │1───N│  Hypothesis  │1───N│  Experiment  │1───N│  Feedback   │
├─────────────┤     ├──────────────┤     ├──────────────┤     ├─────────────┤
│ id          │     │ id           │     │ id           │     │ id          │
│ title       │     │ title        │     │ title        │     │ title       │
│ description │     │ description  │     │ description  │     │ insight     │
│ category    │     │ assumption   │     │ method       │     │ learningType│
│ severity    │     │ expectedOut  │     │ result       │     │ actionItems │
│ owner       │     │ status       │     │ status       │     │ owner       │
│ createdAt   │     │ constraintId │     │ hypothesisId │     │ experimentId│
│ updatedAt   │     │ owner        │     │ owner        │     │ createdAt   │
└─────────────┘     │ createdAt    │     │ createdAt    │     │ updatedAt   │
                    │ updatedAt    │     │ updatedAt    │     └─────────────┘
                    └──────────────┘     └──────────────┘

┌───────────────┐
│  ReleaseNote  │ (独立エンティティ)
├───────────────┤
│ id            │
│ version       │
│ summary       │
│ added         │
│ changed       │
│ fixed         │
│ migrationNotes│
│ owner         │
│ createdAt     │
│ updatedAt     │
└───────────────┘
```

## テーブル詳細

### Constraint（制約）

| カラム | 型 | 必須 | 説明 |
|--------|-----|------|------|
| id | CUID | ○ | 主キー |
| title | String | ○ | タイトル |
| description | String | ○ | 説明 |
| category | Enum | ○ | market / resource / technical / regulation / other |
| severity | Enum | ○ | low / medium / high / critical |
| owner | String | ○ | 担当者 |
| createdAt | DateTime | ○ | 作成日時 |
| updatedAt | DateTime | ○ | 更新日時 |

### Hypothesis（仮説）

| カラム | 型 | 必須 | 説明 |
|--------|-----|------|------|
| id | CUID | ○ | 主キー |
| title | String | ○ | タイトル |
| description | String | ○ | 説明 |
| assumption | String | ○ | 前提条件 |
| expectedOutcome | String | ○ | 期待される結果 |
| status | Enum | ○ | draft / testing / validated / invalidated |
| constraintId | String | | 関連する制約ID |
| owner | String | ○ | 担当者 |

### Experiment（実験）

| カラム | 型 | 必須 | 説明 |
|--------|-----|------|------|
| id | CUID | ○ | 主キー |
| title | String | ○ | タイトル |
| description | String | ○ | 説明 |
| method | String | ○ | 実験手法 |
| result | String | | 実験結果 |
| status | Enum | ○ | planned / running / completed / cancelled |
| hypothesisId | String | | 関連する仮説ID |
| owner | String | ○ | 担当者 |

### Feedback（学習）

| カラム | 型 | 必須 | 説明 |
|--------|-----|------|------|
| id | CUID | ○ | 主キー |
| title | String | ○ | タイトル |
| insight | String | ○ | 学んだこと |
| learningType | Enum | ○ | success / failure / observation / improvement |
| actionItems | String | | 次のアクション |
| experimentId | String | | 関連する実験ID |
| owner | String | ○ | 担当者 |

### ReleaseNote（リリースノート）

| カラム | 型 | 必須 | 説明 |
|--------|-----|------|------|
| id | CUID | ○ | 主キー |
| version | String | ○ | バージョン |
| summary | String | ○ | 概要 |
| added | String | | 追加機能 |
| changed | String | | 変更点 |
| fixed | String | | 修正点 |
| migrationNotes | String | | マイグレーション情報 |
| owner | String | ○ | 担当者 |
