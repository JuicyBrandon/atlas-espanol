import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import WeeklyReviewCard from '@/components/progress/WeeklyReviewCard'
import WeeklyActivityChart from '@/components/progress/WeeklyActivityChart'
import {
  computeSkillScores,
  computeCefrEstimate,
  computeRecommendation,
  computeNextMilestone,
  sessionsSince,
  withinDays,
} from '@/lib/progress'
import { computeAchievements, ACHIEVEMENT_CATEGORY_LABELS } from '@/lib/achievements'
import type { AchievementCategory } from '@/lib/achievements'
import { calculateStreak, levelToLabel, cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Flag, ArrowRight, Flame, BookOpen, Play, BookMarked, Trophy, Lock } from 'lucide-react'
import type { SpanishLevel, WeeklyReview } from '@/types'

const SKILL_LABELS: Array<{ key: keyof ReturnType<typeof computeSkillScores>; label: string }> = [
  { key: 'speaking', label: 'Speaking' },
  { key: 'listening', label: 'Listening' },
  { key: 'grammar', label: 'Grammar accuracy' },
  { key: 'business', label: 'Business Spanish' },
  { key: 'culture', label: 'Colombian culture' },
  { key: 'confidence', label: 'Confidence' },
]

export default async function ProgressPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const [
    { data: userData },
    { data: vocabItems },
    { data: corrections },
    { data: rolePlays },
    { data: completedLessons },
    { data: latestReview },
    { count: dueCount },
    { data: allLessonsIndex },
    { count: voiceNotesCount },
  ] = await Promise.all([
    supabase.from('users').select('current_level, name').eq('id', user.id).single(),
    supabase
      .from('vocabulary_items')
      .select('spanish, status, times_seen, times_correct')
      .eq('user_id', user.id),
    supabase
      .from('corrections')
      .select('severity, category, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(200),
    supabase
      .from('role_play_sessions')
      .select('mode, score, created_at')
      .eq('user_id', user.id),
    supabase
      .from('user_lessons')
      .select('lesson_id, completed_at')
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .not('completed_at', 'is', null),
    supabase
      .from('weekly_reviews')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('vocabulary_items')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .lte('review_due_at', new Date().toISOString())
      .neq('status', 'mastered'),
    // Curriculum index is small (~72 rows); fetching it inside the batch
    // avoids a second sequential round trip that would need userLevel first
    supabase.from('lessons').select('id, level'),
    // voice_notes may not exist yet if migration 004 hasn't been run
    supabase
      .from('voice_notes')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id),
  ])

  const userLevel = (userData?.current_level ?? 1) as SpanishLevel
  const vocab = vocabItems ?? []
  const allCorrections = corrections ?? []
  const plays = rolePlays ?? []
  const lessons = completedLessons ?? []

  // Lessons completed at the current level (for CEFR progress)
  const levelLessonIds = new Set(
    (allLessonsIndex ?? []).filter(l => l.level === userLevel).map(l => l.id)
  )
  const completedAtLevel = lessons.filter(l => levelLessonIds.has(l.lesson_id)).length

  const completedDates = lessons
    .map(l => l.completed_at)
    .filter((d): d is string => !!d)
  const streak = calculateStreak(completedDates)

  const scores = computeSkillScores({
    vocabItems: vocab,
    corrections: allCorrections,
    rolePlays: plays,
    lessonsCompleted: lessons.length,
    streak,
  })

  const cefr = computeCefrEstimate(userLevel, completedAtLevel, levelLessonIds.size)

  // Skills ranked for strongest / weakest (ignore zero-signal skills)
  const rankedSkills = SKILL_LABELS
    .map(s => ({ ...s, score: scores[s.key] }))
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
  const strongest = rankedSkills.slice(0, 2)
  const weakest = rankedSkills.slice(-2).reverse()

  // Weekly activity from all session timestamps
  const activityTimestamps = [
    ...completedDates,
    ...plays.map(p => p.created_at),
  ]

  // Recommendation
  const recentCorrections = withinDays(allCorrections, c => c.created_at, 14)
  const recommendation = computeRecommendation({
    dueReviews: dueCount ?? 0,
    recentCorrections,
    rolePlayCount: plays.length,
    userLevel,
  })

  const milestone = computeNextMilestone({
    userLevel,
    completedAtLevel,
    totalAtLevel: levelLessonIds.size,
    vocabularyCount: vocab.length,
    streak,
  })

  // Sessions since the last weekly review (for the generator gate)
  const periodStartISO = latestReview?.created_at ?? new Date(0).toISOString()
  const sessionsThisPeriod = sessionsSince(completedDates, plays.map(p => p.created_at), periodStartISO)

  const masteredCount = vocab.filter(v => v.status === 'mastered').length

  const achievements = computeAchievements({
    lessonsCompleted: lessons.length,
    streak,
    vocabularyCount: vocab.length,
    masteredCount,
    rolePlaysCount: plays.length,
    voiceNotesCount: voiceNotesCount ?? 0,
    correctionsCount: allCorrections.length,
    userLevel,
  })

  const achievementsByCategory = (Object.keys(ACHIEVEMENT_CATEGORY_LABELS) as AchievementCategory[]).map(cat => ({
    category: cat,
    label: ACHIEVEMENT_CATEGORY_LABELS[cat],
    items: achievements.filter(a => a.category === cat),
  }))

  const summaryStats = [
    { label: 'Lessons', value: lessons.length, icon: BookOpen },
    { label: 'Role plays', value: plays.length, icon: Play },
    { label: 'Words known', value: vocab.length, icon: BookMarked },
    { label: 'Day streak', value: streak, icon: Flame },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1E2A3A] tracking-tight">Progress</h1>
          <p className="text-sm text-[#6F4E37]/60 mt-0.5">Your fluency, measured</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="navy">{levelToLabel(userLevel)}</Badge>
          <Badge variant="gold">{cefr.cefr}</Badge>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {summaryStats.map(({ label, value, icon: Icon }) => (
          <Card key={label} className="py-3 text-center">
            <Icon className="w-4 h-4 text-[#F2C94C] mx-auto mb-1" />
            <p className="text-xl font-bold text-[#1E2A3A]">{value}</p>
            <p className="text-xs text-[#6F4E37]/60">{label}</p>
          </Card>
        ))}
      </div>

      {/* CEFR progress */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-[#1E2A3A]">Level progress</h2>
          <span className="text-xs text-[#6F4E37]/60">
            {cefr.nextCefr ? `${cefr.cefr} → ${cefr.nextCefr}` : `${cefr.cefr} — top level`}
          </span>
        </div>
        <ProgressBar
          value={cefr.progressPercent}
          color="gold"
          label={`${cefr.progressPercent}% through Level ${userLevel}`}
        />
        <div className="flex items-center gap-2 mt-3">
          <Flag className="w-3.5 h-3.5 text-[#4A90E2]" />
          <p className="text-xs text-[#1E2A3A]/70">
            <span className="font-medium">Next milestone:</span> {milestone}
          </p>
        </div>
      </Card>

      {/* Skill scores */}
      <Card>
        <h2 className="text-sm font-semibold text-[#1E2A3A] mb-4">Skill breakdown</h2>
        <div className="space-y-3.5">
          {SKILL_LABELS.map(({ key, label }) => (
            <div key={key} className="flex items-center gap-3">
              <span className="text-xs text-[#6F4E37]/70 w-32 shrink-0">{label}</span>
              <ProgressBar
                value={scores[key]}
                color={scores[key] >= 70 ? 'green' : scores[key] >= 40 ? 'gold' : 'blue'}
                className="flex-1"
              />
              <span className="text-xs font-medium text-[#1E2A3A] w-8 text-right">{scores[key]}</span>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-[#1E2A3A]/35 mt-4">
          Scores are estimates based on your lessons, reviews, corrections, and role play performance.
        </p>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Weekly activity */}
        <WeeklyActivityChart timestamps={activityTimestamps} />

        {/* Strongest / weakest */}
        <Card>
          <h2 className="text-sm font-semibold text-[#1E2A3A] mb-4">Strengths &amp; focus areas</h2>
          {rankedSkills.length === 0 ? (
            <p className="text-sm text-[#6F4E37]/60">Complete a few sessions to see your skill profile.</p>
          ) : (
            <div className="space-y-3">
              {strongest.map(s => (
                <div key={s.key} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#27AE60]" />
                    <span className="text-sm text-[#1E2A3A]/80">{s.label}</span>
                  </div>
                  <Badge variant="success">{s.score}</Badge>
                </div>
              ))}
              {weakest
                .filter(w => !strongest.some(s => s.key === w.key))
                .map(s => (
                  <div key={s.key} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="w-4 h-4 text-[#F2994A]" />
                      <span className="text-sm text-[#1E2A3A]/80">{s.label}</span>
                    </div>
                    <Badge variant="gold">{s.score}</Badge>
                  </div>
                ))}
            </div>
          )}
        </Card>
      </div>

      {/* Recommended focus */}
      <Card className="bg-[#1E2A3A]" variant="navy">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-[#F2C94C] text-xs font-medium uppercase tracking-wide mb-1">
              Recommended focus
            </p>
            <h2 className="text-lg font-bold text-white mb-1">{recommendation.title}</h2>
            <p className="text-white/60 text-sm leading-relaxed">{recommendation.description}</p>
          </div>
          <Link
            href={recommendation.href}
            className="inline-flex items-center justify-center gap-2 bg-[#F2C94C] text-[#1E2A3A] px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#e5bd45] transition-all active:scale-[0.98] shrink-0"
          >
            {recommendation.cta} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </Card>

      {/* Weekly review */}
      <WeeklyReviewCard
        latestReview={latestReview as WeeklyReview | null}
        sessionsThisPeriod={sessionsThisPeriod}
      />

      {/* Achievements */}
      <Card>
        <div className="flex items-center gap-2 mb-5">
          <Trophy className="w-4 h-4 text-[#F2C94C]" />
          <h2 className="text-sm font-semibold text-[#1E2A3A]">Achievements</h2>
          <span className="ml-auto text-xs text-[#6F4E37]/50">
            {achievements.filter(a => a.earned).length} / {achievements.length}
          </span>
        </div>
        <div className="space-y-6">
          {achievementsByCategory.map(({ category, label, items }) => (
            <div key={category}>
              <p className="text-[10px] font-semibold text-[#1E2A3A]/40 uppercase tracking-widest mb-3">{label}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {items.map(a => (
                  <div
                    key={a.slug}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all',
                      a.earned
                        ? 'bg-[#F2C94C]/10 border-[#F2C94C]/40'
                        : 'bg-[#F8F4EC] border-[#1E2A3A]/6'
                    )}
                  >
                    <div className={cn(
                      'w-7 h-7 rounded-lg flex items-center justify-center shrink-0',
                      a.earned ? 'bg-[#F2C94C]/25' : 'bg-[#1E2A3A]/8'
                    )}>
                      {a.earned
                        ? <Trophy className="w-3.5 h-3.5 text-[#B8902A]" />
                        : <Lock className="w-3 h-3 text-[#1E2A3A]/25" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        'text-xs font-medium truncate',
                        a.earned ? 'text-[#1E2A3A]' : 'text-[#1E2A3A]/40'
                      )}>
                        {a.title}
                      </p>
                      <p className="text-[10px] text-[#1E2A3A]/35 truncate">{a.description}</p>
                    </div>
                    {!a.earned && a.progressTotal > 1 && (
                      <span className="text-[10px] text-[#1E2A3A]/30 shrink-0 tabular-nums">
                        {a.progressCurrent}/{a.progressTotal}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
