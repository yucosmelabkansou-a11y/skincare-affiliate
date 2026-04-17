import type { Metadata } from 'next'
import Link from 'next/link'

const SITE_URL = 'https://skincare-affiliate.vercel.app'

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
  // 肌診断ページ用のJSON-LD（Quiz スキーマ）
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
    <div className="max-w-2xl mx-auto min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(quizJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* パンくずナビ */}
      <nav className="px-4 pt-4 text-xs text-[#6C757D]" aria-label="パンくず">
        <Link href="/" className="hover:text-[#4DB6AC]">
          ホーム
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[#343A40]">肌診断</span>
      </nav>

      {/* Hero */}
      <section className="px-6 pt-8 pb-10 text-center">
        <div className="text-5xl mb-3" aria-hidden>
          🪞
        </div>
        <p className="text-[10px] tracking-[0.3em] text-[#C2185B] font-semibold mb-2">
          SKIN TYPE DIAGNOSIS
        </p>
        <h1 className="text-2xl font-bold text-[#343A40] leading-tight mb-3">
          ゆんの肌診断
          <br />
          <span className="text-base font-medium text-[#6C757D]">
            あなたの肌タイプを8問でチェック
          </span>
        </h1>

        {/* 権威性バッジ */}
        <div className="flex flex-wrap justify-center gap-1.5 mt-3 mb-5">
          <span className="text-[10px] px-2 py-0.5 bg-[#FCE4EC] text-[#C2185B] rounded-full font-medium">
            元化粧品会社・研究職 監修
          </span>
          <span className="text-[10px] px-2 py-0.5 bg-[#E0F2F1] text-[#00897B] rounded-full font-medium">
            生涯ノーファンデ29年
          </span>
        </div>

        <p className="text-sm text-[#6C757D] leading-relaxed">
          あなたの肌悩みやライフスタイルから、
          <br />
          最適なスキンケアタイプをご提案します。
        </p>

        <div className="inline-block mt-6 px-4 py-1.5 bg-white border border-[#E9ECEF] rounded-full text-xs text-[#6C757D]">
          全8問 ／ 所要時間 約2分
        </div>

        {/* CTA */}
        <div className="mt-8">
          <Link
            href="/diagnosis/quiz"
            className="inline-block px-12 py-4 text-sm font-semibold text-white rounded-full shadow-md active:scale-95 transition-all"
            style={{
              background: 'linear-gradient(135deg, #4DB6AC 0%, #C2185B 100%)',
              letterSpacing: '0.1em',
            }}
          >
            診断をはじめる
          </Link>
        </div>
      </section>

      {/* 診断でわかること */}
      <section className="px-6 pb-10">
        <h2 className="text-base font-bold text-[#343A40] mb-4 text-center">
          ✨ 診断でわかること
        </h2>
        <div className="space-y-3">
          {[
            { emoji: '🎯', title: 'あなたの肌タイプ', text: '6タイプから最適な肌質を判定' },
            { emoji: '💡', title: '肌悩みに合うケア方法', text: '今すぐ取り入れたいお手入れ' },
            { emoji: '⚠️', title: 'やりがちなNGケア', text: '逆効果になる習慣を回避' },
            { emoji: '🧪', title: '重視すべき成分', text: '元研究員が選ぶおすすめ成分' },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-3 p-3 bg-white rounded-xl border border-[#E9ECEF] shadow-sm"
            >
              <div className="text-2xl flex-shrink-0">{item.emoji}</div>
              <div>
                <p className="text-sm font-semibold text-[#343A40]">{item.title}</p>
                <p className="text-xs text-[#6C757D] mt-0.5">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 監修者情報 */}
      <section className="mx-6 mb-10 p-5 bg-[#F8F9FA] rounded-2xl">
        <h2 className="text-sm font-bold text-[#343A40] mb-2">この診断について</h2>
        <p className="text-xs text-[#6C757D] leading-relaxed mb-3">
          元化粧品会社の研究職として培った成分知識と、生涯ノーファンデ歴29年の素肌主義の視点から、
          ゆんが質問・診断ロジック・結果アドバイスのすべてを監修しています。
          スキンケアアイテムの選定から成分の読み解きまで、
          実体験と研究知見の両面から最適なケアをご提案します。
        </p>
        <a
          href="https://www.instagram.com/yun.skincare_"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C2185B] hover:underline"
        >
          @yun.skincare_ のInstagramをチェック →
        </a>
      </section>

      {/* フッターCTA */}
      <div className="text-center pb-10">
        <Link
          href="/diagnosis/quiz"
          className="inline-block px-10 py-3.5 text-sm font-semibold text-white rounded-full shadow-md active:scale-95 transition-all"
          style={{
            background: 'linear-gradient(135deg, #4DB6AC 0%, #C2185B 100%)',
          }}
        >
          診断をはじめる →
        </Link>
        <div className="mt-4">
          <Link href="/" className="text-xs text-[#6C757D] hover:text-[#4DB6AC]">
            ← ホームに戻る
          </Link>
        </div>
      </div>
    </div>
  )
}
