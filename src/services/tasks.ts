import { supabase } from './supabase/client';
import { Task } from '@/types/database';
import { generateNextOccurrence, shouldCreateNextInstance } from './recurring';

export async function createTask(task: Partial<Task>) {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .insert([task])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
}

export async function updateTask(id: string, updates: Partial<Task>) {
  try {
    const { error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id);

    if (error) throw error;

    // Check if we need to create the next instance
    if (updates.completed) {
      const { data: task } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', id)
        .single();

      if (task && shouldCreateNextInstance(task)) {
        await createNextInstance(task);
      }
    }

    return { error: null };
  } catch (err) {
    return { error: err };
  }
}

export async function createNextInstance(task: Task) {
  if (!task.recurring_pattern || !task.due_date) return;

  const nextDueDate = generateNextOccurrence(
    new Date(task.due_date),
    task.recurring_pattern
  );

  if (!nextDueDate) return;

  const newTask: Partial<Task> = {
    user_id: task.user_id,
    title: task.title,
    description: task.description,
    due_date: nextDueDate.toISOString(),
    priority: task.priority,
    tags: task.tags,
    recurring_pattern: task.recurring_pattern,
    parent_task_id: task.id,
  };

  return createTask(newTask);
}

export async function deleteTask(id: string) {
  try {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { error: null };
  } catch (err) {
    return { error: err };
  }
} 