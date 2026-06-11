import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

const SYSTEM_PROMPT = `You are Atlas Español, an expert Colombian Spanish fluency coach. Your job is to guide the user from complete beginner to professional working fluency in Colombian Spanish.

Prioritise:
1. Comprehension
2. Communication
3. Confidence
4. Accuracy
5. Natural Colombian expression

Do not overwhelm the user with grammar. Teach grammar only when it helps communication. Use Australian English for all explanations. Use Colombian Spanish for all examples and practice phrases. Track the user's recurring mistakes and vocabulary in your responses. Always adapt difficulty to the user's level.

Keep responses warm, encouraging, and concise. 2-4 sentences per reply is ideal for chat. Include Colombian expressions naturally — "quiubo", "¿qué más?", "bacano", "parce" etc. at the right level.`

function getMockResponse(input: string): string {
  const lower = input.toLowerCase()
  if (lower.includes('hola') || lower.includes('hello'))
    return '¡Quiubo! That\'s the spirit — "hola" works everywhere, but in Colombia you\'ll hear "quiubo" (from "¿qué hubo?") constantly. It\'s the most natural casual greeting. Try using it next time!'
  if (lower.includes('name') || lower.includes('llamo') || lower.includes('soy'))
    return '¡Qué bueno conocerte! In Colombia, both "Me llamo..." and "Soy..." work perfectly. Colombians tend to be very warm when meeting people — they\'ll often add "Un placer" or "Mucho gusto". What brings you to Colombian Spanish specifically?'
  if (lower.includes('gracias') || lower.includes('thanks'))
    return '¡Con mucho gusto! That\'s very Colombian of you — "con mucho gusto" (with great pleasure) is how Colombians respond to "gracias" rather than "de nada". Much warmer, don\'t you think?'
  return `¡Muy bien! You\'re making great progress. In natural Colombian Spanish, what you wrote sounds good — keep practising and your fluency will build quickly. ¿Seguimos?`
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { messages, userLevel = 1 } = await req.json()

  if (!process.env.ANTHROPIC_API_KEY) {
    const lastUserMsg = messages[messages.length - 1]?.content ?? ''
    return NextResponse.json({ content: getMockResponse(lastUserMsg) })
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const levelContext = `\n\nUser's current level: ${userLevel}/6 (1=absolute beginner, 6=professional fluency). Adapt complexity, vocabulary, and expectations accordingly.`

  try {
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      system: SYSTEM_PROMPT + levelContext,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    })

    const content = response.content[0].type === 'text' ? response.content[0].text : ''
    return NextResponse.json({ content })
  } catch {
    const lastUserMsg = messages[messages.length - 1]?.content ?? ''
    return NextResponse.json({ content: getMockResponse(lastUserMsg) })
  }
}
