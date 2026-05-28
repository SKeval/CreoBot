'use client'

import Link from 'next/link'
import { Bot } from 'lucide-react'
import { motion } from 'framer-motion'
import { CreoBotNavbar } from '@/components/ui/creobot-navbar'
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
    <main className="min-h-screen bg-gray-950 text-white flex flex-col">
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
            className="text-gray-400 hover:text-white text-sm transition-colors duration-200 inline-block mb-10"
          >
            &larr; {t('blog.blog_back')}
          </Link>
        </motion.div>

        {/* Post header */}
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.08 }}
          className="text-3xl md:text-4xl font-bold tracking-tight text-white mt-2 mb-3"
        >
          {post.data.title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...spring, delay: 0.16 }}
          className="text-gray-500 text-sm mb-6"
        >
          {formatDate(post.data.date)}
        </motion.p>
        <motion.hr
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="border-gray-800 mb-10"
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
          whileHover={{ scale: 1.01, transition: spring }}
          className="mt-16 rounded-2xl p-8 text-center border border-transparent hover:border-blue-400/20 hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] transition-[border-color,box-shadow] duration-200 ease-out"
          style={{ backgroundColor: '#1a56db' }}
        >
          <h3 className="text-white font-bold text-xl mb-2 tracking-tight">
            {t('blog.blog_cta_title')}
          </h3>
          <p className="text-blue-100 text-sm mb-6 leading-relaxed">
            {t('blog.blog_cta_subtitle')}
          </p>
          <motion.div
            whileTap={{ scale: 0.97, transition: spring }}
            className="inline-block"
          >
            <Link
              href="/signup"
              className="inline-block bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors duration-200"
            >
              {t('blog.blog_cta_button')}
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
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
            <span className="text-gray-700 mx-2">·</span>
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
