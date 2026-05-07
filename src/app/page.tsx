import { getProducts } from '@/lib/parseCSV'
import ProductList from '@/components/ProductList'
import EditorialHero from '@/components/EditorialHero'
import AboutYun from '@/components/AboutYun'
import ReadShortcuts from '@/components/ReadShortcuts'
import JournalSection from '@/components/JournalSection'
import FaqSection from '@/components/FaqSection'
import { SITE_URL } from '@/lib/siteConfig'

function parseYenPrice(priceStr: string): number | null {
  const match = priceStr.match(/¥\s*([\d,]+)/)
  if (!match) return null
  const num = Number(match[1].replace(/,/g, ''))
  return Number.isFinite(num) && num > 0 ? num : null
}

export default function Home() {
  const products = getProducts()

  // 構造化データ（JSON-LD）— 検索結果リッチ表示用
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'yun.skincare_',
    alternateName: 'ゆんのスキンケアまとめ',
    url: SITE_URL,
    description:
      'Instagram5.7万人フォロワーのゆん（元化粧品研究・商品企画／生涯ノーファンデ歴29年）が厳選したスキンケア・ベースメイク163アイテム。',
    inLanguage: 'ja-JP',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }

  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'ゆん',
    alternateName: 'yun.skincare_',
    url: SITE_URL,
    jobTitle: '元化粧品研究・商品企画／スキンケアインフルエンサー',
    description:
      '生涯ノーファンデ歴29年、元化粧品研究・商品企画としての知見を活かし、本当に使ってよかったスキンケアアイテムを発信。Instagramフォロワー5.7万人。',
    sameAs: ['https://www.instagram.com/yun.skincare_'],
  }

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'ゆんが厳選したスキンケア・ベースメイク',
    numberOfItems: products.length,
    itemListElement: products.slice(0, 30).map((p, idx) => {
      const offerPrice = parseYenPrice(p.price)
      const offerUrl = p.amazon_url || p.rakuten_url
      return {
        '@type': 'ListItem',
        position: idx + 1,
        item: {
          '@type': 'Product',
          name: p.name,
          brand: { '@type': 'Brand', name: p.brand },
          category: p.category,
          image: p.image_filename ? `${SITE_URL}/images/${p.image_filename}` : undefined,
          description: p.review,
          offers:
            offerPrice && offerUrl
              ? {
                  '@type': 'Offer',
                  url: offerUrl,
                  price: offerPrice,
                  priceCurrency: 'JPY',
                  availability: 'https://schema.org/InStock',
                }
              : undefined,
        },
      }
    }),
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* JSON-LD 構造化データ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />

      {/* 🌸 エディトリアル風ヒーロー */}
      <EditorialHero />

      {/* 商品リスト前に読み物導線（コラム+Q&A） */}
      <ReadShortcuts />

      {/* About Yun (3 pillars) */}
      <AboutYun />

      {/* 注意書き（コンパクト） */}
      <div
        className="px-5 pt-6 pb-3 text-center space-y-0.5"
        style={{
          fontFamily: 'var(--font-jp-alt)',
          fontSize: '10px',
          color: 'var(--ink-mute)',
          letterSpacing: '0.08em',
          lineHeight: 1.8,
        }}
      >
        <p>※本サイトはアフィリエイトリンクを含みます</p>
        <p>※一部ブランド様よりご提供頂いた商品も含みます</p>
        <p>※韓国コスメ、デパコスなどの一部商品はブランド公式サイトからの購入を推奨しています</p>
      </div>

      <div id="products" />
      <ProductList products={products} />

      {/* Journal — サイト内記事（コラム + Q&A） */}
      <JournalSection />

      {/* FAQ */}
      <FaqSection />

      {/* Footer — エディトリアル統一トーン */}
      <footer
        className="px-5 py-12 text-center"
        style={{
          background: 'var(--bg-cream)',
          borderTop: '1px solid var(--line-soft)',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-script)',
            fontSize: 28,
            color: 'var(--gold-deep)',
            marginBottom: 6,
          }}
        >
          yun.skincare_
        </div>
        <div
          style={{
            fontFamily: 'var(--font-sans)',
            fontWeight: 300,
            fontSize: 10,
            letterSpacing: '0.4em',
            color: 'var(--ink-soft)',
            textTransform: 'uppercase',
            marginBottom: 22,
          }}
        >
          Skincare Edit by Yun · Est. 2026
        </div>

        <p
          className="mx-auto mb-5"
          style={{
            fontFamily: 'var(--font-jp-alt)',
            fontSize: 11.5,
            lineHeight: 2,
            letterSpacing: '0.08em',
            color: 'var(--ink-soft)',
            maxWidth: 360,
          }}
        >
          元化粧品研究・商品企画 × 生涯ノーファンデ歴29年のゆん。
          <br />
          本当に使ってよかった200近いアイテムを編集してお届けします。
        </p>

        <a
          href="https://www.instagram.com/yun.skincare_"
          target="_blank"
          rel="me noopener noreferrer"
          className="inline-flex items-center gap-2 mb-6 transition-opacity hover:opacity-70"
          style={{
            fontFamily: 'var(--font-sans)',
            fontWeight: 300,
            fontSize: 11,
            letterSpacing: '0.32em',
            color: 'var(--ink-soft)',
            textTransform: 'lowercase',
          }}
        >
          @yun.skincare_
        </a>

        <p
          className="mx-auto mb-5"
          style={{
            fontFamily: 'var(--font-jp-alt)',
            fontSize: 9.5,
            lineHeight: 1.8,
            letterSpacing: '0.04em',
            color: 'var(--ink-mute)',
            maxWidth: 380,
          }}
        >
          ※本サイトは Amazon.co.jp および 楽天市場 のアフィリエイトプログラムに参加しています。
          掲載商品の効果効能には個人差があり、医薬品的な効能を保証するものではありません。
        </p>

        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 11,
            letterSpacing: '0.16em',
            color: 'var(--ink-mute)',
          }}
        >
          © 2026 yun.skincare_ — Skincare Edit by Yun.
        </p>
      </footer>
    </div>
  )
}
