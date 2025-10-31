# データベースマイグレーション実行ガイド

## 📚 概要

このガイドでは、Supabaseデータベースにマイグレーションを適用する手順を説明します。

## 🎯 マイグレーション一覧

### 必須マイグレーション（初回セットアップ時）

1. **20251030000001_step1_base_schema.sql** - 基本スキーマ
2. **20251030000002_step2_rls_policies.sql** - RLSポリシー
3. **20251030000003_step3_initial_data.sql** - 初期データ
4. **20251030000004_step4_advanced_features.sql** - 高度な機能

### オプション・追加機能マイグレーション

5. **20251030000005_add_hero_icon_fields.sql** - ヒーローアイコンフィールド追加
6. **20251031000001_add_browser_favicon.sql** - ブラウザタブ用ファビコンフィールド追加

## 🚀 実行方法

### 方法1: Supabase Dashboard（推奨）

最も簡単で確実な方法です。

#### ステップ1: Dashboardにログイン

1. [Supabase Dashboard](https://supabase.com/dashboard) にアクセス
2. 対象のプロジェクトを選択

#### ステップ2: SQL Editorを開く

1. 左サイドバーから **SQL Editor** をクリック
2. 右上の **+ New query** ボタンをクリック

#### ステップ3: マイグレーションSQLを実行

1. `supabase/migrations/` ディレクトリから対象のSQLファイルを開く
2. SQLの内容を全てコピー
3. SQL Editorに貼り付け
4. 右下の **Run** ボタンをクリック

#### ステップ4: 実行結果を確認

- ✅ **Success** と表示されれば成功
- ❌ エラーが表示された場合は、エラーメッセージを確認

### 方法2: Supabase CLI

ローカルで開発している場合に推奨されます。

#### 前提条件

```bash
# Supabase CLIのインストール（未インストールの場合）
npm install -g supabase
```

#### ステップ1: プロジェクトにリンク

```bash
cd /home/user/webapp
supabase link --project-ref YOUR_PROJECT_REF
```

**YOUR_PROJECT_REF の取得方法:**
- Supabase Dashboard → Settings → General → Reference ID

#### ステップ2: マイグレーションを実行

```bash
# すべてのマイグレーションを実行
supabase db push

# または特定のマイグレーションファイルを実行
supabase db execute --file supabase/migrations/20251031000001_add_browser_favicon.sql
```

### 方法3: psql（上級者向け）

PostgreSQLクライアントを使用して直接接続します。

#### ステップ1: 接続情報を取得

Supabase Dashboard → Settings → Database

- Host: `db.YOUR_PROJECT_REF.supabase.co`
- Port: `5432`
- Database: `postgres`
- User: `postgres`
- Password: **Databaseタブで確認**

#### ステップ2: psqlで接続

```bash
# パスワードを環境変数に設定
export PGPASSWORD='your_database_password'

# psqlで接続してマイグレーションを実行
psql \
  -h db.YOUR_PROJECT_REF.supabase.co \
  -p 5432 \
  -d postgres \
  -U postgres \
  -f supabase/migrations/20251031000001_add_browser_favicon.sql
```

## ✅ 実行確認

### ブラウザタブ用ファビコンフィールドの確認

マイグレーション `20251031000001_add_browser_favicon.sql` を実行した後：

```sql
-- カラムの存在確認
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'company_info'
  AND column_name IN ('browser_favicon_url', 'favicon_url', 'hero_icon_url')
ORDER BY column_name;
```

**期待される結果:**

| column_name         | data_type | is_nullable |
|---------------------|-----------|-------------|
| browser_favicon_url | text      | YES         |
| favicon_url         | text      | YES         |
| hero_icon_url       | text      | YES         |

### データの確認

```sql
SELECT 
  id,
  company_name,
  browser_favicon_url,
  favicon_url,
  hero_icon_url
FROM company_info;
```

## 🐛 トラブルシューティング

### エラー: "column already exists"

**原因:** カラムが既に存在している

**解決策:** これは正常です。マイグレーションでは `ADD COLUMN IF NOT EXISTS` を使用しているため、既存のカラムには影響しません。

### エラー: "permission denied"

**原因:** 実行ユーザーに権限がない

**解決策:**

```sql
-- postgresユーザーで実行していることを確認
-- または以下を実行して権限を付与
GRANT ALL ON company_info TO postgres;
```

### エラー: "relation does not exist"

**原因:** 前のマイグレーションが実行されていない

**解決策:** 
1. マイグレーションを順番に実行してください
2. 基本スキーママイグレーション（step1）を先に実行

### マイグレーションが反映されない

**確認事項:**

1. **正しいプロジェクトに接続しているか確認**
   ```sql
   SELECT current_database();
   ```

2. **テーブルが存在するか確認**
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public'
   ORDER BY table_name;
   ```

3. **ブラウザのキャッシュをクリア**
   - Ctrl+Shift+R (Windows/Linux)
   - Cmd+Shift+R (Mac)

## 📋 チェックリスト

マイグレーション実行前:

- [ ] `.env` ファイルに正しいSupabase接続情報が設定されている
- [ ] Supabase Dashboardにログインできる
- [ ] 実行するマイグレーションファイルを確認した

マイグレーション実行後:

- [ ] SQL実行が成功した（エラーがない）
- [ ] テーブル/カラムが作成されたことを確認した
- [ ] データが正しく移行されたことを確認した
- [ ] 開発サーバーを再起動した
- [ ] ブラウザのキャッシュをクリアした
- [ ] アプリケーションが正常に動作することを確認した

## 🆘 サポート

問題が解決しない場合は、以下の情報を含めて報告してください:

1. 実行したマイグレーションファイル名
2. エラーメッセージの全文
3. Supabaseプロジェクトのバージョン
4. 実行方法（Dashboard / CLI / psql）
5. 以下のクエリ結果:

```sql
-- テーブル一覧
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' ORDER BY table_name;

-- カラム一覧
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'company_info';
```

---

**最終更新日**: 2025年10月31日
