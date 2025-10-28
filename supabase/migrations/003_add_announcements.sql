-- ================================================
-- 東勝会社 CMS - 緊急告知機能追加
-- ================================================
-- Version: 1.5.0
-- Created: 2025-10-28
-- Description: 会社からの緊急告知を管理するテーブル
-- ================================================

-- ================================================
-- 緊急告知テーブル (announcements)
-- ================================================
-- 会社からの重要なお知らせや緊急情報を表示

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
  priority int DEFAULT 0, -- 優先度（高いほど上に表示）
  
  -- スタイル設定
  background_color text DEFAULT '#fef3c7', -- 背景色（デフォルト: 薄い黄色）
  text_color text DEFAULT '#92400e', -- テキスト色（デフォルト: 茶色）
  
  -- 論理削除
  deleted_at timestamptz,
  
  -- システムフィールド
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

COMMENT ON TABLE announcements IS '会社からの緊急告知（論理削除対応）';

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_announcements_visible ON announcements(is_visible, deleted_at);
CREATE INDEX IF NOT EXISTS idx_announcements_priority ON announcements(priority DESC);
CREATE INDEX IF NOT EXISTS idx_announcements_dates ON announcements(start_date, end_date);

-- 更新日時の自動更新トリガー
CREATE TRIGGER update_announcements_updated_at
  BEFORE UPDATE ON announcements
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- RLS (Row Level Security) ポリシー設定
-- ================================================

-- RLS有効化
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- 公開ポリシー: 表示可能、削除されていない、期間内の告知のみ
CREATE POLICY "公開告知は誰でも閲覧可能"
  ON announcements FOR SELECT
  USING (
    is_visible = true 
    AND deleted_at IS NULL
    AND (start_date IS NULL OR start_date <= now())
    AND (end_date IS NULL OR end_date >= now())
  );

-- 管理者ポリシー: 認証ユーザーは全データ閲覧・編集可能（削除済み含む）
CREATE POLICY "認証ユーザーは全告知を閲覧可能"
  ON announcements FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "認証ユーザーは告知を追加可能"
  ON announcements FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "認証ユーザーは告知を更新可能"
  ON announcements FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "認証ユーザーは告知を削除可能"
  ON announcements FOR DELETE
  USING (auth.role() = 'authenticated');

-- ================================================
-- 完了メッセージ
-- ================================================

DO $$
BEGIN
  RAISE NOTICE '✅ 緊急告知テーブルの作成が完了しました！';
  RAISE NOTICE '📋 管理画面から告知の追加・編集が可能になりました。';
END $$;
