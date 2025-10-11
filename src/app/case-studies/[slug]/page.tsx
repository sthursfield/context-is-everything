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

        {/* Executive Summary */}
        <div className="mb-12">
          <div
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900"
            dangerouslySetInnerHTML={{
              __html: renderMarkdown(caseStudy.versions.human.executive_summary)
            }}
          />
        </div>

        {/* Key Metrics Section */}
        {caseStudy.versions.human.key_metrics && (
          <div className="mb-12 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Metrics & Impact</h2>
            <div
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700"
              dangerouslySetInnerHTML={{
                __html: renderMarkdown(caseStudy.versions.human.key_metrics)
              }}
            />
          </div>
        )}

        {/* Lessons Learned */}
        {caseStudy.lessons && caseStudy.lessons.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Key Lessons</h2>
            <div className="space-y-3">
              {caseStudy.lessons.map((lesson, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-gray-700">{lesson}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Details from Human Version */}
        {caseStudy.versions.human.lessons_learned && (
          <div className="mb-12">
            <div
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700"
              dangerouslySetInnerHTML={{
                __html: renderMarkdown(caseStudy.versions.human.lessons_learned)
              }}
            />
          </div>
        )}

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
