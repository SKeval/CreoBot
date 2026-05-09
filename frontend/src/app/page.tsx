import Link from 'next/link'

const features = [
  {
    icon: '🧠',
    title: 'Zero Hallucination',
    desc: 'Answers only from your uploaded docs. Never makes things up.'
  },
  {
    icon: '💬',
    title: 'Conversation Memory',
    desc: 'Remembers context across the full session like a real agent.'
  },
  {
    icon: '🔌',
    title: 'Embeddable Widget',
    desc: 'One script tag. Live on your website in under 2 minutes.'
  },
  {
    icon: '🤝',
    title: 'Human Handoff',
    desc: 'Auto-alerts your team when a customer needs real help.'
  },
]

const steps = [
  { step: '01', title: 'Sign up', desc: 'Create your account — no credit card needed.' },
  { step: '02', title: 'Upload your docs', desc: 'PDF or TXT — menus, FAQs, policies, anything.' },
  { step: '03', title: 'Embed on your site', desc: 'Copy one script tag. Done.' },
]

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    features: ['50 messages / month', '1 document', 'Widget embed'],
    cta: 'Get started',
    href: '/signup',
    highlight: false,
  },
  {
    name: 'Spark',
    price: '$19',
    period: 'per month',
    features: ['500 messages / month', 'Unlimited docs', 'Human handoff alerts', 'Email support'],
    cta: 'Start free trial',
    href: '/signup',
    highlight: false,
  },
  {
    name: 'Blaze',
    price: '$49',
    period: 'per month',
    features: ['Unlimited messages', 'Unlimited docs', 'Human handoff alerts', 'Priority support'],
    cta: 'Start free trial',
    href: '/signup',
    highlight: true,
  },
]

export default function Landing() {
  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col">

      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-800">
        <span className="font-bold text-xl">CreoBot</span>
        <div className="flex items-center gap-6">
          <Link href="/pricing" className="text-sm text-gray-400 hover:text-white transition">Pricing</Link>
          <Link href="/login" className="text-sm text-gray-400 hover:text-white transition">Sign in</Link>
          <Link href="/signup" className="text-sm bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg font-medium transition">
            Get started free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-28">
        <span className="text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full mb-6 uppercase tracking-widest">
          AI Chatbot for Small Business
        </span>
        <h1 className="text-5xl md:text-7xl font-bold leading-tight max-w-4xl">
          Your business,<br />
          <span className="text-blue-400">always available.</span>
        </h1>
        <p className="text-gray-400 text-xl mt-6 max-w-2xl">
          Upload your docs. CreoBot handles customer questions 24/7 — with zero hallucination and instant human handoff.
        </p>
        <div className="flex gap-4 mt-10">
          <Link href="/signup" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold transition">
            Start free — 14 days
          </Link>
          <Link href="/pricing" className="border border-gray-700 hover:border-gray-500 px-8 py-3 rounded-lg text-gray-300 hover:text-white transition">
            See pricing
          </Link>
        </div>
        <p className="text-gray-600 text-sm mt-4">No credit card required</p>
      </section>

      {/* Features */}
      <section className="px-8 py-16 max-w-6xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-center mb-12">Everything your business needs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div key={f.title} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-8 py-16 bg-gray-900/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Live in 3 steps</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s) => (
              <div key={s.step} className="text-center">
                <div className="text-5xl font-bold text-blue-500/30 mb-4">{s.step}</div>
                <h3 className="font-semibold text-white text-lg mb-2">{s.title}</h3>
                <p className="text-gray-400 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-8 py-16 max-w-5xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-center mb-3">Simple pricing</h2>
        <p className="text-gray-400 text-center mb-12">Start free. Upgrade when ready. Cancel anytime.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`relative rounded-2xl border p-8 flex flex-col gap-6 ${
                p.highlight ? 'border-blue-500 bg-blue-500/5' : 'border-gray-800 bg-gray-900'
              }`}
            >
              {p.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Most Popular
                </span>
              )}
              <div>
                <h3 className="text-xl font-bold">{p.name}</h3>
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
              <Link
                href={p.href}
                className={`w-full text-center py-3 rounded-xl font-semibold text-sm transition ${
                  p.highlight
                    ? 'bg-blue-600 hover:bg-blue-500 text-white'
                    : 'bg-gray-800 hover:bg-gray-700 text-white'
                }`}
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 py-20 text-center">
        <h2 className="text-4xl font-bold mb-4">Ready to automate your customer support?</h2>
        <p className="text-gray-400 mb-8">Join businesses using CreoBot to save time and never miss a lead.</p>
        <Link href="/signup" className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-lg font-semibold text-lg transition">
          Start your free trial
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-8 py-6 flex items-center justify-between text-sm text-gray-600">
        <span>© 2026 CreoBot</span>
        <div className="flex gap-6">
          <Link href="/pricing" className="hover:text-gray-400 transition">Pricing</Link>
          <Link href="/login" className="hover:text-gray-400 transition">Sign in</Link>
          <Link href="/signup" className="hover:text-gray-400 transition">Sign up</Link>
        </div>
      </footer>

    </main>
  )
}