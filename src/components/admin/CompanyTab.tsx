import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, CheckCircle, Palette, Eye } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../lib/database.types';

type CompanyInfo = Database['public']['Tables']['company_info']['Row'];
// type CompanyInfoUpdate = Database['public']['Tables']['company_info']['Update'];

export const CompanyTab: React.FC = () => {
  const { t } = useLanguage();
  const [data, setData] = useState<Partial<CompanyInfo>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data, error } = await supabase
        .from('company_info')
        .select('*')
        .single();

      if (error) throw error;
      if (data) setData(data);
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
      // idとシステムフィールドを除外して更新データを準備
      const { id, created_at, updated_at, ...updateData } = data;
      
      // @ts-ignore - Supabase型定義の問題を回避
      const { error } = await supabase
        .from('company_info')
        .update(updateData)
        .eq('id', id!);

      if (error) throw error;
      showMessage('success', t('保存しました', '保存成功'));
      fetchData();
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

  const handleChange = (field: keyof CompanyInfo, value: any) => {
    setData({ ...data, [field]: value });
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
    <div className="max-w-4xl mx-auto">
      {/* メッセージ */}
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
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {t('会社基本情報', '公司基本信息')}
        </h2>

        {/* 会社名 */}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('会社名（日本語）', '公司名称（日语）')}
            </label>
            <input
              type="text"
              value={data.company_name || ''}
              onChange={(e) => handleChange('company_name', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('会社名（中国語）', '公司名称（中文）')}
            </label>
            <input
              type="text"
              value={data.company_name_zh || ''}
              onChange={(e) => handleChange('company_name_zh', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('会社名（英語）', '公司名称（英文）')}
            </label>
            <input
              type="text"
              value={data.company_name_en || ''}
              onChange={(e) => handleChange('company_name_en', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* 代表者・創業・資本金 */}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('代表取締役', '董事长')}
            </label>
            <input
              type="text"
              value={data.ceo_name || ''}
              onChange={(e) => handleChange('ceo_name', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('創業', '创业')}
            </label>
            <input
              type="date"
              value={data.established || ''}
              onChange={(e) => handleChange('established', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('資本金', '注册资金')}
            </label>
            <input
              type="text"
              value={data.capital || ''}
              onChange={(e) => handleChange('capital', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* 連絡先 */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('電話番号', '电话号码')}
            </label>
            <input
              type="tel"
              value={data.phone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('メールアドレス', '电子邮件')}
            </label>
            <input
              type="email"
              value={data.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* 住所 */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('住所（日本語）', '地址（日语）')}
            </label>
            <textarea
              value={data.address_ja || ''}
              onChange={(e) => handleChange('address_ja', e.target.value)}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('住所（中国語）', '地址（中文）')}
            </label>
            <textarea
              value={data.address_zh || ''}
              onChange={(e) => handleChange('address_zh', e.target.value)}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* ロゴURL */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t('会社ロゴURL', '公司Logo网址')}
          </label>
          <input
            type="url"
            value={data.logo_url || ''}
            onChange={(e) => handleChange('logo_url', e.target.value)}
            placeholder="https://example.com/logo.png"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <p className="text-sm text-gray-500 mt-2">
            {t('ロゴ画像のURLを入力してください。画像ホスティングサービス（Imgur、Cloudinaryなど）を使用できます。', '请输入Logo图片的网址。可以使用图片托管服务（Imgur、Cloudinary等）。')}
          </p>
          {data.logo_url && (
            <div className="mt-3">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('プレビュー', '预览')}
              </label>
              <img
                src={data.logo_url}
                alt="Company Logo"
                className="h-16 w-auto border border-gray-300 rounded-lg p-2 bg-white"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
        </div>

        {/* カラーテーマ - WordPress風デザイン */}
        <div className="border-t pt-6">
          <div className="flex items-center space-x-2 mb-4">
            <Palette className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-bold text-gray-900">
              {t('デザイン設定', '设计设置')}
            </h3>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  {t('メインカラー', '主色')}
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="color"
                    value={data.main_color || '#f59e0b'}
                    onChange={(e) => handleChange('main_color', e.target.value)}
                    className="w-20 h-20 border-2 border-gray-300 rounded-lg cursor-pointer"
                  />
                  <div className="flex-1">
                    <input
                      type="text"
                      value={data.main_color || '#f59e0b'}
                      onChange={(e) => handleChange('main_color', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary font-mono text-sm"
                      placeholder="#f59e0b"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {t('ボタン、リンク、アクセント色に使用', '用于按钮、链接、强调色')}
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  {t('サブカラー', '副色')}
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="color"
                    value={data.sub_color || '#0ea5e9'}
                    onChange={(e) => handleChange('sub_color', e.target.value)}
                    className="w-20 h-20 border-2 border-gray-300 rounded-lg cursor-pointer"
                  />
                  <div className="flex-1">
                    <input
                      type="text"
                      value={data.sub_color || '#0ea5e9'}
                      onChange={(e) => handleChange('sub_color', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary font-mono text-sm"
                      placeholder="#0ea5e9"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {t('セカンダリーボタン、装飾に使用', '用于辅助按钮、装饰')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* カラープリセット */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                {t('カラープリセット', '颜色预设')}
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { name: t('太陽光オレンジ', '太阳能橙'), main: '#f59e0b', sub: '#0ea5e9' },
                  { name: t('エコグリーン', '生态绿'), main: '#10b981', sub: '#3b82f6' },
                  { name: t('プロフェッショナルブルー', '专业蓝'), main: '#0ea5e9', sub: '#8b5cf6' },
                  { name: t('エレガントパープル', '优雅紫'), main: '#8b5cf6', sub: '#ec4899' },
                ].map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      handleChange('main_color', preset.main);
                      handleChange('sub_color', preset.sub);
                    }}
                    className="p-3 border-2 border-gray-200 rounded-lg hover:border-primary transition-colors group"
                  >
                    <div className="flex space-x-2 mb-2">
                      <div 
                        className="w-8 h-8 rounded"
                        style={{ backgroundColor: preset.main }}
                      />
                      <div 
                        className="w-8 h-8 rounded"
                        style={{ backgroundColor: preset.sub }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 group-hover:text-primary">
                      {preset.name}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* プレビュー */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Eye className="w-4 h-4 text-gray-600" />
                <label className="block text-sm font-semibold text-gray-700">
                  {t('カラープレビュー', '颜色预览')}
                </label>
              </div>
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="space-y-3">
                  <button
                    type="button"
                    className="px-6 py-3 rounded-lg text-white font-medium transition-colors"
                    style={{ backgroundColor: data.main_color || '#f59e0b' }}
                  >
                    {t('メインボタン', '主按钮')}
                  </button>
                  <button
                    type="button"
                    className="px-6 py-3 rounded-lg text-white font-medium transition-colors"
                    style={{ backgroundColor: data.sub_color || '#0ea5e9' }}
                  >
                    {t('サブボタン', '副按钮')}
                  </button>
                  <div className="flex items-center space-x-4 text-sm">
                    <a 
                      href="#" 
                      className="font-medium hover:underline"
                      style={{ color: data.main_color || '#f59e0b' }}
                      onClick={(e) => e.preventDefault()}
                    >
                      {t('リンクテキスト', '链接文本')}
                    </a>
                    <span className="text-gray-400">|</span>
                    <a 
                      href="#" 
                      className="font-medium hover:underline"
                      style={{ color: data.sub_color || '#0ea5e9' }}
                      onClick={(e) => e.preventDefault()}
                    >
                      {t('サブリンク', '副链接')}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 代表メッセージ */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('代表メッセージ（日本語）', '董事长致辞（日语）')}
            </label>
            <textarea
              value={data.ceo_message_ja || ''}
              onChange={(e) => handleChange('ceo_message_ja', e.target.value)}
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('代表メッセージ（中国語）', '董事长致辞（中文）')}
            </label>
            <textarea
              value={data.ceo_message_zh || ''}
              onChange={(e) => handleChange('ceo_message_zh', e.target.value)}
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* 保存ボタン */}
        <div className="flex justify-end pt-6 border-t">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            <Save size={20} />
            <span>{saving ? t('保存中...', '保存中...') : t('保存', '保存')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
