import React from 'react';
import { Sun } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCompanyInfo } from '../hooks/useCompanyInfo';

export const Footer: React.FC = () => {
  const { language } = useLanguage();
  const { data: company } = useCompanyInfo();

  const currentYear = new Date().getFullYear();

  // フッターロゴはファビコンを優先的に使用
  const footerLogoUrl = company?.favicon_url;

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* 会社情報 */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              {footerLogoUrl ? (
                <img 
                  src={footerLogoUrl} 
                  alt="Company Logo" 
                  className="w-8 h-8 object-contain"
                  onError={(e) => {
                    // 画像読み込みエラー時はSunアイコンにフォールバック
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent && !parent.querySelector('svg')) {
                      const sunIcon = document.createElement('div');
                      sunIcon.innerHTML = '<svg class="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>';
                      parent.appendChild(sunIcon);
                    }
                  }}
                />
              ) : (
                <Sun className="w-8 h-8 text-yellow-400" />
              )}
              <h3 className="text-xl font-bold">
                {language === 'zh' ? company?.company_name_zh : company?.company_name}
              </h3>
            </div>
            <p className="text-gray-400 text-sm">
              {language === 'zh' ? company?.business_content_zh : company?.business_content_ja}
            </p>
          </div>

          {/* 連絡先 */}
          <div>
            <h4 className="text-lg font-bold mb-4">
              {language === 'zh' ? '联系方式' : '連絡先'}
            </h4>
            <div className="space-y-2 text-gray-400 text-sm">
              <p>{company?.phone}</p>
              <p>{company?.email}</p>
              <p>{language === 'zh' ? company?.address_zh : company?.address_ja}</p>
            </div>
          </div>

          {/* クイックリンク */}
          <div>
            <h4 className="text-lg font-bold mb-4">
              {language === 'zh' ? '快速链接' : 'クイックリンク'}
            </h4>
            <div className="space-y-2">
              {[
                { id: 'about', label: { ja: '私たちについて', zh: '关于我们' } },
                { id: 'service', label: { ja: 'サービス内容', zh: '服务内容' } },
                { id: 'result', label: { ja: '導入効果・事例', zh: '导入效果・案例' } },
                { id: 'contact', label: { ja: 'お問い合わせ', zh: '联系我们' } },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    const element = document.getElementById(item.id);
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="block text-gray-400 hover:text-white transition-colors text-sm"
                >
                  {language === 'zh' ? item.label.zh : item.label.ja}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* コピーライト */}
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} {company?.company_name_en || 'Tokatsu Co., Ltd.'}. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
// ✅ これを追加！
export default Footer;