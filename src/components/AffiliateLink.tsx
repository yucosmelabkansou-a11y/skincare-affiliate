'use client'

// アフィリエイトリンクの共通コンポーネント。
// クリック時に GA4 へ `affiliate_click` イベントを送信し、
// 「どの肌タイプ経由で・どの配置の・どの商品の・Amazon/楽天どちらが」
// 押されたかを計測できるようにする。
//
// 計測パラメータ（GA4 のカスタムディメンション/指標として登録すると分析しやすい）:
//   store        … 'amazon' | 'rakuten'
//   page_type    … 'diagnosis_result' | 'product_list' | 'column' など、押された画面の種類
//   placement    … 'top3' | 'product_match' | 'product_card' | 'product_modal' など画面内の配置
//   product_id   … products.csv の id
//   product_name … 商品名
//   brand        … ブランド名
//   skin_type    … 診断結果ページ経由なら肌タイプ（それ以外は 'none'）

import { sendGAEvent } from '@next/third-parties/google'
import type { CSSProperties, ReactNode } from 'react'

export type AffiliateStore = 'amazon' | 'rakuten'

type Props = {
  href: string
  store: AffiliateStore
  productId?: string
  productName?: string
  brand?: string
  placement: string
  pageType?: string
  skinType?: string
  className?: string
  style?: CSSProperties
  children: ReactNode
}

export default function AffiliateLink({
  href,
  store,
  productId,
  productName,
  brand,
  placement,
  pageType,
  skinType,
  className,
  style,
  children,
}: Props) {
  const handleClick = () => {
    sendGAEvent('event', 'affiliate_click', {
      store,
      page_type: pageType ?? 'other',
      placement,
      product_id: productId ?? '',
      product_name: productName ?? '',
      brand: brand ?? '',
      skin_type: skinType ?? 'none',
    })
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="sponsored noopener"
      onClick={handleClick}
      className={className}
      style={style}
    >
      {children}
    </a>
  )
}
