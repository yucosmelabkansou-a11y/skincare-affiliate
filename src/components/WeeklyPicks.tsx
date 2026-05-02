'use client'

import { Product } from '@/types/product'

type Props = {
  products: Product[]
  onSelect: (product: Product) => void
}

export default function WeeklyPicks({ products, onSelect }: Props) {
  const picks = products.filter((p) => p.is_pick).slice(0, 5)
  if (picks.length === 0) return null

  return (
    <section
      className="px-4 pt-14 pb-8"
      style={{ background: 'var(--bg-cream)', borderTop: '1px solid var(--line-soft)' }}
    >
      {/* エディトリアル風セクションタイトル（共通トーン） */}
      <div className="flex flex-col items-center gap-2.5 mb-10">
        <span
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: '13px',
            letterSpacing: '0.42em',
            color: 'var(--gold-deep)',
            textTransform: 'uppercase',
          }}
        >
          {"Editor's Top 5"}
        </span>
        <span
          className="block"
          style={{ width: 1, height: 36, background: 'var(--gold)' }}
          aria-hidden
        />
        <h2
          style={{
            fontFamily: 'var(--font-jp)',
            fontWeight: 500,
            fontSize: '12px',
            letterSpacing: '0.4em',
            color: 'var(--ink-soft)',
            margin: 0,
          }}
        >
          ゆんのおすすめTOP5
        </h2>
      </div>

      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1 -mx-4 px-4">
        {picks.map((product) => (
          <button
            key={product.id}
            onClick={() => onSelect(product)}
            className="shrink-0 w-32 text-left bg-white rounded-2xl border border-[#F2EAEF] overflow-hidden active:scale-[0.98] hover:border-[#E8C7D4] hover:shadow-[0_4px_20px_rgba(212,130,158,0.12)] transition-all duration-200"
          >
            {/* Image */}
            <div className="relative w-full aspect-square bg-[#FAF6F3]">
              <div className="absolute inset-0 flex items-center justify-center text-2xl text-[#E8C7D4]">
                🧴
              </div>
              {product.image_filename && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`/images/${product.image_filename}`}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="eager"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                />
              )}
              {/* Pick badge — セリフ体イタリックで上品に */}
              <span
                className="absolute top-1.5 left-1.5 text-[9px] font-serif italic text-white px-2 py-0.5 rounded-full leading-none"
                style={{
                  background:
                    'linear-gradient(135deg, #D4829E 0%, #C2185B 100%)',
                  letterSpacing: '0.15em',
                }}
              >
                Pick
              </span>
            </div>
            {/* Text */}
            <div className="p-2">
              <p className="text-[10px] text-[#9B8E94] truncate font-serif italic tracking-wide">
                {product.brand}
              </p>
              <p className="text-xs font-semibold text-[#4A3F45] leading-snug line-clamp-2 mt-0.5">
                {product.name}
              </p>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}
