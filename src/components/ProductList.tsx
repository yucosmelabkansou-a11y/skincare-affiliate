'use client'

import { useState, useMemo } from 'react'
import { Product } from '@/types/product'
import { CATEGORIES, CATEGORY_GROUPS } from '@/lib/categories'
import SearchBar from './SearchBar'
import ActiveFilterChips from './ActiveFilterChips'
import FilterDrawer from './FilterDrawer'
import ProductCard from './ProductCard'
import ProductModal from './ProductModal'
import CategoryNav from './CategoryNav'
import WeeklyPicks from './WeeklyPicks'

type Props = {
  products: Product[]
}

export default function ProductList({ products }: Props) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedCategoryId, setSelectedCategoryId] = useState('all')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  // トップ表示かどうか（カテゴリー・検索・タグ未選択）
  const isTopView = selectedCategoryId === 'all' && searchQuery === '' && selectedTags.length === 0

  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    products.forEach((p) => p.tags.forEach((t) => tagSet.add(t)))
    return Array.from(tagSet)
  }, [products])

  const filtered = useMemo(() => {
    const category = CATEGORIES.find((c) => c.id === selectedCategoryId)
    return products.filter((p) => {
      if (category && category.tags.length > 0) {
        if (!p.tags.some((t) => category.tags.includes(t))) return false
      }
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase()
        const match =
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.review.toLowerCase().includes(q)
        if (!match) return false
      }
      if (selectedTags.length > 0) {
        if (!selectedTags.every((st) => p.tags.includes(st))) return false
      }
      return true
    })
  }, [products, searchQuery, selectedTags, selectedCategoryId])

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const handleCategoryChange = (id: string) => {
    setSelectedCategoryId(id)
    setSelectedTags([])
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
        <div className="px-4 py-3 space-y-2">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onOpenDrawer={() => setIsDrawerOpen(true)}
          />
          <ActiveFilterChips
            tags={selectedTags}
            onRemove={(tag) => setSelectedTags((prev) => prev.filter((t) => t !== tag))}
            onReset={() => setSelectedTags([])}
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

      <FilterDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        allTags={allTags}
        selectedTags={selectedTags}
        onToggle={toggleTag}
      />

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  )
}
