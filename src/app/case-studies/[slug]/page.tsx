import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'

// Case study slug mapping
const CASE_STUDY_SLUGS: Record<string, string> = {
  'insurance-brokerage-transformation': 'insurance-brokerage-transformation',
  'london-school-of-architecture': 'lsa_case_study_versions',
  'procurement-analysis': 'procurement_case_study_versions'
}

interface CaseStudyData {
  case_study: {
    id: string
    client: {
      industry: string
      sub_sector?: string
      size: string
      region: string
      anonymous_name: string
    }
    versions: {
      bot: {
        comprehensive_version: string
      }
      human: {
        executive_summary: string
        key_metrics: string
        lessons_learned: string
      }
    }
    metrics: {
      [key: string]: any
    }
    keywords_for_matching?: string[]
    lessons?: string[]
  }
}

async function loadCaseStudy(caseStudyId: string): Promise<CaseStudyData | null> {
  try {
    const fs = require('fs')
    const path = require('path')
    const filePath = path.join(process.cwd(), 'Case_studies', `${caseStudyId}.json`)
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(fileContent)
  } catch (error) {
    return null
  }
}

export async function generateStaticParams() {
  return Object.keys(CASE_STUDY_SLUGS).map((slug) => ({
    slug: slug,
  }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const caseStudyId = CASE_STUDY_SLUGS[params.slug]
  if (!caseStudyId) {
    return {
      title: 'Case Study Not Found'
    }
  }

  const caseStudyData = await loadCaseStudy(caseStudyId)
  if (!caseStudyData) {
    return {
      title: 'Case Study Not Found'
    }
  }

  const caseStudy = caseStudyData.case_study
  const title = `${caseStudy.client.anonymous_name} - ${caseStudy.client.industry} Case Study`
  const description = caseStudy.versions.human.executive_summary.substring(0, 160)

  return {
    title: `${title} | Context is Everything`,
    description: description,
    keywords: caseStudy.keywords_for_matching || [],
    authors: [{ name: 'Context is Everything' }],
    openGraph: {
      title: title,
      description: description,
      type: 'article',
      url: `https://www.context-is-everything.com/case-studies/${params.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
    },
  }
}

export default async function CaseStudyPage({ params }: { params: { slug: string } }) {
  const caseStudyId = CASE_STUDY_SLUGS[params.slug]

  if (!caseStudyId) {
    notFound()
  }

  const caseStudyData = await loadCaseStudy(caseStudyId)

  if (!caseStudyData) {
    notFound()
  }

  const caseStudy = caseStudyData.case_study

  // Convert markdown to HTML (basic conversion)
  const renderMarkdown = (content: string) => {
    return content
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^- (.*$)/gim, '<li>$1</li>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^(?!<)/gim, '<p>')
      .replace(/(?!>)$/gim, '</p>')
      .replace(/<p><\/p>/g, '')
      .replace(/<p><li>/g, '<ul><li>')
      .replace(/<\/li><\/p>/g, '</li></ul>')
      .replace(/<p>(<h[123]>)/g, '$1')
      .replace(/(<\/h[123]>)<\/p>/g, '$1')
  }

  // Generate Schema.org structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": ["Article", "TechArticle"],
    "headline": `${caseStudy.client.anonymous_name} - ${caseStudy.client.industry} Digital Transformation`,
    "description": caseStudy.versions.human.executive_summary.substring(0, 200),
    "author": {
      "@type": "Organization",
      "name": "Context is Everything"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Context is Everything",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.context-is-everything.com/assets/CIE_stacked_cropped.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.context-is-everything.com/case-studies/${params.slug}`
    },
    "about": {
      "@type": "Thing",
      "name": caseStudy.client.industry
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />

      {/* Breadcrumb Navigation */}
      <nav className="bg-gray-50 border-b border-gray-200" aria-label="Breadcrumb">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-gray-900 transition-colors">
                Home
              </Link>
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 mx-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-400">Case Studies</span>
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 mx-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-900 font-medium">{caseStudy.client.anonymous_name}</span>
            </li>
          </ol>
        </div>
      </nav>

      {/* Case Study Content */}
      <article className="max-w-4xl mx-auto px-6 py-16">
        <header className="mb-12">
          {/* Badge */}
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              Case Study
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
              {caseStudy.client.industry}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            {caseStudy.client.anonymous_name}
          </h1>

          {/* Client Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gray-50 rounded-lg mb-8">
            <div>
              <div className="text-sm text-gray-600 mb-1">Industry</div>
              <div className="font-semibold text-gray-900">{caseStudy.client.industry}</div>
            </div>
            {caseStudy.client.sub_sector && (
              <div>
                <div className="text-sm text-gray-600 mb-1">Sector</div>
                <div className="font-semibold text-gray-900">{caseStudy.client.sub_sector}</div>
              </div>
            )}
            <div>
              <div className="text-sm text-gray-600 mb-1">Size</div>
              <div className="font-semibold text-gray-900">{caseStudy.client.size}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Region</div>
              <div className="font-semibold text-gray-900">{caseStudy.client.region}</div>
            </div>
          </div>

          {/* Key Metrics Highlight */}
          {Object.keys(caseStudy.metrics).length > 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-100 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Key Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(caseStudy.metrics).slice(0, 6).map(([key, value]: [string, any]) => {
                  if (typeof value === 'object' && value.improvement) {
                    return (
                      <div key={key} className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="text-sm text-gray-600 mb-1 capitalize">
                          {key.replace(/_/g, ' ')}
                        </div>
                        <div className="text-2xl font-bold text-blue-600 mb-1">
                          {value.improvement}
                        </div>
                        <div className="text-xs text-gray-500">
                          {value.before} → {value.after}
                        </div>
                      </div>
                    )
                  }
                  return null
                })}
              </div>
            </div>
          )}
        </header>

        {/* Full Comprehensive Case Study - BOT Version */}
        <div
          className="prose prose-lg max-w-none
            prose-headings:text-gray-900 prose-headings:font-bold prose-headings:tracking-tight
            prose-h1:text-4xl prose-h1:mb-8 prose-h1:mt-12 prose-h1:leading-tight
            prose-h2:text-3xl prose-h2:mb-6 prose-h2:mt-10 prose-h2:leading-snug
            prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-8
            prose-h4:text-xl prose-h4:mb-3 prose-h4:mt-6
            prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6
            prose-a:text-blue-600 prose-a:underline-offset-4 hover:prose-a:text-blue-700
            prose-strong:text-gray-900 prose-strong:font-semibold
            prose-em:text-gray-600 prose-em:italic
            prose-ul:my-6 prose-ul:space-y-3
            prose-ol:my-6 prose-ol:space-y-3
            prose-li:text-gray-700 prose-li:leading-relaxed prose-li:mb-2
            prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-gray-600 prose-blockquote:my-8
            prose-code:text-gray-900 prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded
            prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-6 prose-pre:rounded-lg
            prose-table:my-8 prose-table:border-collapse
            prose-th:bg-gray-100 prose-th:p-4 prose-th:text-left prose-th:font-semibold
            prose-td:p-4 prose-td:border-t prose-td:border-gray-200"
          dangerouslySetInnerHTML={{
            __html: renderMarkdown(caseStudy.versions.bot.comprehensive_version)
          }}
        />

        {/* CTA Section */}
        <footer className="mt-16 pt-8 border-t border-gray-200">
          <div className="bg-gray-50 rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">
              Interested in similar results?
            </h3>
            <p className="text-gray-700 mb-6">
              Talk to us. We'll tell you honestly whether this approach makes sense for your situation.
            </p>
            <p className="text-gray-700 mb-6">
              If it does, we'd love to work with you. If it doesn't, we'll tell you that too.
            </p>
            <Link
              href="/"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Start a Conversation
            </Link>
          </div>
        </footer>
      </article>
    </div>
  )
}
