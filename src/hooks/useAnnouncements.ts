import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Announcement = Database['public']['Tables']['announcements']['Row'];

export const useAnnouncements = () => {
  const [data, setData] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('priority', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setData(data || []);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch: fetchAnnouncements };
};
