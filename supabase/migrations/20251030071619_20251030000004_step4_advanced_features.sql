-- ================================================
-- 東勝会社 CMSウェブサイト - Step 4: 高度な機能
-- ================================================
-- このマイグレーションファイルは:
-- 1. SEO設定テーブルの作成
-- 2. ページセクション管理テーブルの作成
-- 3. 画像ストレージバケットの作成
-- 4. 各機能のRLSポリシー設定
-- を含みます。
-- ================================================

-- ------------------------------------------------
-- 1. SEO設定テーブル (seo_settings)
-- ------------------------------------------------

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

  -- robots設定
  robots_index boolean DEFAULT true, -- index/noindex
  robots_follow boolean DEFAULT true, -- follow/nofollow
  
  -- 有効化フラグ
  is_active boolean DEFAULT true,
  
  -- サイトマップ設定
  priority numeric(2,1) DEFAULT 0.5,
  change_frequency text DEFAULT 'weekly',

  -- システムフィールド
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
COMMENT ON TABLE seo_settings IS 'ページ別SEO設定（メタタグ、OGP、構造化データ）';

-- seo_settingsの更新日時を自動更新
DROP TRIGGER IF EXISTS update_seo_settings_updated_at ON seo_settings;
CREATE TRIGGER update_seo_settings_updated_at
  BEFORE UPDATE ON seo_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_seo_settings_page_key ON seo_settings(page_key);

-- RLS有効化
ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;

-- 既存のポリシーを削除
DROP POLICY IF EXISTS "SEO設定は誰でも閲覧可能" ON seo_settings;
DROP POLICY IF EXISTS "認証ユーザーはSEO設定を管理可能" ON seo_settings;

-- 公開ポリシー
CREATE POLICY "SEO設定は誰でも閲覧可能" 
  ON seo_settings 
  FOR SELECT 
  USING (true);

-- 認証ユーザーは全操作可能
CREATE POLICY "認証ユーザーはSEO設定を管理可能" 
  ON seo_settings 
  FOR ALL 
  TO authenticated
  USING (true) 
  WITH CHECK (true);


-- ------------------------------------------------
-- 2. ページセクション管理テーブル (page_sections)
-- ------------------------------------------------

CREATE TABLE IF NOT EXISTS page_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- セクション識別情報
  section_key text UNIQUE NOT NULL,
  section_name_ja text NOT NULL,
  section_name_zh text,
  
  -- 表示制御
  order_index int DEFAULT 0,
  is_visible boolean DEFAULT true,
  
  -- デザイン設定
  background_color text,
  text_color text,
  
  -- カスタムタイトル
  title_ja text,
  title_zh text,
  subtitle_ja text,
  subtitle_zh text,
  
  -- その他のカスタムスタイル（JSON形式）
  custom_styles jsonb DEFAULT '{}'::jsonb,
  
  -- システムフィールド
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
COMMENT ON TABLE page_sections IS 'ページセクションの順序とデザイン設定';

-- page_sectionsの更新日時を自動更新
DROP TRIGGER IF EXISTS update_page_sections_updated_at ON page_sections;
CREATE TRIGGER update_page_sections_updated_at
  BEFORE UPDATE ON page_sections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_page_sections_order ON page_sections(order_index);
CREATE INDEX IF NOT EXISTS idx_page_sections_visible ON page_sections(is_visible);
CREATE INDEX IF NOT EXISTS idx_page_sections_key ON page_sections(section_key);

-- RLS有効化
ALTER TABLE page_sections ENABLE ROW LEVEL SECURITY;

-- 既存のポリシーを削除
DROP POLICY IF EXISTS "公開セクションは誰でも閲覧可能" ON page_sections;
DROP POLICY IF EXISTS "認証ユーザーはセクションを管理可能" ON page_sections;

-- 公開ポリシー
CREATE POLICY "公開セクションは誰でも閲覧可能" 
  ON page_sections 
  FOR SELECT 
  USING (is_visible = true);

-- 認証ユーザーは全操作可能
CREATE POLICY "認証ユーザーはセクションを管理可能" 
  ON page_sections 
  FOR ALL 
  TO authenticated
  USING (true) 
  WITH CHECK (true);


-- ------------------------------------------------
-- 3. 画像ストレージバケット (company-images)
-- ------------------------------------------------

-- ストレージバケットを作成（既存の場合はスキップ）
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'company-images',
  'company-images',
  true,
  2097152, -- 2MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/x-icon', 'image/vnd.microsoft.icon']
)
ON CONFLICT (id) DO NOTHING;

-- 既存のポリシーを削除してから作成
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Authenticated users can upload company images" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can update company images" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can delete company images" ON storage.objects;
  DROP POLICY IF EXISTS "Public can view company images" ON storage.objects;
