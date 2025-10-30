# 認証機能テストガイド 🔐

このガイドでは、Supabase Authenticationの動作確認とテスト方法を説明します。

## 📋 前提条件

- マイグレーションが全て完了していること
- `.env` ファイルが正しく設定されていること
- 開発サーバーが起動できること

## 🎯 テスト項目

### 1. 環境変数の確認

#### テスト手順

```bash
cd /home/user/webapp
cat .env
```

#### 期待される結果

```env
VITE_SUPABASE_URL=https://wigcobzzsurxzkkuperc.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### 確認ポイント

- ✅ `VITE_SUPABASE_URL` が設定されている
- ✅ `VITE_SUPABASE_ANON_KEY` が設定されている
- ✅ 環境変数が `VITE_` プレフィックスで始まっている

---

### 2. Supabase Authユーザーの作成

#### テスト手順

1. **Supabase Dashboardにアクセス**
   - https://supabase.com/dashboard
   - プロジェクト `wigcobzzsurxzkkuperc` を選択

2. **Authentication → Users に移動**

3. **新しいユーザーを作成**
   - **Add user** → **Create a new user** をクリック
   - 以下の情報を入力:
     ```
     Email: test@example.com
     Password: Test123456!
     ✅ Auto Confirm User （必ずチェック！）
     ❌ Send Email Invitation
     ```
   - **Create user** をクリック

#### 期待される結果

- ✅ ユーザーが作成される
- ✅ Email Confirmed が緑のチェックマーク
- ✅ Status が "Active"

#### 確認SQL

```sql
-- Supabase Dashboard → SQL Editor で実行
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at,
  last_sign_in_at
FROM auth.users
ORDER BY created_at DESC;
```

---

### 3. ログインページの表示確認

#### テスト手順

1. **開発サーバーを起動**
   ```bash
   cd /home/user/webapp
   npm run dev
   ```

2. **ログインページにアクセス**
   - ブラウザで `http://localhost:5173/login` を開く

#### 期待される結果

- ✅ ログインフォームが表示される
- ✅ メールアドレス入力欄がある
- ✅ パスワード入力欄がある
- ✅ ログインボタンがある
- ✅ 公開サイトへのリンクがある

#### スクリーンショット確認ポイント

- 🎨 東勝会社のロゴ（太陽アイコン）が表示される
- 🎨 グラデーション背景が適用されている
- 📱 レスポンシブデザインが正しく動作する

---

### 4. ログイン機能のテスト

#### テスト手順 1: 正常系

1. ログインページで以下を入力:
   ```
   Email: test@example.com
   Password: Test123456!
   ```

2. **ログイン** ボタンをクリック

#### 期待される結果

- ✅ ローディング表示が出る
- ✅ `/admin` にリダイレクトされる
- ✅ 管理画面が表示される
- ✅ ユーザー名（メールアドレス）が表示される

#### ブラウザコンソール確認

F12キーを押して開発者ツールを開き、コンソールタブで確認:

```
✅ "Attempting to sign in with email: test@example.com"
✅ "Successfully signed in: test@example.com"
❌ エラーメッセージがない
```

---

#### テスト手順 2: 異常系 - 間違ったパスワード

1. ログインページで以下を入力:
   ```
   Email: test@example.com
   Password: WrongPassword123
   ```

2. **ログイン** ボタンをクリック

#### 期待される結果

- ✅ エラーメッセージが表示される
- ✅ メッセージ: "メールアドレスまたはパスワードが正しくありません"
- ✅ ログインページに留まる
- ✅ フォームがクリアされない（メールアドレスは残る）

---

#### テスト手順 3: 異常系 - 存在しないユーザー

1. ログインページで以下を入力:
   ```
   Email: nonexistent@example.com
   Password: AnyPassword123
   ```

2. **ログイン** ボタンをクリック

#### 期待される結果

- ✅ エラーメッセージが表示される
- ✅ メッセージ: "メールアドレスまたはパスワードが正しくありません"

---

### 5. 認証状態の永続化確認

#### テスト手順

1. 正常にログイン（Step 4参照）
2. ページをリロード（F5）
3. または新しいタブで `/admin` にアクセス

#### 期待される結果

- ✅ ログイン状態が保持される
- ✅ 再度ログインする必要がない
- ✅ 管理画面がそのまま表示される

#### LocalStorage確認

F12 → Application → Local Storage → `http://localhost:5173` で確認:

```
✅ supabase.auth.token が存在する
✅ 有効期限が未来の日時になっている
```

---

