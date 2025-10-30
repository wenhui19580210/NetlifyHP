-- ================================================
-- 東勝会社 CMSウェブサイト - Step 5: ヒーローアイコン設定追加
-- ================================================
-- このマイグレーションファイルは:
-- 1. company_infoテーブルにヒーローアイコン関連フィールドを追加
-- ================================================

-- ヒーローセクションのアイコン設定フィールドを追加
ALTER TABLE company_info
ADD COLUMN IF NOT EXISTS hero_icon_url text,
ADD COLUMN IF NOT EXISTS hero_icon_visible boolean DEFAULT true;

-- コメント追加
COMMENT ON COLUMN company_info.hero_icon_url IS 'ヒーローセクションのアイコン画像URL（未設定の場合はファビコンを使用）';
COMMENT ON COLUMN company_info.hero_icon_visible IS 'ヒーローセクションのアイコン表示ON/OFF';

-- 既存レコードにデフォルト値を設定（もし存在する場合）
UPDATE company_info
SET hero_icon_visible = true
WHERE hero_icon_visible IS NULL;
