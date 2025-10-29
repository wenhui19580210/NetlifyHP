/*
  # 画像ストレージバケット作成

  1. 新しいストレージバケット
    - `company-images` - 会社のロゴやファビコンを保存
    - パブリックアクセス有効
    - 最大ファイルサイズ: 2MB
    - 許可MIME: image/jpeg, image/png, image/webp, image/svg+xml, image/x-icon

  2. セキュリティ
    - 認証済みユーザーのみアップロード可能
    - すべてのユーザーが画像を閲覧可能（パブリック）
*/

-- ストレージバケットを作成
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

-- RLSポリシー: すべてのユーザーが閲覧可能（パブリック）
CREATE POLICY "Public can view company images"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'company-images');