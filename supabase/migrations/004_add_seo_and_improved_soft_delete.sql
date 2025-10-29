-- ================================================
-- 東勝会社 CMSウェブサイト - SEO設定と論理削除改善
-- ================================================
-- 目的:
-- 1. 既存のテーブル設計とRLSポリシーの削除
-- 2. SEO設定テーブルの追加
-- 3. 論理削除機能の改善
-- 4. RLSポリシーの再設定
-- 5. サンプルデータの投入
-- 6. 管理ユーザーの設定
-- ================================================


-- ------------------------------------------------
-- 1. 既存のテーブル設計とRLSポリシーの削除
-- ------------------------------------------------

-- RLSポリシーを削除
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

-- ビューを削除
DROP VIEW IF EXISTS admin_all_blog_posts;
DROP VIEW IF EXISTS admin_all_services;
DROP VIEW IF EXISTS admin_all_faqs;

-- 関数を削除（論理削除関連）
DROP FUNCTION IF EXISTS soft_delete_blog_post(uuid);
DROP FUNCTION IF EXISTS restore_blog_post(uuid);
DROP FUNCTION IF EXISTS soft_delete_service(uuid);
DROP FUNCTION IF EXISTS restore_service(uuid);
DROP FUNCTION IF EXISTS soft_delete_faq(uuid);
DROP FUNCTION IF EXISTS restore_faq(uuid);

-- 既存テーブルは削除しない（データを保持）
-- SEO設定テーブルのみ作成


-- ------------------------------------------------
-- 2. テーブルの骨組み - SEO設定テーブル
-- ------------------------------------------------

-- 2.1 SEO設定テーブル (seo_settings)
CREATE TABLE IF NOT EXISTS seo_settings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- ページ識別子（home, about, services, contact など）
  page_key text UNIQUE NOT NULL,

  -- 基本SEO設定（日本語）
  title_ja text,
  description_ja text,
  keywords_ja text[], -- キーワードの配列

  -- 基本SEO設定（中国語）
  title_zh text,
  description_zh text,
  keywords_zh text[], -- キーワードの配列

  -- OGP (Open Graph Protocol) 設定
  og_title_ja text,
  og_title_zh text,
  og_description_ja text,
  og_description_zh text,
  og_image_url text, -- OGP画像URL
  og_type text DEFAULT 'website', -- website, article など

  -- Twitter Card設定
  twitter_card text DEFAULT 'summary_large_image', -- summary, summary_large_image など
  twitter_site text, -- @username形式のTwitterアカウント
  twitter_creator text, -- @username形式のTwitterアカウント

  -- 構造化データ（JSON-LD）
  structured_data jsonb, -- Schema.orgの構造化データ

  -- カノニカルURL設定
  canonical_url text,

  -- robots meta設定
  robots_index boolean DEFAULT true, -- index/noindex
  robots_follow boolean DEFAULT true, -- follow/nofollow

  -- 優先度設定
  priority decimal(2,1) DEFAULT 0.5 CHECK (priority >= 0.0 AND priority <= 1.0), -- sitemap用の優先度
  change_frequency text DEFAULT 'weekly', -- always, hourly, daily, weekly, monthly, yearly, never

  -- 公開設定
  is_active boolean DEFAULT true,

  -- システムフィールド
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

COMMENT ON TABLE seo_settings IS 'ページ別SEO設定（メタタグ、OGP、構造化データ）';
COMMENT ON COLUMN seo_settings.page_key IS 'ページ識別キー（例: home, about, services, contact, blog）';
COMMENT ON COLUMN seo_settings.structured_data IS 'Schema.org形式のJSON-LD構造化データ';
COMMENT ON COLUMN seo_settings.robots_index IS 'true=index（検索エンジンに登録）, false=noindex（登録しない）';
COMMENT ON COLUMN seo_settings.robots_follow IS 'true=follow（リンクをたどる）, false=nofollow（リンクをたどらない）';


-- ------------------------------------------------
-- 3. RLSポリシーの設定
-- ------------------------------------------------

-- SEO設定テーブルのRLS有効化
ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;

