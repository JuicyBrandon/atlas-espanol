import type { SpanishLevel } from '@/types'

export type AchievementCategory = 'foundations' | 'vocabulary' | 'practice' | 'milestones'

export interface Achievement {
  slug: string
  title: string
  description: string
  category: AchievementCategory
  earned: boolean
  progressCurrent: number
  progressTotal: number
}

export interface AchievementStats {
  lessonsCompleted: number
  streak: number
  vocabularyCount: number
  masteredCount: number
  rolePlaysCount: number
  voiceNotesCount: number
  correctionsCount: number
  userLevel: SpanishLevel
}

function ach(
  slug: string,
  title: string,
  description: string,
  category: AchievementCategory,
  current: number,
  total: number,
): Achievement {
  return { slug, title, description, category, earned: current >= total, progressCurrent: current, progressTotal: total }
}

export function computeAchievements(s: AchievementStats): Achievement[] {
  return [
    // Foundations
    ach('first_lesson', 'First Steps', 'Complete your first lesson', 'foundations', s.lessonsCompleted, 1),
    ach('lessons_10', 'Getting Fluent', 'Complete 10 lessons', 'foundations', s.lessonsCompleted, 10),
    ach('lessons_25', 'Half Century', 'Complete 25 lessons', 'foundations', s.lessonsCompleted, 25),
    ach('streak_3', 'On a Roll', '3-day learning streak', 'foundations', s.streak, 3),
    ach('streak_7', 'Week Warrior', '7-day learning streak', 'foundations', s.streak, 7),
    ach('streak_30', 'Unstoppable', '30-day learning streak', 'foundations', s.streak, 30),

    // Vocabulary
    ach('words_10', 'Word Bank', 'Add 10 words to your vocabulary', 'vocabulary', s.vocabularyCount, 10),
    ach('words_50', 'Vocabulario', '50 words in your bank', 'vocabulary', s.vocabularyCount, 50),
    ach('words_100', 'Word Rich', '100 words in your bank', 'vocabulary', s.vocabularyCount, 100),
    ach('mastered_10', 'Word Master', 'Master 10 vocabulary words', 'vocabulary', s.masteredCount, 10),
    ach('mastered_50', 'Memory Vault', 'Master 50 vocabulary words', 'vocabulary', s.masteredCount, 50),

    // Practice
    ach('first_roleplay', 'In Character', 'Complete your first role play', 'practice', s.rolePlaysCount, 1),
    ach('roleplays_5', 'Natural Speaker', 'Complete 5 role plays', 'practice', s.rolePlaysCount, 5),
    ach('first_voice', 'Voice Active', 'Record your first voice note', 'practice', s.voiceNotesCount, 1),
    ach('corrections_25', 'Embrace the Red', 'Receive 25 corrections — it means you\'re practising hard', 'practice', s.correctionsCount, 25),

    // Milestones
    ach('level_2', 'Nivel 2', 'Reach Level 2 — Survival Spanish', 'milestones', s.userLevel, 2),
    ach('level_3', 'Nivel 3', 'Reach Level 3 — Social Spanish', 'milestones', s.userLevel, 3),
    ach('level_4', 'Nivel 4', 'Reach Level 4 — Independent Speaker', 'milestones', s.userLevel, 4),
  ]
}

export const ACHIEVEMENT_CATEGORY_LABELS: Record<AchievementCategory, string> = {
  foundations: 'Foundations',
  vocabulary: 'Vocabulary',
  practice: 'Practice',
  milestones: 'Milestones',
}
