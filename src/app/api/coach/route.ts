import { streamText } from 'ai'
import { createClient } from '@/lib/supabase/server'
import { getAIModel, isAIConfigured } from '@/lib/ai-provider'
import { NextRequest, NextResponse } from 'next/server'

const SYSTEM_PROMPT = `You are Atlas Español, an expert Colombian Spanish fluency coach. Your job is to guide the user from complete beginner to professional working fluency in Colombian Spanish.

Prioritise:
1. Comprehension
2. Communication
3. Confidence
4. Accuracy
5. Natural Colombian expression

The user's messages may come from voice transcription — expect natural spoken language, filler words, incomplete sentences, and code-switching between Spanish and English. Treat these as authentic communication, not errors to correct unless they meaningfully impede understanding. Respond as a real conversation partner would: naturally and warmly, not like a grammar checker.

Do not overwhelm the user with grammar. Teach grammar only when it helps communication. Use Australian English for all explanations. Use Colombian Spanish for all examples and practice phrases. Always adapt difficulty to the user's level. Keep responses warm, encouraging, and concise — 2–4 sentences per reply is ideal for chat. Include Colombian expressions naturally at the right level. Mirror the user's energy — if they're casual and chatty, be casual and chatty.`

function getMockResponse(input: string): string {
  const lower = input.toLowerCase()
  if (lower.includes('hola') || lower.includes('hello'))
    return '¡Quiubo! That\'s the spirit — "hola" works everywhere, but in Colombia you\'ll hear "quiubo" constantly. It\'s the most natural casual greeting. Try using it next time!'
  if (lower.includes('gracias') || lower.includes('thanks'))
    return '¡Con mucho gusto! That\'s very Colombian — "con mucho gusto" is how Colombians respond to "gracias" rather than "de nada". Much warmer!'
  if (lower.includes('llamo') || lower.includes('soy') || lower.includes('name'))
    return '¡Qué bueno conocerte! In Colombia both "Me llamo..." and "Soy..." work perfectly. Colombians are very warm when meeting people — they\'ll often add "Un placer". What brings you to Colombian Spanish?'
  return '¡Muy bien! You\'re making great progress. Keep practising — every conversation builds your fluency. ¿Seguimos?'
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { messages, userLevel = 1 } = await req.json()

  if (!isAIConfigured()) {
    const lastMsg = (messages[messages.length - 1]?.content as string) ?? ''
    return NextResponse.json({ content: getMockResponse(lastMsg) })
  }

  try {
    const model = getAIModel()
    const levelNote = `\n\nUser's current level: ${userLevel}/6 (1=absolute beginner, 6=professional fluency). Adapt all responses accordingly.`

    const result = await streamText({
      model,
      system: SYSTEM_PROMPT + levelNote,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      maxOutputTokens: 512,
    })

    return result.toTextStreamResponse()
  } catch {
    const lastMsg = (messages[messages.length - 1]?.content as string) ?? ''
    return NextResponse.json({ content: getMockResponse(lastMsg) })
  }
}
