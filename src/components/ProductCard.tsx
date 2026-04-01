'use client'

import { Product } from '@/types/product'

type Props = {
  product: Product
  onClick: () => void
}

export default function ProductCard({ product, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white rounded-2xl border border-[#E9ECEF] shadow-sm overflow-hidden active:scale-95 hover:shadow-md transition-all duration-150"
    >
      {/* Image area */}
      <div className="relative w-full aspect-square bg-[#F8F9FA]">
        {/* 🧴 fallback — always behind the product image */}
        <div className="absolute inset-0 flex items-center justify-center text-3xl text-gray-300">
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

        {/* Instagram badge */}
        {product.instagram_url && (
          <span className="absolute top-1.5 right-1.5 w-6 h-6 flex items-center justify-center bg-white/90 rounded-full shadow-sm">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="#E1306C">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </span>
        )}
      </div>

      {/* Text area */}
      <div className="p-3">
        <p className="text-xs text-[#6C757D] mb-0.5">{product.brand}</p>
        <p className="text-sm font-semibold text-[#343A40] leading-snug line-clamp-2">{product.name}</p>
        <div className="flex flex-wrap gap-1 mt-2">
          {product.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="text-[10px] px-2 py-0.5 bg-[#E0F2F1] text-[#4DB6AC] rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </button>
  )
}
