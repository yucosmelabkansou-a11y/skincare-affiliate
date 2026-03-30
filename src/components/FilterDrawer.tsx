'use client'

type Props = {
  isOpen: boolean
  onClose: () => void
  allTags: string[]
  selectedTags: string[]
  onToggle: (tag: string) => void
}

export default function FilterDrawer({ isOpen, onClose, allTags, selectedTags, onToggle }: Props) {
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-xl transition-transform duration-300 ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        <div className="px-5 pb-6 pt-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-[#343A40]">タグで絞り込む</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1"
              aria-label="閉じる"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto pb-2">
            {allTags.map((tag) => {
              const isSelected = selectedTags.includes(tag)
              return (
                <button
                  key={tag}
                  onClick={() => onToggle(tag)}
                  className={`px-3 py-1.5 text-sm rounded-full border transition-all ${
                    isSelected
                      ? 'bg-[#E0F2F1] border-[#4DB6AC] text-[#4DB6AC] font-medium'
                      : 'bg-white border-[#E9ECEF] text-[#6C757D] hover:border-[#4DB6AC]'
                  }`}
                >
                  {tag}
                </button>
              )
            })}
          </div>

          <button
            onClick={onClose}
            className="mt-4 w-full py-3 bg-[#4DB6AC] text-white text-sm font-medium rounded-xl hover:bg-[#3da89e] active:scale-[0.99] transition-all"
          >
            この条件で絞り込む
          </button>
        </div>
      </div>
    </>
  )
}
