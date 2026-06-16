'use client'

import ReactMarkdown from 'react-markdown'

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      components={{
        h2: ({ children }) => (
          <h2 className="text-2xl mt-10 mb-4" style={{ color: 'var(--text-100)', fontWeight: 500 }}>{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-xl mt-8 mb-3" style={{ color: 'var(--text-100)', fontWeight: 500 }}>{children}</h3>
        ),
        p: ({ children }) => (
          <p className="leading-relaxed mb-5" style={{ color: 'var(--text-60)' }}>{children}</p>
        ),
        ul: ({ children }) => (
          <ul className="list-disc list-inside mb-5 space-y-2" style={{ color: 'var(--text-60)' }}>{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-inside mb-5 space-y-2" style={{ color: 'var(--text-60)' }}>{children}</ol>
        ),
        li: ({ children }) => (
          <li className="leading-relaxed" style={{ color: 'var(--text-60)' }}>{children}</li>
        ),
        strong: ({ children }) => (
          <strong className="font-semibold" style={{ color: 'var(--text-100)' }}>{children}</strong>
        ),
        a: ({ children, href }) => (
          <a href={href} className="hover:underline" style={{ color: 'var(--primary)' }}>{children}</a>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  )
}
