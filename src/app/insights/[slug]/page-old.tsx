import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'

// Article slug mapping
const ARTICLE_SLUGS: Record<string, string> = {
  'why-ai-projects-fail': 'article-01-ai-projects-fail',
  'worthless-technology-stack': 'article-02-worthless-technology-stack',
  'hidden-vendor-costs': 'article-03-hidden-vendor-costs',
  'complete-cost-of-ai': 'article-04-complete-cost-of-ai',
  'signs-you-need-ai': 'article-05-signs-you-need-ai',
  'faster-cheaper-better-ai': 'article-06-faster-cheaper-better'
}

// Hero image mapping (LinkedIn illustrations)
const ARTICLE_IMAGES: Record<string, string> = {
  'why-ai-projects-fail': '/assets/Why Most Projects Fail.png',
  'worthless-technology-stack': '/assets/Why Most of Your Technology Stack Adds No Value.png',
  'hidden-vendor-costs': '/assets/The Hidden Costs in Vendor Proposals.png',
  'complete-cost-of-ai': '/assets/Do you Kow what your AI costs?.png',
  'signs-you-need-ai': '/assets/5 Signs.png',
  'faster-cheaper-better-ai': '/assets/Fast_Cheap_Good.png'
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
  const heroImage = ARTICLE_IMAGES[params.slug]
  const imageUrl = heroImage ? `https://www.context-is-everything.com${heroImage}` : 'https://www.context-is-everything.com/og-image.png'

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
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: article.title,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.versions.bot.excerpt,
      images: [imageUrl],
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
  const heroImage = ARTICLE_IMAGES[params.slug]

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

      {/* Hero Image Section */}
      {heroImage && (
        <div className="w-full bg-gradient-to-br from-gray-50 to-gray-100 border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-6 py-12">
            <img
              src={heroImage}
              alt={`${article.title} - Thought leadership article by Context is Everything on AI implementation`}
              title={article.title}
              className="w-full h-auto rounded-lg shadow-lg"
              style={{ maxHeight: '600px', objectFit: 'contain' }}
              loading="eager"
            />
          </div>
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <nav className="bg-white border-b border-gray-200" aria-label="Breadcrumb">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-gray-900 transition-colors underline-offset-4 hover:underline">
                Home
              </Link>
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 mx-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-400">Insights</span>
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 mx-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-900 font-medium truncate max-w-xs">{article.title.substring(0, 50)}{article.title.length > 50 ? '...' : ''}</span>
            </li>
          </ol>
        </div>
      </nav>

      {/* Article Content - Full Bot Version for SEO */}
      <article className="max-w-4xl mx-auto px-6 py-16">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 leading-tight">
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

          <div className="flex flex-wrap gap-2 mb-8">
            {article.metadata.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Excerpt / Summary */}
          <div className="bg-gray-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-8">
            <p className="text-lg text-gray-700 leading-relaxed">
              {article.versions.bot.excerpt}
            </p>
          </div>
        </header>

        {/* Full article content - HUMAN version (LinkedIn/Newsletter) */}
        <div
          className="prose prose-lg max-w-none
            prose-headings:text-gray-900 prose-headings:font-bold prose-headings:tracking-tight
            prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-12
            prose-h2:text-3xl prose-h2:mb-4 prose-h2:mt-10
            prose-h3:text-2xl prose-h3:mb-3 prose-h3:mt-8
            prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6
            prose-a:text-blue-600 prose-a:underline-offset-4 hover:prose-a:text-blue-700
            prose-strong:text-gray-900 prose-strong:font-semibold
            prose-ul:my-6 prose-ul:space-y-2
            prose-ol:my-6 prose-ol:space-y-2
            prose-li:text-gray-700 prose-li:leading-relaxed
            prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-gray-600"
          dangerouslySetInnerHTML={{
            __html: renderMarkdown(article.versions.human.content)
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
