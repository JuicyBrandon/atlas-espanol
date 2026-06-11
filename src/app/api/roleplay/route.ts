import { streamText } from 'ai'
import { createClient } from '@/lib/supabase/server'
import { getAIModel, isAIConfigured } from '@/lib/ai-provider'
import { getScenario } from '@/lib/roleplay-scenarios'
import { NextRequest, NextResponse } from 'next/server'

function buildSystemPrompt(
  mode: string,
  character: string,
  setting: string,
  objective: string,
  userLevel: number
): string {
  return `You are running a realistic Colombian Spanish role play.

YOUR CHARACTER: ${character}
SETTING: ${setting}
THE LEARNER'S OBJECTIVE: ${objective}
ROLE PLAY MODE: ${mode}

Rules:
- Stay in character at all times. Speak Colombian Spanish as your character naturally would.
- Adapt your Spanish to a Level ${userLevel}/6 learner (1=absolute beginner, 6=professional fluency). At lower levels: shorter sentences, slower pacing, common vocabulary. At higher levels: natural speed, slang, regional expressions.
- Ask or say ONE thing at a time — never monologue.
- Do NOT correct minor errors during the role play. Only if the learner says something that would genuinely confuse a Colombian, briefly clarify in character ("¿Cómo? ¿Quiere decir que...?").
- Never switch to English unless the learner is completely stuck, and then only one short hint in brackets.
- React realistically: your character has moods, time pressure, and their own goals.
- Keep each reply under 80 words.`
}

const MOCK_REPLIES = [
  '¡Quiubo! Bueno, cuénteme... ¿en qué le puedo colaborar?',
  'Ah, ya veo. ¿Y eso cómo así? Cuénteme más.',
  'Mmm, interesante. ¿Y usted qué propone exactamente?',
  'Listo, me parece. ¿Algo más que quiera agregar?',
  'Bueno, la verdad eso suena bien. Sigamos.',
]

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { messages, mode, scenarioSlug, userLevel = 1 } = await req.json()

  const scenario = getScenario(mode, scenarioSlug)
  if (!scenario) return NextResponse.json({ error: 'Unknown scenario' }, { status: 400 })

  if (!isAIConfigured()) {
    const idx = Math.min(messages.filter((m: { role: string }) => m.role === 'user').length - 1, MOCK_REPLIES.length - 1)
    return NextResponse.json({ content: MOCK_REPLIES[Math.max(idx, 0)] })
  }

  try {
    const result = await streamText({
      model: getAIModel(),
      system: buildSystemPrompt(mode, scenario.aiCharacter, scenario.setting, scenario.objective, userLevel),
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      maxOutputTokens: 256,
    })

    return result.toTextStreamResponse()
  } catch {
    return NextResponse.json({ content: MOCK_REPLIES[0] })
  }
}
