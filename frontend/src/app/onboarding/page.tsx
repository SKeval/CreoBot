'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bot, Check, Upload, Copy, Send, ChevronRight,
  Home, ShoppingCart, Scale, UtensilsCrossed, Headphones,
} from 'lucide-react'

const BOT_TEMPLATES = [
  { key: 'default',          label: 'General Assistant',    icon: 'Robot',           desc: 'A helpful assistant for any business type.' },
  { key: 'customer_service', label: 'Customer Service',     icon: 'Headphones',      desc: 'Resolves issues, handles complaints, retains customers.' },
  { key: 'restaurant',       label: 'Restaurant / Cafe',    icon: 'UtensilsCrossed', desc: 'Menu, reservations, dietary needs, hospitality.' },
  { key: 'real_estate',      label: 'Real Estate',          icon: 'Home',            desc: 'Property inquiries, viewings, buyer and seller support.' },
  { key: 'ecommerce',        label: 'E-commerce / Retail',  icon: 'ShoppingCart',    desc: 'Orders, returns, product questions, exchanges.' },
  { key: 'legal',            label: 'Legal / Professional', icon: 'Scale',           desc: 'Client intake, consultations, services, firm info.' },
]

const iconMap: Record<string, React.ElementType> = {
  Robot: Bot, Home, ShoppingCart, Scale, UtensilsCrossed, Headphones,
}

