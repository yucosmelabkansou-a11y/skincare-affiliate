import type { Metadata } from 'next'
import { Inter, Noto_Sans_JP, Cormorant_Garamond } from 'next/font/google'
import './globals.css'
import { SITE_URL, SITE_NAME, SITE_TITLE, SITE_DESCRIPTION } from '@/lib/siteConfig'

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

// エディトリアル感を出す英字セリフ体（見出し・ブランド名強調用）
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-serif',
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
    '元化粧品研究員',
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
        alt: 'yun.skincare_ - 元化粧品研究員×29年ノーファンデが厳選するスキンケア',
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
  // Google Search Console 認証用（取得後にここへ貼り付け）
  // verification: { google: 'your-verification-code' },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" className={`${inter.variable} ${notoSansJP.variable} ${cormorant.variable}`}>
      <body className="min-h-screen bg-white text-[#6C757D] font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
