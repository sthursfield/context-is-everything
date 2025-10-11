import { notFound } from 'next/navigation'
import { Metadata } from 'next'

// Article slug mapping
const ARTICLE_SLUGS: Record<string, string> = {
  'why-ai-projects-fail': 'article-01-ai-projects-fail',
  'worthless-technology-stack': 'article-02-worthless-technology-stack',
  'hidden-vendor-costs': 'article-03-hidden-vendor-costs',
  'complete-cost-of-ai': 'article-04-complete-cost-of-ai',
  'signs-you-need-ai': 'article-05-signs-you-need-ai',
  'faster-cheaper-better-ai': 'article-06-faster-cheaper-better'
}

interface ArticleData {
  article: {
    id: string
    title: string
    slug: string
    metadata: {
      publishedDate: string
      lastUpdated: string
      author: string
      readingTime: number
      tags: string[]
      seoKeywords: string[]
    }
    versions: {
      bot: {
        content: string
        wordCount: number
        excerpt: string
        structuredData?: any
      }
      human: {
        content: string
        wordCount: number
        excerpt: string
      }
    }
  }
}

async function loadArticle(articleId: string): Promise<ArticleData | null> {
  try {
    const fs = require('fs')
    const path = require('path')
    const filePath = path.join(process.cwd(), 'thought_leadership', 'articles', `${articleId}.json`)
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(fileContent)
  } catch (error) {
    return null
  }
}

export async function generateStaticParams() {
  return Object.keys(ARTICLE_SLUGS).map((slug) => ({
    slug: slug,
  }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const articleId = ARTICLE_SLUGS[params.slug]
  if (!articleId) {
    return {
      title: 'Article Not Found'
    }
  }

  const articleData = await loadArticle(articleId)
  if (!articleData) {
    return {
      title: 'Article Not Found'
    }
  }

  const article = articleData.article

  return {
    title: `${article.title} | Context is Everything`,
    description: article.versions.bot.excerpt,
    keywords: article.metadata.seoKeywords,
    authors: [{ name: article.metadata.author }],
    openGraph: {
      title: article.title,
      description: article.versions.bot.excerpt,
      type: 'article',
      publishedTime: article.metadata.publishedDate,
      modifiedTime: article.metadata.lastUpdated,
      authors: [article.metadata.author],
      tags: article.metadata.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.versions.bot.excerpt,
    },
  }
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const articleId = ARTICLE_SLUGS[params.slug]

  if (!articleId) {
    notFound()
  }

  const articleData = await loadArticle(articleId)

  if (!articleData) {
    notFound()
  }

  const article = articleData.article

  // Convert markdown to HTML (basic conversion)
  const renderMarkdown = (content: string) => {
    // Simple markdown to HTML conversion
    return content
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^- (.*$)/gim, '<li>$1</li>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^/gim, '<p>')
      .replace(/$/gim, '</p>')
      .replace(/<p><\/p>/g, '')
      .replace(/<p><li>/g, '<ul><li>')
      .replace(/<\/li><\/p>/g, '</li></ul>')
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Structured Data */}
      {article.versions.bot.structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(article.versions.bot.structuredData)
          }}
        />
      )}

      {/* Article Content - Full Bot Version for SEO */}
      <article className="max-w-4xl mx-auto px-6 py-16">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            {article.title}
          </h1>

          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
            <time dateTime={article.metadata.publishedDate}>
              Published: {new Date(article.metadata.publishedDate).toLocaleDateString('en-GB', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
            <span>•</span>
            <span>{article.metadata.readingTime} min read</span>
            <span>•</span>
            <span>{article.versions.bot.wordCount} words</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {article.metadata.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>

        {/* Full article content */}
        <div
          className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900"
          dangerouslySetInnerHTML={{
            __html: renderMarkdown(article.versions.bot.content)
          }}
        />

        {/* Footer / CTA */}
        <footer className="mt-16 pt-8 border-t border-gray-200">
          <div className="bg-gray-50 rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">
              What happens next?
            </h3>
            <p className="text-gray-700 mb-6">
              Talk to us. We'll tell you honestly whether AI makes sense for your situation.
            </p>
            <p className="text-gray-700 mb-6">
              If it does, we'd love to work with you. If it doesn't, we'll tell you that too.
            </p>
            <a
              href="/"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Start a Conversation
            </a>
          </div>
        </footer>
      </article>
    </div>
  )
}
