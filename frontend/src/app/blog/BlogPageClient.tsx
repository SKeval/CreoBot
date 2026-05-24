'use client'

import Link from 'next/link'
import { Bot } from 'lucide-react'
import { CreoBotNavbar } from '@/components/ui/creobot-navbar'
import { useLanguage } from '@/lib/LanguageContext'

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

export default function BlogPageClient({ posts }: { posts: PostMeta[] }) {
  const { t } = useLanguage()

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col">
      <CreoBotNavbar />

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-6 pt-24 pb-16">
        <span className="text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-4 py-1.5 rounded-full mb-6 uppercase tracking-widest">
          {t('blog.blog_badge')}
        </span>
        <h1 className="text-[clamp(1.8rem,4vw,3.5rem)] font-bold tracking-tight leading-tight text-balance max-w-3xl mx-auto mb-4">
          {t('blog.blog_title')}
        </h1>
        <p className="text-gray-400 text-[clamp(0.95rem,2vw,1.2rem)] max-w-xl leading-relaxed">
          {t('blog.blog_subtitle')}
        </p>
      </section>

      {/* Post grid */}
      <section className="px-6 pb-24 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map(post => (
            <article
              key={post.slug}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-7 flex flex-col gap-4 hover:border-gray-700 transition-colors duration-200"
            >
              <div>
                <p className="text-gray-500 text-xs mb-3">{formatDate(post.date)}</p>
                <h2 className="text-white font-semibold text-xl leading-snug mb-2">
                  {post.title}
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed">{post.description}</p>
              </div>
              <Link
                href={`/blog/${post.slug}`}
                className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors duration-200 mt-auto"
              >
                {t('blog.blog_read_more')} &rarr;
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-6 pt-8 pb-6 mt-auto">
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
