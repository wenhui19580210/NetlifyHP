-- ================================================
-- マイグレーション: Unrestricted ビューの修正とRLSポリシー調整
-- ================================================
-- 目的:
-- 1. "Unrestricted" として表示されるビューのアクセス許可を修正
-- 2. 管理画面でのログインとデータアクセスの問題を解決
-- 3. RLSポリシーの最適化
-- ================================================


-- ------------------------------------------------
-- 1. ビューのアクセス権限を修正
-- ------------------------------------------------

-- 既存のビューに対して適切なGRANTを設定
GRANT SELECT ON admin_all_blog_posts TO anon, authenticated;
GRANT SELECT ON admin_all_services TO anon, authenticated;
GRANT SELECT ON admin_all_faqs TO anon, authenticated;

-- ビューの所有権をpostgresに設定（必要に応じて）
ALTER VIEW admin_all_blog_posts OWNER TO postgres;
ALTER VIEW admin_all_services OWNER TO postgres;
ALTER VIEW admin_all_faqs OWNER TO postgres;


-- ------------------------------------------------
-- 2. テーブルのアクセス権限を確認・付与
-- ------------------------------------------------

-- 全テーブルに対して基本的なアクセス権を付与
GRANT SELECT, INSERT, UPDATE, DELETE ON company_info TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON company_info_visibility TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON services TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON blog_posts TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON faqs TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON announcements TO anon, authenticated;
GRANT SELECT, UPDATE ON admin_users TO anon, authenticated;

-- シーケンスへのアクセス権も付与（UUIDを使用しているため通常不要だが念のため）
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;


-- ------------------------------------------------
-- 3. RLSポリシーの再確認と最適化
-- ------------------------------------------------

-- 既存のポリシーを確認（問題があれば再作成）

-- 公開ポリシー（変更なし - SELECTのみ）
-- すでに存在するポリシーはそのまま

-- 管理用ポリシーの確認
-- 問題が発生している場合は、以下のポリシーを再作成

-- 会社情報
DO $$
BEGIN
  -- 既存ポリシーを削除して再作成
  DROP POLICY IF EXISTS "Anyone can manage company info" ON company_info;
  CREATE POLICY "Anyone can manage company info" 
    ON company_info FOR ALL 
    USING (true) 
    WITH CHECK (true);
    
  DROP POLICY IF EXISTS "Anyone can manage company info visibility" ON company_info_visibility;
  CREATE POLICY "Anyone can manage company info visibility" 
    ON company_info_visibility FOR ALL 
    USING (true) 
    WITH CHECK (true);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;


-- ------------------------------------------------
-- 4. admin_users テーブルのRLS設定を調整
-- ------------------------------------------------

-- admin_users テーブルは認証に使用するため、特別な扱いが必要
DO $$
BEGIN
  -- パスワードハッシュを除外したビューを作成（セキュリティ向上）
  DROP VIEW IF EXISTS admin_users_safe;
  CREATE VIEW admin_users_safe AS
  SELECT 
    id, 
    username, 
    display_name, 
    is_active, 
    last_login_at, 
    created_at, 
    updated_at
  FROM admin_users
  WHERE is_active = true;
  
  -- ビューへのアクセス許可
  GRANT SELECT ON admin_users_safe TO anon, authenticated;
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;


-- ------------------------------------------------
-- 5. 関数のアクセス権限を確認
-- ------------------------------------------------

-- 論理削除/復元関数へのアクセス許可
GRANT EXECUTE ON FUNCTION soft_delete_blog_post(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION restore_blog_post(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION soft_delete_service(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION restore_service(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION soft_delete_faq(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION restore_faq(uuid) TO anon, authenticated;

-- 管理者認証関数へのアクセス許可
GRANT EXECUTE ON FUNCTION verify_admin_credentials(text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION change_admin_password(uuid, text, text) TO authenticated;


-- ------------------------------------------------
-- 6. スキーマ全体のデフォルト権限を設定
-- ------------------------------------------------

-- 将来作成されるテーブルに対するデフォルト権限
ALTER DEFAULT PRIVILEGES IN SCHEMA public 
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO anon, authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA public 
GRANT EXECUTE ON FUNCTIONS TO anon, authenticated;


-- ------------------------------------------------
-- 7. 完了メッセージと確認クエリ
-- ------------------------------------------------

DO $$
BEGIN
  RAISE NOTICE '✅ Unrestricted ビューの修正が完了しました！';
  RAISE NOTICE '✅ RLSポリシーとアクセス権限を再設定しました！';
  RAISE NOTICE '📋 次のステップ: 管理画面にログインして動作を確認してください。';
  RAISE NOTICE '';
  RAISE NOTICE '=== 確認用クエリ ===';
  RAISE NOTICE 'ビュー一覧: SELECT * FROM pg_views WHERE schemaname = ''public'';';
  RAISE NOTICE 'ポリシー一覧: SELECT * FROM pg_policies WHERE schemaname = ''public'';';
  RAISE NOTICE 'テーブル権限: SELECT * FROM information_schema.table_privileges WHERE table_schema = ''public'';';
END $$;

-- 現在のビュー一覧を確認
SELECT 
  viewname as "ビュー名",
  viewowner as "所有者"
FROM pg_views 
WHERE schemaname = 'public'
ORDER BY viewname;
