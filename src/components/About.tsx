import React from 'react';
import { Building2, User, Calendar, DollarSign } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCompanyInfo } from '../hooks/useCompanyInfo';

export const About: React.FC = () => {
  const { language, t } = useLanguage();
  const { data: company, loading } = useCompanyInfo();

  if (loading) {
    return (
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-gray-500">{t('読み込み中...', '加载中...')}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* セクションタイトル */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('🌞 私たちについて', '🌞 关于我们')}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t(
              '私たち 東勝会社 は、太陽光発電システムの長期安定稼働を支える専門チームです。',
              '我们东胜公司，是支持太阳能发电系统长期稳定运行的专业团队。'
            )}
          </p>
        </div>

        {/* 会社概要 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-3">
              <Building2 className="w-6 h-6 text-blue-600 mr-2" />
              <h3 className="font-bold text-gray-900">{t('会社名', '公司名称')}</h3>
            </div>
            <p className="text-gray-700">
              {language === 'zh' ? company?.company_name_zh : company?.company_name}
            </p>
            <p className="text-sm text-gray-600 mt-1">{company?.company_name_en}</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-3">
              <User className="w-6 h-6 text-green-600 mr-2" />
              <h3 className="font-bold text-gray-900">{t('代表取締役', '董事长')}</h3>
            </div>
            <p className="text-gray-700">{company?.ceo_name}</p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-3">
              <Calendar className="w-6 h-6 text-orange-600 mr-2" />
              <h3 className="font-bold text-gray-900">{t('創業', '创业')}</h3>
            </div>
            <p className="text-gray-700">
              {company?.established && new Date(company.established).getFullYear()}{t('年', '年')}
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-3">
              <DollarSign className="w-6 h-6 text-purple-600 mr-2" />
              <h3 className="font-bold text-gray-900">{t('資本金', '注册资金')}</h3>
            </div>
            <p className="text-gray-700">{company?.capital}</p>
          </div>
        </div>

        {/* 代表メッセージ */}
        {company?.ceo_message_ja && (
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-8 md:p-12 rounded-2xl shadow-lg">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {t('代表からのメッセージ', '董事长致辞')}
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                {t(`代表取締役 ${company.ceo_name}`, `董事长 ${company.ceo_name}`)}
              </p>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {language === 'zh' ? company.ceo_message_zh : company.ceo_message_ja}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
