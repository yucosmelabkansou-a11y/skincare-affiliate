// 関連記事への内部リンク（top→診断→結果→商品→関連記事 の導線を接続するためのSEO内部リンク）
// 渡されたタグに一致するコラム/Q&Aを優先し、足りなければ新着で補完。常にハブ（コラム・Q&A一覧）へのリンクも表示する。

import Link from 'next/link'
import { getAllArticles } from '@/lib/articles'
import SectionLabel from './SectionLabel'

type Props = {
  tags?: string[]
  max?: number
}

export default function RelatedReads({ tags = [], max = 3 }: Props) {
  const all = [
    ...getAllArticles('column').map((a) => ({ ...a, _type: 'column' as const })),
    ...getAllArticles('qa').map((a) => ({ ...a, _type: 'qa' as const })),
  ]
  if (all.length === 0) return null

  const tagSet = new Set(tags)
  const picked = all
    .map((a) => ({ a, score: (a.tags || []).filter((t) => tagSet.has(t)).length }))
    .sort((x, y) => {
      if (y.score !== x.score) return y.score - x.score
      return (y.a.publishedAt || '').localeCompare(x.a.publishedAt || '')
    })
    .slice(0, max)
    .map((s) => s.a)

  return (
    <section className="px-5 pb-12">
      <SectionLabel en="Related Reads" jp="関連して読みたい" />

      <div className="space-y-3 max-w-md mx-auto">
        {picked.map((a) => (
          <Link
            key={`${a._type}-${a.slug}`}
            href={`/${a._type}/${a.slug}`}
            className="flex items-center gap-3 px-5 py-4 transition-opacity hover:opacity-80 active:opacity-70"
            style={{
              background: '#fff',
              border: '1px solid var(--line-soft)',
              borderLeft: '2px solid var(--gold)',
              borderRadius: 4,
              textDecoration: 'none',
              minHeight: 60,
            }}
          >
            <span
              className="flex-shrink-0"
              style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontWeight: 300,
                fontSize: 10,
                letterSpacing: '0.18em',
                color: 'var(--gold-deep)',
                textTransform: 'uppercase',
              }}
            >
              {a._type === 'qa' ? 'Q&A' : 'Column'}
            </span>
            <span
              className="flex-1 min-w-0 line-clamp-2"
              style={{
                fontFamily: 'var(--font-jp)',
                fontWeight: 500,
                fontSize: 13,
                lineHeight: 1.5,
                letterSpacing: '0.04em',
                color: 'var(--ink)',
              }}
            >
              {a.title}
            </span>
            <span style={{ color: 'var(--gold)', fontSize: 16, flexShrink: 0 }}>→</span>
          </Link>
        ))}
      </div>

      {/* ハブ一覧への導線 */}
      <div className="flex gap-3 max-w-md mx-auto mt-4">
        <Link
          href="/column"
          className="flex-1 text-center py-3 transition-opacity hover:opacity-70"
          style={{
            fontFamily: 'var(--font-jp)',
            fontWeight: 500,
            fontSize: 11.5,
            letterSpacing: '0.16em',
            color: 'var(--ink)',
            border: '1px solid var(--line-soft)',
            background: '#fff',
            textDecoration: 'none',
          }}
        >
          コラム一覧 →
        </Link>
        <Link
          href="/qa"
          className="flex-1 text-center py-3 transition-opacity hover:opacity-70"
          style={{
            fontFamily: 'var(--font-jp)',
            fontWeight: 500,
            fontSize: 11.5,
            letterSpacing: '0.16em',
            color: 'var(--ink)',
            border: '1px solid var(--line-soft)',
            background: '#fff',
            textDecoration: 'none',
          }}
        >
          Q&A一覧 →
        </Link>
      </div>
    </section>
  )
}
