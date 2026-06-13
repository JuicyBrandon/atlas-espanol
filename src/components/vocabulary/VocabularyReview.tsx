'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { CheckCircle, XCircle, RotateCcw, ChevronRight } from 'lucide-react'
import PronounceButton from '@/components/ui/PronounceButton'
import type { VocabularyItem } from '@/types'

const STATUS_COLORS: Record<string, string> = {
  new: 'default',
  learning: 'gold',
  weak: 'default',
  strong: 'success',
  mastered: 'success',
}

interface Props {
  items: VocabularyItem[]
}

export default function VocabularyReview({ items }: Props) {
  const router = useRouter()
  const [queue, setQueue] = useState<VocabularyItem[]>(items)
  const [current, setCurrent] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [results, setResults] = useState<{ correct: number; incorrect: number }>({ correct: 0, incorrect: 0 })
  const [done, setDone] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const card = queue[current]
  const total = queue.length

  const handleReveal = () => setRevealed(true)

  const handleAnswer = async (correct: boolean) => {
    if (!card || submitting) return
    setSubmitting(true)

    setResults(prev => ({
      correct: correct ? prev.correct + 1 : prev.correct,
      incorrect: correct ? prev.incorrect : prev.incorrect + 1,
    }))

    try {
      await fetch('/api/vocabulary/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: card.id, correct }),
      })
    } catch {
      // Non-fatal
    } finally {
      setSubmitting(false)
    }

    // If incorrect, add card back to end of queue for repeat
    if (!correct && current === queue.length - 1) {
      setQueue(prev => [...prev, { ...card, status: 'learning' }])
    }

    if (current + 1 >= queue.length && correct) {
      setDone(true)
    } else {
      setRevealed(false)
      setCurrent(prev => prev + 1)
    }
  }

  if (!total) {
    return (
      <Card className="text-center py-16">
        <div className="w-12 h-12 bg-[#27AE60]/15 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-6 h-6 text-[#27AE60]" />
        </div>
        <h2 className="font-bold text-[#1E2A3A] mb-2">All caught up!</h2>
        <p className="text-sm text-[#6F4E37]/70 mb-6">No vocabulary due for review right now. Complete a lesson to add more words.</p>
        <Button onClick={() => router.push('/lesson')}>Start a lesson <ChevronRight className="w-4 h-4" /></Button>
      </Card>
    )
  }

  if (done) {
    const accuracy = total > 0 ? Math.round((results.correct / total) * 100) : 0
    return (
      <Card variant="navy" className="text-center">
        <div className="w-14 h-14 bg-[#F2C94C]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-7 h-7 text-[#F2C94C]" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Review complete!</h2>
        <p className="text-white/60 text-sm mb-6">Great work keeping your vocabulary sharp.</p>
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Reviewed', value: total },
            { label: 'Correct', value: results.correct },
            { label: 'Accuracy', value: `${accuracy}%` },
          ].map(s => (
            <div key={s.label} className="bg-white/10 rounded-xl p-3">
              <p className="text-[#F2C94C] font-bold text-lg">{s.value}</p>
              <p className="text-white/50 text-xs">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <Button variant="secondary" size="lg" className="w-full" onClick={() => router.refresh()}>
            <RotateCcw className="w-4 h-4" /> Review again
          </Button>
          <Button variant="ghost" size="sm" className="w-full text-white/60 hover:text-white" onClick={() => router.push('/dashboard')}>
            Back to dashboard
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {/* Progress */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-[#6F4E37]/60">{current + 1} of {total}</span>
        <div className="flex items-center gap-3">
          <span className="text-[#27AE60] font-medium">{results.correct} correct</span>
          <span className="text-[#EB5757] font-medium">{results.incorrect} incorrect</span>
        </div>
      </div>
      <div className="h-1.5 bg-[#1E2A3A]/10 rounded-full">
        <div
          className="h-full bg-[#F2C94C] rounded-full transition-all duration-300"
          style={{ width: `${((current) / total) * 100}%` }}
        />
      </div>

      {/* Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current + (revealed ? '-revealed' : '-hidden')}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="min-h-[220px] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <Badge variant={STATUS_COLORS[card.status] as 'default' | 'gold' | 'success' | 'navy'}>
                {card.status}
              </Badge>
              <span className="text-xs text-[#6F4E37]/50">{card.category}</span>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center text-center py-4">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-3xl font-bold text-[#1E2A3A]">{card.spanish}</p>
                <PronounceButton text={card.spanish} size={5} />
              </div>
              {card.natural_colombian && card.natural_colombian !== card.spanish && (
                <p className="text-sm text-[#4A90E2]">Colombian: {card.natural_colombian}</p>
              )}

              {revealed && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 w-full"
                >
                  <div className="border-t border-[#1E2A3A]/8 pt-4">
                    <p className="text-xl font-semibold text-[#1E2A3A] mb-1">{card.english}</p>
                    {card.example_sentence && (
                      <p className="text-xs text-[#6F4E37]/70 italic mt-2">{card.example_sentence}</p>
                    )}
                  </div>
                </motion.div>
              )}
            </div>

            {!revealed ? (
              <Button className="w-full" onClick={handleReveal}>
                Show answer
              </Button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => handleAnswer(false)}
                  disabled={submitting}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#EB5757]/10 text-[#EB5757] font-medium text-sm hover:bg-[#EB5757]/20 transition-all disabled:opacity-50"
                >
                  <XCircle className="w-4 h-4" /> Didn&apos;t know
                </button>
                <button
                  onClick={() => handleAnswer(true)}
                  disabled={submitting}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#27AE60]/10 text-[#27AE60] font-medium text-sm hover:bg-[#27AE60]/20 transition-all disabled:opacity-50"
                >
                  <CheckCircle className="w-4 h-4" /> Knew it
                </button>
              </div>
            )}
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
