'use client'

import { useState, useEffect } from 'react'
import WireframeMountain from '@/components/WireframeMountain'
import { useContextualTheme } from '@/hooks/useContextualTheme'

export default function CookiesPage() {
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
          currentTheme === 'light' ? 'text-gray-900' : 'text-gray-900'
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

        {/* Cookie Policy Content */}
        <main className="px-6 max-w-4xl mx-auto">
          <div className="bg-white bg-opacity-90 rounded-lg p-4 md:p-8 shadow-lg backdrop-blur-sm">
            <h1 className="text-xl md:text-3xl font-bold mb-4 md:mb-6 text-gray-900">Cookie Policy</h1>
            <p className="text-xs md:text-sm text-gray-600 mb-6 md:mb-8">Last updated: January 2025</p>

            <div className="prose prose-gray max-w-none text-gray-800 text-xs md:text-base">
              <h2 className="text-xl font-semibold mt-6 mb-4">What Are Cookies</h2>
              <p className="mb-4">
                Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and analyzing how you use our site.
              </p>

              <h2 className="text-xl font-semibold mt-6 mb-4">How We Use Cookies</h2>
              <p className="mb-4">Context-is-Everything uses cookies for the following purposes:</p>

              <h3 className="text-lg font-medium mt-4 mb-3">Essential Cookies</h3>
              <p className="mb-4">
                These cookies are necessary for the website to function properly. They enable core functionality such as security and accessibility.
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Session management for chat functionality</li>
                <li>Security and authentication</li>
                <li>Basic site functionality</li>
              </ul>

              <h3 className="text-lg font-medium mt-4 mb-3">Analytics Cookies</h3>
              <p className="mb-4">
                These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Website usage statistics</li>
                <li>Performance monitoring</li>
                <li>User journey analysis</li>
              </ul>

              <h3 className="text-lg font-medium mt-4 mb-3">Preference Cookies</h3>
              <p className="mb-4">
                These cookies remember your choices and preferences to provide a personalized experience.
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Theme preferences (dark/light mode)</li>
                <li>Language settings</li>
                <li>Personalization options</li>
              </ul>

              <h2 className="text-xl font-semibold mt-6 mb-4">Third-Party Cookies</h2>
              <p className="mb-4">
                Some cookies are placed by third-party services that appear on our pages. We use:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Google Analytics:</strong> For website analytics and performance monitoring</li>
                <li><strong>Hosting Services:</strong> For content delivery and site performance</li>
              </ul>

              <h2 className="text-xl font-semibold mt-6 mb-4">Managing Your Cookie Preferences</h2>
              <p className="mb-4">
                You can control and manage cookies in several ways:
              </p>

              <h3 className="text-lg font-medium mt-4 mb-3">Browser Settings</h3>
              <p className="mb-4">
                Most web browsers automatically accept cookies, but you can modify your browser settings to decline cookies if you prefer. Instructions for managing cookies in popular browsers:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies</li>
                <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies</li>
                <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
                <li><strong>Edge:</strong> Settings → Cookies and Site Permissions</li>
              </ul>

              <h3 className="text-lg font-medium mt-4 mb-3">Cookie Consent Banner</h3>
              <p className="mb-4">
                When you first visit our website, you'll see a cookie consent banner allowing you to accept or decline non-essential cookies.
              </p>

              <h2 className="text-xl font-semibold mt-6 mb-4">Cookie Retention</h2>
              <p className="mb-4">
                Different cookies have different lifespans:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
                <li><strong>Persistent Cookies:</strong> Remain for a set period (typically 1-24 months)</li>
                <li><strong>Analytics Cookies:</strong> Usually retained for 24 months</li>
              </ul>

              <h2 className="text-xl font-semibold mt-6 mb-4">Updates to This Policy</h2>
              <p className="mb-4">
                We may update this cookie policy from time to time to reflect changes in our practices or for legal reasons. We will notify you of any significant changes.
              </p>

              <h2 className="text-xl font-semibold mt-6 mb-4">Contact Us</h2>
              <p className="mb-4">
                If you have any questions about our use of cookies, please contact us through our website or at the contact information provided on our main page.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}