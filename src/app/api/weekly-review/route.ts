import { generateText } from 'ai'
import { createClient } from '@/lib/supabase/server'
import { getAIModel, isAIConfigured } from '@/lib/ai-provider'
import { computeSkillScores, sessionsSince, labelCategory, SESSIONS_PER_REVIEW } from '@/lib/progress'
import { calculateStreak, levelToCEFR } from '@/lib/utils'
import { NextResponse } from 'next/server'
import type { SpanishLevel } from '@/types'

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // --- Eligibility gate first, with lightweight queries only ---
  const [{ data: lastReview }, { data: allLessons }, { data: allPlays }] = await Promise.all([
    supabase
      .from('weekly_reviews')
      .select('created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('user_lessons')
      .select('completed_at')
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .not('completed_at', 'is', null),
    supabase
      .from('role_play_sessions')
      .select('mode, score, scenario, created_at')
      .eq('user_id', user.id),
  ])

  const periodStart = lastReview?.created_at ?? null
  const lessonDates = (allLessons ?? []).map(l => l.completed_at)
  const plays = allPlays ?? []

  const sessionsThisPeriod = sessionsSince(
    lessonDates,
    plays.map(p => p.created_at),
    periodStart
  )

  if (sessionsThisPeriod < SESSIONS_PER_REVIEW) {
    return NextResponse.json(
      {
        error: 'Not enough sessions yet',
        sessionsThisPeriod,
        sessionsNeeded: SESSIONS_PER_REVIEW,
      },
      { status: 400 }
    )
  }

  // --- Eligible: fetch the heavier data ---
  const [{ data: userData }, { data: allVocab }, { data: recentCorrections }] = await Promise.all([
    supabase.from('users').select('current_level, name').eq('id', user.id).single(),
    supabase
      .from('vocabulary_items')
      .select('spanish, status, times_seen, times_correct, mastered_at')
      .eq('user_id', user.id),
    supabase
      .from('corrections')
      .select('severity, category, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(200),
  ])

  const level = (userData?.current_level ?? 1) as SpanishLevel
  const vocab = allVocab ?? []
  const corrections = recentCorrections ?? []

  const periodStartMs = periodStart ? new Date(periodStart).getTime() : 0
  const periodCorrections = corrections.filter(
    c => new Date(c.created_at).getTime() >= periodStartMs
  )
  const periodLessonCount = lessonDates.filter(
    (d): d is string => !!d && new Date(d).getTime() >= periodStartMs
  ).length
  const periodPlays = plays.filter(p => new Date(p.created_at).getTime() >= periodStartMs)

  // Words that genuinely became mastered during this period
  const newWordsMastered = vocab.filter(
    v =>
      v.status === 'mastered' &&
      v.mastered_at &&
      new Date(v.mastered_at).getTime() >= periodStartMs
  ).length

  const weakWords = vocab
    .filter(v => v.status === 'weak')
    .slice(0, 8)
    .map(v => v.spanish)

  // Top recurring error categories this period
  const categoryCounts = new Map<string, number>()
  for (const c of periodCorrections) {
    categoryCounts.set(c.category, (categoryCounts.get(c.category) ?? 0) + 1)
  }
  const topErrors = [...categoryCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([category, count]) => `${labelCategory(category)} (${count}x)`)

  const streak = calculateStreak(lessonDates.filter((d): d is string => !!d))

  // Skill scores from ALL-TIME data — the same window the progress page
  // displays, so saved snapshots match what the user sees on screen.
  const scores = computeSkillScores({
    vocabItems: vocab,
    corrections,
    rolePlays: plays,
    lessonsCompleted: lessonDates.length,
    streak,
  })

  // Fallback copy, overwritten by AI when configured
  let summary = buildTemplateSummary(periodLessonCount, periodPlays.length, newWordsMastered, periodCorrections.length)
  let nextFocus = weakWords.length
    ? `Focus on your ${weakWords.length} weak words this week — review them daily until they stick.`
    : 'Keep your daily lesson rhythm going and add one role play this week.'

  if (isAIConfigured()) {
    const prompt = `You are Atlas Español, a Colombian Spanish coach writing a weekly review for ${userData?.name ?? 'your student'} (Level ${level}/6, ~${levelToCEFR(level)}).

This period's data:
- Lessons completed: ${periodLessonCount}
- Role plays: ${periodPlays.map(p => `${p.scenario} (${p.score ?? 'n/a'})`).join(', ') || 'none'}
- Corrections received: ${periodCorrections.length} (top categories: ${topErrors.join(', ') || 'none'})
- Words mastered this period: ${newWordsMastered}
- Still-weak words: ${weakWords.join(', ') || 'none'}
- Current streak: ${streak} days

Return ONLY valid JSON (no markdown):
{
  "summary": "<3-4 warm, specific sentences in Australian English reviewing their week — celebrate real wins, name the biggest area to improve>",
  "next_focus": "<one concrete, specific focus for next week in 1-2 sentences>"
}`

    try {
      const { text: raw } = await generateText({
        model: getAIModel(),
        messages: [{ role: 'user', content: prompt }],
        maxOutputTokens: 512,
      })
      const parsed = JSON.parse(raw) as { summary: string; next_focus: string }
      summary = parsed.summary
      nextFocus = parsed.next_focus
    } catch {
      // Keep the template fallback
    }
  }

  const { data: review, error: reviewError } = await supabase
    .from('weekly_reviews')
    .insert({
      user_id: user.id,
      summary,
      top_errors: topErrors,
      new_words_mastered: newWordsMastered,
      weak_words: weakWords,
      next_focus: nextFocus,
    })
    .select()
    .single()

  if (reviewError) {
    return NextResponse.json({ error: reviewError.message }, { status: 500 })
  }

  // Save a progress snapshot alongside it
  await supabase.from('progress_snapshots').insert({
    user_id: user.id,
    cefr_estimate: levelToCEFR(level),
    level,
    vocabulary_count: vocab.length,
    speaking_score: scores.speaking,
    listening_score: scores.listening,
    grammar_score: scores.grammar,
    business_score: scores.business,
    culture_score: scores.culture,
    confidence_score: scores.confidence,
  })

  return NextResponse.json(review)
}

function buildTemplateSummary(
  lessons: number,
  rolePlays: number,
  mastered: number,
  correctionCount: number
): string {
  const parts: string[] = []
  parts.push(
    `You completed ${lessons} lesson${lessons === 1 ? '' : 's'} and ${rolePlays} role play${rolePlays === 1 ? '' : 's'} this period — solid, consistent work.`
  )
  if (mastered > 0) {
    parts.push(`${mastered} word${mastered === 1 ? '' : 's'} reached mastered status, which means they're truly yours now.`)
  }
  if (correctionCount > 0) {
    parts.push(`You collected ${correctionCount} correction${correctionCount === 1 ? '' : 's'} — each one is a future strength.`)
  }
  parts.push('Keep showing up daily; consistency beats intensity.')
  return parts.join(' ')
}
