-- ================================================
-- 東勝会社 CMSウェブサイト - Step 2: RLSポリシーと認証設定
-- ================================================
-- このマイグレーションファイルは:
-- 1. Row Level Security (RLS) の有効化
-- 2. 公開データアクセスポリシーの設定
-- 3. 認証ユーザー向けポリシーの設定
-- 4. 論理削除関数の作成
-- を含みます。
-- ================================================

-- ------------------------------------------------
-- 1. RLS (Row Level Security) 有効化
-- ------------------------------------------------

ALTER TABLE company_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_info_visibility ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;



-- ------------------------------------------------
-- 2. 既存のポリシーを削除（クリーンアップ）
-- ------------------------------------------------

DROP POLICY IF EXISTS "会社情報は誰でも閲覧可能" ON company_info;
DROP POLICY IF EXISTS "会社情報表示設定は誰でも閲覧可能" ON company_info_visibility;
DROP POLICY IF EXISTS "公開サービスは誰でも閲覧可能" ON services;
DROP POLICY IF EXISTS "公開ブログ記事は誰でも閲覧可能" ON blog_posts;
DROP POLICY IF EXISTS "公開FAQは誰でも閲覧可能" ON faqs;
DROP POLICY IF EXISTS "公開告知は誰でも閲覧可能" ON announcements;
DROP POLICY IF EXISTS "Anyone can manage company info" ON company_info;
DROP POLICY IF EXISTS "Anyone can manage company info visibility" ON company_info_visibility;
DROP POLICY IF EXISTS "Anyone can view all services" ON services;
DROP POLICY IF EXISTS "Anyone can insert services" ON services;
DROP POLICY IF EXISTS "Anyone can update services" ON services;
DROP POLICY IF EXISTS "Anyone can delete services" ON services;
DROP POLICY IF EXISTS "Anyone can view all blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Anyone can insert blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Anyone can update blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Anyone can delete blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Anyone can view all faqs" ON faqs;
DROP POLICY IF EXISTS "Anyone can insert faqs" ON faqs;
DROP POLICY IF EXISTS "Anyone can update faqs" ON faqs;
DROP POLICY IF EXISTS "Anyone can delete faqs" ON faqs;
DROP POLICY IF EXISTS "認証ユーザーは全告知を閲覧可能" ON announcements;
DROP POLICY IF EXISTS "認証ユーザーは告知を追加可能" ON announcements;
DROP POLICY IF EXISTS "認証ユーザーは告知を更新可能" ON announcements;
DROP POLICY IF EXISTS "認証ユーザーは告知を削除可能" ON announcements;

DROP POLICY IF EXISTS "認証ユーザーは会社情報を編集可能" ON company_info;
DROP POLICY IF EXISTS "認証ユーザーは会社情報表示設定を編集可能" ON company_info_visibility;
DROP POLICY IF EXISTS "認証ユーザーは全サービスを閲覧可能" ON services;
DROP POLICY IF EXISTS "認証ユーザーはサービスを追加可能" ON services;
DROP POLICY IF EXISTS "認証ユーザーはサービスを更新可能" ON services;
DROP POLICY IF EXISTS "認証ユーザーはサービスを削除可能" ON services;
DROP POLICY IF EXISTS "認証ユーザーは全ブログ記事を閲覧可能" ON blog_posts;
DROP POLICY IF EXISTS "認証ユーザーはブログ記事を追加可能" ON blog_posts;
DROP POLICY IF EXISTS "認証ユーザーはブログ記事を更新可能" ON blog_posts;
DROP POLICY IF EXISTS "認証ユーザーはブログ記事を削除可能" ON blog_posts;
DROP POLICY IF EXISTS "認証ユーザーは全FAQを閲覧可能" ON faqs;
DROP POLICY IF EXISTS "認証ユーザーはFAQを追加可能" ON faqs;
DROP POLICY IF EXISTS "認証ユーザーはFAQを更新可能" ON faqs;
DROP POLICY IF EXISTS "認証ユーザーはFAQを削除可能" ON faqs;



-- ------------------------------------------------
-- 3. 公開ポリシー（フロントエンド表示用）
-- ------------------------------------------------

-- 会社情報は全ユーザーが閲覧可能
CREATE POLICY "会社情報は誰でも閲覧可能" 
  ON company_info 
  FOR SELECT 
  USING (true);

-- 会社情報表示設定は全ユーザーが閲覧可能
CREATE POLICY "会社情報表示設定は誰でも閲覧可能" 
  ON company_info_visibility 
  FOR SELECT 
  USING (true);

-- 公開されたサービスのみ閲覧可能
CREATE POLICY "公開サービスは誰でも閲覧可能" 
  ON services 
  FOR SELECT 
  USING (is_visible = true AND deleted_at IS NULL);

-- 公開されたブログ記事のみ閲覧可能
CREATE POLICY "公開ブログ記事は誰でも閲覧可能" 
  ON blog_posts 
  FOR SELECT 
  USING (is_visible = true AND deleted_at IS NULL);

