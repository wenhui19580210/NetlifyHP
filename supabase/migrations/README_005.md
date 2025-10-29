# マイグレーション 005: Unrestricted ビュー修正ガイド

## 🎯 目的

このマイグレーションは以下の問題を解決します:

1. **Unrestricted表示の問題**: Supabase Table Editorで「Unrestricted」と赤字表示されるビューの修正
2. **管理画面ログイン問題**: 管理画面にログインできない、またはデータが取得できない問題の解決
3. **アクセス権限の最適化**: テーブル、ビュー、関数のアクセス権限を適切に設定

## ⚠️ 問題の原因

### Unrestricted表示の原因
- ビュー（`admin_all_services`、`admin_all_blog_posts`、`admin_all_faqs`）に対して適切な`GRANT`権限が設定されていない
- Supabaseのanon/authenticatedロールがビューにアクセスできない

### ログインできない原因
- RLSポリシーの設定が不完全
- テーブルへのアクセス権限が不足している
- 認証関数へのEXECUTE権限が付与されていない

## 📋 実行手順

### 方法1: Supabase Dashboard（推奨）

1. **Supabase Dashboardにログイン**
   ```
   https://supabase.com/dashboard
   ```

2. **プロジェクトを選択**
   - 対象のプロジェクトをクリック

3. **SQL Editorを開く**
   - 左サイドバー → `SQL Editor` → `+ New query`

4. **マイグレーションSQLを実行**
   - `supabase/migrations/005_fix_unrestricted_views.sql` の内容をコピー
   - SQL Editorに貼り付け
   - `Run` ボタンをクリック

5. **実行結果を確認**
   - 成功メッセージが表示されることを確認
   - エラーがある場合は、エラーメッセージを確認して対処

### 方法2: Supabase CLI

```bash
# Supabase CLIがインストール済みの場合
cd /home/user/webapp

# マイグレーションを実行
supabase db push

# または特定のファイルを実行
supabase db execute --file supabase/migrations/005_fix_unrestricted_views.sql
```

### 方法3: psql（直接接続）

```bash
# データベース接続情報を設定
export PGPASSWORD='your_database_password'

# マイグレーションを実行
psql \
  -h db.YOUR_PROJECT_REF.supabase.co \
  -p 5432 \
  -d postgres \
  -U postgres \
  -f supabase/migrations/005_fix_unrestricted_views.sql
```

## ✅ 動作確認

### 1. ビューのUnrestricted表示が消えたか確認

Supabase Dashboard → `Table Editor` を開いて、以下を確認:
- ✅ `admin_all_services` が通常表示になっている
- ✅ `admin_all_blog_posts` が通常表示になっている
- ✅ `admin_all_faqs` が通常表示になっている

### 2. 管理画面にログインできるか確認

```bash
# 開発サーバーを起動
cd /home/user/webapp && npm run dev
```

ブラウザで以下を確認:
1. `/login` にアクセス
2. 以下のいずれかのアカウントでログイン:
   - `admin` / `admin`
   - `ganki.rin@gmail.com` / `admin`
3. ログイン成功後、ダッシュボードが表示されることを確認

### 3. データが取得できるか確認

管理画面の各タブで以下を確認:
- ✅ **会社情報タブ**: 会社情報が表示される
- ✅ **サービスタブ**: サービス一覧が表示される
- ✅ **ブログタブ**: ブログ記事一覧が表示される
- ✅ **FAQタブ**: FAQ一覧が表示される

### 4. CRUD操作が動作するか確認

以下の操作をテスト:
1. サービスの新規追加
2. ブログ記事の編集
3. FAQの削除と復元
4. 会社情報の保存

## 🔍 確認用SQLクエリ

マイグレーション実行後、以下のクエリで設定を確認できます:

### ビュー一覧の確認
```sql
SELECT 
  viewname as "ビュー名",
  viewowner as "所有者"
FROM pg_views 
WHERE schemaname = 'public'
ORDER BY viewname;
```

### RLSポリシーの確認
```sql
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

### テーブル権限の確認
```sql
SELECT 
  table_schema,
  table_name,
  privilege_type,
  grantee
FROM information_schema.table_privileges 
WHERE table_schema = 'public'
ORDER BY table_name, grantee, privilege_type;
```

### 関数権限の確認
```sql
SELECT 
  routine_schema,
  routine_name,
  routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
ORDER BY routine_name;
```

## 🐛 トラブルシューティング

### エラー: "permission denied"

**原因**: アクセス権限が不足している

**解決策**:
```sql
-- 手動で権限を付与
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
```

### エラー: "duplicate_object"

**原因**: ポリシーやビューが既に存在する

**解決策**: これは正常です。マイグレーションスクリプトは既存のオブジェクトを考慮しています。

### Unrestricted表示が消えない

**解決策**:
1. ブラウザのキャッシュをクリア（Ctrl+Shift+R / Cmd+Shift+R）
2. Supabase Dashboardを再読み込み
3. 別のブラウザで確認

### ログインできない

**確認事項**:
1. `.env` ファイルの設定が正しいか確認
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

2. ブラウザの開発者ツールでネットワークエラーを確認

3. Supabase Dashboardで直接データベースを確認
   ```sql
   SELECT * FROM admin_users WHERE is_active = true;
   ```

## 📚 変更内容の詳細

### 1. ビューへのGRANT追加
```sql
GRANT SELECT ON admin_all_blog_posts TO anon, authenticated;
GRANT SELECT ON admin_all_services TO anon, authenticated;
GRANT SELECT ON admin_all_faqs TO anon, authenticated;
```

### 2. テーブルへのアクセス権限付与
```sql
GRANT SELECT, INSERT, UPDATE, DELETE ON company_info TO anon, authenticated;
-- （他のテーブルも同様）
```

### 3. 関数へのEXECUTE権限付与
```sql
GRANT EXECUTE ON FUNCTION soft_delete_blog_post(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION verify_admin_credentials(text, text) TO anon, authenticated;
-- （他の関数も同様）
```

### 4. 安全な管理者ビューの作成
```sql
CREATE VIEW admin_users_safe AS
SELECT 
  id, username, display_name, is_active, 
  last_login_at, created_at, updated_at
FROM admin_users
WHERE is_active = true;
-- パスワードハッシュを除外
```

## 🔐 セキュリティに関する注意

### 現在の設定
- RLSポリシーは開発用に緩く設定されています（`USING (true)`）
- 全てのユーザーがデータにアクセス可能です

### 本番環境での推奨設定

本番環境では以下のいずれかを実施してください:

1. **IPホワイトリスト**
   - Supabase Dashboard → Settings → Database → Network Restrictions
   - 信頼できるIPアドレスのみを許可

2. **カスタム認証ヘッダー**
   ```sql
   CREATE POLICY "Admin with token" ON company_info FOR ALL
   USING (
     current_setting('request.headers')::json->>'x-admin-token' = 'your_secret'
   );
   ```

3. **Supabase Authentication統合**
   - Supabase Authを使用してユーザー認証を実装
   - `auth.uid()`を使用したRLSポリシーに変更

## 📞 サポート

問題が解決しない場合は、以下の情報を含めて報告してください:

- エラーメッセージの全文
- 実行したマイグレーションファイル名
- Supabaseプロジェクトのバージョン
- ブラウザの開発者ツールのコンソールログ
- ネットワークタブのエラー詳細

---

**作成日**: 2025年10月29日  
**対象バージョン**: v1.5.1以降
