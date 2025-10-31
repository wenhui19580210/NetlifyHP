# ファビコン設定ガイド

## 問題の診断と解決手順

### 現在の状況

ファビコンが表示されない問題は、以下のいずれかが原因です：

1. ✅ データベースに `browser_favicon_url` カラムが存在しない → **既に解決済み（マイグレーション存在）**
2. ❓ マイグレーションが実行されていない → **要確認**
3. ❓ 管理画面からファビコンがアップロードされていない → **要確認**

### 解決手順

## 手順1: データベースマイグレーションの確認と実行

### 1.1 Supabase Dashboardにアクセス

1. [Supabase Dashboard](https://supabase.com/dashboard) にログイン
2. プロジェクトを選択
3. 左側メニューから **SQL Editor** をクリック

### 1.2 `browser_favicon_url` カラムの存在確認

以下のSQLを実行して、カラムが存在するか確認：

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'company_info' 
  AND column_name IN ('browser_favicon_url', 'favicon_url', 'hero_icon_url');
```

**期待される結果:**
```
column_name          | data_type
---------------------|----------
browser_favicon_url  | text
favicon_url          | text
hero_icon_url        | text
```

### 1.3 カラムが存在しない場合：マイグレーションを実行

`supabase/migrations/20251031000001_add_browser_favicon.sql` の内容をコピーして、SQL Editorで実行：

```sql
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
```

### 1.4 現在のデータ状態を確認

```sql
SELECT 
  id,
  company_name,
  logo_url,
  favicon_url,
  browser_favicon_url,
  hero_icon_url
FROM company_info;
```

## 手順2: 管理画面からファビコンをアップロード

### 2.1 管理画面にアクセス

1. ブラウザで `/admin` にアクセス
2. Supabase Authenticationで作成したアカウントでログイン

### 2.2 ブラウザタブ用ファビコンをアップロード

1. 管理画面で **会社情報** タブを選択
2. 下にスクロールして **画像アップロード** セクションを表示
3. **「ブラウザタブ用ファビコン」** の枠内をクリック
4. ファビコン画像を選択してアップロード

**推奨仕様:**
- サイズ: 32×32px または 64×64px
- 形式: ICO, PNG, SVG, JPEG
- 最大サイズ: 2MB

### 2.3 保存

右下の **「保存」** ボタンをクリック

### 2.4 確認

1. ブラウザのタブを確認してファビコンが表示されているか確認
2. 表示されない場合はブラウザのキャッシュをクリア（Ctrl+Shift+R / Cmd+Shift+R）

## 手順3: トラブルシューティング

### ファビコンが表示されない場合

#### A. データベース確認

Supabase Dashboard → SQL Editorで以下を実行：

```sql
SELECT browser_favicon_url FROM company_info;
```

**結果がNULLの場合:** 手順2に戻ってファビコンをアップロードしてください。

**結果にURLが表示される場合:** 次のステップへ。

#### B. ストレージ確認

1. Supabase Dashboard → **Storage** → **company-images** バケット
2. アップロードしたファビコン画像が存在するか確認
3. 画像をクリックして「Get public URL」をコピー
4. ブラウザで直接URLを開いて画像が表示されるか確認

#### C. ブラウザキャッシュクリア

```bash
# Chrome / Edge
Ctrl + Shift + Delete (Windows/Linux)
Cmd + Shift + Delete (Mac)

# または強制リロード
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)
```

#### D. 開発者ツールで確認

1. ブラウザで F12 キーを押して開発者ツールを開く
2. **Console** タブでエラーがないか確認
3. **Network** タブでファビコンのリクエストを確認
4. **Elements** タブで `<head>` 内の `<link rel="icon">` タグを確認

## ファビコンの優先順位

システムは以下の優先順位でファビコンを選択します：

1. **browser_favicon_url** (最優先) - ブラウザタブ用専用ファビコン
2. **favicon_url** (次善) - フッターアイコン（代替として使用）
3. **/sun-icon.svg** (フォールバック) - デフォルト画像

```typescript
// SEOHead.tsx より
const faviconUrl = companyInfo?.browser_favicon_url || companyInfo?.favicon_url || '/sun-icon.svg';
```

## よくある質問

### Q1: ファビコンが複数あるのはなぜ？

**A:** 用途別に分けて管理するためです：

- **browser_favicon_url**: ブラウザタブに表示される小さなアイコン
- **favicon_url**: フッターに表示される会社アイコン
- **hero_icon_url**: トップページのヒーローセクションに表示されるアイコン

### Q2: どの形式のファイルを使うべき？

**A:** 推奨順：

1. **ICO形式** (.ico) - ブラウザの互換性が最も高い
2. **PNG形式** (.png) - 透明背景が使える、サイズが小さい
3. **SVG形式** (.svg) - ベクター形式、拡大縮小しても綺麗

### Q3: アップロードしたのにファビコンが変わらない

**A:** ブラウザがキャッシュしている可能性があります。以下を試してください：

1. **強制リロード**: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)
2. **ブラウザキャッシュをクリア**
3. **別のブラウザで確認**
4. **シークレットモードで確認**

### Q4: データベースエラーが出る

**A:** 手順1のマイグレーションが正しく実行されているか確認してください。

### Q5: 画像がアップロードできない

**A:** 以下を確認：

1. ファイルサイズが2MB以下か
2. 対応形式（JPEG, PNG, ICO, SVG）か
3. Supabase Storageの `company-images` バケットが存在するか
4. RLSポリシーが正しく設定されているか

## 完了確認

以下がすべてチェックできれば完了です：

- [ ] データベースに `browser_favicon_url` カラムが存在する
- [ ] 管理画面からファビコンがアップロードできる
- [ ] `company_info` テーブルに `browser_favicon_url` の値が保存されている
- [ ] ブラウザのタブにカスタムファビコンが表示される
- [ ] 強制リロード（Ctrl+Shift+R）でも正しく表示される

---

**最終更新日**: 2025年10月31日
