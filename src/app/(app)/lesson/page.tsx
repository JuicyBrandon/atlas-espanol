'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { CheckCircle, ChevronRight, BookOpen, Volume2 } from 'lucide-react'

const MOCK_LESSON = {
  title: 'Hola Colombia — Your First Words',
  goal: 'Greet people and introduce yourself in Colombian Colombian Spanish',
  module: 'Greetings and Introductions',
  level: 1,
  vocabulary: [
    { spanish: 'Hola', english: 'Hello', colombian: 'Quiubo / Qué hubo', note: 'Super common in Colombia' },
    { spanish: 'Buenos días', english: 'Good morning', colombian: 'Buenos días', note: 'Used until midday' },
    { spanish: 'Buenas tardes', english: 'Good afternoon', colombian: 'Buenas tardes', note: 'After noon' },
    { spanish: 'Me llamo…', english: 'My name is…', colombian: 'Me llamo / Soy…', note: 'Both work' },
    { spanish: 'Mucho gusto', english: 'Nice to meet you', colombian: 'Mucho gusto / Un placer', note: 'Standard greeting' },
    { spanish: '¿Cómo está usted?', english: 'How are you? (formal)', colombian: '¿Cómo estás? (casual)', note: 'Colombians use usted more than most' },
  ],
  phrase: 'Quiubo, ¿cómo estás?',
  phraseTranslation: 'Hey, how are you? (Colombian casual)',
  explanation: 'Colombians say "quiubo" (shortened from "¿qué hubo?") constantly. It\'s the most natural casual greeting you\'ll hear — more common than "hola" in everyday speech.',
  task: 'Introduce yourself to your coach in Spanish. Tell them your name, where you\'re from, and why you\'re learning Spanish.',
}

type LessonStep = 'intro' | 'vocabulary' | 'phrase' | 'practice' | 'complete'

export default function LessonPage() {
  const [step, setStep] = useState<LessonStep>('intro')
  const [savedWords, setSavedWords] = useState<Set<number>>(new Set())

  const saveWord = (idx: number) => {
    setSavedWords(prev => new Set([...prev, idx]))
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="navy">Level {MOCK_LESSON.level}</Badge>
            <Badge variant="default">{MOCK_LESSON.module}</Badge>
          </div>
          <h1 className="text-xl font-bold text-[#1E2A3A] tracking-tight">{MOCK_LESSON.title}</h1>
          <p className="text-sm text-[#6F4E37]/70 mt-0.5">{MOCK_LESSON.goal}</p>
        </div>
      </div>

      {/* Steps nav */}
      <div className="flex gap-1.5">
        {(['intro', 'vocabulary', 'phrase', 'practice', 'complete'] as LessonStep[]).map((s, i) => (
          <div
            key={s}
            className={`flex-1 h-1.5 rounded-full transition-all ${
              s === step ? 'bg-[#F2C94C]' :
              (['intro', 'vocabulary', 'phrase', 'practice', 'complete'] as LessonStep[]).indexOf(step) > i
                ? 'bg-[#27AE60]' : 'bg-[#1E2A3A]/10'
            }`}
          />
        ))}
      </div>

      {step === 'intro' && (
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-[#4A90E2]" />
            <h2 className="font-semibold text-[#1E2A3A]">What you'll learn</h2>
          </div>
          <p className="text-sm text-[#6F4E37]/80 leading-relaxed mb-6">{MOCK_LESSON.explanation}</p>
          <div className="bg-[#F2C94C]/10 rounded-xl p-4 mb-6 border border-[#F2C94C]/30">
            <p className="text-xs text-[#6F4E37]/60 mb-1 font-medium uppercase tracking-wide">Key phrase</p>
            <p className="text-lg font-bold text-[#1E2A3A]">{MOCK_LESSON.phrase}</p>
            <p className="text-sm text-[#6F4E37]/70 mt-0.5">{MOCK_LESSON.phraseTranslation}</p>
          </div>
          <Button className="w-full" onClick={() => setStep('vocabulary')}>
            Start lesson <ChevronRight className="w-4 h-4" />
          </Button>
        </Card>
      )}

      {step === 'vocabulary' && (
        <div className="space-y-4">
          <h2 className="font-semibold text-[#1E2A3A]">Today's vocabulary ({MOCK_LESSON.vocabulary.length} words)</h2>
          {MOCK_LESSON.vocabulary.map((v, i) => (
            <Card key={i} className="group">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-[#1E2A3A]">{v.spanish}</p>
                    <button className="text-[#1E2A3A]/30 hover:text-[#4A90E2] transition-colors">
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-sm text-[#6F4E37]/70">{v.english}</p>
                  {v.colombian !== v.spanish && (
                    <p className="text-xs text-[#4A90E2] mt-1">Colombian: <span className="font-medium">{v.colombian}</span></p>
                  )}
                  {v.note && <p className="text-xs text-[#F2994A]/80 mt-1 italic">{v.note}</p>}
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

      {step === 'phrase' && (
        <Card>
          <h2 className="font-semibold text-[#1E2A3A] mb-4">Key phrase practice</h2>
          <div className="bg-[#1E2A3A] rounded-2xl p-6 mb-6 text-center">
            <p className="text-[#F2C94C] text-xs font-medium uppercase tracking-wide mb-2">Say this naturally</p>
            <p className="text-2xl font-bold text-white">{MOCK_LESSON.phrase}</p>
            <p className="text-white/60 text-sm mt-1">{MOCK_LESSON.phraseTranslation}</p>
          </div>
          <p className="text-sm text-[#6F4E37]/70 leading-relaxed mb-6">{MOCK_LESSON.explanation}</p>
          <Button className="w-full" onClick={() => setStep('practice')}>
            Practice with coach <ChevronRight className="w-4 h-4" />
          </Button>
        </Card>
      )}

      {step === 'practice' && (
        <Card>
          <h2 className="font-semibold text-[#1E2A3A] mb-2">Speaking task</h2>
          <p className="text-sm text-[#6F4E37]/70 mb-6 leading-relaxed">{MOCK_LESSON.task}</p>
          <div className="bg-[#F8F4EC] rounded-xl p-4 mb-4 border border-[#1E2A3A]/8">
            <textarea
              rows={4}
              className="w-full bg-transparent text-sm text-[#1E2A3A] placeholder:text-[#1E2A3A]/35 outline-none resize-none"
              placeholder="Write your response in Spanish here…"
            />
          </div>
          <Button className="w-full" onClick={() => setStep('complete')}>
            Complete lesson <CheckCircle className="w-4 h-4" />
          </Button>
        </Card>
      )}

      {step === 'complete' && (
        <Card variant="navy" className="text-center">
          <div className="w-14 h-14 bg-[#F2C94C]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-7 h-7 text-[#F2C94C]" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Lección completa!</h2>
          <p className="text-white/60 text-sm mb-6">You've completed your first Colombian Spanish lesson. Keep the streak going.</p>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: 'Words learned', value: MOCK_LESSON.vocabulary.length },
              { label: 'Streak', value: '1 day' },
              { label: 'Level', value: '1' },
            ].map(s => (
              <div key={s.label} className="bg-white/10 rounded-xl p-3">
                <p className="text-[#F2C94C] font-bold text-lg">{s.value}</p>
                <p className="text-white/50 text-xs">{s.label}</p>
              </div>
            ))}
          </div>
          <Button variant="secondary" size="lg" className="w-full" onClick={() => setStep('intro')}>
            Next lesson
          </Button>
        </Card>
      )}
    </div>
  )
}
