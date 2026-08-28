'use client'

import { Card } from '@/components/ui/Card'
import { buildWeeklyActivity } from '@/lib/progress'

interface Props {
  // ISO timestamps of all sessions (completed lessons + role plays).
  // Day bucketing happens client-side so it uses the user's timezone,
  // not the server's.
  timestamps: string[]
}

export default function WeeklyActivityChart({ timestamps }: Props) {
  const weeklyActivity = buildWeeklyActivity(timestamps)
  const maxDayCount = Math.max(1, ...weeklyActivity.map(d => d.count))
  const sessionsLast7Days = weeklyActivity.reduce((acc, d) => acc + d.count, 0)

  return (
    <Card>
      <h2 className="text-sm font-semibold text-[#1E2A3A] mb-4">This week</h2>
      <div className="flex items-end justify-between gap-2 h-24">
        {weeklyActivity.map((day, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
            <div className="w-full flex items-end justify-center h-16">
              <div
                className={`w-full max-w-[28px] rounded-md transition-all ${
                  day.count > 0 ? 'bg-[#F2C94C]' : 'bg-[#1E2A3A]/8'
                }`}
                style={{ height: `${Math.max((day.count / maxDayCount) * 100, day.count > 0 ? 20 : 8)}%` }}
              />
            </div>
            <span className={`text-[10px] ${day.isToday ? 'font-bold text-[#1E2A3A]' : 'text-[#1E2A3A]/40'}`}>
              {day.label}
            </span>
          </div>
        ))}
      </div>
      <p className="text-xs text-[#6F4E37]/60 mt-3 text-center">
        {sessionsLast7Days} session{sessionsLast7Days === 1 ? '' : 's'} in the last 7 days
      </p>
    </Card>
  )
}
