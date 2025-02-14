import { User, Session } from '@supabase/supabase-js';

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: Error | null;
}

export interface Database {
    public: {
      Tables: {
        users: {
          Row: {
            id: string
            email: string
            username: string
            created_at: string
            last_login: string | null
            settings: Record<string, any>
            avatar_url: string | null
            is_active: boolean
          }
          Insert: Omit<Users['Row'], 'id' | 'created_at'>
          Update: Partial<Users['Row']>
        }
        tasks: {
          Row: {
            id: string
            user_id: string
            title: string
            description: string | null
            due_date: string | null
            completed: boolean
            completed_at: string | null
            priority: number
            tags: string[] | null
            recurring_pattern: Record<string, any> | null
            created_at: string
            updated_at: string
          }
          Insert: Omit<Tasks['Row'], 'id' | 'created_at' | 'updated_at'>
          Update: Partial<Tasks['Row']>
        }
        focus_sessions: {
          Row: {
            id: string
            user_id: string
            start_time: string
            end_time: string | null
            duration: number
            completed: boolean
            task_id: string | null
            notes: string | null
            created_at: string
          }
          Insert: Omit<FocusSessions['Row'], 'id' | 'created_at'>
          Update: Partial<FocusSessions['Row']>
        }
        diary_entries: {
          Row: {
            id: string
            user_id: string
            content: string
            mood: string | null
            tags: string[] | null
            attachments: Record<string, any> | null
            created_at: string
            updated_at: string
          }
          Insert: Omit<DiaryEntries['Row'], 'id' | 'created_at' | 'updated_at'>
          Update: Partial<DiaryEntries['Row']>
        }
        statistics: {
          Row: {
            id: string
            user_id: string
            date: string
            tasks_completed: number
            focus_time: number
            productivity_score: number
            mood_average: string | null
            created_at: string
          }
          Insert: Omit<Statistics['Row'], 'id' | 'created_at'>
          Update: Partial<Statistics['Row']>
        }
        ai_chat_history: {
          Row: {
            id: string
            user_id: string
            message: string
            role: string
            created_at: string
            context: Record<string, any> | null
          }
          Insert: Omit<AIChatHistory['Row'], 'id' | 'created_at'>
          Update: Partial<AIChatHistory['Row']>
        }
      }
    }
  }
  
  export type Users = Database['public']['Tables']['users']
  export type Tasks = Database['public']['Tables']['tasks']
  export type FocusSessions = Database['public']['Tables']['focus_sessions']
  export type DiaryEntries = Database['public']['Tables']['diary_entries']
  export type Statistics = Database['public']['Tables']['statistics']
  export type AIChatHistory = Database['public']['Tables']['ai_chat_history']
  
  export type Task = Database['public']['Tables']['tasks']['Row']
  export type TaskInsert = Database['public']['Tables']['tasks']['Insert']
  export type TaskUpdate = Database['public']['Tables']['tasks']['Update']
  
  export type DiaryEntry = Database['public']['Tables']['diary_entries']['Row']
  export type DiaryEntryInsert = Database['public']['Tables']['diary_entries']['Insert']
  export type DiaryEntryUpdate = Database['public']['Tables']['diary_entries']['Update']
  
  export type FocusSession = Database['public']['Tables']['focus_sessions']['Row']
  export type FocusSessionInsert = Database['public']['Tables']['focus_sessions']['Insert']
  export type FocusSessionUpdate = Database['public']['Tables']['focus_sessions']['Update']
  
  export type User = Database['public']['Tables']['users']['Row']
  export type UserInsert = Database['public']['Tables']['users']['Insert']
  export type UserUpdate = Database['public']['Tables']['users']['Update']
  
  export type Statistic = Database['public']['Tables']['statistics']['Row']
  export type StatisticInsert = Database['public']['Tables']['statistics']['Insert']
  export type StatisticUpdate = Database['public']['Tables']['statistics']['Update']
  
  export type AIChatHistoryEntry = Database['public']['Tables']['ai_chat_history']['Row']
  export type AIChatHistoryInsert = Database['public']['Tables']['ai_chat_history']['Insert']
  export type AIChatHistoryUpdate = Database['public']['Tables']['ai_chat_history']['Update']
  
  export interface RecurringPattern {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval?: number;  // How many units (days/weeks/months/years) between occurrences
    weekdays?: number[];  // Array of days (0-6, where 0 is Sunday) for weekly pattern
    monthDay?: number;  // Day of the month for monthly pattern
    endDate?: string;  // ISO date string for when the pattern should end
  }
  