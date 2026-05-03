// 記事（コラム + Q&A）読み込み用ユーティリティ
// content/column/*.md と content/qa/*.md を SSG 用に走査

import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

export type ArticleType = 'column' | 'qa'

export type ArticleFrontmatter = {
  title: string
  description?: string
  publishedAt: string  // YYYY-MM-DD
  updatedAt?: string
  tags?: string[]      // 例: ['乾燥','セラミド']
  hero?: string        // 画像パス（任意）
  noteUrl?: string     // 元のnote URL（参考保存）
  liveDate?: string    // Q&A用：インスタライブの日付
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
      } as Article
    })
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
