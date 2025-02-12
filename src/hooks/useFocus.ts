import { useState, useCallback } from 'react';
import { supabase } from '@/services/supabase/client';
import { useAuth } from './useAuth';
import { updateDailyStatistics } from '@/services/statistics';

export interface FocusSession {
  id: string;
  user_id: string;
  task_id?: string;
  start_time: string;
  end_time?: string;
  duration: number;
  completed: boolean;
  notes?: string;
}

export function useFocus() {
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const startSession = useCallback(async (taskId?: string) => {
    try {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('focus_sessions')
        .insert([
          {
            user_id: user.id,
            task_id: taskId,
            start_time: new Date().toISOString(),
            duration: 25 * 60, // 25 minutes in seconds
            completed: false,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      return { data: null, error };
    }
  }, [user]);

  const completeSession = useCallback(async (sessionId: string) => {
    try {
      if (!user) throw new Error('User not authenticated');

      const { error: sessionError } = await supabase
        .from('focus_sessions')
        .update({
          completed: true,
          end_time: new Date().toISOString(),
        })
        .eq('id', sessionId);

      if (sessionError) throw sessionError;

      // Update statistics
      const today = new Date().toISOString().split('T')[0];
      const { error: statsError } = await updateDailyStatistics(user.id, today);
      
      if (statsError) throw statsError;

      return { error: null };
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      return { error };
    }
  }, [user]);

  return {
    error,
    startSession,
    completeSession,
  };
} 