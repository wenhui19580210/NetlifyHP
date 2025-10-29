-- ================================================
-- 管理者ユーザー追加マイグレーション
-- ================================================
-- Description: 新規管理者アカウント (ganki.rin@gmail.com / パスワード: admin) を追加

-- 新規管理者アカウントの追加
INSERT INTO admin_users (username, password_hash, display_name, is_active)
VALUES (
  'ganki.rin@gmail.com',
  crypt('admin', gen_salt('bf')),
  'ganki.rin',
  TRUE
)
-- ユーザー名が既に存在する場合は何もしません
ON CONFLICT (username) DO NOTHING;

-- 完了メッセージ
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM admin_users WHERE username = 'ganki.rin@gmail.com') THEN
    RAISE NOTICE '✅ 管理者アカウント ganki.rin@gmail.com の追加または存在確認が完了しました。';
  ELSE
    RAISE NOTICE '⚠️ 管理者アカウント ganki.rin@gmail.com の追加が失敗したか、usernameの競合によりスキップされました。';
  END IF;
END $$;