END $$;

-- RLSポリシー: 認証済みユーザーはアップロード可能
CREATE POLICY "Authenticated users can upload company images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'company-images');

-- RLSポリシー: 認証済みユーザーは更新可能
CREATE POLICY "Authenticated users can update company images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'company-images')
  WITH CHECK (bucket_id = 'company-images');

-- RLSポリシー: 認証済みユーザーは削除可能
CREATE POLICY "Authenticated users can delete company images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'company-images');

-- RLSポリシー: 全ユーザーが画像を閲覧可能（パブリック）
CREATE POLICY "Public can view company images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'company-images');


-- ------------------------------------------------
-- 4. SEO設定の初期データ
-- ------------------------------------------------

INSERT INTO seo_settings (page_key, title_ja, title_zh, description_ja, description_zh, keywords_ja, keywords_zh)
VALUES
    (
        'home',
        '東勝会社 | 太陽光発電パネルの点検・清掃・保守サービス',
        '东胜公司 | 太阳能发电板检查、清洁、维护服务',
        '兵庫県芦屋市を拠点に、太陽光発電パネルの専門的な点検・清掃・保守サービスを提供しています。',
        '以兵库县芦屋市为基地，提供太阳能发电板的专业检查、清洁、维护服务。',
        ARRAY['太陽光パネル', '点検', '清掃', '保守', '兵庫県', '芦屋市'],
        ARRAY['太阳能板', '检查', '清洁', '维护', '兵库县', '芦屋市']
    ),
    (
        'services',
        'サービス一覧 | 東勝会社',
        '服务列表 | 东胜公司',
        'ドローン点検、パネル清掃、発電所保守など、太陽光発電に関する各種サービスをご提供いたします。',
        '提供无人机检查、面板清洁、电站维护等各种太阳能发电相关服务。',
        ARRAY['サービス', 'ドローン点検', 'パネル清掃', '発電所保守'],
        ARRAY['服务', '无人机检查', '面板清洁', '电站维护']
    ),
    (
        'blog',
        'ニュース・施工事例 | 東勝会社',
        '新闻·施工案例 | 东胜公司',
        '最新のニュースや施工事例をご紹介します。',
        '介绍最新新闻和施工案例。',
        ARRAY['ニュース', '施工事例', 'ブログ'],
        ARRAY['新闻', '施工案例', '博客']
    ),
    (
        'contact',
        'お問い合わせ | 東勝会社',
        '联系我们 | 东胜公司',
        '太陽光発電パネルの点検・清掃に関するお問い合わせはこちらから。',
        '关于太阳能发电板检查和清洁的咨询请从这里联系。',
        ARRAY['お問い合わせ', '連絡先', '見積もり'],
        ARRAY['联系', '联系方式', '报价']
    )
ON CONFLICT (page_key) DO NOTHING;


-- ------------------------------------------------
-- 5. ページセクションの初期データ
-- ------------------------------------------------

INSERT INTO page_sections (section_key, section_name_ja, section_name_zh, order_index, is_visible)
VALUES
    ('hero', 'ヒーローセクション', '首页横幅', 10, TRUE),
    ('about', '会社概要', '公司简介', 20, TRUE),
    ('services', 'サービス', '服务', 30, TRUE),
    ('results', '施工実績', '施工实绩', 40, TRUE),
    ('flow', 'サービスの流れ', '服务流程', 50, TRUE),
    ('faq', 'よくある質問', '常见问题', 60, TRUE),
    ('contact', 'お問い合わせ', '联系我们', 70, TRUE)
ON CONFLICT (section_key) DO NOTHING;


-- ------------------------------------------------
-- 6. 完了メッセージ
-- ------------------------------------------------

DO $$
BEGIN
  RAISE NOTICE '✅ Step 4: 高度な機能の作成が完了しました！';
  RAISE NOTICE '🎨 SEO設定テーブル: seo_settings (4ページ分の初期データ)';
  RAISE NOTICE '📐 ページセクション管理: page_sections (7セクション分の初期データ)';
  RAISE NOTICE '🖼️  画像ストレージバケット: company-images (最大2MB)';
  RAISE NOTICE '';
  RAISE NOTICE '🎉 全てのマイグレーションが完了しました！';
  RAISE NOTICE '';
  RAISE NOTICE '次のステップ:';
  RAISE NOTICE '1. Supabase Dashboard → Authentication → Users でユーザーを作成';
  RAISE NOTICE '2. 作成したメールアドレスとパスワードでログイン';
  RAISE NOTICE '3. 管理画面 (/admin) でコンテンツを編集';
  RAISE NOTICE '';
  RAISE NOTICE '詳細は LOGIN_SETUP.md と MIGRATION_EXECUTION_GUIDE.md を参照してください。';
END $$;
