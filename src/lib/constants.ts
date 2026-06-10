// ============================================================
// Atlas Español — App Constants
// ============================================================

export const APP_NAME = 'Atlas Español'

export const ATLAS_PALETTE = {
  navy: '#1E2A3A',
  ivory: '#F8F4EC',
  gold: '#F2C94C',
  blue: '#4A90E2',
  coffee: '#6F4E37',
  success: '#27AE60',
  warning: '#F2994A',
  error: '#EB5757',
} as const

export const LEVELS = [
  {
    level: 1,
    label: 'Absolute Beginner',
    cefr: 'A0–A1',
    description: 'Greetings, introductions, survival phrases',
  },
  {
    level: 2,
    label: 'Survival Spanish',
    cefr: 'A1',
    description: 'Taxis, restaurants, accommodation, shopping',
  },
  {
    level: 3,
    label: 'Social Spanish',
    cefr: 'A2',
    description: 'Basic conversations, feelings, making plans',
  },
  {
    level: 4,
    label: 'Independent Speaker',
    cefr: 'B1',
    description: 'Storytelling, opinions, workplace basics',
  },
  {
    level: 5,
    label: 'Advanced Conversational',
    cefr: 'B2',
    description: 'Nuance, humour, most daily situations',
  },
  {
    level: 6,
    label: 'Professional Fluency',
    cefr: 'C1',
    description: 'Meetings, negotiation, executive communication',
  },
] as const

export const COLOMBIAN_FOCUS_OPTIONS = [
  { value: 'general', label: 'General Colombian Spanish' },
  { value: 'bogota', label: 'Bogotá style' },
  { value: 'medellin', label: 'Medellín style (Paisa)' },
  { value: 'cali', label: 'Cali style' },
  { value: 'caribbean', label: 'Caribbean coast awareness' },
] as const

export const LEARNING_GOALS = [
  { value: 'beginner_to_conversational', label: 'Complete beginner to conversational' },
  { value: 'travel', label: 'Travel confidence' },
  { value: 'relationship', label: 'Relationship communication' },
  { value: 'professional', label: 'Professional working fluency' },
  { value: 'sales_business', label: 'Sales and business Spanish' },
  { value: 'cultural_fluency', label: 'Colombian cultural fluency' },
] as const

export const DAILY_MINUTES_OPTIONS = [5, 10, 15, 20, 30, 45, 60] as const

export const ONBOARDING_STEPS = [
  'welcome',
  'your_name',
  'current_level',
  'your_goals',
  'colombian_focus',
  'daily_commitment',
  'interests',
  'generating_plan',
] as const

export type OnboardingStep = typeof ONBOARDING_STEPS[number]
