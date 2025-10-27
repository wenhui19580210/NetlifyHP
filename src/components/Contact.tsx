import React from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCompanyInfo } from '../hooks/useCompanyInfo';

export const Contact: React.FC = () => {
  const { language, t } = useLanguage();
  const { data: company, loading } = useCompanyInfo();

  if (loading) {
    return (
      <section id="contact" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-gray-500">{t('読み込み中...', '加载中...')}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* セクションタイトル */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('📞 お問い合わせ', '📞 联系我们')}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {language === 'zh' ? company?.company_name_zh : company?.company_name}
          </p>
          <p className="text-gray-600 max-w-2xl mx-auto mt-2">
            {t(
              'まずはお気軽にご相談ください。',
              '请随时咨询。'
            )}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* 連絡先情報 */}
            <div className="space-y-6">
              {/* 電話 */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-md">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {t('お電話でのお問い合わせ', '电话咨询')}
                    </h3>
                    <a
                      href={`tel:${company?.phone?.replace(/-/g, '')}`}
                      className="text-2xl font-bold text-primary hover:text-primary-dark transition-colors"
                    >
                      {company?.phone}
                    </a>
                    <div className="flex items-center mt-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{t('受付時間: 9:00〜18:00', '受理时间: 9:00〜18:00')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* メール */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-md">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {t('メールでのお問い合わせ', '电子邮件咨询')}
                    </h3>
                    <a
                      href={`mailto:${company?.email}`}
                      className="text-lg font-semibold text-primary hover:text-primary-dark transition-colors break-all"
                    >
                      {company?.email}
                    </a>
                    <p className="text-sm text-gray-600 mt-2">
                      {t('24時間受付・1営業日以内に返信', '24小时受理・1个工作日内回复')}
                    </p>
                  </div>
                </div>
              </div>

              {/* 住所 */}
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-md">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {t('所在地', '所在地')}
                    </h3>
                    <p className="text-gray-700">
                      {language === 'zh' ? company?.address_zh : company?.address_ja}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* お問い合わせフォーム（簡易版） */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {t('お問い合わせフォーム', '咨询表单')}
              </h3>
              <div className="space-y-4">
                <p className="text-gray-700">
                  {t(
                    'お電話またはメールにて、お気軽にお問い合わせください。',
                    '请通过电话或电子邮件随时联系我们。'
                  )}
                </p>
                <div className="bg-white p-4 rounded-lg border-2 border-dashed border-primary">
                  <p className="text-sm text-gray-600 mb-3">
                    {t('お問い合わせ内容例:', '咨询内容示例:')}
                  </p>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>{t('点検・清掃のお見積り依頼', '检查・清洁报价申请')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>{t('トラブル対応のご相談', '故障处理咨询')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>{t('定期メンテナンス契約について', '关于定期维护合同')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>{t('その他ご質問・ご相談', '其他问题・咨询')}</span>
                    </li>
                  </ul>
                </div>
                <a
                  href={`mailto:${company?.email}?subject=${encodeURIComponent(t('太陽光発電メンテナンスのお問い合わせ', '太阳能发电维护咨询'))}`}
                  className="block w-full bg-gradient-to-r from-primary to-primary-dark text-white text-center py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
                >
                  {t('メールで問い合わせる', '通过电子邮件咨询')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
