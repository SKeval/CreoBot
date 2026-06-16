'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check, X } from 'lucide-react'
import { CreoBotNavbar } from '@/components/ui/creobot-navbar'
import { CreoBotFooter } from '@/components/ui/creobot-footer'
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
      <td className="px-6 py-4 text-center text-sm" style={{ color: 'var(--text-60)' }}>
        {value as string}
      </td>
    )
  }
  if (value === 'comingsoon') {
    return (
      <td className="px-6 py-4 text-center text-sm">
        <span className="inline-flex items-center justify-center gap-1">
          <Check className="w-4 h-4" style={{ color: 'var(--primary)' }} />
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: 'var(--primary-tint)', color: 'var(--primary-hover)' }}
          >
            Coming soon
          </span>
        </span>
      </td>
    )
  }
  return (
    <td className="px-6 py-4 text-center text-sm">
      {value ? (
        <Check className="w-4 h-4 inline-block" style={{ color: 'var(--primary)' }} />
      ) : (
        <X className="w-4 h-4 inline-block" style={{ color: 'var(--text-40)' }} />
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
      theme: { color: '#6B3FDC' }
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
      ctaStyle: 'ghost' as const,
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
      highlight: true,
      note: t('pricing.no_card'),
      upgradePlan: 'spark',
      ctaStyle: 'primary' as const,
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
      highlight: false,
      note: t('pricing.no_card'),
      upgradePlan: 'blaze',
      ctaStyle: 'ghost-primary' as const,
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

  const ctaButtonStyle = (style: 'ghost' | 'primary' | 'ghost-primary'): React.CSSProperties => ({
    borderRadius: 'var(--radius-md)',
    ...(style === 'primary'
      ? { background: 'var(--primary)', color: 'white', border: '0.5px solid transparent' }
      : style === 'ghost-primary'
      ? { background: 'transparent', color: 'var(--text-100)', border: '0.5px solid var(--primary)' }
      : { background: 'transparent', color: 'var(--text-100)', border: '0.5px solid var(--border)' }),
  })

  return (
    <main className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-page)', color: 'var(--text-100)' }}>

      {/* 1. NAVBAR */}
      <CreoBotNavbar langSwitcher={<LanguageSwitcher />} isLoggedIn={isLoggedIn} />

      {/* 2. HERO */}
      <section className="flex flex-col items-center justify-center text-center px-6 pt-24 pb-16">
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
          className="inline-block mb-8"
          style={{
            border: '0.5px solid var(--border)',
            borderRadius: '20px',
            padding: '4px 14px',
            fontSize: '12px',
            color: 'var(--text-60)',
          }}
        >
          {t('pricing.page_badge')}
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.08 }}
          className="mb-6"
          style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 500, lineHeight: 1.15 }}
        >
          {t('pricing.page_title')}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.16 }}
          className="max-w-xl leading-relaxed"
          style={{ color: 'var(--text-60)', fontSize: '14px' }}
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
          className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3"
        >
          {plans.map((p) => (
            <motion.div
              key={p.name}
              variants={fadeUp}
              className="relative flex flex-col gap-6"
              style={{
                background: 'var(--bg-card)',
                border: p.highlight ? '0.5px solid var(--primary)' : '0.5px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '28px',
              }}
            >
              {p.highlight && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-12px',
                    right: '16px',
                    background: 'var(--primary)',
                    color: 'white',
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '3px 10px',
                    borderRadius: '20px',
                  }}
                >
                  {t('pricing.most_popular')}
                </span>
              )}
              <div>
                <h3
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'var(--text-60)',
                    marginBottom: '8px',
                  }}
                >
                  {p.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span style={{ fontSize: '2rem', fontWeight: 500, color: 'var(--text-100)' }}>{p.price}</span>
                  <span style={{ fontSize: '13px', color: 'var(--text-40)' }}>/{p.period}</span>
                </div>
              </div>
              <ul className="flex flex-col flex-1" style={{ gap: '10px' }}>
                {p.features.map((f) => (
                  f === 'whatsapp' ? (
                    <li key="whatsapp" className="flex items-center gap-2.5 text-sm leading-relaxed" style={{ color: 'var(--text-60)' }}>
                      <Check className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--primary)' }} />
                      {t('pricing.pricing_whatsapp')}
                      <span
                        className="text-xs px-2 py-0.5 rounded-full ml-1"
                        style={{ background: 'var(--primary-tint)', color: 'var(--primary-hover)' }}
                      >
                        coming soon
                      </span>
                    </li>
                  ) : (
                    <li key={f} className="flex items-center gap-2.5 text-sm leading-relaxed" style={{ color: 'var(--text-60)' }}>
                      <Check className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--primary)' }} />
                      {f}
                    </li>
                  )
                ))}
              </ul>
              <div className="flex flex-col gap-2">
                {p.upgradePlan ? (
                  <button
                    onClick={() => handleUpgrade(p.upgradePlan!)}
                    className="block w-full text-center py-3 font-medium text-sm transition-[background-color,transform] duration-150 active:scale-[0.98] hover:opacity-90"
                    style={ctaButtonStyle(p.ctaStyle)}
                  >
                    {isLoggedIn ? t('pricing.pricing_cta_upgrade') : t('pricing.pricing_cta_trial')}
                  </button>
                ) : (
                  <Link
                    href={isLoggedIn ? '/dashboard' : '/signup'}
                    className="block w-full text-center py-3 font-medium text-sm transition-[background-color,transform] duration-150 active:scale-[0.98] hover:opacity-90"
                    style={ctaButtonStyle(p.ctaStyle)}
                  >
                    {isLoggedIn ? t('pricing.pricing_cta_dashboard') : t('pricing.pricing_cta_start_free')}
                  </Link>
                )}
                {p.note && (
                  <p className="text-center text-xs" style={{ color: 'var(--text-40)' }}>{p.note}</p>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 4. COMPARISON TABLE */}
      <section className="px-6 py-24" style={{ borderTop: '0.5px solid var(--border)' }}>
        <div className="max-w-5xl mx-auto">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-8"
            style={{ fontSize: '1.5rem', fontWeight: 500 }}
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
              <div
                className="min-w-[560px]"
                style={{
                  background: 'var(--bg-card)',
                  border: '0.5px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                }}
              >
                <table className="w-full">
                  <thead>
                    <tr style={{ background: 'var(--bg-surface)' }}>
                      <th className="px-6 py-4 text-left text-sm font-medium" style={{ color: 'var(--text-40)' }}>{t('pricing.table_feature')}</th>
                      <th className="px-6 py-4 text-center text-sm font-medium" style={{ color: 'var(--text-40)' }}>{t('pricing.plan_free')}</th>
                      <th className="px-6 py-4 text-center text-sm font-medium" style={{ color: 'var(--text-40)' }}>{t('pricing.plan_spark')}</th>
                      <th className="px-6 py-4 text-center text-sm font-medium" style={{ color: 'var(--text-40)' }}>{t('pricing.plan_blaze')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableRows.map((row) => (
                      <tr key={row.feature} className="hover:bg-white/[0.02] transition-colors duration-150">
                        <td className="px-6 py-4 text-sm font-medium" style={{ color: 'var(--text-100)' }}>{row.feature}</td>
                        <Cell value={row.free}  type={row.type} />
                        <Cell value={row.spark} type={row.type} />
                        <Cell value={row.blaze} type={row.type} />
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
            <div
              className="pointer-events-none absolute inset-y-0 right-0 w-16 md:hidden"
              style={{ background: 'linear-gradient(to left, var(--bg-page), transparent)' }}
            />
          </div>
          <p className="text-center text-xs mt-2 md:hidden" style={{ color: 'var(--text-40)' }}>{t('pricing.pricing_swipe_hint')}</p>
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
            className="text-center mb-14"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 500 }}
          >
            {t('pricing.faq_title')}
          </motion.h2>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col divide-y divide-white/[0.08]"
          >
            {faqs.map((faq, i) => (
              <motion.div key={i} variants={fadeUp}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between py-5 text-left group"
                >
                  <span
                    className="font-medium pr-4 transition-colors duration-150 group-hover:text-white"
                    style={{ color: 'var(--text-100)' }}
                  >
                    {faq.q}
                  </span>
                  <motion.span
                    animate={{ rotate: openFaq === i ? 180 : 0 }}
                    transition={spring}
                    className="flex-shrink-0"
                    style={{ color: 'var(--text-40)' }}
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
                      <p className="text-sm leading-relaxed pb-5 pr-8" style={{ color: 'var(--text-60)' }}>{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 6. ENTERPRISE NOTE */}
      <section className="py-16 text-center px-6" style={{ borderTop: '0.5px solid var(--border)', background: 'var(--bg-surface)' }}>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <p className="mb-3 leading-relaxed" style={{ color: 'var(--text-60)' }}>
            {t('pricing.enterprise_note')}
          </p>
          <a
            href="mailto:creoadsai@gmail.com"
            className="font-medium transition-colors duration-150 hover:underline"
            style={{ color: 'var(--primary)' }}
          >
            {t('pricing.enterprise_contact')} &rarr;
          </a>
        </motion.div>
      </section>

      {/* 7. FOOTER */}
      <CreoBotFooter langSwitcher={<LanguageSwitcher />} />

    </main>
  )
}
