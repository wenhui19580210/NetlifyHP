# ファビコンとヒーローアイコンの修正内容

## 修正日時
2025年10月31日

## 修正内容

### 1. ブラウザタブ用ファビコンとフッターアイコンの分離

#### 問題
- `browser_favicon_url`（ブラウザタブ用）と`favicon_url`（フッター用）がデータベース上で分離されていたが、システム全体で優先的に使用されていなかった

#### 解決策
- **データベース構造の確認**
  - `company_info`テーブルに以下の3つのアイコンフィールドが存在：
    - `browser_favicon_url`: ブラウザタブのファビコン専用
    - `favicon_url`: フッターアイコン専用
    - `hero_icon_url`: トップページヒーローセクションアイコン専用

- **SEOHead.tsx の修正**
  - ブラウザタブ用ファビコンの優先順位を明確化：
    ```typescript
    // 優先順位: browser_favicon_url > favicon_url > デフォルト
    const faviconUrl = companyInfo?.browser_favicon_url || companyInfo?.favicon_url || '/sun-icon.svg';
    ```
  - ファビコンの動的更新ロジックを改善：
    - 既存のファビコンリンクをすべて削除してから新しいリンクを追加
    - ファイル拡張子に応じて適切なMIMEタイプを設定（.svg, .png, .ico, .jpg/.jpeg）

- **Footer.tsx の確認**
  - フッターアイコンは`favicon_url`を優先的に使用（既に正しく実装済み）

- **Hero.tsx の修正**
  - ヒーローアイコンのフォールバック順序を明確化：
    ```typescript
    const iconUrl = company?.hero_icon_url || company?.browser_favicon_url || '/sun-icon.svg';
    ```

### 2. ヒーローアイコン表示/非表示機能の修正

#### 問題
- `hero_icon_visible`チェックボックスの状態が正しく反映されない
- `!== false`の判定では、`null`や`undefined`もtrueとして扱われてしまう

#### 解決策
- **CompanyTab.tsx の修正**
  - チェックボックスの状態判定を厳密化：
    ```typescript
    // 修正前: checked={data.hero_icon_visible !== false}
    // 修正後: checked={data.hero_icon_visible === true}
    ```
  - UIを改善：
    - 背景色を追加して目立たせる
    - 説明文を追加（「チェックを外すとトップページのヒーローセクションでアイコンが非表示になります」）

- **Hero.tsx の修正**
  - 表示判定を厳密化：
    ```typescript
    // 修正前: const shouldShowIcon = company?.hero_icon_visible !== false;
    // 修正後: const shouldShowIcon = company?.hero_icon_visible === true;
    ```
  - 明示的に`true`の場合のみ表示

### 3. JPEG/PNG対応の強化

#### 問題
- ファビコン設定でJPEG/PNG形式が正しく認識されない可能性
- ファイルアップロード時のMIMEタイプチェックが厳格すぎる

#### 解決策
- **CompanyTab.tsx の修正**
  - ファイル形式チェックを改善：
    - MIMEタイプだけでなく、ファイル拡張子でもチェック
    - 対応拡張子：`jpg`, `jpeg`, `png`, `webp`, `svg`, `ico`
  - ファイル選択ダイアログのacceptを更新：
    ```html
    accept="image/x-icon,image/vnd.microsoft.icon,image/png,image/jpeg,image/svg+xml"
    ```
  - 各アイコンセクションの説明を更新：
    - 「対応形式: JPEG, PNG, ICO, SVG」
    - ブラウザタブ用とフッター用が別管理であることを明記

### 4. エラーハンドリングの改善

- **SEOHead.tsx の修正**
  - ファビコン更新時のエラーを防ぐため、既存のリンク要素をすべて削除してから新しいものを追加
  - ファイル拡張子に応じて適切なMIMEタイプを自動設定

## 使用方法

### 管理画面での設定

