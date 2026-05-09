'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface Profile {
  id: string
  business_name: string
  plan: string
  message_count: number
  trial_ends_at: string
  subscription_status: string
}

interface Handoff {
  id: string
  customer_contact: string
  customer_message: string
  created_at: string
}

const PLAN_LIMITS: Record<string, number | null> = {
  free: 50,
  spark: 500,
  blaze: null
}

function trialDaysLeft(trial_ends_at: string): number {
  const diff = new Date(trial_ends_at).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [handoffs, setHandoffs] = useState<Handoff[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadMsg, setUploadMsg] = useState('')
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: profileData } = await supabase
        .from('profiles').select('*').eq('id', user.id).single()

      const { data: handoffData } = await supabase
        .from('handoffs').select('*').eq('user_id', user.id)
        .order('created_at', { ascending: false }).limit(10)

      setProfile(profileData)
      setHandoffs(handoffData || [])
      setLoading(false)
    }
    load()
  }, [])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadMsg('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const formData = new FormData()
    formData.append('file', file)
    formData.append('user_id', user.id)
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/upload`, {
      method: 'POST', body: formData
    })
    const data = await res.json()
    setUploading(false)
    setUploadMsg(`✅ Uploaded — ${data.chunks} chunks indexed`)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const handleUpgrade = async (plan: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user.id, email: user.email, plan })
    })
    const data = await res.json()
    if (data.checkout_url) window.location.href = data.checkout_url
  }

  const getEmbedCode = () => {
    if (!profile?.id) return 'Loading...'
    return `<script>
  window.creobotConfig = {
    userId: "${profile.id}",
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

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <p className="text-gray-400">Loading...</p>
    </div>
  )

  const limit = profile ? PLAN_LIMITS[profile.plan] : 50
  const usage = profile?.message_count || 0
  const usagePercent = limit ? Math.min((usage / limit) * 100, 100) : 0
  const daysLeft = profile?.trial_ends_at ? trialDaysLeft(profile.trial_ends_at) : 0
  const isTrialing = profile?.subscription_status === 'trialing' && daysLeft > 0

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">CreoBot</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">{profile?.business_name}</span>
          <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-white transition">
            Sign out
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">

        {/* Plan + Usage */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gray-400 text-sm">Current Plan</p>
              <p className="text-2xl font-bold capitalize">{profile?.plan}</p>
              {isTrialing && (
                <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full mt-1 inline-block">
                  Trial — {daysLeft}d left
                </span>
              )}
            </div>
            {(profile?.plan === 'free' || profile?.plan === 'spark') && (
              <div className="flex gap-3">
                {profile?.plan !== 'spark' && (
                  <button
                    onClick={() => handleUpgrade('spark')}
                    className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
                  >
                    Upgrade to Spark — $19/mo
                  </button>
                )}
                <button
                  onClick={() => handleUpgrade('blaze')}
                  className="bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
                >
                  Upgrade to Blaze — $49/mo
                </button>
              </div>
            )}
          </div>

          <div>
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Messages used</span>
              <span>{usage} / {limit === null ? '∞' : limit}</span>
            </div>
            {limit && (
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${usagePercent}%` }} />
              </div>
            )}
          </div>
        </div>

        {/* Upload */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-1">Business Knowledge Base</h2>
          <p className="text-gray-400 text-sm mb-6">Upload PDF or TXT files — your bot answers only from these docs</p>
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-700 rounded-xl py-10 cursor-pointer hover:border-blue-500 transition">
            <span className="text-gray-400 text-sm mb-2">
              {uploading ? 'Uploading...' : 'Click to upload PDF or TXT'}
            </span>
            <span className="text-gray-600 text-xs">Max 10MB</span>
            <input type="file" accept=".pdf,.txt" className="hidden" onChange={handleUpload} disabled={uploading} />
          </label>
          {uploadMsg && <p className="text-green-400 text-sm mt-4">{uploadMsg}</p>}
        </div>

        {/* Embed Code */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-1">Your Embed Code</h2>
          <p className="text-gray-400 text-sm mb-4">Paste this into your website to add the chatbot</p>
          <pre className="bg-gray-800 rounded-xl p-4 text-sm text-green-400 overflow-x-auto whitespace-pre-wrap">
            {getEmbedCode()}
          </pre>
          <button
            onClick={handleCopy}
            className="mt-3 bg-gray-700 hover:bg-gray-600 text-white text-sm px-4 py-2 rounded-lg transition"
          >
            {copied ? '✅ Copied!' : 'Copy code'}
          </button>
        </div>

        {/* Handoffs */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-1">Captured Leads</h2>
          <p className="text-gray-400 text-sm mb-6">Customers who needed human follow-up</p>
          {handoffs.length === 0 ? (
            <p className="text-gray-600 text-sm">No leads yet — they will appear here when customers ask for help.</p>
          ) : (
            <div className="space-y-4">
              {handoffs.map(h => (
                <div key={h.id} className="bg-gray-800 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-medium">{h.customer_contact}</span>
                    <span className="text-gray-500 text-xs">{new Date(h.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-400 text-sm">{h.customer_message}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}