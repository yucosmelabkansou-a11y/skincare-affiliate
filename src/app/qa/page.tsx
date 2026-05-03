import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllArticles } from '@/lib/articles'
import ArticleCard from '@/components/ArticleCard'
import { SITE_URL } from '@/lib/siteConfig'

export const metadata: Metadata = {
  title: 'インスタライブQ&A一覧｜フォロワーの肌悩みに元化粧品研究員が回答',
  description:
    '元化粧品研究・商品企画／生涯ノーファンデ歴29年のゆんが、Instagramライブで寄せられた肌悩みに直接お答えしたQ&A集。「敏感肌でレチノールを使うコツ」「混合肌の保湿バランス」など、リアルな質問への実践回答をまとめました。',
  alternates: { canonical: `${SITE_URL}/qa` },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/qa`,
    title: 'インスタライブQ&A一覧｜yun.skincare_',
    description: 'フォロワーからの肌悩み相談に元化粧品研究員ゆんが回答するQ&A集。',
    images: ['/og-image.jpg'],
  },
}

export default function QaIndexPage() {
  const articles = getAllArticles('qa')

  return (
    <div
      className="max-w-2xl mx-auto min-h-screen"
      style={{ background: 'var(--bg-cream)' }}
    >
      {/* パンくず */}
      <nav
        className="px-5 pt-5 text-[10px]"
        style={{ color: 'var(--ink-mute)', letterSpacing: '0.2em' }}
        aria-label="パンくず"
      >
        <Link href="/" className="hover:opacity-70">ホーム</Link>
        <span className="mx-2">/</span>
        <span style={{ color: 'var(--ink)' }}>Q&A</span>
      </nav>

      {/* Hero */}
      <section className="px-6 pt-10 pb-12 text-center">
        <div
          className="flex flex-col items-center gap-1.5 mb-7"
          style={{
            fontFamily: 'var(--font-sans)',
            fontWeight: 300,
            letterSpacing: '0.45em',
            fontSize: '10px',
            color: 'var(--gold-deep)',
            textTransform: 'uppercase',
          }}
        >
          <div className="flex items-center justify-center gap-3 whitespace-nowrap">
            <span className="block w-7 h-px" style={{ background: 'var(--gold)' }} aria-hidden />
            <span>Instagram Live Q & A</span>
            <span className="block w-7 h-px" style={{ background: 'var(--gold)' }} aria-hidden />
          </div>
          <span className="whitespace-nowrap">{articles.length} sessions</span>
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-jp)',
            fontWeight: 500,
            fontSize: 'clamp(20px, 5.6vw, 26px)',
            letterSpacing: '0.14em',
            color: 'var(--ink)',
            wordBreak: 'keep-all',
          }}
        >
          フォロワーの質問に
          <br />
          直接お答えします
        </h1>

        <p
          className="mx-auto mt-7"
          style={{
            fontFamily: 'var(--font-jp-alt)',
            fontWeight: 400,
            fontSize: 13,
            lineHeight: 2,
            letterSpacing: '0.08em',
            color: 'var(--ink-soft)',
            maxWidth: '32ch',
          }}
        >
          毎月のインスタライブで寄せられたリアルな肌悩み相談に、元化粧品研究・商品企画のゆんが直接お答えしたQ&Aアーカイブです。
        </p>
      </section>

      {/* 記事一覧 */}
      <section className="px-5 pb-16">
        {articles.length === 0 ? (
          <p
            className="text-center py-12"
            style={{
              fontFamily: 'var(--font-jp-alt)',
              fontSize: 12,
              color: 'var(--ink-mute)',
              letterSpacing: '0.1em',
            }}
          >
            Q&Aを準備中です。
          </p>
        ) : (
          <div className="space-y-3 max-w-md mx-auto">
            {articles.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        )}
      </section>

      {/* ナビゲーション */}
      <section className="px-5 pb-12 text-center">
        <Link
          href="/column"
          className="inline-flex items-center gap-3 px-7 py-3 transition-opacity hover:opacity-70"
          style={{
            fontFamily: 'var(--font-jp)',
            fontWeight: 500,
            fontSize: 12,
            letterSpacing: '0.24em',
            color: 'var(--ink)',
            border: '1px solid var(--gold)',
            background: '#fff',
          }}
        >
          コラム一覧を見る →
        </Link>
      </section>
    </div>
  )
}
