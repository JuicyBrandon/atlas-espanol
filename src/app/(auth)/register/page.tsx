'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'
import { Globe } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async () => {
    if (!name || !email || !password) return
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/onboarding')
      router.refresh()
    }
  }

  return (
    <div className="min-h-[100dvh] bg-[#F8F4EC] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-xl bg-[#1E2A3A] flex items-center justify-center">
            <Globe className="w-5 h-5 text-[#F2C94C]" />
          </div>
          <span className="text-[#1E2A3A] font-bold text-lg tracking-tight">Atlas Español</span>
        </div>

        <div className="bg-white rounded-3xl shadow-[0_8px_48px_rgba(30,42,58,0.08)] p-8">
          <h1 className="text-xl font-bold text-[#1E2A3A] mb-1">Create your account</h1>
          <p className="text-sm text-[#6F4E37]/70 mb-6">Free to start. No credit card needed.</p>

          <div className="flex flex-col gap-4">
            <Input
              label="Your name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Brandon"
              autoComplete="given-name"
            />
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              autoComplete="new-password"
            />
            {error && <p className="text-xs text-[#EB5757]">{error}</p>}
            <Button
              size="lg"
              className="w-full mt-2"
              loading={loading}
              onClick={handleRegister}
            >
              Create account
            </Button>
          </div>

          <p className="text-xs text-center text-[#6F4E37]/60 mt-5">
            Already have an account?{' '}
            <Link href="/login" className="text-[#4A90E2] hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
