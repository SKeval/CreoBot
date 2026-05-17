import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Bot } from 'lucide-react'
import { CreoBotNavbar } from '@/components/ui/creobot-navbar'
import { MarkdownRenderer } from './markdown-renderer'

interface PostMeta {
  title: string
  description: string
  date: string
  slug: string
}

function getPost(slug: string): { data: PostMeta; content: string } | null {
  const filePath = path.join(process.cwd(), 'content/blog', `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)
  return { data: data as PostMeta, content }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export async function generateStaticParams() {
  const dir = path.join(process.cwd(), 'content/blog')
  const files = fs.readdirSync(dir)
  return files.map(file => ({ slug: file.replace('.mdx', '') }))
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug)
  if (!post) notFound()

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col">
      <CreoBotNavbar />

      <div className="flex-1 max-w-2xl mx-auto px-6 py-16 w-full">
        {/* Back link */}
        <Link
          href="/blog"
          className="text-gray-400 hover:text-white text-sm transition-colors duration-200 inline-block mb-10"
        >
          &larr; Back to blog
        </Link>

        {/* Post header */}
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mt-2 mb-3">
          {post.data.title}
        </h1>
        <p className="text-gray-500 text-sm mb-6">{formatDate(post.data.date)}</p>
        <hr className="border-gray-800 mb-10" />

        {/* Post body */}
        <MarkdownRenderer content={post.content} />

        {/* CTA box */}
        <div
          className="mt-16 rounded-2xl p-8 text-center"
          style={{ backgroundColor: '#1a56db' }}
        >
          <h3 className="text-white font-bold text-xl mb-2">
            Want a chatbot that never makes things up?
          </h3>
          <p className="text-blue-100 text-sm mb-6">
            CreoBot answers from your docs only. Free 14-day trial.
          </p>
          <Link
            href="/signup"
            className="inline-block bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors duration-200"
          >
            Start free - no card needed
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-6 pt-8 pb-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center sm:items-start gap-1">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-blue-500" />
              <span className="font-bold text-white">CreoBot</span>
            </div>
            <p className="text-gray-500 text-xs">AI chatbot for small businesses.</p>
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
            <p className="text-gray-600 text-sm">© 2026 CreoBot</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
