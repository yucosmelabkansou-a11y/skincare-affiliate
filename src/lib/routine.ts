// 肌タイプ × 悩み から最適スキンケアルーティンを自動生成
// 元化粧品研究員ゆん監修ロジック

import type { Product } from '@/types/product'
import type { SkinType, Concern } from './diagnosis'

// ========== ルーティンステップ定義 ==========
export type RoutineStep = {
  step: number
  category: string         // CSV上のカテゴリー名
  label: string            // 表示用日本語名
  labelEn: string          // 英語ラベル
  timing?: 'night' | 'morning' | 'both'  // 朝夜の使用区分
  optional?: boolean       // ない場合スキップしてOK
}

// 標準的なスキンケア5〜6ステップ
export const ROUTINE_STEPS: RoutineStep[] = [
  { step: 1, category: 'クレンジング', label: 'クレンジング', labelEn: 'CLEANSE', timing: 'night' },
  { step: 2, category: '洗顔', label: '洗顔', labelEn: 'WASH', timing: 'both' },
  { step: 3, category: '化粧水', label: '化粧水', labelEn: 'TONER', timing: 'both' },
  { step: 4, category: '美容液', label: '美容液', labelEn: 'SERUM', timing: 'both' },
  { step: 5, category: '乳液', label: '乳液 / クリーム', labelEn: 'MOISTURIZE', timing: 'both' },
  { step: 6, category: '日焼け止め', label: '日焼け止め', labelEn: 'PROTECT', timing: 'morning' },
]

// 肌タイプ別に「相性のいいタグ」を定義（スコアリング用）
const SKIN_TYPE_KEYWORDS: Record<SkinType, string[]> = {
  dry: ['乾燥', 'セラミド', '保湿', 'バリア機能', 'バリア強化', 'バリア', 'うるおい', '高保湿', 'もっとしっとり'],
  oily: ['毛穴', '皮脂', 'テカリ', 'さっぱり', '崩れ', 'ニキビ', 'クレイ', '炭酸'],
  combination: ['バランス', 'ナイアシンアミド', '部分', 'マスク移り', '混合'],
  sensitive: ['敏感肌', '低刺激', '無添加', 'アルコールフリー', 'ノンケミカル', '肌荒れ', 'ヘパリン'],
  aging: ['エイジング', 'シワ', 'ハリ', 'ツヤ', 'レチノール', 'ナイアシンアミド', 'ペプチド', 'たるみ'],
  normal: [],
}

// 悩み → 関連キーワード
const CONCERN_KEYWORDS: Record<Concern, string[]> = {
  spots: ['シミ', '美白', 'ビタミンC', 'コウジ酸', 'トラネキサム酸', 'メラノ', 'ブライトニング'],
  wrinkles: ['シワ', 'シワ改善', 'レチノール', 'ハリ', 'リフト', 'ナイアシンアミド'],
  pores: ['毛穴', 'ザラつき', '角質', '皮脂', 'クレイ', 'ピール', 'AHA', 'BHA'],
  dryness: ['乾燥', '保湿', 'セラミド', 'うるおい', 'ヒアルロン酸'],
  acne: ['ニキビ', '皮脂', '吹き出物', 'グリチルリチン', 'サリチル酸'],
  redness: ['敏感肌', '赤み', 'ヒリヒリ', '低刺激', '無添加', 'ヘパリン', '肌荒れ'],
}

// ========== スコアリング ==========
function scoreProduct(
  product: Product,
  skinType: SkinType,
  concern: Concern | undefined,
): number {
  let score = 0
  const tagsStr = product.tags.join(' ') + ' ' + product.name + ' ' + product.review

  // MUSTタグによるブースト（最強）
  if (product.is_yun_must) {
    if (product.must_tags.includes('common')) score += 100
    if (product.must_tags.includes(skinType)) score += 80
    if (concern && product.must_tags.includes(concern)) score += 70
  }

  // 肌タイプキーワードのマッチ
  const skinKws = SKIN_TYPE_KEYWORDS[skinType] ?? []
  for (const kw of skinKws) {
    if (tagsStr.includes(kw)) score += 8
  }

  // 悩みキーワードのマッチ
  if (concern) {
    const concernKws = CONCERN_KEYWORDS[concern] ?? []
    for (const kw of concernKws) {
      if (tagsStr.includes(kw)) score += 12
    }
  }

  // 既存Pickもボーナス
  if (product.is_pick) score += 5

  // Amazonリンクが付いている方を優先（即購入できるため）
  if (product.amazon_url) score += 3

  return score
}

// ========== カテゴリー判定（柔軟マッチング） ==========
function matchesCategory(product: Product, stepCategory: string): boolean {
  if (product.category === stepCategory) return true
  // 「乳液」ステップは「乳液」「クリーム」両方OK
  if (stepCategory === '乳液' && (product.category === '乳液' || product.category === 'クリーム')) {
    return true
  }
  return false
}

// ========== メインAPI ==========
export type RoutineResult = {
  step: RoutineStep
  product: Product | null
  score: number
}

export function getRoutineForType(
  products: Product[],
  skinType: SkinType,
  concern?: Concern,
): RoutineResult[] {
  return ROUTINE_STEPS.map((step) => {
    // このステップに該当する商品を抽出
    const candidates = products.filter((p) => matchesCategory(p, step.category))

    if (candidates.length === 0) {
      return { step, product: null, score: 0 }
    }

    // スコアリングして最高得点を選ぶ
    const scored = candidates
      .map((p) => ({ product: p, score: scoreProduct(p, skinType, concern) }))
      .sort((a, b) => b.score - a.score)

    const best = scored[0]
    return { step, product: best.product, score: best.score }
  })
}
