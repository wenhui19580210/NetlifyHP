import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Eye, EyeOff, RotateCcw, AlertCircle, Calendar } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../lib/database.types';

type Announcement = Database['public']['Tables']['announcements']['Row'];
// type AnnouncementInsert = Database['public']['Tables']['announcements']['Insert'];
// type AnnouncementUpdate = Database['public']['Tables']['announcements']['Update'];

export const AnnouncementsTab: React.FC = () => {
  const { t } = useLanguage();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Announcement>>({});
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('priority', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnnouncements(data || []);
    } catch (err) {
      console.error('Error fetching announcements:', err);
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
      is_visible: false,
      priority: 0,
      background_color: '#fef3c7',
      text_color: '#92400e',
    });
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingId(announcement.id);
    setEditData(announcement);
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
    setEditData({});
  };

  const handleSave = async () => {
    try {
      if (isAdding) {
        // @ts-ignore - Supabase型定義の問題を回避
        const { error } = await supabase
          .from('announcements')
          .insert(editData);
        if (error) throw error;
      } else if (editingId) {
        // @ts-ignore - Supabase型定義の問題を回避
        const { error } = await supabase
          .from('announcements')
          .update(editData)
          .eq('id', editingId);
        if (error) throw error;
      }
      
      await fetchAnnouncements();
      handleCancel();
    } catch (err) {
      console.error('Error saving announcement:', err);
      alert(t('保存に失敗しました', '保存失败'));
    }
  };

  const handleToggleVisible = async (announcement: Announcement) => {
    try {
      // @ts-ignore - Supabase型定義の問題を回避
      const { error } = await supabase
        .from('announcements')
        .update({ is_visible: !announcement.is_visible })
        .eq('id', announcement.id);
      if (error) throw error;
      await fetchAnnouncements();
    } catch (err) {
      console.error('Error toggling visibility:', err);
    }
  };

  const handleDelete = async (announcement: Announcement) => {
    if (!confirm(t('本当に削除しますか？', '确定要删除吗？'))) return;
    
    try {
      // @ts-ignore - Supabase型定義の問題を回避
      const { error } = await supabase
        .from('announcements')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', announcement.id);
      if (error) throw error;
      await fetchAnnouncements();
    } catch (err) {
      console.error('Error deleting announcement:', err);
    }
  };

  const handleRestore = async (announcement: Announcement) => {
    try {
      // @ts-ignore - Supabase型定義の問題を回避
      const { error } = await supabase
        .from('announcements')
        .update({ deleted_at: null })
        .eq('id', announcement.id);
      if (error) throw error;
      await fetchAnnouncements();
    } catch (err) {
      console.error('Error restoring announcement:', err);
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
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-bold text-blue-900 mb-1">
              {t('緊急告知機能について', '关于紧急公告功能')}
            </h3>
            <p className="text-sm text-blue-800">
              {t(
                '重要なお知らせや緊急情報を公開サイトのトップに表示できます。表示/非表示、期間設定、優先度の管理が可能です。',
                '可以在公开网站顶部显示重要通知或紧急信息。可以管理显示/隐藏、期间设置、优先级。'
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {t('緊急告知管理', '紧急公告管理')}
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
            {t('新しい告知を追加', '添加新公告')}
          </h3>
          <AnnouncementForm
            data={editData}
            onChange={setEditData}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      )}

      {/* 告知リスト */}
      <div className="space-y-4">
        {announcements.map((announcement) => (
          <div
            key={announcement.id}
            className={`bg-white rounded-lg shadow-md p-6 ${
              announcement.deleted_at ? 'opacity-50' : ''
            }`}
          >
            {editingId === announcement.id ? (
              <AnnouncementForm
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
                      <h3 className="text-xl font-bold text-gray-900">
                        {announcement.title_ja}
                      </h3>
                      <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded">
                        {t('優先度', '优先级')}: {announcement.priority}
                      </span>
                      {!announcement.is_visible && (
                        <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded">
                          {t('非表示', '隐藏')}
                        </span>
                      )}
                      {announcement.deleted_at && (
                        <span className="px-2 py-1 bg-red-200 text-red-600 text-xs rounded">
                          {t('削除済み', '已删除')}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-2">{announcement.title_zh}</p>
                    {(announcement.start_date || announcement.end_date) && (
                      <div className="flex items-center text-sm text-gray-500 space-x-2">
                        <Calendar size={14} />
                        <span>
                          {announcement.start_date && new Date(announcement.start_date).toLocaleDateString('ja-JP')}
                          {announcement.start_date && announcement.end_date && ' 〜 '}
                          {announcement.end_date && new Date(announcement.end_date).toLocaleDateString('ja-JP')}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    {announcement.deleted_at ? (
                      <button
                        onClick={() => handleRestore(announcement)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                        title={t('復元', '恢复')}
                      >
                        <RotateCcw size={20} />
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleToggleVisible(announcement)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title={announcement.is_visible ? t('非表示にする', '隐藏') : t('表示する', '显示')}
                        >
                          {announcement.is_visible ? <Eye size={20} /> : <EyeOff size={20} />}
                        </button>
                        <button
                          onClick={() => handleEdit(announcement)}
                          className="p-2 text-primary hover:bg-orange-50 rounded transition-colors"
                          title={t('編集', '编辑')}
                        >
                          <Edit2 size={20} />
                        </button>
                        <button
                          onClick={() => handleDelete(announcement)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title={t('削除', '删除')}
                        >
                          <Trash2 size={20} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                
                {/* プレビュー */}
                <div
                  className="mt-4 p-4 rounded-lg"
                  style={{
                    backgroundColor: announcement.background_color,
                    color: announcement.text_color,
                  }}
                >
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-semibold mb-1">{t('内容（日本語）', '内容（日语）')}</p>
                      <p className="whitespace-pre-line">{announcement.content_ja}</p>
                    </div>
                    <div>
                      <p className="font-semibold mb-1">{t('内容（中国語）', '内容（中文）')}</p>
                      <p className="whitespace-pre-line">{announcement.content_zh}</p>
                    </div>
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

// 告知フォームコンポーネント
const AnnouncementForm: React.FC<{
  data: Partial<Announcement>;
  onChange: (data: Partial<Announcement>) => void;
  onSave: () => void;
  onCancel: () => void;
}> = ({ data, onChange, onSave, onCancel }) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
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

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t('内容（日本語）', '内容（日语）')} *
          </label>
          <textarea
            value={data.content_ja || ''}
            onChange={(e) => onChange({ ...data, content_ja: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t('内容（中国語）', '内容（中文）')}
          </label>
          <textarea
            value={data.content_zh || ''}
            onChange={(e) => onChange({ ...data, content_zh: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t('開始日', '开始日期')}
          </label>
          <input
            type="date"
            value={data.start_date?.split('T')[0] || ''}
            onChange={(e) => onChange({ ...data, start_date: e.target.value ? new Date(e.target.value).toISOString() : null })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t('終了日', '结束日期')}
          </label>
          <input
            type="date"
            value={data.end_date?.split('T')[0] || ''}
            onChange={(e) => onChange({ ...data, end_date: e.target.value ? new Date(e.target.value).toISOString() : null })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t('優先度', '优先级')}
          </label>
          <input
            type="number"
            value={data.priority || 0}
            onChange={(e) => onChange({ ...data, priority: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t('背景色', '背景色')}
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={data.background_color || '#fef3c7'}
              onChange={(e) => onChange({ ...data, background_color: e.target.value })}
              className="w-12 h-12 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={data.background_color || '#fef3c7'}
              onChange={(e) => onChange({ ...data, background_color: e.target.value })}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary font-mono text-sm"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t('文字色', '文字颜色')}
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={data.text_color || '#92400e'}
              onChange={(e) => onChange({ ...data, text_color: e.target.value })}
              className="w-12 h-12 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={data.text_color || '#92400e'}
              onChange={(e) => onChange({ ...data, text_color: e.target.value })}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary font-mono text-sm"
            />
          </div>
        </div>
      </div>

      {/* プレビュー */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {t('プレビュー', '预览')}
        </label>
        <div
          className="p-4 rounded-lg"
          style={{
            backgroundColor: data.background_color || '#fef3c7',
            color: data.text_color || '#92400e',
          }}
        >
          <h4 className="font-bold mb-1">{data.title_ja || t('タイトル', '标题')}</h4>
          <p className="text-sm whitespace-pre-line">{data.content_ja || t('内容がここに表示されます', '内容将显示在这里')}</p>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          onClick={onCancel}
          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <X size={20} />
          <span>{t('キャンセル', '取消')}</span>
        </button>
        <button
          onClick={onSave}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Save size={20} />
          <span>{t('保存', '保存')}</span>
        </button>
      </div>
    </div>
  );
};
