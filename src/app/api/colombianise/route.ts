import { generateText } from 'ai'
import { createClient } from '@/lib/supabase/server'
import { getAIModel, isAIConfigured } from '@/lib/ai-provider'
import { NextRequest, NextResponse } from 'next/server'

export interface ColombianiseResult {
  original: string
  literal: string
  natural_colombian: string
  warmer: string
  more_professional: string
  more_casual: string
  tone_explanation: string
}

function getMockResult(text: string): ColombianiseResult {
  return {
    original: text,
    literal: 'Espero que hayas tenido un buen día.',
    natural_colombian: 'Espero que hayas tenido un día muy bonito.',
    warmer: 'Me hiciste falta hoy. Espero que tu día haya sido muy bonito.',
    more_professional: 'Espero que haya tenido un excelente día.',
    more_casual: '¿Qué más? ¿Cómo te fue hoy?',
    tone_explanation: 'Colombians lean warm and personal in everyday messages. Adding "bonito" softens the phrase, and "me hiciste falta" (I missed you) adds genuine Colombian warmth between people who are close. (Configure an AI key to translate your actual text.)',
  }
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { text } = await req.json()

  if (!text?.trim()) return NextResponse.json({ error: 'No text provided' }, { status: 400 })

  if (!isAIConfigured()) {
    return NextResponse.json(getMockResult(text))
  }

  const prompt = `You are Atlas Español, a Colombian Spanish expert. The user wrote this (it may be English or Spanish):

"${text}"

Return ONLY valid JSON (no markdown) with these exact fields:
{
  "original": ${JSON.stringify(text)},
  "literal": "<direct/literal Spanish translation — if input is already Spanish, a corrected literal version>",
  "natural_colombian": "<how a Colombian would naturally say this>",
  "warmer": "<a warmer, more affectionate Colombian version>",
  "more_professional": "<a more formal/professional Colombian version, usted form>",
  "more_casual": "<a more casual Colombian version with natural slang where it fits>",
  "tone_explanation": "<2-3 sentences in Australian English explaining the tone differences and when to use each>"
}`

  try {
    const { text: raw } = await generateText({
      model: getAIModel(),
      messages: [{ role: 'user', content: prompt }],
      maxOutputTokens: 768,
    })
    const result = JSON.parse(raw) as ColombianiseResult
    return NextResponse.json(result)
  } catch {
    return NextResponse.json(getMockResult(text))
  }
}
