import type { Metadata } from 'next'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { notFound } from 'next/navigation'
import BlogPostClient from './BlogPostClient'

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

export async function generateStaticParams() {
  const dir = path.join(process.cwd(), 'content/blog')
  const files = fs.readdirSync(dir)
  return files.map(file => ({ slug: file.replace('.mdx', '') }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = getPost(params.slug)
  if (!post) return { title: 'Post not found - CreoBot Blog' }
  return {
    title: `${post.data.title} - CreoBot Blog`,
    description: post.data.description,
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug)
  if (!post) notFound()
  return <BlogPostClient post={post} />
}
