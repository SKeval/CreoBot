'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    plan: 'free',
    features: ['50 messages / month', '1 document upload', 'Widget embed', 'Community support'],
    cta: 'Get Started',
    highlight: false,
  },
  {
    name: 'Spark',
    price: '$19',
    period: 'per month',
    plan: 'spark',
    features: ['500 messages / month', 'Unlimited uploads', 'Widget embed', 'Human handoff alerts', 'Email support'],
    cta: 'Start 14-day Trial',
    highlight: false,
  },
  {
    name: 'Blaze',
    price: '$49',
    period: 'per month',
    plan: 'blaze',
    features: ['Unlimited messages', 'Unlimited uploads', 'Widget embed', 'Human handoff alerts', 'Priority support'],
    cta: 'Start 14-day Trial',
    highlight: true,
  },
]

export default function Pricing() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
  }, [])

  const handleSubscribe = async (plan: string) => {
    if (!user) { router.push('/login'); return }
    if (plan === 'free') { router.push('/signup'); return }
    setLoading(plan)
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user.id, email: user.email, plan })
    })
    const data = await res.json()
    if (data.checkout_url) window.location.href = data.checkout_url
    else setLoading(null)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">CreoBot</Link>
        <div className="flex gap-4">
          <Link href="/login" className="text-sm text-gray-400 hover:text-white">Sign in</Link>
          <Link href="/signup" className="text-sm bg-blue-600 hover:bg-blue-500 px-4 py-1.5 rounded-lg font-medium transition">
            Get started
          </Link>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3">Simple Pricing</h1>
          <p className="text-gray-400">Start free. Upgrade when ready. Cancel anytime.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((p) => (
            <div
              key={p.name}
              className={`relative rounded-2xl border p-8 flex flex-col gap-6 ${
                p.highlight ? 'border-purple-500 bg-purple-500/5' : 'border-gray-800 bg-gray-900'
              }`}
            >
              {p.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Most Popular
                </span>
              )}
              <div>
                <h2 className="text-xl font-bold">{p.name}</h2>
                <div className="mt-2">
                  <span className="text-4xl font-bold">{p.price}</span>
                  <span className="text-gray-400 text-sm ml-1">{p.period}</span>
                </div>
              </div>
              <ul className="flex flex-col gap-2 flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                    <span className="text-green-400">✓</span> {f}
                  </li>
                ))}
              </ul>
              <button
                disabled={loading === p.plan}
                onClick={() => handleSubscribe(p.plan)}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition ${
                  p.highlight
                    ? 'bg-purple-600 hover:bg-purple-500 text-white'
                    : 'bg-gray-700 hover:bg-gray-600 text-white'
                } disabled:opacity-50`}
              >
                {loading === p.plan ? 'Redirecting...' : p.cta}
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}