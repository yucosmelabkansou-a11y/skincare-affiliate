'use client'
import { CATEGORY_GROUPS } from '@/lib/categories'
type Props = { selectedId: string; onChange: (id: string) => void }
export default function CategoryNav({ selectedId, onChange }: Props) {
  return <div className="category-nav">
    {CATEGORY_GROUPS.map(group => <div className="category-group" key={group.groupId}>
      <p>{group.groupLabel}</p>
      <div>{group.categories.map(cat => <button type="button" key={cat.id} aria-pressed={selectedId === cat.id} onClick={() => onChange(cat.id)}>{cat.label}</button>)}</div>
    </div>)}
  </div>
}
