import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ColombianisePanel from '@/components/colombianise/ColombianisePanel'

export default async function ColombianisePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1E2A3A] tracking-tight">Colombianise It</h1>
        <p className="text-sm text-[#6F4E37]/60 mt-0.5">
          Turn any phrase into natural Colombian Spanish — five tones, one click
        </p>
      </div>
      <ColombianisePanel />
    </div>
  )
}
