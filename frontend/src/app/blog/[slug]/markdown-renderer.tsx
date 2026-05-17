'use client'

import ReactMarkdown from 'react-markdown'

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      components={{
        h2: ({ children }) => (
          <h2 className="text-white font-bold text-2xl mt-10 mb-4">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-white font-bold text-xl mt-8 mb-3">{children}</h3>
        ),
        p: ({ children }) => (
          <p className="text-gray-300 leading-relaxed mb-5">{children}</p>
        ),
        ul: ({ children }) => (
          <ul className="text-gray-300 list-disc list-inside mb-5 space-y-2">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="text-gray-300 list-decimal list-inside mb-5 space-y-2">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="text-gray-300 leading-relaxed">{children}</li>
        ),
        strong: ({ children }) => (
          <strong className="text-white font-semibold">{children}</strong>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  )
}
