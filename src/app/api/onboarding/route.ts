import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const {
    name,
    currentLevel,
    targetLevel,
    mainGoal,
    colombianFocus,
    dailyMinutes,
    learningIntensity,
    speakingComfort,
    businessInterest,
    salesInterest,
    relationshipInterest,
    travelInterest,
  } = body

  const { error: userError } = await supabase
    .from('users')
    .update({
      name,
      current_level: currentLevel,
      target_level: targetLevel,
      main_goal: mainGoal,
      target_accent: colombianFocus,
      daily_minutes: dailyMinutes,
      learning_intensity: learningIntensity,
      onboarding_complete: true,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)

  if (userError) return NextResponse.json({ error: userError.message }, { status: 500 })

  const { error: profileError } = await supabase
    .from('user_profiles')
    .upsert({
      user_id: user.id,
      speaking_confidence: speakingComfort,
      sales_interest: salesInterest,
      business_interest: businessInterest,
      relationship_context: relationshipInterest ? 'interested' : null,
      travel_context: travelInterest ? 'interested' : null,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' })

  if (profileError) return NextResponse.json({ error: profileError.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
