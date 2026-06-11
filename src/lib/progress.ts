// ============================================================
// Atlas Español — Progress Intelligence (Sprint 4)
// Pure scoring functions. All scores are 0–100 proxies computed
// from real activity data; formulas are intentionally simple and
// documented so they can be tuned as more signal arrives.
// ============================================================

import type { CorrectionCategory, CorrectionSeverity, SpanishLevel } from '@/types'
import { levelToCEFR } from '@/lib/utils'

// A weekly review unlocks after this many sessions (lessons + role plays)
export const SESSIONS_PER_REVIEW = 7

// Filter items whose timestamp falls within the last N days
export function withinDays<T>(
  items: T[],
  getTimestamp: (item: T) => string | null | undefined,
  days: number
): T[] {
  const cutoff = Date.now() - days * 86_400_000
  return items.filter(item => {
    const t = getTimestamp(item)
    return !!t && new Date(t).getTime() >= cutoff
  })
}

export interface SkillScores {
  speaking: number
  listening: number
  grammar: number
  business: number
  culture: number
  confidence: number
}

export interface ScoreInput {
  vocabItems: Array<{ status: string; times_seen: number; times_correct: number }>
  corrections: Array<{ severity: CorrectionSeverity; category: string; created_at: string }>
  rolePlays: Array<{ mode: string; score: number | null }>
  lessonsCompleted: number
  streak: number
}

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)))

function average(values: number[]): number | null {
  return values.length ? values.reduce((a, b) => a + b, 0) / values.length : null
}

export function computeSkillScores(input: ScoreInput): SkillScores {
  const { vocabItems, corrections, rolePlays, lessonsCompleted, streak } = input

  const scoredPlays = rolePlays.filter(r => r.score !== null) as Array<{ mode: string; score: number }>
  const allPlayAvg = average(scoredPlays.map(r => r.score))
  const salesAvg = average(scoredPlays.filter(r => r.mode === 'sales').map(r => r.score))
  const socialAvg = average(
    scoredPlays.filter(r => r.mode !== 'sales').map(r => r.score)
  )

  const mastered = vocabItems.filter(v => v.status === 'mastered' || v.status === 'strong').length
  const masteredRatio = vocabItems.length ? mastered / vocabItems.length : 0

  // Vocab recall accuracy across reviewed items
  const reviewed = vocabItems.filter(v => v.times_seen > 0)
  const recallAccuracy = reviewed.length
    ? reviewed.reduce((acc, v) => acc + v.times_correct / v.times_seen, 0) / reviewed.length
    : null

  // Recent error pressure: red corrections weigh double
  const twoWeeksAgo = Date.now() - 14 * 86_400_000
  const recent = corrections.filter(c => new Date(c.created_at).getTime() >= twoWeeksAgo)
  const errorPressure = recent.reduce((acc, c) => acc + (c.severity === 'red' ? 2 : 1), 0)

  // Speaking: role play performance; before any role plays, lesson practice is the only signal
  const speaking = allPlayAvg !== null ? clamp(allPlayAvg) : clamp(Math.min(lessonsCompleted * 5, 40))

  // Listening: lesson exposure plus retained vocabulary
  const listening = clamp(lessonsCompleted * 4 + masteredRatio * 40)

  // Grammar: recall accuracy minus recent error pressure
  const grammarBase = recallAccuracy !== null ? recallAccuracy * 100 : Math.min(lessonsCompleted * 5, 50)
  const grammar = clamp(grammarBase - errorPressure * 3)

  // Business: sales role plays only
  const business = salesAvg !== null ? clamp(salesAvg) : 0

  // Culture: social/dating/travel role plays plus retained Colombian vocabulary
  const cultureBase = socialAvg !== null ? socialAvg * 0.6 : 0
  const culture = clamp(cultureBase + masteredRatio * 40)

  // Confidence: consistency (streak) plus volume of practice
  const confidence = clamp(streak * 8 + (lessonsCompleted + scoredPlays.length) * 3)

  return { speaking, listening, grammar, business, culture, confidence }
}

// ------------------------------------------------------------
// CEFR estimate with progress within the level
// ------------------------------------------------------------

export interface CefrEstimate {
  cefr: string
  nextCefr: string | null
  progressPercent: number
}

export function computeCefrEstimate(
  level: SpanishLevel,
  completedAtLevel: number,
  totalAtLevel: number
): CefrEstimate {
  const progressPercent = totalAtLevel > 0
    ? clamp((completedAtLevel / totalAtLevel) * 100)
    : 0
  const nextLevel = level < 6 ? ((level + 1) as SpanishLevel) : null
  return {
    cefr: levelToCEFR(level),
    nextCefr: nextLevel ? levelToCEFR(nextLevel) : null,
    progressPercent,
  }
}

