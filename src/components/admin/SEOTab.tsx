import React, { useState } from 'react';
import { Search, Plus, Save, Trash2, Eye, EyeOff, X } from 'lucide-react';
import { useSEOSettings } from '../../hooks/useSEOSettings';
import type { Database } from '../../lib/database.types';

type SEOSettings = Database['public']['Tables']['seo_settings']['Row'];

export function SEOTab() {
  const {
    seoSettings,
    loading,
    createSEOSetting,
    updateSEOSetting,
    deleteSEOSetting,
    toggleSEOSettingActive,
  } = useSEOSettings();

  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<SEOSettings | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // フォームの初期値
  const getEmptyForm = (): Partial<SEOSettings> => ({
    page_key: '',
    title_ja: '',
    description_ja: '',
    keywords_ja: [],
    title_zh: '',
    description_zh: '',
    keywords_zh: [],
    og_title_ja: '',
    og_title_zh: '',
    og_description_ja: '',
    og_description_zh: '',
    og_image_url: '',
    og_type: 'website',
    twitter_card: 'summary_large_image',
    twitter_site: '',
    twitter_creator: '',
    canonical_url: '',
    robots_index: true,
    robots_follow: true,
    priority: 0.5,
    change_frequency: 'weekly',
    is_active: true,
  });

  const [formData, setFormData] = useState<Partial<SEOSettings>>(getEmptyForm());

  // 編集開始
  const handleEdit = (item: SEOSettings) => {
    setEditingItem(item);
    setFormData(item);
    setIsEditing(true);
  };

  // 新規作成開始
  const handleCreate = () => {
    setEditingItem(null);
    setFormData(getEmptyForm());
    setIsEditing(true);
  };

  // キャンセル
  const handleCancel = () => {
    setIsEditing(false);
    setEditingItem(null);
    setFormData(getEmptyForm());
  };

  // 保存
  const handleSave = async () => {
    if (!formData.page_key) {
      alert('ページキーを入力してください');
      return;
    }

    const result = editingItem
      ? await updateSEOSetting(editingItem.id, formData)
      : await createSEOSetting(formData);

    if (result.success) {
      alert(editingItem ? 'SEO設定を更新しました' : 'SEO設定を作成しました');
      handleCancel();
    } else {
      alert(`エラー: ${result.error}`);
    }
  };

  // 削除
  const handleDelete = async (id: string) => {
    if (!confirm('このSEO設定を削除してもよろしいですか？')) return;

    const result = await deleteSEOSetting(id);
    if (result.success) {
      alert('SEO設定を削除しました');
    } else {
      alert(`エラー: ${result.error}`);
    }
  };

  // 有効化/無効化
  const handleToggleActive = async (id: string, isActive: boolean) => {
    const result = await toggleSEOSettingActive(id, !isActive);
    if (!result.success) {
      alert(`エラー: ${result.error}`);
    }
  };

  // キーワード配列を文字列に変換
  const keywordsToString = (keywords: string[] | null): string => {
    return keywords ? keywords.join(', ') : '';
  };

  // 文字列をキーワード配列に変換
  const stringToKeywords = (str: string): string[] => {
    return str.split(',').map(k => k.trim()).filter(k => k !== '');
  };

  // フィルタリング
  const filteredSettings = seoSettings.filter(item =>
    item.page_key.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.title_ja && item.title_ja.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">SEO設定管理</h2>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          新規作成
        </button>
      </div>

      {/* 検索バー */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="ページキーまたはタイトルで検索..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* SEO設定リスト */}
      {!isEditing && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ページキー
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  タイトル (日本語)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  説明 (日本語)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状態
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSettings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    SEO設定がありません
                  </td>
                </tr>
              ) : (
                filteredSettings.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-sm text-blue-600">{item.page_key}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 line-clamp-1">{item.title_ja}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 line-clamp-2 max-w-md">
                        {item.description_ja}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleActive(item.id, item.is_active)}
                        className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                          item.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {item.is_active ? <Eye size={14} /> : <EyeOff size={14} />}
                        {item.is_active ? '有効' : '無効'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          編集
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* 編集/作成フォーム */}
      {isEditing && (
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-800">
              {editingItem ? 'SEO設定を編集' : '新規SEO設定'}
            </h3>
            <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 基本情報 */}
            <div className="space-y-4 md:col-span-2">
              <h4 className="font-semibold text-gray-700 border-b pb-2">基本情報</h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ページキー <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.page_key || ''}
                  onChange={(e) => setFormData({ ...formData, page_key: e.target.value })}
                  placeholder="home, about, services, etc."
                  disabled={!!editingItem}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>
            </div>

            {/* 日本語設定 */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-700 border-b pb-2">日本語設定</h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  タイトル (日本語)
                </label>
                <input
                  type="text"
                  value={formData.title_ja || ''}
                  onChange={(e) => setFormData({ ...formData, title_ja: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  説明 (日本語)
                </label>
                <textarea
                  value={formData.description_ja || ''}
                  onChange={(e) => setFormData({ ...formData, description_ja: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  キーワード (日本語) <span className="text-xs text-gray-500">カンマ区切り</span>
                </label>
                <input
                  type="text"
                  value={keywordsToString(formData.keywords_ja || null)}
                  onChange={(e) => setFormData({ ...formData, keywords_ja: stringToKeywords(e.target.value) })}
                  placeholder="太陽光発電, パネル清掃, メンテナンス"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  OGタイトル (日本語)
                </label>
                <input
                  type="text"
                  value={formData.og_title_ja || ''}
                  onChange={(e) => setFormData({ ...formData, og_title_ja: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  OG説明 (日本語)
                </label>
                <textarea
                  value={formData.og_description_ja || ''}
                  onChange={(e) => setFormData({ ...formData, og_description_ja: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* 中国語設定 */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-700 border-b pb-2">中国語設定</h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  タイトル (中国語)
                </label>
                <input
                  type="text"
                  value={formData.title_zh || ''}
                  onChange={(e) => setFormData({ ...formData, title_zh: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  説明 (中国語)
                </label>
                <textarea
                  value={formData.description_zh || ''}
                  onChange={(e) => setFormData({ ...formData, description_zh: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  キーワード (中国語) <span className="text-xs text-gray-500">カンマ区切り</span>
                </label>
                <input
                  type="text"
                  value={keywordsToString(formData.keywords_zh || null)}
                  onChange={(e) => setFormData({ ...formData, keywords_zh: stringToKeywords(e.target.value) })}
                  placeholder="太阳能发电, 面板清洁, 维护"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  OGタイトル (中国語)
                </label>
                <input
                  type="text"
                  value={formData.og_title_zh || ''}
                  onChange={(e) => setFormData({ ...formData, og_title_zh: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  OG説明 (中国語)
                </label>
                <textarea
                  value={formData.og_description_zh || ''}
                  onChange={(e) => setFormData({ ...formData, og_description_zh: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* OGP/Twitter設定 */}
            <div className="space-y-4 md:col-span-2">
              <h4 className="font-semibold text-gray-700 border-b pb-2">OGP / Twitter Card設定</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    OG画像URL
                  </label>
                  <input
                    type="text"
                    value={formData.og_image_url || ''}
                    onChange={(e) => setFormData({ ...formData, og_image_url: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    OGタイプ
                  </label>
                  <select
                    value={formData.og_type || 'website'}
                    onChange={(e) => setFormData({ ...formData, og_type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="website">website</option>
                    <option value="article">article</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Twitter Card
                  </label>
                  <select
                    value={formData.twitter_card || 'summary_large_image'}
                    onChange={(e) => setFormData({ ...formData, twitter_card: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="summary">summary</option>
                    <option value="summary_large_image">summary_large_image</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Twitter Site
                  </label>
                  <input
                    type="text"
                    value={formData.twitter_site || ''}
                    onChange={(e) => setFormData({ ...formData, twitter_site: e.target.value })}
                    placeholder="@username"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* 検索エンジン設定 */}
            <div className="space-y-4 md:col-span-2">
              <h4 className="font-semibold text-gray-700 border-b pb-2">検索エンジン設定</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    カノニカルURL
                  </label>
                  <input
                    type="text"
                    value={formData.canonical_url || ''}
                    onChange={(e) => setFormData({ ...formData, canonical_url: e.target.value })}
                    placeholder="https://example.com/page"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    優先度 (0.0-1.0)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    value={formData.priority || 0.5}
                    onChange={(e) => setFormData({ ...formData, priority: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    更新頻度
                  </label>
                  <select
                    value={formData.change_frequency || 'weekly'}
                    onChange={(e) => setFormData({ ...formData, change_frequency: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="always">always</option>
                    <option value="hourly">hourly</option>
                    <option value="daily">daily</option>
                    <option value="weekly">weekly</option>
                    <option value="monthly">monthly</option>
                    <option value="yearly">yearly</option>
                    <option value="never">never</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.robots_index || false}
                    onChange={(e) => setFormData({ ...formData, robots_index: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">検索エンジンに登録 (index)</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.robots_follow || false}
                    onChange={(e) => setFormData({ ...formData, robots_follow: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">リンクをたどる (follow)</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_active || false}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">有効化</span>
                </label>
              </div>
            </div>
          </div>

          {/* アクションボタン */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              キャンセル
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save size={20} />
              保存
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
