'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, ChevronDown } from 'lucide-react'
import { CreoBotNavbar } from '@/components/ui/creobot-navbar'

// ─── Data ────────────────────────────────────────────────────────────────────

const heroWords = ['Answers', 'questions.']
const heroWordsBlue = ['Emails', 'you', "when it can't."]

const stats = [
  { value: '24/7', label: 'Always On' },
  { value: '14-Day', label: 'Free Trial' },
  { value: 'Zero', label: 'Hallucination' },
]

const features = [
  {
    icon: '🛡️',
    title: 'Zero Hallucination',
    desc: 'CreoBot only answers when your content backs it up. If it doesn\'t know, it says so — no guessing, ever.',
  },
  {
    icon: '📧',
    title: 'Human Handoff',
    desc: 'When a customer needs a real person, your team gets an instant email with the full conversation attached.',
  },
  {
    icon: '💬',
    title: 'Conversation Memory',
    desc: 'Remembers context across the full session. No more "as I mentioned" from frustrated customers.',
  },
  {
    icon: '🔌',
    title: 'One-Line Embed',
    desc: 'Paste one script tag. Live on any website in under 2 minutes. No developer needed.',
  },
]

const differentiators = [
  {
    icon: '✅',
    title: 'Knows when to say "I don\'t know"',
    desc: 'Most AI chatbots guess when they\'re unsure — and get it wrong. CreoBot refuses to answer if your docs don\'t back it up, then emails you to follow up.',
  },
  {
    icon: '📬',
    title: 'Human handoff built in — no helpdesk required',
    desc: 'No Zendesk, no Intercom, no $500/month support tool. When confidence is low or a buyer signal fires, your team gets an email instantly with the full conversation.',
  },
  {
    icon: '💸',
    title: 'SMB-priced. Not enterprise-locked.',
    desc: 'Enterprise AI chatbots start at $12,000/year and require a sales call. CreoBot starts at $19/month, self-serve, live in 10 minutes.',
  },
]

const steps = [
  { step: '01', title: 'Upload your docs', desc: 'PDF or TXT: menus, FAQs, pricing, policies — anything your customers ask about.' },
  { step: '02', title: 'Embed on your site', desc: 'One script tag. Works on WordPress, Shopify, Wix, Webflow, or any HTML site.' },
  { step: '03', title: 'Get alerts, not headaches', desc: 'CreoBot handles the questions. You get emailed only for the ones that need a human.' },
]

const testimonials = [
  {
    quote: 'CreoBot answered 90% of our customer questions automatically. Game changer.',
    name: 'Sarah M.',
    role: 'Coffee Shop Owner',
  },
  {
    quote: 'Setup took 5 minutes. Now our bot handles enquiries 24/7 while we sleep.',
    name: 'James K.',
    role: 'Restaurant Owner',
  },
  {
    quote: 'The human handoff feature is brilliant. We never miss a hot lead.',
    name: 'Priya R.',
    role: 'Boutique Owner',
  },
]

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
    ],
    cta: 'Start 14-day Trial',
    href: '/signup',
    highlight: false,
    note: '',
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
    ],
    cta: 'Start 14-day Trial',
    href: '/signup',
    highlight: true,
    note: '',
  },
]

