'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { Product } from '@/types/product'
import { getProductImageSrc } from '@/lib/productImage'
import InstagramEmbed from './InstagramEmbed'
import AffiliateLink from './AffiliateLink'

type Props = {
  product: Product | null
  onClose: () => void
}

export default function ProductModal({ product, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    if (!product) return
    const dialog = dialogRef.current
    const previous = document.activeElement as HTMLElement | null
    dialog?.showModal()
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      dialog?.close()
      document.body.style.overflow = overflow
      previous?.focus()
    }
  }, [product])
  if (!product) return null
  const imageSrc = getProductImageSrc(product)

  return (
    <dialog ref={dialogRef} className="product-dialog" aria-labelledby="product-dialog-title" onCancel={onClose} onClick={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <div className="product-dialog-layout">
        {/* Image */}
        <div className="dialog-image relative w-full aspect-square">
          {/* 🧴 fallback — always behind the product image */}
          <div className="absolute inset-0 flex items-center justify-center text-6xl text-gray-200">
            <span className="image-placeholder" aria-hidden />
          </div>
          {imageSrc && (
            imageSrc.startsWith('https://') ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageSrc}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-contain"
              />
            ) : (
              <Image
                src={imageSrc}
                alt={product.name}
                fill
                sizes="(max-width: 767px) 100vw, 420px"
                className="object-contain"
              />
            )
          )}
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="dialog-close"
          aria-label="閉じる"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="dialog-content">
          <p className="text-xs text-[#6C757D] mb-1">{product.brand}</p>
          <h2 id="product-dialog-title" className="text-lg font-bold text-[#343A40] mb-3 leading-snug">{product.name}</h2>

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
          <div className="dialog-purchase">
            {product.amazon_url && (
              <AffiliateLink
                href={product.amazon_url}
                store="amazon"
                productId={product.id}
                productName={product.name}
                brand={product.brand}
                placement="product_modal"
                className="flex-1 py-3 text-sm font-semibold text-white bg-[#FF9900] rounded-xl text-center hover:bg-[#e88a00] active:scale-95 transition-all"
              >
                Amazonで見る
              </AffiliateLink>
            )}
            {product.rakuten_url && (
              <AffiliateLink
                href={product.rakuten_url}
                store="rakuten"
                productId={product.id}
                productName={product.name}
                brand={product.brand}
                placement="product_modal"
                className="flex-1 py-3 text-sm font-semibold text-white bg-[#BF0000] rounded-xl text-center hover:bg-[#a80000] active:scale-95 transition-all"
              >
                楽天で見る
              </AffiliateLink>
            )}
          </div>
        )}
      </div>
    </dialog>
  )
}
