'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, ChevronDown } from 'lucide-react'
import { CreoBotNavbar } from '@/components/ui/creobot-navbar'

// ─── Data ────────────────────────────────────────────────────────────────────

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    features: [
      '50 messages / month',
      '1 document',
      'Embeddable widget',
      'CreoBot branding',
    ],
    cta: 'Get started free',
    href: '/signup',
    highlight: false,
    note: '',
  },
  {
    name: 'Spark',
    price: '$19',
    period: 'per month',
    features: [
      '1,000 messages / month',
      '5 documents',
      'Human handoff via email',
      'Remove CreoBot branding',
      'Email support',
      '14-day free trial',
    ],
    cta: 'Start free trial',
    href: '/signup',
    highlight: false,
    note: 'No credit card required',
  },
  {
    name: 'Blaze',
    price: '$49',
    period: 'per month',
    features: [
      'Unlimited messages',
      'Unlimited documents',
      'Human handoff via email',
      'Analytics dashboard',
      'Priority support',
      '14-day free trial',
    ],
    cta: 'Start free trial',
    href: '/signup',
    highlight: true,
    note: 'No credit card required',
  },
]

type TableRow = {
  feature: string
  free: string | boolean
  spark: string | boolean
  blaze: string | boolean
  type: 'text' | 'bool'
}

const tableRows: TableRow[] = [
  { feature: 'Messages per month',     free: '50',       spark: '1,000',    blaze: 'Unlimited', type: 'text' },
  { feature: 'Documents',              free: '1',        spark: '5',        blaze: 'Unlimited', type: 'text' },
  { feature: 'Embeddable widget',      free: true,       spark: true,       blaze: true,        type: 'bool' },
  { feature: 'Human handoff via email',free: false,      spark: true,       blaze: true,        type: 'bool' },
  { feature: 'Remove CreoBot branding',free: false,      spark: true,       blaze: true,        type: 'bool' },
  { feature: 'Analytics dashboard',    free: false,      spark: false,      blaze: true,        type: 'bool' },
  { feature: 'Priority support',       free: false,      spark: false,      blaze: true,        type: 'bool' },
  { feature: '14-day free trial',      free: false,      spark: true,       blaze: true,        type: 'bool' },
]

const faqs = [
  {
    q: 'Is there a free trial?',
    a: 'Yes. Spark and Blaze both come with a 14-day free trial. No credit card required to start.',
  },
  {
    q: 'What counts as a message?',
    a: "Every time a customer sends a message to your bot, that's one message. Bot replies don't count.",
  },
  {
    q: 'What happens if I go over my message limit?',
    a: "On the Free and Spark plans, the bot will stop responding until the next billing cycle. We'll email you before you hit the limit.",
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. Cancel from your dashboard at any time. No questions asked, no cancellation fees.',
  },
  {
    q: 'Do you charge per question like other AI tools?',
    a: "No. CreoBot uses flat monthly pricing. You always know what you'll pay. No per-message fees, no overage surprises.",
  },
  {
    q: 'Can I switch plans?',
    a: 'Yes. Upgrade or downgrade anytime from your dashboard. Changes apply immediately.',
  },
]