const TOTAL_STEPS = 4
const stepLabels = [
  'Name your bot',
  'Upload your knowledge base',
  'Add bot to your website',
  'Test your bot',
]

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [step, setStep] = useState(1)
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const [businessName, setBusinessName] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('default')
  const [step1Saving, setStep1Saving] = useState(false)
  const [step1Error, setStep1Error] = useState('')

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadMsg, setUploadMsg] = useState('')
  const [uploadError, setUploadError] = useState('')

  const [copied, setCopied] = useState(false)

  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([])
  const [chatInput, setChatInput] = useState('')
  const [chatSending, setChatSending] = useState(false)
  const [finishing, setFinishing] = useState(false)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUserId(user.id)
      const { data: profile } = await supabase
        .from('profiles').select('business_name').eq('id', user.id).single()
      if (profile?.business_name) setBusinessName(profile.business_name)
      setLoading(false)
    }
    init()
  }, [])

  const getEmbedCode = () => {
    if (!userId) return 'Loading...'
    return `<script>
  window.creobotConfig = {
    userId: "${userId}",
    backendUrl: "https://creobot-production.up.railway.app"
  };
</script>
<script src="https://creobot-production.up.railway.app/static/widget.js"></script>`
  }

  const handleStep1Next = async () => {
    if (!businessName.trim()) { setStep1Error('Please enter your business name.'); return }
    setStep1Error('')
    setStep1Saving(true)
    try {
      await supabase.from('profiles').update({ business_name: businessName.trim() }).eq('id', userId!)
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/set-template`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, template: selectedTemplate }),
      })
      setStep(2)
    } catch {
      setStep1Error('Something went wrong. Please try again.')
    } finally {
      setStep1Saving(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) { setSelectedFile(file); setUploadMsg(''); setUploadError('') }
  }

  const handleUploadAndContinue = async () => {
    if (!selectedFile || !userId) return
    setUploading(true)
    setUploadMsg('')
    setUploadError('')
    const formData = new FormData()
    formData.append('file', selectedFile)
    formData.append('user_id', userId)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/upload`, {
        method: 'POST', body: formData,
      })
      const data = await res.json()
      setUploadMsg(`Uploaded: ${data.chunks} chunks indexed`)
      setTimeout(() => setStep(3), 1500)
    } catch {
      setUploadError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(getEmbedCode())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const sendChat = async () => {
    if (!chatInput.trim() || chatSending) return
    const msg = chatInput.trim()
    setChatInput('')
    setChatMessages(prev => [...prev, { role: 'user', text: msg }])
    setChatSending(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, message: msg }),
      })
      const data = await res.json()
      setChatMessages(prev => [...prev, { role: 'bot', text: data.reply || data.response || 'Got your message!' }])
    } catch {
      setChatMessages(prev => [...prev, { role: 'bot', text: 'Could not reach the bot. Try again.' }])
    } finally {
      setChatSending(false)
    }
  }

  const handleFinish = async () => {
    setFinishing(true)
    await supabase.from('profiles').update({ onboarding_complete: true }).eq('id', userId!)
    router.push('/dashboard')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-400">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Loading...</span>
        </div>
      </div>
    )
  }

  const progressPercent = (step / TOTAL_STEPS) * 100

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <div className="border-b border-gray-800 bg-gray-900 px-8 py-4 flex items-center gap-6">
        <a href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white text-lg">CreoBot</span>
        </a>
        <div className="flex-1 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">{stepLabels[step - 1]}</span>
            <span className="text-xs text-gray-500">Step {step} of {TOTAL_STEPS}</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-1.5">
            <motion.div
              className="bg-blue-500 h-1.5 rounded-full"
              initial={false}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-start justify-center px-4 py-12">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-2xl"
            >
              <h1 className="text-2xl font-bold text-white mb-1">What is your business name?</h1>
              <p className="text-gray-400 text-sm mb-8">This will be shown to your customers in the chat widget.</p>

              <div className="mb-8">
                <input
                  type="text"
                  value={businessName}
                  onChange={e => setBusinessName(e.target.value)}
                  placeholder="e.g. Joe's Coffee Shop"
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                />
                {step1Error && <p className="text-red-400 text-xs mt-2">{step1Error}</p>}
              </div>

              <div className="mb-8">
                <p className="text-sm font-medium text-gray-300 mb-4">Choose your bot personality</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {BOT_TEMPLATES.map((t) => {
                    const Icon = iconMap[t.icon] || Bot
                    return (
                      <button
                        key={t.key}
                        onClick={() => setSelectedTemplate(t.key)}
                        className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all duration-200 ${
                          selectedTemplate === t.key
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-gray-700 bg-gray-900/60 hover:border-gray-600'
                        }`}
                      >
                        <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${selectedTemplate === t.key ? 'text-blue-400' : 'text-gray-400'}`} />
                        <div>
                          <div className={`text-sm font-medium ${selectedTemplate === t.key ? 'text-blue-300' : 'text-white'}`}>{t.label}</div>
                          <div className="text-gray-500 text-xs mt-0.5 leading-relaxed">{t.desc}</div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              <button
                onClick={handleStep1Next}
                disabled={step1Saving}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm"
              >
                {step1Saving ? 'Saving...' : <><span>Next</span><ChevronRight className="w-4 h-4" /></>}
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-2xl"
            >
              <h1 className="text-2xl font-bold text-white mb-1">Upload your first document</h1>
              <p className="text-gray-400 text-sm mb-8">Your bot will answer questions based on this file. PDF or TXT, max 10MB.</p>

              <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl py-16 cursor-pointer transition-colors mb-4 ${
                uploading
                  ? 'border-blue-500/50 bg-blue-500/5'
                  : selectedFile
                  ? 'border-green-500/40 bg-green-500/5'
                  : 'border-gray-700 hover:border-blue-500 hover:bg-blue-500/5'
              }`}>
                <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center mb-4">
                  {selectedFile && !uploading
                    ? <Check className="w-5 h-5 text-green-400" />
                    : <Upload className={`w-5 h-5 ${uploading ? 'text-blue-400 animate-bounce' : 'text-gray-400'}`} />
                  }
                </div>
                <span className="text-sm text-gray-300 font-medium mb-1">
                  {uploading ? 'Uploading...' : selectedFile ? selectedFile.name : 'Click to upload PDF or TXT'}
                </span>
                {!selectedFile && !uploading && <span className="text-xs text-gray-600">Max 10 MB</span>}
                <input
                  type="file"
                  accept=".pdf,.txt"
                  className="hidden"
                  onChange={handleFileSelect}
                  disabled={uploading}
                />
              </label>

              <AnimatePresence>
                {uploadMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 mb-6 text-green-400 text-sm bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-3"
                  >
                    <Check className="w-4 h-4 flex-shrink-0" />
                    {uploadMsg}
                  </motion.div>
                )}
                {uploadError && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 mb-6 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3"
                  >
                    {uploadError}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center gap-4">
                <button
                  onClick={handleUploadAndContinue}
                  disabled={!selectedFile || uploading}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm"
                >
                  {uploading ? 'Uploading...' : <><span>Upload and Continue</span><ChevronRight className="w-4 h-4" /></>}
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
                >
                  Skip for now
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-2xl"
            >
              <h1 className="text-2xl font-bold text-white mb-1">Copy your embed code</h1>
              <p className="text-gray-400 text-sm mb-8">Paste this before the closing body tag on your website.</p>

              <div className="relative mb-6">
                <pre className="bg-gray-900 border border-gray-700 rounded-xl p-5 text-sm text-green-400 overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
                  {getEmbedCode()}
                </pre>
                <button
                  onClick={handleCopy}
                  className={`absolute top-3 right-3 flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${
                    copied
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300 border border-gray-600'
                  }`}
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>

              <button
                onClick={() => setStep(4)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm"
              >
                <span>Continue</span><ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-2xl"
            >
              <h1 className="text-2xl font-bold text-white mb-1">Send a test message</h1>
              <p className="text-gray-400 text-sm mb-8">Make sure your bot is working before you go live.</p>

              <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden mb-6">
                <div className="h-72 overflow-y-auto p-4 flex flex-col gap-3">
                  {chatMessages.length === 0 && !chatSending && (
                    <div className="flex-1 flex items-center justify-center text-gray-600 text-sm">
                      Send a message to test your bot...
                    </div>
                  )}
                  {chatMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-blue-600 text-white rounded-br-sm'
                          : 'bg-gray-800 text-gray-200 rounded-bl-sm'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {chatSending && (
                    <div className="flex justify-start">
                      <div className="bg-gray-800 text-gray-400 px-4 py-2.5 rounded-2xl rounded-bl-sm text-sm">
                        <span className="inline-flex gap-1">
                          <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
                          <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
                          <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-800 px-4 py-3 flex items-center gap-3">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendChat()}
                    placeholder="Type a message..."
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  <button
                    onClick={sendChat}
                    disabled={chatSending || !chatInput.trim()}
                    className="w-9 h-9 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 flex items-center justify-center transition-colors flex-shrink-0"
                  >
                    <Send className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleFinish}
                disabled={finishing}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm"
              >
                {finishing ? 'Setting up...' : <><span>Go to Dashboard</span><ChevronRight className="w-4 h-4" /></>}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
