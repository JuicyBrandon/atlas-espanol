'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '@/components/ui/Button'
import { cn, severityColor } from '@/lib/utils'
import { Send, Globe } from 'lucide-react'
import type { ChatMessage } from '@/types'

interface ChatWindowProps {
  messages: ChatMessage[]
  onSend: (text: string) => void
  loading?: boolean
  placeholder?: string
}

export default function ChatWindow({ messages, onSend, loading, placeholder }: ChatWindowProps) {
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    const trimmed = input.trim()
    if (!trimmed || loading) return
    onSend(trimmed)
    setInput('')
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-[#1E2A3A]/8 overflow-hidden shadow-[0_2px_16px_rgba(30,42,58,0.06)]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center gap-3 py-16">
            <div className="w-12 h-12 rounded-2xl bg-[#1E2A3A] flex items-center justify-center">
              <Globe className="w-6 h-6 text-[#F2C94C]" />
            </div>
            <p className="text-[#1E2A3A]/50 text-sm max-w-xs">
              Your Atlas coach is ready. Say hola or ask anything about Colombian Spanish.
            </p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-[#1E2A3A] flex items-center justify-center mr-2.5 mt-0.5 shrink-0">
                  <Globe className="w-3.5 h-3.5 text-[#F2C94C]" />
                </div>
              )}
              <div className={cn('max-w-[75%]')}>
                <div className={cn(
                  'px-4 py-3 rounded-2xl text-sm leading-relaxed',
                  msg.role === 'user'
                    ? 'bg-[#1E2A3A] text-white rounded-br-md'
                    : 'bg-[#F8F4EC] text-[#1E2A3A] rounded-bl-md'
                )}>
                  {msg.content}
                </div>
                {msg.corrections && msg.corrections.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {msg.corrections.map((c, ci) => (
                      <div key={ci} className={cn('text-xs px-3 py-2 rounded-xl border', severityColor(c.severity))}>
                        <span className="font-medium">{c.original_text}</span> → {c.corrected_text}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <div className="flex justify-start">
            <div className="w-7 h-7 rounded-lg bg-[#1E2A3A] flex items-center justify-center mr-2.5 shrink-0">
              <Globe className="w-3.5 h-3.5 text-[#F2C94C]" />
            </div>
            <div className="bg-[#F8F4EC] px-4 py-3 rounded-2xl rounded-bl-md flex gap-1.5 items-center">
              {[0, 1, 2].map(i => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-[#1E2A3A]/30 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-[#1E2A3A]/8 p-4">
        <div className="flex gap-3 items-end">
          <textarea
            className="flex-1 resize-none rounded-xl border border-[#1E2A3A]/15 bg-[#F8F4EC] px-4 py-3 text-sm text-[#1E2A3A] placeholder:text-[#1E2A3A]/35 focus:outline-none focus:border-[#4A90E2] focus:ring-2 focus:ring-[#4A90E2]/20 min-h-[48px] max-h-[120px] transition-all"
            rows={1}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder={placeholder ?? 'Type in Spanish or ask your coach…'}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            size="md"
            className="shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-[10px] text-[#1E2A3A]/30 mt-2 text-center">Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  )
}
