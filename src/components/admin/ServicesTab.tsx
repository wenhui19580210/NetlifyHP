import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Eye, EyeOff, RotateCcw } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../lib/database.types';

type Service = Database['public']['Tables']['services']['Row'];

export const ServicesTab: React.FC = () => {
  const { t } = useLanguage();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Service>>({});
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (err) {
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditData({
      service_name_ja: '',
      service_name_zh: '',
      description_ja: '',
      description_zh: '',
      icon: 'Star',
      order_index: services.length + 1,
      is_visible: true,
    });
  };

  const handleEdit = (service: Service) => {
    setEditingId(service.id);
    setEditData(service);
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
    setEditData({});
  };

  const handleSave = async () => {
    try {
      if (isAdding) {
        const { error } = await supabase
          .from('services')
          .insert([editData as any]);
        if (error) throw error;
      } else if (editingId) {
        const { error } = await supabase
          .from('services')
          .update(editData)
          .eq('id', editingId);
        if (error) throw error;
      }
      
      await fetchServices();
      handleCancel();
    } catch (err) {
      console.error('Error saving service:', err);
      alert(t('保存に失敗しました', '保存失败'));
    }
  };

  const handleToggleVisible = async (service: Service) => {
    try {
      const { error } = await supabase
        .from('services')
        .update({ is_visible: !service.is_visible })
        .eq('id', service.id);
      if (error) throw error;
      await fetchServices();
    } catch (err) {
      console.error('Error toggling visibility:', err);
    }
  };

  const handleDelete = async (service: Service) => {
    if (!confirm(t('本当に削除しますか？', '确定要删除吗？'))) return;
    
    try {
      const { error } = await supabase
        .from('services')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', service.id);
      if (error) throw error;
      await fetchServices();
    } catch (err) {
      console.error('Error deleting service:', err);
    }
  };

  const handleRestore = async (service: Service) => {
    try {
      const { error } = await supabase
        .from('services')
        .update({ deleted_at: null })
        .eq('id', service.id);
      if (error) throw error;
      await fetchServices();
    } catch (err) {
      console.error('Error restoring service:', err);
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
          {t('サービス管理', '服务管理')}
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
            {t('新しいサービスを追加', '添加新服务')}
          </h3>
          <ServiceForm
            data={editData}
            onChange={setEditData}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      )}

      {/* サービスリスト */}
      <div className="space-y-4">
        {services.map((service) => (
          <div
            key={service.id}
            className={`bg-white rounded-lg shadow-md p-6 ${
              service.deleted_at ? 'opacity-50' : ''
            }`}
          >
            {editingId === service.id ? (
              <ServiceForm
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
                        {service.service_name_ja}
                      </h3>
                      {!service.is_visible && (
                        <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded">
                          {t('非表示', '隐藏')}
                        </span>
                      )}
                      {service.deleted_at && (
                        <span className="px-2 py-1 bg-red-200 text-red-600 text-xs rounded">
                          {t('削除済み', '已删除')}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600">{service.service_name_zh}</p>
                  </div>
                  <div className="flex space-x-2">
                    {service.deleted_at ? (
                      <button
                        onClick={() => handleRestore(service)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                        title={t('復元', '恢复')}
                      >
                        <RotateCcw size={20} />
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleToggleVisible(service)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title={service.is_visible ? t('非表示にする', '隐藏') : t('表示する', '显示')}
                        >
                          {service.is_visible ? <Eye size={20} /> : <EyeOff size={20} />}
                        </button>
                        <button
                          onClick={() => handleEdit(service)}
                          className="p-2 text-primary hover:bg-orange-50 rounded transition-colors"
                          title={t('編集', '编辑')}
                        >
                          <Edit2 size={20} />
                        </button>
                        <button
                          onClick={() => handleDelete(service)}
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
                    <p className="font-semibold mb-1">{t('説明（日本語）', '说明（日语）')}</p>
                    <p className="whitespace-pre-line">{service.description_ja}</p>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">{t('説明（中国語）', '说明（中文）')}</p>
                    <p className="whitespace-pre-line">{service.description_zh}</p>
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

// サービスフォームコンポーネント
const ServiceForm: React.FC<{
  data: Partial<Service>;
  onChange: (data: Partial<Service>) => void;
  onSave: () => void;
  onCancel: () => void;
}> = ({ data, onChange, onSave, onCancel }) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t('サービス名（日本語）', '服务名称（日语）')} *
          </label>
          <input
            type="text"
            value={data.service_name_ja || ''}
            onChange={(e) => onChange({ ...data, service_name_ja: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t('サービス名（中国語）', '服务名称（中文）')}
          </label>
          <input
            type="text"
            value={data.service_name_zh || ''}
            onChange={(e) => onChange({ ...data, service_name_zh: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t('説明（日本語）', '说明（日语）')}
          </label>
          <textarea
            value={data.description_ja || ''}
            onChange={(e) => onChange({ ...data, description_ja: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t('説明（中国語）', '说明（中文）')}
          </label>
          <textarea
            value={data.description_zh || ''}
            onChange={(e) => onChange({ ...data, description_zh: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t('アイコン（Lucide名）', '图标（Lucide名称）')}
          </label>
          <input
            type="text"
            value={data.icon || ''}
            onChange={(e) => onChange({ ...data, icon: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            placeholder="Star, Sun, Wrench..."
          />
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
