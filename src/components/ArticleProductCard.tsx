// 記事本文内の商品紹介カード（画像＋Amazon／楽天ボタン）
// Markdown のフェンスドコードブロック ```product から描画する。
//   ```product
//   name: 商品名
//   desc: 一言説明（任意）
//   image: 画像URL（任意・主に楽天サムネイル）
//   amazon: AmazonアフィリエイトURL（任意）
//   rakuten: 楽天アフィリエイトURL（任意）
//   ```

type ProductFields = {
  name?: string
  desc?: string
  image?: string
  amazon?: string
  rakuten?: string
}

function parseProduct(raw: string): ProductFields {
  const fields: ProductFields = {}
  for (const line of raw.trim().split('\n')) {
    const i = line.indexOf(':')
    if (i <= 0) continue
    const key = line.slice(0, i).trim().toLowerCase()
    const value = line.slice(i + 1).trim()
    if (
      key === 'name' ||
      key === 'desc' ||
      key === 'image' ||
      key === 'amazon' ||
      key === 'rakuten'
    ) {
      fields[key] = value
    }
  }
  return fields
}

export default function ArticleProductCard({ raw }: { raw: string }) {
  const { name, desc, image, amazon, rakuten } = parseProduct(raw)
  if (!name) return null

  return (
    <div className="not-prose my-5 flex gap-3 p-3 bg-white border border-[#F2EAEF] rounded-2xl">
      {image && (
        <a
          href={rakuten || amazon || '#'}
          target="_blank"
          rel="nofollow sponsored noopener"
          className="shrink-0 block w-[88px] h-[88px] rounded-lg overflow-hidden bg-[#FAF6F3]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={name}
            loading="lazy"
            width={88}
            height={88}
            className="w-full h-full object-contain"
          />
        </a>
      )}

      <div className="flex flex-col min-w-0 flex-1">
        <p className="text-[13px] font-semibold text-[#4A3F45] leading-snug m-0">
          🛒 {name}
        </p>

        {desc && (
          <p className="text-[11.5px] text-[#6B5E64] leading-relaxed mt-1 mb-0">
            {desc}
          </p>
        )}

        <div className="flex flex-wrap gap-1.5 mt-3">
          {amazon && (
            <a
              href={amazon}
              target="_blank"
              rel="nofollow sponsored noopener"
              className="text-center px-3 py-1 text-[11px] font-medium text-[#4A3F45] border border-[#E8C7D4] hover:bg-[#FDF2F6] rounded-full transition-colors tracking-wider no-underline"
            >
              Amazonで見る
            </a>
          )}
          {rakuten && (
            <a
              href={rakuten}
              target="_blank"
              rel="nofollow sponsored noopener"
              className="text-center px-3 py-1 text-[11px] font-medium text-[#4A3F45] border border-[#E8C7D4] hover:bg-[#FDF2F6] rounded-full transition-colors tracking-wider no-underline"
            >
              楽天で見る
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
