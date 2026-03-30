'use client'

import { CATEGORY_GROUPS } from '@/lib/categories'

type Props = {
  selectedId: string
  onChange: (id: string) => void
}

export default function CategoryNav({ selectedId, onChange }: Props) {
  return (
    <section className="px-4 pb-4 space-y-4">
      {CATEGORY_GROUPS.map((group) => (
        <div key={group.groupId}>
          <h2 className="text-sm font-bold text-[#343A40] mb-2">{group.groupLabel}</h2>
          <div className="grid grid-cols-4 gap-2">
            {group.categories.map((cat) => {
              const isSelected = selectedId === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => onChange(cat.id)}
                  className={`flex flex-col items-center gap-1 py-3 px-1 rounded-2xl text-center transition-all active:scale-95 ${
                    isSelected
                      ? 'bg-[#4DB6AC] text-white shadow-sm'
                      : 'bg-[#F8F9FA] text-[#6C757D] hover:bg-[#E0F2F1] hover:text-[#4DB6AC]'
                  }`}
                >
                  <span className="text-xl leading-none">{cat.emoji}</span>
                  <span className="text-[10px] font-medium leading-tight">{cat.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </section>
  )
}
