import Link from 'next/link'
import { getProducts } from '@/lib/parseCSV'
import ProductList from '@/components/ProductList'
import { SITE_URL } from '@/lib/siteConfig'

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
      'Instagram5.7万人フォロワーのゆん（元化粧品会社・研究職／生涯ノーファンデ歴29年）が厳選したスキンケア・ベースメイク163アイテム。',
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
    jobTitle: '元化粧品会社・研究職／スキンケアインフルエンサー',
    description:
      '生涯ノーファンデ歴29年、元化粧品会社の研究職としての知見を活かし、本当に使ってよかったスキンケアアイテムを発信。Instagramフォロワー5.7万人。',
    sameAs: ['https://www.instagram.com/yun.skincare_'],
  }

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'ゆんが厳選したスキンケア・ベースメイク',
    numberOfItems: products.length,
    itemListElement: products.slice(0, 30).map((p, idx) => ({
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
          p.amazon_url || p.rakuten_url
            ? {
                '@type': 'Offer',
                url: p.amazon_url || p.rakuten_url,
                availability: 'https://schema.org/InStock',
              }
            : undefined,
      },
    })),
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

      {/* Header */}
      <header className="px-4 pt-6 pb-4">
        {/* H1 — SEO最重要要素：ブランド名 + 権威性 */}
        <h1 className="text-xl font-bold text-[#343A40] leading-tight">
          <a
            href="https://www.instagram.com/yun.skincare_"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#4DB6AC] transition-colors"
          >
            yun.skincare_
          </a>
        </h1>

        {/* 権威性バッジ */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          <span className="text-[10px] px-2 py-0.5 bg-[#FCE4EC] text-[#C2185B] rounded-full font-medium">
            元化粧品会社・研究職
          </span>
          <span className="text-[10px] px-2 py-0.5 bg-[#E0F2F1] text-[#00897B] rounded-full font-medium">
            生涯ノーファンデ29年
          </span>
          <span className="text-[10px] px-2 py-0.5 bg-[#FFF3E0] text-[#E65100] rounded-full font-medium">
            Instagram 5.7万人
          </span>
        </div>

        {/* リード文 */}
        <p className="text-sm text-[#6C757D] mt-3 leading-relaxed">
          投稿で紹介したスキンケア・ベースメイクをまとめてます🌿<br />
          ゆんが本当に使ってよかったオススメアイテムだけを厳選。<br />
          Amazon・楽天のリンクからすぐに購入できます。
        </p>

        {/* Instagram フォロー導線 */}
        <a
          href="https://www.instagram.com/yun.skincare_"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 text-xs font-semibold text-white rounded-full transition-all active:scale-95"
          style={{
            background:
              'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
          }}
          aria-label="Instagramをフォロー"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
          @yun.skincare_ をフォロー
        </a>

        {/* SEO用のサブ説明（ユーザーには小さく見える） */}
        <div className="text-[10px] text-gray-400 mt-3 space-y-0.5">
          <p>※本サイトはアフィリエイトリンクを含みます</p>
          <p>※一部ブランド様よりご提供頂いた商品も含みます。</p>
          <p>※韓国コスメ、デパコスなどの一部商品はブランド公式サイトからの購入を推奨しています</p>
        </div>
      </header>

      {/* 肌診断バナー */}
      <Link
        href="/diagnosis"
        className="block mx-4 mb-5 p-4 rounded-2xl shadow-md active:scale-[0.98] transition-all relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #4DB6AC 0%, #C2185B 100%)',
        }}
      >
        <div className="flex items-center gap-3">
          <div className="text-3xl flex-shrink-0">🪞</div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] tracking-[0.2em] text-white/80 font-semibold mb-0.5">
              SKIN TYPE DIAGNOSIS
            </p>
            <p className="text-sm font-bold text-white leading-snug">
              あなたの肌タイプは？
              <br />
              <span className="text-xs font-medium">
                元化粧品研究員監修・8問の無料診断
              </span>
            </p>
          </div>
          <div className="text-white text-lg flex-shrink-0">→</div>
        </div>
      </Link>

      <ProductList products={products} />

      {/* SEO用フッター — 追加のテキストコンテンツでクロール時の情報量を増やす */}
      <footer className="px-4 py-8 mt-8 border-t border-[#E9ECEF] bg-[#F8F9FA]">
        <h2 className="text-sm font-bold text-[#343A40] mb-2">yun.skincare_ について</h2>
        <p className="text-xs text-[#6C757D] leading-relaxed mb-3">
          元化粧品会社の研究職として培った成分知識と、生涯ノーファンデ歴29年の素肌主義の視点から、
          化粧水・乳液・美容液・クリーム・日焼け止め・化粧下地・洗顔・クレンジングなど、
          本当に使ってよかったスキンケア・ベースメイクを厳選してご紹介しています。
          プチプラからデパコス、韓国コスメまで幅広くカバー。
          毛穴・乾燥・敏感肌・エイジングケア・美白などお悩み別に検索できます。
        </p>
        <p className="text-xs text-[#6C757D] leading-relaxed mb-4">
          最新のレビューや使用感は Instagram{' '}
          <a
            href="https://www.instagram.com/yun.skincare_"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#C2185B] font-medium hover:underline"
          >
            @yun.skincare_
          </a>{' '}
          にて発信中。フォロワー5.7万人と一緒にスキンケアを楽しんでいます。
        </p>
        <a
          href="https://www.instagram.com/yun.skincare_"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white rounded-full transition-all active:scale-95"
          style={{
            background:
              'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
          }}
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
          Instagramをフォロー
        </a>
      </footer>
    </div>
  )
}
