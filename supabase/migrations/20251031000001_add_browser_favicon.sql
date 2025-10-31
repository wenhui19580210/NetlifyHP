/*
  # ブラウザタブ専用ファビコンフィールドの追加

  1. 変更内容
    - `company_info`テーブルに`browser_favicon_url`カラムを追加
    - ブラウザタブ表示用の専用ファビコンURL

  2. 目的
    - `favicon_url`: フッターアイコン専用
    - `browser_favicon_url`: ブラウザタブのファビコン専用
    - `hero_icon_url`: トップページのヒーローセクションアイコン専用

  3. 既存データの移行
    - 既存の`favicon_url`の値を`browser_favicon_url`にコピー（後方互換性のため）
*/

-- browser_favicon_urlカラムを追加
ALTER TABLE company_info
ADD COLUMN IF NOT EXISTS browser_favicon_url TEXT;

-- 既存データの移行: favicon_urlの値をbrowser_favicon_urlにコピー
UPDATE company_info
SET browser_favicon_url = favicon_url
WHERE browser_favicon_url IS NULL AND favicon_url IS NOT NULL;

-- コメントを追加して用途を明確化
COMMENT ON COLUMN company_info.browser_favicon_url IS 'ブラウザタブに表示されるファビコンのURL';
COMMENT ON COLUMN company_info.favicon_url IS 'フッターに表示されるアイコンのURL';
COMMENT ON COLUMN company_info.hero_icon_url IS 'トップページのヒーローセクションに表示されるアイコンのURL';
