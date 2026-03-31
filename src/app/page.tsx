import { getProducts } from '@/lib/parseCSV'
import ProductList from '@/components/ProductList'

export default function Home() {
  const products = getProducts()

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <header className="px-4 pt-6 pb-4">
        <h1 className="text-xl font-bold text-[#343A40]">yun.skincare_</h1>
        <p className="text-sm text-[#6C757D] mt-1 leading-relaxed">
          投稿で紹介しているスキンケア、ベースメイクを探せるサイトです
        </p>
        <p className="text-[10px] text-gray-400 mt-2">
          ※本サイトはアフィリエイトリンクを含みます
        </p>
      </header>

      <ProductList products={products} />
    </div>
  )
}
