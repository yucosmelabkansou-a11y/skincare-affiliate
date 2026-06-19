// 診断結果ページの「あなた専用ピックアップ」セクション
// 3商品カードを表示。各カードは画像・ブランド・商品名・"なぜあなたに" コピー・Amazon/楽天 リンク

import type { SkinType } from '@/lib/diagnosis'
import { selectMatchedProducts, buildWhyForYouCopy, type MatchedPick } from '@/lib/diagnosis-matcher'
import { getProducts } from '@/lib/parseCSV'
import type { ReactNode } from 'react'
import type { Product } from '@/types/product'
import SectionLabel from './SectionLabel'
import AffiliateLink from './AffiliateLink'

// 診断結果ページ経由のアフィリエイトクリックを GA4 で識別するための page_type 値
const PAGE_TYPE = 'diagnosis_result'

const SLOT_LABELS: Record<string, string> = {
  '化粧水': '推し化粧水',
  '乳液':   '推し乳液',
  'クリーム': '推しクリーム',
  '美容液': '推し美容液',
  '洗顔':   '推し洗顔',
}

const USE_GUIDE: Partial<Record<SkinType, Partial<Record<string, string>>>> = {
  aging: {
    '49': 'まず1本なら：夜の化粧水でハリ感の土台づくりに',
    '9': '朝に使うなら：スキンケア後のUV乳液として時短に',
    '71': '悩みを攻めるなら：朝晩の美容液ステップに追加',
  },
  oily: {
    '233': 'まず1本なら：朝晩の化粧水で軽くうるおい補給',
    '222': '夜に使うなら：保湿を抜かず、寝る前のジェルマスクに',
    '227': '悩みを攻めるなら：毛穴・皮脂が気になる部分中心に',
  },
}

const FIRST_BUY_CTA: Partial<Record<SkinType, { productId: string; title: string; copy: string }>> = {
  aging: {
    productId: '9',
    title: 'まず1つ買うなら：朝のUV乳液',
    copy: '毎朝使う日焼け止めを美容UV乳液に置き換えると、時短しながら大人肌のくすみ感も自然に補正できます。',
  },
  oily: {
    productId: '233',
    title: 'まず1つ買うなら：軽い薬用化粧水',
    copy: '皮脂が気になる肌こそ保湿を抜かないのが大事。朝晩のベースに、さっぱり使える1本から始めやすいです。',
  },
}

type Props = {
  skinType: SkinType
  variant?: 'full' | 'compact' | 'top3'
  // top3 variant の見出しを上書きしたいとき（例：敏感肌ページの「ゆん厳選」）
  heading?: { en: string; jp: string }
  // top3 variant の説明文を上書きしたいとき
  lead?: ReactNode
}

export default function DiagnosisProductMatch({ skinType, variant = 'full', heading, lead }: Props) {
  const products = getProducts()
  const picks = selectMatchedProducts(products, skinType, 3)
  const isCompact = variant === 'compact'

  // ファーストビュー直下の「この肌タイプにおすすめTOP3」セクション
  if (variant === 'top3') {
    if (picks.length === 0) return null
    return (
      <section className="px-5 pt-2 pb-12">
        <SectionLabel
          en={heading?.en ?? 'Best 3 for You'}
          jp={heading?.jp ?? 'この肌タイプにおすすめTOP3'}
        />

        <p
          className="text-center mx-auto mb-4"
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
          {lead ?? (
            <>
              200近いアイテムから、元化粧品研究・商品企画ゆんが
              <br />
              あなたの肌タイプに厳選した3点です
            </>
          )}
        </p>

        <AffiliateDisclosure />

        <div className="space-y-4 max-w-md mx-auto">
          {picks.map((pick, i) => (
            <MatchCard
              key={pick.product.id}
              pick={pick}
              skinType={skinType}
              compact={false}
              placement="top3"
              rank={i + 1}
            />
          ))}
        </div>
      </section>
    )
  }

  if (!isCompact && picks.length === 0) {
    return null
  }

  return (
    <section className="px-5 pb-12">
      <SectionLabel
        en={isCompact ? 'First Pick' : 'Product Match'}
        jp={isCompact ? 'まず1つ買うなら' : '揃えるならこの3点'}
      />

      <p
        className="text-center mx-auto mb-7"
        style={{
          fontFamily: 'var(--font-jp-alt)',
          fontWeight: 400,
          fontSize: 12,
          lineHeight: 1.95,
          letterSpacing: '0.06em',
          color: 'var(--ink-soft)',
          maxWidth: isCompact ? '30ch' : '32ch',
        }}
      >
        {isCompact ? (
          <>
            診断直後に迷わないように、
            <br />
            いちばん始めやすい1点だけ
          </>
        ) : (
          <>
            診断結果と肌タイプから、200近いアイテムの中から
            <br />
            元化粧品研究・商品企画ゆんが厳選した3点
          </>
        )}
      </p>

      {isCompact && (
        <FirstBuyCallout
          skinType={skinType}
          products={products}
        />
      )}

      {!isCompact && (
        <div className="space-y-4 max-w-md mx-auto">
          {picks.map((pick) => (
            <MatchCard
              key={pick.product.id}
              pick={pick}
              skinType={skinType}
              compact={false}
              placement="product_match"
            />
          ))}
        </div>
      )}
    </section>
  )
}

