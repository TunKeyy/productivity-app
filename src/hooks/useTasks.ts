import { useState, useEffect, useCallback } from 'react';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { supabase } from '@/services/supabase/client';
import { Task, TasksState } from '@/types/database';
import { useAuth } from './useAuth';
import * as TaskService from '@/services/tasks';

type TaskPayload = RealtimePostgresChangesPayload<{
  [key: string]: any;
}>;

export function useTasks() {
  const { user } = useAuth();
  const [state, setState] = useState<TasksState>({
    tasks: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!user) return;

    const fetchTasks = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));

        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', user.id)
          .order('due_date', { ascending: true });

        if (error) throw error;

        setState(prev => ({
          ...prev,
          tasks: data as Task[],
          loading: false,
        }));
      } catch (err) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: (err as Error).message,
        }));
      }
    };

    fetchTasks();

    // Subscribe to realtime changes
    const subscription = supabase
      .channel('tasks')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `user_id=eq.${user.id}`,
        },
        (payload: TaskPayload) => {
          setState((prev: TasksState) => {
            const { tasks } = prev;
            let updatedTasks = [...tasks];

            switch (payload.eventType) {
              case 'INSERT':
                updatedTasks = [payload.new as Task, ...tasks];
                break;
              case 'UPDATE':
                updatedTasks = tasks.map((task: Task) =>
                  task.id === payload.new.id ? (payload.new as Task) : task
                );
                break;
              case 'DELETE':
                updatedTasks = tasks.filter((task: Task) => task.id !== payload.old.id);
                break;
            }

            return { ...prev, tasks: updatedTasks };
          });
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const addTask = useCallback(async (task: Partial<Task>) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await TaskService.createTask({
      ...task,
      user_id: user.id,
    });

    if (!error && data) {
      setState(prev => ({
        ...prev,
        tasks: [...prev.tasks, data as Task],
      }));
    }

    return { data, error };
  }, [user]);

  const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
    const { error } = await TaskService.updateTask(id, updates);

    if (!error) {
      setState(prev => ({
        ...prev,
        tasks: prev.tasks.map(task =>
          task.id === id ? { ...task, ...updates } : task
        ),
      }));
    }

    return { error };
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    const { error } = await TaskService.deleteTask(id);

    if (!error) {
      setState(prev => ({
        ...prev,
        tasks: prev.tasks.filter(task => task.id !== id),
      }));
    }

    return { error };
  }, []);

  const toggleTask = useCallback(async (id: string, completed: boolean) => {
    return updateTask(id, {
      completed,
      completed_at: completed ? new Date().toISOString() : null,
    });
  }, [updateTask]);

  return {
    ...state,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
  };
} 