// ------------------------------------------------------------
// Weekly activity — sessions per day over the last 7 days
// ------------------------------------------------------------

export interface DayActivity {
  label: string
  count: number
  isToday: boolean
}

export function buildWeeklyActivity(timestamps: string[]): DayActivity[] {
  const days: DayActivity[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let i = 6; i >= 0; i--) {
    const day = new Date(today.getTime() - i * 86_400_000)
    const next = new Date(day.getTime() + 86_400_000)
    const count = timestamps.filter(t => {
      const d = new Date(t).getTime()
      return d >= day.getTime() && d < next.getTime()
    }).length
    days.push({
      label: day.toLocaleDateString('en-AU', { weekday: 'narrow' }),
      count,
      isToday: i === 0,
    })
  }
  return days
}

// ------------------------------------------------------------
// Adaptive recommendation — what should the user do next?
// ------------------------------------------------------------

export interface Recommendation {
  title: string
  description: string
  href: string
  cta: string
}

const CATEGORY_LABELS: Partial<Record<CorrectionCategory, string>> = {
  ser_estar: 'ser vs estar',
  por_para: 'por vs para',
  verb_tense: 'verb tenses',
  gender: 'gender agreement',
  word_order: 'word order',
  articles: 'articles',
  formality: 'formality (tú vs usted)',
  vocabulary: 'vocabulary choice',
  tone: 'tone',
  cultural_nuance: 'cultural nuance',
  pronunciation: 'pronunciation',
}

export function computeRecommendation(input: {
  dueReviews: number
  recentCorrections: Array<{ category: string }>
  rolePlayCount: number
  userLevel: SpanishLevel
}): Recommendation {
  const { dueReviews, recentCorrections, rolePlayCount, userLevel } = input

  if (dueReviews >= 5) {
    return {
      title: 'Clear your review queue',
      description: `${dueReviews} words are due for review. Spaced repetition only works when you keep up with it.`,
      href: '/vocabulary',
      cta: 'Review now',
    }
  }

  // Most frequent recent mistake category (3+ occurrences)
  const counts = new Map<string, number>()
  for (const c of recentCorrections) {
    counts.set(c.category, (counts.get(c.category) ?? 0) + 1)
  }
  const [topCategory, topCount] = [...counts.entries()].sort((a, b) => b[1] - a[1])[0] ?? [null, 0]

  if (topCategory && topCount >= 3) {
    const label = CATEGORY_LABELS[topCategory as CorrectionCategory] ?? topCategory
    return {
      title: `Work on ${label}`,
      description: `${topCount} of your recent corrections involve ${label}. Review them, then practise with your coach.`,
      href: '/corrections',
      cta: 'See corrections',
    }
  }

  if (rolePlayCount < 2 && userLevel >= 2) {
    return {
      title: 'Try a role play',
      description: 'Real conversations are where fluency is built. Pick a scenario that matches your goals.',
      href: '/roleplays',
      cta: 'Choose a scenario',
    }
  }

  return {
    title: "Continue today's lesson",
    description: 'Steady daily lessons are the fastest path to the next level.',
    href: '/lesson',
    cta: 'Start lesson',
  }
}

// ------------------------------------------------------------
// Next milestone
// ------------------------------------------------------------

export function computeNextMilestone(input: {
  userLevel: SpanishLevel
  completedAtLevel: number
  totalAtLevel: number
  vocabularyCount: number
  streak: number
}): string {
  const { userLevel, completedAtLevel, totalAtLevel, vocabularyCount, streak } = input

  const lessonsLeft = totalAtLevel - completedAtLevel
  if (totalAtLevel > 0 && lessonsLeft > 0 && lessonsLeft <= 3) {
    return userLevel < 6
      ? `${lessonsLeft} lesson${lessonsLeft === 1 ? '' : 's'} until Level ${userLevel + 1}`
      : `${lessonsLeft} lesson${lessonsLeft === 1 ? '' : 's'} to complete Level 6`
  }
  if (streak > 0 && streak < 7) {
    return `${7 - streak} more day${7 - streak === 1 ? '' : 's'} to a 7-day streak`
  }
  if (vocabularyCount > 0 && vocabularyCount < 50) {
    return `${50 - vocabularyCount} words until your first 50`
  }
  if (totalAtLevel > 0 && lessonsLeft > 0) {
    return `${lessonsLeft} lessons left at Level ${userLevel}`
  }
  return 'Complete a lesson to set your next milestone'
}
