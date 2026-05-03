// 記事内/末尾のコンバージョンCTA（肌診断 + 商品一覧へ誘導）

import Link from 'next/link'

export default function ArticleCTA({ variant = 'mid' }: { variant?: 'mid' | 'end' }) {
  const isEnd = variant === 'end'
  return (
    <aside
      className="my-10 mx-auto px-6 py-7"
      style={{
        background:
          'linear-gradient(180deg, oklch(0.985 0.012 80), oklch(0.96 0.018 75))',
        border: '1px solid var(--line-soft)',
        maxWidth: 540,
      }}
      aria-label="関連リンク"
    >
      {!isEnd && (
        <p
          className="text-center mb-5"
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 11,
            letterSpacing: '0.4em',
            color: 'var(--gold-deep)',
            textTransform: 'uppercase',
          }}
        >
          For You
        </p>
      )}

      {isEnd && (
        <p
          className="text-center mb-5"
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 12,
            letterSpacing: '0.4em',
            color: 'var(--gold-deep)',
            textTransform: 'uppercase',
          }}
        >
          What&apos;s Next?
        </p>
      )}

      <div className="flex flex-col gap-3 max-w-sm mx-auto">
        <Link
          href="/diagnosis"
          className="inline-flex items-center justify-center gap-3 px-7 py-3.5 transition-all hover:bg-[var(--gold)] hover:text-white"
          style={{
            fontFamily: 'var(--font-jp)',
            fontWeight: 500,
            fontSize: 13,
            letterSpacing: '0.24em',
            border: '1px solid var(--gold)',
            color: 'var(--ink)',
            background: '#fff',
          }}
        >
          あなたの肌タイプを2分で診断
          <Arrow />
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-3 px-7 py-3.5 transition-opacity hover:opacity-70"
          style={{
            fontFamily: 'var(--font-jp)',
            fontWeight: 500,
            fontSize: 12.5,
            letterSpacing: '0.24em',
            border: '1px solid var(--ink)',
            color: 'var(--ink)',
            background: 'transparent',
          }}
        >
          ゆん厳選アイテムを見る
          <Arrow />
        </Link>
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
