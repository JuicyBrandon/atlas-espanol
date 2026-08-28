'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ChatWindow from '@/components/coach/ChatWindow'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import type { RolePlayScenario } from '@/lib/roleplay-scenarios'
import type { RolePlaySummary } from '@/app/api/roleplay/end/route'
import type { ChatMessage } from '@/types'
import { Flag, User, MapPin, Target, CheckCircle, Lightbulb, BookMarked, RotateCcw } from 'lucide-react'

interface Props {
  mode: string
  modeLabel: string
  scenario: RolePlayScenario
  userLevel: number
}

type Phase = 'briefing' | 'playing' | 'summarising' | 'debrief'

export default function RolePlaySession({ mode, modeLabel, scenario, userLevel }: Props) {
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>('briefing')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [summary, setSummary] = useState<RolePlaySummary | null>(null)

  const handleSend = async (text: string) => {
    const userMsg: ChatMessage = { role: 'user', content: text, timestamp: new Date().toISOString() }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setLoading(true)

    const placeholder: ChatMessage = { role: 'assistant', content: '', timestamp: new Date().toISOString() }
    setMessages(prev => [...prev, placeholder])

    try {
      const res = await fetch('/api/roleplay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          mode,
          scenarioSlug: scenario.slug,
          userLevel,
        }),
      })

      const contentType = res.headers.get('content-type') ?? ''

      if (contentType.includes('text/plain') && res.body) {
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
            updated[updated.length - 1] = { ...updated[updated.length - 1], content: fullText }
            return updated
          })
        }
      } else {
        const data = await res.json()
        setMessages(prev => {
          const updated = [...prev]
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            content: data.content ?? '...',
          }
          return updated
        })
      }
    } catch {
      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          content: '(Connection issue — try again.)',
        }
        return updated
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEnd = async () => {
    setPhase('summarising')
    try {
      const res = await fetch('/api/roleplay/end', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages, mode, scenarioSlug: scenario.slug, userLevel }),
      })
      if (res.ok) {
        setSummary(await res.json())
      }
    } catch {
      // Fall through to debrief with whatever we have
    } finally {
      setPhase('debrief')
    }
  }

  const userTurns = messages.filter(m => m.role === 'user').length

  if (phase === 'briefing') {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="navy">{modeLabel}</Badge>
            <Badge variant="gold">Level {scenario.minLevel}+</Badge>
          </div>
          <h1 className="text-xl font-bold text-[#1E2A3A] tracking-tight">{scenario.title}</h1>
          <p className="text-sm text-[#6F4E37]/70 mt-0.5">{scenario.description}</p>
        </div>

        <Card>
          <div className="space-y-4">
            {[
              { icon: User, label: 'Who you are talking to', value: scenario.aiCharacter },
              { icon: MapPin, label: 'Setting', value: scenario.setting },
              { icon: Target, label: 'Your objective', value: scenario.objective },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#F2C94C]/15 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-[#B8902A]" />
                </div>
                <div>
                  <p className="text-xs text-[#6F4E37]/60 font-medium uppercase tracking-wide mb-0.5">{label}</p>
                  <p className="text-sm text-[#1E2A3A]/85 leading-relaxed">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="bg-[#F2C94C]/8 border-[#F2C94C]/30">
          <div className="flex gap-2 items-start">
            <Lightbulb className="w-4 h-4 text-[#B8902A] mt-0.5 shrink-0" />
            <p className="text-xs text-[#6F4E37]/80 leading-relaxed">
              Stay in Spanish as much as you can. The character will adapt to your level and won&apos;t
              interrupt you with corrections — you&apos;ll get full feedback when you end the session.
            </p>
          </div>
        </Card>

        <Button size="lg" className="w-full" onClick={() => setPhase('playing')}>
          Start role play
        </Button>
      </div>
    )
  }

  if (phase === 'playing' || phase === 'summarising') {
    return (
      <div className="space-y-4 h-full">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-lg font-bold text-[#1E2A3A] tracking-tight truncate">{scenario.title}</h1>
            <p className="text-xs text-[#6F4E37]/60 truncate">{scenario.objective}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEnd}
            loading={phase === 'summarising'}
            disabled={userTurns === 0}
            className="shrink-0"
          >
            <Flag className="w-4 h-4" /> End &amp; get feedback
          </Button>
        </div>
        <div className="h-[calc(100vh-200px)] md:h-[600px]">
          <ChatWindow
            messages={messages}
            onSend={handleSend}
            loading={loading}
            placeholder="Responde en español…"
          />
        </div>
      </div>
    )
  }

  // Debrief
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <Card variant="navy" className="text-center">
        <div className="w-14 h-14 bg-[#F2C94C]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-7 h-7 text-[#F2C94C]" />
        </div>
        <h2 className="text-xl font-bold text-white mb-1">Role play complete</h2>
        <p className="text-white/60 text-sm mb-5">{scenario.title}</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-[#F2C94C] font-bold text-2xl">{summary?.score ?? '—'}</p>
            <p className="text-white/50 text-xs">Score</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-[#F2C94C] font-bold text-2xl">{userTurns}</p>
            <p className="text-white/50 text-xs">Your turns</p>
          </div>
        </div>
      </Card>

      {summary && (
        <>
          <Card>
            <h3 className="text-sm font-semibold text-[#1E2A3A] mb-2">What went well</h3>
            <p className="text-sm text-[#6F4E37]/80 leading-relaxed">{summary.what_went_well}</p>
          </Card>

          {summary.corrections?.length > 0 && (
            <Card>
              <h3 className="text-sm font-semibold text-[#1E2A3A] mb-3">Corrections ({summary.corrections.length})</h3>
              <div className="space-y-3">
                {summary.corrections.map((c, i) => (
                  <div key={i} className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                    <p className="text-sm text-amber-900 line-through opacity-60">{c.original}</p>
                    <p className="text-sm font-medium text-[#1E2A3A] mt-1">{c.corrected}</p>
                    {c.natural_colombian && c.natural_colombian !== c.corrected && (
                      <p className="text-xs text-[#4A90E2] mt-1">Colombian: {c.natural_colombian}</p>
                    )}
                    <p className="text-xs text-[#6F4E37]/70 mt-1.5">{c.explanation}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {summary.new_vocabulary?.length > 0 && (
            <Card>
              <div className="flex items-center gap-2 mb-3">
                <BookMarked className="w-4 h-4 text-[#F2994A]" />
                <h3 className="text-sm font-semibold text-[#1E2A3A]">New vocabulary (saved to your bank)</h3>
              </div>
              <div className="space-y-2">
                {summary.new_vocabulary.map((v, i) => (
                  <div key={i} className="flex items-baseline justify-between gap-3 py-1.5 border-b border-[#1E2A3A]/5 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-[#1E2A3A]">{v.spanish}</p>
                      <p className="text-xs text-[#6F4E37]/60">{v.english}</p>
                    </div>
                    {v.colombian && <p className="text-xs text-[#4A90E2] text-right shrink-0 max-w-[40%]">{v.colombian}</p>}
                  </div>
                ))}
              </div>
            </Card>
          )}

          <Card className="bg-[#4A90E2]/5 border-[#4A90E2]/20">
            <h3 className="text-sm font-semibold text-[#1E2A3A] mb-2">Cultural notes</h3>
            <p className="text-sm text-[#6F4E37]/80 leading-relaxed mb-3">{summary.cultural_notes}</p>
            <h3 className="text-sm font-semibold text-[#1E2A3A] mb-2">Next challenge</h3>
            <p className="text-sm text-[#6F4E37]/80 leading-relaxed">{summary.next_challenge}</p>
          </Card>
        </>
      )}

      <div className="flex gap-3">
        <Button
          variant="ghost"
          className="flex-1"
          onClick={() => {
            setMessages([])
            setSummary(null)
            setPhase('briefing')
          }}
        >
          <RotateCcw className="w-4 h-4" /> Play again
        </Button>
        <Button className="flex-1" onClick={() => router.push(`/roleplays/${mode}`)}>
          More scenarios
        </Button>
      </div>
    </div>
  )
}
