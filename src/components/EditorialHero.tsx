// エディトリアル風ヒーロー（参考イメージのテンプレ風）
// ピンクグラデ × セリフ体 × バブルに細い線アイコン

import Link from 'next/link'
import { INSTAGRAM_URL } from '@/lib/siteConfig'

export default function EditorialHero() {
  return (
    <section className="relative overflow-hidden">
      {/* 背景グラデ */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, #FDF5F8 0%, #FAF0F2 40%, #F5EDE8 100%)',
        }}
        aria-hidden
      />
      {/* 背景の装飾丸（薄く） */}
      <div
        className="absolute -top-10 -left-20 w-64 h-64 rounded-full opacity-40"
        style={{
          background:
            'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(252,228,236,0) 70%)',
        }}
        aria-hidden
      />
      <div
        className="absolute bottom-0 -right-10 w-48 h-48 rounded-full opacity-50"
        style={{
          background:
            'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(252,228,236,0) 70%)',
        }}
        aria-hidden
      />

      {/* コンテンツ */}
      <div className="relative px-6 pt-8 pb-10 text-center">
        {/* ブランド名 */}
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-sm tracking-widest text-[#6C757D] hover:text-[#C2185B] transition-colors"
        >
          yun.skincare_
        </a>

        {/* 装飾ドット */}
        <div
          className="mt-2 mb-4 text-[10px] tracking-[0.5em] text-[#D4829E]"
          aria-hidden
        >
          · · · · ·
        </div>

        {/* セリフ体の大見出し */}
        <p
          className="font-serif text-[11px] tracking-[0.4em] text-[#D4829E] mb-1"
          style={{ fontVariant: 'small-caps' }}
        >
          BEAUTY
        </p>
        <h1
          className="font-serif text-[40px] leading-[1] tracking-[0.15em] text-[#4A3F45]"
          style={{ fontWeight: 500 }}
        >
          SKINCARE
        </h1>
        <p className="mt-3 text-[11px] tracking-[0.25em] text-[#9B8E94]">
          EDITED BY YUN
        </p>

        {/* 4つの特徴バブル */}
        <div className="relative mt-8 grid grid-cols-2 gap-x-4 gap-y-4 max-w-md mx-auto">
          <FeatureBubble
            icon={<FlaskIcon />}
            title="元化粧品研究員"
            subtitle="監修"
          />
          <FeatureBubble
            icon={<MirrorIcon />}
            title="29年"
            subtitle="ノーファンデ"
            align="right"
          />
          <FeatureBubble
            icon={<LeafIcon />}
            title="肌悩み別"
            subtitle="ゆん厳選"
          />
          <FeatureBubble
            icon={<SparkleIcon />}
            title="Instagram"
            subtitle="5.7万人"
            align="right"
          />
        </div>

        {/* CTA */}
        <div className="mt-9 flex justify-center gap-3">
          <Link
            href="/diagnosis"
            className="px-8 py-3 text-xs font-semibold text-white rounded-full shadow-md active:scale-95 transition-all tracking-[0.15em]"
            style={{
              background:
                'linear-gradient(135deg, #D4829E 0%, #C2185B 100%)',
            }}
          >
            肌診断を受ける
          </Link>
          <a
            href="#products"
            className="px-8 py-3 text-xs font-semibold text-[#4A3F45] bg-white rounded-full shadow-sm active:scale-95 transition-all tracking-[0.15em] border border-[#EDE5E8]"
          >
            商品を見る
          </a>
        </div>

        {/* 装飾ドット */}
        <div
          className="mt-8 text-[10px] tracking-[0.5em] text-[#D4829E]"
          aria-hidden
        >
          · · · · ·
        </div>

        {/* フッター風：URL + Instagram */}
        <div className="mt-5 flex justify-between items-center text-[10px] text-[#9B8E94] tracking-wider max-w-md mx-auto px-2">
          <span className="font-serif italic">yun.skincare</span>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#C2185B] transition-colors"
          >
            @yun.skincare_
          </a>
        </div>
      </div>
    </section>
  )
}

// ========== バブルコンポーネント ==========
function FeatureBubble({
  icon,
  title,
  subtitle,
  align = 'left',
}: {
  icon: React.ReactNode
  title: string
  subtitle: string
  align?: 'left' | 'right'
}) {
  return (
    <div
      className={`relative flex flex-col items-center py-4 px-3 rounded-full ${
        align === 'right' ? 'ml-auto' : 'mr-auto'
      }`}
      style={{
        background:
          'radial-gradient(circle, rgba(255,255,255,0.85) 0%, rgba(253,240,245,0.4) 100%)',
        aspectRatio: '1 / 1',
        width: '140px',
        height: '140px',
        boxShadow: '0 2px 16px rgba(212,130,158,0.12)',
      }}
    >
      <div className="text-[#D4829E] mt-1 mb-1">{icon}</div>
      <p className="text-[10px] font-semibold text-[#C2185B] tracking-wider leading-tight text-center">
        {title}
      </p>
      <p className="text-[10px] text-[#9B8E94] tracking-wider leading-tight text-center">
        {subtitle}
      </p>
    </div>
  )
}

// ========== 細い線ピンクアイコン ==========
const iconProps = {
  width: 28,
  height: 28,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.1,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

function FlaskIcon() {
  // 実験フラスコ（元化粧品研究員）
  return (
    <svg {...iconProps}>
      <path d="M10 3h4v5l4 9a2 2 0 01-2 3H8a2 2 0 01-2-3l4-9z" />
      <path d="M9 3h6" />
      <path d="M8.5 14h7" />
    </svg>
  )
}

function MirrorIcon() {
  // 手鏡（29年ノーファンデ＝素肌主義）
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="10" r="6" />
      <path d="M12 16v5" />
      <path d="M10 21h4" />
    </svg>
  )
}

function LeafIcon() {
  // 葉（ゆん厳選・ナチュラル）
  return (
    <svg {...iconProps}>
      <path d="M19 4c-9 0-13 6-13 12 0 1 0 2 .3 3 1-.2 2-.3 2.7-.3 6 0 10-5 10-14.7z" />
      <path d="M6 19c2-5 5-8 10-11" />
    </svg>
  )
}

function SparkleIcon() {
  // スパークル（5.7万フォロワー）
  return (
    <svg {...iconProps}>
      <path d="M12 3v6M12 15v6M3 12h6M15 12h6" />
      <path d="M7 7l3 3M14 14l3 3M17 7l-3 3M10 14l-3 3" />
    </svg>
  )
}
