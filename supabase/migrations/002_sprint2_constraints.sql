-- ============================================================
-- Atlas Español — Sprint 2 Schema Updates
-- ============================================================

-- Add unique constraint to vocabulary_items so lesson completion
-- can upsert without creating duplicates per user
alter table public.vocabulary_items
  add constraint vocabulary_items_user_spanish_unique unique (user_id, spanish);