-- 公開されたFAQのみ閲覧可能
CREATE POLICY "公開FAQは誰でも閲覧可能" 
  ON faqs 
  FOR SELECT 
  USING (is_visible = true AND deleted_at IS NULL);

-- 公開期間内の告知のみ閲覧可能
CREATE POLICY "公開告知は誰でも閲覧可能" 
  ON announcements 
  FOR SELECT 
  USING (
    is_visible = true 
    AND deleted_at IS NULL 
    AND (start_date IS NULL OR start_date <= now()) 
    AND (end_date IS NULL OR end_date >= now())
  );


-- ------------------------------------------------
-- 4. 管理者ポリシー（Supabase Auth認証ユーザー用）
-- ------------------------------------------------

-- 会社情報: 認証済みユーザーは全操作可能
CREATE POLICY "認証ユーザーは会社情報を管理可能" 
  ON company_info 
  FOR ALL 
  TO authenticated
  USING (true) 
  WITH CHECK (true);

-- 会社情報表示制御: 認証済みユーザーは全操作可能
CREATE POLICY "認証ユーザーは会社情報表示設定を管理可能" 
  ON company_info_visibility 
  FOR ALL 
  TO authenticated
  USING (true) 
  WITH CHECK (true);

-- サービス: 認証済みユーザーは全操作可能
CREATE POLICY "認証ユーザーは全サービスを閲覧可能" 
  ON services 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "認証ユーザーはサービスを追加可能" 
  ON services 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "認証ユーザーはサービスを更新可能" 
  ON services 
  FOR UPDATE 
  TO authenticated
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "認証ユーザーはサービスを削除可能" 
  ON services 
  FOR DELETE 
  TO authenticated
  USING (true);

-- ブログ記事: 認証済みユーザーは全操作可能
CREATE POLICY "認証ユーザーは全ブログ記事を閲覧可能" 
  ON blog_posts 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "認証ユーザーはブログ記事を追加可能" 
  ON blog_posts 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "認証ユーザーはブログ記事を更新可能" 
  ON blog_posts 
  FOR UPDATE 
  TO authenticated
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "認証ユーザーはブログ記事を削除可能" 
  ON blog_posts 
  FOR DELETE 
  TO authenticated
  USING (true);

-- FAQ: 認証済みユーザーは全操作可能
CREATE POLICY "認証ユーザーは全FAQを閲覧可能" 
  ON faqs 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "認証ユーザーはFAQを追加可能" 
  ON faqs 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "認証ユーザーはFAQを更新可能" 
  ON faqs 
  FOR UPDATE 
  TO authenticated
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "認証ユーザーはFAQを削除可能" 
  ON faqs 
  FOR DELETE 
  TO authenticated
  USING (true);

-- 告知: 認証済みユーザーは全操作可能
CREATE POLICY "認証ユーザーは全告知を閲覧可能" 
  ON announcements 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "認証ユーザーは告知を追加可能" 
  ON announcements 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "認証ユーザーは告知を更新可能" 
  ON announcements 
  FOR UPDATE 
  TO authenticated
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "認証ユーザーは告知を削除可能" 
  ON announcements 
  FOR DELETE 
  TO authenticated
  USING (true);




-- ------------------------------------------------
-- 5. 論理削除関数
-- ------------------------------------------------

-- ブログ記事の論理削除/復元関数
CREATE OR REPLACE FUNCTION soft_delete_blog_post(post_id uuid) 
RETURNS void AS $$
BEGIN
  UPDATE blog_posts SET deleted_at = now() WHERE id = post_id AND deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION restore_blog_post(post_id uuid) 
RETURNS void AS $$
BEGIN
  UPDATE blog_posts SET deleted_at = NULL WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- サービスの論理削除/復元関数
CREATE OR REPLACE FUNCTION soft_delete_service(service_id uuid) 
RETURNS void AS $$
BEGIN
  UPDATE services SET deleted_at = now() WHERE id = service_id AND deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION restore_service(service_id uuid) 
RETURNS void AS $$
BEGIN
  UPDATE services SET deleted_at = NULL WHERE id = service_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- FAQの論理削除/復元関数
CREATE OR REPLACE FUNCTION soft_delete_faq(faq_id uuid) 
RETURNS void AS $$
BEGIN
  UPDATE faqs SET deleted_at = now() WHERE id = faq_id AND deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION restore_faq(faq_id uuid) 
RETURNS void AS $$
BEGIN
  UPDATE faqs SET deleted_at = NULL WHERE id = faq_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ------------------------------------------------
-- 6. 完了メッセージ
-- ------------------------------------------------

DO $$
BEGIN
  RAISE NOTICE '✅ Step 2: RLSポリシーと認証設定が完了しました！';
  RAISE NOTICE '🔐 認証方式: Supabase Authentication (authenticated ロール)';
  RAISE NOTICE '📋 次のステップ: 20251030000003_step3_initial_data.sql を実行してください。';
END $$;
