import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { isTTSConfigured, synthesizeSpeech, resolveVoice } from '@/lib/tts'

// GET /api/tts?text=hola&voice=salome|gonzalo
// Returns Colombian Spanish MP3 audio. GET + immutable cache headers so the
// browser reuses each clip — the same word is only synthesized once per user.
export async function GET(req: NextRequest): Promise<Response> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // 204 signals the client to fall back to the browser's speech engine.
  if (!isTTSConfigured()) {
    return new NextResponse(null, { status: 204 })
  }

  const text = req.nextUrl.searchParams.get('text')?.trim()
  const voice = resolveVoice(req.nextUrl.searchParams.get('voice') ?? undefined)

  if (!text) {
    return NextResponse.json({ error: 'Missing text' }, { status: 400 })
  }
  // Pronunciation clips are short words/phrases — cap to avoid abuse.
  if (text.length > 200) {
    return NextResponse.json({ error: 'Text too long' }, { status: 400 })
  }

  try {
    const audio = await synthesizeSpeech(text, voice)
    if (!audio) return new NextResponse(null, { status: 204 })

    return new NextResponse(audio, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        // Immutable: the audio for a given (text, voice) never changes.
        'Cache-Control': 'private, max-age=604800, immutable',
      },
    })
  } catch (e) {
    console.error('TTS failed:', e)
    // 502 tells the client to fall back to browser speech synthesis.
    return new NextResponse(null, { status: 502 })
  }
}
