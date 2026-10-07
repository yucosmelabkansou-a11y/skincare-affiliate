'use client'

import { useState, useMemo, useEffect, useSyncExternalStore } from 'react'
import { sendGAEvent } from '@next/third-parties/google'
import { Product } from '@/types/product'
import { CATEGORIES } from '@/lib/categories'
import SearchBar from './SearchBar'
import ProductCard from './ProductCard'
import ProductModal from './ProductModal'
import CategoryNav from './CategoryNav'

type Props = {
  products: Product[]
}

// 初期描画を絞ってDOM/HTMLサイズを軽くする（モバイルの体感速度・hydration負荷対策）。
// 残りは「もっと見る」で段階的に追加描画する。
const INITIAL_VISIBLE = 24
const LOAD_MORE_STEP = 24

// URLの初期値はhydration後に読み、サーバーの初回HTMLと一致させる。
const subscribeToInitialSearch = () => () => {}
const getInitialSearch = () => window.location.search
const getServerSearch = () => null

export default function ProductList({ products }: Props) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState('all')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE)

  const initialSearch = useSyncExternalStore(subscribeToInitialSearch, getInitialSearch, getServerSearch)
  const [initialSearchApplied, setInitialSearchApplied] = useState(false)

  // 初期URLは一度だけ取り込む。以後の検索・カテゴリー操作は従来のstateを使う。
  if (initialSearch !== null && !initialSearchApplied) {
    setInitialSearchApplied(true)
    const params = new URLSearchParams(initialSearch)
    const cat = params.get('cat')
    const q = params.get('q')
    if (q) setSearchQuery(q)
    if (cat && CATEGORIES.some((c) => c.id === cat)) setSelectedCategoryId(cat)
  }

  // 診断結果ページなどからのリンクでは、初期フィルターを反映した一覧へ移動。
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const cat = params.get('cat')
    if (params.get('q') || (cat && CATEGORIES.some((c) => c.id === cat))) {
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

  // 条件の変化と同じ描画で表示件数を戻し、古い件数での中間描画を避ける。
  const [previousFilter, setPreviousFilter] = useState({ searchQuery, selectedCategoryId })
  if (previousFilter.searchQuery !== searchQuery || previousFilter.selectedCategoryId !== selectedCategoryId) {
    setPreviousFilter({ searchQuery, selectedCategoryId })
    setVisibleCount(INITIAL_VISIBLE)
  }

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
      <section className="catalog-section" aria-label="商品一覧">
      <div className="catalog-heading"><h2>すべてのアイテム</h2><p>{filtered.length} items</p></div>
      <div className="catalog-layout">
        <aside className="catalog-filters" aria-label="商品カテゴリー">
          <CategoryNav selectedId={selectedCategoryId} onChange={handleCategoryChange} />
        </aside>
        <div className="catalog-results">
          <div id="product-list" className="catalog-search">
            <SearchBar value={searchQuery} onChange={setSearchQuery} onSearchCommit={handleSearchCommit} />
          </div>
      {/* ===== 商品グリッド ===== */}
      <div className="catalog-content">
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
            <div className="product-grid">
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
                    letterSpacing: '0.04em',
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
                    fontSize: 13,
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
      </div>
        </div>
      </div>
      </section>

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  )
}
