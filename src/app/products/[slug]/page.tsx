import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import AffiliateLink from '@/components/AffiliateLink'
import ArticleAuthor from '@/components/ArticleAuthor'
import {
  getAllProductPages,
  getProductPageBySlug,
  parsePriceJPY,
} from '@/lib/product-pages'
import { SITE_URL, SITE_NAME } from '@/lib/siteConfig'

export function generateStaticParams() {
  return getAllProductPages().map(({ editorial }) => ({ slug: editorial.slug }))
}

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const data = getProductPageBySlug(slug)
  if (!data) return {}
  const { product } = data
  const title = `${product.name}｜${product.brand}は本当に良い？元研究員のレビュー`
  const description =
    `${product.brand}「${product.name}」を元化粧品研究・商品企画のゆんがレビュー。` +
    `${product.review}`.slice(0, 118)
  const image = product.image_filename ? `/images/${product.image_filename}` : '/og-image.jpg'
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/products/${slug}` },
    openGraph: {
      type: 'article',
      url: `${SITE_URL}/products/${slug}`,
      title,
      description,
      images: [image],
    },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const data = getProductPageBySlug(slug)
  if (!data) notFound()
  const { product, editorial } = data

  const priceJPY = parsePriceJPY(product.price)
  const buyUrl = product.amazon_url || product.rakuten_url || `${SITE_URL}/products/${slug}`

  // ── 構造化データ：Product（価格・販売先が検索結果に出る可能性）──────────────
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.image_filename ? [`${SITE_URL}/images/${product.image_filename}`] : undefined,
    description: product.review,
    brand: { '@type': 'Brand', name: product.brand },
    category: product.category,
    ...(priceJPY
      ? {
          offers: {
            '@type': 'Offer',
            priceCurrency: 'JPY',
            price: priceJPY,
            availability: 'https://schema.org/InStock',
            url: buyUrl,
          },
        }
      : {}),
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'ホーム', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: '商品', item: `${SITE_URL}/products` },
      { '@type': 'ListItem', position: 3, name: product.name, item: `${SITE_URL}/products/${slug}` },
    ],
  }

  const buyBtnClass =
    'flex-1 text-center px-4 py-3 text-sm font-semibold rounded-full border transition-colors tracking-wider'

  return (
    <div className="max-w-2xl mx-auto min-h-screen" style={{ background: 'var(--bg-cream)' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      {/* パンくず */}
      <nav
        className="px-5 pt-5 text-[10px]"
        style={{ color: 'var(--ink-mute)', letterSpacing: '0.2em' }}
        aria-label="パンくず"
      >
        <Link href="/" className="hover:opacity-70">ホーム</Link>
        <span className="mx-2">/</span>
        <Link href="/" className="hover:opacity-70">商品</Link>
        <span className="mx-2">/</span>
        <span style={{ color: 'var(--ink)' }}>{product.category}</span>
      </nav>

      {/* ヒーロー：画像＋基本情報 */}
      <header className="px-6 pt-7 pb-2">
        <div
          className="relative w-full mx-auto mb-6 overflow-hidden rounded-2xl"
          style={{ maxWidth: 360, aspectRatio: '1 / 1', background: '#FAF6F3' }}
        >
          <div className="absolute inset-0 flex items-center justify-center text-4xl" style={{ color: '#E8C7D4' }}>
            🧴
          </div>
          {product.image_filename && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`/images/${product.image_filename}`}
              alt={`${product.brand} ${product.name}`}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
        </div>

        <p
          className="text-center mb-1"
          style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 12, letterSpacing: '0.2em', color: 'var(--ink-mute)' }}
        >
          {product.brand}
        </p>
        <h1
          className="mx-auto text-center mb-4"
          style={{
            fontFamily: 'var(--font-jp)',
            fontWeight: 600,
            fontSize: 'clamp(19px, 5vw, 26px)',
            lineHeight: 1.55,
            letterSpacing: '0.04em',
            color: 'var(--ink)',
            maxWidth: '28ch',
          }}
        >
          {product.name}
        </h1>

        <div className="flex flex-wrap gap-2 justify-center mb-2">
          <span
            className="px-3 py-0.5 text-[11px] rounded-full"
            style={{ background: '#FDF2F6', color: '#C2185B', letterSpacing: '0.08em' }}
          >
            {product.category}
          </span>
          {product.tags.map((t) => (
            <span
              key={t}
              className="px-3 py-0.5 text-[11px] rounded-full"
              style={{ border: '1px solid var(--line)', color: 'var(--ink-mute)' }}
            >
              #{t}
            </span>
          ))}
        </div>
        {product.price && (
          <p className="text-center" style={{ fontSize: 13, color: 'var(--ink-soft)' }}>{product.price}</p>
        )}
      </header>

      {/* 購入ボタン（ファーストビュー直下） */}
      {(product.amazon_url || product.rakuten_url) && (
        <div className="px-6 pt-4 pb-2">
          <div className="flex gap-2 max-w-md mx-auto">
            {product.amazon_url && (
              <AffiliateLink
                href={product.amazon_url}
                store="amazon"
                productId={product.id}
                productName={product.name}
                brand={product.brand}
                placement="product_page_hero"
                className={buyBtnClass}
                style={{ background: '#FF9900', color: '#2A2118', borderColor: '#FF9900' }}
              >
                Amazonで見る
              </AffiliateLink>
            )}
            {product.rakuten_url && (
              <AffiliateLink
                href={product.rakuten_url}
                store="rakuten"
                productId={product.id}
                productName={product.name}
                brand={product.brand}
                placement="product_page_hero"
                className={buyBtnClass}
                style={{ background: '#BF0000', color: '#fff', borderColor: '#BF0000' }}
              >
                楽天で見る
              </AffiliateLink>
            )}
          </div>
          <p className="text-center mt-2" style={{ fontSize: 10, color: 'var(--ink-mute)' }}>
            ※本ページはアフィリエイト広告（Amazon／楽天）を含みます。価格は変動する場合があります。
          </p>
        </div>
      )}

      {/* 本文 */}
      <article
        className="px-6 py-6 prose-yun"
        style={{ fontFamily: 'var(--font-jp)', color: 'var(--ink)' }}
      >
        {/* ゆんのレビュー（CSV review＝編集文をそのまま） */}
        <Section label="Review" title="どんなアイテム？">
          <p style={{ fontSize: 14, lineHeight: 2, color: 'var(--ink-soft)' }}>{product.review}</p>
        </Section>

        {/* 使用感 */}
        {editorial.texture && (
          <Section label="Texture" title="使用感">
            <p style={{ fontSize: 14, lineHeight: 2, color: 'var(--ink-soft)' }}>{editorial.texture}</p>
          </Section>
        )}

        {/* こんな人に向いている */}
        {editorial.whoFor && editorial.whoFor.length > 0 && (
          <Section label="Who for" title="こんな人に向いています">
            <ul className="space-y-2">
              {editorial.whoFor.map((w) => (
                <li key={w} className="flex gap-2" style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--ink)' }}>
                  <span style={{ color: 'var(--gold-deep)' }}>◎</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* 逆に向かない／注意 */}
        {editorial.notFor && editorial.notFor.length > 0 && (
          <Section label="Note" title="逆に、こんな人は要検討">
            <ul className="space-y-2">
              {editorial.notFor.map((w) => (
                <li key={w} className="flex gap-2" style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--ink-soft)' }}>
                  <span style={{ color: 'var(--ink-mute)' }}>△</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* 成分の視点 */}
        {product.key_ingredients.length > 0 && (
          <Section label="Ingredients" title="成分の視点">
            <ul className="space-y-3">
              {product.key_ingredients.map((ing) => (
                <li key={ing} style={{ fontSize: 14, lineHeight: 1.9 }}>
                  <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{ing}</span>
                  {editorial.ingredientNotes?.[ing] && (
                    <span style={{ color: 'var(--ink-soft)' }}>　— {editorial.ingredientNotes[ing]}</span>
                  )}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* スペック表 */}
        <Section label="Spec" title="基本スペック">
          <div className="table-wrapper">
            <table>
              <tbody>
                <tr><th>ブランド</th><td>{product.brand}</td></tr>
                <tr><th>カテゴリ</th><td>{product.category}</td></tr>
                {product.price && <tr><th>価格／容量</th><td>{product.price}</td></tr>}
                {product.tags.length > 0 && <tr><th>向いている悩み</th><td>{product.tags.join('・')}</td></tr>}
              </tbody>
            </table>
          </div>
        </Section>
      </article>

      {/* 購入ボタン（再掲・ページ下部） */}
      {(product.amazon_url || product.rakuten_url) && (
        <div className="px-6 pb-4">
          <p className="text-center mb-3" style={{ fontSize: 13, color: 'var(--ink-soft)' }}>
            気になったら、最新の価格をチェック ↓
          </p>
          <div className="flex gap-2 max-w-md mx-auto">
            {product.amazon_url && (
              <AffiliateLink
                href={product.amazon_url}
                store="amazon"
                productId={product.id}
                productName={product.name}
                brand={product.brand}
                placement="product_page_footer"
                className={buyBtnClass}
                style={{ background: '#FF9900', color: '#2A2118', borderColor: '#FF9900' }}
              >
                Amazonで見る
              </AffiliateLink>
            )}
            {product.rakuten_url && (
              <AffiliateLink
                href={product.rakuten_url}
                store="rakuten"
                productId={product.id}
                productName={product.name}
                brand={product.brand}
                placement="product_page_footer"
                className={buyBtnClass}
                style={{ background: '#BF0000', color: '#fff', borderColor: '#BF0000' }}
              >
                楽天で見る
              </AffiliateLink>
            )}
          </div>
        </div>
      )}

      {/* 診断への導線 */}
      <div className="px-6 py-4">
        <Link
          href="/diagnosis"
          className="block text-center px-5 py-3 rounded-full transition-opacity hover:opacity-80 max-w-md mx-auto"
          style={{ border: '1px solid var(--gold)', color: 'var(--gold-deep)', fontSize: 13, letterSpacing: '0.08em' }}
        >
          自分に合う1本を知りたい → 2分の肌タイプ診断
        </Link>
      </div>

      {/* 監修者（E-E-A-T） */}
      <ArticleAuthor />

      {/* フッター */}
      <footer className="px-5 py-10 text-center" style={{ borderTop: '1px solid var(--line-soft)' }}>
        <Link
          href="/"
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
          ← {SITE_NAME} TOP
        </Link>
      </footer>
    </div>
  )
}

// セクション見出しの共通レイアウト（column のトーンに合わせる）
function Section({ label, title, children }: { label: string; title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <div className="mb-3">
        <span
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 10,
            letterSpacing: '0.3em',
            color: 'var(--gold-deep)',
            textTransform: 'uppercase',
          }}
        >
          {label}
        </span>
        <h2
          style={{
            fontFamily: 'var(--font-jp)',
            fontWeight: 600,
            fontSize: 16,
            letterSpacing: '0.04em',
            color: 'var(--ink)',
            marginTop: 2,
          }}
        >
          {title}
        </h2>
      </div>
      {children}
    </section>
  )
}
