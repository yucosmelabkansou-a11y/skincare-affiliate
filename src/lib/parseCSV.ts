import fs from 'fs'
import path from 'path'
import { Product } from '@/types/product'

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      result.push(current)
      current = ''
    } else {
      current += char
    }
  }
  result.push(current)
  return result
}

export function getProducts(): Product[] {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'products.csv')
    const content = fs.readFileSync(filePath, 'utf-8')
    const lines = content.trim().split('\n')

    const dataLines = lines.slice(1)

    return dataLines
      .filter((line) => line.trim() !== '')
      .map((line) => {
        const fields = parseCSVLine(line)
        const [
          id, category, name, brand, price, tagsRaw, review,
          image_filename, amazon_url, rakuten_url,
          is_pick, instagram_url,
          is_yun_must, must_tags_raw, yun_must_comment,
          key_ingredients_raw,
        ] = fields
        const raw = image_filename?.trim() ?? ''
        const normalized = raw.includes('.') ? raw : raw + '.jpg'
        // 悩みタグの区切り：カテゴリ名「シミ・くすみ」「皮脂・テカリ」「角質・ザラつき」が
        // 中黒を含むので、カンマ区切りを優先。カンマ無し時のみ中黒/読点で分割（旧データ互換）
        const tagsTrimmed = (tagsRaw ?? '').trim()
        const tags = tagsTrimmed.includes(',')
          ? tagsTrimmed.split(',').map((t) => t.trim()).filter(Boolean)
          : tagsTrimmed.split(/[、]/).map((t) => t.trim()).filter(Boolean)
        return {
          id: id.trim(),
          category: category?.trim() ?? '',
          name: name.trim(),
          brand: brand.trim(),
          price: price?.trim() ?? '',
          tags,
          review: review.trim(),
          image_filename: normalized,
          amazon_url: amazon_url?.trim() ?? '',
          rakuten_url: rakuten_url?.trim() ?? '',
          is_pick: is_pick?.trim() === 'true',
          instagram_url: instagram_url?.trim() ?? '',
          is_yun_must: is_yun_must?.trim() === 'true',
          must_tags: (must_tags_raw ?? '').trim().split(',').map((t) => t.trim()).filter((t) => t !== ''),
          yun_must_comment: yun_must_comment?.trim() ?? '',
          key_ingredients: (key_ingredients_raw ?? '')
            .trim()
            .split(',')
            .map((t) => t.trim())
            .filter((t) => t !== '' && t !== '-'),
        }
      })
  } catch (error) {
    console.error('Failed to load products.csv:', error)
    return []
  }
}
