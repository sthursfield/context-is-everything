'use client'

import { useState, useEffect } from 'react'

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if user has already given consent
    const hasConsent = localStorage.getItem('cookie-consent')
    if (!hasConsent) {
      // Show banner after a short delay for better UX
      setTimeout(() => {
        setShowConsent(true)
        setTimeout(() => setIsVisible(true), 100) // Fade in effect
      }, 2000)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setIsVisible(false)
    setTimeout(() => setShowConsent(false), 300) // Wait for fade out
  }

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined')
    setIsVisible(false)
    setTimeout(() => setShowConsent(false), 300) // Wait for fade out
  }

  if (!showConsent) return null

  return (
    <div
      className={`fixed bottom-20 right-4 z-30 transition-all duration-300 max-w-sm ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-xs text-gray-700 leading-relaxed">
              🍪 We use cookies to enhance your experience.{' '}
              <a href="/cookies" className="text-blue-600 hover:text-blue-800 underline">
                Learn more
              </a>
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleDecline}
              className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded transition-colors duration-200"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="px-3 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors duration-200"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}