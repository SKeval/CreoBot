'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Copy, ChevronRight } from 'lucide-react'
import { PLATFORMS } from '@/lib/platforms'
import { createClient } from '@/lib/supabase'

type Props = {
  userId: string
  embedScript: string
  onComplete: () => void
  onBack: () => void
}

export default function PlatformSelector({ userId, embedScript, onComplete, onBack }: Props) {
  const supabase = createClient()
  const [selected, setSelected] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const selectedPlatform = PLATFORMS.find(p => p.id === selected)

  const handleSelect = async (platformId: string) => {
    setSelected(platformId)
    setError(null)
    try {
      const { error: dbError } = await supabase
        .from('profiles')
        .update({ website_platform: platformId })
        .eq('id', userId)
      if (dbError) throw dbError
    } catch {
      setError('Could not save platform. You can continue anyway.')
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(embedScript)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="w-full max-w-2xl">

      <div className="mb-8">
        <h1 className="text-2xl font-medium text-white mb-1">Which platform is your website on?</h1>
        <p className="text-white/60 text-sm">
          We will show you exactly how to add CreoBot to your site. Takes under 2 minutes.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        {PLATFORMS.map((platform, i) => (
          <motion.button
            key={platform.id}
            onClick={() => handleSelect(platform.id)}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.04 }}
            className={`flex items-center justify-between gap-2 p-4 rounded-xl border text-left transition-all duration-150 ${
              selected === platform.id
                ? 'border-cb-primary bg-cb-primary/10'
                : 'border-white/[0.08] bg-cb-card hover:border-white/[0.16]'
            }`}
          >
            <span className={`text-sm font-medium ${selected === platform.id ? 'text-cb-primary-hover' : 'text-white/70'}`}>
              {platform.name}
            </span>
            {selected === platform.id && <Check className="w-3.5 h-3.5 text-cb-primary-hover flex-shrink-0" />}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {selectedPlatform && (
          <motion.div
            key={selectedPlatform.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="bg-cb-card border border-white/[0.08] rounded-2xl p-6 mb-6"
          >
            <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">
              How to install on {selectedPlatform.name}
            </p>

            <ol className="space-y-3 mb-6">
              {selectedPlatform.steps.map((step, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <span className="min-w-[22px] h-[22px] rounded-full bg-cb-primary/10 border border-cb-primary/30 flex items-center justify-center text-[11px] font-semibold text-cb-primary-hover flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-sm text-white/60 leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>

            <p className="text-xs text-white/50 mb-2">{selectedPlatform.codeNote}</p>
            <div className="relative bg-cb-surface border border-white/[0.08] rounded-xl p-4 font-mono">
              <pre className="text-xs text-green-400 whitespace-pre-wrap break-all leading-relaxed pr-16">
                {embedScript}
              </pre>
              <button
                onClick={handleCopy}
                className={`absolute top-3 right-3 flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-all ${
                  copied
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-cb-card hover:bg-white/[0.1] text-white/70 border border-white/[0.12]'
                }`}
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <p className="text-red-400 text-xs mb-4">{error}</p>
      )}

      <div className="flex items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="border border-white/[0.08] rounded-xl px-5 py-2.5 text-sm text-white/60 hover:text-white hover:border-white/[0.16] transition-all"
        >
          Back
        </button>
        <button
          onClick={onComplete}
          disabled={!selected}
          className="flex items-center gap-2 bg-cb-primary hover:bg-cb-primary-hover disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm"
        >
          <span>Continue</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  )
}
