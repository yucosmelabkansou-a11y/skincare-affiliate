import type { MetadataRoute } from 'next'
import { allSkinTypes } from '@/lib/diagnosis'

const SITE_URL = 'https://skincare-affiliate.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/diagnosis`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    ...allSkinTypes.map((type) => ({
      url: `${SITE_URL}/diagnosis/result/${type}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ]
}
