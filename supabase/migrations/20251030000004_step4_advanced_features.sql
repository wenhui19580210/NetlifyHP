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

  -- サイトマップ設定
  priority numeric(2,1) DEFAULT 0.5,
  change_frequency text DEFAULT 'monthly',
  is_active boolean DEFAULT true,

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

INSERT INTO seo_settings (
  page_key,
  title_ja, title_zh,
  description_ja, description_zh,
  keywords_ja, keywords_zh,
  og_title_ja, og_title_zh,
  og_description_ja, og_description_zh,
  og_type, twitter_card,
  canonical_url,
  robots_index, robots_follow,
  priority, change_frequency,
  is_active
)
VALUES
    (
        'home',
        '東勝 - 太陽光発電メンテナンスサービス',
        '东胜 - 太阳能发电维护服务',
        '太陽光発電所の点検・清掃・保守サービスを提供しています。ドローンを活用した高精度な点検と、専門技術による丁寧な清掃で、発電効率を最大限に引き出します。',
        '提供太阳能电站检查、清洁、维护服务。利用无人机进行高精度检查，通过专业技术进行细致清洁，最大限度地提高发电效率。',
        ARRAY['太陽光発電', 'パネル清掃', 'メンテナンス', 'ドローン点検', '関西'],
        ARRAY['太阳能发电', '面板清洁', '维护', '无人机检查', '关西'],
        '東勝 - 太陽光発電メンテナンスの専門家',
        '东胜 - 太阳能发电维护专家',
        '太陽光発電所の点検・清掃・保守サービス。ドローン点検と専門技術で発電効率を最大化します。',
        '太阳能电站检查、清洁、维护服务。利用无人机检查和专业技术最大化发电效率。',
        'website',
        'summary_large_image',
        '',
        true, true,
        1.0, 'daily',
        true
    ),
    (
        'about',
        '会社概要 - 東勝',
        '公司简介 - 东胜',
        '東勝の会社情報、代表挨拶、事業内容をご紹介します。太陽光発電メンテナンスのプロフェッショナルとして、お客様の発電所をサポートします。',
        '介绍东胜的公司信息、社长致辞、业务内容。作为太阳能发电维护专家，为客户的电站提供支持。',
        ARRAY['会社概要', '企業情報', '太陽光発電', 'メンテナンス会社'],
        ARRAY['公司简介', '企业信息', '太阳能发电', '维护公司'],
        '会社概要 - 東勝',
        '公司简介 - 东胜',
        '太陽光発電メンテナンスのプロフェッショナル企業、東勝の会社情報',
        '太阳能发电维护专业企业东胜的公司信息',
        'website',
        'summary_large_image',
        '',
        true, true,
        0.8, 'monthly',
        true
    ),
    (
        'services',
        'サービス一覧 - 東勝',
        '服务一览 - 东胜',
        'パネル点検、清掃、保守管理など、太陽光発電所のメンテナンスサービスを包括的に提供しています。',
        '提供面板检查、清洁、维护管理等太阳能电站的综合维护服务。',
        ARRAY['サービス', 'パネル点検', 'パネル清掃', '保守管理', 'ドローン'],
        ARRAY['服务', '面板检查', '面板清洁', '维护管理', '无人机'],
        'サービス一覧 - 東勝の太陽光メンテナンス',
        '服务一览 - 东胜的太阳能维护',
        '太陽光発電所の点検・清掃・保守管理サービスのご案内',
        '太阳能电站检查、清洁、维护管理服务介绍',
        'website',
        'summary_large_image',
        '',
        true, true,
        0.9, 'weekly',
        true
    ),
    (
        'blog',
        'ニュース・施工事例 | 東勝会社',
        '新闻·施工案例 | 东胜公司',
        '最新のニュースや施工事例をご紹介します。',
        '介绍最新新闻和施工案例。',
        ARRAY['ニュース', '施工事例', 'ブログ'],
        ARRAY['新闻', '施工案例', '博客'],
        'ニュース・施工事例 - 東勝',
        '新闻·施工案例 - 东胜',
        '最新のニュースと施工事例をご覧いただけます',
        '可以查看最新新闻和施工案例',
        'website',
        'summary_large_image',
        '',
        true, true,
        0.7, 'weekly',
        true
    ),
    (
        'contact',
        'お問い合わせ - 東勝',
        '联系我们 - 东胜',
        '太陽光発電メンテナンスに関するご相談、お見積もり依頼はこちらからお気軽にお問い合わせください。',
        '关于太阳能发电维护的咨询、报价请求，请随时通过此处联系我们。',
        ARRAY['お問い合わせ', '見積もり', '相談', '連絡先'],
        ARRAY['联系我们', '报价', '咨询', '联系方式'],
        'お問い合わせ - 東勝',
        '联系我们 - 东胜',
        'お見積もり・ご相談は無料。お気軽にお問い合わせください。',
        '报价、咨询免费。请随时联系我们。',
        'website',
        'summary_large_image',
        '',
        true, true,
        0.7, 'monthly',
        true
    )
ON CONFLICT (page_key) DO UPDATE SET
  title_ja = EXCLUDED.title_ja,
  title_zh = EXCLUDED.title_zh,
  description_ja = EXCLUDED.description_ja,
  description_zh = EXCLUDED.description_zh,
  keywords_ja = EXCLUDED.keywords_ja,
  keywords_zh = EXCLUDED.keywords_zh,
  og_title_ja = EXCLUDED.og_title_ja,
  og_title_zh = EXCLUDED.og_title_zh,
  og_description_ja = EXCLUDED.og_description_ja,
  og_description_zh = EXCLUDED.og_description_zh,
  updated_at = now();


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
