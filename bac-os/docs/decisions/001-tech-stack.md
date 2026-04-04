# ADR-001: 技術スタック選定

## ステータス

承認済み

## コンテキスト

BaC OS は社内向け Web アプリケーションとして、以下を実現する必要がある：
- 高速な開発サイクル
- 型安全性
- データの永続化と非破壊設計
- AIとの統合

## 決定

| 領域 | 技術 | 理由 |
|------|------|------|
| FW | Next.js (App Router) | Server Components によるパフォーマンス、Server Actions による簡潔なデータ操作 |
| 言語 | TypeScript (strict) | 型安全性、開発体験 |
| CSS | Tailwind CSS | ユーティリティファースト、高速なUI構築 |
| UI | shadcn/ui互換 | カスタマイズ性、依存の最小化 |
| ORM | Prisma | 型安全なDB操作、マイグレーション管理 |
| DB | PostgreSQL | 信頼性、拡張性 |
| バリデーション | Zod | ランタイムバリデーション、TypeScript統合 |
| フォーム | React Hook Form | パフォーマンス、Zod統合 |
| チャート | Recharts | React ネイティブ、宣言的API |

## 結果

- 開発生産性が高い
- 型安全性が保証される
- Server Actions により API Layer が不要
- Prisma により DB 操作が型安全
