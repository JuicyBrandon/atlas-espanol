'use client'

import { useRef, useState } from 'react'
import { Volume2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PronounceButtonProps {
  text: string
  voice?: 'salome' | 'gonzalo'
  className?: string
  size?: number
}

// Plays Colombian Spanish pronunciation. Tries the server /api/tts endpoint
// first (authentic Azure es-CO voice); if that isn't configured or fails,
// falls back to the browser's built-in Web Speech API so it always works.
export default function PronounceButton({ text, voice = 'salome', className, size = 3.5 }: PronounceButtonProps) {
  const [speaking, setSpeaking] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const browserSpeak = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setSpeaking(false)
      return
    }
    const synth = window.speechSynthesis
    synth.cancel()

    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = 'es-CO'
    utter.rate = 0.9

    const assignVoice = () => {
      const voices = synth.getVoices()
      const preferred =
        voices.find(v => v.lang === 'es-CO') ||
        voices.find(v => v.lang.startsWith('es-')) ||
        voices.find(v => v.lang.toLowerCase().startsWith('es'))
      if (preferred) utter.voice = preferred
    }

    utter.onend = () => setSpeaking(false)
    utter.onerror = () => setSpeaking(false)

    if (synth.getVoices().length === 0) {
      synth.addEventListener(
        'voiceschanged',
        () => {
          assignVoice()
          synth.speak(utter)
        },
        { once: true }
      )
    } else {
      assignVoice()
      synth.speak(utter)
    }
  }

  const speak = async () => {
    setSpeaking(true)

    // Stop any in-flight browser speech.
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }

    try {
      const res = await fetch(`/api/tts?text=${encodeURIComponent(text)}&voice=${voice}`)
      // 204 (not configured) / 502 (provider error) → browser fallback.
      if (res.ok && res.headers.get('content-type')?.includes('audio')) {
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        const audio = new Audio(url)
        audioRef.current = audio
        audio.onended = () => {
          setSpeaking(false)
          URL.revokeObjectURL(url)
        }
        audio.onerror = () => {
          setSpeaking(false)
          URL.revokeObjectURL(url)
          browserSpeak()
        }
        await audio.play()
        return
      }
    } catch {
      // Network error — fall through to browser speech.
    }

    browserSpeak()
  }

  return (
    <button
      type="button"
      onClick={speak}
      aria-label={`Hear "${text}" pronounced`}
      className={cn(
        'transition-colors',
        speaking ? 'text-[#4A90E2]' : 'text-[#1E2A3A]/30 hover:text-[#4A90E2]',
        className
      )}
    >
      <Volume2 style={{ width: `${size * 4}px`, height: `${size * 4}px` }} className={speaking ? 'animate-pulse' : ''} />
    </button>
  )
}
