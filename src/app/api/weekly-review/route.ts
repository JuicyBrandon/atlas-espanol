import { generateText } from 'ai'
import { createClient } from '@/lib/supabase/server'
import { getAIModel, isAIConfigured } from '@/lib/ai-provider'
import { computeSkillScores, SESSIONS_PER_REVIEW } from '@/lib/progress'
import { calculateStreak, levelToCEFR } from '@/lib/utils'
import { NextResponse } from 'next/server'
import type { SpanishLevel } from '@/types'

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Last review marks the start of the current period
  const { data: lastReview } = await supabase
    .from('weekly_reviews')
    .select('created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const periodStart = lastReview?.created_at ?? new Date(0).toISOString()

  const [
    { data: userData },
    { data: periodLessons },
    { data: periodPlays },
    { data: periodCorrections },
    { data: allVocab },
    { data: allCompletedLessons },
  ] = await Promise.all([
    supabase.from('users').select('current_level, name').eq('id', user.id).single(),
    supabase
      .from('user_lessons')
      .select('completed_at')
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .gte('completed_at', periodStart),
    supabase
      .from('role_play_sessions')
      .select('mode, score, scenario, created_at')
      .eq('user_id', user.id)
      .gte('created_at', periodStart),
    supabase
      .from('corrections')
      .select('severity, category, original_text, created_at')
      .eq('user_id', user.id)
      .gte('created_at', periodStart),
    supabase
      .from('vocabulary_items')
      .select('spanish, status, times_seen, times_correct, updated_at')
      .eq('user_id', user.id),
    supabase
      .from('user_lessons')
      .select('completed_at')
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .not('completed_at', 'is', null),
  ])

  const sessionsThisPeriod = (periodLessons?.length ?? 0) + (periodPlays?.length ?? 0)

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

  const level = (userData?.current_level ?? 1) as SpanishLevel
  const vocab = allVocab ?? []
  const corrections = periodCorrections ?? []

  // Words mastered during this period
  const newWordsMastered = vocab.filter(
    v => v.status === 'mastered' && new Date(v.updated_at).getTime() >= new Date(periodStart).getTime()
  ).length

  const weakWords = vocab
    .filter(v => v.status === 'weak')
    .slice(0, 8)
    .map(v => v.spanish)

  // Top recurring error categories this period
  const categoryCounts = new Map<string, number>()
  for (const c of corrections) {
    categoryCounts.set(c.category, (categoryCounts.get(c.category) ?? 0) + 1)
  }
  const topErrors = [...categoryCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([category, count]) => `${category.replace(/_/g, ' ')} (${count}x)`)

  const streak = calculateStreak(
    (allCompletedLessons ?? [])
      .map(l => l.completed_at)
      .filter((d): d is string => !!d)
  )

  const scores = computeSkillScores({
    vocabItems: vocab,
    corrections: corrections.map(c => ({
      severity: c.severity,
      category: c.category,
      created_at: c.created_at,
    })),
    rolePlays: (periodPlays ?? []).map(p => ({ mode: p.mode, score: p.score })),
    lessonsCompleted: periodLessons?.length ?? 0,
    streak,
  })

  let summary: string
  let nextFocus: string

  if (isAIConfigured()) {
    const prompt = `You are Atlas Español, a Colombian Spanish coach writing a weekly review for ${userData?.name ?? 'your student'} (Level ${level}/6, ~${levelToCEFR(level)}).

This period's data:
- Lessons completed: ${periodLessons?.length ?? 0}
- Role plays: ${(periodPlays ?? []).map(p => `${p.scenario} (${p.score ?? 'n/a'})`).join(', ') || 'none'}
- Corrections received: ${corrections.length} (top categories: ${topErrors.join(', ') || 'none'})
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
      summary = buildTemplateSummary(periodLessons?.length ?? 0, periodPlays?.length ?? 0, newWordsMastered, corrections.length)
      nextFocus = weakWords.length
        ? `Focus on your ${weakWords.length} weak words this week — review them daily until they stick.`
        : 'Keep your daily lesson rhythm going and add one role play this week.'
    }
  } else {
    summary = buildTemplateSummary(periodLessons?.length ?? 0, periodPlays?.length ?? 0, newWordsMastered, corrections.length)
    nextFocus = weakWords.length
      ? `Focus on your ${weakWords.length} weak words this week — review them daily until they stick.`
      : 'Keep your daily lesson rhythm going and add one role play this week.'
  }

  // Save the weekly review
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