const faqs = [
  {
    q: 'What happens when the bot can\'t answer a question?',
    a: 'It tells the customer it doesn\'t have that information — and instantly emails you with the full conversation so you can follow up. No question slips through.',
  },
  {
    q: 'Do I need to know how to code?',
    a: 'No. Upload your docs, copy one script tag into your website, and you\'re live. No developer needed.',
  },
  {
    q: 'What documents can I upload?',
    a: 'PDF and TXT files — menus, FAQs, pricing, service descriptions, policies. Anything your customers regularly ask about.',
  },
  {
    q: 'What happens after the 14-day trial?',
    a: 'You move to the Free plan automatically. No charge, no card required to start your trial.',
  },
  {
    q: 'Does it work on any website?',
    a: 'Yes. One script tag works on WordPress, Shopify, Wix, Webflow, Squarespace, or any custom HTML site.',
  },
  {
    q: 'Will it make things up if it doesn\'t know the answer?',
    a: 'Never. CreoBot only answers from your uploaded content. If the answer isn\'t there, it says so and alerts you — that\'s the guarantee.',
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

const wordVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Landing() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col">

      {/* 1. NAVBAR */}
      <CreoBotNavbar />

      {/* 2. HERO */}
      <section className="flex flex-col items-center justify-center text-center px-6 pt-28 pb-24">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-4 py-1.5 rounded-full mb-8 uppercase tracking-widest"
        >
          AI Chatbot Built for Small Business
        </motion.span>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight max-w-4xl">
          <motion.span
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="inline"
          >
            {heroWords.map((word, i) => (
              <motion.span
                key={word}
                variants={wordVariant}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                className="inline-block mr-4"
              >
                {word}
              </motion.span>
            ))}
          </motion.span>
          <br />
          <motion.span
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="inline text-blue-400"
          >
            {heroWordsBlue.map((word, i) => (
              <motion.span
                key={word}
                variants={wordVariant}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                className="inline-block mr-3"
              >
                {word}
              </motion.span>
            ))}
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-gray-400 text-lg md:text-xl mt-8 max-w-2xl leading-relaxed"
        >
          Upload your docs. CreoBot answers customer questions 24/7 from your content only —
          zero hallucination. When it can't answer, it emails you instantly.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 mt-10"
        >
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/signup"
              className="inline-block bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-lg font-semibold transition-colors duration-200"
            >
              Start free — no card needed
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="#pricing"
              className="inline-block border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white px-8 py-3.5 rounded-lg font-semibold transition-colors duration-200"
            >
              See pricing
            </Link>
          </motion.div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.85 }}
          className="text-gray-600 text-sm mt-4"
        >
          14-day free trial · No credit card · Live in 10 minutes
        </motion.p>
      </section>

      {/* 3. STATS BAR */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="border-t border-b border-gray-800 bg-gray-900/40"
      >
        <div className="max-w-4xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* 4. FEATURES */}
      <section id="features" className="scroll-mt-20 px-6 py-24 max-w-6xl mx-auto w-full">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-4"
        >
          Everything your business needs
        </motion.h2>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-gray-400 text-center mb-14 max-w-xl mx-auto"
        >
          Built for small businesses that want enterprise-grade AI without the enterprise price tag.
        </motion.p>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-colors duration-200"
            >
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 5. WHY CREOBOT (NEW) */}
      <section className="bg-gray-900/40 border-t border-gray-800 px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-4"
          >
            Not just another AI chatbot
          </motion.h2>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gray-400 text-center mb-14 max-w-2xl mx-auto"
          >
            Generic chatbots hallucinate. Enterprise tools cost $12,000/year and need a sales call.
            CreoBot is built specifically for small businesses.
          </motion.p>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {differentiators.map((d) => (
              <motion.div
                key={d.title}
                variants={fadeUp}
                transition={{ duration: 0.5 }}
                className="flex flex-col gap-4"
              >
                <span className="text-2xl">{d.icon}</span>
                <h3 className="text-white font-semibold text-lg leading-snug">{d.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{d.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 6. HOW IT WORKS */}
      <section id="how-it-works" className="scroll-mt-20 px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-4"
          >
            Live in 3 steps
          </motion.h2>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gray-400 text-center mb-16"
          >
            From sign-up to live chatbot in under 10 minutes.
          </motion.p>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-10"
          >
            {steps.map((s) => (
              <motion.div
                key={s.step}
                variants={fadeUp}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <div className="w-12 h-12 rounded-full bg-blue-600/10 border border-blue-500/30 flex items-center justify-center mx-auto mb-5">
                  <span className="text-blue-400 font-bold text-lg">{parseInt(s.step)}</span>
                </div>
                <h3 className="font-semibold text-white text-lg mb-2">{s.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 7. TESTIMONIALS */}
      <section className="bg-gray-900/40 border-t border-gray-800 px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-4"
          >
            Trusted by small businesses
          </motion.h2>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gray-400 text-center mb-14"
          >
            Real results from real business owners.
          </motion.p>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {testimonials.map((t) => (
              <motion.div
                key={t.name}
                variants={fadeUp}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-7 flex flex-col gap-6 hover:border-gray-700 transition-colors duration-200"
              >
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-sm">★</span>
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed flex-1">"{t.quote}"</p>
                <div>
                  <div className="text-white font-semibold text-sm">{t.name}</div>
                  <div className="text-gray-500 text-xs mt-0.5">{t.role}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 8. PRICING */}
      <section id="pricing" className="scroll-mt-20 px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-3"
          >
            Simple, flat pricing
          </motion.h2>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gray-400 text-center mb-14"
          >
            No per-message fees. No sales calls. No surprises. Cancel anytime.
          </motion.p>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
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
                      <span className="text-green-400 text-base leading-none">✓</span>
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

          {/* Enterprise note */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center text-gray-500 text-sm mt-8"
          >
            Need more?{' '}
            <a href="mailto:creobot.alerts@gmail.com" className="text-blue-400 hover:text-blue-300 transition-colors">
              Contact us
            </a>{' '}
            for custom plans.
          </motion.p>
        </div>
      </section>

      {/* 9. FAQ */}
      <section id="faq" className="scroll-mt-20 bg-gray-900/40 border-t border-gray-800 px-6 py-24">
        <div className="max-w-3xl mx-auto w-full">
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
              <motion.div
                key={i}
                variants={fadeUp}
                transition={{ duration: 0.5 }}
              >
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

      {/* 10. CTA BANNER */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.55 }}
        className="mx-4 md:mx-8 mb-16 rounded-2xl bg-gradient-to-br from-blue-600/20 via-gray-900 to-gray-900 border border-blue-500/20 px-8 py-20 text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 max-w-2xl mx-auto">
          Stop answering the same questions twice.
        </h2>
        <p className="text-gray-400 mb-10 max-w-xl mx-auto">
          Let CreoBot handle it 24/7 — from your content, with zero hallucination.
          Your team only gets pinged when a real human is needed.
        </p>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-block"
        >
          <Link
            href="/signup"
            className="inline-block bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-lg font-semibold text-base transition-colors duration-200"
          >
            Start your free trial
          </Link>
        </motion.div>
        <p className="text-gray-600 text-sm mt-4">14 days free · No credit card · Live in 10 minutes</p>
      </motion.section>

      {/* 11. FOOTER */}
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
              Keval Savaliya ❤️
            </a>
            <span className="text-gray-700 mx-2">·</span>
            <span className="text-gray-600">Founder</span>
          </p>
          <p className="text-gray-600 text-sm">© 2026 CreoBot</p>
        </div>
      </footer>

    </main>
  )
}