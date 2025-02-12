import { supabase } from './supabase/client';
import { Statistics } from '@/types/database';

export async function updateDailyStatistics(userId: string, date: string) {
  try {
    // Calculate tasks completed today
    const { data: tasksData, error: tasksError } = await supabase
      .from('tasks')
      .select('id')
      .eq('user_id', userId)
      .eq('completed', true)
      .gte('completed_at', `${date}T00:00:00`)
      .lte('completed_at', `${date}T23:59:59`);

    if (tasksError) throw tasksError;

    // Calculate focus time today
    const { data: focusData, error: focusError } = await supabase
      .from('focus_sessions')
      .select('duration')
      .eq('user_id', userId)
      .eq('completed', true)
      .gte('start_time', `${date}T00:00:00`)
      .lte('end_time', `${date}T23:59:59`);

    if (focusError) throw focusError;

    const tasksCompleted = tasksData.length;
    const focusTime = focusData.reduce((sum, session) => sum + (session.duration || 0), 0);
    
    // Calculate productivity score (simple algorithm)
    const productivityScore = Math.min(
      (tasksCompleted * 0.4 + (focusTime / 3600) * 0.6) / 10,
      1
    );

    // Update or insert statistics
    const { error: upsertError } = await supabase
      .from('statistics')
      .upsert({
        user_id: userId,
        date,
        tasks_completed: tasksCompleted,
        focus_time: focusTime,
        productivity_score: productivityScore,
      });

    if (upsertError) throw upsertError;

    return { error: null };
  } catch (error) {
    return { error };
  }
} 