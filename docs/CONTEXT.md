# Productivity Management App Documentation

## Overview
A comprehensive productivity and task management application featuring task tracking, focus timer, calendar integration, AI assistance, and personal diary functionality.

## Tech Stack
Frontend: React Native with TypeScript, Expo, and Expo Router
Backend/Database: Supabase
UI Framework: React Native Paper
AI Processing: DeepSeek

## Authentication Flow

### Login Screen
#### Layout
- App logo centered at top
- "Login" title below logo
- Input fields:
  - Username (email format)
  - Password (masked)
- Login button (primary color)
- "Don't have an account? Create one" text link
- Google Sign-in button

#### Functionality
- Form validation for required fields
- Error handling for invalid credentials
- Redirect to Home screen on successful login
- Navigation to Register screen via link
- OAuth integration for Google login

### Register Screen
#### Layout
- "Create Account" title
- Input fields:
  - Username
  - Password
  - Password confirmation
- Register button

#### Functionality
- Password matching validation
- Username availability check
- Automatic login after successful registration

## Core Navigation

### Bottom Navigation Bar
- 5 icons with labels:
  - Statistics (leftmost)
  - Calendar
  - Home (center, larger size)
  - AI Assistant
  - Diary (rightmost)
- Active icon highlighted
- Home icon elevated and prominent

## Main Features

### Home Screen
#### Header
- App name
- User avatar/menu (optional)

#### Daily Tasks Section
- Card showing current date
- Task counter: "X/Y Tasks Completed"
- Task List:
  - Task items with:
    - Checkbox
    - Task title
    - Due time (if applicable)
  - Sorting:
    - Incomplete tasks at top (gray color)
    - Completed tasks at bottom (green color)
  - Auto-resort on task completion
- Focus Mode Button:
  - Fixed position floating button
  - Opens Focus timer screen

### Focus Timer Screen
#### Session Info
- Duration display: "15 min activity"
- Time range: "5:30pm → 5:45pm"

#### Timer Display
- Circular progress indicator
- Remaining time in center
- Progress fills clockwise

#### Controls
- Pause/Resume button
- Cancel session option
- Complete session confirmation

### Calendar Screen
#### Layout
- Header with "Calendar" title
- Month-Year selector
- Calendar Grid:
  - Month view with dates
  - Task indicators on dates
  - Current date highlighted
- Date Detail View:
  - Opens on date selection
  - Lists all tasks for selected date
  - Add/Remove task functionality
  - Task details editing

### AI Assistant Screen
#### Interface
- Chat Interface:
  - Message thread layout
  - User messages right-aligned
  - AI responses left-aligned
- Input Methods:
  - Text input field with send button
  - Voice input option

#### Functionality
- Natural language task management
- Date-based task queries
- Task modification commands
- Context-aware responses

### Statistics Screen
#### Components
- Time Period Selectors:
  - Month view
  - Year view
- Metrics Display:
  - Total tasks count
  - Completion rate percentage
  - Productivity score
- Visualization:
  - Line graph showing:
    - Monthly productivity trends
    - Year-to-date progress
    - Interactive data points

### Diary Screen
#### Editor
- Rich text formatting toolbar:
  - Bold
  - Italic
  - Underline
  - Bullet points
  - Text color
  - Background color
- Main content area
- Controls:
  - Save button
  - Clear button
- History View:
  - Access via storage icon
  - Lists entries by date
  - Preview of content
  - Edit/Delete functionality

## Additional Notes

### Data Management
- Local storage for offline access
- Cloud sync when online
- Secure encryption for personal data
- Regular auto-save for diary entries

### Technical Considerations
- Responsive design for various screen sizes
- Dark/Light theme support
- Offline functionality
- Push notifications for tasks
- Data backup/restore functionality

### Security Features
- Encrypted data storage
- Secure authentication
- Session management
- Privacy controls for AI data

### Error Handling
- Network connectivity issues
- Data sync conflicts
- Invalid input validation
- Graceful degradation of features

