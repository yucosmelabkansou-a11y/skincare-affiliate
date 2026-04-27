// 肌タイプ別 ステップ別ルーティン提案 UI

import { getProducts } from '@/lib/parseCSV'
import { getRoutineForType } from '@/lib/routine'
import type { SkinType, Concern } from '@/lib/diagnosis'

type Props = {
  skinType: SkinType
  concern?: Concern
  themeColor: string
}

export default function RoutineSteps({ skinType, concern, themeColor }: Props) {
  const products = getProducts()
  const routine = getRoutineForType(products, skinType, concern)

  // 商品が割り当てられなかったステップは除外
  const validSteps = routine.filter((r) => r.product !== null)

  if (validSteps.length === 0) return null

  return (
    <section className="px-5 pb-6">
      {/* セクションヘッダー */}
      <div className="text-center mb-5">
        <p className="font-serif text-[10px] tracking-[0.4em]" style={{ color: themeColor }}>
          YOUR ROUTINE
        </p>
        <div className="mt-1 text-[10px] tracking-[0.5em]" style={{ color: themeColor }} aria-hidden>
          · · ·
        </div>
        <h2 className="font-serif text-base text-[#4A3F45] mt-1 tracking-wider">
          ゆんおすすめルーティン
        </h2>
        <p className="text-[11px] text-[#9B8E94] mt-2 leading-relaxed font-serif italic">
          あなたの肌タイプに最適化された
          <br />
          STEP別 全商品提案
        </p>
      </div>

      <div className="space-y-4 relative">
        {/* 縦の繋ぎ線 */}
        <div
          className="absolute left-[22px] top-3 bottom-3 w-[1px] opacity-40"
          style={{ backgroundColor: themeColor }}
          aria-hidden
        />

        {validSteps.map(({ step, product }) => (
          <RoutineCard
            key={step.step}
            step={step.step}
            stepLabelEn={step.labelEn}
            stepLabel={step.label}
            timing={step.timing}
            product={product!}
            themeColor={themeColor}
          />
        ))}
      </div>

      {/* フッター注釈 */}
      <p className="text-[10px] text-[#9B8E94] mt-5 text-center font-serif italic leading-relaxed">
        ※元化粧品研究員ゆんが、あなたの肌悩みに合わせて
        <br />
        100種以上の商品から最適解を自動提案しています
      </p>
    </section>
  )
}

// ========== ステップカード ==========
function RoutineCard({
  step,
  stepLabelEn,
  stepLabel,
  timing,
  product,
  themeColor,
}: {
  step: number
  stepLabelEn: string
  stepLabel: string
  timing?: 'night' | 'morning' | 'both'
  product: NonNullable<ReturnType<typeof getRoutineForType>[number]['product']>
  themeColor: string
}) {
  const hasImage = product.image_filename && product.image_filename !== '.jpg'

  const timingBadge = timing === 'night' ? '夜' : timing === 'morning' ? '朝' : null

  return (
    <div className="relative pl-12">
      {/* ステップ番号バブル */}
      <div
        className="absolute left-0 top-2 w-11 h-11 rounded-full flex flex-col items-center justify-center text-white shadow-sm"
        style={{ background: `linear-gradient(135deg, ${themeColor}EE 0%, ${themeColor} 100%)` }}
      >
        <span className="font-serif text-[8px] tracking-wider opacity-80">STEP</span>
        <span className="font-serif text-sm font-medium leading-none">
          {String(step).padStart(2, '0')}
        </span>
      </div>

      {/* カード */}
      <div className="bg-white rounded-2xl border border-[#F2EAEF] p-3.5 shadow-sm">
        {/* ステップラベル */}
        <div className="flex items-center justify-between mb-2.5">
          <div>
            <p
              className="font-serif text-[9px] tracking-[0.3em]"
              style={{ color: themeColor }}
            >
              {stepLabelEn}
            </p>
            <p className="font-serif text-sm text-[#4A3F45] tracking-wider">
              {stepLabel}
            </p>
          </div>
          {timingBadge && (
            <span
              className="text-[10px] px-2 py-0.5 rounded-full font-medium"
              style={{
                backgroundColor: `${themeColor}15`,
                color: themeColor,
              }}
            >
              {timingBadge}のみ
            </span>
          )}
        </div>

        {/* 商品 */}
        <div className="flex gap-3">
          {/* 画像 */}
          <div className="relative w-20 h-20 flex-shrink-0 rounded-xl bg-[#FAF6F3] overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center text-2xl text-[#E8C7D4]">
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
            <p className="text-[10px] text-[#9B8E94] font-serif italic">
              {product.brand}
            </p>
            <p className="text-sm font-semibold text-[#4A3F45] leading-snug line-clamp-2">
              {product.name}
            </p>
            <p className="text-[10px] text-[#9B8E94] mt-0.5">{product.price}</p>
          </div>
        </div>

        {/* 購入ボタン */}
        {(product.amazon_url || product.rakuten_url) && (
          <div className="flex gap-1.5 mt-3">
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
  )
}
