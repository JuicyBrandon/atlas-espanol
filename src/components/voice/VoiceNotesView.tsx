'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import VoiceButton from '@/components/ui/VoiceButton'
import { Badge } from '@/components/ui/Badge'
import { Trash2, Mic, CheckCircle } from 'lucide-react'
import { cn, severityColor } from '@/lib/utils'
import type { VoiceNote } from '@/types'

interface PendingNote {
  transcript: string
  corrected_text?: string
  severity?: string
  explanation?: string
  durationSeconds: number
  analyzing: boolean
}

interface VoiceNotesViewProps {
  initialNotes: VoiceNote[]
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function formatDuration(s: number) {
  return s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${s % 60}s`
}

export default function VoiceNotesView({ initialNotes }: VoiceNotesViewProps) {
  const [notes, setNotes] = useState<VoiceNote[]>(initialNotes)
  const [pending, setPending] = useState<PendingNote | null>(null)
  const [saving, setSaving] = useState(false)

  const handleTranscription = async (text: string, durationSeconds: number) => {
    setPending({ transcript: text, durationSeconds, analyzing: true })

    // Analyze the Spanish (context=voice so the AI is lenient about filler words)
    try {
      const res = await fetch('/api/corrections/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, userLevel: 1, context: 'voice' }),
      })
      if (res.ok) {
        const data = await res.json()
        setPending(prev => prev ? {
          ...prev,
          corrected_text: data.corrected_text,
          severity: data.severity,
          explanation: data.explanation,
          analyzing: false,
        } : null)
        return
      }
    } catch {
      // Analysis is non-fatal
    }
    setPending(prev => prev ? { ...prev, analyzing: false } : null)
  }

  const saveNote = async () => {
    if (!pending || saving) return
    setSaving(true)
    try {
      const res = await fetch('/api/voice-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: pending.transcript,
          corrected_text: pending.corrected_text,
          severity: pending.severity,
          explanation: pending.explanation,
          duration_seconds: pending.durationSeconds,
        }),
      })
      if (res.ok) {
        const { note } = await res.json()
        setNotes(prev => [note, ...prev])
        setPending(null)
      }
    } finally {
      setSaving(false)
    }
  }

  const deleteNote = async (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id))
    await fetch(`/api/voice-notes/${id}`, { method: 'DELETE' })
  }

  const severityBadge = (s?: string) => {
    if (s === 'green') return <Badge variant="success">Correct</Badge>
    if (s === 'yellow') return <Badge variant="gold">Awkward</Badge>
    if (s === 'red') return <Badge variant="error">Error</Badge>
    return null
  }

  return (
    <div className="space-y-6">
      {/* Recorder card */}
      <Card>
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="flex flex-col items-center gap-2">
            <VoiceButton
              onTranscription={handleTranscription}
              disabled={!!pending}
              size="md"
            />
            <p className="text-xs text-[#6F4E37]/60">
              {pending ? 'Transcribing…' : 'Tap to record in Spanish'}
            </p>
          </div>

          {pending && (
            <div className="w-full space-y-3">
              <div className="bg-[#F8F4EC] rounded-xl px-4 py-3 border border-[#1E2A3A]/8">
                <p className="text-sm text-[#1E2A3A] leading-relaxed">{pending.transcript}</p>
                {pending.durationSeconds > 0 && (
                  <p className="text-[10px] text-[#1E2A3A]/40 mt-1">
                    {formatDuration(pending.durationSeconds)}
                  </p>
                )}
              </div>

              {pending.analyzing ? (
                <p className="text-xs text-[#6F4E37]/60 text-center animate-pulse">Analysing your Spanish…</p>
              ) : pending.severity && (
                <div className={cn(
                  'rounded-xl px-4 py-3 text-xs border',
                  severityColor(pending.severity as 'green' | 'yellow' | 'red')
                )}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">Feedback</span>
                    {severityBadge(pending.severity)}
                  </div>
                  {pending.corrected_text && pending.corrected_text !== pending.transcript && (
                    <p><span className="opacity-60">Correction:</span> {pending.corrected_text}</p>
                  )}
                  {pending.explanation && (
                    <p className="mt-1 opacity-70">{pending.explanation}</p>
                  )}
                </div>
              )}

              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setPending(null)}
                  className="px-4 py-2 text-xs text-[#6F4E37]/60 hover:text-[#1E2A3A] transition-colors"
                >
                  Discard
                </button>
                <button
                  onClick={saveNote}
                  disabled={saving || pending.analyzing}
                  className="px-4 py-2 text-xs font-medium bg-[#1E2A3A] text-[#F2C94C] rounded-lg hover:bg-[#2a3a50] disabled:opacity-50 transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  {saving ? 'Saving…' : 'Save note'}
                </button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Notes list */}
      {notes.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#1E2A3A]/6 flex items-center justify-center">
            <Mic className="w-6 h-6 text-[#1E2A3A]/30" />
          </div>
          <p className="text-sm text-[#6F4E37]/60">No voice notes yet. Record one above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notes.map(note => (
            <Card key={note.id}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] text-[#1E2A3A]/40">{formatTime(note.created_at)}</span>
                    {note.duration_seconds && (
                      <span className="text-[10px] text-[#1E2A3A]/30">{formatDuration(note.duration_seconds)}</span>
                    )}
                    {severityBadge(note.severity ?? undefined)}
                  </div>
                  <p className="text-sm text-[#1E2A3A] leading-relaxed">{note.transcript}</p>
                  {note.corrected_text && note.corrected_text !== note.transcript && (
                    <p className="text-xs text-[#6F4E37]/60 mt-1">
                      <span className="font-medium">Correction:</span> {note.corrected_text}
                    </p>
                  )}
                  {note.explanation && (
                    <p className="text-xs text-[#1E2A3A]/50 mt-1">{note.explanation}</p>
                  )}
                </div>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="text-[#1E2A3A]/20 hover:text-red-400 transition-colors shrink-0 p-1"
                  aria-label="Delete note"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
