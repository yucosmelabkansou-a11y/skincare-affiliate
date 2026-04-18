import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_URL } from '@/lib/siteConfig'

export const metadata: Metadata = {
  title: '無料 肌診断｜元化粧品研究員監修・8問でわかるあなたの肌タイプ',
  description:
    '元化粧品会社の研究職・29年ノーファンデのゆん監修。8問・約2分で肌タイプ（乾燥肌・脂性肌・混合肌・敏感肌・エイジング肌・普通肌）と悩み別の正しいスキンケアがわかる無料の肌診断。',
  keywords: [
    '肌診断',
    '肌診断 無料',
    '肌タイプ 診断',
    '敏感肌 診断',
    '乾燥肌 診断',
    '脂性肌 診断',
    'スキンケア 診断',
    '肌質 診断',
  ],
  alternates: {
    canonical: `${SITE_URL}/diagnosis`,
  },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/diagnosis`,
    title: '無料 肌診断｜元化粧品研究員監修・8問でわかる肌タイプ',
    description:
      '元化粧品会社の研究職・29年ノーファンデのゆん監修。8問・約2分で肌タイプと悩み別ケアがわかる無料診断。',
    images: ['/og-image.jpg'],
  },
}

export default function DiagnosisPage() {
  const quizJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Quiz',
    name: 'ゆんの肌診断',
    description: '8問・約2分で肌タイプと悩み別の正しいスキンケアがわかる無料の肌診断',
    educationalLevel: 'beginner',
    inLanguage: 'ja',
    url: `${SITE_URL}/diagnosis`,
    isPartOf: {
      '@type': 'WebSite',
      name: 'yun.skincare_',
      url: SITE_URL,
    },
    author: {
      '@type': 'Person',
      name: 'ゆん（yun.skincare_）',
      jobTitle: '元化粧品会社・研究職',
      url: 'https://www.instagram.com/yun.skincare_',
    },
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'ホーム', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: '肌診断', item: `${SITE_URL}/diagnosis` },
    ],
  }

  return (
    <div className="max-w-2xl mx-auto min-h-screen relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(quizJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* 背景グラデ */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(180deg, #FDF5F8 0%, #FAF0F2 40%, #F5EDE8 100%)',
        }}
        aria-hidden
      />
      {/* 装飾円 */}
      <div
        className="absolute -top-10 -right-20 w-72 h-72 rounded-full opacity-50 -z-10"
        style={{
          background:
            'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(252,228,236,0) 70%)',
        }}
        aria-hidden
      />
      <div
        className="absolute top-1/2 -left-20 w-56 h-56 rounded-full opacity-40 -z-10"
        style={{
          background:
            'radial-gradient(circle, rgba(255,255,255,0.85) 0%, rgba(252,228,236,0) 70%)',
        }}
        aria-hidden
      />

      {/* パンくず */}
      <nav className="px-4 pt-4 text-xs text-[#9B8E94] tracking-wider" aria-label="パンくず">
        <Link href="/" className="hover:text-[#C2185B] transition-colors">
          ホーム
        </Link>
        <span className="mx-2 text-[#D4829E]">/</span>
        <span className="text-[#4A3F45]">肌診断</span>
      </nav>

      {/* Hero */}
      <section className="px-6 pt-10 pb-10 text-center">
        {/* 装飾ドット */}
        <div className="text-[10px] tracking-[0.5em] text-[#D4829E]" aria-hidden>
          · · · · ·
        </div>

        {/* セリフ体大見出し */}
        <p
          className="font-serif text-[11px] tracking-[0.4em] text-[#D4829E] mt-3 mb-1"
          style={{ fontVariant: 'small-caps' }}
        >
          SKIN TYPE
        </p>
        <h1
          className="font-serif text-[36px] leading-[1] tracking-[0.18em] text-[#4A3F45]"
          style={{ fontWeight: 500 }}
        >
          DIAGNOSIS
        </h1>
        <p className="mt-3 text-[11px] tracking-[0.25em] text-[#9B8E94]">
          BY YUN
        </p>

        {/* 装飾ドット */}
        <div className="mt-5 text-[10px] tracking-[0.5em] text-[#D4829E]" aria-hidden>
          · · ·
        </div>

        {/* リード */}
        <p className="text-sm text-[#6C757D] leading-[1.9] mt-5">
          あなたの肌悩みやライフスタイルから、
          <br />
          最適なスキンケアタイプをご提案します。
        </p>

        <div className="inline-block mt-5 px-4 py-1.5 bg-white/80 border border-[#F2EAEF] rounded-full text-[11px] text-[#9B8E94] tracking-wider font-serif italic">
          全 8 問 / 所要時間 約 2 分
        </div>

        {/* CTA */}
        <div className="mt-9">
          <Link
            href="/diagnosis/quiz"
            className="inline-block px-12 py-4 text-xs font-semibold text-white rounded-full shadow-md active:scale-95 transition-all tracking-[0.2em]"
            style={{
              background:
                'linear-gradient(135deg, #D4829E 0%, #C2185B 100%)',
            }}
          >
            START
          </Link>
        </div>
      </section>

      {/* 診断でわかること - エディトリアル風カード */}
      <section className="px-6 pb-10">
        <div className="text-center mb-5">
          <p className="text-[10px] tracking-[0.4em] text-[#D4829E] font-serif">
            WHAT YOU&apos;LL GET
          </p>
          <div className="mt-1 text-[10px] tracking-[0.5em] text-[#D4829E]" aria-hidden>
            · · ·
          </div>
          <h2 className="font-serif text-base text-[#4A3F45] mt-1 tracking-wider">
            診断でわかること
          </h2>
        </div>

        <div className="space-y-3">
          {[
            { icon: <BeakerIcon />, title: 'あなたの肌タイプ', text: '6タイプから最適な肌質を判定' },
            { icon: <BulbIcon />, title: '肌悩みに合うケア方法', text: '今すぐ取り入れたいお手入れ' },
            { icon: <ShieldIcon />, title: 'やりがちなNGケア', text: '逆効果になる習慣を回避' },
            { icon: <FlaskIcon />, title: '重視すべき成分', text: '元研究員が選ぶおすすめ成分' },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-center gap-3 p-4 bg-white/70 backdrop-blur-sm rounded-2xl border border-[#F2EAEF]"
            >
              <div className="text-[#D4829E] flex-shrink-0">{item.icon}</div>
              <div>
                <p className="text-sm font-semibold text-[#4A3F45]">{item.title}</p>
                <p className="text-xs text-[#9B8E94] mt-0.5">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 監修者情報 */}
      <section className="mx-6 mb-10 p-5 bg-white/80 backdrop-blur-sm rounded-3xl border border-[#F2EAEF]">
        <div className="text-center mb-3">
          <p className="text-[10px] tracking-[0.4em] text-[#D4829E] font-serif">
            ABOUT THIS QUIZ
          </p>
        </div>
        <p className="text-xs text-[#6C757D] leading-[1.9] mb-3">
          元化粧品会社の研究職として培った成分知識と、
          生涯ノーファンデ歴29年の素肌主義の視点から、
          ゆんが質問・診断ロジック・結果アドバイスのすべてを監修しています。
        </p>
        <a
          href="https://www.instagram.com/yun.skincare_"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-serif italic text-[#C2185B] hover:underline"
        >
          @yun.skincare_ をチェック →
        </a>
      </section>

      {/* フッター装飾 */}
      <div className="text-center pb-10">
        <div className="text-[10px] tracking-[0.5em] text-[#D4829E] mb-3" aria-hidden>
          · · · · ·
        </div>
        <Link
          href="/diagnosis/quiz"
          className="inline-block px-10 py-3.5 text-xs font-semibold text-white rounded-full shadow-md active:scale-95 transition-all tracking-[0.2em]"
          style={{
            background: 'linear-gradient(135deg, #D4829E 0%, #C2185B 100%)',
          }}
        >
          START
        </Link>
        <div className="mt-5">
          <Link href="/" className="text-xs text-[#9B8E94] hover:text-[#C2185B] transition-colors font-serif italic">
            ← ホームに戻る
          </Link>
        </div>
      </div>
    </div>
  )
}

// ========== 細い線アイコン ==========
const iconProps = {
  width: 28,
  height: 28,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

function BeakerIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12l3 3 5-5" />
    </svg>
  )
}

function BulbIcon() {
  return (
    <svg {...iconProps}>
      <path d="M9 18h6M10 21h4" />
      <path d="M12 3a6 6 0 00-3 11l1 2h4l1-2a6 6 0 00-3-11z" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg {...iconProps}>
      <path d="M12 3l8 3v6c0 4-3 7.5-8 9-5-1.5-8-5-8-9V6z" />
    </svg>
  )
}

function FlaskIcon() {
  return (
    <svg {...iconProps}>
      <path d="M10 3h4v5l4 9a2 2 0 01-2 3H8a2 2 0 01-2-3l4-9z" />
      <path d="M9 3h6" />
      <path d="M8.5 14h7" />
    </svg>
  )
}
