import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type FAQ = Database['public']['Tables']['faqs']['Row'];

export const useFAQs = () => {
  const [data, setData] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('faqs')
          .select('*')
          .is('deleted_at', null)
          .eq('is_visible', true)
          .order('order_index', { ascending: true });

        if (error) throw error;
        setData(data || []);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};
