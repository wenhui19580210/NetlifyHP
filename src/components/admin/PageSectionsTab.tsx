import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, CheckCircle, MoveUp, MoveDown, Eye, EyeOff, Palette } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../lib/supabase';

interface PageSection {
  id: string;
  section_key: string;
  section_name_ja: string;
  section_name_zh: string | null;
  order_index: number;
  is_visible: boolean;
  background_color: string | null;
  text_color: string | null;
  title_ja: string | null;
  title_zh: string | null;
  subtitle_ja: string | null;
  subtitle_zh: string | null;
  custom_styles: any;
}

export const PageSectionsTab: React.FC = () => {
  const { t } = useLanguage();
  const [sections, setSections] = useState<PageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const { data, error } = await supabase
        .from('page_sections')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      if (data) setSections(data);
    } catch (err: any) {
      showMessage('error', t('データの取得に失敗しました', '获取数据失败'));
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const updates = sections.map((section) => ({
        id: section.id,
        order_index: section.order_index,
        is_visible: section.is_visible,
        background_color: section.background_color,
        text_color: section.text_color,
        title_ja: section.title_ja,
        title_zh: section.title_zh,
        subtitle_ja: section.subtitle_ja,
        subtitle_zh: section.subtitle_zh,
        custom_styles: section.custom_styles,
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('page_sections')
          .update(update)
          .eq('id', update.id);

        if (error) throw error;
      }

      showMessage('success', t('保存しました', '保存成功'));
      fetchSections();
    } catch (err: any) {
      console.error('保存エラー:', err);
      showMessage('error', t('保存に失敗しました', '保存失败') + ': ' + (err.message || ''));
    } finally {
      setSaving(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newSections.length) return;

    [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];

    newSections.forEach((section, idx) => {
      section.order_index = idx + 1;
    });

    setSections(newSections);
  };

  const toggleVisibility = (id: string) => {
    setSections(sections.map(section =>
      section.id === id ? { ...section, is_visible: !section.is_visible } : section
    ));
  };

  const updateSection = (id: string, field: keyof PageSection, value: any) => {
    setSections(sections.map(section =>
      section.id === id ? { ...section, [field]: value } : section
    ));
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
      {message && (
        <div className={`mb-6 p-4 rounded-lg flex items-center ${
          message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 mr-2" />
          ) : (
            <AlertCircle className="w-5 h-5 mr-2" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {t('ページセクション管理', '页面区块管理')}
          </h2>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            <Save size={20} />
            <span>{saving ? t('保存中...', '保存中...') : t('保存', '保存')}</span>
          </button>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded mb-6">
          <p className="text-sm text-blue-700">
            {t('各セクションの表示順序、表示/非表示、デザイン設定を管理できます。', '可以管理各区块的显示顺序、显示/隐藏、设计设置。')}
          </p>
        </div>

        <div className="space-y-4">
          {sections.map((section, index) => (
            <div
              key={section.id}
              className={`border rounded-lg overflow-hidden transition-all ${
                section.is_visible ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
              }`}
            >
              {/* セクションヘッダー */}
              <div className="flex items-center justify-between p-4 bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col space-y-1">
                    <button
                      onClick={() => moveSection(index, 'up')}
                      disabled={index === 0}
                      className="p-1 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                      title={t('上に移動', '向上移动')}
                    >
                      <MoveUp size={16} />
                    </button>
                    <button
                      onClick={() => moveSection(index, 'down')}
                      disabled={index === sections.length - 1}
                      className="p-1 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                      title={t('下に移動', '向下移动')}
                    >
                      <MoveDown size={16} />
                    </button>
                  </div>

                  <div className="text-lg font-semibold text-gray-700">
                    {index + 1}. {section.section_name_ja}
                    {section.section_name_zh && (
                      <span className="text-sm text-gray-500 ml-2">({section.section_name_zh})</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleVisibility(section.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      section.is_visible
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    {section.is_visible ? <Eye size={18} /> : <EyeOff size={18} />}
                    <span>{section.is_visible ? t('表示', '显示') : t('非表示', '隐藏')}</span>
                  </button>

                  <button
                    onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    {expandedSection === section.id ? t('閉じる', '关闭') : t('デザイン設定', '设计设置')}
                  </button>
                </div>
              </div>

              {/* デザイン設定エリア */}
              {expandedSection === section.id && (
                <div className="p-6 bg-white border-t space-y-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Palette className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-bold text-gray-900">
                      {t('デザイン設定', '设计设置')}
                    </h3>
                  </div>

                  {/* カラー設定 */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t('背景色', '背景色')}
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={section.background_color || '#ffffff'}
                          onChange={(e) => updateSection(section.id, 'background_color', e.target.value)}
                          className="w-16 h-16 border-2 border-gray-300 rounded-lg cursor-pointer"
                        />
                        <input
                          type="text"
                          value={section.background_color || ''}
                          onChange={(e) => updateSection(section.id, 'background_color', e.target.value)}
                          placeholder="#ffffff"
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary font-mono text-sm"
                        />
                        {section.background_color && (
                          <button
                            onClick={() => updateSection(section.id, 'background_color', null)}
                            className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
                          >
                            {t('クリア', '清除')}
                          </button>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t('テキスト色', '文字颜色')}
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={section.text_color || '#000000'}
                          onChange={(e) => updateSection(section.id, 'text_color', e.target.value)}
                          className="w-16 h-16 border-2 border-gray-300 rounded-lg cursor-pointer"
                        />
                        <input
                          type="text"
                          value={section.text_color || ''}
                          onChange={(e) => updateSection(section.id, 'text_color', e.target.value)}
                          placeholder="#000000"
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary font-mono text-sm"
                        />
                        {section.text_color && (
                          <button
                            onClick={() => updateSection(section.id, 'text_color', null)}
                            className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
                          >
                            {t('クリア', '清除')}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* カスタムタイトル */}
                  <div className="border-t pt-6">
                    <h4 className="text-sm font-bold text-gray-900 mb-4">
                      {t('カスタムタイトル（オプション）', '自定义标题（可选）')}
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          {t('タイトル（日本語）', '标题（日语）')}
                        </label>
                        <input
                          type="text"
                          value={section.title_ja || ''}
                          onChange={(e) => updateSection(section.id, 'title_ja', e.target.value)}
                          placeholder={t('デフォルトタイトルを使用', '使用默认标题')}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          {t('タイトル（中国語）', '标题（中文）')}
                        </label>
                        <input
                          type="text"
                          value={section.title_zh || ''}
                          onChange={(e) => updateSection(section.id, 'title_zh', e.target.value)}
                          placeholder={t('デフォルトタイトルを使用', '使用默认标题')}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                  </div>

                  {/* カスタムサブタイトル */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t('サブタイトル（日本語）', '副标题（日语）')}
                      </label>
                      <input
                        type="text"
                        value={section.subtitle_ja || ''}
                        onChange={(e) => updateSection(section.id, 'subtitle_ja', e.target.value)}
                        placeholder={t('デフォルトを使用', '使用默认值')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t('サブタイトル（中国語）', '副标题（中文）')}
                      </label>
                      <input
                        type="text"
                        value={section.subtitle_zh || ''}
                        onChange={(e) => updateSection(section.id, 'subtitle_zh', e.target.value)}
                        placeholder={t('デフォルトを使用', '使用默认值')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  {/* プレビュー */}
                  {(section.background_color || section.text_color) && (
                    <div className="border-t pt-6">
                      <h4 className="text-sm font-bold text-gray-900 mb-3">
                        {t('プレビュー', '预览')}
                      </h4>
                      <div
                        className="p-8 rounded-lg border border-gray-300"
                        style={{
                          backgroundColor: section.background_color || undefined,
                          color: section.text_color || undefined,
                        }}
                      >
                        <h3 className="text-2xl font-bold mb-2">
                          {section.title_ja || section.section_name_ja}
                        </h3>
                        {section.subtitle_ja && (
                          <p className="text-lg opacity-80">{section.subtitle_ja}</p>
                        )}
                        <p className="mt-4 opacity-70">
                          {t('このセクションのコンテンツがここに表示されます。', '该区块的内容将显示在此处。')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
