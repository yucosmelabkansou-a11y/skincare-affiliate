import type { Metadata } from 'next'
import { Inter, Noto_Sans_JP, Cormorant_Garamond, Shippori_Mincho, Italiana, Jost } from 'next/font/google'
import { GoogleAnalytics } from '@next/third-parties/google'
import './globals.css'
import { SITE_URL, SITE_NAME, SITE_TITLE, SITE_DESCRIPTION } from '@/lib/siteConfig'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  variable: '--font-noto-sans-jp',
  display: 'swap',
})

// エディトリアル英字セリフ体（見出し・ブランド名）
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
})

// 和文セリフ（本文・見出し用）
const shipporiMincho = Shippori_Mincho({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jp-serif',
  display: 'swap',
})

// 装飾用スクリプト体（ワードマーク "Skin&Care"）
const italiana = Italiana({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-script',
  display: 'swap',
})

// 細身サンセリフ（eyebrow・スモールキャップス）
const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400'],
  variable: '--font-jost',
  display: 'swap',
})

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
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'yun.skincare_ - 元化粧品研究・商品企画×29年ノーファンデが厳選するスキンケア',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ['/og-image.jpg'],
    creator: '@yun.skincare_',
  },
  icons: {
    icon: '/favicon.ico',
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
    <html lang="ja" className={`${inter.variable} ${notoSansJP.variable} ${cormorant.variable} ${shipporiMincho.variable} ${italiana.variable} ${jost.variable}`}>
      <body className="min-h-screen bg-[var(--bg-cream)] text-[var(--ink)] font-jp antialiased">
        {children}
      </body>
      {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
    </html>
  )
}
