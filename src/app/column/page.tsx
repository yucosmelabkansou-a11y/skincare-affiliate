import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllArticles } from '@/lib/articles'
import ArticleCard from '@/components/ArticleCard'
import { SITE_URL } from '@/lib/siteConfig'

export const metadata: Metadata = {
  title: 'コラム一覧｜スキンケアの基礎・成分・考え方',
  description:
    '元化粧品研究・商品企画／生涯ノーファンデ歴29年のゆんが綴るスキンケアコラム。基礎ケアの順番、注目成分の解説、季節別ケアのコツなど、毎日の美容に役立つ読み物をまとめています。',
  alternates: { canonical: `${SITE_URL}/column` },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/column`,
    title: 'コラム一覧｜yun.skincare_',
    description: '元化粧品研究・商品企画ゆんが綴るスキンケアコラム。',
    // OGP画像は app/opengraph-image.tsx で自動付与
  },
}

export default function ColumnIndexPage() {
  const articles = getAllArticles('column')

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
        <span style={{ color: 'var(--ink)' }}>コラム</span>
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
            <span>Column</span>
            <span className="block w-7 h-px" style={{ background: 'var(--gold)' }} aria-hidden />
          </div>
          <span className="whitespace-nowrap">{articles.length} articles</span>
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
          スキンケアの基礎と
          <br />
          成分の話
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
          毎日の小さな積み重ねが、明日の素肌をつくる。
          <br />
          元化粧品研究・商品企画のゆんが、本当に役立つスキンケアの基礎をひとつずつ綴ります。
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
            記事を準備中です。
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
          href="/qa"
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
          インスタライブQ&Aを見る →
        </Link>
      </section>
    </div>
  )
}
