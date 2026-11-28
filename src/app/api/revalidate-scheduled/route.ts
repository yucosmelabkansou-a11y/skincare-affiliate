// 予約公開の反映：予約時刻を過ぎたコラムがあるとき、一覧・記事・トップ・サイトマップを作り直す
//
// ページは revalidate = 600（10分）の ISR で、時刻を過ぎても「最初のアクセスには古いページを返し、
// 裏で作り直す」ため、予約時刻ちょうどには記事が出ないことがある（2026-11-28 に発生）。
// GitHub Actions（.github/workflows/scheduled-publish.yml）が毎朝8時台にこの URL を呼ぶ。
//
// 予約時刻から WINDOW_MS 以内の記事が無ければ何もしない（誰が呼んでも作り直しが増えないようにする）。

import { revalidatePath } from 'next/cache'
import { getRecentlyScheduled } from '@/lib/articles'

const WINDOW_MS = 3 * 60 * 60 * 1000 // 3時間（GitHub Actions の起動遅れを見込む）

export async function GET() {
  const recent = getRecentlyScheduled('column', WINDOW_MS)
  if (recent.length === 0) {
    return Response.json({ revalidated: false, reason: '予約時刻を過ぎたばかりの記事はありません' })
  }
  revalidatePath('/')
  revalidatePath('/column')
  revalidatePath('/column/[slug]', 'page')
  revalidatePath('/sitemap.xml')
  return Response.json({
    revalidated: true,
    articles: recent.map((a) => ({ slug: a.slug, publishAt: a.publishAt })),
    at: new Date().toISOString(),
  })
}
