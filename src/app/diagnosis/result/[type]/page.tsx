import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  resultTypes,
  allSkinTypes,
  concernLabels,
  type SkinType,
  type Concern,
} from '@/lib/diagnosis'
import { SITE_URL } from '@/lib/siteConfig'
import MustProducts from '@/components/MustProducts'
import RoutineSteps from '@/components/RoutineSteps'
import ShareButtons from './ShareButtons'

// 静的パラメータ生成（SSG）
export function generateStaticParams() {
  return allSkinTypes.map((type) => ({ type }))
}

type Props = {
  params: Promise<{ type: string }>
  searchParams: Promise<{ concern?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type } = await params
  const result = resultTypes[type as SkinType]
  if (!result) return {}

  const title = `${result.name}診断結果｜元化粧品研究員監修のスキンケアアドバイス`
  const description = `あなたの肌タイプは「${result.name}」。${result.description.slice(0, 80)}...元化粧品研究員のゆんが監修した専門的なケア方法を解説。`

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/diagnosis/result/${type}`,
    },
    openGraph: {
      type: 'article',
      url: `${SITE_URL}/diagnosis/result/${type}`,
      title: `私の肌タイプは「${result.name}」でした🌸`,
      description: `元化粧品研究員監修の肌診断でわかった、私の肌タイプと最適なケア方法。`,
      images: ['/og-image.jpg'],
    },
    twitter: {
      card: 'summary_large_image',
      title: `私の肌タイプは「${result.name}」でした🌸`,
      description: '元化粧品研究員監修の肌診断であなたのタイプもチェック！',
    },
  }
}

export default async function ResultPage({ params, searchParams }: Props) {
  const { type } = await params
  const { concern: concernParam } = await searchParams
  const result = resultTypes[type as SkinType]
  if (!result) notFound()

  const concern = (concernParam as Concern | undefined) && concernLabels[concernParam as Concern]
    ? (concernParam as Concern)
    : undefined

  // 構造化データ
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'ホーム', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: '肌診断', item: `${SITE_URL}/diagnosis` },
      { '@type': 'ListItem', position: 3, name: result.name, item: `${SITE_URL}/diagnosis/result/${type}` },
    ],
  }

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${result.name}とは？特徴とおすすめスキンケア`,
    description: result.description,
    author: {
      '@type': 'Person',
      name: 'ゆん（yun.skincare_）',
      jobTitle: '元化粧品会社・研究職',
      url: 'https://www.instagram.com/yun.skincare_',
    },
    publisher: {
      '@type': 'Organization',
      name: 'yun.skincare_',
      url: SITE_URL,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/diagnosis/result/${type}`,
    },
  }

  return (
    <div className="max-w-2xl mx-auto min-h-screen" style={{ backgroundColor: result.bgColor }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      {/* パンくず */}
      <nav className="px-4 pt-4 text-xs text-[#9B8E94] tracking-wider" aria-label="パンくず">
        <Link href="/" className="hover:text-[#C2185B] transition-colors">
          ホーム
        </Link>
        <span className="mx-2" style={{ color: result.themeColor }}>/</span>
        <Link href="/diagnosis" className="hover:text-[#C2185B] transition-colors">
          肌診断
        </Link>
        <span className="mx-2" style={{ color: result.themeColor }}>/</span>
        <span className="text-[#4A3F45]">{result.name}</span>
      </nav>

      {/* 結果ヒーロー */}
      <section className="px-6 pt-8 pb-8 text-center">
        <div className="text-[10px] tracking-[0.5em] mb-2" style={{ color: result.themeColor }} aria-hidden>
          · · · · ·
        </div>
        <p
          className="font-serif text-[11px] tracking-[0.4em] mb-2"
          style={{ color: result.themeColor }}
        >
          DIAGNOSIS RESULT
        </p>

        <div className="bg-white rounded-3xl p-7 shadow-sm border border-white/60 mt-4">
          <div className="text-5xl mb-3" aria-hidden>
            {result.emoji}
          </div>
          <p
            className="font-serif text-[11px] tracking-[0.35em] mb-1"
            style={{ color: result.themeColor }}
          >
            {result.tagEn}
          </p>
          <h1 className="font-serif text-2xl font-medium text-[#4A3F45] mb-3 tracking-wider">
            {result.name}
          </h1>
          <span
            className="inline-block text-[11px] font-medium px-4 py-1 rounded-full border tracking-wider"
            style={{
              color: result.themeColor,
              borderColor: result.themeColor,
              backgroundColor: `${result.themeColor}10`,
            }}
          >
            {result.badge}
          </span>

          {concern && (
            <div className="mt-4 pt-4 border-t border-[#F2EAEF]">
              <p className="text-[10px] text-[#9B8E94] mb-1 tracking-wider font-serif italic">
                main concern
              </p>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C2185B]">
                <span>{concernLabels[concern].emoji}</span>
                {concernLabels[concern].label}
              </span>
            </div>
          )}

          <p className="text-sm text-[#6C757D] leading-[1.9] text-left mt-5">
            {result.description}
          </p>
        </div>

        {/* ゆんコメント */}
        <div className="mt-4 mx-2 p-4 bg-white/85 rounded-2xl border border-white/60">
          <div className="flex items-start gap-2">
            <div className="text-lg flex-shrink-0">💬</div>
            <div className="text-left">
              <p className="font-serif italic text-[11px] text-[#C2185B] mb-1 tracking-wider">
                a note from yun
              </p>
              <p className="text-xs text-[#4A3F45] leading-relaxed">{result.yunComment}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 特徴 */}
      <section className="px-5 pb-6">
        <SectionHeading enLabel="YOUR SKIN" jpLabel="あなたの肌の特徴" themeColor={result.themeColor} />
        <ul className="space-y-2">
          {result.features.map((feature, i) => (
            <li
              key={i}
              className="text-sm text-[#4A3F45] bg-white p-3.5 rounded-xl border-l-[3px] leading-snug"
              style={{ borderLeftColor: result.themeColor }}
            >
              {feature}
            </li>
          ))}
        </ul>
      </section>

      {/* おすすめケア */}
      <section className="px-5 pb-6">
        <SectionHeading enLabel="HOW TO CARE" jpLabel="おすすめスキンケア" themeColor={result.themeColor} />
        <div className="space-y-2.5">
          {result.cares.map((care, i) => (
            <div key={i} className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-white shadow-sm">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                style={{ backgroundColor: `${result.themeColor}20` }}
              >
                {care.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#343A40] mb-0.5">{care.title}</p>
                <p className="text-xs text-[#6C757D] leading-relaxed">{care.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 重視すべき成分 */}
      <section className="px-5 pb-6">
        <SectionHeading enLabel="KEY INGREDIENTS" jpLabel="重視すべき成分" themeColor={result.themeColor} />
        <p className="text-xs text-[#9B8E94] mb-3 text-center font-serif italic">
          元化粧品研究員ゆんが選ぶ、あなたの肌タイプに効く成分
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {result.recommendedIngredients.map((ing, i) => (
            <span
              key={i}
              className="text-xs px-3 py-1.5 bg-white rounded-full border font-medium"
              style={{ borderColor: result.themeColor, color: result.themeColor }}
            >
              {ing}
            </span>
          ))}
        </div>
      </section>

      {/* NGケア */}
      <section className="px-5 pb-6">
        <SectionHeading enLabel="AVOID THIS" jpLabel="避けたいNGケア" themeColor={result.themeColor} />
        <ul className="space-y-2">
          {result.ngList.map((ng, i) => (
            <li
              key={i}
              className="text-sm text-[#A85959] bg-white p-3 rounded-xl border border-[#F5DDE5] leading-snug"
            >
              ✕ {ng}
            </li>
          ))}
        </ul>
      </section>

      {/* ⭐ ゆんMUSTアイテム */}
      <MustProducts
        skinType={type as SkinType}
        concern={concern}
        themeColor={result.themeColor}
      />

      {/* 🌸 ゆんおすすめルーティン（STEP別） */}
      <RoutineSteps
        skinType={type as SkinType}
        concern={concern}
        themeColor={result.themeColor}
      />

      {/* シェアボタン */}
      <section className="px-5 pb-6">
        <div className="bg-white rounded-2xl p-5 text-center">
          <h2 className="text-sm font-bold text-[#343A40] mb-3">
            📲 結果をシェアする
          </h2>
          <ShareButtons resultName={result.name} type={type} />
        </div>
      </section>

      {/* アクション */}
      <section className="px-5 pb-10 text-center space-y-3">
        <Link
          href="/diagnosis/quiz"
          className="block w-full py-3.5 text-xs font-semibold text-white rounded-full shadow-md active:scale-95 transition-all tracking-[0.2em]"
          style={{
            background: 'linear-gradient(135deg, #D4829E 0%, #C2185B 100%)',
          }}
        >
          RETAKE QUIZ
        </Link>
        <Link
          href="/"
          className="block w-full py-3 text-xs font-medium text-[#4A3F45] bg-white border border-[#F2EAEF] rounded-full active:scale-95 transition-all tracking-[0.2em]"
        >
          BACK TO PRODUCTS
        </Link>
      </section>

      {/* Instagram CTA */}
      <footer className="px-5 pb-10 pt-6 text-center border-t border-white/60">
        <div className="text-[10px] tracking-[0.5em] text-[#D4829E] mb-3" aria-hidden>
          · · ·
        </div>
        <p className="text-xs text-[#9B8E94] mb-3 leading-relaxed">
          最新のレビューや新商品情報は
          <br />
          Instagram で発信中
        </p>
        <a
          href="https://www.instagram.com/yun.skincare_"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white rounded-full"
          style={{
            background:
              'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
          }}
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
          @yun.skincare_ をフォロー
        </a>
      </footer>
    </div>
  )
}

// ========== セクション見出し（エディトリアル風） ==========
function SectionHeading({
  enLabel,
  jpLabel,
  themeColor,
}: {
  enLabel: string
  jpLabel: string
  themeColor: string
}) {
  return (
    <div className="text-center mb-4">
      <p
        className="font-serif text-[10px] tracking-[0.4em]"
        style={{ color: themeColor }}
      >
        {enLabel}
      </p>
      <div
        className="mt-1 text-[10px] tracking-[0.5em]"
        style={{ color: themeColor }}
        aria-hidden
      >
        · · ·
      </div>
      <h2 className="font-serif text-base text-[#4A3F45] mt-1 tracking-wider">
        {jpLabel}
      </h2>
    </div>
  )
}
