'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { levelToLabel } from '@/lib/utils'
import { Trophy, Wand2, BookMarked, Play } from 'lucide-react'
import type { SpanishLevel } from '@/types'

export default function AllLessonsDone({ userLevel }: { userLevel: number }) {
  const router = useRouter()
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generate = async () => {
    setGenerating(true)
    setError(null)
    try {
      const res = await fetch('/api/lesson/generate', { method: 'POST' })
      if (!res.ok) throw new Error('Generation failed')
      const { lessonId } = await res.json()
      router.push(`/lesson?id=${lessonId}`)
    } catch {
      setError('Could not generate a lesson right now. Try again.')
      setGenerating(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <Card className="bg-[#1E2A3A]" variant="navy">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-[#F2C94C]/20 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-[#F2C94C]" />
          </div>
          <div>
            <p className="text-[#F2C94C] text-xs font-medium uppercase tracking-wide">Level {userLevel} complete</p>
            <p className="text-white font-bold text-xl">{levelToLabel(userLevel as SpanishLevel)}</p>
          </div>
        </div>
        <p className="text-white/60 text-sm leading-relaxed">
          You&apos;ve finished all {levelToLabel(userLevel as SpanishLevel)} lessons. Keep practising to advance to the next level.
        </p>
      </Card>

      <Card>
        <h2 className="text-sm font-semibold text-[#1E2A3A] mb-1">Generate a custom lesson</h2>
        <p className="text-xs text-[#6F4E37]/60 mb-4 leading-relaxed">
          Atlas will create a lesson tailored to your goals, career context, and recent corrections — no two are the same.
        </p>
        {error && <p className="text-xs text-[#EB5757] mb-3">{error}</p>}
        <Button onClick={generate} loading={generating} size="lg" className="w-full gap-2">
          <Wand2 className="w-4 h-4" />
          {generating ? 'Generating your lesson…' : 'Generate custom lesson'}
        </Button>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/vocabulary"
          className="bg-white rounded-2xl border border-[#1E2A3A]/8 p-4 flex flex-col items-center gap-2 hover:shadow-md hover:-translate-y-[1px] transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-[#F2994A]/10 flex items-center justify-center">
            <BookMarked className="w-5 h-5 text-[#F2994A]" />
          </div>
          <span className="text-xs font-medium text-[#1E2A3A]/70 text-center">Review vocabulary</span>
        </Link>
        <Link
          href="/roleplays"
          className="bg-white rounded-2xl border border-[#1E2A3A]/8 p-4 flex flex-col items-center gap-2 hover:shadow-md hover:-translate-y-[1px] transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-[#27AE60]/10 flex items-center justify-center">
            <Play className="w-5 h-5 text-[#27AE60]" />
          </div>
          <span className="text-xs font-medium text-[#1E2A3A]/70 text-center">Practice with role plays</span>
        </Link>
      </div>
    </div>
  )
}
