import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import VoiceNotesView from '@/components/voice/VoiceNotesView'
import type { VoiceNote } from '@/types'

export default async function VoiceNotesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Gracefully handle table-not-yet-migrated case
  const { data } = await supabase
    .from('voice_notes')
    .select('id, transcript, corrected_text, severity, explanation, duration_seconds, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  const notes: VoiceNote[] = (data ?? []) as VoiceNote[]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1E2A3A] tracking-tight">Voice Notes</h1>
        <p className="text-sm text-[#6F4E37]/60 mt-0.5">Record Spanish, get instant feedback</p>
      </div>
      <VoiceNotesView initialNotes={notes} />
    </div>
  )
}
