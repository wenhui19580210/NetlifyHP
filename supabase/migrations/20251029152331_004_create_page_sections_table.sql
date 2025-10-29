/*
  # ページセクション管理テーブルの作成

  1. 新規テーブル
    - `page_sections` テーブル
      - セクションの表示順序、表示/非表示、デザイン設定を管理
      - 各セクション(Hero、About、Services等)の設定を保存

  2. セキュリティ
    - RLSを有効化
    - 誰でも閲覧可能(公開サイト用)
    - 認証済みユーザーは全操作可能
*/

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
  
  -- その他のカスタムスタイル(JSON形式)
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
DROP POLICY IF EXISTS "Authenticated users can view all sections" ON page_sections;
DROP POLICY IF EXISTS "Authenticated users can insert sections" ON page_sections;
DROP POLICY IF EXISTS "Authenticated users can update sections" ON page_sections;
DROP POLICY IF EXISTS "Authenticated users can delete sections" ON page_sections;

-- 公開ポリシー
CREATE POLICY "公開セクションは誰でも閲覧可能" ON page_sections 
  FOR SELECT 
  USING (is_visible = true);

-- 認証済みユーザーポリシー
CREATE POLICY "Authenticated users can view all sections" ON page_sections 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert sections" ON page_sections 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update sections" ON page_sections 
  FOR UPDATE 
  TO authenticated
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete sections" ON page_sections 
  FOR DELETE 
  TO authenticated
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