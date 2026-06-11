import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { SpanishLevel, CEFRLevel } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function levelToLabel(level: SpanishLevel): string {
  const labels: Record<SpanishLevel, string> = {
    1: 'Absolute Beginner',
    2: 'Survival Spanish',
    3: 'Social Spanish',
    4: 'Independent Speaker',
    5: 'Advanced Conversational',
    6: 'Professional Fluency',
  }
  return labels[level]
}

export function levelToCEFR(level: SpanishLevel): CEFRLevel {
  const map: Record<SpanishLevel, CEFRLevel> = {
    1: 'A0',
    2: 'A1',
    3: 'A2',
    4: 'B1',
    5: 'B2',
    6: 'C1',
  }
  return map[level]
}

export function formatStreak(days: number): string {
  if (days === 0) return 'Start your streak today'
  if (days === 1) return '1 day'
  return `${days} days`
}

export function getReviewInterval(status: string): number {
  const intervals: Record<string, number> = {
    new: 0,
    learning: 1,
    weak: 3,
    strong: 7,
    mastered: 30,
  }
  return intervals[status] ?? 1
}

export function severityColor(severity: 'green' | 'yellow' | 'red'): string {
  return {
    green: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    yellow: 'text-amber-600 bg-amber-50 border-amber-200',
    red: 'text-red-600 bg-red-50 border-red-200',
  }[severity]
}

const DAY_MS = 86_400_000

export function calculateStreak(completedDates: string[]): number {
  if (!completedDates.length) return 0

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const uniqueDays = new Set(
    completedDates.map(d => {
      const date = new Date(d)
      date.setHours(0, 0, 0, 0)
      return date.getTime()
    })
  )

  let current = today.getTime()

  // Allow streak to continue if nothing done today yet (check from yesterday)
  if (!uniqueDays.has(current)) current -= DAY_MS
  if (!uniqueDays.has(current)) return 0

  let streak = 0
  while (uniqueDays.has(current)) {
    streak++
    current -= DAY_MS
  }
  return streak
}

const VOCAB_STATUS_ORDER = ['new', 'learning', 'weak', 'strong', 'mastered'] as const

export function advanceVocabStatus(
  status: string,
  correct: boolean
): string {
  const idx = VOCAB_STATUS_ORDER.indexOf(status as typeof VOCAB_STATUS_ORDER[number])
  const base = idx < 0 ? 0 : idx
  if (correct) return VOCAB_STATUS_ORDER[Math.min(base + 1, VOCAB_STATUS_ORDER.length - 1)]
  return VOCAB_STATUS_ORDER[Math.max(base - 1, 1)]
}

export function nextReviewDate(newStatus: string): Date {
  const daysMap: Record<string, number> = {
    new: 0,
    learning: 1,
    weak: 3,
    strong: 7,
    mastered: 30,
  }
  const days = daysMap[newStatus] ?? 1
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date
}

export function severityLabel(severity: 'green' | 'yellow' | 'red'): string {
  return { green: 'Correct', yellow: 'Awkward', red: 'Incorrect' }[severity]
}
