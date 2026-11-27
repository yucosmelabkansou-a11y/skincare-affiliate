#!/usr/bin/env node
// コラム記事の購入リンク チェック（公開前に必ず実行する）
//
// 使い方:
//   node scripts/check_column_links.mjs <slug> [<slug> ...]   … 指定記事だけ
//   node scripts/check_column_links.mjs --all                  … content/column の全記事（棚卸し）
//   npm run check:links -- <slug>                              … 同じ（npm経由）
//
// 判定:
//   商品セクション = 見出し（## / ###）に商品画像 `/images/products/` を含むもの、
//                    または `## ①` のように丸数字で始まる見出し。
//   セクションの範囲 = その見出しから、同じか上位レベルの次の見出しまで。
//   購入リンク = Amazon（amazon.co.jp / amzn.to / amzn.asia）・楽天（rakuten.co.jp）・
//                 リンク名に「公式」を含むリンク のいずれか。
//   NG  : 購入リンクが1本も無い商品 → 終了コード1（公開してはいけない）
//   注意: 検索リンクの仮置き、楽天aflでない楽天直リンク、tagの無いAmazonリンク、
//         Amazon／楽天のどちらか片方しか無い商品（一覧表示のみ。公開は止めない）
//   意図的にリンクを置かない商品は、そのセクション内に
//   `<!-- link-check: skip 理由 -->` を書くと NG から外れる（理由は必ず書く）。
//   商品セクションが1つも見つからない記事は「未検出」と表示する（目視で確認する）。

import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
const COLUMN_DIR = path.join(ROOT, 'content', 'column')

const CIRCLED = '①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳'

function parseFrontmatter(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n/)
  const fm = {}
  if (!m) return { fm, bodyStartLine: 0 }
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.*)$/)
    if (kv) fm[kv[1]] = kv[2].replace(/^["']|["']$/g, '')
  }
  return { fm, bodyStartLine: m[0].split('\n').length - 1 }
}

