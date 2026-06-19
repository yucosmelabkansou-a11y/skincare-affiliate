import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/siteConfig'

// quiz/page.tsx は 'use client' のため metadata を持てない。
// クイズ画面は回答状態でURLが変わる薄い操作ページなので、評価は /diagnosis に集約し本ページは noindex。
export const metadata: Metadata = {
  title: '肌診断テスト｜8問であなたの肌タイプを判定',
  description:
    '8問・約2分の質問に答えると、あなたの肌タイプを判定します。元化粧品研究・商品企画ゆん監修の肌診断。',
  alternates: {
    canonical: `${SITE_URL}/diagnosis`,
  },
  robots: {
    index: false,
    follow: true,
  },
}

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return children
}
