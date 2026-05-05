// 記事（コラム + Q&A）読み込み用ユーティリティ
// content/column/*.md と content/qa/*.md を SSG 用に走査

import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

export type ArticleType = 'column' | 'qa'

export type CtaTarget = 'diagnosis' | 'products' | 'both' | 'none'

export type ArticleFrontmatter = {
  title: string
  description?: string
  publishedAt: string  // YYYY-MM-DD
  updatedAt?: string
  tags?: string[]      // 例: ['乾燥','セラミド']
  hero?: string        // 画像パス（任意）
  noteUrl?: string     // 元のnote URL（参考保存）
  liveDate?: string    // Q&A用：インスタライブの日付
  midCta?: CtaTarget   // 記事中盤CTA（既定: 自動判定）
  endCta?: CtaTarget   // 記事末尾CTA（既定: 自動判定）
}

export type Article = ArticleFrontmatter & {
  type: ArticleType
  slug: string
  body: string         // Markdown原文
}

const ROOT = path.join(process.cwd(), 'content')

// YAML が Date オブジェクトとして返してくる項目を文字列(YYYY-MM-DD)に正規化
function dateStr(v: unknown): string | undefined {
  if (!v) return undefined
  if (v instanceof Date) {
    const y = v.getFullYear()
    const m = String(v.getMonth() + 1).padStart(2, '0')
    const d = String(v.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }
  return String(v)
}

function readDir(type: ArticleType): Article[] {
  const dir = path.join(ROOT, type)
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((file) => {
      const full = path.join(dir, file)
      const raw = fs.readFileSync(full, 'utf-8')
      const { data, content } = matter(raw)
      const slug = file.replace(/\.md$/, '')
      const fm = data as Record<string, unknown>
      return {
        type,
        slug,
        body: content,
        title: String(fm.title || ''),
        description: fm.description ? String(fm.description) : undefined,
        publishedAt: dateStr(fm.publishedAt) || '',
        updatedAt: dateStr(fm.updatedAt),
        liveDate: dateStr(fm.liveDate),
        tags: Array.isArray(fm.tags) ? fm.tags.map(String) : undefined,
        hero: fm.hero ? String(fm.hero) : undefined,
        noteUrl: fm.noteUrl ? String(fm.noteUrl) : undefined,
        midCta: parseCtaTarget(fm.midCta),
        endCta: parseCtaTarget(fm.endCta),
      } as Article
    })
}

function parseCtaTarget(v: unknown): CtaTarget | undefined {
  if (typeof v !== 'string') return undefined
  if (v === 'diagnosis' || v === 'products' || v === 'both' || v === 'none') return v
  return undefined
}

// frontmatter > タグ自動判定 > 既定値 の優先順で記事の CTA 戦略を解決する
export function resolveCta(article: Article): { mid: CtaTarget; end: CtaTarget } {
  const tags = new Set(article.tags || [])
  const productHeavy = ['おすすめ', '商品紹介', 'プチプラ', 'デパコス', 'ベスコス', 'スキンケア紹介']
    .some((t) => tags.has(t))
  const howto = ['基礎ケア', '成分', '順番', 'ノウハウ', '使い方']
    .some((t) => tags.has(t))

  // タグ自動判定の既定
  let autoMid: CtaTarget = 'none'
  let autoEnd: CtaTarget = 'both'
  if (productHeavy) {
    autoMid = 'diagnosis'
    autoEnd = 'products'
  } else if (howto) {
    autoMid = 'none'
    autoEnd = 'products'
  }

  return {
    mid: article.midCta ?? autoMid,
    end: article.endCta ?? autoEnd,
  }
}

// 本文中盤の H2 直前で2分割。H2 が3個未満なら null（mid CTA を出さない）
export function splitBodyAtMiddleH2(body: string): { before: string; after: string } | null {
  const matches = Array.from(body.matchAll(/^## .+$/gm))
  if (matches.length < 3) return null
  const midIdx = matches[Math.floor(matches.length / 2)].index
  if (midIdx == null) return null
  return {
    before: body.slice(0, midIdx).trimEnd(),
    after: body.slice(midIdx),
  }
}

export function getAllArticles(type: ArticleType): Article[] {
  return readDir(type).sort(
    (a, b) => (b.publishedAt || '').localeCompare(a.publishedAt || ''),
  )
}

export function getArticle(type: ArticleType, slug: string): Article | null {
  const all = readDir(type)
  return all.find((a) => a.slug === slug) || null
}

export function getAllSlugs(type: ArticleType): string[] {
  return readDir(type).map((a) => a.slug)
}
