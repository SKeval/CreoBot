'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Shield, Clock, Zap, Users, Globe, BarChart2, Check } from 'lucide-react'
import { CreoBotNavbar } from '@/components/ui/creobot-navbar'
import { CreoBotFooter } from '@/components/ui/creobot-footer'
import { useLanguage } from '@/lib/LanguageContext'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { useAuth } from '@/hooks/useAuth'

const PLATFORMS = [
  'WordPress', 'Shopify', 'Wix', 'Webflow', 'Squarespace',
  'Jimdo', 'HTML', 'Wix', 'WordPress', 'Shopify',
]

const FEATURES = [
  {
    icon: Shield,
    title: 'Zero hallucination',
    desc: 'Answers only from your uploaded documents. If it does not know, it says so.',
  },
  {
    icon: Clock,
    title: '24/7 availability',
    desc: 'Your chatbot never sleeps. Answers customer questions at 3am without you.',
  },
  {
    icon: Zap,
    title: 'Live in 10 minutes',
    desc: 'Upload your docs, copy one script tag, done. No developer needed.',
  },
  {
    icon: Users,
    title: 'Human handoff',
    desc: 'When confidence drops below 80%, CreoBot emails you automatically.',
  },
  {
    icon: Globe,
    title: 'Multi-language',
    desc: 'Supports EN, DE, FR, ES, PT out of the box. Detects visitor language.',
  },
  {
    icon: BarChart2,
    title: 'Usage analytics',
    desc: 'See message volume, top questions, and handoff rate. Blaze plan.',
  },
]

const STEPS = [
  {
    num: '01',
    title: 'Upload your documents',
    desc: 'FAQ, price list, menu, policies - any PDF or text file.',
  },
  {
    num: '02',
    title: 'Embed one script tag',
    desc: 'Copy a single line of code into your website. Works on any platform.',
  },
  {
    num: '03',
    title: 'Customers get instant answers',
    desc: 'CreoBot responds 24/7 from your docs. You get notified for handoffs.',
  },
]

const CHAT_BUBBLES = [
  { role: 'bot' as const, cls: 'chat-bubble-1', text: 'Hi! What are your opening hours on Sunday?' },
  { role: 'user' as const, cls: 'chat-bubble-2', text: 'We are open 10am - 6pm on Sundays.' },
  { role: 'bot' as const, cls: 'chat-bubble-3', text: 'Great, and do you offer takeaway?' },
  { role: 'user' as const, cls: 'chat-bubble-4', text: 'Yes, via our website or by phone.' },
]

const headingClamp = 'clamp(2rem, 5vw, 3.5rem)'
const sectionHeadingClamp = 'clamp(1.5rem, 3vw, 2.25rem)'

