-- Sprint 7: AI-generated lessons marker
-- Generated lessons do not count toward level-up progression
alter table public.lessons add column if not exists is_generated boolean not null default false;

create index if not exists idx_lessons_is_generated on public.lessons(level, is_generated);
