import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { levelToLabel, levelToCEFR } from '@/lib/utils'
import { Flame, BookOpen, Star, Clock } from 'lucide-react'
import type { DashboardStats } from '@/types'

interface StatsGridProps {
  stats: DashboardStats
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard
        icon={<Star className="w-4 h-4 text-[#F2C94C]" />}
        label="Current Level"
        value={`Level ${stats.currentLevel}`}
        sub={levelToCEFR(stats.currentLevel)}
      />
      <StatCard
        icon={<Flame className="w-4 h-4 text-[#F2994A]" />}
        label="Streak"
        value={`${stats.streak}`}
        sub="days in a row"
      />
      <StatCard
        icon={<BookOpen className="w-4 h-4 text-[#4A90E2]" />}
        label="Vocabulary"
        value={`${stats.vocabularyCount}`}
        sub="words learned"
      />
      <StatCard
        icon={<Clock className="w-4 h-4 text-[#27AE60]" />}
        label="Lessons"
        value={`${stats.lessonsCompleted}`}
        sub="completed"
      />
    </div>
  )
}

function StatCard({
  icon, label, value, sub
}: {
  icon: React.ReactNode
  label: string
  value: string
  sub: string
}) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-xs text-[#1E2A3A]/50 font-medium uppercase tracking-wide">{label}</span>
      </div>
      <div>
        <p className="text-2xl font-bold text-[#1E2A3A] tracking-tight">{value}</p>
        <p className="text-xs text-[#6F4E37]/70 mt-0.5">{sub}</p>
      </div>
    </Card>
  )
}

interface TodayCardProps {
  lesson: DashboardStats['todaysLesson']
  dueForReview: number
  weeklyProgress: number
}

export function TodayCard({ lesson, dueForReview, weeklyProgress }: TodayCardProps) {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <Card variant="navy" className="md:col-span-2">
        <p className="text-[#F2C94C] text-xs font-medium uppercase tracking-wide mb-2">Today's Lesson</p>
        {lesson ? (
          <>
            <h2 className="text-xl font-bold text-white mb-1">{lesson.lesson_title}</h2>
            <p className="text-white/60 text-sm mb-4">{lesson.lesson_goal}</p>
            <div className="flex items-center gap-2">
              <Badge variant="gold">Level {lesson.level}</Badge>
              <Badge variant="default" className="bg-white/10 text-white/70">{lesson.module_name}</Badge>
            </div>
          </>
        ) : (
          <p className="text-white/50 text-sm">No lesson loaded. Start your first one!</p>
        )}
      </Card>

      <div className="flex flex-col gap-4">
        <Card>
          <p className="text-xs text-[#1E2A3A]/50 font-medium mb-2 uppercase tracking-wide">Due for Review</p>
          <p className="text-3xl font-bold text-[#1E2A3A]">{dueForReview}</p>
          <p className="text-xs text-[#6F4E37]/70">vocabulary items</p>
        </Card>
        <Card>
          <ProgressBar
            value={weeklyProgress}
            label="Weekly goal"
            color="gold"
          />
        </Card>
      </div>
    </div>
  )
}
