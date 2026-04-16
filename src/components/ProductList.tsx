'use client'

import { useState, useMemo } from 'react'
import { Product } from '@/types/product'
import { CATEGORIES, CATEGORY_GROUPS } from '@/lib/categories'
import SearchBar from './SearchBar'
import ProductCard from './ProductCard'
import ProductModal from './ProductModal'
import CategoryNav from './CategoryNav'
import WeeklyPicks from './WeeklyPicks'

type Props = {
  products: Product[]
}

export default function ProductList({ products }: Props) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState('all')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  // トップ表示かどうか（カテゴリー・検索未選択）
  const isTopView = selectedCategoryId === 'all' && searchQuery === ''

  const filtered = useMemo(() => {
    const category = CATEGORIES.find((c) => c.id === selectedCategoryId)
    return products.filter((p) => {
      // カテゴリーフィルター
      if (category && category.tags.length > 0) {
        const matchByTag = p.tags.some((t) => category.tags.includes(t))
        const matchByCategory = p.category === category.label
        if (!matchByTag && !matchByCategory) return false
      }
      // スペース区切りAND検索（全キーワードにマッチ）
      if (searchQuery.trim() !== '') {
        const keywords = searchQuery.toLowerCase().split(/\s+/).filter(Boolean)
        const searchTarget = [
          p.name,
          p.brand,
          p.category,
          ...p.tags,
          p.review,
        ].join(' ').toLowerCase()
        if (!keywords.every((kw) => searchTarget.includes(kw))) return false
      }
      return true
    })
  }, [products, searchQuery, selectedCategoryId])

  const handleCategoryChange = (id: string) => {
    setSelectedCategoryId(id)
    setSearchQuery('')
  }

  return (
    <>
      {/* ===== トップビュー（Pick + カテゴリーグリッド） ===== */}
      {isTopView && (
        <>
          <WeeklyPicks products={products} onSelect={setSelectedProduct} />
          <div className="border-t border-[#E9ECEF]" />
          <CategoryNav selectedId={selectedCategoryId} onChange={handleCategoryChange} />
          <div className="border-t border-[#E9ECEF]" />
        </>
      )}

      {/* ===== 検索 / フィルター ===== */}
      <div className={`${isTopView ? '' : 'sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-[#E9ECEF]'} `}>
        {/* カテゴリー選択中: グループ別コンパクトタブ */}
        {!isTopView && (
          <div className="px-4 pt-3 pb-1 space-y-2">
            {CATEGORY_GROUPS.map((group) => (
              <div key={group.groupId}>
                <p className="text-[10px] text-gray-400 mb-1">{group.groupLabel}</p>
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5">
                  {group.categories.map((cat) => {
                    const isSelected = selectedCategoryId === cat.id
                    return (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryChange(cat.id)}
                        className={`shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-[#4DB6AC] text-white'
                            : 'bg-[#F8F9FA] text-[#6C757D] hover:bg-[#E0F2F1]'
                        }`}
                      >
                        <span>{cat.emoji}</span>
                        <span>{cat.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="px-4 py-3">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
          />
        </div>
      </div>

      {/* ===== 商品グリッド ===== */}
      <main className="px-4 py-4">
        {!isTopView && (
          <p className="text-xs text-[#6C757D] mb-3">{filtered.length} 件</p>
        )}

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-5xl mb-4">🔍</span>
            <p className="text-[#343A40] font-semibold mb-1">商品が見つかりませんでした</p>
            <p className="text-sm text-[#6C757D]">キーワードやカテゴリーを変えてみてください</p>
          </div>
        ) : (
          <>
            {isTopView && (
              <h2 className="text-base font-bold text-[#343A40] mb-3">すべてのアイテム</h2>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filtered.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => setSelectedProduct(product)}
                />
              ))}
            </div>
          </>
        )}
      </main>

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  )
}
