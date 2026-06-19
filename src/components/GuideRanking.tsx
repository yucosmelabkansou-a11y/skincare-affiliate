'use client'

// トップページ ファーストビュー直下の「迷ったらここから」導線。
// 診断を受けないユーザーにも、悩み別カードから最短で商品一覧（フィルター済み）へ到達してもらう。
// カードは /?cat=xxx への内部リンク（SEO内部リンク兼用）だが、同一ページ内では
// CustomEvent でその場で ProductList のフィルターを切り替え＆商品一覧までスクロールする。
// クリックは GA4 の category_card_click で計測する。

import Link from 'next/link'
import { sendGAEvent } from '@next/third-parties/google'
import CategoryIcon, { type IconName } from './icons/CategoryIcon'
import SectionLabel from './SectionLabel'

type Card = { cat: string; icon: IconName; title: string; sub: string }

const CARDS: Card[] = [
  { cat: 'moisture', icon: 'moisture', title: '乾燥肌向け', sub: 'うるおい不足・つっぱりが気になる' },
  { cat: 'pores', icon: 'pores', title: '毛穴・角栓向け', sub: '開き・黒ずみ・ざらつきが気になる' },
  { cat: 'sensitive', icon: 'sensitive', title: '敏感肌向け', sub: 'ゆらぎ・赤み・ヒリつきが気になる' },
  { cat: 'aging', icon: 'aging', title: 'エイジングケア向け', sub: 'ハリ・ツヤ・年齢サインが気になる' },
  { cat: 'base', icon: 'base', title: 'ノーファンデ肌向け', sub: '素肌を活かすベースメイク' },
]

export default function GuideRanking() {
  const handleClick = (card: Card) => {
    sendGAEvent('event', 'category_card_click', {
      card: card.title,
      category: card.cat,
      destination: `/?cat=${card.cat}`,
    })
    // 同一ページ（トップ）内では即フィルター切替＋スクロール
    window.dispatchEvent(new CustomEvent('yun:set-filter', { detail: { cat: card.cat } }))
  }

  return (
    <section className="px-5 pt-8 pb-10" aria-labelledby="guide-ranking-heading">
      <h2 id="guide-ranking-heading" className="sr-only">
        悩み別おすすめから選ぶ
      </h2>
      <SectionLabel en="Start Here" jp="迷ったらここから" />

      <p
        className="text-center mx-auto -mt-6 mb-7"
        style={{
          fontFamily: 'var(--font-jp-alt)',
          fontWeight: 400,
          fontSize: 12.5,
          lineHeight: 1.9,
          letterSpacing: '0.06em',
          color: 'var(--ink-soft)',
          maxWidth: '30ch',
        }}
      >
        肌悩みを選ぶと、ゆんのおすすめを
        <br />
        すぐにチェックできます
      </p>

      <div className="space-y-3 max-w-md mx-auto">
        {CARDS.map((card) => (
          <Link
            key={card.cat}
            href={`/?cat=${card.cat}`}
            scroll={false}
            onClick={() => handleClick(card)}
            className="flex items-center gap-4 px-5 py-4 transition-opacity hover:opacity-80 active:opacity-70"
            style={{
              background: '#fff',
              border: '1px solid var(--line-soft)',
              borderLeft: '2px solid var(--gold)',
              borderRadius: 4,
              textDecoration: 'none',
              minHeight: 68,
            }}
          >
            <span
              className="flex items-center justify-center flex-shrink-0"
              style={{
                width: 44,
                height: 44,
                borderRadius: 999,
                background: 'oklch(0.98 0.012 80)',
                border: '1px solid var(--gold-pale)',
                color: 'var(--gold-deep)',
              }}
              aria-hidden
            >
              <CategoryIcon name={card.icon} size={22} />
            </span>
            <div className="flex-1 min-w-0">
              <p
                style={{
                  fontFamily: 'var(--font-jp)',
                  fontWeight: 600,
                  fontSize: 14.5,
                  letterSpacing: '0.06em',
                  color: 'var(--ink)',
                  marginBottom: 3,
                }}
              >
                {card.title}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-jp-alt)',
                  fontWeight: 400,
                  fontSize: 11.5,
                  letterSpacing: '0.04em',
                  color: 'var(--ink-mute)',
                }}
              >
                {card.sub}
              </p>
            </div>
            <span style={{ color: 'var(--gold)', fontSize: 18, flexShrink: 0 }}>→</span>
          </Link>
        ))}
      </div>

      {/* 肌診断で選ぶ */}
      <div className="max-w-md mx-auto mt-6 text-center">
        <Link
          href="/diagnosis"
          className="inline-flex items-center justify-center gap-3 w-full px-8 py-4 transition-all hover:bg-[var(--gold)] hover:text-white"
          style={{
            fontFamily: 'var(--font-jp)',
            fontWeight: 500,
            fontSize: 13,
            letterSpacing: '0.24em',
            border: '1px solid var(--gold)',
            color: 'var(--ink)',
            background: 'oklch(0.99 0.012 80)',
            borderRadius: 4,
            minHeight: 56,
          }}
        >
          肌診断で選ぶ
          <span aria-hidden>→</span>
        </Link>
        <p
          className="mt-2.5"
          style={{
            fontFamily: 'var(--font-jp-alt)',
            fontWeight: 400,
            fontSize: 11,
            letterSpacing: '0.04em',
            color: 'var(--ink-mute)',
          }}
        >
          2分の質問で、あなたの肌タイプに合う一本が見つかります
        </p>
      </div>
    </section>
  )
}
