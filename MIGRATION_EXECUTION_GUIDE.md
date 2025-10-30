# マイグレーション実行ガイド

このガイドでは、新しい4ステップマイグレーションの実行方法を説明します。

## 📋 概要

マイグレーションは以下の4つのステップに分かれています:

1. **Step 1**: 基本テーブル構造とエクステンション
2. **Step 2**: RLSポリシーと認証設定
3. **Step 3**: 初期データとビュー
4. **Step 4**: SEO設定、ストレージ、高度な機能

## 🎯 実行方法

### オプション1: Supabase Dashboard（推奨）

#### Step 1: 準備

1. **Supabase Dashboardにログイン**
   - https://supabase.com/dashboard にアクセス
   - プロジェクトを選択: `wigcobzzsurxzkkuperc`

2. **SQL Editorを開く**
   - 左サイドバーから `SQL Editor` をクリック

#### Step 2: マイグレーション実行

各ステップを**順番に**実行してください:

##### ステップ 1: 基本スキーマ

1. `+ New query` をクリック
2. `supabase/migrations/20251030000001_step1_base_schema.sql` の内容をコピー
3. SQL Editorに貼り付け
4. `Run` ボタンをクリック
5. 実行完了を確認（緑のチェックマーク）

##### ステップ 2: RLSポリシー

1. `+ New query` をクリック
2. `supabase/migrations/20251030000002_step2_rls_policies.sql` の内容をコピー
3. SQL Editorに貼り付け
4. `Run` ボタンをクリック
5. 実行完了を確認

##### ステップ 3: 初期データ

1. `+ New query` をクリック
2. `supabase/migrations/20251030000003_step3_initial_data.sql` の内容をコピー
3. SQL Editorに貼り付け
4. `Run` ボタンをクリック
5. 実行完了を確認

##### ステップ 4: 高度な機能

1. `+ New query` をクリック
2. `supabase/migrations/20251030000004_step4_advanced_features.sql` の内容をコピー
3. SQL Editorに貼り付け
4. `Run` ボタンをクリック
5. 実行完了を確認

### オプション2: Supabase CLI

```bash
# Supabase CLIをインストール（未インストールの場合）
npm install -g supabase

# プロジェクトにログイン
supabase login

# プロジェクトをリンク
supabase link --project-ref wigcobzzsurxzkkuperc

# 全マイグレーションを実行
supabase db push

# または個別に実行
supabase db execute --file supabase/migrations/20251030000001_step1_base_schema.sql
supabase db execute --file supabase/migrations/20251030000002_step2_rls_policies.sql
supabase db execute --file supabase/migrations/20251030000003_step3_initial_data.sql
supabase db execute --file supabase/migrations/20251030000004_step4_advanced_features.sql
```

## ✅ 動作確認

### 1. テーブル作成の確認

Supabase Dashboard → `Table Editor` で以下のテーブルが存在することを確認:

- ✅ `company_info`
- ✅ `company_info_visibility`
- ✅ `services`
- ✅ `blog_posts`
- ✅ `faqs`
- ✅ `announcements`
- ✅ `admin_users`
- ✅ `seo_settings`
- ✅ `page_sections`

### 2. RLSポリシーの確認

```sql
-- RLSポリシーの一覧を確認
SELECT schemaname, tablename, policyname, roles, cmd
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

期待される結果:
- 各テーブルに公開ポリシー（SELECT用）が存在
- 各テーブルに認証ユーザー向けポリシー（authenticated用）が存在

### 3. サンプルデータの確認

```sql
-- サービスデータの確認
SELECT service_name_ja, is_visible, deleted_at FROM services;

-- ブログ記事の確認
SELECT title_ja, is_visible, deleted_at FROM blog_posts;

-- FAQの確認
SELECT question_ja, is_visible FROM faqs;
```

### 4. ビューの確認

```sql
-- 管理者用ビューの確認
SELECT * FROM admin_all_services;
SELECT * FROM admin_all_blog_posts;
SELECT * FROM admin_all_faqs;
```

## 🔐 認証設定

マイグレーション完了後、管理者ユーザーを作成してください:

### Supabase Authユーザーの作成

1. **Supabase Dashboard → Authentication → Users**
2. **Add user** → **Create a new user** をクリック
3. ユーザー情報を入力:
   ```
   Email: admin@dongsheng.com
   Password: （強力なパスワードを設定）
   ✅ Auto Confirm User （必ずチェック）
   ```
4. **Create user** をクリック
5. ユーザーのステータスが **Active** になっていることを確認

詳細は `LOGIN_SETUP.md` を参照してください。

## 🧪 ログインテスト

1. **開発サーバーを起動**
   ```bash
   cd /home/user/webapp
   npm run dev
   ```

2. **ログインページにアクセス**
   - ブラウザで `http://localhost:5173/login` にアクセス

3. **ログイン**
   - 作成したメールアドレスとパスワードでログイン
   - 成功すると `/admin` にリダイレクトされます

4. **管理画面の動作確認**
   - 会社情報タブ: データが表示される
   - サービスタブ: サービス一覧が表示される
   - ブログタブ: ブログ記事が表示される
   - FAQタブ: FAQ一覧が表示される

## 🐛 トラブルシューティング

### エラー: "relation already exists"

**原因**: テーブルが既に存在しています

**解決策**:
```sql
-- 既存テーブルを削除（注意: データも削除されます）
DROP TABLE IF EXISTS seo_settings CASCADE;
DROP TABLE IF EXISTS page_sections CASCADE;
-- その後、該当するステップを再実行
```

### エラー: "permission denied"

**原因**: RLSポリシーが正しく設定されていません

**解決策**:
1. Step 2のマイグレーションを再実行
2. ブラウザのキャッシュをクリア
3. 開発サーバーを再起動

### データが表示されない

**確認事項**:
1. `.env` ファイルのSupabase URL/Key が正しいか
2. ブラウザの開発者ツール（F12）でエラーを確認
3. Supabase Dashboardで直接データを確認
4. RLSポリシーが有効になっているか確認

## 📚 関連ドキュメント

- [LOGIN_SETUP.md](LOGIN_SETUP.md) - ログイン設定の詳細ガイド
- [TROUBLESHOOTING_JP.md](TROUBLESHOOTING_JP.md) - 問題解決ガイド
- [SUPABASE_AUTH_SETUP.md](SUPABASE_AUTH_SETUP.md) - Supabase Auth設定

## 🎉 完了後の確認リスト

- [ ] 全4ステップのマイグレーションが正常に完了
- [ ] テーブルが正しく作成されている
- [ ] サンプルデータが投入されている
- [ ] RLSポリシーが設定されている
- [ ] Supabase Authユーザーが作成されている
- [ ] ログインが正常に動作する
- [ ] 管理画面でデータの閲覧・編集ができる

---

**最終更新日**: 2025年10月30日
