// 肌診断結果ごとに「あなた専用ピックアップ」3商品を選出するマッチャー
// preview_product_match.py のロジックを TypeScript に移植したもの。

import type { Product } from '@/types/product'
import type { SkinType } from './diagnosis'
import { resultTypes } from './diagnosis'
import { PRODUCT_MATCH_OVERRIDES, type SlotKey } from './diagnosis-overrides'

const SKIN_TYPE_TAGS: Record<SkinType, string[]> = {
  dry:         ['乾燥', '保湿', 'バリア機能', 'セラミド'],
  oily:        ['毛穴', '皮脂・テカリ', 'ニキビ', 'ナイアシンアミド'],
  combination: ['毛穴', '乾燥', 'ナイアシンアミド'],
  sensitive:   ['敏感肌', 'バリア機能', '肌荒れ', 'セラミド'],
  aging:       ['エイジングケア', 'シワ', 'たるみ', 'ハリ', 'レチノール'],
  normal:      ['ヒアルロン酸', 'ナイアシンアミド', 'ツヤ'],
}

// products.csv のカテゴリ表記 → 5枠のいずれかに正規化
const CATEGORY_TO_SLOT: Record<string, SlotKey> = {
  '化粧水':     '化粧水',
  '乳液':       '乳液',
  'クリーム':   'クリーム',
  '美容液':     '美容液',
  '導入美容液': '美容液',
  'アイクリーム': 'クリーム',
  '洗顔':       '洗顔',
  '洗顔料':     '洗顔',
}

function bucketOf(category: string): SlotKey | null {
  return CATEGORY_TO_SLOT[category] ?? null
}

export type MatchedPick = {
  slot: SlotKey
  product: Product
  score: number
  reasons: string[]
  isOverride: boolean
}

function scoreProduct(p: Product, skinType: SkinType): { score: number; reasons: string[] } {
  let score = 0
  const reasons: string[] = []

  // 肌タイプ関連タグ（一致1個につき +3pt）
  const matchedTags = SKIN_TYPE_TAGS[skinType].filter((t) => p.tags.includes(t))
  if (matchedTags.length > 0) {
    score += 3 * matchedTags.length
    reasons.push(...matchedTags)
  }

  // 推奨成分が key_ingredients/review に含まれる（一致1個につき +2pt）
  const ingredients = resultTypes[skinType].recommendedIngredients
  const haystack = `${p.key_ingredients.join(',')} ${p.review}`
  const matchedIngs = ingredients.filter((i) => haystack.includes(i))
  if (matchedIngs.length > 0) {
    score += 2 * matchedIngs.length
    reasons.push(...matchedIngs)
  }

  // 厳選フラグ
  if (p.is_yun_must) score += 1
  if (p.is_pick) score += 0.5

  return { score, reasons }
}

/**
 * 肌タイプに対して 3 商品を選出する。
 * - スキンケアカテゴリ（化粧水/乳液/クリーム/美容液/洗顔）から最大3個（カテゴリ被りなし）
 * - PRODUCT_MATCH_OVERRIDES で指定された (skinType, slot) は強制的に含める
 * - 残り枠は algorithm スコア上位で埋める（カテゴリ被りなし）
 */
export function selectMatchedProducts(
  products: Product[],
  skinType: SkinType,
  maxPicks = 3,
): MatchedPick[] {
  const idIndex = new Map(products.map((p) => [p.id, p]))

  // カテゴリ別のアルゴリズム上位（被りを防ぐ）
  const skincareTop = new Map<SlotKey, MatchedPick>()
  for (const p of products) {
    const slot = bucketOf(p.category)
    if (!slot) continue
    const { score, reasons } = scoreProduct(p, skinType)
    if (score <= 0) continue
    const existing = skincareTop.get(slot)
    if (!existing || score > existing.score) {
      skincareTop.set(slot, { slot, product: p, score, reasons, isOverride: false })
    }
  }

  // 強制枠（オーバーライド）
  const forcedSlots = new Map<SlotKey, MatchedPick>()
  const slotKeys: SlotKey[] = ['化粧水', '乳液', 'クリーム', '美容液', '洗顔']
  for (const slot of slotKeys) {
    const overrideId = PRODUCT_MATCH_OVERRIDES[`${skinType}:${slot}`]
    if (!overrideId) continue
    const target = idIndex.get(overrideId)
    if (!target) continue // CSV にない id ならスキップ（algorithm にフォールバック）
    const { score, reasons } = scoreProduct(target, skinType)
    forcedSlots.set(slot, { slot, product: target, score, reasons, isOverride: true })
  }

  // 結果を組み立て：強制枠を確保 → 残りを algorithm 上位で埋める
  const result: MatchedPick[] = Array.from(forcedSlots.values())
  const remaining = maxPicks - result.length
  if (remaining > 0) {
    const candidates = Array.from(skincareTop.values())
      .filter((m) => !forcedSlots.has(m.slot))
      .sort((a, b) => b.score - a.score)
    result.push(...candidates.slice(0, remaining))
  }

  return result.sort((a, b) => b.score - a.score).slice(0, maxPicks)
}

// 肌タイプごとの「ベネフィットの締め」フレーズ（薬機法に配慮し効能断定を避ける）
const SKIN_TYPE_BENEFIT: Record<SkinType, string> = {
  dry:         'うるおいを抱え込む肌印象へ',
  oily:        'テカリ・毛穴の目立ちにくい肌印象へ',
  combination: '水分と皮脂のバランスを整えたい方に',
  sensitive:   'ゆらぎがちな肌をやさしく守りたい方に',
  aging:       'ハリ・ツヤのある肌印象をサポート',
  normal:      'いまの良い状態をキープしたい方に',
}

/**
 * 「なぜあなたに？」一行コピーをマッチした要素から動的生成。
 * 成分マッチがあれば「成分配合。〜印象へ」、なければ悩みタグ＋ベネフィットで締める。
 * 例: 「レチノール配合。ハリ・ツヤのある肌印象をサポート」
 */
export function buildWhyForYouCopy(pick: MatchedPick, skinType: SkinType): string {
  const benefit = SKIN_TYPE_BENEFIT[skinType]
  const ingredientSet = new Set(resultTypes[skinType].recommendedIngredients)

  // reasons には「悩みタグ」と「推奨成分」が混ざっているので分離する
  const matchedIngredients = pick.reasons.filter((r) => ingredientSet.has(r)).slice(0, 2)

  if (matchedIngredients.length > 0) {
    return `${matchedIngredients.join('・')}配合。${benefit}`
  }

  // 成分マッチが無ければ悩みタグを使う
  const concern = pick.reasons.find((r) => !ingredientSet.has(r))
  if (concern) {
    return `${concern}が気になる方へ。${benefit}`
  }

  return `${resultTypes[skinType].badge}の方に。${benefit}`
}
