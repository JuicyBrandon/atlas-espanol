import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

function isTranscriptionConfigured(): boolean {
  const provider = (process.env.AI_PROVIDER ?? 'anthropic').toLowerCase()
  if (provider === 'anthropic') return false // Anthropic has no speech-to-text
  const key = provider === 'openai'
    ? process.env.OPENAI_API_KEY
    : process.env.AI_API_KEY
  return !!key
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!isTranscriptionConfigured()) {
    return NextResponse.json({
      text: '(Voice transcription requires an OpenAI or Groq API key — set AI_PROVIDER=openai or compatible.)',
    })
  }

  let file: Blob | null = null
  try {
    const form = await req.formData()
    file = form.get('file') as Blob | null
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
  }

  if (!file || file.size === 0) {
    return NextResponse.json({ error: 'No audio file provided' }, { status: 400 })
  }

  const provider = (process.env.AI_PROVIDER ?? 'anthropic').toLowerCase()
  const apiKey = provider === 'openai'
    ? process.env.OPENAI_API_KEY!
    : process.env.AI_API_KEY!

  const baseURL = provider === 'compatible'
    ? (process.env.AI_BASE_URL ?? 'https://api.openai.com/v1')
    : 'https://api.openai.com/v1'

  // Groq uses whisper-large-v3-turbo; OpenAI uses whisper-1
  const model = provider === 'compatible'
    ? (process.env.AI_WHISPER_MODEL ?? 'whisper-large-v3-turbo')
    : 'whisper-1'

  // Whisper prompt: Colombian Spanish context helps the model recognise
  // regional vocabulary, informal speech, and code-switching accurately.
  // Keeps filler words (eh, pues, ¿no?) because the corrections pipeline
  // will handle stylistic feedback — Whisper should transcribe verbatim.
  const whisperPrompt =
    'Conversational Colombian Spanish. May include informal expressions like quiubo, bacano, parce, venga, chévere, pues, ¿no?, ¿o qué? Transcribe verbatim including filler words.'

  const outForm = new FormData()
  outForm.append('file', file, 'audio.webm')
  outForm.append('model', model)
  outForm.append('language', 'es')
  outForm.append('response_format', 'json')
  outForm.append('prompt', whisperPrompt)
  outForm.append('temperature', '0')

  try {
    const res = await fetch(`${baseURL}/audio/transcriptions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}` },
      body: outForm,
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error('Transcription API error:', errText)
      return NextResponse.json({ error: 'Transcription service error' }, { status: 500 })
    }

    const data = await res.json()
    return NextResponse.json({ text: (data.text as string) ?? '' })
  } catch (e) {
    console.error('Transcription failed:', e)
    return NextResponse.json({ error: 'Transcription failed' }, { status: 500 })
  }
}
