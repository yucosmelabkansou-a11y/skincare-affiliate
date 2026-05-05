// 記事末尾の監修者プロフィール（E-E-A-T 強化）
// column / qa の各記事ページで共通利用

import Link from 'next/link'

export default function ArticleAuthor() {
  return (
    <section className="px-5 pb-12">
      <article
        className="mx-auto px-7 py-7"
        style={{
          background: '#fff',
          border: '1px solid var(--line-soft)',
          maxWidth: 540,
        }}
        aria-labelledby="article-author-heading"
      >
        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-5 justify-center">
          <span
            className="block w-7 h-px"
            style={{ background: 'var(--gold)' }}
            aria-hidden
          />
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
            Reviewed by
          </span>
          <span
            className="block w-7 h-px"
            style={{ background: 'var(--gold)' }}
            aria-hidden
          />
        </div>

        {/* Name + roles */}
        <h3
          id="article-author-heading"
          className="text-center"
          style={{
            fontFamily: 'var(--font-jp)',
            fontWeight: 500,
            fontSize: 15,
            letterSpacing: '0.16em',
            color: 'var(--ink)',
            marginBottom: 8,
          }}
        >
          監修：ゆん
        </h3>
        <p
          className="text-center"
          style={{
            fontFamily: 'var(--font-jp)',
            fontWeight: 400,
            fontSize: 11.5,
            lineHeight: 1.7,
            letterSpacing: '0.14em',
            color: 'var(--gold-deep)',
            marginBottom: 18,
          }}
        >
          元化粧品研究・商品企画 ／ 生涯ノーファンデ歴29年
        </p>

        {/* Bio */}
        <p
          className="mx-auto"
          style={{
            fontFamily: 'var(--font-jp-alt)',
            fontWeight: 400,
            fontSize: 12.5,
            lineHeight: 2,
            letterSpacing: '0.06em',
            color: 'var(--ink-soft)',
            maxWidth: '34ch',
            textAlign: 'justify',
          }}
        >
          化粧品メーカーで研究・商品企画として勤務した知見と、生涯ノーファンデ29年で磨いた素肌の感覚を活かして、SNSや流行の成分に左右されず<strong style={{ color: 'var(--ink)', fontWeight: 500 }}>本当に使ってよかったアイテムを成分とコスパで厳選</strong>しています。Instagramフォロワー5.7万人。
        </p>

        {/* CTA: Instagram */}
        <div className="mt-7 text-center">
          <Link
            href="https://www.instagram.com/yun.skincare_"
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 transition-opacity hover:opacity-70"
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontWeight: 300,
              fontSize: 12,
              letterSpacing: '0.32em',
              color: 'var(--gold-deep)',
            }}
          >
            @yun.skincare_ →
          </Link>
        </div>
      </article>
    </section>
  )
}
