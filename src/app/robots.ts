import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
      // Specifically allow AI crawlers
      {
        userAgent: ['Googlebot', 'GPTBot', 'Claude-Web', 'PerplexityBot', 'anthropic-ai', 'Bingbot', 'ChatGPT-User', 'cohere-ai'],
        allow: '/',
      }
    ],
    sitemap: 'https://www.context-is-everything.com/sitemap.xml',
    host: 'https://www.context-is-everything.com',
  }
}