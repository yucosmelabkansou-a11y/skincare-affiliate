'use client'

import { useState, useMemo, useEffect } from 'react'
import { sendGAEvent } from '@next/third-parties/google'
import { Product } from '@/types/product'
import { CATEGORIES, CATEGORY_GROUPS } from '@/lib/categories'
import SearchBar from './SearchBar'
import ProductCard from './ProductCard'
import ProductModal from './ProductModal'
import CategoryNav from './CategoryNav'
import WeeklyPicks from './WeeklyPicks'
import CategoryIcon from './icons/CategoryIcon'

type Props = {
  products: Product[]
}

// 初期描画を絞ってDOM/HTMLサイズを軽くする（モバイルの体感速度・hydration負荷対策）。
// 残りは「もっと見る」で段階的に追加描画する。
const INITIAL_VISIBLE = 24
const LOAD_MORE_STEP = 24

export default function ProductList({ products }: Props) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState('all')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE)

  // 診断結果ページなどからの内部リンク（/?cat=sunscreen など）で初期フィルターを反映
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const cat = params.get('cat')
    const q = params.get('q')
    let applied = false
    if (q) {
      setSearchQuery(q)
      applied = true
    }
    if (cat && CATEGORIES.some((c) => c.id === cat)) {
      setSelectedCategoryId(cat)
      applied = true
    }
    if (applied) {
      requestAnimationFrame(() => {
        document
          .getElementById('product-list')
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    }
  }, [])

  // 同一ページ内（トップの「迷ったらここから」カードなど）からのフィルター切替
  useEffect(() => {
    const onSetFilter = (e: Event) => {
      const detail = (e as CustomEvent).detail as { cat?: string; q?: string } | undefined
      let applied = false
      if (detail?.q !== undefined) {
        setSearchQuery(detail.q)
        applied = true
      }
      if (detail?.cat && CATEGORIES.some((c) => c.id === detail.cat)) {
        setSelectedCategoryId(detail.cat)
        if (detail.q === undefined) setSearchQuery('')
        applied = true
      }
      if (applied) {
        requestAnimationFrame(() => {
          document
            .getElementById('product-list')
            ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        })
      }
    }
    window.addEventListener('yun:set-filter', onSetFilter)
    return () => window.removeEventListener('yun:set-filter', onSetFilter)
  }, [])

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
      // 検索対象: 商品名 / ブランド / カテゴリ / 悩みタグ / 主要成分 / 商品説明
      if (searchQuery.trim() !== '') {
        const keywords = searchQuery.toLowerCase().split(/\s+/).filter(Boolean)
        const searchTarget = [
          p.name,
          p.brand,
          p.category,
          ...p.tags,
          ...(p.key_ingredients || []),
          p.review,
        ].join(' ').toLowerCase()
        if (!keywords.every((kw) => searchTarget.includes(kw))) return false
      }
      return true
    })
  }, [products, searchQuery, selectedCategoryId])

  // 検索・カテゴリーが変わったら初期件数に戻す
  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE)
  }, [searchQuery, selectedCategoryId])

  const visible = filtered.slice(0, visibleCount)
  const hasMore = filtered.length > visibleCount

  const handleCategoryChange = (id: string) => {
    setSelectedCategoryId(id)
    setSearchQuery('')
    sendGAEvent('event', 'filter_apply', {
      filter_type: 'category',
      filter_value: id,
    })
  }

  const handleProductOpen = (product: Product) => {
    setSelectedProduct(product)
    sendGAEvent('event', 'product_modal_open', {
      product_id: product.id,
      product_name: product.name,
      brand: product.brand,
      category: product.category,
    })
  }

  const handleSearchCommit = (query: string) => {
    sendGAEvent('event', 'search_submit', {
      search_term: query,
      result_count: filtered.length,
      category: selectedCategoryId,
    })
  }

  return (
    <>
      {/* ===== トップビュー（Pick + カテゴリーグリッド） ===== */}
      {isTopView && (
        <>
          <WeeklyPicks products={products} onSelect={handleProductOpen} />
          <CategoryNav selectedId={selectedCategoryId} onChange={handleCategoryChange} />
        </>
      )}

      {/* ===== 検索 / フィルター ===== */}
      <div id="product-list" className={`${isTopView ? '' : 'sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-[#F2EAEF]'} scroll-mt-2`}>
        {/* カテゴリー選択中: グループ別コンパクトタブ */}
        {!isTopView && (
          <div className="px-4 pt-3 pb-1 space-y-2">
            {CATEGORY_GROUPS.map((group) => (
              <div key={group.groupId}>
                <p className="text-[10px] text-[#9B8E94] mb-1 tracking-wider font-serif italic">{group.groupLabel}</p>
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5">
                  {group.categories.map((cat) => {
                    const isSelected = selectedCategoryId === cat.id
                    return (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryChange(cat.id)}
                        className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-[#C2185B] text-white'
                            : 'bg-[#FAF6F3] text-[#6C757D] hover:bg-[#FDF2F6]'
                        }`}
                      >
                        <CategoryIcon name={cat.iconKey} size={14} />
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
            onSearchCommit={handleSearchCommit}
          />
        </div>
      </div>

      {/* ===== 商品グリッド ===== */}
      <main className="px-4 py-4">
        {!isTopView && (
          <p className="text-xs text-[#9B8E94] mb-3 font-serif italic tracking-wider">
            {filtered.length} items
          </p>
        )}

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-[10px] tracking-[0.4em] text-[#D4829E] font-serif mb-2">NO RESULTS</div>
            <p className="font-serif text-xl text-[#4A3F45] mb-1">見つかりませんでした</p>
            <p className="text-sm text-[#9B8E94]">キーワードやカテゴリーを変えてみてください</p>
          </div>
        ) : (
          <>
            {isTopView && (
              <div className="text-center mb-5 mt-2">
                <p className="text-[10px] tracking-[0.4em] text-[#D4829E] font-serif">ALL ITEMS</p>
                <div className="mt-1 text-[10px] tracking-[0.5em] text-[#D4829E]" aria-hidden>
                  · · ·
                </div>
                <h2 className="font-serif text-lg text-[#4A3F45] mt-1 tracking-wider">
                  すべてのアイテム
                </h2>
              </div>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {visible.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => handleProductOpen(product)}
                />
              ))}
            </div>

            {hasMore && (
              <div className="flex flex-col items-center mt-8 mb-2">
                <button
                  type="button"
                  onClick={() => {
                    const next = visibleCount + LOAD_MORE_STEP
                    setVisibleCount(next)
                    sendGAEvent('event', 'load_more', {
                      category: selectedCategoryId,
                      shown: Math.min(next, filtered.length),
                      total: filtered.length,
                    })
                  }}
                  className="inline-flex items-center justify-center gap-3 px-10 transition-all hover:bg-[var(--gold)] hover:text-white"
                  style={{
                    fontFamily: 'var(--font-jp)',
                    fontWeight: 500,
                    fontSize: 13,
                    letterSpacing: '0.24em',
                    color: 'var(--ink)',
                    border: '1px solid var(--gold)',
                    background: '#fff',
                    minHeight: 52,
                    borderRadius: 4,
                  }}
                >
                  もっと見る
                  <span aria-hidden>＋</span>
                </button>
                <p
                  className="mt-2.5"
                  style={{
                    fontFamily: 'var(--font-jp-alt)',
                    fontSize: 11,
                    letterSpacing: '0.06em',
                    color: 'var(--ink-mute)',
                  }}
                >
                  {visible.length} / {filtered.length} 件を表示中
                </p>
              </div>
            )}
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
