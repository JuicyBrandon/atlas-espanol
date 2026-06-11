'use client'

import { useState } from 'react'
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

  const handleSend = async (text: string) => {
    const userMsg: ChatMessage = {
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    }

    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setLoading(true)

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

      const contentType = res.headers.get('content-type') ?? ''

      if (contentType.includes('text/plain') && res.body) {
        // Streaming response — show loading until first token, then update live
        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let fullText = ''
        let firstChunk = true

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          fullText += decoder.decode(value, { stream: true })

          if (firstChunk) {
            setLoading(false)
            firstChunk = false
          }

          setMessages(prev => {
            const updated = [...prev]
            updated[updated.length - 1] = {
              ...updated[updated.length - 1],
              content: fullText,
            }
            return updated
          })
        }
      } else {
        // JSON fallback (mock mode)
        const data = await res.json()
        setMessages(prev => {
          const updated = [...prev]
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            content: data.content ?? '¡Disculpa! Something went wrong. Try again in a moment.',
          }
          return updated
        })
      }
    } catch {
      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
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
