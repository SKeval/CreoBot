import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import BlogPageClient from './BlogPageClient'

interface PostMeta {
  title: string
  description: string
  date: string
  slug: string
}

function getPosts(): PostMeta[] {
  const dir = path.join(process.cwd(), 'content/blog')
  const files = fs.readdirSync(dir)
  return files
    .map(file => {
      const raw = fs.readFileSync(path.join(dir, file), 'utf-8')
      const { data } = matter(raw)
      return data as PostMeta
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export default function BlogPage() {
  const posts = getPosts()
  return <BlogPageClient posts={posts} />
}
