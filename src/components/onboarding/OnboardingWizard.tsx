'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { cn } from '@/lib/utils'
import { LEVELS, COLOMBIAN_FOCUS_OPTIONS, LEARNING_GOALS, DAILY_MINUTES_OPTIONS } from '@/lib/constants'
import type { OnboardingData, SpanishLevel, ColombianFocus, LearningGoal, LearningIntensity } from '@/types'
import { Globe, ChevronRight, ChevronLeft, Check } from 'lucide-react'

const STEPS = ['welcome', 'name', 'level', 'goals', 'focus', 'commitment', 'interests', 'done'] as const
type Step = typeof STEPS[number]

const defaultData: OnboardingData = {
  name: '',
  nativeLanguage: 'English',
  currentLevel: 1,
  targetLevel: 4,
  mainGoal: 'beginner_to_conversational',
  colombianFocus: 'general',
  dailyMinutes: 15,
  learningIntensity: 'steady',
  speakingComfort: 5,
  businessInterest: false,
  salesInterest: false,
  relationshipInterest: false,
  travelInterest: true,
}

export default function OnboardingWizard() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('welcome')
  const [data, setData] = useState<OnboardingData>(defaultData)
  const [loading, setLoading] = useState(false)

  const stepIdx = STEPS.indexOf(step)

  const update = (patch: Partial<OnboardingData>) => setData(prev => ({ ...prev, ...patch }))

  const next = () => {
    const nextStep = STEPS[stepIdx + 1]
    if (nextStep) setStep(nextStep)
  }

  const back = () => {
    const prevStep = STEPS[stepIdx - 1]
    if (prevStep) setStep(prevStep)
  }

  const submit = async () => {
    setLoading(true)
    try {
      await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
    } catch {
      // Non-fatal — proceed to dashboard regardless
    } finally {
      router.push('/dashboard')
    }
  }

  const variants = {
    enter: { opacity: 0, x: 24 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -24 },
  }

  return (
    <div className="min-h-[100dvh] bg-[#F8F4EC] flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-[#1E2A3A] flex items-center justify-center">
            <Globe className="w-5 h-5 text-[#F2C94C]" />
          </div>
          <span className="text-[#1E2A3A] font-bold text-lg tracking-tight">Atlas Español</span>
        </div>

        {/* Progress dots */}
        {step !== 'welcome' && step !== 'done' && (
          <div className="flex items-center justify-center gap-1.5 mb-6">
            {STEPS.slice(1, -1).map((s, i) => (
              <div
                key={s}
                className={cn(
                  'rounded-full transition-all duration-300',
                  i < stepIdx - 1
                    ? 'w-2 h-2 bg-[#1E2A3A]'
                    : i === stepIdx - 1
                    ? 'w-5 h-2 bg-[#F2C94C]'
                    : 'w-2 h-2 bg-[#1E2A3A]/20'
                )}
              />
            ))}
          </div>
        )}

        {/* Step panel */}
        <div className="bg-white rounded-3xl shadow-[0_8px_48px_rgba(30,42,58,0.08)] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              className="p-8"
            >
              <StepContent
                step={step}
                data={data}
                update={update}
                onNext={next}
                onBack={back}
                onSubmit={submit}
                loading={loading}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

function StepContent({
  step, data, update, onNext, onBack, onSubmit, loading
}: {
  step: Step
  data: OnboardingData
  update: (patch: Partial<OnboardingData>) => void
  onNext: () => void
  onBack: () => void
  onSubmit: () => void
  loading: boolean
}) {
  switch (step) {
    case 'welcome':
      return (
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#1E2A3A] mb-3 tracking-tight">
            Bienvenido a Atlas
          </h1>
          <p className="text-[#6F4E37]/80 mb-8 leading-relaxed">
            Your personal Colombian Spanish fluency coach. We&apos;ll get you from zero to conversational — and beyond.
          </p>
          <Button size="lg" className="w-full" onClick={onNext}>
            Get started <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )

    case 'name':
      return (
        <div>
          <h2 className="text-xl font-bold text-[#1E2A3A] mb-1">What do we call you?</h2>
          <p className="text-sm text-[#6F4E37]/70 mb-6">Your coach will use this throughout the app.</p>
          <Input
            label="Your name"
            value={data.name}
            onChange={e => update({ name: e.target.value })}
            placeholder="e.g. Brandon"
            autoFocus
          />
          <div className="flex gap-3 mt-6">
            <Button variant="ghost" onClick={onBack} className="flex-1">
              <ChevronLeft className="w-4 h-4" /> Back
            </Button>
            <Button onClick={onNext} disabled={!data.name.trim()} className="flex-2">
              Continue <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )

    case 'level':
      return (
        <div>
          <h2 className="text-xl font-bold text-[#1E2A3A] mb-1">What&apos;s your Spanish like right now?</h2>
          <p className="text-sm text-[#6F4E37]/70 mb-5">Be honest — your coach adapts to where you actually are.</p>
          <div className="space-y-2">
            {LEVELS.map(l => (
              <button
                key={l.level}
                onClick={() => update({ currentLevel: l.level as SpanishLevel })}
                className={cn(
                  'w-full flex items-start gap-3 p-4 rounded-xl border text-left transition-all duration-150',
                  data.currentLevel === l.level
                    ? 'border-[#F2C94C] bg-[#F2C94C]/10'
                    : 'border-[#1E2A3A]/10 hover:border-[#1E2A3A]/25 bg-white'
                )}
              >
                <div className={cn(
                  'w-5 h-5 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center transition-all',
                  data.currentLevel === l.level ? 'border-[#F2C94C] bg-[#F2C94C]' : 'border-[#1E2A3A]/20'
                )}>
                  {data.currentLevel === l.level && <Check className="w-3 h-3 text-[#1E2A3A]" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#1E2A3A]">{l.label}</p>
                  <p className="text-xs text-[#6F4E37]/70">{l.description}</p>
                </div>
                <span className="ml-auto text-xs text-[#6F4E37]/50 shrink-0">{l.cefr}</span>
              </button>
            ))}
          </div>
          <div className="flex gap-3 mt-5">
            <Button variant="ghost" onClick={onBack} className="flex-1">
              <ChevronLeft className="w-4 h-4" /> Back
            </Button>
            <Button onClick={onNext} className="flex-2">
              Continue <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )

    case 'goals':
      return (
        <div>
          <h2 className="text-xl font-bold text-[#1E2A3A] mb-1">What&apos;s driving you to learn?</h2>
          <p className="text-sm text-[#6F4E37]/70 mb-5">Your coach tailors everything around this.</p>
          <div className="space-y-2">
            {LEARNING_GOALS.map(g => (
              <button
                key={g.value}
                onClick={() => update({ mainGoal: g.value as LearningGoal })}
                className={cn(
                  'w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all duration-150',
                  data.mainGoal === g.value
                    ? 'border-[#F2C94C] bg-[#F2C94C]/10'
                    : 'border-[#1E2A3A]/10 hover:border-[#1E2A3A]/25 bg-white'
                )}
              >
                <div className={cn(
                  'w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all',
                  data.mainGoal === g.value ? 'border-[#F2C94C] bg-[#F2C94C]' : 'border-[#1E2A3A]/20'
                )}>
                  {data.mainGoal === g.value && <Check className="w-3 h-3 text-[#1E2A3A]" />}
                </div>
                <p className="text-sm font-medium text-[#1E2A3A]">{g.label}</p>
              </button>
            ))}
          </div>
          <div className="flex gap-3 mt-5">
            <Button variant="ghost" onClick={onBack} className="flex-1">
              <ChevronLeft className="w-4 h-4" /> Back
            </Button>
            <Button onClick={onNext} className="flex-2">
              Continue <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )

    case 'focus':
      return (
        <div>
          <h2 className="text-xl font-bold text-[#1E2A3A] mb-1">Which Colombian accent appeals to you?</h2>
          <p className="text-sm text-[#6F4E37]/70 mb-5">You&apos;ll learn general Colombian Spanish either way — this just flavours it.</p>
          <div className="space-y-2">
            {COLOMBIAN_FOCUS_OPTIONS.map(f => (
              <button
                key={f.value}
                onClick={() => update({ colombianFocus: f.value as ColombianFocus })}
                className={cn(
                  'w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all duration-150',
                  data.colombianFocus === f.value
                    ? 'border-[#F2C94C] bg-[#F2C94C]/10'
                    : 'border-[#1E2A3A]/10 hover:border-[#1E2A3A]/25 bg-white'
                )}
              >
                <div className={cn(
                  'w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all',
                  data.colombianFocus === f.value ? 'border-[#F2C94C] bg-[#F2C94C]' : 'border-[#1E2A3A]/20'
                )}>
                  {data.colombianFocus === f.value && <Check className="w-3 h-3 text-[#1E2A3A]" />}
                </div>
                <p className="text-sm font-medium text-[#1E2A3A]">{f.label}</p>
              </button>
            ))}
          </div>
          <div className="flex gap-3 mt-5">
            <Button variant="ghost" onClick={onBack} className="flex-1">
              <ChevronLeft className="w-4 h-4" /> Back
            </Button>
            <Button onClick={onNext} className="flex-2">
              Continue <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )

    case 'commitment':
      return (
        <div>
          <h2 className="text-xl font-bold text-[#1E2A3A] mb-1">How much time can you give it daily?</h2>
          <p className="text-sm text-[#6F4E37]/70 mb-5">Even 10 minutes a day stacks up fast.</p>
          <div className="grid grid-cols-4 gap-2 mb-6">
            {DAILY_MINUTES_OPTIONS.map(m => (
              <button
                key={m}
                onClick={() => update({ dailyMinutes: m })}
                className={cn(
                  'py-3 rounded-xl text-sm font-medium border transition-all',
                  data.dailyMinutes === m
                    ? 'border-[#F2C94C] bg-[#F2C94C]/10 text-[#1E2A3A]'
                    : 'border-[#1E2A3A]/10 text-[#6F4E37]/70 hover:border-[#1E2A3A]/25'
                )}
              >
                {m}m
              </button>
            ))}
          </div>
          <p className="text-sm font-medium text-[#1E2A3A] mb-3">Learning intensity</p>
          <div className="grid grid-cols-3 gap-2">
            {(['casual', 'steady', 'intensive'] as LearningIntensity[]).map(i => (
              <button
                key={i}
                onClick={() => update({ learningIntensity: i })}
                className={cn(
                  'py-3 rounded-xl text-sm font-medium border transition-all capitalize',
                  data.learningIntensity === i
                    ? 'border-[#F2C94C] bg-[#F2C94C]/10 text-[#1E2A3A]'
                    : 'border-[#1E2A3A]/10 text-[#6F4E37]/70 hover:border-[#1E2A3A]/25'
                )}
              >
                {i}
              </button>
            ))}
          </div>
          <div className="flex gap-3 mt-6">
            <Button variant="ghost" onClick={onBack} className="flex-1">
              <ChevronLeft className="w-4 h-4" /> Back
            </Button>
            <Button onClick={onNext} className="flex-2">
              Continue <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )

    case 'interests':
      return (
        <div>
          <h2 className="text-xl font-bold text-[#1E2A3A] mb-1">What situations matter most to you?</h2>
          <p className="text-sm text-[#6F4E37]/70 mb-5">Tick all that apply — your role plays will be built around these.</p>
          <div className="space-y-2">
            {[
              { key: 'salesInterest', label: 'Sales and business Spanish', emoji: '💼' },
              { key: 'relationshipInterest', label: 'Dating and relationships', emoji: '❤️' },
              { key: 'travelInterest', label: 'Travel and daily life', emoji: '✈️' },
              { key: 'businessInterest', label: 'Professional and corporate', emoji: '🏢' },
            ].map(({ key, label, emoji }) => {
              const checked = data[key as keyof OnboardingData] as boolean
              return (
                <button
                  key={key}
                  onClick={() => update({ [key]: !checked })}
                  className={cn(
                    'w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all duration-150',
                    checked
                      ? 'border-[#F2C94C] bg-[#F2C94C]/10'
                      : 'border-[#1E2A3A]/10 hover:border-[#1E2A3A]/25 bg-white'
                  )}
                >
                  <span className="text-lg">{emoji}</span>
                  <p className="text-sm font-medium text-[#1E2A3A] flex-1">{label}</p>
                  <div className={cn(
                    'w-5 h-5 rounded border-2 shrink-0 flex items-center justify-center transition-all',
                    checked ? 'border-[#F2C94C] bg-[#F2C94C]' : 'border-[#1E2A3A]/20'
                  )}>
                    {checked && <Check className="w-3 h-3 text-[#1E2A3A]" />}
                  </div>
                </button>
              )
            })}
          </div>
          <div className="flex gap-3 mt-6">
            <Button variant="ghost" onClick={onBack} className="flex-1">
              <ChevronLeft className="w-4 h-4" /> Back
            </Button>
            <Button onClick={onSubmit} loading={loading} className="flex-2">
              Build my plan <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )

    case 'done':
      return (
        <div className="text-center">
          <div className="w-16 h-16 bg-[#F2C94C]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-[#F2C94C]" />
          </div>
          <h2 className="text-2xl font-bold text-[#1E2A3A] mb-2">Plan ready, {data.name}!</h2>
          <p className="text-[#6F4E37]/70 text-sm">Your first lesson is waiting.</p>
        </div>
      )

    default:
      return null
  }
}
