import type { MetadataRoute } from 'next'
import { allSkinTypes } from '@/lib/diagnosis'
import { getAllArticles } from '@/lib/articles'
import { SITE_URL } from '@/lib/siteConfig'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const columns = getAllArticles('column')
  const qas = getAllArticles('qa')

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
    {
      url: `${SITE_URL}/column`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/qa`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    ...columns.map((a) => ({
      url: `${SITE_URL}/column/${a.slug}`,
      lastModified: a.updatedAt
        ? new Date(a.updatedAt)
        : a.publishedAt
        ? new Date(a.publishedAt)
        : now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...qas.map((a) => ({
      url: `${SITE_URL}/qa/${a.slug}`,
      lastModified: a.updatedAt
        ? new Date(a.updatedAt)
        : a.publishedAt
        ? new Date(a.publishedAt)
        : now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
