import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
      // Explicitly allow AI search engines and LLM crawlers
      {
        userAgent: [
          'GPTBot',              // OpenAI ChatGPT
          'ChatGPT-User',        // ChatGPT Browse
          'Claude-Web',          // Anthropic Claude
          'ClaudeBot',           // Anthropic crawler
          'anthropic-ai',        // Anthropic alternate
          'Google-Extended',     // Google Gemini/Bard
          'GoogleOther',         // Google AI products
          'PerplexityBot',       // Perplexity AI
          'YouBot',              // You.com AI search
          'Applebot-Extended',   // Apple Intelligence
          'meta-externalagent',  // Meta AI
          'cohere-ai',           // Cohere
          'Omgilibot',          // Omgili AI
          'Bytespider',         // ByteDance (TikTok) AI
          'Diffbot',            // Diffbot knowledge graph
          'ImagesiftBot',       // AI image analysis
          'Googlebot',          // Google Search
          'Bingbot',            // Bing Search
        ],
        allow: '/',
        crawlDelay: 1, // Be respectful to AI crawlers
      }
    ],
    sitemap: 'https://www.context-is-everything.com/sitemap.xml',
    host: 'https://www.context-is-everything.com',
  }
}