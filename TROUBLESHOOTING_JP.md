# トラブルシューティングガイド 🔧

## 目次
1. [Unrestricted表示の問題](#unrestricted表示の問題)
2. [管理画面にログインできない](#管理画面にログインできない)
3. [データが表示されない](#データが表示されない)
4. [CRUD操作ができない](#crud操作ができない)

---

## Unrestricted表示の問題

### 🔴 症状
Supabase Table Editorで以下のテーブル/ビューが赤字で「Unrestricted」と表示される:
- `admin_all_services`
- `admin_all_blog_posts`
- `admin_all_faqs`
- その他のビュー

### 📋 原因
これらはVIEW（ビュー）であり、実テーブルではありません。「Unrestricted」と表示される理由は:

1. **アクセス権限が不足**: anonロールやauthenticatedロールに対するGRANT権限が設定されていない
2. **RLSの設定不備**: ビューに対してRow Level Security (RLS) が適切に設定されていない
3. **所有権の問題**: ビューの所有者がpostgresではない可能性

### ✅ 解決方法

#### 方法1: マイグレーションファイルを実行（推奨）

```bash
# Supabase Dashboardでマイグレーションを実行
# 1. https://supabase.com/dashboard にアクセス
# 2. SQL Editor を開く
# 3. 以下のファイルの内容をコピー&ペースト
supabase/migrations/005_fix_unrestricted_views.sql
```

#### 方法2: 手動でSQLを実行

Supabase Dashboard → SQL Editor で以下を実行:

```sql
-- ビューへのアクセス権を付与
GRANT SELECT ON admin_all_blog_posts TO anon, authenticated;
GRANT SELECT ON admin_all_services TO anon, authenticated;
GRANT SELECT ON admin_all_faqs TO anon, authenticated;

-- ビューの所有権を確認・変更
ALTER VIEW admin_all_blog_posts OWNER TO postgres;
ALTER VIEW admin_all_services OWNER TO postgres;
ALTER VIEW admin_all_faqs OWNER TO postgres;
```

#### 確認方法

Supabase Dashboard → Table Editor を再読み込み:
- ✅ 赤字の「Unrestricted」表示が消えている
- ✅ ビューが通常表示になっている

---

## 管理画面にログインできない

### ⚠️ 重要: このプロジェクトは Supabase Auth を使用しています

このプロジェクトの認証システムは **Supabase Authentication** を使用しています。
`admin_users` テーブルとパスワードハッシュは**使用されていません**。

詳細な手順は `LOGIN_SETUP.md` を参照してください。

### 🔴 症状
- ログインページでメールアドレスとパスワードを入力しても、ログインできない
- エラーメッセージが表示される
- ログイン後、すぐにログインページに戻される

### 📋 原因

#### 原因1: .envファイルが存在しない
```
Error: Supabase環境変数が設定されていません
```

#### 原因2: Supabase Authでユーザーが作成されていない
```
Error: Invalid login credentials
```

#### 原因3: メールアドレスが確認されていない
```
Error: Email not confirmed
```

#### 原因4: 環境変数の設定ミス
```
Error: Invalid Supabase URL or key
```

### ✅ 解決方法

#### ステップ1: .envファイルを作成

```bash
# .env ファイルが存在しない場合は作成
cp .env.example .env

# 開発サーバーを再起動
npm run dev
```

`.env` ファイルの内容を確認:
```env
VITE_SUPABASE_URL=https://wigcobzzsurxzkkuperc.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### ステップ2: Supabase でユーザーを作成

1. **Supabase Dashboard にアクセス**
   - https://supabase.com/dashboard
   - プロジェクト `wigcobzzsurxzkkuperc` を選択

2. **Authentication → Users に移動**

3. **新しいユーザーを作成**
   - 「Add user」ボタンをクリック
   - 以下を入力:
     ```
     Email: admin@dongsheng.com
     Password: admin123456
     ✅ Auto Confirm User （必ずチェック！）
     ❌ Send Email Invitation （チェックしない）
     ```
   - 「Create user」をクリック

#### ステップ3: メール確認ステータスを確認

Authentication → Users で以下を確認:

- ✅ **Email Confirmed** カラムが緑色のチェックマークになっている
- ✅ **Status** が「Active」になっている

もし未確認の場合:
1. ユーザーをクリック
2. 「Confirm Email」ボタンをクリック

#### ステップ4: ブラウザキャッシュをクリア

1. ブラウザの開発者ツールを開く（F12）
2. Application タブ → Storage → Clear site data
3. ページを再読み込み（Ctrl+Shift+R / Cmd+Shift+R）

#### 確認方法

1. `/login` にアクセス
2. 以下のアカウントでログインを試す:
   - **メールアドレス**: `admin@dongsheng.com`
   - **パスワード**: `admin123456`

✅ ログイン成功 → ダッシュボードが表示される

### 📝 注意事項

- ❌ `admin_users` テーブルは使用されていません
- ❌ `verify_admin_credentials` 関数は使用されていません
- ✅ 認証は完全に Supabase Auth で管理されています
- ✅ メールアドレスとパスワードでログインします

---

## データが表示されない

### 🔴 症状
- 管理画面にログインできるが、データが表示されない
- 「データがありません」というメッセージが表示される
- ロード中のまま画面が固まる

### 📋 原因

#### 原因1: テーブルへのSELECT権限不足
#### 原因2: RLSポリシーでデータがフィルタされている
#### 原因3: データが実際に存在しない

### ✅ 解決方法

#### ステップ1: テーブル権限を確認・付与

Supabase Dashboard → SQL Editor:

```sql
-- 全テーブルへのアクセス権を付与
GRANT SELECT, INSERT, UPDATE, DELETE ON company_info TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON company_info_visibility TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON services TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON blog_posts TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON faqs TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON announcements TO anon, authenticated;

-- ビューへのアクセス権も付与
GRANT SELECT ON admin_all_blog_posts TO anon, authenticated;
GRANT SELECT ON admin_all_services TO anon, authenticated;
GRANT SELECT ON admin_all_faqs TO anon, authenticated;
```

#### ステップ2: RLSポリシーを確認

```sql
-- 現在のポリシーを確認
SELECT 
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE schemaname = 'public'
  AND tablename IN ('company_info', 'services', 'blog_posts', 'faqs')
ORDER BY tablename, policyname;
```

ポリシーが存在しない、または厳しすぎる場合は修正:

```sql
-- 会社情報のポリシー
CREATE POLICY "Anyone can view company info" 
  ON company_info FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can manage company info" 
  ON company_info FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- サービスのポリシー（同様に他のテーブルも設定）
CREATE POLICY "Anyone can view all services" 
  ON services FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can manage services" 
  ON services FOR ALL 
  USING (true) 
  WITH CHECK (true);
```

#### ステップ3: データの存在を確認

```sql
-- 各テーブルのレコード数を確認
SELECT 'company_info' as table_name, COUNT(*) as count FROM company_info
UNION ALL
SELECT 'services', COUNT(*) FROM services
UNION ALL
SELECT 'blog_posts', COUNT(*) FROM blog_posts
UNION ALL
SELECT 'faqs', COUNT(*) FROM faqs;
```

データが存在しない場合は、サンプルデータを投入:

```sql
-- 会社情報の初期データ
INSERT INTO company_info (id)
SELECT uuid_generate_v4()
WHERE NOT EXISTS (SELECT 1 FROM company_info);

-- サービスのサンプルデータ
INSERT INTO services (service_name_ja, service_name_zh, description_ja, order_index)
VALUES 
  ('点検サービス', '检查服务', '太陽光パネルの定期点検', 1),
  ('清掃サービス', '清洁服务', 'パネルの専門清掃', 2)
ON CONFLICT DO NOTHING;
```

#### 確認方法

1. 管理画面を再読み込み
2. 各タブでデータが表示されることを確認:
   - ✅ 会社情報タブ: 会社情報が表示される
   - ✅ サービスタブ: サービス一覧が表示される
   - ✅ ブログタブ: ブログ記事一覧が表示される

---

## CRUD操作ができない

### 🔴 症状
- データの新規作成ができない
- データの編集・更新ができない
- データの削除ができない
- 「Permission denied」エラーが表示される

### 📋 原因

#### 原因1: INSERT/UPDATE/DELETE権限不足
#### 原因2: RLSポリシーのWITH CHECK条件が厳しい
#### 原因3: 論理削除関数へのアクセス権限不足

### ✅ 解決方法

#### ステップ1: CRUD権限を付与

```sql
-- 全操作を許可
GRANT SELECT, INSERT, UPDATE, DELETE ON company_info TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON services TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON blog_posts TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON faqs TO anon, authenticated;
```

#### ステップ2: RLSポリシーを調整

```sql
-- servicesテーブルの例
DROP POLICY IF EXISTS "Anyone can insert services" ON services;
CREATE POLICY "Anyone can insert services" 
  ON services FOR INSERT 
  WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can update services" ON services;
CREATE POLICY "Anyone can update services" 
  ON services FOR UPDATE 
  USING (true) 
  WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can delete services" ON services;
CREATE POLICY "Anyone can delete services" 
  ON services FOR DELETE 
  USING (true);
```

#### ステップ3: 論理削除関数への権限付与

```sql
-- 論理削除/復元関数へのEXECUTE権限
GRANT EXECUTE ON FUNCTION soft_delete_blog_post(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION restore_blog_post(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION soft_delete_service(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION restore_service(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION soft_delete_faq(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION restore_faq(uuid) TO anon, authenticated;
```

#### 確認方法

管理画面で以下の操作をテスト:

1. **新規作成**
   - サービスタブ → 「新規サービス」ボタンをクリック
   - フォームに入力 → 保存
   - ✅ サービスが一覧に追加される

2. **編集**
   - 既存のサービスの「編集」ボタンをクリック
   - 内容を変更 → 保存
   - ✅ 変更が反映される

3. **削除**
   - サービスの「削除」ボタンをクリック
   - ✅ 論理削除される（`deleted_at`がセットされる）

4. **復元**
   - 削除されたサービスの「復元」ボタンをクリック
   - ✅ サービスが復元される

---

## 総合的な解決策: マイグレーション実行

上記の問題をまとめて解決するには、用意されたマイグレーションファイルを実行してください:

### 実行方法

1. **Supabase Dashboardにアクセス**
   ```
   https://supabase.com/dashboard
   ```

2. **SQL Editorを開く**
   - 左サイドバー → SQL Editor → + New query

3. **マイグレーションファイルの内容をコピー**
   ```
   supabase/migrations/005_fix_unrestricted_views.sql
   ```

4. **SQL Editorに貼り付けて実行**
   - Runボタンをクリック
   - 成功メッセージを確認

5. **ブラウザをリフレッシュ**
   - Ctrl+Shift+R (Windows/Linux)
   - Cmd+Shift+R (Mac)

6. **動作確認**
   - 管理画面にログイン
   - 各機能が正常に動作することを確認

---

## デバッグ用SQLクエリ集

### 権限の確認
```sql
-- テーブル権限の確認
SELECT 
  table_name,
  privilege_type,
  grantee
FROM information_schema.table_privileges 
WHERE table_schema = 'public'
  AND table_name IN ('company_info', 'services', 'blog_posts', 'faqs')
ORDER BY table_name, grantee;

-- 関数権限の確認
SELECT 
  routine_name,
  routine_type,
  security_type
FROM information_schema.routines
WHERE routine_schema = 'public'
ORDER BY routine_name;
```

### RLSポリシーの確認
```sql
SELECT 
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  CASE 
    WHEN qual = 'true' THEN 'USING (true)'
    ELSE qual 
  END as using_clause,
  CASE 
    WHEN with_check = 'true' THEN 'WITH CHECK (true)'
    ELSE with_check 
  END as with_check_clause
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

### データの確認
```sql
-- 各テーブルの統計情報
SELECT 
  'company_info' as table_name,
  COUNT(*) as total_records,
  0 as visible_records,
  0 as deleted_records
FROM company_info

UNION ALL

SELECT 
  'services',
  COUNT(*),
  SUM(CASE WHEN is_visible = true AND deleted_at IS NULL THEN 1 ELSE 0 END),
  SUM(CASE WHEN deleted_at IS NOT NULL THEN 1 ELSE 0 END)
FROM services

UNION ALL

SELECT 
  'blog_posts',
  COUNT(*),
  SUM(CASE WHEN is_visible = true AND deleted_at IS NULL THEN 1 ELSE 0 END),
  SUM(CASE WHEN deleted_at IS NOT NULL THEN 1 ELSE 0 END)
FROM blog_posts

UNION ALL

SELECT 
  'faqs',
  COUNT(*),
  SUM(CASE WHEN is_visible = true AND deleted_at IS NULL THEN 1 ELSE 0 END),
  SUM(CASE WHEN deleted_at IS NOT NULL THEN 1 ELSE 0 END)
FROM faqs;
```

---

## さらにサポートが必要な場合

### 開発者ツールでエラーを確認

1. ブラウザで開発者ツールを開く (F12)
2. **Console タブ**: JavaScriptエラーを確認
3. **Network タブ**: APIリクエストのエラーを確認
   - 失敗したリクエストを選択
   - Response タブでエラーメッセージを確認

### よくあるエラーメッセージ

| エラーメッセージ | 原因 | 解決策 |
|---------------|------|-------|
| `permission denied for table xxx` | テーブル権限不足 | `GRANT SELECT, INSERT, UPDATE, DELETE ON xxx TO anon, authenticated;` |
| `permission denied for function xxx` | 関数権限不足 | `GRANT EXECUTE ON FUNCTION xxx TO anon, authenticated;` |
| `new row violates row-level security` | RLSポリシーが厳しい | ポリシーを `USING (true)` に変更 |
| `invalid input syntax for type uuid` | UUIDの形式が不正 | データ形式を確認 |

---

**最終更新**: 2025年10月29日  
**対象バージョン**: v1.5.1以降
