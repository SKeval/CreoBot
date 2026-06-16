'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { CreoBotNavbar } from '@/components/ui/creobot-navbar'
import { CreoBotFooter } from '@/components/ui/creobot-footer'
import { useLanguage } from '@/lib/LanguageContext'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { MarkdownRenderer } from './markdown-renderer'

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
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: spring,
  },
}

export default function BlogPostClient({ post }: { post: { data: PostMeta; content: string } }) {
  const { t } = useLanguage()

  return (
    <main className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-page)', color: 'var(--text-100)' }}>
      <CreoBotNavbar langSwitcher={<LanguageSwitcher />} />

      <div className="flex-1 max-w-2xl mx-auto px-6 py-16 w-full">
        {/* Back link */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <Link
            href="/blog"
            className="text-sm transition-colors duration-150 inline-block mb-10 hover:text-white"
            style={{ color: 'var(--text-60)' }}
          >
            &larr; {t('blog.blog_back')}
          </Link>
        </motion.div>

        {/* Post header */}
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.08 }}
          className="mt-2 mb-3"
          style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 500, lineHeight: 1.2, color: 'var(--text-100)' }}
        >
          {post.data.title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...spring, delay: 0.16 }}
          className="text-sm mb-6"
          style={{ color: 'var(--text-40)' }}
        >
          {formatDate(post.data.date)}
        </motion.p>
        <motion.hr
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="mb-10"
          style={{ borderColor: 'var(--border)' }}
        />

        {/* Post body */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.24 }}
        >
          <MarkdownRenderer content={post.content} />
        </motion.div>

        {/* CTA box */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.32 }}
          className="mt-16 text-center"
          style={{
            background: 'var(--bg-card)',
            border: '0.5px solid var(--primary)',
            borderRadius: 'var(--radius-lg)',
            padding: '32px',
          }}
        >
          <h3 className="text-xl mb-2" style={{ color: 'var(--text-100)', fontWeight: 500 }}>
            {t('blog.blog_cta_title')}
          </h3>
          <p className="text-sm mb-6 leading-relaxed" style={{ color: 'var(--text-60)' }}>
            {t('blog.blog_cta_subtitle')}
          </p>
          <Link
            href="/signup"
            className="inline-block font-medium transition-[background-color,transform] duration-150 active:scale-[0.97]"
            style={{
              background: 'var(--primary)',
              color: 'white',
              padding: '12px 28px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.9375rem',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--primary-hover)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--primary)' }}
          >
            {t('blog.blog_cta_button')}
          </Link>
        </motion.div>
      </div>

      {/* Footer */}
      <CreoBotFooter langSwitcher={<LanguageSwitcher />} />
    </main>
  )
}