function headingInfo(line) {
  const m = line.match(/^(#{2,3})\s+(.*)$/)
  if (!m) return null
  return { level: m[1].length, text: m[2] }
}

function productName(text) {
  // 「### ![商品名](/images/...) 1. 商品名（メーカー）」→ 画像の alt を優先
  const img = text.match(/!\[([^\]]+)\]\(\/images\/products\//)
  if (img) return img[1].trim()
  return text.replace(/^[①-⑳]\s*/, '').split('｜')[0].trim()
}

function isProductHeading(h) {
  if (/\/images\/products\//.test(h.text)) return true
  if (h.level === 2 && CIRCLED.includes(h.text.trim()[0])) return true
  return false
}

function classifyLinks(sectionText) {
  const links = [...sectionText.matchAll(/\[([^\]]*)\]\((https?:\/\/[^)\s]+)\)/g)].map((m) => ({
    label: m[1],
    url: m[2],
  }))
  const r = { amazon: [], rakuten: [], official: [], warnings: [] }
  for (const { label, url } of links) {
    let host = ''
    try {
      host = new URL(url).hostname
    } catch {
      continue
    }
    if (/(^|\.)amazon\.co\.jp$|(^|\.)amzn\.to$|(^|\.)amzn\.asia$/.test(host)) {
      r.amazon.push(url)
      if (/amazon\.co\.jp$/.test(host)) {
        if (/\/s\?|\/s\/?\?/.test(url)) r.warnings.push('Amazonが検索リンク（仮置き）')
        else if (!/[?&]tag=/.test(url)) r.warnings.push('Amazonリンクに tag= が無い')
      }
    } else if (/rakuten\.co\.jp$/.test(host)) {
      r.rakuten.push(url)
      if (/^search\.rakuten/.test(host)) r.warnings.push('楽天が検索リンク（仮置き）')
      else if (!/^hb\.afl\.rakuten/.test(host)) r.warnings.push('楽天がaflリンクではない（成果が付かない）')
    } else if (/公式/.test(label)) {
      r.official.push(url)
    }
  }
  r.warnings = [...new Set(r.warnings)]
  return r
}

export function checkArticle(file) {
  const src = fs.readFileSync(file, 'utf8')
  const { fm } = parseFrontmatter(src)
  const lines = src.split('\n')
  const heads = []
  lines.forEach((line, i) => {
    const h = headingInfo(line)
    if (h) heads.push({ ...h, line: i })
  })
  const products = []
  heads.forEach((h, idx) => {
    if (!isProductHeading(h)) return
    let end = lines.length
    for (const n of heads.slice(idx + 1)) {
      if (n.level <= h.level) {
        end = n.line
        break
      }
    }
    const body = lines.slice(h.line, end).join('\n')
    const links = classifyLinks(body)
    const skip = body.match(/<!--\s*link-check:\s*skip\s*(.*?)-->/)
    const hasAny = links.amazon.length + links.rakuten.length + links.official.length > 0
    products.push({
      name: productName(h.text),
      line: h.line + 1,
      links,
      skip: skip ? skip[1].trim() || '(理由未記入)' : null,
      status: hasAny ? 'OK' : skip ? 'SKIP' : 'NG',
    })
  })
  return {
    slug: path.basename(file, '.md'),
    publishAt: fm.publishAt || fm.publishedAt || '',
    products,
    whole: classifyLinks(src),
  }
}

function isPublished(publishAt) {
  if (!publishAt) return true
  const t = Date.parse(publishAt)
  return Number.isNaN(t) ? true : t <= Date.now()
}

function kinds(l) {
  const k = []
  if (l.official.length) k.push('公式')
  if (l.amazon.length) k.push('Amazon')
  if (l.rakuten.length) k.push('楽天')
  return k.join('・') || 'なし'
}

function report(res) {
  const ng = res.products.filter((p) => p.status === 'NG')
  const state = isPublished(res.publishAt) ? '公開済み' : '予約（未公開）'
  const head = `■ ${res.slug}（${state} ${res.publishAt}）`
  if (res.products.length === 0) {
    const w = res.whole
    const cnt = `記事全体の購入リンク: Amazon ${w.amazon.length} / 楽天 ${w.rakuten.length} / 公式 ${w.official.length}`
    const warn = w.warnings.length ? ` 注意: ${w.warnings.join(' / ')}` : ''
    console.log(`${head}\n  商品セクション未検出（商品を紹介している記事なら目視で確認すること）\n  ${cnt}${warn}\n`)
    return 0
  }
  console.log(`${head}  商品 ${res.products.length} 件 / リンク欠け ${ng.length} 件`)
  for (const p of res.products) {
    const mark = p.status === 'NG' ? '✗ 欠け' : p.status === 'SKIP' ? '－ 対象外' : '✓'
    let note = p.status === 'SKIP' ? `（${p.skip}）` : `［${kinds(p.links)}］`
    const extra = []
    if (p.status === 'OK') {
      if (!p.links.amazon.length) extra.push('Amazonなし')
      if (!p.links.rakuten.length) extra.push('楽天なし')
    }
    extra.push(...p.links.warnings)
    if (extra.length) note += ' 注意: ' + extra.join(' / ')
    console.log(`  ${mark}  ${p.name}  (L${p.line}) ${note}`)
  }
  console.log('')
  return ng.length
}

function main() {
  const args = process.argv.slice(2)
  if (args.length === 0) {
    console.error('使い方: node scripts/check_column_links.mjs <slug> [<slug> ...] | --all')
    process.exit(2)
  }
  const files = args.includes('--all')
    ? fs
        .readdirSync(COLUMN_DIR)
        .filter((f) => f.endsWith('.md'))
        .sort()
        .map((f) => path.join(COLUMN_DIR, f))
    : args.map((a) => {
        const slug = path.basename(a, '.md')
        const f = path.join(COLUMN_DIR, `${slug}.md`)
        if (!fs.existsSync(f)) {
          console.error(`記事が見つかりません: ${f}`)
          process.exit(2)
        }
        return f
      })
  let totalNg = 0
  const ngList = []
  for (const f of files) {
    const res = checkArticle(f)
    const n = report(res)
    totalNg += n
    for (const p of res.products.filter((p) => p.status === 'NG')) ngList.push(`${res.slug}: ${p.name}`)
  }
  if (totalNg > 0) {
    console.log(`結果: NG — 購入リンクが無い商品が ${totalNg} 件あります。公開（mainへのpush）を止めて、次の一覧をYunに報告してください。`)
    for (const s of ngList) console.log(`  - ${s}`)
    process.exit(1)
  }
  console.log('結果: OK — 全商品に購入リンクがあります（「注意」の項目は必要に応じて確認）。')
}

main()
