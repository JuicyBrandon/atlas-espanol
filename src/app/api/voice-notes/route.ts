import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('voice_notes')
    .select('id, transcript, corrected_text, severity, explanation, duration_seconds, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    // Table may not exist yet (migration pending)
    console.error('voice_notes fetch error:', error.message)
    return NextResponse.json({ notes: [] })
  }

  return NextResponse.json({ notes: data ?? [] })
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { transcript, corrected_text, severity, explanation, duration_seconds } = await req.json()

  if (!transcript?.trim()) return NextResponse.json({ error: 'transcript required' }, { status: 400 })

  const { data, error } = await supabase
    .from('voice_notes')
    .insert({
      user_id: user.id,
      transcript,
      corrected_text: corrected_text ?? null,
      severity: severity ?? null,
      explanation: explanation ?? null,
      duration_seconds: duration_seconds ?? null,
    })
    .select()
    .single()

  if (error) {
    console.error('voice_notes insert error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ note: data })
}
