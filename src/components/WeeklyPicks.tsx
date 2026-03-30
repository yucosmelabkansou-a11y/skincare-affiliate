'use client'

import Image from 'next/image'
import { Product } from '@/types/product'

type Props = {
  products: Product[]
  onSelect: (product: Product) => void
}

export default function WeeklyPicks({ products, onSelect }: Props) {
  const picks = products.filter((p) => p.is_pick).slice(0, 5)
  if (picks.length === 0) return null

  return (
    <section className="px-4 pt-2 pb-4">
      <div className="flex items-baseline gap-2 mb-3">
        <h2 className="text-base font-bold text-[#343A40]">今週のゆんのおすすめPick</h2>
        <span className="text-[10px] text-[#4DB6AC] font-medium bg-[#E0F2F1] px-2 py-0.5 rounded-full">
          毎週更新
        </span>
      </div>

      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
        {picks.map((product) => (
          <button
            key={product.id}
            onClick={() => onSelect(product)}
            className="shrink-0 w-32 text-left bg-white rounded-2xl border border-[#E9ECEF] shadow-sm overflow-hidden active:scale-95 hover:shadow-md transition-all duration-150"
          >
            {/* Image */}
            <div className="relative w-full aspect-square bg-[#F8F9FA]">
              {product.image_filename && (
                <Image
                  src={`/images/${product.image_filename}`}
                  alt={product.name}
                  fill
                  sizes="128px"
                  className="object-cover"
                  unoptimized
                />
              )}
              <div className="absolute inset-0 flex items-center justify-center text-2xl text-gray-300 bg-[#F8F9FA]">
                🧴
              </div>
              {/* Pick badge */}
              <span className="absolute top-1.5 left-1.5 text-[9px] font-bold bg-[#4DB6AC] text-white px-1.5 py-0.5 rounded-full leading-none">
                PICK
              </span>
            </div>
            {/* Text */}
            <div className="p-2">
              <p className="text-[10px] text-[#6C757D] truncate">{product.brand}</p>
              <p className="text-xs font-semibold text-[#343A40] leading-snug line-clamp-2 mt-0.5">
                {product.name}
              </p>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}
