'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { PLACEMENT_QUESTIONS, scoreToLevel, LEVEL_DESCRIPTIONS } from '@/lib/placement'
import { levelToLabel, cn } from '@/lib/utils'
import { CheckCircle, XCircle, ChevronRight, Trophy } from 'lucide-react'
import type { SpanishLevel } from '@/types'

type Phase = 'intro' | 'quiz' | 'result'

export default function PlacementPage() {
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>('intro')
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>(Array(PLACEMENT_QUESTIONS.length).fill(null))
  const [revealed, setRevealed] = useState(false)
  const [saving, setSaving] = useState(false)

  const question = PLACEMENT_QUESTIONS[current]
  const selected = answers[current]
  const correctCount = answers.filter((a, i) => a === PLACEMENT_QUESTIONS[i].correct).length
  const recommendedLevel = scoreToLevel(correctCount) as SpanishLevel

  const choose = (idx: number) => {
    if (revealed) return
    setAnswers(prev => { const next = [...prev]; next[current] = idx; return next })
    setRevealed(true)
  }

  const next = () => {
    setRevealed(false)
    if (current + 1 < PLACEMENT_QUESTIONS.length) {
      setCurrent(c => c + 1)
    } else {
      setPhase('result')
    }
  }

  const applyLevel = async () => {
    setSaving(true)
    try {
      await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ current_level: recommendedLevel }),
      })
      router.push('/dashboard')
    } finally {
      setSaving(false)
    }
  }

  if (phase === 'intro') {
    return (
      <div className="max-w-xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1E2A3A] tracking-tight">Placement test</h1>
          <p className="text-sm text-[#6F4E37]/60 mt-0.5">Find your starting level in 6 quick questions</p>
        </div>
        <Card>
          <div className="space-y-4 text-sm text-[#1E2A3A]/70 leading-relaxed">
            <p>Answer each question as honestly as you can — guessing doesn&apos;t help, wrong answers are just information.</p>
            <p>The test covers vocabulary, grammar, and Colombian expressions from Levels 1 to 5.</p>
            <p className="text-[#6F4E37]/50 text-xs">Takes about 2 minutes. You can always change your level later in Settings.</p>
          </div>
          <Button className="mt-5 w-full" size="lg" onClick={() => setPhase('quiz')}>
            Start test <ChevronRight className="w-4 h-4" />
          </Button>
        </Card>
      </div>
    )
  }

  if (phase === 'quiz') {
    return (
      <div className="max-w-xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-[#1E2A3A]">Placement test</h1>
          <span className="text-sm text-[#6F4E37]/60">{current + 1} / {PLACEMENT_QUESTIONS.length}</span>
        </div>

        {/* Progress dots */}
        <div className="flex gap-1.5">
          {PLACEMENT_QUESTIONS.map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-1.5 flex-1 rounded-full transition-all',
                i < current ? 'bg-[#27AE60]'
                  : i === current ? 'bg-[#F2C94C]'
                  : 'bg-[#1E2A3A]/10'
              )}
            />
          ))}
        </div>

        <Card>
          <p className="text-sm font-medium text-[#1E2A3A] leading-relaxed mb-5">{question.question}</p>
          <div className="space-y-2.5">
            {question.options.map((opt, i) => {
              const isSelected = selected === i
              const isCorrect = i === question.correct
              let style = 'border-[#1E2A3A]/12 bg-white text-[#1E2A3A]/80 hover:border-[#1E2A3A]/30'
              if (revealed) {
                if (isCorrect) style = 'border-[#27AE60] bg-[#27AE60]/8 text-[#1E2A3A]'
                else if (isSelected) style = 'border-[#EB5757] bg-[#EB5757]/6 text-[#1E2A3A]'
                else style = 'border-[#1E2A3A]/8 bg-white text-[#1E2A3A]/40'
              }
              return (
                <button
                  key={i}
                  onClick={() => choose(i)}
                  disabled={revealed}
                  className={cn(
                    'w-full text-left px-4 py-3 rounded-xl border text-sm transition-all flex items-center justify-between gap-3',
                    style
                  )}
                >
                  <span>{opt}</span>
                  {revealed && isCorrect && <CheckCircle className="w-4 h-4 text-[#27AE60] shrink-0" />}
                  {revealed && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-[#EB5757] shrink-0" />}
                </button>
              )
            })}
          </div>

          {revealed && (
            <div className="mt-4 p-3 rounded-xl bg-[#F8F4EC] border border-[#1E2A3A]/8">
              <p className="text-xs text-[#6F4E37]/80 leading-relaxed">{question.explanation}</p>
            </div>
          )}
        </Card>

        {revealed && (
          <Button className="w-full" size="lg" onClick={next}>
            {current + 1 < PLACEMENT_QUESTIONS.length ? 'Next question' : 'See results'}
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    )
  }

  // Result phase
  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1E2A3A] tracking-tight">Your result</h1>
        <p className="text-sm text-[#6F4E37]/60 mt-0.5">{correctCount} of {PLACEMENT_QUESTIONS.length} correct</p>
      </div>

      <Card className="bg-[#1E2A3A]" variant="navy">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-[#F2C94C]/20 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-[#F2C94C]" />
          </div>
          <div>
            <p className="text-[#F2C94C] text-xs font-medium uppercase tracking-wide">Recommended level</p>
            <p className="text-white font-bold text-xl">Level {recommendedLevel} — {levelToLabel(recommendedLevel)}</p>
          </div>
        </div>
        <p className="text-white/60 text-sm leading-relaxed">{LEVEL_DESCRIPTIONS[recommendedLevel]}</p>
      </Card>

      {/* Score breakdown */}
      <Card>
        <h2 className="text-sm font-semibold text-[#1E2A3A] mb-3">Question review</h2>
        <div className="space-y-2">
          {PLACEMENT_QUESTIONS.map((q, i) => {
            const correct = answers[i] === q.correct
            return (
              <div key={q.id} className="flex items-start gap-2.5">
                {correct
                  ? <CheckCircle className="w-4 h-4 text-[#27AE60] shrink-0 mt-0.5" />
                  : <XCircle className="w-4 h-4 text-[#EB5757] shrink-0 mt-0.5" />
                }
                <div className="min-w-0">
                  <p className="text-xs text-[#1E2A3A]/80 leading-snug">{q.question}</p>
                  {!correct && (
                    <p className="text-[10px] text-[#6F4E37]/60 mt-0.5">
                      Correct: {q.options[q.correct]}
                    </p>
                  )}
                </div>
                <Badge variant={correct ? 'success' : 'error'} className="shrink-0 text-[10px] ml-auto">
                  L{q.level}
                </Badge>
              </div>
            )
          })}
        </div>
      </Card>

      <div className="flex flex-col gap-3">
        <Button size="lg" onClick={applyLevel} loading={saving} className="w-full">
          Start at Level {recommendedLevel}
        </Button>
        <button
          onClick={() => router.push('/settings')}
          className="text-sm text-[#6F4E37]/60 hover:text-[#1E2A3A] transition-colors text-center"
        >
          Choose a different level in Settings
        </button>
      </div>
    </div>
  )
}
