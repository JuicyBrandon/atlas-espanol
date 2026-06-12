import { generateText } from 'ai'
import { createClient } from '@/lib/supabase/server'
import { getAIModel, isAIConfigured } from '@/lib/ai-provider'
import { NextResponse } from 'next/server'
import type { SpanishLevel, LessonWord } from '@/types'

interface GeneratedLesson {
  module_name: string
  lesson_title: string
  lesson_goal: string
  vocabulary: LessonWord[]
  grammar_focus: string
  scenario: string
}

function mockLesson(): GeneratedLesson {
  return {
    module_name: 'Daily Life',
    lesson_title: 'Talking About Your Day',
    lesson_goal: 'Describe your daily routine using common Colombian expressions',
    vocabulary: [
      { spanish: 'madrugar', english: 'to wake up early', colombian: 'madrugar', note: 'Very common — Colombians often madrugan' },
      { spanish: 'el tinto', english: 'black coffee', colombian: 'el tinto', note: 'Uniquely Colombian word for black coffee' },
      { spanish: 'el bus', english: 'the bus', colombian: 'el bus / la buseta', note: 'Buseta = small bus, very common in cities' },
      { spanish: 'el trabajo', english: 'work / the job', colombian: 'el trabajo', note: '' },
      { spanish: 'el almuerzo', english: 'lunch', colombian: 'el almuerzo', note: 'The main meal in Colombia — usually midday' },
      { spanish: 'descansar', english: 'to rest', colombian: 'descansar', note: '' },
    ],
    grammar_focus: 'Present tense regular -ar verbs: trabajo, llego, almuerzo',
    scenario: 'You are telling a Colombian colleague about your typical weekday morning before work.',
  }
}

export async function POST(): Promise<Response> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [{ data: userData }, { data: profileData }, { data: recentErrors }] = await Promise.all([
    supabase.from('users').select('current_level, main_goal, name').eq('id', user.id).single(),
    supabase.from('user_profiles').select('career_context, relationship_context, travel_context').eq('user_id', user.id).maybeSingle(),
    supabase.from('corrections').select('category').eq('user_id', user.id).order('created_at', { ascending: false }).limit(20),
  ])

  const level = (userData?.current_level ?? 1) as SpanishLevel
  const mainGoal = userData?.main_goal ?? 'beginner_to_conversational'
  const careerContext = profileData?.career_context ?? ''
  const errorCategories = [...new Set((recentErrors ?? []).map(e => e.category))].slice(0, 3).join(', ')

  let lesson: GeneratedLesson

  if (!isAIConfigured()) {
    lesson = mockLesson()
  } else {
    const goalLabel: Record<string, string> = {
      beginner_to_conversational: 'everyday conversational Spanish',
      travel: 'travel situations in Colombia',
      relationship: 'personal and relationship conversations',
      professional: 'professional working fluency',
      sales_business: 'sales and business Spanish',
      cultural_fluency: 'Colombian cultural fluency',
    }

    const contextLines = [
      careerContext && `User's career/work context: ${careerContext}`,
      errorCategories && `Recent error patterns to reinforce: ${errorCategories}`,
      mainGoal && `Learning goal: ${goalLabel[mainGoal] ?? mainGoal}`,
    ].filter(Boolean).join('\n')

    const prompt = `Generate a Colombian Spanish lesson for a Level ${level}/6 learner.

${contextLines}

Create a practical, engaging lesson on a topic that feels authentic and useful for this learner. Avoid repeating basic survival phrases if the level is 3+.

Return ONLY valid JSON with exactly these fields:
{
  "module_name": "short category (2-4 words, e.g. 'Street Food', 'Office Small Talk')",
  "lesson_title": "specific lesson title",
  "lesson_goal": "one sentence: what the learner will be able to do after this lesson",
  "vocabulary": [
    { "spanish": "word", "english": "meaning", "colombian": "Colombian variant or same word", "note": "optional usage note" }
  ],
  "grammar_focus": "one grammar point relevant to the lesson",
  "scenario": "a realistic Colombian situation to practise this lesson in (2 sentences)"
}

Requirements:
- 6–8 vocabulary items
- Colombian Spanish only — use Colombian variants, expressions, and spelling
- vocabulary notes should highlight what makes this Colombian (not Spain or Mexico)
- grammar_focus should match Level ${level} appropriately
- make it genuinely useful for the learner's context above`

    try {
      const model = getAIModel()
      const { text: raw } = await generateText({ model, messages: [{ role: 'user', content: prompt }], maxOutputTokens: 1024 })
      const clean = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      lesson = JSON.parse(clean) as GeneratedLesson
    } catch {
      lesson = mockLesson()
    }
  }

  // Save to lessons table so it works with existing lesson infrastructure
  const { data: saved, error } = await supabase
    .from('lessons')
    .insert({
      level,
      module_name: lesson.module_name,
      lesson_title: lesson.lesson_title,
      lesson_goal: lesson.lesson_goal,
      vocabulary: lesson.vocabulary,
      grammar_focus: lesson.grammar_focus,
      scenario: lesson.scenario,
      sort_order: 9999,
      is_generated: true,
    })
    .select()
    .single()

  if (error) {
    console.error('Failed to save generated lesson:', error.message)
    return NextResponse.json({ error: 'Failed to save lesson' }, { status: 500 })
  }

  return NextResponse.json({ lessonId: saved.id })
}
