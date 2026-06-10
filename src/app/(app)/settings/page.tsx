import { Construction } from 'lucide-react'
import { Card } from '@/components/ui/Card'

export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-[#1E2A3A] tracking-tight">Settings</h1>
        <p className="text-sm text-[#6F4E37]/60 mt-0.5">Account and learning preferences</p>
      </div>
      <Card className="flex flex-col items-center gap-3 py-16 text-center">
        <Construction className="w-8 h-8 text-[#F2C94C]" />
        <p className="text-sm text-[#6F4E37]/70">Settings panel coming soon.</p>
      </Card>
    </div>
  )
}
