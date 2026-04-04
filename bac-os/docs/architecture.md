# BaC OS アーキテクチャ

## 概要

BaC OS は「Business as Code」を実現する社内向けWebアプリケーションです。
ビジネスの意思決定・行動・学習をコードとして扱い、組織の学習速度（β）を最大化します。

## コアコンセプト

```
Business = f(C, L, A, E)
```

- **C (Constraint)**: ビジネス制約（市場、リソース、技術、規制など）
- **L (Logic)**: 判断ロジック（仮説に基づく意思決定）
- **A (Action)**: 行動（実験・施策の実行）
- **E (Experience)**: 学習（結果からのフィードバックと改善）

## システム構成

```
┌─────────────────────────────────────────────────┐
│                  BaC Business OS                │
├──────────┬──────────┬──────────┬────────────────┤
│Constraint│Hypothesis│Experiment│   Feedback     │
│ Canvas   │ Engine   │ Tracker  │   Logger       │
├──────────┴──────────┴──────────┴────────────────┤
│          AI Action Layer (Prompt Center)         │
├─────────────────────────────────────────────────┤
│    KPI Dashboard  │  Learning Graph  │ Release  │
├─────────────────────────────────────────────────┤
│  Next.js App Router + Prisma + PostgreSQL       │
└─────────────────────────────────────────────────┘
```

## 技術スタック

| レイヤー | 技術 |
|---------|------|
| フロントエンド | Next.js (App Router), React, TypeScript |
| スタイリング | Tailwind CSS, shadcn/ui互換コンポーネント |
| バリデーション | Zod, React Hook Form |
| ORM | Prisma |
| データベース | PostgreSQL |
| チャート | Recharts |
| アイコン | lucide-react |

## ディレクトリ構造

```
bac-os/
├── src/
│   ├── app/              # Next.js App Router ページ
│   │   ├── constraints/  # 制約管理
│   │   ├── hypotheses/   # 仮説管理
│   │   ├── experiments/  # 実験管理
│   │   ├── feedbacks/    # 学習管理
│   │   ├── ai-prompt/    # AIプロンプトセンター
│   │   └── releases/     # リリースノート
│   ├── components/ui/    # 共通UIコンポーネント
│   ├── features/         # 機能別コンポーネント
│   ├── lib/              # ユーティリティ・サーバーアクション
│   ├── types/            # 型定義・Zodスキーマ
│   └── prompts/          # AIプロンプトテンプレート
├── prisma/               # Prismaスキーマ・マイグレーション
├── docs/                 # ドキュメント
└── public/               # 静的ファイル
```

## データフロー

```
Constraint → Hypothesis → Experiment → Feedback
    │              │            │           │
    └──────────────┴────────────┴───────────┘
                       ↓
              Learning Loop (β最大化)
```

## 設計原則

1. **非破壊設計**: データは削除せず、バージョン管理で履歴を保持
2. **モジュール分割**: feature単位で独立した設計
3. **型安全性**: TypeScript strict + Zod バリデーション
4. **Server/Client分離**: データ取得はServer Component、操作はClient Component
5. **3秒ルール**: すべての操作は3秒以内に応答