-- 公開ポリシー（フロントエンド表示用）
CREATE POLICY "SEO設定は誰でも閲覧可能" 
  ON seo_settings 
  FOR SELECT 
  USING (is_active = true);

-- 管理者ポリシー（全操作を許可）
CREATE POLICY "誰でもSEO設定を管理可能" 
  ON seo_settings 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- 既存テーブルのRLSポリシーを再設定
-- 会社情報
CREATE POLICY "会社情報は誰でも閲覧可能" ON company_info FOR SELECT USING (true);
CREATE POLICY "誰でも会社情報を管理可能" ON company_info FOR ALL USING (true) WITH CHECK (true);

-- 会社情報表示設定
CREATE POLICY "会社情報表示設定は誰でも閲覧可能" ON company_info_visibility FOR SELECT USING (true);
CREATE POLICY "誰でも会社情報表示設定を管理可能" ON company_info_visibility FOR ALL USING (true) WITH CHECK (true);

-- サービス（論理削除対応）
CREATE POLICY "公開サービスは誰でも閲覧可能" ON services FOR SELECT USING (is_visible = true AND deleted_at IS NULL);
CREATE POLICY "誰でも全サービスを閲覧可能" ON services FOR SELECT USING (true);
CREATE POLICY "誰でもサービスを追加可能" ON services FOR INSERT WITH CHECK (true);
CREATE POLICY "誰でもサービスを更新可能" ON services FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "誰でもサービスを削除可能" ON services FOR DELETE USING (true);

-- ブログ記事（論理削除対応）
CREATE POLICY "公開ブログ記事は誰でも閲覧可能" ON blog_posts FOR SELECT USING (is_visible = true AND deleted_at IS NULL);
CREATE POLICY "誰でも全ブログ記事を閲覧可能" ON blog_posts FOR SELECT USING (true);
CREATE POLICY "誰でもブログ記事を追加可能" ON blog_posts FOR INSERT WITH CHECK (true);
CREATE POLICY "誰でもブログ記事を更新可能" ON blog_posts FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "誰でもブログ記事を削除可能" ON blog_posts FOR DELETE USING (true);

-- FAQ（論理削除対応）
CREATE POLICY "公開FAQは誰でも閲覧可能" ON faqs FOR SELECT USING (is_visible = true AND deleted_at IS NULL);
CREATE POLICY "誰でも全FAQを閲覧可能" ON faqs FOR SELECT USING (true);
CREATE POLICY "誰でもFAQを追加可能" ON faqs FOR INSERT WITH CHECK (true);
CREATE POLICY "誰でもFAQを更新可能" ON faqs FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "誰でもFAQを削除可能" ON faqs FOR DELETE USING (true);

-- 告知（論理削除対応）
CREATE POLICY "公開告知は誰でも閲覧可能" ON announcements FOR SELECT USING (is_visible = true AND deleted_at IS NULL AND (start_date IS NULL OR start_date <= now()) AND (end_date IS NULL OR end_date >= now()));
CREATE POLICY "誰でも全告知を閲覧可能" ON announcements FOR SELECT USING (true);
CREATE POLICY "誰でも告知を追加可能" ON announcements FOR INSERT WITH CHECK (true);
CREATE POLICY "誰でも告知を更新可能" ON announcements FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "誰でも告知を削除可能" ON announcements FOR DELETE USING (true);

-- 管理者ユーザー
CREATE POLICY "誰でも管理者ユーザーを閲覧可能" ON admin_users FOR SELECT USING (true);
CREATE POLICY "誰でも管理者ユーザーを更新可能" ON admin_users FOR UPDATE USING (true) WITH CHECK (true);


-- ------------------------------------------------
-- 4. トリガー設定
-- ------------------------------------------------

-- SEO設定の更新日時を自動更新
CREATE TRIGGER update_seo_settings_updated_at
  BEFORE UPDATE ON seo_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();


-- ------------------------------------------------
-- 5. インデックス作成
-- ------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_seo_settings_page_key ON seo_settings(page_key);
CREATE INDEX IF NOT EXISTS idx_seo_settings_active ON seo_settings(is_active);


