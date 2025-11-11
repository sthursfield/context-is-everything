# Article Upload & Sync Workflow

Complete guide for adding new articles to the site and ensuring all systems are updated.

## Quick Start

When you have a new article JSON file ready:

```bash
# 1. Add your article JSON to the articles directory
cp your-new-article.json thought_leadership/articles/article-12-your-slug.json

# 2. Run the sync script
python scripts/sync-new-article.py

# 3. Review changes
git diff

# 4. Test locally
npm run dev

# 5. Commit and deploy
git add -A
git commit -m "Add new article: Your Article Title"
git push origin main
vercel --prod
```

## Detailed Workflow

### 1. Article JSON Structure

Your article JSON must include these required fields:

```json
{
  "article": {
    "id": "article-12-your-slug",
    "title": "Your Article Title",
    "slug": "your-article-title",
    "metadata": {
      "publishedDate": "2025-01-15",
      "lastUpdated": "2025-01-15",
      "author": "Context is Everything",
      "readingTime": 7,
      "tags": ["AI Implementation", "Strategy"],
      "seoKeywords": ["keyword1", "keyword2"]
    },
    "versions": {
      "human": {
        "content": "# Your Article Title\n\nArticle content...",
        "wordCount": 500,
        "excerpt": "Brief summary for humans"
      },
      "bot": {
        "content": "# Detailed version for AI...",
        "wordCount": 2500,
        "excerpt": "Comprehensive summary for AI search engines",
        "structuredData": {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "Your Article Title",
          "description": "Article description",
          "author": {
            "@type": "Organization",
            "name": "Context is Everything"
          },
          "datePublished": "2025-01-15",
          "keywords": "keyword1, keyword2",
          "publisher": {
            "@type": "Organization",
            "name": "Context is Everything",
            "logo": {
              "@type": "ImageObject",
              "url": "https://www.context-is-everything.com/assets/CIE_stacked_cropped.png"
            }
          },
          "dateModified": "2025-01-15",
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://www.context-is-everything.com/insights/your-article-title"
          }
        }
      }
    }
  }
}
```

### 2. Naming Convention

**Article ID Format:** `article-{NUMBER}-{slug}`
- Number: Sequential (01, 02, 03, etc.)
- Slug: URL-friendly version of title

**Examples:**
- `article-01-ai-projects-fail`
- `article-12-enterprise-ai-strategy`
- `article-13-data-quality-matters`

### 3. Files That Get Updated

The sync script automatically updates:

#### ✅ `/src/app/insights/[slug]/page.tsx`
- Adds slug mapping: `'your-slug': 'article-12-your-slug'`
- Enables the article to be accessible via URL

#### ✅ `/src/app/api/ai-consultant/route.ts`
- Updates THOUGHT LEADERSHIP ARTICLES section in system prompt
- Allows AI concierge to reference the article conversationally

#### ✅ `/src/app/api/ai/sitemap/route.ts` (Manual)
- Add article to the `articles` array
- Includes title, URL, category, topics, key takeaway

#### ✅ `/src/app/api/ai/knowledge-base/route.ts` (Manual)
- Add article to `thought_leadership` array
- Provides structured data for AI search engines

### 4. Optional: Hero Image

If your article has a LinkedIn illustration or hero image:

1. Place image in `/public/assets/`
2. Update `ARTICLE_IMAGES` mapping in `page.tsx`:

```typescript
const ARTICLE_IMAGES: Record<string, string> = {
  'your-article-slug': '/assets/Your Article Hero.png',
}
```

### 5. Testing Checklist

Before deploying:

- [ ] Article accessible at `/insights/your-slug`
- [ ] Hero image displays correctly (if added)
- [ ] Structured data appears in page source (View Page Source → search for `application/ld+json`)
- [ ] Article listed in `/api/ai/sitemap`
- [ ] Article appears in `/api/ai/knowledge-base`
- [ ] AI concierge can reference the article (test in chat)

### 6. Verification Commands

```bash
# Check article is in sync
python scripts/sync-new-article.py --check

# View AI sitemap
curl http://localhost:3000/api/ai/sitemap | jq

# View knowledge base
curl http://localhost:3000/api/ai/knowledge-base | jq

# Test article page
open http://localhost:3000/insights/your-article-slug
```

