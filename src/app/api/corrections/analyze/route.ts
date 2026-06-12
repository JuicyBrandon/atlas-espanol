import { generateText } from 'ai'
import { createClient } from '@/lib/supabase/server'
import { getAIModel, isAIConfigured } from '@/lib/ai-provider'
import { NextRequest, NextResponse } from 'next/server'
import type { CorrectionCategory, CorrectionSeverity } from '@/types'

interface AnalysisResult {
  severity: CorrectionSeverity
  corrected_text: string
  natural_colombian_text: string
  explanation: string
  category: CorrectionCategory
  practice_sentence: string
  feedback: string
}

function getMockAnalysis(input: string): AnalysisResult {
  const isGood = input.length > 20 && /[aeiouáéíóú]/i.test(input)
  return {
    severity: isGood ? 'green' : 'yellow',
    corrected_text: input,
    natural_colombian_text: input,
    explanation: isGood
      ? 'Your Spanish reads naturally and communicates clearly.'
      : 'Your Spanish is understandable but could sound more natural to a Colombian.',
    category: 'vocabulary',
    practice_sentence: 'Me llamo Atlas y soy de Colombia.',
    feedback: isGood
      ? '¡Bien hecho! Your message is clear and natural.'
      : 'Understandable, but a Colombian would phrase this a bit differently.',
  }
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { text, userLevel = 1, context = 'text' } = await req.json()

  if (!text?.trim()) return NextResponse.json({ error: 'No text provided' }, { status: 400 })

  let result: AnalysisResult

  if (!isAIConfigured()) {
    result = getMockAnalysis(text)
  } else {
    const voiceNote = context === 'voice'
      ? ' This was transcribed from spoken voice — be lenient about filler words (pues, eh, ¿no?), incomplete sentences, and natural spoken rhythm. Only flag genuine errors, not spoken-language patterns.'
      : ''

    const prompt = `Analyse this Spanish text from a Level ${userLevel}/6 learner of Colombian Spanish.${voiceNote}

Text: "${text}"

Return ONLY valid JSON (no markdown, no text outside the JSON object) with these exact fields:
{
  "severity": "green" | "yellow" | "red",
  "corrected_text": "grammatically correct version",
  "natural_colombian_text": "how a Colombian would naturally say this",
  "explanation": "brief explanation in Australian English of main issues (or praise if correct)",
  "category": "vocabulary" | "word_order" | "verb_tense" | "pronunciation" | "gender" | "articles" | "ser_estar" | "por_para" | "formality" | "tone" | "cultural_nuance",
  "practice_sentence": "a useful practice sentence using the corrected form",
  "feedback": "warm 1-sentence coaching feedback"
}

Severity: green = correct and natural, yellow = understandable but awkward, red = likely to confuse or sound wrong.`

    try {
      const model = getAIModel()
      const { text: raw } = await generateText({
        model,
        messages: [{ role: 'user', content: prompt }],
        maxOutputTokens: 512,
      })
      result = JSON.parse(raw) as AnalysisResult
    } catch {
      result = getMockAnalysis(text)
    }
  }

  if (result.severity !== 'green') {
    await supabase.from('corrections').insert({
      user_id: user.id,
      original_text: text,
      corrected_text: result.corrected_text,
      natural_colombian_text: result.natural_colombian_text,
      severity: result.severity,
      category: result.category,
      explanation: result.explanation,
      practice_sentence: result.practice_sentence,
    })
  }

  return NextResponse.json(result)
}
