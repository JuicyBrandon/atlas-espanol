-- Sprint 5: Voice notes

create table public.voice_notes (
  id               uuid        primary key default gen_random_uuid(),
  user_id          uuid        not null references auth.users(id) on delete cascade,
  transcript       text        not null,
  corrected_text   text,
  severity         text,
  explanation      text,
  duration_seconds int,
  created_at       timestamptz default now()
);

alter table public.voice_notes enable row level security;

create policy "Users manage own voice notes"
  on public.voice_notes
  for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);