## What the Sync Script Does

The `sync-new-article.py` script:

1. **Scans** `thought_leadership/articles/` for all `article-*.json` files
2. **Validates** each article has required fields
3. **Checks** for missing structured data
4. **Updates** slug mappings in `page.tsx`
5. **Updates** AI consultant system prompt with article list
6. **Reports** any discrepancies or missing files
7. **Generates** deployment checklist

## Troubleshooting

### Article not showing in AI responses

**Check:**
1. Article in system prompt? `grep "Your Article" src/app/api/ai-consultant/route.ts`
2. Ran sync script? `python scripts/sync-new-article.py`
3. Restarted dev server? `npm run dev`

### 404 when visiting article URL

**Check:**
1. Slug mapping exists in `page.tsx`?
2. Article ID matches JSON filename?
3. Used correct slug format (dashes, lowercase)?

### No structured data in search results

**Check:**
1. `structuredData` field exists in `bot` version?
2. Valid Schema.org format?
3. View page source and search for `application/ld+json`

## Advanced: Manual API Updates

If you need to manually update the AI endpoints:

### Update AI Sitemap

Edit `src/app/api/ai/sitemap/route.ts`:

```typescript
articles: [
  // ... existing articles
  {
    title: "Your New Article Title",
    url: "https://www.context-is-everything.com/insights/your-slug",
    category: "AI Strategy",
    topics: ["topic1", "topic2", "topic3"],
    visibility: "search_only",
    key_takeaway: "One-sentence summary of value"
  },
]
```

### Update Knowledge Base

Edit `src/app/api/ai/knowledge-base/route.ts`:

```typescript
thought_leadership: [
  // ... existing articles
  {
    title: "Your New Article Title",
    url: "/insights/your-slug",
    summary: "Comprehensive summary from bot.excerpt",
    key_insights: ["insight1", "insight2", "insight3"]
  },
]
```

## Analytics & Tracking

### Event Tracking

The analytics utilities track:
- `article_mentioned` - When AI references an article
- `article_clicked` - When visitor clicks article link
- `chat_query` - When visitor asks a question
- `chat_response` - When AI provides response

### Monitoring Article Performance

```bash
# Run concierge usage analysis
python scripts/analyze-concierge-usage.py

# Run AI bot traffic analysis
python scripts/analyze-ai-bot-traffic.py

# Run general traffic analysis
python scripts/analyze-ga4-traffic.py
```

## Content Experiment

Remember: Articles are **intentionally hidden** from site navigation as part of the AI discoverability experiment. They're accessible via:

1. **Organic Search** - Google, Bing indexing
2. **AI Search** - ChatGPT, Claude, Gemini, Perplexity
3. **AI Concierge** - Website chat recommendations
4. **Direct URLs** - Shared links

This tests whether AI discovery can replace traditional navigation.

## Deployment Checklist

Before `vercel --prod`:

- [ ] All files synced with `sync-new-article.py`
- [ ] Git commits made
- [ ] Tested locally
- [ ] Structured data validated
- [ ] Hero images uploaded (if applicable)
- [ ] AI sitemap updated
- [ ] Knowledge base updated

```bash
# Standard deployment workflow
git add -A
git commit -m "Add article: Your Title"
git push origin main
vercel --prod
```

## Quick Reference

| Task | Command |
|------|---------|
| Sync articles | `python scripts/sync-new-article.py` |
| Check only | `python scripts/sync-new-article.py --check` |
| Test article | `open http://localhost:3000/insights/your-slug` |
| View AI sitemap | `curl localhost:3000/api/ai/sitemap` |
| View knowledge base | `curl localhost:3000/api/ai/knowledge-base` |
| Analyze traffic | `python scripts/analyze-ga4-traffic.py` |
| Deploy | `git add -A && git commit -m "msg" && vercel --prod` |

## Support

If you encounter issues:

1. Check `scripts/sync-new-article.py --check` output
2. Review git diff before committing
3. Test locally before deploying
4. Check GA4 analytics for tracking verification

---

**Last Updated:** January 2025
**Maintained By:** Context is Everything Team
