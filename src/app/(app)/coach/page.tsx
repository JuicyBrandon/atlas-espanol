'use client'

import { useState } from 'react'
import ChatWindow from '@/components/coach/ChatWindow'
import { Badge } from '@/components/ui/Badge'
import type { ChatMessage } from '@/types'

const SYSTEM_STUB = `You are Atlas Español, an expert Colombian Spanish fluency coach. Your job is to guide the user toward professional working fluency in Colombian Spanish. Prioritise comprehension, communication, and confidence over grammar rules. Use Australian English for explanations. Use Colombian Spanish for examples. Correct major errors after the conversation ends, not mid-flow. Keep a warm, encouraging, professional tone.`

export default function CoachPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: '¡Hola! Soy Atlas, tu coach de español colombiano. ¿Cómo te llamas y por qué estás aprendiendo español? Tell me in whatever mix of Spanish and English you\'re comfortable with — I\'ll adapt to where you\'re at.',
      timestamp: new Date().toISOString(),
    },
  ])
  const [loading, setLoading] = useState(false)

  const handleSend = async (text: string) => {
    const userMsg: ChatMessage = {
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    try {
      // TODO: replace with real API call in Sprint 3
      // Using mock response for Sprint 1
      await new Promise(r => setTimeout(r, 1200))
      const mock: ChatMessage = {
        role: 'assistant',
        content: getMockResponse(text),
        timestamp: new Date().toISOString(),
      }
      setMessages(prev => [...prev, mock])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#1E2A3A] tracking-tight">AI Coach</h1>
          <p className="text-sm text-[#6F4E37]/60">Your personal Colombian Spanish coach</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success">Level 1</Badge>
          <Badge variant="default">General Colombian</Badge>
        </div>
      </div>
      <div className="h-[calc(100vh-200px)] md:h-[600px]">
        <ChatWindow
          messages={messages}
          onSend={handleSend}
          loading={loading}
          placeholder="Escribe en español o pregunta cualquier cosa…"
        />
      </div>
    </div>
  )
}

function getMockResponse(input: string): string {
  const lower = input.toLowerCase()
  if (lower.includes('hola') || lower.includes('hello')) {
    return '¡Quiubo! That\'s the spirit — "hola" works everywhere, but in Colombia you\'ll hear "quiubo" (from "¿qué hubo?") constantly. It\'s the most natural casual greeting. Try using it next time!'
  }
  if (lower.includes('name') || lower.includes('llamo') || lower.includes('soy')) {
    return '¡Qué bueno conocerte! In Colombia, both "Me llamo..." and "Soy..." work perfectly. Colombians tend to be very warm when meeting people — they\'ll often add "Un placer" (a pleasure) or "Mucho gusto". What brings you to Colombian Spanish specifically?'
  }
  if (lower.includes('?') || lower.includes('how') || lower.includes('cómo')) {
    return 'Great question! Colombian Spanish is considered one of the clearest and most neutral accents in Latin America — which makes it ideal for learning. Bogotá Spanish in particular is known for precise pronunciation. What\'s something specific you\'d like to be able to say?'
  }
  return `¡Muy bien! You\'re making a great start. I noticed you wrote: "${input}". That\'s a solid attempt. In natural Colombian Spanish, you might also hear this expressed as... keep practising and we\'ll build your confidence one conversation at a time. ¿Seguimos?`
}
