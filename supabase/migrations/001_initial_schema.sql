-- ============================================================
-- Atlas Español — Initial Database Schema
-- Sprint 1: Foundation Platform
-- ============================================================

-- Enable extensions
create extension if not exists "uuid-ossp";

-- ============================================================
-- USERS (extends Supabase auth.users)
-- ============================================================
create table public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  name text not null default '',
  native_language text not null default 'English',
  current_level integer not null default 1 check (current_level between 1 and 6),
  target_level integer not null default 4 check (target_level between 1 and 6),
  target_accent text not null default 'general',
  main_goal text not null default 'beginner_to_conversational',
  daily_minutes integer not null default 15,
  learning_intensity text not null default 'steady',
  onboarding_complete boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.users enable row level security;

create policy "Users can read own data" on public.users
  for select using (auth.uid() = id);

create policy "Users can update own data" on public.users
  for update using (auth.uid() = id);

create policy "Users can insert own data" on public.users
  for insert with check (auth.uid() = id);

-- ============================================================
-- USER PROFILES (extended preferences)
-- ============================================================
create table public.user_profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade not null unique,
  career_context text,
  relationship_context text,
  travel_context text,
  sales_interest boolean not null default false,
  business_interest boolean not null default false,
  speaking_confidence integer not null default 5 check (speaking_confidence between 1 and 10),
  listening_confidence integer not null default 5 check (listening_confidence between 1 and 10),
  preferred_correction_style text not null default 'end_of_session',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_profiles enable row level security;

create policy "Users can manage own profile" on public.user_profiles
  for all using (auth.uid() = user_id);

-- ============================================================
-- LESSONS (curriculum library)
-- ============================================================
create table public.lessons (
  id uuid primary key default uuid_generate_v4(),
  level integer not null check (level between 1 and 6),
  module_name text not null,
  lesson_title text not null,
  lesson_goal text not null,
  vocabulary jsonb not null default '[]',
  grammar_focus text not null default '',
  scenario text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- Lessons are public (readable by all authenticated users)
alter table public.lessons enable row level security;
create policy "Authenticated users can read lessons" on public.lessons
  for select using (auth.uid() is not null);

-- ============================================================
-- USER LESSONS (progress tracking per lesson)
-- ============================================================
create table public.user_lessons (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade not null,
  lesson_id uuid references public.lessons(id) on delete cascade not null,
  status text not null default 'not_started' check (status in ('not_started', 'in_progress', 'completed')),
  score integer check (score between 0 and 100),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  unique(user_id, lesson_id)
);

alter table public.user_lessons enable row level security;
create policy "Users can manage own lesson progress" on public.user_lessons
  for all using (auth.uid() = user_id);

-- ============================================================
-- VOCABULARY ITEMS (per-user vocabulary bank)
-- ============================================================
create table public.vocabulary_items (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade not null,
  spanish text not null,
  english text not null,
  natural_colombian text not null default '',
  example_sentence text not null default '',
  category text not null default 'general',
  status text not null default 'new' check (status in ('new', 'learning', 'weak', 'strong', 'mastered')),
  review_due_at timestamptz not null default now(),
  times_seen integer not null default 0,
  times_correct integer not null default 0,
  times_incorrect integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.vocabulary_items enable row level security;
create policy "Users can manage own vocabulary" on public.vocabulary_items
  for all using (auth.uid() = user_id);

-- ============================================================
-- CORRECTIONS (mistake history)
-- ============================================================
create table public.corrections (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade not null,
  original_text text not null,
  corrected_text text not null,
  natural_colombian_text text not null default '',
  severity text not null check (severity in ('green', 'yellow', 'red')),
  category text not null,
  explanation text not null default '',
  practice_sentence text not null default '',
  created_at timestamptz not null default now()
);

alter table public.corrections enable row level security;
create policy "Users can manage own corrections" on public.corrections
  for all using (auth.uid() = user_id);

-- ============================================================
-- ROLE PLAY SESSIONS
-- ============================================================
create table public.role_play_sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade not null,
  mode text not null check (mode in ('sales', 'dating', 'travel', 'social')),
  scenario text not null,
  level integer not null check (level between 1 and 6),
  messages jsonb not null default '[]',
  score integer check (score between 0 and 100),
  summary text,
  created_at timestamptz not null default now()
);

alter table public.role_play_sessions enable row level security;
create policy "Users can manage own role play sessions" on public.role_play_sessions
  for all using (auth.uid() = user_id);

-- ============================================================
-- PROGRESS SNAPSHOTS
-- ============================================================
create table public.progress_snapshots (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade not null,
  cefr_estimate text not null,
  level integer not null check (level between 1 and 6),
  vocabulary_count integer not null default 0,
  speaking_score integer not null default 0 check (speaking_score between 0 and 100),
  listening_score integer not null default 0 check (listening_score between 0 and 100),
  grammar_score integer not null default 0 check (grammar_score between 0 and 100),
  business_score integer not null default 0 check (business_score between 0 and 100),
  culture_score integer not null default 0 check (culture_score between 0 and 100),
  confidence_score integer not null default 0 check (confidence_score between 0 and 100),
  created_at timestamptz not null default now()
);

alter table public.progress_snapshots enable row level security;
create policy "Users can manage own progress snapshots" on public.progress_snapshots
  for all using (auth.uid() = user_id);

-- ============================================================
-- WEEKLY REVIEWS
-- ============================================================
create table public.weekly_reviews (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade not null,
  summary text not null,
  top_errors text[] not null default '{}',
  new_words_mastered integer not null default 0,
  weak_words text[] not null default '{}',
  next_focus text not null default '',
  created_at timestamptz not null default now()
);

alter table public.weekly_reviews enable row level security;
create policy "Users can manage own weekly reviews" on public.weekly_reviews
  for all using (auth.uid() = user_id);

-- ============================================================
-- HELPER: auto-create user record on signup
-- ============================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- INDEXES
-- ============================================================
create index idx_user_lessons_user_id on public.user_lessons(user_id);
create index idx_vocabulary_items_user_id on public.vocabulary_items(user_id);
create index idx_vocabulary_items_review_due on public.vocabulary_items(review_due_at);
create index idx_corrections_user_id on public.corrections(user_id);
create index idx_lessons_level on public.lessons(level);
create index idx_progress_snapshots_user_id on public.progress_snapshots(user_id, created_at desc);
