'use client'

import { useState, useRef, useCallback } from 'react'
import { Mic, Square, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type RecordingState = 'idle' | 'recording' | 'processing'

interface VoiceButtonProps {
  onTranscription: (text: string, durationSeconds: number) => void
  disabled?: boolean
  className?: string
  size?: 'sm' | 'md'
}

export default function VoiceButton({
  onTranscription,
  disabled,
  className,
  size = 'md',
}: VoiceButtonProps) {
  const [state, setState] = useState<RecordingState>('idle')
  const [error, setError] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const startTimeRef = useRef<number>(0)

  const startRecording = useCallback(async () => {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm'
      const recorder = new MediaRecorder(stream, { mimeType })
      mediaRecorderRef.current = recorder
      chunksRef.current = []
      startTimeRef.current = Date.now()

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      recorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop())
        const durationSeconds = Math.round((Date.now() - startTimeRef.current) / 1000)
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType })

        if (blob.size < 1000) {
          // Too short to be meaningful audio
          setState('idle')
          return
        }

        setState('processing')
        try {
          const form = new FormData()
          form.append('file', blob, 'recording.webm')
          const res = await fetch('/api/transcribe', { method: 'POST', body: form })
          if (!res.ok) throw new Error('Transcription request failed')
          const { text, error: apiError } = await res.json()
          if (apiError) throw new Error(apiError)
          if (text) onTranscription(text, durationSeconds)
        } catch {
          setError('Transcription failed. Try again.')
        } finally {
          setState('idle')
        }
      }

      recorder.start(250)
      setState('recording')
    } catch (e) {
      const msg = e instanceof Error ? e.message : ''
      setError(msg.includes('Permission') || msg.includes('denied')
        ? 'Microphone access denied.'
        : 'Could not start recording.')
      setState('idle')
    }
  }, [onTranscription])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
  }, [])

  const toggle = () => {
    if (disabled || state === 'processing') return
    if (state === 'recording') stopRecording()
    else startRecording()
  }

  const dim = size === 'sm' ? 'w-9 h-9' : 'w-11 h-11'
  const icon = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        type="button"
        onClick={toggle}
        disabled={disabled || state === 'processing'}
        aria-label={state === 'recording' ? 'Stop recording' : 'Record voice input'}
        className={cn(
          dim,
          'rounded-xl flex items-center justify-center transition-all duration-150 shrink-0',
          state === 'recording'
            ? 'bg-red-500 text-white shadow-[0_0_0_4px_rgba(239,68,68,0.25)] animate-pulse'
            : state === 'processing'
            ? 'bg-[#1E2A3A]/8 text-[#1E2A3A]/30 cursor-not-allowed'
            : 'bg-[#1E2A3A]/8 text-[#1E2A3A]/50 hover:bg-[#1E2A3A]/15 hover:text-[#1E2A3A]',
          className
        )}
      >
        {state === 'processing' ? (
          <Loader2 className={cn(icon, 'animate-spin')} />
        ) : state === 'recording' ? (
          <Square className={cn(icon, 'fill-current')} />
        ) : (
          <Mic className={icon} />
        )}
      </button>
      {error && (
        <p className="text-[10px] text-red-500 max-w-[120px] text-center leading-tight">{error}</p>
      )}
    </div>
  )
}
