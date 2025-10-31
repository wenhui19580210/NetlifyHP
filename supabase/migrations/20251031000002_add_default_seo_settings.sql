-- ================================================
-- SEO設定のデフォルトデータ追加
-- ================================================
-- このマイグレーションは:
-- 1. デフォルトのSEO設定（home, about, services, contact）を追加
-- SEO設定が存在しない場合に404エラーを防ぐため
-- ================================================

-- ------------------------------------------------
-- デフォルトSEO設定の挿入
-- ------------------------------------------------
INSERT INTO seo_settings (
  page_key,
  title_ja, title_zh,
  description_ja, description_zh,
  keywords_ja, keywords_zh,
  og_title_ja, og_title_zh,
  og_description_ja, og_description_zh,
  og_type, twitter_card,
  canonical_url,
  robots_index, robots_follow,
  priority, change_frequency,
  is_active
) VALUES
  -- ホームページ
  (
    'home',
    '東勝 - 太陽光発電メンテナンスサービス',
    '东胜 - 太阳能发电维护服务',
    '太陽光発電所の点検・清掃・保守サービスを提供しています。ドローンを活用した高精度な点検と、専門技術による丁寧な清掃で、発電効率を最大限に引き出します。',
    '提供太阳能电站检查、清洁、维护服务。利用无人机进行高精度检查，通过专业技术进行细致清洁，最大限度地提高发电效率。',
    ARRAY['太陽光発電', 'パネル清掃', 'メンテナンス', 'ドローン点検', '関西'],
    ARRAY['太阳能发电', '面板清洁', '维护', '无人机检查', '关西'],
    '東勝 - 太陽光発電メンテナンスの専門家',
    '东胜 - 太阳能发电维护专家',
    '太陽光発電所の点検・清掃・保守サービス。ドローン点検と専門技術で発電効率を最大化します。',
    '太阳能电站检查、清洁、维护服务。利用无人机检查和专业技术最大化发电效率。',
    'website',
    'summary_large_image',
    '',
    true, true,
    1.0, 'daily',
    true
  ),
  -- 会社概要
  (
    'about',
    '会社概要 - 東勝',
    '公司简介 - 东胜',
    '東勝の会社情報、代表挨拶、事業内容をご紹介します。太陽光発電メンテナンスのプロフェッショナルとして、お客様の発電所をサポートします。',
    '介绍东胜的公司信息、社长致辞、业务内容。作为太阳能发电维护专家，为客户的电站提供支持。',
    ARRAY['会社概要', '企業情報', '太陽光発電', 'メンテナンス会社'],
    ARRAY['公司简介', '企业信息', '太阳能发电', '维护公司'],
    '会社概要 - 東勝',
    '公司简介 - 东胜',
    '太陽光発電メンテナンスのプロフェッショナル企業、東勝の会社情報',
    '太阳能发电维护专业企业东胜的公司信息',
    'website',
    'summary_large_image',
    '',
    true, true,
    0.8, 'monthly',
    true
  ),
  -- サービス
  (
    'services',
    'サービス一覧 - 東勝',
    '服务一览 - 东胜',
    'パネル点検、清掃、保守管理など、太陽光発電所のメンテナンスサービスを包括的に提供しています。',
    '提供面板检查、清洁、维护管理等太阳能电站的综合维护服务。',
    ARRAY['サービス', 'パネル点検', 'パネル清掃', '保守管理', 'ドローン'],
    ARRAY['服务', '面板检查', '面板清洁', '维护管理', '无人机'],
    'サービス一覧 - 東勝の太陽光メンテナンス',
    '服务一览 - 东胜的太阳能维护',
    '太陽光発電所の点検・清掃・保守管理サービスのご案内',
    '太阳能电站检查、清洁、维护管理服务介绍',
    'website',
    'summary_large_image',
    '',
    true, true,
    0.9, 'weekly',
    true
  ),
  -- お問い合わせ
  (
    'contact',
    'お問い合わせ - 東勝',
    '联系我们 - 东胜',
    '太陽光発電メンテナンスに関するご相談、お見積もり依頼はこちらからお気軽にお問い合わせください。',
    '关于太阳能发电维护的咨询、报价请求，请随时通过此处联系我们。',
    ARRAY['お問い合わせ', '見積もり', '相談', '連絡先'],
    ARRAY['联系我们', '报价', '咨询', '联系方式'],
    'お問い合わせ - 東勝',
    '联系我们 - 东胜',
    'お見積もり・ご相談は無料。お気軽にお問い合わせください。',
    '报价、咨询免费。请随时联系我们。',
    'website',
    'summary_large_image',
    '',
    true, true,
    0.7, 'monthly',
    true
  )
ON CONFLICT (page_key) DO UPDATE SET
  title_ja = EXCLUDED.title_ja,
  title_zh = EXCLUDED.title_zh,
  description_ja = EXCLUDED.description_ja,
  description_zh = EXCLUDED.description_zh,
  keywords_ja = EXCLUDED.keywords_ja,
  keywords_zh = EXCLUDED.keywords_zh,
  og_title_ja = EXCLUDED.og_title_ja,
  og_title_zh = EXCLUDED.og_title_zh,
  og_description_ja = EXCLUDED.og_description_ja,
  og_description_zh = EXCLUDED.og_description_zh,
  updated_at = now();

-- ------------------------------------------------
-- 完了メッセージ
-- ------------------------------------------------
DO $$
BEGIN
  RAISE NOTICE '✅ デフォルトSEO設定が追加されました！';
  RAISE NOTICE '📄 追加されたページ: home, about, services, contact';
  RAISE NOTICE '🔍 これにより、各ページでSEO設定の404エラーが解消されます';
END $$;
