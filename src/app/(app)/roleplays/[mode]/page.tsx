import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import RolePlaySession from '@/components/roleplay/RolePlaySession'
import { getModeConfig, getScenario } from '@/lib/roleplay-scenarios'
import { ChevronRight, ChevronLeft, Lock } from 'lucide-react'

export default async function RolePlayModePage({
  params,
  searchParams,
}: {
  params: Promise<{ mode: string }>
  searchParams: Promise<{ scenario?: string }>
}) {
  const { mode } = await params
  const { scenario: scenarioSlug } = await searchParams

  const config = getModeConfig(mode)
  if (!config) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: userData } = await supabase
    .from('users')
    .select('current_level')
    .eq('id', user.id)
    .single()

  const userLevel = userData?.current_level ?? 1

  // If a scenario is selected, run the session
  if (scenarioSlug) {
    const scenario = getScenario(mode, scenarioSlug)
    if (!scenario) notFound()
    return (
      <RolePlaySession
        mode={mode}
        modeLabel={config.label}
        scenario={scenario}
        userLevel={userLevel}
      />
    )
  }

  // Otherwise show the scenario picker
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/roleplays"
          className="inline-flex items-center gap-1 text-xs text-[#4A90E2] hover:underline mb-2"
        >
          <ChevronLeft className="w-3 h-3" /> All modes
        </Link>
        <h1 className="text-2xl font-bold text-[#1E2A3A] tracking-tight">{config.label}</h1>
        <p className="text-sm text-[#6F4E37]/60 mt-0.5">{config.tagline}</p>
      </div>

      <div className="space-y-3">
        {config.scenarios.map(s => {
          const locked = s.minLevel > userLevel
          if (locked) {
            return (
              <Card key={s.slug} className="opacity-55">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-[#1E2A3A]">{s.title}</p>
                      <Badge variant="default">
                        <Lock className="w-3 h-3 mr-1 inline" />
                        Level {s.minLevel}+
                      </Badge>
                    </div>
                    <p className="text-sm text-[#6F4E37]/70">{s.description}</p>
                  </div>
                </div>
              </Card>
            )
          }
          return (
            <Link key={s.slug} href={`/roleplays/${mode}?scenario=${s.slug}`} className="block">
              <Card className="hover:shadow-md hover:-translate-y-[1px] transition-all duration-200 cursor-pointer">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-[#1E2A3A]">{s.title}</p>
                      <Badge variant="gold">Level {s.minLevel}+</Badge>
                    </div>
                    <p className="text-sm text-[#6F4E37]/70">{s.description}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#1E2A3A]/25 shrink-0" />
                </div>
              </Card>
            </Link>
          )
        })}
      </div>

      {config.scenarios.every(s => s.minLevel > userLevel) && (
        <Card className="text-center py-8">
          <p className="text-sm text-[#6F4E37]/70">
            These scenarios unlock at higher levels. Keep completing lessons to level up!
          </p>
        </Card>
      )}
    </div>
  )
}
