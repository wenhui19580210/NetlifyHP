# マイグレーション実行ガイド

このガイドでは、Supabaseで新しいマイグレーションファイルを実行する手順を説明します。

## 🎯 目的

バージョン1.4.1では、カスタム認証システムに対応するためRLSポリシーを修正しました。これにより、管理画面でSupabaseからデータを正しく取得・編集できるようになります。

## 📋 実行手順

### オプション1: Supabase Dashboard（推奨）

1. **Supabase Dashboardにログイン**
   - https://supabase.com/dashboard にアクセス
   - プロジェクトを選択

2. **SQL Editorを開く**
   - 左サイドバーから `SQL Editor` をクリック
   - `+ New query` をクリック

3. **マイグレーションSQLを実行**
   - `supabase/migrations/002_fix_rls_policies.sql` の内容をコピー
   - SQL Editorに貼り付け
   - `Run` ボタンをクリック

4. **実行確認**
   ```sql
   -- RLSポリシーが正しく作成されたか確認
   SELECT schemaname, tablename, policyname 
   FROM pg_policies 
   WHERE tablename IN ('company_info', 'services', 'blog_posts', 'faqs')
   ORDER BY tablename, policyname;
   ```

### オプション2: Supabase CLI

```bash
# Supabase CLIをインストール（未インストールの場合）
npm install -g supabase

# プロジェクトにログイン
supabase login

# プロジェクトをリンク
supabase link --project-ref YOUR_PROJECT_REF

# マイグレーションを実行
supabase db push

# または特定のファイルを実行
supabase db execute --file supabase/migrations/002_fix_rls_policies.sql
```

### オプション3: psql（上級者向け）

```bash
# 環境変数を設定
export PGPASSWORD='your_database_password'

# マイグレーションを実行
psql \
  -h db.YOUR_PROJECT_REF.supabase.co \
  -p 5432 \
  -d postgres \
  -U postgres \
  -f supabase/migrations/002_fix_rls_policies.sql
```

## ✅ 動作確認

1. **管理画面にログイン**
   - ブラウザで `/login` にアクセス
   - `admin` / `admin` でログイン

2. **ダッシュボードを確認**
   - ダッシュボードタブで統計情報が表示されることを確認

3. **各タブでデータを確認**
   - 会社情報タブ: 会社情報が表示される
   - サービスタブ: サービス一覧が表示される
   - ブログタブ: ブログ記事一覧が表示される
   - FAQタブ: FAQ一覧が表示される

4. **CRUD操作をテスト**
   - サービスの新規追加
   - ブログ記事の編集
   - FAQの削除・復元
   - 会社情報の保存

## 🔒 セキュリティに関する注意

### ⚠️ 重要

このマイグレーションでは、開発を容易にするため **RLSポリシーを緩和** しています（`USING (true)` を使用）。

```sql
-- 例: 全ユーザーがデータを閲覧・編集可能
CREATE POLICY "Anyone can manage company info"
  ON company_info FOR ALL
  USING (true)
  WITH CHECK (true);
```

### 本番環境での推奨設定

本番環境では、以下のいずれかの方法で追加のセキュリティ対策を実施してください:

#### 方法1: IPホワイトリスト

Supabase Dashboardで許可するIPアドレスを制限:

1. `Settings` → `Database` → `Network Restrictions`
2. 管理者のIPアドレスのみを許可

#### 方法2: RLSポリシーの強化

カスタムヘッダーやJWTトークンを使用したポリシー:

```sql
-- 例: カスタムヘッダーでの認証
CREATE POLICY "Admin can manage company info"
  ON company_info FOR ALL
  USING (
    current_setting('request.headers')::json->>'x-admin-token' = 'your_secret_token'
  );
```

#### 方法3: Edge Functions経由のアクセス

Supabase Edge Functionsを使用してバックエンドAPIを構築し、フロントエンドからの直接アクセスを禁止:

```typescript
// Edge Function でService Role Keyを使用
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL'),
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
)
```

## 🐛 トラブルシューティング

### エラー: "permission denied for table company_info"

**原因**: RLSポリシーが正しく適用されていません。

**解決策**:
1. マイグレーションが正しく実行されたか確認
2. ブラウザのキャッシュをクリア
3. Supabaseクライアントを再初期化

### エラー: "duplicate key value violates unique constraint"

**原因**: ポリシー名が既に存在しています。

**解決策**:
```sql
-- 既存のポリシーを削除してから再作成
DROP POLICY IF EXISTS "Anyone can manage company info" ON company_info;
```

### データが表示されない

**確認事項**:
1. `.env` ファイルのSupabase URL/Key が正しいか
2. ブラウザの開発者ツールでネットワークエラーを確認
3. Supabase Dashboardで直接データを確認

## 📚 関連ドキュメント

- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase SQL Editor](https://supabase.com/docs/guides/database/overview)
- [Supabase CLI](https://supabase.com/docs/reference/cli/introduction)

## 🆘 サポート

問題が解決しない場合は、以下の情報を含めてIssueを作成してください:

- エラーメッセージの全文
- Supabaseのバージョン
- 実行した手順
- ブラウザの開発者ツールのエラーログ
