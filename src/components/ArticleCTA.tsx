'use client'

// 記事内/末尾のコンバージョンCTA（肌診断 + 商品一覧へ誘導）

import { sendGAEvent } from '@next/third-parties/google'
import Link from 'next/link'
import type { CtaTarget } from '@/lib/articles'

const COPY = {
  diagnosis: {
    lead: '自分に合うアイテム選びは、まず肌を知ることから。',
    label: 'あなたの肌タイプを2分で診断',
    href: '/diagnosis',
    primary: true,
  },
  products: {
    lead: 'オススメアイテムは全てここにまとめています。',
    label: 'ゆん厳選アイテムを見る',
    href: '/',
    primary: false,
  },
} as const

type Props = {
  variant?: 'mid' | 'end'
  target?: CtaTarget
}

export default function ArticleCTA({ variant = 'end', target = 'both' }: Props) {
  if (target === 'none') return null

  const isEnd = variant === 'end'
  const items: ('diagnosis' | 'products')[] =
    target === 'both' ? ['diagnosis', 'products'] : [target]

  return (
    <aside
      className={isEnd ? 'my-10 mx-auto px-6 py-7' : 'my-9 mx-auto px-6 py-6'}
      style={{
        background:
          'var(--bg-warm)',
        border: '1px solid var(--line-soft)',
        maxWidth: 540,
      }}
      aria-label="関連リンク"
    >
      {isEnd && (
        <p
          className="text-center mb-5"
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'normal',
            fontWeight: 400,
            fontSize: 13,
            letterSpacing: '0.04em',
            color: 'var(--gold-deep)',
            textTransform: 'uppercase',
          }}
        >
          What&apos;s Next?
        </p>
      )}

      <div
        className={`flex flex-col ${target === 'both' ? 'gap-7' : 'gap-3'} max-w-sm mx-auto`}
      >
        {items.map((key) => {
          const c = COPY[key]
          return (
            <div key={key} className="flex flex-col gap-3">
              <p
                className="text-center"
                style={{
                  fontFamily: 'var(--font-jp-alt)',
                  fontWeight: 400,
                  fontSize: 13,
                  lineHeight: 1.85,
                  letterSpacing: '0.06em',
                  color: 'var(--ink-soft)',
                }}
              >
                {c.lead}
              </p>
              <Link
                href={c.href}
                onClick={() =>
                  sendGAEvent('event', 'article_cta_click', {
                    target: key,
                    variant,
                  })
                }
                className={
                  c.primary
                    ? 'inline-flex items-center justify-center gap-3 px-7 py-3.5 transition-all hover:bg-[var(--gold)] hover:text-white'
                    : 'inline-flex items-center justify-center gap-3 px-7 py-3.5 transition-opacity hover:opacity-70'
                }
                style={
                  c.primary
                    ? {
                        fontFamily: 'var(--font-jp)',
                        fontWeight: 500,
                        fontSize: 13,
                        letterSpacing: '0.04em',
                        border: '1px solid var(--gold)',
                        color: 'var(--ink)',
                        background: '#fff',
                      }
                    : {
                        fontFamily: 'var(--font-jp)',
                        fontWeight: 500,
                        fontSize: 13,
                        letterSpacing: '0.04em',
                        border: '1px solid var(--ink)',
                        color: 'var(--ink)',
                        background: 'transparent',
                      }
                }
              >
                {c.label}
                <Arrow />
              </Link>
            </div>
          )
        })}
      </div>
    </aside>
  )
}

function Arrow() {
  return (
    <span
      className="inline-block w-4 h-px relative"
      style={{ background: 'currentColor' }}
      aria-hidden
    >
      <span
        className="absolute -top-[3px] right-0 w-[6px] h-[6px]"
        style={{
          borderRight: '1px solid currentColor',
          borderTop: '1px solid currentColor',
          transform: 'rotate(45deg)',
        }}
      />
    </span>
  )
}
