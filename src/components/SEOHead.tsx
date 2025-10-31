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

  // ブラウザタブ用ファビコンURLを取得（優先順位：browser_favicon_url > favicon_url > デフォルト）
  const faviconUrl = companyInfo?.browser_favicon_url || companyInfo?.favicon_url || '/sun-icon.svg';

  // 🔧 すべての Hooks を条件分岐の前に配置（React Hooks のルール）
  useEffect(() => {
    const fetchSEO = async () => {
      const data = await getSEOSettingByPageKey(pageKey);
      setSeoData(data);
    };

    fetchSEO();
  }, [pageKey, getSEOSettingByPageKey]);

  // ファビコンの動的更新（React Helmetの制限を回避）
  useEffect(() => {
    // 既存のファビコンリンクをすべて削除
    const existingLinks = document.querySelectorAll("link[rel*='icon']");
    existingLinks.forEach(link => link.remove());
    
    // 新しいファビコンリンクを追加
    const link = document.createElement('link');
    link.rel = 'icon';
    
    // ファイル拡張子によってタイプを設定
    if (faviconUrl.endsWith('.svg')) {
      link.type = 'image/svg+xml';
    } else if (faviconUrl.endsWith('.png')) {
      link.type = 'image/png';
    } else if (faviconUrl.endsWith('.ico')) {
      link.type = 'image/x-icon';
    } else if (faviconUrl.endsWith('.jpg') || faviconUrl.endsWith('.jpeg')) {
      link.type = 'image/jpeg';
    }
    
    link.href = faviconUrl;
    document.head.appendChild(link);
  }, [faviconUrl]);

  // SEOデータが取得できない場合はデフォルト値を使用
  if (!seoData) {
    return (
      <Helmet>
        <title>{customTitle || (companyInfo?.name_ja || '会社名')}</title>
        {customDescription && <meta name="description" content={customDescription} />}
        {faviconUrl && <link rel="icon" type="image/svg+xml" href={faviconUrl} />}
        <html lang={language === 'ja' ? 'ja' : 'zh-CN'} />
      </Helmet>
    );
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

  // OG画像は会社ロゴを優先、なければSEO設定のOG画像を使用
  const ogImageUrl = companyInfo?.logo_url || seoData.og_image_url || '';

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
