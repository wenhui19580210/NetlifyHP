import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../contexts/LanguageContext';
import { useSEOSettings } from '../hooks/useSEOSettings';
import { useCompanyInfo } from '../hooks/useCompanyInfo';
import type { Database } from '../lib/database.types';

type SEOSettings = Database['public']['Tables']['seo_settings']['Row'];

interface SEOHeadProps {
  pageKey?: string;
  customTitle?: string;
  customDescription?: string;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  pageKey = 'home',
  customTitle,
  customDescription,
}) => {
  const { language } = useLanguage();
  const { getSEOSettingByPageKey } = useSEOSettings();
  const { data: companyInfo } = useCompanyInfo();
  const [seoData, setSeoData] = useState<SEOSettings | null>(null);

  useEffect(() => {
    const fetchSEO = async () => {
      const data = await getSEOSettingByPageKey(pageKey);
      setSeoData(data);
    };

    fetchSEO();
  }, [pageKey, getSEOSettingByPageKey]);

  if (!seoData) {
    return null;
  }

  // 言語に応じたデータを取得
  const title = customTitle || (language === 'ja' ? seoData.title_ja : seoData.title_zh) || '';
  const description = customDescription || (language === 'ja' ? seoData.description_ja : seoData.description_zh) || '';
  const keywords = language === 'ja' ? seoData.keywords_ja : seoData.keywords_zh;
  const ogTitle = language === 'ja' ? seoData.og_title_ja : seoData.og_title_zh;
  const ogDescription = language === 'ja' ? seoData.og_description_ja : seoData.og_description_zh;

  // robotsメタタグの生成
  const robotsContent = [
    seoData.robots_index ? 'index' : 'noindex',
    seoData.robots_follow ? 'follow' : 'nofollow',
  ].join(', ');

  // ブラウザタブ用ファビコンURLを取得（会社情報から、なければデフォルト）
  const faviconUrl = companyInfo?.browser_favicon_url || '/sun-icon.svg';

  // OG画像は会社ロゴを優先、なければSEO設定のOG画像を使用
  const ogImageUrl = companyInfo?.logo_url || seoData.og_image_url || '';

  // ファビコンの動的更新（React Helmetの制限を回避）
  useEffect(() => {
    const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
    if (link) {
      link.href = faviconUrl;
    }
  }, [faviconUrl]);

  return (
    <Helmet>
      {/* ファビコン */}
      <link rel="icon" type="image/svg+xml" href={faviconUrl} />

      {/* 基本メタタグ */}
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      {keywords && keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}

      {/* Robots メタタグ */}
      <meta name="robots" content={robotsContent} />

      {/* カノニカルURL */}
      {seoData.canonical_url && <link rel="canonical" href={seoData.canonical_url} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={seoData.og_type} />
      {ogTitle && <meta property="og:title" content={ogTitle} />}
      {ogDescription && <meta property="og:description" content={ogDescription} />}
      {ogImageUrl && <meta property="og:image" content={ogImageUrl} />}
      {seoData.canonical_url && <meta property="og:url" content={seoData.canonical_url} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content={seoData.twitter_card} />
      {seoData.twitter_site && <meta name="twitter:site" content={seoData.twitter_site} />}
      {seoData.twitter_creator && <meta name="twitter:creator" content={seoData.twitter_creator} />}
      {ogTitle && <meta name="twitter:title" content={ogTitle} />}
      {ogDescription && <meta name="twitter:description" content={ogDescription} />}
      {ogImageUrl && <meta name="twitter:image" content={ogImageUrl} />}

      {/* 構造化データ (JSON-LD) */}
      {seoData.structured_data && (
        <script type="application/ld+json">
          {JSON.stringify(seoData.structured_data)}
        </script>
      )}

      {/* 言語設定 */}
      <html lang={language === 'ja' ? 'ja' : 'zh-CN'} />
    </Helmet>
  );
};
