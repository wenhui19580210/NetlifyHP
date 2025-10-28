import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Sun, Building2, Wrench, FileText, HelpCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { CompanyTab } from '../components/admin/CompanyTab';
import { ServicesTab } from '../components/admin/ServicesTab';
import { BlogTab } from '../components/admin/BlogTab';
import { FAQTab } from '../components/admin/FAQTab';

type Tab = 'company' | 'services' | 'blog' | 'faq';

export const Admin: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>('company');

  // 未ログインの場合はログインページへリダイレクト
  useEffect(() => {
    if (!user && !loading) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const tabs = [
    { id: 'company' as Tab, label: { ja: '会社情報', zh: '公司信息' }, icon: Building2 },
    { id: 'services' as Tab, label: { ja: 'サービス', zh: '服务' }, icon: Wrench },
    { id: 'blog' as Tab, label: { ja: 'ブログ', zh: '博客' }, icon: FileText },
    { id: 'faq' as Tab, label: { ja: 'FAQ', zh: '常见问题' }, icon: HelpCircle },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">{t('読み込み中...', '加载中...')}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ヘッダー */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                <Sun className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {t('東勝会社 管理画面', '东胜公司 管理系统')}
                </h1>
                <p className="text-xs text-gray-600">CMS</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {user.display_name} (@{user.username})
              </span>
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition-colors"
              >
                {t('公開サイト', '公开网站')}
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                <LogOut size={18} />
                <span>{t('ログアウト', '退出登录')}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* タブナビゲーション */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                    isActive
                      ? 'border-primary text-primary font-semibold'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <IconComponent size={20} />
                  <span>{t(tab.label.ja, tab.label.zh)}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* タブコンテンツ */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === 'company' && <CompanyTab />}
        {activeTab === 'services' && <ServicesTab />}
        {activeTab === 'blog' && <BlogTab />}
        {activeTab === 'faq' && <FAQTab />}
      </div>
    </div>
  );
};
