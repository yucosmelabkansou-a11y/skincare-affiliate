import type { Metadata } from 'next'
import { GoogleAnalytics } from '@next/third-parties/google'
import './globals.css'
import './editorial.css'
import SiteHeader from '@/components/SiteHeader'
import { SITE_URL, SITE_NAME, SITE_TITLE, SITE_DESCRIPTION } from '@/lib/siteConfig'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: '%s｜yun.skincare_',
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'スキンケア',
    'おすすめ',
    'スキンケア ランキング',
    '化粧水',
    '美容液',
    '乳液',
    'クリーム',
    '日焼け止め',
    '化粧下地',
    '洗顔',
    'クレンジング',
    'プチプラ',
    'デパコス',
    '韓国コスメ',
    '敏感肌',
    '毛穴',
    'エイジングケア',
    '元化粧品研究・商品企画',
    'ノーファンデ',
    'yun.skincare_',
    'ゆん',
  ],
  authors: [{ name: 'ゆん（yun.skincare_）', url: 'https://www.instagram.com/yun.skincare_' }],
  creator: 'ゆん（yun.skincare_）',
  publisher: 'yun.skincare_',
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    // OGP画像は app/opengraph-image.tsx で自動生成・自動付与される
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    creator: '@yun.skincare_',
  },
  verification: {
    google: [
      'cxrwG5YhuWfdg011oR7waVThjmZWjj9hBb0ir9JDdrk',  // 旧 vercel.app プロパティ
      'g7s6lmKldWmDcwaBpdYtL07ent4F6xWKOFyucNqRuvA',  // 新 www.yun-skin-care.com プロパティ
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-[var(--bg-cream)] text-[var(--ink)] font-jp antialiased">
        <SiteHeader />
        <main id="page-content" tabIndex={-1}>{children}</main>
      </body>
      {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
    </html>
  )
}
