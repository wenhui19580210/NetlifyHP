-- ================================================
-- 東勝会社 CMS - 管理者アカウント初期設定
-- ================================================
-- Version: 1.2.0
-- Created: 2025-10-27
-- Description: デフォルト管理者アカウントの作成
-- ================================================

-- ⚠️ 重要: このSQLはSupabase SQLエディタで実行してください
-- Supabaseダッシュボード → SQL Editor → 新規クエリ → 以下を貼り付けて実行

-- ================================================
-- 1. 管理者アカウントの作成
-- ================================================
-- デフォルト管理者: admin / admin
-- ⚠️ 本番環境では必ずパスワードを変更してください！

-- 注意: auth.users テーブルは Supabase が管理しているため、
-- ダッシュボードから手動で作成するか、Auth APIを使用します。

-- Supabase Dashboard での手動作成方法:
-- 1. Supabase Dashboard を開く
-- 2. Authentication → Users → Add User をクリック
-- 3. 以下の情報を入力:
--    - Email: admin@tokatsu-solar.local
--    - Password: admin
--    - Auto Confirm User: ON にする
-- 4. "Create User" をクリック

-- ================================================
-- 2. 会社情報の初期データ挿入（存在しない場合のみ）
-- ================================================

INSERT INTO company_info (
  company_name,
  company_name_en,
  company_name_zh,
  ceo_name,
  established,
  capital,
  employees,
  business_content_ja,
  business_content_zh,
  phone,
  email,
  address_ja,
  address_zh,
  postal_code,
  main_color,
  sub_color,
  ceo_message_ja,
  ceo_message_zh
)
SELECT 
  '東勝会社',
  'Tokatsu Co., Ltd.',
  '东胜公司',
  '郭 祥',
  '2024-01-01'::date,
  '500万円',
  10,
  '太陽光発電パネルの点検・清掃・保守をトータルサポート',
  '太阳能发电板检查、清洁、维护的全面支持',
  '090-7401-8083',
  'guochao3000@gmail.com',
  '〒659-0036 兵庫県芦屋市涼風町26番14号1F',
  '〒659-0036 兵库县芦屋市凉风町26番14号1F',
  '659-0036',
  '#f59e0b',
  '#0ea5e9',
  '太陽光発電は、持続可能なエネルギーの未来を築く重要な技術です。私たちは、お客様の太陽光発電システムが常に最高のパフォーマンスを発揮できるよう、専門的なメンテナンスサービスを提供しています。',
  '太阳能发电是构建可持续能源未来的重要技术。我们提供专业的维护服务，确保客户的太阳能发电系统始终保持最佳性能。'
WHERE NOT EXISTS (SELECT 1 FROM company_info LIMIT 1);

-- ================================================
-- 3. 会社情報表示制御の初期データ
-- ================================================

INSERT INTO company_info_visibility (field_name, is_visible)
VALUES
  ('company_name', true),
  ('ceo_name', true),
  ('established', true),
  ('capital', true),
  ('employees', true),
  ('business_content', true),
  ('phone', true),
  ('email', true),
  ('address', true),
  ('ceo_message', true)
ON CONFLICT (field_name) DO NOTHING;

-- ================================================
-- 4. 管理者用のデータベースビュー作成（オプション）
-- ================================================

-- 削除済みを含む全ブログ記事のビュー
CREATE OR REPLACE VIEW admin_all_blog_posts AS
SELECT 
  id,
  title_ja,
  title_zh,
  content_ja,
  content_zh,
  image_url,
  publish_date,
  is_visible,
  deleted_at,
  created_at,
  updated_at,
  CASE 
    WHEN deleted_at IS NOT NULL THEN 'deleted'
    WHEN is_visible = false THEN 'draft'
    ELSE 'published'
  END as status
FROM blog_posts
ORDER BY 
  CASE WHEN deleted_at IS NOT NULL THEN 2 ELSE 1 END,
  publish_date DESC;

-- 削除済みを含む全サービスのビュー
CREATE OR REPLACE VIEW admin_all_services AS
SELECT 
  id,
  service_name_ja,
  service_name_zh,
  description_ja,
  description_zh,
  image_url,
  icon,
  order_index,
  is_visible,
  deleted_at,
  created_at,
  updated_at,
  CASE 
    WHEN deleted_at IS NOT NULL THEN 'deleted'
    WHEN is_visible = false THEN 'draft'
    ELSE 'published'
  END as status
FROM services
ORDER BY 
  CASE WHEN deleted_at IS NOT NULL THEN 2 ELSE 1 END,
  order_index ASC;

-- 削除済みを含む全FAQのビュー
CREATE OR REPLACE VIEW admin_all_faqs AS
SELECT 
  id,
  question_ja,
  question_zh,
  answer_ja,
  answer_zh,
  order_index,
  is_visible,
  deleted_at,
  created_at,
  updated_at,
  CASE 
    WHEN deleted_at IS NOT NULL THEN 'deleted'
    WHEN is_visible = false THEN 'draft'
    ELSE 'published'
  END as status
FROM faqs
ORDER BY 
  CASE WHEN deleted_at IS NOT NULL THEN 2 ELSE 1 END,
  order_index ASC;

-- ================================================
-- 5. 便利な管理用関数
-- ================================================

-- ブログ記事の論理削除関数
CREATE OR REPLACE FUNCTION soft_delete_blog_post(post_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE blog_posts 
  SET deleted_at = now()
  WHERE id = post_id AND deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ブログ記事の復元関数
CREATE OR REPLACE FUNCTION restore_blog_post(post_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE blog_posts 
  SET deleted_at = NULL
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- サービスの論理削除関数
CREATE OR REPLACE FUNCTION soft_delete_service(service_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE services 
  SET deleted_at = now()
  WHERE id = service_id AND deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- サービスの復元関数
CREATE OR REPLACE FUNCTION restore_service(service_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE services 
  SET deleted_at = NULL
  WHERE id = service_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- FAQの論理削除関数
CREATE OR REPLACE FUNCTION soft_delete_faq(faq_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE faqs 
  SET deleted_at = now()
  WHERE id = faq_id AND deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- FAQの復元関数
CREATE OR REPLACE FUNCTION restore_faq(faq_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE faqs 
  SET deleted_at = NULL
  WHERE id = faq_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================
-- 完了メッセージ
-- ================================================

DO $$
BEGIN
  RAISE NOTICE '✅ 管理者アカウント初期設定が完了しました！';
  RAISE NOTICE '';
  RAISE NOTICE '📌 次のステップ:';
  RAISE NOTICE '1. Supabase Dashboard → Authentication → Users';
  RAISE NOTICE '2. "Add User" をクリック';
  RAISE NOTICE '3. Email: admin@tokatsu-solar.local';
  RAISE NOTICE '4. Password: admin';
  RAISE NOTICE '5. "Auto Confirm User" をONにする';
  RAISE NOTICE '6. "Create User" をクリック';
  RAISE NOTICE '';
  RAISE NOTICE '⚠️  本番環境では必ずパスワードを変更してください！';
END $$;
