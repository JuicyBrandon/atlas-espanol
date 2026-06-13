'use client'

import { useState } from 'react'
import { Volume2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PronounceButtonProps {
  text: string
  className?: string
  size?: number
}

// Speaks Colombian Spanish using the browser's built-in Web Speech API.
// No API key or network needed — works offline in all modern browsers.
export default function PronounceButton({ text, className, size = 3.5 }: PronounceButtonProps) {
  const [speaking, setSpeaking] = useState(false)

  const speak = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
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

    utter.onstart = () => setSpeaking(true)
    utter.onend = () => setSpeaking(false)
    utter.onerror = () => setSpeaking(false)

    // Voices may not be loaded on the first call — wait for them if needed.
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
