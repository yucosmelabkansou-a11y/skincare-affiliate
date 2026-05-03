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
    <section
      className="px-5 pt-10 pb-12 space-y-12"
      style={{
        background: 'var(--bg-cream)',
        borderTop: '1px solid var(--line-soft)',
      }}
    >
      {CATEGORY_GROUPS.map((group) => (
        <div key={group.groupId}>
          {/* エディトリアル風セクションヘッダー */}
          <div className="flex flex-col items-center gap-2.5 mb-7">
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontWeight: 300,
                fontSize: 12,
                letterSpacing: '0.42em',
                color: 'var(--gold-deep)',
                textTransform: 'uppercase',
              }}
            >
              {groupLabelEn[group.groupId] ?? group.groupLabel}
            </span>
            <span
              className="block"
              style={{ width: 1, height: 26, background: 'var(--gold)' }}
              aria-hidden
            />
            <span
              style={{
                fontFamily: 'var(--font-jp)',
                fontWeight: 500,
                fontSize: 12,
                letterSpacing: '0.4em',
                color: 'var(--ink-soft)',
              }}
            >
              {group.groupLabel}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
            {group.categories.map((cat) => {
              const isSelected = selectedId === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => onChange(cat.id)}
                  className="flex flex-col items-center gap-2 py-4 px-1 text-center transition-all active:scale-95"
                  style={
                    isSelected
                      ? {
                          background: '#fff',
                          border: '1px solid var(--gold)',
                          color: 'var(--gold-deep)',
                          boxShadow: '0 14px 30px -22px oklch(0.5 0.06 70 / .35)',
                        }
                      : {
                          background: '#fff',
                          border: '1px solid var(--line-soft)',
                          color: 'var(--ink-mute)',
                        }
                  }
                >
                  <CategoryIcon name={cat.iconKey} size={20} />
                  <span
                    style={{
                      fontFamily: 'var(--font-jp)',
                      fontWeight: isSelected ? 600 : 500,
                      fontSize: 10.5,
                      letterSpacing: '0.08em',
                      lineHeight: 1.3,
                      color: isSelected ? 'var(--ink)' : 'var(--ink-soft)',
                    }}
                  >
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
