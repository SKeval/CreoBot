'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { PhoneMissed, Moon, Repeat } from 'lucide-react'
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

export default function HomeServicesClient() {
  const { t } = useLanguage()
  const { isLoggedIn } = useAuth()

  const industries = t('home_services.industries').split(', ')

  const painPoints = [
    {
      icon: PhoneMissed,
      title: t('home_services.pain1_title'),
      body: t('home_services.pain1_body'),
    },
    {
      icon: Moon,
      title: t('home_services.pain2_title'),
      body: t('home_services.pain2_body'),
    },
    {
      icon: Repeat,
      title: t('home_services.pain3_title'),
      body: t('home_services.pain3_body'),
    },
  ]

  const steps = [
    {
      num: '01',
      title: t('home_services.step1_title'),
      desc: t('home_services.step1_body'),
    },
    {
      num: '02',
      title: t('home_services.step2_title'),
      desc: t('home_services.step2_body'),
    },
    {
      num: '03',
      title: t('home_services.step3_title'),
      desc: t('home_services.step3_body'),
    },
  ]

  return (
    <main className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-page)', color: 'var(--text-100)' }}>

      {/* 1. NAVBAR */}
      <CreoBotNavbar langSwitcher={<LanguageSwitcher />} isLoggedIn={isLoggedIn} />

      {/* 2. HERO */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 pt-28 pb-24">
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

        <div className="relative z-[1] flex flex-col items-center">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={spring}
            className="inline-block mb-6"
            style={{
              border: '0.5px solid var(--border)',
              borderRadius: '20px',
              padding: '4px 14px',
              fontSize: '12px',
              color: 'var(--text-60)',
            }}
          >
            {t('home_services.badge')}
          </motion.span>

          <h1
            className="text-balance"
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 500,
              lineHeight: 1.15,
              color: 'var(--text-100)',
              maxWidth: '700px',
              margin: '0 auto 16px',
              textAlign: 'center',
            }}
          >
            {t('home_services.h1_line1')} {t('home_services.h1_line2')}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.2 }}
            style={{
              fontSize: '1.0625rem',
              color: 'var(--text-60)',
              maxWidth: '480px',
              margin: '0 auto 32px',
              textAlign: 'center',
              lineHeight: 1.65,
            }}
          >
            {t('home_services.subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              href={isLoggedIn ? '/dashboard' : '/signup'}
              className="btn-pulse inline-block transition-[background-color,transform] duration-150 active:scale-[0.97]"
              style={{
                background: 'var(--primary)',
                color: 'white',
                padding: '12px 28px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.9375rem',
                fontWeight: 500,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--primary-hover)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--primary)' }}
            >
              {isLoggedIn ? t('homepage.hero_cta_dashboard') : t('homepage.hero_cta_primary')}
            </Link>
            <Link
              href="/pricing"
              className="inline-block transition-[border-color,color,transform] duration-150 active:scale-[0.97] hover:text-white"
              style={{
                border: '0.5px solid var(--border)',
                color: 'var(--text-60)',
                padding: '12px 28px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.9375rem',
                fontWeight: 500,
              }}
            >
              {t('homepage.hero_cta_secondary')}
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ...spring, delay: 0.4 }}
            className="mt-4"
            style={{ color: 'var(--text-40)', fontSize: '12px' }}
          >
            {t('homepage.hero_tagline')}
          </motion.p>
        </div>
      </section>

      {/* 3. PAIN POINTS */}
      <section className="px-6 py-24" style={{ borderTop: '0.5px solid var(--border)' }}>
        <div className="max-w-6xl mx-auto">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 500, marginBottom: '56px' }}
          >
            {t('home_services.sound_familiar')}
          </motion.h2>
          <div
            className="grid"
            style={{
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1px',
              background: 'var(--border)',
            }}
          >
            {painPoints.map((card, index) => {
              const Icon = card.icon
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, ease: 'easeOut', delay: index * 0.1 }}
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
                  <h3 style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-100)', marginBottom: '8px' }}>{card.title}</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-60)', lineHeight: 1.6 }}>{card.body}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 500, marginBottom: '56px' }}
          >
            {t('home_services.how_title')}
          </motion.h2>
          <div className="flex flex-col md:flex-row items-stretch gap-10 md:gap-0">
            {steps.map((step, index) => (
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
                <h3 style={{ fontSize: '1.125rem', fontWeight: 500, color: 'var(--text-100)', marginBottom: '8px' }}>{step.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-60)', lineHeight: 1.6 }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. INDUSTRIES */}
      <section className="px-6 py-24" style={{ borderTop: '0.5px solid var(--border)', background: 'var(--bg-surface)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 500, marginBottom: '48px' }}
          >
            {t('home_services.industries_title')}
          </motion.h2>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-3"
          >
            {industries.map((tag) => (
              <motion.span
                key={tag}
                variants={fadeUp}
                className="text-sm font-medium cursor-default transition-[border-color] duration-150 hover:border-[rgba(107,63,220,0.4)]"
                style={{
                  background: 'var(--bg-card)',
                  border: '0.5px solid var(--border)',
                  color: 'var(--text-60)',
                  padding: '8px 16px',
                  borderRadius: '20px',
                }}
              >
                {tag}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 6. FINAL CTA */}
      <section className="relative overflow-hidden px-6 text-center" style={{ padding: '120px 24px', background: 'var(--bg-page)' }}>
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 600px 300px at 50% 50%, rgba(107,63,220,0.2) 0%, transparent 70%)',
          }}
        />
        <div className="relative z-[1]">
          <h2
            className="text-balance mx-auto"
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 500,
              lineHeight: 1.15,
              maxWidth: '700px',
            }}
          >
            {t('home_services.cta_headline')}
          </h2>
          <p style={{ color: 'var(--text-60)', fontSize: '16px', marginTop: '12px' }} className="max-w-xl mx-auto leading-relaxed">
            {t('home_services.cta_subtext')}
          </p>
          <div style={{ marginTop: '32px' }}>
            <Link
              href={isLoggedIn ? '/dashboard' : '/signup'}
              className="btn-pulse inline-block transition-[background-color,transform] duration-150 active:scale-[0.97]"
              style={{
                background: 'var(--primary)',
                color: 'white',
                padding: '12px 28px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.9375rem',
                fontWeight: 500,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--primary-hover)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--primary)' }}
            >
              {isLoggedIn ? t('homepage.hero_cta_dashboard') : t('home_services.cta_button')}
            </Link>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <CreoBotFooter langSwitcher={<LanguageSwitcher />} />

    </main>
  )
}
