import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { calculateStreak } from '@/lib/utils'
import AppShell from '@/components/layout/AppShell'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Streak = consecutive days with any learning activity (lessons or role plays).
  const [{ data: lessons }, { data: plays }] = await Promise.all([
    supabase
      .from('user_lessons')
      .select('completed_at')
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .not('completed_at', 'is', null),
    supabase
      .from('role_play_sessions')
      .select('created_at')
      .eq('user_id', user.id),
  ])

  const activityDates = [
    ...(lessons ?? []).map(l => l.completed_at).filter((d): d is string => !!d),
    ...(plays ?? []).map(p => p.created_at).filter((d): d is string => !!d),
  ]
  const streak = calculateStreak(activityDates)

  return (
    <AppShell streak={streak}>
      {children}
    </AppShell>
  )
}
