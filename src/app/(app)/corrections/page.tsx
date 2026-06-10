import { Construction } from 'lucide-react'
import { Card } from '@/components/ui/Card'

export default function CorrectionsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-[#1E2A3A] tracking-tight">Corrections</h1>
        <p className="text-sm text-[#6F4E37]/60 mt-0.5">Your mistake history and patterns</p>
      </div>
      <Card className="flex flex-col items-center gap-3 py-16 text-center">
        <Construction className="w-8 h-8 text-[#F2C94C]" />
        <p className="text-sm text-[#6F4E37]/70">Mistake tracking ships in Sprint 2 with the AI coach.</p>
        <p className="text-xs text-[#1E2A3A]/30">Every error becomes a future practice opportunity.</p>
      </Card>
    </div>
  )
}
