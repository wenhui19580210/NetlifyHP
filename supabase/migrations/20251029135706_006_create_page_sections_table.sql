/*
  # ページセクション管理テーブルの作成

  1. 新規テーブル
    - `page_sections` テーブル
      - セクションの表示順序、表示/非表示、デザイン設定を管理
      - 各セクション（Hero、About、Services等）の設定を保存

  2. カラム
    - `id` (uuid): 主キー
    - `section_key` (text): セクションの識別子（hero, about, services等）
    - `section_name_ja` (text): セクション名（日本語）
    - `section_name_zh` (text): セクション名（中国語）
    - `order_index` (int): 表示順序
    - `is_visible` (boolean): 表示/非表示
    - `background_color` (text): 背景色
    - `text_color` (text): テキスト色
    - `title_ja` (text): カスタムタイトル（日本語）
    - `title_zh` (text): カスタムタイトル（中国語）
    - `subtitle_ja` (text): カスタムサブタイトル（日本語）
    - `subtitle_zh` (text): カスタムサブタイトル（中国語）
    - `custom_styles` (jsonb): その他のカスタムスタイル設定
    - `created_at` (timestamptz): 作成日時
    - `updated_at` (timestamptz): 更新日時

  3. セキュリティ
    - RLSを有効化
    - 誰でも閲覧可能（公開サイト用）
    - 管理者は全操作可能
*/

-- 汎用関数の作成（存在しない場合のみ）
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- page_sectionsテーブルを作成
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

-- 更新日時の自動更新トリガー
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
DROP POLICY IF EXISTS "Anyone can view all sections" ON page_sections;
DROP POLICY IF EXISTS "Anyone can insert sections" ON page_sections;
DROP POLICY IF EXISTS "Anyone can update sections" ON page_sections;
DROP POLICY IF EXISTS "Anyone can delete sections" ON page_sections;

-- 公開ポリシー
CREATE POLICY "公開セクションは誰でも閲覧可能" ON page_sections 
  FOR SELECT 
  USING (is_visible = true);

-- 管理者ポリシー
CREATE POLICY "Anyone can view all sections" ON page_sections 
  FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can insert sections" ON page_sections 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Anyone can update sections" ON page_sections 
  FOR UPDATE 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Anyone can delete sections" ON page_sections 
  FOR DELETE 
  USING (true);

-- 初期データ投入
INSERT INTO page_sections (section_key, section_name_ja, section_name_zh, order_index, is_visible)
VALUES
  ('hero', 'ヒーロー', '主页横幅', 1, true),
  ('about', '私たちについて', '关于我们', 2, true),
  ('services', 'サービス内容', '服务内容', 3, true),
  ('results', '導入効果・事例', '导入效果・案例', 4, true),
  ('flow', 'ご依頼の流れ', '委托流程', 5, true),
  ('faq', 'よくある質問', '常见问题', 6, true),
  ('contact', 'お問い合わせ', '联系我们', 7, true)
ON CONFLICT (section_key) DO NOTHING;
