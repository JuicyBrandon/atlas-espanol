'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { SESSIONS_PER_REVIEW } from '@/lib/progress'
import type { WeeklyReview } from '@/types'
import { Sparkles, AlertTriangle, BookMarked, Target } from 'lucide-react'

interface Props {
  latestReview: WeeklyReview | null
  sessionsThisPeriod: number
}

export default function WeeklyReviewCard({ latestReview, sessionsThisPeriod }: Props) {
  const router = useRouter()
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const eligible = sessionsThisPeriod >= SESSIONS_PER_REVIEW

  const handleGenerate = async () => {
    setGenerating(true)
    setError(null)
    try {
      const res = await fetch('/api/weekly-review', { method: 'POST' })
      if (res.ok) {
        router.refresh()
      } else {
        const data = await res.json().catch(() => null)
        setError(data?.error ?? 'Could not generate the review. Try again.')
      }
    } catch {
      setError('Could not generate the review. Try again.')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#F2C94C]" />
          <h2 className="text-sm font-semibold text-[#1E2A3A]">Weekly review</h2>
        </div>
        {latestReview && (
          <span className="text-xs text-[#6F4E37]/50">
            {new Date(latestReview.created_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}
          </span>
        )}
      </div>

      {latestReview ? (
        <div className="space-y-4">
          <p className="text-sm text-[#6F4E37]/85 leading-relaxed">{latestReview.summary}</p>

          <div className="grid sm:grid-cols-2 gap-3">
            {latestReview.top_errors.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <p className="text-xs font-semibold text-amber-800">Top recurring errors</p>
                </div>
                <ul className="space-y-1">
                  {latestReview.top_errors.map((e, i) => (
                    <li key={i} className="text-xs text-amber-900/80">{e}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="bg-[#27AE60]/8 border border-[#27AE60]/20 rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <BookMarked className="w-3.5 h-3.5 text-[#27AE60]" />
                <p className="text-xs font-semibold text-[#1E7A43]">Vocabulary</p>
              </div>
              <p className="text-xs text-[#1E2A3A]/70">
                {latestReview.new_words_mastered} word{latestReview.new_words_mastered === 1 ? '' : 's'} mastered
              </p>
              {latestReview.weak_words.length > 0 && (
                <p className="text-xs text-[#1E2A3A]/60 mt-1">
                  Still weak: {latestReview.weak_words.slice(0, 4).join(', ')}
                  {latestReview.weak_words.length > 4 && '…'}
                </p>
              )}
            </div>
          </div>

          <div className="bg-[#4A90E2]/5 border border-[#4A90E2]/20 rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Target className="w-3.5 h-3.5 text-[#4A90E2]" />
              <p className="text-xs font-semibold text-[#2B6CB0]">Next week&apos;s focus</p>
            </div>
            <p className="text-xs text-[#1E2A3A]/75 leading-relaxed">{latestReview.next_focus}</p>
          </div>
        </div>
      ) : (
        <p className="text-sm text-[#6F4E37]/70 mb-1">
          Complete {SESSIONS_PER_REVIEW} sessions (lessons or role plays) to unlock your first weekly review.
        </p>
      )}

      <div className="mt-4 pt-4 border-t border-[#1E2A3A]/8 flex items-center justify-between gap-3">
        <Badge variant={eligible ? 'gold' : 'default'}>
          {Math.min(sessionsThisPeriod, SESSIONS_PER_REVIEW)} / {SESSIONS_PER_REVIEW} sessions
          {latestReview ? ' since last review' : ''}
        </Badge>
        <Button
          size="sm"
          onClick={handleGenerate}
          loading={generating}
          disabled={!eligible}
        >
          <Sparkles className="w-3.5 h-3.5" />
          {latestReview ? 'Generate new review' : 'Generate review'}
        </Button>
      </div>
      {error && <p className="text-xs text-[#EB5757] mt-2">{error}</p>}
    </Card>
  )
}
