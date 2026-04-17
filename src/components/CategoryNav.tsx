'use client'

import { CATEGORY_GROUPS } from '@/lib/categories'
import CategoryIcon from './icons/CategoryIcon'

type Props = {
  selectedId: string
  onChange: (id: string) => void
}

// 見出しを英語化するマッピング（エディトリアル感）
const groupLabelEn: Record<string, string> = {
  item: 'BY ITEM',
  concern: 'BY CONCERN',
}

export default function CategoryNav({ selectedId, onChange }: Props) {
  return (
    <section className="px-4 pb-6 pt-2 space-y-6">
      {CATEGORY_GROUPS.map((group) => (
        <div key={group.groupId}>
          {/* エディトリアル風セクションヘッダー */}
          <div className="text-center mb-4">
            <p className="text-[10px] tracking-[0.4em] text-[#D4829E] font-serif">
              {groupLabelEn[group.groupId] ?? group.groupLabel}
            </p>
            <div
              className="mt-1 text-[10px] tracking-[0.5em] text-[#D4829E]"
              aria-hidden
            >
              · · ·
            </div>
            <h2 className="font-serif text-base text-[#4A3F45] mt-1 tracking-wider">
              {group.groupLabel}
            </h2>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {group.categories.map((cat) => {
              const isSelected = selectedId === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => onChange(cat.id)}
                  className={`flex flex-col items-center gap-1.5 py-3.5 px-1 rounded-2xl text-center transition-all active:scale-95 ${
                    isSelected
                      ? 'text-white shadow-sm'
                      : 'bg-[#FAF6F3] text-[#9B8E94] hover:bg-[#FDF2F6] hover:text-[#C2185B]'
                  }`}
                  style={
                    isSelected
                      ? {
                          background:
                            'linear-gradient(135deg, #D4829E 0%, #C2185B 100%)',
                        }
                      : undefined
                  }
                >
                  <CategoryIcon name={cat.iconKey} size={22} />
                  <span className="text-[10px] font-medium leading-tight">
                    {cat.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </section>
  )
}
