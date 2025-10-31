# 東勝会社 CMSウェブサイト

太陽光発電パネルの点検・清掃・保守を専門とする東勝会社のコーポレートサイトです。React + TypeScript + Supabaseで構築されています。

## ✨ 主な機能

### 🌐 公開サイト
- 多言語対応（日本語・中国語）
- レスポンシブデザイン
- 動的コンテンツ管理
- カラーテーマ変更
- SEO最適化

### 🔐 管理画面（CMS）
- WordPress風のUI
- 認証システム（Supabase Auth）
- 会社情報管理
  - ファビコン管理（ブラウザタブ・フッター・ヒーローセクション）
  - カラーテーマ設定（4種類のプリセット）
- サービス管理（CRUD操作）
- ブログ管理
  - リッチエディタ（HTML対応）
  - アイキャッチ画像設定
  - ブログ詳細ページ
- FAQ管理
- SEO設定管理
  - ページ別設定（title, description, keywords）
  - OGP設定
  - Twitter Card設定
  - 構造化データ管理
- 論理削除・復元機能

## 🚀 クイックスタート

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.example`をコピーして`.env`を作成し、Supabaseの情報を設定：

```bash
cp .env.example .env
```

`.env`の内容：
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Supabaseデータベースのセットアップ

1. [Supabase](https://supabase.com/dashboard)で新規プロジェクトを作成
2. **SQL Editor**でマイグレーションを順番に実行：
   - `supabase/migrations/20251030000001_step1_base_schema.sql`
   - `supabase/migrations/20251030000002_step2_rls_policies.sql`
   - `supabase/migrations/20251030000003_step3_initial_data.sql`
   - `supabase/migrations/20251030000004_step4_advanced_features.sql`

### 4. 管理者アカウントの作成

1. [Supabase Dashboard](https://supabase.com/dashboard) → **Authentication** → **Users** → **Add user**
2. メールアドレスとパスワードを入力
3. **Auto Confirm User** をチェック
4. **Save**をクリック

### 5. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:5173` にアクセス。

### 6. ログイン

`/login` にアクセスして、作成したメールアドレスとパスワードでログイン。

## 📂 プロジェクト構造

```
tokatsu-solar-cms/
├── public/              # 静的ファイル
├── src/
│   ├── components/      # Reactコンポーネント
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Services.tsx
│   │   ├── Results.tsx
│   │   ├── Flow.tsx
│   │   ├── FAQ.tsx
│   │   ├── Contact.tsx
│   │   ├── Footer.tsx
│   │   └── admin/       # 管理画面
│   ├── pages/           # ページコンポーネント
│   │   ├── Home.tsx     # 公開サイト
│   │   ├── Login.tsx    # ログインページ
│   │   └── Admin.tsx    # 管理画面
│   ├── contexts/        # React Context
│   ├── hooks/           # カスタムフック
│   └── lib/             # ライブラリ設定
├── supabase/            # データベース定義
│   └── migrations/      # マイグレーションファイル
└── index.html
```

## 🗄️ データベース構造

### 主要テーブル

| テーブル名 | 説明 |
|----------|------|
| `company_info` | 会社基本情報 |
| `services` | サービス一覧 |
| `blog_posts` | ブログ記事 |
| `faqs` | よくある質問 |
| `seo_settings` | SEO設定 |
| `page_sections` | ページセクション管理 |

### 共通フィールド

- `id`: UUID（主キー）
- `is_visible`: 表示/非表示フラグ
- `deleted_at`: 論理削除タイムスタンプ
- `created_at`: 作成日時
- `updated_at`: 更新日時

## 🔧 技術スタック

- **React 18** + **TypeScript 5.3**
- **Vite 5** - 高速ビルドツール
- **Tailwind CSS 3.4** - スタイリング
- **Supabase** - データベース・認証
- **React Router 6** - ルーティング

## 🚀 デプロイ

### ビルド

```bash
npm run build
```

### デプロイ先

- **Vercel**
- **Netlify**
- **Cloudflare Pages**

ビルドコマンド: `npm run build`  
公開ディレクトリ: `dist`

## 📝 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# 本番ビルド
npm run build

# ビルド結果をプレビュー
npm run preview
```

## 🐛 トラブルシューティング

### ログインできない場合

1. ✅ `.env`ファイルが存在するか確認
2. ✅ Supabase Dashboard → Authentication → Users でユーザーが作成されているか確認
3. ✅ **Auto Confirm User** をチェックしたか確認
4. ✅ Email Confirmed が緑色のチェックマークになっているか確認

### データベース接続エラー

- `.env`ファイルのSupabase設定を確認
- SupabaseプロジェクトのURLとAnon Keyが正しいか確認

### ビルドエラー

```bash
rm -rf node_modules
npm install
```

### データが表示されない

- RLSポリシーが正しく設定されているか確認
- マイグレーションが全て実行されているか確認

## 📖 ドキュメント

詳細なドキュメントは以下を参照：

- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - 詳細セットアップガイド
- **[MIGRATION_EXECUTION_GUIDE.md](MIGRATION_EXECUTION_GUIDE.md)** - データベースマイグレーション実行ガイド
- **[LOGIN_SETUP.md](LOGIN_SETUP.md)** - ログイン設定ガイド
- **[TROUBLESHOOTING_JP.md](TROUBLESHOOTING_JP.md)** - トラブルシューティング

---

**最終更新日**: 2025年10月31日
