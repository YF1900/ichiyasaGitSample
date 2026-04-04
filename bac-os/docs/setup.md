# BaC OS セットアップガイド

## 前提条件

- Node.js 18 以上
- PostgreSQL 14 以上
- npm

## セットアップ手順

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd bac-os
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. 環境変数の設定

```bash
cp .env.example .env
```

`.env` ファイルを編集し、PostgreSQL の接続情報を設定：

```
DATABASE_URL="postgresql://postgres:password@localhost:5432/bac_os?schema=public"
```

### 4. データベースの作成

```bash
createdb bac_os
```

### 5. Prisma クライアントの生成

```bash
npx prisma generate
```

### 6. マイグレーションの実行

```bash
npx prisma migrate dev --name init
```

### 7. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで http://localhost:3000 にアクセス。

## その他のコマンド

| コマンド | 説明 |
|---------|------|
| `npm run build` | プロダクションビルド |
| `npm run start` | プロダクションサーバー起動 |
| `npm run lint` | ESLint 実行 |
| `npx prisma studio` | Prisma Studio（DB GUI） |
| `npx prisma migrate dev` | マイグレーション実行 |
| `npx prisma db seed` | シードデータ投入 |

## トラブルシューティング

### データベース接続エラー

- PostgreSQL が起動しているか確認
- `.env` の `DATABASE_URL` が正しいか確認
- データベース `bac_os` が存在するか確認

### Prisma エラー

```bash
npx prisma generate
npx prisma migrate reset
```
