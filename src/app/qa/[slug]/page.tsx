import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getAllSlugs, getArticle, getAllArticles, resolveCta, splitBodyAtMiddleH2 } from '@/lib/articles'
import ArticleCTA from '@/components/ArticleCTA'
import ArticleAuthor from '@/components/ArticleAuthor'
import ArticleCard from '@/components/ArticleCard'
import { SITE_URL } from '@/lib/siteConfig'

export function generateStaticParams() {
  return getAllSlugs('qa').map((slug) => ({ slug }))
}

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const a = getArticle('qa', slug)
  if (!a) return {}
  return {
    title: `${a.title}｜インスタライブQ&A`,
    description: a.description || a.title,
    alternates: { canonical: `${SITE_URL}/qa/${a.slug}` },
    openGraph: {
      type: 'article',
      url: `${SITE_URL}/qa/${a.slug}`,
      title: a.title,
      description: a.description || a.title,
      images: a.hero ? [a.hero] : ['/og-image.jpg'],
      publishedTime: a.publishedAt,
      modifiedTime: a.updatedAt || a.publishedAt,
      authors: ['ゆん（yun.skincare_）'],
      tags: a.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: a.title,
      description: a.description || a.title,
      images: ['/og-image.jpg'],
    },
  }
}

export default async function QaPage({ params }: Props) {
  const { slug } = await params
  const a = getArticle('qa', slug)
  if (!a) notFound()

  const related = getAllArticles('qa')
    .filter((x) => x.slug !== a.slug)
    .filter((x) =>
      a.tags && x.tags ? a.tags.some((t) => x.tags!.includes(t)) : false,
    )
    .slice(0, 3)

  const cta = resolveCta(a)
  const showMid = cta.mid !== 'none' && cta.mid !== cta.end
  const split = showMid ? splitBodyAtMiddleH2(a.body) : null

  // FAQPage 構造化データ（Q&A記事は特に Q: / A: 形式に最適）
  const faqMatches = Array.from(
    a.body.matchAll(/##\s*Q\.\s*([^\n]+)[\s\S]*?A\.\s*([^\n]+)/g),
  ).slice(0, 10)
  const faqJsonLd = faqMatches.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqMatches.map(([, q, ans]) => ({
          '@type': 'Question',
          name: q.trim(),
          acceptedAnswer: { '@type': 'Answer', text: ans.trim() },
        })),
      }
    : null

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.title,
    description: a.description,
    datePublished: a.publishedAt,
    dateModified: a.updatedAt || a.publishedAt,
    author: {
      '@type': 'Person',
      name: 'ゆん（yun.skincare_）',
      jobTitle: '元化粧品研究・商品企画',
      url: 'https://www.instagram.com/yun.skincare_',
    },
    publisher: {
      '@type': 'Organization',
      name: 'yun.skincare_',
      url: SITE_URL,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/qa/${a.slug}`,
    },
    keywords: a.tags?.join(','),
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'ホーム', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'インスタライブQ&A', item: `${SITE_URL}/qa` },
      { '@type': 'ListItem', position: 3, name: a.title, item: `${SITE_URL}/qa/${a.slug}` },
    ],
  }

  return (
    <div
      className="max-w-2xl mx-auto min-h-screen"
      style={{ background: 'var(--bg-cream)' }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      <nav
        className="px-5 pt-5 text-[10px]"
        style={{ color: 'var(--ink-mute)', letterSpacing: '0.2em' }}
        aria-label="パンくず"
      >
        <Link href="/" className="hover:opacity-70">ホーム</Link>
        <span className="mx-2">/</span>
        <Link href="/qa" className="hover:opacity-70">Q&A</Link>
        <span className="mx-2">/</span>
        <span style={{ color: 'var(--ink)' }}>記事</span>
      </nav>

      <header className="px-6 pt-10 pb-7 text-center">
        <span
          className="inline-block px-3 py-1 mb-5"
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 11,
            letterSpacing: '0.32em',
            color: 'var(--gold-deep)',
            border: '1px solid var(--gold)',
            textTransform: 'uppercase',
            borderRadius: 999,
          }}
        >
          Insta Live Q & A
        </span>

        <h1
          className="mx-auto mb-5"
          style={{
            fontFamily: 'var(--font-jp)',
            fontWeight: 500,
            fontSize: 'clamp(21px, 5.6vw, 28px)',
            lineHeight: 1.7,
            letterSpacing: '0.08em',
            color: 'var(--ink)',
            wordBreak: 'keep-all',
            maxWidth: '24ch',
          }}
        >
          {a.title}
        </h1>

        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontWeight: 300,
            fontSize: 11,
            letterSpacing: '0.28em',
            color: 'var(--ink-mute)',
          }}
        >
          {a.liveDate ? `Live: ${a.liveDate}` : a.publishedAt}
        </p>

        {a.description && (
          <p
            className="mx-auto mt-7"
            style={{
              fontFamily: 'var(--font-jp-alt)',
              fontWeight: 400,
              fontSize: 13,
              lineHeight: 1.95,
              letterSpacing: '0.06em',
              color: 'var(--ink-soft)',
              maxWidth: '32ch',
            }}
          >
            {a.description}
          </p>
        )}
      </header>

      {split ? (
        <>
          <article
            className="px-6 pb-4 prose-yun"
            style={{ fontFamily: 'var(--font-jp)', color: 'var(--ink)' }}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{split.before}</ReactMarkdown>
          </article>
          <ArticleCTA variant="mid" target={cta.mid} />
          <article
            className="px-6 pb-8 prose-yun"
            style={{ fontFamily: 'var(--font-jp)', color: 'var(--ink)' }}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{split.after}</ReactMarkdown>
          </article>
        </>
      ) : (
        <article
          className="px-6 pb-8 prose-yun"
          style={{ fontFamily: 'var(--font-jp)', color: 'var(--ink)' }}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{a.body}</ReactMarkdown>
        </article>
      )}

      <ArticleAuthor />

      <ArticleCTA variant="end" target={cta.end} />

      {a.tags && a.tags.length > 0 && (
        <div className="px-6 pb-8 flex flex-wrap gap-2 justify-center">
          {a.tags.map((t) => (
            <span
              key={t}
              style={{
                fontFamily: 'var(--font-sans)',
                fontWeight: 300,
                fontSize: 10,
                letterSpacing: '0.18em',
                color: 'var(--ink-mute)',
                border: '1px solid var(--line)',
                padding: '3px 10px',
              }}
            >
              #{t}
            </span>
          ))}
        </div>
      )}

      {related.length > 0 && (
        <section className="px-5 pb-12">
          <div className="flex flex-col items-center gap-2 mb-6">
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontWeight: 300,
                fontSize: 11,
                letterSpacing: '0.4em',
                color: 'var(--gold-deep)',
                textTransform: 'uppercase',
              }}
            >
              Related Q & A
            </span>
            <span
              style={{ width: 1, height: 24, background: 'var(--gold)' }}
              aria-hidden
            />
          </div>
          <div className="space-y-3 max-w-md mx-auto">
            {related.map((r) => (
              <ArticleCard key={r.slug} article={r} />
            ))}
          </div>
        </section>
      )}

      <footer className="px-5 py-10 text-center" style={{ borderTop: '1px solid var(--line-soft)' }}>
        <Link
          href="/qa"
          className="inline-flex items-center gap-2 transition-opacity hover:opacity-70"
          style={{
            fontFamily: 'var(--font-sans)',
            fontWeight: 300,
            fontSize: 11,
            letterSpacing: '0.32em',
            color: 'var(--ink-mute)',
            textTransform: 'uppercase',
          }}
        >
          ← Back to Q&A List
        </Link>
      </footer>
    </div>
  )
}
