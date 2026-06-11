import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { StatsGrid, TodayCard } from '@/components/dashboard/StatsGrid'
import { levelToLabel, levelToCEFR, calculateStreak } from '@/lib/utils'
import { ArrowRight, MessageCircle, Play, BookMarked, Zap } from 'lucide-react'
import type { DashboardStats, Lesson, SpanishLevel } from '@/types'

const QUICK_ACTIONS = [
  { href: '/coach', icon: MessageCircle, label: 'Chat with Coach', color: 'text-[#4A90E2]', bg: 'bg-[#4A90E2]/10' },
  { href: '/roleplays', icon: Play, label: 'Role Play', color: 'text-[#27AE60]', bg: 'bg-[#27AE60]/10' },
  { href: '/vocabulary', icon: BookMarked, label: 'Review Words', color: 'text-[#F2994A]', bg: 'bg-[#F2994A]/10' },
  { href: '/lesson', icon: Zap, label: 'Quick Lesson', color: 'text-[#F2C94C]', bg: 'bg-[#F2C94C]/10' },
]

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const name = user.user_metadata?.name ?? 'there'

  // Parallel queries
  const [
    { data: userData },
    { count: vocabCount },
    { count: dueCount },
    { count: lessonsCount },
    { data: completedLessonDates },
    { data: recentMistakes },
  ] = await Promise.all([
    supabase.from('users').select('current_level, main_goal, name').eq('id', user.id).single(),
    supabase.from('vocabulary_items').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
    supabase
      .from('vocabulary_items')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .lte('review_due_at', new Date().toISOString())
      .neq('status', 'mastered'),
    supabase
      .from('user_lessons')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('status', 'completed'),
    supabase
      .from('user_lessons')
      .select('completed_at')
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .not('completed_at', 'is', null),
    supabase
      .from('corrections')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(3),
  ])

  const currentLevel = (userData?.current_level ?? 1) as SpanishLevel
  const displayName = userData?.name || name

  const streak = calculateStreak(
    completedLessonDates
      ?.map(l => l.completed_at)
      .filter((d): d is string => !!d) ?? []
  )

  // Find today's lesson (next uncompleted at user's level)
  let todaysLesson: Lesson | null = null
  const { data: levelLessons } = await supabase
    .from('lessons')
    .select('*')
    .eq('level', currentLevel)
    .order('sort_order')

  if (levelLessons?.length) {
    const completedIds = new Set(
      completedLessonDates
        ?.map(l => l as { completed_at: string | null })
        .map(() => '') ?? []
    )

    // Get completed lesson IDs
    const { data: completedUserLessons } = await supabase
      .from('user_lessons')
      .select('lesson_id')
      .eq('user_id', user.id)
      .eq('status', 'completed')

    const doneIds = new Set(completedUserLessons?.map(ul => ul.lesson_id) ?? [])
    todaysLesson = levelLessons.find(l => !doneIds.has(l.id)) ?? levelLessons[0]
    void completedIds
  }

  const weeklyProgress = lessonsCount
    ? Math.min(Math.round((lessonsCount / 5) * 100), 100)
    : 0

  const stats: DashboardStats = {
    currentLevel,
    cefrEstimate: levelToCEFR(currentLevel),
    streak,
    vocabularyCount: vocabCount ?? 0,
    lessonsCompleted: lessonsCount ?? 0,
    weeklyProgress,
    todaysLesson,
    dueForReview: dueCount ?? 0,
    recentMistakes: recentMistakes ?? [],
  }

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Buenos días'
    if (h < 18) return 'Buenas tardes'
    return 'Buenas noches'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[#6F4E37]/60 font-medium">{greeting()},</p>
          <h1 className="text-2xl font-bold text-[#1E2A3A] tracking-tight">{displayName}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="navy">{levelToLabel(stats.currentLevel)}</Badge>
            <Badge variant="gold">{levelToCEFR(stats.currentLevel)}</Badge>
          </div>
        </div>
        <Link
          href="/lesson"
          className="inline-flex items-center gap-2 bg-[#1E2A3A] text-[#F8F4EC] px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#2a3a50] transition-all active:scale-[0.98]"
        >
          Start lesson <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Stats */}
      <StatsGrid stats={stats} />

      {/* Today's lesson + review */}
      <TodayCard
        lesson={stats.todaysLesson}
        dueForReview={stats.dueForReview}
        weeklyProgress={stats.weeklyProgress}
      />

      {/* Quick actions */}
      <div>
        <h2 className="text-sm font-semibold text-[#1E2A3A]/50 uppercase tracking-wide mb-3">Quick actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {QUICK_ACTIONS.map(({ href, icon: Icon, label, color, bg }) => (
            <Link
              key={href}
              href={href}
              className="bg-white rounded-2xl border border-[#1E2A3A]/8 p-4 flex flex-col items-center gap-2 hover:shadow-md hover:-translate-y-[1px] transition-all duration-200"
            >
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <span className="text-xs font-medium text-[#1E2A3A]/70 text-center">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Level progress */}
      <Card>
        <h2 className="text-sm font-semibold text-[#1E2A3A] mb-4">Level progress</h2>
        <div className="space-y-3">
          {([1, 2, 3, 4, 5, 6] as SpanishLevel[]).map(lvl => (
            <div key={lvl} className="flex items-center gap-3">
              <span className="text-xs text-[#1E2A3A]/40 w-4">{lvl}</span>
              <ProgressBar
                value={lvl === stats.currentLevel ? stats.weeklyProgress : lvl < stats.currentLevel ? 100 : 0}
                color={lvl < stats.currentLevel ? 'green' : lvl === stats.currentLevel ? 'gold' : 'blue'}
                className="flex-1"
              />
              <span className="text-xs text-[#6F4E37]/50 w-20 text-right truncate">
                {levelToLabel(lvl)}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent mistakes */}
      {stats.recentMistakes.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-[#1E2A3A]">Recent corrections</h2>
            <Link href="/corrections" className="text-xs text-[#4A90E2] hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-2">
            {stats.recentMistakes.map(c => (
              <div key={c.id} className="flex items-start gap-2 py-2 border-b border-[#1E2A3A]/5 last:border-0">
                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                  c.severity === 'green' ? 'bg-emerald-500' :
                  c.severity === 'yellow' ? 'bg-amber-500' : 'bg-red-500'
                }`} />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-[#1E2A3A] truncate">{c.original_text}</p>
                  {c.corrected_text !== c.original_text && (
                    <p className="text-xs text-[#6F4E37]/60 truncate">→ {c.corrected_text}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
