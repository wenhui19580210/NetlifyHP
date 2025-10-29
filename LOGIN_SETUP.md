# ログイン設定ガイド 🔐

## 重要：認証システムについて

このプロジェクトは **Supabase Auth** を使用しています。
`admin_users` テーブルのパスワードハッシュは**使用されていません**。

ログインには Supabase の Authentication システムで作成したユーザーアカウントが必要です。

---

## ログインできない場合の解決手順

### ステップ1: 環境変数の確認

`.env` ファイルが存在し、正しい値が設定されているか確認してください。

```bash
# .env ファイルが存在しない場合は作成
cp .env.example .env
```

`.env` ファイルの内容:
```env
VITE_SUPABASE_URL=https://wigcobzzsurxzkkuperc.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### ステップ2: Supabase でユーザーを作成

1. **Supabase Dashboard にアクセス**
   - https://supabase.com/dashboard にアクセス
   - プロジェクト `wigcobzzsurxzkkuperc` を選択

2. **Authentication → Users に移動**
   - 左サイドメニューから「Authentication」をクリック
   - 「Users」タブを選択

3. **新しいユーザーを作成**
   - 「Add user」ボタンをクリック
   - 「Create a new user」を選択

4. **ユーザー情報を入力**
   ```
   Email: admin@dongsheng.com
   Password: admin123456
   ✅ Auto Confirm User （必ずチェック！）
   ❌ Send Email Invitation （チェックしない）
   ```

5. **「Create user」をクリック**

### ステップ3: メール確認ステータスの確認

ユーザー一覧で以下を確認してください：

- ✅ **Email Confirmed** カラムが緑色のチェックマークになっている
- ✅ **Status** が「Active」になっている

もし **Email Confirmed** が `false` の場合：
1. ユーザーをクリック
2. 「Confirm Email」ボタンをクリック
3. ステータスが確認済みになることを確認

### ステップ4: 開発サーバーを起動

```bash
# 依存関係をインストール（初回のみ）
npm install

# 開発サーバーを起動
npm run dev
```

### ステップ5: ログインを試す

1. ブラウザで `http://localhost:5173/login` にアクセス
2. 作成したアカウント情報でログイン:
   - **メールアドレス**: `admin@dongsheng.com`
   - **パスワード**: `admin123456`

---

## よくある問題と解決策

### 🔴 問題: "Invalid login credentials" エラー

**原因**: パスワードが間違っている、またはユーザーが存在しない

**解決策**:
1. Supabase Dashboard → Authentication → Users でユーザーが存在するか確認
2. パスワードをリセット:
   - ユーザーをクリック
   - 「Reset password」をクリック
   - 新しいパスワードを入力（例: `admin123456`）
   - 「Update user」をクリック

### 🔴 問題: "Email not confirmed" エラー

**原因**: メールアドレスが確認されていない

**解決策**:
1. Supabase Dashboard → Authentication → Users
2. ユーザーをクリック
3. 「Confirm Email」ボタンをクリック

### 🔴 問題: ログインボタンを押しても何も起こらない

**原因**: `.env` ファイルが存在しない、または読み込まれていない

**解決策**:
```bash
# .env ファイルを作成
cp .env.example .env

# 開発サーバーを再起動
npm run dev
```

### 🔴 問題: "Network error" または接続エラー

**原因**: Supabase URL または ANON_KEY が間違っている

**解決策**:
1. Supabase Dashboard → Settings → API にアクセス
2. 正しい値をコピー:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public key** → `VITE_SUPABASE_ANON_KEY`
3. `.env` ファイルを更新
4. 開発サーバーを再起動

---

## 推奨アカウント設定

### 開発環境用

```
Email: admin@dongsheng.com
Password: admin123456
Auto Confirm: ✅ Yes
```

### 本番環境用

⚠️ **本番環境では強力なパスワードを使用してください**

```
Email: your-email@company.com
Password: （強力なパスワード）
  - 最低12文字以上
  - 大文字、小文字、数字、記号を含む
  - 例: Gk!2024$DongSheng#Admin
Auto Confirm: ✅ Yes
```

---

## `admin_users` テーブルについて

### 重要な注意事項

プロジェクトには `admin_users` テーブルが存在しますが、**現在のフロントエンドでは使用されていません**。

- ❌ `verify_admin_credentials` 関数は使用されていません
- ❌ `password_hash` カラムは使用されていません
- ✅ 認証は完全に Supabase Auth で管理されています

### `admin_users` テーブルの用途

このテーブルは以前のバージョンで使用されていたものか、将来の拡張用に残されています。
現在のログインシステムには**影響しません**。

---

## デバッグ方法

### ブラウザのコンソールでエラーを確認

1. ブラウザで **F12** キーを押して開発者ツールを開く
2. **Console** タブを選択
3. ログインを試行
4. エラーメッセージを確認

### よくあるエラーメッセージ

| エラーメッセージ | 意味 | 解決策 |
|-----------------|------|--------|
| `Invalid login credentials` | メールアドレスまたはパスワードが間違っている | Supabaseでパスワードをリセット |
| `Email not confirmed` | メール確認が完了していない | Supabaseで「Confirm Email」をクリック |
| `User not found` | ユーザーが存在しない | Supabaseで新しいユーザーを作成 |
| `Network error` | 接続エラー | `.env` の設定を確認 |

### Supabase のログを確認

Supabase Dashboard → Logs → Auth Logs で認証試行のログを確認できます。

---

## テスト用 SQL クエリ

### Supabase Auth ユーザーの一覧を確認

Supabase Dashboard → SQL Editor で実行:

```sql
-- Auth ユーザーの一覧を表示
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at,
  last_sign_in_at
FROM auth.users
ORDER BY created_at DESC;
```

### パスワードを SQL で直接リセット

```sql
-- パスワードを "admin123456" に変更
UPDATE auth.users
SET encrypted_password = crypt('admin123456', gen_salt('bf'))
WHERE email = 'admin@dongsheng.com';
```

---

## まとめ

✅ **正しいログイン方法**:
1. Supabase Dashboard で Auth ユーザーを作成
2. 「Auto Confirm User」を必ずチェック
3. `.env` ファイルが存在することを確認
4. 作成したメールアドレスとパスワードでログイン

❌ **間違った方法**:
- `admin_users` テーブルに直接データを追加する
- `password_hash` を手動で設定する
- SQL の `verify_admin_credentials` 関数を使用する

---

**最終更新**: 2025年10月29日  
**対象システム**: Supabase Auth を使用した CMS
