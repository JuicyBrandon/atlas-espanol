import { generateText } from 'ai'
import { createClient } from '@/lib/supabase/server'
import { getAIModel, isAIConfigured } from '@/lib/ai-provider'
import { getScenario } from '@/lib/roleplay-scenarios'
import { NextRequest, NextResponse } from 'next/server'
import type { ChatMessage } from '@/types'

export interface RolePlaySummary {
  score: number
  what_went_well: string
  corrections: Array<{
    original: string
    corrected: string
    natural_colombian: string
    explanation: string
  }>
  new_vocabulary: Array<{
    spanish: string
    english: string
    colombian: string
  }>
  cultural_notes: string
  next_challenge: string
}

function getMockSummary(): RolePlaySummary {
  return {
    score: 75,
    what_went_well: 'You stayed engaged throughout the conversation and kept the exchange moving — that is the most important skill in real conversations.',
    corrections: [],
    new_vocabulary: [
      { spanish: '¿En qué le puedo colaborar?', english: 'How can I help you?', colombian: 'Colaborar is the Colombian service verb' },
    ],
    cultural_notes: 'Colombians value warmth and patience in conversation. Taking time for pleasantries before business is normal and expected.',
    next_challenge: 'Try the same scenario again and aim to use at least two new Colombian expressions naturally.',
  }
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { messages, mode, scenarioSlug, userLevel = 1 } = await req.json()

  const scenario = getScenario(mode, scenarioSlug)
  if (!scenario) return NextResponse.json({ error: 'Unknown scenario' }, { status: 400 })

  const userMessages = (messages as ChatMessage[]).filter(m => m.role === 'user')
  if (userMessages.length === 0) {
    return NextResponse.json({ error: 'No conversation to summarise' }, { status: 400 })
  }

  let summary: RolePlaySummary

  if (!isAIConfigured()) {
    summary = getMockSummary()
  } else {
    const transcript = (messages as ChatMessage[])
      .map(m => `${m.role === 'user' ? 'LEARNER' : 'CHARACTER'}: ${m.content}`)
      .join('\n')

    const prompt = `You are Atlas Español, a Colombian Spanish coach. A Level ${userLevel}/6 learner just completed this role play:

SCENARIO: ${scenario.title} — ${scenario.objective}

TRANSCRIPT:
${transcript}

Evaluate ONLY the LEARNER's Spanish. Return ONLY valid JSON (no markdown) with these exact fields:
{
  "score": <0-100, considering level ${userLevel} expectations>,
  "what_went_well": "<2-3 sentences in Australian English, specific and encouraging>",
  "corrections": [{"original": "...", "corrected": "...", "natural_colombian": "...", "explanation": "<brief, Australian English>"}],
  "new_vocabulary": [{"spanish": "...", "english": "...", "colombian": "<usage note>"}],
  "cultural_notes": "<1-2 sentences on Colombian cultural context relevant to this conversation>",
  "next_challenge": "<one concrete practice task for next time>"
}

Include at most 4 corrections (the most important ones) and at most 4 vocabulary items the learner encountered or should learn from this conversation.`

    try {
      const { text: raw } = await generateText({
        model: getAIModel(),
        messages: [{ role: 'user', content: prompt }],
        maxOutputTokens: 1024,
      })
      summary = JSON.parse(raw) as RolePlaySummary
    } catch {
      summary = getMockSummary()
    }
  }

  // Save session to DB
  const { error: saveError } = await supabase.from('role_play_sessions').insert({
    user_id: user.id,
    mode,
    scenario: scenario.title,
    level: userLevel,
    messages,
    score: Math.max(0, Math.min(100, Math.round(summary.score))),
    summary: summary.what_went_well,
  })

  if (saveError) console.error('Role play save error:', saveError.message)

  // Save corrections from the session
  if (summary.corrections?.length) {
    await supabase.from('corrections').insert(
      summary.corrections.slice(0, 4).map(c => ({
        user_id: user.id,
        original_text: c.original,
        corrected_text: c.corrected,
        natural_colombian_text: c.natural_colombian,
        severity: 'yellow',
        category: 'vocabulary',
        explanation: c.explanation,
        practice_sentence: c.corrected,
      }))
    )
  }

  // Save new vocabulary to the bank
  if (summary.new_vocabulary?.length) {
    const now = new Date().toISOString()
    await supabase.from('vocabulary_items').upsert(
      summary.new_vocabulary.slice(0, 4).map(v => ({
        user_id: user.id,
        spanish: v.spanish,
        english: v.english,
        natural_colombian: v.colombian || v.spanish,
        example_sentence: '',
        category: `roleplay_${mode}`,
        status: 'new',
        review_due_at: now,
      })),
      { onConflict: 'user_id,spanish', ignoreDuplicates: true }
    )
  }

  return NextResponse.json(summary)
}
