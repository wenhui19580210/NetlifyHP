-- ================================================
-- 東勝会社 CMSウェブサイト - Step 3: 初期データとビュー
-- ================================================
-- このマイグレーションファイルは:
-- 1. 初期会社情報データの投入
-- 2. サンプルデータの投入
-- 3. 管理者用ビューの作成
-- を含みます。
-- ================================================

-- ------------------------------------------------
-- 1. 会社情報の初期データ (company_info)
-- ------------------------------------------------
-- DEFAULT値を使用し、レコードが存在しない場合にのみ挿入
INSERT INTO company_info (id)
SELECT uuid_generate_v4()
WHERE NOT EXISTS (SELECT 1 FROM company_info);

-- ------------------------------------------------
-- 2. 会社情報表示制御の初期設定 (company_info_visibility)
-- ------------------------------------------------
INSERT INTO company_info_visibility (field_name, is_visible)
VALUES
    ('company_name', TRUE),
    ('ceo_name', TRUE),
    ('established', TRUE),
    ('capital', TRUE),
    ('employees', TRUE),
    ('business_content', TRUE),
    ('phone', TRUE),
    ('email', TRUE),
    ('address', TRUE),
    ('map_embed', FALSE),
    ('ceo_message', TRUE),
    ('fax', FALSE)
ON CONFLICT (field_name) DO UPDATE SET is_visible = EXCLUDED.is_visible;

-- ------------------------------------------------
-- 3. サンプルサービスデータ (services)
-- ------------------------------------------------
INSERT INTO services (service_name_ja, service_name_zh, description_ja, description_zh, icon, order_index, is_visible)
VALUES
    ('太陽光パネル点検', '太阳能板检查', 'ドローンと専門機器を用いた高精度なパネル点検を実施します。異常の早期発見が可能です。', '使用无人机和专业设备进行高精度面板检查。可以早期发现异常。', 'Sparkles', 10, TRUE),
    ('パネル清掃・洗浄', '面板清洗', '特殊な洗剤と水を使用し、パネル表面の汚れや鳥の糞を徹底的に除去。発電効率を回復させます。', '使用特殊清洁剂和水，彻底清除面板表面的污垢和鸟粪。恢复发电效率。', 'WashingMachine', 20, TRUE),
    ('発電所保守・管理', '电站维护与管理', '定期的な巡回点検とレポート作成、緊急時の対応など、発電所全体をサポートします。', '定期巡检、报告制作、紧急情况应对等，提供电站全面支持。', 'Settings', 30, TRUE),
    ('雑草対策・草刈り', '杂草控制与割草', '発電所敷地内の雑草を抑制し、影や火災のリスクを軽減します。', '控制电站场地内的杂草，减少阴影和火灾风险。', 'Leaf', 40, FALSE)
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------
-- 4. サンプルブログ記事 (blog_posts)
-- ------------------------------------------------
INSERT INTO blog_posts (title_ja, title_zh, content_ja, content_zh, publish_date, is_visible)
VALUES
    ('夏季限定！パネル洗浄キャンペーンのお知らせ', '夏季限定！面板清洗活动通知', '夏の発電効率回復に最適なパネル洗浄サービスを特別価格で提供します。', '以特价提供最适合夏季发电效率恢复的面板清洗服务。', '2025-10-25', TRUE),
    ('施工事例：兵庫県A社様の事例を公開', '施工案例：公开兵库县A公司的案例', '大規模発電所の点検・清掃作業の様子と、効率改善の結果を公開しました。', '公开了大型电站的检查和清洁工作情况，以及效率改善结果。', '2025-10-20', TRUE),
    ('【ニュース】新ドローン導入による点検精度向上について', '【新闻】关于引入新无人机提高检查精度', '最新型の赤外線ドローンを導入し、さらに微細な異常も検出可能になりました。', '引入了最新型号的红外无人机，可以检测出更细微的异常。', '2025-10-10', TRUE),
    ('今後のメンテナンス予約状況について', '未来维护预约情况', '12月以降の予約が埋まりつつあります。お早めにご相談ください。', '12月之后的预约正在被填满。请尽早咨询。', '2025-10-01', FALSE)
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------
-- 5. サンプルFAQ (faqs)
-- ------------------------------------------------
INSERT INTO faqs (question_ja, question_zh, answer_ja, answer_zh, order_index, is_visible)
VALUES
    ('パネル清掃の頻度はどれくらいが目安ですか？', '面板清洗的频率以多少为宜？', '年に1〜2回が推奨されます。特に汚れやすい環境では頻繁な清掃が効果的です。', '建议每年1到2次。在容易脏污的环境中，频繁清洁更有效。', 10, TRUE),
    ('点検にはどれくらいの時間がかかりますか？', '检查需要多长时间？', '発電所の規模によりますが、一般的な住宅用で約1時間、大規模なものでは数日かかる場合があります。', '取决于电站规模，一般家用约1小时，大型电站可能需要几天时间。', 20, TRUE),
    ('見積もりは無料ですか？', '估价是免费的吗？', 'はい、無料でお見積もりいたします。お気軽にご連絡ください。', '是的，我们免费提供估价。请随时联系我们。', 30, TRUE),
    ('対応エリアはどこまでですか？', '对应区域到哪里？', '主に兵庫県、大阪府、京都府を中心に関西一円に対応しております。', '主要以兵库县、大阪府、京都府为中心，覆盖关西全境。', 40, TRUE)
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------
-- 6. サンプル緊急告知 (announcements)
-- ------------------------------------------------
INSERT INTO announcements (title_ja, title_zh, content_ja, content_zh, is_visible, start_date, end_date, priority)
VALUES
    (
        '【重要】年末年始休業のお知らせ',
        '【重要】年末年初休业通知',
        '誠に勝手ながら、2025年12月29日(月)から2026年1月4日(日)まで休業させていただきます。',
        '非常抱歉，我们将于2025年12月29日(星期一)至2026年1月4日(星期日)期间休业。',
        TRUE,
        '2025-12-01 00:00:00+09',
        '2026-01-15 23:59:59+09',
        100
    ),
    (
        'サイトメンテナンスのお知らせ',
        '网站维护通知',
        '下記日程でウェブサイトのシステムメンテナンスを実施します。メンテナンス中は一時的にアクセスできません。日時：2025年11月1日 02:00〜05:00',
        '我们将在以下时间进行网站系统维护。维护期间网站将暂时无法访问。时间：2025年11月1日 02:00〜05:00',
        TRUE,
        '2025-10-29 00:00:00+09',
        '2025-11-02 23:59:59+09',
        50
    ),
    (
        '古い告知サンプル',
        '旧公告样本',
        'この告知はすでに終了しています。表示されるべきではありません。',
        '此公告已经结束。不应该显示。',
        TRUE,
        '2025-01-01 00:00:00+09',
        '2025-01-31 23:59:59+09',
        10
    )
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------
-- 7. 管理者用ビューの作成
-- ------------------------------------------------

