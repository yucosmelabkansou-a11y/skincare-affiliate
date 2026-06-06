import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_URL } from '@/lib/siteConfig'

export const metadata: Metadata = {
  title: '肌診断｜元化粧品研究・商品企画監修・あなたの肌タイプを2分で判定',
  description:
    '元化粧品研究・商品企画・29年ノーファンデのゆん監修。8問・約2分であなたの肌タイプを判定。水分・油分・バリア・ハリ・バランスを五角形グラフで可視化し、今日から取り入れたい成分とケアを提案します。',
  alternates: {
    canonical: `${SITE_URL}/diagnosis`,
  },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/diagnosis`,
    title: '肌診断｜2分でわかる、あなたの肌タイプ｜yun.skincare_',
    description:
      '8問の診断であなたの肌タイプを判定。五角形グラフで肌の状態を可視化し、今日からできる改善案とおすすめ成分を提案。',
    images: ['/og-image.jpg'],
  },
}

export default function DiagnosisStartPage() {
  return (
    <div
      className="max-w-2xl mx-auto min-h-screen relative overflow-hidden"
      style={{ background: 'var(--bg-cream)' }}
    >
      {/* 背景グラデ */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: `
            radial-gradient(60% 70% at 80% 10%, oklch(0.96 0.025 30 / .55), transparent 70%),
            radial-gradient(50% 60% at 10% 90%, oklch(0.97 0.02 80 / .7), transparent 70%),
            linear-gradient(180deg, var(--bg-ivory) 0%, var(--bg-cream) 60%, var(--bg-warm) 100%)
          `,
        }}
        aria-hidden
      />

      {/* パンくず */}
      <nav
        className="px-5 pt-5 text-[10px]"
        style={{ color: 'var(--ink-mute)', letterSpacing: '0.2em' }}
        aria-label="パンくず"
      >
        <Link href="/" className="hover:opacity-70 transition-opacity">ホーム</Link>
        <span className="mx-2">/</span>
        <span style={{ color: 'var(--ink)' }}>肌診断</span>
      </nav>

      {/* Hero */}
      <section className="px-6 pt-12 pb-12 text-center">
        <div
          className="flex flex-col items-center gap-1.5 mb-6"
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
            <span>Skin Type Diagnosis</span>
            <span className="block w-7 h-px" style={{ background: 'var(--gold)' }} aria-hidden />
          </div>
          <span className="whitespace-nowrap">8 questions · about 2 min</span>
        </div>

        <h1
          className="leading-[1.7] mx-auto"
          style={{
            fontFamily: 'var(--font-jp)',
            fontWeight: 500,
            fontSize: 'clamp(20px, 5.6vw, 28px)',
            letterSpacing: '0.1em',
            color: 'var(--ink)',
            wordBreak: 'keep-all',
          }}
        >
          まずは自分の肌を、
          <br />
          知ることから。
        </h1>

        <p
          className="mt-5"
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 'clamp(13px, 3.6vw, 16px)',
            letterSpacing: '0.32em',
            color: 'var(--gold-deep)',
            textTransform: 'uppercase',
          }}
        >
          — by Yun —
        </p>

        {/* Yun の信頼バッジ3つ */}
        <ul
          className="mx-auto mt-8 flex flex-col gap-2 text-left"
          style={{ maxWidth: '24ch' }}
        >
          {[
            '元化粧品研究・商品企画',
            '生涯ノーファンデ歴29年',
            'Instagramフォロワー5万人',
          ].map((label) => (
            <li
              key={label}
              className="flex items-center gap-2.5"
              style={{
                fontFamily: 'var(--font-jp)',
                fontWeight: 500,
                fontSize: 13,
                lineHeight: 1.7,
                letterSpacing: '0.08em',
                color: 'var(--ink)',
              }}
            >
              <span
                className="flex items-center justify-center flex-shrink-0"
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  border: '1px solid var(--gold)',
                  color: 'var(--gold-deep)',
                  background: 'oklch(0.99 0.012 80)',
                }}
                aria-hidden
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12l5 5 9-11" />
                </svg>
              </span>
              {label}
            </li>
          ))}
        </ul>

        <p
          className="mx-auto mt-7"
          style={{
            fontFamily: 'var(--font-jp-alt)',
            fontWeight: 400,
            fontSize: '12.5px',
            lineHeight: 2,
            letterSpacing: '0.08em',
            color: 'var(--ink-soft)',
            maxWidth: '30ch',
          }}
        >
          ゆんが知識や経験、フォロワーさんの声をもとに監修しています。
        </p>

        <p
          className="mx-auto mt-9"
          style={{
            fontFamily: 'var(--font-jp-alt)',
            fontWeight: 400,
            fontSize: '13px',
            lineHeight: 2.1,
            letterSpacing: '0.08em',
            color: 'var(--ink-soft)',
            maxWidth: '32ch',
          }}
        >
          たった<strong style={{ color: 'var(--ink)' }}>8問</strong>の診断に答えるだけで、あなたの肌の <strong style={{ color: 'var(--ink)' }}>水分・油分・バリア</strong> などを見える化し、今日からすぐに取り入れられるスキンケアをご提案します。
        </p>

        {/* 毛穴診断カード */}
        <div className="mt-8 mx-auto max-w-xs px-2">
          <Link
            href="/pore-diagnosis"
            className="flex items-center gap-4 px-5 py-4 transition-all hover:opacity-80"
            style={{
              background: 'linear-gradient(135deg, oklch(0.97 0.018 80), oklch(0.94 0.025 75))',
              border: '1px solid oklch(0.87 0.03 75)',
              borderRadius: 8,
              textDecoration: 'none',
            }}
          >
            <span style={{ fontSize: 26, flexShrink: 0 }}>🔍</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 9, letterSpacing: '0.16em', color: 'var(--gold-deep)', textTransform: 'uppercase' as const, marginBottom: 2 }}>
                Pore Type · 16 questions
              </p>
              <p style={{ fontFamily: 'var(--font-jp)', fontSize: 13, fontWeight: 600, color: 'var(--ink)', letterSpacing: '0.06em' }}>
                毛穴タイプ診断はこちら →
              </p>
            </div>
          </Link>
        </div>

        {/* CTA */}
        <div className="mt-12 flex flex-col gap-3 px-2 max-w-sm mx-auto">
          <Link
            href="/diagnosis/quiz"
            className="inline-flex items-center justify-center gap-3 px-9 py-4 transition-all hover:bg-[var(--gold)] hover:text-white"
            style={{
              fontFamily: 'var(--font-jp)',
              fontWeight: 500,
              fontSize: '14px',
              letterSpacing: '0.32em',
              border: '1px solid var(--gold)',
              color: 'var(--ink)',
              background: '#fff',
              boxShadow: '0 18px 40px -28px oklch(0.5 0.06 70 / .35)',
            }}
          >
            診断をはじめる
            <Arrow />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-3 px-9 py-3.5 transition-opacity hover:opacity-70"
            style={{
              fontFamily: 'var(--font-sans)',
              fontWeight: 300,
              fontSize: '11px',
              letterSpacing: '0.32em',
              color: 'var(--ink-mute)',
              textTransform: 'uppercase',
            }}
          >
            ← Back to Products
          </Link>
        </div>
      </section>

      {/* 診断でわかること */}
      <section className="px-5 pb-14">
        <div className="flex flex-col items-center gap-2 mb-10">
          <span
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontWeight: 300,
              fontSize: '12px',
              letterSpacing: '0.42em',
              color: 'var(--gold-deep)',
              textTransform: 'uppercase',
            }}
          >
            What You Get
          </span>
          <span
            className="block"
            style={{ width: 1, height: 30, background: 'var(--gold)' }}
            aria-hidden
          />
          <span
            style={{
              fontFamily: 'var(--font-jp)',
              fontSize: '12px',
              letterSpacing: '0.4em',
              color: 'var(--ink-soft)',
            }}
          >
            診断でわかること
          </span>
        </div>

        <div className="space-y-3 max-w-md mx-auto">
          {[
            { icon: <PentagonIcon />, jp: '肌タイプを6種から判定', en: 'Type · 6 patterns' },
            { icon: <RadarIcon />, jp: 'グラフで肌に何が足りないかわかる', en: 'See What Your Skin Needs' },
            { icon: <LeafIcon />, jp: '今日から取り入れる成分提案', en: "Today's Ingredients" },
            { icon: <SunIcon />, jp: '肌タイプ別の朝晩ケアTips', en: 'Daily Routine Tips' },
          ].map((item) => (
            <div
              key={item.jp}
              className="flex items-center gap-4 px-5 py-4"
              style={{
                background: '#fff',
                border: '1px solid var(--line-soft)',
              }}
            >
              <span
                className="flex items-center justify-center flex-shrink-0"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  border: '1px solid var(--gold)',
                  color: 'var(--gold-deep)',
                  background:
                    'radial-gradient(circle at 30% 25%, oklch(0.99 0.008 80), oklch(0.96 0.025 80))',
                }}
                aria-hidden
              >
                {item.icon}
              </span>
              <div className="flex-1 min-w-0">
                <p
                  style={{
                    fontFamily: 'var(--font-jp)',
                    fontWeight: 500,
                    fontSize: '13px',
                    letterSpacing: '0.1em',
                    color: 'var(--ink)',
                    lineHeight: 1.5,
                  }}
                >
                  {item.jp}
                </p>
                <p
                  className="mt-0.5"
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontStyle: 'italic',
                    fontWeight: 300,
                    fontSize: '11px',
                    letterSpacing: '0.18em',
                    color: 'var(--gold-deep)',
                  }}
                >
                  {item.en}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 注意書き */}
        <div
          className="text-center mx-auto mt-10"
          style={{
            fontFamily: 'var(--font-jp-alt)',
            fontSize: '10.5px',
            lineHeight: 1.9,
            letterSpacing: '0.06em',
            color: 'var(--ink-mute)',
            maxWidth: '34ch',
          }}
        >
          <p>※おすすめ商品の自動マッチングは順次公開予定。まずは肌タイプを知ることから。</p>
          <p className="mt-2">※本診断は医療的な診断ではなく、セルフケアの参考情報です。具体的な皮膚の症状・治療が必要な場合は皮膚科専門医にご相談ください。</p>
        </div>
      </section>
    </div>
  )
}

const iconProps = {
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

function Arrow() {
  return (
    <span
      className="inline-block w-5 h-px relative"
      style={{ background: 'currentColor' }}
      aria-hidden
    >
      <span
        className="absolute -top-[3px] right-0 w-[7px] h-[7px]"
        style={{
          borderRight: '1px solid currentColor',
          borderTop: '1px solid currentColor',
          transform: 'rotate(45deg)',
        }}
      />
    </span>
  )
}

function PentagonIcon() {
  return (
    <svg {...iconProps}>
      <path d="M12 3l8 6-3 9H7l-3-9 8-6z" />
    </svg>
  )
}

function RadarIcon() {
  return (
    <svg {...iconProps}>
      <path d="M12 2l9 7-3 11H6L3 9l9-7z" />
      <path d="M12 8l4 3-2 5h-4l-2-5 4-3z" />
    </svg>
  )
}

function LeafIcon() {
  return (
    <svg {...iconProps}>
      <path d="M19 4c-9 0-13 6-13 12 0 1 0 2 .3 3 1-.2 2-.3 2.7-.3 6 0 10-5 10-14.7z" />
      <path d="M6 19c2-5 5-8 10-11" />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2" />
      <path d="M12 19v2" />
      <path d="M3 12h2" />
      <path d="M19 12h2" />
      <path d="M5 5l1.5 1.5" />
      <path d="M17.5 17.5L19 19" />
      <path d="M19 5l-1.5 1.5" />
      <path d="M6.5 17.5L5 19" />
    </svg>
  )
}
