import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import type { LessonWord } from '@/types'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { lessonId, vocabulary, moduleName, score = 80 } = await req.json()

  if (!lessonId) return NextResponse.json({ error: 'lessonId required' }, { status: 400 })

  // Upsert user_lesson record
  const { error: lessonError } = await supabase
    .from('user_lessons')
    .upsert({
      user_id: user.id,
      lesson_id: lessonId,
      status: 'completed',
      score,
      completed_at: new Date().toISOString(),
    }, { onConflict: 'user_id,lesson_id' })

  if (lessonError) return NextResponse.json({ error: lessonError.message }, { status: 500 })

  // Save vocabulary items from lesson to user's vocabulary bank
  if (vocabulary?.length) {
    const now = new Date().toISOString()
    const vocabRows = (vocabulary as LessonWord[]).map((word) => ({
      user_id: user.id,
      spanish: word.spanish,
      english: word.english,
      natural_colombian: word.colombian || word.spanish,
      example_sentence: '',
      category: moduleName || 'general',
      status: 'new',
      review_due_at: now,
      times_seen: 0,
      times_correct: 0,
      times_incorrect: 0,
    }))

    // Upsert by (user_id, spanish) to avoid duplicates
    const { error: vocabError } = await supabase
      .from('vocabulary_items')
      .upsert(vocabRows, { onConflict: 'user_id,spanish', ignoreDuplicates: true })

    if (vocabError) {
      // Non-fatal: log but continue
      console.error('Vocabulary save error:', vocabError.message)
    }
  }

  // Adaptive progression: level up when every lesson at the current level is done
  let newLevel: number | null = null

  const { data: userData } = await supabase
    .from('users')
    .select('current_level')
    .eq('id', user.id)
    .single()

  const currentLevel = userData?.current_level ?? 1

  if (currentLevel < 6) {
    const [{ count: totalAtLevel }, { count: completedCount }] = await Promise.all([
      // Exclude AI-generated lessons from the level-up count
      supabase
        .from('lessons')
        .select('*', { count: 'exact', head: true })
        .eq('level', currentLevel)
        .eq('is_generated', false),
      supabase
        .from('user_lessons')
        .select('lesson_id, lessons!inner(level, is_generated)', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .eq('lessons.level', currentLevel)
        .eq('lessons.is_generated', false),
    ])

    if ((totalAtLevel ?? 0) > 0 && (completedCount ?? 0) >= (totalAtLevel ?? 0)) {
      const candidate = currentLevel + 1
      const { error: levelError } = await supabase
        .from('users')
        .update({ current_level: candidate, updated_at: new Date().toISOString() })
        .eq('id', user.id)

      if (levelError) {
        // The user completed their level but the promotion failed — must be
        // visible in logs, since nothing else will re-trigger it.
        console.error('Level-up update failed:', levelError.message)
      } else {
        newLevel = candidate
      }
    }
  }

  return NextResponse.json({
    success: true,
    levelUp: newLevel !== null,
    newLevel,
    completedLevel: newLevel !== null ? currentLevel : null,
  })
}