### 6. ログアウト機能のテスト

#### テスト手順

1. 管理画面にログイン
2. 右上の **ログアウト** ボタンをクリック

#### 期待される結果

- ✅ `/login` にリダイレクトされる
- ✅ ログインフォームが表示される
- ✅ LocalStorageからトークンが削除される

#### 確認方法

```bash
# F12 → Console で実行
localStorage.getItem('supabase.auth.token')
// 結果: null
```

---

### 7. 保護されたルートのテスト

#### テスト手順 1: 未ログイン状態で管理画面にアクセス

1. ログアウト
2. ブラウザで直接 `http://localhost:5173/admin` にアクセス

#### 期待される結果

- ✅ `/login` にリダイレクトされる
- ✅ 管理画面は表示されない

---

#### テスト手順 2: ログイン後に管理画面にアクセス

1. ログイン
2. `/admin` にアクセス

#### 期待される結果

- ✅ 管理画面が表示される
- ✅ すべてのタブが表示される

---

### 8. データアクセス権限のテスト

#### テスト手順

1. 管理画面にログイン
2. 各タブを順番に確認:
   - **会社情報タブ**
   - **サービスタブ**
   - **ブログタブ**
   - **FAQタブ**

#### 期待される結果

会社情報タブ:
- ✅ 会社情報が表示される
- ✅ 編集ができる
- ✅ 保存ボタンが動作する

サービスタブ:
- ✅ サービス一覧が表示される
- ✅ 新規追加ができる
- ✅ 編集・削除ができる
- ✅ 表示/非表示切替ができる

ブログタブ:
- ✅ ブログ記事一覧が表示される
- ✅ 新規投稿ができる
- ✅ 編集・削除ができる

FAQタブ:
- ✅ FAQ一覧が表示される
- ✅ 新規追加ができる
- ✅ 編集・削除ができる

---

### 9. RLSポリシーの動作確認

#### テスト用SQL

Supabase Dashboard → SQL Editor で実行:

```sql
-- 認証なしでデータを取得（公開データのみ）
SET ROLE anon;
SELECT * FROM services WHERE is_visible = true AND deleted_at IS NULL;
-- 期待: 公開サービスのみ取得できる

-- 認証ありで全データを取得
SET ROLE authenticated;
SELECT * FROM services;
-- 期待: 全てのサービス（非公開、削除済みを含む）を取得できる

-- ロールをリセット
RESET ROLE;
```

---

## 🐛 よくある問題と解決策

### 問題 1: "Invalid login credentials" エラー

**原因**: パスワードが間違っている、またはユーザーが存在しない

**解決策**:
1. Supabase Dashboard → Authentication → Users でユーザーを確認
2. パスワードをリセット
3. Email Confirmed が ✅ になっているか確認

---

### 問題 2: ログインボタンを押しても何も起こらない

**原因**: `.env` ファイルが読み込まれていない

**解決策**:
```bash
# .env ファイルを確認
cat .env

# 開発サーバーを再起動
npm run dev
```

---

### 問題 3: データが表示されない

**原因**: RLSポリシーが正しく設定されていない

**解決策**:
1. マイグレーション Step 2 を再実行
2. ブラウザのキャッシュをクリア（Ctrl + Shift + Delete）
3. 開発サーバーを再起動

---

### 問題 4: "Email not confirmed" エラー

**原因**: メールアドレスが確認されていない

**解決策**:
1. Supabase Dashboard → Authentication → Users
2. ユーザーをクリック
3. **Confirm Email** ボタンをクリック

---

## ✅ テスト完了チェックリスト

- [ ] 環境変数が正しく設定されている
- [ ] Supabase Authユーザーが作成されている
- [ ] ログインページが正しく表示される
- [ ] 正しい認証情報でログインできる
- [ ] 間違った認証情報でエラーが表示される
- [ ] 認証状態が永続化される
- [ ] ログアウトが正常に動作する
- [ ] 未ログイン時に保護されたルートにアクセスできない
- [ ] 管理画面でデータの閲覧・編集ができる
- [ ] RLSポリシーが正しく動作している

---

## 📚 関連ドキュメント

- [MIGRATION_EXECUTION_GUIDE.md](MIGRATION_EXECUTION_GUIDE.md) - マイグレーション実行ガイド
- [LOGIN_SETUP.md](LOGIN_SETUP.md) - ログイン設定ガイド
- [TROUBLESHOOTING_JP.md](TROUBLESHOOTING_JP.md) - トラブルシューティング

---

**最終更新日**: 2025年10月30日
