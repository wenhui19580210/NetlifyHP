import React from 'react';
import { Mail, MapPin, Calendar, Wrench, FileText } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const Flow: React.FC = () => {
  const { t } = useLanguage();

  const steps = [
    {
      icon: Mail,
      title: { ja: 'お問い合わせ', zh: '咨询' },
      description: { ja: 'メールまたはお電話', zh: '电子邮件或电话' },
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50',
    },
    {
      icon: MapPin,
      title: { ja: '無料現地調査・お見積り', zh: '免费现场调查・报价' },
      description: { ja: '専門スタッフがお伺いします', zh: '专业人员上门' },
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50',
    },
    {
      icon: Calendar,
      title: { ja: '作業日程のご案内', zh: '工作日程通知' },
      description: { ja: 'ご都合に合わせて調整', zh: '根据您的方便安排' },
      color: 'from-orange-500 to-amber-500',
      bgColor: 'from-orange-50 to-amber-50',
    },
    {
      icon: Wrench,
      title: { ja: '点検・清掃作業の実施', zh: '实施检查・清洁工作' },
      description: { ja: '丁寧かつ迅速に対応', zh: '细心且快速处理' },
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50',
    },
    {
      icon: FileText,
      title: { ja: '報告書と改善提案の提出', zh: '提交报告和改善建议' },
      description: { ja: '詳細なレポートをお渡し', zh: '提供详细报告' },
      color: 'from-red-500 to-rose-500',
      bgColor: 'from-red-50 to-rose-50',
    },
  ];

  return (
    <section id="flow" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        {/* セクションタイトル */}
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-2 sm:gap-3">
            <span className="text-2xl sm:text-3xl md:text-4xl">🗓️</span>
            <span>{t('ご依頼の流れ', '委托流程')}</span>
          </h2>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto px-4">
            {t(
              'お問い合わせから作業完了まで、5つのステップで安心サポート',
              '从咨询到工作完成，5个步骤的安心支持'
            )}
          </p>
        </div>

        {/* フローステップ */}
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* 接続線（デスクトップのみ） */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-green-200 via-orange-200 via-purple-200 to-red-200 transform -translate-y-1/2 z-0"></div>

            {/* ステップカード */}
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 relative z-10">
              {steps.map((step, index) => {
                const IconComponent = step.icon;
                
                return (
                  <div key={index} className="relative">
                    {/* ステップ番号（モバイル） */}
                    <div className="lg:hidden absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-br from-primary to-primary-dark text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg z-20">
                      {index + 1}
                    </div>

                    <div className={`bg-gradient-to-br ${step.bgColor} p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2`}>
                      {/* ステップ番号（デスクトップ） */}
                      <div className="hidden lg:flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary to-primary-dark text-white rounded-full font-bold text-xl mb-4 mx-auto shadow-lg">
                        {index + 1}
                      </div>

                      {/* アイコン */}
                      <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${step.color} rounded-xl mb-4 shadow-md`}>
                        <IconComponent className="w-9 h-9 text-white" />
                      </div>

                      {/* タイトル */}
                      <h3 className="text-lg font-bold text-gray-900 mb-2 min-h-[3rem]">
                        {t(step.title.ja, step.title.zh)}
                      </h3>

                      {/* 説明 */}
                      <p className="text-gray-600 text-sm">
                        {t(step.description.ja, step.description.zh)}
                      </p>
                    </div>

                    {/* 矢印（モバイル） */}
                    {index < steps.length - 1 && (
                      <div className="lg:hidden flex justify-center my-4">
                        <div className="text-3xl text-gray-300">↓</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
