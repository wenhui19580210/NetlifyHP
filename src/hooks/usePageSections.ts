import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

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

export const usePageSections = () => {
  const [sections, setSections] = useState<PageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const { data, error } = await supabase
          .from('page_sections')
          .select('*')
          .eq('is_visible', true)
          .order('order_index', { ascending: true });

        if (error) throw error;
        setSections(data || []);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, []);

  const getSectionConfig = (sectionKey: string) => {
    return sections.find(s => s.section_key === sectionKey);
  };

  return { sections, loading, error, getSectionConfig };
};
