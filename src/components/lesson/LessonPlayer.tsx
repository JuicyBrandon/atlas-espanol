'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { severityColor, severityLabel } from '@/lib/utils'
import { CheckCircle, ChevronRight, BookOpen, Volume2, AlertCircle } from 'lucide-react'
import type { Lesson, CorrectionSeverity, CorrectionCategory } from '@/types'

interface CorrectionResult {
  severity: CorrectionSeverity
  corrected_text: string
  natural_colombian_text: string
  explanation: string
  category: CorrectionCategory
  practice_sentence: string
  feedback: string
}

type LessonStep = 'intro' | 'vocabulary' | 'phrase' | 'practice' | 'complete'

export default function LessonPlayer({ lesson }: { lesson: Lesson }) {
  const router = useRouter()
  const [step, setStep] = useState<LessonStep>('intro')
  const [savedWords, setSavedWords] = useState<Set<number>>(new Set())
  const [practiceText, setPracticeText] = useState('')
  const [correction, setCorrection] = useState<CorrectionResult | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [completing, setCompleting] = useState(false)
  const [newLevel, setNewLevel] = useState<number | null>(null)
  const [completedLevel, setCompletedLevel] = useState<number | null>(null)

  const saveWord = (idx: number) => setSavedWords(prev => new Set([...prev, idx]))

  const handleAnalyse = async () => {
    if (!practiceText.trim()) return
    setAnalyzing(true)
    try {
      const res = await fetch('/api/corrections/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: practiceText, userLevel: lesson.level }),
      })
      const data = await res.json()
      setCorrection(data)
    } catch {
      // Non-fatal — let user complete anyway
    } finally {
      setAnalyzing(false)
    }
  }

  const handleComplete = async () => {
    setCompleting(true)
    try {
      const res = await fetch('/api/lesson/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: lesson.id,
          vocabulary: lesson.vocabulary,
          moduleName: lesson.module_name,
          score: correction?.severity === 'green' ? 95 : correction?.severity === 'yellow' ? 75 : 60,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        if (data.levelUp && data.newLevel) {
          setNewLevel(data.newLevel)
          setCompletedLevel(data.completedLevel ?? data.newLevel - 1)
        }
      }
    } catch {
      // Non-fatal
    } finally {
      setCompleting(false)
      setStep('complete')
    }
  }

  const steps: LessonStep[] = ['intro', 'vocabulary', 'phrase', 'practice', 'complete']

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="navy">Level {lesson.level}</Badge>
            <Badge variant="default">{lesson.module_name}</Badge>
          </div>
          <h1 className="text-xl font-bold text-[#1E2A3A] tracking-tight">{lesson.lesson_title}</h1>
          <p className="text-sm text-[#6F4E37]/70 mt-0.5">{lesson.lesson_goal}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex gap-1.5">
        {steps.map((s, i) => (
          <div
            key={s}
            className={`flex-1 h-1.5 rounded-full transition-all ${
              s === step
                ? 'bg-[#F2C94C]'
                : steps.indexOf(step) > i
                ? 'bg-[#27AE60]'
                : 'bg-[#1E2A3A]/10'
            }`}
          />
        ))}
      </div>

      {/* Intro */}
      {step === 'intro' && (
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-[#4A90E2]" />
            <h2 className="font-semibold text-[#1E2A3A]">What you will learn</h2>
          </div>
          <p className="text-sm text-[#6F4E37]/80 leading-relaxed mb-4">
            {lesson.lesson_goal}
          </p>
          <div className="bg-[#F8F4EC] rounded-xl p-4 mb-4 border border-[#1E2A3A]/8">
            <p className="text-xs text-[#6F4E37]/60 mb-1 font-medium uppercase tracking-wide">Scenario</p>
            <p className="text-sm text-[#1E2A3A]/80 italic">{lesson.scenario}</p>
          </div>
          {lesson.grammar_focus && (
            <div className="bg-[#F2C94C]/10 rounded-xl p-4 mb-6 border border-[#F2C94C]/30">
              <p className="text-xs text-[#6F4E37]/60 mb-1 font-medium uppercase tracking-wide">Grammar focus</p>
              <p className="text-sm font-medium text-[#1E2A3A]">{lesson.grammar_focus}</p>
            </div>
          )}
          <Button className="w-full" onClick={() => setStep('vocabulary')}>
            Start lesson <ChevronRight className="w-4 h-4" />
          </Button>
        </Card>
      )}

      {/* Vocabulary */}
      {step === 'vocabulary' && (
        <div className="space-y-4">
          <h2 className="font-semibold text-[#1E2A3A]">
            Today&apos;s vocabulary ({lesson.vocabulary.length} words)
          </h2>
          {lesson.vocabulary.map((v, i) => (
            <Card key={i}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-[#1E2A3A]">{v.spanish}</p>
                    <button className="text-[#1E2A3A]/30 hover:text-[#4A90E2] transition-colors">
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-sm text-[#6F4E37]/70">{v.english}</p>
                  {v.colombian && v.colombian !== v.spanish && (
                    <p className="text-xs text-[#4A90E2] mt-1">
                      Colombian: <span className="font-medium">{v.colombian}</span>
                    </p>
                  )}
                  {v.note && (
                    <p className="text-xs text-[#F2994A]/80 mt-1 italic">{v.note}</p>
                  )}
                </div>
                <button
                  onClick={() => saveWord(i)}
                  className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                    savedWords.has(i)
                      ? 'bg-[#27AE60]/15 text-[#27AE60]'
                      : 'bg-[#1E2A3A]/5 text-[#1E2A3A]/30 hover:bg-[#1E2A3A]/10'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
          <Button className="w-full" onClick={() => setStep('phrase')}>
            Continue <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Key phrase */}
      {step === 'phrase' && (
        <Card>
          <h2 className="font-semibold text-[#1E2A3A] mb-4">Key Colombian phrases</h2>
          <div className="space-y-3 mb-6">
            {lesson.vocabulary.slice(0, 3).map((v, i) => (
              <div key={i} className="bg-[#1E2A3A] rounded-2xl p-4 text-center">
                <p className="text-[#F2C94C] text-xs font-medium uppercase tracking-wide mb-1">
                  {v.note || 'Say this'}
                </p>
                <p className="text-xl font-bold text-white">{v.colombian || v.spanish}</p>
                <p className="text-white/60 text-sm mt-0.5">{v.english}</p>
              </div>
            ))}
          </div>
          <Button className="w-full" onClick={() => setStep('practice')}>
            Practice with coach <ChevronRight className="w-4 h-4" />
          </Button>
        </Card>
      )}

      {/* Practice */}
      {step === 'practice' && (
        <div className="space-y-4">
          <Card>
            <h2 className="font-semibold text-[#1E2A3A] mb-2">Speaking task</h2>
            <p className="text-sm text-[#6F4E37]/70 mb-4 leading-relaxed">
              Practice in the context of: <span className="font-medium text-[#1E2A3A]">{lesson.scenario}</span>
              <br />Write a short response using what you&apos;ve learned.
            </p>
            <div className="bg-[#F8F4EC] rounded-xl p-4 mb-4 border border-[#1E2A3A]/8">
              <textarea
                rows={4}
                value={practiceText}
                onChange={e => {
                  setPracticeText(e.target.value)
                  setCorrection(null)
                }}
                className="w-full bg-transparent text-sm text-[#1E2A3A] placeholder:text-[#1E2A3A]/35 outline-none resize-none"
                placeholder="Write your response in Spanish here…"
              />
            </div>
            {!correction ? (
              <Button
                className="w-full"
                onClick={handleAnalyse}
                loading={analyzing}
                disabled={!practiceText.trim()}
              >
                Analyse my Spanish <AlertCircle className="w-4 h-4" />
              </Button>
            ) : (
              <Button className="w-full" variant="ghost" onClick={() => {
                setPracticeText('')
                setCorrection(null)
              }}>
                Try again
              </Button>
            )}
          </Card>

          {correction && (
            <Card className={`border ${severityColor(correction.severity)}`}>
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-2 h-2 rounded-full ${
                  correction.severity === 'green' ? 'bg-emerald-500' :
                  correction.severity === 'yellow' ? 'bg-amber-500' : 'bg-red-500'
                }`} />
                <span className={`text-xs font-semibold uppercase tracking-wide ${
                  correction.severity === 'green' ? 'text-emerald-700' :
                  correction.severity === 'yellow' ? 'text-amber-700' : 'text-red-700'
                }`}>{severityLabel(correction.severity)}</span>
              </div>
              <p className="text-sm mb-3">{correction.feedback}</p>
              {correction.severity !== 'green' && (
                <>
                  <div className="bg-white/60 rounded-lg p-3 mb-2">
                    <p className="text-xs font-medium mb-1 opacity-70">Corrected</p>
                    <p className="text-sm font-medium">{correction.corrected_text}</p>
                  </div>
                  {correction.natural_colombian_text !== correction.corrected_text && (
                    <div className="bg-white/60 rounded-lg p-3 mb-2">
                      <p className="text-xs font-medium mb-1 opacity-70">Colombian natural</p>
                      <p className="text-sm font-medium">{correction.natural_colombian_text}</p>
                    </div>
                  )}
                  <p className="text-xs opacity-70 mt-2">{correction.explanation}</p>
                </>
              )}
              <Button
                className="w-full mt-4"
                onClick={handleComplete}
                loading={completing}
              >
                Complete lesson <CheckCircle className="w-4 h-4" />
              </Button>
            </Card>
          )}

          {!correction && (
            <Button variant="ghost" className="w-full" onClick={handleComplete} loading={completing}>
              Skip and complete
            </Button>
          )}
        </div>
      )}

      {/* Complete */}
      {step === 'complete' && (
        <Card variant="navy" className="text-center">
          <div className="w-14 h-14 bg-[#F2C94C]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-7 h-7 text-[#F2C94C]" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">
            {newLevel ? `¡Subiste de nivel! Level ${newLevel}` : '¡Lección completa!'}
          </h2>
          <p className="text-white/60 text-sm mb-6">
            {newLevel
              ? `You completed every lesson at Level ${completedLevel ?? newLevel - 1} — welcome to Level ${newLevel}. New lessons and scenarios are now unlocked.`
              : `${lesson.vocabulary.length} words added to your vocabulary bank. Keep the streak going.`}
          </p>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: 'Words saved', value: lesson.vocabulary.length },
              { label: 'Module', value: lesson.sort_order || 1 },
              { label: 'Level', value: lesson.level },
            ].map(s => (
              <div key={s.label} className="bg-white/10 rounded-xl p-3">
                <p className="text-[#F2C94C] font-bold text-lg">{s.value}</p>
                <p className="text-white/50 text-xs">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <Button variant="secondary" size="lg" className="w-full" onClick={() => router.push('/vocabulary')}>
              Review vocabulary
            </Button>
            <Button variant="ghost" size="sm" className="w-full text-white/60 hover:text-white" onClick={() => router.push('/dashboard')}>
              Back to dashboard
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
