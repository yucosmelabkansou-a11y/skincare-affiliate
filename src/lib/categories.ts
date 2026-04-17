import type { IconName } from '@/components/icons/CategoryIcon'

export type Category = {
  id: string
  label: string
  iconKey: IconName   // ミニマル線SVG
  tags: string[]      // いずれかのタグにマッチすれば表示
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
      { id: 'all',         label: 'すべて',       iconKey: 'all',        tags: [] },
      { id: 'toner',       label: '化粧水',       iconKey: 'toner',      tags: ['化粧水'] },
      { id: 'emulsion',    label: '乳液',         iconKey: 'emulsion',   tags: ['乳液'] },
      { id: 'cream',       label: 'クリーム',     iconKey: 'cream',      tags: ['クリーム'] },
      { id: 'serum',       label: '美容液',       iconKey: 'serum',      tags: ['美容液', '導入美容液', 'セラム'] },
      { id: 'sunscreen',   label: '日焼け止め',   iconKey: 'sunscreen',  tags: ['日焼け止め', 'UV'] },
      { id: 'base',        label: '化粧下地',     iconKey: 'base',       tags: ['下地'] },
      { id: 'facewash',    label: '洗顔',         iconKey: 'facewash',   tags: ['洗顔'] },
      { id: 'cleansing',   label: 'クレンジング', iconKey: 'cleansing',  tags: ['クレンジング'] },
    ],
  },
  {
    groupId: 'concern',
    groupLabel: '悩みから探す',
    categories: [
      { id: 'moisture',    label: '乾燥・保湿',     iconKey: 'moisture',    tags: ['乾燥', 'セラミド', '保湿', 'バリア機能'] },
      { id: 'pores',       label: '毛穴・ニキビ',   iconKey: 'pores',       tags: ['毛穴', 'ニキビ', 'ナイアシンアミド', '皮脂', 'ざらつき', 'ごわつき'] },
      { id: 'aging',       label: 'エイジングケア', iconKey: 'aging',       tags: ['エイジングケア', 'レチノール', 'シワ', 'ハリ'] },
      { id: 'brightening', label: '美白・くすみ',   iconKey: 'brightening', tags: ['美白', 'くすみ', 'ビタミンC', 'シミ'] },
      { id: 'sensitive',   label: '敏感肌',         iconKey: 'sensitive',   tags: ['敏感肌', 'ノンケミカル', '無添加', '肌荒れ'] },
    ],
  },
]

// ProductList などで使いやすいようにフラット配列も export
export const CATEGORIES: Category[] = CATEGORY_GROUPS.flatMap((g) => g.categories)
