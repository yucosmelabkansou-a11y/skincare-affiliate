#!/usr/bin/env node
// 予約公開の反映と確認（GitHub Actions から毎朝8時台に実行。手元でも実行できる）
//
//   node scripts/scheduled_publish.mjs            … 予約時刻を過ぎてから3時間以内の記事があれば反映・確認
//   node scripts/scheduled_publish.mjs --check    … 作り直しは呼ばず、公開されているかだけ確認
//
// 1. content/column/*.md の publishAt を読み、予約時刻を過ぎてから3時間以内の記事を探す（無ければ終了）
// 2. 本番の /api/revalidate-scheduled を呼び、一覧・記事・トップ・サイトマップを作り直させる
// 3. コラム一覧に記事が載り、記事ページが開けるまで最大約2分確認する
//    → 出ない記事があれば終了コード1（GitHub Actions が失敗になり、通知メールが届く）

import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
const COLUMN_DIR = path.join(ROOT, 'content', 'column')
const SITE = process.env.SITE_URL || 'https://www.yun-skin-care.com'
const WINDOW_MS = 3 * 60 * 60 * 1000
const TRIES = 12
const WAIT_MS = 10_000

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

function recentScheduled(now = Date.now()) {
  const out = []
  for (const f of fs.readdirSync(COLUMN_DIR).filter((f) => f.endsWith('.md'))) {
    const src = fs.readFileSync(path.join(COLUMN_DIR, f), 'utf8')
    const fm = src.match(/^---\n([\s\S]*?)\n---\n/)
    const m = fm && fm[1].match(/^publishAt:\s*["']?([^"'\n]+)["']?\s*$/m)
    if (!m) continue
    const t = Date.parse(m[1].trim())
    if (!Number.isNaN(t) && t <= now && now - t <= WINDOW_MS) out.push({ slug: f.replace(/\.md$/, ''), publishAt: m[1].trim() })
  }
  return out
}

async function get(url) {
  const res = await fetch(url, { headers: { 'cache-control': 'no-cache' }, redirect: 'follow' })
  return { status: res.status, text: await res.text(), cache: res.headers.get('x-vercel-cache') || '' }
}

async function isLive(slug) {
  const list = await get(`${SITE}/column`)
  const inList = list.text.includes(`href="/column/${slug}"`)
  const page = await get(`${SITE}/column/${slug}`)
  const title = (page.text.match(/<title>([^<]*)/) || [])[1] || ''
  const pageOk = page.status === 200 && !/^404/.test(title)
  return { ok: inList && pageOk, inList, pageStatus: page.status, title, listCache: list.cache, pageCache: page.cache }
}

async function main() {
  const checkOnly = process.argv.includes('--check')
  const targets = recentScheduled()
  if (targets.length === 0) {
    console.log('予約時刻を過ぎてから3時間以内の記事はありません。何もせず終了します。')
    return
  }
  console.log('対象:', targets.map((t) => `${t.slug}（${t.publishAt}）`).join(', '))

  if (!checkOnly) {
    const r = await get(`${SITE}/api/revalidate-scheduled`)
    console.log(`作り直しAPI: HTTP ${r.status} ${r.text.slice(0, 300)}`)
    if (r.status !== 200) {
      console.error('作り直しAPIが失敗しました（デプロイ状態を確認してください）。確認は続けます。')
    }
  }

  const pending = new Map(targets.map((t) => [t.slug, null]))
  for (let i = 1; i <= TRIES && pending.size; i++) {
    for (const slug of [...pending.keys()]) {
      const s = await isLive(slug)
      pending.set(slug, s)
      if (s.ok) {
        console.log(`✓ 公開を確認: ${SITE}/column/${slug}（${i}回目）`)
        pending.delete(slug)
      }
    }
    if (pending.size && i < TRIES) await sleep(WAIT_MS)
  }

  if (pending.size) {
    console.error('✗ 予約時刻を過ぎても表示されていない記事があります:')
    for (const [slug, s] of pending) {
      console.error(`  - ${slug}: 一覧に掲載=${s.inList} / 記事ページ HTTP ${s.pageStatus}「${s.title}」 / cache 一覧=${s.listCache} 記事=${s.pageCache}`)
    }
    process.exit(1)
  }
  console.log('結果: OK — 対象の記事はすべて公開されています。')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
