import { Construction } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

const MODES = [
  { label: 'Sales Mode', description: 'Cold calls, discovery, objection handling, closing.', color: 'navy', sprint: 'Sprint 3' },
  { label: 'Dating Mode', description: 'Messages, plans, expressing interest, voice notes.', color: 'gold', sprint: 'Sprint 3' },
  { label: 'Travel Mode', description: 'Airport, taxi, hotel, restaurant, pharmacy.', color: 'success', sprint: 'Sprint 3' },
  { label: 'Social Mode', description: 'Everyday conversations, slang, group settings.', color: 'warning', sprint: 'Sprint 3' },
] as const

export default function RolePlaysPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1E2A3A] tracking-tight">Role Plays</h1>
        <p className="text-sm text-[#6F4E37]/60 mt-0.5">Practice real Colombian Spanish conversations</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {MODES.map(m => (
          <Card key={m.label} className="opacity-60">
            <div className="flex items-center justify-between mb-3">
              <p className="font-semibold text-[#1E2A3A]">{m.label}</p>
              <Badge variant="default">{m.sprint}</Badge>
            </div>
            <p className="text-sm text-[#6F4E37]/70">{m.description}</p>
          </Card>
        ))}
      </div>
      <Card className="flex flex-col items-center gap-2 py-8 text-center">
        <Construction className="w-6 h-6 text-[#F2C94C]" />
        <p className="text-sm text-[#6F4E37]/60">Role plays ship in Sprint 3 after the AI coach is live.</p>
      </Card>
    </div>
  )
}
