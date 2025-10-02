'use client'

import { useState, useEffect } from 'react'
import WireframeMountain from '@/components/WireframeMountain'
import { useContextualTheme } from '@/hooks/useContextualTheme'

export default function PrivacyPage() {
  const { colors } = useContextualTheme()
  const [currentTheme, setCurrentTheme] = useState<'dark' | 'light'>('dark')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)

    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  const handleBackgroundClick = (e: React.MouseEvent) => {
    // Only close if clicking on background, not content
    if (e.target === e.currentTarget) {
      window.history.back()
    }
  }

  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
      data-theme={currentTheme}
      style={{
        backgroundColor: currentTheme === 'dark' ? '#372528' : '#f8f9fa',
        paddingBottom: '80px' // Space for fixed footer
      }}
    >
      {/* Mountain background */}
      <div className="fixed inset-0 w-full h-full" style={{ zIndex: 1 }}>
        <WireframeMountain currentTheme={currentTheme} />
      </div>

      {/* Page content */}
      <div
        className={`relative z-10 min-h-screen transition-colors duration-[4000ms] cursor-pointer ${
          currentTheme === 'light' ? 'text-gray-900' : 'text-white'
        }`}
        onClick={handleBackgroundClick}
      >
        <header className="px-6 pb-6 pt-12">
          <div className="max-w-4xl mx-auto w-full">
            <a href="/" className="inline-block mb-8 hover:opacity-90 transition-opacity duration-200">
              <img
                src={currentTheme === 'dark' ? "/assets/CIE_stacked_cropped.png" : "/assets/CIE_stacked_mobile_autumn.png"}
                alt="Context is Everything"
                className="h-auto block mx-auto"
                style={{
                  width: isMobile ? '94%' : '66%',
                  maxWidth: isMobile ? '350px' : '245px',
                  height: 'auto'
                }}
                loading="eager"
                decoding="sync"
              />
            </a>
          </div>
        </header>

        {/* Privacy Policy Content */}
        <main className="px-6 max-w-4xl mx-auto">
          <div className="bg-white bg-opacity-90 rounded-lg p-4 md:p-8 shadow-lg backdrop-blur-sm">
            <h1 className="text-xl md:text-3xl font-bold mb-4 md:mb-6 text-gray-900">Privacy Policy</h1>
            <p className="text-xs md:text-sm text-gray-600 mb-6 md:mb-8">Last updated: January 2025</p>

            <div className="prose prose-gray max-w-none text-gray-800 text-xs md:text-base">
              <h2 className="text-xl font-semibold mt-6 mb-4">1. Information We Collect</h2>
              <p className="mb-4">
                Context-is-Everything ("we," "our," or "us") collects information you provide directly to us, such as when you:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Use our AI chat consultation service</li>
                <li>Contact us through our website forms</li>
                <li>Subscribe to our communications</li>
                <li>Interact with our website</li>
              </ul>

              <h2 className="text-xl font-semibold mt-6 mb-4">2. How We Use Your Information</h2>
              <p className="mb-4">We use the information we collect to:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Provide, maintain, and improve our consultation services</li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>Send you technical notices and support messages</li>
                <li>Analyze usage patterns to enhance user experience</li>
              </ul>

              <h2 className="text-xl font-semibold mt-6 mb-4">3. Information Sharing</h2>
              <p className="mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy. We may share information:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>With service providers who assist in our operations</li>
                <li>When required by law or to protect our rights</li>
                <li>In connection with a business transfer or merger</li>
              </ul>

              <h2 className="text-xl font-semibold mt-6 mb-4">4. Data Security</h2>
              <p className="mb-4">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>

              <h2 className="text-xl font-semibold mt-6 mb-4">5. Your Rights</h2>
              <p className="mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Access and update your personal information</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
                <li>Request data portability</li>
              </ul>

              <h2 className="text-xl font-semibold mt-6 mb-4">6. International Data Transfers</h2>
              <p className="mb-4">
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for such transfers.
              </p>

              <h2 className="text-xl font-semibold mt-6 mb-4">7. Changes to This Policy</h2>
              <p className="mb-4">
                We may update this privacy policy from time to time. We will notify you of any material changes by posting the new policy on this page.
              </p>

              <h2 className="text-xl font-semibold mt-6 mb-4">8. Contact Us</h2>
              <p className="mb-4">
                If you have any questions about this privacy policy, please contact us through our website or at the contact information provided on our main page.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}