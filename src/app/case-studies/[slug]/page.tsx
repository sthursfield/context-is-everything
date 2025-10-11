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

  // Enhanced markdown renderer with better formatting
  const renderMarkdown = (content: string) => {
    return content
      .replace(/^# (.*$)/gim, '<h1 class="text-4xl font-bold text-gray-900 mt-16 mb-6 leading-tight">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-3xl font-bold text-gray-900 mt-14 mb-5 leading-snug">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-2xl font-semibold text-gray-800 mt-10 mb-4">$3</h3>')
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
      <nav className="bg-white border-b border-gray-200" aria-label="Breadcrumb">
        <div className="max-w-7xl mx-auto px-8 py-4">
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
              <span className="text-gray-400">Case Studies</span>
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 mx-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700 font-medium">{caseStudy.client.anonymous_name}</span>
            </li>
          </ol>
        </div>
      </nav>

      {/* Article Content */}
      <article className="max-w-7xl mx-auto px-8 py-16">

        {/* Header with Client Info */}
        <header className="mb-16 pb-12 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
              Case Study
            </span>
            <span className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
              {caseStudy.client.industry}
            </span>
          </div>

          <h1 className="text-5xl font-bold mb-8 text-gray-900 leading-tight tracking-tight">
            {caseStudy.client.anonymous_name}
          </h1>

          {/* Client Info - Clean Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
            <div>
              <div className="text-sm text-gray-500 mb-2 uppercase tracking-wide">Industry</div>
              <div className="text-base font-medium text-gray-900">{caseStudy.client.industry}</div>
            </div>
            {caseStudy.client.sub_sector && (
              <div>
                <div className="text-sm text-gray-500 mb-2 uppercase tracking-wide">Sector</div>
                <div className="text-base font-medium text-gray-900">{caseStudy.client.sub_sector}</div>
              </div>
            )}
            <div>
              <div className="text-sm text-gray-500 mb-2 uppercase tracking-wide">Size</div>
              <div className="text-base font-medium text-gray-900">{caseStudy.client.size}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-2 uppercase tracking-wide">Region</div>
              <div className="text-base font-medium text-gray-900">{caseStudy.client.region}</div>
            </div>
          </div>
        </header>

        {/* Key Metrics Table - Styled like your example */}
        {Object.keys(caseStudy.metrics).length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-2xl">📊</span> Transformation Results
            </h2>

            <div className="overflow-hidden border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Metric
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Before
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      After
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Improvement
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(caseStudy.metrics).map(([key, value]: [string, any]) => {
                    if (typeof value === 'object' && value.before && value.after) {
                      return (
                        <tr key={key} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900 capitalize">
                            {key.replace(/_/g, ' ')}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {value.before}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {value.after}
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                            {value.improvement}
                          </td>
                        </tr>
                      )
                    }
                    return null
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Main Content - Two Column Layout for Better Readability */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-12">
            <div
              className="
                [&>h1]:text-4xl [&>h1]:font-bold [&>h1]:text-gray-900 [&>h1]:mt-16 [&>h1]:mb-6 [&>h1]:leading-tight
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
                [&>table]:my-8 [&>table]:w-full [&>table]:border-collapse
                [&>th]:bg-gray-50 [&>th]:p-4 [&>th]:text-left [&>th]:font-semibold [&>th]:border-b [&>th]:border-gray-200
                [&>td]:p-4 [&>td]:border-b [&>td]:border-gray-200"
              dangerouslySetInnerHTML={{
                __html: renderMarkdown(caseStudy.versions.bot.comprehensive_version)
              }}
            />
          </div>
        </div>

        {/* CTA Section */}
        <footer className="mt-20 pt-12 border-t border-gray-200">
          <div className="bg-gray-50 rounded-lg p-10">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">
              Interested in similar results?
            </h3>
            <p className="text-gray-700 mb-4 text-lg leading-relaxed">
              Talk to us. We'll tell you honestly whether this approach makes sense for your situation.
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
