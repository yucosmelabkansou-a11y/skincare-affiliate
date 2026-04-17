import Link from 'next/link'
import { getProducts } from '@/lib/parseCSV'
import type { Product } from '@/types/product'
import type { SkinType, Concern } from '@/lib/diagnosis'

type Props = {
  skinType: SkinType
  concern?: Concern
  themeColor: string
}

// 悩み→must_tagのマッピング
const concernToMustTag: Record<Concern, string[]> = {
  spots: ['spots'],
  wrinkles: ['wrinkles'],
  pores: ['pores'],
  dryness: ['dryness'],
  acne: ['acne'],
  redness: ['redness'],
}

export default function MustProducts({ skinType, concern, themeColor }: Props) {
  const products = getProducts()
  const mustProducts = products.filter((p) => p.is_yun_must)

  // 共通MUST
  const commonMust = mustProducts.filter((p) => p.must_tags.includes('common'))

  // 肌タイプ別MUST
  const typeMust = mustProducts.filter((p) => p.must_tags.includes(skinType))

  // 悩み別MUST
  const concernTags = concern ? concernToMustTag[concern] ?? [] : []
  const concernMust = concern
    ? mustProducts.filter((p) => concernTags.some((tag) => p.must_tags.includes(tag)))
    : []

  // 重複排除して表示順：肌タイプ → 悩み → 共通
  const seen = new Set<string>()
  const ordered: { group: string; product: Product }[] = []
  const add = (group: string, arr: Product[]) => {
    for (const p of arr) {
      if (!seen.has(p.id)) {
        ordered.push({ group, product: p })
        seen.add(p.id)
      }
    }
  }
  add('your-type', typeMust)
  add('your-concern', concernMust)
  add('common', commonMust)

  if (ordered.length === 0) return null

  return (
    <section className="px-5 pb-6">
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#F2EAEF]">
        {/* エディトリアル風ヘッダー */}
        <div className="text-center mb-5">
          <p className="text-[10px] tracking-[0.4em] text-[#D4829E] font-serif">
            YUN&apos;S MUST HAVE
          </p>
          <div className="mt-1 text-[10px] tracking-[0.5em] text-[#D4829E]" aria-hidden>
            · · ·
          </div>
          <h2 className="font-serif text-lg text-[#4A3F45] mt-1 tracking-wider">
            ゆんMUSTアイテム
          </h2>
          <p className="text-[11px] text-[#9B8E94] mt-2 leading-relaxed">
            元化粧品研究員ゆんが自信を持って推す、
            <br />
            本当に使ってほしいアイテム
          </p>
        </div>

        <div className="space-y-3">
          {ordered.map(({ group, product }) => (
            <MustCard
              key={product.id}
              product={product}
              group={group}
              themeColor={themeColor}
            />
          ))}
        </div>

        <Link
          href="/"
          className="block mt-4 text-center text-xs text-[#6C757D] hover:text-[#4DB6AC] underline"
        >
          すべての商品を見る →
        </Link>
      </div>
    </section>
  )
}

function MustCard({
  product,
  group,
  themeColor,
}: {
  product: Product
  group: string
  themeColor: string
}) {
  const groupLabel: Record<string, { label: string; bg: string; color: string }> = {
    'your-type': {
      label: 'あなたの肌タイプMUST',
      bg: `${themeColor}15`,
      color: themeColor,
    },
    'your-concern': {
      label: 'あなたの悩みMUST',
      bg: '#FCE4EC',
      color: '#C2185B',
    },
    common: {
      label: '全肌タイプ共通MUST',
      bg: '#FFF3E0',
      color: '#E65100',
    },
  }
  const meta = groupLabel[group] ?? groupLabel.common

  const hasImage = product.image_filename && product.image_filename !== '.jpg'

  return (
    <div className="rounded-2xl border border-[#F0F0F0] overflow-hidden bg-white">
      {/* グループラベル */}
      <div
        className="px-3 py-1 text-[10px] font-semibold tracking-wide"
        style={{ backgroundColor: meta.bg, color: meta.color }}
      >
        ⭐ {meta.label}
      </div>

      {/* コンテンツ */}
      <div className="p-3 flex gap-3">
        {/* 画像 */}
        <div className="relative w-20 h-20 flex-shrink-0 rounded-xl bg-[#F8F9FA] overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center text-2xl text-gray-300">
            🧴
          </div>
          {hasImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`/images/${product.image_filename}`}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
          )}
        </div>

        {/* 情報 */}
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-[#6C757D]">{product.brand}</p>
          <p className="text-sm font-semibold text-[#343A40] leading-snug line-clamp-2">
            {product.name}
          </p>
          <p className="text-[10px] text-[#6C757D] mt-0.5">{product.price}</p>

          {/* ゆんコメント */}
          {product.yun_must_comment && (
            <p className="text-[11px] text-[#343A40] mt-2 leading-relaxed bg-[#FDF5F8] p-2 rounded-lg">
              💬 {product.yun_must_comment}
            </p>
          )}

          {/* 購入ボタン（編集感のあるアウトライン型） */}
          {(product.amazon_url || product.rakuten_url) && (
            <div className="flex gap-1.5 mt-2">
              {product.amazon_url && (
                <a
                  href={product.amazon_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center px-2 py-1.5 text-[11px] font-medium text-[#4A3F45] border border-[#E8C7D4] hover:bg-[#FDF2F6] rounded-full transition-colors tracking-wider"
                >
                  Amazon
                </a>
              )}
              {product.rakuten_url && (
                <a
                  href={product.rakuten_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center px-2 py-1.5 text-[11px] font-medium text-[#4A3F45] border border-[#E8C7D4] hover:bg-[#FDF2F6] rounded-full transition-colors tracking-wider"
                >
                  楽天
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
