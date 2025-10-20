import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

// Article slug mapping
const ARTICLE_SLUGS: Record<string, string> = {
  'why-ai-projects-fail': 'article-01-ai-projects-fail',
  'worthless-technology-stack': 'article-02-worthless-technology-stack',
  'hidden-vendor-costs': 'article-03-hidden-vendor-costs',
  'complete-cost-of-ai': 'article-04-complete-cost-of-ai',
  'signs-you-need-ai': 'article-05-signs-you-need-ai',
  'faster-cheaper-better-ai': 'article-06-faster-cheaper-better',
  'where-to-start-with-ai': 'article-07-where-to-start-with-ai',
  'information-asymmetry-buying-ia-vs-ai': 'article-08-information-asymmetry',
  '7-ai-mistakes-costing-uk-businesses': 'article-09-7-ai-mistakes'
}

// Hero image mapping (LinkedIn illustrations)
const ARTICLE_IMAGES: Record<string, string> = {
  'why-ai-projects-fail': '/assets/Why Most Projects Fail.png',
  'worthless-technology-stack': '/assets/Why Most of Your Technology Stack Adds No Value.png',
  'hidden-vendor-costs': '/assets/The Hidden Costs in Vendor Proposals.png',
  'complete-cost-of-ai': '/assets/Do you Kow what your AI costs?.png',
  'signs-you-need-ai': '/assets/5 Signs.png',
  'faster-cheaper-better-ai': '/assets/Fast_Cheap_Good.png',
  'where-to-start-with-ai': '/assets/Where to Start with AI.png',
  'information-asymmetry-buying-ia-vs-ai': '/assets/Information_Asymmetry.png',
  '7-ai-mistakes-costing-uk-businesses': '/assets/7-ai-mistakes-carousel/1_The Boom.png'
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

  // Enhanced markdown renderer
  const renderMarkdown = (content: string) => {
    // Remove the first H1 title since it's already in the page header
    const contentWithoutTitle = content.replace(/^# .*$/m, '').trim()

    return contentWithoutTitle
      .replace(/^# (.*$)/gim, '<h1 class="text-4xl font-bold text-gray-900 mt-16 mb-6 leading-tight">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-3xl font-bold text-gray-900 mt-14 mb-5 leading-snug">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-2xl font-semibold text-gray-800 mt-10 mb-4">$1</h3>')
      .replace(/^#### (.*$)/gim, '<h4 class="text-xl font-semibold text-gray-800 mt-8 mb-3">$1</h4>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-gray-600">$1</em>')
      .replace(/^- (.*$)/gim, '<li class="text-gray-700 leading-relaxed mb-3">$1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li class="text-gray-700 leading-relaxed mb-3">$1</li>')
      .replace(/\n\n/g, '</p><p class="text-gray-700 leading-relaxed mb-6">')
      .replace(/^(?!<)/gim, '<p class="text-gray-700 leading-relaxed mb-6">')
      .replace(/(?!>)$/gim, '</p>')
      .replace(/<p class="text-gray-700 leading-relaxed mb-6"><\/p>/g, '')
      .replace(/<p class="text-gray-700 leading-relaxed mb-6"><li>/g, '<ul class="space-y-3 my-6 ml-6 list-disc"><li>')
      .replace(/<\/li><\/p>/g, '</li></ul>')
      .replace(/<p class="text-gray-700 leading-relaxed mb-6">(<h[1-4])/g, '$1')
      .replace(/(<\/h[1-4]>)<\/p>/g, '$1')
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
        <div className="w-full bg-gradient-to-br from-gray-50 to-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-8 py-16">
            <img
              src={heroImage}
              alt={`${article.title} - Thought leadership article by Context is Everything on AI implementation`}
              title={article.title}
              className="w-full h-auto rounded-lg shadow-sm"
              style={{ maxHeight: '500px', objectFit: 'contain' }}
              loading="eager"
            />
          </div>
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <nav className="bg-white border-b border-gray-200" aria-label="Breadcrumb">
        <div className="max-w-6xl mx-auto px-8 py-4">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link href="/" className="hover:text-gray-700 transition-colors">
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
              <span className="text-gray-700 font-medium truncate max-w-xs">{article.title.substring(0, 50)}{article.title.length > 50 ? '...' : ''}</span>
            </li>
          </ol>
        </div>
      </nav>

      {/* Article Content */}
      <article className="max-w-6xl mx-auto px-8 py-16">
        <header className="mb-16 pb-12 border-b border-gray-200">
          <h1 className="text-5xl font-bold mb-8 text-gray-900 leading-tight tracking-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-8">
            <time dateTime={article.metadata.publishedDate}>
              {new Date(article.metadata.publishedDate).toLocaleDateString('en-GB', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
            <span>·</span>
            <span>{article.metadata.readingTime} min read</span>
            <span>·</span>
            <span>{article.versions.human.wordCount} words</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {article.metadata.tags.map((tag) => (
              <span
                key={tag}
                className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>

        {/* Two-Column Layout for Better Readability */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content - 8 columns */}
          <div className="lg:col-span-8">
            {/* Excerpt Box */}
            <div className="bg-gray-50 border-l-4 border-gray-400 p-6 rounded-r mb-12">
              <p className="text-lg text-gray-700 leading-relaxed italic">
                {article.versions.human.excerpt}
              </p>
            </div>

            {/* Article Content - HUMAN version */}
            <div
              className="
                [&>h2]:text-3xl [&>h2]:font-bold [&>h2]:text-gray-900 [&>h2]:mt-14 [&>h2]:mb-5 [&>h2]:leading-snug
                [&>h3]:text-2xl [&>h3]:font-semibold [&>h3]:text-gray-800 [&>h3]:mt-10 [&>h3]:mb-4
                [&>h4]:text-xl [&>h4]:font-semibold [&>h4]:text-gray-800 [&>h4]:mt-8 [&>h4]:mb-3
                [&>p]:text-gray-700 [&>p]:leading-relaxed [&>p]:mb-6 [&>p]:text-base
                [&>ul]:space-y-3 [&>ul]:my-6 [&>ul]:ml-6 [&>ul]:list-disc
                [&>ol]:space-y-3 [&>ol]:my-6 [&>ol]:ml-6 [&>ol]:list-decimal
                [&>li]:text-gray-700 [&>li]:leading-relaxed [&>li]:mb-2
                [&>strong]:font-semibold [&>strong]:text-gray-900
                [&>em]:italic [&>em]:text-gray-600
                [&>blockquote]:border-l-4 [&>blockquote]:border-gray-300 [&>blockquote]:pl-6 [&>blockquote]:my-8 [&>blockquote]:italic [&>blockquote]:text-gray-600
                [&>a]:text-blue-600 [&>a]:underline-offset-4 [&>a]:hover:text-blue-700"
              dangerouslySetInnerHTML={{
                __html: renderMarkdown(article.versions.human.content)
              }}
            />
          </div>

          {/* Sidebar - 4 columns */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-8 space-y-8">
              {/* Author Info */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
                  About the Author
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Written by the team at <strong>Context is Everything</strong>,
                  combining enterprise software expertise, operational transformation experience,
                  and strategic AI analysis.
                </p>
              </div>

              {/* Related Topics */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
                  Related Topics
                </h3>
                <div className="flex flex-wrap gap-2">
                  {article.metadata.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-3 py-1 bg-white text-gray-600 rounded-full border border-gray-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Reading Time */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-2">
                  Reading Time
                </h3>
                <p className="text-2xl font-bold text-gray-900">
                  {article.metadata.readingTime} <span className="text-base font-normal text-gray-600">minutes</span>
                </p>
              </div>
            </div>
          </aside>
        </div>

        {/* CTA Section */}
        <footer className="mt-20 pt-12 border-t border-gray-200">
          <div className="bg-gray-50 rounded-lg p-10">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">
              What happens next?
            </h3>
            <p className="text-gray-700 mb-4 text-lg leading-relaxed">
              Talk to us. We'll tell you honestly whether AI makes sense for your situation.
            </p>
            <p className="text-gray-700 mb-8 text-lg leading-relaxed">
              If it does, we'd love to work with you. If it doesn't, we'll tell you that too.
            </p>
            <Link
              href="/"
              className="inline-block bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Start a Conversation
            </Link>
          </div>
        </footer>
      </article>
    </div>
  )
}
