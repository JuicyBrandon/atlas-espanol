import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import VocabularyReview from '@/components/vocabulary/VocabularyReview'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { BookMarked, ChevronRight } from 'lucide-react'
import type { VocabularyItem, VocabularyStatus } from '@/types'

const STATUS_ORDER: VocabularyStatus[] = ['new', 'learning', 'weak', 'strong', 'mastered']

export default async function VocabularyPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Get all vocabulary items
  const { data: allItems } = await supabase
    .from('vocabulary_items')
    .select('*')
    .eq('user_id', user.id)
    .order('review_due_at')

  const items: VocabularyItem[] = allItems ?? []
  const now = new Date()

  // Items due for review (due now and not mastered)
  const dueItems = items.filter(
    item =>
      new Date(item.review_due_at) <= now &&
      item.status !== 'mastered'
  )

  // Stats by status
  const statusCounts = STATUS_ORDER.reduce<Record<string, number>>((acc, s) => {
    acc[s] = items.filter(i => i.status === s).length
    return acc
  }, {})

  const masteredCount = statusCounts.mastered ?? 0
  const total = items.length

  if (total === 0) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1E2A3A] tracking-tight">Vocabulary</h1>
          <p className="text-sm text-[#6F4E37]/60 mt-0.5">Your personal word bank</p>
        </div>
        <Card className="flex flex-col items-center gap-3 py-16 text-center">
          <BookMarked className="w-8 h-8 text-[#F2C94C]" />
          <h2 className="font-semibold text-[#1E2A3A]">Your vocabulary bank is empty</h2>
          <p className="text-sm text-[#6F4E37]/70">Complete a lesson to add words here for spaced review.</p>
          <Link href="/lesson">
            <Button>Start a lesson <ChevronRight className="w-4 h-4" /></Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1E2A3A] tracking-tight">Vocabulary</h1>
        <p className="text-sm text-[#6F4E37]/60 mt-0.5">{total} words in your bank</p>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {STATUS_ORDER.map(s => (
          <Card key={s} className="text-center py-3">
            <p className="text-xl font-bold text-[#1E2A3A]">{statusCounts[s] ?? 0}</p>
            <p className="text-xs text-[#6F4E37]/60 capitalize">{s}</p>
          </Card>
        ))}
      </div>

      {/* Mastery progress */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-[#1E2A3A]">Overall progress</h2>
          <span className="text-sm text-[#6F4E37]/60">
            {total > 0 ? Math.round((masteredCount / total) * 100) : 0}% mastered
          </span>
        </div>
        <ProgressBar
          value={total > 0 ? (masteredCount / total) * 100 : 0}
          color="green"
          label={`${masteredCount} of ${total} mastered`}
        />
        <div className="flex gap-2 mt-3 flex-wrap">
          {dueItems.length > 0 && (
            <Badge variant="gold">{dueItems.length} due for review</Badge>
          )}
          <Badge variant="default">{total} total words</Badge>
        </div>
      </Card>

      {/* Review section */}
      {dueItems.length > 0 ? (
        <div>
          <h2 className="text-sm font-semibold text-[#1E2A3A]/50 uppercase tracking-wide mb-3">
            Due for review ({dueItems.length})
          </h2>
          <VocabularyReview items={dueItems} />
        </div>
      ) : (
        <Card className="flex flex-col items-center gap-3 py-10 text-center">
          <div className="w-10 h-10 bg-[#27AE60]/15 rounded-xl flex items-center justify-center">
            <BookMarked className="w-5 h-5 text-[#27AE60]" />
          </div>
          <h2 className="font-semibold text-[#1E2A3A]">All caught up!</h2>
          <p className="text-sm text-[#6F4E37]/70">No words due right now. Come back later or complete a lesson to add more.</p>
          <Link href="/lesson">
            <Button variant="ghost">Start a lesson <ChevronRight className="w-4 h-4" /></Button>
          </Link>
        </Card>
      )}

      {/* All words list */}
      {total > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-[#1E2A3A]/50 uppercase tracking-wide mb-3">All words</h2>
          <div className="space-y-2">
            {items.slice(0, 50).map(item => (
              <Card key={item.id} className="py-3 px-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-[#1E2A3A] truncate">{item.spanish}</p>
                      {item.natural_colombian && item.natural_colombian !== item.spanish && (
                        <span className="text-xs text-[#4A90E2] shrink-0">({item.natural_colombian})</span>
                      )}
                    </div>
                    <p className="text-sm text-[#6F4E37]/70 truncate">{item.english}</p>
                  </div>
                  <Badge
                    variant={
                      item.status === 'mastered' ? 'success' :
                      item.status === 'strong' ? 'success' :
                      item.status === 'learning' ? 'gold' : 'default'
                    }
                  >
                    {item.status}
                  </Badge>
                </div>
              </Card>
            ))}
            {items.length > 50 && (
              <p className="text-xs text-center text-[#6F4E37]/50 pt-2">
                Showing 50 of {items.length} words
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
