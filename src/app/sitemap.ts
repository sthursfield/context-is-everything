import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.context-is-everything.com'

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    // Thought leadership articles
    {
      url: `${baseUrl}/insights/why-ai-projects-fail`,
      lastModified: new Date('2025-01-15'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/insights/worthless-technology-stack`,
      lastModified: new Date('2025-01-15'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/insights/hidden-vendor-costs`,
      lastModified: new Date('2025-01-15'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/insights/complete-cost-of-ai`,
      lastModified: new Date('2025-01-15'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/insights/signs-you-need-ai`,
      lastModified: new Date('2025-10-01'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/insights/faster-cheaper-better-ai`,
      lastModified: new Date('2025-10-11'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // Case studies
    {
      url: `${baseUrl}/case-studies/insurance-brokerage-transformation`,
      lastModified: new Date('2025-10-11'),
      changeFrequency: 'yearly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/case-studies/london-school-of-architecture`,
      lastModified: new Date('2025-10-11'),
      changeFrequency: 'yearly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/case-studies/procurement-analysis`,
      lastModified: new Date('2025-10-11'),
      changeFrequency: 'yearly',
      priority: 0.9,
    },
  ]
}