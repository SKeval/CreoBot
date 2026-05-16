'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bot, ChevronsRight, LayoutDashboard, Database, Code2,
  Users, LogOut, MessageSquare, Zap, Upload, Copy, Check,
  TrendingUp, Clock, ChevronRight, AlertCircle, Lock,
  Home, ShoppingCart, Scale, UtensilsCrossed, Headphones,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Profile {
  id: string
  business_name: string
  plan: string
  message_count: number
  trial_ends_at: string
  subscription_status: string
  zapier_webhook_url?: string
}

interface Handoff {
  id: string
  customer_contact: string
  customer_message: string
  created_at: string
}

type Section = 'overview' | 'knowledge' | 'embed' | 'leads' | 'integrations'

const PLAN_LIMITS: Record<string, number | null> = {
  free: 50,
  spark: 1000,
  blaze: null,
}

const BOT_TEMPLATES = [
  { key: 'default',          label: 'General Assistant',    icon: 'Robot',          desc: 'A helpful assistant for any business type.' },
  { key: 'customer_service', label: 'Customer Service',     icon: 'Headphones',     desc: 'Resolves issues, handles complaints, retains customers.' },
  { key: 'restaurant',       label: 'Restaurant / Cafe',    icon: 'UtensilsCrossed',desc: 'Menu, reservations, dietary needs, hospitality.' },
  { key: 'real_estate',      label: 'Real Estate',          icon: 'Home',           desc: 'Property inquiries, viewings, buyer and seller support.' },
  { key: 'ecommerce',        label: 'E-commerce / Retail',  icon: 'ShoppingCart',   desc: 'Orders, returns, product questions, exchanges.' },
  { key: 'legal',            label: 'Legal / Professional', icon: 'Scale',          desc: 'Client intake, consultations, services, firm info.' },
]

