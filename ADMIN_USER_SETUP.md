# 管理者ユーザーの作成手順

データベーステーブルは正常に作成されましたが、ログインするには**Supabase認証システムにユーザーを登録**する必要があります。

## ユーザー作成手順

### 方法1: Supabaseダッシュボードから作成（推奨）

1. [Supabaseダッシュボード](https://supabase.com/dashboard)にアクセス
2. プロジェクトを選択
3. 左サイドバーの「Authentication」をクリック
4. 「Users」タブを選択
5. 「Add user」→「Create new user」をクリック
6. 以下の情報を入力:
   - **Email**: `admin@tokatsu.com`（または任意のメールアドレス）
   - **Password**: `admin123`（または任意の強固なパスワード）
   - **Auto Confirm User**: ☑ チェックを入れる（重要！）
7. 「Create user」をクリック

### 方法2: SQLエディタから作成

Supabaseダッシュボードの「SQL Editor」から以下のSQLを実行:

```sql
-- テスト用管理者ユーザーを作成
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  aud,
  role
)
SELECT
  gen_random_uuid(),
  'admin@tokatsu.com',
  crypt('admin123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{}'::jsonb,
  now(),
  now(),
  'authenticated',
  'authenticated'
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'admin@tokatsu.com'
);

-- identitiesテーブルにも追加
INSERT INTO auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
)
SELECT
  gen_random_uuid(),
  u.id,
  jsonb_build_object('sub', u.id, 'email', u.email),
  'email',
  now(),
  now(),
  now()
FROM auth.users u
WHERE u.email = 'admin@tokatsu.com'
AND NOT EXISTS (
  SELECT 1 FROM auth.identities i WHERE i.user_id = u.id AND i.provider = 'email'
);
```

## ログイン情報

作成したユーザーで管理画面にログインできます:

- **URL**: `https://localhost:5173/login`
- **Email**: `admin@tokatsu.com`
- **Password**: `admin123`

## 重要な注意事項

1. **Email confirmation**: ユーザー作成時に「Auto Confirm User」にチェックを入れることを忘れないでください。チェックを入れないと、メール確認が必要になります。

2. **本番環境**: 本番環境では必ず強固なパスワードを使用してください。

3. **複数ユーザー**: 必要に応じて複数の管理者ユーザーを作成できます。

## トラブルシューティング

### 「Invalid login credentials」エラーが表示される場合

1. Supabaseダッシュボードで「Authentication」→「Users」を確認
2. ユーザーが存在し、「Confirmed」ステータスになっているか確認
3. メールアドレスとパスワードが正しいか確認
4. ブラウザのコンソールでエラーメッセージを確認

### 「Email not confirmed」エラーが表示される場合

1. Supabaseダッシュボードで該当ユーザーを選択
2. 「Confirm email」ボタンをクリック
3. または、ユーザーを削除して「Auto Confirm User」にチェックを入れて再作成

## 画像アップロード機能について

管理画面の会社情報タブで、ロゴとファビコンを直接アップロードできます:

- **ロゴ**: 推奨サイズ 横300-500px × 縦80-150px（最大2MB）
- **ファビコン**: 推奨サイズ 32×32px または 64×64px（最大2MB）
- 対応形式: JPEG, PNG, WebP, SVG, ICO

アップロードした画像はSupabaseストレージに保存され、自動的にパブリックURLが生成されます。
