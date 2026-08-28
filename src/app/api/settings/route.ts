import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import type {
  LearningGoal,
  LearningIntensity,
  ColombianFocus,
} from '@/types'

const ALLOWED_FIELDS = [
  'name',
  'daily_minutes',
  'learning_intensity',
  'main_goal',
  'target_accent',
  'current_level',
] as const

type AllowedField = (typeof ALLOWED_FIELDS)[number]

function isValidField(key: string): key is AllowedField {
  return (ALLOWED_FIELDS as readonly string[]).includes(key)
}

const VALID_INTENSITIES: LearningIntensity[] = ['casual', 'steady', 'intensive']
const VALID_GOALS: LearningGoal[] = [
  'beginner_to_conversational', 'travel', 'relationship',
  'professional', 'sales_business', 'cultural_fluency',
]
const VALID_ACCENTS: ColombianFocus[] = ['general', 'bogota', 'medellin', 'cali', 'caribbean']
const VALID_DAILY_MINUTES = [5, 10, 15, 20, 30, 45, 60]

function validate(body: Record<string, unknown>): string | null {
  if (body.name !== undefined && (typeof body.name !== 'string' || !body.name.trim()))
    return 'Name must be a non-empty string'
  if (body.daily_minutes !== undefined && !VALID_DAILY_MINUTES.includes(body.daily_minutes as number))
    return 'Invalid daily_minutes value'
  if (body.learning_intensity !== undefined && !VALID_INTENSITIES.includes(body.learning_intensity as LearningIntensity))
    return 'Invalid learning_intensity'
  if (body.main_goal !== undefined && !VALID_GOALS.includes(body.main_goal as LearningGoal))
    return 'Invalid main_goal'
  if (body.target_accent !== undefined && !VALID_ACCENTS.includes(body.target_accent as ColombianFocus))
    return 'Invalid target_accent'
  if (body.current_level !== undefined) {
    const l = body.current_level as number
    if (!Number.isInteger(l) || l < 1 || l > 6) return 'Invalid current_level'
  }
  return null
}

export async function PATCH(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json() as Record<string, unknown>

  const validationError = validate(body)
  if (validationError) return NextResponse.json({ error: validationError }, { status: 400 })

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }
  for (const [key, value] of Object.entries(body)) {
    if (isValidField(key)) updates[key] = value
  }

  const { error } = await supabase.from('users').update(updates).eq('id', user.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
