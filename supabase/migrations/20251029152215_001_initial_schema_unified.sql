-- ================================================
-- 東勝会社 CMSウェブサイト - 統合データベーススキーマ
-- ================================================
-- 統合元:
-- - supabase/migrations/001_initial_schema.sql (ベース)
-- - supabase/migrations/002_sampleData.sql (初期データの定義を抽出)
-- - supabase/migrations/003_add_adminUser.sql (管理者追加を統合)
-- - supabase/init_admin.sql (ビュー、論理削除関数を抽出)
-- ================================================


-- ------------------------------------------------
-- 1. エクステンションの有効化
-- ------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- ------------------------------------------------
-- 2. 汎用関数
-- ------------------------------------------------

-- 更新日時の自動更新トリガー関数(全テーブルで共通利用)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ------------------------------------------------
-- 3. テーブル定義
-- ------------------------------------------------

-- 3.1 会社情報テーブル (company_info)
CREATE TABLE IF NOT EXISTS company_info (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- 会社基本情報
  company_name text NOT NULL DEFAULT '東勝会社',
  company_name_en text DEFAULT 'Tokatsu Co., Ltd.',
  company_name_zh text DEFAULT '东胜公司',

  ceo_name text DEFAULT '郭 祥',
  established date DEFAULT '2024-01-01',
  capital text DEFAULT '500万円',
  employees int DEFAULT 0,

  -- 事業内容
  business_content_ja text DEFAULT '太陽光発電パネルの点検・清掃・保守をトータルサポート',
  business_content_zh text DEFAULT '太阳能发电板检查、清洁、维护的全面支持',

  -- 連絡先情報
  phone text DEFAULT '090-7401-8083',
  fax text,
  email text DEFAULT 'guochao3000@gmail.com',

  -- 住所
  address_ja text DEFAULT '〒659-0036 兵庫県芦屋市涼風町26番14号1F',
  address_zh text DEFAULT '〒659-0036 兵库县芦屋市凉风町26番14号1F',
  postal_code text DEFAULT '659-0036',

  -- 地図
  map_embed text,

  -- ブランディング
  logo_url text,
  favicon_url text,
  main_color text DEFAULT '#f59e0b',
  sub_color text DEFAULT '#0ea5e9',

  -- 代表メッセージ
  ceo_message_ja text,
  ceo_message_zh text,

  -- システムフィールド
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
COMMENT ON TABLE company_info IS '会社基本情報(1レコードのみ)';

-- 3.2 会社情報表示制御テーブル (company_info_visibility)
CREATE TABLE IF NOT EXISTS company_info_visibility (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  field_name text UNIQUE NOT NULL,
  is_visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
COMMENT ON TABLE company_info_visibility IS '会社情報フィールドの表示制御';

-- 3.3 サービステーブル (services)
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- サービス情報
  service_name_ja text NOT NULL,
  service_name_zh text,
  description_ja text,
  description_zh text,
  image_url text,
  icon text, -- Lucide Reactのアイコン名

  -- 表示制御
  order_index int DEFAULT 0,
  is_visible boolean DEFAULT true,
  deleted_at timestamptz,

  -- システムフィールド
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
COMMENT ON TABLE services IS 'サービス一覧(論理削除対応)';

-- 3.4 ブログ記事テーブル (blog_posts)
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- 記事情報
  title_ja text NOT NULL,
  title_zh text,
  content_ja text,
  content_zh text,
  image_url text,

  -- 公開設定
  publish_date date DEFAULT CURRENT_DATE,
  is_visible boolean DEFAULT true,
  deleted_at timestamptz,

  -- システムフィールド
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
COMMENT ON TABLE blog_posts IS 'ブログ記事・ニュース(論理削除対応)';

-- 3.5 FAQテーブル (faqs)
CREATE TABLE IF NOT EXISTS faqs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- FAQ情報
  question_ja text NOT NULL,
  question_zh text,
  answer_ja text,
  answer_zh text,

  -- 表示制御
  order_index int DEFAULT 0,
  is_visible boolean DEFAULT true,
  deleted_at timestamptz,

  -- システムフィールド
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
COMMENT ON TABLE faqs IS 'よくある質問(論理削除対応)';

-- 3.6 緊急告知テーブル (announcements)
CREATE TABLE IF NOT EXISTS announcements (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- 告知情報
  title_ja text NOT NULL,
  title_zh text,
  content_ja text NOT NULL,
  content_zh text,

  -- 表示制御
  is_visible boolean DEFAULT false,
  start_date timestamptz,
  end_date timestamptz,
  priority int DEFAULT 0, -- 優先度(高いほど上に表示)

  -- スタイル設定
  background_color text DEFAULT '#fef3c7', -- 背景色(デフォルト: 薄い黄色)
  text_color text DEFAULT '#92400e', -- テキスト色(デフォルト: 茶色)

  -- 論理削除
  deleted_at timestamptz,

  -- システムフィールド
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
COMMENT ON TABLE announcements IS '会社からの緊急告知(論理削除対応)';


-- ------------------------------------------------
-- 4. トリガー設定
-- ------------------------------------------------

-- company_infoの更新日時を自動更新
DROP TRIGGER IF EXISTS update_company_info_updated_at ON company_info;
CREATE TRIGGER update_company_info_updated_at
  BEFORE UPDATE ON company_info
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- company_info_visibilityの更新日時を自動更新
DROP TRIGGER IF EXISTS update_company_info_visibility_updated_at ON company_info_visibility;
CREATE TRIGGER update_company_info_visibility_updated_at
  BEFORE UPDATE ON company_info_visibility
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- servicesの更新日時を自動更新
DROP TRIGGER IF EXISTS update_services_updated_at ON services;
CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- blog_postsの更新日時を自動更新
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- faqsの更新日時を自動更新
DROP TRIGGER IF EXISTS update_faqs_updated_at ON faqs;
CREATE TRIGGER update_faqs_updated_at
  BEFORE UPDATE ON faqs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- announcementsの更新日時を自動更新
DROP TRIGGER IF EXISTS update_announcements_updated_at ON announcements;
CREATE TRIGGER update_announcements_updated_at
  BEFORE UPDATE ON announcements
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();


-- ------------------------------------------------
-- 5. インデックス作成
-- ------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_services_order ON services(order_index);
CREATE INDEX IF NOT EXISTS idx_services_visible ON services(is_visible, deleted_at);

CREATE INDEX IF NOT EXISTS idx_blog_posts_publish_date ON blog_posts(publish_date DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_visible ON blog_posts(is_visible, deleted_at);

CREATE INDEX IF NOT EXISTS idx_faqs_order ON faqs(order_index);
CREATE INDEX IF NOT EXISTS idx_faqs_visible ON faqs(is_visible, deleted_at);

CREATE INDEX IF NOT EXISTS idx_announcements_visible ON announcements(is_visible, deleted_at);
CREATE INDEX IF NOT EXISTS idx_announcements_priority ON announcements(priority DESC);
CREATE INDEX IF NOT EXISTS idx_announcements_dates ON announcements(start_date, end_date);


-- ------------------------------------------------
-- 6. RLS (Row Level Security) 有効化とポリシー設定
-- ------------------------------------------------

-- RLS有効化
ALTER TABLE company_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_info_visibility ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- 既存のポリシーを削除(重複防止とクリーンアップ)
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

-- 公開ポリシー(フロントエンド表示用)
CREATE POLICY "会社情報は誰でも閲覧可能" ON company_info FOR SELECT USING (true);
CREATE POLICY "会社情報表示設定は誰でも閲覧可能" ON company_info_visibility FOR SELECT USING (true);
CREATE POLICY "公開サービスは誰でも閲覧可能" ON services FOR SELECT USING (is_visible = true AND deleted_at IS NULL);
CREATE POLICY "公開ブログ記事は誰でも閲覧可能" ON blog_posts FOR SELECT USING (is_visible = true AND deleted_at IS NULL);
CREATE POLICY "公開FAQは誰でも閲覧可能" ON faqs FOR SELECT USING (is_visible = true AND deleted_at IS NULL);
CREATE POLICY "公開告知は誰でも閲覧可能" ON announcements FOR SELECT USING (is_visible = true AND deleted_at IS NULL AND (start_date IS NULL OR start_date <= now()) AND (end_date IS NULL OR end_date >= now()));

-- 管理者ポリシー(認証済みユーザーのみ)
CREATE POLICY "Authenticated users can manage company info" ON company_info FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can manage company info visibility" ON company_info_visibility FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- サービス
CREATE POLICY "Authenticated users can view all services" ON services FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert services" ON services FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update services" ON services FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete services" ON services FOR DELETE TO authenticated USING (true);

-- ブログ
CREATE POLICY "Authenticated users can view all blog posts" ON blog_posts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert blog posts" ON blog_posts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update blog posts" ON blog_posts FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete blog posts" ON blog_posts FOR DELETE TO authenticated USING (true);

-- FAQ
CREATE POLICY "Authenticated users can view all faqs" ON faqs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert faqs" ON faqs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update faqs" ON faqs FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete faqs" ON faqs FOR DELETE TO authenticated USING (true);

-- 告知
CREATE POLICY "Authenticated users can view all announcements" ON announcements FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert announcements" ON announcements FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update announcements" ON announcements FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete announcements" ON announcements FOR DELETE TO authenticated USING (true);


-- ------------------------------------------------
-- 7. 初期データ投入
-- ------------------------------------------------

-- 会社情報の初期レコード作成 (DEFAULT値を使用)
INSERT INTO company_info (id)
SELECT uuid_generate_v4()
WHERE NOT EXISTS (SELECT 1 FROM company_info);

-- 会社情報表示制御の初期設定
INSERT INTO company_info_visibility (field_name, is_visible)
VALUES
    ('company_name', TRUE),
    ('ceo_name', TRUE),
    ('established', TRUE),
    ('capital', TRUE),
    ('employees', TRUE),
    ('business_content', TRUE),
    ('phone', TRUE),
    ('email', TRUE),
    ('address', TRUE),
    ('map_embed', FALSE),
    ('ceo_message', TRUE),
    ('fax', FALSE)
ON CONFLICT (field_name) DO UPDATE SET is_visible = EXCLUDED.is_visible;