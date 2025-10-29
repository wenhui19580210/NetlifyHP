-- ================================================
-- 東勝会社 CMSウェブサイト - SEO設定と論理削除改善
-- ================================================
-- 目的:
-- 1. SEO設定テーブルの追加
-- 2. 論理削除機能の改善
-- 3. RLSポリシーの再設定
-- 4. サンプルデータの投入
-- ================================================


-- ------------------------------------------------
-- 1. テーブルの骨組み - SEO設定テーブル
-- ------------------------------------------------

-- 1.1 SEO設定テーブル (seo_settings)
CREATE TABLE IF NOT EXISTS seo_settings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- ページ識別子(home, about, services, contact など)
  page_key text UNIQUE NOT NULL,

  -- 基本SEO設定(日本語)
  title_ja text,
  description_ja text,
  keywords_ja text[], -- キーワードの配列

  -- 基本SEO設定(中国語)
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

  -- 構造化データ(JSON-LD)
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

COMMENT ON TABLE seo_settings IS 'ページ別SEO設定(メタタグ、OGP、構造化データ)';
COMMENT ON COLUMN seo_settings.page_key IS 'ページ識別キー(例: home, about, services, contact, blog)';


-- ------------------------------------------------
-- 2. RLSポリシーの設定
-- ------------------------------------------------

-- SEO設定テーブルのRLS有効化
ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;

-- 既存のポリシーを削除(重複防止)
DROP POLICY IF EXISTS "SEO設定は誰でも閲覧可能" ON seo_settings;
DROP POLICY IF EXISTS "誰でもSEO設定を管理可能" ON seo_settings;
DROP POLICY IF EXISTS "Authenticated users can manage seo settings" ON seo_settings;

-- 公開ポリシー(フロントエンド表示用)
CREATE POLICY "SEO設定は誰でも閲覧可能" 
  ON seo_settings 
  FOR SELECT 
  USING (is_active = true);

-- 管理者ポリシー(認証済みユーザーのみ)
CREATE POLICY "Authenticated users can manage seo settings" 
  ON seo_settings 
  FOR ALL 
  TO authenticated
  USING (true) 
  WITH CHECK (true);


-- ------------------------------------------------
-- 3. トリガー設定
-- ------------------------------------------------

-- SEO設定の更新日時を自動更新
DROP TRIGGER IF EXISTS update_seo_settings_updated_at ON seo_settings;
CREATE TRIGGER update_seo_settings_updated_at
  BEFORE UPDATE ON seo_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();


-- ------------------------------------------------
-- 4. インデックス作成
-- ------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_seo_settings_page_key ON seo_settings(page_key);
CREATE INDEX IF NOT EXISTS idx_seo_settings_active ON seo_settings(is_active);


-- ------------------------------------------------
-- 5. サンプルデータの投入
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