-- ------------------------------------------------
-- 6. 論理削除関数（改善版）
-- ------------------------------------------------

-- 汎用的な論理削除関数
CREATE OR REPLACE FUNCTION soft_delete_record(
  p_table_name text,
  p_record_id uuid
)
RETURNS void AS $$
BEGIN
  EXECUTE format('UPDATE %I SET deleted_at = now() WHERE id = $1 AND deleted_at IS NULL', p_table_name)
  USING p_record_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 汎用的な復元関数
CREATE OR REPLACE FUNCTION restore_record(
  p_table_name text,
  p_record_id uuid
)
RETURNS void AS $$
BEGIN
  EXECUTE format('UPDATE %I SET deleted_at = NULL WHERE id = $1', p_table_name)
  USING p_record_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ブログ記事の論理削除/復元関数（後方互換性のため保持）
CREATE OR REPLACE FUNCTION soft_delete_blog_post(post_id uuid) RETURNS void AS $$
BEGIN
  PERFORM soft_delete_record('blog_posts', post_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION restore_blog_post(post_id uuid) RETURNS void AS $$
BEGIN
  PERFORM restore_record('blog_posts', post_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- サービスの論理削除/復元関数（後方互換性のため保持）
CREATE OR REPLACE FUNCTION soft_delete_service(service_id uuid) RETURNS void AS $$
BEGIN
  PERFORM soft_delete_record('services', service_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION restore_service(service_id uuid) RETURNS void AS $$
BEGIN
  PERFORM restore_record('services', service_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- FAQの論理削除/復元関数（後方互換性のため保持）
CREATE OR REPLACE FUNCTION soft_delete_faq(faq_id uuid) RETURNS void AS $$
BEGIN
  PERFORM soft_delete_record('faqs', faq_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION restore_faq(faq_id uuid) RETURNS void AS $$
BEGIN
  PERFORM restore_record('faqs', faq_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 告知の論理削除/復元関数（新規追加）
CREATE OR REPLACE FUNCTION soft_delete_announcement(announcement_id uuid) RETURNS void AS $$
BEGIN
  PERFORM soft_delete_record('announcements', announcement_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION restore_announcement(announcement_id uuid) RETURNS void AS $$
BEGIN
  PERFORM restore_record('announcements', announcement_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ------------------------------------------------
-- 7. 管理者用ビュー作成
-- ------------------------------------------------

CREATE OR REPLACE VIEW admin_all_blog_posts AS
SELECT
  id,
  title_ja, title_zh, content_ja, content_zh, image_url,
  publish_date, is_visible, deleted_at, created_at, updated_at,
  CASE
    WHEN deleted_at IS NOT NULL THEN 'deleted'
    WHEN is_visible = false THEN 'draft'
    ELSE 'published'
  END as status
FROM blog_posts
ORDER BY
  CASE WHEN deleted_at IS NOT NULL THEN 2 ELSE 1 END,
  publish_date DESC;

CREATE OR REPLACE VIEW admin_all_services AS
SELECT
  id,
  service_name_ja, service_name_zh, description_ja, description_zh, image_url, icon,
  order_index, is_visible, deleted_at, created_at, updated_at,
  CASE
    WHEN deleted_at IS NOT NULL THEN 'deleted'
    WHEN is_visible = false THEN 'draft'
    ELSE 'published'
  END as status
FROM services
ORDER BY
  CASE WHEN deleted_at IS NOT NULL THEN 2 ELSE 1 END,
  order_index ASC;

CREATE OR REPLACE VIEW admin_all_faqs AS
SELECT
  id,
  question_ja, question_zh, answer_ja, answer_zh,
  order_index, is_visible, deleted_at, created_at, updated_at,
  CASE
    WHEN deleted_at IS NOT NULL THEN 'deleted'
    WHEN is_visible = false THEN 'draft'
    ELSE 'published'
  END as status
FROM faqs
ORDER BY
  CASE WHEN deleted_at IS NOT NULL THEN 2 ELSE 1 END,
  order_index ASC;

CREATE OR REPLACE VIEW admin_all_announcements AS
SELECT
  id,
  title_ja, title_zh, content_ja, content_zh,
  is_visible, start_date, end_date, priority,
  background_color, text_color, deleted_at, created_at, updated_at,
  CASE
    WHEN deleted_at IS NOT NULL THEN 'deleted'
    WHEN is_visible = false THEN 'draft'
    ELSE 'published'
  END as status
FROM announcements
ORDER BY
  CASE WHEN deleted_at IS NOT NULL THEN 2 ELSE 1 END,
  priority DESC;


-- ------------------------------------------------
-- 4. サンプルデータの投入
-- ------------------------------------------------

-- ホームページのSEO設定
INSERT INTO seo_settings (
  page_key,
  title_ja,
  description_ja,
  keywords_ja,
  title_zh,
  description_zh,
  keywords_zh,
  og_title_ja,
  og_title_zh,
  og_description_ja,
  og_description_zh,
  og_image_url,
  og_type,
  twitter_card,
  canonical_url,
  priority,
  change_frequency,
  structured_data
) VALUES (
  'home',
  '東勝会社 - 太陽光発電パネルの点検・清掃・保守',
  '兵庫県芦屋市を拠点に、太陽光発電パネルの点検・清掃・保守をトータルサポート。プロフェッショナルな技術で太陽光発電システムの最適な運用をサポートします。',
  ARRAY['太陽光発電', 'パネル清掃', 'パネル点検', 'メンテナンス', '兵庫県', '芦屋市', '東勝会社'],
  '东胜公司 - 太阳能发电板检查·清洁·维护',
  '以兵库县芦屋市为据点，全面支持太阳能发电板的检查、清洁、维护。以专业技术支持太阳能发电系统的最佳运行。',
  ARRAY['太阳能发电', '面板清洁', '面板检查', '维护', '兵库县', '芦屋市', '东胜公司'],
  '東勝会社 - 太陽光発電パネルのプロフェッショナル',
  '东胜公司 - 太阳能发电板专业服务',
  '兵庫県芦屋市の太陽光発電パネル専門会社。点検・清掃・保守のトータルサポートで、発電効率を最大化します。',
  '兵库县芦屋市的太阳能发电板专业公司。通过检查、清洁、维护的全面支持，使发电效率最大化。',
  'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&h=630',
  'website',
  'summary_large_image',
  'https://tokatsu-solar.com/',
  1.0,
  'weekly',
  '{
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "東勝会社",
    "image": "https://images.unsplash.com/photo-1509391366360-2e959784a276",
    "description": "太陽光発電パネルの点検・清掃・保守をトータルサポート",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "涼風町26番14号1F",
      "addressLocality": "芦屋市",
      "addressRegion": "兵庫県",
      "postalCode": "659-0036",
      "addressCountry": "JP"
    },
    "telephone": "+81-90-7401-8083",
    "email": "guochao3000@gmail.com",
    "priceRange": "$$",
    "openingHours": "Mo-Fr 09:00-18:00"
  }'::jsonb
) ON CONFLICT (page_key) DO NOTHING;

-- サービスページのSEO設定
INSERT INTO seo_settings (
  page_key,
  title_ja,
  description_ja,
  keywords_ja,
  title_zh,
  description_zh,
  keywords_zh,
  og_title_ja,
  og_title_zh,
  og_description_ja,
  og_description_zh,
  og_type,
  priority,
  change_frequency
) VALUES (
  'services',
  'サービス案内 - 東勝会社',
  '太陽光パネルの定期点検、専門清掃、予防保守、緊急対応まで、幅広いサービスを提供しています。',
  ARRAY['太陽光パネル清掃', 'パネル点検サービス', '保守メンテナンス', '緊急対応'],
  '服务介绍 - 东胜公司',
  '提供太阳能面板的定期检查、专业清洁、预防维护、紧急应对等广泛服务。',
  ARRAY['太阳能面板清洁', '面板检查服务', '维护保养', '紧急应对'],
  'サービス案内 | 東勝会社',
  '服务介绍 | 东胜公司',
  'プロフェッショナルな太陽光発電パネルのメンテナンスサービスをご提供します。',
  '提供专业的太阳能发电板维护服务。',
  'website',
  0.9,
  'monthly'
) ON CONFLICT (page_key) DO NOTHING;

-- ブログページのSEO設定
INSERT INTO seo_settings (
  page_key,
  title_ja,
  description_ja,
  keywords_ja,
  title_zh,
  description_zh,
  keywords_zh,
  og_title_ja,
  og_title_zh,
  og_description_ja,
  og_description_zh,
  og_type,
  priority,
  change_frequency
) VALUES (
  'blog',
  'ニュース・施工事例 - 東勝会社',
  '太陽光発電パネルに関する最新ニュースや施工事例をご紹介します。',
  ARRAY['太陽光発電ニュース', '施工事例', 'パネル清掃事例', 'メンテナンス事例'],
  '新闻·施工案例 - 东胜公司',
  '介绍有关太阳能发电板的最新新闻和施工案例。',
  ARRAY['太阳能发电新闻', '施工案例', '面板清洁案例', '维护案例'],
  'ニュース・施工事例 | 東勝会社',
  '新闻·施工案例 | 东胜公司',
  '太陽光発電パネルの最新情報と施工実績をチェック。',
  '查看太阳能发电板的最新信息和施工实绩。',
  'website',
  0.8,
  'weekly'
) ON CONFLICT (page_key) DO NOTHING;

-- お問い合わせページのSEO設定
INSERT INTO seo_settings (
  page_key,
  title_ja,
  description_ja,
  keywords_ja,
  title_zh,
  description_zh,
  keywords_zh,
  og_title_ja,
  og_title_zh,
  og_description_ja,
  og_description_zh,
  og_type,
  priority,
  change_frequency
) VALUES (
  'contact',
  'お問い合わせ - 東勝会社',
  '太陽光発電パネルのメンテナンスに関するお問い合わせはこちら。無料見積もり受付中。',
  ARRAY['お問い合わせ', '無料見積もり', '太陽光パネルメンテナンス相談'],
  '联系我们 - 东胜公司',
  '有关太阳能发电板维护的咨询请联系这里。正在接受免费估价。',
  ARRAY['联系我们', '免费估价', '太阳能面板维护咨询'],
  'お問い合わせ | 東勝会社',
  '联系我们 | 东胜公司',
  '太陽光発電パネルのことなら、お気軽にご相談ください。',
  '有关太阳能发电板的事情，请随时咨询。',
  'website',
  0.7,
  'yearly'
) ON CONFLICT (page_key) DO NOTHING;


-- ------------------------------------------------
-- 5. 管理ユーザーの設定
-- ------------------------------------------------

-- 既存の管理ユーザーの確認と追加（重複回避）
INSERT INTO admin_users (username, password_hash, display_name, is_active)
VALUES (
  'admin',
  crypt('admin123', gen_salt('bf')),
  '管理者',
  TRUE
)
ON CONFLICT (username) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  is_active = EXCLUDED.is_active;

INSERT INTO admin_users (username, password_hash, display_name, is_active)
VALUES (
  'ganki.rin@gmail.com',
  crypt('admin123', gen_salt('bf')),
  'Ganki Rin',
  TRUE
)
ON CONFLICT (username) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  is_active = EXCLUDED.is_active;


-- ------------------------------------------------
-- 6. 完了メッセージ
-- ------------------------------------------------

DO $$
BEGIN
  RAISE NOTICE '✅ SEO設定と論理削除機能の追加が完了しました！';
  RAISE NOTICE '📋 SEO設定テーブル (seo_settings) を作成しました';
  RAISE NOTICE '🗑️ 論理削除関数を改善しました（汎用関数を追加）';
  RAISE NOTICE '🔐 RLSポリシーを再設定しました';
  RAISE NOTICE '📊 サンプルSEO設定データを投入しました（home, services, blog, contact）';
  RAISE NOTICE '👤 管理ユーザーを設定しました（admin / admin123, ganki.rin@gmail.com / admin123）';
  RAISE NOTICE '⚠️ 本番環境では必ずパスワードを変更してください！';
END $$;
