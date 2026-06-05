// 診断結果ページの「あなた専用ピックアップ」セクション
// 3商品カードを表示。各カードは画像・ブランド・商品名・"なぜあなたに" コピー・Amazon/楽天 リンク

import type { SkinType } from '@/lib/diagnosis'
import { selectMatchedProducts, buildWhyForYouCopy, type MatchedPick } from '@/lib/diagnosis-matcher'
import { getProducts } from '@/lib/parseCSV'
import SectionLabel from './SectionLabel'
import AffiliateLink from './AffiliateLink'

const SLOT_LABELS: Record<string, string> = {
  '化粧水': '推し化粧水',
  '乳液':   '推し乳液',
  'クリーム': '推しクリーム',
  '美容液': '推し美容液',
  '洗顔':   '推し洗顔',
}

export default function DiagnosisProductMatch({ skinType }: { skinType: SkinType }) {
  const products = getProducts()
  const picks = selectMatchedProducts(products, skinType, 3)

  if (picks.length === 0) {
    return null
  }

  return (
    <section className="px-5 pb-12">
      <SectionLabel en="Product Match" jp="あなた専用ピックアップ" />

      <p
        className="text-center mx-auto mb-7"
        style={{
          fontFamily: 'var(--font-jp-alt)',
          fontWeight: 400,
          fontSize: 12,
          lineHeight: 1.95,
          letterSpacing: '0.06em',
          color: 'var(--ink-soft)',
          maxWidth: '32ch',
        }}
      >
        診断結果と肌タイプから、200近いアイテムの中から
        <br />
        元化粧品研究・商品企画ゆんが厳選した3点
      </p>

      <div className="space-y-4 max-w-md mx-auto">
        {picks.map((pick) => (
          <MatchCard key={pick.product.id} pick={pick} skinType={skinType} />
        ))}
      </div>
    </section>
  )
}

function MatchCard({ pick, skinType }: { pick: MatchedPick; skinType: SkinType }) {
  const { product, slot, isOverride } = pick
  const slotLabel = SLOT_LABELS[slot] ?? slot
  const why = buildWhyForYouCopy(pick, skinType)

  return (
    <article
      className="relative overflow-hidden"
      style={{
        background: '#fff',
        border: '1px solid var(--line-soft)',
        borderRadius: 4,
      }}
    >
      {/* スロットラベル（推し○○） */}
      <div
        className="absolute top-0 left-0 px-3 py-1 z-10"
        style={{
          background: 'var(--gold)',
          color: '#fff',
          fontFamily: 'var(--font-jp)',
          fontWeight: 500,
          fontSize: 10,
          letterSpacing: '0.18em',
        }}
      >
        {slotLabel}
      </div>

      {/* MUST バッジ（is_yun_must の商品のみ） */}
      {product.is_yun_must && (
        <span
          className="absolute top-2 right-2 px-2 py-0.5 z-10"
          style={{
            background:
              'linear-gradient(135deg, oklch(0.78 0.10 30) 0%, oklch(0.62 0.14 25) 100%)',
            color: '#fff',
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: 9,
            letterSpacing: '0.15em',
            borderRadius: 999,
          }}
        >
          ★ MUST
        </span>
      )}

      <div className="flex gap-4 p-5 pt-9">
        {/* 商品画像 */}
        <div
          className="flex-shrink-0 relative"
          style={{
            width: 100,
            height: 100,
            background: 'oklch(0.97 0.008 80)',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          {product.image_filename && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`/images/${product.image_filename}`}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
          )}
        </div>

        {/* 商品情報 */}
        <div className="flex-1 min-w-0">
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontWeight: 300,
              fontSize: 10,
              letterSpacing: '0.18em',
              color: 'var(--ink-mute)',
              marginBottom: 3,
            }}
          >
            {product.brand}
          </p>
          <h3
            className="line-clamp-2"
            style={{
              fontFamily: 'var(--font-jp)',
              fontWeight: 500,
              fontSize: 13,
              lineHeight: 1.5,
              letterSpacing: '0.04em',
              color: 'var(--ink)',
              marginBottom: 6,
            }}
          >
            {product.name}
          </h3>
          <p
            style={{
              fontFamily: 'var(--font-jp-alt)',
              fontWeight: 400,
              fontSize: 11,
              letterSpacing: '0.06em',
              color: 'var(--ink-mute)',
            }}
          >
            {product.price}
          </p>
        </div>
      </div>

      {/* なぜあなたに */}
      <div
        className="px-5 pb-3"
        style={{
          fontFamily: 'var(--font-jp-alt)',
          fontWeight: 400,
          fontSize: 11.5,
          lineHeight: 1.7,
          letterSpacing: '0.05em',
          color: 'var(--gold-deep)',
        }}
      >
        {why}
      </div>

      {/* ゆんコメント（is_yun_must の場合のみ） */}
      {product.is_yun_must && product.yun_must_comment && (
        <div
          className="px-5 pb-3"
          style={{
            fontFamily: 'var(--font-jp-alt)',
            fontWeight: 400,
            fontSize: 11,
            lineHeight: 1.75,
            letterSpacing: '0.05em',
            color: 'var(--ink-soft)',
            fontStyle: 'normal',
          }}
        >
          <span style={{ color: 'var(--gold-deep)', marginRight: 4 }}>★</span>
          {product.yun_must_comment}
        </div>
      )}

      {/* Amazon・楽天 ボタン */}
      <div
        className="flex gap-0 border-t"
        style={{ borderColor: 'var(--line-soft)' }}
        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
      >
        {product.amazon_url && (
          <AffiliateLink
            href={product.amazon_url}
            store="amazon"
            productId={product.id}
            productName={product.name}
            brand={product.brand}
            placement="product_match"
            skinType={skinType}
            className="flex-1 py-3 text-center transition-opacity hover:opacity-70"
            style={{
              fontFamily: 'var(--font-jp)',
              fontWeight: 500,
              fontSize: 11,
              letterSpacing: '0.18em',
              color: 'var(--ink)',
              borderRight: product.rakuten_url ? '1px solid var(--line-soft)' : 'none',
            }}
          >
            Amazon →
          </AffiliateLink>
        )}
        {product.rakuten_url && (
          <AffiliateLink
            href={product.rakuten_url}
            store="rakuten"
            productId={product.id}
            productName={product.name}
            brand={product.brand}
            placement="product_match"
            skinType={skinType}
            className="flex-1 py-3 text-center transition-opacity hover:opacity-70"
            style={{
              fontFamily: 'var(--font-jp)',
              fontWeight: 500,
              fontSize: 11,
              letterSpacing: '0.18em',
              color: 'var(--ink)',
            }}
          >
            楽天 →
          </AffiliateLink>
        )}
      </div>

      {/* 編集者厳選マーク（debug 用に minimal、本番でも残す） */}
      {isOverride && (
        <div
          className="absolute bottom-1 right-2"
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: 9,
            letterSpacing: '0.15em',
            color: 'var(--ink-mute)',
            opacity: 0.5,
          }}
        >
          editor&apos;s pick
        </div>
      )}
    </article>
  )
}
