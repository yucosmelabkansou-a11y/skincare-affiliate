import type { Metadata } from 'next'
import { Inter, Noto_Sans_JP } from 'next/font/google'
import './globals.css'

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

const SITE_URL = 'https://skincare-affiliate.vercel.app'
const SITE_NAME = 'yun.skincare_'
const SITE_TITLE = 'yun.skincare_｜元化粧品研究員×29年ノーファンデ厳選スキンケア'
const SITE_DESCRIPTION =
  'Instagram5.7万人フォロワーのゆん（元化粧品会社・研究職／生涯ノーファンデ歴29年）が、本当に使ってよかったスキンケア・ベースメイク163アイテムを厳選。化粧水・美容液・日焼け止め・洗顔・クレンジングなど肌悩み別にAmazon・楽天で比較・購入できます。'

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
    <html lang="ja" className={`${inter.variable} ${notoSansJP.variable}`}>
      <body className="min-h-screen bg-white text-[#6C757D] font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
