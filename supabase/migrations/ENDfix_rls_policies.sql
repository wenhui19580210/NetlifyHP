-- ================================================
-- RLSポリシー修正 - カスタム認証対応
-- ================================================
-- Version: 1.4.1
-- Created: 2025-10-28
-- Description: カスタム管理者認証に対応するためのRLS修正
-- ================================================

-- ================================================
-- 既存のポリシーを削除
-- ================================================

-- 会社情報
DROP POLICY IF EXISTS "認証ユーザーは会社情報を編集可能" ON company_info;
DROP POLICY IF EXISTS "認証ユーザーは会社情報表示設定を編集可能" ON company_info_visibility;

-- サービス
DROP POLICY IF EXISTS "認証ユーザーは全サービスを閲覧可能" ON services;
DROP POLICY IF EXISTS "認証ユーザーはサービスを追加可能" ON services;
DROP POLICY IF EXISTS "認証ユーザーはサービスを更新可能" ON services;
DROP POLICY IF EXISTS "認証ユーザーはサービスを削除可能" ON services;

-- ブログ
DROP POLICY IF EXISTS "認証ユーザーは全ブログ記事を閲覧可能" ON blog_posts;
DROP POLICY IF EXISTS "認証ユーザーはブログ記事を追加可能" ON blog_posts;
DROP POLICY IF EXISTS "認証ユーザーはブログ記事を更新可能" ON blog_posts;
DROP POLICY IF EXISTS "認証ユーザーはブログ記事を削除可能" ON blog_posts;

-- FAQ
DROP POLICY IF EXISTS "認証ユーザーは全FAQを閲覧可能" ON faqs;
DROP POLICY IF EXISTS "認証ユーザーはFAQを追加可能" ON faqs;
DROP POLICY IF EXISTS "認証ユーザーはFAQを更新可能" ON faqs;
DROP POLICY IF EXISTS "認証ユーザーはFAQを削除可能" ON faqs;

-- ================================================
-- 新しいポリシーを作成（匿名ユーザーも管理操作可能）
-- ================================================
-- ⚠️ 注意: カスタム認証を使用しているため、anon keyでも管理操作を許可します
-- クライアント側で必ずログイン状態を確認してから操作を実行してください
-- 本番環境ではIPホワイトリストなど追加のセキュリティ対策を推奨します

-- 会社情報: 全ユーザーが全操作可能（フロント側で認証チェック）
CREATE POLICY "Anyone can manage company info"
  ON company_info FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can manage company info visibility"
  ON company_info_visibility FOR ALL
  USING (true)
  WITH CHECK (true);

-- サービス: 全ユーザーが全データ閲覧・編集可能
CREATE POLICY "Anyone can view all services"
  ON services FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert services"
  ON services FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update services"
  ON services FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete services"
  ON services FOR DELETE
  USING (true);

-- ブログ: 全ユーザーが全データ閲覧・編集可能
CREATE POLICY "Anyone can view all blog posts"
  ON blog_posts FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert blog posts"
  ON blog_posts FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update blog posts"
  ON blog_posts FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete blog posts"
  ON blog_posts FOR DELETE
  USING (true);

-- FAQ: 全ユーザーが全データ閲覧・編集可能
CREATE POLICY "Anyone can view all faqs"
  ON faqs FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert faqs"
  ON faqs FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update faqs"
  ON faqs FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete faqs"
  ON faqs FOR DELETE
  USING (true);

-- ================================================
-- 完了メッセージ
-- ================================================

DO $$
BEGIN
  RAISE NOTICE '✅ RLSポリシーの修正が完了しました！';
  RAISE NOTICE '🔓 カスタム認証用に全ユーザーアクセスを許可しています。';
  RAISE NOTICE '⚠️  フロント側で必ずログイン状態を確認してください。';
  RAISE NOTICE '🛡️  本番環境ではIPホワイトリストなど追加のセキュリティ対策を推奨します。';
END $$;
