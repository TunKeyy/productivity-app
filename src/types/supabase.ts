import { Database } from './database';

export type Tables = Database['public']['Tables'];
export type TaskRow = Tables['tasks']['Row'];
export type TaskInsert = Tables['tasks']['Insert'];
export type TaskUpdate = Tables['tasks']['Update'];

export interface RealtimePayload<T> {
  commit_timestamp: string;
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  schema: string;
  table: string;
  old: T | null;
  new: T | null;
} 