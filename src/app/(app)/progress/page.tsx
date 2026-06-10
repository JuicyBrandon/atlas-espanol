import { Construction } from 'lucide-react'
import { Card } from '@/components/ui/Card'

export default function ProgressPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-[#1E2A3A] tracking-tight">Progress</h1>
        <p className="text-sm text-[#6F4E37]/60 mt-0.5">CEFR tracking, weekly reviews, analytics</p>
      </div>
      <Card className="flex flex-col items-center gap-3 py-16 text-center">
        <Construction className="w-8 h-8 text-[#F2C94C]" />
        <p className="text-sm text-[#6F4E37]/70">Progress intelligence ships in Sprint 4.</p>
        <p className="text-xs text-[#1E2A3A]/30">You'll see CEFR estimates, weekly reports, and improvement curves.</p>
      </Card>
    </div>
  )
}
