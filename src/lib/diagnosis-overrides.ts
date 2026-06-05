// Product Match の編集者上書き定義
// 肌タイプ × カテゴリ枠ごとに「ここはこの商品で固定」と指定する。
// 商品は products.csv の id で参照し、見つからなければ algorithm 任せに自動フォールバック。
//
// クロスカテゴリ表示OK：例えば oily:乳液 → クリームカテゴリの商品 を割り当てると、
// 表示は "乳液" 枠だが商品自体はクリームの product として表示される。

import type { SkinType } from './diagnosis'

export type SlotKey = '化粧水' | '乳液' | 'クリーム' | '美容液' | '洗顔'

/**
 * `${SkinType}:${SlotKey}` をキーに、固定したい products.csv の id を値に持つマップ。
 * 編集者の専門判断で algorithm スコアより優先される。
 */
export const PRODUCT_MATCH_OVERRIDES: Record<string, string> = {
  // 乾燥肌
  'dry:化粧水': '52',   // dプログラム モイストケア ローション MB【医薬部外品】
  'dry:乳液':   '230',  // トゥヴェール ナノエマルジョン ディープ

  // 脂性肌
  'oily:化粧水': '233', // メラノCC 薬用しみ対策 美白化粧水（新規登録・画像/直リンク要追加）
  'oily:乳液':   '222', // エリクシール ルフレ バランシング おやすみマスク（クリーム→乳液枠）
  'oily:美容液': '227', // メラノCC プレミアム美容液

  // 混合肌
  'combination:乳液':   '57',   // トゥヴェール ナノエマルジョン プラス
  'combination:クリーム': '219', // アヌア セラミド パンテノール モイスチャー バリア クリーム

  // 敏感肌
  'sensitive:乳液': '57', // トゥヴェール ナノエマルジョン プラス（敏感肌専用設計）

  // エイジング肌
  'aging:化粧水': '49',   // エリクシール リフトモイスト ローション SP III（SP II は CSV 未登録のため当面 III で）
  'aging:乳液':   '9',    // エリクシール デーケアレボリューション トーンアップ SP+ aa（UV乳液→乳液枠）
  'aging:美容液': '71',   // ソフィーナiP 薬用 シワ改善 泡セラム（導入美容液→美容液枠）
  // クリーム枠は非表示（ユーザー指定）。化粧水・乳液・美容液の3点で構成。

  // 普通肌
  'normal:化粧水': '229', // 肌ラボ 白潤プレミアム化粧水
  'normal:乳液':   '231', // トゥヴェール ナノエマルジョン（無印）
  'normal:美容液': '77',  // オバジC10セラム
}

export function getOverrideId(skinType: SkinType, slot: SlotKey): string | undefined {
  return PRODUCT_MATCH_OVERRIDES[`${skinType}:${slot}`]
}
