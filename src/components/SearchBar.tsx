'use client'

type Props = {
  value: string
  onChange: (v: string) => void
  onOpenDrawer: () => void
}

export default function SearchBar({ value, onChange, onOpenDrawer }: Props) {
  return (
    <div className="flex items-center gap-2 w-full">
      <div className="relative flex-1">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
          />
        </svg>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="「毛穴」「レチノール」など気になるキーワードで検索"
          className="w-full pl-9 pr-3 py-2.5 text-sm border border-[#E9ECEF] rounded-xl bg-white text-[#343A40] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4DB6AC]/40"
        />
      </div>
      <button
        onClick={onOpenDrawer}
        className="shrink-0 px-4 py-2.5 text-sm font-medium bg-[#4DB6AC] text-white rounded-xl hover:bg-[#3da89e] active:scale-95 transition-all"
      >
        絞り込み
      </button>
    </div>
  )
}
