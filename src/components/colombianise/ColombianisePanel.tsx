'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import type { ColombianiseResult } from '@/app/api/colombianise/route'
import { Wand2, Copy, Check } from 'lucide-react'

const VERSION_STYLES = [
  { key: 'literal', label: 'Literal', accent: 'border-l-[#1E2A3A]/30' },
  { key: 'natural_colombian', label: 'Natural Colombian', accent: 'border-l-[#F2C94C]' },
  { key: 'warmer', label: 'Warmer', accent: 'border-l-[#EB5757]' },
  { key: 'more_professional', label: 'More professional', accent: 'border-l-[#4A90E2]' },
  { key: 'more_casual', label: 'More casual', accent: 'border-l-[#27AE60]' },
] as const

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text).catch(() => null)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      }}
      className="text-[#1E2A3A]/25 hover:text-[#4A90E2] transition-colors shrink-0"
      aria-label="Copy to clipboard"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-[#27AE60]" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  )
}

export default function ColombianisePanel() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<ColombianiseResult | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!input.trim() || loading) return
    setLoading(true)
    try {
      const res = await fetch('/api/colombianise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input }),
      })
      if (res.ok) setResult(await res.json())
    } catch {
      // Leave previous result in place
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      <Card>
        <label className="text-xs text-[#6F4E37]/60 font-medium uppercase tracking-wide mb-2 block">
          Your text — English or Spanish
        </label>
        <textarea
          rows={3}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit()
          }}
          className="w-full bg-[#F8F4EC] rounded-xl border border-[#1E2A3A]/10 px-4 py-3 text-sm text-[#1E2A3A] placeholder:text-[#1E2A3A]/35 outline-none focus:border-[#4A90E2] focus:ring-2 focus:ring-[#4A90E2]/20 resize-none transition-all"
          placeholder="e.g. I hope you had a good day"
        />
        <Button
          className="w-full mt-3"
          onClick={handleSubmit}
          loading={loading}
          disabled={!input.trim()}
        >
          <Wand2 className="w-4 h-4" /> Colombianise it
        </Button>
      </Card>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-3"
          >
            {VERSION_STYLES.map(({ key, label, accent }) => (
              <Card key={key} className={`border-l-4 ${accent} py-3.5`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs text-[#6F4E37]/60 font-medium uppercase tracking-wide mb-1">
                      {label}
                    </p>
                    <p className="text-sm font-medium text-[#1E2A3A] leading-relaxed">
                      {result[key]}
                    </p>
                  </div>
                  <CopyButton text={result[key]} />
                </div>
              </Card>
            ))}

            <Card className="bg-[#4A90E2]/5 border-[#4A90E2]/20">
              <p className="text-xs text-[#6F4E37]/60 font-medium uppercase tracking-wide mb-1.5">
                Tone notes
              </p>
              <p className="text-sm text-[#6F4E37]/85 leading-relaxed">{result.tone_explanation}</p>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
