// ホームの Journal セクション — サイト内記事（コラム + Q&A）への誘導

import Link from 'next/link'
import { getAllArticles } from '@/lib/articles'
import ArticleCard from './ArticleCard'
import SectionLabel from './SectionLabel'

export default function JournalSection() {
  // 各カテゴリの最新記事を3本ずつ
  const columns = getAllArticles('column').slice(0, 3)
  const qas = getAllArticles('qa').slice(0, 3)

  // 何も無い時はセクション自体を出さない（ノイズ回避）
  if (columns.length === 0 && qas.length === 0) return null

  return (
    <section
      id="journal"
      className="px-5 py-20"
      style={{
        background: 'var(--bg-cream)',
        borderTop: '1px solid var(--line-soft)',
      }}
      aria-labelledby="journal-heading"
    >
      <h2 id="journal-heading" className="sr-only">
        読み物
      </h2>
      <SectionLabel en="Journal" jp="読み物" />

      {/* コラム */}
      {columns.length > 0 && (
        <div className="max-w-md mx-auto mb-10">
          <div className="flex items-center justify-between mb-4 px-1">
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontWeight: 300,
                fontSize: 12,
                letterSpacing: '0.32em',
                color: 'var(--gold-deep)',
                textTransform: 'uppercase',
              }}
            >
              Column
            </span>
            <Link
              href="/column"
              className="transition-opacity hover:opacity-70"
              style={{
                fontFamily: 'var(--font-sans)',
                fontWeight: 300,
                fontSize: 10.5,
                letterSpacing: '0.24em',
                color: 'var(--ink-mute)',
                textTransform: 'uppercase',
              }}
            >
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            {columns.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </div>
      )}

      {/* Q&A */}
      {qas.length > 0 && (
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-4 px-1">
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontWeight: 300,
                fontSize: 12,
                letterSpacing: '0.32em',
                color: 'var(--gold-deep)',
                textTransform: 'uppercase',
              }}
            >
              Insta Live Q & A
            </span>
            <Link
              href="/qa"
              className="transition-opacity hover:opacity-70"
              style={{
                fontFamily: 'var(--font-sans)',
                fontWeight: 300,
                fontSize: 10.5,
                letterSpacing: '0.24em',
                color: 'var(--ink-mute)',
                textTransform: 'uppercase',
              }}
            >
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            {qas.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
