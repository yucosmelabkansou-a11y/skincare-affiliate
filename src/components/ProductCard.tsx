'use client'

import Image from 'next/image'
import { Product } from '@/types/product'
import { getProductImageSrc } from '@/lib/productImage'
import AffiliateLink from './AffiliateLink'

type Props = {
  product: Product
  onClick: () => void
}

export default function ProductCard({ product, onClick }: Props) {
  const imageSrc = getProductImageSrc(product)

  return (
    <article className="product-card">
      <button type="button" className="product-open" onClick={onClick} aria-label={product.name}>
      {/* Image area */}
      <div className="product-image relative w-full aspect-square">
        {/* 🧴 fallback */}
        <div className="absolute inset-0 flex items-center justify-center text-3xl text-[#E8C7D4]">
          <span className="image-placeholder" aria-hidden />
        </div>
        {imageSrc && (
          imageSrc.startsWith('https://') ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageSrc}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-contain"
              loading="lazy"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
            />
          ) : (
            <Image
              src={imageSrc}
              alt={product.name}
              fill
              sizes="(max-width: 767px) 50vw, (max-width: 1023px) 30vw, 260px"
              className="object-contain"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
            />
          )
        )}

        {/* Instagram badge */}
        {product.instagram_url && (
          <span className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center bg-white/95 rounded-full shadow-sm">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="#C2185B">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </span>
        )}

        {/* ゆんMUST バッジ */}
        {product.is_yun_must && (
          <span
            className="absolute top-2 left-2 px-2 py-0.5 text-[9px] font-serif italic text-white rounded-full"
            style={{
              background:
                'var(--bg-warm)',
              letterSpacing: '0.04em',
            }}
          >
            MUST
          </span>
        )}
      </div>

      {/* Text area */}
      <div className="product-copy">
        <p className="text-[10px] tracking-wider text-[#9B8E94] mb-0.5 font-serif italic">
          {product.brand}
        </p>
        <p className="text-sm font-semibold text-[#4A3F45] leading-snug">
          {product.name}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-2">
          {product.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-2 py-0.5 bg-[#FDF2F6] text-[#C2185B] rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        </div>
      </button>
      <div className="product-links">
        {(product.amazon_url || product.rakuten_url) && (
          <div className="flex gap-1.5 mt-3" onClick={(e) => e.stopPropagation()}>
            {product.amazon_url && (
              <AffiliateLink
                href={product.amazon_url}
                store="amazon"
                productId={product.id}
                productName={product.name}
                brand={product.brand}
                placement="product_card"
                className="flex-1 text-center px-2 py-1 text-[10px] font-medium text-[#4A3F45] border border-[#E8C7D4] hover:bg-[#FDF2F6] rounded-full transition-colors tracking-wider"
              >
                Amazon
              </AffiliateLink>
            )}
            {product.rakuten_url && (
              <AffiliateLink
                href={product.rakuten_url}
                store="rakuten"
                productId={product.id}
                productName={product.name}
                brand={product.brand}
                placement="product_card"
                className="flex-1 text-center px-2 py-1 text-[10px] font-medium text-[#4A3F45] border border-[#E8C7D4] hover:bg-[#FDF2F6] rounded-full transition-colors tracking-wider"
              >
                楽天
              </AffiliateLink>
            )}
          </div>
        )}
      </div>
    </article>
  )
}
