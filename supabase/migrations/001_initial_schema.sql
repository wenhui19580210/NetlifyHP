-- ================================================
-- 東勝会社 CMSウェブサイト - データベーススキーマ
-- ================================================
-- Version: 1.2.0
-- Created: 2025-10-27
-- Description: 太陽光発電パネルメンテナンス会社のCMSシステム
-- ================================================

-- UUIDエクステンションの有効化
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================
-- 1. 会社情報テーブル (company_info)
-- ================================================
-- 単一レコードテーブル（会社基本情報を管理）

CREATE TABLE company_info (
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
  main_color text DEFAULT '#f59e0b',
  sub_color text DEFAULT '#0ea5e9',
  
  -- 代表メッセージ
  ceo_message_ja text,
  ceo_message_zh text,
  
  -- システムフィールド
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

COMMENT ON TABLE company_info IS '会社基本情報（1レコードのみ）';

-- 更新日時の自動更新トリガー
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_company_info_updated_at
  BEFORE UPDATE ON company_info
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- 2. 会社情報表示制御テーブル (company_info_visibility)
-- ================================================
-- 会社概要ページでの各フィールド表示/非表示を制御

CREATE TABLE company_info_visibility (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  field_name text UNIQUE NOT NULL,
  is_visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

COMMENT ON TABLE company_info_visibility IS '会社情報フィールドの表示制御';

CREATE TRIGGER update_company_info_visibility_updated_at
  BEFORE UPDATE ON company_info_visibility
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- 3. サービステーブル (services)
-- ================================================
-- 提供するサービス一覧を管理

CREATE TABLE services (
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

COMMENT ON TABLE services IS 'サービス一覧（論理削除対応）';

CREATE INDEX idx_services_order ON services(order_index);
CREATE INDEX idx_services_visible ON services(is_visible, deleted_at);

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- 4. ブログ記事テーブル (blog_posts)
-- ================================================
-- ニュース・施工事例などの記事を管理

CREATE TABLE blog_posts (
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

COMMENT ON TABLE blog_posts IS 'ブログ記事・ニュース（論理削除対応）';

CREATE INDEX idx_blog_posts_publish_date ON blog_posts(publish_date DESC);
CREATE INDEX idx_blog_posts_visible ON blog_posts(is_visible, deleted_at);

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- 5. FAQテーブル (faqs)
-- ================================================
-- よくある質問と回答を管理

CREATE TABLE faqs (
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

COMMENT ON TABLE faqs IS 'よくある質問（論理削除対応）';

CREATE INDEX idx_faqs_order ON faqs(order_index);
CREATE INDEX idx_faqs_visible ON faqs(is_visible, deleted_at);

CREATE TRIGGER update_faqs_updated_at
  BEFORE UPDATE ON faqs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- Row Level Security (RLS) ポリシー設定
-- ================================================

-- RLS有効化
ALTER TABLE company_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_info_visibility ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

-- ================================================
-- 公開ポリシー（全ユーザーが閲覧可能）
-- ================================================

-- 会社情報: 全ユーザー閲覧可能
CREATE POLICY "会社情報は誰でも閲覧可能"
  ON company_info FOR SELECT
  USING (true);

CREATE POLICY "会社情報表示設定は誰でも閲覧可能"
  ON company_info_visibility FOR SELECT
  USING (true);

-- サービス: 表示可能かつ削除されていないもののみ
CREATE POLICY "公開サービスは誰でも閲覧可能"
  ON services FOR SELECT
  USING (is_visible = true AND deleted_at IS NULL);

-- ブログ: 表示可能かつ削除されていないもののみ
CREATE POLICY "公開ブログ記事は誰でも閲覧可能"
  ON blog_posts FOR SELECT
  USING (is_visible = true AND deleted_at IS NULL);

-- FAQ: 表示可能かつ削除されていないもののみ
CREATE POLICY "公開FAQは誰でも閲覧可能"
  ON faqs FOR SELECT
  USING (is_visible = true AND deleted_at IS NULL);

-- ================================================
-- 管理者ポリシー（認証ユーザーのみ編集可能）
-- ================================================

-- 会社情報: 認証ユーザーは全操作可能
CREATE POLICY "認証ユーザーは会社情報を編集可能"
  ON company_info FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "認証ユーザーは会社情報表示設定を編集可能"
  ON company_info_visibility FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- サービス: 認証ユーザーは全データ閲覧・編集可能（削除済み含む）
CREATE POLICY "認証ユーザーは全サービスを閲覧可能"
  ON services FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "認証ユーザーはサービスを追加可能"
  ON services FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "認証ユーザーはサービスを更新可能"
  ON services FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "認証ユーザーはサービスを削除可能"
  ON services FOR DELETE
  USING (auth.role() = 'authenticated');

-- ブログ: 認証ユーザーは全データ閲覧・編集可能（削除済み含む）
CREATE POLICY "認証ユーザーは全ブログ記事を閲覧可能"
  ON blog_posts FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "認証ユーザーはブログ記事を追加可能"
  ON blog_posts FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "認証ユーザーはブログ記事を更新可能"
  ON blog_posts FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "認証ユーザーはブログ記事を削除可能"
  ON blog_posts FOR DELETE
  USING (auth.role() = 'authenticated');

-- FAQ: 認証ユーザーは全データ閲覧・編集可能（削除済み含む）
CREATE POLICY "認証ユーザーは全FAQを閲覧可能"
  ON faqs FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "認証ユーザーはFAQを追加可能"
  ON faqs FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "認証ユーザーはFAQを更新可能"
  ON faqs FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "認証ユーザーはFAQを削除可能"
  ON faqs FOR DELETE
  USING (auth.role() = 'authenticated');

-- ================================================
-- 完了メッセージ
-- ================================================

DO $$
BEGIN
  RAISE NOTICE '✅ データベーススキーマの作成が完了しました！';
  RAISE NOTICE '📋 次のステップ: seed.sql でサンプルデータを投入してください。';
END $$;
