import React, { useState } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCompanyInfo } from '../hooks/useCompanyInfo';

export const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { data: company } = useCompanyInfo();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { id: 'about', label: { ja: '私たちについて', zh: '关于我们' } },
    { id: 'service', label: { ja: 'サービス内容', zh: '服务内容' } },
    { id: 'result', label: { ja: '導入効果・事例', zh: '导入效果・案例' } },
    { id: 'flow', label: { ja: 'ご依頼の流れ', zh: '委托流程' } },
    { id: 'contact', label: { ja: 'お問い合わせ', zh: '联系我们' } },
  ];

  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* ロゴ */}
          <div className="flex items-center space-x-2 md:space-x-3">
            {company?.logo_url && (
              <img src={company.logo_url} alt="Logo" className="h-8 md:h-10 w-auto flex-shrink-0" />
            )}
            <div className="min-w-0">
              <h1 className="text-base md:text-xl font-bold text-gray-900 truncate">
                {language === 'zh' ? company?.company_name_zh : company?.company_name}
              </h1>
              <p className="text-xs text-gray-600 truncate">
                {language === 'zh' ? company?.business_content_zh : company?.business_content_ja}
              </p>
            </div>
          </div>

          {/* デスクトップメニュー */}
          <nav className="hidden md:flex items-center space-x-6">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleScroll(item.id)}
                className="text-gray-700 hover:text-primary transition-colors"
              >
                {t(item.label.ja, item.label.zh)}
              </button>
            ))}
            
            {/* 言語切替 */}
            <button
              onClick={() => setLanguage(language === 'ja' ? 'zh' : 'ja')}
              className="flex items-center space-x-1 px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              title={t('言語を切り替える', '切换语言')}
            >
              <Globe size={18} />
              <span>{language === 'ja' ? '中文' : '日本語'}</span>
            </button>
          </nav>

          {/* モバイルメニューボタン */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setLanguage(language === 'ja' ? 'zh' : 'ja')}
              className="p-2 text-gray-700 hover:bg-gray-100 rounded"
              title={t('言語を切り替える', '切换语言')}
            >
              <Globe size={20} />
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* モバイルメニュー */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleScroll(item.id)}
                className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {t(item.label.ja, item.label.zh)}
              </button>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};

// ✅ これを追加
export default Header;