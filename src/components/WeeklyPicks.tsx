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
    <section className="px-4 pt-6 pb-4">
      {/* エディトリアル風セクションタイトル */}
      <div className="text-center mb-5">
        <p className="text-[10px] tracking-[0.4em] text-[#D4829E] font-serif">
          WEEKLY PICKS
        </p>
        <div className="mt-1 text-[10px] tracking-[0.5em] text-[#D4829E]" aria-hidden>
          · · ·
        </div>
        <h2 className="font-serif text-lg text-[#4A3F45] mt-1 tracking-wider">
          今週のおすすめ
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
