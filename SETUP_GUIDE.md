# 東勝会社 CMSウェブサイト - セットアップガイド

このガイドでは、プロジェクトのセットアップから本番環境へのデプロイまでを詳しく解説します。

## 📋 目次

1. [必要な環境](#必要な環境)
2. [Supabaseプロジェクトのセットアップ](#supabaseプロジェクトのセットアップ)
3. [ローカル開発環境のセットアップ](#ローカル開発環境のセットアップ)
4. [管理者アカウントの作成](#管理者アカウントの作成)
5. [本番環境へのデプロイ](#本番環境へのデプロイ)
6. [トラブルシューティング](#トラブルシューティング)

---

## 必要な環境

以下のソフトウェアがインストールされていることを確認してください。

- **Node.js**: v18以上 ([ダウンロード](https://nodejs.org/))
- **npm**: Node.jsに同梱
- **Gitクライアント**: ([ダウンロード](https://git-scm.com/))
- **Supabaseアカウント**: ([無料登録](https://supabase.com/))

---

## Supabaseプロジェクトのセットアップ

### 1. 新しいSupabaseプロジェクトを作成

1. [Supabase](https://supabase.com/)にログイン
2. 「New Project」をクリック
3. プロジェクト情報を入力:
   - **Name**: `tokatsu-solar-cms` (任意)
   - **Database Password**: 強力なパスワードを設定（保存してください）
   - **Region**: `Northeast Asia (Tokyo)` 推奨
4. 「Create new project」をクリック
5. プロジェクトの準備が完了するまで待機（数分かかります）

### 2. API情報を取得

1. ダッシュボードの左側メニューから「Settings」→「API」を開く
2. 以下の情報をコピー（後で使用します）:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbGc...`（長い文字列）

### 3. データベーススキーマを作成

1. 左側メニューから「SQL Editor」を開く
2. 「New Query」をクリック
3. プロジェクトの`supabase/migrations/001_initial_schema.sql`の内容を**すべてコピー**
4. SQL Editorに貼り付け
5. 「Run」ボタンをクリック
6. 成功メッセージが表示されることを確認

### 4. サンプルデータを投入

1. SQL Editorで新しいクエリを作成
2. `supabase/seed.sql`の内容を**すべてコピー**
3. 貼り付けて「Run」をクリック
4. データが正常に投入されたことを確認

### 5. データベースを確認

1. 左側メニューから「Table Editor」を開く
2. 以下のテーブルが作成されていることを確認:
   - `company_info`
   - `company_info_visibility`
   - `services`
   - `blog_posts`
   - `faqs`
3. 各テーブルにサンプルデータが入っていることを確認

---

## ローカル開発環境のセットアップ

### 1. プロジェクトをクローン

```bash
# プロジェクトディレクトリに移動
cd path/to/project

# 依存関係をインストール
npm install
```

### 2. 環境変数を設定

1. `.env.example`をコピーして`.env`を作成:

```bash
cp .env.example .env
```

2. `.env`ファイルを開き、Supabaseの情報を設定:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

⚠️ **重要**: `.env`ファイルは`.gitignore`に含まれているため、Gitにコミットされません。

### 3. 開発サーバーを起動

```bash
npm run dev
```

ブラウザで`http://localhost:5173`にアクセスすると、ウェブサイトが表示されます。

### 4. 動作確認

- ✅ 公開サイトが表示される
- ✅ 会社情報、サービス、ブログ、FAQが表示される
- ✅ 日本語⇔中国語の言語切替が機能する
- ✅ レスポンシブデザインが正常に動作する

---

## 管理者アカウントの作成

管理画面（`/admin`）にアクセスするには、Supabase Authenticationで管理者アカウントを作成する必要があります。

### 1. Supabaseダッシュボードでユーザーを作成

1. [Supabaseダッシュボード](https://supabase.com/dashboard)にログイン
2. プロジェクトを選択
3. 左側メニューから「Authentication」→「Users」を開く
4. 「Add User」ボタンをクリック
5. ユーザー情報を入力:
   - **Email**: 管理者のメールアドレス（例: `admin@tokatsu.com`）
   - **Password**: 強力なパスワード（最低8文字）
   - **Auto Confirm User**: ✅ チェックを入れる
6. 「Create User」をクリック

### 2. 管理画面にログイン

1. ブラウザで`http://localhost:5173/login`にアクセス
2. 作成したメールアドレスとパスワードを入力
3. 「ログイン」をクリック
4. 管理画面（`/admin`）にリダイレクトされます

### 3. 管理画面の動作確認

- ✅ 会社情報の編集ができる
- ✅ サービスの追加・編集・削除ができる
- ✅ ブログ記事の追加・編集・削除ができる
- ✅ FAQの追加・編集・削除ができる
- ✅ 論理削除と復元が機能する

---

## 本番環境へのデプロイ

### Vercelにデプロイ（推奨）

Vercelは無料プランでも高性能なホスティングを提供しており、GitHubと連携して自動デプロイが可能です。

#### 1. GitHubにプッシュ

```bash
# Gitリポジトリを初期化（まだの場合）
git init

# ファイルを追加
git add .

# コミット
git commit -m "Initial commit"

# GitHubにプッシュ
git remote add origin https://github.com/your-username/tokatsu-solar-cms.git
git branch -M main
git push -u origin main
```

#### 2. Vercelプロジェクトを作成

1. [Vercel](https://vercel.com/)にサインアップ/ログイン
2. 「New Project」をクリック
3. GitHubリポジトリをインポート
4. プロジェクト設定:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

#### 3. 環境変数を設定

「Environment Variables」セクションで以下を追加:

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | `https://xxxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGc...` |

#### 4. デプロイ

「Deploy」ボタンをクリックすると、自動的にビルドとデプロイが開始されます。

完了後、Vercelが提供するURLでウェブサイトにアクセスできます。

### Netlifyにデプロイ

#### 1. Netlifyプロジェクトを作成

1. [Netlify](https://netlify.com/)にサインアップ/ログイン
2. 「New site from Git」をクリック
3. GitHubリポジトリを選択
4. ビルド設定:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

#### 2. 環境変数を設定

「Site settings」→「Build & deploy」→「Environment」で環境変数を追加:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

#### 3. デプロイ

「Deploy site」をクリックすると、デプロイが開始されます。

---

## トラブルシューティング

### データベース接続エラー

**症状**: ウェブサイトを開いたときに「データの取得に失敗しました」と表示される

**原因**: 環境変数が正しく設定されていない

**解決方法**:
1. `.env`ファイルの内容を確認
2. `VITE_SUPABASE_URL`と`VITE_SUPABASE_ANON_KEY`が正しいか確認
3. 開発サーバーを再起動: `npm run dev`

### ログインできない

**症状**: 管理画面でログインできない

**原因1**: ユーザーがSupabase Authenticationに登録されていない

**解決方法**:
1. Supabaseダッシュボード→Authentication→Usersを確認
2. ユーザーが存在しない場合、新規作成
3. 「Auto Confirm User」にチェックが入っているか確認

**原因2**: パスワードが間違っている

**解決方法**:
1. Supabaseダッシュボードでパスワードをリセット
2. 新しいパスワードでログイン

### ビルドエラー

**症状**: `npm run build`でエラーが発生する

**原因**: 依存関係が正しくインストールされていない

**解決方法**:
```bash
# node_modulesを削除して再インストール
rm -rf node_modules package-lock.json
npm install
npm run build
```

### 画像が表示されない

**症状**: Supabase Storageにアップロードした画像が表示されない

**原因**: バケットが公開設定されていない

**解決方法**:
1. Supabaseダッシュボード→Storage
2. バケットを選択
3. 「Make public」をクリック

### Row Level Security (RLS) エラー

**症状**: 「new row violates row-level security policy」エラー

**原因**: RLSポリシーが正しく設定されていない

**解決方法**:
1. SQL Editorで`001_initial_schema.sql`を再実行
2. データベースのポリシーが正しく設定されているか確認

---

## サポート

技術的な問題がある場合は、以下を確認してください:

1. **README.md**: プロジェクト概要と基本情報
2. **GitHub Issues**: 既知の問題と解決方法
3. **Supabase Docs**: https://supabase.com/docs

---

**最終更新日**: 2025年10月27日
