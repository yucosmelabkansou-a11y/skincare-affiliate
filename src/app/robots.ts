import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/siteConfig'

// Edge Requests 削減 & クロール最適化のため、検索流入に必要なBotは許可しつつ、
// AI学習クローラ・SEO調査クローラ・無価値な巡回Botはブロックする。
const BLOCKED_BOTS = [
  // AI学習・収集系
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'CCBot',
  'ClaudeBot',
  'Claude-Web',
  'anthropic-ai',
  'Google-Extended', // Gemini学習用（通常のGooglebotとは別。検索インデックスには影響しない）
  'Applebot-Extended',
  'PerplexityBot',
  'Bytespider', // TikTok / 字節跳動
  'Amazonbot',
  'Diffbot',
  'Omgilibot',
  'ImagesiftBot',
  'cohere-ai',
  'YouBot',
  'Meta-ExternalAgent',
  'FacebookBot',
  // SEO調査・被リンク解析系（重い巡回をするわりに自サイトには利益がない）
  'AhrefsBot',
  'SemrushBot',
  'MJ12bot',
  'DotBot',
  'DataForSeoBot',
  'BLEXBot',
  'rogerbot', // Moz
  'PetalBot',
  'SeznamBot',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // 検索エンジン（Googlebot / Bingbot 等）を含む既定の許可
      {
        userAgent: '*',
        allow: '/',
      },
      // 上記の Bot は全面ブロック
      {
        userAgent: BLOCKED_BOTS,
        disallow: '/',
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
