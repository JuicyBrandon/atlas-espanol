import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number
  max?: number
  label?: string
  className?: string
  color?: 'gold' | 'blue' | 'green'
}

export function ProgressBar({ value, max = 100, label, className, color = 'gold' }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))

  const colors = {
    gold: 'bg-[#F2C94C]',
    blue: 'bg-[#4A90E2]',
    green: 'bg-[#27AE60]',
  }

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <div className="flex justify-between mb-1.5">
          <span className="text-xs text-[#1E2A3A]/60">{label}</span>
          <span className="text-xs font-medium text-[#1E2A3A]">{Math.round(pct)}%</span>
        </div>
      )}
      <div className="w-full h-2 bg-[#1E2A3A]/8 rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-700 ease-out', colors[color])}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
