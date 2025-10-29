# CMSウェブサイト

太陽光発電パネルの点検・清掃・保守を専門とする東勝会社のコーポレートサイトです。React + TypeScript + Supabaseで構築されたCMSシステムを搭載しています。

## ✨ 主な機能

### 🌐 公開サイト機能

- **多言語対応**: 日本語・中国語（簡体字）の切替
- **レスポンシブデザイン**: PC・タブレット・スマホに最適化
- **動的コンテンツ**: Supabaseから自動取得
- **カラーテーマ**: 管理画面から簡単に変更可能
- **SEO最適化**: メタタグとセマンティックHTML

### 🔐 管理画面（CMS）機能

#### ログイン方法
- Supabase Authenticationに登録したメールアドレスとパスワードでログインできます
- ログインURL: `/login`

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
- **SEO設定管理**: 
  - ページ別SEO設定（タイトル、説明、キーワード）
  - OGP（Open Graph Protocol）設定
  - Twitter Card設定
  - 構造化データ（JSON-LD）管理
  - robots meta設定（index/noindex, follow/nofollow）
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

### 5. 管理者アカウントの作成とログイン

1. [Supabase Dashboard](https://supabase.com/dashboard) → **Authentication** → **Users** → **Add user**
2. メールアドレスとパスワードを入力（**Auto Confirm User** をチェック）
3. ブラウザで `/login` にアクセスして、作成したメールアドレスとパスワードでログイン

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
| `seo_settings` | SEO設定 | page_key, title_ja/zh, description_ja/zh, keywords, og_image_url |

### 共通フィールド

- `id`: UUID (主キー)
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



## 🌐 多言語対応

日本語と中国語（簡体字）に対応しています。





## 🚀 デプロイ

VercelまたはNetlifyを使用してデプロイできます。
ビルドコマンド: `npm run build`、公開ディレクトリ: `dist`

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

### ログインできない場合

このプロジェクトは **Supabase Auth** を使用しています（`admin_users` テーブルのパスワードハッシュは使用されていません）。

詳細は **[LOGIN_SETUP.md](LOGIN_SETUP.md)** または **[TROUBLESHOOTING_JP.md](TROUBLESHOOTING_JP.md)** を参照してください。

**クイックチェックリスト**:
1. ✅ `.env` ファイルが存在するか確認（`cp .env.example .env`）
2. ✅ Supabase Dashboard → Authentication → Users でユーザーが作成されているか確認
3. ✅ ユーザー作成時に **Auto Confirm User** をチェックしたか確認
4. ✅ Email Confirmed が緑色のチェックマークになっているか確認
5. ✅ メールアドレスとパスワードでログイン（ユーザー名ではない）

### その他の問題

- **データベース接続エラー**: `.env`ファイルのSupabase設定を確認
- **ビルドエラー**: `node_modules`を削除して `npm install` を再実行
- **データが表示されない**: RLSポリシーとテーブル権限を確認（TROUBLESHOOTING_JP.md参照）

## 🔄 更新履歴

### v1.5.0 (2025-10-29) - 現在のバージョン

- 🔍 SEO設定管理機能の追加
- 📊 ページ別メタタグ設定（title, description, keywords）
- 🖼️ OGP（Open Graph Protocol）設定
- 🐦 Twitter Card設定
- 🔗 構造化データ（JSON-LD）管理
- 🤖 robots meta設定（index/noindex, follow/nofollow）
- ♻️ 論理削除関数の改善（汎用関数化）

### v1.4.0 (2025-10-28)

- 🔐 Supabase Authentication統合(email/password方式)
- 🛡️ Row Level Security(RLS)の実装
- 🔑 セキュアな認証システム
- 📝 管理画面のアクセス制御

### v1.3.0 (2025-10-27)

- ✨ React + TypeScript + Supabaseによる完全リビルド
- 🎨 WordPress風管理画面の実装
- 🗄️ Row Level Securityの実装
- 🌐 多言語対応システムの強化
- 📱 レスポンシブデザインの最適化
- 🔄 論理削除機能の実装
- 👁️ 表示/非表示切り替え機能
- ♻️ 復元機能の追加

---

**最終更新日**: 2025年10月29日
