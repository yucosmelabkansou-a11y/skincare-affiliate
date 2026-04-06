'use client'

import Image from 'next/image'
import { Product } from '@/types/product'
import InstagramEmbed from './InstagramEmbed'

type Props = {
  product: Product | null
  onClose: () => void
}

export default function ProductModal({ product, onClose }: Props) {
  if (!product) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <div className="relative w-full aspect-[4/3] bg-[#F8F9FA]">
          {/* 🧴 fallback — always behind the product image */}
          <div className="absolute inset-0 flex items-center justify-center text-6xl text-gray-200">
            🧴
          </div>
          {product.image_filename && (
            <Image
              src={`/images/${product.image_filename}`}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, 512px"
              className="object-cover"
              unoptimized
            />
          )}
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full shadow text-gray-600 hover:text-gray-900 transition-colors"
          aria-label="閉じる"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="px-5 pt-4 pb-28">
          <p className="text-xs text-[#6C757D] mb-1">{product.brand}</p>
          <h2 className="text-lg font-bold text-[#343A40] mb-3 leading-snug">{product.name}</h2>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {product.tags.map((tag) => (
              <span key={tag} className="text-xs px-2.5 py-1 bg-[#E0F2F1] text-[#4DB6AC] rounded-full font-medium">
                {tag}
              </span>
            ))}
          </div>

          {/* Review */}
          <p className="text-[14px] text-[#6C757D] leading-[1.8]">{product.review}</p>

          {/* Instagram embed */}
          {product.instagram_url && (
            <InstagramEmbed url={product.instagram_url} />
          )}
        </div>

        {/* Sticky footer buttons */}
        {(product.amazon_url || product.rakuten_url) && (
          <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-[#E9ECEF] px-5 py-3 flex gap-3">
            {product.amazon_url && (
              <a
                href={product.amazon_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 text-sm font-semibold text-white bg-[#FF9900] rounded-xl text-center hover:bg-[#e88a00] active:scale-95 transition-all"
              >
                Amazonで見る 🛒
              </a>
            )}
            {product.rakuten_url && (
              <a
                href={product.rakuten_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 text-sm font-semibold text-white bg-[#BF0000] rounded-xl text-center hover:bg-[#a80000] active:scale-95 transition-all"
              >
                楽天で見る
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
