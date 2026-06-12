'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { createClient } from '@/lib/supabase/client'
import { COLOMBIAN_FOCUS_OPTIONS, LEARNING_GOALS, DAILY_MINUTES_OPTIONS } from '@/lib/constants'
import { levelToLabel } from '@/lib/utils'
import { CheckCircle, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { User, LearningIntensity, SpanishLevel } from '@/types'

interface SettingsFormProps {
  user: Pick<User,
    'name' | 'current_level' | 'daily_minutes' | 'learning_intensity' | 'main_goal' | 'target_accent'
  >
  email: string
}

const INTENSITY_OPTIONS: Array<{ value: LearningIntensity; label: string; sub: string }> = [
  { value: 'casual', label: 'Casual', sub: '2–3 days/week' },
  { value: 'steady', label: 'Steady', sub: '5 days/week' },
  { value: 'intensive', label: 'Intensive', sub: 'every day' },
]

function PillGroup<T extends string>({
  options, value, onChange,
}: {
  options: Array<{ value: T; label: string; sub?: string }>
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            'px-4 py-2 rounded-xl text-sm font-medium border transition-all',
            value === opt.value
              ? 'bg-[#1E2A3A] text-[#F2C94C] border-[#1E2A3A]'
              : 'bg-white text-[#1E2A3A]/60 border-[#1E2A3A]/15 hover:border-[#1E2A3A]/40'
          )}
        >
          <div>{opt.label}</div>
          {opt.sub && <div className="text-[10px] opacity-70">{opt.sub}</div>}
        </button>
      ))}
    </div>
  )
}

export default function SettingsForm({ user, email }: SettingsFormProps) {
  const router = useRouter()
  const [name, setName] = useState(user.name)
  const [dailyMinutes, setDailyMinutes] = useState(user.daily_minutes)
  const [intensity, setIntensity] = useState<LearningIntensity>(user.learning_intensity)
  const [mainGoal, setMainGoal] = useState(user.main_goal)
  const [targetAccent, setTargetAccent] = useState(user.target_accent)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSave = async () => {
    if (!name.trim()) { setError('Name is required'); return }
    setError(null)
    setSaving(true)
    setSaved(false)
    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), daily_minutes: dailyMinutes, learning_intensity: intensity, main_goal: mainGoal, target_accent: targetAccent }),
      })
      if (!res.ok) {
        const { error: msg } = await res.json()
        setError(msg ?? 'Save failed')
      } else {
        setSaved(true)
        router.refresh()
        setTimeout(() => setSaved(false), 3000)
      }
    } catch {
      setError('Network error — please try again')
    } finally {
      setSaving(false)
    }
  }

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="space-y-5 max-w-xl">
      {/* Profile */}
      <Card>
        <h2 className="text-sm font-semibold text-[#1E2A3A] mb-4">Profile</h2>
        <div className="space-y-4">
          <Input
            label="Display name"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Your name"
            maxLength={60}
          />
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#1E2A3A]">Email</label>
            <p className="w-full px-4 py-3 rounded-xl border border-[#1E2A3A]/8 bg-[#F8F4EC] text-sm text-[#1E2A3A]/50">
              {email}
            </p>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#1E2A3A]">Current level</label>
            <div className="flex items-center gap-2 px-4 py-2.5">
              <Badge variant="navy">Level {user.current_level}</Badge>
              <span className="text-sm text-[#1E2A3A]/60">{levelToLabel(user.current_level as SpanishLevel)}</span>
            </div>
            <p className="text-xs text-[#6F4E37]/50 px-1">Level advances automatically as you complete lessons.</p>
          </div>
        </div>
      </Card>

      {/* Learning preferences */}
      <Card>
        <h2 className="text-sm font-semibold text-[#1E2A3A] mb-4">Learning preferences</h2>
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#1E2A3A]">Daily study goal</label>
            <PillGroup
              options={DAILY_MINUTES_OPTIONS.map(m => ({ value: m as unknown as string, label: `${m}m` }))}
              value={String(dailyMinutes)}
              onChange={v => setDailyMinutes(Number(v))}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#1E2A3A]">Learning intensity</label>
            <PillGroup
              options={INTENSITY_OPTIONS}
              value={intensity}
              onChange={setIntensity}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#1E2A3A]">Main goal</label>
            <select
              value={mainGoal}
              onChange={e => setMainGoal(e.target.value as typeof mainGoal)}
              className="w-full px-4 py-3 rounded-xl border border-[#1E2A3A]/15 bg-white text-sm text-[#1E2A3A] focus:outline-none focus:border-[#4A90E2] focus:ring-2 focus:ring-[#4A90E2]/20 transition-all"
            >
              {LEARNING_GOALS.map(g => (
                <option key={g.value} value={g.value}>{g.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#1E2A3A]">Colombian focus</label>
            <select
              value={targetAccent}
              onChange={e => setTargetAccent(e.target.value as typeof targetAccent)}
              className="w-full px-4 py-3 rounded-xl border border-[#1E2A3A]/15 bg-white text-sm text-[#1E2A3A] focus:outline-none focus:border-[#4A90E2] focus:ring-2 focus:ring-[#4A90E2]/20 transition-all"
            >
              {COLOMBIAN_FOCUS_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Save */}
      {error && <p className="text-sm text-[#EB5757] px-1">{error}</p>}
      <Button onClick={handleSave} loading={saving} size="lg" className="w-full">
        {saved ? (
          <><CheckCircle className="w-4 h-4" /> Saved</>
        ) : 'Save changes'}
      </Button>

      {/* Danger zone */}
      <Card className="border-red-200">
        <h2 className="text-sm font-semibold text-[#1E2A3A] mb-3">Account</h2>
        <Button variant="ghost" size="md" onClick={handleSignOut} className="gap-2 text-[#EB5757] border-red-200 hover:bg-red-50">
          <LogOut className="w-4 h-4" />
          Sign out
        </Button>
      </Card>
    </div>
  )
}
