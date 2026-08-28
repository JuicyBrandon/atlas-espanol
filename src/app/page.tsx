import Link from 'next/link'
import { Globe, ArrowRight, Check } from 'lucide-react'

const FEATURES = [
  'Full Colombian Spanish curriculum (72 modules)',
  'AI conversation coach that adapts to you',
  'Sales, dating, travel and social role plays',
  'Colour-coded mistake tracking and reviews',
  'Vocabulary spaced repetition system',
  'Weekly fluency progress reports',
]

export default function LandingPage() {
  return (
    <main className="min-h-[100dvh] bg-[#F8F4EC]">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#1E2A3A] flex items-center justify-center">
            <Globe className="w-4 h-4 text-[#F2C94C]" />
          </div>
          <span className="text-[#1E2A3A] font-semibold tracking-tight">Atlas Español</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-[#1E2A3A]/60 hover:text-[#1E2A3A] transition-colors">
            Sign in
          </Link>
          <Link
            href="/register"
            className="bg-[#1E2A3A] text-[#F8F4EC] text-sm px-4 py-2 rounded-xl hover:bg-[#2a3a50] transition-colors"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 md:px-12 pt-16 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-[#F2C94C]/20 text-[#6F4E37] text-xs font-medium px-3 py-1.5 rounded-full mb-6">
          <span className="w-1.5 h-1.5 bg-[#F2C94C] rounded-full" />
          Colombian Spanish Fluency System
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-[#1E2A3A] tracking-tight leading-tight mb-6">
          Learn Colombian Spanish<br />
          <span className="text-[#F2C94C]">the way it&apos;s actually spoken</span>
        </h1>
        <p className="text-lg text-[#6F4E37]/80 leading-relaxed max-w-2xl mx-auto mb-10">
          An AI-powered fluency coach that takes you from complete beginner to professional Colombian Spanish — through real conversations, not generic exercises.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-[#1E2A3A] text-[#F8F4EC] px-7 py-3.5 rounded-xl text-base font-medium hover:bg-[#2a3a50] transition-all active:scale-[0.98]"
          >
            Start for free <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-[#1E2A3A]/70 px-7 py-3.5 rounded-xl text-base hover:text-[#1E2A3A] transition-colors"
          >
            Already have an account
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-4xl mx-auto px-6 md:px-12 pb-20">
        <div className="bg-white rounded-3xl border border-[#1E2A3A]/8 shadow-[0_4px_32px_rgba(30,42,58,0.06)] p-8 md:p-10">
          <h2 className="text-xl font-bold text-[#1E2A3A] mb-6 tracking-tight">Everything you need to actually get fluent</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {FEATURES.map(f => (
              <div key={f} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#27AE60]/15 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-[#27AE60]" />
                </div>
                <p className="text-sm text-[#6F4E37]/80">{f}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-6 md:px-12 py-6 border-t border-[#1E2A3A]/8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#1E2A3A]/30" />
          <span className="text-[#1E2A3A]/40 text-xs">Atlas Español</span>
        </div>
        <p className="text-[#1E2A3A]/30 text-xs">Colombian Spanish Fluency System</p>
      </footer>
    </main>
  )
}
