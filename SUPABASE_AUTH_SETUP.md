# Supabase 認証セットアップガイド

## ログインできない場合のチェックリスト

### 1. Supabase ユーザーの確認

#### 手順:
1. [Supabase Dashboard](https://supabase.com/dashboard) にアクセス
2. プロジェクトを選択
3. 左メニューから **Authentication → Users** を選択

#### 確認項目:
- ✅ ユーザーが存在するか
- ✅ **Email Confirmed** カラムが緑色のチェックマークになっているか
- ✅ メールアドレスが正しいか（例: `ganki.rin@gmail.com`）

### 2. メールが未確認の場合

もしユーザーの **Email Confirmed** が `false` の場合：

1. ユーザーをクリック
2. **Confirm Email** ボタンをクリック
3. または、ユーザーを削除して再作成し、今度は **Auto Confirm User** をチェック

### 3. ユーザーの作成手順（推奨）

```
1. Authentication → Users
2. 「Add user」ボタンをクリック
3. 以下を入力:
   - Email: ganki.rin@gmail.com
   - Password: admin（または任意のパスワード）
   - ✅ Auto Confirm User をチェック ← 重要！
4. 「Send Email Invitation」のチェックは外す
5. 「Create user」をクリック
```

### 4. パスワードを "admin" に設定する方法

#### Supabase Dashboard から:
1. Authentication → Users
2. 対象のユーザーをクリック
3. 「Reset password」をクリック
4. 新しいパスワードとして `admin` を入力
5. 「Update user」をクリック

#### SQL Editor から（推奨）:
```sql
-- ユーザーのパスワードを "admin" に変更
UPDATE auth.users
SET encrypted_password = crypt('admin', gen_salt('bf'))
WHERE email = 'ganki.rin@gmail.com';
```

### 5. 環境変数の確認

`.env` ファイルが存在し、正しい値が設定されているか確認：

```bash
VITE_SUPABASE_URL=https://wigcobzzsurxzkkuperc.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ URLが `.co` で終わっているか確認（`.cos` ではない）

### 6. ブラウザのコンソールでエラー確認

1. ブラウザで F12 キーを押して開発者ツールを開く
2. **Console** タブを選択
3. ログインを試行
4. 赤色のエラーメッセージを確認

よくあるエラー:
- `Invalid login credentials` → パスワードが間違っている
- `Email not confirmed` → メールが未確認
- `Network error` → Supabase URLまたはネットワークの問題

### 7. 動作確認

正しく設定できたら、以下の情報でログイン:

```
メールアドレス: ganki.rin@gmail.com
パスワード: admin
```

## トラブルシューティング

### ケース1: "Invalid login credentials" エラー
**原因**: パスワードが間違っている

**解決策**:
1. Supabase Dashboard → Authentication → Users
2. ユーザーをクリック → 「Reset password」
3. 新しいパスワードを設定

### ケース2: "Email not confirmed" エラー
**原因**: メール確認が完了していない

**解決策**:
1. Supabase Dashboard → Authentication → Users
2. ユーザーをクリック → 「Confirm Email」ボタンをクリック

### ケース3: ログイン画面に何も表示されない
**原因**: `.env` ファイルが存在しない、または間違っている

**解決策**:
```bash
# .env.example から .env を作成
cp .env.example .env

# 開発サーバーを再起動
npm run dev
```

### ケース4: Network Error
**原因**: Supabase プロジェクトが一時停止、またはURL/Keyが間違っている

**解決策**:
1. Supabaseのプロジェクトが稼働しているか確認
2. `.env` の URL と ANON_KEY が正しいか確認
3. [Project Settings → API](https://supabase.com/dashboard/project/_/settings/api) から正しい値をコピー

## テスト用管理者アカウント

以下の設定で管理者アカウントを作成することを推奨:

```
Email: admin@dongsheng.com
Password: admin123456
Auto Confirm: ✅ Yes
```

または

```
Email: ganki.rin@gmail.com
Password: admin
Auto Confirm: ✅ Yes
```

## 本番環境での注意

⚠️ 本番環境では強力なパスワードを使用してください:
- 最低12文字以上
- 大文字、小文字、数字、記号を含む
- 推測されにくいもの

例: `Gk!2024$DongSheng#Admin`
