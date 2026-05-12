'use client'

import Link from 'next/link'
import { Bot, ArrowLeft, Shield } from 'lucide-react'

// ─── Data ─────────────────────────────────────────────────────────────────────

const subProcessors = [
  { service: 'Supabase', purpose: 'Database and vector storage', country: 'USA', href: 'https://supabase.com' },
  { service: 'Groq', purpose: 'LLM inference (chat responses)', country: 'USA', href: 'https://groq.com' },
  { service: 'Railway', purpose: 'Backend hosting', country: 'USA', href: 'https://railway.app' },
  { service: 'Vercel', purpose: 'Frontend hosting', country: 'USA', href: 'https://vercel.com' },
  { service: 'Stripe', purpose: 'Payment processing', country: 'USA', href: 'https://stripe.com' },
  { service: 'Google (Gmail)', purpose: 'Human handoff email alerts', country: 'USA', href: 'https://google.com' },
]

const rights = [
  { title: 'Right to access', desc: 'Request a copy of all personal data we hold about you.' },
  { title: 'Right to correct', desc: 'Ask us to fix inaccurate or incomplete data.' },
  { title: 'Right to delete', desc: 'Request deletion of your account and all associated data.' },
  { title: 'Right to portability', desc: 'Receive your data in a structured, machine-readable format.' },
  { title: 'Right to withdraw consent', desc: 'Opt out of any processing based on consent at any time.' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
      {children}
    </h2>
  )
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-8">
      {children}
    </div>
  )
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-2.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-gray-400 text-sm leading-relaxed">
          <span className="text-blue-400 mt-0.5 flex-shrink-0">&#10003;</span>
          {item}
        </li>
      ))}
    </ul>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TrustPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col">

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-950/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6 flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-blue-500" />
            <span className="font-bold text-xl text-white">CreoBot</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
        </div>
      </header>

      {/* PAGE HEADER */}
      <section className="flex flex-col items-center justify-center text-center px-6 pt-20 pb-14">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 mb-6">
          <Shield className="w-7 h-7 text-blue-400" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Trust &amp; Privacy
        </h1>
        <p className="text-gray-400 text-lg max-w-xl leading-relaxed">
          How CreoBot handles your data and your customers&apos; data
        </p>
      </section>

      {/* CONTENT */}
      <div className="max-w-4xl mx-auto w-full px-6 pb-24 flex flex-col gap-8">

        {/* 1. WHAT WE COLLECT */}
        <Card>
          <SectionHeading>What we collect</SectionHeading>
          <BulletList items={[
            'Account info - your email address and business name, collected at signup.',
            'Chat messages - stored to power conversation memory and analytics for your bot.',
            'Uploaded documents - stored in Supabase and used exclusively for your RAG (retrieval-augmented generation) pipeline.',
            'Usage data - message count, plan tier, and timestamps to enforce plan limits and improve the service.',
            'Payment info - processed entirely by Stripe. CreoBot never stores or sees your card details.',
          ]} />
        </Card>

        {/* 2. WHY WE COLLECT IT */}
        <Card>
          <SectionHeading>Why we collect it</SectionHeading>
          <BulletList items={[
            'To deliver the chatbot service - your documents and chat history are what power the bot.',
            'To enforce plan limits - message counts and plan tier determine what features are available.',
            'To send human handoff alerts - when your bot cannot answer, we email you using your registered address.',
            'To improve the product - aggregate, anonymized usage data helps us identify what to build next.',
          ]} />
        </Card>

        {/* 3. HOW LONG WE KEEP IT */}
        <Card>
          <SectionHeading>How long we keep it</SectionHeading>
          <div className="flex flex-col gap-4">
            {[
              { label: 'Account data', detail: 'Retained while your account is active. Deleted within 30 days of cancellation upon request.' },
              { label: 'Chat history', detail: 'Retained for 90 days, then purged automatically.' },
              { label: 'Uploaded documents', detail: 'Retained until you delete them from your dashboard. Deletion is immediate.' },
              { label: 'Payment records', detail: 'Retained as required by financial regulations (7 years), in line with Stripe\'s compliance obligations.' },
            ].map((row) => (
              <div key={row.label} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 border-b border-gray-800 last:border-0 pb-4 last:pb-0">
                <span className="text-white font-medium text-sm w-40 flex-shrink-0">{row.label}</span>
                <span className="text-gray-400 text-sm leading-relaxed">{row.detail}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* 4. SUB-PROCESSORS */}
        <Card>
          <SectionHeading>Sub-processors</SectionHeading>
          <p className="text-gray-400 text-sm mb-6 leading-relaxed">
            We use the following third-party services to operate CreoBot. Each is contractually bound to process data only as instructed.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 pr-6 text-gray-400 font-medium">Service</th>
                  <th className="text-left py-3 pr-6 text-gray-400 font-medium">Purpose</th>
                  <th className="text-left py-3 pr-6 text-gray-400 font-medium">Country</th>
                  <th className="text-left py-3 text-gray-400 font-medium">Link</th>
                </tr>
              </thead>
              <tbody>
                {subProcessors.map((sp, i) => (
                  <tr key={sp.service} className={i % 2 === 1 ? 'bg-gray-800/30' : ''}>
                    <td className="py-3.5 pr-6 text-white font-medium">{sp.service}</td>
                    <td className="py-3.5 pr-6 text-gray-400">{sp.purpose}</td>
                    <td className="py-3.5 pr-6 text-gray-400">{sp.country}</td>
                    <td className="py-3.5">
                      <a
                        href={'https://' + sp.href.replace('https://', '')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                      >
                        {sp.href.replace('https://', '')}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* 5. YOUR RIGHTS */}
        <Card>
          <SectionHeading>Your rights (GDPR Article 13)</SectionHeading>
          <div className="flex flex-col gap-4 mb-6">
            {rights.map((r) => (
              <div key={r.title} className="flex items-start gap-3">
                <span className="text-blue-400 mt-0.5 flex-shrink-0">&#10003;</span>
                <div>
                  <span className="text-white font-medium text-sm">{r.title}</span>
                  <span className="text-gray-400 text-sm"> - {r.desc}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
            <p className="text-gray-300 text-sm leading-relaxed">
              To exercise any of these rights, email{' '}
              <a href="mailto:creobot.alerts@gmail.com" className="text-blue-400 hover:text-blue-300 transition-colors">
                creobot.alerts@gmail.com
              </a>
              . We respond within <span className="text-white font-medium">30 days</span>.
            </p>
          </div>
        </Card>

        {/* 6. COOKIES */}
        <Card>
          <SectionHeading>Cookies</SectionHeading>
          <p className="text-gray-400 text-sm leading-relaxed mb-3">
            We use only functional cookies required for authentication - specifically the Supabase session cookie that keeps you logged in.
          </p>
          <BulletList items={[
            'No advertising cookies.',
            'No third-party tracking pixels.',
            'No analytics cookies shared with external ad networks.',
          ]} />
        </Card>

        {/* 7. DATA PROCESSING AGREEMENT */}
        <Card>
          <SectionHeading>Data Processing Agreement</SectionHeading>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            For business customers who require a formal DPA under GDPR Article 28, we are happy to provide one.
          </p>
          <div className="bg-gray-800/60 rounded-xl p-4 text-sm text-gray-300 leading-relaxed">
            Email{' '}
            <a href="mailto:creobot.alerts@gmail.com" className="text-blue-400 hover:text-blue-300 transition-colors">
              creobot.alerts@gmail.com
            </a>{' '}
            with the subject line{' '}
            <span className="text-white font-mono bg-gray-700/60 px-1.5 py-0.5 rounded text-xs">DPA Request</span>
            . We will provide a signed DPA within{' '}
            <span className="text-white font-medium">5 business days</span>.
          </div>
        </Card>

        {/* 8. CONTACT */}
        <Card>
          <SectionHeading>Contact</SectionHeading>
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex items-start gap-4">
              <span className="text-gray-500 w-36 flex-shrink-0">Data controller</span>
              <span className="text-white font-medium">CreoBot</span>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-gray-500 w-36 flex-shrink-0">Contact email</span>
              <a href="mailto:creobot.alerts@gmail.com" className="text-blue-400 hover:text-blue-300 transition-colors">
                creobot.alerts@gmail.com
              </a>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-gray-500 w-36 flex-shrink-0">Last updated</span>
              <span className="text-gray-400">May 2026</span>
            </div>
          </div>
        </Card>

      </div>

      {/* FOOTER */}
      <footer className="border-t border-gray-800 px-6 pt-8 pb-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-blue-500" />
            <span className="font-bold text-white">CreoBot</span>
          </div>
          <Link href="/" className="text-gray-500 text-xs hover:text-gray-300 transition-colors duration-200">
            Back to homepage
          </Link>
          <p className="text-gray-600 text-sm">&#169; 2026 CreoBot</p>
        </div>
      </footer>

    </main>
  )
}
