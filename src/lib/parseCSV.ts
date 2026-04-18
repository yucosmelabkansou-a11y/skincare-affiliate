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
        ] = fields
        const raw = image_filename?.trim() ?? ''
        const normalized = raw.includes('.') ? raw : raw + '.jpg'
        return {
          id: id.trim(),
          category: category?.trim() ?? '',
          name: name.trim(),
          brand: brand.trim(),
          price: price?.trim() ?? '',
          // タグ区切り文字: カンマ(,) と中黒(・) の両方に対応（CSV入力のバラツキを吸収）
          tags: tagsRaw.trim().split(/[,・]/).map((t) => t.trim()).filter((t) => t !== ''),
          review: review.trim(),
          image_filename: normalized,
          amazon_url: amazon_url?.trim() ?? '',
          rakuten_url: rakuten_url?.trim() ?? '',
          is_pick: is_pick?.trim() === 'true',
          instagram_url: instagram_url?.trim() ?? '',
          is_yun_must: is_yun_must?.trim() === 'true',
          must_tags: (must_tags_raw ?? '').trim().split(',').map((t) => t.trim()).filter((t) => t !== ''),
          yun_must_comment: yun_must_comment?.trim() ?? '',
        }
      })
  } catch (error) {
    console.error('Failed to load products.csv:', error)
    return []
  }
}
