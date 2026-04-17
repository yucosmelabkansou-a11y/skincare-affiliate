export type Product = {
  id: string
  category: string
  name: string
  brand: string
  price: string
  tags: string[]
  review: string
  image_filename: string
  amazon_url: string
  rakuten_url: string
  is_pick: boolean
  instagram_url: string  // 例: https://www.instagram.com/p/SHORTCODE/
  is_yun_must: boolean
  must_tags: string[]    // 'common' | 'dry' | 'oily' | 'combination' | 'sensitive' | 'aging' | 'normal' | 'pores' 等
  yun_must_comment: string  // ゆん的コメント (MUST商品のみ)
}
