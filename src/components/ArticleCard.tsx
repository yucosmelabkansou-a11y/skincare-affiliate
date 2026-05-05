// 記事一覧カード（コラム / Q&A 共通）

import Link from 'next/link'
import type { Article } from '@/lib/articles'

const TYPE_LABEL: Record<Article['type'], { en: string; jp: string }> = {
  column: { en: 'Column', jp: 'コラム' },
  qa: { en: 'Q & A', jp: 'インスタライブ Q&A' },
}

export default function ArticleCard({ article }: { article: Article }) {
  const label = TYPE_LABEL[article.type]
  const href = `/${article.type}/${article.slug}`

  return (
    <Link
      href={href}
      className="block transition-opacity hover:opacity-80"
      style={{
        background: '#fff',
        border: '1px solid var(--line-soft)',
      }}
    >
      <article className="px-5 py-6">
        <div className="flex items-baseline gap-3 mb-3">
          <span
            className="px-2 py-0.5 inline-block"
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontWeight: 300,
              fontSize: 10,
              letterSpacing: '0.22em',
              color: 'var(--gold-deep)',
              border: '1px solid var(--gold)',
              textTransform: 'uppercase',
              borderRadius: 999,
            }}
          >
            {label.en}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontWeight: 300,
              fontSize: 11,
              letterSpacing: '0.18em',
              color: 'var(--ink-mute)',
            }}
          >
            {article.publishedAt}
          </span>
        </div>

        <h3
          className="mb-3"
          style={{
            fontFamily: 'var(--font-jp)',
            fontWeight: 500,
            fontSize: 16,
            lineHeight: 1.6,
            letterSpacing: '0.06em',
            color: 'var(--ink)',
            overflowWrap: 'anywhere',
          }}
        >
          {article.title}
        </h3>

        {article.description && (
          <p
            style={{
              fontFamily: 'var(--font-jp-alt)',
              fontWeight: 400,
              fontSize: 12,
              lineHeight: 1.9,
              letterSpacing: '0.06em',
              color: 'var(--ink-soft)',
            }}
          >
            {article.description}
          </p>
        )}

        {article.tags && article.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {article.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 300,
                  fontSize: 10,
                  letterSpacing: '0.16em',
                  color: 'var(--ink-mute)',
                  border: '1px solid var(--line)',
                  padding: '2px 8px',
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </article>
    </Link>
  )
}
