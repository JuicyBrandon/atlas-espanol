'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, BookOpen, MessageCircle, Play,
  BookMarked, AlertCircle, TrendingUp, Settings,
  Menu, X, Flame, Globe, Wand2, Mic, ClipboardList
} from 'lucide-react'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/lesson', label: 'Today\'s Lesson', icon: BookOpen },
  { href: '/coach', label: 'AI Coach', icon: MessageCircle },
  { href: '/roleplays', label: 'Role Plays', icon: Play },
  { href: '/colombianise', label: 'Colombianise It', icon: Wand2 },
  { href: '/voice-notes', label: 'Voice Notes', icon: Mic },
  { href: '/vocabulary', label: 'Vocabulary', icon: BookMarked },
  { href: '/corrections', label: 'Corrections', icon: AlertCircle },
  { href: '/progress', label: 'Progress', icon: TrendingUp },
  { href: '/placement', label: 'Placement Test', icon: ClipboardList },
  { href: '/settings', label: 'Settings', icon: Settings },
]

interface AppShellProps {
  children: React.ReactNode
  streak?: number
}

export default function AppShell({ children, streak = 0 }: AppShellProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-[100dvh] bg-[#F8F4EC]">
      {/* Sidebar — desktop */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 w-64 flex-col bg-[#1E2A3A] z-40">
        {/* Brand */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-[#F2C94C] flex items-center justify-center">
            <Globe className="w-4 h-4 text-[#1E2A3A]" />
          </div>
          <span className="text-[#F8F4EC] font-semibold tracking-tight">Atlas Español</span>
        </div>

        {/* Streak badge */}
        {streak > 0 && (
          <div className="mx-4 mt-4 px-3 py-2 bg-[#F2C94C]/15 rounded-xl flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#F2C94C]" />
            <span className="text-[#F2C94C] text-sm font-medium">{streak} day streak</span>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150',
                  active
                    ? 'bg-[#F2C94C]/20 text-[#F2C94C] font-medium'
                    : 'text-white/60 hover:text-white hover:bg-white/8'
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-white/10">
          <p className="text-white/30 text-xs">Colombian Spanish Fluency</p>
        </div>
      </aside>

      {/* Mobile header */}
      <header className="md:hidden fixed top-0 inset-x-0 z-40 bg-[#1E2A3A] border-b border-white/10">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#F2C94C] flex items-center justify-center">
              <Globe className="w-3.5 h-3.5 text-[#1E2A3A]" />
            </div>
            <span className="text-[#F8F4EC] font-semibold text-sm">Atlas Español</span>
          </div>
          <div className="flex items-center gap-3">
            {streak > 0 && (
              <div className="flex items-center gap-1">
                <Flame className="w-4 h-4 text-[#F2C94C]" />
                <span className="text-[#F2C94C] text-sm font-medium">{streak}</span>
              </div>
            )}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-white/70 hover:text-white p-1"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile nav drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-30 pt-14">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <nav className="relative bg-[#1E2A3A] w-64 h-full py-4 px-3 space-y-0.5 overflow-y-auto">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const active = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150',
                    active
                      ? 'bg-[#F2C94C]/20 text-[#F2C94C] font-medium'
                      : 'text-white/60 hover:text-white hover:bg-white/8'
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {label}
                </Link>
              )
            })}
          </nav>
        </div>
      )}

      {/* Main content */}
      <main className="md:pl-64 pt-14 md:pt-0 min-h-[100dvh]">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
