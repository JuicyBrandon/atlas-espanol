# AGENTS.md — Atlas Español

## Project Overview

Atlas Español is an AI-powered Colombian Spanish fluency coach built with Next.js App Router, TypeScript, Tailwind CSS, and Supabase.

**Mission:** Take English speakers from complete beginner to professional working fluency in Colombian Spanish.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI Components | Custom (Radix primitives) |
| Animation | Framer Motion |
| Database | Supabase (Postgres) |
| Auth | Supabase Auth (SSR) |
| AI | Anthropic Claude API (Sprint 3) |
| Deployment | Vercel |

---

## Project Structure

```
src/
  app/
    (auth)/          Login, Register pages
    (app)/           Protected app pages (AppShell layout)
      dashboard/     Main home
      onboarding/    Multi-step onboarding wizard
      lesson/        Lesson player
      coach/         AI coach chat
      roleplays/     Role play modes
      vocabulary/    Spaced repetition review
      corrections/   Mistake history
      progress/      Analytics dashboard
      settings/      User preferences
  components/
    ui/              Reusable primitives (Button, Input, Card, Badge, ProgressBar)
    layout/          AppShell, SidebarNav
    dashboard/       StatsGrid, TodayCard
    onboarding/      OnboardingWizard
    coach/           ChatWindow
    lesson/          (Sprint 2)
  lib/
    supabase/        client.ts, server.ts, middleware.ts
    utils.ts         cn(), levelToLabel(), severityColor()
    constants.ts     Palette, levels, options
  types/
    index.ts         All TypeScript types
supabase/
  migrations/        001_initial_schema.sql
  seed/              curriculum_level1.sql
```

---

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # ESLint
npx tsc --noEmit     # Type check
```

---

## Design System

**Palette (Atlas)**
- Navy: `#1E2A3A` — primary text, backgrounds, nav
- Ivory: `#F8F4EC` — page background
- Gold: `#F2C94C` — primary accent, CTAs, highlights
- Blue: `#4A90E2` — links, secondary actions
- Coffee: `#6F4E37` — body text, warm secondary
- Success: `#27AE60`
- Warning: `#F2994A`
- Error: `#EB5757`

**Typography:** Geist Sans (body), Geist Mono (code/data)

---

## Sprint Status

| Sprint | Focus | Status |
|---|---|---|
| 1 | Foundation — Auth, Shell, Onboarding, Dashboard, Lesson | COMPLETE |
| 2 | Curriculum, AI Lesson Gen, Corrections, Vocabulary | TODO |
| 3 | Role Plays (Sales, Dating, Travel), Colombianise It | TODO |
| 4 | Vocabulary Review, Progress Dashboard, Weekly Review | TODO |
| 5 | Voice Notes, Audio Recording, Transcription | TODO |

---

## Key Conventions

- **Server Components by default** — only add `'use client'` when needed for interactivity
- **RLS enforced** on all tables — never bypass using service role in client code
- **Colombian Spanish always** — never default to Spain or Mexican Spanish
- **Corrections are colour-coded**: green (correct), yellow (awkward), red (wrong)
- **Mock AI responses** in Sprint 1 — replace with real API in Sprint 3
- **No emojis in UI** — use Lucide icons throughout

---

## Database Tables

`users` → `user_profiles` → `user_lessons` → `vocabulary_items` → `corrections` → `role_play_sessions` → `progress_snapshots` → `weekly_reviews`

All tables have RLS. Auto-trigger creates `users` row on `auth.users` insert.

---

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY      (server-side only)
ANTHROPIC_API_KEY              (Sprint 3)
```

---

## Acceptance Criteria (Sprint 1)

- [x] User can register
- [x] User can login
- [x] User is redirected to onboarding on first sign-up
- [x] User completes onboarding wizard (8 steps)
- [x] Dashboard renders with stats, today's lesson, quick actions
- [x] Lesson page works with step flow (intro, vocabulary, phrase, practice, complete)
- [x] Coach page renders with mock AI responses
- [x] All protected routes redirect to /login when unauthenticated
- [x] Database schema matches types
- [x] App is mobile responsive
