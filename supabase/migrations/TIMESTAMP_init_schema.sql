-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create users table (extends Supabase auth.users)
create table if not exists public.users (
    id uuid primary key references auth.users(id) on delete cascade,
    email text unique not null,
    username text unique not null,
    created_at timestamp with time zone default now(),
    last_login timestamp with time zone,
    settings jsonb default '{}'::jsonb,
    avatar_url text,
    is_active boolean default true
);

-- Create tasks table
create table if not exists public.tasks (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.users(id) on delete cascade,
    title text not null,
    description text,
    due_date timestamp with time zone,
    completed boolean default false,
    completed_at timestamp with time zone,
    priority smallint default 0,
    tags text[],
    recurring_pattern jsonb,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Create focus_sessions table
create table if not exists public.focus_sessions (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.users(id) on delete cascade,
    start_time timestamp with time zone not null,
    end_time timestamp with time zone,
    duration interval not null,
    completed boolean default false,
    task_id uuid references public.tasks(id) on delete set null,
    notes text,
    created_at timestamp with time zone default now()
);

-- Create diary_entries table
create table if not exists public.diary_entries (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.users(id) on delete cascade,
    content text not null,
    mood text,
    tags text[],
    attachments jsonb,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Create statistics table
create table if not exists public.statistics (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.users(id) on delete cascade,
    date date not null,
    tasks_completed integer default 0,
    focus_time interval default '0'::interval,
    productivity_score numeric(3,2),
    mood_average text,
    created_at timestamp with time zone default now(),
    unique(user_id, date)
);

-- Create ai_chat_history table
create table if not exists public.ai_chat_history (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.users(id) on delete cascade,
    message text not null,
    role text not null,
    created_at timestamp with time zone default now(),
    context jsonb
);

-- Enable Row Level Security
alter table public.users enable row level security;
alter table public.tasks enable row level security;
alter table public.focus_sessions enable row level security;
alter table public.diary_entries enable row level security;
alter table public.statistics enable row level security;
alter table public.ai_chat_history enable row level security;

-- Create policies
create policy "Users can view own profile"
    on public.users for select
    using (auth.uid() = id);

create policy "Users can update own profile"
    on public.users for update
    using (auth.uid() = id);

-- Add similar policies for other tables... 