'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { CreoBotNavbar } from '@/components/ui/creobot-navbar'
import { CreoBotFooter } from '@/components/ui/creobot-footer'
import { useLanguage } from '@/lib/LanguageContext'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

interface PostMeta {
  title: string
  description: string
  date: string
  slug: string
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

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

export default function BlogPageClient({ posts }: { posts: PostMeta[] }) {
  const { t, currentLang } = useLanguage()

  return (
    <main className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-page)', color: 'var(--text-100)' }}>
      <CreoBotNavbar langSwitcher={<LanguageSwitcher />} />

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-6 pt-24 pb-16">
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
          {t('blog.blog_badge')}
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.08 }}
          className="text-balance max-w-3xl mx-auto mb-4"
          style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 500, lineHeight: 1.15 }}
        >
          {t('blog.blog_title')}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.16 }}
          className="max-w-xl leading-relaxed"
          style={{ color: 'var(--text-60)', fontSize: '1rem' }}
        >
          {t('blog.blog_subtitle')}
        </motion.p>
        {currentLang !== 'en' && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ...spring, delay: 0.26 }}
            className="text-sm italic mt-3"
            style={{ color: 'var(--text-40)' }}
          >
            {t('blog.blog_language_note')}
          </motion.p>
        )}
      </section>

      {/* Post grid */}
      <section className="px-6 pb-24 max-w-6xl mx-auto w-full">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {posts.map(post => (
            <motion.article
              key={post.slug}
              variants={fadeUp}
              className="flex flex-col gap-4 transition-[border-color] duration-200 hover:border-[rgba(107,63,220,0.4)]"
              style={{
                background: 'var(--bg-card)',
                border: '0.5px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
              }}
            >
              <div>
                <p className="text-xs mb-3" style={{ color: 'var(--text-40)' }}>{formatDate(post.date)}</p>
                <h2 className="text-xl leading-snug mb-2" style={{ color: 'var(--text-100)', fontWeight: 500 }}>
                  {post.title}
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-60)' }}>{post.description}</p>
              </div>
              <Link
                href={`/blog/${post.slug}`}
                className="text-sm font-medium transition-colors duration-150 mt-auto hover:underline"
                style={{ color: 'var(--primary)' }}
              >
                {t('blog.blog_read_more')} &rarr;
              </Link>
            </motion.article>
          ))}
        </motion.div>
      </section>

      {/* Footer */}
      <CreoBotFooter langSwitcher={<LanguageSwitcher />} />
    </main>
  )
}
