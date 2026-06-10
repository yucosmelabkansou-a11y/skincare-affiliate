// ============================================================================
// 商品個別ページ（/products/<slug>）の slug ＆ 編集者エンリッチ定義
// ----------------------------------------------------------------------------
// なぜ products.csv ではなくここに置くか：
//   products.csv は「更新」コマンドで Google スプレッドシートから *毎回再生成* される
//   （CLAUDE.md 参照）。再生成スクリプトは既知の12カラムしか書き出さないため、
//   CSV に slug や編集テキストを足しても次回更新で消える。
//   → 再生成の影響を受けない別ファイル（diagnosis-overrides.ts と同じ思想）で持つ。
//
// 運用ルール：
//   - 商品は products.csv の `id` で参照する。
//   - `slug` は一度公開したら変えない（変えると旧URLが404になりリダイレクトが要る）。
//   - whoFor / notFor / texture / pros / ingredientNotes は「ゆんの編集言葉」。
//     未指定でもページは成立する（その場合 review・tags など CSV の事実だけで描画）。
// ============================================================================

import { getProducts } from './parseCSV'
import type { Product } from '@/types/product'

export type ProductEditorial = {
  /** /products/<slug> の slug。ローマ字・小文字・ハイフン区切り。公開後は不変。 */
  slug: string
  /** こんな人に向いている（2〜3個・ベネフィット表現） */
  whoFor?: string[]
  /** 逆に向かない／注意したい人（誠実さのため。短所も書く） */
  notFor?: string[]
  /** 使用感（テクスチャー・香り・仕上がりなど、ゆんの実感） */
  texture?: string
  /** 推しポイント（◎ で出る短い箇条書き） */
  pros?: string[]
  /** 成分名 → ひとこと解説（key_ingredients を補足する。事実ベース） */
  ingredientNotes?: Record<string, string>
}

/**
 * products.csv の id をキーにした編集者定義。
 * ここに載っている商品だけが /products/<slug> として生成される（generateStaticParams）。
 * → パイロット中は1商品だけ。OKが出たら順次追加していく。
 */
export const PRODUCT_PAGES: Record<string, ProductEditorial> = {
  // ── パイロット第1号：アネッサ ブライトニングUV ジェル NA（id=28）─────────────
  // ↓ whoFor/notFor/texture/pros/ingredientNotes はゆんの編集言葉として要レビュー。
  //   事実（SPF50+ PA++++ / 美白有効成分 m-トラネキサム酸 / ラベンダーピンク色補正）は
  //   CSV review に基づく。表現の最終確認をお願いします。
  '28': {
    slug: 'anessa-brightening-uv-gel-na',
    whoFor: [
      '日焼け止めと美白ケアを1本で済ませたい人',
      '夕方の黄ぐすみ・くすみが気になる人',
      'みずみずしくて白浮きしにくいUVを探している人',
    ],
    notFor: [
      'ラベンダーピンクの色補正を必要としない、無色のUVが好みの人',
      '美白有効成分よりも徹底した低刺激設計を最優先したい人',
    ],
    texture: 'ジェルタイプでみずみずしく伸び、白浮きしにくい仕上がり。ラベンダーピンクの色設計で黄ぐすみを補正し、肌をワントーン明るく見せてくれる。',
    pros: [
      'SPF50+・PA++++ の高い紫外線防御',
      '美白有効成分 m-トラネキサム酸配合の医薬部外品',
      '日焼け止め＋トーンアップ＋美白ケアを1本に集約',
    ],
    ingredientNotes: {
      'm-トラネキサム酸': 'メラニンの生成を抑え、シミ・そばかすを防ぐ美白有効成分（医薬部外品の有効成分）。',
    },
  },
}

// ── 参照ヘルパー ────────────────────────────────────────────────────────────

/** 公開対象（PRODUCT_PAGES に登録された）商品を、CSV実体とマージして返す。 */
export type ProductPageData = {
  product: Product
  editorial: ProductEditorial
}

export function getAllProductPages(): ProductPageData[] {
  const products = getProducts()
  const byId = new Map(products.map((p) => [p.id, p]))
  const out: ProductPageData[] = []
  for (const [id, editorial] of Object.entries(PRODUCT_PAGES)) {
    const product = byId.get(id)
    if (product) out.push({ product, editorial })
  }
  return out
}

/** 公開対象の slug 一覧（sitemap / generateStaticParams 用）。 */
export function getAllProductSlugs(): string[] {
  return Object.values(PRODUCT_PAGES).map((e) => e.slug)
}

/** slug から商品＋編集データを引く。無ければ null。 */
export function getProductPageBySlug(slug: string): ProductPageData | null {
  const id = Object.keys(PRODUCT_PAGES).find((k) => PRODUCT_PAGES[k].slug === slug)
  if (!id) return null
  const product = getProducts().find((p) => p.id === id)
  if (!product) return null
  return { product, editorial: PRODUCT_PAGES[id] }
}

/** 価格文字列（"¥1,496 / 40g"）から数値だけ取り出す（構造化データ offers 用）。失敗時 null。 */
export function parsePriceJPY(price: string): number | null {
  const m = price.match(/¥?\s*([\d,]+)/)
  if (!m) return null
  const n = Number(m[1].replace(/,/g, ''))
  return Number.isFinite(n) && n > 0 ? n : null
}
