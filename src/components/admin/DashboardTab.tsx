import React, { useState, useEffect } from 'react';
import { BarChart3, FileText, HelpCircle, Wrench, TrendingUp, Eye, EyeOff, Trash2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../lib/supabase';

interface Stats {
  services: {
    total: number;
    visible: number;
    hidden: number;
    deleted: number;
  };
  blogPosts: {
    total: number;
    visible: number;
    hidden: number;
    deleted: number;
  };
  faqs: {
    total: number;
    visible: number;
    hidden: number;
    deleted: number;
  };
}

export const DashboardTab: React.FC = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState<Stats>({
    services: { total: 0, visible: 0, hidden: 0, deleted: 0 },
    blogPosts: { total: 0, visible: 0, hidden: 0, deleted: 0 },
    faqs: { total: 0, visible: 0, hidden: 0, deleted: 0 },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // サービスの統計
      const { data: services } = await supabase.from('services').select('is_visible, deleted_at');
      const servicesStats = {
        total: services?.length || 0,
        visible: services?.filter((s) => s.is_visible && !s.deleted_at).length || 0,
        hidden: services?.filter((s) => !s.is_visible && !s.deleted_at).length || 0,
        deleted: services?.filter((s) => s.deleted_at).length || 0,
      };

      // ブログ記事の統計
      const { data: posts } = await supabase.from('blog_posts').select('is_visible, deleted_at');
      const blogPostsStats = {
        total: posts?.length || 0,
        visible: posts?.filter((p) => p.is_visible && !p.deleted_at).length || 0,
        hidden: posts?.filter((p) => !p.is_visible && !p.deleted_at).length || 0,
        deleted: posts?.filter((p) => p.deleted_at).length || 0,
      };

      // FAQの統計
      const { data: faqs } = await supabase.from('faqs').select('is_visible, deleted_at');
      const faqsStats = {
        total: faqs?.length || 0,
        visible: faqs?.filter((f) => f.is_visible && !f.deleted_at).length || 0,
        hidden: faqs?.filter((f) => !f.is_visible && !f.deleted_at).length || 0,
        deleted: faqs?.filter((f) => f.deleted_at).length || 0,
      };

      setStats({
        services: servicesStats,
        blogPosts: blogPostsStats,
        faqs: faqsStats,
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">{t('読み込み中...', '加载中...')}</p>
      </div>
    );
  }

  const StatCard: React.FC<{
    title: string;
    icon: React.ReactNode;
    stats: { total: number; visible: number; hidden: number; deleted: number };
    color: string;
  }> = ({ title, icon, stats, color }) => (
    <div className={`bg-white rounded-xl shadow-md p-6 border-l-4 hover:shadow-lg transition-shadow`} style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-lg`} style={{ backgroundColor: `${color}20` }}>
            <div style={{ color }}>{icon}</div>
          </div>
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        </div>
        <div className="text-3xl font-bold" style={{ color }}>
          {stats.total}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 text-sm">
        <div className="text-center p-2 bg-green-50 rounded-lg">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Eye size={14} className="text-green-600" />
            <span className="font-semibold text-green-700">{stats.visible}</span>
          </div>
          <p className="text-xs text-green-600">{t('公開中', '公开中')}</p>
        </div>
        <div className="text-center p-2 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <EyeOff size={14} className="text-gray-600" />
            <span className="font-semibold text-gray-700">{stats.hidden}</span>
          </div>
          <p className="text-xs text-gray-600">{t('非表示', '隐藏')}</p>
        </div>
        <div className="text-center p-2 bg-red-50 rounded-lg">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Trash2 size={14} className="text-red-600" />
            <span className="font-semibold text-red-700">{stats.deleted}</span>
          </div>
          <p className="text-xs text-red-600">{t('削除済み', '已删除')}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <BarChart3 className="w-8 h-8 text-primary" />
          <h2 className="text-3xl font-bold text-gray-900">
            {t('ダッシュボード', '仪表板')}
          </h2>
        </div>
        <p className="text-gray-600">
          {t('コンテンツの統計情報と概要', '内容统计信息和概览')}
        </p>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title={t('サービス', '服务')}
          icon={<Wrench size={24} />}
          stats={stats.services}
          color="#f59e0b"
        />
        <StatCard
          title={t('ブログ記事', '博客文章')}
          icon={<FileText size={24} />}
          stats={stats.blogPosts}
          color="#0ea5e9"
        />
        <StatCard
          title={t('FAQ', '常见问题')}
          icon={<HelpCircle size={24} />}
          stats={stats.faqs}
          color="#8b5cf6"
        />
      </div>

      {/* 概要カード */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* クイックアクション */}
        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl shadow-md p-6 border border-orange-100">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="w-6 h-6 text-orange-600" />
            <h3 className="text-xl font-bold text-gray-900">
              {t('クイックアクション', '快速操作')}
            </h3>
          </div>
          <div className="space-y-3">
            <p className="text-sm text-gray-700">
              {t('上部のタブから各種コンテンツを管理できます。', '可以从上方标签管理各种内容。')}
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                <span>{t('会社情報: 基本情報とカラーテーマを設定', '公司信息：设置基本信息和颜色主题')}</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                <span>{t('サービス: 提供サービスの追加・編集', '服务：添加・编辑提供的服务')}</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                <span>{t('ブログ: ニュースや施工事例を投稿', '博客：发布新闻和施工案例')}</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                <span>{t('FAQ: よくある質問を管理', '常见问题：管理常见问题')}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* システム情報 */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl shadow-md p-6 border border-blue-100">
          <div className="flex items-center space-x-3 mb-4">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-900">
              {t('システム情報', '系统信息')}
            </h3>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-blue-100">
              <span className="text-gray-600">{t('総コンテンツ数', '总内容数')}</span>
              <span className="font-bold text-blue-600">
                {stats.services.total + stats.blogPosts.total + stats.faqs.total}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-blue-100">
              <span className="text-gray-600">{t('公開中', '公开中')}</span>
              <span className="font-bold text-green-600">
                {stats.services.visible + stats.blogPosts.visible + stats.faqs.visible}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-blue-100">
              <span className="text-gray-600">{t('非表示', '隐藏')}</span>
              <span className="font-bold text-gray-600">
                {stats.services.hidden + stats.blogPosts.hidden + stats.faqs.hidden}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">{t('削除済み', '已删除')}</span>
              <span className="font-bold text-red-600">
                {stats.services.deleted + stats.blogPosts.deleted + stats.faqs.deleted}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ヒント */}
      <div className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
        <p className="text-sm text-gray-700">
          💡 <strong>{t('ヒント', '提示')}:</strong>{' '}
          {t(
            '削除したコンテンツは各タブで「復元」ボタンから復旧できます。非表示にしたコンテンツは公開サイトに表示されません。',
            '删除的内容可以从各标签的"恢复"按钮恢复。隐藏的内容不会在公开网站上显示。'
          )}
        </p>
      </div>
    </div>
  );
};