function FirstBuyCallout({
  skinType,
  products,
}: {
  skinType: SkinType
  products: ReturnType<typeof getProducts>
}) {
  const cta = FIRST_BUY_CTA[skinType]
  if (!cta) return null

  const product = products.find((p) => p.id === cta.productId)
  if (!product) return null

  return (
    <aside
      className="max-w-md mx-auto mb-5 overflow-hidden"
      style={{
        background: 'oklch(0.985 0.012 80)',
        border: '1px solid var(--gold)',
        borderRadius: 4,
      }}
      aria-label="まず1つ買うなら"
    >
      <div className="px-4 py-4">
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 10,
            letterSpacing: '0.28em',
            color: 'var(--gold-deep)',
            textTransform: 'uppercase',
            marginBottom: 7,
          }}
        >
          Start Here
        </p>
        <h3
          style={{
            fontFamily: 'var(--font-jp)',
            fontWeight: 600,
            fontSize: 13,
            lineHeight: 1.6,
            letterSpacing: '0.08em',
            color: 'var(--ink)',
            marginBottom: 8,
          }}
        >
          {cta.title}
        </h3>
        <p
          style={{
            fontFamily: 'var(--font-jp-alt)',
            fontWeight: 400,
            fontSize: 11.5,
            lineHeight: 1.75,
            letterSpacing: '0.05em',
            color: 'var(--ink-soft)',
          }}
        >
          {cta.copy}
        </p>
      </div>

      <div
        className="flex border-t"
        style={{ borderColor: 'var(--line-soft)' }}
      >
        {product.amazon_url && (
          <AffiliateLink
            href={product.amazon_url}
            store="amazon"
            productId={product.id}
            productName={product.name}
            brand={product.brand}
            placement="first_buy_cta"
            pageType={PAGE_TYPE}
            skinType={skinType}
            className="flex-1 py-3 text-center transition-opacity hover:opacity-70"
            style={{
              fontFamily: 'var(--font-jp)',
              fontWeight: 600,
              fontSize: 11,
              letterSpacing: '0.16em',
              color: 'var(--ink)',
              background: '#fff',
              borderRight: product.rakuten_url ? '1px solid var(--line-soft)' : 'none',
            }}
          >
            Amazonで見る →
          </AffiliateLink>
        )}
        {product.rakuten_url && (
          <AffiliateLink
            href={product.rakuten_url}
            store="rakuten"
            productId={product.id}
            productName={product.name}
            brand={product.brand}
            placement="first_buy_cta"
            pageType={PAGE_TYPE}
            skinType={skinType}
            className="flex-1 py-3 text-center transition-opacity hover:opacity-70"
            style={{
              fontFamily: 'var(--font-jp)',
              fontWeight: 600,
              fontSize: 11,
              letterSpacing: '0.16em',
              color: 'var(--ink)',
              background: '#fff',
            }}
          >
            楽天で見る →
          </AffiliateLink>
        )}
      </div>
    </aside>
  )
}

