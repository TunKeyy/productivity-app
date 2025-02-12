import { useState, useEffect } from 'react';
import { supabase } from '@/services/supabase/client';
import { useAuth } from './useAuth';

export interface DailyStats {
  date: string;
  tasks_completed: number;
  focus_time: number;
  productivity_score: number;
}

export function useStatistics() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DailyStats[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get last 30 days of statistics
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const { data, error } = await supabase
          .from('statistics')
          .select('*')
          .eq('user_id', user.id)
          .gte('date', thirtyDaysAgo.toISOString().split('T')[0])
          .order('date', { ascending: false });

        if (error) throw error;

        setStats(data as DailyStats[]);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  return {
    stats,
    loading,
    error,
  };
} 