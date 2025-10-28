import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Eye, EyeOff, RotateCcw } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../lib/database.types';

type FAQ = Database['public']['Tables']['faqs']['Row'];
// type FAQInsert = Database['public']['Tables']['faqs']['Insert'];
// type FAQUpdate = Database['public']['Tables']['faqs']['Update'];

export const FAQTab: React.FC = () => {
  const { t } = useLanguage();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<FAQ>>({});
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setFaqs(data || []);
    } catch (err) {
      console.error('Error fetching FAQs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditData({
      question_ja: '',
      question_zh: '',
      answer_ja: '',
      answer_zh: '',
      order_index: faqs.length + 1,
      is_visible: true,
    });
  };

  const handleEdit = (faq: FAQ) => {
    setEditingId(faq.id);
    setEditData(faq);
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
          .from('faqs')
          .insert(editData);
        if (error) throw error;
      } else if (editingId) {
        // @ts-ignore - Supabase型定義の問題を回避
        const { error } = await supabase
          .from('faqs')
          .update(editData)
          .eq('id', editingId);
        if (error) throw error;
      }
      
      await fetchFAQs();
      handleCancel();
    } catch (err) {
      console.error('Error saving FAQ:', err);
      alert(t('保存に失敗しました', '保存失败'));
    }
  };

  const handleToggleVisible = async (faq: FAQ) => {
    try {
      // @ts-ignore - Supabase型定義の問題を回避
      const { error } = await supabase
        .from('faqs')
        .update({ is_visible: !faq.is_visible })
        .eq('id', faq.id);
      if (error) throw error;
      await fetchFAQs();
    } catch (err) {
      console.error('Error toggling visibility:', err);
    }
  };

  const handleDelete = async (faq: FAQ) => {
    if (!confirm(t('本当に削除しますか？', '确定要删除吗？'))) return;
    
    try {
      // @ts-ignore - Supabase型定義の問題を回避
      const { error } = await supabase
        .from('faqs')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', faq.id);
      if (error) throw error;
      await fetchFAQs();
    } catch (err) {
      console.error('Error deleting FAQ:', err);
    }
  };

  const handleRestore = async (faq: FAQ) => {
    try {
      // @ts-ignore - Supabase型定義の問題を回避
      const { error } = await supabase
        .from('faqs')
        .update({ deleted_at: null })
        .eq('id', faq.id);
      if (error) throw error;
      await fetchFAQs();
    } catch (err) {
      console.error('Error restoring FAQ:', err);
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
          {t('FAQ管理', '常见问题管理')}
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
            {t('新しいFAQを追加', '添加新常见问题')}
          </h3>
          <FAQForm
            data={editData}
            onChange={setEditData}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      )}

      {/* FAQリスト */}
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={faq.id}
            className={`bg-white rounded-lg shadow-md p-6 ${
              faq.deleted_at ? 'opacity-50' : ''
            }`}
          >
            {editingId === faq.id ? (
              <FAQForm
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
                      <span className="inline-block bg-primary text-white text-sm font-bold px-3 py-1 rounded-full">
                        Q{index + 1}
                      </span>
                      {!faq.is_visible && (
                        <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded">
                          {t('非表示', '隐藏')}
                        </span>
                      )}
                      {faq.deleted_at && (
                        <span className="px-2 py-1 bg-red-200 text-red-600 text-xs rounded">
                          {t('削除済み', '已删除')}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {faq.question_ja}
                    </h3>
                    <p className="text-gray-600 mb-3">{faq.question_zh}</p>
                  </div>
                  <div className="flex space-x-2">
                    {faq.deleted_at ? (
                      <button
                        onClick={() => handleRestore(faq)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                        title={t('復元', '恢复')}
                      >
                        <RotateCcw size={20} />
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleToggleVisible(faq)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title={faq.is_visible ? t('非表示にする', '隐藏') : t('表示する', '显示')}
                        >
                          {faq.is_visible ? <Eye size={20} /> : <EyeOff size={20} />}
                        </button>
                        <button
                          onClick={() => handleEdit(faq)}
                          className="p-2 text-primary hover:bg-orange-50 rounded transition-colors"
                          title={t('編集', '编辑')}
                        >
                          <Edit2 size={20} />
                        </button>
                        <button
                          onClick={() => handleDelete(faq)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title={t('削除', '删除')}
                        >
                          <Trash2 size={20} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700 bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg">
                  <div>
                    <p className="font-semibold mb-1">{t('回答（日本語）', '回答（日语）')}</p>
                    <p className="whitespace-pre-line">{faq.answer_ja}</p>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">{t('回答（中国語）', '回答（中文）')}</p>
                    <p className="whitespace-pre-line">{faq.answer_zh}</p>
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

// FAQフォームコンポーネント
const FAQForm: React.FC<{
  data: Partial<FAQ>;
  onChange: (data: Partial<FAQ>) => void;
  onSave: () => void;
  onCancel: () => void;
}> = ({ data, onChange, onSave, onCancel }) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t('質問（日本語）', '问题（日语）')} *
          </label>
          <input
            type="text"
            value={data.question_ja || ''}
            onChange={(e) => onChange({ ...data, question_ja: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t('質問（中国語）', '问题（中文）')}
          </label>
          <input
            type="text"
            value={data.question_zh || ''}
            onChange={(e) => onChange({ ...data, question_zh: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t('回答（日本語）', '回答（日语）')}
          </label>
          <textarea
            value={data.answer_ja || ''}
            onChange={(e) => onChange({ ...data, answer_ja: e.target.value })}
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t('回答（中国語）', '回答（中文）')}
          </label>
          <textarea
            value={data.answer_zh || ''}
            onChange={(e) => onChange({ ...data, answer_zh: e.target.value })}
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {t('表示順序', '显示顺序')}
        </label>
        <input
          type="number"
          value={data.order_index || 0}
          onChange={(e) => onChange({ ...data, order_index: parseInt(e.target.value) })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
        />
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
