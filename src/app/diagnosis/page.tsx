import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_URL } from '@/lib/siteConfig'

export const metadata: Metadata = {
  title: '肌診断（リニューアル中）｜元化粧品研究員監修・最適ルーティン自動提案',
  description:
    '元化粧品会社の研究職・29年ノーファンデのゆん監修。肌診断 × あなた専用ルーティン提案機能を、より精度高く・より使いやすく全面再構築中。完成まで今しばらくお待ちください。',
  alternates: {
    canonical: `${SITE_URL}/diagnosis`,
  },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/diagnosis`,
    title: '肌診断、生まれ変わります｜yun.skincare_',
    description:
      '前回お試しいただいた肌診断を、より精度高く・より使いやすく全面再構築中。完成までもう少しお待ちください🌿',
    images: ['/og-image.jpg'],
  },
}

export default function DiagnosisRenewalPage() {
  return (
    <div className="max-w-2xl mx-auto min-h-screen relative overflow-hidden">
      {/* 背景グラデ */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(180deg, #FDF5F8 0%, #FAF0F2 40%, #F5EDE8 100%)',
        }}
        aria-hidden
      />
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
        {/* RENEWAL ラベル */}
        <div
          className="inline-block px-4 py-1.5 text-[10px] tracking-[0.4em] text-white rounded-full font-serif italic mb-4"
          style={{
            background: 'linear-gradient(135deg, #D4829E 0%, #C2185B 100%)',
          }}
        >
          renewal in progress
        </div>

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
          className="font-serif text-[40px] leading-[1] tracking-[0.18em] text-[#4A3F45]"
          style={{ fontWeight: 500 }}
        >
          DIAGNOSIS
        </h1>
        <p className="mt-3 text-[11px] tracking-[0.25em] text-[#9B8E94]">
          BY YUN
        </p>

        <div className="mt-5 text-[10px] tracking-[0.5em] text-[#D4829E]" aria-hidden>
          · · ·
        </div>

        {/* メイン訴求 */}
        <p className="text-base text-[#4A3F45] leading-[1.9] mt-6 font-serif tracking-wider">
          肌診断、生まれ変わります。
        </p>

        <p className="text-xs text-[#6C757D] leading-[1.9] mt-5 px-2">
          前回お試しいただいた肌診断を、
          <br />
          みなさんの声を反映して
          <br />
          <span className="text-[#C2185B] font-semibold">より精度高く・より使いやすく</span>
          <br />
          全面再構築中です。
        </p>

        <p className="text-xs text-[#9B8E94] leading-[1.9] mt-5 font-serif italic">
          — Coming back, better. —
        </p>
      </section>

      {/* 何が変わるか */}
      <section className="px-6 pb-10">
        <div className="text-center mb-5">
          <p className="text-[10px] tracking-[0.4em] text-[#D4829E] font-serif">
            WHAT&apos;S NEW
          </p>
          <div className="mt-1 text-[10px] tracking-[0.5em] text-[#D4829E]" aria-hidden>
            · · ·
          </div>
          <h2 className="font-serif text-base text-[#4A3F45] mt-1 tracking-wider">
            進化する4つのポイント
          </h2>
        </div>

        <div className="space-y-3">
          {[
            {
              icon: <BeakerIcon />,
              tag: 'EVOLVED',
              title: '質問は研究員視点へ',
              text: '8問・約2分で、より深く肌タイプを判定',
            },
            {
              icon: <LayersIcon />,
              tag: 'NEW',
              title: 'ルーティン全6STEP提案',
              text: 'クレンジング〜日焼け止めまで丸ごと最適化',
            },
            {
              icon: <FlaskIcon />,
              tag: 'NEW',
              title: '100種以上から自動選定',
              text: '元化粧品研究員監修のスコアリングロジック',
            },
            {
              icon: <CartIcon />,
              tag: 'NEW',
              title: 'Amazon・楽天で即購入',
              text: '迷う時間ゼロで揃う・予算切替対応予定',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="relative flex items-center gap-3 p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-[#F2EAEF]"
            >
              <div className="text-[#D4829E] flex-shrink-0">{item.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-semibold text-[#4A3F45]">{item.title}</p>
                  <span
                    className="text-[8px] font-serif italic tracking-[0.2em] text-[#C2185B] border border-[#E8C7D4] px-1.5 py-0.5 rounded-full leading-none"
                  >
                    {item.tag}
                  </span>
                </div>
                <p className="text-xs text-[#9B8E94]">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 制作中メッセージ */}
      <section className="mx-6 mb-10 p-5 bg-white/85 backdrop-blur-sm rounded-3xl border border-[#F2EAEF]">
        <div className="text-center mb-3">
          <p className="text-[10px] tracking-[0.4em] text-[#D4829E] font-serif">
            FROM YUN
          </p>
        </div>
        <p className="text-xs text-[#4A3F45] leading-[1.9] text-left">
          公開を楽しみに待ってくださってる方、お待たせしてごめんなさい🌸
          <br />
          <br />
          一度公開した診断版を見直したら、もっと精度を上げたくて、
          質問もロジックも全部組み直しています。
          <br />
          <br />
          完成したら、みなさんの肌悩みに本当に合う
          <span className="font-semibold text-[#C2185B]">「あなた専用ルーティン」</span>
          が出せるようになります。
          <br />
          もう少しだけ、待っていてください🫶
        </p>
      </section>

      {/* Instagram通知CTA */}
      <section className="mx-6 mb-10 p-6 bg-white/80 backdrop-blur-sm rounded-3xl border border-[#F2EAEF] text-center">
        <p className="text-[10px] tracking-[0.4em] text-[#D4829E] font-serif mb-2">
          STAY TUNED
        </p>
        <h3 className="font-serif text-lg text-[#4A3F45] tracking-wider mb-3">
          公開のお知らせを受け取る
        </h3>
        <p className="text-xs text-[#9B8E94] leading-relaxed mb-4">
          リニューアル完成・新商品レビューは
          <br />
          Instagram で先行案内中
        </p>
        <a
          href="https://www.instagram.com/yun.skincare_"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white rounded-full active:scale-95 transition-all"
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
      </section>

      {/* フッター */}
      <div className="text-center pb-10">
        <div className="text-[10px] tracking-[0.5em] text-[#D4829E] mb-3" aria-hidden>
          · · ·
        </div>
        <Link
          href="/"
          className="text-xs text-[#9B8E94] hover:text-[#C2185B] transition-colors font-serif italic"
        >
          ← 商品一覧に戻る
        </Link>
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
  // 質問評価
  return (
    <svg {...iconProps}>
      <path d="M9 2v6l-4 9a2 2 0 002 3h10a2 2 0 002-3l-4-9V2" />
      <path d="M9 2h6" />
      <path d="M7 14h10" />
    </svg>
  )
}

function LayersIcon() {
  // STEP積み重ね
  return (
    <svg {...iconProps}>
      <path d="M12 2L2 7l10 5 10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  )
}

function FlaskIcon() {
  // 研究員監修
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9 9l6 6M15 9l-6 6" />
    </svg>
  )
}

function CartIcon() {
  // 即購入
  return (
    <svg {...iconProps}>
      <circle cx="9" cy="20" r="1.2" />
      <circle cx="18" cy="20" r="1.2" />
      <path d="M3 4h2l2.5 11h11l2-7H6" />
    </svg>
  )
}
