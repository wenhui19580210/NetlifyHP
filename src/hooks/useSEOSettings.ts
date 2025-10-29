import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type SEOSettings = Database['public']['Tables']['seo_settings']['Row'];
type SEOSettingsInsert = Database['public']['Tables']['seo_settings']['Insert'];
type SEOSettingsUpdate = Database['public']['Tables']['seo_settings']['Update'];

export function useSEOSettings() {
  const [seoSettings, setSEOSettings] = useState<SEOSettings[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // SEO設定を取得
  const fetchSEOSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('seo_settings')
        .select('*')
        .order('page_key', { ascending: true });

      if (error) throw error;
      setSEOSettings(data || []);
    } catch (err) {
      console.error('SEO設定の取得に失敗しました:', err);
      setError(err instanceof Error ? err.message : 'SEO設定の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // 特定のページのSEO設定を取得
  const getSEOSettingByPageKey = async (pageKey: string): Promise<SEOSettings | null> => {
    try {
      const { data, error } = await supabase
        .from('seo_settings')
        .select('*')
        .eq('page_key', pageKey)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error(`SEO設定の取得に失敗しました (page_key: ${pageKey}):`, err);
      return null;
    }
  };

  // SEO設定を作成
  const createSEOSetting = async (seoSetting: SEOSettingsInsert) => {
    try {
      const { data, error } = await supabase
        .from('seo_settings')
        .insert(seoSetting)
        .select()
        .single();

      if (error) throw error;
      await fetchSEOSettings(); // リストを再取得
      return { success: true, data };
    } catch (err) {
      console.error('SEO設定の作成に失敗しました:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'SEO設定の作成に失敗しました' 
      };
    }
  };

  // SEO設定を更新
  const updateSEOSetting = async (id: string, updates: SEOSettingsUpdate) => {
    try {
      const { data, error } = await supabase
        .from('seo_settings')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await fetchSEOSettings(); // リストを再取得
      return { success: true, data };
    } catch (err) {
      console.error('SEO設定の更新に失敗しました:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'SEO設定の更新に失敗しました' 
      };
    }
  };

  // SEO設定を削除
  const deleteSEOSetting = async (id: string) => {
    try {
      const { error } = await supabase
        .from('seo_settings')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchSEOSettings(); // リストを再取得
      return { success: true };
    } catch (err) {
      console.error('SEO設定の削除に失敗しました:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'SEO設定の削除に失敗しました' 
      };
    }
  };

  // SEO設定の有効化/無効化
  const toggleSEOSettingActive = async (id: string, isActive: boolean) => {
    return updateSEOSetting(id, { is_active: isActive });
  };

  useEffect(() => {
    fetchSEOSettings();
  }, []);

  return {
    seoSettings,
    loading,
    error,
    fetchSEOSettings,
    getSEOSettingByPageKey,
    createSEOSetting,
    updateSEOSetting,
    deleteSEOSetting,
    toggleSEOSettingActive,
  };
}
