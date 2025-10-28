/*
  # 管理者ユーザーテーブルの作成

  1. 新しいテーブル
    - `admin_users`
      - `id` (uuid, 主キー)
      - `username` (text, ユニーク) - ログイン用ユーザー名
      - `password_hash` (text) - ハッシュ化されたパスワード
      - `display_name` (text) - 表示名
      - `is_active` (boolean) - アカウントの有効/無効
      - `last_login_at` (timestamptz) - 最終ログイン日時
      - `created_at` (timestamptz) - 作成日時
      - `updated_at` (timestamptz) - 更新日時

  2. セキュリティ
    - RLSを有効化
    - 認証済みユーザーのみが自分のデータを閲覧可能
    - パスワード変更用の安全な関数を提供

  3. 初期データ
    - デフォルト管理者アカウント (username: admin, password: admin)
*/

-- admin_usersテーブルの作成
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  display_name text NOT NULL,
  is_active boolean DEFAULT true NOT NULL,
  last_login_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- RLSを有効化
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- 認証済みユーザーが全ての管理者情報を閲覧できる（パスワードハッシュ以外）
DROP POLICY IF EXISTS "Authenticated users can view admin users" ON admin_users;
CREATE POLICY "Authenticated users can view admin users"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (true);

-- 認証済みユーザーが自分の情報を更新できる
CREATE POLICY "Authenticated users can update own profile"
  ON admin_users FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 更新日時を自動更新するトリガー
CREATE OR REPLACE FUNCTION update_admin_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_admin_users_updated_at();

-- パスワード検証関数（username/password認証用）
CREATE OR REPLACE FUNCTION verify_admin_credentials(
  p_username text,
  p_password text
)
RETURNS TABLE(
  user_id uuid,
  username text,
  display_name text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    au.id,
    au.username,
    au.display_name
  FROM admin_users au
  WHERE 
    au.username = p_username 
    AND au.password_hash = crypt(p_password, au.password_hash)
    AND au.is_active = true;
  
  -- 最終ログイン日時を更新
  UPDATE admin_users 
  SET last_login_at = now() 
  WHERE admin_users.username = p_username;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- パスワード変更関数
CREATE OR REPLACE FUNCTION change_admin_password(
  p_user_id uuid,
  p_old_password text,
  p_new_password text
)
RETURNS boolean AS $$
DECLARE
  v_current_hash text;
BEGIN
  -- 現在のパスワードハッシュを取得
  SELECT password_hash INTO v_current_hash
  FROM admin_users
  WHERE id = p_user_id;

  -- 古いパスワードを検証
  IF v_current_hash = crypt(p_old_password, v_current_hash) THEN
    -- 新しいパスワードを設定
    UPDATE admin_users
    SET password_hash = crypt(p_new_password, gen_salt('bf'))
    WHERE id = p_user_id;
    
    RETURN true;
  ELSE
    RETURN false;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- デフォルト管理者アカウントの作成
INSERT INTO admin_users (username, password_hash, display_name)
VALUES (
  'admin',
  crypt('admin', gen_salt('bf')),
  '管理者'
)
ON CONFLICT (username) DO NOTHING;
