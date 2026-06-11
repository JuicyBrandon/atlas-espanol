import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
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

function getMockAnalysis(text: string): AnalysisResult {
  const isGood = text.length > 20 && /[aeiouáéíóú]/i.test(text)
  return {
    severity: isGood ? 'green' : 'yellow',
    corrected_text: text,
    natural_colombian_text: text,
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

  const { text, userLevel = 1 } = await req.json()

  if (!text?.trim()) return NextResponse.json({ error: 'No text provided' }, { status: 400 })

  let result: AnalysisResult

  if (!process.env.ANTHROPIC_API_KEY) {
    result = getMockAnalysis(text)
  } else {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    const prompt = `Analyse this Spanish text written by a Level ${userLevel}/6 learner of Colombian Spanish.

Text: "${text}"

Return ONLY valid JSON (no markdown, no explanation outside JSON) with these exact fields:
{
  "severity": "green" | "yellow" | "red",
  "corrected_text": "grammatically correct version",
  "natural_colombian_text": "how a Colombian would naturally say this",
  "explanation": "brief explanation in Australian English of main issues (or praise if correct)",
  "category": one of: "vocabulary" | "word_order" | "verb_tense" | "pronunciation" | "gender" | "articles" | "ser_estar" | "por_para" | "formality" | "tone" | "cultural_nuance",
  "practice_sentence": "a useful practice sentence using the corrected form",
  "feedback": "warm 1-sentence coaching feedback"
}

Severity guide:
- green: correct and natural
- yellow: understandable but awkward or unnatural for Colombian Spanish
- red: likely to confuse or sound wrong`

    try {
      const response = await anthropic.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 512,
        messages: [{ role: 'user', content: prompt }],
      })

      const raw = response.content[0].type === 'text' ? response.content[0].text : '{}'
      result = JSON.parse(raw) as AnalysisResult
    } catch {
      result = getMockAnalysis(text)
    }
  }

  // Save corrections that aren't perfect green
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