export default function HomepageClient() {
  const { t } = useLanguage()
  const { isLoggedIn } = useAuth()

  const ctaHref = isLoggedIn ? '/dashboard' : '/signup'

  const stats = [
    { value: '24/7', label: t('homepage.stat1_label') },
    { value: '0', label: t('homepage.stat2_label') },
    { value: '<10 min', label: t('homepage.stat3_label') },
  ]

  const plans = [
    {
      name: t('pricing.plan_free'),
      price: '$0',
      period: '/' + t('pricing.billing_forever'),
      features: [
        '50 ' + t('pricing.feature_messages').toLowerCase(),
        t('pricing.feature_1_doc'),
        t('pricing.feature_widget'),
      ],
      cta: t('pricing.pricing_cta_start_free'),
      style: 'ghost' as const,
      popular: false,
    },
    {
      name: t('pricing.plan_spark'),
      price: '$19',
      period: '/' + t('pricing.billing_monthly'),
      features: [
        '1,000 ' + t('pricing.feature_messages').toLowerCase(),
        '5 ' + t('pricing.feature_docs').toLowerCase(),
        t('pricing.feature_handoff'),
        t('pricing.feature_branding'),
      ],
      cta: t('pricing.pricing_cta_trial'),
      style: 'primary' as const,
      popular: true,
    },
    {
      name: t('pricing.plan_blaze'),
      price: '$49',
      period: '/' + t('pricing.billing_monthly'),
      features: [
        t('pricing.pricing_feature_unlimited') + ' ' + t('pricing.feature_messages').toLowerCase(),
        t('pricing.pricing_feature_unlimited') + ' ' + t('pricing.feature_docs').toLowerCase(),
        t('pricing.feature_analytics'),
        t('pricing.pricing_feature_priority'),
      ],
      cta: t('pricing.pricing_cta_trial'),
      style: 'ghost-primary' as const,
      popular: false,
    },
  ]

  return (
    <main className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-page)', color: 'var(--text-100)' }}>

      {/* NAVBAR */}
      <CreoBotNavbar langSwitcher={<LanguageSwitcher />} isLoggedIn={isLoggedIn} />

      {/* SECTION 1 - HERO */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 py-20" style={{ minHeight: '100vh' }}>
        {/* Radial glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute"
          style={{
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '600px',
            height: '400px',
            maxWidth: '100%',
            background: 'radial-gradient(ellipse, rgba(107,63,220,0.25) 0%, transparent 65%)',
          }}
        />

        <div className="relative z-[1] w-full">
          {/* Badge pill */}
          <span
            className="inline-block"
            style={{
              border: '0.5px solid var(--border)',
              borderRadius: '20px',
              padding: '4px 14px',
              fontSize: '12px',
              color: 'var(--text-60)',
              marginBottom: '24px',
            }}
          >
            {t('homepage.hero_badge')}
          </span>

          {/* Headline - plain string with normal spaces (fixes prior word-merging bug) */}
          <h1
            className="text-balance"
            style={{
              fontSize: headingClamp,
              fontWeight: 500,
              lineHeight: 1.15,
              color: 'var(--text-100)',
              maxWidth: '700px',
              margin: '0 auto 16px',
              textAlign: 'center',
            }}
          >
            {t('homepage.cta_title')}
          </h1>

          {/* Subheadline */}
          <p
            style={{
              fontSize: '1.0625rem',
              color: 'var(--text-60)',
              maxWidth: '480px',
              margin: '0 auto 32px',
              textAlign: 'center',
              lineHeight: 1.65,
            }}
          >
            {t('homepage.hero_subtitle')}
          </p>

          {/* CTA */}
          <Link
            href={ctaHref}
            className="btn-pulse inline-block transition-[background-color,transform] duration-150 active:scale-[0.97]"
            style={{
              background: 'var(--primary)',
              color: 'white',
              padding: '12px 28px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.9375rem',
              fontWeight: 500,
              border: 'none',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--primary-hover)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--primary)' }}
          >
            {isLoggedIn ? t('homepage.hero_cta_dashboard') : t('homepage.hero_cta_primary')}
          </Link>

          {/* Animated chat mockup */}
          <div
            className="w-full"
            style={{
              maxWidth: '480px',
              margin: '40px auto 0',
              background: 'rgba(255,255,255,0.03)',
              border: '0.5px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '16px',
            }}
          >
            <div className="flex flex-col gap-2.5">
              {CHAT_BUBBLES.map((bubble) => (
                <div
                  key={bubble.cls}
                  className="flex"
                  style={{ justifyContent: bubble.role === 'bot' ? 'flex-start' : 'flex-end' }}
                >
                  <span
                    className={bubble.cls}
                    style={
                      bubble.role === 'bot'
                        ? {
                            background: 'rgba(255,255,255,0.07)',
                            color: 'var(--text-100)',
                            borderRadius: '10px 10px 10px 2px',
                            padding: '8px 12px',
                            fontSize: '13px',
                            maxWidth: '75%',
                            display: 'inline-block',
                            textAlign: 'left',
                          }
                        : {
                            background: 'var(--primary)',
                            color: 'white',
                            borderRadius: '10px 10px 2px 10px',
                            padding: '8px 12px',
                            fontSize: '13px',
                            maxWidth: '75%',
                            display: 'inline-block',
                            marginLeft: 'auto',
                            textAlign: 'left',
                          }
                    }
                  >
                    {bubble.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Stats row */}
            <div
              className="flex justify-center"
              style={{
                borderTop: '0.5px solid var(--border)',
                marginTop: '24px',
                paddingTop: '24px',
                gap: '48px',
              }}
            >
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div style={{ fontSize: '1.5rem', fontWeight: 500, color: 'var(--text-100)' }}>
                    {stat.value}
                  </div>
                  <div
                    style={{
                      fontSize: '11px',
                      color: 'var(--text-40)',
                      marginTop: '4px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 - PLATFORM BAR */}
      <section
        className="overflow-hidden"
        style={{
          padding: '24px 0',
          borderTop: '0.5px solid var(--border)',
          borderBottom: '0.5px solid var(--border)',
        }}
      >
        <div className="max-w-6xl mx-auto flex items-center gap-6 px-6">
          <span
            className="hidden md:block flex-shrink-0"
            style={{ color: 'var(--text-40)', fontSize: '12px', whiteSpace: 'nowrap' }}
          >
            Works on every platform
          </span>
          <div className="overflow-hidden flex-1 relative">
            <div className="marquee-track">
              {[...PLATFORMS, ...PLATFORMS].map((name, i) => (
                <span
                  key={`${name}-${i}`}
                  style={{ fontSize: '13px', color: 'var(--text-60)', padding: '0 32px', whiteSpace: 'nowrap' }}
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 - FEATURES */}
      <section id="features" className="scroll-mt-20 px-6" style={{ padding: '96px 0' }}>
        <div className="max-w-6xl mx-auto px-6">
          <h2
            className="text-center"
            style={{ fontSize: sectionHeadingClamp, fontWeight: 500, marginBottom: '56px' }}
          >
            {t('homepage.features_title')}
          </h2>

          <div
            className="grid"
            style={{
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1px',
              background: 'var(--border)',
            }}
          >
            {FEATURES.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, ease: 'easeOut', delay: index * 0.1 }}
                  className="relative"
                  style={{ background: 'var(--bg-card)', padding: '28px' }}
                >
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--primary-tint)',
                      marginBottom: '16px',
                    }}
                  >
                    <Icon style={{ color: 'var(--primary)', width: '18px', height: '18px' }} />
                  </div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-100)', marginBottom: '8px' }}>
                    {feature.title}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-60)', lineHeight: 1.6 }}>
                    {feature.desc}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* SECTION 4 - HOW IT WORKS */}
      <section id="how-it-works" className="scroll-mt-20 px-6" style={{ padding: '96px 0' }}>
        <div className="max-w-6xl mx-auto px-6">
          <h2
            className="text-center"
            style={{ fontSize: sectionHeadingClamp, fontWeight: 500, marginBottom: '56px' }}
          >
            {t('homepage.how_title')}
          </h2>

          <div className="flex flex-col md:flex-row items-stretch gap-10 md:gap-0">
            {STEPS.map((step, index) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, ease: 'easeOut', delay: index * 0.2 }}
                className="flex-1 border-t-2 md:border-t-0 md:border-l-2 pt-6 md:pt-0 md:pl-6 md:mr-10 last:mr-0"
                style={{ borderColor: 'var(--primary)' }}
              >
                <div
                  style={{
                    fontSize: '11px',
                    color: 'var(--primary)',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    marginBottom: '12px',
                  }}
                >
                  {step.num}
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 500, color: 'var(--text-100)', marginBottom: '8px' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-60)', lineHeight: 1.6 }}>
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 - SOCIAL PROOF */}
      <section className="px-6 text-center" style={{ padding: '80px 0' }}>
        <p style={{ fontSize: '1.25rem', fontWeight: 400, color: 'var(--text-60)', textAlign: 'center' }}>
          Join the first businesses putting CreoBot to work.
        </p>
        <Link
          href={ctaHref}
          className="inline-block mt-4 text-sm font-medium hover:underline"
          style={{ color: 'var(--primary)' }}
        >
          Get started free &rarr;
        </Link>
      </section>

      {/* SECTION 6 - PRICING PREVIEW */}
      <section id="pricing" className="scroll-mt-20 px-6" style={{ padding: '96px 0' }}>
        <div className="max-w-5xl mx-auto px-6">
          <h2
            className="text-center"
            style={{ fontSize: sectionHeadingClamp, fontWeight: 500, marginBottom: '12px' }}
          >
            {t('homepage.pricing_cta_title')}
          </h2>
          <p
            className="text-center"
            style={{ color: 'var(--text-60)', fontSize: '14px', marginBottom: '48px' }}
          >
            No per-message fees. Cancel anytime.
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-4 pt-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className="flex-1 flex flex-col"
                style={{
                  background: 'var(--bg-card)',
                  border: plan.popular ? '0.5px solid var(--primary)' : '0.5px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '28px',
                  position: 'relative',
                }}
              >
                {plan.popular && (
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
                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'var(--text-60)',
                    marginBottom: '8px',
                  }}
                >
                  {plan.name}
                </div>
                <div className="flex items-baseline gap-1">
                  <span style={{ fontSize: '2rem', fontWeight: 500, color: 'var(--text-100)' }}>{plan.price}</span>
                  <span style={{ fontSize: '13px', color: 'var(--text-40)' }}>{plan.period}</span>
                </div>
                <div className="flex flex-col flex-1" style={{ marginTop: '20px', gap: '10px' }}>
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-2.5">
                      <Check className="flex-shrink-0 mt-0.5" style={{ color: 'var(--primary)', width: '16px', height: '16px' }} />
                      <span style={{ color: 'var(--text-60)', fontSize: '14px' }}>{feature}</span>
                    </div>
                  ))}
                </div>
                <Link
                  href={isLoggedIn ? '/pricing' : '/signup'}
                  className="block w-full text-center text-sm font-medium transition-[background-color,border-color,transform] duration-150 active:scale-[0.98]"
                  style={{
                    marginTop: '24px',
                    padding: '10px 0',
                    borderRadius: 'var(--radius-md)',
                    ...(plan.style === 'primary'
                      ? { background: 'var(--primary)', color: 'white', border: '0.5px solid transparent' }
                      : plan.style === 'ghost-primary'
                      ? { background: 'transparent', color: 'var(--text-100)', border: '0.5px solid var(--primary)' }
                      : { background: 'transparent', color: 'var(--text-100)', border: '0.5px solid var(--border)' }),
                  }}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7 - FINAL CTA */}
      <section className="relative overflow-hidden px-6" style={{ padding: '120px 0', background: 'var(--bg-page)' }}>
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 600px 300px at 50% 50%, rgba(107,63,220,0.2) 0%, transparent 70%)',
          }}
        />
        <div className="relative z-[1] text-center px-6">
          <h2
            className="text-balance"
            style={{
              fontSize: headingClamp,
              fontWeight: 500,
              lineHeight: 1.15,
              maxWidth: '700px',
              margin: '0 auto',
            }}
          >
            {t('homepage.cta_title')}
          </h2>
          <p style={{ color: 'var(--text-60)', fontSize: '16px', marginTop: '12px' }}>
            Set up in 10 minutes. No developer needed.
          </p>
          <div style={{ marginTop: '32px' }}>
            <Link
              href={ctaHref}
              className="btn-pulse inline-block transition-[background-color,transform] duration-150 active:scale-[0.97]"
              style={{
                background: 'var(--primary)',
                color: 'white',
                padding: '12px 28px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.9375rem',
                fontWeight: 500,
                border: 'none',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--primary-hover)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--primary)' }}
            >
              {isLoggedIn ? t('homepage.hero_cta_dashboard') : t('homepage.hero_cta_primary')}
            </Link>
          </div>
          <p style={{ color: 'var(--text-40)', fontSize: '12px', marginTop: '12px' }}>
            Free plan available. No credit card required.
          </p>
        </div>
      </section>

      {/* SECTION 8 - FOOTER */}
      <CreoBotFooter langSwitcher={<LanguageSwitcher />} />

    </main>
  )
}
