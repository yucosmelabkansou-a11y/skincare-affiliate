import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_URL } from '@/lib/siteConfig'
import PoreDiagnosisClient from './PoreDiagnosisClient'

export const metadata: Metadata = {
  title: '毛穴タイプ診断｜元化粧品研究・商品企画監修・あなたの毛穴の原因を特定',
  description:
    '元化粧品研究・商品企画・29年ノーファンデのゆん監修。16問・約3分であなたの毛穴タイプを判定。開き・詰まり・黒ずみ・たるみ・乾燥・メラニン・産毛の7タイプから診断し、タイプ別おすすめアイテムをご提案します。',
  alternates: {
    canonical: `${SITE_URL}/pore-diagnosis`,
  },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/pore-diagnosis`,
    title: '毛穴タイプ診断｜3分でわかる、あなたの毛穴の原因｜yun.skincare_',
    description:
      '16問の診断で毛穴タイプを特定。開き・詰まり・黒ずみ・たるみ・乾燥など原因別ケアがわかります。',
    images: ['/og-image.jpg'],
  },
}

export default function PoreDiagnosisPage() {
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
            radial-gradient(60% 70% at 80% 10%, oklch(0.96 0.025 30 / .45), transparent 70%),
            radial-gradient(50% 60% at 10% 90%, oklch(0.97 0.02 80 / .6), transparent 70%),
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
        <Link href="/diagnosis" className="hover:opacity-70 transition-opacity">診断</Link>
        <span className="mx-2">/</span>
        <span style={{ color: 'var(--ink)' }}>毛穴タイプ診断</span>
      </nav>

      <PoreDiagnosisClient />

      <footer
        className="px-5 py-10 text-center"
        style={{ borderTop: '1px solid var(--line-soft)' }}
      >
        <p
          className="mb-3"
          style={{
            fontFamily: 'var(--font-jp-alt)',
            fontSize: 11.5,
            lineHeight: 1.9,
            letterSpacing: '0.06em',
            color: 'var(--ink-soft)',
          }}
        >
          最新の編集情報は Instagram で配信中
        </p>
        <a
          href="https://www.instagram.com/yun.skincare_"
          target="_blank"
          rel="me noopener noreferrer"
          style={{
            fontFamily: 'var(--font-sans)',
            fontWeight: 300,
            fontSize: 11,
            letterSpacing: '0.32em',
            color: 'var(--ink-soft)',
            textTransform: 'lowercase',
          }}
          className="hover:opacity-70 transition-opacity"
        >
          @yun.skincare_
        </a>
      </footer>
    </div>
  )
}
