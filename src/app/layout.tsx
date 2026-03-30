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

export const metadata: Metadata = {
  title: 'ゆんのおすすめアイテム一覧',
  description:
    '毛穴・ニキビ・乾燥・エイジングケアなど肌悩み別に、成分にこだわったスキンケア商品を紹介。Amazon・楽天でまとめて比較・購入できます。',
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
