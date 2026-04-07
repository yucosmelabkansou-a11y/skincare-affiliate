import { getProducts } from '@/lib/parseCSV'
import ProductList from '@/components/ProductList'

export default function Home() {
  const products = getProducts()

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <header className="px-4 pt-6 pb-4">
        <a
          href="https://www.instagram.com/yun.skincare_"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-xl font-bold text-[#343A40] hover:text-[#4DB6AC] transition-colors"
        >
          yun.skincare_
        </a>
        <p className="text-sm text-[#6C757D] mt-2 leading-relaxed">
          投稿で紹介したスキンケア・ベースメイクをまとめてます🌿<br />
          ゆんが実際に使ってよかったオススメアイテムだけを厳選。<br />
          Amazon・楽天のリンクからすぐに購入できます。
        </p>
        <div className="text-[10px] text-gray-400 mt-2 space-y-0.5">
          <p>※本サイトはアフィリエイトリンクを含みます</p>
          <p>※一部ブランド様よりご提供頂いた商品も含みます。</p>
          <p>※韓国コスメ、デパコスなどの一部商品はブランド公式サイトからの購入を推奨しています</p>
        </div>
      </header>

      <ProductList products={products} />
    </div>
  )
}
