import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { severityColor } from '@/lib/utils'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { CheckCircle, ChevronRight, AlertTriangle, XCircle } from 'lucide-react'
import type { Correction, CorrectionSeverity } from '@/types'

const CATEGORY_LABELS: Record<string, string> = {
  vocabulary: 'Vocabulary',
  word_order: 'Word order',
  verb_tense: 'Verb tense',
  pronunciation: 'Pronunciation',
  gender: 'Gender',
  articles: 'Articles',
  ser_estar: 'Ser / Estar',
  por_para: 'Por / Para',
  formality: 'Formality',
  tone: 'Tone',
  cultural_nuance: 'Cultural nuance',
}

function SeverityIcon({ severity }: { severity: CorrectionSeverity }) {
  if (severity === 'green') return <CheckCircle className="w-4 h-4 text-emerald-600" />
  if (severity === 'yellow') return <AlertTriangle className="w-4 h-4 text-amber-600" />
  return <XCircle className="w-4 h-4 text-red-600" />
}

function severityBadge(severity: CorrectionSeverity): 'success' | 'gold' | 'default' {
  if (severity === 'green') return 'success'
  if (severity === 'yellow') return 'gold'
  return 'default'
}

export default async function CorrectionsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: corrections } = await supabase
    .from('corrections')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(100)

  const items: Correction[] = corrections ?? []

  // Stats
  const redCount = items.filter(c => c.severity === 'red').length
  const yellowCount = items.filter(c => c.severity === 'yellow').length

  // Top recurring categories
  const categoryCounts = items.reduce<Record<string, number>>((acc, c) => {
    acc[c.category] = (acc[c.category] ?? 0) + 1
    return acc
  }, {})
  const topCategories = Object.entries(categoryCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1E2A3A] tracking-tight">Corrections</h1>
        <p className="text-sm text-[#6F4E37]/60 mt-0.5">Your mistake history and patterns</p>
      </div>

      {items.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 py-16 text-center">
          <CheckCircle className="w-8 h-8 text-[#27AE60]" />
          <h2 className="font-semibold text-[#1E2A3A]">No corrections yet</h2>
          <p className="text-sm text-[#6F4E37]/70">
            Practice in lessons or with the coach — your corrections will appear here.
          </p>
          <div className="flex gap-2">
            <Link href="/lesson">
              <Button>Start a lesson <ChevronRight className="w-4 h-4" /></Button>
            </Link>
            <Link href="/coach">
              <Button variant="ghost">Chat with coach</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <>
          {/* Summary */}
          <div className="grid grid-cols-3 gap-3">
            <Card className="text-center py-3">
              <p className="text-2xl font-bold text-[#1E2A3A]">{items.length}</p>
              <p className="text-xs text-[#6F4E37]/60">Total</p>
            </Card>
            <Card className="text-center py-3">
              <p className="text-2xl font-bold text-amber-600">{yellowCount}</p>
              <p className="text-xs text-[#6F4E37]/60">Awkward</p>
            </Card>
            <Card className="text-center py-3">
              <p className="text-2xl font-bold text-red-600">{redCount}</p>
              <p className="text-xs text-[#6F4E37]/60">Incorrect</p>
            </Card>
          </div>

          {/* Top patterns */}
          {topCategories.length > 0 && (
            <Card>
              <h2 className="text-sm font-semibold text-[#1E2A3A] mb-3">Your patterns</h2>
              <div className="space-y-2">
                {topCategories.map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-sm text-[#6F4E37]/80">
                      {CATEGORY_LABELS[category] ?? category}
                    </span>
                    <Badge variant="default">{count}</Badge>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Corrections list */}
          <div className="space-y-3">
            {items.map((correction) => (
              <Card key={correction.id} className={`border ${severityColor(correction.severity)}`}>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">
                    <SeverityIcon severity={correction.severity} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Badge variant={severityBadge(correction.severity)}>
                        {correction.severity === 'green' ? 'Correct' :
                         correction.severity === 'yellow' ? 'Awkward' : 'Incorrect'}
                      </Badge>
                      <Badge variant="default">
                        {CATEGORY_LABELS[correction.category] ?? correction.category}
                      </Badge>
                      <span className="text-xs opacity-50 ml-auto">
                        {new Date(correction.created_at).toLocaleDateString('en-AU', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                    </div>

                    {/* Original */}
                    <div className="mb-2">
                      <p className="text-xs font-medium opacity-60 mb-0.5">You wrote</p>
                      <p className="text-sm">{correction.original_text}</p>
                    </div>

                    {/* Corrected */}
                    {correction.corrected_text !== correction.original_text && (
                      <div className="mb-2">
                        <p className="text-xs font-medium opacity-60 mb-0.5">Corrected</p>
                        <p className="text-sm font-medium">{correction.corrected_text}</p>
                      </div>
                    )}

                    {/* Natural Colombian */}
                    {correction.natural_colombian_text &&
                      correction.natural_colombian_text !== correction.corrected_text && (
                      <div className="mb-2">
                        <p className="text-xs font-medium opacity-60 mb-0.5">Colombian natural</p>
                        <p className="text-sm font-medium">{correction.natural_colombian_text}</p>
                      </div>
                    )}

                    {/* Explanation */}
                    {correction.explanation && (
                      <p className="text-xs opacity-70 mt-1">{correction.explanation}</p>
                    )}

                    {/* Practice */}
                    {correction.practice_sentence && (
                      <div className="mt-2 bg-white/40 rounded-lg px-3 py-2">
                        <p className="text-xs font-medium opacity-60 mb-0.5">Practice sentence</p>
                        <p className="text-xs italic">{correction.practice_sentence}</p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
