'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, ChevronDown } from 'lucide-react'
import { CreoBotNavbar } from '@/components/ui/creobot-navbar'
import { useLanguage } from '@/lib/LanguageContext'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { useAuth } from '@/hooks/useAuth'

const spring = { type: 'spring' as const, stiffness: 300, damping: 30 }

const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: spring,
  },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

function Cell({ value, type }: { value: string | boolean; type: 'text' | 'bool' }) {
  if (type === 'text') {
    return (
      <td className="px-6 py-4 text-center text-sm text-gray-300">
        {value as string}
      </td>
    )
  }
  if (value === 'comingsoon') {
    return (
      <td className="px-6 py-4 text-center text-sm">
        <span className="inline-flex items-center justify-center gap-1">
          <span className="text-green-400">&#10003;</span>
          <span className="bg-blue-900/40 text-blue-400 text-xs px-2 py-0.5 rounded-full">Coming soon</span>
        </span>
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

export default function PricingClient() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const { t } = useLanguage()
  const { isLoggedIn } = useAuth()

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)
    return () => { document.body.removeChild(script) }
  }, [])

  const handleUpgrade = async (plan: string) => {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      window.location.href = '/signup'
      return
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: session.user.id,
        email: session.user.email,
        plan
      })
    })

    const data = await res.json()

    if (!data.subscription_id) {
      console.error('Razorpay error:', data)
      alert('Something went wrong. Please try again.')
      return
    }

    const options = {
      key: data.razorpay_key,
      subscription_id: data.subscription_id,
      name: 'CreoBot',
      description: plan === 'spark' ? 'Spark Plan - $19/mo' : 'Blaze Plan - $49/mo',
      handler: function () {
        window.location.href = '/dashboard?success=true'
      },
      prefill: { email: session.user.email },
      theme: { color: '#1a56db' }
    }

    // @ts-ignore
    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  type TableRow = {
    feature: string
    free: string | boolean
    spark: string | boolean
    blaze: string | boolean
    type: 'text' | 'bool'
  }

  const plans = [
    {
      name: t('pricing.plan_free'),
      price: '$0',
      period: t('pricing.billing_forever'),
      features: [
        '50 ' + t('pricing.feature_messages').toLowerCase(),
        t('pricing.feature_1_doc'),
        t('pricing.feature_widget'),
        'CreoBot branding',
      ],
      href: '/signup',
      highlight: false,
      note: '',
    },
    {
      name: t('pricing.plan_spark'),
      price: '$19',
      period: t('pricing.billing_monthly'),
      features: [
        '1,000 ' + t('pricing.feature_messages').toLowerCase(),
        '5 ' + t('pricing.feature_docs').toLowerCase(),
        t('pricing.feature_handoff'),
        t('pricing.feature_branding'),
        t('pricing.pricing_feature_email_support'),
        t('pricing.pricing_feature_trial'),
      ],
      href: '/signup',
      highlight: false,
      note: t('pricing.no_card'),
      upgradePlan: 'spark',
    },
    {
      name: t('pricing.plan_blaze'),
      price: '$49',
      period: t('pricing.billing_monthly'),
      features: [
        t('pricing.pricing_feature_unlimited') + ' ' + t('pricing.feature_messages').toLowerCase(),
        t('pricing.pricing_feature_unlimited') + ' ' + t('pricing.feature_docs').toLowerCase(),
        t('pricing.feature_handoff'),
        t('pricing.feature_analytics'),
        t('pricing.pricing_feature_priority'),
        t('pricing.pricing_feature_trial'),
        'whatsapp',
      ],
      href: '/signup',
      highlight: true,
      note: t('pricing.no_card'),
      upgradePlan: 'blaze',
    },
  ]

  const tableRows: TableRow[] = [
    { feature: t('pricing.feature_messages'),  free: '50',       spark: '1,000',    blaze: t('pricing.pricing_feature_unlimited'), type: 'text' },
    { feature: t('pricing.feature_docs'),       free: '1',        spark: '5',        blaze: t('pricing.pricing_feature_unlimited'), type: 'text' },
    { feature: t('pricing.feature_widget'),     free: true,       spark: true,       blaze: true,        type: 'bool' },
    { feature: t('pricing.feature_handoff'),    free: false,      spark: true,       blaze: true,        type: 'bool' },
    { feature: t('pricing.feature_branding'),   free: false,      spark: true,       blaze: true,        type: 'bool' },
    { feature: t('pricing.feature_analytics'),  free: false,      spark: false,      blaze: true,        type: 'bool' },
    { feature: t('pricing.feature_priority'),   free: false,      spark: false,      blaze: true,        type: 'bool' },
    { feature: t('pricing.feature_trial'),      free: false,      spark: true,       blaze: true,        type: 'bool' },
    { feature: t('pricing.pricing_whatsapp'),   free: false,      spark: false,      blaze: 'comingsoon',type: 'bool' },
  ]

  const faqs = [
    { q: t('pricing.faq_1_q'), a: t('pricing.faq_1_a') },
    { q: t('pricing.faq_2_q'), a: t('pricing.faq_2_a') },
    { q: t('pricing.faq_3_q'), a: t('pricing.faq_3_a') },
    { q: t('pricing.faq_4_q'), a: t('pricing.faq_4_a') },
    { q: t('pricing.faq_5_q'), a: t('pricing.faq_5_a') },
    { q: t('pricing.faq_6_q'), a: t('pricing.faq_6_a') },
  ]

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col">

      {/* 1. NAVBAR */}
      <CreoBotNavbar langSwitcher={<LanguageSwitcher />} isLoggedIn={isLoggedIn} />

      {/* 2. HERO */}
      <section className="flex flex-col items-center justify-center text-center px-6 pt-24 pb-16">
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
          className="text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-4 py-1.5 rounded-full mb-8 uppercase tracking-widest"
        >
          {t('pricing.page_badge')}
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.08 }}
          className="text-4xl md:text-5xl font-bold tracking-tight mb-6"
        >
          {t('pricing.page_title')}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.16 }}
          className="text-gray-400 text-lg max-w-xl leading-relaxed"
        >
          {t('pricing.page_subtitle')}
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
              whileHover={{
                scale: 1.02,
                y: -4,
                transition: spring,
              }}
              className={`relative rounded-2xl border p-8 flex flex-col gap-6 hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] transition-[border-color,background-color,box-shadow] duration-200 ease-out ${
                p.highlight
                  ? 'border-blue-500 bg-blue-500/5 hover:border-blue-400 hover:bg-blue-500/10'
                  : 'border-gray-800 bg-gray-900 hover:border-gray-600 hover:bg-gray-800/80'
              }`}
            >
              {p.highlight && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#1a56db] to-[#1e40af] text-white text-xs font-semibold px-4 py-1 rounded-full">
                  {t('pricing.most_popular')}
                </span>
              )}
              <div>
                <h3 className="text-xl font-bold tracking-tight">{p.name}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-bold tracking-tight">{p.price}</span>
                  <span className="text-gray-400 text-sm">/{p.period}</span>
                </div>
              </div>
              <ul className="flex flex-col gap-3 flex-1">
                {p.features.map((f) => (
                  f === 'whatsapp' ? (
                    <li key="whatsapp" className="flex items-center gap-2.5 text-sm text-gray-300 leading-relaxed">
                      <span className="text-green-400 text-base leading-none">&#10003;</span>
                      WhatsApp integration
                      <span className="bg-blue-900/40 text-blue-400 text-xs px-2 py-0.5 rounded-full ml-2">coming soon</span>
                    </li>
                  ) : (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-gray-300 leading-relaxed">
                      <span className="text-green-400 text-base leading-none">&#10003;</span>
                      {f}
                    </li>
                  )
                ))}
              </ul>
              <div className="flex flex-col gap-2">
                <motion.div whileTap={{ scale: 0.97, transition: spring }}>
                  {p.upgradePlan ? (
                    <button
                      onClick={() => handleUpgrade(p.upgradePlan!)}
                      className={`block w-full text-center py-3 rounded-lg font-semibold text-sm transition-shadow duration-200 ${
                        p.highlight
                          ? 'bg-gradient-to-r from-[#1a56db] to-[#1e40af] hover:shadow-[0_0_20px_rgba(26,86,219,0.3)] text-white'
                          : 'bg-gray-800 hover:bg-gray-700 text-white transition-colors'
                      }`}
                    >
                      {isLoggedIn ? t('pricing.pricing_cta_upgrade') : t('pricing.pricing_cta_trial')}
                    </button>
                  ) : (
                    <Link
                      href={isLoggedIn ? '/dashboard' : '/signup'}
                      className={`block w-full text-center py-3 rounded-lg font-semibold text-sm transition-shadow duration-200 ${
                        p.highlight
                          ? 'bg-gradient-to-r from-[#1a56db] to-[#1e40af] hover:shadow-[0_0_20px_rgba(26,86,219,0.3)] text-white'
                          : 'bg-gray-800 hover:bg-gray-700 text-white transition-colors'
                      }`}
                    >
                      {isLoggedIn ? t('pricing.pricing_cta_dashboard') : t('pricing.pricing_cta_start_free')}
                    </Link>
                  )}
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
            className="text-2xl font-bold tracking-tight text-center mb-8"
          >
            {t('pricing.compare_title')}
          </motion.h2>
          <div className="relative">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.08 }}
              className="overflow-x-auto w-full"
            >
              <div className="bg-gray-900 border border-gray-800 rounded-2xl min-w-[560px]">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-800/50">
                      <th className="px-6 py-4 text-left text-sm text-gray-400 font-medium">{t('pricing.table_feature')}</th>
                      <th className="px-6 py-4 text-center text-sm text-gray-400 font-medium">{t('pricing.plan_free')}</th>
                      <th className="px-6 py-4 text-center text-sm text-gray-400 font-medium">{t('pricing.plan_spark')}</th>
                      <th className="px-6 py-4 text-center text-sm text-gray-400 font-medium">{t('pricing.plan_blaze')}</th>
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
              </div>
            </motion.div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-gray-950 to-transparent md:hidden" />
          </div>
          <p className="text-center text-xs text-gray-500 mt-2 md:hidden">{t('pricing.pricing_swipe_hint')}</p>
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
            className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-14"
          >
            {t('pricing.faq_title')}
          </motion.h2>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col divide-y divide-gray-800"
          >
            {faqs.map((faq, i) => (
              <motion.div key={i} variants={fadeUp}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between py-5 text-left group"
                >
                  <span className="font-medium text-white group-hover:text-blue-400 transition-colors duration-200 pr-4">
                    {faq.q}
                  </span>
                  <motion.span
                    animate={{ rotate: openFaq === i ? 180 : 0 }}
                    transition={spring}
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
                      transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
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
        >
          <p className="text-gray-400 mb-3 leading-relaxed">
            {t('pricing.enterprise_note')}
          </p>
          <a
            href="mailto:creoadsai@gmail.com"
            className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
          >
            {t('pricing.enterprise_contact')} &rarr;
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
            <p className="text-gray-500 text-xs">{t('pricing.footer_tagline')}</p>
          </div>
          <p className="text-xs text-gray-600">
            Built by{' '}
            <a
              href="https://www.linkedin.com/in/keval-savaliya/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 font-medium hover:text-white transition-colors duration-200"
            >
              Keval Savaliya
            </a>
            <span className="text-gray-700 mx-2">·</span>
            <span className="text-gray-600">Founder</span>
          </p>
          <div className="flex items-center gap-4">
            <Link href="/trust" className="text-gray-500 text-xs hover:text-gray-300 transition-colors duration-200">
              Trust &amp; Privacy
            </Link>
            <p className="text-gray-600 text-sm">{t('pricing.footer_copyright')}</p>
          </div>
        </div>
      </footer>

    </main>
  )
}