function trialDaysLeft(trial_ends_at: string): number {
  const diff = new Date(trial_ends_at).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const navItems = [
  { id: 'overview' as Section, label: 'Overview', Icon: LayoutDashboard },
  { id: 'knowledge' as Section, label: 'Knowledge Base', Icon: Database },
  { id: 'embed' as Section, label: 'Embed Code', Icon: Code2 },
  { id: 'leads' as Section, label: 'Captured Leads', Icon: Users },
  { id: 'integrations' as Section, label: 'Integrations', Icon: Zap },
]

function Sidebar({
  open, setOpen, active, setActive, profile, onLogout, isTrialing, daysLeft,
}: {
  open: boolean
  setOpen: (v: boolean) => void
  active: Section
  setActive: (s: Section) => void
  profile: Profile | null
  onLogout: () => void
  isTrialing: boolean
  daysLeft: number
}) {
  return (
    <nav className={`sticky top-0 h-screen shrink-0 flex flex-col border-r border-gray-800 bg-gray-900 transition-all duration-300 ease-in-out ${open ? 'w-64' : 'w-[70px]'}`}>

      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-800">
        <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
          <Bot className="w-5 h-5 text-white" />
        </div>
        {open && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="font-bold text-white text-lg"
          >
            CreoBot
          </motion.span>
        )}
      </div>

      {/* Nav items */}
      <div className="flex-1 py-4 px-2 space-y-1">
        {navItems.map(({ id, label, Icon }) => {
          const isActive = active === id
          return (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={`relative flex items-center h-10 w-full rounded-lg transition-all duration-150 ${
                isActive
                  ? 'bg-blue-600/15 text-blue-400 border-l-2 border-blue-500'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
              } ${open ? 'gap-3 px-3' : 'justify-center'}`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {open && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm font-medium"
                >
                  {label}
                </motion.span>
              )}
            </button>
          )
        })}
      </div>

      {/* Bottom: plan + sign out */}
      <div className="border-t border-gray-800 p-3 space-y-1">
        {open && profile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-3 py-2 mb-1"
          >
            <p className="text-xs text-gray-500 truncate">{profile.business_name}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="capitalize text-xs font-semibold text-white">{profile.plan}</span>
              {isTrialing && (
                <span className="text-xs bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded-full">
                  {daysLeft}d left
                </span>
              )}
            </div>
          </motion.div>
        )}

        <button
          onClick={onLogout}
          className={`flex items-center h-10 w-full rounded-lg text-gray-400 hover:bg-gray-800 hover:text-red-400 transition-all duration-150 ${open ? 'gap-3 px-3' : 'justify-center'}`}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {open && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm font-medium"
            >
              Sign out
            </motion.span>
          )}
        </button>
      </div>

      {/* Toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="border-t border-gray-800 flex items-center justify-center p-3 text-gray-500 hover:bg-gray-800 hover:text-gray-300 transition-colors"
      >
        <ChevronsRight className={`w-4 h-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
    </nav>
  )
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  label, value, sub, icon: Icon, iconBg, iconColor, bar, barValue,
}: {
  label: string
  value: string
  sub?: string
  icon: React.ElementType
  iconBg: string
  iconColor: string
  bar?: boolean
  barValue?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-colors"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${iconBg}`}>
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
        <TrendingUp className="w-4 h-4 text-green-500 opacity-60" />
      </div>
      <p className="text-sm text-gray-400 mb-1">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
      {bar && barValue !== undefined && (
        <div className="mt-3 w-full bg-gray-800 rounded-full h-1.5">
          <div
            className="bg-blue-500 h-1.5 rounded-full transition-all"
            style={{ width: `${barValue}%` }}
          />
        </div>
      )}
    </motion.div>
  )
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function SectionCard({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-gray-900 border border-gray-800 rounded-2xl p-6"
    >
      <h2 className="text-lg font-semibold text-white mb-1">{title}</h2>
      <p className="text-gray-400 text-sm mb-6">{desc}</p>
      {children}
    </motion.div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [handoffs, setHandoffs] = useState<Handoff[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadMsg, setUploadMsg] = useState('')
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [active, setActive] = useState<Section>('overview')
  const [selectedTemplate, setSelectedTemplate] = useState('default')
  const [templateSaving, setTemplateSaving] = useState(false)
  const [templateSaved, setTemplateSaved] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [zapierWebhookUrl, setZapierWebhookUrl] = useState('')
  const [zapierSaving, setZapierSaving] = useState(false)
  const [zapierSaved, setZapierSaved] = useState(false)
  const [zapierError, setZapierError] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUserId(user.id)
      setUserEmail(user.email ?? '')

      const { data: profileData } = await supabase
        .from('profiles').select('*').eq('id', user.id).single()

      const { data: handoffData } = await supabase
        .from('handoffs').select('*').eq('user_id', user.id)
        .order('created_at', { ascending: false }).limit(10)

      setProfile(profileData)
      setHandoffs(handoffData || [])
      if (profileData?.bot_template) setSelectedTemplate(profileData.bot_template)
      if (profileData?.zapier_webhook_url) setZapierWebhookUrl(profileData.zapier_webhook_url)
      setLoading(false)
    }
    load()
  }, [])

  const saveTemplate = async (key: string) => {
    setSelectedTemplate(key)
    setTemplateSaving(true)
    setTemplateSaved(false)
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/set-template`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: profile?.id, template: key }),
      })
      setTemplateSaved(true)
      setTimeout(() => setTemplateSaved(false), 2500)
    } catch (e) {
      console.error('Failed to save template', e)
    } finally {
      setTemplateSaving(false)
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadMsg('')
    if (!userId) return
    const formData = new FormData()
    formData.append('file', file)
    formData.append('user_id', userId)
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/upload`, {
      method: 'POST', body: formData,
    })
    const data = await res.json()
    setUploading(false)
    setUploadMsg(`Uploaded: ${data.chunks} chunks indexed`)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const handleUpgrade = async (plan: string) => {
    if (!userId) return
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, email: userEmail, plan }),
    })
    const data = await res.json()
    if (data.checkout_url) window.location.href = data.checkout_url
  }

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

  const handleCopy = () => {
    navigator.clipboard.writeText(getEmbedCode())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const saveZapierWebhook = async () => {
    setZapierSaving(true)
    setZapierError('')
    setZapierSaved(false)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/profile`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: profile?.id, zapier_webhook_url: zapierWebhookUrl }),
      })
      if (!res.ok) throw new Error('Failed to save')
      setZapierSaved(true)
      setTimeout(() => setZapierSaved(false), 2500)
    } catch {
      setZapierError('Failed to save webhook URL. Please try again.')
    } finally {
      setZapierSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-400">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Loading dashboard...</span>
        </div>
      </div>
    )
  }

  const limit = profile ? PLAN_LIMITS[profile.plan] : 50
  const usage = profile?.message_count || 0
  const usagePercent = limit ? Math.min((usage / limit) * 100, 100) : 0
  const daysLeft = profile?.trial_ends_at ? trialDaysLeft(profile.trial_ends_at) : 0
  const isTrialing = profile?.subscription_status === 'trialing' && daysLeft > 0

  const sectionTitles: Record<Section, { title: string; crumb: string }> = {
    overview: { title: 'Overview', crumb: 'Dashboard' },
    knowledge: { title: 'Knowledge Base', crumb: 'Knowledge Base' },
    embed: { title: 'Embed Code', crumb: 'Embed Code' },
    leads: { title: 'Captured Leads', crumb: 'Leads' },
    integrations: { title: 'Integrations', crumb: 'Integrations' },
  }

  return (
    <div className="flex min-h-screen bg-gray-950 text-white">

      <Sidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        active={active}
        setActive={setActive}
        profile={profile}
        onLogout={handleLogout}
        isTrialing={isTrialing}
        daysLeft={daysLeft}
      />

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar */}
        <header className="sticky top-0 z-10 bg-gray-950/80 backdrop-blur-md border-b border-gray-800 px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Dashboard</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white font-medium">{sectionTitles[active].crumb}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">{profile?.business_name}</span>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
              profile?.plan === 'blaze'
                ? 'bg-purple-500/20 text-purple-400'
                : profile?.plan === 'spark'
                ? 'bg-blue-500/20 text-blue-400'
                : 'bg-gray-700 text-gray-400'
            }`}>
              {profile?.plan}
            </span>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 px-8 py-8 max-w-5xl w-full mx-auto">

          <AnimatePresence mode="wait">
            {active === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    Welcome back, {profile?.business_name}
                  </h1>
                  <p className="text-gray-400 text-sm mt-1">Here is what is happening with your bot today.</p>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  <StatCard
                    label="Messages Used"
                    value={`${usage}`}
                    sub={`of ${limit === null ? 'unlimited' : limit} this month`}
                    icon={MessageSquare}
                    iconBg="bg-blue-500/10"
                    iconColor="text-blue-400"
                    bar={limit !== null}
                    barValue={usagePercent}
                  />
                  <StatCard
                    label="Current Plan"
                    value={profile?.plan ? profile.plan.charAt(0).toUpperCase() + profile.plan.slice(1) : ''}
                    sub={isTrialing ? `Trial ends in ${daysLeft} days` : 'Active'}
                    icon={Zap}
                    iconBg="bg-yellow-500/10"
                    iconColor="text-yellow-400"
                  />
                  <StatCard
                    label="Captured Leads"
                    value={`${handoffs.length}`}
                    sub="Total human handoffs"
                    icon={Users}
                    iconBg="bg-green-500/10"
                    iconColor="text-green-400"
                  />
                  <StatCard
                    label="Status"
                    value="Live"
                    sub="Bot is active"
                    icon={TrendingUp}
                    iconBg="bg-purple-500/10"
                    iconColor="text-purple-400"
                  />
                </div>

                {/* Upgrade banner */}
                {(profile?.plan === 'free' || profile?.plan === 'spark') && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-6 flex items-center justify-between gap-6"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Zap className="w-4 h-4 text-blue-400" />
                        <p className="font-semibold text-white text-sm">Unlock more with a higher plan</p>
                      </div>
                      <p className="text-gray-400 text-xs">Get unlimited messages, more docs, and priority support.</p>
                    </div>
                    <div className="flex gap-3 flex-shrink-0">
                      {profile?.plan !== 'spark' && (
                        <button
                          onClick={() => handleUpgrade('spark')}
                          className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                        >
                          Spark ($19/mo)
                        </button>
                      )}
                      <button
                        onClick={() => handleUpgrade('blaze')}
                        className="bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                      >
                        Blaze ($49/mo)
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Quick nav cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { section: 'knowledge' as Section, icon: Database, label: 'Knowledge Base', desc: 'Upload your business documents' },
                    { section: 'embed' as Section, icon: Code2, label: 'Embed Code', desc: 'Add the chatbot to your website' },
                    { section: 'leads' as Section, icon: Users, label: 'Captured Leads', desc: `${handoffs.length} leads waiting for you` },
                  ].map(({ section, icon: Icon, label, desc }) => (
                    <button
                      key={section}
                      onClick={() => setActive(section)}
                      className="group bg-gray-900 border border-gray-800 rounded-2xl p-5 text-left hover:border-gray-700 hover:bg-gray-800/50 transition-all duration-200"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-800 group-hover:bg-gray-700 flex items-center justify-center transition-colors">
                          <Icon className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
                      </div>
                      <p className="text-sm font-semibold text-white">{label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {active === 'knowledge' && (
              <motion.div
                key="knowledge"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
                  <div className="flex items-center justify-between mb-1">
                    <h2 className="text-white font-semibold text-lg">Bot Personality</h2>
                    {templateSaved && <span className="text-green-400 text-sm font-medium">Saved</span>}
                  </div>
                  <p className="text-gray-400 text-sm mb-5">Choose the personality that matches your business. This shapes how your bot communicates with customers.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {BOT_TEMPLATES.map((t) => {
                      const icons = { Robot: Bot, Home: Home, ShoppingCart: ShoppingCart, Scale: Scale, UtensilsCrossed: UtensilsCrossed, Headphones: Headphones }
                      const Icon = icons[t.icon as keyof typeof icons] || Bot
                      return (
                        <button
                          key={t.key}
                          onClick={() => saveTemplate(t.key)}
                          disabled={templateSaving}
                          className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all duration-200 ${
                            selectedTemplate === t.key
                              ? 'border-blue-500 bg-blue-500/10'
                              : 'border-gray-700 bg-gray-800/40 hover:border-gray-600'
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

                <SectionCard
                  title="Business Knowledge Base"
                  desc="Upload PDF or TXT files. Your bot answers only from these docs."
                >
                  <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl py-14 cursor-pointer transition-colors ${
                    uploading
                      ? 'border-blue-500/50 bg-blue-500/5'
                      : 'border-gray-700 hover:border-blue-500 hover:bg-blue-500/5'
                  }`}>
                    <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center mb-4">
                      <Upload className={`w-5 h-5 ${uploading ? 'text-blue-400 animate-bounce' : 'text-gray-400'}`} />
                    </div>
                    <span className="text-sm text-gray-300 font-medium mb-1">
                      {uploading ? 'Uploading...' : 'Click to upload PDF or TXT'}
                    </span>
                    <span className="text-xs text-gray-600">Max 10 MB</span>
                    <input
                      type="file"
                      accept=".pdf,.txt"
                      className="hidden"
                      onChange={handleUpload}
                      disabled={uploading}
                    />
                  </label>
                  <AnimatePresence>
                    {uploadMsg && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2 mt-4 text-green-400 text-sm bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-3"
                      >
                        <Check className="w-4 h-4 flex-shrink-0" />
                        {uploadMsg}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </SectionCard>
              </motion.div>
            )}

            {active === 'embed' && (
              <motion.div
                key="embed"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
              >
                <SectionCard
                  title="Your Embed Code"
                  desc="Paste this snippet into your website to add the chatbot widget."
                >
                  <div className="relative">
                    <pre className="bg-gray-800/60 border border-gray-700 rounded-xl p-5 text-sm text-green-400 overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
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
                  <div className="mt-4 flex items-start gap-3 bg-blue-500/5 border border-blue-500/20 rounded-xl px-4 py-3">
                    <AlertCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-400">
                      Paste both script tags before the closing <code className="text-blue-400">&lt;/body&gt;</code> tag of your website. The widget will appear as a chat bubble in the bottom-right corner.
                    </p>
                  </div>
                </SectionCard>
              </motion.div>
            )}

            {active === 'leads' && (
              <motion.div
                key="leads"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
              >
                <SectionCard
                  title="Captured Leads"
                  desc="Customers who requested human follow-up through your chatbot."
                >
                  {handoffs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-14 text-center">
                      <div className="w-14 h-14 rounded-2xl bg-gray-800 flex items-center justify-center mb-4">
                        <Users className="w-6 h-6 text-gray-600" />
                      </div>
                      <p className="text-gray-400 text-sm font-medium mb-1">No leads yet</p>
                      <p className="text-gray-600 text-xs max-w-xs">
                        They will appear here when customers ask for human help through your chatbot.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {handoffs.map((h, i) => (
                        <motion.div
                          key={h.id}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: i * 0.05 }}
                          className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 hover:border-gray-600 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-blue-600/20 flex items-center justify-center">
                                <span className="text-blue-400 text-xs font-bold">
                                  {h.customer_contact?.[0]?.toUpperCase() ?? '?'}
                                </span>
                              </div>
                              <span className="text-white text-sm font-medium">{h.customer_contact}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                              <Clock className="w-3 h-3" />
                              {new Date(h.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                          </div>
                          <p className="text-gray-400 text-sm leading-relaxed pl-9">{h.customer_message}</p>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </SectionCard>
              </motion.div>
            )}
            {active === 'integrations' && (
              <motion.div
                key="integrations"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
              >
                <SectionCard
                  title="Zapier Integration"
                  desc="Connect CreoBot to 6,000+ apps. When a lead is captured (human handoff triggered), CreoBot will POST lead data to your Zapier webhook automatically."
                >
                  {profile?.plan === 'free' ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gray-800 flex items-center justify-center">
                        <Lock className="w-5 h-5 text-gray-500" />
                      </div>
                      <div>
                        <p className="text-gray-300 text-sm font-medium mb-1">Zapier integration is available on Spark and Blaze plans.</p>
                        <p className="text-gray-500 text-xs">Upgrade to automatically send lead data to any app in the Zapier ecosystem.</p>
                      </div>
                      <a
                        href="/pricing"
                        className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
                      >
                        Upgrade Plan
                      </a>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <ol className="space-y-2 text-sm text-gray-400">
                        <li className="flex gap-3">
                          <span className="w-5 h-5 rounded-full bg-blue-600/20 text-blue-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                          <span>Go to <span className="text-white">zapier.com</span> and create a new Zap</span>
                        </li>
                        <li className="flex gap-3">
                          <span className="w-5 h-5 rounded-full bg-blue-600/20 text-blue-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                          <span>Choose trigger - <span className="text-white">Webhooks by Zapier</span> then <span className="text-white">Catch Hook</span></span>
                        </li>
                        <li className="flex gap-3">
                          <span className="w-5 h-5 rounded-full bg-blue-600/20 text-blue-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                          <span>Copy your webhook URL from Zapier and paste it below</span>
                        </li>
                        <li className="flex gap-3">
                          <span className="w-5 h-5 rounded-full bg-blue-600/20 text-blue-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">4</span>
                          <span>Test it by triggering a handoff in your widget</span>
                        </li>
                      </ol>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Zapier Webhook URL</label>
                        <input
                          type="url"
                          value={zapierWebhookUrl}
                          onChange={(e) => setZapierWebhookUrl(e.target.value)}
                          placeholder="https://hooks.zapier.com/hooks/catch/..."
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={saveZapierWebhook}
                          disabled={zapierSaving}
                          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
                        >
                          {zapierSaving ? 'Saving...' : 'Save Webhook'}
                        </button>
                        <AnimatePresence>
                          {zapierSaved && (
                            <motion.span
                              initial={{ opacity: 0, x: -4 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0 }}
                              className="flex items-center gap-1.5 text-green-400 text-sm"
                            >
                              <Check className="w-4 h-4" />
                              Webhook saved
                            </motion.span>
                          )}
                          {zapierError && (
                            <motion.span
                              initial={{ opacity: 0, x: -4 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0 }}
                              className="flex items-center gap-1.5 text-red-400 text-sm"
                            >
                              <AlertCircle className="w-4 h-4" />
                              {zapierError}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">Payload preview</p>
                        <pre className="bg-gray-800/60 border border-gray-700 rounded-xl p-5 text-sm text-green-400 overflow-x-auto whitespace-pre font-mono leading-relaxed">{`{
  "event": "handoff_triggered",
  "business_name": "Your business name",
  "user_id": "uuid",
  "conversation_id": "uuid",
  "customer_message": "The message that triggered handoff",
  "timestamp": "2026-05-12T10:00:00Z",
  "reason": "low_confidence"
}`}</pre>
                      </div>
                    </div>
                  )}
                </SectionCard>
              </motion.div>
            )}

          </AnimatePresence>

        </div>
      </div>
    </div>
  )
}
