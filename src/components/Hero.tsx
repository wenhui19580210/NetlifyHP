import React from 'react';
import { Sun, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCompanyInfo } from '../hooks/useCompanyInfo';

export const Hero: React.FC = () => {
  const { language, t } = useLanguage();
  const { data: company } = useCompanyInfo();

  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // ヒーローアイコンの表示制御とURL取得
  // hero_icon_visibleがtrueの場合のみ表示（明示的にtrueでなければ非表示）
  const shouldShowIcon = company?.hero_icon_visible === true;
  // hero_icon_urlがなければbrowser_favicon_urlを使用、それもなければデフォルトの/sun-icon.svgを使用
  const iconUrl = company?.hero_icon_url || company?.browser_favicon_url || '/sun-icon.svg';

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 pt-16">
      {/* 背景装飾 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 left-10 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-80 h-80 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* アイコン - 管理画面から制御可能 */}
          {shouldShowIcon && (
            <div className="inline-flex items-center justify-center mb-6">
              {iconUrl ? (
                <img
                  src={iconUrl}
                  alt="Company Icon"
                  className="w-20 h-20 object-contain"
                  onError={(e) => {
                    // 画像読み込みエラー時はSunアイコンにフォールバック（背景付き）
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      const fallbackIcon = document.createElement('div');
                      fallbackIcon.className = 'inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-lg';
                      fallbackIcon.innerHTML = '<svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>';
                      parent.appendChild(fallbackIcon);
                    }
                  }}
                />
              ) : (
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-lg">
                  <Sun className="w-12 h-12 text-white" />
                </div>
              )}
            </div>
          )}

          {/* メインキャッチコピー */}
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            {language === 'zh' ? company?.company_name_zh : company?.company_name}
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-700 mb-4 font-medium">
            {language === 'zh' ? company?.business_content_zh : company?.business_content_ja}
          </p>

          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            {t(
              '「設置して終わり」ではなく、「発電を続ける力」を守ることが使命です。',
              '我们的使命不是"安装完就结束"，而是守护"持续发电的力量"。'
            )}
          </p>

          {/* CTAボタン */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => handleScroll('contact')}
              className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-all transform hover:scale-105 shadow-lg"
            >
              {t('お問い合わせ', '联系我们')}
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
            <button
              onClick={() => handleScroll('service')}
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary border-2 border-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-all transform hover:scale-105 shadow-lg"
            >
              {t('サービス詳細', '服务详情')}
            </button>
          </div>
        </div>
      </div>

      {/* スクロールインジケーター */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};
