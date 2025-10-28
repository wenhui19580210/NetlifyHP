import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Eye, EyeOff, RotateCcw, Calendar, Bold, Italic, Link2, List } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../lib/database.types';

type BlogPost = Database['public']['Tables']['blog_posts']['Row'];
type BlogPostInsert = Database['public']['Tables']['blog_posts']['Insert'];
// type BlogPostUpdate = Database['public']['Tables']['blog_posts']['Update'];

export const BlogTab: React.FC = () => {
  const { language, t } = useLanguage();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<BlogPost>>({});
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('publish_date', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditData({
      title_ja: '',
      title_zh: '',
      content_ja: '',
      content_zh: '',
      publish_date: new Date().toISOString().split('T')[0],
      is_visible: true,
    });
  };

  const handleEdit = (post: BlogPost) => {
    setEditingId(post.id);
    setEditData(post);
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
    setEditData({});
  };

  const handleSave = async () => {
    try {
      if (isAdding) {
        // 新規追加時は必須フィールドとデフォルト値を確実に設定
        const insertData: BlogPostInsert = {
          title_ja: editData.title_ja || '',
          title_zh: editData.title_zh || null,
          content_ja: editData.content_ja || null,
          content_zh: editData.content_zh || null,
          image_url: editData.image_url || null,
          publish_date: editData.publish_date || new Date().toISOString().split('T')[0],
          is_visible: editData.is_visible ?? true,
        };
        
        // @ts-ignore - Supabase型定義の問題を回避
        const { error } = await supabase
          .from('blog_posts')
          .insert(insertData);
        if (error) throw error;
      } else if (editingId) {
        // @ts-ignore - Supabase型定義の問題を回避
        const { error } = await supabase
          .from('blog_posts')
          .update(editData)
          .eq('id', editingId);
        if (error) throw error;
      }
      
      await fetchPosts();
      handleCancel();
    } catch (err: any) {
      console.error('Error saving post:', err);
      alert(t('保存に失敗しました', '保存失败') + ': ' + (err.message || ''));
    }
  };

  const handleToggleVisible = async (post: BlogPost) => {
    try {
      // @ts-ignore - Supabase型定義の問題を回避
      const { error } = await supabase
        .from('blog_posts')
        .update({ is_visible: !post.is_visible })
        .eq('id', post.id);
      if (error) throw error;
      await fetchPosts();
    } catch (err) {
      console.error('Error toggling visibility:', err);
    }
  };

  const handleDelete = async (post: BlogPost) => {
    if (!confirm(t('本当に削除しますか？', '确定要删除吗？'))) return;
    
    try {
      // @ts-ignore - Supabase型定義の問題を回避
      const { error } = await supabase
        .from('blog_posts')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', post.id);
      if (error) throw error;
      await fetchPosts();
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  const handleRestore = async (post: BlogPost) => {
    try {
      // @ts-ignore - Supabase型定義の問題を回避
      const { error } = await supabase
        .from('blog_posts')
        .update({ deleted_at: null })
        .eq('id', post.id);
      if (error) throw error;
      await fetchPosts();
    } catch (err) {
      console.error('Error restoring post:', err);
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

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {t('ブログ記事管理', '博客文章管理')}
        </h2>
        <button
          onClick={handleAdd}
          disabled={isAdding}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
        >
          <Plus size={20} />
          <span>{t('新規追加', '新增')}</span>
        </button>
      </div>

      {/* 追加フォーム */}
      {isAdding && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            {t('新しい記事を追加', '添加新文章')}
          </h3>
          <BlogForm
            data={editData}
            onChange={setEditData}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      )}

      {/* 記事リスト */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className={`bg-white rounded-lg shadow-md p-6 ${
              post.deleted_at ? 'opacity-50' : ''
            }`}
          >
            {editingId === post.id ? (
              <BlogForm
                data={editData}
                onChange={setEditData}
                onSave={handleSave}
                onCancel={handleCancel}
              />
            ) : (
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Calendar size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {new Date(post.publish_date).toLocaleDateString(language === 'zh' ? 'zh-CN' : 'ja-JP')}
                      </span>
                      {!post.is_visible && (
                        <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded">
                          {t('非表示', '隐藏')}
                        </span>
                      )}
                      {post.deleted_at && (
                        <span className="px-2 py-1 bg-red-200 text-red-600 text-xs rounded">
                          {t('削除済み', '已删除')}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {post.title_ja}
                    </h3>
                    <p className="text-gray-600">{post.title_zh}</p>
                  </div>
                  <div className="flex space-x-2">
                    {post.deleted_at ? (
                      <button
                        onClick={() => handleRestore(post)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                        title={t('復元', '恢复')}
                      >
                        <RotateCcw size={20} />
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleToggleVisible(post)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title={post.is_visible ? t('非表示にする', '隐藏') : t('表示する', '显示')}
                        >
                          {post.is_visible ? <Eye size={20} /> : <EyeOff size={20} />}
                        </button>
                        <button
                          onClick={() => handleEdit(post)}
                          className="p-2 text-primary hover:bg-orange-50 rounded transition-colors"
                          title={t('編集', '编辑')}
                        >
                          <Edit2 size={20} />
                        </button>
                        <button
                          onClick={() => handleDelete(post)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title={t('削除', '删除')}
                        >
                          <Trash2 size={20} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
                  <div>
                    <p className="font-semibold mb-1">{t('本文（日本語）', '正文（日语）')}</p>
                    <p className="whitespace-pre-line line-clamp-3">{post.content_ja}</p>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">{t('本文（中国語）', '正文（中文）')}</p>
                    <p className="whitespace-pre-line line-clamp-3">{post.content_zh}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ブログフォームコンポーネント
const BlogForm: React.FC<{
  data: Partial<BlogPost>;
  onChange: (data: Partial<BlogPost>) => void;
  onSave: () => void;
  onCancel: () => void;
}> = ({ data, onChange, onSave, onCancel }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'ja' | 'zh'>('ja');

  const insertFormatting = (field: 'content_ja' | 'content_zh', format: string) => {
    const currentContent = data[field] || '';
    let newContent = '';
    
    switch (format) {
      case 'bold':
        newContent = currentContent + '\n**太字テキスト**';
        break;
      case 'italic':
        newContent = currentContent + '\n*斜体テキスト*';
        break;
      case 'link':
        newContent = currentContent + '\n<a href="URL">リンクテキスト</a>';
        break;
      case 'list':
        newContent = currentContent + '\n• リスト項目';
        break;
      case 'heading':
        newContent = currentContent + '\n<h2>見出し</h2>';
        break;
      case 'paragraph':
        newContent = currentContent + '\n<p>段落テキスト</p>';
        break;
      default:
        newContent = currentContent;
    }
    
    onChange({ ...data, [field]: newContent });
  };

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t('公開日', '发布日期')}
          </label>
          <input
            type="date"
            value={data.publish_date || ''}
            onChange={(e) => onChange({ ...data, publish_date: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t('アイキャッチ画像URL', '特色图片URL')}
          </label>
          <input
            type="url"
            value={data.image_url || ''}
            onChange={(e) => onChange({ ...data, image_url: e.target.value })}
            placeholder="https://example.com/image.jpg"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t('タイトル（日本語）', '标题（日语）')} *
          </label>
          <input
            type="text"
            value={data.title_ja || ''}
            onChange={(e) => onChange({ ...data, title_ja: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t('タイトル（中国語）', '标题（中文）')}
          </label>
          <input
            type="text"
            value={data.title_zh || ''}
            onChange={(e) => onChange({ ...data, title_zh: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* タブ切り替え - WordPress風 */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-1">
          <button
            type="button"
            onClick={() => setActiveTab('ja')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'ja'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            日本語
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('zh')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'zh'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            中文
          </button>
        </div>
      </div>

      {/* 日本語コンテンツ */}
      {activeTab === 'ja' && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t('本文（日本語）', '正文（日语）')}
          </label>
          
          {/* 簡易ツールバー */}
          <div className="flex items-center space-x-2 mb-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
            <button
              type="button"
              onClick={() => insertFormatting('content_ja', 'bold')}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="太字"
            >
              <Bold size={16} />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('content_ja', 'italic')}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="斜体"
            >
              <Italic size={16} />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('content_ja', 'link')}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="リンク"
            >
              <Link2 size={16} />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('content_ja', 'list')}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="リスト"
            >
              <List size={16} />
            </button>
            <div className="border-l border-gray-300 h-6 mx-2"></div>
            <button
              type="button"
              onClick={() => insertFormatting('content_ja', 'heading')}
              className="p-2 hover:bg-gray-200 rounded transition-colors text-sm font-medium"
              title="見出し"
            >
              H2
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('content_ja', 'paragraph')}
              className="p-2 hover:bg-gray-200 rounded transition-colors text-sm"
              title="段落"
            >
              P
            </button>
          </div>
          
          <textarea
            value={data.content_ja || ''}
            onChange={(e) => onChange({ ...data, content_ja: e.target.value })}
            rows={12}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary font-mono text-sm"
            placeholder="HTMLタグが使用できます: <h2>, <p>, <strong>, <em>, <a>, <ul>, <li> など"
          />
          <p className="text-xs text-gray-500 mt-1">
            💡 HTMLタグを使用して書式設定が可能です。改行は自動的に反映されます。
          </p>
        </div>
      )}

      {/* 中国語コンテンツ */}
      {activeTab === 'zh' && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t('本文（中国語）', '正文（中文）')}
          </label>
          
          {/* 簡易ツールバー */}
          <div className="flex items-center space-x-2 mb-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
            <button
              type="button"
              onClick={() => insertFormatting('content_zh', 'bold')}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="粗体"
            >
              <Bold size={16} />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('content_zh', 'italic')}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="斜体"
            >
              <Italic size={16} />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('content_zh', 'link')}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="链接"
            >
              <Link2 size={16} />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('content_zh', 'list')}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="列表"
            >
              <List size={16} />
            </button>
            <div className="border-l border-gray-300 h-6 mx-2"></div>
            <button
              type="button"
              onClick={() => insertFormatting('content_zh', 'heading')}
              className="p-2 hover:bg-gray-200 rounded transition-colors text-sm font-medium"
              title="标题"
            >
              H2
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('content_zh', 'paragraph')}
              className="p-2 hover:bg-gray-200 rounded transition-colors text-sm"
              title="段落"
            >
              P
            </button>
          </div>
          
          <textarea
            value={data.content_zh || ''}
            onChange={(e) => onChange({ ...data, content_zh: e.target.value })}
            rows={12}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary font-mono text-sm"
            placeholder="可以使用HTML标签: <h2>, <p>, <strong>, <em>, <a>, <ul>, <li> 等"
          />
          <p className="text-xs text-gray-500 mt-1">
            💡 可以使用HTML标签进行格式设置。换行会自动反映。
          </p>
        </div>
      )}

      <div className="flex items-center space-x-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
        <span>ℹ️</span>
        <span>{t('画像はUnsplash、Pexels等の無料画像サイトのURLを使用できます', '图片可以使用Unsplash、Pexels等免费图片网站的URL')}</span>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          onClick={onCancel}
          type="button"
          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <X size={20} />
          <span>{t('キャンセル', '取消')}</span>
        </button>
        <button
          onClick={onSave}
          type="button"
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Save size={20} />
          <span>{t('保存', '保存')}</span>
        </button>
      </div>
    </div>
  );
};
