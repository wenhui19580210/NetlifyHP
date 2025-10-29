import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../contexts/LanguageContext';
import { useSEOSettings } from '../hooks/useSEOSettings';
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

  return (
    <Helmet>
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
      {seoData.og_image_url && <meta property="og:image" content={seoData.og_image_url} />}
      {seoData.canonical_url && <meta property="og:url" content={seoData.canonical_url} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content={seoData.twitter_card} />
      {seoData.twitter_site && <meta name="twitter:site" content={seoData.twitter_site} />}
      {seoData.twitter_creator && <meta name="twitter:creator" content={seoData.twitter_creator} />}
      {ogTitle && <meta name="twitter:title" content={ogTitle} />}
      {ogDescription && <meta name="twitter:description" content={ogDescription} />}
      {seoData.og_image_url && <meta name="twitter:image" content={seoData.og_image_url} />}

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
