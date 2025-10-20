import AIReadinessCalculator from '@/components/AIReadinessCalculator';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Readiness Calculator | Context is Everything',
  description: 'Assess your organisation\'s readiness for AI transformation across data infrastructure, organisational culture, technical capabilities, governance, and strategic alignment. Get personalised insights and recommendations.',
  keywords: 'AI readiness assessment, AI maturity model, AI transformation, organisational AI capability, AI strategy, AI implementation readiness',
  openGraph: {
    title: 'AI Readiness Calculator | Context is Everything',
    description: 'Discover your organisation\'s AI readiness level with our comprehensive assessment tool. Get actionable insights across 5 key dimensions.',
    url: 'https://www.context-is-everything.com/tools/ai-readiness-calculator',
    type: 'website',
    images: [
      {
        url: '/og-ai-calculator.png',
        width: 1200,
        height: 630,
        alt: 'AI Readiness Calculator - Assess Your Organisation\'s AI Potential'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Readiness Calculator | Context is Everything',
    description: 'Assess your organisation\'s AI readiness across 5 key dimensions. Get personalised insights and recommendations.',
    images: ['/og-ai-calculator.png']
  }
};

export default function AIReadinessCalculatorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center space-x-3">
              <div className="text-2xl font-bold text-gray-900">
                Context is Everything
              </div>
            </a>
            <a
              href="/"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Back to Home
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900">
            AI Readiness Calculator
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover your organisation's AI readiness level across 5 critical dimensions.
            Get personalised insights and actionable recommendations in under 7 minutes.
          </p>
          <div className="flex flex-wrap gap-4 justify-center text-sm text-gray-600">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              15 Questions
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              ~5 Minutes
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Personalised Results
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              No Email Required
            </div>
          </div>
        </div>
      </section>

      {/* Assessment Dimensions */}
      <section className="py-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">What We'll Assess</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">Data Infrastructure</h3>
              <p className="text-sm text-gray-600">Data quality, accessibility, governance, and infrastructure readiness</p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">Organisational Culture</h3>
              <p className="text-sm text-gray-600">Leadership support, change readiness, skills, and collaboration</p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">Technical Capabilities</h3>
              <p className="text-sm text-gray-600">AI talent, DevOps maturity, production operations, and system architecture</p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">Governance & Ethics</h3>
              <p className="text-sm text-gray-600">Ethics frameworks, accountability structures, and risk management</p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">Strategic Readiness</h3>
              <p className="text-sm text-gray-600">AI strategy clarity, value measurement, and partner ecosystem</p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">Personalised Insights</h3>
              <p className="text-sm text-gray-600">Get tailored recommendations based on your specific readiness profile</p>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator Component */}
      <section className="pb-20">
        <AIReadinessCalculator />
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <p className="text-gray-600">
              Want to discuss your results in detail?{' '}
              <a
                href="mailto:hello@context-is-everything.com"
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Get in touch
              </a>
            </p>
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Context is Everything. Helping organisations navigate AI transformation.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
