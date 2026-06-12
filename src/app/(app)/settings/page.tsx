import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SettingsForm from '@/components/settings/SettingsForm'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: userData } = await supabase
    .from('users')
    .select('name, current_level, daily_minutes, learning_intensity, main_goal, target_accent')
    .eq('id', user.id)
    .single()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1E2A3A] tracking-tight">Settings</h1>
        <p className="text-sm text-[#6F4E37]/60 mt-0.5">Account and learning preferences</p>
      </div>
      <SettingsForm
        user={{
          name: userData?.name ?? '',
          current_level: userData?.current_level ?? 1,
          daily_minutes: userData?.daily_minutes ?? 15,
          learning_intensity: userData?.learning_intensity ?? 'steady',
          main_goal: userData?.main_goal ?? 'beginner_to_conversational',
          target_accent: userData?.target_accent ?? 'general',
        }}
        email={user.email ?? ''}
      />
    </div>
  )
}
