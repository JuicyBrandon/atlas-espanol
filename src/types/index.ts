// ============================================================
// Atlas Español — Core Types
// ============================================================

export type SpanishLevel = 1 | 2 | 3 | 4 | 5 | 6

export type CEFRLevel = 'A0' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1'

export type ColombianFocus =
  | 'general'
  | 'bogota'
  | 'medellin'
  | 'cali'
  | 'caribbean'

export type LearningGoal =
  | 'beginner_to_conversational'
  | 'travel'
  | 'relationship'
  | 'professional'
  | 'sales_business'
  | 'cultural_fluency'

export type LearningIntensity = 'casual' | 'steady' | 'intensive'

export type VocabularyStatus = 'new' | 'learning' | 'weak' | 'strong' | 'mastered'

export type CorrectionSeverity = 'green' | 'yellow' | 'red'

export type CorrectionCategory =
  | 'vocabulary'
  | 'word_order'
  | 'verb_tense'
  | 'pronunciation'
  | 'gender'
  | 'articles'
  | 'ser_estar'
  | 'por_para'
  | 'formality'
  | 'tone'
  | 'cultural_nuance'

export type RolePlayMode = 'sales' | 'dating' | 'travel' | 'social'

// ============================================================
// Database Row Types
// ============================================================

export interface User {
  id: string
  email: string
  name: string
  native_language: string
  current_level: SpanishLevel
  target_level: SpanishLevel
  target_accent: ColombianFocus
  main_goal: LearningGoal
  daily_minutes: number
  learning_intensity: LearningIntensity
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  user_id: string
  career_context: string | null
  relationship_context: string | null
  travel_context: string | null
  sales_interest: boolean
  business_interest: boolean
  speaking_confidence: number // 1-10
  listening_confidence: number // 1-10
  preferred_correction_style: 'immediate' | 'end_of_session'
  created_at: string
  updated_at: string
}

// Vocabulary word as stored in the lessons.vocabulary JSONB column
export interface LessonWord {
  spanish: string
  english: string
  colombian: string
  note?: string
}

export interface Lesson {
  id: string
  level: SpanishLevel
  module_name: string
  lesson_title: string
  lesson_goal: string
  vocabulary: LessonWord[]
  grammar_focus: string
  scenario: string
  sort_order: number
  created_at: string
}

export interface UserLesson {
  id: string
  user_id: string
  lesson_id: string
  status: 'not_started' | 'in_progress' | 'completed'
  score: number | null
  completed_at: string | null
  created_at: string
}

export interface VocabularyItem {
  id: string
  user_id: string
  spanish: string
  english: string
  natural_colombian: string
  example_sentence: string
  category: string
  status: VocabularyStatus
  review_due_at: string
  times_seen: number
  times_correct: number
  times_incorrect: number
  created_at: string
  updated_at: string
}

export interface Correction {
  id: string
  user_id: string
  original_text: string
  corrected_text: string
  natural_colombian_text: string
  severity: CorrectionSeverity
  category: CorrectionCategory
  explanation: string
  practice_sentence: string
  created_at: string
}

export interface RolePlaySession {
  id: string
  user_id: string
  mode: RolePlayMode
  scenario: string
  level: SpanishLevel
  messages: ChatMessage[]
  score: number | null
  summary: string | null
  created_at: string
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  corrections?: Correction[]
}

export interface ProgressSnapshot {
  id: string
  user_id: string
  cefr_estimate: CEFRLevel
  level: SpanishLevel
  vocabulary_count: number
  speaking_score: number
  listening_score: number
  grammar_score: number
  business_score: number
  culture_score: number
  confidence_score: number
  created_at: string
}

export interface WeeklyReview {
  id: string
  user_id: string
  summary: string
  top_errors: string[]
  new_words_mastered: number
  weak_words: string[]
  next_focus: string
  created_at: string
}

// ============================================================
// Onboarding Form State
// ============================================================

export interface OnboardingData {
  name: string
  nativeLanguage: string
  currentLevel: SpanishLevel
  targetLevel: SpanishLevel
  mainGoal: LearningGoal
  colombianFocus: ColombianFocus
  dailyMinutes: number
  learningIntensity: LearningIntensity
  speakingComfort: number
  businessInterest: boolean
  salesInterest: boolean
  relationshipInterest: boolean
  travelInterest: boolean
}

// ============================================================
// UI State Types
// ============================================================

export interface DashboardStats {
  currentLevel: SpanishLevel
  cefrEstimate: CEFRLevel
  streak: number
  vocabularyCount: number
  lessonsCompleted: number
  weeklyProgress: number
  todaysLesson: Lesson | null
  dueForReview: number
  recentMistakes: Correction[]
}
