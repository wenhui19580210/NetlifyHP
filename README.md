# 東勝会社 CMSウェブサイト

太陽光発電パネルの点検・清掃・保守を専門とする東勝会社のコーポレートサイトです。**React + TypeScript + Supabase**で構築された本格的なCMSシステムを搭載しています。

![Version](https://img.shields.io/badge/version-1.4.0-blue)
![React](https://img.shields.io/badge/React-18.2-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178c6)
![Supabase](https://img.shields.io/badge/Supabase-2.39-3ecf8e)
![License](https://img.shields.io/badge/license-UNLICENSED-red)

## ✨ 主な機能

### 🌐 公開サイト機能

- **多言語対応**: 日本語・中国語（簡体字）の切替
- **レスポンシブデザイン**: PC・タブレット・スマホに最適化
- **動的コンテンツ**: Supabaseから自動取得
- **カラーテーマ**: 管理画面から簡単に変更可能
- **SEO最適化**: メタタグとセマンティックHTML

### 🔐 管理画面（CMS）機能

#### ログイン情報
- **URL**: `/login` → `/admin`
- **デフォルト管理者アカウント**:
  - User: `admin`
  - Password: `admin`
  - ⚠️ **重要**: 本番環境では必ずパスワードを変更してください！

#### 主要機能
- **WordPress風UI**: 直感的で使いやすいインターフェース
- **認証システム**: Supabase Authenticationによる安全なログイン
- **会社情報管理**: 基本情報・連絡先・カラーテーマを一括編集
- **デザインカスタマイズ**: 
  - カラーピッカーでメイン・サブカラーを選択
  - 4種類のカラープリセット（太陽光オレンジ、エコグリーン、プロフェッショナルブルー、エレガントパープル）
  - リアルタイムカラープレビュー
- **サービス管理**: CRUD操作（作成・読取・更新・削除）
- **ブログ管理**: 
  - ニュース・施工事例の投稿
  - 簡易リッチエディタ（HTML対応）
  - タブ切り替えで日本語・中国語を編集
  - アイキャッチ画像URL設定
  - **ブログ詳細ページ**: 各記事の個別ページ表示
- **FAQ管理**: よくある質問の管理
- **論理削除**: 誤削除を防止するソフトデリート機能
- **表示/非表示制御**: 公開状態の柔軟な管理
- **復元機能**: 削除されたコンテンツの簡単復元

### 🗄️ データベース機能

- **Row Level Security (RLS)**: データセキュリティの確保
- **リアルタイム更新**: 変更が即座に反映
- **論理削除**: `deleted_at`フィールドによるソフトデリート
- **表示制御**: `is_visible`フラグで公開状態を管理
- **順序制御**: `order_index`でコンテンツの並び順を調整

## 🚀 クイックスタート

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.example`をコピーして`.env`を作成し、Supabaseの情報を設定:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Supabaseデータベースのセットアップ

詳細は **[SETUP_GUIDE.md](SETUP_GUIDE.md)** を参照してください。

1. Supabaseで新規プロジェクトを作成
2. `supabase/migrations/001_initial_schema.sql`を実行
3. `supabase/seed.sql`でサンプルデータを投入

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:5173` にアクセス。

### 5. 管理者アカウントでログイン

**デフォルト管理者アカウント:**
- **User**: `admin`
- **Password**: `admin`
- ⚠️ **重要**: 本番環境では必ずパスワードを変更してください！

**ログイン手順:**
1. ブラウザで `/login` にアクセス
2. User に `admin` を入力
3. Password に `admin` を入力
4. ログインボタンをクリック
5. `/admin` で管理画面が開きます

**注意**: 管理者アカウントは `supabase/migrations/001_initial_schema.sql` で自動作成されます。

## 📂 プロジェクト構造

```
tokatsu-solar-cms/
├── public/              # 静的ファイル
│   └── sun-icon.svg     # ファビコン
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
│   │   └── admin/       # 管理画面コンポーネント
│   │       ├── CompanyTab.tsx
│   │       ├── ServicesTab.tsx
│   │       ├── BlogTab.tsx
│   │       └── FAQTab.tsx
│   ├── pages/           # ページコンポーネント
│   │   ├── Home.tsx     # 公開サイト
│   │   ├── Login.tsx    # ログインページ
│   │   └── Admin.tsx    # 管理画面
│   ├── contexts/        # React Context
│   │   ├── LanguageContext.tsx
│   │   ├── ThemeContext.tsx
│   │   └── AuthContext.tsx
│   ├── hooks/           # カスタムフック
│   │   ├── useCompanyInfo.ts
│   │   ├── useServices.ts
│   │   ├── useBlogPosts.ts
│   │   └── useFAQs.ts
│   ├── lib/             # ライブラリ設定
│   │   ├── supabase.ts
│   │   └── database.types.ts
│   ├── App.tsx          # ルーティング
│   ├── main.tsx         # エントリーポイント
│   └── index.css        # グローバルスタイル
├── supabase/            # データベース定義
│   ├── migrations/
│   │   └── 001_initial_schema.sql
│   └── seed.sql
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── README.md
└── SETUP_GUIDE.md       # 詳細セットアップガイド
```

## 🗄️ データベース構造

### テーブル一覧

| テーブル名 | 説明 | 主要フィールド |
|----------|------|--------------|
| `company_info` | 会社基本情報 | company_name, ceo_name, phone, email, main_color |
| `company_info_visibility` | フィールド表示制御 | field_name, is_visible |
| `services` | サービス一覧 | service_name_ja/zh, description, order_index |
| `blog_posts` | ブログ記事 | title_ja/zh, content, publish_date |
| `faqs` | よくある質問 | question_ja/zh, answer, order_index |

### 共通フィールド

- `id`: UUID (主キー)
- `is_visible`: 表示/非表示フラグ
- `deleted_at`: 論理削除タイムスタンプ
- `created_at`: 作成日時
- `updated_at`: 更新日時

## 🔧 技術スタック

### フロントエンド

- **React 18**: UIライブラリ
- **TypeScript 5.3**: 型安全な開発
- **Vite 5**: 高速ビルドツール
- **Tailwind CSS 3.4**: ユーティリティファーストCSS
- **React Router 6**: ルーティング
- **Lucide React**: アイコンライブラリ

### バックエンド

- **Supabase**: BaaS（Backend as a Service）
  - PostgreSQL: データベース
  - Authentication: 認証システム
  - Row Level Security: データセキュリティ
  - Storage: ファイルストレージ

### 開発ツール

- **ESLint**: コード品質チェック
- **PostCSS**: CSSの変換
- **Autoprefixer**: ベンダープレフィックス自動付与

## 📱 レスポンシブデザイン

### ブレークポイント

- **モバイル**: 320px〜767px
- **タブレット**: 768px〜1023px
- **デスクトップ**: 1024px以上

### 対応デバイス

✅ iPhone / Android スマートフォン  
✅ iPad / Android タブレット  
✅ ノートPC / デスクトップ  

## 🌐 多言語対応

### サポート言語

- **日本語** (ja-JP)
- **中国語簡体字** (zh-CN)

### 翻訳管理

- `LanguageContext`で言語状態を管理
- `useLanguage`フックで翻訳関数`t(ja, zh)`を提供
- ローカルストレージに言語設定を保存

## 🎨 カラーテーマシステム

### CSS変数

```css
:root {
  --color-primary: #f59e0b;        /* メインカラー */
  --color-primary-dark: #d97706;   /* 濃い色 */
  --color-primary-light: #fbbf24;  /* 薄い色 */
  --color-sub: #0ea5e9;            /* サブカラー */
}
```

### 変更方法

1. 管理画面の「会社情報」タブを開く
2. カラーピッカーでメインカラー・サブカラーを選択
3. 保存すると公開サイトに即座に反映

## 🔒 セキュリティ

### Row Level Security (RLS)

- **公開データ**: `is_visible=true` AND `deleted_at IS NULL`のみ閲覧可
- **認証ユーザー**: 全データの閲覧・編集が可能

### 認証システム

- カスタム管理者認証システム(username/password方式)
- bcryptによるパスワードハッシュ化
- ローカルストレージでのセッション管理
- パスワード変更機能(`change_admin_password`関数)

## 📊 パフォーマンス

- **Lighthouse Score**: 
  - Performance: 90+
  - Accessibility: 95+
  - Best Practices: 95+
  - SEO: 100

- **最適化**:
  - コード分割
  - 画像の遅延読み込み
  - CSS/JSの最小化
  - CDNによる高速配信（Vercel/Netlify）

## 🚀 デプロイ

### Vercel（推奨）

```bash
# Vercel CLIをインストール
npm i -g vercel

# デプロイ
vercel
```

詳細は **[SETUP_GUIDE.md](SETUP_GUIDE.md)** を参照。

### Netlify

1. GitHubにプッシュ
2. Netlifyでリポジトリを連携
3. ビルドコマンド: `npm run build`
4. 公開ディレクトリ: `dist`

## 📝 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# 本番ビルド
npm run build

# ビルド結果をプレビュー
npm run preview

# TypeScript型チェック
npm run typecheck
```

## 🐛 トラブルシューティング

詳細は **[SETUP_GUIDE.md#トラブルシューティング](SETUP_GUIDE.md#トラブルシューティング)** を参照。

### よくある問題

1. **データベース接続エラー**: `.env`ファイルを確認
2. **ログインできない**: Supabaseでユーザーを作成
3. **ビルドエラー**: `node_modules`を削除して再インストール

## 🔄 更新履歴

### v1.4.0 (2025-10-28) - 現在のバージョン

- 🔐 カスタム管理者認証システムの実装(username/password方式)
- 🗄️ admin_usersテーブルの追加
- 🔑 bcryptによるパスワードハッシュ化
- 🛡️ パスワード変更機能の実装
- 📝 ユーザー名ベースのログインシステム

### v1.3.0 (2025-10-27)

- ✨ React + TypeScript + Supabaseによる完全リビルド
- 🎨 WordPress風管理画面の実装
- 🗄️ Row Level Securityの実装
- 🌐 多言語対応システムの強化
- 📱 レスポンシブデザインの最適化
- 🔄 論理削除機能の実装
- 👁️ 表示/非表示切り替え機能
- ♻️ 復元機能の追加

## 📧 サポート

### 技術的な問題

- **Issue報告**: [GitHub Issues](https://github.com/your-repo/issues)
- **ドキュメント**: README.md, SETUP_GUIDE.md
- **Supabase公式ドキュメント**: https://supabase.com/docs

### コンテンツ編集のサポート

管理画面の使い方については、**SETUP_GUIDE.md**の「管理者アカウントの作成」セクションを参照してください。


**最終更新日**: 2025年10月28日
