import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/services/supabase/client';
import { DiaryEntry, DiaryState } from '@/types/database';
import { useAuth } from './useAuth';

export function useDiary() {
  const { user } = useAuth();
  const [state, setState] = useState<DiaryState>({
    entries: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!user) return;

    const fetchEntries = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));

        const { data, error } = await supabase
          .from('diary_entries')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        setState(prev => ({
          ...prev,
          entries: data as DiaryEntry[],
          loading: false,
        }));
      } catch (err) {
        const error = err as Error;
        setState(prev => ({
          ...prev,
          loading: false,
          error: error.message,
        }));
      }
    };

    fetchEntries();
  }, [user]);

  const addEntry = useCallback(async (content: string, mood?: string, tags?: string[]) => {
    try {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('diary_entries')
        .insert([
          {
            user_id: user.id,
            content,
            mood,
            tags,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setState(prev => ({
        ...prev,
        entries: [data as DiaryEntry, ...prev.entries],
      }));

      return { data, error: null };
    } catch (err) {
      const error = err as Error;
      setState(prev => ({ ...prev, error: error.message }));
      return { data: null, error };
    }
  }, [user]);

  const updateEntry = useCallback(async (id: string, updates: Partial<DiaryEntry>) => {
    try {
      const { error } = await supabase
        .from('diary_entries')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

      setState(prev => ({
        ...prev,
        entries: prev.entries.map(entry =>
          entry.id === id
            ? { ...entry, ...updates, updated_at: new Date().toISOString() }
            : entry
        ),
      }));

      return { error: null };
    } catch (err) {
      const error = err as Error;
      setState(prev => ({ ...prev, error: error.message }));
      return { error };
    }
  }, []);

  const deleteEntry = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('diary_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setState(prev => ({
        ...prev,
        entries: prev.entries.filter(entry => entry.id !== id),
      }));

      return { error: null };
    } catch (err) {
      const error = err as Error;
      setState(prev => ({ ...prev, error: error.message }));
      return { error };
    }
  }, []);

  return {
    ...state,
    addEntry,
    updateEntry,
    deleteEntry,
  };
} 