-- ブログ記事管理ビュー（削除済みも含む全記事を表示）
CREATE OR REPLACE VIEW admin_all_blog_posts AS
SELECT
  id,
  title_ja, title_zh, content_ja, content_zh, image_url,
  publish_date, is_visible, deleted_at, created_at, updated_at,
  CASE
    WHEN deleted_at IS NOT NULL THEN 'deleted'
    WHEN is_visible = false THEN 'draft'
    ELSE 'published'
  END as status
FROM blog_posts
ORDER BY
  CASE WHEN deleted_at IS NOT NULL THEN 2 ELSE 1 END,
  publish_date DESC;

-- サービス管理ビュー（削除済みも含む全サービスを表示）
CREATE OR REPLACE VIEW admin_all_services AS
SELECT
  id,
  service_name_ja, service_name_zh, description_ja, description_zh, image_url, icon,
  order_index, is_visible, deleted_at, created_at, updated_at,
  CASE
    WHEN deleted_at IS NOT NULL THEN 'deleted'
    WHEN is_visible = false THEN 'draft'
    ELSE 'published'
  END as status
FROM services
ORDER BY
  CASE WHEN deleted_at IS NOT NULL THEN 2 ELSE 1 END,
  order_index ASC;

-- FAQ管理ビュー（削除済みも含む全FAQを表示）
CREATE OR REPLACE VIEW admin_all_faqs AS
SELECT
  id,
  question_ja, question_zh, answer_ja, answer_zh,
  order_index, is_visible, deleted_at, created_at, updated_at,
  CASE
    WHEN deleted_at IS NOT NULL THEN 'deleted'
    WHEN is_visible = false THEN 'draft'
    ELSE 'published'
  END as status
FROM faqs
ORDER BY
  CASE WHEN deleted_at IS NOT NULL THEN 2 ELSE 1 END,
  order_index ASC;

-- ビューに対する権限付与
GRANT SELECT ON admin_all_blog_posts TO anon, authenticated;
GRANT SELECT ON admin_all_services TO anon, authenticated;
GRANT SELECT ON admin_all_faqs TO anon, authenticated;

-- ビューの所有権をpostgresに設定
ALTER VIEW admin_all_blog_posts OWNER TO postgres;
ALTER VIEW admin_all_services OWNER TO postgres;
ALTER VIEW admin_all_faqs OWNER TO postgres;


-- ------------------------------------------------
-- 8. 参考: 管理者ユーザー初期データ（オプション）
-- ------------------------------------------------

-- 注意: このプロジェクトはSupabase Authenticationを使用します
-- 以下のadmin_usersへのデータ投入は参考用です
-- 実際のログインにはSupabase Dashboard → Authentication → Usersでユーザーを作成してください

INSERT INTO admin_users (username, password_hash, display_name)
VALUES (
  'admin',
  crypt('admin', gen_salt('bf')),
  '管理者'
)
ON CONFLICT (username) DO NOTHING;

INSERT INTO admin_users (username, password_hash, display_name, is_active)
VALUES (
  'ganki.rin@gmail.com',
  crypt('admin', gen_salt('bf')),
  'ganki.rin',
  TRUE
)
ON CONFLICT (username) DO NOTHING;


-- ------------------------------------------------
-- 9. 完了メッセージ
-- ------------------------------------------------

DO $$
BEGIN
  RAISE NOTICE '✅ Step 3: 初期データとビューの作成が完了しました！';
  RAISE NOTICE '📊 サンプルデータ: サービス4件、ブログ4件、FAQ4件、告知3件';
  RAISE NOTICE '🔍 管理者用ビュー: admin_all_blog_posts, admin_all_services, admin_all_faqs';
  RAISE NOTICE '⚠️  認証: Supabase Dashboard → Authentication → Users でユーザーを作成してください';
  RAISE NOTICE '📋 次のステップ: 20251030000004_step4_advanced_features.sql を実行してください。';
END $$;
