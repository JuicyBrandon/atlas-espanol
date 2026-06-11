'use client'

import { useState, useEffect } from 'react'
import ChatWindow from '@/components/coach/ChatWindow'
import { Badge } from '@/components/ui/Badge'
import type { ChatMessage } from '@/types'

export default function CoachPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: '¡Quiubo! Soy Atlas, tu coach de español colombiano. ¿Cómo te llamas y por qué estás aprendiendo español? Tell me in whatever mix of Spanish and English you\'re comfortable with — I\'ll adapt to where you\'re at.',
      timestamp: new Date().toISOString(),
    },
  ])
  const [loading, setLoading] = useState(false)
  const [userLevel] = useState(1)

  useEffect(() => {
    // Reserved for loading user level in a future update
  }, [])

  const handleSend = async (text: string) => {
    const userMsg: ChatMessage = {
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    }

    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setLoading(true)

    // Optimistic placeholder for assistant reply
    const placeholder: ChatMessage = {
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
    }
    setMessages(prev => [...prev, placeholder])

    try {
      const res = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          userLevel,
        }),
      })

      const data = await res.json()
      const reply: ChatMessage = {
        role: 'assistant',
        content: data.content || '¡Disculpa! Something went wrong. Try again in a moment.',
        timestamp: new Date().toISOString(),
      }

      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = reply
        return updated
      })
    } catch {
      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = {
          ...placeholder,
          content: '¡Disculpa! I couldn\'t connect right now. Try again in a moment.',
        }
        return updated
      })
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
          <Badge variant="success">Level {userLevel}</Badge>
          <Badge variant="default">Colombian Spanish</Badge>
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
