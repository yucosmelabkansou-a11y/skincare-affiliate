export type Product = {
  id: string
  category: string
  name: string
  brand: string
  price: string
  tags: string[]            // 悩みカテゴリ（乾燥/毛穴/シミ・くすみ 等、12カテゴリから1〜2個）
  review: string
  image_filename: string
  amazon_url: string
  rakuten_url: string
  is_pick: boolean
  instagram_url: string     // 例: https://www.instagram.com/p/SHORTCODE/
  is_yun_must: boolean
  must_tags: string[]       // 'common' | 'dry' | 'oily' | 'combination' | 'sensitive' | 'aging' | 'normal' | 'pores' 等
  yun_must_comment: string  // ゆん的コメント (MUST商品のみ)
  key_ingredients: string[] // 主要成分（セラミド/ナイアシンアミド/レチノール 等、1〜2個）
}