function MatchCard({
  pick,
  skinType,
  compact,
  placement,
  rank,
}: {
  pick: MatchedPick
  skinType: SkinType
  compact: boolean
  placement: string
  rank?: number
}) {
  const { product, slot, isOverride } = pick
  const slotLabel = SLOT_LABELS[slot] ?? slot
  const why = buildWhyForYouCopy(pick, skinType)
  const useGuide = USE_GUIDE[skinType]?.[product.id]

  return (
    <article
      className="relative overflow-hidden"
      style={{
        background: '#fff',
        border: '1px solid var(--line-soft)',
        borderRadius: 4,
      }}
    >
      {/* スロットラベル（推し○○）。TOP3 では順位バッジを兼ねる */}
      <div
        className="absolute top-0 left-0 flex items-center gap-1.5 px-3 py-1 z-10"
        style={{
          background: 'var(--gold)',
          color: '#fff',
          fontFamily: 'var(--font-jp)',
          fontWeight: 500,
          fontSize: 10,
          letterSpacing: '0.18em',
        }}
      >
        {rank && (
          <span
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontWeight: 400,
              fontSize: 12,
              letterSpacing: '0.04em',
            }}
          >
            No.{rank}
          </span>
        )}
        {rank && <span style={{ opacity: 0.6 }}>｜</span>}
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

      <div className={`flex gap-4 ${compact ? 'p-4 pt-8' : 'p-5 pt-9'}`}>
        {/* 商品画像 */}
        <div
          className="flex-shrink-0 relative"
          style={{
            width: compact ? 84 : 100,
            height: compact ? 84 : 100,
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
              fontSize: compact ? 12.5 : 13,
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
        className={`${compact ? 'px-4' : 'px-5'} pb-3`}
        style={{
          fontFamily: 'var(--font-jp-alt)',
          fontWeight: 400,
          fontSize: compact ? 11 : 11.5,
          lineHeight: 1.7,
          letterSpacing: '0.05em',
          color: 'var(--gold-deep)',
        }}
      >
        {why}
      </div>

      {useGuide && (
        <div
          className={`${compact ? 'px-4' : 'px-5'} pb-3`}
          style={{
            fontFamily: 'var(--font-jp-alt)',
            fontWeight: 400,
            fontSize: compact ? 10.5 : 11,
            lineHeight: 1.65,
            letterSpacing: '0.05em',
            color: 'var(--ink-soft)',
          }}
        >
          {useGuide}
        </div>
      )}

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

      {/* Amazon・楽天 ボタン（スマホで押しやすい大きめサイズ） */}
      <BuyButtons product={product} placement={placement} skinType={skinType} />

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

// Amazon・楽天 の大きめ購入ボタン（スマホで押しやすい高さ・タップ領域）
// Amazon = ゴールド塗り、楽天 = 白地ゴールド文字。淡ピンク・ベージュの世界観に合わせる。
function BuyButtons({
  product,
  placement,
  skinType,
}: {
  product: Product
  placement: string
  skinType: SkinType
}) {
  const hasBoth = Boolean(product.amazon_url) && Boolean(product.rakuten_url)

  const baseStyle = {
    minHeight: 52,
    fontFamily: 'var(--font-jp)',
    fontWeight: 600,
    fontSize: 13,
    letterSpacing: '0.12em',
  } as const

  return (
    <div
      className="flex border-t"
      style={{ borderColor: 'var(--line-soft)' }}
    >
      {product.amazon_url && (
        <AffiliateLink
          href={product.amazon_url}
          store="amazon"
          productId={product.id}
          productName={product.name}
          brand={product.brand}
          placement={placement}
          pageType={PAGE_TYPE}
          skinType={skinType}
          className="flex-1 flex items-center justify-center gap-1 transition-opacity hover:opacity-80 active:opacity-70"
          style={{
            ...baseStyle,
            color: '#fff',
            background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-deep) 100%)',
            borderRight: hasBoth ? '1px solid #fff' : 'none',
          }}
        >
          Amazonで見る <span aria-hidden>→</span>
        </AffiliateLink>
      )}
      {product.rakuten_url && (
        <AffiliateLink
          href={product.rakuten_url}
          store="rakuten"
          productId={product.id}
          productName={product.name}
          brand={product.brand}
          placement={placement}
          pageType={PAGE_TYPE}
          skinType={skinType}
          className="flex-1 flex items-center justify-center gap-1 transition-opacity hover:opacity-80 active:opacity-70"
          style={{
            ...baseStyle,
            color: 'var(--gold-deep)',
            background: '#fff',
          }}
        >
          楽天で見る <span aria-hidden>→</span>
        </AffiliateLink>
      )}
    </div>
  )
}

// PR・アフィリエイトリンクを含む旨の表記（景表法・ステマ規制対応）
function AffiliateDisclosure() {
  return (
    <p
      className="text-center mx-auto mb-6"
      style={{
        fontFamily: 'var(--font-jp-alt)',
        fontWeight: 400,
        fontSize: 10.5,
        lineHeight: 1.7,
        letterSpacing: '0.04em',
        color: 'var(--ink-mute)',
        maxWidth: '34ch',
      }}
    >
      ※本ページにはPR・アフィリエイトリンクが含まれます。
      <br />
      購入で当サイトが収益を得る場合がありますが、商品はゆんが肌タイプ目線で選んでいます。
    </p>
  )
}
