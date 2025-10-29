import React, { useEffect } from 'react';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { About } from '../components/About';
import { Services } from '../components/Services';
import { Results } from '../components/Results';
import { Flow } from '../components/Flow';
import { FAQ } from '../components/FAQ';
import { Contact } from '../components/Contact';
import { Footer } from '../components/Footer';
import { AnnouncementBanner } from '../components/AnnouncementBanner';
import { SEOHead } from '../components/SEOHead';
import { useCompanyInfo } from '../hooks/useCompanyInfo';
import { usePageSections } from '../hooks/usePageSections';
import { useTheme } from '../contexts/ThemeContext';

export const Home: React.FC = () => {
  const { data: company } = useCompanyInfo();
  const { sections, getSectionConfig } = usePageSections();
  const { setColors } = useTheme();

  // 会社情報からカラーテーマを取得して設定
  useEffect(() => {
    if (company?.main_color && company?.sub_color) {
      setColors(company.main_color, company.sub_color);
    }
  }, [company, setColors]);

  // セクションコンポーネントのマッピング
  const sectionComponents: { [key: string]: React.ComponentType<any> } = {
    hero: Hero,
    about: About,
    services: Services,
    results: Results,
    flow: Flow,
    faq: FAQ,
    contact: Contact,
  };

  // セクションをラップしてスタイルを適用
  const renderSection = (sectionKey: string) => {
    const SectionComponent = sectionComponents[sectionKey];
    if (!SectionComponent) return null;

    const config = getSectionConfig(sectionKey);
    if (!config) return null;

    const sectionStyle: React.CSSProperties = {};
    if (config.background_color) {
      sectionStyle.backgroundColor = config.background_color;
    }
    if (config.text_color) {
      sectionStyle.color = config.text_color;
    }

    return (
      <div key={sectionKey} style={sectionStyle}>
        <SectionComponent config={config} />
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <SEOHead pageKey="home" />
      <Header />
      {/* 緊急告知バナー */}
      <div className="container mx-auto px-4 pt-20">
        <AnnouncementBanner />
      </div>
      <main>
        {sections.map(section => renderSection(section.section_key))}
      </main>
      <Footer />
    </div>
  );
};
