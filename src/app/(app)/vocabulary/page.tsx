import { Construction } from 'lucide-react'
import { Card } from '@/components/ui/Card'

export default function VocabularyPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-[#1E2A3A] tracking-tight">Vocabulary</h1>
        <p className="text-sm text-[#6F4E37]/60 mt-0.5">Spaced repetition review system</p>
      </div>
      <Card className="flex flex-col items-center gap-3 py-16 text-center">
        <Construction className="w-8 h-8 text-[#F2C94C]" />
        <p className="text-sm text-[#6F4E37]/70">Vocabulary bank and spaced review coming in Sprint 2.</p>
        <p className="text-xs text-[#1E2A3A]/30">Words you learn in lessons will appear here for review.</p>
      </Card>
    </div>
  )
}
