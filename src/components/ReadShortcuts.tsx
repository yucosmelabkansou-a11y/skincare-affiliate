// ヒーロー直下：コラム / Q&A への近道ナビ
// 商品リストが長いのでスクロール途中で離脱されないよう、上部で読み物導線を提示

import Link from 'next/link'

export default function ReadShortcuts() {
  return (
    <section
      className="px-5 pt-10 pb-12"
      style={{
        background: 'var(--bg-cream)',
        borderTop: '1px solid var(--line-soft)',
      }}
      aria-label="読み物への近道"
    >
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
          <span>Read First</span>
          <span className="block w-7 h-px" style={{ background: 'var(--gold)' }} aria-hidden />
        </div>
        <span className="whitespace-nowrap">商品の前に読みたい</span>
      </div>

      <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
        <Link
          href="/qa"
          className="flex flex-col items-center text-center px-4 py-6 transition-all hover:bg-[oklch(0.985_0.012_80)]"
          style={{
            background: '#fff',
            border: '1px solid var(--line-soft)',
            minHeight: 140,
          }}
        >
          <span
            className="flex items-center justify-center mb-3"
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
            <QnAIcon />
          </span>
          <p
            style={{
              fontFamily: 'var(--font-jp)',
              fontWeight: 500,
              fontSize: 13,
              lineHeight: 1.6,
              letterSpacing: '0.1em',
              color: 'var(--ink)',
              marginBottom: 4,
              wordBreak: 'keep-all',
            }}
          >
            インスタライブ
            <br />
            Q&A
          </p>
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontWeight: 300,
              fontSize: 10,
              letterSpacing: '0.18em',
              color: 'var(--gold-deep)',
              textTransform: 'uppercase',
            }}
          >
            View All →
          </p>
        </Link>

        <Link
          href="/column"
          className="flex flex-col items-center text-center px-4 py-6 transition-all hover:bg-[oklch(0.985_0.012_80)]"
          style={{
            background: '#fff',
            border: '1px solid var(--line-soft)',
            minHeight: 140,
          }}
        >
          <span
            className="flex items-center justify-center mb-3"
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
            <BookIcon />
          </span>
          <p
            style={{
              fontFamily: 'var(--font-jp)',
              fontWeight: 500,
              fontSize: 13,
              lineHeight: 1.6,
              letterSpacing: '0.1em',
              color: 'var(--ink)',
              marginBottom: 4,
              wordBreak: 'keep-all',
            }}
          >
            詳しい解説
            <br />
            コラム
          </p>
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontWeight: 300,
              fontSize: 10,
              letterSpacing: '0.18em',
              color: 'var(--gold-deep)',
              textTransform: 'uppercase',
            }}
          >
            View All →
          </p>
        </Link>
      </div>

      <p
        className="text-center mx-auto mt-7"
        style={{
          fontFamily: 'var(--font-jp-alt)',
          fontWeight: 400,
          fontSize: 11,
          lineHeight: 1.85,
          letterSpacing: '0.06em',
          color: 'var(--ink-mute)',
          maxWidth: '32ch',
        }}
      >
        商品を選ぶ前に、自分の肌や成分のことを知りたい方はこちら。
      </p>
    </section>
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

function QnAIcon() {
  return (
    <svg {...iconProps}>
      <path d="M21 12a8 8 0 0 1-12 6.9L3 21l1.7-5A8 8 0 1 1 21 12z" />
      <path d="M9.5 9.5a2.5 2.5 0 1 1 4 2c-.7.5-1 1-1 1.5" />
      <circle cx="12.5" cy="16" r="0.5" fill="currentColor" />
    </svg>
  )
}

function BookIcon() {
  return (
    <svg {...iconProps}>
      <path d="M4 4h12a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3V4z" />
      <path d="M4 17a3 3 0 0 1 3-3h12" />
      <path d="M8 8h7" />
      <path d="M8 11h5" />
    </svg>
  )
}
