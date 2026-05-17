'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Bot } from 'lucide-react'
import { CreoBotNavbar } from '@/components/ui/creobot-navbar'
import { useLanguage } from '@/lib/LanguageContext'
import { useAuth } from '@/hooks/useAuth'

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

const industries = [
  'Plumbing',
  'HVAC',
  'Electrical',
  'Landscaping',
  'Cleaning',
  'Roofing',
  'Pest Control',
  'Painting',
  'Handyman',
  'Pool Service',
]

export default function HomeServicesPage() {
  const { t } = useLanguage()
  const { isLoggedIn } = useAuth()

  const painPoints = [
    {
      icon: '📞',
      title: t('home_services.pain1_title'),
      body: t('home_services.pain1_body'),
    },
    {
      icon: '🌙',
      title: t('home_services.pain2_title'),
      body: t('home_services.pain2_body'),
    },
    {
      icon: '🔁',
      title: t('home_services.pain3_title'),
      body: t('home_services.pain3_body'),
    },
  ]

  const steps = [
    {
      num: 1,
      title: t('home_services.step1_title'),
      desc: t('home_services.step1_body'),
    },
    {
      num: 2,
      title: t('home_services.step2_title'),
      desc: t('home_services.step2_body'),
    },
    {
      num: 3,
      title: t('home_services.step3_title'),
      desc: t('home_services.step3_body'),
    },
  ]

  const heroLine1 = t('home_services.h1_line1')
  const heroLine2 = t('home_services.h1_line2')

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col">

      {/* 1. NAVBAR */}
      <CreoBotNavbar isLoggedIn={isLoggedIn} />

      {/* 2. HERO */}
      <section className="flex flex-col items-center justify-center text-center px-6 pt-28 pb-24">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-4 py-1.5 rounded-full mb-8 uppercase tracking-widest"
        >
          {t('home_services.badge')}
        </motion.span>

        <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight max-w-4xl text-balance">
          <motion.span
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="inline"
          >
            {heroLine1.split(' ').map((word, i) => (
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
            {heroLine2.split(' ').map((word, i) => (
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
          {t('home_services.subtitle')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 mt-10"
        >
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              href={isLoggedIn ? '/dashboard' : '/signup'}
              className="inline-block bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-lg font-semibold transition-colors duration-200"
            >
              {isLoggedIn ? t('homepage.hero_cta_dashboard') : t('homepage.hero_cta_primary')}
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
          {t('homepage.hero_tagline')}
        </motion.p>
      </section>

      {/* 3. PAIN POINTS */}
      <section className="bg-gray-900/40 border-t border-gray-800 px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-14"
          >
            Sound familiar?
          </motion.h2>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {painPoints.map((card) => (
              <motion.div
                key={card.title}
                variants={fadeUp}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-gray-900 border border-gray-800 rounded-xl p-7 hover:border-gray-700 transition-colors duration-200"
              >
                <div className="text-3xl mb-4">{card.icon}</div>
                <h3 className="font-semibold text-white text-lg mb-3">{card.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{card.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section className="px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-16"
          >
            {t('home_services.how_title')}
          </motion.h2>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-10"
          >
            {steps.map((s) => (
              <motion.div
                key={s.num}
                variants={fadeUp}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <div className="w-12 h-12 rounded-full bg-blue-600/10 border border-blue-500/30 flex items-center justify-center mx-auto mb-5">
                  <span className="text-blue-400 font-bold text-lg">{s.num}</span>
                </div>
                <h3 className="font-semibold text-white text-lg mb-2">{s.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 5. INDUSTRIES */}
      <section className="bg-gray-900/40 border-t border-gray-800 px-6 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold tracking-tight mb-12"
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
                transition={{ duration: 0.4 }}
                className="bg-gray-900 border border-gray-800 text-gray-300 text-sm font-medium px-4 py-2 rounded-full"
              >
                {tag}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 6. CTA BANNER */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.55 }}
        className="mx-4 md:mx-8 my-16 rounded-2xl px-8 py-20 text-center"
        style={{ backgroundColor: '#1a56db' }}
      >
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 max-w-2xl mx-auto">
          {t('home_services.cta_headline')}
        </h2>
        <p className="text-blue-100 mb-10 max-w-xl mx-auto">
          {t('home_services.cta_subtext')}
        </p>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-block"
        >
          <Link
            href={isLoggedIn ? '/dashboard' : '/signup'}
            className="inline-block bg-gray-950 hover:bg-gray-900 text-white px-10 py-4 rounded-lg font-semibold text-base transition-colors duration-200"
          >
            {isLoggedIn ? t('homepage.hero_cta_dashboard') : t('home_services.cta_button')}
          </Link>
        </motion.div>
      </motion.section>

      {/* 7. FOOTER */}
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
              Keval Savaliya
            </a>
            <span className="text-gray-700 mx-2">-</span>
            <span className="text-gray-600">Founder</span>
          </p>
          <div className="flex items-center gap-4">
            <Link href="/trust" className="text-gray-500 text-xs hover:text-gray-300 transition-colors duration-200">
              Trust &amp; Privacy
            </Link>
            <p className="text-gray-600 text-sm">{t('homepage.footer_copyright')}</p>
          </div>
        </div>
      </footer>

    </main>
  )
}