### Performance Guidelines
- Smooth animations
- Quick load times
- Efficient data caching
- Battery usage optimization

### Users Table
```sql
users (
    id uuid primary key,
    email text unique not null,
    username text unique not null,
    created_at timestamp with time zone default now(),
    last_login timestamp with time zone,
    settings jsonb default '{}'::jsonb,
    avatar_url text,
    is_active boolean default true
)
```

### Tasks Table
```sql
tasks (
  id uuid primary key,
  user_id uuid references users(id) on delete cascade,
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
)
```

### Focus Sessions Table
```sql
focus_sessions (
  id uuid primary key,
  user_id uuid references users(id) on delete cascade,
  start_time timestamp with time zone not null,
  end_time timestamp with time zone,
  duration interval not null,
  completed boolean default false,
  task_id uuid references tasks(id) on delete set null,
  notes text,
  created_at timestamp with time zone default now()
)
```

### Diary Entries Table
```sql
diary_entries (
  id uuid primary key,
  user_id uuid references users(id) on delete cascade,
  content text not null,
  mood text,
  tags text[],
  attachments jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
)
```

### Statistics Table
```sql
statistics (
  id uuid primary key,
  user_id uuid references users(id) on delete cascade,
  date date not null,
  tasks_completed integer default 0,
  focus_time interval default '0'::interval,
  productivity_score numeric(3,2),
  mood_average text,
  created_at timestamp with time zone default now(),
  unique(user_id, date)
)
```

### AI Chat History Table
```sql
ai_chat_history (
  id uuid primary key,
  user_id uuid references users(id) on delete cascade,
  message text not null,
  role text not null,
  created_at timestamp with time zone default now(),
  context jsonb
)
```

## Project Structure
```
src/
├── app/                     # Expo Router screens
│   ├── (auth)/             # Authentication routes
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── forgot-password.tsx
│   ├── (tabs)/             # Main tab navigation
│   │   ├── home/
│   │   │   ├── index.tsx
│   │   │   └── task/[id].tsx
│   │   ├── calendar/
│   │   │   ├── index.tsx
│   │   │   └── event/[id].tsx
│   │   ├── statistics.tsx
│   │   ├── ai.tsx
│   │   └── diary/
│   │       ├── index.tsx
│   │       └── entry/[id].tsx
│   ├── focus/              # Focus timer routes
│   │   ├── index.tsx
│   │   └── session/[id].tsx
│   └── _layout.tsx         # Root layout
├── components/             # Reusable components
│   ├── common/            # Shared components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── Loading.tsx
│   ├── tasks/            # Task-related components
│   │   ├── TaskItem.tsx
│   │   ├── TaskList.tsx
│   │   └── TaskForm.tsx
│   ├── focus/           # Focus timer components
│   ├── calendar/        # Calendar components
│   ├── statistics/      # Statistics components
│   └── diary/          # Diary components
├── hooks/               # Custom React hooks
│   ├── useAuth.ts
│   ├── useTasks.ts
│   ├── useFocus.ts
│   ├── useStatistics.ts
│   └── useTheme.ts
├── services/           # API and external services
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── auth.ts
│   │   └── db.ts
│   ├── ai/
│   │   ├── client.ts
│   │   └── prompts.ts
│   └── notifications.ts
├── store/             # State management
│   ├── auth/
│   │   ├── slice.ts
│   │   └── thunks.ts
│   ├── tasks/
│   └── settings/
├── types/             # TypeScript definitions
│   ├── database.ts
│   ├── navigation.ts
│   └── api.ts
├── utils/             # Helper functions
│   ├── date.ts
│   ├── validation.ts
│   ├── storage.ts
│   └── formatting.ts
├── constants/         # App constants
│   ├── colors.ts
│   ├── theme.ts
│   └── config.ts
└── assets/           # Static assets
    ├── images/
    ├── fonts/
    └── animations/
```

The database schema includes foreign key constraints with `on delete cascade` for proper data cleanup, and the folder structure follows a modular approach with clear separation of concerns. The structure supports scalability and maintainability while following React Native and Expo best practices.
