// クリーム×ゴールド エディトリアルヒーロー
// HTMLモックのトーンを Next.js モバイル幅に合わせて移植

import Link from 'next/link'
import { INSTAGRAM_URL } from '@/lib/siteConfig'

export default function EditorialHero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: `
          radial-gradient(60% 70% at 80% 10%, oklch(0.96 0.025 30 / .7), transparent 70%),
          radial-gradient(50% 60% at 10% 90%, oklch(0.97 0.02 80 / .8), transparent 70%),
          linear-gradient(180deg, var(--bg-ivory) 0%, var(--bg-cream) 60%, var(--bg-warm) 100%)
        `,
      }}
    >
      <div className="relative px-6 pt-16 pb-14 text-center">
        {/* eyebrow with rule（スマホでも崩れないよう2行構成）*/}
        <div
          className="flex flex-col items-center gap-1.5 mb-7"
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
            <span>The Beauty Edit</span>
            <span className="block w-7 h-px" style={{ background: 'var(--gold)' }} aria-hidden />
          </div>
          <span className="whitespace-nowrap">Nearly 200 items</span>
        </div>

        {/* h1 — 和文セリフ */}
        <h1
          className="leading-[1.7] mx-auto"
          style={{
            fontFamily: 'var(--font-jp)',
            fontWeight: 500,
            fontSize: 'clamp(20px, 5.6vw, 28px)',
            letterSpacing: '0.1em',
            color: 'var(--ink)',
            wordBreak: 'keep-all',
            overflowWrap: 'normal',
          }}
        >
          ノーファンデが選ぶ、
          <br />
          素肌を育てるスキンケア
        </h1>

        {/* tagline */}
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
          — Skincare Edit by Yun —
        </p>

        {/* wordmark Skin&Care */}
        <div
          className="mt-8"
          style={{
            fontFamily: 'var(--font-script)',
            fontSize: 'clamp(48px, 14vw, 72px)',
            letterSpacing: '0.04em',
            color: 'var(--gold-deep)',
            lineHeight: 1,
          }}
        >
          Skin
          <span
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontWeight: 300,
              color: 'var(--gold)',
            }}
          >
            &amp;
          </span>
          Care
        </div>

        {/* IG handle */}
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-6 transition-colors hover:opacity-70"
          style={{
            fontFamily: 'var(--font-sans)',
            fontWeight: 300,
            fontSize: '11px',
            letterSpacing: '0.4em',
            color: 'var(--ink-mute)',
            textTransform: 'lowercase',
          }}
        >
          edited&nbsp;&nbsp;by&nbsp;&nbsp;yun.skincare_
        </a>

        {/* CTA */}
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-3 px-2">
          <a
            href="#products"
            className="inline-flex items-center justify-center gap-3 px-9 py-4 transition-all hover:bg-[var(--gold)] hover:text-white"
            style={{
              fontFamily: 'var(--font-jp)',
              fontWeight: 500,
              fontSize: '13px',
              letterSpacing: '0.32em',
              border: '1px solid var(--gold)',
              color: 'var(--ink)',
              background: '#fff',
              boxShadow: '0 18px 40px -28px oklch(0.5 0.06 70 / .35)',
            }}
          >
            ゆんのおすすめを見る
            <span
              className="inline-block w-5 h-px relative"
              style={{ background: 'currentColor' }}
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
          </a>
          <Link
            href="/diagnosis"
            className="relative inline-flex items-center justify-center gap-3 px-9 py-4 transition-all hover:opacity-70"
            style={{
              fontFamily: 'var(--font-jp)',
              fontWeight: 500,
              fontSize: '13px',
              letterSpacing: '0.32em',
              border: '1px solid var(--ink)',
              color: 'var(--ink)',
              background: 'transparent',
            }}
          >
            肌診断を受ける
            <span
              className="inline-block w-5 h-px relative"
              style={{ background: 'currentColor' }}
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
            <span
              className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full whitespace-nowrap"
              style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontSize: '10px',
                color: 'var(--gold-deep)',
                background: '#fff',
                border: '1px solid var(--gold)',
                letterSpacing: '0.12em',
              }}
            >
              soon
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}
