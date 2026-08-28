-- ============================================================
-- Atlas Español — Sprint 4 Schema Updates
-- ============================================================

-- Track when a word first reached mastered status, so weekly
-- reviews count genuinely new masteries instead of re-counting
-- old mastered words whose updated_at was bumped by a review.
alter table public.vocabulary_items add column mastered_at timestamptz;

-- Backfill: existing mastered words use their last update as the
-- best available approximation.
update public.vocabulary_items set mastered_at = updated_at where status = 'mastered';