// ─── Animation Variants ───────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function Cell({ value, type }: { value: string | boolean; type: 'text' | 'bool' }) {
  if (type === 'text') {
    return (
      <td className="px-6 py-4 text-center text-sm text-gray-300">
        {value as string}
      </td>
    )
  }
  return (
    <td className="px-6 py-4 text-center text-sm">
      {value ? (
        <span className="text-green-400">&#10003;</span>
      ) : (
        <span className="text-gray-600">-</span>
      )}
    </td>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col">

      {/* 1. NAVBAR */}
      <CreoBotNavbar />

      {/* 2. HERO */}
      <section className="flex flex-col items-center justify-center text-center px-6 pt-24 pb-16">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-4 py-1.5 rounded-full mb-8 uppercase tracking-widest"
        >
          Pricing
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold tracking-tight mb-6"
        >
          Simple, flat pricing
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-gray-400 text-lg max-w-xl"
        >
          No per-message fees. No sales calls. No surprises. Start free and upgrade when you're ready.
        </motion.p>
      </section>

      {/* 3. PRICING CARDS */}
      <section className="px-6 pb-24 max-w-5xl mx-auto w-full">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {plans.map((p) => (
            <motion.div
              key={p.name}
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className={`relative rounded-2xl border p-8 flex flex-col gap-6 transition-colors duration-200 ${
                p.highlight
                  ? 'border-blue-500 bg-blue-500/5'
                  : 'border-gray-800 bg-gray-900 hover:border-gray-700'
              }`}
            >
              {p.highlight && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-semibold px-4 py-1 rounded-full">
                  Most Popular
                </span>
              )}
              <div>
                <h3 className="text-xl font-bold">{p.name}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{p.price}</span>
                  <span className="text-gray-400 text-sm">/{p.period}</span>
                </div>
              </div>
              <ul className="flex flex-col gap-3 flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-gray-300">
                    <span className="text-green-400 text-base leading-none">&#10003;</span>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-2">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href={p.href}
                    className={`block w-full text-center py-3 rounded-lg font-semibold text-sm transition-colors duration-200 ${
                      p.highlight
                        ? 'bg-blue-600 hover:bg-blue-500 text-white'
                        : 'bg-gray-800 hover:bg-gray-700 text-white'
                    }`}
                  >
                    {p.cta}
                  </Link>
                </motion.div>
                {p.note && (
                  <p className="text-center text-gray-600 text-xs">{p.note}</p>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 4. COMPARISON TABLE */}
      <section className="bg-gray-900/40 border-t border-gray-800 px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold text-center mb-8"
          >
            Compare plans
          </motion.h2>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden"
          >
            <table className="w-full">
              <thead>
                <tr className="bg-gray-800/50">
                  <th className="px-6 py-4 text-left text-sm text-gray-400 font-medium">Feature</th>
                  <th className="px-6 py-4 text-center text-sm text-gray-400 font-medium">Free</th>
                  <th className="px-6 py-4 text-center text-sm text-gray-400 font-medium">Spark</th>
                  <th className="px-6 py-4 text-center text-sm text-gray-400 font-medium">Blaze</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 1 ? 'bg-gray-900/40' : ''}>
                    <td className="px-6 py-4 text-sm font-medium text-white">{row.feature}</td>
                    <Cell value={row.free}  type={row.type} />
                    <Cell value={row.spark} type={row.type} />
                    <Cell value={row.blaze} type={row.type} />
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* 5. FAQ */}
      <section className="px-6 py-24">
        <div className="max-w-3xl mx-auto">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-14"
          >
            Frequently asked questions
          </motion.h2>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col divide-y divide-gray-800"
          >
            {faqs.map((faq, i) => (
              <motion.div key={i} variants={fadeUp} transition={{ duration: 0.5 }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between py-5 text-left group"
                >
                  <span className="font-medium text-white group-hover:text-blue-400 transition-colors duration-200 pr-4">
                    {faq.q}
                  </span>
                  <motion.span
                    animate={{ rotate: openFaq === i ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-gray-400 flex-shrink-0"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <p className="text-gray-400 text-sm leading-relaxed pb-5 pr-8">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 6. ENTERPRISE NOTE */}
      <section className="bg-gray-900/40 border-t border-gray-800 py-16 text-center px-6">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-gray-400 mb-3">
            Need more than Blaze? We offer custom plans for agencies and larger businesses.
          </p>
          <a
            href="mailto:creoadsai@gmail.com"
            className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
          >
            Contact us &rarr;
          </a>
        </motion.div>
      </section>

      {/* 7. FOOTER */}
      <footer className="border-t border-gray-800 px-6 pt-8 pb-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center sm:items-start gap-1">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-blue-500" />
              <span className="font-bold text-white">CreoBot</span>
            </div>
            <p className="text-gray-500 text-xs">AI chatbot for small businesses.</p>
          </div>
          <p className="text-xs text-gray-600">
            Built by{' '}
            <a
              href="https://www.linkedin.com/in/keval-savaliya/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 font-medium hover:text-white transition-colors duration-200"
            >
              Keval Savaliya &#10084;&#65039;
            </a>
            <span className="text-gray-700 mx-2">·</span>
            <span className="text-gray-600">Founder</span>
          </p>
          <p className="text-gray-600 text-sm">&#169; 2026 CreoBot</p>
        </div>
      </footer>

    </main>
  )
}
