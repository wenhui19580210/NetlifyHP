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
import { useCompanyInfo } from '../hooks/useCompanyInfo';
import { useTheme } from '../contexts/ThemeContext';

export const Home: React.FC = () => {
  const { data: company } = useCompanyInfo();
  const { setColors } = useTheme();

  // 会社情報からカラーテーマを取得して設定
  useEffect(() => {
    if (company?.main_color && company?.sub_color) {
      setColors(company.main_color, company.sub_color);
    }
  }, [company, setColors]);

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <About />
        <Services />
        <Results />
        <Flow />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};
