import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useServices } from '../hooks/useServices';
import * as Icons from 'lucide-react';

export const Services: React.FC = () => {
  const { language, t } = useLanguage();
  const { data: services, loading } = useServices();

  if (loading) {
    return (
      <section id="service" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-gray-500">{t('読み込み中...', '加载中...')}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="service" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* セクションタイトル */}
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-2 sm:gap-3">
            <span className="text-2xl sm:text-3xl md:text-4xl">🔧</span>
            <span>{t('サービス内容', '服务内容')}</span>
          </h2>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto px-4">
            {t(
              '太陽光発電システムの長期安定稼働を支える、充実したサービスラインナップ',
              '支持太阳能发电系统长期稳定运行的完善服务阵容'
            )}
          </p>
        </div>

        {/* サービスカード */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon && (Icons as any)[service.icon] 
              ? (Icons as any)[service.icon] 
              : Icons.Star;

            const colors = [
              'from-blue-500 to-cyan-500',
              'from-green-500 to-emerald-500',
              'from-orange-500 to-amber-500',
              'from-purple-500 to-pink-500',
            ];
            const bgColors = [
              'from-blue-50 to-cyan-50',
              'from-green-50 to-emerald-50',
              'from-orange-50 to-amber-50',
              'from-purple-50 to-pink-50',
            ];

            return (
              <div
                key={service.id}
                className={`bg-gradient-to-br ${bgColors[index % 4]} p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1`}
              >
                {/* アイコン */}
                <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${colors[index % 4]} rounded-xl mb-4 shadow-md`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>

                {/* サービス名 */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {language === 'zh' ? service.service_name_zh : service.service_name_ja}
                </h3>

                {/* 説明 */}
                <div className="text-gray-700 space-y-2">
                  {(language === 'zh' ? service.description_zh : service.description_ja)
                    ?.split('\n')
                    .map((line, i) => (
                      <p key={i} className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span className="flex-1">{line}</span>
                      </p>
                    ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
