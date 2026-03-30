'use client'

type Props = {
  tags: string[]
  onRemove: (tag: string) => void
  onReset: () => void
}

export default function ActiveFilterChips({ tags, onRemove, onReset }: Props) {
  if (tags.length === 0) return null

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide flex-1">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 shrink-0 px-3 py-1 text-xs font-medium bg-[#E0F2F1] text-[#4DB6AC] rounded-full"
          >
            {tag}
            <button
              onClick={() => onRemove(tag)}
              className="hover:text-[#3da89e] leading-none"
              aria-label={`${tag}を削除`}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <button
        onClick={onReset}
        className="shrink-0 text-xs text-gray-400 hover:text-gray-600 whitespace-nowrap"
      >
        すべてリセット
      </button>
    </div>
  )
}
