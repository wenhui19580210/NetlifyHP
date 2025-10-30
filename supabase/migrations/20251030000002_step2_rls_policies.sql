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
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;


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
DROP POLICY IF EXISTS "Anyone can view admin users" ON admin_users;
DROP POLICY IF EXISTS "Anyone can update admin users" ON admin_users;
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
DROP POLICY IF EXISTS "Authenticated users can view admin users" ON admin_users;
DROP POLICY IF EXISTS "Authenticated users can update own profile" ON admin_users;


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

-- 管理者ユーザー: 認証済みユーザーは閲覧と更新のみ可能
CREATE POLICY "認証ユーザーは管理者ユーザーを閲覧可能" 
  ON admin_users 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "認証ユーザーは管理者ユーザーを更新可能" 
  ON admin_users 
  FOR UPDATE 
  TO authenticated
  USING (true) 
  WITH CHECK (true);


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
-- 6. 管理者認証用関数（参考用・使用非推奨）
-- ------------------------------------------------

-- 注意: これらの関数はadmin_usersテーブルを使用する従来の認証用です
-- Supabase Authを使用する場合は不要ですが、互換性のために残しています

-- パスワード検証関数（username/password認証用）
CREATE OR REPLACE FUNCTION verify_admin_credentials(
  p_username text,
  p_password text
)
RETURNS TABLE(
  user_id uuid,
  username text,
  display_name text
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    au.id,
    au.username,
    au.display_name
  FROM admin_users au
  WHERE
    au.username = p_username
    AND au.password_hash = crypt(p_password, au.password_hash)
    AND au.is_active = true;

  -- 最終ログイン日時を更新
  UPDATE admin_users
  SET last_login_at = now()
  WHERE admin_users.username = p_username;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- パスワード変更関数
CREATE OR REPLACE FUNCTION change_admin_password(
  p_user_id uuid,
  p_old_password text,
  p_new_password text
)
RETURNS boolean AS $$
DECLARE
  v_current_hash text;
BEGIN
  -- 現在のパスワードハッシュを取得
  SELECT password_hash INTO v_current_hash
  FROM admin_users
  WHERE id = p_user_id;

  -- 古いパスワードを検証
  IF v_current_hash = crypt(p_old_password, v_current_hash) THEN
    -- 新しいパスワードを設定
    UPDATE admin_users
    SET password_hash = crypt(p_new_password, gen_salt('bf'))
    WHERE id = p_user_id;

    RETURN true;
  ELSE
    RETURN false;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ------------------------------------------------
-- 7. 完了メッセージ
-- ------------------------------------------------

DO $$
BEGIN
  RAISE NOTICE '✅ Step 2: RLSポリシーと認証設定が完了しました！';
  RAISE NOTICE '🔐 認証方式: Supabase Authentication (authenticated ロール)';
  RAISE NOTICE '📋 次のステップ: 20251030000003_step3_initial_data.sql を実行してください。';
END $$;
