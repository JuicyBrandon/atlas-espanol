'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'
import { Globe } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) return
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
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
          <h1 className="text-xl font-bold text-[#1E2A3A] mb-1">Welcome back</h1>
          <p className="text-sm text-[#6F4E37]/70 mb-6">Sign in to continue your Spanish journey.</p>

          <div className="flex flex-col gap-4">
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
              placeholder="Your password"
              autoComplete="current-password"
            />
            {error && <p className="text-xs text-[#EB5757]">{error}</p>}
            <Button
              size="lg"
              className="w-full mt-2"
              loading={loading}
              onClick={handleLogin}
            >
              Sign in
            </Button>
          </div>

          <p className="text-xs text-center text-[#6F4E37]/60 mt-5">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-[#4A90E2] hover:underline font-medium">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
