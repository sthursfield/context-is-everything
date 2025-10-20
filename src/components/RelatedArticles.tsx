import Link from 'next/link'

interface RelatedArticle {
  id: string
  title: string
  slug: string
  excerpt: string
  readingTime: number
  tags: string[]
}

interface RelatedArticlesProps {
  articles: RelatedArticle[]
}

// Reverse mapping from article ID to slug
const ARTICLE_ID_TO_SLUG: Record<string, string> = {
  'article-01-ai-projects-fail': 'why-ai-projects-fail',
  'article-02-worthless-technology-stack': 'worthless-technology-stack',
  'article-03-hidden-vendor-costs': 'hidden-vendor-costs',
  'article-04-complete-cost-of-ai': 'complete-cost-of-ai',
  'article-05-signs-you-need-ai': 'signs-you-need-ai',
  'article-06-faster-cheaper-better': 'faster-cheaper-better-ai',
  'article-07-where-to-start-with-ai': 'where-to-start-with-ai',
  'article-08-information-asymmetry': 'information-asymmetry-buying-ia-vs-ai',
  'article-09-7-ai-mistakes': '7-ai-mistakes-costing-uk-businesses',
  'article-10-ai-native-buyers': 'ai-native-buyers-marketing-gap'
}

export default function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (!articles || articles.length === 0) {
    return null
  }

  return (
    <section className="mt-20 pt-12 border-t border-gray-200">
      <h2 className="text-3xl font-bold mb-8 text-gray-900">
        Related Articles
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article) => {
          const slug = ARTICLE_ID_TO_SLUG[article.id]

          return (
            <Link
              key={article.id}
              href={`/insights/${slug}`}
              className="group bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-200"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                {article.title}
              </h3>

              <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                {article.excerpt}
              </p>

              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span>{article.readingTime} min read</span>
                {article.tags && article.tags.length > 0 && (
                  <>
                    <span>·</span>
                    <span className="truncate">{article.tags[0]}</span>
                  </>
                )}
              </div>

              <div className="mt-4 text-blue-600 text-sm font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                Read article
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
