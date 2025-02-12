import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/services/supabase/client';
import { Task } from '@/types/database';
import { useAuth } from './useAuth';

export interface CalendarTask extends Task {
  markedDate?: boolean;
}

export interface MarkedDates {
  [date: string]: {
    marked: boolean;
    dotColor?: string;
  };
}

export function useCalendar() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<CalendarTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async (startDate: string, endDate: string) => {
    try {
      if (!user) return;

      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .gte('due_date', startDate)
        .lte('due_date', endDate)
        .order('due_date', { ascending: true });

      if (error) throw error;

      setTasks(data as CalendarTask[]);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const getMarkedDates = useCallback((): MarkedDates => {
    return tasks.reduce((acc, task) => {
      if (task.due_date) {
        const date = task.due_date.split('T')[0];
        acc[date] = {
          marked: true,
          dotColor: task.completed ? '#4CAF50' : '#1976D2',
        };
      }
      return acc;
    }, {} as MarkedDates);
  }, [tasks]);

  const getTasksByDate = useCallback((date: string) => {
    return tasks.filter(task => 
      task.due_date?.startsWith(date)
    );
  }, [tasks]);

  useEffect(() => {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    fetchTasks(
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0]
    );
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    getMarkedDates,
    getTasksByDate,
  };
} 