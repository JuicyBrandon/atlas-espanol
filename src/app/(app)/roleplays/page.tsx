import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ROLE_PLAY_MODES } from '@/lib/roleplay-scenarios'
import { Briefcase, Heart, Plane, Users, ChevronRight, Trophy } from 'lucide-react'

const MODE_ICONS = {
  sales: { icon: Briefcase, color: 'text-[#4A90E2]', bg: 'bg-[#4A90E2]/10' },
  dating: { icon: Heart, color: 'text-[#EB5757]', bg: 'bg-[#EB5757]/10' },
  travel: { icon: Plane, color: 'text-[#27AE60]', bg: 'bg-[#27AE60]/10' },
  social: { icon: Users, color: 'text-[#F2994A]', bg: 'bg-[#F2994A]/10' },
} as const

export default async function RolePlaysPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: sessions } = await supabase
    .from('role_play_sessions')
    .select('mode, score, scenario, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const sessionCount: Record<string, number> = {}
  for (const s of sessions ?? []) {
    sessionCount[s.mode] = (sessionCount[s.mode] ?? 0) + 1
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1E2A3A] tracking-tight">Role Plays</h1>
        <p className="text-sm text-[#6F4E37]/60 mt-0.5">
          Practice real Colombian Spanish conversations with realistic characters
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {ROLE_PLAY_MODES.map(m => {
          const { icon: Icon, color, bg } = MODE_ICONS[m.mode]
          return (
            <Link key={m.mode} href={`/roleplays/${m.mode}`}>
              <Card className="h-full hover:shadow-md hover:-translate-y-[1px] transition-all duration-200 cursor-pointer">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#1E2A3A]/25" />
                </div>
                <p className="font-semibold text-[#1E2A3A] mb-1">{m.label}</p>
                <p className="text-sm text-[#6F4E37]/70 leading-relaxed mb-3">{m.description}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="default">{m.scenarios.length} scenarios</Badge>
                  {(sessionCount[m.mode] ?? 0) > 0 && (
                    <Badge variant="success">{sessionCount[m.mode]} completed</Badge>
                  )}
                </div>
              </Card>
            </Link>
          )
        })}
      </div>

      {(sessions?.length ?? 0) > 0 && (
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-4 h-4 text-[#F2C94C]" />
            <h2 className="text-sm font-semibold text-[#1E2A3A]">Recent sessions</h2>
          </div>
          <div className="space-y-2">
            {sessions!.map((s, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-[#1E2A3A]/5 last:border-0">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#1E2A3A] truncate">{s.scenario}</p>
                  <p className="text-xs text-[#6F4E37]/50 capitalize">{s.mode} · {new Date(s.created_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}</p>
                </div>
                {s.score !== null && (
                  <Badge variant={s.score >= 80 ? 'success' : s.score >= 60 ? 'gold' : 'default'}>
                    {s.score}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