1. **ブラウザタブ用ファビコン**
   - 場所：会社情報タブ > 画像アップロード > 「ブラウザタブ用ファビコン」
   - 用途：ブラウザのタブに表示される
   - 推奨サイズ：32×32px または 64×64px
   - 対応形式：JPEG, PNG, ICO, SVG
   - 優先度：最優先（システム全体で使用）

2. **フッターアイコン**
   - 場所：会社情報タブ > 画像アップロード > 「フッターアイコン」
   - 用途：フッターに表示される
   - 推奨サイズ：32×32px または 64×64px
   - 対応形式：JPEG, PNG, ICO, SVG
   - 優先度：フッター専用

3. **ヒーローアイコン（トップページ）**
   - 場所：会社情報タブ > 画像アップロード > 「ヒーローアイコン（トップページ）」
   - 用途：トップページのヒーローセクションに表示
   - 推奨サイズ：64×64px
   - 対応形式：JPEG, PNG, ICO, SVG
   - 表示ON/OFF：チェックボックスで制御
   - 未設定時：ブラウザタブ用ファビコンを使用

### ヒーローアイコンの表示制御

- **表示する場合**: 「トップページにアイコンを表示する」にチェック ✓
- **非表示にする場合**: チェックを外す
- チェックを外すと、トップページのヒーローセクションでアイコンが完全に非表示になります

## フォールバック順序

### ブラウザタブ（Favicon）
1. `browser_favicon_url` （最優先）
2. `favicon_url`
3. `/sun-icon.svg` （デフォルト）

### フッター
1. `favicon_url` （フッター専用）
2. Sunアイコン（コンポーネント内のフォールバック）

### ヒーローセクション
- 表示する場合（`hero_icon_visible === true`）:
  1. `hero_icon_url`
  2. `browser_favicon_url`
  3. `/sun-icon.svg`
- 非表示の場合（`hero_icon_visible !== true`）:
  - アイコンを一切表示しない

## 技術的な詳細

### 変更されたファイル

1. **src/components/admin/CompanyTab.tsx**
   - ファイル形式チェックの改善
   - ヒーローアイコン表示制御UIの改善
   - 各アイコンの説明文の追加

2. **src/components/SEOHead.tsx**
   - ファビコン優先順位の明確化
   - ファビコン動的更新ロジックの改善
   - MIME タイプの自動設定

3. **src/components/Hero.tsx**
   - 表示判定ロジックの厳密化
   - フォールバック順序の明確化

4. **index.html**
   - デフォルトファビコンのコメント追加

### データベース（既存）

- `company_info`テーブルには既に以下のカラムが存在：
  - `browser_favicon_url`: TEXT
  - `favicon_url`: TEXT
  - `hero_icon_url`: TEXT
  - `hero_icon_visible`: BOOLEAN (DEFAULT true)

## テスト方法

1. **ブラウザタブ用ファビコンのテスト**
   - 管理画面で「ブラウザタブ用ファビコン」をアップロード
   - ブラウザのタブを確認（アイコンが表示される）
   - JPEG, PNG, ICO, SVGの各形式でテスト

2. **フッターアイコンのテスト**
   - 管理画面で「フッターアイコン」をアップロード
   - トップページのフッターを確認（アイコンが表示される）
   - ブラウザタブ用とは別のアイコンが表示されることを確認

3. **ヒーローアイコン表示制御のテスト**
   - 管理画面で「トップページにアイコンを表示する」にチェック
   - トップページを確認（ヒーローセクションにアイコンが表示される）
   - チェックを外す
   - トップページを確認（ヒーローセクションのアイコンが非表示になる）

4. **フォールバックのテスト**
   - すべてのアイコンを削除
   - デフォルトの`/sun-icon.svg`が使用されることを確認

## まとめ

この修正により、以下の問題が解決されました：

1. ✅ ブラウザタブ用ファビコンとフッターアイコンが正しく分離され、優先的に使用される
2. ✅ ヒーローアイコンの表示/非表示が正しく機能する
3. ✅ JPEG/PNG形式のファビコンが正しく認識され、使用できる
4. ✅ 各アイコンの用途と優先順位が明確になった
5. ✅ フォールバック順序が明確に定義された
