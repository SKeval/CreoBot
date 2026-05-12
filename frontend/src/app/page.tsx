'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, ChevronDown } from 'lucide-react'
import { CreoBotNavbar } from '@/components/ui/creobot-navbar'
import { useLanguage } from '@/lib/LanguageContext'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

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
  const { t } = useLanguage()

  const stats = [
    { value: '24/7', label: t('homepage.stats_always_on') },
    { value: '14-Day', label: t('homepage.stats_trial') },
    { value: 'Zero', label: t('homepage.stats_hallucination') },
  ]

  const features = [
    {
      icon: '🛡️',
      title: t('homepage.feature_1_title'),
      desc: t('homepage.feature_1_desc'),
    },
    {
      icon: '📧',
      title: t('homepage.feature_2_title'),
      desc: t('homepage.feature_2_desc'),
    },
    {
      icon: '💬',
      title: t('homepage.feature_3_title'),
      desc: t('homepage.feature_3_desc'),
    },
    {
      icon: '🔌',
      title: t('homepage.feature_4_title'),
      desc: t('homepage.feature_4_desc'),
    },
  ]

  const differentiators = [
    {
      icon: '✅',
      title: t('homepage.diff_1_title'),
      desc: t('homepage.diff_1_desc'),
    },
    {
      icon: '📬',
      title: t('homepage.diff_2_title'),
      desc: t('homepage.diff_2_desc'),
    },
    {
      icon: '💸',
      title: t('homepage.diff_3_title'),
      desc: t('homepage.diff_3_desc'),
    },
  ]

  const steps = [
    { step: '01', title: t('homepage.step_1_title'), desc: t('homepage.step_1_desc') },
    { step: '02', title: t('homepage.step_2_title'), desc: t('homepage.step_2_desc') },
    { step: '03', title: t('homepage.step_3_title'), desc: t('homepage.step_3_desc') },
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

  const faqs = [
    { q: t('homepage.faq_1_q'), a: t('homepage.faq_1_a') },
    { q: t('homepage.faq_2_q'), a: t('homepage.faq_2_a') },
    { q: t('homepage.faq_3_q'), a: t('homepage.faq_3_a') },
    { q: t('homepage.faq_4_q'), a: t('homepage.faq_4_a') },
    { q: t('homepage.faq_5_q'), a: t('homepage.faq_5_a') },
    { q: t('homepage.faq_6_q'), a: t('homepage.faq_6_a') },
  ]

  const heroWords = t('homepage.hero_title_white').split(' ')
  const heroWordsBlue = t('homepage.hero_title_blue').split(' ')

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col">

      {/* 1. NAVBAR */}
      <CreoBotNavbar langSwitcher={<LanguageSwitcher />} />

      {/* 2. HERO */}
      <section className="flex flex-col items-center justify-center text-center px-6 pt-28 pb-24">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-4 py-1.5 rounded-full mb-8 uppercase tracking-widest"
        >
          {t('homepage.hero_badge')}
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
                key={i}
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
                key={i}
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
          {t('homepage.hero_subtitle')}
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
              {t('homepage.hero_cta_primary')}
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/pricing"
              className="inline-block border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white px-8 py-3.5 rounded-lg font-semibold transition-colors duration-200"
            >
              {t('homepage.hero_cta_secondary')}
            </Link>
          </motion.div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.85 }}
          className="text-gray-600 text-sm mt-4"
        >
          {t('homepage.hero_note')}
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
          {t('homepage.features_title')}
        </motion.h2>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-gray-400 text-center mb-14 max-w-xl mx-auto"
        >
          {t('homepage.features_subtitle')}
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

      {/* 5. WHY CREOBOT */}
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
            {t('homepage.differentiator_title')}
          </motion.h2>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gray-400 text-center mb-14 max-w-2xl mx-auto"
          >
            {t('homepage.differentiator_subtitle')}
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
            {t('homepage.how_title')}
          </motion.h2>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gray-400 text-center mb-16"
          >
            {t('homepage.how_subtitle')}
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
            {t('homepage.testimonials_title')}
          </motion.h2>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gray-400 text-center mb-14"
          >
            {t('homepage.testimonials_subtitle')}
          </motion.p>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {testimonials.map((testimonial) => (
              <motion.div
                key={testimonial.name}
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
                <p className="text-gray-300 text-sm leading-relaxed flex-1">"{testimonial.quote}"</p>
                <div>
                  <div className="text-white font-semibold text-sm">{testimonial.name}</div>
                  <div className="text-gray-500 text-xs mt-0.5">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 8. PRICING TEASER */}
      <section id="pricing" className="scroll-mt-20 px-6 py-24">
        <div className="max-w-2xl mx-auto text-center">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold tracking-tight mb-4"
          >
            {t('homepage.pricing_cta_title')}
          </motion.h2>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gray-400 text-lg mb-8"
          >
            {t('homepage.pricing_cta')}
          </motion.p>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/pricing"
                className="inline-block bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-lg font-semibold transition-colors duration-200"
              >
                {t('homepage.pricing_see_plans')}
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/signup"
                className="inline-block border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white px-8 py-3.5 rounded-lg font-semibold transition-colors duration-200"
              >
                {t('homepage.pricing_start_free')}
              </Link>
            </motion.div>
          </motion.div>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-gray-600 text-sm mt-5"
          >
            {t('homepage.pricing_note')}
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
            {t('homepage.faq_title')}
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
          {t('homepage.cta_title')}
        </h2>
        <p className="text-gray-400 mb-10 max-w-xl mx-auto">
          {t('homepage.cta_subtitle')}
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
            {t('homepage.cta_button')}
          </Link>
        </motion.div>
        <p className="text-gray-600 text-sm mt-4">{t('homepage.cta_note')}</p>
      </motion.section>

      {/* 11. FOOTER */}
      <footer className="border-t border-gray-800 px-6 pt-8 pb-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center sm:items-start gap-1">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-blue-500" />
              <span className="font-bold text-white">CreoBot</span>
            </div>
            <p className="text-gray-500 text-xs">{t('homepage.footer_tagline')}</p>
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
          <p className="text-gray-600 text-sm">{t('homepage.footer_copyright')}</p>
        </div>
      </footer>

    </main>
  )
}
