# Atlas Español

> Colombian Spanish fluency coach — from complete beginner to professional working fluency.

## What it is

Atlas Español is an AI-powered language learning platform that takes English speakers from zero to professional fluency in Colombian Spanish. It combines structured curriculum, AI conversation coaching, role plays, and adaptive learning — built to feel like a personal coach, not a generic course library.

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Supabase** (Auth + Postgres)
- **Framer Motion**
- **Anthropic Claude API** (Sprint 3)
- **Vercel** (deployment)

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/atlas-espanol.git
cd atlas-espanol
npm install
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run the migration: `supabase/migrations/001_initial_schema.sql`
3. Run the seed: `supabase/seed/curriculum_level1.sql`

### 3. Environment variables

```bash
cp .env.example .env.local
```

Fill in your Supabase URL and anon key.

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Sprint Roadmap

| Sprint | Focus | Status |
|---|---|---|
| 1 | Foundation — Auth, Shell, Onboarding, Dashboard | COMPLETE |
| 2 | Curriculum Engine, AI Lesson Gen, Vocabulary | Next |
| 3 | Role Plays — Sales, Dating, Travel | Planned |
| 4 | Progress Intelligence, CEFR tracking | Planned |
| 5 | Voice Notes, Audio Recording | Planned |

## Project Structure

```
src/
  app/            Pages and routes (App Router)
  components/     Reusable UI and feature components
  lib/            Supabase clients, utils, constants
  types/          TypeScript type definitions
supabase/
  migrations/     Database schema
  seed/           Curriculum data
```

## Design

- **Palette:** Navy `#1E2A3A` · Ivory `#F8F4EC` · Gold `#F2C94C` · Blue `#4A90E2`
- **Font:** Geist Sans
- **Principle:** Premium, warm, Colombian-inspired — not tourist, not generic

---

Built with BMAD — Build, Measure, Adapt, Deliver.
