export type Category = {
  id: string
  label: string
  emoji: string
  tags: string[]  // いずれかのタグにマッチすれば表示
}

export type CategoryGroup = {
  groupId: string
  groupLabel: string
  categories: Category[]
}

export const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    groupId: 'item',
    groupLabel: 'アイテムから探す',
    categories: [
      { id: 'all',         label: 'すべて',     emoji: '✨', tags: [] },
      { id: 'toner',       label: '化粧水',     emoji: '🧴', tags: ['化粧水'] },
      { id: 'emulsion',    label: '乳液',       emoji: '🥛', tags: ['乳液'] },
      { id: 'cream',       label: 'クリーム',   emoji: '🫙', tags: ['クリーム'] },
      { id: 'serum',       label: '美容液',     emoji: '💎', tags: ['美容液', 'セラム'] },
      { id: 'sunscreen',   label: '日焼け止め', emoji: '☀️', tags: ['日焼け止め', 'UV'] },
      { id: 'base',        label: '下地',       emoji: '🖌️', tags: ['下地'] },
    ],
  },
  {
    groupId: 'concern',
    groupLabel: '悩みから探す',
    categories: [
      { id: 'moisture',    label: '乾燥・保湿',     emoji: '💧', tags: ['乾燥', 'セラミド', '保湿', 'バリア機能'] },
      { id: 'pores',       label: '毛穴・ニキビ',   emoji: '🫧', tags: ['毛穴', 'ニキビ', 'ナイアシンアミド', '皮脂'] },
      { id: 'aging',       label: 'エイジングケア', emoji: '🌿', tags: ['エイジングケア', 'レチノール', 'シワ', 'ハリ'] },
      { id: 'brightening', label: '美白・くすみ',   emoji: '🌟', tags: ['美白', 'くすみ', 'ビタミンC'] },
      { id: 'sensitive',   label: '敏感肌',         emoji: '🌸', tags: ['敏感肌', 'ノンケミカル', '無添加'] },
    ],
  },
]

// ProductList などで使いやすいようにフラット配列も export
export const CATEGORIES: Category[] = CATEGORY_GROUPS.flatMap((g) => g.categories)
